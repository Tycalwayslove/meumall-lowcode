#!/usr/bin/env node

import { once } from "node:events";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { createServer } from "node:net";

const rootDir = path.resolve(new URL("..", import.meta.url).pathname);
const editorPort = Number(process.env.EDITOR_SMOKE_PORT ?? 5193);
const h5Port = Number(process.env.H5_SMOKE_PORT ?? 5194);
const chromeDebugPort = Number(process.env.CHROME_DEBUG_PORT ?? 9223);
const host = "127.0.0.1";
const timeoutMs = 30_000;

const editorUrl = `http://${host}:${editorPort}/`;
const editorRuntimeUrl = `http://${host}:${editorPort}/?runtime=1`;
const h5RuntimeUrl = `http://${host}:${h5Port}/`;
const h5RuntimePageIdUrl = `${h5RuntimeUrl}?pageId=summer-campaign-demo`;
const h5RuntimeReleaseIdUrl = `${h5RuntimeUrl}?releaseId=preview_demo`;
const h5RuntimeMissingPageUrl = `${h5RuntimeUrl}?pageId=missing-page`;
const h5RuntimeEmptyUrl = `${h5RuntimeUrl}?demo=empty`;
const h5RuntimeBrokenUrl = `${h5RuntimeUrl}?demo=broken`;

const children = [];
let chromeUserDataDir;

function log(message) {
  process.stdout.write(`[browser-smoke] ${message}\n`);
}

function fail(message) {
  throw new Error(message);
}

