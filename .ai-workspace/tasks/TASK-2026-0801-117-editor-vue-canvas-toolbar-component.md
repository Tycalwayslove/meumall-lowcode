# TASK-2026-0801-117-editor-vue-canvas-toolbar-component

## 标题

拆分 Vue3 编辑器画布工具条组件

## 状态

verified

## 目标

在保持现有 Vue3 editor playground 画布顶部状态和 H5 视口切换行为不变的前提下，将画布顶部工具条从 `App.vue` 拆为独立 `EditorCanvasToolbar.vue` 组件，继续降低编辑器 shell 单文件复杂度，并为后续迁入 Java 管理台建立可复用的画布工具条 UI 边界。

## 背景

当前 Vue3 editor playground 已完成工作区状态条、物料目录、物料详情和结构树组件化，但画布顶部工具条仍内联在 `App.vue` 中。该区域展示当前画布模式标题、选中节点位置或校验状态、工作区状态摘要和 H5 视口预设切换。工作区状态摘要已由 `EditorWorkspaceStats.vue` 承载，视口预设已复用 `@meumall/lowcode-editor` 的 viewport preset API，适合继续拆成 Vue shell 组件；App 继续负责当前模式、校验状态、选中节点上下文、视口状态写入和真实用户反馈。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorCanvasToolbar.vue`。
- 组件接收当前模式、状态文案、工作区状态摘要、H5 视口预设列表和当前 active viewport preset。
- 组件复用 `EditorWorkspaceStats.vue` 展示工作区摘要。
- 组件通过 emits 抛出 H5 视口预设选择。
- `App.vue` 改为复用该组件，保持现有 `.canvas-top`、`.viewport-switch` 和 smoke check DOM 语义稳定。
- 更新 Vue3 shell 组件化说明文档、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不改变 Page Schema v1、Material Manifest v1、editor 公开 API、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不重构画布上下文节点操作工具条、手机画布、属性面板、发布面板或资源选择器。
- 不改变 H5 视口预设来源、视口状态存储、选中节点状态文案、校验状态文案或工作区状态摘要计算。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `EditorCanvasToolbar.vue` 负责 Vue3 画布顶部状态展示、工作区摘要承载、H5 视口预设按钮展示和事件抛出。
- `App.vue` 负责当前模式、选中节点上下文、校验状态、workspace stats 模型计算、视口状态写入、权限、审计和用户反馈。
- `@meumall/lowcode-editor` 继续负责 viewport preset 和 workspace summary 的框架无关模型。

外部系统：

- Java 管理台未来可复用该组件边界，并替换权限、协作锁定、审计、服务端保存和真实协作状态。
- Java 配置平台、H5 runtime 和业务系统不受本任务影响。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无新增公开 npm API 契约；组件化说明更新 `docs/editor-vue-shell-components.md`。
- 是否向后兼容：是，仅拆分 playground 内部 UI 组件。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`docs/editor-vue-shell-components.md`。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 梳理画布顶部工具条现有模板、props 和事件边界。
2. 新增 `EditorCanvasToolbar.vue` 组件。
3. 在 `App.vue` 中导入并替换内联 `canvas-top` 模板。
4. 更新 Vue shell 组件化说明和 AI 状态文档。
5. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorCanvasToolbar.vue`，组件只负责画布顶部状态展示、工作区摘要承载、视口按钮展示和事件抛出。
- [x] `App.vue` 使用新组件渲染画布标题、状态文案、工作区状态摘要和 H5 视口预设按钮。
- [x] H5 视口预设选择通过 emits 回到 App shell 执行。
- [x] 当前模式、选中节点上下文、校验状态、workspace stats 和 active viewport preset 仍由 App shell 提供。
- [x] 现有 `.canvas-top`、`.viewport-switch`、`.workspace-stats` 等样式继续复用，视觉和 DOM 语义保持稳定。
- [x] 组件不直接写入 Page Schema、不读写 localStorage、不调用 Java API、不执行权限或审计。
- [x] `docs/editor-vue-shell-components.md` 说明新增组件边界和后续拆分顺序。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器 H5 画布视口预设切换、工作区摘要和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 本任务只拆画布顶部工具条，不拆画布上下文节点操作工具条、手机画布、属性面板或发布面板。
- 组件仍复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、权限插槽、协作状态插槽和视口策略注入方式。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，当前测试集 72 项通过，架构边界检查随测试集通过。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，覆盖 Vue3 editor playground H5 画布视口预设切换、手机框同步和 React H5 runtime 关键路径。
- `pnpm pack:dry-run` 通过，8 个包完成发布预检。

## 剩余风险

- 画布上下文节点操作工具条、属性面板和发布面板仍留在 `App.vue`，后续应按组件化说明继续拆分。
- `EditorCanvasToolbar.vue` 仍复用 playground 全局 CSS；后续抽独立 Vue editor UI 包时，需要继续治理样式隔离、设计 token、权限插槽、协作状态插槽和视口策略注入方式。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器画布工具条组件拆分、组件化文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorCanvasToolbar.vue`、接回 `App.vue` 并更新组件化说明。 |
| 2026-08-01 | verified | 完成画布工具条组件拆分、事实源同步，并通过 typecheck、build、test、architecture、browser smoke 和 pack dry-run。 |
