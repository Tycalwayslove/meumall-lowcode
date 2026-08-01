#!/usr/bin/env node

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const publicPackages = new Map([
  ["packages/design-tokens", "@meumall/lowcode-design-tokens"],
  ["packages/primitives-react-h5", "@meumall/lowcode-primitives-react-h5"],
  ["packages/primitives-vue-h5", "@meumall/lowcode-primitives-vue-h5"],
  ["packages/schema", "@meumall/lowcode-schema"],
  ["packages/core", "@meumall/lowcode-core"],
  ["packages/renderer-h5", "@meumall/lowcode-renderer-h5"],
  ["packages/materials-h5", "@meumall/lowcode-materials-h5"],
  ["packages/runtime-react-h5", "@meumall/lowcode-runtime-react-h5"],
  ["packages/renderer-vue-h5", "@meumall/lowcode-renderer-vue-h5"],
  ["packages/materials-vue-h5", "@meumall/lowcode-materials-vue-h5"],
  ["packages/editor", "@meumall/lowcode-editor"],
  ["packages/adapters", "@meumall/lowcode-adapters"],
]);

const apps = new Map([
  ["apps/editor-playground", "@meumall/lowcode-editor-playground"],
  ["apps/h5-runtime-playground", "@meumall/lowcode-h5-runtime-playground"],
]);

const allowedInternalDeps = new Map([
  ["@meumall/lowcode-design-tokens", []],
  ["@meumall/lowcode-primitives-react-h5", ["@meumall/lowcode-design-tokens"]],
  ["@meumall/lowcode-primitives-vue-h5", ["@meumall/lowcode-design-tokens"]],
  ["@meumall/lowcode-schema", []],
  ["@meumall/lowcode-core", ["@meumall/lowcode-schema"]],
  ["@meumall/lowcode-renderer-h5", ["@meumall/lowcode-core", "@meumall/lowcode-schema"]],
  ["@meumall/lowcode-materials-h5", ["@meumall/lowcode-core", "@meumall/lowcode-primitives-react-h5", "@meumall/lowcode-schema"]],
  [
    "@meumall/lowcode-runtime-react-h5",
    [
      "@meumall/lowcode-adapters",
      "@meumall/lowcode-core",
      "@meumall/lowcode-materials-h5",
      "@meumall/lowcode-renderer-h5",
      "@meumall/lowcode-schema",
    ],
  ],
  ["@meumall/lowcode-renderer-vue-h5", ["@meumall/lowcode-core", "@meumall/lowcode-schema"]],
  [
    "@meumall/lowcode-materials-vue-h5",
    ["@meumall/lowcode-core", "@meumall/lowcode-primitives-vue-h5", "@meumall/lowcode-renderer-vue-h5", "@meumall/lowcode-schema"],
  ],
  ["@meumall/lowcode-editor", ["@meumall/lowcode-core", "@meumall/lowcode-schema"]],
  ["@meumall/lowcode-adapters", ["@meumall/lowcode-schema"]],
  [
    "@meumall/lowcode-editor-playground",
    [
      "@meumall/lowcode-adapters",
      "@meumall/lowcode-core",
      "@meumall/lowcode-editor",
      "@meumall/lowcode-materials-vue-h5",
      "@meumall/lowcode-renderer-vue-h5",
      "@meumall/lowcode-schema",
    ],
  ],
  [
    "@meumall/lowcode-h5-runtime-playground",
    [
      "@meumall/lowcode-adapters",
      "@meumall/lowcode-core",
      "@meumall/lowcode-materials-h5",
      "@meumall/lowcode-renderer-h5",
      "@meumall/lowcode-runtime-react-h5",
      "@meumall/lowcode-schema",
    ],
  ],
]);

const knownInternalPackages = new Set([...publicPackages.values(), ...apps.values()]);
const sourceExtensions = new Set([".ts", ".tsx", ".vue", ".mjs"]);
const requiredPackageFiles = ["package.json", "README.md"];
const requiredPublishFiles = ["dist", "README.md"];

const failures = [];

function log(message) {
  process.stdout.write(`[architecture-check] ${message}\n`);
}

function fail(message) {
  failures.push(message);
}

async function readJson(filePath) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function toRelative(filePath) {
  return path.relative(rootDir, filePath);
}