function findChromeBinary() {
  const candidates = [
    process.env.CHROME_BIN,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  const binary = candidates.find((candidate) => existsSync(candidate));
  if (!binary) {
    fail("未找到 Chrome。请安装 Chrome，或通过 CHROME_BIN 指定浏览器路径。");
  }
  return binary;
}

function spawnProcess(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: options.cwd ?? rootDir,
    env: { ...process.env, ...(options.env ?? {}) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  children.push(child);

  const logs = [];
  const collect = (chunk) => {
    const text = chunk.toString();
    logs.push(text);
    if (logs.length > 40) logs.shift();
  };
  child.stdout.on("data", collect);
  child.stderr.on("data", collect);
  child.on("exit", (code, signal) => {
    if (code && !child.killed) {
      process.stderr.write(logs.join(""));
      process.stderr.write(`[browser-smoke] 进程异常退出：${command} ${args.join(" ")} code=${code} signal=${signal ?? ""}\n`);
    }
  });

  return { child, logs };
}

async function waitForHttp(url, label) {
  const startedAt = Date.now();
  let lastError;
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = new Error(`${label} HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(250);
  }
  fail(`${label} 启动超时：${lastError?.message ?? "unknown error"}`);
}

async function assertPortFree(port, label) {
  const server = createServer();
  return new Promise((resolve, reject) => {
    server.once("error", () => {
      reject(new Error(`${label} 端口 ${port} 已被占用，请释放端口或通过环境变量调整。`));
    });
    server.listen(port, host, () => {
      server.close(() => resolve());
    });
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jsString(value) {
  return JSON.stringify(value);
}

async function startViteServer(name, cwd, port, env = {}) {
  log(`启动 ${name} dev server: ${port}`);
  const proc = spawnProcess("pnpm", ["exec", "vite", "--host", host, "--port", String(port), "--strictPort"], {
    cwd,
    env,
  });
  await waitForHttp(`http://${host}:${port}/`, name);
  return proc;
}

async function startChrome() {
  const chromeBinary = findChromeBinary();
  chromeUserDataDir = mkdtempSync(path.join(tmpdir(), "meumall-lowcode-smoke-"));
  log(`启动 Chrome headless: ${chromeBinary}`);
  spawnProcess(chromeBinary, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-extensions",
    "--remote-allow-origins=*",
    `--remote-debugging-address=${host}`,
    `--remote-debugging-port=${chromeDebugPort}`,
    `--user-data-dir=${chromeUserDataDir}`,
    "about:blank",
  ]);
  await waitForHttp(`http://${host}:${chromeDebugPort}/json/version`, "Chrome DevTools");
}

async function createPage() {
  const url = `http://${host}:${chromeDebugPort}/json/new?${encodeURIComponent("about:blank")}`;
  let response = await fetch(url, { method: "PUT" });
  if (!response.ok) response = await fetch(url);
  if (!response.ok) fail(`创建 Chrome tab 失败：HTTP ${response.status}`);
  const target = await response.json();
  if (!target.webSocketDebuggerUrl) fail("Chrome tab 缺少 webSocketDebuggerUrl");
  return new CdpPage(target.webSocketDebuggerUrl);
}

class CdpPage {
  constructor(webSocketUrl) {
    this.webSocketUrl = webSocketUrl;
    this.nextId = 1;
    this.pending = new Map();
    this.events = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.webSocketUrl);
    await once(this.ws, "open");
    this.ws.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data.toString());
      if (payload.id) {
        const pending = this.pending.get(payload.id);
        if (!pending) return;
        this.pending.delete(payload.id);
        if (payload.error) {
          pending.reject(new Error(payload.error.message));
        } else {
          pending.resolve(payload.result);
        }
        return;
      }
      const waiters = this.events.get(payload.method) ?? [];
      this.events.set(payload.method, []);
      waiters.forEach((resolve) => resolve(payload.params));
    });
    await this.send("Page.enable");
    await this.send("Runtime.enable");
  }

  send(method, params = {}) {
    const id = this.nextId++;
    const message = JSON.stringify({ id, method, params });
    const promise = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
    this.ws.send(message);
    return promise;
  }

  waitForEvent(method, ms = timeoutMs) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`等待 CDP 事件超时：${method}`)), ms);
      const waiters = this.events.get(method) ?? [];
      waiters.push((params) => {
        clearTimeout(timer);
        resolve(params);
      });
      this.events.set(method, waiters);
    });
  }

  async goto(url) {
    const loaded = this.waitForEvent("Page.loadEventFired");
    await this.send("Page.navigate", { url });
    await loaded;
    await this.waitForExpression("document.readyState === 'complete'");
  }

  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      fail(`浏览器表达式执行失败：${result.exceptionDetails.text}`);
    }
    return result.result?.value;
  }

  async waitForExpression(expression, ms = timeoutMs) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < ms) {
      const value = await this.evaluate(`Boolean(${expression})`);
      if (value) return;
      await delay(250);
    }
    fail(`等待页面条件超时：${expression}`);
  }

  async wait(ms) {
    await delay(ms);
  }

  async fillByPlaceholder(placeholder, value) {
    const expression = `(() => {
      const input = Array.from(document.querySelectorAll('input, textarea')).find((item) => item.getAttribute('placeholder') === ${jsString(placeholder)});
      if (!input) return false;
      input.focus();
      input.value = ${jsString(value)};
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`;
    const filled = await this.evaluate(expression);
    if (!filled) fail(`未找到 placeholder 为 ${placeholder} 的输入框`);
  }

  async fillFieldByLabel(label, value) {
    const expression = `(() => {
      const field = Array.from(document.querySelectorAll('label.field')).find((item) => (item.innerText || '').includes(${jsString(label)}));
      const input = field?.querySelector('input, textarea');
      if (!input) return false;
      input.focus();
      input.value = ${jsString(value)};
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`;
    const filled = await this.evaluate(expression);
    if (!filled) fail(`未找到标签为 ${label} 的字段`);
  }

  async selectFieldByLabel(label, value) {
    const expression = `(() => {
      const field = Array.from(document.querySelectorAll('label.field')).find((item) => (item.innerText || '').includes(${jsString(label)}));
      const select = field?.querySelector('select');
      if (!select) return false;
      select.value = ${jsString(value)};
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`;
    const selected = await this.evaluate(expression);
    if (!selected) fail(`未找到标签为 ${label} 的下拉字段`);
  }

  async setSwitchByText(text, checked) {
    const expression = `(() => {
      const field = Array.from(document.querySelectorAll('label.switch-field')).find((item) => (item.innerText || '').includes(${jsString(text)}));
      const input = field?.querySelector('input[type="checkbox"]');
      if (!input) return false;
      input.checked = ${checked ? "true" : "false"};
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`;
    const switched = await this.evaluate(expression);
    if (!switched) fail(`未找到文本为 ${text} 的开关`);
  }

  async clickByText(selector, text) {
    const expression = `(() => {
      const elements = Array.from(document.querySelectorAll(${jsString(selector)}));
      const target = elements.find((item) => (item.innerText || item.textContent || '').includes(${jsString(text)}));
      if (!target) return false;
      target.click();
      return true;
    })()`;
    const clicked = await this.evaluate(expression);
    if (!clicked) fail(`未找到包含文本 ${text} 的元素：${selector}`);
  }

  async clickChildByText(selector, text, childSelector) {
    const expression = `(() => {
      const elements = Array.from(document.querySelectorAll(${jsString(selector)}));
      const target = elements.find((item) => (item.innerText || item.textContent || '').includes(${jsString(text)}));
      const child = target?.querySelector(${jsString(childSelector)});
      if (!child) return false;
      child.click();
      return true;
    })()`;
    const clicked = await this.evaluate(expression);
    if (!clicked) fail(`未找到包含文本 ${text} 的子元素：${selector} -> ${childSelector}`);
  }

  async clickFirst(selector) {
    const expression = `(() => {
      const target = document.querySelector(${jsString(selector)});
      if (!target) return false;
      target.click();
      return true;
    })()`;
    const clicked = await this.evaluate(expression);
    if (!clicked) fail(`未找到元素：${selector}`);
  }

  async contextMenuFirst(selector) {
    const expression = `(() => {
      const target = document.querySelector(${jsString(selector)});
      if (!target) return false;
      const rect = target.getBoundingClientRect();
      target.dispatchEvent(new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + Math.min(24, rect.width / 2),
        clientY: rect.top + Math.min(18, rect.height / 2)
      }));
      return true;
    })()`;
    const opened = await this.evaluate(expression);
    if (!opened) fail(`未找到可右键元素：${selector}`);
  }

  async setFileInput(selector, fileName, content, mimeType = "application/json") {
    const expression = `(() => {
      const input = document.querySelector(${jsString(selector)});
      if (!input) return false;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File([${jsString(content)}], ${jsString(fileName)}, { type: ${jsString(mimeType)} }));
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`;
    const uploaded = await this.evaluate(expression);
    if (!uploaded) fail(`未找到文件输入：${selector}`);
  }

  async pressShortcut(key, options = {}) {
    const pressed = await this.evaluate(`(() => {
      const eventOptions = {
        key: ${jsString(key)},
        bubbles: true,
        cancelable: true,
        ctrlKey: ${Boolean(options.ctrlKey)},
        metaKey: ${Boolean(options.metaKey)},
        shiftKey: ${Boolean(options.shiftKey)},
        altKey: ${Boolean(options.altKey)}
      };
      window.dispatchEvent(new KeyboardEvent('keydown', eventOptions));
      return true;
    })()`);
    if (!pressed) fail(`快捷键触发失败：${key}`);
  }

  async close() {
    if (!this.ws) return;
    this.ws.close();
  }
}

async function assertPage(page, url, checks) {
  log(`检查页面：${url}`);
  await page.goto(url);
  for (const check of checks) {
    await page.waitForExpression(check.expression, check.timeoutMs ?? timeoutMs);
    log(`通过：${check.label}`);
  }
}

async function assertActivityRuleModal(page, label) {
  log(`检查活动规则弹窗：${label}`);
  await page.clickByText(".phone-frame button", "查看规则");
  await page.waitForExpression("document.querySelector('[role=\"dialog\"]') && document.body.innerText.includes('活动规则')");
  await page.clickFirst("[role='dialog'] button");
  await page.waitForExpression("!document.querySelector('[role=\"dialog\"]')");
  log(`通过：${label} 可打开并关闭活动规则弹窗`);
}

async function assertTabsBlockSwitch(page, label) {
  log(`检查标签内容切换：${label}`);
  await page.clickByText(".phone-frame [role='tab']", "参与方式");
  await page.waitForExpression("document.body.innerText.includes('先领取优惠券，再进入专题会场，最后选择商品或门店内容完成转化')");
  log(`通过：${label} 可切换到参与方式标签`);
}

