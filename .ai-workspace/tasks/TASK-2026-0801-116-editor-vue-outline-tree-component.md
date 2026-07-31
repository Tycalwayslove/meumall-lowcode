# TASK-2026-0801-116-editor-vue-outline-tree-component

## 标题

拆分 Vue3 编辑器结构树组件

## 状态

verified

## 目标

在保持现有 Vue3 editor playground 结构树交互不变的前提下，将左侧结构树从 `App.vue` 拆为独立 `EditorOutlineTree.vue` 组件，继续降低编辑器 shell 单文件复杂度，并为后续迁入 Java 管理台建立可复用的节点导航 UI 边界。

## 背景

当前 Vue3 editor playground 已完成工作区状态条、物料目录和物料详情组件化，但结构树仍内联在 `App.vue` 中。结构树包含节点搜索、可见摘要、多选摘要、折叠/展开、节点多选、选中定位、拖拽入口、节点 drop、右键菜单入口和内联重命名。结构树展示数据已经由 `@meumall/lowcode-editor` 的 outline tree、node selection 和 node operation API 派生，适合拆为 Vue shell 组件；App 继续负责真实 selection、schema 写入、Pointer Events、DragEvent、右键菜单定位、重命名提交、画布滚动定位、权限和用户反馈。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorOutlineTree.vue`。
- 组件接收结构树可见行、搜索词、可见摘要、多选摘要、选中节点、折叠节点、搜索命中节点、多选节点、成组可拖拽节点、重命名节点和重命名草稿等 props。
- 组件通过 emits 抛出搜索更新、节点点击、节点 pointerdown、节点 dragstart、节点 drop、节点右键菜单、折叠切换、多选切换、重命名草稿更新、重命名提交和重命名取消。
- `App.vue` 改为复用该组件，保持现有结构树 UI、交互和 smoke check DOM 语义稳定。
- 更新 Vue3 shell 组件化说明文档、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不改变 Page Schema v1、Material Manifest v1、editor 公开 API、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不重构画布工具条、属性面板、发布面板、节点右键菜单浮层、拖拽投放算法或资源选择器。
- 不改变节点选择、多选、折叠、重命名、拖拽移动、画布滚动定位或右键菜单行为。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `EditorOutlineTree.vue` 负责 Vue3 结构树展示、基础输入控件和事件抛出。
- `App.vue` 负责结构树模型计算、选中状态、schema 写入、多选状态、折叠状态、Pointer Events、DragEvent、右键菜单定位、重命名提交、画布滚动定位、权限、审计和用户反馈。
- `@meumall/lowcode-editor` 继续负责结构树、节点多选和节点操作的框架无关模型。

外部系统：

- Java 管理台未来可复用该组件边界，并替换权限、协作锁定、审计、服务端保存和真实节点操作策略。
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

1. 梳理结构树现有模板、props 和事件边界。
2. 新增 `EditorOutlineTree.vue` 组件。
3. 在 `App.vue` 中导入并替换内联结构树模板。
4. 在 `App.vue` 中补充组件所需的成组可拖拽节点集合等派生数据。
5. 更新 Vue shell 组件化说明和 AI 状态文档。
6. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorOutlineTree.vue`，组件只负责结构树展示、输入控件和事件抛出。
- [x] `App.vue` 使用新组件渲染结构树搜索、可见摘要、多选摘要、节点行、折叠、勾选、拖拽入口和重命名输入。
- [x] 搜索词和重命名草稿通过 `v-model` 或等价事件回写 App 状态。
- [x] 节点点击、Pointer Events、DragEvent、drop、右键菜单、折叠、多选、重命名提交和取消仍由 App shell 执行。
- [x] 现有 `.outline-*`、`.mini-empty` 等样式继续复用，视觉和 DOM 语义保持稳定。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器结构树搜索折叠、节点定位、多选、重命名相关路径和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 本任务只拆结构树展示区，不拆节点右键菜单浮层、画布工具条、属性面板或发布面板。
- 组件仍复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、权限插槽、节点操作插槽和拖拽策略注入方式。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，当前测试集 72 项通过，架构边界检查随测试集通过。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，覆盖 Vue3 editor playground 结构树搜索、折叠、定位、重命名、节点菜单、快捷键和 React H5 runtime 关键路径。
- `pnpm pack:dry-run` 通过，8 个包完成发布预检。

## 剩余风险

- 节点右键菜单浮层、画布工具条、属性面板和发布面板仍留在 `App.vue`，后续应按组件化说明继续拆分。
- `EditorOutlineTree.vue` 仍复用 playground 全局 CSS；后续抽独立 Vue editor UI 包时，需要继续治理样式隔离、设计 token、权限插槽、节点操作插槽和拖拽策略注入方式。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器结构树组件拆分、组件化文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorOutlineTree.vue`、接回 `App.vue` 并更新组件化说明。 |
| 2026-08-01 | verified | 完成结构树组件拆分、事实源同步，并通过 typecheck、build、test、architecture、browser smoke 和 pack dry-run。 |
