#!/usr/bin/env node

import { once } from "node:events";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { createServer as createHttpServer } from "node:http";
import { createServer as createNetServer } from "node:net";

const rootDir = path.resolve(new URL("..", import.meta.url).pathname);
const editorPort = Number(process.env.EDITOR_SMOKE_PORT ?? 5193);
const editorHttpPort = Number(process.env.EDITOR_HTTP_SMOKE_PORT ?? 5197);
const h5Port = Number(process.env.H5_SMOKE_PORT ?? 5194);
const h5HttpPort = Number(process.env.H5_HTTP_SMOKE_PORT ?? 5195);
const configPlatformPort = Number(process.env.CONFIG_PLATFORM_SMOKE_PORT ?? 5196);
const chromeDebugPort = Number(process.env.CHROME_DEBUG_PORT ?? 9223);
const host = "127.0.0.1";
const timeoutMs = 30_000;

const editorUrl = `http://${host}:${editorPort}/`;
const editorHttpUrl = `http://${host}:${editorHttpPort}/`;
const editorRuntimeUrl = `http://${host}:${editorPort}/?runtime=1`;
const editorWorkflowDemoUrl = `${editorUrl}?collaboration=locked-other&approval=pending`;
const editorApprovalActionsUrl = `${editorUrl}?collaboration=locked-me&approval=draft`;
const h5RuntimeUrl = `http://${host}:${h5Port}/`;
const h5RuntimeHttpUrl = `http://${host}:${h5HttpPort}/?pageId=smoke-http-page`;
const configPlatformSmokeUrl = `http://${host}:${configPlatformPort}`;
const h5RuntimePageIdUrl = `${h5RuntimeUrl}?pageId=summer-campaign-demo`;
const h5RuntimePreviewTokenUrl = `${h5RuntimeUrl}?previewToken=preview_demo_token`;
const h5RuntimeReleaseIdUrl = `${h5RuntimeUrl}?releaseId=preview_demo`;
const h5RuntimeMissingPageUrl = `${h5RuntimeUrl}?pageId=missing-page`;
const h5RuntimeEmptyUrl = `${h5RuntimeUrl}?demo=empty`;
const h5RuntimeBrokenUrl = `${h5RuntimeUrl}?demo=broken`;

const children = [];
const servers = [];
const configPlatformRequests = [];
const editorHttpReleases = [];
let editorHttpDraftSnapshot;
let chromeUserDataDir;

const smokeHttpProducts = [
  {
    id: "http_sku_001",
    title: "HTTP 数据源手提包",
    priceText: "¥188",
    originPriceText: "¥299",
    desc: "来自 BFF mock",
    imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "http_sku_002",
    title: "HTTP 数据源凉鞋",
    priceText: "¥129",
    originPriceText: "¥199",
    desc: "runtime 注入",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80",
  },
];

const smokeHttpPageSchema = {
  schemaVersion: "1.0.0",
  pageId: "smoke-http-page",
  pageVersion: "prod-smoke-http",
  title: "HTTP 配置平台页面",
  status: "published",
  pageType: "activity",
  targetPlatforms: ["h5"],
  layout: { safeArea: true },
  nodes: [
    {
      id: "smoke_http_title",
      componentName: "SectionTitle",
      materialVersion: "1.0.0",
      props: {
        title: "HTTP 配置平台页面",
        subtitle: "来自 Java HTTP client mock",
      },
    },
    {
      id: "smoke_http_action_button",
      componentName: "BasicButton",
      materialVersion: "0.1.0",
      props: {
        text: "HTTP 动作按钮",
        variant: "solid",
        size: "md",
        block: true,
        backgroundColor: "#0f766e",
        textColor: "#ffffff",
        borderColor: "#0f766e",
        wrapperBackgroundColor: "#f3f4f6",
        radius: 8,
        paddingY: 10,
      },
      events: {
        onClick: { actionId: "smoke_http_tracking_click", params: { nodeId: "smoke_http_action_button" } },
      },
    },
    {
      id: "smoke_http_products",
      componentName: "ProductList",
      materialVersion: "0.1.0",
      props: {
        items: [],
      },
      dataBinding: {
        items: "products",
      },
    },
  ],
  actions: [
    {
      id: "smoke_http_tracking_click",
      type: "tracking.click",
      params: {
        eventName: "smoke_http_action_click",
      },
    },
  ],
  dataSources: [
    {
      id: "smoke_http_products_ds",
      type: "product.byIds",
      bindTo: "products",
      params: {
        ids: ["http_sku_001", "http_sku_002"],
        limit: 2,
      },
    },
  ],
  publishMeta: {
    environment: "test",
    publishedAt: "2026-08-01T00:00:00.000Z",
    operator: "browser-smoke",
  },
};

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function createSmokeWorkflow(pageId, overrides = {}) {
  return {
    pageId,
    lock: {
      status: "unlocked",
      ...(overrides.lock ?? {}),
    },
    approval: {
      status: "none",
      ...(overrides.approval ?? {}),
    },
    updatedAt: new Date().toISOString(),
  };
}

function createSmokeEditorRelease(kind, body) {
  const schema = cloneJson(body.schema);
  const now = new Date().toISOString();
  schema.status = body.pageStatus ?? kind;
  schema.pageVersion = `${kind}-smoke-${editorHttpReleases.length + 1}`;
  schema.publishMeta = {
    ...schema.publishMeta,
    publishedAt: kind === "published" ? now : schema.publishMeta?.publishedAt,
    operator: body.operator?.name ?? "browser-smoke",
  };
  return {
    id: `${kind}_smoke_${editorHttpReleases.length + 1}`,
    kind,
    pageId: schema.pageId,
    pageVersion: schema.pageVersion,
    title: schema.title,
    note: body.note,
    previewToken: kind === "preview" ? `pt_${kind}_smoke_${editorHttpReleases.length + 1}` : undefined,
    createdAt: now,
    schema,
  };
}

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
  const server = createNetServer();
  return new Promise((resolve, reject) => {
    server.once("error", () => {
      reject(new Error(`${label} 端口 ${port} 已被占用，请释放端口或通过环境变量调整。`));
    });
    server.listen(port, host, () => {
      server.close(() => resolve());
    });
  });
}

