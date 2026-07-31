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

  log("检查物料收藏和最近使用");
  const nodeCountBeforeMaterialPreference = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.clickChildByText(".material-item", "图片 Banner", ".material-favorite-button");
  await page.waitForExpression("document.body.innerText.includes('已收藏物料：图片 Banner')");
  await page.waitForExpression("(() => { const raw = window.localStorage.getItem('meumall-lowcode-material-favorites'); return Boolean(raw && raw.includes('ImageBanner')); })()");
  await page.waitForExpression("Array.from(document.querySelectorAll('.material-quick-chip')).some((item) => item.innerText.includes('图片 Banner'))");
  await page.clickByText(".material-main-button", "图片 Banner");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeMaterialPreference)}`);
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

  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "保存草稿");
  await page.clickByText(".command-palette-item", "保存草稿");
  await page.waitForExpression("document.body.innerText.includes('已保存草稿') || document.body.innerText.includes('已保存')");
  log("通过：快捷命令可保存草稿");

  log("检查编辑器模板应用和模式切换操作流");
  await page.fillByPlaceholder("搜索模板", "商品");
  await page.waitForExpression("Array.from(document.querySelectorAll('.template-item strong')).some((item) => item.innerText.includes('商品专题页'))");
  await page.waitForExpression("!Array.from(document.querySelectorAll('.template-item strong')).some((item) => item.innerText.includes('大促活动页'))");
  log("通过：模板搜索可筛选商品专题页");

  await page.clickByText(".template-item", "商品专题页");
  await page.waitForExpression("document.body.innerText.includes('通勤好物专题')");
  await page.waitForExpression("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length >= 3");
  log("通过：商品专题页模板可应用到画布");

  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("document.body.innerText.includes('Schema')");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('product-topic-demo'))");
  log("通过：源码模式展示已应用模板 schema");

  await page.clickByText(".toolbar button", "预览");
  await page.waitForExpression("document.body.innerText.includes('H5 画布')");
  await page.waitForExpression("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length >= 3");
  log("通过：预览模式仍渲染 H5 节点");

  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.editor-shell')");
  await page.waitForExpression("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length >= 3");
  log("通过：可切回设计模式");
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
      { label: "发布检查存在", expression: "document.body.innerText.includes('发布检查')" },
      { label: "默认大促模板包含直播入口", expression: "document.body.innerText.includes('今晚 8 点直播专场')" },
      { label: "默认大促模板包含品牌专题", expression: "document.body.innerText.includes('夏日品牌馆')" },
      { label: "默认大促模板包含商品榜单", expression: "document.body.innerText.includes('夏日热卖榜')" },
      { label: "默认大促模板包含底部转化条", expression: "document.body.innerText.includes('限时福利') && document.body.innerText.includes('立即抢购')" },
      { label: "属性面板分组存在", expression: "document.body.innerText.includes('内容配置') && document.body.innerText.includes('样式配置')" },
      { label: "Vue H5 画布节点已渲染", expression: "document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length >= 3" },
    ]);
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
      { label: "编辑器内置 runtime 包含底部转化条", expression: "document.body.innerText.includes('限时福利') && document.body.innerText.includes('立即抢购')" },
    ]);

    await assertPage(page, h5RuntimeUrl, [
      { label: "React H5 runtime shell 已挂载", expression: "document.querySelector('.runtime-shell')" },
      { label: "React H5 phone frame 已挂载", expression: "document.querySelector('.phone-frame')" },
      { label: "React H5 页面容器已渲染", expression: "document.querySelector('[data-lowcode-page]')" },
      { label: "React H5 标识存在", expression: "document.body.innerText.includes('React H5')" },
      { label: "React H5 直播入口已渲染", expression: "document.body.innerText.includes('今晚 8 点直播专场')" },
      { label: "React H5 品牌专题已渲染", expression: "document.body.innerText.includes('夏日品牌馆')" },
      { label: "React H5 商品榜单已渲染", expression: "document.body.innerText.includes('夏日热卖榜')" },
      { label: "React H5 底部转化条已渲染", expression: "document.body.innerText.includes('限时福利') && document.body.innerText.includes('立即抢购')" },
      { label: "React H5 物料节点已渲染", expression: "document.querySelectorAll('[data-lowcode-node-id]').length >= 3" },
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
