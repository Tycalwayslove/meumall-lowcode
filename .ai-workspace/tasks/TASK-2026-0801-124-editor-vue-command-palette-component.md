# TASK-2026-0801-124-editor-vue-command-palette-component

## 标题

拆分 Vue3 编辑器快捷命令面板组件

## 状态

verified

## 目标

在不改变快捷命令搜索、执行、快捷键、命令可用性和现有 smoke 行为的前提下，将 Vue3 editor playground 的快捷命令弹窗从 `App.vue` 拆为独立 `EditorCommandPalette.vue` 组件，继续降低编辑器 shell 单文件复杂度，并为后续迁入 Java 管理台时复用命令面板交互边界做准备。

## 背景

当前 Vue3 editor playground 已完成工作区状态条、物料目录、物料详情、结构树、画布工具条、当前节点信息卡、属性字段分组、资源选择器主面板、页面设置面板、发布面板和 Schema 配置面板组件化。快捷命令搜索和展示限制已经复用 `@meumall/lowcode-editor` 的 command palette API，但弹窗模板仍内联在 `App.vue`。本任务只拆 Vue 展示层，不改变命令执行函数、命令列表派生、全局快捷键、Page Schema、renderer、materials 或 Java 配置平台草案。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorCommandPalette.vue`。
- 组件接收弹窗打开状态、关键词和 command palette API 过滤后的命令项。
- 组件渲染快捷命令弹窗、搜索输入、命令列表、禁用状态、分组标签和空状态。
- 组件通过 emits 抛出关闭、关键词更新、执行首个可用命令和执行指定命令。
- `App.vue` 改为复用该组件，命令列表派生、搜索过滤、执行函数、焦点控制、全局快捷键和弹窗互斥仍由 App shell 执行。
- 更新 Vue shell 组件化说明文档、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不改变 `@meumall/lowcode-editor` command palette API。
- 不改变快捷命令实际执行函数、命令列表来源、命令默认展示限制或搜索口径。
- 不改变 Page Schema v1、Material Manifest v1、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不拆顶部工具栏、节点右键菜单、画布上下文工具条、状态面板或源码辅助操作。
- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `EditorCommandPalette.vue` 负责快捷命令弹窗展示、搜索输入和用户操作事件抛出。
- `App.vue` 负责命令列表派生、命令搜索过滤、命令执行、焦点控制、弹窗互斥、全局快捷键、权限、审计和用户反馈。
- `@meumall/lowcode-editor` 继续负责框架无关 command palette 搜索和展示限制 helper。

外部系统：

- Java 管理台未来可复用该组件边界，并替换真实权限、审计、快捷命令注册和服务端保存策略。
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

1. 梳理当前快捷命令面板模板、事件和焦点控制。
2. 新增 `EditorCommandPalette.vue`，组件内部只做展示和事件抛出。
3. 在 `App.vue` 中导入并替换内联快捷命令弹窗。
4. 更新 Vue shell 组件化说明和 AI 状态文档。
5. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorCommandPalette.vue`，组件负责渲染快捷命令弹窗。
- [x] `App.vue` 使用新组件渲染快捷命令弹窗。
- [x] 顶部“命令”入口仍可打开面板。
- [x] `Meta/Ctrl + K` 仍可打开和关闭面板。
- [x] 搜索关键词仍可筛选命令、物料和模板。
- [x] `Enter` 仍执行第一个可用命令。
- [x] 点击命令仍执行对应命令并关闭面板。
- [x] 禁用命令仍展示为不可用且不可执行。
- [x] 空搜索结果仍展示空状态。
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
- smoke check：`pnpm smoke:browser` 验证快捷命令搜索、执行、保存草稿，以及编辑器和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 本任务只拆快捷命令展示层，不改变命令执行函数、权限、审计、服务端保存或真实管理台命令注册机制。
- 组件仍复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、权限插槽、命令注册插槽、快捷键策略和协作锁定状态。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，72 个 node test 全部通过，并内含架构检查。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，覆盖快捷命令搜索添加品牌专题物料、快捷命令添加留资表单和标签内容切换、快捷命令切换编辑模式、快捷命令保存草稿、编辑器内置 runtime、React H5 runtime、pageId/releaseId/fallback/empty/broken 入口。
- `pnpm pack:dry-run` 通过，8 个可发布包均可完成 npm pack dry-run。
- `git diff --check` 通过。

## 剩余风险

- 本任务没有改变命令执行函数、权限、审计、服务端保存或真实管理台命令注册机制。
- 快捷命令面板仍使用 playground 全局样式；后续抽独立 Vue editor UI 包时，需要补充样式隔离、设计 token、权限插槽、命令注册插槽、快捷键策略和协作锁定状态。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器快捷命令面板组件拆分、组件化文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorCommandPalette.vue`，保留命令列表派生、搜索过滤、执行函数、焦点控制和全局快捷键在 `App.vue`。 |
| 2026-08-01 | verified | 完成组件拆分、文档同步和验证，确认不改变快捷命令搜索、执行、快捷键、公开 API、npm 依赖或运行时行为。 |