async function assertEditorViewportSwitch(page) {
  log("检查 Vue3 编辑器 H5 画布视口预设");
  await page.waitForExpression("Array.from(document.querySelectorAll('.viewport-switch button')).some((item) => item.title === '紧凑屏 360px') && Array.from(document.querySelectorAll('.viewport-switch button')).some((item) => item.title === '标准屏 390px') && Array.from(document.querySelectorAll('.viewport-switch button')).some((item) => item.title === '大屏 430px')");
  await page.waitForExpression("getComputedStyle(document.querySelector('.phone-frame')).width === '390px'");
  await page.waitForExpression("document.querySelector('.phone-status')?.innerText.includes('标准屏 390')");
  await page.clickByText(".viewport-switch button", "360");
  await page.waitForExpression("getComputedStyle(document.querySelector('.phone-frame')).width === '360px'");
  await page.waitForExpression("document.querySelector('.phone-status')?.innerText.includes('紧凑屏 360')");
  await page.clickByText(".viewport-switch button", "430");
  await page.waitForExpression("getComputedStyle(document.querySelector('.phone-frame')).width === '430px'");
  await page.waitForExpression("document.querySelector('.phone-status')?.innerText.includes('大屏 430')");
  log("通过：Vue3 编辑器 H5 画布视口预设可切换并同步到手机框");
}

