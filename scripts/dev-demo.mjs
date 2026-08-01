#!/usr/bin/env node

import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const host = process.env.LOWCODE_DEMO_HOST ?? "127.0.0.1";
const editorPort = parsePort(process.env.LOWCODE_EDITOR_PORT ?? "5173", "LOWCODE_EDITOR_PORT");
const h5Port = parsePort(process.env.LOWCODE_H5_PORT ?? "5174", "LOWCODE_H5_PORT");
const checkOnly = process.argv.includes("--check");
const timeoutMs = 30_000;

const editorUrl = `http://${host}:${editorPort}/`;
const h5RuntimeUrl = `http://${host}:${h5Port}/`;
const h5PageIdUrl = `${h5RuntimeUrl}?pageId=summer-campaign-demo`;
const h5ReleaseIdUrl = `${h5RuntimeUrl}?releaseId=preview_demo`;

const processes = [];
let shuttingDown = false;

function parsePort(value, name) {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${name} 必须是 1 到 65535 之间的端口号，当前值：${value}`);
  }
  return port;
}

function log(message) {
  process.stdout.write(`[dev-demo] ${message}\n`);
}

function fail(message) {
  throw new Error(message);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

function spawnVite(name, cwd, port, env = {}) {
  if (!existsSync(cwd)) {
    fail(`${name} 目录不存在：${cwd}`);
  }

  const child = spawn("pnpm", ["exec", "vite", "--host", host, "--port", String(port), "--strictPort"], {
    cwd,
    env: { ...process.env, ...env },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[${name}] ${chunk.toString()}`);
  });
  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[${name}] ${chunk.toString()}`);
  });
  child.on("exit", (code, signal) => {
    if (!shuttingDown && code !== 0) {
      process.stderr.write(`[dev-demo] ${name} 异常退出 code=${code ?? ""} signal=${signal ?? ""}\n`);
      process.exitCode = 1;
      void stopAll();
    }
  });

  processes.push(child);
  return child;
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

async function stopAll() {
  shuttingDown = true;
  for (const child of processes) {
    if (isRunning(child)) child.kill("SIGTERM");
  }
  await delay(500);
  for (const child of processes) {
    if (isRunning(child)) child.kill("SIGKILL");
  }
}

function isRunning(child) {
  return child.exitCode === null && child.signalCode === null;
}

function handleShutdown() {
  void stopAll().then(() => process.exit(0));
}

function printEntries() {
  log("本地低代码演示已启动：");
  log(`编辑器：${editorUrl}`);
  log(`H5 runtime：${h5RuntimeUrl}`);
  log(`H5 published pageId：${h5PageIdUrl}`);
  log(`H5 preview releaseId：${h5ReleaseIdUrl}`);
  log("按 Ctrl+C 停止两个服务。");
}

async function main() {
  process.once("SIGINT", handleShutdown);
  process.once("SIGTERM", handleShutdown);

  await Promise.all([
    assertPortFree(editorPort, "editor playground"),
    assertPortFree(h5Port, "H5 runtime playground"),
  ]);

  spawnVite("editor", path.join(rootDir, "apps/editor-playground"), editorPort, {
    VITE_REACT_H5_RUNTIME_URL: h5RuntimeUrl,
  });
  spawnVite("h5-runtime", path.join(rootDir, "apps/h5-runtime-playground"), h5Port);

  await Promise.all([
    waitForHttp(editorUrl, "editor playground"),
    waitForHttp(h5RuntimeUrl, "H5 runtime playground"),
    waitForHttp(h5PageIdUrl, "H5 published pageId"),
    waitForHttp(h5ReleaseIdUrl, "H5 preview releaseId"),
  ]);

  printEntries();

  if (checkOnly) {
    log("健康检查通过，正在停止本地演示服务。");
    await stopAll();
    return;
  }

  await Promise.race(processes.map((child) => once(child, "exit")));
  await stopAll();
}

main().catch(async (error) => {
  await stopAll();
  process.stderr.write(`[dev-demo] 失败：${error.message}\n`);
  process.exitCode = 1;
});
