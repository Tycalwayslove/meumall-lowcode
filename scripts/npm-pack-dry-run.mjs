#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const rootDir = path.resolve(new URL("..", import.meta.url).pathname);
const packagesDir = path.join(rootDir, "packages");
const requiredPackedFiles = ["package.json", "README.md", "dist/index.js", "dist/index.d.ts"];

function log(message) {
  process.stdout.write(`[pack-dry-run] ${message}\n`);
}

function fail(message) {
  throw new Error(message);
}

async function readJson(filePath) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function discoverPublishablePackages() {
  const entries = await readdir(packagesDir, { withFileTypes: true });
  const packages = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const packageDir = path.join(packagesDir, entry.name);
    const packageJsonPath = path.join(packageDir, "package.json");
    const packageJson = await readJson(packageJsonPath);
    if (packageJson.private) continue;
    packages.push({
      dir: packageDir,
      name: packageJson.name,
      version: packageJson.version,
    });
  }

  return packages.sort((left, right) => left.name.localeCompare(right.name));
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} failed with code ${code}\n${stderr || stdout}`));
    });
  });
}

function parsePackResult(stdout, packageName) {
  try {
    const parsed = JSON.parse(stdout);
    const pack = Array.isArray(parsed) ? parsed[0] : undefined;
    if (!pack?.files || !Array.isArray(pack.files)) {
      fail(`${packageName} npm pack 输出缺少 files 列表`);
    }
    return pack;
  } catch (error) {
    if (error instanceof SyntaxError) {
      fail(`${packageName} npm pack 输出不是合法 JSON`);
    }
    throw error;
  }
}

function assertPackedFiles(pack, packageName) {
  const packedPaths = new Set(pack.files.map((file) => file.path));
  const missingFiles = requiredPackedFiles.filter((file) => !packedPaths.has(file));

  if (missingFiles.length) {
    fail(`${packageName} 缺少打包文件：${missingFiles.join(", ")}`);
  }
}

async function checkPackage(item) {
  log(`检查 ${item.name}@${item.version}`);
  const result = await run("npm", ["pack", "--dry-run", "--json"], item.dir);
  const pack = parsePackResult(result.stdout, item.name);
  assertPackedFiles(pack, item.name);
  log(`通过 ${item.name}：${pack.entryCount ?? pack.files.length} 个文件，${pack.filename}`);
}

async function main() {
  const packages = await discoverPublishablePackages();
  if (!packages.length) fail("未发现可发布包");

  log(`发现 ${packages.length} 个可发布包`);
  for (const item of packages) {
    await checkPackage(item);
  }
  log("所有可发布包 npm pack dry-run 通过");
}

main().catch((error) => {
  process.stderr.write(`[pack-dry-run] 失败：${error.message}\n`);
  process.exitCode = 1;
});
