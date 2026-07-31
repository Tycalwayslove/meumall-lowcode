# TASK-2026-0801-077-h5-runtime-local-platform

## 标题

打通 React H5 runtime 本地 pageId/releaseId 加载

## 状态

verified

## 目标

在不修改 Page Schema、renderer、materials、adapters 公开 API 的前提下，为 `apps/h5-runtime-playground` 增加符合 `LowcodeConfigPlatformClient` 语义的本地配置平台模拟，让 React H5 runtime playground 的 `?pageId=...` 和 `?releaseId=...` 入口真正通过 `loadLowcodeRuntimeSchema` 加载 published/release schema，而不是只能展示缺少配置平台 client 的 fallback 原因。

## 背景

当前 React H5 runtime playground 已支持运行诊断、fallback 原因和 empty demo，但 `pageId` / `releaseId` 因没有配置平台 client 仍会落到 fallback。为了更接近未来 `hybird-meumall` 通过 Java 配置平台按 pageId/releaseId 拉取 schema 的生产链路，本任务补一个 app 内本地 client，用同一 adapter 协议模拟 published schema 与 preview release schema。

## 涉及包或系统

- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `docs/meumall-integration.md`
- `.ai/`

## 范围

包含：

- H5 runtime playground 内新增本地 `LowcodeConfigPlatformClient`。
- `?pageId=summer-campaign-demo` 返回 sample published schema，实际来源展示 `published schema`。
- `?releaseId=preview_demo` 返回 preview release schema，实际来源展示 `release schema`。
- 未命中的 `pageId` / `releaseId` 仍展示 fallback 原因。
- browser smoke 覆盖 pageId 命中、releaseId 命中和 pageId 未命中 fallback。
- README 和 H5 接入文档补充本地配置平台模拟说明。
- 更新任务记录和 `.ai` 项目事实源。

不包含：

- 不接入真实 Java HTTP 接口。
- 不修改 `@meumall/lowcode-adapters` 的 `LowcodeConfigPlatformClient`。
- 不修改 Page Schema v1。
- 不修改 React H5 renderer 或 materials 包。
- 不修改 `hybird-meumall` 真实业务仓库。
- 不新增 npm 包版本或 changeset。

## 责任边界

当前仓库：

- runtime playground 负责用本地 client 演示 pageId/releaseId 加载形态。
- browser smoke 负责验证本地 H5 runtime 入口。
- 文档负责说明本地 client 与真实 Java 配置平台的差异。

外部系统：

- Java 配置平台仍负责真实 schema 存储、发布、查询、审批和审计。
- `hybird-meumall` 后续仍需接真实 HTTP client 和路由。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：不新增契约；仍遵循 `.ai-workspace/contracts/h5-runtime-integration-v1.md` 和 `.ai-workspace/contracts/java-config-platform-api-v1.md`。
- 是否向后兼容：是。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是，更新 `docs/meumall-integration.md` 和 `apps/h5-runtime-playground/README.md`。
- 需要确认的角色：后续真实接入时需 H5 和 Java 配置平台负责人确认接口、鉴权、缓存和错误包装。
- 当前确认状态：本任务无需外部确认。

## 实现计划

1. 将任务状态流转为 `in_progress`。
2. 在 H5 runtime playground 中实现本地 config platform client。
3. 调整诊断面板入口说明，区分命中和 fallback。
4. 补充 browser smoke 覆盖 pageId/releaseId 命中和 fallback。
5. 更新文档和项目事实源。
6. 运行验证命令并记录结果。

## 验收标准

- [x] `?pageId=summer-campaign-demo` 通过本地 client 加载 published schema。
- [x] `?releaseId=preview_demo` 通过本地 client 加载 release schema。
- [x] `?pageId=missing-page` 展示 fallback 原因且页面不白屏。
- [x] 诊断面板能展示请求入口和实际来源。
- [x] browser smoke 覆盖 pageId 命中、releaseId 命中、pageId fallback。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm smoke:browser
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：只增强本地接入参考，不改变 H5 npm 包 API。
- 回滚目标：回滚本任务提交。
- smoke check：使用 `pnpm smoke:browser` 验证 editor、内置 runtime、React H5 runtime 和本地 pageId/releaseId 入口。

## 风险和阻塞

- 本地 client 只模拟 Java 配置平台查询语义，不代表真实接口性能、鉴权、缓存和错误包装。
- 真实接入仍需替换为 `createHttpConfigPlatformClient` 或业务封装 client。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 React H5 runtime playground 本地 pageId/releaseId 加载。 |
| 2026-08-01 | in_progress | 开始实现本地配置平台 client、H5 runtime 入口、smoke 覆盖和文档更新。 |
| 2026-08-01 | verified | 完成本地 `LowcodeConfigPlatformClient`、pageId published 加载、releaseId preview 加载、missing pageId fallback、文档和 smoke 覆盖；`pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm smoke:browser` 均通过。 |
