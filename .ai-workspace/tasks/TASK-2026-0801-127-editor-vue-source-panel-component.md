# TASK-2026-0801-127-editor-vue-source-panel-component

## 标题

拆分 Vue3 编辑器源码辅助面板组件

## 状态

verified

## 目标

在不改变源码模式 JSON 编辑、应用 JSON、Schema 导入导出、错误提示和用户反馈行为的前提下，将 Vue3 editor playground 的源码辅助面板从 `App.vue` 拆为独立 `EditorSourcePanel.vue` 组件，继续收敛编辑器 shell 的展示边界，并为后续迁入 Java 管理台时复用源码编辑区交互结构做准备。

## 背景

当前 Vue3 editor playground 已完成工作区状态条、顶部工具栏、快捷命令面板、节点右键菜单、物料目录、物料详情、结构树、画布工具条、当前节点信息卡、属性字段分组、资源选择器主面板、页面设置面板、发布面板和 Schema 配置面板组件化。源码模式仍内联在 `App.vue`，承载 schema JSON 草稿文本域、应用 JSON、导出 JSON、导入 JSON、导入导出提示和 JSON 错误提示。本任务只拆 Vue 展示层，不改变 JSON 解析校验、Page Schema 写入、文件导入导出、剪贴板、发布保存、renderer、materials 或 Java 配置平台草案。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorSourcePanel.vue`。
- 组件接收 schema JSON 草稿、导入导出提示和 JSON 错误提示。
- 组件渲染源码模式文本域、应用 JSON、导出 JSON、导入 JSON 和提示信息。
- 组件通过 emits 抛出 schema 草稿更新、应用 JSON、导出 JSON 和导入 JSON。
- `App.vue` 改为复用该组件，JSON 解析校验、Page Schema 替换、隐藏文件 input、文件读取解析、schemaTransferMessage、jsonError 和 releaseMessage 仍由 App shell 执行。
- 更新 Vue shell 组件化说明文档、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不改变 `@meumall/lowcode-editor` schema file API、draft persistence API、workspace summary API 或 command API。
- 不改变源码模式实际解析、校验、文件导入导出、剪贴板、保存发布、权限、审计或 URL 构造。
- 不改变 Page Schema v1、Material Manifest v1、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不拆状态面板、画布上下文工具条或其他右侧面板。
- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `EditorSourcePanel.vue` 负责源码模式 JSON 文本域、操作按钮和提示信息展示，并抛出用户操作事件。
- `App.vue` 负责 JSON 解析校验、Page Schema 写回、文件 input、文件导入导出、schemaTransferMessage、jsonError、releaseMessage、权限、审计和用户反馈。
- `@meumall/lowcode-editor` 继续负责框架无关 schema file parse/export、Page Schema 校验和 editor state helper。

外部系统：

- Java 管理台未来可复用该组件边界，并替换真实权限、审计、协作锁定、服务端保存、导入审批和发布策略。
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

1. 梳理当前源码模式模板、草稿状态和事件。
2. 新增 `EditorSourcePanel.vue`，组件内部只做展示和事件抛出。
3. 在 `App.vue` 中导入并替换内联源码模式区域。
4. 更新 Vue shell 组件化说明和 AI 状态文档。
5. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorSourcePanel.vue`，组件负责渲染源码 JSON 文本域、操作按钮和提示信息。
- [x] `App.vue` 使用新组件渲染源码模式区域。
- [x] schema JSON 草稿编辑仍能同步到 App shell。
- [x] “应用 JSON”仍执行原有解析、校验和 Page Schema 替换流程。
- [x] “导出 JSON”和“导入 JSON”仍触发原有文件导入导出流程。
- [x] 导入导出成功提示和 JSON 错误提示仍按原样展示。
- [x] JSON 解析校验、Page Schema 写回、隐藏文件 input、文件读取解析、schemaTransferMessage、jsonError 和 releaseMessage 仍由 App shell 持有。
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
- smoke check：`pnpm smoke:browser` 验证源码模式切换、schema 文案、Schema 导入导出、编辑器和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 本任务只拆源码模式展示层，不改变 JSON 解析、文件导入导出、保存发布、权限、审计、协作锁定、服务端保存或真实管理台导入审批机制。
- 组件仍复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、权限插槽、协作锁定状态、审批状态和按钮扩展插槽。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，72 个 node test 全部通过，并内含架构检查。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，覆盖源码模式展示、Schema 导入导出、非法导入不覆盖、合法导入替换画布、预览/设计模式切换、编辑器内置 runtime、React H5 runtime、pageId/releaseId/fallback/empty/broken 入口。
- `pnpm pack:dry-run` 通过，8 个可发布包均可完成 npm pack dry-run。
- `git diff --check` 通过。

## 剩余风险

- 本任务没有改变 JSON 解析校验、Page Schema 替换、文件导入导出、保存发布、权限、审计、协作锁定、服务端保存或真实管理台导入审批机制。
- 源码辅助面板仍使用 playground 全局样式；后续抽独立 Vue editor UI 包时，需要补充样式隔离、设计 token、权限插槽、协作锁定状态、审批状态和按钮扩展插槽。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器源码辅助面板组件拆分、组件化文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorSourcePanel.vue`，保留 JSON 解析校验、Page Schema 替换、文件 input、导入导出和用户反馈在 `App.vue`。 |
| 2026-08-01 | verified | 完成组件拆分、文档同步和验证，确认不改变源码 JSON 编辑、应用 JSON、Schema 导入导出、错误提示、用户反馈、公开 API、npm 依赖或运行时行为。 |
