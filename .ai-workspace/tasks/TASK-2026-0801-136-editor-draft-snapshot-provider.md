# TASK-2026-0801-136-editor-draft-snapshot-provider

## 状态

verified

## 目标

将 Vue3 editor playground 的自动保存草稿从 `App.vue` 直接读写 localStorage，推进为通过 `LowcodeConfigPlatformClient` 的编辑器草稿快照协议读写，为后续 Java 管理台接入真实自动保存服务预留清晰边界。

## 背景

当前编辑器已经具备本地自动保存、恢复提示、手动保存草稿、预览、发布、版本历史、协作锁和审批工作流 provider。手动 `saveDraft` 会生成 draft release 并进入版本历史；自动保存如果复用该接口，会让运营每次输入都生成版本记录，污染发布、回滚和审计链路。因此自动保存需要独立的 editor draft snapshot 协议，只保存“当前编辑器恢复点”，不参与 release 历史。

## 涉及包或系统

- `@meumall/lowcode-adapters`
- `apps/editor-playground`
- `.ai-workspace/contracts`
- `.ai-workspace/tasks`
- `.ai/test-reports`
- `.ai/PROJECT_STATE.md`
- `.ai/TODO.md`
- `.ai/AI_CONTEXT.md`

## 范围

包含：

- 扩展 `LowcodeConfigPlatformClient`，新增可选编辑器草稿快照查询和保存方法。
- 扩展 `createHttpConfigPlatformClient`，提供 Java 配置平台 HTTP 参考路径。
- 扩展本地 `mockPlatform.ts`，用同一 provider 协议保存和读取自动草稿快照。
- Vue3 editor playground 的初始化恢复和自动保存改为优先调用 provider，保留旧 localStorage 草稿格式作为迁移兜底。
- 更新 Java 配置平台 API 草案、AI 状态、TODO 和验证报告。
- adapters 单元测试覆盖 HTTP client 的草稿快照路径、方法和响应校验。

不包含：

- Java 服务端实现。
- 真实鉴权、冲突合并、离线队列、保存重试和多端同步。
- 修改 Page Schema v1。
- 改变手动保存草稿、预览、发布、回滚和版本历史语义。
- 拆分新的 Vue editor npm 包。

## 责任边界

当前仓库：

- 定义前端消费契约、TypeScript client 接口和 HTTP client 参考实现。
- playground 继续使用 localStorage 作为本地 mock 底层，但 `App.vue` 不再把它作为唯一自动保存 provider。
- 保留旧 `STORAGE_KEY` 草稿读取，避免已有本地草稿无法恢复。

外部系统：

- Java 配置平台后续负责实现自动草稿快照 API、鉴权、审计、冲突检测、保存频控、过期清理和多端同步策略。
- Java 管理台后续负责注入真实 `LowcodeConfigPlatformClient`、当前操作人和错误提示。

## 契约影响

- 是否影响跨包或跨系统契约：是，扩展 Java 配置平台 API 草案和 adapters 公共 API。
- 契约文档路径：`.ai-workspace/contracts/java-config-platform-api-v1.md`
- 是否向后兼容：是，新增可选方法；旧 client 不需要立即实现。
- 是否需要迁移：否；旧 localStorage 草稿保留读取兜底。
- 是否需要灰度或双版本兼容：后续真实 Java 接入时需要 provider 能力检测。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`.ai-workspace/contracts/java-config-platform-api-v1.md`
- 需要确认的角色：Java 配置平台负责人、运营后台负责人、H5 接入负责人。
- 当前确认状态：前端草案，待外部系统确认。

## 实现计划

1. adapters 新增 editor draft snapshot 类型、可选 client 方法和 HTTP client 参考实现。
2. adapters 单测覆盖保存和查询 draft snapshot。
3. 本地 mockPlatform 实现 snapshot 存储、读取和 clone/校验。
4. `App.vue` 初始化恢复优先读取 provider snapshot，自动保存调用 provider，旧 localStorage 草稿只作为迁移兜底。
5. 更新 Java 配置平台 API 草案、项目状态、TODO、AI_CONTEXT 和验证报告。
6. 运行 `pnpm test`、`pnpm typecheck`、`pnpm build`、`pnpm smoke:browser`。

## 验收标准

- [x] `LowcodeConfigPlatformClient` 暴露可选 editor draft snapshot 方法。
- [x] HTTP client 支持保存和查询 editor draft snapshot。
- [x] 本地 mockPlatform 实现同一 provider 方法。
- [x] Vue3 editor playground 自动保存不再直接只写旧 `STORAGE_KEY`。
- [x] 旧 localStorage 草稿仍可作为恢复兜底。
- [x] 手动 `saveDraft` 仍只用于版本草稿，不被自动保存调用。
- [x] Java 配置平台契约说明 editor draft snapshot 与 release draft 的区别。
- [x] `pnpm test` 通过。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] 项目状态、TODO 和验证报告已更新。

## 验证命令

```bash
pnpm test
pnpm typecheck
pnpm build
pnpm smoke:browser
```

## 发布影响

- 是否需要发布：暂不发布。
- 发布对象：后续发布 `@meumall/lowcode-adapters` 时包含新增可选 API。
- 是否需要 changeset：当前不发布，暂不新增 changeset。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：浏览器 smoke 需覆盖自动保存状态仍可用。

## 风险和阻塞

- Java API 仍是前端草案，需要后续确认响应包装、错误码、鉴权、冲突检测和保存频控。
- 当前 playground 的 provider 底层仍是 localStorage mock，不代表真实服务端持久化。
- 自动保存 snapshot 暂不实现版本冲突合并，真实管理台接入时需结合协作锁和 updatedAt/etag 策略。

## 验证结果

2026-08-01：

- `pnpm test` 通过，包含 `pnpm build`、`pnpm check:architecture` 和 75 个 Node 测试用例。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm smoke:browser` 首次因旧 localStorage 断言失败；更新断言为 provider snapshot 或旧兜底任一命中后重跑通过。
- 验证报告：`.ai/test-reports/TASK-2026-0801-136-editor-draft-snapshot-provider.md`

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 明确自动保存使用 editor draft snapshot 协议，不复用 release draft。 |
| 2026-08-01 | in_progress | 开始扩展 adapters 协议、playground provider 和自动保存恢复接入。 |
| 2026-08-01 | verified | 完成 editor draft snapshot client、HTTP 参考实现、本地 provider、Vue3 自动保存恢复接入、契约文档和验证。 |
