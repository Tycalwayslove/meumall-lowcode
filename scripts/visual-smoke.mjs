#!/usr/bin/env node

import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:net";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const editorPort = Number(process.env.EDITOR_VISUAL_PORT ?? 5293);
const h5Port = Number(process.env.H5_VISUAL_PORT ?? 5294);
const chromeDebugPort = Number(process.env.CHROME_VISUAL_DEBUG_PORT ?? 9323);
const host = "127.0.0.1";
const timeoutMs = 30_000;

const editorUrl = `http://${host}:${editorPort}/`;
const h5RuntimeUrl = `http://${host}:${h5Port}/`;
const h5RuntimePageIdUrl = `${h5RuntimeUrl}?pageId=summer-campaign-demo`;
const h5RuntimeReleaseIdUrl = `${h5RuntimeUrl}?releaseId=preview_demo`;
const reportDir = path.join(rootDir, ".ai/test-reports/latest-visual");
const screenshotDir = path.join(reportDir, "screenshots");

const children = [];
let chromeUserDataDir;

function log(message) {
  process.stdout.write(`[visual-smoke] ${message}\n`);
}

function fail(message) {
  throw new Error(message);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jsString(value) {
  return JSON.stringify(value);
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
      process.stderr.write(`[visual-smoke] 进程异常退出：${command} ${args.join(" ")} code=${code} signal=${signal ?? ""}\n`);
    }
  });

  return { child, logs };
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

async function startViteServer(name, cwd, port) {
  log(`启动 ${name} dev server: ${port}`);
  const proc = spawnProcess("pnpm", ["exec", "vite", "--host", host, "--port", String(port), "--strictPort"], {
    cwd,
  });
  await waitForHttp(`http://${host}:${port}/`, name);
  return proc;
}

async function startChrome() {
  const chromeBinary = findChromeBinary();
  chromeUserDataDir = mkdtempSync(path.join(tmpdir(), "meumall-lowcode-visual-"));
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

  async setViewport(width, height, deviceScaleFactor = 1) {
    await this.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor,
      mobile: false,
    });
  }

  async captureScreenshot(filePath) {
    const result = await this.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      fromSurface: true,
    });
    writeFileSync(filePath, Buffer.from(result.data, "base64"));
  }

  async close() {
    if (!this.ws) return;
    this.ws.close();
  }
}

async function captureScene(page, scene) {
  log(`截图：${scene.title}`);
  await page.setViewport(scene.width, scene.height);
  await page.goto(scene.url);
  await page.waitForExpression(scene.waitFor);
  await delay(scene.settleMs ?? 500);
  const fileName = `${scene.id}.png`;
  const filePath = path.join(screenshotDir, fileName);
  await page.captureScreenshot(filePath);
  log(`已生成：${path.relative(rootDir, filePath)}`);
  return { ...scene, fileName };
}

function writeReport(results) {
  const rows = results
    .map((result) => `| ${result.title} | \`${result.url}\` | [${result.fileName}](screenshots/${result.fileName}) |`)
    .join("\n");
  const report = `# MeuMall Lowcode Visual Smoke Report

Generated at: ${new Date().toISOString()}

Command:

\`\`\`bash
pnpm smoke:visual
\`\`\`

## Screenshots

| Scene | URL | Screenshot |
| --- | --- | --- |
${rows}

## Notes

- This report is generated locally and is intentionally not committed.
- It only verifies that the main editor and H5 runtime entries are visually renderable in the current local Chrome environment.
- DOM-level interaction coverage remains in \`pnpm smoke:browser\`.
`;
  const reportPath = path.join(reportDir, "index.md");
  writeFileSync(reportPath, report);
  log(`已生成报告：${path.relative(rootDir, reportPath)}`);
}

async function cleanup() {
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
  await delay(500);
  for (const child of children) {
    if (!child.killed) child.kill("SIGKILL");
  }
  if (chromeUserDataDir) {
    rmSync(chromeUserDataDir, { recursive: true, force: true });
  }
}

async function main() {
  await Promise.all([
    assertPortFree(editorPort, "editor visual smoke"),
    assertPortFree(h5Port, "H5 visual smoke"),
    assertPortFree(chromeDebugPort, "Chrome visual smoke"),
  ]);

  rmSync(reportDir, { recursive: true, force: true });
  mkdirSync(screenshotDir, { recursive: true });

  await startViteServer("editor playground", path.join(rootDir, "apps/editor-playground"), editorPort);
  await startViteServer("H5 runtime playground", path.join(rootDir, "apps/h5-runtime-playground"), h5Port);
  await startChrome();

  const page = await createPage();
  await page.connect();
  try {
    const results = [];
    results.push(
      await captureScene(page, {
        id: "editor-playground",
        title: "Vue3 编辑器 playground",
        url: editorUrl,
        width: 1440,
        height: 1100,
        waitFor: "document.querySelector('.editor-shell') && document.body.innerText.includes('MeuMall Lowcode') && document.querySelector('.phone-frame [data-lowcode-page]')",
      }),
    );
    results.push(
      await captureScene(page, {
        id: "h5-runtime-published",
        title: "React H5 runtime published pageId",
        url: h5RuntimePageIdUrl,
        width: 900,
        height: 1100,
        waitFor:
          "document.querySelector('[data-lowcode-page=\"summer-campaign-demo\"]') && document.body.innerText.includes('published schema') && document.body.innerText.includes('React H5 Runtime')",
      }),
    );
    results.push(
      await captureScene(page, {
        id: "h5-runtime-preview",
        title: "React H5 runtime preview releaseId",
        url: h5RuntimeReleaseIdUrl,
        width: 900,
        height: 1100,
        waitFor:
          "document.querySelector('[data-lowcode-page=\"summer-campaign-demo\"]') && document.body.innerText.includes('release schema') && document.body.innerText.includes('夏日好物节预览')",
      }),
    );
    writeReport(results);
  } finally {
    await page.close();
  }
}

main()
  .then(async () => {
    log("可视化 smoke check 通过。");
    await cleanup();
  })
  .catch(async (error) => {
    await cleanup();
    process.stderr.write(`[visual-smoke] 失败：${error.message}\n`);
    process.exitCode = 1;
  });
