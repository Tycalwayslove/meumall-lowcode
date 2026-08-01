# Project State

## 当前状态

MeuMall Lowcode 已完成第一版 monorepo 骨架、AI 协作体系、GitHub 远端推送、schema/editor 第一批基础代码、Vue3 编辑器 playground 初版、本地 mock 发布预览链路、React H5 与 Vue H5 基础物料对齐、独立 React H5 runtime playground、React H5 runtime host 包、React H5 runtime 本地 pageId/releaseId/previewToken 加载、React H5 runtime 诊断面板、H5 runtime health summary API、空态演示和 broken 降级演示、编辑器到 React H5 runtime 的 schema URL handoff、基础电商物料库扩展、编辑器页面模板库、schema/core/adapters/editor/renderer/runtime 基础单元测试体系、浏览器级 smoke check、可视化截图 smoke check、本地编辑器与 H5 runtime 联合 demo runner、本地演示验收命令、架构边界 check、editor readiness API、editor publish risk summary API、editor version summary API、editor release history API、editor template summary API、editor page start API、editor viewport preset API、editor material catalog API、editor material detail API、editor material insert target API、editor material preference API、editor command palette API、editor node operation API、editor node selection API、editor canvas drop hint API、editor canvas drop target API、editor canvas operation API、editor outline tree API、editor prop groups API、editor prop editor model API、editor page settings API、editor data source config API、editor event binding API、editor action config API、editor schema file API、editor draft persistence API、editor preview links API、editor workspace summary API、editor audit trail API、editor demo checklist API、data source resolver、HTTP data source handler、playground HTTP 数据源演示链路、HTTP action handler、playground HTTP 动作演示链路、action 安全执行闭环、高阶活动物料、Java 配置平台 API 草案、配置平台客户端抽象、H5 runtime 集成契约、Page Schema v1 ready 契约、Material Manifest v1 契约、runtime schema loader、runtime health summary API、Resource Library Client、Template Library Client、`@meumall/lowcode-design-tokens`、`@meumall/lowcode-primitives-react-h5`、`@meumall/lowcode-primitives-vue-h5`、`@meumall/lowcode-runtime-react-h5` 公开包和 npm pack dry-run 发布预检，并增强 Vue3 编辑器 mock 素材库、商品选择器、优惠券选择器、门店/达人选择器、新建页面向导、空白画布起步引导、页面设置面板、模板搜索筛选、模板卡片摘要、模板视觉缩略预览、模板 H5 预览入口、交付分享清单、本地自定义模板、Schema 文件导入导出、物料搜索过滤、物料详情预览、物料插入目标提示、最近操作审计流、物料收藏与最近使用、快捷命令面板、节点右键菜单、节点键盘快捷键、节点命名、本地自动保存和恢复提示、结构树搜索折叠与画布定位、画布工作区状态摘要、编辑器实操清单、H5 画布视口预设、当前节点信息卡、属性面板分组折叠、枚举属性 select 编辑、数值属性范围步进编辑、颜色属性色板编辑、画布拖拽物料插入线、已有节点画布拖拽移动、触屏 Pointer Events 画布拖拽、画布吸附线、同父级多选拖拽、发布前检查清单、发布风险摘要和节点定位、H5 预览入口、本地版本备注/筛选/差异详情/回滚、活动规则弹窗物料、楼层锚点导航、布尔开关属性编辑、区块标题物料、图片卡片宫格物料、标签内容切换物料、基础按钮物料、基础输入框物料、基础文本物料、分割线物料、基础图片物料及素材选择、基础标签物料、基础图文卡片物料、基础容器布局能力、留资表单物料、组合券包物料、门店/达人推荐物料、直播入口物料、商品榜单物料、品牌专题物料、底部转化条物料、数组属性列表编辑器、列表项拖拽排序、列表项图片素材选择、Vue3 编辑器工作区状态条组件化、Vue3 编辑器顶部工具栏组件化、Vue3 编辑器快捷命令面板组件化、Vue3 编辑器节点右键菜单组件化、Vue3 编辑器物料目录组件化、Vue3 编辑器物料详情组件化、Vue3 编辑器结构树组件化、Vue3 编辑器画布工具条组件化、Vue3 编辑器画布上下文工具条组件化、Vue3 编辑器当前节点信息卡组件化、Vue3 编辑器属性字段分组组件化、Vue3 编辑器资源选择器主面板组件化、Vue3 编辑器页面设置面板组件化、Vue3 编辑器发布面板组件化、Vue3 编辑器 Schema 配置面板组件化、Vue3 编辑器源码辅助面板组件化、Vue3 编辑器状态面板组件化、Vue3 编辑器主题 token 原型和 Vue3 编辑器配置平台 HTTP client 开关，并已沉淀基础组件、通用物料和业务物料分层架构，且已将 React/Vue H5 runtime primitives 抽为公开包，materials 包从 primitives 包组合通用物料和业务物料；React/Vue H5 primitives 已共同消费 `@meumall/lowcode-design-tokens`。

## 最新架构增量

- `LowcodeRuntimeContext` 新增 runtime-only `event` 字段，React/Vue renderer 会把物料事件 payload 透传到 action context，adapters 安全 action handler 和默认 HTTP action payload 均可读取该字段；Page Schema v1 和 Material Manifest v1 结构不变。
- React/Vue `BasicForm` 提交时会采集子级基础控件当前值，payload 保留 `formId`、`childCount`，并新增 `fieldCount`、`valid`、`errorCount`、`errors`、`values`、`fieldLabels`、`fieldTypes`；基础控件支持 `required/requiredMessage` 本地必填校验，校验失败时展示表单级错误、字段级 invalid/error 文案并阻断 action，复杂校验、远程提交、登录、权限和风控仍由宿主 action handler 或后续 Java/BFF 协议承担。
- React/Vue H5 primitives 新增业务无关表单字段 helper：`MlcFormFieldType`、字段 data attributes、值格式化、值解析、空值判断和必填提示推导；React/Vue materials 的 `BasicForm` 字段采集已复用该基础层 API，Page Schema v1、Material Manifest v1、renderer 和提交 payload 字段保持兼容。
- React/Vue H5 primitives 新增业务无关 `MlcStateBlock`，React/Vue materials 新增 `BasicStateBlock` 通用静态状态块物料，支持空态、加载、错误、成功和信息状态、行动按钮及 `onActionClick` 安全事件；它只承载静态状态展示，不接远程状态流、接口重试协议、错误码翻译或全局 toast。
- React/Vue H5 primitives 新增业务无关 `MlcProgress`，React/Vue materials 新增 `BasicProgress` 通用静态进度条物料，支持标题、说明、当前值、最大值、数值展示、语气和样式配置；它只承载静态进度展示，不接远程进度、自动刷新、服务端百分比计算、订单状态或审批流。
- React/Vue H5 primitives 新增业务无关 `MlcMetric`，React/Vue materials 新增 `BasicMetric` 通用静态指标物料，支持指标标签、数值、前缀、后缀、说明、语气、对齐和卡片样式；它只承载静态指标展示，不接远程统计、实时刷新、库存计算、销量计算、人数计算或埋点聚合。
- React/Vue materials 新增 `BasicMetricGrid` 通用静态指标组物料，继续复用 `MlcMetric`，支持标题、说明、多项指标数组、列数、语气、对齐和卡片/简洁样式；它只承载静态指标组展示，不接远程统计、实时刷新、库存计算、销量计算、人数计算或埋点聚合。
- `@meumall/lowcode-editor` 属性分组 API 新增 `validation` 分组，`required`、`requiredMessage` 等校验类 props 会进入“表单校验”分组；Vue3 `EditorPropGroupsPanel` 会展示 BasicForm 提交前校验提示，帮助运营理解必填配置与 H5 runtime 字段错误态的关系。Page Schema v1、Material Manifest v1、renderer 和 materials runtime 协议不变。

## 当前维护范围

- `packages/schema`
- `packages/design-tokens`
- `packages/primitives-react-h5`
- `packages/primitives-vue-h5`
- `packages/core`
- `packages/renderer-h5`
- `packages/materials-h5`
- `packages/runtime-react-h5`
- `packages/renderer-vue-h5`
- `packages/materials-vue-h5`
- `packages/editor`
- `packages/adapters`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `docs/`
- `.ai-workspace/`
- `.ai/`

## 已完成