function writeJsonResponse(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,PUT,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
    "content-type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

async function readRequestJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function startConfigPlatformSmokeServer(port) {
  log(`启动 config platform HTTP mock: ${port}`);
  const server = createHttpServer(async (request, response) => {
    if (request.method === "OPTIONS") {
      writeJsonResponse(response, 204, null);
      return;
    }
    const body = request.method === "GET" ? undefined : await readRequestJson(request);
    configPlatformRequests.push({
      method: request.method,
      url: request.url,
      authorization: request.headers.authorization,
      body,
    });
    if (request.method === "GET" && request.url?.startsWith("/api/lowcode/data/products/by-ids")) {
      const url = new URL(request.url, configPlatformSmokeUrl);
      const ids = url.searchParams.getAll("ids");
      const limit = Number(url.searchParams.get("limit") ?? smokeHttpProducts.length);
      const products = smokeHttpProducts
        .filter((product) => !ids.length || ids.includes(product.id))
        .slice(0, Number.isFinite(limit) ? limit : smokeHttpProducts.length);
      writeJsonResponse(response, 200, { data: { items: products } });
      return;
    }
    if (request.method === "POST" && request.url === "/api/lowcode/actions/tracking-click") {
      writeJsonResponse(response, 200, { success: true, receivedAt: new Date().toISOString() });
      return;
    }
    if (request.method === "GET" && request.url === "/api/lowcode/pages/smoke-http-page/published") {
      writeJsonResponse(response, 200, smokeHttpPageSchema);
      return;
    }
    if (request.method === "GET" && request.url?.startsWith("/api/lowcode/pages/releases")) {
      const url = new URL(request.url, configPlatformSmokeUrl);
      const pageId = url.searchParams.get("pageId");
      const releases = pageId
        ? editorHttpReleases.filter((release) => release.pageId === pageId)
        : editorHttpReleases;
      writeJsonResponse(response, 200, releases);
      return;
    }
    if (request.method === "GET" && request.url?.startsWith("/api/lowcode/pages/previews/")) {
      const previewToken = decodeURIComponent(request.url.split("/").pop() ?? "");
      writeJsonResponse(response, 200, editorHttpReleases.find((release) => release.previewToken === previewToken) ?? null);
      return;
    }
    if (request.method === "GET" && request.url?.startsWith("/api/lowcode/pages/releases/")) {
      const releaseId = decodeURIComponent(request.url.split("/").pop() ?? "");
      writeJsonResponse(response, 200, editorHttpReleases.find((release) => release.id === releaseId) ?? null);
      return;
    }
    if (request.method === "GET" && request.url?.endsWith("/workflow")) {
      const pageId = decodeURIComponent(request.url.split("/").at(-2) ?? "unknown-page");
      writeJsonResponse(response, 200, createSmokeWorkflow(pageId));
      return;
    }
    if (request.method === "GET" && request.url?.endsWith("/editor-draft-snapshot")) {
      writeJsonResponse(response, 200, editorHttpDraftSnapshot ?? null);
      return;
    }
    if (request.method === "PUT" && request.url?.endsWith("/editor-draft-snapshot")) {
      const pageId = decodeURIComponent(request.url.split("/").at(-2) ?? body?.pageId ?? "unknown-page");
      editorHttpDraftSnapshot = {
        pageId,
        schema: body.schema,
        updatedAt: new Date().toISOString(),
        operator: body.operator,
      };
      writeJsonResponse(response, 200, editorHttpDraftSnapshot);
      return;
    }
    if (request.method === "POST" && request.url === "/api/lowcode/pages/drafts") {
      const release = createSmokeEditorRelease("draft", body);
      editorHttpReleases.unshift(release);
      writeJsonResponse(response, 200, release);
      return;
    }
    if (request.method === "POST" && request.url === "/api/lowcode/pages/previews") {
      const release = createSmokeEditorRelease("preview", body);
      editorHttpReleases.unshift(release);
      writeJsonResponse(response, 200, release);
      return;
    }
    if (request.method === "POST" && request.url === "/api/lowcode/pages/releases") {
      const release = createSmokeEditorRelease("published", body);
      editorHttpReleases.unshift(release);
      writeJsonResponse(response, 200, release);
      return;
    }
    if (request.method === "POST" && request.url?.endsWith("/approval/submit")) {
      const pageId = decodeURIComponent(request.url.split("/").at(-3) ?? "unknown-page");
      writeJsonResponse(response, 200, createSmokeWorkflow(pageId, {
        approval: {
          status: "pending",
          submitter: body.operator,
          submittedAt: new Date().toISOString(),
          comment: body.comment,
        },
      }));
      return;
    }
    if (request.method === "POST" && request.url?.endsWith("/approval/cancel")) {
      const pageId = decodeURIComponent(request.url.split("/").at(-3) ?? "unknown-page");
      writeJsonResponse(response, 200, createSmokeWorkflow(pageId, {
        approval: {
          status: "draft",
          submitter: body.operator,
          comment: body.comment,
        },
      }));
      return;
    }
    if (request.method === "POST" && request.url?.endsWith("/approval/review")) {
      const pageId = decodeURIComponent(request.url.split("/").at(-3) ?? "unknown-page");
      writeJsonResponse(response, 200, createSmokeWorkflow(pageId, {
        approval: {
          status: body.approved ? "approved" : "rejected",
          reviewer: body.operator,
          reviewedAt: new Date().toISOString(),
          comment: body.comment,
          reason: body.reason,
        },
      }));
      return;
    }
    writeJsonResponse(response, 404, null);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, resolve);
  });
  servers.push(server);
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
      const field = Array.from(document.querySelectorAll('.field')).find((item) => (item.innerText || '').includes(${jsString(label)}));
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
      const field = Array.from(document.querySelectorAll('.field')).find((item) => (item.innerText || '').includes(${jsString(label)}));
      const select = field?.querySelector('select');
      if (!select) return false;
      select.value = ${jsString(value)};
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`;
    const selected = await this.evaluate(expression);
    if (!selected) fail(`未找到标签为 ${label} 的下拉字段`);
  }

  async clickNumberStepperByLabel(label, action) {
    const ariaPrefix = action === "decrease" ? "减少" : "增加";
    const expression = `(() => {
      const field = Array.from(document.querySelectorAll('.field')).find((item) => (item.innerText || '').includes(${jsString(label)}));
      const button = field?.querySelector(\`.number-field button[aria-label^="${ariaPrefix}"]\`);
      if (!button) return false;
      button.click();
      return true;
    })()`;
    const clicked = await this.evaluate(expression);
    if (!clicked) fail(`未找到标签为 ${label} 的数值步进按钮`);
  }

  async clickColorSwatchByLabel(label, swatch) {
    const expression = `(() => {
      const field = Array.from(document.querySelectorAll('.field')).find((item) => (item.innerText || '').includes(${jsString(label)}));
      const button = Array.from(field?.querySelectorAll('.color-swatches button') ?? []).find((item) => item.title === ${jsString(swatch)});
      if (!button) return false;
      button.click();
      return true;
    })()`;
    const clicked = await this.evaluate(expression);
    if (!clicked) fail(`未找到标签为 ${label} 的颜色色板 ${swatch}`);
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

async function waitForConfigPlatformRequest(predicate, label) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const matched = configPlatformRequests.find(predicate);
    if (matched) {
      log(`通过：${label}`);
      return matched;
    }
    await delay(250);
  }
  fail(`等待配置平台请求超时：${label}`);
}

async function assertActivityRuleModal(page, label) {
  log(`检查活动规则弹窗：${label}`);
  await page.clickByText(".phone-frame button", "查看规则");
  await page.waitForExpression("document.querySelector('[role=\"dialog\"]') && document.body.innerText.includes('活动规则')");
  await page.clickFirst("[role='dialog'] button");
  await page.waitForExpression("!document.querySelector('[role=\"dialog\"]')");
  log(`通过：${label} 可打开并关闭活动规则弹窗`);
}

async function assertBasicModal(page, label, triggerText, titleText) {
  log(`检查基础弹窗：${label}`);
  await page.clickByText(".phone-frame .mlc-basic-modal button", triggerText);
  await page.waitForExpression(`document.querySelector('[role="dialog"]') && document.body.innerText.includes(${jsString(titleText)})`);
  await page.clickFirst("[role='dialog'] button");
  await page.waitForExpression("!document.querySelector('[role=\"dialog\"]')");
  log(`通过：${label} 可打开并关闭基础弹窗`);
}

async function assertTabsBlockSwitch(page, label) {
  log(`检查标签内容切换：${label}`);
  await page.clickByText(".phone-frame [role='tab']", "参与方式");
  await page.waitForExpression("document.body.innerText.includes('先领取优惠券，再进入专题会场，最后选择商品或门店内容完成转化')");
  log(`通过：${label} 可切换到参与方式标签`);
}

async function assertBasicFormSubmitValues(page) {
  log("检查基础表单字段值提交");
  await page.waitForExpression("document.querySelector('.phone-frame [data-lowcode-node-id=\"summer_basic_form\"] .mlc-basic-form')");
  await page.evaluate(`(() => {
    const form = document.querySelector('.phone-frame [data-lowcode-node-id="summer_basic_form"] .mlc-basic-form');
    const input = form?.querySelector('.mlc-basic-input input:not([type="hidden"])');
    if (!form || !input) return false;
    const valueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value')?.set;
    valueSetter?.call(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  await page.wait(100);
  await page.evaluate(`(() => {
    const form = document.querySelector('.phone-frame [data-lowcode-node-id="summer_basic_form"] .mlc-basic-form');
    const submit = Array.from(form?.querySelectorAll('button') ?? []).find((button) => button.innerText.includes('提交表单'));
    if (!submit) return false;
    submit.click();
    return true;
  })()`);
  await page.waitForExpression("document.querySelector('.phone-frame [data-lowcode-node-id=\"summer_basic_form\"] .mlc-basic-form__errors[role=\"alert\"]') && document.body.innerText.includes('请完善必填项后再提交') && document.body.innerText.includes('请填写表单内输入框') && document.body.innerText.includes('请确认同意接收活动通知') && !document.body.innerText.includes('表单值：')");
  await page.waitForExpression("(() => { const form = document.querySelector('.phone-frame [data-lowcode-node-id=\"summer_basic_form\"] .mlc-basic-form'); const inputField = form?.querySelector('.mlc-basic-input[data-mlc-form-field-invalid=\"true\"][aria-invalid=\"true\"]'); const checkboxField = form?.querySelector('.mlc-basic-checkbox[data-mlc-form-field-invalid=\"true\"][aria-invalid=\"true\"]'); return Boolean(inputField?.querySelector('.mlc-basic-form__field-error')?.innerText.includes('请填写表单内输入框') && checkboxField?.querySelector('.mlc-basic-form__field-error')?.innerText.includes('请确认同意接收活动通知')); })()");
  await page.evaluate(`(() => {
    const form = document.querySelector('.phone-frame [data-lowcode-node-id="summer_basic_form"] .mlc-basic-form');
    const input = form?.querySelector('.mlc-basic-input input:not([type="hidden"])');
    const checkbox = form?.querySelector('.mlc-basic-checkbox [role="checkbox"]');
    if (!form || !input || !checkbox) return false;
    const valueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value')?.set;
    valueSetter?.call(input, '低代码测试用户');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    checkbox.click();
    return true;
  })()`);
  await page.waitForExpression("(() => { const form = document.querySelector('.phone-frame [data-lowcode-node-id=\"summer_basic_form\"] .mlc-basic-form'); return Boolean(form && !form.querySelector('[data-mlc-form-field-invalid=\"true\"]') && !form.querySelector('.mlc-basic-form__errors[role=\"alert\"]')); })()");
  await page.wait(100);
  await page.evaluate(`(() => {
    const form = document.querySelector('.phone-frame [data-lowcode-node-id="summer_basic_form"] .mlc-basic-form');
    const submit = Array.from(form?.querySelectorAll('button') ?? []).find((button) => button.innerText.includes('提交表单'));
    if (!submit) return false;
    submit.click();
    return true;
  })()`);
  await page.waitForExpression("document.body.innerText.includes('表单值：') && document.body.innerText.includes('表单内输入框=低代码测试用户') && document.body.innerText.includes('同意接收活动通知=true')");
  log("通过：基础表单提交会把子级基础控件当前值透传到 action context");
}

async function assertReactRuntimeBasicFormSubmitValues(page) {
  log("检查 React H5 基础表单字段值提交");
  await page.waitForExpression("document.querySelector('.phone-frame [data-lowcode-node-id=\"node_basic_form\"] .mlc-basic-form')");
  await page.evaluate(`(() => {
    const form = document.querySelector('.phone-frame [data-lowcode-node-id="node_basic_form"] .mlc-basic-form');
    const input = form?.querySelector('.mlc-basic-input input:not([type="hidden"])');
    if (!form || !input) return false;
    const valueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value')?.set;
    valueSetter?.call(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  await page.wait(100);
  await page.evaluate(`(() => {
    const form = document.querySelector('.phone-frame [data-lowcode-node-id="node_basic_form"] .mlc-basic-form');
    const submit = Array.from(form?.querySelectorAll('button') ?? []).find((button) => button.innerText.includes('提交表单'));
    if (!submit) return false;
    submit.click();
    return true;
  })()`);
  await page.waitForExpression("document.querySelector('.phone-frame [data-lowcode-node-id=\"node_basic_form\"] .mlc-basic-form__errors[role=\"alert\"]') && document.body.innerText.includes('请完善必填项后再提交') && document.body.innerText.includes('请填写表单内输入框') && document.body.innerText.includes('请确认同意接收活动通知') && !document.body.innerText.includes('模拟埋点：basic_form_submit')");
  await page.waitForExpression("(() => { const form = document.querySelector('.phone-frame [data-lowcode-node-id=\"node_basic_form\"] .mlc-basic-form'); const inputField = form?.querySelector('.mlc-basic-input[data-mlc-form-field-invalid=\"true\"][aria-invalid=\"true\"]'); const checkboxField = form?.querySelector('.mlc-basic-checkbox[data-mlc-form-field-invalid=\"true\"][aria-invalid=\"true\"]'); return Boolean(inputField?.querySelector('.mlc-basic-form__field-error')?.innerText.includes('请填写表单内输入框') && checkboxField?.querySelector('.mlc-basic-form__field-error')?.innerText.includes('请确认同意接收活动通知')); })()");
  await page.evaluate(`(() => {
    const form = document.querySelector('.phone-frame [data-lowcode-node-id="node_basic_form"] .mlc-basic-form');
    const input = form?.querySelector('.mlc-basic-input input:not([type="hidden"])');
    const checkbox = form?.querySelector('.mlc-basic-checkbox [role="checkbox"]');
    if (!form || !input || !checkbox) return false;
    const valueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value')?.set;
    valueSetter?.call(input, 'React H5 测试用户');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    checkbox.click();
    return true;
  })()`);
  await page.waitForExpression("(() => { const form = document.querySelector('.phone-frame [data-lowcode-node-id=\"node_basic_form\"] .mlc-basic-form'); return Boolean(form && !form.querySelector('[data-mlc-form-field-invalid=\"true\"]') && !form.querySelector('.mlc-basic-form__errors[role=\"alert\"]')); })()");
  await page.wait(100);
  await page.evaluate(`(() => {
    const form = document.querySelector('.phone-frame [data-lowcode-node-id="node_basic_form"] .mlc-basic-form');
    const submit = Array.from(form?.querySelectorAll('button') ?? []).find((button) => button.innerText.includes('提交表单'));
    if (!submit) return false;
    submit.click();
    return true;
  })()`);
  await page.waitForExpression("document.body.innerText.includes('模拟埋点：basic_form_submit') && document.body.innerText.includes('事件值：') && document.body.innerText.includes('表单内输入框=React H5 测试用户') && document.body.innerText.includes('同意接收活动通知=true')");
  log("通过：React H5 基础表单提交会把子级基础控件当前值透传到 action context");
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
  await page.waitForExpression("document.querySelector('[data-testid=\"audit-trail-panel\"]') && document.querySelector('[data-testid=\"audit-trail-panel\"]')?.innerText.includes('添加物料') && document.querySelector('[data-testid=\"audit-trail-panel\"]')?.innerText.includes('图片 Banner')");
  await page.clickFirst("[data-testid='host-audit-button']");
  await page.waitForExpression("document.querySelector('[data-testid=\"audit-log-panel\"]') && document.querySelector('[data-testid=\"audit-log-panel\"]')?.innerText.includes('审计日志') && document.querySelector('[data-testid=\"audit-log-panel\"]')?.innerText.includes('图片 Banner')");
  await page.clickFirst("[data-testid='audit-log-close']");
  await page.waitForExpression("!document.querySelector('[data-testid=\"audit-log-panel\"]')");
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

  log("检查物料分类说明");
  await page.evaluate("(() => { const select = document.querySelector('select[aria-label=\"物料分类\"]'); select.value = 'basic'; select.dispatchEvent(new Event('change', { bubbles: true })); return true; })()");
  await page.waitForExpression("(() => { const summary = document.querySelector('[data-testid=\"material-category-summary\"]'); return Boolean(summary && summary.innerText.includes('基础物料') && summary.innerText.includes('业务无关') && summary.innerText.includes('物料')); })()");
  await page.waitForExpression("(() => { const summary = document.querySelector('[data-testid=\"material-architecture-summary\"]'); return Boolean(summary && summary.innerText.includes('物料分层') && summary.innerText.includes('通用物料') && summary.innerText.includes('按钮行动')); })()");
  await page.waitForExpression("Array.from(document.querySelectorAll('.material-item')).every((item) => item.innerText.includes('基础物料'))");
  await page.waitForExpression("Array.from(document.querySelectorAll('.material-item')).some((item) => item.innerText.includes('基础按钮') && item.innerText.includes('通用物料') && item.innerText.includes('按钮行动'))");
  await page.evaluate("(() => { const select = document.querySelector('select[aria-label=\"物料分类\"]'); select.value = '全部'; select.dispatchEvent(new Event('change', { bubbles: true })); return true; })()");
  await page.waitForExpression("document.querySelector('[data-testid=\"material-category-summary\"]')?.innerText.includes('全部物料')");
  await page.waitForExpression("(() => { const summary = document.querySelector('[data-testid=\"material-architecture-summary\"]'); return Boolean(summary && summary.innerText.includes('通用物料') && summary.innerText.includes('业务物料')); })()");
  log("通过：物料分类说明、数量摘要和架构分层可随分类筛选切换");

  log("检查物料插入预设");
  const nodeCountBeforeMaterialPreset = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.waitForExpression("Array.from(document.querySelectorAll('.material-item')).some((item) => item.innerText.includes('基础按钮') && item.innerText.includes('主按钮') && item.innerText.includes('描边按钮'))");
  await page.evaluate(`(() => {
    const item = Array.from(document.querySelectorAll('.material-item')).find((element) => element.innerText.includes('基础按钮'));
    const button = Array.from(item?.querySelectorAll('.material-preset-row button') ?? []).find((element) => element.textContent?.trim() === '主按钮');
    button?.click();
    return Boolean(button);
  })()`);
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeMaterialPreset)}`);
  await page.waitForExpression("document.body.innerText.includes('已添加预设：主按钮')");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"text\": \"立即参与\"') && item.value.includes('\"backgroundColor\": \"#111827\"') && item.value.includes('\"name\": \"主按钮\"'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  log("通过：物料预设可一键插入并写入预设 props");

  log("检查快捷命令面板");
  const nodeCountBeforeCommand = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.waitForExpression("document.querySelector('.command-palette')");
  await page.fillByPlaceholder("搜索命令、物料或模板", "品牌专题");
  await page.waitForExpression("document.body.innerText.includes('添加物料：品牌专题')");
  await page.clickByText(".command-palette-item", "添加物料：品牌专题");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeCommand)}`);
  log("通过：快捷命令可搜索并添加品牌专题物料");

  log("检查基础按钮、基础链接、基础提示、基础状态块、基础进度条、基础输入框、基础多行输入、基础选择框、基础单选组、基础步进器、基础开关和基础复选框通用物料");
  const nodeCountBeforeBasicButton = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础按钮");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础按钮')");
  await page.clickByText(".command-palette-item", "添加物料：基础按钮");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicButton)}`);
  await page.waitForExpression("document.body.innerText.includes('基础按钮示例') || document.body.innerText.includes('基础按钮')");
  await page.evaluate("Array.from(document.querySelectorAll('.property-group.collapsed .property-group-head')).forEach((button) => button.click())");
  await page.waitForExpression("Array.from(document.querySelectorAll('.inspector .field')).some((item) => item.innerText.includes('样式') && item.querySelector('select option[value=\"ghost\"]'))");
  await page.selectFieldByLabel("样式", "ghost");
  await page.waitForExpression("Array.from(document.querySelectorAll('.inspector .field')).some((item) => item.innerText.includes('按钮色') && item.querySelector('.color-swatches button[title=\"#2563eb\"]'))");
  await page.clickColorSwatchByLabel("按钮色", "#2563eb");
  await page.waitForExpression("Array.from(document.querySelectorAll('.inspector .field')).some((item) => item.innerText.includes('圆角') && item.innerText.includes('px') && item.querySelector('.number-field button[aria-label^=\"增加\"]'))");
  await page.clickNumberStepperByLabel("圆角", "increase");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicButton\"') && item.value.includes('\"variant\": \"ghost\"') && item.value.includes('\"backgroundColor\": \"#2563eb\"') && item.value.includes('\"radius\": 9'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  const nodeCountBeforeBasicLink = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础链接");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础链接')");
  await page.clickByText(".command-palette-item", "添加物料：基础链接");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicLink)}`);
  await page.waitForExpression("document.querySelector('.phone-frame .mlc-basic-link a[href=\"#\"]') && document.body.innerText.includes('查看详情')");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicLink\"') && item.value.includes('\"linkUrl\": \"#\"') && item.value.includes('\"variant\": \"bar\"'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  const nodeCountBeforeBasicAlert = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础提示");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础提示')");
  await page.clickByText(".command-palette-item", "添加物料：基础提示");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicAlert)}`);
  await page.waitForExpression("(() => { const alerts = Array.from(document.querySelectorAll('.phone-frame .mlc-basic-alert')); const latest = alerts.at(-1); return Boolean(latest && latest.innerText.includes('基础提示') && latest.innerText.includes('查看详情') && latest.className.includes('mlc-basic-alert--info')); })()");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicAlert\"') && item.value.includes('\"tone\": \"info\"') && item.value.includes('\"variant\": \"soft\"'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  const nodeCountBeforeBasicStateBlock = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础状态块");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础状态块')");
  await page.clickByText(".command-palette-item", "添加物料：基础状态块");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicStateBlock)}`);
  await page.waitForExpression("(() => { const blocks = Array.from(document.querySelectorAll('.phone-frame .mlc-basic-state-block')); const latest = blocks.at(-1); return Boolean(latest && latest.innerText.includes('暂无内容') && latest.innerText.includes('刷新重试') && latest.className.includes('mlc-basic-state-block--empty')); })()");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicStateBlock\"') && item.value.includes('\"state\": \"empty\"') && item.value.includes('\"showAction\": true'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  const nodeCountBeforeBasicProgress = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础进度条");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础进度条')");
  await page.clickByText(".command-palette-item", "添加物料：基础进度条");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicProgress)}`);
  await page.waitForExpression("(() => { const items = Array.from(document.querySelectorAll('.phone-frame .mlc-basic-progress')); const latest = items.at(-1); return Boolean(latest && latest.innerText.includes('基础进度') && latest.innerText.includes('68%') && latest.className.includes('mlc-basic-progress--brand') && latest.querySelector('[role=\"progressbar\"][aria-valuenow=\"68\"]')); })()");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicProgress\"') && item.value.includes('\"tone\": \"brand\"') && item.value.includes('\"value\": 68'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  const nodeCountBeforeBasicInput = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础输入框");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础输入框')");
  await page.clickByText(".command-palette-item", "添加物料：基础输入框");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicInput)}`);
  await page.waitForExpression("document.body.innerText.includes('基础输入框') && Array.from(document.querySelectorAll('.phone-frame input')).some((item) => item.getAttribute('placeholder') === '请输入内容')");
  const nodeCountBeforeBasicTextarea = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础多行输入");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础多行输入')");
  await page.clickByText(".command-palette-item", "添加物料：基础多行输入");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicTextarea)}`);
  await page.waitForExpression("document.body.innerText.includes('基础多行输入') && Array.from(document.querySelectorAll('.phone-frame textarea')).some((item) => item.getAttribute('placeholder') === '请输入多行内容')");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicTextarea\"') && item.value.includes('\"rows\": 3') && item.value.includes('\"textareaBackgroundColor\": \"#ffffff\"'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  const nodeCountBeforeBasicSelect = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础选择框");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础选择框')");
  await page.clickByText(".command-palette-item", "添加物料：基础选择框");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicSelect)}`);
  await page.waitForExpression("document.body.innerText.includes('基础选择框') && Array.from(document.querySelectorAll('.phone-frame select')).some((item) => item.querySelector('option[value=\"women\"]'))");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicSelect\"') && item.value.includes('\"options\"') && item.value.includes('\"value\": \"women\"'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  const nodeCountBeforeBasicRadioGroup = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础单选组");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础单选组')");
  await page.clickByText(".command-palette-item", "添加物料：基础单选组");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicRadioGroup)}`);
  await page.waitForExpression("document.body.innerText.includes('基础单选组') && document.querySelector('.phone-frame .mlc-basic-radio-group [role=\"radiogroup\"] [role=\"radio\"][aria-checked=\"true\"]')");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicRadioGroup\"') && item.value.includes('\"defaultValue\": \"women\"') && item.value.includes('\"activeColor\": \"#0f766e\"'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  const nodeCountBeforeBasicStepper = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础步进器");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础步进器')");
  await page.clickByText(".command-palette-item", "添加物料：基础步进器");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicStepper)}`);
  await page.waitForExpression("document.body.innerText.includes('基础步进器') && (() => { const stepper = document.querySelector('.phone-frame .mlc-basic-stepper'); if (!stepper) return false; const buttons = Array.from(stepper.querySelectorAll('button')).map((item) => item.textContent?.trim()); return buttons.includes('-') && buttons.includes('+') && stepper.innerText.includes('2'); })()");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicStepper\"') && item.value.includes('\"defaultValue\": 2') && item.value.includes('\"max\": 10') && item.value.includes('\"accentColor\": \"#0f766e\"'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  const nodeCountBeforeBasicSwitch = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础开关");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础开关')");
  await page.clickByText(".command-palette-item", "添加物料：基础开关");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicSwitch)}`);
  await page.waitForExpression("document.body.innerText.includes('基础开关') && document.querySelector('.phone-frame .mlc-basic-switch [role=\"switch\"][aria-checked=\"true\"]')");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicSwitch\"') && item.value.includes('\"defaultChecked\": true') && item.value.includes('\"activeColor\": \"#0f766e\"'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  const nodeCountBeforeBasicCheckbox = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础复选框");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础复选框')");
  await page.clickByText(".command-palette-item", "添加物料：基础复选框");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicCheckbox)}`);
  await page.waitForExpression("document.body.innerText.includes('基础复选框') && document.querySelector('.phone-frame .mlc-basic-checkbox [role=\"checkbox\"][aria-checked=\"false\"]')");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicCheckbox\"') && item.value.includes('\"defaultChecked\": false') && item.value.includes('\"checkedColor\": \"#0f766e\"'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  log("通过：基础按钮、基础链接、基础提示、基础状态块、基础进度条、基础输入框、基础多行输入、基础选择框、基础单选组、基础步进器、基础开关和基础复选框可从快捷命令添加并在 Vue H5 画布渲染");

  log("检查基础文本和分割线通用物料");
  const nodeCountBeforeBasicText = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础文本");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础文本')");
  await page.clickByText(".command-palette-item", "添加物料：基础文本");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicText)}`);
  await page.waitForExpression("document.body.innerText.includes('这是一段基础文本')");
  const nodeCountBeforeBasicPrice = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础价格");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础价格')");
  await page.clickByText(".command-palette-item", "添加物料：基础价格");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicPrice)}`);
  await page.waitForExpression("document.querySelector('.phone-frame .mlc-basic-price') && document.body.innerText.includes('¥99起')");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicPrice\"') && item.value.includes('\"amountText\": \"99\"') && item.value.includes('\"size\": 24'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  const nodeCountBeforeDivider = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  const dividerCountBefore = await page.evaluate("document.querySelectorAll('.phone-frame .mlc-divider-block').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "分割线");
  await page.waitForExpression("document.body.innerText.includes('添加物料：分割线')");
  await page.clickByText(".command-palette-item", "添加物料：分割线");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeDivider)}`);
  await page.waitForExpression(`document.querySelectorAll('.phone-frame .mlc-divider-block').length > ${Number(dividerCountBefore)}`);
  log("通过：基础文本、基础价格和分割线可从快捷命令添加并在 Vue H5 画布渲染");

  log("检查网格容器布局物料");
  const nodeCountBeforeGridContainer = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "网格容器");
  await page.waitForExpression("document.body.innerText.includes('添加物料：网格容器')");
  await page.clickByText(".command-palette-item", "添加物料：网格容器");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeGridContainer)}`);
  await page.waitForExpression("document.querySelector('.phone-frame .mlc-grid-container') && document.body.innerText.includes('当前容器：网格容器')");
  await page.clickByText(".container-target-presets button", "基础按钮 · 主按钮");
  await page.waitForExpression("(() => { const bodies = Array.from(document.querySelectorAll('.phone-frame .mlc-grid-container__body')); const latest = bodies.at(-1); return Boolean(latest && latest.querySelector('.mlc-basic-button') && latest.innerText.includes('立即参与')); })()");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("(() => { const source = Array.from(document.querySelectorAll('textarea')).find((item) => item.value.includes('\"schemaVersion\"'))?.value; if (!source) return false; const schema = JSON.parse(source); const grid = schema.nodes.filter((node) => node.componentName === 'GridContainer').at(-1); return Boolean(grid?.children?.some((node) => node.componentName === 'BasicButton' && node.meta?.name === '主按钮' && node.props?.text === '立即参与')); })()");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  await page.evaluate("(() => { const grid = Array.from(document.querySelectorAll('.phone-frame .mlc-grid-container')).at(-1)?.closest('[data-lowcode-node-id]'); grid?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); return Boolean(grid); })()");
  await page.waitForExpression("document.body.innerText.includes('当前容器：网格容器')");
  await page.clickByText(".container-target button", "基础文本");
  await page.waitForExpression("(() => { const bodies = Array.from(document.querySelectorAll('.phone-frame .mlc-grid-container__body')); const latest = bodies.at(-1); return Boolean(latest && latest.querySelector('.mlc-basic-text') && latest.innerText.includes('这是一段基础文本')); })()");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"GridContainer\"') && item.value.includes('\"columns\": 2') && item.value.includes('\"componentName\": \"BasicButton\"') && item.value.includes('\"componentName\": \"BasicText\"'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  log("通过：网格容器可从快捷命令添加、识别为容器并加入预设按钮与基础文本");

  log("检查基础表单容器物料");
  const nodeCountBeforeBasicForm = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础表单");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础表单')");
  await page.clickByText(".command-palette-item", "添加物料：基础表单");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicForm)}`);
  await page.waitForExpression("document.querySelector('.phone-frame .mlc-basic-form') && document.body.innerText.includes('当前容器：基础表单')");
  await page.clickByText(".container-target button", "基础输入框");
  await page.waitForExpression("(() => { const forms = Array.from(document.querySelectorAll('.phone-frame .mlc-basic-form')); const latest = forms.at(-1); return Boolean(latest && latest.querySelector('.mlc-basic-form__fields .mlc-basic-input') && latest.innerText.includes('基础输入框')); })()");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicForm\"') && item.value.includes('\"submitText\": \"提交\"') && item.value.includes('\"componentName\": \"BasicInput\"'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  log("通过：基础表单可从快捷命令添加、识别为容器并加入基础输入框");

  log("检查基础列表通用物料");
  const nodeCountBeforeBasicList = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础列表");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础列表')");
  await page.clickByText(".command-palette-item", "添加物料：基础列表");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicList)}`);
  await page.waitForExpression("(() => { const lists = Array.from(document.querySelectorAll('.phone-frame .mlc-basic-list')); const latest = lists.at(-1); return Boolean(latest && latest.innerText.includes('基础列表') && latest.innerText.includes('领取活动权益') && latest.querySelectorAll('.mlc-basic-list__item').length === 3); })()");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicList\"') && item.value.includes('\"marker\": \"dot\"') && item.value.includes('\"items\"') && item.value.includes('\"领取活动权益\"'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  log("通过：基础列表可从快捷命令添加并写入静态列表项");

  log("检查基础折叠面板通用物料");
  const nodeCountBeforeBasicAccordion = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础折叠面板");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础折叠面板')");
  await page.clickByText(".command-palette-item", "添加物料：基础折叠面板");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicAccordion)}`);
  await page.waitForExpression("(() => { const accordions = Array.from(document.querySelectorAll('.phone-frame .mlc-basic-accordion')); const latest = accordions.at(-1); return Boolean(latest && latest.innerText.includes('基础折叠面板') && latest.innerText.includes('活动什么时候开始？') && latest.innerText.includes('请以页面配置的活动时间为准') && latest.querySelectorAll('.mlc-basic-accordion__item').length === 3 && latest.querySelector('.mlc-basic-accordion__trigger[aria-expanded=\"true\"]')); })()");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicAccordion\"') && item.value.includes('\"mode\": \"single\"') && item.value.includes('\"items\"') && item.value.includes('\"活动什么时候开始？\"'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  log("通过：基础折叠面板可从快捷命令添加并写入静态折叠项");

  log("检查基础时间线通用物料");
  const nodeCountBeforeBasicTimeline = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础时间线");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础时间线')");
  await page.clickByText(".command-palette-item", "添加物料：基础时间线");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicTimeline)}`);
  await page.waitForExpression("(() => { const timelines = Array.from(document.querySelectorAll('.phone-frame .mlc-basic-timeline')); const latest = timelines.at(-1); return Boolean(latest && latest.innerText.includes('基础时间线') && latest.innerText.includes('确认页面内容') && latest.querySelectorAll('.mlc-basic-timeline__item').length === 3); })()");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicTimeline\"') && item.value.includes('\"marker\": \"dot\"') && item.value.includes('\"items\"') && item.value.includes('\"确认页面内容\"'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  log("通过：基础时间线可从快捷命令添加并写入静态节点");

  log("检查基础图片和基础标签通用物料");
  const nodeCountBeforeBasicImage = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础图片");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础图片')");
  await page.clickByText(".command-palette-item", "添加物料：基础图片");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicImage)}`);
  await page.waitForExpression("document.querySelector('.phone-frame .mlc-basic-image img[alt=\"活动图片\"]')");
  await page.waitForExpression("document.body.innerText.includes('素材库') && document.body.innerText.includes('新人券视觉')");
  await page.clickByText(".asset-card", "新人券视觉");
  await page.waitForExpression("document.querySelector('.phone-frame .mlc-basic-image img[src*=\"1607083206869\"]')");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicImage\"') && item.value.includes('1607083206869'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  const nodeCountBeforeBasicTag = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础标签");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础标签')");
  await page.clickByText(".command-palette-item", "添加物料：基础标签");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicTag)}`);
  await page.waitForExpression("document.body.innerText.includes('基础标签')");
  const nodeCountBeforeBasicCard = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础图文卡片");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础图文卡片')");
  await page.clickByText(".command-palette-item", "添加物料：基础图文卡片");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicCard)}`);
  await page.waitForExpression("document.querySelector('.phone-frame .mlc-basic-card') && document.body.innerText.includes('基础图文卡片')");
  const nodeCountBeforeBasicCarousel = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础图片轮播");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础图片轮播')");
  await page.clickByText(".command-palette-item", "添加物料：基础图片轮播");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicCarousel)}`);
  await page.waitForExpression("document.querySelector('.phone-frame .mlc-basic-carousel') && document.body.innerText.includes('新品首发')");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicCarousel\"') && item.value.includes('\"indicator\": \"dots\"') && item.value.includes('\"autoPlay\": true'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  const nodeCountBeforeBasicVideo = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础视频");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础视频')");
  await page.clickByText(".command-palette-item", "添加物料：基础视频");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicVideo)}`);
  await page.waitForExpression("document.querySelector('.phone-frame .mlc-basic-video video') && document.body.innerText.includes('基础视频')");
  await page.waitForExpression("document.body.innerText.includes('视频素材库') && document.body.innerText.includes('品牌氛围短片')");
  await page.fillByPlaceholder("搜索视频素材", "权益");
  await page.waitForExpression("document.body.innerText.includes('权益说明视频')");
  await page.clickByText(".video-asset-card", "权益说明视频");
  await page.waitForExpression("document.querySelector('.phone-frame .mlc-basic-video video[poster*=\"1607083206869\"]')");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicVideo\"') && item.value.includes('\"posterUrl\": \"https://images.unsplash.com/photo-1607083206869') && item.value.includes('\"controls\": true'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  const nodeCountBeforeBasicModal = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.pressShortcut("k", { ctrlKey: true });
  await page.fillByPlaceholder("搜索命令、物料或模板", "基础弹窗");
  await page.waitForExpression("document.body.innerText.includes('添加物料：基础弹窗')");
  await page.clickByText(".command-palette-item", "添加物料：基础弹窗");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length > ${Number(nodeCountBeforeBasicModal)}`);
  await page.waitForExpression("document.querySelector('.phone-frame .mlc-basic-modal') && document.body.innerText.includes('查看说明')");
  await assertBasicModal(page, "Vue3 编辑器画布新增物料", "查看说明", "基础弹窗");
  await page.clickByText(".toolbar button", "源码");
  await page.waitForExpression("Array.from(document.querySelectorAll('textarea')).some((item) => item.value.includes('\"componentName\": \"BasicModal\"') && item.value.includes('\"placement\": \"bottom\"') && item.value.includes('\"closeOnBackdrop\": true'))");
  await page.clickByText(".toolbar button", "设计");
  await page.waitForExpression("document.querySelector('.phone-frame')");
  log("通过：基础图片、基础标签、基础图文卡片、基础图片轮播、基础视频和基础弹窗可从快捷命令添加并在 Vue H5 画布渲染");

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
  await page.waitForExpression("document.querySelector('.publish-risk-summary') && document.body.innerText.includes('可以生成预览，仍有提醒')");
  await page.waitForExpression("Array.from(document.querySelectorAll('.publish-risk-item')).some((item) => item.innerText.includes('秒杀商品组 没有静态商品'))");
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