function sortedUnique(values) {
  return Array.from(new Set(values)).sort((left, right) => left.localeCompare(right));
}

function collectInternalDeps(packageJson) {
  const groups = [packageJson.dependencies, packageJson.devDependencies, packageJson.peerDependencies, packageJson.optionalDependencies];
  const deps = [];

  for (const group of groups) {
    if (!group) continue;
    for (const name of Object.keys(group)) {
      if (name.startsWith("@meumall/")) deps.push(name);
    }
  }

  return sortedUnique(deps);
}

function assertAllowedDependency(ownerName, dependencyName, source) {
  if (dependencyName === ownerName) return;
  if (!knownInternalPackages.has(dependencyName)) {
    fail(`${source}: 引用了未登记的内部包 ${dependencyName}`);
    return;
  }
  const allowed = allowedInternalDeps.get(ownerName) ?? [];
  if (!allowed.includes(dependencyName)) {
    fail(`${source}: ${ownerName} 不允许依赖 ${dependencyName}`);
  }
}

async function assertPublicPackageShape(relativeDir, expectedName) {
  const packageDir = path.join(rootDir, relativeDir);

  for (const file of requiredPackageFiles) {
    if (!(await pathExists(path.join(packageDir, file)))) {
      fail(`${relativeDir}: 缺少 ${file}`);
    }
  }

  const sourceEntrypoints = ["src/index.ts", "src/index.tsx"];
  const sourceEntrypointExists = await Promise.all(sourceEntrypoints.map((file) => pathExists(path.join(packageDir, file))));
  if (!sourceEntrypointExists.some(Boolean)) {
    fail(`${relativeDir}: 缺少 src/index.ts 或 src/index.tsx`);
  }

  const packageJson = await readJson(path.join(packageDir, "package.json"));
  if (packageJson.name !== expectedName) {
    fail(`${relativeDir}: package name 应为 ${expectedName}，实际为 ${packageJson.name}`);
  }
  if (packageJson.private === true) {
    fail(`${relativeDir}: 可发布包不应设置 private=true`);
  }
  if (packageJson.type !== "module") {
    fail(`${relativeDir}: package.json type 应为 module`);
  }
  if (packageJson.main !== "./dist/index.js") {
    fail(`${relativeDir}: main 应为 ./dist/index.js`);
  }
  if (packageJson.types !== "./dist/index.d.ts") {
    fail(`${relativeDir}: types 应为 ./dist/index.d.ts`);
  }
  if (packageJson.exports?.["."]?.default !== "./dist/index.js" || packageJson.exports?.["."]?.types !== "./dist/index.d.ts") {
    fail(`${relativeDir}: exports[\".\"] 应指向 dist/index.js 和 dist/index.d.ts`);
  }
  for (const file of requiredPublishFiles) {
    if (!Array.isArray(packageJson.files) || !packageJson.files.includes(file)) {
      fail(`${relativeDir}: files 应包含 ${file}`);
    }
  }
  if (packageJson.publishConfig?.access !== "public") {
    fail(`${relativeDir}: publishConfig.access 应为 public`);
  }

  const deps = collectInternalDeps(packageJson);
  for (const dep of deps) {
    assertAllowedDependency(expectedName, dep, `${relativeDir}/package.json`);
  }
}

async function assertAppShape(relativeDir, expectedName) {
  const packageDir = path.join(rootDir, relativeDir);
  const packageJson = await readJson(path.join(packageDir, "package.json"));
  if (packageJson.name !== expectedName) {
    fail(`${relativeDir}: app package name 应为 ${expectedName}，实际为 ${packageJson.name}`);
  }
  if (packageJson.private !== true) {
    fail(`${relativeDir}: app 应设置 private=true`);
  }

  const deps = collectInternalDeps(packageJson);
  for (const dep of deps) {
    assertAllowedDependency(expectedName, dep, `${relativeDir}/package.json`);
  }
}

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "dist" || entry.name === "node_modules") continue;
      files.push(...(await walkFiles(filePath)));
      continue;
    }
    if (entry.isFile() && sourceExtensions.has(path.extname(entry.name))) {
      files.push(filePath);
    }
  }

  return files;
}

