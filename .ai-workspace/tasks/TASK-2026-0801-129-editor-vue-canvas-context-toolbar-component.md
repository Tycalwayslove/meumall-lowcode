# TASK-2026-0801-129-editor-vue-canvas-context-toolbar-component

## 标题

拆分 Vue3 编辑器画布上下文工具条组件

## 状态

verified

## 目标

在不改变设计模式下选中节点的上下文工具条展示、插入物料选择、前后插入、加入容器、上下移动、创建副本、更多菜单和删除行为的前提下，将 Vue3 editor playground 的画布上下文工具条从 `App.vue` 拆为独立 `EditorCanvasContextToolbar.vue` 组件，继续收敛编辑器 shell 的展示边界，并为后续迁入 Java 管理台时复用节点快捷操作区做准备。

## 背景

当前 Vue3 editor playground 已完成工作区状态条、顶部工具栏、快捷命令面板、节点右键菜单、物料目录、物料详情、结构树、画布工具条、当前节点信息卡、属性字段分组、资源选择器主面板、页面设置面板、发布面板、Schema 配置面板、源码辅助面板和状态面板组件化。设计模式下的画布上下文工具条仍内联在 `App.vue`，展示选中物料标题、节点 id、插入物料下拉框和节点快捷操作按钮。本任务只拆 Vue 展示层，不改变 node operation API、节点写回逻辑、右键菜单定位、Page Schema、renderer、materials 或 Java 配置平台草案。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorCanvasContextToolbar.vue`。
- 组件接收选中物料标题、选中节点 id、物料插入选项、当前插入物料组件名和 node operation API 派生后的操作项。
- 组件渲染画布上下文工具条、插入物料下拉框和节点快捷操作按钮。
- 组件通过 emits 抛出插入物料更新、前方插入、后方插入、加入容器、上移、下移、创建副本、打开更多菜单和删除事件。
- `App.vue` 改为复用该组件，选中节点判断、物料列表派生、节点操作禁用态派生、真实 schema 写回、右键菜单定位和用户反馈仍由 App shell 执行。
- 更新 Vue shell 组件化说明文档、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不改变 `@meumall/lowcode-editor` node operation API、editor state、canvas operation API 或 node selection API。
- 不改变画布上下文工具条展示文案、按钮顺序、禁用态、插入/移动/复制/删除逻辑、更多菜单定位、保存发布、权限、审计或 URL 构造。
- 不改变 Page Schema v1、Material Manifest v1、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `EditorCanvasContextToolbar.vue` 负责设计模式下选中节点的快捷操作区展示和用户操作事件抛出。
- `App.vue` 负责是否展示工具条、物料插入选项派生、node operation item 派生、真实节点插入/移动/复制/删除、更多菜单定位、Page Schema 写回、权限、审计和用户反馈。
- `@meumall/lowcode-editor` 继续负责框架无关 node operation、canvas operation、node selection 和 editor state helper。

外部系统：

- Java 管理台未来可复用该组件边界，并替换真实权限、审计、协作锁定、服务端保存、节点删除确认和审批策略。
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

1. 梳理当前画布上下文工具条模板、插入物料状态和节点操作事件。
2. 新增 `EditorCanvasContextToolbar.vue`，组件内部只做展示、禁用态读取和事件抛出。
3. 在 `App.vue` 中导入并替换内联画布上下文工具条。
4. 更新 Vue shell 组件化说明和 AI 状态文档。
5. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorCanvasContextToolbar.vue`，组件负责渲染选中节点标题、节点 id、插入物料下拉框和节点快捷操作按钮。
- [x] `App.vue` 使用新组件渲染设计模式下的画布上下文工具条。
- [x] 插入物料下拉框仍展示当前物料列表，并能更新 App shell 的 `selectedInsertComponentName`。
- [x] “前方插入”“后方插入”“加入容器”仍按原有禁用态和事件执行。
- [x] “上移”“下移”“创建副本”“更多”“删除”仍按原有禁用态和事件执行。
- [x] node operation API 派生、真实节点插入/移动/复制/删除、更多菜单定位、Page Schema 写回和用户反馈仍由 App shell 持有。
- [x] 组件不直接写入 Page Schema、不读写 localStorage、不调用 Java API、不执行权限或审计。
- [x] `docs/editor-vue-shell-components.md` 说明新增组件边界。
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
- smoke check：`pnpm smoke:browser` 验证画布上下文工具条相关节点操作、节点右键菜单、键盘快捷键、Schema 导入导出、编辑器和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 本任务只拆画布上下文工具条展示层，不改变节点插入、移动、复制、删除、右键菜单定位、保存发布、权限、审计、协作锁定、服务端保存或真实管理台删除确认机制。
- 组件仍复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、权限插槽、协作锁定状态、审批状态和按钮扩展插槽。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，72 个 node test 全部通过，并内含架构检查。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，覆盖编辑器 shell、画布节点选择、节点右键菜单、删除/复制/粘贴/撤销/重做快捷键、Schema 导入导出、预览/设计模式切换、编辑器内置 runtime、React H5 runtime、pageId/releaseId/fallback/empty/broken 入口。
- `pnpm pack:dry-run` 通过，8 个可发布包均可完成 npm pack dry-run。
- `git diff --check` 通过。

## 剩余风险

- 本任务没有改变节点插入、移动、复制、删除、右键菜单定位、保存发布、权限、审计、协作锁定、服务端保存或真实管理台删除确认机制。
- 画布上下文工具条仍使用 playground 全局样式；后续抽独立 Vue editor UI 包时，需要补充样式隔离、设计 token、权限插槽、协作锁定状态、审批状态和按钮扩展插槽。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器画布上下文工具条组件拆分、组件化文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorCanvasContextToolbar.vue`，保留物料选项派生、node operation item 派生、真实节点操作、更多菜单定位和 Page Schema 写回在 `App.vue`。 |
| 2026-08-01 | verified | 完成组件拆分、文档同步和验证，确认不改变画布上下文工具条展示、节点快捷操作、更多菜单、公开 API、npm 依赖或运行时行为。 |
