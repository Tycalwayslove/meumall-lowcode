# TASK-2026-0801-179 H5 runtime previewToken 预览入口验证报告

## 验证时间

2026-08-01

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
```

## 验证结果

- `pnpm typecheck`：通过，TypeScript project references、Vue3 editor playground 和 React H5 runtime playground 类型检查均通过。
- `pnpm test`：通过，构建、架构边界检查和 121 个 Node test 均通过。
- `pnpm smoke:browser`：通过，覆盖 Vue3 编辑器 HTTP 模式生成预览后的 `previewToken` 链接，以及 React H5 runtime `?previewToken=preview_demo_token` 加载预览 schema。

## 覆盖范围

- `@meumall/lowcode-adapters` 新增 `LowcodeConfigPlatformClient.getPreviewByToken` 可选方法、`LoadRuntimeSchemaInput.previewToken` 和 `source = "preview"`。
- `createHttpConfigPlatformClient` 覆盖 `GET /api/lowcode/pages/previews/{previewToken}`。
- Vue3 editor playground 生成预览后优先打开 previewToken runtime 链接，并在 H5 预览入口展示 token 链接。
- React H5 runtime playground 支持 `?previewToken=preview_demo_token`，诊断面板展示请求入口和 preview 来源。

## 未覆盖和风险

- 本任务不实现真实 Java 配置平台 token 生成、过期、签名、权限、防枚举、审计或 CDN 缓存策略。
- 本任务不执行真实 npm 发布、GitHub release 或 `hybird-meumall` 真实 H5 路由接入。
- previewToken 仅用于预览验收，不作为正式线上页面入口。