async function assertEditorApprovalActions(page) {
  await assertPage(page, editorApprovalActionsUrl, [
    {
      label: "发布审批区域存在",
      expression: "document.querySelector('.approval-workflow-panel') && document.body.innerText.includes('发布审批')",
    },
    {
      label: "待提交审批状态存在",
      expression: "document.querySelector('.capability-pill[data-capability-status-id=\"approval\"]')?.textContent?.includes('待提交审批')",
    },
  ]);

  await page.clickByText(".approval-workflow-actions button", "提交审批");
  await page.waitForExpression("document.querySelector('.capability-pill[data-capability-status-id=\"approval\"]')?.textContent?.includes('审批中')");
  await page.waitForExpression("document.body.innerText.includes('已提交审批')");

  await page.clickByText(".approval-workflow-actions button", "撤回");
  await page.waitForExpression("document.querySelector('.capability-pill[data-capability-status-id=\"approval\"]')?.textContent?.includes('待提交审批')");
  await page.waitForExpression("document.body.innerText.includes('已撤回审批')");

  await page.clickByText(".approval-workflow-actions button", "提交审批");
  await page.waitForExpression("document.querySelector('.capability-pill[data-capability-status-id=\"approval\"]')?.textContent?.includes('审批中')");
  await page.clickByText(".approval-workflow-actions button", "驳回");
  await page.waitForExpression("document.querySelector('.capability-pill[data-capability-status-id=\"approval\"]')?.textContent?.includes('审批驳回')");
  await page.waitForExpression("document.body.innerText.includes('审批已驳回')");

  await page.clickByText(".approval-workflow-actions button", "提交审批");
  await page.waitForExpression("document.querySelector('.capability-pill[data-capability-status-id=\"approval\"]')?.textContent?.includes('审批中')");
  await page.clickByText(".approval-workflow-actions button", "通过");
  await page.waitForExpression("document.querySelector('.capability-pill[data-capability-status-id=\"approval\"]')?.textContent?.includes('审批通过')");
  await page.waitForExpression("document.body.innerText.includes('审批已通过，可以发布')");
  await page.waitForExpression("Array.from(document.querySelectorAll('.toolbar button')).some((item) => (item.innerText || '').includes('发布') && !item.disabled)");
  log("通过：发布审批可提交、撤回、驳回、重新提交并审核通过");
}