async function assertEditorWorkflow(page) {
  log("检查 H5 预览入口");
  await page.waitForExpression("document.body.innerText.includes('H5 预览入口')");
  await page.waitForExpression("document.body.innerText.includes('当前草稿 React H5')");
  await page.waitForExpression("document.body.innerText.includes('页面草稿/最新版本 H5')");
  await page.waitForExpression("Array.from(document.querySelectorAll('.preview-link-card input')).some((item) => item.value.includes('schema=') && item.value.includes('source=editor'))");
  await page.waitForExpression("Array.from(document.querySelectorAll('.preview-link-card input')).some((item) => item.value.includes('runtime=1') && item.value.includes('pageId='))");
  await page.clickChildByText(".preview-link-card", "当前草稿 React H5", ".preview-copy-button");
  await page.waitForExpression("document.body.innerText.includes('已复制预览链接：当前草稿 React H5') || document.body.innerText.includes('复制失败：请手动复制 当前草稿 React H5')");
  log("通过：H5 预览入口展示链接并提供复制反馈");

  log("检查交付分享清单");
  await page.waitForExpression("document.querySelector('.delivery-panel') && document.body.innerText.includes('交付清单')");
  await page.waitForExpression("Array.from(document.querySelectorAll('.delivery-summary-grid article')).some((item) => item.innerText.includes('Page ID'))");
  await page.waitForExpression("Array.from(document.querySelectorAll('.delivery-summary-grid article')).some((item) => item.innerText.includes('节点'))");
  await page.waitForExpression("Array.from(document.querySelectorAll('.delivery-summary-grid article')).some((item) => item.innerText.includes('数据源'))");
  await page.waitForExpression("Array.from(document.querySelectorAll('.delivery-summary-grid article')).some((item) => item.innerText.includes('动作'))");
  await page.waitForExpression("document.querySelector('.delivery-link-status') && document.body.innerText.includes('当前草稿 React H5') && document.body.innerText.includes('页面草稿/最新版本 H5')");
  await page.clickFirst(".delivery-copy-schema-button");
  await page.waitForExpression("document.body.innerText.includes('已复制页面 Schema：夏日好物节') || document.body.innerText.includes('复制失败：请从源码区手动复制 Schema')");
  await page.clickFirst(".delivery-export-schema-button");
  await page.waitForExpression("document.body.innerText.includes('已导出页面 Schema：夏日好物节')");
  log("通过：交付清单展示页面摘要、H5 入口状态，并可复制/导出 Schema");

  log("检查页面设置面板");
  await page.fillFieldByLabel("标题", "夏日好物节-页面设置");
  await page.fillFieldByLabel("描述", "页面设置 smoke 验证");
  await page.selectFieldByLabel("页面类型", "promotion");
  await page.fillFieldByLabel("H5 最大宽度", "390");
  await page.setSwitchByText("启用安全区", false);
  await page.selectFieldByLabel("环境", "pre");
  await page.evaluate(`(() => {
    const target = Array.from(document.querySelectorAll('.page-color-swatches button')).find((item) => item.getAttribute('title')?.includes('#eff6ff'));
    target?.click();
  })()`);
  await page.waitForExpression("document.body.innerText.includes('夏日好物节-页面设置')");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('页面设置 smoke 验证') && item.value.includes('\"pageType\": \"promotion\"') && item.value.includes('\"backgroundColor\": \"#eff6ff\"') && item.value.includes('\"safeArea\": false') && item.value.includes('\"maxWidth\": 390') && item.value.includes('\"environment\": \"pre\"'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  log("通过：页面设置可写入标题、描述、类型、布局和发布环境");

  log("检查物料收藏和最近使用");
  const nodeCountBeforeMaterialPreference = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.clickChildByText(".material-item", "图片 Banner", ".material-detail-button");
  await page.waitForExpression("document.querySelector('.material-detail-dialog') && document.body.innerText.includes('默认 H5 预览') && document.body.innerText.includes('ImageBanner') && document.body.innerText.includes('配置字段')");
  await page.waitForExpression("document.querySelector('.material-preview-phone [data-lowcode-node-id=\"preview_ImageBanner\"]')");
  await page.waitForExpression("Array.from(document.querySelectorAll('.material-prop-item')).some((item) => item.innerText.includes('图片') || item.innerText.includes('image'))");
  await page.clickByText(".material-detail-actions button", "添加到画布");
  await page.waitForExpression("!document.querySelector('.material-detail-dialog')");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeMaterialPreference)}`);
  log("通过：物料详情可展示默认 H5 预览、配置字段并一键添加");

  const nodeCountBeforeMaterialPreferenceAdd = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.clickChildByText(".material-item", "图片 Banner", ".material-favorite-button");
  await page.waitForExpression("document.body.innerText.includes('已收藏物料：图片 Banner')");
  await page.waitForExpression("(() => { const raw = window.localStorage.getItem('meumall-lowcode-material-favorites'); return Boolean(raw && raw.includes('ImageBanner')); })()");
  await page.waitForExpression("Array.from(document.querySelectorAll('.material-quick-chip')).some((item) => item.innerText.includes('图片 Banner'))");
  await page.clickByText(".material-main-button", "图片 Banner");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeMaterialPreferenceAdd)}`);
  await page.waitForExpression("(() => { const raw = window.localStorage.getItem('meumall-lowcode-material-recent'); return Boolean(raw && raw.includes('ImageBanner')); })()");
  await page.waitForExpression("document.body.innerText.includes('最近使用') && Array.from(document.querySelectorAll('.material-quick-chip')).some((item) => item.innerText.includes('图片 Banner'))");
  log("通过：物料可收藏、最近使用可更新并持久化");

  log("检查快捷命令面板");
  const nodeCountBeforeCommand = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.waitForExpression("document.querySelector('.command-palette')");
  await page.fillByPlaceholder("搜索命令、物料或模板", "品牌专题");
  await page.waitForExpression("document.body.innerText.includes('添加物料：品牌专题')");
  await page.clickByText(".command-palette-item", "添加物料：品牌专题");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeCommand)}`);
  log("通过：快捷命令可搜索并添加品牌专题物料");

  log("检查留资表单通用物料");
  const nodeCountBeforeLeadForm = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "留资表单");
  await page.waitForExpression("document.body.innerText.includes('添加物料：留资表单')");
  await page.clickByText(".command-palette-item", "添加物料：留资表单");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeLeadForm)}`);
  await page.waitForExpression("document.body.innerText.includes('活动预约表单') && document.body.innerText.includes('提交预约') && document.body.innerText.includes('预约人数')");
  log("通过：留资表单可从快捷命令添加并在 Vue H5 画布渲染");

  log("检查标签内容切换通用物料");
  const nodeCountBeforeTabsBlock = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "标签内容");
  await page.waitForExpression("document.body.innerText.includes('添加物料：标签内容切换')");
  await page.clickByText(".command-palette-item", "添加物料：标签内容切换");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeTabsBlock)}`);
  await page.waitForExpression("document.body.innerText.includes('活动信息') && document.body.innerText.includes('活动亮点') && document.body.innerText.includes('参与方式')");
  log("通过：标签内容切换可从快捷命令添加并在 Vue H5 画布渲染");

  log("检查列表项图片素材选择");
  const nodeCountBeforeImageCardGrid = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "图片卡片宫格");
  await page.waitForExpression("document.body.innerText.includes('添加物料：图片卡片宫格')");
  await page.clickByText(".command-palette-item", "添加物料：图片卡片宫格");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeImageCardGrid)}`);
  await page.waitForExpression("document.querySelector('.list-image-action')");
  await page.clickByText(".list-image-action", "选择图片");
  await page.waitForExpression("document.querySelector('.list-asset-panel') && document.body.innerText.includes('列表项素材库')");
  await page.clickByText(".list-asset-card", "活动女装横幅");
  await page.waitForExpression("document.body.innerText.includes('已应用图片素材：活动女装横幅')");
  await page.waitForExpression("Array.from(document.querySelectorAll('.list-image-field img')).some((item) => item.src.includes('1512436991641'))");
  log("通过：列表项图片字段可从素材库选择并写回缩略预览");

  log("检查发布问题可定位节点");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "秒杀商品组");
  await page.waitForExpression("document.body.innerText.includes('添加物料：秒杀商品组')");
  await page.clickByText(".command-palette-item", "添加物料：秒杀商品组");
  await page.waitForExpression("document.body.innerText.includes('秒杀商品组 没有静态商品，也没有绑定商品数据源')");
  await page.clickByText(".toolbar button", "预览");
  await page.waitForExpression("!document.querySelector('.phone-frame .mlc-runtime-node.is-selected')");
  await page.clickChildByText(".publish-check", "秒杀商品组 没有静态商品", ".publish-locate-button");
  await page.waitForExpression("document.body.innerText.includes('已定位：秒杀商品组')");
  await page.waitForExpression("(() => { const selected = document.querySelector('.outline-item.selected'); return Boolean(selected && selected.innerText.includes('秒杀商品组')); })()");
  await page.waitForExpression("(() => { const selected = document.querySelector('.phone-frame .mlc-runtime-node.is-selected'); return Boolean(selected && selected.innerText.includes('限时秒杀')); })()");
  log("通过：发布检查定位可切回设计态并选中问题节点");

  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "源码");
  await page.clickByText(".command-palette-item", "切换到源码模式");
  await page.waitForExpression("document.body.innerText.includes('Schema')");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "设计");
  await page.clickByText(".command-palette-item", "切换到设计模式");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  log("通过：快捷命令可切换编辑模式");

  log("检查节点右键菜单和键盘快捷键");
  const nodeCountBeforeNodeActions = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.contextMenuFirst(".outline-item");
  await page.waitForExpression("document.querySelector('.node-context-menu') && document.body.innerText.includes('创建副本')");
  await page.clickByText(".node-context-menu button", "创建副本");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeNodeActions)}`);
  const nodeCountAfterDuplicate = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("Backspace");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length === ${Number(nodeCountBeforeNodeActions)}`);
  await page.pressShortcut("z", { ctrlKey: true });
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length === ${Number(nodeCountAfterDuplicate)}`);
  await page.pressShortcut("z", { ctrlKey: true, shiftKey: true });
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length === ${Number(nodeCountBeforeNodeActions)}`);
  await page.clickFirst(".outline-item");
  await page.pressShortcut("c", { ctrlKey: true });
  await page.pressShortcut("v", { ctrlKey: true });
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeNodeActions)}`);
  await page.pressShortcut("z", { ctrlKey: true });
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length === ${Number(nodeCountBeforeNodeActions)}`);
  log("通过：节点菜单、删除、复制、粘贴、撤销和重做快捷键可用");

  await page.fillFieldByLabel("版本备注", "Smoke 设计验收版");
  await page.evaluate("document.activeElement?.blur()");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "保存草稿");
  await page.clickByText(".command-palette-item", "保存草稿");
  await page.waitForExpression("document.body.innerText.includes('已保存草稿') || document.body.innerText.includes('已保存')");
  await page.waitForExpression("Array.from(document.querySelectorAll('.release-card')).some((item) => item.innerText.includes('Smoke 设计验收版'))");
  log("通过：快捷命令可保存草稿");

  log("检查本地版本差异详情");
  await page.fillFieldByLabel("标题", "版本差异 Smoke 当前草稿");
  await page.fillByPlaceholder("筛选版本、类型或备注", "Smoke 设计验收版");
  await page.waitForExpression("Array.from(document.querySelectorAll('.release-card')).length === 1 && document.body.innerText.includes('Smoke 设计验收版')");
  await page.clickByText(".release-actions button", "对比");
  await page.waitForExpression("document.querySelector('.release-diff-panel') && document.body.innerText.includes('版本对比')");
  await page.waitForExpression("document.body.innerText.includes('当前草稿') && document.body.innerText.includes('所选版本')");
  await page.waitForExpression("document.body.innerText.includes('版本差异 Smoke 当前草稿') && document.body.innerText.includes('夏日好物节-页面设置')");
  await page.waitForExpression("document.body.innerText.includes('当前草稿 Schema 片段') && document.body.innerText.includes('所选版本 Schema 片段')");
  await page.waitForExpression("Array.from(document.querySelectorAll('.release-schema-preview pre')).some((item) => item.innerText.includes('nodeCount') && item.innerText.includes('pageId'))");
  await page.fillByPlaceholder("筛选版本、类型或备注", "不存在的版本关键词");
  await page.waitForExpression("document.body.innerText.includes('没有匹配的本地版本')");
  await page.fillByPlaceholder("筛选版本、类型或备注", "");
  const firstReleaseVersion = await page.evaluate("document.querySelector('.release-card span')?.innerText || ''");
  if (!firstReleaseVersion) fail("本地版本卡片缺少版本号");
  await page.fillByPlaceholder("筛选版本、类型或备注", firstReleaseVersion);
  await page.waitForExpression(`Array.from(document.querySelectorAll('.release-card')).some((item) => item.innerText.includes(${jsString(firstReleaseVersion)}))`);
  await page.fillByPlaceholder("筛选版本、类型或备注", "草稿");
  await page.waitForExpression("Array.from(document.querySelectorAll('.release-card')).some((item) => item.innerText.includes('草稿'))");
  await page.fillByPlaceholder("筛选版本、类型或备注", "");
  log("通过：本地版本对比展示字段差异和 schema 片段详情");

  log("检查本地自定义模板");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "保存为模板");
  await page.waitForExpression("document.body.innerText.includes('保存为本地模板')");
  await page.clickByText(".command-palette-item", "保存为本地模板");
  await page.waitForExpression("document.body.innerText.includes('已保存本地模板：版本差异 Smoke 当前草稿 模板')");
  await page.waitForExpression("(() => { const raw = window.localStorage.getItem('meumall-lowcode-custom-templates'); return Boolean(raw && raw.includes('版本差异 Smoke 当前草稿 模板')); })()");
  await page.waitForExpression("Array.from(document.querySelectorAll('.template-item')).some((item) => item.innerText.includes('版本差异 Smoke 当前草稿 模板') && item.innerText.includes('本地模板'))");
  await page.clickChildByText(".template-item", "版本差异 Smoke 当前草稿 模板", ".template-preview-button");
  await page.waitForExpression("document.body.innerText.includes('已打开模板 H5 预览：版本差异 Smoke 当前草稿 模板')");
  await page.evaluate("window.confirm = () => true");
  await page.clickByText(".template-main-button", "版本差异 Smoke 当前草稿 模板");
  await page.waitForExpression("document.body.innerText.includes('已应用模板：版本差异 Smoke 当前草稿 模板')");
  await page.waitForExpression("document.body.innerText.includes('版本差异 Smoke 当前草稿')");
  log("通过：当前页面可保存为本地模板、预览并应用回画布");

  log("检查模板卡片摘要");
  await page.fillByPlaceholder("搜索模板", "");
  await page.waitForExpression("Array.from(document.querySelectorAll('.template-item')).some((item) => item.innerText.includes('大促活动页') && item.innerText.includes('v1.0.0') && item.innerText.includes('大促') && item.innerText.includes('节点') && item.innerText.includes('数据源') && item.innerText.includes('动作'))");
  await page.waitForExpression("Array.from(document.querySelectorAll('.template-item')).some((item) => item.innerText.includes('大促活动页') && item.querySelector('.template-preview-card img') && item.querySelector('.template-preview-copy') && item.innerText.includes('夏日好物节'))");
  log("通过：模板卡片展示标签、版本、结构摘要和视觉缩略预览");

  log("检查编辑器模板应用和模式切换操作流");
  await page.fillByPlaceholder("搜索模板", "商品");
  await page.waitForExpression("Array.from(document.querySelectorAll('.template-item strong')).some((item) => item.innerText.includes('商品专题页'))");
  await page.waitForExpression("!Array.from(document.querySelectorAll('.template-item strong')).some((item) => item.innerText.includes('大促活动页'))");
  log("通过：模板搜索可筛选商品专题页");

  await page.clickChildByText(".template-item", "商品专题页", ".template-preview-button");
  await page.waitForExpression("document.body.innerText.includes('已打开模板 H5 预览：商品专题页')");
  await page.waitForExpression("document.body.innerText.includes('夏日好物节')");
  log("通过：商品专题页模板可先打开 H5 预览且不替换当前画布");

  await page.evaluate("window.confirm = () => true");
  await page.clickByText(".template-main-button", "商品专题页");
  await page.waitForExpression("document.body.innerText.includes('通勤好物专题')");
  await page.waitForExpression("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length >= 3");
  log("通过：商品专题页模板可应用到画布");

  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("document.body.innerText.includes('Schema')");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('product-topic-demo'))");
  log("通过：源码模式展示已应用模板 schema");

  log("检查 Schema 导入导出");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "导出");
  await page.waitForExpression("document.body.innerText.includes('导出页面 Schema')");
  await page.clickByText(".command-palette-item", "导出页面 Schema");
  await page.waitForExpression("document.body.innerText.includes('已导出页面 Schema：通勤好物专题')");
  const exportedSchemaText = await page.evaluate(`(() => {
    const textarea = Array.from(document.querySelectorAll('textarea')).find((item) => item.value.includes('product-topic-demo'));
    return textarea?.value ?? '';
  })()`);
  await page.setFileInput("[data-testid='schema-import-input']", "invalid-schema.json", "{ invalid json");
  await page.waitForExpression("document.body.innerText.includes('导入失败')");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('product-topic-demo'))");
  const importedSchemaText = JSON.stringify({
    ...JSON.parse(exportedSchemaText),
    pageId: "smoke-imported-page",
    title: "导入 Smoke 页面",
  }, null, 2);
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "导入");
  await page.waitForExpression("document.body.innerText.includes('导入页面 Schema')");
  await page.clickByText(".command-palette-item", "导入页面 Schema");
  await page.evaluate("window.confirm = () => true");
  await page.setFileInput("[data-testid='schema-import-input']", "valid-schema.json", importedSchemaText);
  await page.waitForExpression("document.body.innerText.includes('已导入页面 Schema：导入 Smoke 页面')");
  await page.waitForExpression("document.body.innerText.includes('导入 Smoke 页面')");
  await page.waitForExpression("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length >= 3");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('smoke-imported-page') && item.value.includes('导入 Smoke 页面'))");
  log("通过：Schema 可导出、非法导入不覆盖、合法导入可替换画布并继续编辑");

  await page.clickByText(".toolbar button", "预览");
  await page.waitForExpression("document.body.innerText.includes('H5 画布')");
  await page.waitForExpression("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length >= 3");
  log("通过：预览模式仍渲染 H5 节点");

  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.editor-shell')");
  await page.waitForExpression("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length >= 3");
  log("通过：可切回设计模式");

  log("检查新建页面向导");
  await page.clickByText(".toolbar button", "新建");
  await page.waitForExpression("document.querySelector('.page-start-dialog') && document.body.innerText.includes('空白 H5 页面') && document.body.innerText.includes('从模板开始')");
  await page.waitForExpression("Array.from(document.querySelectorAll('.page-start-template')).some((item) => item.innerText.includes('商品专题页') && item.innerText.includes('节点'))");
  await page.waitForExpression("Array.from(document.querySelectorAll('.page-start-template')).some((item) => item.innerText.includes('商品专题页') && item.querySelector('.page-start-template-preview img'))");
  await page.waitForExpression("Array.from(document.querySelectorAll('.page-start-template')).some((item) => item.innerText.includes('版本差异 Smoke 当前草稿 模板') && item.innerText.includes('本地模板'))");
  log("通过：新建页面向导可打开并展示空白页、模板起点、本地模板和模板缩略预览");

  await page.clickByText(".page-start-blank", "空白 H5 页面");
  await page.waitForExpression("document.body.innerText.includes('已创建空白 H5 页面')");
  await page.waitForExpression("document.body.innerText.includes('未命名 H5 页面')");
  await page.waitForExpression("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length === 0");
  log("通过：新建页面向导可创建空白 H5 页面");

  await page.waitForExpression("document.querySelector('.canvas-starter') && document.body.innerText.includes('选择一个基础物料开始搭建')");
  await page.clickByText(".canvas-starter-button", "活动头图");
  await page.waitForExpression("document.body.innerText.includes('已添加起步物料：活动头图')");
  await page.waitForExpression("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length === 1");
  await page.waitForExpression("!document.querySelector('.canvas-starter')");
  log("通过：空白画布可通过快捷物料开始搭建");

  await page.clickByText(".toolbar button", "保存草稿");
  await page.waitForExpression("document.body.innerText.includes('已保存草稿') || document.body.innerText.includes('已保存')");
  await page.clickByText(".toolbar button", "新建");
  await page.waitForExpression("document.querySelector('.page-start-dialog')");
  await page.clickByText(".page-start-template", "商品专题页");
  await page.waitForExpression("!document.querySelector('.page-start-dialog')");
  await page.waitForExpression("document.body.innerText.includes('通勤好物专题')");
  await page.waitForExpression("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length >= 3");
  log("通过：新建页面向导可从模板起点进入可编辑 H5 页面");
}

