# TASK-2026-0801-115-editor-vue-material-detail-component

## 标题

拆分 Vue3 编辑器物料详情组件

## 状态

verified

## 目标

在保持现有 Vue3 editor playground 物料详情交互不变的前提下，将物料详情弹窗从 `App.vue` 拆为独立 `EditorMaterialDetail.vue` 组件，继续降低编辑器 shell 单文件复杂度，并为后续迁入 Java 管理台建立可复用的物料详情 UI 边界。

## 背景

当前 Vue3 editor playground 已完成工作区状态条和物料目录组件化，但物料详情弹窗仍内联在 `App.vue` 中。该弹窗展示物料 manifest 基础信息、配置字段、事件、数据槽和默认 H5 预览，并提供关闭和添加到画布操作；详情展示数据已经主要由 `@meumall/lowcode-editor` 的 material detail API 派生，适合拆为 Vue shell 组件。App 继续负责选中详情 manifest、默认预览 schema 派生、真实添加、收藏偏好、action executor、preview data 和用户反馈。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorMaterialDetail.vue`。
- 组件接收物料 manifest、详情摘要、配置字段、事件、数据槽、默认预览 schema、物料 registry、预览数据和 action executor。
- 组件通过 emits 抛出关闭弹窗和添加到画布。
- `App.vue` 改为复用该组件，保持现有物料详情弹窗 UI、默认 H5 预览和 smoke check DOM 语义稳定。
- 更新 Vue3 shell 组件化说明文档、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不改变 Page Schema v1、Material Manifest v1、editor 公开 API、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不重构物料目录、模板面板、结构树、画布、属性面板、发布面板或资源选择器。
- 不改变物料详情默认预览 schema 派生规则。
- 不改变添加物料、收藏/最近使用、action executor 或 preview data 逻辑。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `EditorMaterialDetail.vue` 负责 Vue3 物料详情弹窗展示、默认 H5 预览承载和事件抛出。
- `App.vue` 负责选中详情 manifest、详情模型计算、预览 schema 派生、物料添加、偏好持久化、action executor、preview data、弹窗打开状态和用户反馈。
- `@meumall/lowcode-editor` 继续负责物料详情的框架无关模型和默认预览 schema 派生口径。
- `@meumall/lowcode-renderer-vue-h5` 继续负责弹窗内默认 H5 预览渲染。

外部系统：

- Java 管理台未来可复用该组件边界，并替换权限、审计、用户偏好接口、真实预览数据和真实 action handler。
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

1. 梳理物料详情弹窗现有模板、props 和事件边界。
2. 新增 `EditorMaterialDetail.vue` 组件。
3. 在 `App.vue` 中导入并替换内联物料详情弹窗模板。
4. 移除 `App.vue` 中只服务内联弹窗的无用 import。
5. 更新 Vue shell 组件化说明和 AI 状态文档。
6. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorMaterialDetail.vue`，组件只负责物料详情展示、默认 H5 预览承载和事件抛出。
- [x] `App.vue` 使用新组件渲染物料详情弹窗、manifest 信息、配置字段、事件、数据槽和默认 H5 预览。
- [x] 关闭弹窗和添加到画布通过 emits 回到 App shell 执行。
- [x] 默认预览 schema、registry、preview data 和 action executor 仍由 App shell 提供。
- [x] 现有 `.material-detail-*`、`.material-preview-*`、`.material-prop-*`、`.mini-empty` 等样式继续复用，视觉和 DOM 语义保持稳定。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器物料详情默认 H5 预览、一键添加和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 本任务只拆物料详情弹窗，不拆结构树、画布工具条、属性面板或发布面板。
- 组件仍复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、权限插槽、预览插槽和 action handler 注入方式。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，当前测试集 72 项通过，架构边界检查随测试集通过。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，覆盖 Vue3 editor playground 物料详情默认 H5 预览、配置字段展示、一键添加和 React H5 runtime 关键路径。
- `pnpm pack:dry-run` 通过，8 个包完成发布预检。

## 剩余风险

- 结构树、画布工具条、属性面板和发布面板仍留在 `App.vue`，后续应按组件化说明继续拆分。
- `EditorMaterialDetail.vue` 仍复用 playground 全局 CSS；后续抽独立 Vue editor UI 包时，需要继续治理样式隔离、设计 token、权限插槽、预览插槽和 action handler 注入方式。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器物料详情组件拆分、组件化文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorMaterialDetail.vue`、接回 `App.vue` 并更新组件化说明。 |
| 2026-08-01 | verified | 完成物料详情组件拆分、事实源同步，并通过 typecheck、build、test、architecture、browser smoke 和 pack dry-run。 |