- pnpm workspace。
- TypeScript project references。
- 可发布 npm 包结构。
- npm pack dry-run 发布预检：根级 `pnpm pack:dry-run` 会自动发现 12 个可发布包，逐包执行 `npm pack --dry-run --json`，并校验实际包内容包含 `package.json`、`README.md`、`dist/index.js` 和 `dist/index.d.ts`。
- 本地联合演示入口：根级 `pnpm dev:demo` 可同时启动 Vue3 editor playground 和 React H5 runtime playground，并把 H5 runtime URL 注入编辑器；`pnpm demo:check` 可启动两端并做 HTTP 健康检查后自动退出；`pnpm demo:acceptance` 可检查编辑器、编辑器内置 H5 pageId/previewToken、React H5 runtime pageId/releaseId/previewToken 入口，输出演示验收清单后自动退出。
- Changesets 基础配置；`createHttpActionHandler`、`@meumall/lowcode-adapters` previewToken runtime loader、`@meumall/lowcode-adapters` runtime health summary API、`@meumall/lowcode-runtime-react-h5`、`@meumall/lowcode-editor` demo checklist API 和 `@meumall/lowcode-editor` publish risk summary API 已有 pending minor changeset，真实发布前仍需统一确认 linked group 版本结果。
- GitHub Actions CI 基础配置。
- H5 renderer 初始实现。
- H5 materials 初始实现，已包含容器、网格容器、基础表单、公告条、区块标题、图片卡片宫格、标签内容切换、基础按钮、基础链接、基础提示、基础状态块、基础进度条、基础指标、基础指标组、基础输入框、基础多行输入、基础选择框、基础单选组、基础步进器、基础开关、基础复选框、基础文本、基础价格、分割线、基础图片、基础标签、基础图文卡片、基础图片轮播、基础视频、基础弹窗、留资表单、活动头图、图片 Banner、行动按钮、底部转化条、商品列表、商品榜单、品牌专题、门店/达人推荐、直播入口、优惠券区块、组合券包、活动规则弹窗、间距块、倒计时、导航宫格、楼层锚点、秒杀商品组和富文本。
- 低代码版 AI 工作流迁移。
- GitHub 远端 `git@github.com:Tycalwayslove/meumall-lowcode.git` 已配置并推送 `main`。
- Page Schema v1 ready 契约：`.ai-workspace/contracts/page-schema-v1.md` 已定义字段语义、生命周期、校验规则、兼容性、安全要求、变更流程和回滚方式。
- Page Schema v1 基础类型、标准化、递归校验、默认值校验、枚举边界校验和 manifest 校验。
- Editor headless command：模式、视口、选择、插入、更新、复制、移动、删除、undo/redo。
- Editor readiness API：`@meumall/lowcode-editor` 已提供 `flattenLowcodeNodes`、`countLowcodeNodes`、`getLowcodeNodeDisplayName`、`createLowcodePublishChecks`、`summarizeLowcodePublishChecks`、`createLowcodePublishRiskSummary`、`createLowcodeDeliverySummary` 和 `formatLowcodeSchemaSize`，Vue3 editor playground 的发布检查、发布风险摘要和交付清单已复用同一套框架无关 API。
- Editor version summary API：`@meumall/lowcode-editor` 已提供 `createLowcodeVersionDiffItems`、`createLowcodeSchemaPreviewSnippet` 和 `createLowcodeSchemaPreviewItems`，Vue3 editor playground 的本地版本差异详情和 Schema 片段预览已复用同一套框架无关 API。
- Editor template summary API：`@meumall/lowcode-editor` 已提供 `createLowcodeTemplatePreviewMeta`、`createLowcodeTemplateListItem`、`sliceLowcodeTemplateTags`、`formatLowcodeTemplateVersion` 和 `formatLowcodeTemplateSummary`，Vue3 editor playground 的模板卡片、模板起点和本地自定义模板展示已复用同一套框架无关 API。
- Editor page start API：`@meumall/lowcode-editor` 已提供 `createLowcodeBlankPageSchema`、`cloneLowcodePageSchema` 和 `createLowcodePageStartState`，Vue3 editor playground 的新建空白 H5 页面、重置示例页和应用模板已复用同一套框架无关 API。
- Editor viewport preset API：`@meumall/lowcode-editor` 已提供 `LOWCODE_H5_VIEWPORT_PRESETS`、`getLowcodeEditorViewportPreset`、`findLowcodeEditorViewportPreset`、`createLowcodeEditorViewportFromPreset`、`formatLowcodeEditorViewportTitle` 和 `setEditorViewportPreset`，Vue3 editor playground 的 H5 画布视口预设已复用同一套框架无关 API。
- Editor material catalog API：`@meumall/lowcode-editor` 已提供 `createLowcodeMaterialCatalogItem`、`LOWCODE_EDITOR_MATERIAL_CATEGORY_META`、`getLowcodeMaterialCategoryMeta`、`createLowcodeMaterialCategorySummaries`、`createLowcodeMaterialCatalogOverview`、`LOWCODE_EDITOR_MATERIAL_LAYER_META`、`LOWCODE_EDITOR_MATERIAL_FAMILY_META`、`LOWCODE_EDITOR_MATERIAL_COMPONENT_PROFILES`、`getLowcodeMaterialLayerMeta`、`getLowcodeMaterialFamilyMeta`、`createLowcodeMaterialArchitectureProfile`、`createLowcodeMaterialArchitectureOverview`、`createLowcodeMaterialCategories`、`filterLowcodeMaterialCatalog`、`pickLowcodeMaterialEntriesByComponentNames` 和 `formatLowcodeMaterialCatalogSummary`，Vue3 editor playground 的物料分类说明、分类计数、物料分层总览、基础能力族标签、搜索、收藏/最近使用取物料和卡片摘要已复用同一套框架无关 API。
- Editor material detail/insert preset API：`@meumall/lowcode-editor` 已提供 `createLowcodeMaterialDetailSummary`、`createLowcodeMaterialDetailPropEntries`、`createLowcodeMaterialDetailEventItems`、`createLowcodeMaterialDetailDataSourceSlotItems`、`LOWCODE_EDITOR_MATERIAL_INSERT_PRESETS`、`createLowcodeMaterialInsertPresets`、`findLowcodeMaterialInsertPreset`、`createLowcodeMaterialNodeInput`、`createLowcodeMaterialNodeInputFromPreset`、`insertLowcodeMaterialPresetByTarget` 和 `createLowcodeMaterialPreviewSchema`，Vue3 editor playground 的物料详情摘要、配置字段、事件、数据槽、默认插入节点、常用插入预设、容器内预设插入和默认 H5 预览 schema 已复用同一套框架无关 API。
- Editor material insert target API：`@meumall/lowcode-editor` 已提供 `createLowcodeMaterialInsertTargets`、`createLowcodeMaterialInsertTarget`、`insertLowcodeMaterialByTarget` 和 `insertLowcodeMaterialPresetByTarget`，用于派生 append/before/after/inside 插入位置、文案、禁用态、禁用原因和 schema 写入目标；Vue3 editor playground 的物料面板、物料详情、画布上下文工具条、容器快捷预设和拖拽插入已统一消费 material/node insert 权限与协作/审批只读原因，Page Schema v1、Material Manifest v1 和 runtime 协议不变。
- Editor material preference API：`@meumall/lowcode-editor` 已提供 `LOWCODE_EDITOR_RECENT_MATERIAL_DEFAULT_LIMIT`、`normalizeLowcodeMaterialComponentNames`、`parseLowcodeMaterialPreferenceContent`、`isLowcodeFavoriteMaterial`、`toggleLowcodeFavoriteMaterial`、`recordLowcodeRecentMaterial` 和 `createLowcodeMaterialFavoriteMessage`，Vue3 editor playground 的物料收藏、最近使用、组件名解析、去重、未知物料过滤、数量截断和收藏提示文案已复用同一套框架无关 API；localStorage 读写仍由 playground shell 持有。
- Editor command palette API：`@meumall/lowcode-editor` 已提供 `LOWCODE_EDITOR_COMMAND_DEFAULT_LIMIT`、`createLowcodeEditorCommandSearchText`、`filterLowcodeEditorCommands` 和 `groupLowcodeEditorCommands`，Vue3 editor playground 的快捷命令搜索和展示数量限制已复用同一套框架无关 API。
- Editor node operation API：`@meumall/lowcode-editor` 已提供 `createLowcodeNodeOperationItems`、`resolveLowcodeNodeShortcutAction` 和 `createLowcodeNodeOperationMessage`，Vue3 editor playground 的节点右键菜单、画布上下文工具条、当前节点快捷按钮、节点快捷键识别和节点操作反馈文案已复用同一套框架无关 API；实际节点命令执行、DOM 定位、确认弹窗、权限和审计仍由 playground shell 持有。
- Editor node selection API：`@meumall/lowcode-editor` 已提供 `toggleLowcodeNodeSelection`、`pruneLowcodeNodeSelection`、`pickLowcodeSelectedOutlineRows`、`hasLowcodeSameParentSelection`、`createLowcodeNodeSelectionSummary`、`createLowcodeNodeSelectionModel`、`isLowcodeNodeSelected`、`canLowcodeDragSelectedGroup` 和 `getLowcodeSelectedGroupNodeIdsForDrag`，Vue3 editor playground 的节点多选、无效选中裁剪、同父级判断、多选摘要、成组拖拽可用状态和拖拽节点组顺序已复用同一套框架无关 API；DOM 拖拽、投放位置、实际节点移动、权限和审计仍由 playground shell 持有。
- Editor canvas drop hint API：`@meumall/lowcode-editor` 已提供 `resolveLowcodeCanvasDropPlacement`、`createLowcodeCanvasDropHintStyle`、`createLowcodeCanvasSnapGuides`、`createLowcodeCanvasAppendDropHint`、`createLowcodeCanvasTargetDropHint` 和 `isLowcodeInvalidNodeDropTarget`，Vue3 editor playground 的画布投放位置、投放提示 style、吸附线、append hint、target hint 和拖拽节点非法目标判断已复用同一套框架无关 API；DOM 查询、DragEvent/Pointer Events、真实插入、真实移动、权限和审计仍由 playground shell 持有。
- Editor canvas drop target API：`@meumall/lowcode-editor` 已提供 `getLowcodeCanvasAdjacentDropIndex`、`createLowcodeCanvasDropTarget`、`getLowcodeAdjustedCanvasMoveIndex`、`createLowcodeCanvasNodeMoveTarget` 和 `createLowcodeCanvasGroupMoveTarget`，Vue3 editor playground 的物料插入目标、单节点移动目标和同父级成组移动目标派生已复用同一套框架无关 API；真实 schema 插入/移动、siblings 替换、权限和审计仍由 playground shell 持有。
- Editor canvas operation API：`@meumall/lowcode-editor` 已提供 `insertLowcodeCanvasNodeByHint`、`moveLowcodeCanvasNodeByHint` 和 `moveLowcodeCanvasNodeGroupByHint`，Vue3 editor playground 的画布物料插入、单节点移动和同父级成组移动 schema 写入已复用同一套框架无关 API；DOM 事件、Pointer Events、DragEvent、权限、协作锁定、审计、用户反馈和服务端保存仍由 playground 或未来管理台 shell 持有。
- Editor outline tree API：`@meumall/lowcode-editor` 已提供 `createLowcodeOutlineRows`、`createLowcodeOutlineRowSearchText`、`createLowcodeOutlineVisibility`、`pruneLowcodeOutlineCollapsedNodeIds` 和 `revealLowcodeOutlineNode`，Vue3 editor playground 的结构树节点扁平化、搜索、折叠可见性、选中路径和可见数量摘要已复用同一套框架无关 API。
- Editor prop groups API：`@meumall/lowcode-editor` 已提供 `LOWCODE_EDITOR_PROP_GROUP_ORDER`、`LOWCODE_EDITOR_PROP_GROUP_META`、`getLowcodePropGroupKey`、`createLowcodePropGroups`、`isLowcodePropGroupCollapsed` 和 `toggleLowcodePropGroupCollapsed`，Vue3 editor playground 的属性面板字段归类、分组文案、分组顺序和折叠状态 helper 已复用同一套框架无关 API；当前默认分组包含内容、样式、数据、表单校验、行为和其他，`required/requiredMessage` 会进入“表单校验”分组。
- Editor prop editor model API：`@meumall/lowcode-editor` 已提供 `getLowcodePropEditorControl`、`isLowcodeListPropEditor`、`isLowcodeStructuredPropEditor`、`createLowcodeListEditorFields`、`isLowcodeListImageField`、`createLowcodeDefaultListItem`、`toLowcodePropInputText`、`toLowcodePropInputBoolean` 和 `normalizeLowcodePropInputValue`，Vue3 editor playground 的属性字段控件类型、`select` 枚举控件、number 范围夹取、列表字段、图片字段、默认新增项和输入转换已复用同一套框架无关 API。
- Editor page settings API：`@meumall/lowcode-editor` 已提供 `LOWCODE_EDITOR_PAGE_TYPE_OPTIONS`、`LOWCODE_EDITOR_PAGE_STATUS_OPTIONS`、`LOWCODE_EDITOR_PUBLISH_ENVIRONMENT_OPTIONS`、`LOWCODE_EDITOR_PAGE_BACKGROUND_SWATCHES`、`createLowcodePageSettingsForm`、`normalizeLowcodePageMaxWidth`、`updateLowcodePageTitle`、`updateLowcodePageDescription`、`updateLowcodePageStatus`、`updateLowcodePageType`、`updateLowcodePublishEnvironment`、`updateLowcodePageBackgroundColor`、`updateLowcodePageSafeArea` 和 `updateLowcodePageMaxWidth`，Vue3 editor playground 的页面基础配置、布局配置和发布配置已复用同一套框架无关 API。
- Editor release history API：`@meumall/lowcode-editor` 已提供 `formatLowcodeReleaseKindLabel`、`formatLowcodeReleaseTime`、`createLowcodeReleaseListItem`、`createLowcodeReleaseListItems`、`summarizeLowcodeReleaseList`、`formatLowcodeVersionDiffSummary`、`createLowcodeReleaseMessage`、`createLowcodePublishBlockedMessage`、`createLowcodeRollbackNote` 和 `createLowcodeRollbackConfirmText`，Vue3 editor playground 的本地版本列表、关键词筛选、类型文案、时间展示、差异数量摘要、操作反馈、发布检查拦截和回滚备注/确认文案已复用同一套框架无关 API。
- Editor data source config API：`@meumall/lowcode-editor` 已提供 `LOWCODE_EDITOR_DEFAULT_DATA_SOURCE_TYPE_OPTIONS`、`createLowcodeDefaultDataSourceParams`、`createLowcodeDataSourceConfig`、`formatLowcodeDataSourceParamsText`、`formatLowcodeDataSourceRecordLabel`、`createLowcodeDataSourceFormItems`、`upsertLowcodeDataSourceConfigs`、`addLowcodeDataSource`、`updateLowcodeDataSource` 和 `removeLowcodeDataSource`，Vue3 editor playground 的数据源类型、默认参数、表单行模型、解析状态展示、新增、更新、upsert 和删除已复用同一套框架无关 API。
- Editor event binding API：`@meumall/lowcode-editor` 已提供 `createLowcodeActionOptions`、`createLowcodeEventBindingItems`、`bindLowcodeNodeEvent`、`renameLowcodeActionRefsInNodes` 和 `removeLowcodeActionRefsFromNodes`，Vue3 editor playground 的物料事件绑定展示、节点事件写回、action id 改名引用同步和 action 删除引用清理已复用同一套框架无关 API。
- Editor action config API：`@meumall/lowcode-editor` 已提供 `LOWCODE_EDITOR_DEFAULT_ACTION_TYPE_OPTIONS`、`createLowcodeDefaultActionParams`、`createLowcodeActionConfig`、`formatLowcodeActionParamsText`、`createLowcodeActionFormItems`、`addLowcodeAction`、`updateLowcodeAction`、`renameLowcodeAction`、`setLowcodeActionType` 和 `removeLowcodeAction`，Vue3 editor playground 的动作类型、默认参数、表单行模型、动作新增、更新、改名、类型切换和删除清理已复用同一套框架无关 API。
- Editor schema file API：`@meumall/lowcode-editor` 已提供 `createLowcodeSchemaFileName`、`createLowcodeSchemaFileExport` 和 `parseLowcodeSchemaFileContent`，Vue3 editor playground 的 Page Schema 文件导出内容、文件名、大小摘要和导入解析校验已复用同一套框架无关 API。
- Editor draft persistence API：`@meumall/lowcode-editor` 已提供 `createLowcodeEditorDraftPayload`、`parseLowcodeEditorDraftContent`、`formatLowcodeEditorDraftStatusText` 和 `getLowcodeEditorDraftStatusTone`，Vue3 editor playground 的本地自动保存 payload、旧草稿恢复兼容、恢复校验、状态文案和 tone 已复用同一套框架无关 API。
- Editor preview links API：`@meumall/lowcode-editor` 已提供 `createLowcodePreviewLinkItem`、`createLowcodePreviewLinkItems` 和 `summarizeLowcodePreviewLinks`，Vue3 editor playground 的 H5 预览入口展示模型、ready/disabled 状态、打开/复制能力和交付入口摘要已复用同一套框架无关 API。
- Editor workspace summary API：`@meumall/lowcode-editor` 已提供 `createLowcodeWorkspaceStats`，Vue3 editor playground 的顶部节点数、选中、校验、发布和保存状态摘要已复用同一套框架无关 API。
- Editor demo checklist API：`@meumall/lowcode-editor` 已提供 `createLowcodeEditorDemoChecklist` 和 `summarizeLowcodeEditorDemoChecklist`，Vue3 editor playground 的右侧状态面板已展示页面内容、基础物料、Schema 校验、H5 预览、草稿/版本记录和 React H5 runtime 的实操清单；该清单只作为演示验收状态，不作为生产发布门禁。
- Editor audit trail API：`@meumall/lowcode-editor` 已提供 `LOWCODE_EDITOR_AUDIT_TRAIL_DEFAULT_LIMIT`、`createLowcodeEditorAuditEvent`、`createLowcodeEditorAuditTrail` 和 `createLowcodeEditorAuditListItems`，用于创建操作事件、追加限长 trail 和派生最近操作展示项；Vue3 editor playground 已记录物料、节点、模板、资源、schema、发布和审批操作，并在右侧状态面板展示最近操作，顶部宿主“审计日志”入口可打开本地审计日志面板。真实审计持久化、查询、权限、分页、筛选、合规和服务端上报仍由未来管理台或 Java 平台持有。
- Editor capability state API：`@meumall/lowcode-editor` 已提供 `mergeLowcodeEditorPermissionStates`、`LOWCODE_EDITOR_DEFAULT_CAPABILITY_ACTIONS` 和 `createLowcodeEditorCapabilityState`，用于合并协作锁、审批态、账号权限和发布检查摘要，并为 Vue3 editor playground 顶部工具栏与审批入口输出统一门禁、禁用原因和通用状态项。
- Vue3 editor shell 组件化：已新增 `apps/editor-playground/src/components/EditorWorkspaceStats.vue`、`apps/editor-playground/src/components/EditorTopToolbar.vue`、`apps/editor-playground/src/components/EditorCommandPalette.vue`、`apps/editor-playground/src/components/EditorMaterialCatalog.vue`、`apps/editor-playground/src/components/EditorMaterialDetail.vue`、`apps/editor-playground/src/components/EditorOutlineTree.vue`、`apps/editor-playground/src/components/EditorNodeContextMenu.vue`、`apps/editor-playground/src/components/EditorCanvasToolbar.vue`、`apps/editor-playground/src/components/EditorCanvasContextToolbar.vue`、`apps/editor-playground/src/components/EditorSelectedNodeCard.vue`、`apps/editor-playground/src/components/EditorPropGroupsPanel.vue`、`apps/editor-playground/src/components/EditorResourcePanels.vue`、`apps/editor-playground/src/components/EditorPageSettingsPanel.vue`、`apps/editor-playground/src/components/EditorPublishPanel.vue`、`apps/editor-playground/src/components/EditorSchemaConfigPanel.vue`、`apps/editor-playground/src/components/EditorSourcePanel.vue`、`apps/editor-playground/src/components/EditorStatusPanel.vue` 和 `apps/editor-playground/src/components/EditorAuditPanel.vue`，顶部工作区状态条只消费 `LowcodeEditorWorkspaceStat[]` 展示模型，顶部工具栏组件负责展示品牌、页面标题、保存状态、自动保存状态、通用 capability 状态、模式切换和发布相关入口并抛出操作事件，且提供 `status-extra`、`primary-actions`、`secondary-actions` 宿主扩展插槽；快捷命令面板组件负责展示弹窗、搜索输入、命令列表、禁用状态、分组标签和空状态并抛出关闭、关键词更新和执行事件，物料目录组件负责搜索、分类、收藏/最近、物料卡片、容器快捷添加展示和事件抛出，物料详情组件负责详情弹窗、配置字段、事件、数据槽和默认 H5 预览展示，结构树组件负责节点搜索、可见摘要、多选摘要、节点行、折叠、多选、拖拽入口和内联重命名展示，节点右键菜单组件负责展示菜单遮罩、菜单头、菜单项、快捷键文案、禁用状态、危险操作样式和操作图标并抛出关闭和执行事件，画布工具条组件负责画布标题、状态文案、工作区状态摘要和 H5 视口切换展示，画布上下文工具条组件负责展示设计模式下选中节点的插入物料下拉框和快捷操作按钮并抛出节点操作事件，当前节点信息卡负责展示选中节点身份、位置和父级并抛出重命名事件，属性字段分组组件负责展示属性字段控件、数组列表编辑器、列表项图片素材选择 UI 和事件绑定列表并抛出写回事件，资源选择器组件负责展示图片素材库、商品选择器、优惠券库和门店/达人库并抛出筛选、勾选、应用和绑定事件，页面设置组件负责展示基础配置、布局配置、发布配置、版本备注和发布操作反馈并抛出字段更新事件，发布面板组件负责展示 H5 预览入口、交付清单、发布检查、本地版本列表、版本对比和 Schema 片段预览并抛出发布相关操作事件，且提供 `delivery-extra`、`approval-extra`、`publish-check-extra`、`release-extra` 宿主扩展插槽；Schema 配置面板组件负责展示数据源配置和动作配置并抛出新增、字段更新、参数 JSON 更新和删除事件，源码辅助面板组件负责展示 schema JSON 草稿、导入导出提示、JSON 错误提示和源码操作按钮并抛出草稿更新和操作事件，状态面板组件负责展示节点数、历史数、校验状态、最近操作和重置示例入口并抛出重置事件，审计日志面板负责展示顶部宿主审计入口打开后的审计日志抽屉并抛出关闭事件；`apps/editor-playground/src/editor-theme.css` 已沉淀 editor shell 专用 `--mlc-editor-*` 主题 token，`main.ts` 先引入 theme 再引入组件样式，首批顶栏、基础控件、通用 capability 状态胶囊、弹窗、面板和高频卡片已消费 token；组件化迁移说明写入 `docs/editor-vue-shell-components.md`，后续优先继续治理剩余硬编码样式、权限插槽、真实协作锁服务、真实审批流、真实审计服务和更多管理台扩展插槽。
- Vue H5 renderer 初始实现。
- Vue H5 基础物料：容器、网格容器、基础表单、公告条、区块标题、图片卡片宫格、标签内容切换、基础链接、基础价格、基础多行输入、基础选择框、基础单选组、基础步进器、基础开关、基础复选框、基础图片轮播、基础视频、基础弹窗、留资表单、活动头图、图片 Banner、行动按钮、底部转化条、商品列表、商品榜单、品牌专题、门店/达人推荐、直播入口、优惠券区块、组合券包、活动规则弹窗、间距块、倒计时、导航宫格、楼层锚点、秒杀商品组、富文本。
- Vue3 编辑器 playground：物料添加、拖到画布、节点选择、属性编辑、JSON 查看/应用、本地保存、撤销/重做和 H5 预览。
- Vue3 编辑器交互增强：画布节点点击选中、高亮、根节点拖拽排序、页面状态/环境配置和数据源面板。
- Vue3 编辑器实操增强：容器物料、嵌套结构展示、向容器添加子物料、素材/商品快捷选择和 mock 数据源预览绑定。
- Vue3 编辑器发布链路 mock：保存草稿、生成预览、发布页面、本地版本列表和独立 H5 runtime 入口。
- Vue3 编辑器画布上下文操作：选中节点后可前后插入物料、向容器加入物料、同级上移/下移、复制和删除。
- React H5 runtime playground：独立消费 React H5 renderer/materials/core/schema，验证基础物料、容器嵌套、dataBinding、运行诊断面板、本地 `LowcodeConfigPlatformClient` pageId published 加载、releaseId preview 加载、env HTTP config platform client、missing pageId fallback、`?demo=empty` 空页面安全空态和 `?demo=broken` 未知物料/组件异常局部兜底。
- 编辑器到 React H5 runtime handoff：通过 URL schema 参数打开当前编辑 schema 的 React H5 渲染结果。
- 基础电商物料扩展：新增 `ActionButton`、`NoticeBar`、`SpacerBlock`，并同步 Vue/React H5 物料包。
- 页面模板库：编辑器左侧可一键应用大促活动页、新人券领取页和商品专题页模板。
- Template Library Client：`@meumall/lowcode-adapters` 提供 `LowcodeTemplateLibraryClient` 和 `createStaticTemplateLibraryClient`，Vue3 编辑器模板列表已改为通过 client 查询，支持模板搜索、分类过滤、加载态和空状态，为后续替换 Java 模板市场 HTTP client 预留边界。
- Vue3 编辑器模板卡片摘要：左侧模板卡片已展示版本、标签、节点数、数据源数和动作数，帮助运营选择模板前判断适用场景和页面规模。
- Vue3 编辑器模板视觉缩略预览：左侧模板卡片和新建页面向导模板起点会从模板 schema 中派生缩略图、首屏标题、副标题和节点数标签，帮助运营按视觉风格选择模板。
- Vue3 编辑器模板 H5 预览入口：左侧模板卡片已拆分为应用主区域和独立预览按钮，点击预览会通过 React H5 runtime schema URL handoff 打开模板渲染效果，不替换当前画布。
- Vue3 编辑器新建页面向导：顶部“新建”和快捷命令可打开向导，支持从空白 H5 页面或页面模板开始搭建，并在替换未保存草稿前二次确认。
- Vue3 编辑器本地自定义模板：模板面板和快捷命令可把当前页面保存为 localStorage 本地模板；本地模板参与模板搜索、模板卡片摘要、视觉缩略预览、新建页面向导、模板 H5 预览和应用流程。
- Vue3 编辑器空白画布起步引导：创建空白 H5 页面后，手机画布内展示活动头图、图片 Banner、商品列表和优惠券区块快捷入口，点击即可生成首个节点，也可返回模板起点。
- Vue3 编辑器页面设置面板：右侧页面面板按基础配置、布局配置和发布配置分组，支持编辑标题、描述、页面类型、背景色、安全区、H5 最大宽度、状态和发布环境，并同步到源码 schema。
- Vue3 编辑器物料详情预览：左侧物料卡片提供独立详情入口，弹窗展示物料基础信息、默认 H5 预览、propsSchema 字段、事件、数据源槽位，并支持一键添加到画布。
- 基础单元测试：根目录提供 `pnpm test`，覆盖 schema、core、adapters、editor readiness、React/Vue renderer fallback 和 materials 公开 API 基础回归。
- Browser smoke check：根目录提供 `pnpm smoke:browser`，脚本会启动 editor playground、默认 H5 runtime playground、HTTP config client H5 runtime playground、临时 config platform HTTP mock 和本机 Chrome headless，检查 Vue3 编辑器 shell、编辑器内置 runtime 和 React H5 runtime 的关键 DOM、核心文案与物料节点渲染；同时覆盖区块标题物料、图片卡片宫格物料、活动规则弹窗打开/关闭、页面设置、物料详情预览、模板搜索、模板视觉缩略预览、本地自定义模板、模板 H5 预览、本地版本备注/筛选/差异对比、React H5 runtime 诊断面板、pageId published 命中、releaseId preview 命中、HTTP config platform client env 模式和 authorization 透传、missing pageId fallback、empty demo 空态、broken demo 未知物料/组件异常局部兜底、应用 `商品专题页`、新建页面向导、空白 H5 页面、空白画布快捷起步、源码/预览/设计模式切换和 schema 草稿同步。
- Visual smoke check：根目录提供 `pnpm smoke:visual`，脚本会启动 editor playground、H5 runtime playground 和本机 Chrome headless，截取 Vue3 编辑器首页、React H5 runtime `?pageId=summer-campaign-demo` published 入口和 React H5 runtime `?releaseId=preview_demo` preview 入口，并对截图 PNG 宽高、采样颜色数量和亮度范围做基础健康断言，生成 `.ai/test-reports/latest-visual/index.md` 本地报告；该报告和截图是本地验证产物，不进入 Git 历史。
- Architecture boundary check：根目录提供 `pnpm check:architecture`，脚本会检查可发布包结构、`package.json` workspace 依赖方向、源码 import 依赖方向、React/Vue H5 物料 manifest `componentName` 对齐和 `Mlc*` runtime primitives 不注册为低代码物料；`pnpm test` 已接入该检查。
- Data source resolver：`@meumall/lowcode-adapters` 提供通用数据源解析和 `createHttpDataSourceHandler`，编辑器预览和 React H5 runtime 可按 schema.dataSources 注册白名单 handler 生成 renderer data，并展示逐数据源诊断状态；HTTP handler 支持宿主固定 endpoint、GET query、POST body、响应解包和错误记录，Page Schema 不保存任意 URL。Vue3 editor playground 和 React H5 runtime playground 已支持通过 `VITE_LOWCODE_DATA_SOURCE_BASE_URL` 将 `product.byIds` 切到 HTTP handler，并通过 browser smoke 验证 React H5 runtime 可从本地 HTTP mock 拉取商品并渲染。
- Safe action executor：`@meumall/lowcode-adapters` 提供安全 action registry/executor，编辑器可维护 actions 并绑定物料事件，Vue 预览和 React H5 runtime 可执行白名单动作。
- 高阶活动物料：React/Vue H5 物料包已新增 `CountdownTimer`、`NavGrid`、`FloorAnchorNav`、`FlashSaleList`、`ProductRankList`、`BrandFeatureSection`、`StickyActionBar`、`ActivityRuleModal`、`CouponBundle`、`StoreExpertSection`、`LiveEntry`，大促模板和 React H5 runtime 示例已使用新增物料。
- Java 配置平台 API 草案：`.ai-workspace/contracts/java-config-platform-api-v1.md` 已定义草稿、预览、发布、release 查询、draft 查询和 active published schema 查询接口。
- Material Manifest v1 契约：`.ai-workspace/contracts/material-manifest-v1.md` 已定义物料 manifest 的字段语义、兼容性、编辑器/renderer/Java/H5 消费规则、测试方式、变更流程和回滚方式。
- Config platform client：`@meumall/lowcode-adapters` 提供 `LowcodeConfigPlatformClient` 和 `createHttpConfigPlatformClient`，覆盖 release draft/preview/publish、previewToken 查询、release 查询、published 查询、编辑器 workflow、编辑锁/审批操作和 editor draft snapshot；编辑器本地 mock 已实现同一 client 接口。注意 `saveDraft` 是手动版本草稿，`saveEditorDraftSnapshot` 是自动保存恢复点，两者不共用 release history。
- H5 runtime 集成契约：`.ai-workspace/contracts/h5-runtime-integration-v1.md` 已定义 `hybird-meumall` npm 依赖、推荐路由、schema 获取优先级、H5 runtime playground HTTP client 环境开关、数据源、action、降级、监控和 smoke check。
- Runtime schema loader 与 health summary：`@meumall/lowcode-adapters` 提供 `loadLowcodeRuntimeSchema`，统一支持 encoded schema、previewToken、releaseId、pageId 和 fallback schema；同时提供 `createLowcodeRuntimeHealthSummary`，从 schema 来源、校验结果、节点数、数据源解析记录、动作日志和渲染错误派生 loading/healthy/warning/error 运行态摘要。React H5 runtime playground 已切换为同一 loader 和 health summary，并支持通过 `VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL` 使用 `createHttpConfigPlatformClient` 查询 Java 配置平台，`VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION` 可透传 authorization header。
- Renderer fallback：React/Vue H5 renderer 已统一未知物料和组件异常局部兜底 DOM 标记；未知物料输出 `mlc-runtime-missing`、`data-lowcode-node-id`、`data-lowcode-missing`，组件异常输出 `mlc-runtime-error`、`data-lowcode-node-id`、`data-lowcode-error`，并支持宿主通过 `onRenderError` 记录异常。
- Resource Library Client：`@meumall/lowcode-adapters` 提供 `LowcodeResourceLibraryClient` 和 `createStaticResourceLibraryClient`，覆盖图片素材、视频素材、商品、优惠券、门店/达人资源查询，为后续替换真实资源中心 HTTP client 预留边界。
- Vue3 编辑器资源选择器：右侧属性区已提供 mock 图片素材库、视频素材库、商品选择器、优惠券选择器和门店/达人选择器，支持搜索、分类、多选、静态 props 写回，并支持视频素材同步写回 `videoUrl`/`posterUrl`、商品恢复绑定 `products` 数据源、门店/达人恢复绑定 `stores` 数据源；资源选择器主面板已通过 `EditorResourcePanels.vue` 独立组件渲染，真实 Resource Library Client 查询、选择状态维护、props/dataBinding 写回、权限和审计仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器画布拖拽：从物料区拖到画布节点时可显示前/后插入线，拖到 `SectionContainer`、`GridContainer` 或 `BasicForm` 中间区域可显示容器投放高亮，拖到空白区域可追加到页面末尾。
- Vue3 编辑器已有节点拖拽：设计模式下画布节点可直接拖动，支持移动到目标节点前/后、移动进 `SectionContainer`、`GridContainer` 或 `BasicForm`、移动到根节点末尾，并规避拖到自己或自己后代。
- 基础容器布局能力：React/Vue H5 `SectionContainer` 已支持单列分组、留白、边框、阴影和空态，`GridContainer` 已支持 2/3 列网格布局、子节点间距、边框、阴影和空态，`BasicForm` 已支持基础表单容器、children 字段区、提交按钮、成功文案、基础字段值采集、required 必填校验、表单级错误摘要、字段级 invalid/error 文案和 `onSubmit` 安全事件；三者都保持 Page Schema v1 `children` 节点结构，不引入 slot、复杂校验 DSL 或远程提交协议。`@meumall/lowcode-editor` 已公开 `LOWCODE_EDITOR_DEFAULT_CANVAS_INSIDE_COMPONENT_NAMES` 和 `isLowcodeEditorContainerComponentName`，Vue3 编辑器默认模板、快捷命令加入容器、编辑器内置 runtime、React H5 runtime 示例和 browser smoke check 已接入。
- 基础图文卡片物料：React/Vue H5 物料包已新增 `BasicCard`，支持图片、角标、标题、说明、行动按钮、边框和阴影配置，并从 primitives 包复用 `MlcImage`、`MlcTag`、`MlcText`、`MlcButton`；默认模板、快捷命令添加链路、React H5 runtime 示例和 browser smoke check 已接入。
- 基础图片轮播物料：React/Vue H5 物料包已新增 `BasicCarousel`，支持静态轮播项、图片、标题、说明、角标、圆角、比例、自动播放、指示器和 `onItemClick` 安全 action，并从 primitives 包复用 `MlcImage`、`MlcTag`、`MlcText`；默认模板、快捷命令添加链路、React H5 runtime 示例、editor 列表项字段模型、browser smoke check 和 pending minor changeset 已接入。
- 基础视频物料：React/Vue H5 物料包已新增 `BasicVideo`，支持视频地址、封面、标题、说明、角标、圆角、比例、播放控件、静音、循环、自动播放、行内播放和 `onPlay` 安全 action，并从 primitives 包复用 `MlcImage`、`MlcTag`、`MlcText`；`videoUrl` 已使用 manifest `video` setter，Vue3 编辑器可从视频素材库选择视频并同步写回封面；默认模板、快捷命令添加链路、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。
- 基础弹窗物料：React/Vue H5 物料包已新增 `BasicModal`，支持入口按钮、静态标题、说明、内容、确认按钮、默认打开、点击遮罩关闭、弹出位置、色彩、圆角、留白和 `onOpen` 安全 action，并从 primitives 包复用 `MlcModal`、`MlcButton`、`MlcText`；默认模板、快捷命令添加链路、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。当前不支持远程内容、表单提交、登录、领券、交易、个性化投放或弹窗内低代码子节点编排。
- 基础表单物料：React/Vue H5 物料包已新增 `BasicForm`，支持标题、说明、children 字段区、提交按钮、成功文案、禁用/加载态、样式配置、基础控件字段值采集、`required/requiredMessage` 本地必填校验、表单级错误摘要、字段级 invalid/error 文案和 `onSubmit` 安全 action，并从 primitives 包复用 `MlcButton`、`MlcText`；默认模板、快捷命令添加链路、当前容器识别、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。当前不接正则/长度/异步等复杂校验、验证码、登录、风控、远程提交、服务端保存或表单布局 DSL。
- 基础链接物料：React/Vue H5 物料包已新增 `BasicLink`，支持文案、辅助说明、前置标签、右侧箭头、普通 H5 链接、禁用态、样式配置和 `onClick` 安全 action，并从 primitives 包复用 `MlcText`、`MlcTag`；默认模板、快捷命令添加链路、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。当前不接业务路由白名单、App bridge、登录鉴权、埋点平台、风控、权限审批、短链生成或远程链接校验。
- 基础提示物料：React/Vue H5 物料包已新增 `BasicAlert`，支持标题、正文、语气、柔和/描边/实心样式、图标文案、角标文案、行动按钮、样式配置和 `onActionClick` 安全 action，并从 primitives 包复用 `MlcText`、`MlcTag`、`MlcButton`；默认模板、快捷命令添加链路、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。当前不接远程公告流、系统消息中心、业务错误码、内容审核、权限审批、表单校验协议、消息已读状态或商品/优惠券/活动规则等业务模型。
- 基础列表物料：React/Vue H5 物料包已新增 `BasicList`，支持标题、说明、静态列表项、圆点/数字/标签/隐藏标记、右侧辅助信息、样式配置和 `onItemClick` 安全 action，并从 primitives 包复用 `MlcText`、`MlcTag`；默认模板、快捷命令添加链路、editor 列表项字段模型、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。当前不接远程数据、分页、搜索、排序、FAQ 展开、时间线协议、商品/优惠券/门店达人等业务模型。
- 基础折叠面板物料：React/Vue H5 物料包已新增 `BasicAccordion`，支持标题、说明、静态折叠项、单开/多开、箭头/加号/隐藏图标、默认展开、样式配置和 `onItemToggle` 安全 action，并从 primitives 包复用 `MlcText`、`MlcTag`；默认模板、快捷命令添加链路、editor 列表项字段模型、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。当前不接远程 FAQ、活动规则接口、分页、搜索、排序、内容审核、权限审批、富文本编辑、嵌套低代码子节点或商品/优惠券/门店达人等业务模型。
- 基础时间线物料：React/Vue H5 物料包已新增 `BasicTimeline`，支持标题、说明、静态节点、时间文案、状态视觉、圆点/数字/标签标记、连接线、样式配置和 `onItemClick` 安全 action，并从 primitives 包复用 `MlcText`、`MlcTag`；默认模板、快捷命令添加链路、editor 列表项字段模型、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。当前不接远程活动进度、订单状态、审批流程、任务流、服务履约或业务状态模型。
- 基础价格物料：React/Vue H5 物料包已新增 `BasicPrice`，支持价格内容、前缀、后缀、对齐、字号、价格色、区块背景和上下留白，并从 primitives 包复用 `MlcPrice`；默认模板、快捷命令添加链路、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。当前不接真实价格计算、会员价、划线价联动、货币换算、库存或风控。
- 公告条物料：React/Vue H5 物料包已增强 `NoticeBar`，支持图标文案、标签、正文、背景、标签色、边框、圆角和上下留白配置，并从 primitives 包复用 `MlcNoticeBar`；当前不接远程公告流、跑马灯、关闭记忆、曝光统计、权限审批或活动规则，默认模板、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。
- 富文本物料：React/Vue H5 物料包已增强 `RichTextBlock`，支持 HTML、背景色、文字色、边框色、圆角、内边距、字号和行高配置，并从 primitives 包复用 `MlcRichText`；当前不接富文本编辑器、内容审核、敏感词、资源上传、远程规则系统或 CMS，默认模板、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。
- 基础选择框物料：React/Vue H5 物料包已新增 `BasicSelect`，支持静态单选 options、默认值、禁用态、标签、占位、辅助说明、颜色、圆角和 `onChange` 安全 action，并从 primitives 包复用 `MlcSelect`、`MlcText`；当前不接远程业务字典、级联选择、多选搜索或表单提交，默认模板、快捷命令添加链路、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。
- 基础单选组物料：React/Vue H5 物料包已新增 `BasicRadioGroup`，支持少量静态 options、默认值、禁用态、标签、辅助说明、选中色、边框色、圆角和 `onChange` 安全 action，并从 primitives 包复用 `MlcRadioGroup`、`MlcText`；当前不接远程业务字典、级联选择、多选搜索、表单提交或用户偏好持久化，默认模板、快捷命令添加链路、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。
- 基础步进器物料：React/Vue H5 物料包已新增 `BasicStepper`，支持默认值、最小值、最大值、步长、禁用态、标签、辅助说明、强调色、边框色、圆角和 `onChange` 安全 action，并从 primitives 包复用 `MlcStepper`、`MlcText`；当前不接库存、购买数量、限购、价格联动、表单提交、校验规则或服务端保存，默认模板、快捷命令添加链路、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。
- 基础开关物料：React/Vue H5 物料包已新增 `BasicSwitch`，支持标签、状态文案、默认状态、禁用态、开关色、滑块色和 `onChange` 安全 action，并从 primitives 包复用 `MlcSwitch`、`MlcText`；当前不接真实配置保存、权限审批、活动状态、规则联动或用户偏好持久化，默认模板、快捷命令添加链路、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。
- 基础复选框物料：React/Vue H5 物料包已新增 `BasicCheckbox`，支持标签、辅助说明、默认勾选、禁用态、勾选色、边框色、标记色、圆角和 `onChange` 安全 action，并从 primitives 包复用 `MlcCheckbox`、`MlcText`；当前不接真实协议确认、表单校验、多选数组、权限审批、活动状态或用户偏好持久化，默认模板、快捷命令添加链路、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。
- 基础多行输入物料：React/Vue H5 物料包已新增 `BasicTextarea`，支持标签、占位、辅助说明、默认值、行数、禁用态、颜色、圆角和 `onChange` 安全 action，并从 primitives 包复用 `MlcTextarea`、`MlcText`；当前不接真实表单提交、校验规则、字数统计、富文本或敏感词审核，默认模板、快捷命令添加链路、React H5 runtime 示例、browser smoke check 和 pending minor changeset 已接入。
- Vue3 编辑器触屏拖拽：物料面板、结构树节点和 H5 画布节点已支持触屏/手写笔 Pointer Events 拖拽，复用现有投放提示、容器投放、节点移动和点击抑制逻辑。
- Vue3 编辑器画布吸附线：拖到节点前/后时显示跨画布横向吸附线和目标中心纵向线，拖入容器时显示容器中心横向/纵向辅助线。
- Vue3 编辑器同父级多选拖拽：结构树支持勾选、Meta/Ctrl/Shift 点击多选；同父级选区可从结构树或 H5 画布成组拖到目标前/后、容器末尾或页面末尾。
- Vue H5 renderer 编辑态拖拽回调：`LowcodeVueRenderer` 新增可选 `nodeDraggable`、`onNodeDragStart` 和 `onNodeDragEnd`，生产渲染默认不受影响。
- Vue3 编辑器发布检查：右侧面板已展示 schema、节点、图片、商品、数据源和动作 readiness，并在检查列表上方展示阻塞/提醒/可发布的发布风险摘要与优先处理项；生成预览和发布会拦截 error，保存草稿不拦截。
- Vue3 编辑器发布检查定位：图片字段缺失、商品组件无商品/无数据源、数据源解析失败、事件引用缺失和动作参数缺失等节点级检查项可一键定位到对应节点，并自动切回设计模式、选中节点、展开结构树路径和滚动画布。
- Vue3 编辑器 H5 预览入口：右侧发布区域已集中展示当前草稿 React H5、页面草稿/最新版本内置 H5、最近发布版本 H5 的打开和复制入口，运营可直接复制链接给验收方；入口展示模型、ready/disabled 状态、打开/复制能力和交付入口摘要已复用 editor preview links API。
- Vue3 编辑器交付分享清单：右侧发布区域已集中展示页面标题、pageId、节点数、数据源数、动作数、Schema JSON 体积、发布检查状态、H5 交付入口状态，并可复制当前 Page Schema JSON 或导出 Schema 文件。
- Vue3 编辑器 Schema 文件导入导出：工具栏、源码区和快捷命令均可导出当前 Page Schema JSON；可从本地 JSON 文件导入合法 schema 并替换当前画布，非法 JSON 或非法 schema 会展示错误且不覆盖当前页面；文件名、导出内容、大小摘要和导入解析校验已复用 editor schema file API。
- Vue3 编辑器本地版本管理：保存草稿、生成预览和发布页面时可填写本地 release 备注，版本列表支持按标题、版本号、类型和备注关键词筛选；本地版本列表支持选择对比，展示标题、状态、环境、页面版本、节点数、数据源数和动作数的当前草稿/所选版本差异、变更状态，以及当前草稿和所选版本的 schema JSON 片段预览，并支持将所选版本作为新的 published release 回滚发布。
- 活动规则弹窗物料：React/Vue H5 物料包已新增 `ActivityRuleModal`，支持规则入口、弹窗展示、规则列表和 `onOpen` 事件，并已从 primitives 包复用 `MlcModal` 弹层 primitive；大促模板、新人券模板和 React H5 runtime 示例已接入。
- 倒计时物料：React/Vue H5 物料包已有 `CountdownTimer`，支持标题、说明、天/时/分/秒静态配置和颜色配置，并已从 primitives 包复用 `MlcCountdownText` 倒计时文本 primitive；大促模板、React H5 runtime 示例和 browser smoke check 已接入。
- 楼层锚点导航：React/Vue H5 renderer 已为 schema 节点输出 `data-lowcode-node-id`，React/Vue H5 物料包新增 `FloorAnchorNav`，支持吸顶、横向滚动锚点、点击滚动到目标节点和 `onAnchorClick` 事件。
- 区块标题物料：React/Vue H5 物料包已新增 `SectionTitle`，支持角标、标题、说明、对齐、背景色、标题色、说明色、强调色和上下留白；默认大促模板、React H5 runtime 示例和 browser smoke check 已接入。
- 图片卡片宫格物料：React/Vue H5 物料包已新增 `ImageCardGrid`，支持标题、说明、列数、间距、圆角、卡片数组、图片、角标和 `onItemClick`；默认大促模板、React H5 runtime 示例、Vue3 编辑器数组属性表单和 browser smoke check 已接入。
- 标签内容切换物料：React/Vue H5 物料包已新增 `TabsBlock`，支持标题、说明、颜色、圆角、静态标签数组、本地 tab 切换和内容说明展示，并已从 primitives 包复用 `MlcTabs` 标签切换 primitive；默认大促模板、React H5 runtime 示例、Vue3 编辑器数组属性表单和 browser smoke check 已接入。
- 留资表单物料：React/Vue H5 物料包已新增 `LeadFormBlock` 通用物料，支持姓名、手机号、人数步进、备注、协议开关、提交按钮和 `onSubmit` 安全 action；Vue3 编辑器可添加并在 Vue H5 画布渲染，React H5 runtime 示例和 browser smoke check 已接入。
- Vue3 编辑器布尔、枚举与数值属性编辑：属性面板已将 `switch` setter 和 `boolean` 类型字段渲染为开关控件，写入真实 boolean，并兼容旧草稿中的 `"false"`、`"0"`、`"off"` 字符串；Material Manifest v1 的 `select/options` 已渲染为下拉控件并写回真实选项值，基础按钮、基础输入框、基础文本、分割线、基础图片、基础标签、基础图文卡片和区块标题的枚举属性已接入；number 字段已支持 manifest `min/max/step/unit`，属性面板展示单位和加减步进，写回时由 editor 按范围夹取。
- 组合券包物料：React/Vue H5 物料包已新增 `CouponBundle`，支持多券展示、一键领取、单券领取和 `onReceive/onReceiveAll` 事件；大促模板和 React H5 runtime 示例已接入。
- 门店/达人推荐物料：React/Vue H5 物料包已新增 `StoreExpertSection`，支持门店/达人混合推荐、多项展示、静态列表配置、预留 `items` data source slot 和 `onItemClick` 事件；大促模板和 React H5 runtime 示例已接入。
- 直播入口物料：React/Vue H5 物料包已新增 `LiveEntry`，支持直播封面、状态、标题、说明、观看人数、按钮、链接和 `onEnter` 事件；大促模板、Vue3 编辑器素材库、React H5 runtime 示例和 browser smoke check 已接入。
- 商品榜单物料：React/Vue H5 物料包已新增 `ProductRankList`，支持榜单标题、说明、角标、排名样式、展示数量、`items` 商品数据槽和 `onProductClick` 事件；Vue3 编辑器商品选择器、大促模板、React H5 runtime 示例和 browser smoke check 已接入。
- 品牌专题物料：React/Vue H5 物料包已新增 `BrandFeatureSection`，支持品牌名、标题、说明、角标、封面图、Logo、行动按钮、卖点列表、`items` 商品数据槽、`onEnter/onProductClick` 事件；Vue3 编辑器商品选择器、大促模板、React H5 runtime 示例和 browser smoke check 已接入。
- 底部转化条物料：React/Vue H5 物料包已新增 `StickyActionBar`，支持标题、说明、主/副按钮、安全区、sticky 开关、跳转链接和 `onPrimaryClick/onSecondaryClick` 事件；大促模板、React H5 runtime 示例和 browser smoke check 已接入。
- Vue3 编辑器数组属性编辑：属性面板已为 `array` + `textarea` 字段提供列表项编辑器，支持新增、删除、复制、上移、下移、常见字段表单输入和图片字段素材库选择，并保留 JSON 高级编辑兜底。
- Vue3 编辑器数组列表排序：属性面板列表项已支持同一数组属性内 HTML5 拖拽排序，拖拽后写回当前节点 props 数组，并提供拖拽中和目标项视觉状态。
- Vue3 编辑器列表项图片素材选择：数组列表项中的 `imageUrl`、`coverImageUrl` 和 `logoImageUrl` 类字段会展示缩略图、保留 URL 输入，并可展开内联素材库选择图片后写回当前列表项字段；`ImageCardGrid.items` 和 `BasicCarousel.items` 已有稳定列表项字段模型，browser smoke 已覆盖 `ImageCardGrid.items[].imageUrl` 选择素材和缩略图写回。
- 基础组件与物料分层架构：`docs/material-layering-architecture.md` 已定义 Design Tokens、Runtime Primitives、Generic Materials、Business Materials 的边界、依赖方向、首批组件清单、分阶段演进计划和新增物料检查清单；当前已落地 `@meumall/lowcode-design-tokens`、`@meumall/lowcode-primitives-react-h5` 和 `@meumall/lowcode-primitives-vue-h5` 公开包。
- Runtime primitives 公开包：`@meumall/lowcode-primitives-react-h5` 与 `@meumall/lowcode-primitives-vue-h5` 已承载 `MlcButton`、`MlcImage`、`MlcTag`、`MlcText`、`MlcPrice`、`MlcInput`、`MlcSelect`、`MlcRadioGroup`、`MlcTextarea`、`MlcSwitch`、`MlcCheckbox`、`MlcStepper`、`MlcOverlay`、`MlcModal`、`MlcCountdownText`、`MlcTabs`、`MlcSpacer`、`MlcDivider`、`MlcNoticeBar`、`MlcRichText`、`MlcStateBlock`、`MlcProgress` 和 `MlcMetric`，并由 React/Vue H5 materials 包组合成 `BasicButton`、`BasicLink`、`BasicAlert`、`BasicStateBlock`、`BasicProgress`、`BasicMetric`、`BasicMetricGrid`、`BasicInput`、`BasicTextarea`、`BasicSelect`、`BasicRadioGroup`、`BasicStepper`、`BasicSwitch`、`BasicCheckbox`、`BasicText`、`BasicPrice`、`DividerBlock`、`BasicImage`、`BasicTag`、`BasicCard`、`BasicCarousel`、`BasicVideo`、`BasicModal`、`BasicForm`、`BasicList`、`BasicAccordion`、`BasicTimeline`、`LeadFormBlock`、`SectionContainer`、`GridContainer`、`ActivityHero`、`NoticeBar`、`RichTextBlock`、`ProductList`、`SpacerBlock`、`TabsBlock`、`ActivityRuleModal` 和 `CountdownTimer` 等物料；primitives 仍不进入 material registry。
- Vue3 编辑器体验首轮优化：左侧物料区支持关键词搜索和分类过滤，画布顶部展示节点数、当前选中、校验/发布/保存状态，右侧当前节点卡片展示节点 id、父级和层级位置，并补充按钮、输入框、列表和画布工具栏的 hover/focus/active 反馈与响应式兜底；顶部工作区状态摘要已复用 editor workspace summary API。
- Vue3 编辑器物料偏好：左侧物料区已支持星标收藏和最近使用，均以 `componentName` 写入 localStorage；偏好内容解析、去重、未知物料过滤、最近使用数量限制、收藏切换和收藏提示文案已复用 editor material preference API，收藏和最近使用物料仍通过 editor material catalog API 按顺序恢复并在顶部快捷区一键添加。
- Vue3 编辑器属性面板分组：右侧 props 已按内容配置、样式配置、数据配置、行为配置和其他配置分组展示，支持折叠/展开，并修复新 profile 首次打开默认选中旧节点导致属性区为空的问题；字段归类、分组文案、顺序和折叠状态 helper 已复用 editor prop groups API；属性字段控件类型、列表字段、图片字段、默认新增项和输入转换已复用 editor prop editor model API；物料事件绑定展示、节点事件写回和 action 引用同步已复用 editor event binding API；属性字段分组、数组列表编辑器、列表项图片素材选择 UI 和事件绑定列表已通过 `EditorPropGroupsPanel.vue` 独立组件渲染，真实 props/events 写回、素材查询、商品 dataSource 绑定、权限和审计仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器快捷命令面板：顶部命令入口和 `Meta/Ctrl + K` 可打开全局命令面板，支持搜索并执行模式切换、草稿保存、预览/发布、打开 H5/React H5、清空画布、添加物料和应用模板；搜索和默认 28 条展示口径已复用 editor command palette API，弹窗展示已通过 `EditorCommandPalette.vue` 独立组件渲染。
- Vue3 编辑器节点快捷操作：H5 画布节点和结构树节点支持右键打开操作菜单，画布上下文工具条提供更多操作入口，并支持 Delete/Backspace 删除、Ctrl/Meta+C 复制、Ctrl/Meta+V 粘贴、Ctrl/Meta+D 创建副本、Ctrl/Meta+Z 撤销和 Ctrl/Meta+Shift+Z 或 Ctrl+Y 重做；菜单项、工具条禁用状态、快捷键识别和反馈文案已复用 editor node operation API。
- Vue3 编辑器结构树导航：左侧结构树支持搜索节点、折叠/展开容器、搜索命中路径展示和点击节点滚动定位到 H5 画布对应节点；当前选中节点会保持在结构树可见路径内，节点扁平化、搜索、折叠可见性和可见摘要已复用 editor outline tree API。
- Vue3 编辑器节点命名：结构树、右键菜单和右侧当前节点信息卡支持给节点设置运营可读名称，写入已有 `node.meta.name`，搜索可命中新名称，清空名称时回退物料标题。
- Vue3 编辑器当前节点信息卡组件化：右侧当前节点信息卡已通过 `EditorSelectedNodeCard.vue` 独立组件渲染，展示节点展示名、物料标题/分类、节点名称输入、节点 id、位置和父级；真实展示名/父级/位置计算、`node.meta.name` 写回、权限和审计仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器自动草稿 snapshot provider：schema 变更后会延迟调用 `LowcodeConfigPlatformClient.saveEditorDraftSnapshot`，顶栏展示自动保存和恢复状态；初始化后会通过 `getEditorDraftSnapshot` 异步恢复新于本地兜底的快照，旧 `STORAGE_KEY` localStorage 草稿保留为迁移和异常兜底；browser smoke 已验证重命名后自动保存到 provider snapshot 或旧兜底。该 snapshot 不等同于 `saveDraft` 生成的 draft release，不进入 release list，不作为发布或回滚依据。
- Vue3 编辑器 H5 画布视口预设：画布顶部提供 360 紧凑屏、390 标准屏、430 大屏三个本地预设，手机框宽度和状态栏会同步当前预设；该能力复用 `@meumall/lowcode-editor` 的 viewport preset API，只使用 `editorState.viewport`，不写入 Page Schema、物料 manifest 或 renderer 协议。
- Vue3 编辑器画布工具条组件化：画布顶部标题、选中节点位置或校验状态、工作区状态摘要和 H5 视口预设按钮已通过 `EditorCanvasToolbar.vue` 独立组件渲染；真实模式、选中节点上下文、校验状态、workspace stats 派生、视口写入、权限和审计仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器物料目录组件化：左侧物料分类说明、分类计数、物料分层总览、基础能力族标签、物料插入预设、关键词过滤、收藏/最近使用物料恢复和物料卡片摘要已复用 `@meumall/lowcode-editor` 的 material catalog/detail API，并通过 `EditorMaterialCatalog.vue` 独立组件渲染；物料插入禁用原因由 editor material insert target/capability 状态统一下发，目录会在只读、协作锁或审批阻塞时禁用点击、预设快捷添加和拖拽入口；真实添加、收藏持久化、Pointer Events、DragEvent、详情弹窗、权限、服务端分类上下架、物料预设远程覆盖、物料架构 profile 覆盖和审计仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器物料详情组件化：左侧物料详情弹窗的摘要、配置字段、事件、数据槽、默认插入节点和默认 H5 预览 schema 已复用 `@meumall/lowcode-editor` 的 material detail API，并通过 `EditorMaterialDetail.vue` 独立组件渲染；详情添加入口已消费统一插入禁用原因；真实选中状态、默认预览 schema 派生、添加到画布、收藏、权限、审计和真实预览数据仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器物料偏好 API 复用：物料收藏、最近使用、组件名解析、去重、未知物料过滤、数量截断和收藏提示文案已复用 `@meumall/lowcode-editor` 的 material preference API；具体 localStorage、未来用户偏好接口、权限、审计、多端同步和偏好迁移仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器快捷命令 API 复用：命令面板的 title、group、description、keywords 搜索、disabled 保留展示和默认展示数量已复用 `@meumall/lowcode-editor` 的 command palette API；命令执行函数仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器节点操作 API 复用：节点右键菜单、画布上下文工具条、当前节点快捷按钮、快捷键识别和反馈文案已复用 `@meumall/lowcode-editor` 的 node operation API，右键菜单浮层已通过 `EditorNodeContextMenu.vue` 独立组件渲染；实际 insert/remove/copy/paste/duplicate/move/undo/redo、DOM 菜单定位、输入框快捷键避让、确认弹窗、权限和审计仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器结构树组件化：结构树行模型、节点标题/副标题、搜索文本、搜索可见节点、折叠可见节点、选中路径、折叠节点裁剪和 reveal 祖先展开已复用 `@meumall/lowcode-editor` 的 outline tree API，并通过 `EditorOutlineTree.vue` 独立组件渲染；点击、Pointer Events、DragEvent、drop、右键菜单、重命名、滚动画布、权限和审计仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器节点选择 API 复用：结构树多选、无效节点裁剪、同父级判断、多选摘要、成组拖拽可用状态和拖拽节点组顺序已复用 `@meumall/lowcode-editor` 的 node selection API；DOM/Pointer 事件、投放位置、实际节点移动、权限、协作锁定和审计仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器画布投放提示 API 复用：画布 before/after/inside/append 投放位置、投放线样式、吸附线和节点拖拽非法目标判断已复用 `@meumall/lowcode-editor` 的 canvas drop hint API；DOM 元素测量、DragEvent/Pointer Events、真实插入/移动、权限、协作锁定和审计仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器画布投放目标和操作 API 复用：物料插入、单节点移动和同父级成组移动的 `parentId + index` 派生已复用 `@meumall/lowcode-editor` 的 canvas drop target API，画布物料插入、单节点移动和同父级成组移动的 schema 写入已复用 canvas operation API；DOM 事件、Pointer Events、DragEvent、跨父级选区、权限、协作锁定和审计仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器属性分组 API 复用：属性面板的内容/样式/数据/行为/其他分组归类、默认中文文案、稳定顺序和折叠状态纯 helper 已复用 `@meumall/lowcode-editor` 的 prop groups API；具体 setter 控件、资源选择器、数组编辑和用户反馈仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器属性字段模型 API 复用：属性面板字段控件类型、`select` 枚举控件、number 范围夹取、列表项字段模型、列表项图片字段识别、默认新增项、输入文本展示、boolean 兼容和写回 normalize 已复用 `@meumall/lowcode-editor` 的 prop editor model API；具体 Vue 控件、资源选择器、拖拽排序、权限、审计和服务端保存仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器页面设置 API 复用：Page Schema 的标题、描述、页面类型、状态、发布环境、背景色、安全区和 H5 最大宽度配置已复用 `@meumall/lowcode-editor` 的 page settings API；具体 Vue 表单、色板、权限、审批、协作锁定、审计和服务端保存仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器数据源配置 API 复用：Page Schema dataSources 的默认数据源类型、默认参数、表单行模型、解析状态展示、新增、更新、upsert 和删除已复用 `@meumall/lowcode-editor` 的 data source config API；具体 Vue 表单、JSON 解析错误、预览 resolver、真实 HTTP 请求、鉴权、缓存、权限、审计和服务端保存仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器事件绑定 API 复用：物料事件到 Page Schema actions 的绑定展示、未绑定/缺失 action 状态、节点 events 写回、action id 改名引用同步和 action 删除引用清理已复用 `@meumall/lowcode-editor` 的 event binding API；具体 select 控件、真实 action handler、权限、风控、审计和服务端保存仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器动作配置 API 复用：Page Schema actions 的默认动作类型、默认参数、动作表单行模型、动作新增、更新、改名、类型切换和删除清理已复用 `@meumall/lowcode-editor` 的 action config API；具体 Vue 表单、JSON 解析错误、真实 action handler、权限、风控、审计和服务端保存仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器 Schema 文件 API 复用：Page Schema 文件名生成、导出 JSON 内容、mimeType、字节大小、大小文案和导入 JSON 解析校验已复用 `@meumall/lowcode-editor` 的 schema file API；文件选择、Blob 下载、覆盖确认和用户反馈仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器草稿持久化 API 复用：本地自动保存 payload、草稿 JSON 解析恢复、旧版 Page Schema 直存格式兼容、状态文案和状态 tone 已复用 `@meumall/lowcode-editor` 的 draft persistence API；定时器、provider 调用、旧 localStorage 兜底、服务端草稿接口、冲突合并和用户反馈仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器 H5 预览链接 API 复用：H5 预览入口列表、ready/disabled 状态、打开/复制能力和交付入口摘要已复用 `@meumall/lowcode-editor` 的 preview links API；具体 URL 构造、schema URL handoff、打开窗口、复制剪贴板和用户反馈仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器工作区状态摘要组件化：顶部节点数、当前选中、校验、发布和保存状态摘要已复用 `@meumall/lowcode-editor` 的 workspace summary API，并通过 `EditorWorkspaceStats.vue` 独立组件渲染；具体布局组合、点击行为、权限、协作锁定和服务端审批状态仍由 playground 或未来管理台 shell 持有。
- Vue3 编辑器发布历史 API 复用：本地版本列表、关键词筛选、类型文案、时间展示、差异数量摘要、操作反馈、发布检查拦截和回滚备注/确认文案已复用 `@meumall/lowcode-editor` 的 release history API；具体保存草稿、生成预览、发布、载入、打开 runtime、确认弹窗、权限、审批、审计和服务端回滚仍由 playground 或未来管理台 shell 持有。

