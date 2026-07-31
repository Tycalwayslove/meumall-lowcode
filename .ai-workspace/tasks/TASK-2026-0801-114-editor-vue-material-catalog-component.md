# TASK-2026-0801-114-editor-vue-material-catalog-component

## 标题

拆分 Vue3 编辑器物料目录组件

## 状态

verified

## 目标

在保持现有 Vue3 editor playground 行为不变的前提下，将左侧物料目录从 `App.vue` 拆为独立 `EditorMaterialCatalog.vue` 组件，继续降低编辑器 shell 单文件复杂度，并为后续迁入 Java 管理台建立可复用的物料目录 UI 边界。

## 背景

当前 Vue3 editor playground 已完成工作区状态条组件化，但物料目录仍内联在 `App.vue` 中，包含搜索、分类、收藏物料、最近使用、物料卡片、详情入口、拖拽入口和向当前容器添加物料入口。该区域已经主要消费 `@meumall/lowcode-editor` 的 material catalog/preference/detail 模型，适合继续拆成 Vue shell 组件；App 继续负责真实添加、收藏持久化、Pointer Events、DragEvent 和用户反馈。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorMaterialCatalog.vue`。
- 组件接收物料列表、可见物料、收藏物料、最近使用、分类、搜索状态、偏好提示和当前容器标题等 props。
- 组件通过 emits 抛出搜索更新、分类更新、添加物料、向容器添加物料、收藏切换、打开详情、Pointer Events 拖拽、DragEvent 拖拽和拖拽结束。
- `App.vue` 改为复用该组件，保持现有物料目录 UI、交互和 smoke check DOM 语义稳定。
- 更新 Vue3 shell 组件化说明文档、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不改变 Page Schema v1、Material Manifest v1、editor 公开 API、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不重构物料详情弹窗、模板面板、结构树、画布、属性面板、发布面板或资源选择器。
- 不改变收藏/最近使用 localStorage 存储规则。
- 不改变现有物料拖拽、添加和向容器添加行为。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `EditorMaterialCatalog.vue` 负责 Vue3 物料目录展示和事件抛出。
- `App.vue` 负责状态计算、schema 写入、偏好持久化、Pointer Events、DragEvent、详情弹窗、用户反馈和本地 mock 保存。
- `@meumall/lowcode-editor` 继续负责物料目录、物料偏好和物料详情的框架无关模型。

外部系统：

- Java 管理台未来可复用该组件边界，并替换权限、审计、用户偏好接口和真实资源体系。
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

1. 梳理物料目录现有模板、props 和事件边界。
2. 新增 `EditorMaterialCatalog.vue` 组件。
3. 在 `App.vue` 中导入并替换内联物料目录模板。
4. 移除 `App.vue` 中只服务物料目录模板的无用 helper/import。
5. 更新 Vue shell 组件化说明和 AI 状态文档。
6. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorMaterialCatalog.vue`，组件只负责物料目录展示和事件抛出。
- [x] `App.vue` 使用新组件渲染物料搜索、分类、收藏、最近使用、物料列表和容器添加入口。
- [x] 搜索关键词和分类通过 `v-model` 或等价事件回写 App 状态。
- [x] 添加物料、向容器添加物料、收藏切换、详情入口、Pointer Events 拖拽、DragEvent 拖拽和拖拽结束仍由 App shell 执行。
- [x] 现有 `.material-*`、`.container-target`、`.mini-empty` 等样式继续复用，视觉和 DOM 语义保持稳定。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器物料搜索、物料详情、一键添加、收藏最近使用、拖拽相关关键路径和 H5 runtime 仍可用。

## 风险和阻塞

- 本任务只拆物料目录，不拆物料详情弹窗；详情弹窗仍留在 `App.vue`。
- 组件仍复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、权限插槽和资源选择器插槽。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，当前测试集 72 项通过，架构边界检查随测试集通过。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，Vue3 editor playground 物料搜索、物料详情、一键添加、收藏、最近使用、拖拽相关路径和 React H5 runtime 关键路径均可用。
- `pnpm pack:dry-run` 通过，8 个包完成发布预检。

## 剩余风险

- 物料详情弹窗仍留在 `App.vue`，后续应作为下一步 Vue shell 组件化对象。
- `EditorMaterialCatalog.vue` 仍复用 playground 全局 CSS；后续抽独立 Vue editor UI 包时，需要继续治理样式隔离、设计 token、权限插槽和资源选择器插槽。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器物料目录组件拆分、组件化文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorMaterialCatalog.vue`、接回 `App.vue` 并更新组件化说明。 |
| 2026-08-01 | verified | 完成物料目录组件拆分、事实源同步，并通过 typecheck、build、test、architecture、browser smoke 和 pack dry-run。 |