async function assertEditorReadonlyMaterialInsert(page) {
  log("检查只读状态下物料插入禁用");
  await page.waitForExpression("document.querySelector('.material-insert-lock') && document.body.innerText.includes('正在编辑，当前仅可查看')");
  await page.waitForExpression("Array.from(document.querySelectorAll('.material-main-button')).some((item) => item.disabled && item.innerText.includes('图片 Banner'))");
  await page.waitForExpression("Array.from(document.querySelectorAll('.material-quick-chip')).every((item) => item.disabled)");
  const nodeCountBefore = await page.evaluate("document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length");
  await page.clickChildByText(".material-item", "图片 Banner", ".material-detail-button");
  await page.waitForExpression("document.querySelector('.material-detail-dialog') && document.querySelector('.material-detail-actions button')?.disabled && document.body.innerText.includes('正在编辑，当前仅可查看')");
  await page.evaluate("document.querySelector('.material-detail-actions button')?.click()");
  await page.waitForExpression(`document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length === ${Number(nodeCountBefore)}`);
  await page.clickFirst(".material-detail-head button");
  await page.waitForExpression("!document.querySelector('.material-detail-dialog')");
  log("通过：只读协作状态下物料面板和详情添加入口均禁用，且不会新增节点");
}

async function assertEditorHttpConfigPlatform(page) {
  await assertPage(page, editorHttpUrl, [
    { label: "Vue3 编辑器 HTTP 配置平台 shell 已挂载", expression: "document.querySelector('.editor-shell')" },
    { label: "Vue3 编辑器 HTTP 配置平台入口存在", expression: `document.body.innerText.includes(${jsString(`http ${configPlatformSmokeUrl}`)})` },
    { label: "Vue3 编辑器 HTTP 配置平台保留发布面板", expression: "document.body.innerText.includes('发布检查') && document.body.innerText.includes('本地版本')" },
  ]);
  await waitForConfigPlatformRequest(
    (request) => request.method === "GET"
      && request.url === "/api/lowcode/pages/releases?pageId=summer-campaign-demo"
      && request.authorization === "Bearer smoke-token",
    "Vue3 编辑器 HTTP 模式拉取 release list 并透传 authorization",
  );
  await waitForConfigPlatformRequest(
    (request) => request.method === "GET"
      && request.url === "/api/lowcode/pages/summer-campaign-demo/workflow"
      && request.authorization === "Bearer smoke-token",
    "Vue3 编辑器 HTTP 模式拉取 workflow 并透传 authorization",
  );
  await waitForConfigPlatformRequest(
    (request) => request.method === "GET"
      && request.url === "/api/lowcode/pages/summer-campaign-demo/editor-draft-snapshot"
      && request.authorization === "Bearer smoke-token",
    "Vue3 编辑器 HTTP 模式读取 editor draft snapshot",
  );

  await page.fillFieldByLabel("标题", "HTTP 编辑器 Smoke 页面");
  await page.waitForExpression("document.body.innerText.includes('HTTP 编辑器 Smoke 页面')");
  await page.waitForExpression("document.body.innerText.includes('已自动保存')");
  await waitForConfigPlatformRequest(
    (request) => request.method === "PUT"
      && request.url === "/api/lowcode/pages/summer-campaign-demo/editor-draft-snapshot"
      && request.authorization === "Bearer smoke-token"
      && request.body?.schema?.title === "HTTP 编辑器 Smoke 页面"
      && request.body?.operator?.id === "operator-me",
    "Vue3 编辑器 HTTP 模式保存 editor draft snapshot",
  );

  await page.fillFieldByLabel("版本备注", "HTTP Smoke 草稿");
  await page.evaluate("document.activeElement?.blur()");
  await page.clickByText(".toolbar button", "保存草稿");
  await page.waitForExpression("document.body.innerText.includes('已保存草稿')");
  await waitForConfigPlatformRequest(
    (request) => request.method === "POST"
      && request.url === "/api/lowcode/pages/drafts"
      && request.authorization === "Bearer smoke-token"
      && request.body?.pageStatus === "draft"
      && request.body?.note === "HTTP Smoke 草稿"
      && request.body?.operator?.id === "operator-me",
    "Vue3 编辑器 HTTP 模式保存草稿并提交 note/operator",
  );

  await page.clickFirst(".toolbar button[title='生成预览版本']");
  await page.waitForExpression("document.body.innerText.includes('已生成预览')");
  await waitForConfigPlatformRequest(
    (request) => request.method === "POST"
      && request.url === "/api/lowcode/pages/previews"
      && request.authorization === "Bearer smoke-token"
      && request.body?.pageStatus === "preview"
      && request.body?.operator?.id === "operator-me",
    "Vue3 编辑器 HTTP 模式生成预览 release",
  );
  await page.waitForExpression("Array.from(document.querySelectorAll('.preview-link-card input')).some((item) => item.value.includes('runtime=1') && item.value.includes('previewToken=pt_preview_smoke_'))");

  await page.clickByText(".toolbar button", "发布");
  await page.waitForExpression("document.body.innerText.includes('已发布')");
  await waitForConfigPlatformRequest(
    (request) => request.method === "POST"
      && request.url === "/api/lowcode/pages/releases"
      && request.authorization === "Bearer smoke-token"
      && request.body?.pageStatus === "published"
      && request.body?.operator?.id === "operator-me",
    "Vue3 编辑器 HTTP 模式发布页面 release",
  );
  await page.waitForExpression("Array.from(document.querySelectorAll('.release-card')).some((item) => item.innerText.includes('HTTP 编辑器 Smoke 页面') || item.innerText.includes('published-smoke'))");
  log("通过：Vue3 编辑器可通过 env 使用 HTTP 配置平台 client 完成草稿、预览、发布和自动快照");
}

