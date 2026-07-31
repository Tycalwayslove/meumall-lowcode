# TASK-2026-0801-119-editor-vue-prop-groups-component

## 标题

拆分 Vue3 编辑器属性字段分组组件

## 状态

verified

## 目标

在不改变现有属性编辑、数组列表编辑、列表项图片选择、事件绑定和商品快捷操作行为的前提下，将右侧属性字段分组区域从 `App.vue` 拆为独立 `EditorPropGroupsPanel.vue` 组件，继续降低 Vue3 editor playground shell 复杂度，并为后续资源选择器、页面设置和发布面板组件化建立更清晰的 inspector 边界。

## 背景

当前 Vue3 editor playground 已完成工作区状态条、物料目录、物料详情、结构树、画布工具条和当前节点信息卡组件化。右侧属性区仍把属性分组、基础输入控件、数组列表编辑、列表项图片素材选择、事件绑定和节点快捷操作混在 `App.vue` 中。属性字段分组已经复用 `@meumall/lowcode-editor` 的 prop groups、prop editor model 和 event binding API，适合先拆出 Vue 展示组件；真实 schema 写回、资源查询、素材应用、商品数据源绑定、权限和审计仍留在 App shell。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorPropGroupsPanel.vue`。
- 组件接收属性分组、当前节点 props、当前节点组件名、折叠状态、列表项拖拽状态、列表项素材选择状态、素材搜索状态和素材列表。
- 组件渲染属性分组、基础输入、颜色输入、开关输入、textarea/JSON 输入、数组列表编辑器、列表项图片素材选择面板和商品列表快捷操作。
- 组件通过 emits 抛出分组折叠、属性更新、数组项增删改移、数组项拖拽、列表项素材选择、素材筛选和商品快捷操作。
- `App.vue` 改为复用该组件，真实 Page Schema 写回、素材查询、素材应用、商品示例/数据源绑定仍由 App shell 执行。
- 更新 Vue shell 组件化说明文档、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不拆完整右侧资源选择器主面板。
- 不拆页面设置、发布检查、H5 预览入口、交付清单或版本历史。
- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不改变 Page Schema v1、Material Manifest v1、editor 公开 API、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不改变节点属性、事件或 dataBinding 的写回语义。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `EditorPropGroupsPanel.vue` 负责属性字段分组 UI、数组列表 UI、列表项素材选择 UI 和事件绑定 UI 的渲染，并抛出用户操作事件。
- `App.vue` 负责选中节点、属性分组模型、真实 `replaceNodeProps` 写回、列表项数据更新、素材查询、素材应用、商品示例应用、数据源绑定、权限、审计和用户反馈。
- `@meumall/lowcode-editor` 继续负责属性分组、字段控件类型、列表项字段、图片字段识别、输入值转换和事件绑定展示模型。

外部系统：

- Java 管理台未来可复用该组件边界，并替换资源选择、权限、协作锁定、审计和服务端保存策略。
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

1. 梳理现有属性分组模板、数组列表模板、列表项素材面板和事件绑定模板。
2. 新增 `EditorPropGroupsPanel.vue`，在组件内部只做展示派生和事件抛出。
3. 在 `App.vue` 中导入并替换内联属性分组和事件绑定模板。
4. 更新 Vue shell 组件化说明和 AI 状态文档。
5. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorPropGroupsPanel.vue`，组件负责渲染属性分组、字段控件、数组列表编辑器、列表项素材选择 UI 和事件绑定 UI。
- [x] `App.vue` 使用新组件渲染右侧属性字段分组和事件绑定区域。
- [x] 属性基础输入、开关输入、颜色输入、textarea/JSON 输入仍能通过 App shell 写回当前节点 props。
- [x] 数组列表项新增、复制、删除、上移、下移、拖拽排序和字段编辑仍能通过 App shell 写回当前节点 props。
- [x] 列表项图片素材选择仍由 App shell 查询素材并写回列表项字段。
- [x] 商品列表快捷操作仍由 App shell 执行示例商品应用和 dataSource 绑定。
- [x] 事件绑定仍由 App shell 写回当前节点 events。
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
- smoke check：`pnpm smoke:browser` 验证属性编辑、列表项图片素材选择、页面设置写入 schema、模板应用、H5 runtime 等关键路径仍可用。

## 风险和阻塞

- 本任务只拆属性字段分组和事件绑定区域，不拆右侧资源选择器主面板、页面设置或发布面板。
- 组件仍复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、权限插槽、资源选择器插槽、协作锁定状态和保存状态。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，72 个测试通过，并包含构建和架构边界检查。
- `pnpm check:architecture` 通过，确认可发布包结构、依赖方向、物料 manifest 对齐和 primitives 边界未被破坏。
- `pnpm smoke:browser` 通过，日志确认属性面板分组可折叠展开、列表项图片字段可从素材库选择并写回缩略预览、页面设置可写入 schema、编辑器内置 runtime 和 React H5 runtime 关键路径均通过。
- `pnpm pack:dry-run` 通过，8 个可发布包均完成 npm pack dry-run。

## 剩余风险

- 右侧素材、商品、优惠券、门店/达人资源选择器主面板仍在 `App.vue` 中，后续应按 Resource Library Client 边界单独拆分。
- 页面设置、发布检查、H5 预览入口、交付清单和版本历史仍在 `App.vue` 中，后续继续按 `docs/editor-vue-shell-components.md` 拆分。
- `EditorPropGroupsPanel.vue` 当前复用 playground 全局 CSS；如果未来抽独立 Vue editor UI 包，需要补充样式隔离、设计 token、权限插槽、资源选择器插槽、协作锁定状态和服务端保存状态。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器属性字段分组组件拆分、组件化文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorPropGroupsPanel.vue`，保留真实 schema 写回和资源查询在 `App.vue`。 |
| 2026-08-01 | verified | 完成属性字段分组组件拆分，类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run 均通过。 |
