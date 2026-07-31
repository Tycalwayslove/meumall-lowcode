# TASK-2026-0801-123-editor-vue-schema-config-panel-component

## 标题

拆分 Vue3 编辑器 Schema 配置面板组件

## 状态

verified

## 目标

在不改变 Page Schema 数据源配置、动作配置、JSON 参数校验和运行时 mock action/data source 行为的前提下，将右侧数据源和动作配置区域从 `App.vue` 拆为独立 `EditorSchemaConfigPanel.vue` 组件，继续降低 Vue3 editor playground shell 复杂度，并为后续迁入 Java 管理台时复用数据源/动作配置交互边界做准备。

## 背景

当前 Vue3 editor playground 已完成工作区状态条、物料目录、物料详情、结构树、画布工具条、当前节点信息卡、属性字段分组、资源选择器主面板、页面设置面板和发布面板组件化。数据源和动作配置仍内联在 `App.vue`，但展示模型已经复用 `@meumall/lowcode-editor` 的 data source config API 和 action config API。本任务只拆 Vue 展示层，不改变 Page Schema v1、editor API、adapters、运行时 mock resolver/action handler 或 Java 配置平台草案。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorSchemaConfigPanel.vue`。
- 组件接收数据源表单项、动作表单项、动作类型选项和动作执行反馈文案。
- 组件渲染数据源列表、新增/删除数据源、数据源 ID/类型/bindTo/参数 JSON、解析状态、动作列表、新增/删除动作、动作 ID/类型/参数 JSON 和动作执行反馈。
- 组件通过 emits 抛出数据源新增、字段更新、参数 JSON 更新、删除，以及动作新增、ID 更新、类型更新、参数 JSON 更新和删除。
- `App.vue` 改为复用该组件，真实 JSON 解析、Page Schema 写回、action id 引用同步、action 删除引用清理、运行时 mock action/data source、权限、审计和服务端保存仍由 App shell 执行。
- 更新 Vue shell 组件化说明文档、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不改变 `@meumall/lowcode-editor` data source config API、action config API 或 event binding API。
- 不改变 Page Schema v1、Material Manifest v1、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不接真实 HTTP 数据源、鉴权、缓存、真实 action handler、风控或埋点平台。
- 不拆当前节点事件绑定 UI；事件绑定仍属于属性字段分组组件边界。
- 不拆快捷命令面板、右键菜单或顶部工具栏。
- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `EditorSchemaConfigPanel.vue` 负责 Schema 级数据源和动作配置展示，以及用户操作事件抛出。
- `App.vue` 负责展示模型派生、JSON 解析、Page Schema 写回、action id 引用同步、action 删除引用清理、mock resolver/action handler、权限、审计和用户反馈。
- `@meumall/lowcode-editor` 继续负责数据源和动作配置展示模型与 schema 写回 helper。

外部系统：

- Java 管理台未来可复用该组件边界，并替换真实数据源代理、action handler、权限、审计和服务端保存策略。
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

1. 梳理现有数据源和动作配置模板。
2. 新增 `EditorSchemaConfigPanel.vue`，组件内部只做展示和事件抛出。
3. 在 `App.vue` 中导入并替换内联数据源/动作配置模板。
4. 更新 Vue shell 组件化说明和 AI 状态文档。
5. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorSchemaConfigPanel.vue`，组件负责渲染数据源和动作配置区域。
- [x] `App.vue` 使用新组件渲染右侧数据源和动作配置区域。
- [x] 数据源仍支持新增、删除、编辑 ID、类型、bindTo 和参数 JSON。
- [x] 数据源解析状态仍展示 status、statusText 和 statusDescription。
- [x] 动作仍支持新增、删除、编辑 ID、类型和参数 JSON。
- [x] 动作执行反馈仍正常展示。
- [x] 非法数据源参数 JSON 和非法动作参数 JSON 仍由 App shell 拦截并提示，不破坏当前 schema。
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
- smoke check：`pnpm smoke:browser` 验证数据源、动作、发布检查、编辑器内置 runtime 和 React H5 runtime 关键路径仍可用。

## 风险和阻塞

- 本任务只拆 Schema 级数据源和动作配置展示层，不接真实 HTTP 数据源、鉴权、缓存、action handler、风控和审计。
- 组件仍复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、权限插槽、配置项插槽、协作锁定状态和保存状态。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，72 个 node test 全部通过，并内含架构检查。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，覆盖编辑器发布检查、H5 预览入口、Schema 导入导出、内置 Vue H5 runtime、React H5 runtime、pageId/releaseId/fallback/empty/broken 入口。
- `pnpm pack:dry-run` 通过，8 个可发布包均可完成 npm pack dry-run。
- `git diff --check` 通过。

## 剩余风险

- 本任务没有引入真实 HTTP 数据源、鉴权、缓存、真实 action handler、风控、审计或服务端保存。
- 数据源和动作面板仍使用 playground 全局样式；后续抽独立 Vue editor UI 包时，需要补充样式隔离、设计 token、权限插槽、配置项插槽、协作锁定状态和保存状态。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器 Schema 配置面板组件拆分、组件化文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorSchemaConfigPanel.vue`，保留 JSON 解析、schema 写回和 mock runtime 行为在 `App.vue`。 |
| 2026-08-01 | verified | 完成组件拆分、文档同步和验证，确认不改变 Page Schema、公开 API、npm 依赖或运行时行为。 |
