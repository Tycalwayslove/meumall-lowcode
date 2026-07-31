# TASK-2026-0801-113-editor-vue-workspace-stats-component

## 标题

拆分 Vue3 编辑器工作区状态条组件

## 状态

verified

## 目标

在不新增未规划 npm 包、不改变 schema/editor/renderer/materials 契约的前提下，从 `apps/editor-playground/src/App.vue` 中拆出第一个稳定 Vue3 编辑器 UI 组件：工作区状态条。通过这个切口建立后续迁入 Java 管理台时可复用的组件拆分路径，降低单文件编辑器 shell 的维护和迁移成本。

## 背景

Vue3 editor playground 已经具备较完整的运营编辑器能力，但 `App.vue` 接近 5000 行，继续直接堆功能会增加迁移到 Java 管理台的成本。当前顶部工作区状态条只消费 `@meumall/lowcode-editor` 产出的 `LowcodeEditorWorkspaceStat[]` 展示模型，不负责事件、schema 写回、资源选择、权限、审计或服务端保存，适合作为首个组件化边界。

## 涉及包或系统

- `apps/editor-playground`
- `.ai/`
- `docs/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorWorkspaceStats.vue`。
- `EditorWorkspaceStats` 只通过 props 接收工作区状态展示模型，不直接依赖 editor state、Page Schema、DOM 测量、localStorage 或 Java API。
- `App.vue` 改为复用该组件，保持现有 UI 行为和样式不变。
- 增加或更新 Vue3 编辑器 shell 组件化迁移说明文档。
- 更新项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不改变 Page Schema v1、Material Manifest v1、editor 公开 API、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不重构物料面板、画布、属性面板、发布面板、资源选择器或模板市场。
- 不改变现有 CSS 视觉风格和交互行为。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `apps/editor-playground` 负责沉淀 Vue3 管理台迁移参考组件和集成演示。
- `@meumall/lowcode-editor` 继续负责状态摘要展示模型，组件只消费结果。

外部系统：

- Java 管理台未来可参考该组件边界接入自己的布局、权限、审批和服务端状态。
- Java 配置平台、H5 runtime 和业务系统不受本任务影响。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无新增公开 npm API 契约；组件化说明写入 `docs/editor-vue-shell-components.md`。
- 是否向后兼容：是，仅拆分 playground 内部 UI 组件。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`docs/editor-vue-shell-components.md`。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 确认工作区状态条现有模板、类型和样式边界。
2. 新增 `EditorWorkspaceStats.vue` 组件，明确 props 类型和空态处理。
3. 在 `App.vue` 中导入并替换内联状态条模板。
4. 补充 Vue3 editor shell 组件化迁移说明文档。
5. 更新 AI 状态文档和任务状态。
6. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorWorkspaceStats.vue`，组件只通过 props 接收 stats。
- [x] `App.vue` 使用新组件渲染工作区状态条。
- [x] 现有 `.workspace-stats` 和 `.workspace-stat` 样式继续复用，视觉和 DOM 语义保持稳定。
- [x] 组件不依赖 Page Schema、editor state、renderer、materials、adapters、localStorage、DOM 测量或 Java API。
- [x] `docs/editor-vue-shell-components.md` 说明当前组件边界和后续拆分顺序。
- [x] 不新增 npm 包、不新增依赖、不改变公开 API。
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

- 是否需要发布：否，本任务只拆分 playground 内部 Vue 组件和文档。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否。
- 是否影响 npm 发布：不影响公开包内容，但仍运行 `pnpm pack:dry-run` 确认发布预检不受影响。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器 shell、状态摘要、模板应用、物料添加和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 本任务只是第一个 Vue shell 组件化切口，尚未完成物料面板、画布、属性面板、发布面板等大块拆分。
- 当前组件仍复用 playground 全局 CSS，后续如果抽 npm UI 包，需要再治理样式隔离和设计系统 token。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，72 个测试全绿，并包含架构边界检查。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，Vue3 编辑器 shell、模板应用、物料添加、Schema 导入导出、内置 H5 runtime 和 React H5 runtime 关键路径正常。
- `pnpm pack:dry-run` 通过，8 个可发布包均通过 npm pack dry-run。

## 剩余风险

- 本任务只是 Vue editor shell 组件化的第一个切口，物料目录、结构树、画布工具条、属性面板和发布面板仍需后续继续拆分。
- `EditorWorkspaceStats` 当前复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、插槽和权限注入。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器工作区状态条组件拆分、迁移文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorWorkspaceStats.vue`、接回 `App.vue` 并补充 Vue shell 组件化说明。 |
| 2026-08-01 | verified | 完成组件拆分、迁移说明、事实源同步和全量验收命令。 |
