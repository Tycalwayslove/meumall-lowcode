# TASK-2026-0801-137-h5-runtime-http-config-client 验证报告

## 日期

2026-08-01

## 任务

接入 H5 runtime 配置平台 HTTP client 环境开关。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm smoke:browser
```

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过，Vue3 editor playground 和 React H5 runtime playground 均成功构建。
- `pnpm test` 通过，包含构建、架构检查和 75 个 Node 测试用例。
- `pnpm smoke:browser` 通过：
  - 默认 H5 runtime 仍使用本地 mock，并保持 `pageId=summer-campaign-demo`、`releaseId=preview_demo`、missing pageId、empty demo 和 broken demo 可用。
  - 新增 HTTP config client H5 runtime playground 由 `VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL` 启用。
  - 临时 config platform HTTP mock 收到 `GET /api/lowcode/pages/smoke-http-page/published` 请求。
  - `VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION="Bearer smoke-token"` 已透传为 authorization header。
  - H5 runtime 诊断面板展示 `配置平台: http <baseUrl>`，并渲染 HTTP mock 返回的 Page Schema。

## 未验证项

- 未接真实 Java 配置平台。
- 未验证真实登录态、CSRF、签名、token 刷新、统一响应包装和业务错误码映射。
- 未将 Vue3 编辑器保存、预览、发布、审批和自动草稿全部改为异步 HTTP。

## 剩余风险

- Java 配置平台 API 仍是前端草案，真实接入时需要确认响应包装、CORS/网关、鉴权、缓存和错误码。
- 当前 HTTP env 开关只在 H5 runtime playground 落地；编辑器真实 Java HTTP client 注入仍需单独任务处理。
