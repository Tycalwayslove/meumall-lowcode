# TASK-2026-0801-180 本地演示验收命令

## 状态

verified

## 目标

新增一个面向协作者和演示前自检的本地验收命令，快速确认 Vue3 编辑器 playground、编辑器内置 H5 runtime 入口、独立 React H5 runtime 的 pageId、releaseId 和 previewToken 关键入口可访问。

## 背景

当前根目录已有 `pnpm dev:demo` 和 `pnpm demo:check`。前者会常驻启动编辑器和 H5 runtime，后者只做基础 HTTP 健康检查后退出。随着 previewToken、交付清单和实操清单补齐，本地协作还缺一个介于健康检查和完整 `pnpm smoke:browser` 之间的轻量验收入口，用于在演示或交接前明确输出关键 URL、检查范围和验收结论。

## 涉及包或系统

- `scripts/dev-demo.mjs`
- `package.json`
- `README.md`
- `.ai/`

## 范围

包含：

- 新增根级 `pnpm demo:acceptance` 命令。
- 复用 `scripts/dev-demo.mjs` 同时启动 Vue3 editor playground 和 React H5 runtime playground。
- 检查编辑器首页、编辑器内置 runtime pageId/previewToken 入口、React H5 runtime 首页、pageId、releaseId 和 previewToken 入口的 HTTP 可访问性。
- 输出演示验收清单和关键 URL，命令通过后自动停止本地服务。
- 更新 README、任务记录、项目状态和测试报告。

不包含：

- 不替代 `pnpm smoke:browser` 的 DOM 级交互验证。
- 不新增 browser、Playwright 或其他依赖。
- 不改变 Page Schema v1、Material Manifest v1、renderer、materials、editor 或 adapters 公开 API。
- 不实现真实 Java 配置平台、真实 H5 路由或真实 npm 发布。

## 责任边界

当前仓库：

- 提供本地 demo 验收命令和关键入口清单。
- 明确该命令只验证本地服务与入口可访问性。

外部系统：

- Java 配置平台、真实 H5 业务仓库和 npm 发布流程不受本任务改动影响。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 是否向后兼容：是，只新增根级脚本命令和文档。
- 是否需要迁移：不需要。
- 是否需要灰度或双版本兼容：不需要。

## 对接说明

- 协作者需要本地快速确认演示入口时运行 `pnpm demo:acceptance`。
- 需要完整交互、渲染内容和浏览器 DOM 验证时仍运行 `pnpm smoke:browser`。

## 验收标准

- [x] 根级 `package.json` 提供 `demo:acceptance`。
- [x] `pnpm demo:acceptance` 能启动两个 playground，检查关键入口后自动退出。
- [x] README 说明 `demo:acceptance` 与 `dev:demo`、`demo:check`、`smoke:browser` 的关系。
- [x] 不改变 schema、renderer、materials、editor 或 adapters 公开 API。
- [x] `pnpm demo:acceptance` 通过。
- [x] `pnpm typecheck` 通过。

## 验证命令

```bash
pnpm demo:acceptance
pnpm typecheck
```

## 验证结果

- 2026-08-01：`pnpm demo:acceptance` 通过，启动 Vue3 editor playground 和 React H5 runtime playground，检查编辑器、编辑器内置 H5 pageId/previewToken、React H5 runtime pageId/releaseId/previewToken 入口后自动退出。
- 2026-08-01：`pnpm typecheck` 通过，TypeScript project references、Vue3 editor playground 和 React H5 runtime playground 类型检查均通过。

## 发布影响

- 是否需要发布：本任务不执行真实 npm 发布。
- 发布对象：无。
- 是否影响 schema 兼容性：否。
- 是否影响 H5 接入：否，新增的是本地演示验收命令。
- 是否影响 Java 配置平台：否。
- 是否需要 GitHub tag/release：不需要。
- 回滚目标：回滚本任务提交即可移除 `demo:acceptance`。
- smoke check：本任务新增轻量验收命令；完整浏览器 smoke 仍使用 `pnpm smoke:browser`。

## 风险和阻塞

- `demo:acceptance` 使用 HTTP 访问检查 SPA 入口，不验证浏览器运行后的 DOM 内容；DOM 和交互正确性仍由 `pnpm smoke:browser` 覆盖。
- 如果本地 5173 或 5174 端口被占用，命令会失败并提示释放端口或通过环境变量调整。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为本地演示验收命令和协作文档。 |
| 2026-08-01 | verified | 新增 `demo:acceptance` 本地演示验收命令、README 说明、项目状态和验证报告；`pnpm demo:acceptance` 与 `pnpm typecheck` 均通过。 |