async function assertInspectorGroups(page) {
  log("检查属性面板分组折叠");
  await page.waitForExpression("document.body.innerText.includes('内容配置')");
  await page.waitForExpression("document.body.innerText.includes('样式配置')");
  await page.clickByText(".property-group-head", "样式配置");
  await page.waitForExpression("(() => { const group = Array.from(document.querySelectorAll('.property-group')).find((item) => item.innerText.includes('样式配置')); return Boolean(group && group.classList.contains('collapsed')); })()");
  await page.clickByText(".property-group-head", "样式配置");
  await page.waitForExpression("(() => { const group = Array.from(document.querySelectorAll('.property-group')).find((item) => item.innerText.includes('样式配置')); return Boolean(group && !group.classList.contains('collapsed')); })()");
  await page.fillByPlaceholder("搜索节点", "基础输入框");
  await page.waitForExpression("Array.from(document.querySelectorAll('.outline-item')).some((item) => item.innerText.includes('基础输入框'))");
  await page.clickByText(".outline-item", "基础输入框");
  await page.waitForExpression("(() => { const selected = document.querySelector('.outline-item.selected'); return Boolean(selected && selected.innerText.includes('基础输入框')); })()");
  await page.waitForExpression("document.body.innerText.includes('表单校验') && document.body.innerText.includes('BasicForm 提交前校验') && document.body.innerText.includes('开启必填后') && Array.from(document.querySelectorAll('.property-group')).some((item) => item.innerText.includes('表单校验') && item.innerText.includes('必填提示'))");
  await page.fillByPlaceholder("搜索节点", "");
  log("通过：属性面板分组可折叠展开，并能展示基础表单字段校验配置");
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
  await page.waitForExpression("(() => { const providerRaw = window.localStorage.getItem('meumall-lowcode-local-platform-editor-draft-snapshots'); const legacyRaw = window.localStorage.getItem('meumall-lowcode-editor-playground'); return Boolean((providerRaw && providerRaw.includes('精选专区 CTA')) || (legacyRaw && legacyRaw.includes('精选专区 CTA'))); })()");
  await page.fillByPlaceholder("搜索节点", "精选专区");
  await page.waitForExpression("Array.from(document.querySelectorAll('.outline-item')).some((item) => item.innerText.includes('精选专区 CTA'))");
  await page.fillByPlaceholder("搜索节点", "");
  log("通过：结构树可搜索命中折叠容器内节点、定位选中并重命名");
}