async function assertInspectorGroups(page) {
  log("检查属性面板分组折叠");
  await page.waitForExpression("document.body.innerText.includes('内容配置')");
  await page.waitForExpression("document.body.innerText.includes('样式配置')");
  await page.clickByText(".property-group-head", "样式配置");
  await page.waitForExpression("(() => { const group = Array.from(document.querySelectorAll('.property-group')).find((item) => item.innerText.includes('样式配置')); return Boolean(group && group.classList.contains('collapsed')); })()");
  await page.clickByText(".property-group-head", "样式配置");
  await page.waitForExpression("(() => { const group = Array.from(document.querySelectorAll('.property-group')).find((item) => item.innerText.includes('样式配置')); return Boolean(group && !group.classList.contains('collapsed')); })()");
  log("通过：属性面板分组可折叠展开");
}

async function assertOutlineNavigator(page) {
  log("检查结构树搜索、折叠和定位");
  await page.waitForExpression("document.querySelector('input[placeholder=\"搜索节点\"]')");
  await page.clickChildByText(".outline-item", "容器区块", ".outline-collapse-toggle");
  await page.waitForExpression("(() => { const item = Array.from(document.querySelectorAll('.outline-item')).find((node) => node.innerText.includes('容器区块')); return Boolean(item && item.classList.contains('is-collapsed')); })()");
  await page.fillByPlaceholder("搜索节点", "行动按钮");
  await page.waitForExpression("Array.from(document.querySelectorAll('.outline-item')).some((item) => item.innerText.includes('行动按钮'))");
  await page.waitForExpression("Array.from(document.querySelectorAll('.outline-item')).some((item) => item.innerText.includes('容器区块'))");
  await page.clickByText(".outline-item", "行动按钮");
  await page.waitForExpression("(() => { const selected = document.querySelector('.outline-item.selected'); return Boolean(selected && selected.innerText.includes('行动按钮')); })()");
  await page.fillByPlaceholder("搜索节点", "");
  await page.waitForExpression("document.querySelectorAll('.outline-item').length >= 3");
  await page.contextMenuFirst(".outline-item.selected");
  await page.clickByText(".node-context-menu button", "重命名节点");
  await page.fillByPlaceholder("节点名称", "精选专区 CTA");
  await page.clickFirst(".outline-rename button[title='确认重命名']");
  await page.waitForExpression("(() => { const selected = document.querySelector('.outline-item.selected'); return Boolean(selected && selected.innerText.includes('精选专区 CTA') && selected.innerText.includes('行动按钮')); })()");
  await page.waitForExpression("document.body.innerText.includes('已自动保存')");
  await page.waitForExpression("(() => { const raw = window.localStorage.getItem('meumall-lowcode-editor-playground'); return Boolean(raw && raw.includes('精选专区 CTA')); })()");
  await page.fillByPlaceholder("搜索节点", "精选专区");
  await page.waitForExpression("Array.from(document.querySelectorAll('.outline-item')).some((item) => item.innerText.includes('精选专区 CTA'))");
  await page.fillByPlaceholder("搜索节点", "");
  log("通过：结构树可搜索命中折叠容器内节点、定位选中并重命名");
}

