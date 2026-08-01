# TASK-2026-0801-137-h5-runtime-http-config-client

## 状态

verified

## 目标

让 React H5 runtime playground 可以通过环境变量切换 `LowcodeConfigPlatformClient`：默认继续使用本地 mock，配置 Java 地址后使用 `createHttpConfigPlatformClient` 拉取 `releaseId` 或 `pageId` 对应的 Page Schema，为后续 `hybird-meumall` 真实 H5 接入提供可验证参考。

## 背景

当前 React H5 runtime playground 已通过 `loadLowcodeRuntimeSchema` 支持 `schema`、`releaseId`、`pageId` 和 fallback schema，但 `configPlatformClient` 仍固定为 App 内联的本地 mock。要接近真实 H5 渲染场景，运行态应能在不改 renderer/materials/schema 的情况下，把配置平台 client 从本地 mock 替换为 Java HTTP client。

## 涉及包或系统

- `apps/h5-runtime-playground`
- `@meumall/lowcode-adapters`
- `.ai-workspace/contracts`
- `.ai-workspace/tasks`
- `.ai/test-reports`
- `.ai/PROJECT_STATE.md`
- `.ai/TODO.md`
- `.ai/AI_CONTEXT.md`

## 范围

包含：

- 新增 H5 runtime 配置平台 client 工厂。
- 支持 `VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL` 选择 HTTP client。
- 支持可选 `VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION` 透传 authorization header，便于本地联调。
- 保留默认本地 mock 行为，确保现有 smoke 不依赖外部 Java 服务。
- 在 H5 runtime 诊断面板展示当前配置平台模式。
- 更新 README、H5 集成文档、AI 状态和验证报告。

不包含：

- Java 服务端实现。
- 编辑器保存、发布、审批和自动草稿改成异步 HTTP。
- 真实鉴权登录态、CSRF、签名、错误码映射和刷新 token。
- 修改 Page Schema v1、renderer 或物料 manifest。
- `hybird-meumall` 真实业务仓库接入。

## 责任边界

当前仓库：

- 提供 H5 runtime playground 的本地/HTTP client 切换参考。
- 保持 `loadLowcodeRuntimeSchema`、renderer 和 materials 的包边界不变。

外部系统：

- Java 配置平台后续负责实现 `releaseId`、`pageId` 查询 API、鉴权、缓存和错误码。
- `hybird-meumall` 后续负责按自身环境变量、登录态和 BFF 规范注入真实 client。

## 契约影响

- 是否影响跨包或跨系统契约：是，补充 H5 runtime 使用 Java 配置平台 HTTP client 的接入说明。
- 契约文档路径：`.ai-workspace/contracts/h5-runtime-integration-v1.md`
- 是否向后兼容：是，默认仍使用本地 mock。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：真实 H5 接入时建议按环境变量灰度。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`docs/meumall-integration.md`、`.ai-workspace/contracts/h5-runtime-integration-v1.md`
- 需要确认的角色：H5 接入负责人、Java 配置平台负责人。
- 当前确认状态：前端参考实现，待真实 Java 服务确认。

## 实现计划

1. 新增 H5 runtime config platform client 工厂，按 env 选择本地 mock 或 HTTP client。
2. App 使用工厂返回的 client，并在诊断面板展示模式。
3. 更新 H5 runtime README 和集成契约说明 env。
4. 更新 AI 状态、TODO 和验证报告。
5. 运行 `pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm smoke:browser`。

## 验收标准

- [x] 默认不配置 env 时，H5 runtime 仍使用本地 mock，现有 pageId/releaseId demo 可用。
- [x] 配置 `VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL` 时，H5 runtime 使用 `createHttpConfigPlatformClient`。
- [x] 可选 `VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION` 能透传 authorization header。
- [x] H5 runtime 诊断面板展示当前 client 模式。
- [x] README 和 H5 集成契约说明 env 用法。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] 项目状态、TODO 和验证报告已更新。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm smoke:browser
```

## 发布影响

- 是否需要发布：暂不发布。
- 发布对象：无；本任务只改 playground 和文档。
- 是否影响 schema 兼容性：否。
- 是否影响 H5 接入：是，新增 H5 runtime HTTP client 环境变量参考。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证默认本地 mock 仍可用。

## 风险和阻塞

- 真实 Java API 尚未确认响应包装、鉴权和错误码；HTTP client 仍按直接返回业务对象处理。
- 本任务不解决编辑器保存/发布的异步 HTTP 化，编辑器真实 Java 接入需后续单独任务。

## 验证结果

2026-08-01：

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，包含构建、架构检查和 75 个 Node 测试用例。
- `pnpm smoke:browser` 通过，包含默认本地 mock H5 runtime、HTTP config client H5 runtime、临时 config platform HTTP mock、published schema 加载和 authorization header 透传验证。
- 验证报告：`.ai/test-reports/TASK-2026-0801-137-h5-runtime-http-config-client.md`

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 明确 H5 runtime 先支持 env 切换本地 mock/HTTP client。 |
| 2026-08-01 | in_progress | 开始实现 H5 runtime config platform client 工厂和诊断面板模式展示。 |
| 2026-08-01 | verified | 完成 H5 runtime 本地/HTTP client 工厂、env 说明、browser smoke HTTP 模式和授权头验证。 |