## 已知缺口

- 尚未实现完整生产级编辑器 UI；当前已具备新建页面向导、空白画布起步引导、页面设置面板、模板搜索筛选、模板卡片摘要、模板视觉缩略预览、模板 H5 预览入口、交付分享清单、本地自定义模板、Schema 文件导入导出、本地版本备注/筛选/差异详情、物料搜索过滤、物料详情预览、物料插入目标提示、最近操作审计流、物料收藏与最近使用、节点命名、本地自动保存和恢复提示、结构树搜索折叠与画布定位、发布风险摘要、发布检查节点定位、H5 预览入口、H5 画布视口预设、工作区状态摘要组件、顶部工具栏组件、通用 capability 顶部状态、顶部和发布面板宿主扩展插槽、快捷命令面板组件、节点右键菜单组件、当前节点信息卡组件、属性字段分组组件、资源选择器主面板组件、页面设置面板组件、发布面板组件、Schema 配置面板组件、属性分组折叠、属性字段模型 API、节点键盘快捷键、editor readiness API、editor publish risk summary API、editor version summary API、editor material detail API、editor material insert target API、editor audit trail API、editor material preference API、editor node operation API、editor node selection API、editor canvas drop hint API、editor canvas drop target API、editor canvas operation API、editor template summary API、editor page start API、editor shell theme token 原型、mock 素材/商品/优惠券/门店/达人选择器、数组属性列表编辑器和列表项拖拽排序，但还不是正式管理台组件；`styles.css` 仍有一部分组件级硬编码样式需要后续分批收口到 token。
- React/Vue H5 runtime primitives 已抽成 `@meumall/lowcode-primitives-react-h5` 和 `@meumall/lowcode-primitives-vue-h5` 公开包，并覆盖现有主要通用物料和业务物料；少数历史或简单物料仍可按真实复用收益继续整理。下一步缺口不是“是否有 primitives 包”，而是稳定 primitives API、补齐更细粒度测试和完成真实 npm 发布治理。
- 数据源面板和 React H5 runtime 已执行 mock resolver，adapters 已具备 HTTP data source handler 基础能力，playground 已支持可选 HTTP 数据源演示链路；尚未把默认 playground 切到真实 Java/BFF 数据源，也尚未接入真实鉴权、缓存、重试、分页和 Java 代理。
- 画布拖拽已支持新物料投放、已有节点移动、触屏 Pointer Events 拖拽、吸附线、同父级多选成组拖拽和数组列表项排序；跨父级多选拖拽仍需后续单独设计。
- Page Schema v1 已沉淀为 ready 契约，但 Java 配置平台确认后可能需要补充更严格的服务端发布校验、审批和审计字段。
- Material Manifest v1 已沉淀为 ready 契约，但 Java 配置平台确认后可能需要补充更严格的服务端校验字段。
- Java 配置平台 API 仍为前端草案，待 Java 配置平台负责人确认响应包装、鉴权、审批、服务端发布校验、版本 diff、回滚审计和分页。
- 当前发布检查、发布风险摘要、交付摘要、H5 预览入口、工作区状态摘要、编辑器 capability state、Schema 文件导入导出、本地草稿持久化、版本差异、Schema 片段预览、发布历史列表、发布历史筛选、发布操作反馈、回滚备注、物料详情摘要、物料详情字段、物料默认预览 schema、物料收藏/最近使用偏好、节点操作菜单/快捷键模型、节点选择/成组拖拽候选、画布投放提示模型、画布投放目标模型、画布投放操作模型、模板摘要、模板预览派生、页面起步命令、页面设置模型、数据源配置模型、事件绑定模型和动作配置模型已沉淀到 editor API；Vue3 editor playground 默认仍使用 localStorage mock，但已支持通过 env 切换 HTTP config platform client，并通过 browser smoke 验证版本列表、workflow、自动草稿 snapshot、保存草稿、生成预览、发布、authorization 和 note/operator。真实 Java 配置平台的服务端发布校验、审批、审计和错误码仍待对接确认。
- 当前 React H5 handoff 使用 URL schema 参数，React H5 runtime playground 已通过本地 client 跑通 previewToken/pageId/releaseId 加载并展示 fallback 诊断和 empty demo 空态，也已支持通过 env 切换真实 HTTP config platform client；正式预览仍需 Java 配置平台确认 previewToken 生成、过期、鉴权、审计和响应包装。
- Adapters 已具备 HTTP action handler 基础能力，React H5 runtime playground 已支持可选 HTTP `tracking.click` 演示链路；真实跳转桥、领券接口、埋点平台、权限、风控、登录态刷新、幂等和业务错误展示仍待后续接入。
- 高阶活动物料仍使用静态倒计时、静态规则、静态楼层配置、静态券包、静态门店/达人推荐、静态直播入口、静态商品榜单、静态品牌专题、静态底部转化条和 mock 商品数据，尚未对接真实活动、库存、价格、排行口径、品牌中心、规则中心、楼层配置中心、优惠券中心、门店中心、达人中心和直播中心。
- 图片/视频素材库、商品选择器、优惠券选择器、门店/达人选择器和模板列表已通过对应 client 解耦，本地自定义模板仍是 localStorage 原型；列表项编辑器仍使用通用字段模板，尚未接入真实素材中心、视频中心、商品中心、优惠券中心、门店/达人中心、模板市场、权限、分页、上下架和审核。
- 尚未在 `hybird-meumall` 真实业务仓库创建低代码路由并接入 npm 包。
- 尚未配置 npm registry/token；当前已具备 12 个可发布包的本地 `pnpm pack:dry-run` 包内容预检，且 `createHttpActionHandler`、`@meumall/lowcode-adapters` previewToken runtime loader、`@meumall/lowcode-adapters` runtime health summary API、`@meumall/lowcode-runtime-react-h5`、`@meumall/lowcode-editor` demo checklist API 和 `@meumall/lowcode-editor` publish risk summary API 已补 pending minor changeset，但真实发布仍需确认 registry、access、token、linked group 版本结果和 release/tag 策略。
- 已建立浏览器级 smoke check、带 PNG 健康断言的可视化截图 smoke check、renderer fallback 单测和架构边界 check，并覆盖基础挂载、模板应用、模式切换、编辑器首页、published H5 入口、preview H5 入口、empty/broken runtime 降级、包结构、依赖方向和物料 manifest 对齐；但更完整的组件级 DOM 测试、拖拽/属性编辑/发布等浏览器交互 E2E，完整循环依赖分析，以及带基线图 diff 的 visual regression 尚未建立。