function ownerNameForFile(filePath) {
  const relative = toRelative(filePath);
  const parts = relative.split(path.sep);
  if (parts.length < 2) return undefined;

  const ownerDir = `${parts[0]}/${parts[1]}`;
  return publicPackages.get(ownerDir) ?? apps.get(ownerDir);
}

function extractInternalImports(source) {
  const imports = [];
  const patterns = [
    /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["'](@meumall\/lowcode-[^"']+)["']/g,
    /(?:import|require)\(["'](@meumall\/lowcode-[^"']+)["']\)/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source))) {
      imports.push(match[1]);
    }
  }

  return sortedUnique(imports);
}

function normalizeInternalImport(specifier, filePath) {
  const parts = specifier.split("/");
  const packageName = parts.slice(0, 2).join("/");
  if (parts.length > 2) {
    fail(`${toRelative(filePath)}: 不允许通过子路径导入内部包 ${specifier}，请使用公开入口 ${packageName}`);
  }
  return packageName;
}

async function assertSourceImports() {
  const files = [...(await walkFiles(path.join(rootDir, "packages"))), ...(await walkFiles(path.join(rootDir, "apps")))];

  for (const file of files) {
    const ownerName = ownerNameForFile(file);
    if (!ownerName) continue;
    const source = await readFile(file, "utf8");
    const imports = extractInternalImports(source).map((item) => normalizeInternalImport(item, file));

    for (const dependencyName of imports) {
      assertAllowedDependency(ownerName, dependencyName, toRelative(file));
    }

    if (source.includes("hybird-meumall") || source.includes("server-meumall") || source.includes("admin-meumall")) {
      fail(`${toRelative(file)}: packages/apps 源码不应直接绑定外部业务项目内部路径或历史项目名`);
    }
  }
}

async function assertMaterialManifestParity() {
  const reactSourcePath = path.join(rootDir, "packages/materials-h5/src/index.tsx");
  const vueSourcePath = path.join(rootDir, "packages/materials-vue-h5/src/index.ts");
  const reactSource = await readFile(reactSourcePath, "utf8");
  const vueSource = await readFile(vueSourcePath, "utf8");
  const reactNames = extractComponentNames(reactSource);
  const vueNames = extractComponentNames(vueSource);
  const primitiveNames = ["MlcButton", "MlcImage", "MlcTag", "MlcText", "MlcPrice", "MlcInput", "MlcTextarea", "MlcSwitch", "MlcStepper"];

  if (reactNames.length === 0) fail(`${toRelative(reactSourcePath)}: 未找到 React H5 物料 componentName`);
  if (vueNames.length === 0) fail(`${toRelative(vueSourcePath)}: 未找到 Vue H5 物料 componentName`);
  if (JSON.stringify(reactNames) !== JSON.stringify(vueNames)) {
    fail(`React/Vue H5 物料 componentName 顺序不一致：React=${reactNames.join(", ")} Vue=${vueNames.join(", ")}`);
  }

  for (const primitiveName of primitiveNames) {
    if (reactNames.includes(primitiveName)) fail(`React runtime primitive ${primitiveName} 不应注册为低代码物料`);
    if (vueNames.includes(primitiveName)) fail(`Vue runtime primitive ${primitiveName} 不应注册为低代码物料`);
  }
}

function extractComponentNames(source) {
  const names = [];
  const pattern = /componentName:\s*"([^"]+)"/g;
  let match;
  while ((match = pattern.exec(source))) {
    names.push(match[1]);
  }
  return names;
}

async function main() {
  log("检查可发布包结构和 package.json 依赖方向");
  for (const [relativeDir, expectedName] of publicPackages) {
    await assertPublicPackageShape(relativeDir, expectedName);
  }

  log("检查 app package.json 依赖方向");
  for (const [relativeDir, expectedName] of apps) {
    await assertAppShape(relativeDir, expectedName);
  }

  log("检查源码 import 依赖方向");
  await assertSourceImports();

  log("检查 React/Vue H5 物料 manifest 对齐和 primitives 边界");
  await assertMaterialManifestParity();

  if (failures.length) {
    for (const failure of failures) {
      process.stderr.write(`[architecture-check] 失败：${failure}\n`);
    }
    process.exitCode = 1;
    return;
  }

  log("架构边界检查通过。");
}

main().catch((error) => {
  process.stderr.write(`[architecture-check] 失败：${error.message}\n`);
  process.exitCode = 1;
});
