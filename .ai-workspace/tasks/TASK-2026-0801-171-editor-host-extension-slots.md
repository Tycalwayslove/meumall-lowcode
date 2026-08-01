# TASK-2026-0801-171 Vue3 编辑器宿主扩展插槽

## 状态

- status: verified
- created_at: 2026-08-01 14:45 CST
- owner: AI Agent

## 背景

Vue3 editor playground 已完成主要面板和工具条组件化，顶部工具栏也已改为消费 capability status items。但这些组件仍没有命名插槽，未来迁入 Java 管理系统时，宿主常见的审计日志、权限提示、配置平台状态、发布策略说明、审批扩展动作等内容只能继续改组件源码。为了让 playground 更接近“可被管理台承接的编辑器 shell”，需要先补一层轻量宿主扩展插槽。

## 目标

为 `EditorTopToolbar` 和 `EditorPublishPanel` 增加命名插槽，并在 playground 中接入可见的宿主扩展示例，验证管理台可以在不改组件内部逻辑的情况下插入顶部操作和发布侧提示。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

包含：

- `EditorTopToolbar.vue` 增加顶部状态扩展位、主工具栏扩展位和保存/发布工具栏扩展位。
- `EditorPublishPanel.vue` 增加交付清单、发布审批、发布检查和版本列表扩展位。
- `App.vue` 接入宿主扩展示例，用于展示审计日志入口和发布策略提示。
- smoke 增加宿主扩展位渲染断言。
- 更新 Vue shell 组件边界文档、AI 状态、测试报告和任务记录。

不包含：

- 不抽 `@meumall/lowcode-editor-vue` 包。
- 不新增 editor npm 公开 API。
- 不新增 Java 审计、权限、审批或发布策略接口。
- 不改变 Page Schema v1、Material Manifest v1、renderer 或 materials。
- 不改变现有保存、预览、发布或审批流转逻辑。

## 责任边界

当前仓库：

- Vue3 editor playground 作为未来管理台接入参考，提供命名插槽边界和本地示例。
- 组件只渲染 slot，不持有宿主业务逻辑。

外部系统：

- Java 管理台、权限中心、审计系统、审批系统和发布策略服务仍由宿主实现。

## 契约影响

- 是否影响 npm 公开 API：否，当前 app 组件不是已发布 npm 包。
- 是否影响 Page Schema v1：否。
- 是否影响 Material Manifest v1：否。
- 是否需要迁移：否。
- 是否向后兼容：是，未提供 slot 时保持原有渲染。

## 对接说明

- 后续如果抽 `@meumall/lowcode-editor-vue`，这些 slot 名称应作为候选 UI 契约进入正式 README。
- 真实管理台可使用 slot 接入审计日志、权限说明、发布策略、审批详情、配置平台连接状态或外部帮助入口。

## 验收标准

- [x] `EditorTopToolbar` 提供顶部状态、主工具栏、保存/发布工具栏三个命名扩展位。
- [x] `EditorPublishPanel` 提供交付、审批、发布检查、版本列表四个命名扩展位。
- [x] playground 中有宿主扩展示例，且不改变原有编辑、预览、发布流程。
- [x] 不新增 schema、renderer、materials 或 npm API 变更。
- [x] `pnpm --filter @meumall/lowcode-editor-playground typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm --filter @meumall/lowcode-editor-playground typecheck
pnpm test
pnpm smoke:browser
```

## 验证结果

- 2026-08-01 14:47 CST：`pnpm --filter @meumall/lowcode-editor-playground typecheck` 通过。
- 2026-08-01 14:47 CST：`pnpm test` 通过，覆盖 build、architecture check 和 109 个单测。
- 2026-08-01 14:48 CST：`pnpm smoke:browser` 通过，新增覆盖顶部宿主扩展位和发布面板宿主扩展位可见，并继续覆盖编辑器、审批流、HTTP 配置平台和 H5 runtime。

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否影响 H5 接入：否。
- 是否影响 Java 配置平台：否。
- 回滚目标：回滚本任务提交即可移除插槽和 playground 示例。

## 风险和阻塞

- 当前 slot 是 playground 组件边界，不是正式 npm Vue 组件契约；后续抽包前需要再冻结命名、类型和 README。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器宿主扩展插槽。 |
| 2026-08-01 | in_progress | 实现顶部工具栏和发布面板命名插槽，接入 playground 宿主演示并补 browser smoke 断言。 |
| 2026-08-01 | verified | playground typecheck、完整测试和 browser smoke 均已完成并验证。 |
