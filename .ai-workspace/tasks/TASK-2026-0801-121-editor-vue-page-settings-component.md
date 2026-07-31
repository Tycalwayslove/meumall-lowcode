# TASK-2026-0801-121-editor-vue-page-settings-component

## 标题

拆分 Vue3 编辑器页面设置面板组件

## 状态

verified

## 目标

在不改变 Page Schema 页面基础配置、布局配置、发布配置和本地版本备注行为的前提下，将右侧页面设置面板从 `App.vue` 拆为独立 `EditorPageSettingsPanel.vue` 组件，继续降低 Vue3 editor playground shell 复杂度，并为后续迁入 Java 管理台时复用页面设置交互边界做准备。

## 背景

当前 Vue3 editor playground 已完成工作区状态条、物料目录、物料详情、结构树、画布工具条、当前节点信息卡、属性字段分组和资源选择器主面板组件化。页面设置已复用 `@meumall/lowcode-editor` 的 page settings API，但模板仍内联在 `App.vue`。本任务只拆 Vue 展示层，不改变 Page Schema v1、editor API、发布链路或本地版本备注语义。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorPageSettingsPanel.vue`。
- 组件接收 `LowcodeEditorPageSettingsForm`、版本备注草稿和发布操作反馈文案。
- 组件渲染页面标题、描述、页面类型、Page ID、背景色、快捷色板、安全区、H5 最大宽度、状态、发布环境和版本备注。
- 组件通过 emits 抛出页面字段更新、背景色更新、安全区更新、最大宽度更新和版本备注草稿更新。
- `App.vue` 改为复用该组件，真实 Page Schema 写回、版本备注保存、权限、审计和服务端保存仍由 App shell 执行。
- 更新 Vue shell 组件化说明文档、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不改变 `@meumall/lowcode-editor` page settings API。
- 不改变 Page Schema v1、Material Manifest v1、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不拆发布检查、H5 预览入口、交付清单、版本历史、数据源配置或动作配置面板。
- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `EditorPageSettingsPanel.vue` 负责页面设置面板展示和用户操作事件抛出。
- `App.vue` 负责 `createLowcodePageSettingsForm` 派生、Page Schema 写回、版本备注草稿状态、发布/保存链路、权限、审计和用户反馈。
- `@meumall/lowcode-editor` 继续负责页面设置展示模型和 Page Schema 写回 helper。

外部系统：

- Java 管理台未来可复用该组件边界，并替换真实权限、审批、审计和服务端保存策略。
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

1. 梳理现有页面基础配置、布局配置、发布配置和版本备注模板。
2. 新增 `EditorPageSettingsPanel.vue`，组件内部只做展示和事件抛出。
3. 在 `App.vue` 中导入并替换内联页面设置模板。
4. 更新 Vue shell 组件化说明和 AI 状态文档。
5. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorPageSettingsPanel.vue`，组件负责渲染页面设置面板。
- [x] `App.vue` 使用新组件渲染右侧页面设置。
- [x] 页面标题、描述、类型、背景色、安全区、H5 最大宽度、状态和发布环境仍通过 App shell 写回 Page Schema。
- [x] 版本备注仍由 App shell 持有，并可通过组件输入更新草稿。
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
- smoke check：`pnpm smoke:browser` 验证页面设置写入 schema、模板应用、编辑器内置 runtime 和 React H5 runtime 关键路径仍可用。

## 风险和阻塞

- 本任务只拆页面设置展示层，不接真实 Java 配置平台保存、审批和审计。
- 组件仍复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、权限插槽、协作锁定状态和保存状态。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，72 个测试通过，并包含构建和架构边界检查。
- `pnpm check:architecture` 通过，确认可发布包结构、依赖方向、物料 manifest 对齐和 primitives 边界未被破坏。
- `pnpm smoke:browser` 通过，日志确认页面设置可写入标题、描述、类型、布局和发布环境，模板应用、编辑器内置 runtime 和 React H5 runtime 关键路径均通过。
- `pnpm pack:dry-run` 通过，8 个可发布包均完成 npm pack dry-run。

## 剩余风险

- 本任务只拆页面设置展示层；真实 Java 配置平台保存、审批、审计、服务端发布校验和权限仍需后续业务对接。
- 发布检查、H5 预览入口、交付清单、版本历史、数据源配置和动作配置仍在 `App.vue` 中，后续继续按 `docs/editor-vue-shell-components.md` 拆分。
- `EditorPageSettingsPanel.vue` 当前复用 playground 全局 CSS；如果未来抽独立 Vue editor UI 包，需要补充样式隔离、设计 token、权限插槽、协作锁定状态和服务端保存状态。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器页面设置面板组件拆分、组件化文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorPageSettingsPanel.vue`，保留 Page Schema 写回、版本备注状态和发布保存链路在 `App.vue`。 |
| 2026-08-01 | verified | 完成页面设置面板组件拆分，类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run 均通过。 |
