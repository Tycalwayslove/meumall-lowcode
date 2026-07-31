# TASK-2026-0801-122-editor-vue-publish-panel-component

## 标题

拆分 Vue3 编辑器发布面板组件

## 状态

verified

## 目标

在不改变 H5 预览入口、交付清单、发布检查、本地版本列表、版本对比、载入版本和回滚发布行为的前提下，将右侧发布相关区域从 `App.vue` 拆为独立 `EditorPublishPanel.vue` 组件，继续降低 Vue3 editor playground shell 复杂度，并为后续迁入 Java 管理台时替换真实发布审批、服务端校验、版本 diff 和回滚流程预留清晰边界。

## 背景

当前 Vue3 editor playground 已完成工作区状态条、物料目录、物料详情、结构树、画布工具条、当前节点信息卡、属性字段分组、资源选择器主面板和页面设置面板组件化。发布相关区域仍内联在 `App.vue`，但其展示数据已经分别复用 readiness、preview links、delivery summary、release history 和 version summary API。本任务只拆 Vue 展示层，不改变本地 mock 发布链路、Page Schema v1、editor API 或 Java 配置平台草案。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorPublishPanel.vue`。
- 组件接收 H5 预览入口列表、预览入口摘要、交付状态、交付指标、发布检查列表、发布检查摘要、本地版本数量、版本筛选关键词、版本列表、版本列表摘要、选中版本状态、版本差异摘要、版本差异列表和 Schema 片段预览。
- 组件渲染 H5 预览入口、交付清单、发布检查、本地版本列表、版本对比和 Schema 片段预览。
- 组件通过 emits 抛出预览入口打开/复制、Schema 复制/导出、发布检查定位、版本关键词更新、版本选择、版本载入、版本打开、载入所选版本和回滚发布事件。
- `App.vue` 改为复用该组件，真实 URL 构造、剪贴板、Schema 导出、节点定位、保存/预览/发布、版本载入、回滚确认、权限、审批、审计和服务端保存仍由 App shell 执行。
- 更新 Vue shell 组件化说明文档、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不改变 `@meumall/lowcode-editor` readiness、preview links、delivery summary、release history 或 version summary API。
- 不改变 Page Schema v1、Material Manifest v1、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不接真实 Java 发布审批、服务端发布校验、服务端 JSON 级版本 diff 或真实回滚接口。
- 不拆数据源配置、动作配置、事件绑定配置或快捷命令面板。
- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `EditorPublishPanel.vue` 负责发布相关区域展示和用户操作事件抛出。
- `App.vue` 负责展示模型派生、真实保存/预览/发布、本地 mock 配置平台调用、URL 构造、剪贴板、Schema 导出、节点定位、版本载入、回滚确认、权限、审批、审计和用户反馈。
- `@meumall/lowcode-editor` 继续负责发布检查、交付清单、预览入口、版本列表、版本差异和 Schema 片段预览展示模型。

外部系统：

- Java 管理台未来可复用该组件边界，并替换真实发布审批、服务端发布校验、版本 diff、回滚、权限和审计策略。
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

1. 梳理现有 H5 预览入口、交付清单、发布检查、本地版本和版本对比模板。
2. 新增 `EditorPublishPanel.vue`，组件内部只做展示和事件抛出。
3. 在 `App.vue` 中导入并替换内联发布相关模板。
4. 更新 Vue shell 组件化说明和 AI 状态文档。
5. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorPublishPanel.vue`，组件负责渲染 H5 预览入口、交付清单、发布检查、本地版本和版本对比。
- [x] `App.vue` 使用新组件渲染右侧发布相关区域。
- [x] H5 预览入口仍支持打开和复制。
- [x] 交付清单仍支持复制 Schema 和导出 Schema。
- [x] 发布检查仍展示通过、警告、错误数量，并支持节点定位。
- [x] 本地版本仍支持关键词筛选、选择对比、载入和打开 runtime。
- [x] 选中版本仍展示差异摘要、差异列表、Schema 片段预览、载入所选和回滚发布入口。
- [x] 组件不直接写入 Page Schema、不读写 localStorage、不调用 Java API、不执行保存/发布/回滚、权限或审计。
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
- smoke check：`pnpm smoke:browser` 验证发布检查、H5 预览入口、交付清单、本地版本筛选/差异对比、编辑器内置 runtime 和 React H5 runtime 关键路径仍可用。

## 风险和阻塞

- 本任务只拆发布相关展示层，不接真实 Java 发布审批、服务端发布校验、服务端版本 diff 和真实回滚。
- 组件仍复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、权限插槽、发布操作插槽、审批状态、协作锁定状态和保存状态。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，72 个测试通过，并包含构建和架构边界检查。
- `pnpm check:architecture` 通过，确认可发布包结构、依赖方向、物料 manifest 对齐和 primitives 边界未被破坏。
- `pnpm smoke:browser` 通过，日志确认发布检查存在、H5 预览入口可展示链接并提供复制反馈、交付清单可复制/导出 Schema、发布检查可定位问题节点、本地版本对比可展示字段差异和 schema 片段详情，编辑器内置 runtime 和 React H5 runtime 关键路径均通过。
- `pnpm pack:dry-run` 通过，8 个可发布包均完成 npm pack dry-run。

## 剩余风险

- 本任务只拆发布相关展示层；真实 Java 发布审批、服务端发布校验、服务端版本 diff、真实回滚、权限和审计仍需后续业务对接。
- 数据源配置、动作配置、事件绑定配置、快捷命令面板和右键菜单仍在 `App.vue` 中，后续继续按 `docs/editor-vue-shell-components.md` 拆分。
- `EditorPublishPanel.vue` 当前复用 playground 全局 CSS；如果未来抽独立 Vue editor UI 包，需要补充样式隔离、设计 token、权限插槽、发布操作插槽、审批状态、协作锁定状态和服务端保存状态。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器发布面板组件拆分、组件化文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorPublishPanel.vue`，保留保存、预览、发布、版本载入和回滚逻辑在 `App.vue`。 |
| 2026-08-01 | verified | 完成发布面板组件拆分，类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run 均通过。 |
