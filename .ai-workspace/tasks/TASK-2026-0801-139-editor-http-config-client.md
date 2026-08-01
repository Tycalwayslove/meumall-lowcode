# TASK-2026-0801-139-editor-http-config-client

## 标题

接入 Vue3 编辑器配置平台 HTTP client 开关

## 状态

verified

## 目标

在保留 Vue3 editor playground 默认 localStorage mock 配置平台的前提下，支持通过环境变量切换到 `createHttpConfigPlatformClient`，并将编辑器保存草稿、生成预览、发布、版本列表、版本载入、审批工作流和自动草稿 snapshot 调用改为兼容异步 client，为后续迁入 Java 管理台和真实配置平台接入建立清晰边界。

## 背景

React H5 runtime playground 已支持 `VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL` 切换 HTTP 配置平台 client，并通过 browser smoke 验证 authorization 透传。Vue3 editor playground 目前仍直接使用本地 `localConfigPlatformClient`，且保存/预览/发布/版本读取按同步 localStorage 模型书写。真实 Java 配置平台 client 是异步 HTTP client，如果不先把编辑器 shell 的调用边界改成异步，后续接管理台会把临时兼容逻辑散落到 UI 中。

## 涉及包或系统

- `apps/editor-playground`
- `packages/adapters`
- `scripts/browser-smoke.mjs`
- `.ai-workspace/contracts/java-config-platform-api-v1.md`
- `.ai/`

## 范围

包含：

- 新增 Vue3 editor playground config platform binding，默认 local mock，配置 `VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL` 后使用 HTTP client。
- 支持可选 `VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION` 透传 authorization header。
- 将编辑器 release/workflow/draft snapshot 的 client 调用改为 `MaybePromise` 兼容。
- 扩展 `LowcodeConfigPlatformClient` 保存草稿、预览和发布方法的可选 metadata，支持传递 release note。
- 扩展 browser smoke 的 config platform HTTP mock，验证 editor HTTP 模式保存草稿、生成预览、发布、版本列表、workflow、draft snapshot 和 authorization。
- 更新 README/契约/AI 事实源和验证报告。

不包含：

- 不实现真实 Java 服务端。
- 不改变 Page Schema v1 或 Material Manifest v1。
- 不改变 H5 renderer/materials 的行为。
- 不替换真实素材/商品/优惠券/门店达人中心。
- 不执行真实 npm 发布。

## 责任边界

当前仓库：

- `apps/editor-playground` 负责提供可替换配置平台 client binding 和异步调用壳。
- `@meumall/lowcode-adapters` 负责声明 HTTP client 的可选 metadata 协议和参考实现。
- browser smoke 负责以本地 HTTP mock 验证 editor HTTP client mode。

外部系统：

- Java 配置平台未来负责真实保存、预览、发布、版本列表、workflow、自动草稿 snapshot、鉴权、错误码和审计。
- Java 管理台未来负责注入真实 baseUrl/token/operator、统一响应解包和错误提示。

## 契约影响

- 是否影响跨包或跨系统契约：是。
- 契约文档路径：`.ai-workspace/contracts/java-config-platform-api-v1.md`。
- 是否向后兼容：是，新增可选 metadata 字段，不改变现有响应结构。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：真实 Java 接入时可先启用查询，再逐步启用保存/发布。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`apps/editor-playground/README.md`、`packages/adapters/README.md`、`.ai-workspace/contracts/java-config-platform-api-v1.md`。
- 需要确认的角色：Java 配置平台、Java 管理台、前端编辑器维护者。
- 当前确认状态：前端参考实现，待 Java 侧确认响应包装、鉴权和错误码。

## 验收标准

- [x] Vue3 editor playground 默认仍使用 local mock。
- [x] 配置 `VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL` 后 editor playground 使用 HTTP config platform client。
- [x] 可选 `VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION` 会透传 authorization header。
- [x] 保存草稿、生成预览、发布、版本列表、workflow 和 editor draft snapshot 调用支持异步 client。
- [x] release note 通过可选 metadata 传给 HTTP client 请求体。
- [x] browser smoke 验证 editor HTTP mode 的保存/预览/发布和 authorization。
- [x] 不改变 Page Schema v1、Material Manifest v1、renderer 或 H5 materials。
- [x] `pnpm --filter @meumall/lowcode-editor-playground typecheck` 通过。
- [x] `pnpm --filter @meumall/lowcode-adapters typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm --filter @meumall/lowcode-editor-playground typecheck
pnpm --filter @meumall/lowcode-adapters typecheck
pnpm test
pnpm smoke:browser
git diff --check
```

## 发布影响

- 是否需要发布：否，本任务不执行真实 npm 发布。
- 发布对象：后续真实发布时影响 `@meumall/lowcode-adapters` 和 editor playground 参考实现。
- 是否需要 changeset：当前不发布，暂不新增 changeset。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：不影响 H5 runtime 默认路径。
- 是否影响 npm 发布：adapters 公开 API 增加向后兼容可选参数，发布前仍需 pack dry-run。
- 是否影响 Java 配置平台：是，新增 note metadata 请求字段说明。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证 local editor、HTTP editor 和 H5 runtime 关键路径。

## 风险和阻塞

- Java 网关若使用统一响应包装，真实管理台仍需在 host adapter 中解包。
- 当前 HTTP mock 只验证关键路径，不代表真实 Java 权限、审批、锁 TTL、错误码和审计已完成。
- 编辑器内置 `?runtime=1` 仍优先作为本地 playground runtime 验证入口；正式预览仍应切换到 Java previewToken/releaseId/pageId 协议。

## 验证结果

- `pnpm --filter @meumall/lowcode-editor-playground typecheck`：通过。
- `pnpm --filter @meumall/lowcode-adapters typecheck`：通过。
- `pnpm test`：通过，包含 build、architecture check 和 75 个 node:test 单测。
- `pnpm smoke:browser`：通过，覆盖 local editor、HTTP editor、local React H5 runtime、HTTP React H5 runtime；HTTP editor 已验证 release list、workflow、editor draft snapshot、保存草稿、生成预览、发布、authorization、note/operator。
- `git diff --check`：通过。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor playground HTTP config platform client 开关、异步调用壳和 smoke 验证。 |
| 2026-08-01 | verified | 完成 Vue3 editor playground HTTP config platform binding、异步配置平台调用、metadata 契约、README/契约更新和 browser smoke 覆盖。 |