async function cleanup() {
  for (const server of [...servers].reverse()) {
    await new Promise((resolve) => server.close(resolve));
  }
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
  await assertPortFree(editorHttpPort, "editor HTTP config playground");
  await assertPortFree(h5Port, "H5 runtime playground");
  await assertPortFree(h5HttpPort, "H5 runtime HTTP playground");
  await assertPortFree(configPlatformPort, "config platform HTTP mock");
  await assertPortFree(chromeDebugPort, "Chrome DevTools");

  await startConfigPlatformSmokeServer(configPlatformPort);
  await startViteServer("editor playground", path.join(rootDir, "apps/editor-playground"), editorPort, {
    VITE_REACT_H5_RUNTIME_URL: h5RuntimeUrl,
  });
  await startViteServer("editor HTTP config playground", path.join(rootDir, "apps/editor-playground"), editorHttpPort, {
    VITE_REACT_H5_RUNTIME_URL: h5RuntimeUrl,
    VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL: configPlatformSmokeUrl,
    VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION: "Bearer smoke-token",
    VITE_LOWCODE_DATA_SOURCE_BASE_URL: configPlatformSmokeUrl,
    VITE_LOWCODE_DATA_SOURCE_AUTHORIZATION: "Bearer smoke-token",
  });
  await startViteServer("H5 runtime playground", path.join(rootDir, "apps/h5-runtime-playground"), h5Port);
  await startViteServer("H5 runtime HTTP config playground", path.join(rootDir, "apps/h5-runtime-playground"), h5HttpPort, {
    VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL: configPlatformSmokeUrl,
    VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION: "Bearer smoke-token",
    VITE_LOWCODE_DATA_SOURCE_BASE_URL: configPlatformSmokeUrl,
    VITE_LOWCODE_DATA_SOURCE_AUTHORIZATION: "Bearer smoke-token",
    VITE_LOWCODE_ACTION_BASE_URL: configPlatformSmokeUrl,
    VITE_LOWCODE_ACTION_AUTHORIZATION: "Bearer smoke-token",
  });
  await startChrome();

  const page = await createPage();
  await page.connect();
  try {
    await assertPage(page, editorUrl, [
      { label: "Vue3 编辑器 shell 已挂载", expression: "document.querySelector('.editor-shell')" },
      { label: "编辑器品牌文案存在", expression: "document.body.innerText.includes('MeuMall Lowcode')" },
      { label: "编辑器协作状态存在", expression: "document.querySelector('.capability-pill[data-capability-status-id=\"collaboration\"]')?.textContent?.includes('可编辑')" },
      { label: "编辑器审批状态存在", expression: "document.querySelector('.capability-pill[data-capability-status-id=\"approval\"]')?.textContent?.includes('无需审批')" },
      { label: "编辑器顶部发布检查状态存在", expression: "document.querySelector('.capability-pill[data-capability-status-id=\"publish-check\"]')?.textContent?.includes('发布检查')" },
      { label: "编辑器宿主顶部扩展位存在", expression: "document.querySelector('[data-testid=\"host-toolbar-status\"]')?.textContent?.includes('审计已启用') && document.querySelector('[data-testid=\"host-audit-button\"]')?.textContent?.includes('审计日志')" },
      { label: "编辑器实操清单存在", expression: "document.querySelector('[data-testid=\"demo-checklist-panel\"]')?.innerText.includes('实操清单') && document.querySelector('[data-testid=\"demo-checklist-panel\"]')?.innerText.includes('页面有内容') && document.querySelector('[data-testid=\"demo-checklist-panel\"]')?.innerText.includes('H5 预览入口') && document.querySelector('[data-testid=\"demo-checklist-panel\"]')?.innerText.includes('React H5 渲染可验证')" },
      { label: "模板入口存在", expression: "document.body.innerText.includes('模板')" },
      { label: "物料入口存在", expression: "document.body.innerText.includes('物料')" },
      { label: "直播入口物料存在", expression: "document.body.innerText.includes('直播入口')" },
      { label: "品牌专题物料存在", expression: "document.body.innerText.includes('品牌专题')" },
      { label: "商品榜单物料存在", expression: "document.body.innerText.includes('商品榜单')" },
      { label: "底部转化条物料存在", expression: "document.body.innerText.includes('底部转化条')" },
      { label: "区块标题物料存在", expression: "document.body.innerText.includes('区块标题')" },
      { label: "图片卡片宫格物料存在", expression: "document.body.innerText.includes('图片卡片宫格')" },
      { label: "标签内容切换物料存在", expression: "document.body.innerText.includes('标签内容切换')" },
      { label: "网格容器物料存在", expression: "document.body.innerText.includes('网格容器')" },
      { label: "留资表单物料存在", expression: "document.body.innerText.includes('留资表单')" },
      { label: "公告条物料存在", expression: "document.body.innerText.includes('公告条')" },
      { label: "富文本物料存在", expression: "document.body.innerText.includes('富文本')" },
      { label: "基础按钮物料存在", expression: "document.body.innerText.includes('基础按钮')" },
      { label: "基础链接物料存在", expression: "document.body.innerText.includes('基础链接')" },
      { label: "基础提示物料存在", expression: "document.body.innerText.includes('基础提示')" },
      { label: "基础状态块物料存在", expression: "document.body.innerText.includes('基础状态块')" },
      { label: "基础进度条物料存在", expression: "document.body.innerText.includes('基础进度条')" },
      { label: "基础输入框物料存在", expression: "document.body.innerText.includes('基础输入框')" },
      { label: "基础多行输入物料存在", expression: "document.body.innerText.includes('基础多行输入')" },
      { label: "基础选择框物料存在", expression: "document.body.innerText.includes('基础选择框')" },
      { label: "基础单选组物料存在", expression: "document.body.innerText.includes('基础单选组')" },
      { label: "基础步进器物料存在", expression: "document.body.innerText.includes('基础步进器')" },
      { label: "基础开关物料存在", expression: "document.body.innerText.includes('基础开关')" },
      { label: "基础复选框物料存在", expression: "document.body.innerText.includes('基础复选框')" },
      { label: "基础文本物料存在", expression: "document.body.innerText.includes('基础文本')" },
      { label: "基础价格物料存在", expression: "document.body.innerText.includes('基础价格')" },
      { label: "分割线物料存在", expression: "document.body.innerText.includes('分割线')" },
      { label: "基础图片物料存在", expression: "document.body.innerText.includes('基础图片')" },
      { label: "基础标签物料存在", expression: "document.body.innerText.includes('基础标签')" },
      { label: "基础图文卡片物料存在", expression: "document.body.innerText.includes('基础图文卡片')" },
      { label: "基础视频物料存在", expression: "document.body.innerText.includes('基础视频')" },
      { label: "基础弹窗物料存在", expression: "document.body.innerText.includes('基础弹窗')" },
      { label: "基础表单物料存在", expression: "document.body.innerText.includes('基础表单')" },
      { label: "基础列表物料存在", expression: "document.body.innerText.includes('基础列表')" },
      { label: "基础折叠面板物料存在", expression: "document.body.innerText.includes('基础折叠面板')" },
      { label: "基础时间线物料存在", expression: "document.body.innerText.includes('基础时间线')" },
      { label: "物料卡片摘要存在", expression: "document.body.innerText.includes('个配置 /') && document.body.innerText.includes('个事件 /') && document.body.innerText.includes('个数据槽')" },
      { label: "物料插入预设存在", expression: "Array.from(document.querySelectorAll('.material-item')).some((item) => item.innerText.includes('基础按钮') && item.innerText.includes('主按钮') && item.innerText.includes('描边按钮'))" },
      { label: "物料分类说明存在", expression: "(() => { const summary = document.querySelector('[data-testid=\"material-category-summary\"]'); return Boolean(summary && summary.innerText.includes('全部物料') && summary.innerText.includes('全部可拖拽物料') && summary.innerText.includes('全部')); })()" },
      { label: "物料架构分层存在", expression: "(() => { const summary = document.querySelector('[data-testid=\"material-architecture-summary\"]'); return Boolean(summary && summary.innerText.includes('物料分层') && summary.innerText.includes('通用物料') && summary.innerText.includes('业务物料')); })()" },
      { label: "发布检查存在", expression: "document.body.innerText.includes('发布检查')" },
      { label: "发布风险摘要存在", expression: "document.querySelector('.publish-risk-summary') && (document.body.innerText.includes('发布检查已通过') || document.body.innerText.includes('可以生成预览，仍有提醒') || document.body.innerText.includes('发布前需要处理阻塞项'))" },
      { label: "编辑器发布面板宿主扩展位存在", expression: "document.querySelector('[data-testid=\"host-delivery-policy\"]') && document.querySelector('[data-testid=\"host-approval-policy\"]') && document.querySelector('[data-testid=\"host-publish-check-policy\"]') && document.querySelector('[data-testid=\"host-release-policy-button\"]')" },
      { label: "默认大促模板包含增强活动头图", expression: "document.querySelector('.phone-frame .mlc-activity-hero img') && document.body.innerText.includes('夏日好物节')" },
      { label: "默认大促模板包含直播入口", expression: "document.body.innerText.includes('今晚 8 点直播专场')" },
      { label: "默认大促模板包含品牌专题", expression: "document.body.innerText.includes('夏日品牌馆')" },
      { label: "默认大促模板包含商品榜单", expression: "document.body.innerText.includes('夏日热卖榜')" },
      { label: "默认大促模板包含区块标题", expression: "document.body.innerText.includes('今日主推') && document.body.innerText.includes('先领券，再逛精选好物')" },
      { label: "默认大促模板包含图片卡片宫格", expression: "document.body.innerText.includes('专题会场') && document.body.innerText.includes('女装会场')" },
      { label: "默认大促模板包含增强公告条", expression: "document.querySelector('.phone-frame .mlc-notice-bar') && document.body.innerText.includes('活动期间下单即享限时补贴')" },
      { label: "默认大促模板包含增强富文本", expression: "document.querySelector('.phone-frame .mlc-rich-text') && document.body.innerText.includes('活动说明')" },
      { label: "默认大促模板包含基础按钮", expression: "document.body.innerText.includes('基础按钮示例')" },
      { label: "默认大促模板包含基础链接", expression: "document.querySelector('.phone-frame [data-lowcode-node-id=\"summer_basic_link\"] .mlc-basic-link a[href=\"/activity/summer-guide\"]') && document.body.innerText.includes('查看基础链接示例')" },
      { label: "默认大促模板包含基础提示", expression: "(() => { const alert = document.querySelector('.phone-frame [data-lowcode-node-id=\"summer_basic_alert\"] .mlc-basic-alert'); return Boolean(alert && alert.innerText.includes('基础提示示例') && alert.innerText.includes('不接远程消息中心') && alert.className.includes('mlc-basic-alert--warning')); })()" },
      { label: "默认大促模板包含基础状态块", expression: "(() => { const block = document.querySelector('.phone-frame [data-lowcode-node-id=\"summer_basic_state_block\"] .mlc-basic-state-block'); return Boolean(block && block.innerText.includes('基础状态块示例') && block.innerText.includes('不接远程状态协议') && block.innerText.includes('刷新状态') && block.className.includes('mlc-basic-state-block--empty')); })()" },
      { label: "默认大促模板包含基础进度条", expression: "(() => { const progress = document.querySelector('.phone-frame [data-lowcode-node-id=\"summer_basic_progress\"] .mlc-basic-progress'); return Boolean(progress && progress.innerText.includes('基础进度条示例') && progress.innerText.includes('不接远程进度协议') && progress.innerText.includes('72%') && progress.className.includes('mlc-basic-progress--success') && progress.querySelector('[role=\"progressbar\"][aria-valuenow=\"72\"]')); })()" },
      { label: "默认大促模板包含基础输入框", expression: "document.body.innerText.includes('基础输入框示例') && Array.from(document.querySelectorAll('.phone-frame input')).some((item) => item.getAttribute('placeholder') === '请输入想看的活动品类')" },
      { label: "默认大促模板包含基础多行输入", expression: "document.body.innerText.includes('基础多行输入示例') && Array.from(document.querySelectorAll('.phone-frame textarea')).some((item) => item.getAttribute('placeholder') === '请输入活动备注或补充说明')" },
      { label: "默认大促模板包含基础选择框", expression: "document.body.innerText.includes('基础选择框示例') && Array.from(document.querySelectorAll('.phone-frame select')).some((item) => item.querySelector('option[value=\"women\"]') && item.querySelector('option[value=\"accessories\"]'))" },
      { label: "默认大促模板包含基础单选组", expression: "document.body.innerText.includes('基础单选组示例') && document.querySelector('.phone-frame .mlc-basic-radio-group [role=\"radiogroup\"] [role=\"radio\"][aria-checked=\"true\"]')" },
      { label: "默认大促模板包含基础步进器", expression: "document.body.innerText.includes('基础步进器示例') && (() => { const stepper = document.querySelector('.phone-frame .mlc-basic-stepper'); return Boolean(stepper && stepper.innerText.includes('2') && Array.from(stepper.querySelectorAll('button')).some((item) => item.textContent?.trim() === '+')); })()" },
      { label: "默认大促模板包含基础开关", expression: "document.body.innerText.includes('基础开关示例') && document.querySelector('.phone-frame .mlc-basic-switch [role=\"switch\"][aria-checked=\"true\"]')" },
      { label: "默认大促模板包含基础复选框", expression: "document.body.innerText.includes('基础复选框示例') && document.querySelector('.phone-frame .mlc-basic-checkbox [role=\"checkbox\"][aria-checked=\"true\"]')" },
      { label: "默认大促模板包含基础文本", expression: "document.body.innerText.includes('基础文本示例')" },
      { label: "默认大促模板包含基础价格", expression: "document.querySelector('.phone-frame .mlc-basic-price') && document.body.innerText.includes('¥199起')" },
      { label: "默认大促模板包含分割线", expression: "document.querySelector('.phone-frame .mlc-divider-block')" },
      { label: "默认大促模板包含基础图片", expression: "document.querySelector('.phone-frame .mlc-basic-image img[alt=\"基础图片示例\"]')" },
      { label: "默认大促模板包含基础标签", expression: "document.body.innerText.includes('基础标签示例')" },
      { label: "默认大促模板包含基础图文卡片", expression: "document.querySelector('.phone-frame .mlc-basic-card') && document.body.innerText.includes('基础图文卡片示例') && document.body.innerText.includes('周末轻旅行穿搭')" },
      { label: "默认大促模板包含网格容器", expression: "(() => { const body = document.querySelector('.phone-frame [data-lowcode-node-id=\"summer_grid_container\"] .mlc-grid-container__body'); return Boolean(body && getComputedStyle(body).display === 'grid' && body.children.length === 2 && document.body.innerText.includes('网格容器示例') && document.body.innerText.includes('¥299封顶')); })()" },
      { label: "默认大促模板包含基础视频", expression: "document.querySelector('.phone-frame .mlc-basic-video video') && document.body.innerText.includes('夏日穿搭视频')" },
      { label: "默认大促模板包含基础弹窗", expression: "document.querySelector('.phone-frame .mlc-basic-modal') && document.body.innerText.includes('查看基础弹窗')" },
      { label: "默认大促模板包含基础表单", expression: "(() => { const form = document.querySelector('.phone-frame [data-lowcode-node-id=\"summer_basic_form\"] .mlc-basic-form'); return Boolean(form && form.querySelector('.mlc-basic-form__fields .mlc-basic-input') && form.querySelector('.mlc-basic-form__fields .mlc-basic-checkbox') && form.innerText.includes('基础表单示例') && form.innerText.includes('提交表单')); })()" },
      { label: "默认大促模板包含基础列表", expression: "(() => { const list = document.querySelector('.phone-frame [data-lowcode-node-id=\"summer_basic_list\"] .mlc-basic-list'); return Boolean(list && list.innerText.includes('基础列表示例') && list.innerText.includes('确认页面主题') && list.querySelectorAll('.mlc-basic-list__item').length === 3); })()" },
      { label: "默认大促模板包含基础折叠面板", expression: "(() => { const accordion = document.querySelector('.phone-frame [data-lowcode-node-id=\"summer_basic_accordion\"] .mlc-basic-accordion'); return Boolean(accordion && accordion.innerText.includes('基础折叠面板示例') && accordion.innerText.includes('什么时候适合使用？') && accordion.innerText.includes('当页面内容较长') && accordion.querySelectorAll('.mlc-basic-accordion__item').length === 3 && accordion.querySelector('.mlc-basic-accordion__trigger[aria-expanded=\"true\"]')); })()" },
      { label: "默认大促模板包含基础时间线", expression: "(() => { const timeline = document.querySelector('.phone-frame [data-lowcode-node-id=\"summer_basic_timeline\"] .mlc-basic-timeline'); return Boolean(timeline && timeline.innerText.includes('基础时间线示例') && timeline.innerText.includes('准备素材和文案') && timeline.querySelectorAll('.mlc-basic-timeline__item').length === 3); })()" },
      { label: "默认大促模板包含标签内容切换", expression: "document.body.innerText.includes('活动信息') && document.body.innerText.includes('活动亮点')" },
      { label: "默认大促模板包含倒计时", expression: "document.body.innerText.includes('大促限时抢') && document.body.innerText.includes('距离本轮活动结束') && document.body.innerText.includes('08') && document.body.innerText.includes('30')" },
      { label: "默认大促模板包含间距块", expression: "document.querySelector('.phone-frame .mlc-spacer-block')" },
      { label: "默认大促模板包含增强容器布局", expression: "(() => { const el = document.querySelector('.phone-frame [data-lowcode-node-id=\"summer_container\"] .mlc-section-container'); if (!el) return false; const style = getComputedStyle(el); const body = el.querySelector('.mlc-section-container__body'); return style.borderTopWidth === '1px' && style.boxShadow !== 'none' && Boolean(body) && getComputedStyle(body).gap === '10px'; })()" },
      { label: "默认大促模板包含底部转化条", expression: "document.body.innerText.includes('限时福利') && document.body.innerText.includes('立即抢购')" },
      { label: "属性面板分组存在", expression: "document.body.innerText.includes('内容配置') && document.body.innerText.includes('样式配置')" },
      { label: "Vue H5 画布节点已渲染", expression: "document.querySelectorAll('.phone-frame [data-lowcode-node-id]').length >= 3" },
    ]);
    await assertBasicFormSubmitValues(page);
    await assertEditorViewportSwitch(page);
    await assertActivityRuleModal(page, "Vue3 编辑器内置画布");
    await assertBasicModal(page, "Vue3 编辑器内置画布", "查看基础弹窗", "基础弹窗示例");
    await assertTabsBlockSwitch(page, "Vue3 编辑器内置画布");
    await assertInspectorGroups(page);
    await assertOutlineNavigator(page);
    await assertEditorWorkflow(page);
    await assertPage(page, editorWorkflowDemoUrl, [
      {
        label: "编辑器 workflow provider 可展示他人锁定",
        expression: "document.querySelector('.capability-pill[data-capability-status-id=\"collaboration\"]')?.textContent?.includes('他人正在编辑')",
      },
      {
        label: "编辑器 workflow provider 可展示审批中",
        expression: "document.querySelector('.capability-pill[data-capability-status-id=\"approval\"]')?.textContent?.includes('审批中')",
      },
    ]);
    await assertEditorReadonlyMaterialInsert(page);
    await assertEditorApprovalActions(page);
    await assertEditorHttpConfigPlatform(page);

    await assertPage(page, editorRuntimeUrl, [
      { label: "编辑器内置 runtime shell 已挂载", expression: "document.querySelector('.runtime-shell')" },
      { label: "编辑器内置 runtime 有 H5 页面", expression: "document.querySelector('[data-lowcode-page]')" },
      { label: "编辑器内置 runtime 标题存在", expression: "document.body.innerText.includes('夏日好物节')" },
      { label: "编辑器内置 runtime 包含增强活动头图", expression: "document.querySelector('[data-lowcode-page] .mlc-activity-hero img') && document.body.innerText.includes('夏日好物节')" },
      { label: "编辑器内置 runtime 包含直播入口", expression: "document.body.innerText.includes('今晚 8 点直播专场')" },
      { label: "编辑器内置 runtime 包含品牌专题", expression: "document.body.innerText.includes('夏日品牌馆')" },
      { label: "编辑器内置 runtime 包含商品榜单", expression: "document.body.innerText.includes('夏日热卖榜')" },
      { label: "编辑器内置 runtime 包含区块标题", expression: "document.body.innerText.includes('今日主推') && document.body.innerText.includes('先领券，再逛精选好物')" },
      { label: "编辑器内置 runtime 包含图片卡片宫格", expression: "document.body.innerText.includes('专题会场') && document.body.innerText.includes('女装会场')" },
      { label: "编辑器内置 runtime 包含增强公告条", expression: "document.querySelector('[data-lowcode-page] .mlc-notice-bar') && document.body.innerText.includes('活动期间下单即享限时补贴')" },
      { label: "编辑器内置 runtime 包含增强富文本", expression: "document.querySelector('[data-lowcode-page] .mlc-rich-text') && document.body.innerText.includes('活动说明')" },
      { label: "编辑器内置 runtime 包含基础按钮", expression: "document.body.innerText.includes('基础按钮示例')" },
      { label: "编辑器内置 runtime 包含基础链接", expression: "document.querySelector('[data-lowcode-node-id=\"summer_basic_link\"] .mlc-basic-link a[href=\"/activity/summer-guide\"]') && document.body.innerText.includes('查看基础链接示例')" },
      { label: "编辑器内置 runtime 包含基础提示", expression: "(() => { const alert = document.querySelector('[data-lowcode-node-id=\"summer_basic_alert\"] .mlc-basic-alert'); return Boolean(alert && alert.innerText.includes('基础提示示例') && alert.innerText.includes('查看说明') && alert.className.includes('mlc-basic-alert--warning')); })()" },
      { label: "编辑器内置 runtime 包含基础状态块", expression: "(() => { const block = document.querySelector('[data-lowcode-node-id=\"summer_basic_state_block\"] .mlc-basic-state-block'); return Boolean(block && block.innerText.includes('基础状态块示例') && block.innerText.includes('刷新状态') && block.className.includes('mlc-basic-state-block--empty')); })()" },
      { label: "编辑器内置 runtime 包含基础进度条", expression: "(() => { const progress = document.querySelector('[data-lowcode-node-id=\"summer_basic_progress\"] .mlc-basic-progress'); return Boolean(progress && progress.innerText.includes('基础进度条示例') && progress.innerText.includes('72%') && progress.querySelector('[role=\"progressbar\"][aria-valuenow=\"72\"]')); })()" },
      { label: "编辑器内置 runtime 包含基础输入框", expression: "document.body.innerText.includes('基础输入框示例') && document.querySelector('[data-lowcode-page] input[placeholder=\"请输入想看的活动品类\"]')" },
      { label: "编辑器内置 runtime 包含基础多行输入", expression: "document.body.innerText.includes('基础多行输入示例') && document.querySelector('[data-lowcode-page] textarea[placeholder=\"请输入活动备注或补充说明\"]')" },
      { label: "编辑器内置 runtime 包含基础选择框", expression: "document.body.innerText.includes('基础选择框示例') && Array.from(document.querySelectorAll('[data-lowcode-page] select')).some((item) => item.querySelector('option[value=\"women\"]'))" },
      { label: "编辑器内置 runtime 包含基础单选组", expression: "document.body.innerText.includes('基础单选组示例') && document.querySelector('[data-lowcode-page] .mlc-basic-radio-group [role=\"radiogroup\"] [role=\"radio\"][aria-checked=\"true\"]')" },
      { label: "编辑器内置 runtime 包含基础步进器", expression: "document.body.innerText.includes('基础步进器示例') && (() => { const stepper = document.querySelector('[data-lowcode-page] .mlc-basic-stepper'); return Boolean(stepper && stepper.innerText.includes('2') && Array.from(stepper.querySelectorAll('button')).some((item) => item.textContent?.trim() === '+')); })()" },
      { label: "编辑器内置 runtime 包含基础开关", expression: "document.body.innerText.includes('基础开关示例') && document.querySelector('[data-lowcode-page] .mlc-basic-switch [role=\"switch\"][aria-checked=\"true\"]')" },
      { label: "编辑器内置 runtime 包含基础复选框", expression: "document.body.innerText.includes('基础复选框示例') && document.querySelector('[data-lowcode-page] .mlc-basic-checkbox [role=\"checkbox\"][aria-checked=\"true\"]')" },
      { label: "编辑器内置 runtime 包含基础文本", expression: "document.body.innerText.includes('基础文本示例')" },
      { label: "编辑器内置 runtime 包含基础价格", expression: "document.querySelector('[data-lowcode-page] .mlc-basic-price') && document.body.innerText.includes('¥199起')" },
      { label: "编辑器内置 runtime 包含分割线", expression: "document.querySelector('[data-lowcode-page] .mlc-divider-block')" },
      { label: "编辑器内置 runtime 包含基础图片", expression: "document.querySelector('[data-lowcode-page] .mlc-basic-image img[alt=\"基础图片示例\"]')" },
      { label: "编辑器内置 runtime 包含基础标签", expression: "document.body.innerText.includes('基础标签示例')" },
      { label: "编辑器内置 runtime 包含基础图文卡片", expression: "document.querySelector('[data-lowcode-page] .mlc-basic-card') && document.body.innerText.includes('基础图文卡片示例') && document.body.innerText.includes('周末轻旅行穿搭')" },
      { label: "编辑器内置 runtime 包含网格容器", expression: "(() => { const body = document.querySelector('[data-lowcode-node-id=\"summer_grid_container\"] .mlc-grid-container__body'); return Boolean(body && getComputedStyle(body).display === 'grid' && body.children.length === 2 && document.body.innerText.includes('网格容器示例') && document.body.innerText.includes('¥299封顶')); })()" },
      { label: "编辑器内置 runtime 包含基础视频", expression: "document.querySelector('[data-lowcode-page] .mlc-basic-video video') && document.body.innerText.includes('夏日穿搭视频')" },
      { label: "编辑器内置 runtime 包含基础弹窗", expression: "document.querySelector('[data-lowcode-page] .mlc-basic-modal') && document.body.innerText.includes('查看基础弹窗')" },
      { label: "编辑器内置 runtime 包含基础表单", expression: "(() => { const form = document.querySelector('[data-lowcode-node-id=\"summer_basic_form\"] .mlc-basic-form'); return Boolean(form && form.querySelector('.mlc-basic-form__fields .mlc-basic-input') && form.querySelector('.mlc-basic-form__fields .mlc-basic-checkbox') && form.innerText.includes('基础表单示例') && form.innerText.includes('提交表单')); })()" },
      { label: "编辑器内置 runtime 包含基础列表", expression: "(() => { const list = document.querySelector('[data-lowcode-node-id=\"summer_basic_list\"] .mlc-basic-list'); return Boolean(list && list.innerText.includes('基础列表示例') && list.innerText.includes('预览并提交发布') && list.querySelectorAll('.mlc-basic-list__item').length === 3); })()" },
      { label: "编辑器内置 runtime 包含基础折叠面板", expression: "(() => { const accordion = document.querySelector('[data-lowcode-node-id=\"summer_basic_accordion\"] .mlc-basic-accordion'); return Boolean(accordion && accordion.innerText.includes('基础折叠面板示例') && accordion.innerText.includes('点击可以埋点吗？') && accordion.querySelectorAll('.mlc-basic-accordion__item').length === 3 && accordion.querySelector('.mlc-basic-accordion__trigger[aria-expanded=\"true\"]')); })()" },
      { label: "编辑器内置 runtime 包含基础时间线", expression: "(() => { const timeline = document.querySelector('[data-lowcode-node-id=\"summer_basic_timeline\"] .mlc-basic-timeline'); return Boolean(timeline && timeline.innerText.includes('基础时间线示例') && timeline.innerText.includes('提交发布流程') && timeline.querySelectorAll('.mlc-basic-timeline__item').length === 3); })()" },
      { label: "编辑器内置 runtime 包含标签内容切换", expression: "document.body.innerText.includes('活动信息') && document.body.innerText.includes('活动亮点')" },
      { label: "编辑器内置 runtime 包含倒计时", expression: "document.body.innerText.includes('大促限时抢') && document.body.innerText.includes('距离本轮活动结束') && document.body.innerText.includes('08') && document.body.innerText.includes('30')" },
      { label: "编辑器内置 runtime 包含间距块", expression: "document.querySelector('.mlc-spacer-block')" },
      { label: "编辑器内置 runtime 包含增强容器布局", expression: "(() => { const el = document.querySelector('[data-lowcode-node-id=\"summer_container\"] .mlc-section-container'); if (!el) return false; const style = getComputedStyle(el); const body = el.querySelector('.mlc-section-container__body'); return style.borderTopWidth === '1px' && style.boxShadow !== 'none' && Boolean(body) && getComputedStyle(body).gap === '10px'; })()" },
      { label: "编辑器内置 runtime 包含底部转化条", expression: "document.body.innerText.includes('限时福利') && document.body.innerText.includes('立即抢购')" },
    ]);

    await assertPage(page, h5RuntimeUrl, [
      { label: "React H5 runtime shell 已挂载", expression: "document.querySelector('.runtime-shell')" },
      { label: "React H5 phone frame 已挂载", expression: "document.querySelector('.phone-frame')" },
      { label: "React H5 页面容器已渲染", expression: "document.querySelector('[data-lowcode-page]')" },
      { label: "React H5 标识存在", expression: "document.body.innerText.includes('React H5')" },
      { label: "React H5 诊断面板展示请求入口", expression: "document.body.innerText.includes('请求入口') && document.body.innerText.includes('sample fallback')" },
      { label: "React H5 诊断面板展示实际来源", expression: "document.body.innerText.includes('实际来源') && document.body.innerText.includes('fallback schema')" },
      { label: "React H5 健康摘要展示 fallback warning", expression: "(() => { const el = document.querySelector('[data-testid=\"runtime-health-summary\"]'); return Boolean(el && el.getAttribute('data-runtime-health') === 'warning' && el.innerText.includes('H5 runtime 已进入提醒状态')); })()" },
      { label: "React H5 诊断面板展示本地入口", expression: "document.body.innerText.includes('本地入口') && document.body.innerText.includes('Empty')" },
      { label: "React H5 增强活动头图已渲染", expression: "document.querySelector('[data-lowcode-page] .mlc-activity-hero img') && document.body.innerText.includes('夏日好物节')" },
      { label: "React H5 直播入口已渲染", expression: "document.body.innerText.includes('今晚 8 点直播专场')" },
      { label: "React H5 品牌专题已渲染", expression: "document.body.innerText.includes('夏日品牌馆')" },
      { label: "React H5 商品榜单已渲染", expression: "document.body.innerText.includes('夏日热卖榜')" },
      { label: "React H5 区块标题已渲染", expression: "document.body.innerText.includes('今日主推') && document.body.innerText.includes('先领券，再逛精选好物')" },
      { label: "React H5 图片卡片宫格已渲染", expression: "document.body.innerText.includes('专题会场') && document.body.innerText.includes('女装会场')" },
      { label: "React H5 增强公告条已渲染", expression: "document.querySelector('[data-lowcode-page] .mlc-notice-bar') && document.body.innerText.includes('活动期间下单即享限时补贴')" },
      { label: "React H5 增强富文本已渲染", expression: "document.querySelector('[data-lowcode-page] .mlc-rich-text') && document.body.innerText.includes('运营说明')" },
      { label: "React H5 增强商品列表已渲染", expression: "document.querySelector('[data-lowcode-page] .mlc-product-list') && document.body.innerText.includes('轻盈通勤手提包')" },
      { label: "React H5 基础按钮已渲染", expression: "document.body.innerText.includes('基础按钮示例')" },
      { label: "React H5 基础链接已渲染", expression: "document.querySelector('[data-lowcode-node-id=\"node_basic_link\"] .mlc-basic-link a[href=\"/activity/react-h5-guide\"]') && document.body.innerText.includes('React H5 基础链接示例')" },
      { label: "React H5 基础提示已渲染", expression: "(() => { const alert = document.querySelector('[data-lowcode-node-id=\"node_basic_alert\"] .mlc-basic-alert'); return Boolean(alert && alert.innerText.includes('React H5 基础提示示例') && alert.innerText.includes('记录提示点击') && alert.className.includes('mlc-basic-alert--info')); })()" },
      { label: "React H5 基础状态块已渲染", expression: "(() => { const block = document.querySelector('[data-lowcode-node-id=\"node_basic_state_block\"] .mlc-basic-state-block'); return Boolean(block && block.innerText.includes('React H5 基础状态块示例') && block.innerText.includes('记录状态点击') && block.className.includes('mlc-basic-state-block--success')); })()" },
      { label: "React H5 基础进度条已渲染", expression: "(() => { const progress = document.querySelector('[data-lowcode-node-id=\"node_basic_progress\"] .mlc-basic-progress'); return Boolean(progress && progress.innerText.includes('React H5 基础进度条示例') && progress.innerText.includes('72%') && progress.querySelector('[role=\"progressbar\"][aria-valuenow=\"72\"]')); })()" },
      { label: "React H5 基础输入框已渲染", expression: "document.body.innerText.includes('基础输入框示例') && document.querySelector('[data-lowcode-page] input[placeholder=\"请输入想看的活动品类\"]')" },
      { label: "React H5 基础多行输入已渲染", expression: "document.body.innerText.includes('基础多行输入示例') && document.querySelector('[data-lowcode-page] textarea[placeholder=\"请输入活动备注或补充说明\"]')" },
      { label: "React H5 基础选择框已渲染", expression: "document.body.innerText.includes('基础选择框示例') && Array.from(document.querySelectorAll('[data-lowcode-page] select')).some((item) => item.querySelector('option[value=\"women\"]'))" },
      { label: "React H5 基础单选组已渲染", expression: "document.body.innerText.includes('基础单选组示例') && document.querySelector('[data-lowcode-page] .mlc-basic-radio-group [role=\"radiogroup\"] [role=\"radio\"][aria-checked=\"true\"]')" },
      { label: "React H5 基础步进器已渲染", expression: "document.body.innerText.includes('基础步进器示例') && (() => { const stepper = document.querySelector('[data-lowcode-page] .mlc-basic-stepper'); return Boolean(stepper && stepper.innerText.includes('2') && Array.from(stepper.querySelectorAll('button')).some((item) => item.textContent?.trim() === '+')); })()" },
      { label: "React H5 基础开关已渲染", expression: "document.body.innerText.includes('基础开关示例') && document.querySelector('[data-lowcode-page] .mlc-basic-switch [role=\"switch\"][aria-checked=\"true\"]')" },
      { label: "React H5 基础复选框已渲染", expression: "document.body.innerText.includes('基础复选框示例') && document.querySelector('[data-lowcode-page] .mlc-basic-checkbox [role=\"checkbox\"][aria-checked=\"true\"]')" },
      { label: "React H5 基础文本已渲染", expression: "document.body.innerText.includes('基础文本示例')" },
      { label: "React H5 基础价格已渲染", expression: "document.querySelector('[data-lowcode-page] .mlc-basic-price') && document.body.innerText.includes('¥199起')" },
      { label: "React H5 分割线已渲染", expression: "document.querySelector('[data-lowcode-page] .mlc-divider-block')" },
      { label: "React H5 基础图片已渲染", expression: "document.querySelector('[data-lowcode-page] .mlc-basic-image img[alt=\"基础图片示例\"]')" },
      { label: "React H5 基础标签已渲染", expression: "document.body.innerText.includes('基础标签示例')" },
      { label: "React H5 基础图文卡片已渲染", expression: "document.querySelector('[data-lowcode-page] .mlc-basic-card') && document.body.innerText.includes('基础图文卡片示例') && document.body.innerText.includes('周末轻旅行穿搭')" },
      { label: "React H5 网格容器已渲染", expression: "(() => { const body = document.querySelector('[data-lowcode-node-id=\"node_grid_container\"] .mlc-grid-container__body'); return Boolean(body && getComputedStyle(body).display === 'grid' && body.children.length === 2 && document.body.innerText.includes('React H5 网格容器示例') && document.body.innerText.includes('¥299封顶')); })()" },
      { label: "React H5 基础视频已渲染", expression: "document.querySelector('[data-lowcode-page] .mlc-basic-video video') && document.body.innerText.includes('React H5 视频示例')" },
      { label: "React H5 基础弹窗已渲染", expression: "document.querySelector('[data-lowcode-page] .mlc-basic-modal') && document.body.innerText.includes('查看 React H5 基础弹窗')" },
      { label: "React H5 基础表单已渲染", expression: "(() => { const form = document.querySelector('[data-lowcode-node-id=\"node_basic_form\"] .mlc-basic-form'); return Boolean(form && form.querySelector('.mlc-basic-form__fields .mlc-basic-input') && form.querySelector('.mlc-basic-form__fields .mlc-basic-checkbox') && form.innerText.includes('React H5 基础表单示例') && form.innerText.includes('提交表单')); })()" },
      { label: "React H5 基础列表已渲染", expression: "(() => { const list = document.querySelector('[data-lowcode-node-id=\"node_basic_list\"] .mlc-basic-list'); return Boolean(list && list.innerText.includes('React H5 基础列表示例') && list.innerText.includes('组件保持通用') && list.querySelectorAll('.mlc-basic-list__item').length === 3); })()" },
      { label: "React H5 基础折叠面板已渲染", expression: "(() => { const accordion = document.querySelector('[data-lowcode-node-id=\"node_basic_accordion\"] .mlc-basic-accordion'); return Boolean(accordion && accordion.innerText.includes('React H5 基础折叠面板示例') && accordion.innerText.includes('基础层负责什么？') && accordion.innerText.includes('基础折叠面板只负责静态内容') && accordion.querySelectorAll('.mlc-basic-accordion__item').length === 3 && accordion.querySelector('.mlc-basic-accordion__trigger[aria-expanded=\"true\"]')); })()" },
      { label: "React H5 基础时间线已渲染", expression: "(() => { const timeline = document.querySelector('[data-lowcode-node-id=\"node_basic_timeline\"] .mlc-basic-timeline'); return Boolean(timeline && timeline.innerText.includes('React H5 基础时间线示例') && timeline.innerText.includes('确认物料边界') && timeline.querySelectorAll('.mlc-basic-timeline__item').length === 3); })()" },
      { label: "React H5 标签内容切换已渲染", expression: "document.body.innerText.includes('活动信息') && document.body.innerText.includes('活动亮点')" },
      { label: "React H5 倒计时已渲染", expression: "document.body.innerText.includes('大促限时抢') && document.body.innerText.includes('距离本轮活动结束') && document.body.innerText.includes('08') && document.body.innerText.includes('30')" },
      { label: "React H5 留资表单已渲染", expression: "document.body.innerText.includes('预约专属搭配顾问') && document.body.innerText.includes('提交预约')" },
      { label: "React H5 间距块已渲染", expression: "document.querySelector('.phone-frame .mlc-spacer-block')" },
      { label: "React H5 增强容器布局已渲染", expression: "(() => { const el = document.querySelector('[data-lowcode-node-id=\"node_container\"] .mlc-section-container'); if (!el) return false; const style = getComputedStyle(el); const body = el.querySelector('.mlc-section-container__body'); return style.borderTopWidth === '1px' && style.boxShadow !== 'none' && Boolean(body) && getComputedStyle(body).gap === '10px'; })()" },
      { label: "React H5 底部转化条已渲染", expression: "document.body.innerText.includes('限时福利') && document.body.innerText.includes('立即抢购')" },
      { label: "React H5 物料节点已渲染", expression: "document.querySelectorAll('[data-lowcode-node-id]').length >= 3" },
    ]);
    await assertActivityRuleModal(page, "React H5 runtime");
    await assertBasicModal(page, "React H5 runtime", "查看 React H5 基础弹窗", "React H5 基础弹窗");
    await assertTabsBlockSwitch(page, "React H5 runtime");
    await assertReactRuntimeBasicFormSubmitValues(page);

    await assertPage(page, h5RuntimeHttpUrl, [
      { label: "React H5 HTTP 配置平台入口可打开", expression: "document.querySelector('.runtime-shell') && document.body.innerText.includes('配置平台')" },
      { label: "React H5 HTTP 配置平台模式展示", expression: `document.body.innerText.includes(${jsString(`http ${configPlatformSmokeUrl}`)})` },
      { label: "React H5 HTTP 数据源模式展示", expression: "document.body.innerText.includes('数据源模式') && document.body.innerText.includes('http')" },
      { label: "React H5 HTTP 动作模式展示", expression: "document.body.innerText.includes('动作模式') && document.body.innerText.includes('http')" },
      { label: "React H5 HTTP 配置平台命中 published schema", expression: "document.body.innerText.includes('published schema') && document.body.innerText.includes('smoke-http-page')" },
      { label: "React H5 HTTP 健康摘要为 healthy", expression: "(() => { const el = document.querySelector('[data-testid=\"runtime-health-summary\"]'); return Boolean(el && el.getAttribute('data-runtime-health') === 'healthy' && el.innerText.includes('H5 runtime 正常')); })()" },
      { label: "React H5 HTTP 配置平台页面已渲染", expression: "document.querySelector('[data-lowcode-page]') && document.body.innerText.includes('HTTP 配置平台页面')" },
      { label: "React H5 HTTP action 按钮已渲染", expression: "Array.from(document.querySelectorAll('.phone-frame button')).some((item) => item.innerText.includes('HTTP 动作按钮'))" },
      { label: "React H5 HTTP 数据源商品已渲染", expression: "document.body.innerText.includes('HTTP 数据源手提包') && document.body.innerText.includes('HTTP 数据源凉鞋')" },
      { label: "React H5 HTTP 数据源商品列表样式已渲染", expression: "document.querySelector('[data-lowcode-page] .mlc-product-list .mlc-product-list__item') && document.body.innerText.includes('来自 BFF mock')" },
      { label: "React H5 HTTP 数据源状态已记录", expression: "document.body.innerText.includes('smoke_http_products_ds') && document.body.innerText.includes('绑定到 products')" },
    ]);
    await page.clickByText(".phone-frame button", "HTTP 动作按钮");
    await page.waitForExpression("document.body.innerText.includes('模拟埋点：smoke_http_action_click')");
    if (
      !configPlatformRequests.some((request) => {
        return request.method === "GET"
          && request.url === "/api/lowcode/pages/smoke-http-page/published"
          && request.authorization === "Bearer smoke-token";
      })
    ) {
      fail("HTTP 配置平台 mock 未收到带 authorization 的 published schema 请求");
    }
    if (
      !configPlatformRequests.some((request) => {
        return request.method === "GET"
          && request.url?.startsWith("/api/lowcode/data/products/by-ids")
          && request.url.includes("ids=http_sku_001")
          && request.url.includes("limit=2")
          && request.authorization === "Bearer smoke-token";
      })
    ) {
      fail("HTTP 数据源 mock 未收到带 authorization 的 product.byIds 请求");
    }
    if (
      !configPlatformRequests.some((request) => {
        return request.method === "POST"
          && request.url === "/api/lowcode/actions/tracking-click"
          && request.authorization === "Bearer smoke-token"
          && request.body?.actionId === "smoke_http_tracking_click"
          && request.body?.type === "tracking.click"
          && request.body?.params?.eventName === "smoke_http_action_click"
          && request.body?.refParams?.nodeId === "smoke_http_action_button"
          && request.body?.pageId === "smoke-http-page";
      })
    ) {
      fail("HTTP action mock 未收到带 authorization 和 action context 的 tracking.click 请求");
    }
    log("通过：React H5 runtime 可通过 env 使用 HTTP 配置平台 client、HTTP 数据源 handler 和 HTTP action handler 并透传 authorization");

    await assertPage(page, h5RuntimePageIdUrl, [
      { label: "React H5 pageId 入口可打开", expression: "document.querySelector('.runtime-shell') && document.body.innerText.includes('pageId')" },
      { label: "React H5 pageId 命中 published schema", expression: "document.body.innerText.includes('published schema') && document.body.innerText.includes('summer-campaign-demo')" },
      { label: "React H5 pageId 健康摘要为 healthy", expression: "(() => { const el = document.querySelector('[data-testid=\"runtime-health-summary\"]'); return Boolean(el && el.getAttribute('data-runtime-health') === 'healthy' && el.innerText.includes('H5 runtime 正常')); })()" },
      { label: "React H5 pageId 页面非空", expression: "document.querySelector('[data-lowcode-page]') && document.body.innerText.includes('夏日好物节')" },
      { label: "React H5 pageId 渲染增强公告条", expression: "document.querySelector('[data-lowcode-page] .mlc-notice-bar') && document.body.innerText.includes('活动期间下单即享限时补贴')" },
      { label: "React H5 pageId 渲染基础图片轮播", expression: "document.querySelector('.mlc-basic-carousel') && document.body.innerText.includes('夏日新品首发')" },
      { label: "React H5 pageId 渲染基础链接", expression: "document.querySelector('.mlc-basic-link') && document.body.innerText.includes('React H5 基础链接示例')" },
      { label: "React H5 pageId 渲染基础提示", expression: "document.querySelector('.mlc-basic-alert') && document.body.innerText.includes('React H5 基础提示示例')" },
      { label: "React H5 pageId 渲染基础状态块", expression: "document.querySelector('.mlc-basic-state-block') && document.body.innerText.includes('React H5 基础状态块示例')" },
      { label: "React H5 pageId 渲染基础进度条", expression: "document.querySelector('.mlc-basic-progress') && document.body.innerText.includes('React H5 基础进度条示例')" },
      { label: "React H5 pageId 渲染基础列表", expression: "document.querySelector('.mlc-basic-list') && document.body.innerText.includes('React H5 基础列表示例')" },
      { label: "React H5 pageId 渲染基础折叠面板", expression: "document.querySelector('.mlc-basic-accordion') && document.body.innerText.includes('React H5 基础折叠面板示例')" },
      { label: "React H5 pageId 渲染基础视频", expression: "document.querySelector('.mlc-basic-video video') && document.body.innerText.includes('React H5 视频示例')" },
    ]);

    await assertPage(page, h5RuntimePreviewTokenUrl, [
      { label: "React H5 previewToken 入口可打开", expression: "document.querySelector('.runtime-shell') && document.body.innerText.includes('previewToken')" },
      { label: "React H5 previewToken 命中 preview schema", expression: "document.body.innerText.includes('preview token') && document.body.innerText.includes('preview_demo_token')" },
      { label: "React H5 previewToken 渲染预览版本", expression: "document.body.innerText.includes('夏日好物节预览') && document.body.innerText.includes('preview-20260801-demo')" },
    ]);

    await assertPage(page, h5RuntimeReleaseIdUrl, [
      { label: "React H5 releaseId 入口可打开", expression: "document.querySelector('.runtime-shell') && document.body.innerText.includes('releaseId')" },
      { label: "React H5 releaseId 命中 release schema", expression: "document.body.innerText.includes('release schema') && document.body.innerText.includes('preview_demo')" },
      { label: "React H5 releaseId 渲染预览版本", expression: "document.body.innerText.includes('夏日好物节预览') && document.body.innerText.includes('preview-20260801-demo')" },
    ]);

    await assertPage(page, h5RuntimeMissingPageUrl, [
      { label: "React H5 missing pageId 入口可打开", expression: "document.querySelector('.runtime-shell') && document.body.innerText.includes('missing-page')" },
      { label: "React H5 missing pageId 展示 fallback 原因", expression: "document.body.innerText.includes('Lowcode published schema not found: missing-page') && document.body.innerText.includes('已启用 fallback')" },
      { label: "React H5 missing pageId 健康摘要为 warning", expression: "(() => { const el = document.querySelector('[data-testid=\"runtime-health-summary\"]'); return Boolean(el && el.getAttribute('data-runtime-health') === 'warning' && el.innerText.includes('Schema 来源')); })()" },
      { label: "React H5 missing pageId fallback 后页面仍非空", expression: "document.querySelector('[data-lowcode-page]') && document.body.innerText.includes('夏日好物节')" },
    ]);

    await assertPage(page, h5RuntimeEmptyUrl, [
      { label: "React H5 empty demo shell 已挂载", expression: "document.querySelector('.runtime-shell') && document.body.innerText.includes('empty demo')" },
      { label: "React H5 empty demo 展示安全空态", expression: "document.body.innerText.includes('空页面演示') && document.body.innerText.includes('页面暂无内容，H5 runtime 已进入安全空态')" },
      { label: "React H5 empty demo 健康摘要展示空态 warning", expression: "(() => { const el = document.querySelector('[data-testid=\"runtime-health-summary\"]'); return Boolean(el && el.getAttribute('data-runtime-health') === 'warning' && el.innerText.includes('页面暂无节点')); })()" },
      { label: "React H5 empty demo 节点数为 0", expression: "document.body.innerText.includes('节点数') && document.body.innerText.includes('0')" },
    ]);

    await assertPage(page, h5RuntimeBrokenUrl, [
      { label: "React H5 broken demo shell 已挂载", expression: "document.querySelector('.runtime-shell') && document.body.innerText.includes('broken demo')" },
      { label: "React H5 broken demo 页面非空", expression: "document.querySelector('[data-lowcode-page]') && document.body.innerText.includes('异常兜底演示')" },
      { label: "React H5 broken demo 展示未知物料兜底", expression: "document.querySelector('[data-lowcode-missing=\"MissingMaterialBlock\"]') && document.body.innerText.includes('缺少物料：MissingMaterialBlock')" },
      { label: "React H5 broken demo 展示异常物料兜底", expression: "document.querySelector('[data-lowcode-error=\"node_broken_material\"]') && document.body.innerText.includes('组件渲染失败：BrokenBlock')" },
      { label: "React H5 broken demo 记录渲染错误", expression: "document.body.innerText.includes('node_broken_material: BrokenBlock render failed')" },
      { label: "React H5 broken demo 健康摘要展示渲染 warning", expression: "(() => { const el = document.querySelector('[data-testid=\"runtime-health-summary\"]'); return Boolean(el && el.getAttribute('data-runtime-health') === 'warning' && el.innerText.includes('渲染兜底')); })()" },
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
