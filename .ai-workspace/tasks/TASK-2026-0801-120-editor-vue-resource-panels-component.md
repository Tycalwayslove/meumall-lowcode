# TASK-2026-0801-120-editor-vue-resource-panels-component

## 标题

拆分 Vue3 编辑器资源选择器主面板组件

## 状态

verified

## 目标

在不改变现有素材、商品、优惠券、门店/达人资源选择、静态 props 写回和 dataSource 绑定行为的前提下，将右侧资源选择器主面板从 `App.vue` 拆为独立 `EditorResourcePanels.vue` 组件，继续降低 Vue3 editor playground shell 复杂度，并为后续迁入 Java 管理台时替换真实资源中心、权限、审计和服务端保存策略预留清晰边界。

## 背景

当前 Vue3 editor playground 已完成工作区状态条、物料目录、物料详情、结构树、画布工具条、当前节点信息卡和属性字段分组组件化。右侧资源选择器主面板仍内联在 `App.vue` 中，包含图片素材、商品、优惠券和门店/达人四类运营常用资源。资源数据查询已经通过 `LowcodeResourceLibraryClient` 解耦，本任务只拆 Vue 展示层，不改变资源 client、schema 写回和 dataSource 绑定语义。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/components/EditorResourcePanels.vue`。
- 组件接收图片属性选项、图片素材筛选状态、图片素材列表、商品筛选状态、商品列表、优惠券筛选状态、优惠券列表、门店/达人筛选状态、门店/达人列表、选中资源 id、选中数量和当前节点 dataBinding 状态。
- 组件渲染图片素材库、商品选择器、优惠券库和门店/达人库。
- 组件通过 emits 抛出筛选更新、图片素材应用、商品/优惠券/门店达人勾选、应用选中资源、绑定数据源、清空静态资源和示例商品操作。
- `App.vue` 改为复用该组件，真实资源查询、选择状态、静态 props 写回、dataSource 绑定和提示消息仍由 App shell 执行。
- 更新 Vue shell 组件化说明文档、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不改变 `LowcodeResourceLibraryClient` 或新增真实 HTTP 资源中心接入。
- 不拆属性字段分组、页面设置、发布检查、H5 预览入口、交付清单或版本历史。
- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不改变 Page Schema v1、Material Manifest v1、editor 公开 API、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不改变素材、商品、优惠券、门店/达人写回 props 或 dataBinding 的语义。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `EditorResourcePanels.vue` 负责资源选择器主面板展示和用户操作事件抛出。
- `App.vue` 负责 Resource Library Client 查询、筛选状态、选中状态、静态 props 写回、dataSource 绑定、清空、示例商品、权限、审计和用户反馈。
- `@meumall/lowcode-adapters` 继续负责资源库 client 抽象。

外部系统：

- Java 管理台未来可复用该组件边界，并替换真实素材中心、商品中心、优惠券中心、门店/达人中心、权限、审计和服务端保存策略。
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

1. 梳理现有图片素材、商品、优惠券和门店/达人资源选择器模板。
2. 新增 `EditorResourcePanels.vue`，组件内部只做展示和事件抛出。
3. 在 `App.vue` 中导入并替换内联资源选择器主面板模板。
4. 更新 Vue shell 组件化说明和 AI 状态文档。
5. 运行验证命令并记录结果。

## 验收标准

- [x] 新增 `EditorResourcePanels.vue`，组件负责渲染图片素材库、商品选择器、优惠券库和门店/达人库。
- [x] `App.vue` 使用新组件渲染右侧资源选择器主面板。
- [x] 图片素材选择仍能通过 App shell 写回当前节点图片属性。
- [x] 商品选择器仍支持搜索、勾选、应用选中商品、绑定 `products` 数据源、清空静态商品和示例商品。
- [x] 优惠券库仍支持搜索、单选主券或多选券包、应用选中券和清空选择。
- [x] 门店/达人库仍支持搜索、分类筛选、勾选、应用选中推荐、绑定 `stores` 数据源和清空静态推荐。
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
- smoke check：`pnpm smoke:browser` 验证资源选择、列表项图片素材写回、属性编辑、模板应用和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 本任务只拆资源选择器主面板，不接真实资源中心、不改权限和服务端保存。
- 组件仍复用 playground 全局 CSS；后续如果抽独立 Vue editor UI 包，需要再治理样式隔离、设计 token、权限插槽、资源选择器插槽、协作锁定状态和保存状态。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，72 个测试通过，并包含构建和架构边界检查。
- `pnpm check:architecture` 通过，确认可发布包结构、依赖方向、物料 manifest 对齐和 primitives 边界未被破坏。
- `pnpm smoke:browser` 通过，日志确认列表项图片字段可从素材库选择并写回缩略预览、页面设置可写入 schema、模板应用、编辑器内置 runtime 和 React H5 runtime 关键路径均通过。
- `pnpm pack:dry-run` 通过，8 个可发布包均完成 npm pack dry-run。

## 剩余风险

- 本任务只拆资源选择器主面板展示层；真实素材中心、商品中心、优惠券中心、门店/达人中心 HTTP 接入、权限、分页、上下架和审核仍需后续业务对接。
- 页面设置、发布检查、H5 预览入口、交付清单和版本历史仍在 `App.vue` 中，后续继续按 `docs/editor-vue-shell-components.md` 拆分。
- `EditorResourcePanels.vue` 当前复用 playground 全局 CSS；如果未来抽独立 Vue editor UI 包，需要补充样式隔离、设计 token、权限插槽、资源选择器插槽、协作锁定状态和服务端保存状态。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器资源选择器主面板组件拆分、组件化文档、事实源同步和验证。 |
| 2026-08-01 | in_progress | 开始拆分 `EditorResourcePanels.vue`，保留真实资源查询、选择状态和 schema 写回在 `App.vue`。 |
| 2026-08-01 | verified | 完成资源选择器主面板组件拆分，类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run 均通过。 |
