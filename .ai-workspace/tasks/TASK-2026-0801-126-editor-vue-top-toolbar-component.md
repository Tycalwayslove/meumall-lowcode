# TASK-2026-0801-126-editor-vue-top-toolbar-component

## 标题

拆分 Vue3 编辑器顶部工具栏组件

## 状态

verified

## 目标

在不改变顶部品牌展示、保存状态、自动保存状态、命令入口、新建页面、模式切换、撤销重做、保存、导入导出、预览发布和 H5 打开行为的前提下，将 Vue3 editor playground 顶部工具栏从 `App.vue` 拆为独立 `EditorTopToolbar.vue` 组件，继续降低编辑器 shell 单文件复杂度，并为后续迁入 Java 管理台时复用顶部操作区展示边界做准备。

## 背景

当前 Vue3 editor playground 已完成工作区状态条、快捷命令面板、节点右键菜单、物料目录、物料详情、结构树、画布工具条、当前节点信息卡、属性字段分组、资源选择器主面板、页面设置面板、发布面板和 Schema 配置面板组件化。顶部工具栏仍内联在 `App.vue`，承载品牌、保存状态、自动保存状态、快捷命令入口、新建页面、模式切换、历史操作、schema 文件导入导出、预览发布和 H5 打开入口。本任务只拆 Vue 展示层，不改变实际命令执行、文件导入解析、发布保存逻辑、Page Schema、renderer、materials 或 Java 配置平台草案。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorTopToolbar.vue`。
- 组件接收页面标题、dirty 状态、自动保存文案和 tone、当前模式、撤销/重做可用状态。
- 组件渲染顶部 brand、保存状态、自动保存状态、主工具栏和历史/保存/发布工具栏。
- 组件通过 emits 抛出打开快捷命令、新建页面、模式切换、撤销、重做、保存草稿、导出 schema、导入 schema、生成预览、发布、打开 H5 和打开 React H5。
- `App.vue` 改为复用该组件，隐藏文件 input、文件选择解析、模式写入、撤销重做、保存、导入导出、预览发布、H5 URL 构造和用户反馈仍由 App shell 执行。
- 更新 Vue shell 组件化说明文档、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不改变 `@meumall/lowcode-editor` workspace summary、schema file、draft persistence、preview links 或 release history API。
- 不改变顶部工具栏实际执行函数、隐藏文件 input、文件导入解析、发布保存逻辑或 URL 构造。
- 不改变 Page Schema v1、Material Manifest v1、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不拆画布上下文工具条、状态面板或源码辅助操作。
- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `EditorTopToolbar.vue` 负责顶部品牌、状态和操作按钮展示，以及用户操作事件抛出。
- `App.vue` 负责真实命令执行、模式写入、历史状态写入、文件 input 和解析、保存发布、H5 URL 构造、权限、审计和用户反馈。
- `@meumall/lowcode-editor` 继续负责框架无关 editor state、schema file、draft persistence、preview links、release history 和 workspace summary helper。

外部系统：

- Java 管理台未来可复用该组件边界，并替换真实权限、审计、协作锁定、发布审批和服务端保存策略。
- Java 配置平台、H5 runtime 和业务系统不受本任务影响。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无新增公开 npm API 契约；组件化说明更新 `docs/editor-vue-shell-components.md`。
- 是否向后兼容：是，仅拆分 playground 内部 Vue UI 组件。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`docs/editor-vue-shell-components.md`。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 梳理当前顶部工具栏模板、状态和事件。
2. 新增 `EditorTopToolbar.vue`，组件内部只做展示和事件抛出。
3. 在 `App.vue` 中导入并替换内联顶部工具栏。
4. 更新 Vue shell 组件化说明和 AI 状态文档。
5. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorTopToolbar.vue`，组件负责渲染顶部品牌和工具栏。
- [x] `App.vue` 使用新组件渲染顶部区域。
- [x] 页面标题、dirty 保存状态和自动保存状态仍正常展示。
- [x] 顶部“命令”和“新建”入口仍可打开对应弹窗。
- [x] 设计、预览、源码模式切换仍可用且 active 状态正确。
- [x] 撤销和重做按钮禁用状态仍正确，点击仍执行对应操作。
- [x] 保存草稿按钮文案仍按 dirty 状态展示并可保存。
- [x] 导出和导入 schema 按钮仍触发原有导入导出流程。
- [x] 预览链接、发布、打开 H5 和 React H5 按钮仍触发原有流程。
- [x] 隐藏文件 input、文件解析、发布保存、URL 构造和用户反馈仍由 App shell 持有。
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
- 是否影响 Java 配置平台：否，仍使用当前本地 mock 配置平台和已有草案。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证顶部命令入口、模式切换、保存草稿、H5 预览入口、Schema 导入导出、发布相关入口，以及编辑器和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 本任务只拆顶部工具栏展示层，不改变真实模式切换、文件导入解析、保存发布、权限、审计、协作锁定、服务端保存或真实管理台命令注册机制。
- 组件仍复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、权限插槽、协作锁定状态、审批状态和按钮扩展插槽。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，72 个 node test 全部通过，并内含架构检查。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，覆盖顶部命令入口、模式切换、保存草稿、H5 预览入口、Schema 导入导出、编辑器内置 runtime、React H5 runtime、pageId/releaseId/fallback/empty/broken 入口。
- `pnpm pack:dry-run` 通过，8 个可发布包均可完成 npm pack dry-run。
- `git diff --check` 通过。

## 剩余风险

- 本任务没有改变真实模式切换、文件导入解析、保存发布、权限、审计、协作锁定、服务端保存或真实管理台命令注册机制。
- 顶部工具栏仍使用 playground 全局样式；后续抽独立 Vue editor UI 包时，需要补充样式隔离、设计 token、权限插槽、协作锁定状态、审批状态和按钮扩展插槽。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器顶部工具栏组件拆分、组件化文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorTopToolbar.vue`，保留模式写入、撤销重做、文件 input、保存发布和 H5 URL 构造在 `App.vue`。 |
| 2026-08-01 | verified | 完成组件拆分、文档同步和验证，确认不改变顶部品牌展示、保存状态、自动保存状态、命令入口、新建页面、模式切换、撤销重做、保存、导入导出、预览发布、H5 打开、公开 API、npm 依赖或运行时行为。 |