async function cleanup() {
  for (const child of [...children].reverse()) {
    if (!child.killed) child.kill("SIGTERM");
  }
  await delay(300);
  for (const child of [...children].reverse()) {
    if (!child.killed) child.kill("SIGKILL");
  }
  if (chromeUserDataDir) {
    rmSync(chromeUserDataDir, { recursive: true, force: true });
  }
}

async function main() {
  await assertPortFree(editorPort, "editor playground");
  await assertPortFree(h5Port, "H5 runtime playground");
  await assertPortFree(chromeDebugPort, "Chrome DevTools");

  await startViteServer("editor playground", path.join(rootDir, "apps/editor-playground"), editorPort, {
    VITE_REACT_H5_RUNTIME_URL: h5RuntimeUrl,
  });
  await startViteServer("H5 runtime playground", path.join(rootDir, "apps/h5-runtime-playground"), h5Port);
  await startChrome();

  const page = await createPage();
  await page.connect();
  try {
    await assertPage(page, editorUrl, [
      { label: "Vue3 编辑器 shell 已挂载", expression: "document.querySelector('.editor-shell')" },
      { label: "编辑器品牌文案存在", expression: "document.body.innerText.includes('MeuMall Lowcode')" },
      { label: "模板入口存在", expression: "document.body.innerText.includes('模板')" },
      { label: "物料入口存在", expression: "document.body.innerText.includes('物料')" },
      { label: "直播入口物料存在", expression: "document.body.innerText.includes('直播入口')" },
      { label: "品牌专题物料存在", expression: "document.body.innerText.includes('品牌专题')" },
      { label: "商品榜单物料存在", expression: "document.body.innerText.includes('商品榜单')" },
      { label: "底部转化条物料存在", expression: "document.body.innerText.includes('底部转化条')" },
      { label: "区块标题物料存在", expression: "document.body.innerText.includes('区块标题')" },
      { label: "图片卡片宫格物料存在", expression: "document.body.innerText.includes('图片卡片宫格')" },
      { label: "标签内容切换物料存在", expression: "document.body.innerText.includes('标签内容切换')" },
      { label: "留资表单物料存在", expression: "document.body.innerText.includes('留资表单')" },
      { label: "物料卡片摘要存在", expression: "document.body.innerText.includes('个配置 /') && document.body.innerText.includes('个事件 /') && document.body.innerText.includes('个数据槽')" },
      { label: "发布检查存在", expression: "document.body.innerText.includes('发布检查')" },
      { label: "默认大促模板包含直播入口", expression: "document.body.innerText.includes('今晚 8 点直播专场')" },
      { label: "默认大促模板包含品牌专题", expression: "document.body.innerText.includes('夏日品牌馆')" },
      { label: "默认大促模板包含商品榜单", expression: "document.body.innerText.includes('夏日热卖榜')" },
      { label: "默认大促模板包含区块标题", expression: "document.body.innerText.includes('今日主推') && document.body.innerText.includes('先领券，再逛精选好物')" },
      { label: "默认大促模板包含图片卡片宫格", expression: "document.body.innerText.includes('专题会场') && document.body.innerText.includes('女装会场')" },
      { label: "默认大促模板包含标签内容切换", expression: "document.body.innerText.includes('活动信息') && document.body.innerText.includes('活动亮点')" },
      { label: "默认大促模板包含倒计时", expression: "document.body.innerText.includes('大促限时抢') && document.body.innerText.includes('距离本轮活动结束') && document.body.innerText.includes('08') && document.body.innerText.includes('30')" },
      { label: "默认大促模板包含间距块", expression: "document.querySelector('.phone-frame .mlc-spacer-block')" },
      { label: "默认大促模板包含底部转化条", expression: "document.body.innerText.includes('限时福利') && document.body.innerText.includes('立即抢购')" },
      { label: "属性面板分组存在", expression: "document.body.innerText.includes('内容配置') && document.body.innerText.includes('样式配置')" },
      { label: "Vue H5 画布节点已渲染", expression: "document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length >= 3" },
    ]);
    await assertEditorViewportSwitch(page);
    await assertActivityRuleModal(page, "Vue3 编辑器内置画布");
    await assertTabsBlockSwitch(page, "Vue3 编辑器内置画布");
    await assertInspectorGroups(page);
    await assertOutlineNavigator(page);
    await assertEditorWorkflow(page);

    await assertPage(page, editorRuntimeUrl, [
      { label: "编辑器内置 runtime shell 已挂载", expression: "document.querySelector('.runtime-shell')" },
      { label: "编辑器内置 runtime 有 H5 页面", expression: "document.querySelector('[data-lowcode-page]')" },
      { label: "编辑器内置 runtime 标题存在", expression: "document.body.innerText.includes('夏日好物节')" },
      { label: "编辑器内置 runtime 包含直播入口", expression: "document.body.innerText.includes('今晚 8 点直播专场')" },
      { label: "编辑器内置 runtime 包含品牌专题", expression: "document.body.innerText.includes('夏日品牌馆')" },
      { label: "编辑器内置 runtime 包含商品榜单", expression: "document.body.innerText.includes('夏日热卖榜')" },
      { label: "编辑器内置 runtime 包含区块标题", expression: "document.body.innerText.includes('今日主推') && document.body.innerText.includes('先领券，再逛精选好物')" },
      { label: "编辑器内置 runtime 包含图片卡片宫格", expression: "document.body.innerText.includes('专题会场') && document.body.innerText.includes('女装会场')" },
      { label: "编辑器内置 runtime 包含标签内容切换", expression: "document.body.innerText.includes('活动信息') && document.body.innerText.includes('活动亮点')" },
      { label: "编辑器内置 runtime 包含倒计时", expression: "document.body.innerText.includes('大促限时抢') && document.body.innerText.includes('距离本轮活动结束') && document.body.innerText.includes('08') && document.body.innerText.includes('30')" },
      { label: "编辑器内置 runtime 包含间距块", expression: "document.querySelector('.mlc-spacer-block')" },
      { label: "编辑器内置 runtime 包含底部转化条", expression: "document.body.innerText.includes('限时福利') && document.body.innerText.includes('立即抢购')" },
    ]);

    await assertPage(page, h5RuntimeUrl, [
      { label: "React H5 runtime shell 已挂载", expression: "document.querySelector('.runtime-shell')" },
      { label: "React H5 phone frame 已挂载", expression: "document.querySelector('.phone-frame')" },
      { label: "React H5 页面容器已渲染", expression: "document.querySelector('[data-lowcode-page]')" },
      { label: "React H5 标识存在", expression: "document.body.innerText.includes('React H5')" },
      { label: "React H5 诊断面板展示请求入口", expression: "document.body.innerText.includes('请求入口') && document.body.innerText.includes('sample fallback')" },
      { label: "React H5 诊断面板展示实际来源", expression: "document.body.innerText.includes('实际来源') && document.body.innerText.includes('fallback schema')" },
      { label: "React H5 诊断面板展示本地入口", expression: "document.body.innerText.includes('本地入口') && document.body.innerText.includes('Empty')" },
      { label: "React H5 直播入口已渲染", expression: "document.body.innerText.includes('今晚 8 点直播专场')" },
      { label: "React H5 品牌专题已渲染", expression: "document.body.innerText.includes('夏日品牌馆')" },
      { label: "React H5 商品榜单已渲染", expression: "document.body.innerText.includes('夏日热卖榜')" },
      { label: "React H5 区块标题已渲染", expression: "document.body.innerText.includes('今日主推') && document.body.innerText.includes('先领券，再逛精选好物')" },
      { label: "React H5 图片卡片宫格已渲染", expression: "document.body.innerText.includes('专题会场') && document.body.innerText.includes('女装会场')" },
      { label: "React H5 标签内容切换已渲染", expression: "document.body.innerText.includes('活动信息') && document.body.innerText.includes('活动亮点')" },
      { label: "React H5 倒计时已渲染", expression: "document.body.innerText.includes('大促限时抢') && document.body.innerText.includes('距离本轮活动结束') && document.body.innerText.includes('08') && document.body.innerText.includes('30')" },
      { label: "React H5 留资表单已渲染", expression: "document.body.innerText.includes('预约专属搭配顾问') && document.body.innerText.includes('提交预约')" },
      { label: "React H5 间距块已渲染", expression: "document.querySelector('.phone-frame .mlc-spacer-block')" },
      { label: "React H5 底部转化条已渲染", expression: "document.body.innerText.includes('限时福利') && document.body.innerText.includes('立即抢购')" },
      { label: "React H5 物料节点已渲染", expression: "document.querySelectorAll('[data-lowcode-node-id]').length >= 3" },
    ]);
    await assertActivityRuleModal(page, "React H5 runtime");
    await assertTabsBlockSwitch(page, "React H5 runtime");

    await assertPage(page, h5RuntimePageIdUrl, [
      { label: "React H5 pageId 入口可打开", expression: "document.querySelector('.runtime-shell') && document.body.innerText.includes('pageId')" },
      { label: "React H5 pageId 命中 published schema", expression: "document.body.innerText.includes('published schema') && document.body.innerText.includes('summer-campaign-demo')" },
      { label: "React H5 pageId 页面非空", expression: "document.querySelector('[data-lowcode-page]') && document.body.innerText.includes('夏日好物节')" },
    ]);

    await assertPage(page, h5RuntimeReleaseIdUrl, [
      { label: "React H5 releaseId 入口可打开", expression: "document.querySelector('.runtime-shell') && document.body.innerText.includes('releaseId')" },
      { label: "React H5 releaseId 命中 release schema", expression: "document.body.innerText.includes('release schema') && document.body.innerText.includes('preview_demo')" },
      { label: "React H5 releaseId 渲染预览版本", expression: "document.body.innerText.includes('夏日好物节预览') && document.body.innerText.includes('preview-20260801-demo')" },
    ]);

    await assertPage(page, h5RuntimeMissingPageUrl, [
      { label: "React H5 missing pageId 入口可打开", expression: "document.querySelector('.runtime-shell') && document.body.innerText.includes('missing-page')" },
      { label: "React H5 missing pageId 展示 fallback 原因", expression: "document.body.innerText.includes('Lowcode published schema not found: missing-page') && document.body.innerText.includes('已启用 fallback')" },
      { label: "React H5 missing pageId fallback 后页面仍非空", expression: "document.querySelector('[data-lowcode-page]') && document.body.innerText.includes('夏日好物节')" },
    ]);

    await assertPage(page, h5RuntimeEmptyUrl, [
      { label: "React H5 empty demo shell 已挂载", expression: "document.querySelector('.runtime-shell') && document.body.innerText.includes('empty demo')" },
      { label: "React H5 empty demo 展示安全空态", expression: "document.body.innerText.includes('空页面演示') && document.body.innerText.includes('页面暂无内容，H5 runtime 已进入安全空态')" },
      { label: "React H5 empty demo 节点数为 0", expression: "document.body.innerText.includes('节点数') && document.body.innerText.includes('0')" },
    ]);

    await assertPage(page, h5RuntimeBrokenUrl, [
      { label: "React H5 broken demo shell 已挂载", expression: "document.querySelector('.runtime-shell') && document.body.innerText.includes('broken demo')" },
      { label: "React H5 broken demo 页面非空", expression: "document.querySelector('[data-lowcode-page]') && document.body.innerText.includes('异常兜底演示')" },
      { label: "React H5 broken demo 展示未知物料兜底", expression: "document.querySelector('[data-lowcode-missing=\"MissingMaterialBlock\"]') && document.body.innerText.includes('缺少物料：MissingMaterialBlock')" },
      { label: "React H5 broken demo 展示异常物料兜底", expression: "document.querySelector('[data-lowcode-error=\"node_broken_material\"]') && document.body.innerText.includes('组件渲染失败：BrokenBlock')" },
      { label: "React H5 broken demo 记录渲染错误", expression: "document.body.innerText.includes('node_broken_material: BrokenBlock render failed')" },
    ]);
  } finally {
    await page.close();
  }

  log("browser smoke check 通过");
}

main()
  .catch((error) => {
    process.stderr.write(`[browser-smoke] 失败：${error.stack ?? error.message}\n`);
    process.exitCode = 1;
  })
  .finally(cleanup);
