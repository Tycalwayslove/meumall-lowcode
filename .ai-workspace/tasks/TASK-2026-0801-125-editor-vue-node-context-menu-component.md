# TASK-2026-0801-125-editor-vue-node-context-menu-component

## 标题

拆分 Vue3 编辑器节点右键菜单组件

## 状态

verified

## 目标

在不改变节点右键菜单定位、节点选择、菜单项禁用状态、节点操作执行和键盘快捷键行为的前提下，将 Vue3 editor playground 的节点右键菜单浮层从 `App.vue` 拆为独立 `EditorNodeContextMenu.vue` 组件，继续降低编辑器 shell 单文件复杂度，并为后续迁入 Java 管理台时复用节点操作菜单展示边界做准备。

## 背景

当前 Vue3 editor playground 已完成工作区状态条、快捷命令面板、物料目录、物料详情、结构树、画布工具条、当前节点信息卡、属性字段分组、资源选择器主面板、页面设置面板、发布面板和 Schema 配置面板组件化。节点右键菜单的菜单项和禁用状态已复用 `@meumall/lowcode-editor` 的 node operation API，但浮层模板仍内联在 `App.vue`。本任务只拆 Vue 展示层，不改变节点操作 API、菜单定位、真实节点命令执行、全局快捷键、Page Schema、renderer、materials 或 Java 配置平台草案。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorNodeContextMenu.vue`。
- 组件接收打开状态、菜单位置 style、节点展示名、节点副标题和 node operation API 派生后的菜单项。
- 组件渲染右键菜单遮罩、菜单头、菜单项、快捷键文案、禁用状态、危险操作样式和操作图标。
- 组件通过 emits 抛出关闭和执行指定菜单项。
- `App.vue` 改为复用该组件，菜单定位、选中节点、菜单项派生、真实节点操作执行、确认弹窗、全局快捷键和用户反馈仍由 App shell 执行。
- 更新 Vue shell 组件化说明文档、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不改变 `@meumall/lowcode-editor` node operation API。
- 不改变节点右键菜单实际执行函数、菜单定位算法、键盘快捷键判断或操作反馈文案。
- 不改变 Page Schema v1、Material Manifest v1、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不拆顶部工具栏、画布上下文工具条、状态面板或源码辅助操作。
- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `EditorNodeContextMenu.vue` 负责节点右键菜单浮层展示、菜单项展示和用户操作事件抛出。
- `App.vue` 负责菜单定位、选中节点、菜单项派生、真实节点操作执行、确认弹窗、键盘快捷键、权限、审计和用户反馈。
- `@meumall/lowcode-editor` 继续负责框架无关 node operation 菜单项、禁用状态、快捷键识别和反馈文案 helper。

外部系统：

- Java 管理台未来可复用该组件边界，并替换真实权限、审计、协作锁定和服务端保存策略。
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

1. 梳理当前节点右键菜单模板、菜单项和执行事件。
2. 新增 `EditorNodeContextMenu.vue`，组件内部只做展示和事件抛出。
3. 在 `App.vue` 中导入并替换内联节点右键菜单浮层。
4. 更新 Vue shell 组件化说明和 AI 状态文档。
5. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorNodeContextMenu.vue`，组件负责渲染节点右键菜单浮层。
- [x] `App.vue` 使用新组件渲染右键菜单遮罩和菜单。
- [x] H5 画布节点右键仍可打开菜单并选中对应节点。
- [x] 结构树节点右键仍可打开菜单并选中对应节点。
- [x] 菜单项仍展示图标、标签、快捷键、禁用状态和危险操作样式。
- [x] 点击菜单项仍执行对应节点操作并关闭菜单。
- [x] 禁用菜单项仍不可执行。
- [x] Escape、点击遮罩和再次右键遮罩仍可关闭菜单。
- [x] 节点键盘快捷键仍可用。
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
- smoke check：`pnpm smoke:browser` 验证节点右键菜单、删除、复制、粘贴、撤销、重做快捷键，以及编辑器和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 本任务只拆节点右键菜单展示层，不改变真实节点操作执行、权限、审计、协作锁定、确认弹窗、服务端保存或真实管理台命令注册机制。
- 组件仍复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、权限插槽、协作锁定状态和菜单项扩展插槽。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，72 个 node test 全部通过，并内含架构检查。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，覆盖节点右键菜单、删除、复制、粘贴、撤销、重做快捷键、编辑器内置 runtime、React H5 runtime、pageId/releaseId/fallback/empty/broken 入口。
- `pnpm pack:dry-run` 通过，8 个可发布包均可完成 npm pack dry-run。
- `git diff --check` 通过。

## 剩余风险

- 本任务没有改变真实节点操作执行、权限、审计、协作锁定、确认弹窗、服务端保存或真实管理台命令注册机制。
- 节点右键菜单仍使用 playground 全局样式；后续抽独立 Vue editor UI 包时，需要补充样式隔离、设计 token、权限插槽、协作锁定状态和菜单项扩展插槽。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器节点右键菜单组件拆分、组件化文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorNodeContextMenu.vue`，保留菜单定位、选中节点、菜单项派生和真实节点操作执行在 `App.vue`。 |
| 2026-08-01 | verified | 完成组件拆分、文档同步和验证，确认不改变节点右键菜单定位、节点选择、菜单项禁用状态、节点操作执行、键盘快捷键、公开 API、npm 依赖或运行时行为。 |
