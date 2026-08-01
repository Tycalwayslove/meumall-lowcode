# TASK-2026-0801-179 H5 runtime previewToken 预览入口

## 状态

verified

## 目标

为低代码 H5 runtime 增加 `previewToken` 预览入口协议雏形，让编辑器生成预览后可以通过更接近生产的 token 链路打开对应 React H5 runtime，而不是只依赖本地 URL schema handoff 或 releaseId。

## 背景

当前 `loadLowcodeRuntimeSchema` 已支持 `encodedSchema -> releaseId -> pageId -> fallbackSchema`。契约和 TODO 已多次提到正式环境应切到 Java 配置平台的 `previewToken/releaseId/pageId` 查询协议，但实现层还没有 `previewToken`。为了让“可实操编辑器 + 对应渲染 H5”的链路更接近后续生产形态，需要先在 adapters、playground 和契约中补齐 previewToken 的向后兼容入口。

## 涉及包或系统

- `packages/adapters`
- `apps/h5-runtime-playground`
- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai-workspace/contracts/java-config-platform-api-v1.md`
- `.ai-workspace/contracts/h5-runtime-integration-v1.md`
- `docs/meumall-integration.md`
- `.ai/`

## 范围

包含：

- `LowcodeConfigPlatformClient` 新增可选 `getPreviewByToken(previewToken)` 方法。
- `loadLowcodeRuntimeSchema` 新增 `previewToken` 输入，返回新的 `source = "preview"`。
- HTTP config platform client 新增 `GET /api/lowcode/pages/previews/{previewToken}`。
- React H5 runtime playground 支持 `?previewToken=...` 并在诊断面板展示来源。
- Vue3 editor playground 的本地 mock 预览 release 生成可演示 previewToken，并在 H5 预览入口展示 token 链接。
- browser smoke 覆盖 previewToken 入口和渲染结果。
- 更新 Java 配置平台契约、H5 runtime 集成契约、简版集成文档、changeset、测试报告和 AI 状态。

不包含：

- 不改变 Page Schema v1、Material Manifest v1、renderer 或 materials 协议。
- 不实现真实 Java 配置平台服务端。
- 不改变现有 `releaseId`、`pageId` 和 `encodedSchema` 链路。
- 不实现 token 过期、签名、鉴权、权限、审计、灰度或 CDN 缓存策略。
- 不执行真实 npm 发布或 GitHub release。

## 责任边界

当前仓库：

- 提供 adapters 层 previewToken 加载协议和 playground mock 验证。
- 保持 renderer 只消费 Page Schema，不知道 previewToken。
- 通过 smoke 证明 React H5 runtime 可以按 previewToken 加载预览 schema。

外部系统：

- Java 配置平台后续负责生成、存储、校验、过期和审计 previewToken。
- `hybird-meumall` 后续按契约在真实路由中接入该 token 查询能力。

## 契约影响

- 是否影响跨包或跨系统契约：影响 `@meumall/lowcode-adapters` 公开 API、Java 配置平台 API 草案和 H5 runtime 集成契约。
- 契约文档路径：`.ai-workspace/contracts/java-config-platform-api-v1.md`、`.ai-workspace/contracts/h5-runtime-integration-v1.md`、`docs/meumall-integration.md`、本任务文件。
- 是否向后兼容：是，新增可选方法、可选入参和新的 source 枚举，不破坏既有 releaseId/pageId。
- 是否需要迁移：不需要。
- 是否需要灰度或双版本兼容：真实生产启用时 Java/H5 可灰度开放 previewToken 路由，但本任务不执行线上灰度。

## 对接说明

- Java 配置平台后续应在生成预览接口响应中返回 previewToken，或由前端按 release metadata 取 token；本任务先在 mock release 上提供 token 字段用于演示。
- H5 runtime 生产建议优先使用 `previewToken` 打开预览页，正式线上页面仍使用 `pageId` active published schema。

## 验收标准

- [x] adapters 类型和 loader 支持 `previewToken`。
- [x] HTTP config platform client 调用 `GET /api/lowcode/pages/previews/{previewToken}`。
- [x] React H5 runtime playground 支持 `?previewToken=preview_demo_token` 并展示 preview 来源。
- [x] Vue3 editor playground 生成预览后能打开 previewToken 链接。
- [x] browser smoke 覆盖 previewToken 入口。
- [x] 契约文档说明 previewToken 优先级、API 和生产边界。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
```

## 验证结果

- 2026-08-01：`pnpm typecheck` 通过。
- 2026-08-01：`pnpm test` 通过，构建、架构边界检查和 121 个 Node test 均通过。
- 2026-08-01：`pnpm smoke:browser` 通过，覆盖 Vue3 编辑器 HTTP 模式生成预览后的 previewToken 链接，以及 React H5 runtime `?previewToken=preview_demo_token` 加载预览 schema。

## 发布影响

- 是否需要发布：本任务不执行真实 npm 发布。
- 发布对象：后续发布时涉及 `@meumall/lowcode-adapters` minor。
- 是否影响 schema 兼容性：否。
- 是否影响 H5 接入：是，新增可选 previewToken 预览入口；旧 releaseId/pageId 入口不变。
- 是否影响 Java 配置平台：是，需要后续服务端确认 token 生成、查询、过期、鉴权和审计策略。
- 是否需要 GitHub tag/release：本任务不需要。
- 回滚目标：回滚本任务提交即可恢复仅 releaseId/pageId 的 runtime 加载协议。
- smoke check：`pnpm smoke:browser`。

## 风险和阻塞

- previewToken 只是预览入口，不应被用于正式线上页面访问。
- token 安全策略未在本任务落地，真实生产接入前必须由 Java 配置平台确认过期、签名、权限和审计。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 H5 runtime previewToken 预览入口和 playground 验证。 |
| 2026-08-01 | verified | 新增 adapters previewToken loader、HTTP client 查询方法、Vue3 编辑器 token 预览入口、React H5 runtime token 入口、契约文档和 smoke 覆盖；`pnpm typecheck`、`pnpm test`、`pnpm smoke:browser` 均通过。 |
