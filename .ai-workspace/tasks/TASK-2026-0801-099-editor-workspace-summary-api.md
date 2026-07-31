# TASK-2026-0801-099-editor-workspace-summary-api

## 标题

沉淀编辑器工作区状态摘要 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 顶部工作区状态摘要中的节点数、选中物料、校验状态、发布状态和保存状态展示口径沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台或独立编辑器 shell 可以复用同一套状态条模型。

## 背景

当前 Vue3 编辑器顶部已经展示节点数、当前选中、校验、发布和保存状态，帮助运营快速判断当前页面是否可继续编辑、预览和交付。但这些状态文案和 tone 仍写在 `apps/editor-playground/src/App.vue`。工作区状态摘要是编辑器 shell 的基础能力，应抽入 editor 包，playground 只负责布局、样式和具体交互。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增工作区状态摘要 stat 类型和 helper。
- Vue3 编辑器 playground 改为消费 editor 包的工作区状态摘要 API。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖节点数、选中、校验、发布错误/警告/通过、保存状态。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或校验规则。
- 不改变 renderer、materials、runtime loader 或发布链路。
- 不在 editor 包中处理 DOM、布局、CSS、滚动、点击或真实权限。
- 不接入真实 Java 发布校验、审批或审计。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的工作区状态摘要展示模型。
- `apps/editor-playground` 负责渲染状态条、样式和用户交互。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并将发布校验摘要、权限和审批状态注入到工作区状态条。

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

1. 梳理 Vue3 编辑器当前工作区状态摘要逻辑。
2. 在 editor 包新增状态摘要类型和 helper。
3. 更新 editor 单测和 README。
4. 更新 editor interaction model 契约。
5. 将 Vue3 playground 改为消费 editor API，并保持现有 UI 行为不变。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出工作区状态摘要 helper。
- [x] helper 可表达节点数、选中、校验、发布和保存状态。
- [x] helper 可根据发布检查摘要返回 error/warning/success tone。
- [x] Vue3 编辑器 playground 顶部状态摘要复用 editor API。
- [x] 不修改 Page Schema、renderer、materials、runtime loader 或发布协议。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖工作区状态摘要 API。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器工作区状态摘要和编辑器关键路径仍可用。

## 风险和阻塞

- 当前只抽象基础状态条展示模型，真实管理台权限、审批、协作锁定、服务端发布校验和审计状态仍需后续单独设计。
- 未来若发布状态从本地检查升级为 Java 服务端检查，应由宿主传入新的 summary 或新增兼容 helper，不破坏现有 API。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，59 个测试全部通过，包含 editor workspace summary API 单测。
- `pnpm check:architecture`：通过，包结构、依赖方向、物料 manifest 对齐和 primitives 边界未破坏。
- `pnpm smoke:browser`：通过，Vue3 编辑器工作区状态摘要、编辑器关键路径和 H5 runtime 关键路径仍可用。
- `pnpm pack:dry-run`：通过，8 个可发布包 dry-run 全部通过，包含 `@meumall/lowcode-editor`。

## 剩余风险

- 当前 workspace summary API 只抽象基础状态条展示模型，真实管理台权限、审批、协作锁定、服务端发布校验和审计状态仍需后续单独设计。
- 本任务新增 `@meumall/lowcode-editor` 公开 API，但未执行真实 npm 发布；真实发布仍需 registry、access、token 和 changeset 版本确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包工作区状态摘要 API 和 Vue3 playground 复用。 |
| 2026-08-01 | in_progress | 开始实现 editor 包工作区状态摘要公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包工作区状态摘要 API、Vue3 playground 复用、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
