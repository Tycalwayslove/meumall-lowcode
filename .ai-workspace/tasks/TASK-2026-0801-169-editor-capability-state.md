# TASK-2026-0801-169 Editor Capability State API

## 状态

- status: verified
- created_at: 2026-08-01 14:25 CST
- owner: AI Agent

## 背景

Vue3 编辑器 playground 已经通过 `@meumall/lowcode-editor` 复用权限、协作锁和审批状态模型，但顶部工具栏、审批按钮和发布检查错误之间的组合门禁仍在 playground shell 内部拼装。后续迁入 Java 管理台时，管理台也需要同样判断“当前是否可编辑、可提交审批、可发布、哪些动作被禁用以及禁用原因”。这类判断应继续沉淀到 editor headless API，避免不同 shell 重复实现。

## 目标

新增 `createLowcodeEditorCapabilityState` 等纯函数 API，把协作锁、审批态、账号权限和发布检查摘要组合成可复用的编辑器能力状态，并让 Vue3 playground 消费该模型。

## 涉及包或系统

- `packages/editor`
- `packages/editor/test/editor.test.mjs`
- `apps/editor-playground`
- `packages/editor/README.md`
- `.ai/`
- `.changeset/`

## 范围

包含：

- 新增 permission state 合并 helper，支持账号权限与工作流只读/审批权限叠加。
- 新增 editor capability state，输出 `editable`、`readonly`、`submittable`、`publishable`、`disabledActions`、状态项和阻塞原因。
- 发布检查错误应统一阻塞生成预览、提交审批和发布，并提供稳定禁用原因。
- Vue3 editor playground 顶部工具栏和审批入口改为消费 capability state。
- 补充单测、README、AI 状态、测试报告和 changeset。

不包含：

- 不接真实 Java 权限、审批、协作锁或发布检查接口。
- 不改变 Page Schema v1、Material Manifest v1 或 renderer 行为。
- 不改变现有权限 action 枚举语义。
- 不实现 UI 新面板或管理台样式重构。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 提供框架无关 capability 派生模型。
- `apps/editor-playground` 作为示例 shell 消费该模型，不持有重复门禁规则。

外部系统：

- Java 配置平台、真实权限中心、审批系统、协作锁服务和审计系统仍由宿主实现并传入状态。

## 契约影响

- 是否影响 npm 公开 API：是，`@meumall/lowcode-editor` 新增向后兼容 API。
- 是否影响 Page Schema v1：否。
- 是否影响 Material Manifest v1：否。
- 是否需要迁移：否。
- 是否向后兼容：是。

## 对接说明

- 管理台 shell 可以继续使用已有 `createLowcodeEditorCollaborationState`、`createLowcodeEditorApprovalState`，再通过 `createLowcodeEditorCapabilityState` 得到统一门禁结果。
- Java 只需要提供用户权限、协作锁、审批态和服务端发布检查结果；editor API 不直接请求外部服务。

## 验收标准

- [x] capability state 能合并协作锁、审批态、账号权限和发布检查错误。
- [x] 发布检查错误会阻塞 `preview.create`、`approval.submit` 和 `publish.submit`。
- [x] Vue3 editor playground 顶部工具栏和审批入口消费 capability state。
- [x] 不新增 schema、renderer 或 materials 依赖。
- [x] `pnpm --filter @meumall/lowcode-editor typecheck` 通过。
- [x] `pnpm --filter @meumall/lowcode-editor-playground typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `pnpm pack:dry-run` 通过。

## 验证命令

```bash
pnpm --filter @meumall/lowcode-editor typecheck
pnpm --filter @meumall/lowcode-editor-playground typecheck
pnpm test
pnpm smoke:browser
pnpm pack:dry-run
```

## 验证结果

- 2026-08-01 14:25 CST：`pnpm --filter @meumall/lowcode-editor typecheck` 通过。
- 2026-08-01 14:25 CST：`pnpm --filter @meumall/lowcode-editor-playground typecheck` 通过。
- 2026-08-01 14:26 CST：`pnpm test` 初次失败，原因是新增单测对账号权限和审批发布阻塞的优先级预期错误；实现未改，修正单测预期后继续验证。
- 2026-08-01 14:27 CST：`pnpm test` 通过，覆盖 build、architecture check 和 109 个单测。
- 2026-08-01 14:32 CST：`pnpm smoke:browser` 通过，覆盖 Vue3 编辑器 workflow provider、审批流转、顶部状态、发布检查、编辑器内置 runtime 和 React H5 runtime。
- 2026-08-01 14:34 CST：`pnpm pack:dry-run` 通过，8 个可发布包均通过 npm pack 内容预检。

## 发布影响

- 是否需要发布：后续真实 npm 发布时需要。
- 发布对象：`@meumall/lowcode-editor`。
- 是否需要 changeset：是，minor。
- 是否影响 H5 接入：否。
- 是否影响 Java 配置平台：不要求 Java 立即改造；后续管理台接入可复用新增 API。
- 回滚目标：回滚本任务提交即可恢复 playground 内原有组合门禁逻辑。

## 风险和阻塞

- 当前 capability state 只合并前端已有状态和发布检查摘要；真实账号权限、审批状态和协作锁来源仍依赖外部 Java/管理台接入。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor capability state API 和 playground 消费。 |
| 2026-08-01 | in_progress | 实现 editor capability state、权限合并 helper、单测、README、AI 状态和 playground 接入。 |
| 2026-08-01 | verified | typecheck、单测、browser smoke 和 pack dry-run 均已完成并验证。 |