## 最近变更

| 日期 | 提交 | 说明 |
| --- | --- | --- |
| 2026-08-01 | 本次提交 | 新增基础指标组通用物料。 |
| 2026-08-01 | 3eb828a | 支持 editor 物料预设按插入目标写入，并在 Vue3 编辑器容器快捷区加入常用预设。 |
| 2026-08-01 | 7361240 | 新增 editor 物料插入预设 API，并接入 Vue3 物料面板与快捷命令 smoke。 |
| 2026-08-01 | af61380 | 新增 editor 物料分层总览和基础能力族 profile API，并接入 Vue3 物料面板与 smoke。 |
| 2026-08-01 | 9106994 | 增强 editor 物料目录分类说明和数量摘要，并接入 Vue3 物料面板与 smoke。 |
| 2026-08-01 | 6d88041 | 新增 BasicTimeline 基础时间线通用物料，接入 React/Vue H5、Vue3 编辑器、React H5 runtime、测试、smoke 和 changeset。 |
| 2026-08-01 | b41452f | 新增 BasicAlert 基础提示通用物料，接入 React/Vue H5、Vue3 编辑器、React H5 runtime、测试、smoke 和 changeset。 |
| 2026-08-01 | e779bdd | 新增 BasicAccordion 基础折叠面板通用物料，接入 React/Vue H5、Vue3 编辑器、React H5 runtime、测试、smoke 和 changeset。 |
| 2026-08-01 | 53dbd57 | 新增 BasicLink 基础链接入口通用物料，接入 React/Vue H5、Vue3 编辑器、React H5 runtime、测试、smoke 和 changeset。 |
| 2026-08-01 | 39076fd | 新增 BasicList 基础列表通用物料，接入 React/Vue H5、Vue3 编辑器、React H5 runtime、测试、smoke 和 changeset。 |
| 2026-08-01 | 99e3a5f | 新增 BasicForm 基础表单容器通用物料，并扩展 editor 默认容器名单。 |
| 2026-08-01 | a390a9c | 新增 GridContainer 网格容器通用物料，并公开 editor 默认容器名单和容器判断函数。 |
| 2026-08-01 | `661bf25` | 新增 BasicPrice 基础价格通用物料，React/Vue H5 双端 manifest 对齐并接入编辑器和 React H5 runtime smoke。 |
| 2026-08-01 | `f69de27` | 新增 `@meumall/lowcode-runtime-react-h5` React H5 runtime host 包，并让 React H5 runtime playground 消费该包。 |
| 2026-08-01 | `2414898` | 新增 adapters runtime health summary API，并在 React H5 runtime playground 展示运行态健康摘要和检查项。 |
| 2026-08-01 | `b0c26a1` | 新增 editor publish risk summary API，并在 Vue3 发布面板展示发布风险摘要和优先处理项。 |
| 2026-08-01 | `ee15d07` | 新增本地演示验收命令，覆盖编辑器和 React H5 runtime 的 pageId/releaseId/previewToken 入口清单。 |
| 2026-08-01 | `505c420` | 新增 H5 runtime previewToken 加载入口，并接入 Vue3 编辑器和 React H5 runtime playground。 |
| 2026-08-01 | `7fbe37e` | 新增 editor demo checklist API，并在 Vue3 编辑器状态面板展示实操清单。 |
| 2026-08-01 | `00b83cc` | 新增 BasicModal 基础弹窗通用物料，React/Vue H5 双端 manifest 对齐并接入编辑器和 React H5 runtime smoke。 |
| 2026-08-01 | `4732666` | 新增 Vue3 编辑器本地审计日志面板，顶部宿主审计入口可查看并关闭近期操作记录。 |
| 2026-08-01 | `cca099e` | 新增 editor audit trail API，并在 Vue3 编辑器状态面板展示最近操作。 |
| 2026-08-01 | `edd43cc` | 新增 editor material insert target API，并统一 Vue3 编辑器物料插入目标提示、只读禁用原因和 smoke 覆盖。 |
| 2026-08-01 | `3f6d86f` | 新增 React/Vue H5 runtime primitives 公开包，并让 materials 包从 primitives 包组合低代码物料。 |
| 2026-08-01 | `880e5e3` | 新增 `@meumall/lowcode-design-tokens` 公开包，并让 React/Vue H5 内部 primitives 共同消费共享 token。 |
| 2026-08-01 | `bfc8a81` | 为 Vue3 编辑器顶部工具栏和发布面板增加宿主扩展插槽，并接入本地管理台扩展示例。 |
| 2026-08-01 | `85000f4` | 顶部工具栏改为消费 capability status items，通用展示协作、审批和发布检查状态。 |
| 2026-08-01 | `d0c786c` | 新增 editor capability state API，统一协作锁、审批、权限和发布检查门禁，并接入 Vue3 编辑器 playground。 |
| 2026-08-01 | `a771705` | 增强 `SectionContainer` 容器区块物料，复用内部 `MlcText` primitive 并保持单列容器协议稳定。 |
| 2026-08-01 | `0f0b86b` | 增强 `ActivityHero` 活动头图物料，复用内部 primitives 并补齐样式配置、示例和 smoke 校验。 |
| 2026-08-01 | `dd8678a` | 增强 `ProductList` 商品列表物料，复用内部 primitives 并补齐样式配置、示例和 smoke 校验。 |
| 2026-07-31 | `a5a8a60` | 初始化低代码 monorepo。 |
| 2026-07-31 | `0ed06ff` | 迁移低代码 AI 工作流。 |
| 2026-07-31 | `e1655eb` | 要求 Git 提交信息使用中文。 |
| 2026-07-31 | `c61c19f` | 推送 GitHub 远端并实现 schema/editor 第一批基础代码。 |
| 2026-07-31 | `4f1870d` | 新增 Vue3 编辑器 playground 和 Vue H5 renderer/materials。 |
| 2026-07-31 | `b1861d4` | 增强 Vue3 编辑器交互。 |
| 2026-07-31 | `edda161` | 增强容器、素材/商品选择和数据源预览。 |
| 2026-07-31 | `c3035f7` | 补充本地 mock 发布预览链路和独立 H5 runtime 入口。 |
| 2026-07-31 | `8d4cf89` | 对齐 React H5 容器物料并增强画布上下文操作。 |
| 2026-07-31 | `54b2ccf` | 新增独立 React H5 runtime playground。 |
| 2026-07-31 | `03cca93` | 打通编辑器到 React H5 runtime 的 schema handoff。 |
| 2026-07-31 | `915c9ef` | 扩展行动按钮、公告条和间距块基础物料。 |
| 2026-07-31 | `32cc2aa` | 新增编辑器页面模板库。 |
| 2026-07-31 | `bc68738` | 建立 schema/core/adapters 基础单元测试体系。 |
| 2026-07-31 | `4e5bf5b` | 打通 data source resolver 到编辑器预览和 React H5 runtime。 |
| 2026-07-31 | `843a6af` | 打通 action 安全白名单到编辑器配置和 React H5 runtime。 |
| 2026-07-31 | `31e7836` | 扩展倒计时、导航宫格和秒杀商品组高阶活动物料。 |
| 2026-07-31 | `760b5dc` | 沉淀 Java 配置平台 API 草案和配置平台客户端抽象。 |
| 2026-07-31 | `b6208c1` | 沉淀 H5 runtime 集成契约和 runtime schema loader。 |
| 2026-07-31 | `f88d21c` | 增强 Vue3 编辑器 mock 素材库和商品选择器。 |
| 2026-07-31 | `90509a4` | 增强 Vue3 编辑器画布拖拽插入线。 |
| 2026-07-31 | `6665e94` | 增强 Vue3 编辑器已有节点画布拖拽移动。 |
| 2026-07-31 | `b942ab3` | 增强 Vue3 编辑器发布前检查清单。 |
| 2026-07-31 | `ad7cb47` | 增强 Vue3 编辑器本地版本对比和回滚。 |
| 2026-07-31 | `26909c4` | 新增活动规则弹窗物料并对齐 React/Vue H5。 |
| 2026-07-31 | `2c8fd6d` | 新增楼层锚点导航并补充 renderer 节点标记。 |
| 2026-07-31 | `494bfac` | 增强 Vue3 编辑器布尔开关属性编辑。 |
| 2026-07-31 | `c587e3e` | 新增组合券包物料并接入 H5 示例。 |
| 2026-07-31 | `2b6d726` | 新增门店/达人推荐物料并接入 H5 示例。 |
| 2026-07-31 | `557697a` | 增强 Vue3 编辑器数组属性列表编辑。 |
| 2026-07-31 | `45576b0` | 增强 Vue3 编辑器数组列表拖拽排序。 |
| 2026-07-31 | `9dfff40` | 定义 Material Manifest v1 契约。 |
| 2026-07-31 | `a33db8a` | 完善 Page Schema v1 ready 契约。 |
| 2026-07-31 | `1d0ea42` | 增强 Vue3 编辑器触屏画布拖拽。 |
| 2026-07-31 | `262e976` | 增强 Vue3 编辑器画布吸附线。 |
| 2026-07-31 | `0eeb08a` | 增强 Vue3 编辑器同父级多选拖拽。 |
| 2026-07-31 | `7dc2d69` | 抽象编辑器 Resource Library Client 并接入 Vue3 编辑器资源选择器。 |
| 2026-07-31 | `dca1bbd` | 抽象编辑器 Template Library Client 并接入 Vue3 编辑器模板筛选。 |
| 2026-07-31 | `f0d1015` | 增强 Vue3 编辑器优惠券和门店/达人资源选择器。 |
| 2026-07-31 | `7188aec` | 新增浏览器级 smoke check 覆盖编辑器和 H5 runtime。 |
| 2026-07-31 | `723a114` | 增强 browser smoke 覆盖模板应用和模式切换。 |
| 2026-07-31 | `3e5b43c` | 首轮优化 Vue3 编辑器物料查找、工作区状态摘要和节点信息展示。 |
| 2026-07-31 | `c72b4b0` | 新增直播入口物料并接入编辑器模板和 React H5 runtime。 |
| 2026-07-31 | `d7858fb` | 增强 Vue3 编辑器属性面板分组折叠。 |
| 2026-07-31 | `eedebf4` | 新增商品榜单物料并接入编辑器模板和 React H5 runtime。 |
| 2026-07-31 | `1cb898a` | 增强 Vue3 编辑器快捷命令面板。 |
| 2026-07-31 | `697be96` | 新增品牌专题物料并接入编辑器模板和 React H5 runtime。 |
| 2026-07-31 | `0b92aed` | 新增底部转化条物料并接入 H5 示例。 |
| 2026-07-31 | `3b2b2da` | 增强 Vue3 编辑器节点右键菜单和键盘快捷键。 |
| 2026-07-31 | `a40c8fb` | 增强 Vue3 编辑器结构树搜索折叠和画布定位。 |
| 2026-07-31 | `e7ebb55` | 增强 Vue3 编辑器节点命名能力。 |
| 2026-07-31 | `1efc336` | 增强 Vue3 编辑器本地自动保存和恢复提示。 |
| 2026-07-31 | `a58ea5b` | 增强 Vue3 编辑器发布检查定位。 |
| 2026-07-31 | `046cacb` | 增强 Vue3 编辑器 H5 预览入口。 |
| 2026-07-31 | `98d66bf` | 增强 Vue3 编辑器物料收藏和最近使用。 |
| 2026-07-31 | `ee426b4` | 增强 Vue3 编辑器模板卡片摘要。 |
| 2026-07-31 | `4db382c` | 增强 Vue3 编辑器模板 H5 预览入口。 |
| 2026-07-31 | `bc545c5` | 增强 Vue3 编辑器新建页面向导。 |
| 2026-07-31 | `81fa5ac` | 增强 Vue3 编辑器页面设置面板。 |
| 2026-07-31 | `4aa0228` | 增强 Vue3 编辑器物料详情预览。 |
| 2026-07-31 | `28c773e` | 增强 Vue3 编辑器空白画布起步引导。 |
| 2026-07-31 | `be1633a` | 增强 Vue3 编辑器模板视觉预览。 |
| 2026-07-31 | `a43cadf` | 新增区块标题基础物料。 |
| 2026-07-31 | `73db7af` | 新增图片卡片宫格物料。 |
| 2026-07-31 | `57fe4a2` | 增强 Vue3 编辑器列表项图片素材选择。 |
| 2026-07-31 | `cc38a3b` | 设计基础组件与物料分层架构。 |
| 2026-07-31 | `f031c22` | 建立 React/Vue 内部 runtime primitives 原型。 |
| 2026-07-31 | `3c57d50` | 推进业务物料复用内部 runtime primitives。 |
| 2026-07-31 | `99c99f9` | 推进内容与门店物料复用基础组件。 |
| 2026-07-31 | `ba02714` | 推进活动与导航物料复用基础组件。 |
| 2026-07-31 | `41eb5f5` | 增强 Vue3 编辑器本地自定义模板。 |
| 2026-07-31 | `0e1898c` | 增强 Vue3 编辑器 Schema 导入导出。 |
| 2026-07-31 | `8c524e7` | 增强 Vue3 编辑器本地版本差异详情。 |
| 2026-07-31 | `9f50641` | 补齐表单 primitives 并新增留资表单物料。 |
| 2026-07-31 | `ded0533` | 增强 Vue3 编辑器交付分享清单。 |
| 2026-07-31 | `73a3ed1` | 增强 Vue3 编辑器本地版本备注和筛选。 |
| 2026-08-01 | `61e8f54` | 补充 npm 包发布 dry-run 预检。 |
| 2026-08-01 | `5ff31c9` | 记录 npm dry-run 提交号。 |
| 2026-08-01 | `3b45950` | 增强 React H5 runtime 诊断和空态演示。 |
| 2026-08-01 | `f5cb4ba` | 记录 H5 诊断提交号。 |
| 2026-08-01 | `baca97f` | 打通 React H5 runtime 本地 pageId/releaseId 加载。 |
| 2026-08-01 | `bb8a9e2` | 补充编辑器和 H5 runtime 可视化截图 smoke。 |
| 2026-08-01 | `e45a4b2` | 补充低代码包边界和物料分层架构检查。 |
| 2026-08-01 | `309a3d6` | 沉淀编辑器发布检查和交付摘要 API。 |
| 2026-08-01 | `e519bb0` | 沉淀编辑器版本差异和 Schema 摘要 API。 |
| 2026-08-01 | `6e85bf5` | 沉淀编辑器模板摘要和预览 API。 |
| 2026-08-01 | `c837e69` | 沉淀编辑器页面起步 API。 |
| 2026-08-01 | `49010d1` | 新增标签内容切换通用物料。 |
| 2026-08-01 | `828bd74` | 补齐 Overlay 和 Modal 内部弹层 primitives。 |
| 2026-08-01 | `c1b64e4` | 补齐 CountdownText 内部倒计时 primitive。 |
| 2026-08-01 | `26c591e` | 补齐 Tabs 内部标签切换 primitive。 |
| 2026-08-01 | `c3d5baf` | 补齐 Spacer 内部间距 primitive。 |
| 2026-08-01 | `79cb395` | 增强 H5 renderer 局部降级兜底。 |
| 2026-08-01 | `9208fe9` | 增强 Vue3 编辑器 H5 画布视口预设。 |
| 2026-08-01 | `c34ed8b` | 沉淀 editor 视口预设 API。 |
| 2026-08-01 | `f5a18fa` | 沉淀 editor 物料目录 API。 |
| 2026-08-01 | `12d47ef` | 沉淀 editor 快捷命令 API。 |
| 2026-08-01 | `bb4383b` | 沉淀 editor 结构树 API。 |
| 2026-08-01 | `59b9c6c` | 沉淀 editor 属性分组 API。 |
| 2026-08-01 | `98abb51` | 沉淀 editor Schema 文件 API。 |
| 2026-08-01 | `524167f` | 沉淀 editor 草稿持久化 API。 |
| 2026-08-01 | `a6a8516` | 沉淀 editor H5 预览链接 API。 |
| 2026-08-01 | `a73e28d` | 沉淀 editor 工作区状态摘要 API。 |
| 2026-08-01 | `3b5c73d` | 沉淀 editor 属性字段模型 API。 |
| 2026-08-01 | `713b8d8` | 沉淀 editor 事件绑定模型 API。 |
| 2026-08-01 | `0e48813` | 沉淀 editor 动作配置模型 API。 |
| 2026-08-01 | `d7feab6` | 沉淀 editor 数据源配置模型 API。 |
| 2026-08-01 | `b224fae` | 沉淀 editor 页面设置模型 API。 |
| 2026-08-01 | `2ca3a37` | 沉淀 editor 发布历史模型 API。 |
| 2026-08-01 | `7b9ad33` | 沉淀 editor 物料详情模型 API。 |
| 2026-08-01 | `153b97b` | 沉淀 editor 物料偏好模型 API。 |
| 2026-08-01 | `5562f1d` | 沉淀 editor 节点操作模型 API。 |
| 2026-08-01 | `ba69c20` | 沉淀 editor 节点选择模型 API。 |
| 2026-08-01 | `3856f4b` | 沉淀 editor 画布投放提示模型 API。 |
| 2026-08-01 | `285b7fc` | 沉淀 editor 画布投放目标模型 API。 |
| 2026-08-01 | `ec25d04` | 沉淀 editor 画布投放操作 API。 |
| 2026-08-01 | `3b9c77e` | 拆分 Vue3 编辑器工作区状态条组件。 |
| 2026-08-01 | `997fdcb` | 拆分 Vue3 编辑器物料目录组件。 |
| 2026-08-01 | `872c7ec` | 拆分 Vue3 编辑器物料详情组件。 |
| 2026-08-01 | `ea5e8dc` | 拆分 Vue3 编辑器结构树组件。 |
| 2026-08-01 | `f64080c` | 拆分 Vue3 编辑器画布工具条组件。 |
| 2026-08-01 | `1f6f107` | 拆分 Vue3 编辑器当前节点信息卡组件。 |
| 2026-08-01 | `e1d1a4e` | 拆分 Vue3 编辑器属性字段分组组件。 |
| 2026-08-01 | `ea71bdd` | 拆分 Vue3 编辑器资源选择器主面板组件。 |
| 2026-08-01 | `0ceabfc` | 拆分 Vue3 编辑器页面设置面板组件。 |
| 2026-08-01 | `c3ee864` | 拆分 Vue3 编辑器发布面板组件。 |
| 2026-08-01 | `68d0481` | 拆分 Vue3 编辑器 Schema 配置面板组件。 |
| 2026-08-01 | `862b933` | 拆分 Vue3 编辑器快捷命令面板组件。 |
| 2026-08-01 | `885f938` | 拆分 Vue3 编辑器节点右键菜单组件。 |
| 2026-08-01 | `2a8ced4` | 拆分 Vue3 编辑器顶部工具栏组件。 |
| 2026-08-01 | `7bd4509` | 拆分 Vue3 编辑器源码辅助面板组件。 |
| 2026-08-01 | `ffea8f5` | 拆分 Vue3 编辑器状态面板组件。 |
| 2026-08-01 | `f464f14` | 拆分 Vue3 编辑器画布上下文工具条组件。 |
| 2026-08-01 | `1a458bf` | 沉淀 editor 权限能力模型。 |
| 2026-08-01 | `1ff66ff` | 沉淀 editor 协作锁定状态模型。 |
| 2026-08-01 | `71da2da` | 沉淀 editor 审批状态模型。 |
| 2026-08-01 | `c857c6b` | 扩展 adapters 编辑器工作流状态 client。 |
| 2026-08-01 | `4233f54` | 接入 Vue3 编辑器工作流 provider 边界。 |
| 2026-08-01 | `9635bd9` | 补齐 Vue3 编辑器发布面板审批操作。 |
| 2026-08-01 | `2172037` | 接入编辑器自动草稿 snapshot provider。 |
| 2026-08-01 | `dd87af7` | 接入 H5 runtime 配置平台 HTTP client 开关。 |
| 2026-08-01 | `1de3224` | 沉淀 Vue3 编辑器主题 token 原型。 |
| 2026-08-01 | `4b17510` | 接入 Vue3 编辑器配置平台 HTTP client 开关。 |
| 2026-08-01 | `5f72dd4` | 补齐基础按钮和基础输入框通用物料。 |
| 2026-08-01 | `783757f` | 补齐基础文本和分割线通用物料。 |
| 2026-08-01 | `df3513c` | 补齐基础图片和标签通用物料。 |
| 2026-08-01 | `fe2a42f` | 增强基础容器布局能力。 |
| 2026-08-01 | `5664b8f` | 新增基础图文卡片通用物料。 |
| 2026-08-01 | `0b4cbbd` | 增强编辑器枚举属性选择控件。 |
| 2026-08-01 | `6e2f040` | 增强编辑器数值属性范围控件。 |
| 2026-08-01 | `ed467c4` | 增强编辑器颜色属性色板控件。 |
| 2026-08-01 | `ad59e90` | 基础图片物料接入素材选择器。 |
| 2026-08-01 | `37ec398` | 新增 adapters HTTP 数据源 handler。 |
| 2026-08-01 | `4e34850` | 接入 playground HTTP 数据源演示链路。 |
| 2026-08-01 | `d1ac026` | 新增 adapters HTTP action handler 并接入 H5 runtime 演示链路。 |
| 2026-08-01 | `d6fefc6` | 补充 HTTP 动作适配版本记录。 |
| 2026-08-01 | `d7058f8` | 增强 visual smoke 截图健康断言。 |
| 2026-08-01 | `41cd7e0` | 新增本地编辑器与 H5 runtime 联合启动器。 |
| 2026-08-01 | `ceca96c` | 新增基础图片轮播通用物料。 |
| 2026-08-01 | `62824c3` | 新增基础视频通用物料。 |
| 2026-08-01 | `28518d6` | 新增编辑器视频素材选择器。 |
| 2026-08-01 | `636fc73` | 新增基础选择框通用物料。 |
| 2026-08-01 | `3c9391b` | 新增基础多行输入通用物料。 |
| 2026-08-01 | `d251f62` | 新增基础开关通用物料。 |
| 2026-08-01 | `88c022e` | 新增基础复选框通用物料。 |
| 2026-08-01 | `67893f0` | 新增基础单选组通用物料。 |
| 2026-08-01 | `eab51d5` | 新增基础步进器通用物料。 |
| 2026-08-01 | `3bbac17` | 新增基础指标通用物料。 |
| 2026-08-01 | `cb5304a` | 新增基础进度条通用物料。 |
| 2026-08-01 | `b8d85c0` | 新增基础状态块通用物料。 |

## 默认验证命令

```bash
pnpm typecheck
pnpm build
pnpm check:architecture
pnpm demo:check
pnpm demo:acceptance
pnpm test
pnpm pack:dry-run
pnpm smoke:browser
pnpm smoke:visual
pnpm dev
```
