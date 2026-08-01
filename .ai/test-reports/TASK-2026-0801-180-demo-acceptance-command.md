# TASK-2026-0801-180 本地演示验收命令验证报告

## 验证时间

2026-08-01

## 验证命令

```bash
pnpm demo:acceptance
pnpm typecheck
```

## 验证结果

- `pnpm demo:acceptance`：通过，脚本启动 Vue3 editor playground 和 React H5 runtime playground，检查 7 个本地演示入口后自动退出。
- `pnpm typecheck`：通过，TypeScript project references、Vue3 editor playground 和 React H5 runtime playground 类型检查均通过。

## 覆盖范围

- 根级 `package.json` 新增 `demo:acceptance`。
- `scripts/dev-demo.mjs` 新增 `--acceptance` 模式。
- 验收入口包含：
  - `http://127.0.0.1:5173/`
  - `http://127.0.0.1:5173/?runtime=1&pageId=summer-campaign-demo`
  - `http://127.0.0.1:5173/?runtime=1&previewToken=preview_demo_token`
  - `http://127.0.0.1:5174/`
  - `http://127.0.0.1:5174/?pageId=summer-campaign-demo`
  - `http://127.0.0.1:5174/?releaseId=preview_demo`
  - `http://127.0.0.1:5174/?previewToken=preview_demo_token`
- README 已说明 `dev:demo`、`demo:check`、`demo:acceptance` 和 `smoke:browser` 的关系。

## 未覆盖和风险

- `demo:acceptance` 只验证本地 SPA 入口和关键 URL 可访问性，不验证浏览器运行后的 DOM 内容。
- 浏览器 DOM、交互和物料渲染仍由 `pnpm smoke:browser` 覆盖。
- 本任务不执行真实 npm 发布、GitHub release、Java 配置平台接入或 `hybird-meumall` 真实 H5 路由接入。
