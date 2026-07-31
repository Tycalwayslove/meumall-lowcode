# TASK-2026-0801-118-editor-vue-selected-node-card-component

## 标题

拆分 Vue3 编辑器当前节点信息卡组件

## 状态

verified

## 目标

在保持现有 Vue3 editor playground 右侧属性区交互不变的前提下，将当前节点信息卡从 `App.vue` 拆为独立 `EditorSelectedNodeCard.vue` 组件，继续降低编辑器 shell 单文件复杂度，并为后续拆分完整属性面板建立更稳定的 inspector UI 边界。

## 背景

当前 Vue3 editor playground 已完成工作区状态条、物料目录、物料详情、结构树和画布工具条组件化，但右侧属性区仍大量内联在 `App.vue` 中。完整属性面板包含资源选择器、数组列表编辑、事件绑定、数据源、动作配置和真实 schema 写回，直接整体拆分风险较高；当前节点信息卡只展示节点展示名、物料标题/分类、节点名称输入、节点 id、位置和父级，并通过现有 `renameSelectedNode` 写回 `node.meta.name`，适合作为属性面板拆分的第一步。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorSelectedNodeCard.vue`。
- 组件接收节点展示名、物料标题、物料分类、节点名称、节点 id、位置文案和父级文案。
- 组件通过 emits 抛出节点名称提交。
- `App.vue` 改为复用该组件，保持现有 `.selected-card`、`.node-name-field`、`.selected-meta` 样式和 DOM 语义稳定。
- 更新 Vue3 shell 组件化说明文档、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不改变 Page Schema v1、Material Manifest v1、editor 公开 API、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不重构资源选择器、属性字段编辑器、数组列表编辑器、事件绑定、数据源配置、动作配置、页面设置或发布面板。
- 不改变节点命名写回规则。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `EditorSelectedNodeCard.vue` 负责当前节点信息卡展示和节点名称提交事件抛出。
- `App.vue` 负责选中节点、节点展示名、物料信息、父级/位置文案计算、真实 `node.meta.name` 写回、权限、审计和用户反馈。
- `@meumall/lowcode-editor` 继续负责节点展示名等框架无关模型。

外部系统：

- Java 管理台未来可复用该组件边界，并替换权限、协作锁定、审计和服务端保存策略。
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

1. 梳理当前节点信息卡模板、props 和事件边界。
2. 新增 `EditorSelectedNodeCard.vue` 组件。
3. 在 `App.vue` 中导入并替换内联当前节点信息卡模板。
4. 更新 Vue shell 组件化说明和 AI 状态文档。
5. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorSelectedNodeCard.vue`，组件只负责当前节点信息展示和节点名称提交事件抛出。
- [x] `App.vue` 使用新组件渲染节点展示名、物料标题/分类、节点名称输入、节点 id、位置和父级。
- [x] 节点名称提交仍由 App shell 执行真实 schema 写回。
- [x] 现有 `.selected-card`、`.node-name-field`、`.selected-meta` 等样式继续复用，视觉和 DOM 语义保持稳定。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器节点重命名、结构树搜索命中和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 本任务只拆当前节点信息卡，不拆完整属性字段编辑器、资源选择器、页面设置或发布面板。
- 组件仍复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、权限插槽和协作锁定状态。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，72 个测试通过，并包含架构边界检查。
- `pnpm check:architecture` 通过，确认可发布包结构、依赖方向、物料 manifest 对齐和 primitives 边界未被破坏。
- `pnpm smoke:browser` 通过，日志确认结构树可搜索命中折叠容器内节点、定位选中并重命名，H5 预览入口、编辑器内置 runtime 和 React H5 runtime 关键路径均通过。
- `pnpm pack:dry-run` 通过，8 个可发布包均完成 npm pack dry-run。

## 剩余风险

- 完整属性字段编辑器、资源选择器、页面设置和发布面板仍在 `App.vue` 中，后续需要按 `docs/editor-vue-shell-components.md` 继续拆分。
- `EditorSelectedNodeCard.vue` 当前复用 playground 全局 CSS；如果未来抽独立 Vue editor UI 包，需要补充样式隔离、设计 token、权限插槽、协作锁定状态和服务端保存状态。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器当前节点信息卡组件拆分、组件化文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorSelectedNodeCard.vue`、接回 `App.vue` 并更新组件化说明。 |
| 2026-08-01 | verified | 完成当前节点信息卡组件拆分，类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run 均通过。 |
