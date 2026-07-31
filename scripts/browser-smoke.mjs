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
      { label: "发布检查存在", expression: "document.body.innerText.includes('发布检查')" },
      { label: "Vue H5 画布节点已渲染", expression: "document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length >= 3" },
    ]);
    await assertEditorWorkflow(page);

    await assertPage(page, editorRuntimeUrl, [
      { label: "编辑器内置 runtime shell 已挂载", expression: "document.querySelector('.runtime-shell')" },
      { label: "编辑器内置 runtime 有 H5 页面", expression: "document.querySelector('[data-lowcode-page]')" },
      { label: "编辑器内置 runtime 标题存在", expression: "document.body.innerText.includes('夏日好物节')" },
    ]);

    await assertPage(page, h5RuntimeUrl, [
      { label: "React H5 runtime shell 已挂载", expression: "document.querySelector('.runtime-shell')" },
      { label: "React H5 phone frame 已挂载", expression: "document.querySelector('.phone-frame')" },
      { label: "React H5 页面容器已渲染", expression: "document.querySelector('[data-lowcode-page]')" },
      { label: "React H5 标识存在", expression: "document.body.innerText.includes('React H5')" },
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
