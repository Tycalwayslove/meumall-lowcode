# TASK-2026-0801-097-editor-draft-persistence-api

## 标题

沉淀编辑器草稿持久化 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 中本地自动保存草稿的载荷构造、恢复校验、状态文案和状态颜色口径沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台、独立编辑器 shell 或服务端草稿接口可以复用同一套草稿持久化状态模型。

## 背景

当前 Vue3 编辑器已支持 schema 变更后延迟写入 localStorage，并在顶栏展示自动保存和恢复状态。但草稿恢复校验、保存载荷、状态文案和 UI tone 仍写在 `apps/editor-playground/src/App.vue`。自动保存是运营可实操编辑器的重要兜底能力，应将与 DOM、localStorage 和 HTTP 无关的部分抽入 editor 包，playground 只负责定时器、实际存储读写和用户确认。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增草稿保存载荷、草稿恢复结果、自动保存状态、状态文案和 tone helper。
- Vue3 编辑器 playground 改为消费 editor 包的草稿持久化 API。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖草稿载荷、合法恢复、非法 JSON、非法 schema、状态文案和 tone。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或校验规则。
- 不改变 renderer、materials、runtime handoff 或发布链路。
- 不在 editor 包中引入 `window`、`localStorage`、`setTimeout`、`fetch`、`File` 或 `Blob` 等宿主能力。
- 不接入真实 Java 草稿保存接口、审批、审计或权限。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的草稿持久化纯 helper。
- `apps/editor-playground` 负责定时器、localStorage 读写、自动保存触发和用户反馈展示。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并将实际保存和恢复接到服务端草稿接口。

## 契约影响

- 是否影响跨包或跨系统契约：是，`@meumall/lowcode-editor` 新增向后兼容的公开 API。
- 契约文档路径：`.ai-workspace/contracts/editor-interaction-model-v1.md`、`packages/editor/README.md`。
- 是否向后兼容：是，新增导出，不修改旧 API 语义。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/editor/README.md`。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 梳理 Vue3 编辑器当前本地自动保存和恢复逻辑。
2. 在 editor 包新增草稿持久化类型、状态常量和 helper。
3. 更新 editor 单测和 README。
4. 更新 editor interaction model 契约。
5. 将 Vue3 playground 改为消费 editor API，并保持现有 UI 行为不变。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出草稿载荷创建、草稿内容解析恢复、状态文案和 tone helper。
- [x] 草稿载荷包含 schema、schema JSON、字节数、大小文案和更新时间。
- [x] 草稿恢复对非法 JSON 和非法 Page Schema 返回失败结果，不抛业务异常。
- [x] Vue3 编辑器 playground 的本地自动保存和恢复流程复用 editor API。
- [x] 不修改 Page Schema、renderer、materials 或 runtime handoff 协议。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖草稿持久化 API。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm check:architecture` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `pnpm pack:dry-run` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm check:architecture
pnpm smoke:browser
pnpm pack:dry-run
```

## 发布影响

- 是否需要发布：否，本任务只提交源码和文档；未来真实 npm 发布时作为 `@meumall/lowcode-editor` 向后兼容 minor 能力评估。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否。
- 是否影响 npm 发布：新增 editor 包公开 API，`pnpm pack:dry-run` 需要通过。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器本地自动保存、草稿恢复和相关关键路径仍可用。

## 风险和阻塞

- 当前只抽象草稿 JSON 文本层和状态展示口径，真实管理台服务端草稿保存、权限、审计和冲突合并仍需后续单独设计。
- 未来若引入 schema migration，应在草稿恢复 API 上新增可选 migration 流程，不应破坏现有返回结构。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，57 个测试全部通过，包含 editor draft persistence API 单测。
- `pnpm check:architecture`：通过，包结构、依赖方向、物料 manifest 对齐和 primitives 边界未破坏。
- `pnpm smoke:browser`：通过，Vue3 编辑器自动保存、草稿恢复、核心编辑和 H5 runtime 关键路径仍可用。
- `pnpm pack:dry-run`：通过，8 个可发布包 dry-run 全部通过，包含 `@meumall/lowcode-editor`。

## 剩余风险

- 当前草稿持久化 API 只抽象 JSON 文本、payload 和状态展示口径，真实管理台服务端草稿保存、权限、审计和冲突合并仍需后续单独设计。
- 本任务新增 `@meumall/lowcode-editor` 公开 API，但未执行真实 npm 发布；真实发布仍需 registry、access、token 和 changeset 版本确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包草稿持久化 API 和 Vue3 playground 复用。 |
| 2026-08-01 | in_progress | 开始实现 editor 包草稿持久化公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包草稿持久化 API、Vue3 playground 复用、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
