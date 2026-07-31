# AI Context

## 当前目标

建设 MeuMall 低代码平台基础架构，先统一放在 `/Users/mac/person_code/meumall-lowcode`，后续可拆包、发布 npm、上传 GitHub 留存。

## 设计基线

- schema 是核心契约。
- `Page Schema v1` ready 契约已写入 `.ai-workspace/contracts/page-schema-v1.md`，定义页面 schema 的字段语义、生命周期、校验规则、兼容性、安全要求、变更流程和回滚方式。
- editor 生产 schema。
- renderer 消费 schema。
- materials 实现可配置节点。
- Java 配置平台负责存储和发布 schema。
- H5 通过 npm 引入 renderer/materials/schema。
- 管理端编辑器优先使用 Vue3，便于后续迁移到 Java 管理系统或管理后台中。
- 编辑器发布链路先在 `apps/editor-playground/src/mockPlatform.ts` 用 localStorage mock Java 配置平台，后续替换为 HTTP adapter。
- 独立 H5 runtime 入口先通过 `apps/editor-playground` 的 `?runtime=1&pageId=...` 或 `?runtime=1&releaseId=...` 验证 renderer 消费发布 schema。
- React H5 消费端验证入口是 `apps/h5-runtime-playground`，默认运行在 `http://localhost:5174/`，用于验证 `@meumall/lowcode-renderer-h5` 和 `@meumall/lowcode-materials-h5`。
- 编辑器可以通过 `@meumall/lowcode-adapters` 的 schema URL 编解码工具把当前 schema handoff 到 React H5 runtime：`http://localhost:5174/?schema=...&source=editor`。
- `@meumall/lowcode-adapters` 已提供 `resolveLowcodeDataSources`，编辑器预览和 React H5 runtime 均通过注册白名单 data source handler 解析 schema.dataSources，再把结果作为 renderer data 注入。
- `@meumall/lowcode-adapters` 已提供 `createSafeActionRegistry` 和 `createSafeActionExecutor`，编辑器 playground 可维护 schema.actions 并把物料事件绑定到 action；事件绑定展示、节点 events 写回、action id 改名引用同步和 action 删除引用清理已复用 editor event binding API；Vue 预览和 React H5 runtime 通过白名单 handler 执行 mock navigate、coupon.receive、tracking.click 和 noop。
- React/Vue H5 物料包已包含基础物料和高阶活动物料：`SectionTitle`、`ImageCardGrid`、`TabsBlock`、`CountdownTimer`、`NavGrid`、`FloorAnchorNav`、`FlashSaleList`、`ProductRankList`、`BrandFeatureSection`、`StickyActionBar`、`ActivityRuleModal`、`CouponBundle`、`StoreExpertSection`、`LiveEntry`；大促模板、新人券模板和 React H5 runtime 示例已使用这些物料。
- 基础组件与物料分层架构已沉淀到 `docs/material-layering-architecture.md`：Design Tokens、Runtime Primitives、Generic Materials、Business Materials 分层治理；当前策略是先在 `materials-*` 包内部做 primitives 原型，稳定后再抽 `@meumall/lowcode-design-tokens`、`@meumall/lowcode-primitives-react-h5`、`@meumall/lowcode-primitives-vue-h5`，不要过早拆包。React/Vue materials 包内已建立内部 `MlcButton`、`MlcImage`、`MlcTag`、`MlcText`、`MlcPrice`、`MlcInput`、`MlcTextarea`、`MlcSwitch`、`MlcStepper`、`MlcOverlay`、`MlcModal`、`MlcCountdownText`、`MlcTabs`、`MlcSpacer` 和 `h5Tokens`，并由主要活动、导航、优惠券、弹层、倒计时、标签切换、间距、业务物料和通用 `LeadFormBlock` 复用。
- `Material Manifest v1` 契约已写入 `.ai-workspace/contracts/material-manifest-v1.md`，定义物料字段语义、兼容性、编辑器/renderer/Java/H5 消费规则和变更流程。
- React/Vue H5 renderer 已为 schema 节点输出 `data-lowcode-node-id`，楼层锚点物料可按目标节点 id 滚动定位。
- Java 配置平台 API 草案已写入 `.ai-workspace/contracts/java-config-platform-api-v1.md`，`@meumall/lowcode-adapters` 已提供 `LowcodeConfigPlatformClient` 与 `createHttpConfigPlatformClient`，编辑器本地 mock 发布链路已实现同一 client 接口。
- H5 runtime 集成清单已写入 `.ai-workspace/contracts/h5-runtime-integration-v1.md`，`docs/meumall-integration.md` 是面向 `hybird-meumall` 接入的简版说明。
- 根级已提供 `pnpm pack:dry-run`，会自动发现 `packages/*` 下 8 个可发布包并逐包执行 `npm pack --dry-run --json`，校验实际包内容包含 `package.json`、`README.md`、`dist/index.js` 和 `dist/index.d.ts`；该命令不发布 npm 包，不需要 npm token，真实发布前仍需确认 registry、access、token 和 changeset 版本。
- 根目录已提供 `pnpm check:architecture`，通过零依赖 Node 脚本检查可发布包结构、`@meumall/*` workspace 依赖方向、源码 import 依赖方向、React/Vue H5 物料 `componentName` manifest 对齐，以及 `Mlc*` runtime primitives 不进入 material registry；`pnpm test` 已接入该检查，后续新增包、物料或编辑器能力时需要先维护允许依赖表再扩展。
- `@meumall/lowcode-adapters` 已提供 `loadLowcodeRuntimeSchema`，统一按 `encodedSchema -> releaseId -> pageId -> fallbackSchema` 获取运行时 schema；React H5 runtime playground 已改为使用该 loader，并内置本地 `LowcodeConfigPlatformClient` mock，`?pageId=summer-campaign-demo` 可加载 published schema，`?releaseId=preview_demo` 可加载 preview release schema，未知 pageId/releaseId 会展示 fallback 原因；运行诊断面板展示请求入口、实际 schema 来源、fallback 原因、pageId、pageVersion、schema 校验、节点数、数据源状态和 action 日志；`?demo=empty` 用于验证 nodes 为空时展示 H5 安全空态。
- React/Vue H5 renderer 已统一局部降级 DOM 标记：未知物料输出 `mlc-runtime-missing`、`data-lowcode-node-id`、`data-lowcode-missing`，组件渲染异常输出 `mlc-runtime-error`、`data-lowcode-node-id`、`data-lowcode-error`；React/Vue 均支持 `onRenderError` 供宿主接监控。React H5 runtime playground 新增 `?demo=broken`，同时验证未知物料和抛错物料不导致整页白屏。
- `@meumall/lowcode-adapters` 已提供 `LowcodeResourceLibraryClient` 和 `createStaticResourceLibraryClient`，Vue3 编辑器 playground 右侧素材库、商品选择器、优惠券选择器和门店/达人选择器已通过 resource client 查询数据；后续接真实素材中心、商品中心、优惠券中心、门店/达人中心时优先替换 client，不改 UI 内部查询逻辑。
- `@meumall/lowcode-adapters` 已提供 `LowcodeTemplateLibraryClient` 和 `createStaticTemplateLibraryClient`，Vue3 编辑器 playground 左侧模板列表已通过 template client 查询，支持搜索、分类过滤、加载态和空状态；后续接 Java 模板市场时优先替换 client，不改 UI 内部查询逻辑。
- Vue3 编辑器 playground 右侧属性区已提供资源选择器：图片类节点可搜索/分类选择图片，数组列表项中的 `imageUrl`、`coverImageUrl`、`logoImageUrl` 类字段可展开内联素材库选择图片并写回当前项；`ProductList`/`ProductRankList`/`BrandFeatureSection`/`FlashSaleList` 可搜索多选商品并写入静态 `props.items` 或重新绑定 `products` 数据源，`CouponBundle` 可多选优惠券写入 `props.coupons`，`CouponSection` 可选择单张优惠券写入主券文案，`StoreExpertSection` 可多选门店/达人写入 `props.items` 或重新绑定 `stores` 数据源。
- Vue3 编辑器 playground 画布已支持物料拖拽插入线：拖到节点上半区插入前方，下半区插入后方，拖到 `SectionContainer` 中间区域加入容器，拖到空白区域追加页面末尾。
- Vue3 编辑器 playground 画布已支持已有节点拖拽移动：设计模式下节点 wrapper 可拖动，支持移动到目标前后、移入 `SectionContainer`、移动到根节点末尾，并规避拖到自己或自己后代。
- Vue3 编辑器 playground 已补充触屏/手写笔 Pointer Events 拖拽：物料面板、结构树节点和 H5 画布节点都可通过 pointer 移动超过阈值后复用现有 drop hint 完成投放或移动；拖拽完成后会抑制紧随其后的 click，避免额外追加物料。
- Vue3 编辑器 playground 已补充画布吸附线：`canvasDropHint.guides` 会在节点前/后投放时显示跨画布横向吸附线和目标中心纵向线，在容器内投放时显示容器中心横向/纵向辅助线。
- Vue3 编辑器 playground 已补充同父级多选拖拽：结构树可通过勾选、Meta/Ctrl/Shift 点击多选；同父级选区拖动已选节点时会作为一组移动，跨父级选区回退为单节点移动。
- `@meumall/lowcode-renderer-vue-h5` 的 editable wrapper 已提供可选 `nodeDraggable`、`onNodeDragStart`、`onNodeDragEnd`，供编辑器 shell 编排拖拽，不影响默认生产渲染。
- Vue3 编辑器 playground 右侧面板已提供发布检查清单，覆盖 schema、节点、图片、商品、数据源和动作；生成预览和发布会拦截 error 检查项，保存草稿不拦截。
- Vue3 编辑器 playground 本地版本列表已支持 release 备注和关键词筛选；备注属于 playground release metadata，不写入 Page Schema v1，后续接 Java 配置平台时优先映射到版本元信息或审计备注字段。版本列表支持选择版本对比，展示标题、状态、环境、页面版本、节点数、数据源数和动作数的当前草稿/所选版本差异、变更状态，以及当前草稿和所选版本的 schema JSON 片段预览；仍可将选中版本作为新的 published release 回滚发布。
- Vue3 编辑器 playground 属性面板已支持 `switch` setter 和 `boolean` 类型字段的开关控件，写入真实 boolean，并兼容旧草稿中的 `"false"`、`"0"`、`"off"` 字符串。
- Vue3 编辑器 playground 属性面板已支持 `array` + `textarea` 字段的列表项编辑器，覆盖优惠券、规则、导航项、楼层锚点、图片卡片宫格、门店/达人推荐等常见数组配置；图片字段展示缩略图并支持素材库选择，仍保留 URL 输入和 JSON 高级编辑兜底。
- Vue3 编辑器 playground 数组属性列表项已支持同一属性内 HTML5 拖拽排序，并保留上移、下移、复制、删除和 JSON 高级编辑。
- Vue3 编辑器 playground 已完成体验首轮优化：左侧物料区支持关键词搜索和分类过滤，画布顶部展示节点数、当前选中、校验/发布/保存状态，右侧当前节点卡片展示节点 id、父级和层级位置，编辑器 shell 补充按钮、输入框、列表和画布工具栏的 hover/focus/active 反馈与窄屏兜底；顶部工作区状态摘要已复用 editor workspace summary API。
- Vue3 编辑器 playground 已支持 H5 画布视口预设：画布顶部可切换 360 紧凑屏、390 标准屏和 430 大屏，手机框宽度和状态栏同步当前预设；该状态只属于编辑器 shell 的 `editorState.viewport`，不进入 Page Schema，避免与 `schema.layout.maxWidth`、物料 manifest 或 renderer 协议混淆。
- Vue3 编辑器 playground 属性面板已支持分组折叠：当前物料 props 会按内容配置、样式配置、数据配置、行为配置和其他配置分组展示，组内显示字段数量并可折叠/展开；字段归类、默认文案、稳定顺序和折叠状态 helper 已复用 editor prop groups API，字段控件类型、列表字段、图片字段、默认新增项和输入转换已复用 editor prop editor model API。新 profile 首次打开会默认选中当前 schema 的首个节点，避免属性区为空。
- Vue3 编辑器 playground 已支持快捷命令面板：顶部“命令”入口和 `Meta/Ctrl + K` 可打开全局命令面板，支持搜索执行模式切换、保存草稿、生成预览、发布页面、打开 H5/React H5、清空画布、添加物料和应用模板；命令搜索和默认 28 条展示限制已复用 editor command palette API，命令执行函数仍在 playground shell 内。
- Vue3 编辑器 playground 已支持节点快捷操作：H5 画布节点和左侧结构树节点可右键打开操作菜单，画布上下文工具条有“更多”入口；全局快捷键支持 Delete/Backspace 删除、Ctrl/Meta+C 复制、Ctrl/Meta+V 粘贴、Ctrl/Meta+D 创建副本、Ctrl/Meta+Z 撤销、Ctrl/Meta+Shift+Z 或 Ctrl+Y 重做，并会避开输入框、textarea、select、contenteditable 和命令面板输入；菜单项、工具条禁用状态、快捷键识别和反馈文案已复用 editor node operation API。
- Vue3 编辑器 playground 已支持结构树导航增强：左侧结构树可按物料标题、组件名、节点 id 和 meta name 搜索，容器节点可折叠/展开；搜索会展示命中节点及其祖先路径，点击结构树节点会选中并滚动 H5 画布到对应节点。结构树行模型、搜索、折叠可见性、选中路径、折叠节点裁剪和 reveal 祖先展开已复用 editor outline tree API。
- Vue3 编辑器 playground 已支持节点命名：结构树主标题展示 `node.meta.name` 或物料标题，右侧当前节点信息卡可编辑节点名称，节点右键菜单可进入结构树内联重命名；重命名复用已有 `meta.name`，可被结构树搜索命中。
- Vue3 编辑器 playground 已支持本地自动保存和恢复提示：schema 变更后延迟 700ms 写入 localStorage 草稿，顶栏展示自动保存状态；从 localStorage 恢复草稿时显示“已恢复本地草稿”。草稿 payload、旧版 Page Schema 直存格式兼容、恢复校验、状态文案和 tone 已复用 editor draft persistence API；这仍是本地 mock，后续接 Java 配置平台时应替换为服务端草稿自动保存。
- Vue3 编辑器 playground 已支持发布检查节点定位：节点级图片、商品、数据源和动作配置问题会在右侧发布检查中展示“定位”入口，点击后自动切回设计模式、选中节点、展开结构树路径并滚动画布到目标节点。
- Vue3 编辑器 playground 已支持 H5 预览入口：右侧发布区域集中展示当前草稿 React H5 链接、页面草稿/最新版本内置 H5 链接和最近发布版本 H5 链接，并支持打开和复制反馈；入口展示模型、ready/disabled 状态、打开/复制能力和交付入口摘要已复用 editor preview links API，具体 URL 构造仍留在 playground shell。
- Vue3 编辑器 playground 已支持交付分享清单：右侧发布区域集中展示页面标题、pageId、节点数、数据源数、动作数、Schema JSON 体积、发布检查状态、H5 交付入口状态，并提供复制当前 Page Schema JSON 和导出 Schema 文件入口；当前链接仍是本地 playground / URL schema handoff，正式环境需替换为 Java previewToken 或 releaseId。
- `@meumall/lowcode-editor` 已沉淀框架无关 readiness API：`flattenLowcodeNodes`、`countLowcodeNodes`、`getLowcodeNodeDisplayName`、`createLowcodePublishChecks`、`summarizeLowcodePublishChecks`、`createLowcodeDeliverySummary` 和 `formatLowcodeSchemaSize`；Vue3 editor playground 的发布检查和交付清单已改为复用这些 API，后续迁入 Java 管理系统时优先复用 editor 包，不在 UI 壳重复实现检查口径。
- `@meumall/lowcode-editor` 已沉淀框架无关 version summary API：`createLowcodeVersionDiffItems`、`createLowcodeSchemaPreviewSnippet` 和 `createLowcodeSchemaPreviewItems`；Vue3 editor playground 的本地版本差异详情和 Schema 片段预览已改为复用这些 API，后续接 Java 配置平台版本 diff、回滚确认和审计展示时优先对齐 editor 包口径。
- `@meumall/lowcode-editor` 已沉淀框架无关 release history API：`formatLowcodeReleaseKindLabel`、`formatLowcodeReleaseTime`、`createLowcodeReleaseListItem`、`createLowcodeReleaseListItems`、`summarizeLowcodeReleaseList`、`formatLowcodeVersionDiffSummary`、`createLowcodeReleaseMessage`、`createLowcodePublishBlockedMessage`、`createLowcodeRollbackNote` 和 `createLowcodeRollbackConfirmText`；Vue3 editor playground 的本地版本列表、关键词筛选、类型文案、时间展示、差异数量摘要、操作反馈、发布检查拦截和回滚备注/确认文案已改为复用这些 API，后续管理台接入时不要复制 release metadata 搜索、列表摘要和操作文案口径；真实保存、预览、发布、载入、打开 runtime、权限、审批、审计和服务端回滚仍由宿主 config platform client 持有。
- `@meumall/lowcode-editor` 已沉淀框架无关 template summary API：`createLowcodeTemplatePreviewMeta`、`createLowcodeTemplateListItem`、`sliceLowcodeTemplateTags`、`formatLowcodeTemplateVersion` 和 `formatLowcodeTemplateSummary`；Vue3 editor playground 的模板卡片、模板起点和本地自定义模板展示已改为复用这些 API，后续接 Java 模板市场和管理台模板选择页时优先对齐 editor 包口径。
- `@meumall/lowcode-editor` 已沉淀框架无关 page start API：`createLowcodeBlankPageSchema`、`cloneLowcodePageSchema` 和 `createLowcodePageStartState`；Vue3 editor playground 的新建空白 H5 页面、重置示例页和应用模板已改为复用这些 API，后续管理台新建页面、模板起步和 release 回滚草稿可优先对齐 editor 包口径。
- `@meumall/lowcode-editor` 已沉淀框架无关 viewport preset API：`LOWCODE_H5_VIEWPORT_PRESETS`、`getLowcodeEditorViewportPreset`、`findLowcodeEditorViewportPreset`、`createLowcodeEditorViewportFromPreset`、`formatLowcodeEditorViewportTitle` 和 `setEditorViewportPreset`；Vue3 editor playground 的 H5 画布视口预设已改为复用这些 API，后续管理台接入时不要复制 360/390/430 魔法数字。
- `@meumall/lowcode-editor` 已沉淀框架无关 material catalog API：`createLowcodeMaterialCatalogItem`、`createLowcodeMaterialCategories`、`filterLowcodeMaterialCatalog`、`pickLowcodeMaterialEntriesByComponentNames` 和 `formatLowcodeMaterialCatalogSummary`；Vue3 editor playground 的物料分类、关键词过滤、收藏/最近使用恢复和物料卡片摘要已改为复用这些 API，后续管理台接入时不要复制 manifest 过滤和摘要口径。
- `@meumall/lowcode-editor` 已沉淀框架无关 material detail API：`createLowcodeMaterialDetailSummary`、`createLowcodeMaterialDetailPropEntries`、`createLowcodeMaterialDetailEventItems`、`createLowcodeMaterialDetailDataSourceSlotItems`、`createLowcodeMaterialNodeInput` 和 `createLowcodeMaterialPreviewSchema`；Vue3 editor playground 的物料详情摘要、配置字段、事件、数据槽、默认插入节点和默认 H5 预览 schema 已改为复用这些 API，后续管理台接入时不要复制 manifest 详情字段、默认节点输入和默认预览 schema 派生口径；弹窗 UI、renderer 预览、添加到画布、收藏、权限、审计和真实预览数据仍由宿主 shell 持有。
- `@meumall/lowcode-editor` 已沉淀框架无关 material preference API：`LOWCODE_EDITOR_RECENT_MATERIAL_DEFAULT_LIMIT`、`normalizeLowcodeMaterialComponentNames`、`parseLowcodeMaterialPreferenceContent`、`isLowcodeFavoriteMaterial`、`toggleLowcodeFavoriteMaterial`、`recordLowcodeRecentMaterial` 和 `createLowcodeMaterialFavoriteMessage`；Vue3 editor playground 的物料收藏、最近使用、组件名解析、去重、未知物料过滤、数量截断和收藏提示文案已改为复用这些 API，后续管理台接入时不要复制偏好列表规则；localStorage、用户偏好接口、权限、审计、多端同步和偏好迁移仍由宿主 shell 持有。
- `@meumall/lowcode-editor` 已沉淀框架无关 command palette API：`LOWCODE_EDITOR_COMMAND_DEFAULT_LIMIT`、`createLowcodeEditorCommandSearchText`、`filterLowcodeEditorCommands` 和 `groupLowcodeEditorCommands`；Vue3 editor playground 的快捷命令搜索和默认展示限制已改为复用这些 API，后续管理台接入时不要复制 title/group/description/keywords 搜索口径。
- `@meumall/lowcode-editor` 已沉淀框架无关 node operation API：`createLowcodeNodeOperationItems`、`resolveLowcodeNodeShortcutAction` 和 `createLowcodeNodeOperationMessage`；Vue3 editor playground 的节点右键菜单、画布上下文工具条、当前节点快捷按钮、节点快捷键识别和节点操作反馈文案已改为复用这些 API，后续管理台接入时不要复制节点操作菜单和快捷键判断；实际节点命令执行、DOM 菜单定位、输入框快捷键避让、确认弹窗、权限、审计和服务端保存仍由宿主 shell 持有。
- `@meumall/lowcode-editor` 已沉淀框架无关 outline tree API：`createLowcodeOutlineRows`、`createLowcodeOutlineRowSearchText`、`createLowcodeOutlineVisibility`、`pruneLowcodeOutlineCollapsedNodeIds` 和 `revealLowcodeOutlineNode`；Vue3 editor playground 的结构树节点扁平化、搜索命中、折叠可见性、选中路径和可见摘要已改为复用这些 API，后续管理台接入时不要复制结构树算法。
- `@meumall/lowcode-editor` 已沉淀框架无关 prop groups API：`LOWCODE_EDITOR_PROP_GROUP_ORDER`、`LOWCODE_EDITOR_PROP_GROUP_META`、`getLowcodePropGroupKey`、`createLowcodePropGroups`、`isLowcodePropGroupCollapsed` 和 `toggleLowcodePropGroupCollapsed`；Vue3 editor playground 的属性面板字段归类、分组展示文案、顺序和折叠状态 helper 已改为复用这些 API，后续管理台接入时不要复制 propName/setter/type 分组口径。
- `@meumall/lowcode-editor` 已沉淀框架无关 prop editor model API：`getLowcodePropEditorControl`、`isLowcodeListPropEditor`、`isLowcodeStructuredPropEditor`、`createLowcodeListEditorFields`、`isLowcodeListImageField`、`createLowcodeDefaultListItem`、`toLowcodePropInputText`、`toLowcodePropInputBoolean` 和 `normalizeLowcodePropInputValue`；Vue3 editor playground 的属性字段控件类型、列表项字段、图片字段、默认新增项、输入展示和写回 normalize 已改为复用这些 API，后续管理台接入时不要复制 setter 类型判断和列表字段口径。
- `@meumall/lowcode-editor` 已沉淀框架无关 page settings API：`LOWCODE_EDITOR_PAGE_TYPE_OPTIONS`、`LOWCODE_EDITOR_PAGE_STATUS_OPTIONS`、`LOWCODE_EDITOR_PUBLISH_ENVIRONMENT_OPTIONS`、`LOWCODE_EDITOR_PAGE_BACKGROUND_SWATCHES`、`createLowcodePageSettingsForm`、`normalizeLowcodePageMaxWidth`、`updateLowcodePageTitle`、`updateLowcodePageDescription`、`updateLowcodePageStatus`、`updateLowcodePageType`、`updateLowcodePublishEnvironment`、`updateLowcodePageBackgroundColor`、`updateLowcodePageSafeArea` 和 `updateLowcodePageMaxWidth`；Vue3 editor playground 的页面基础配置、布局配置和发布配置已改为复用这些 API，后续管理台接入时不要复制 Page Schema 页面设置写回口径。
- `@meumall/lowcode-editor` 已沉淀框架无关 data source config API：`LOWCODE_EDITOR_DEFAULT_DATA_SOURCE_TYPE_OPTIONS`、`createLowcodeDefaultDataSourceParams`、`createLowcodeDataSourceConfig`、`formatLowcodeDataSourceParamsText`、`formatLowcodeDataSourceRecordLabel`、`createLowcodeDataSourceFormItems`、`upsertLowcodeDataSourceConfigs`、`addLowcodeDataSource`、`updateLowcodeDataSource` 和 `removeLowcodeDataSource`；Vue3 editor playground 的数据源类型、默认参数、数据源表单行、解析状态展示、新增、更新、upsert 和删除已改为复用这些 API，后续管理台接入时不要复制 Page Schema dataSources 表单和状态展示口径。
- `@meumall/lowcode-editor` 已沉淀框架无关 event binding API：`createLowcodeActionOptions`、`createLowcodeEventBindingItems`、`bindLowcodeNodeEvent`、`renameLowcodeActionRefsInNodes` 和 `removeLowcodeActionRefsFromNodes`；Vue3 editor playground 的物料事件绑定展示、未绑定/缺失 action 状态、节点 events 写回、action id 改名引用同步和 action 删除引用清理已改为复用这些 API，后续管理台接入时不要复制事件下拉和 action ref 递归处理口径。
- `@meumall/lowcode-editor` 已沉淀框架无关 action config API：`LOWCODE_EDITOR_DEFAULT_ACTION_TYPE_OPTIONS`、`createLowcodeDefaultActionParams`、`createLowcodeActionConfig`、`formatLowcodeActionParamsText`、`createLowcodeActionFormItems`、`addLowcodeAction`、`updateLowcodeAction`、`renameLowcodeAction`、`setLowcodeActionType` 和 `removeLowcodeAction`；Vue3 editor playground 的动作类型、默认参数、动作表单行模型、动作新增、更新、改名、类型切换和删除清理已改为复用这些 API，后续管理台接入时不要复制 Page Schema actions 表单和引用清理口径。
- `@meumall/lowcode-editor` 已沉淀框架无关 schema file API：`createLowcodeSchemaFileName`、`createLowcodeSchemaFileExport` 和 `parseLowcodeSchemaFileContent`；Vue3 editor playground 的 Page Schema 文件名、导出内容、mimeType、字节大小、大小文案和导入解析校验已改为复用这些 API，后续管理台接入时不要复制 JSON 解析和校验口径。
- `@meumall/lowcode-editor` 已沉淀框架无关 draft persistence API：`createLowcodeEditorDraftPayload`、`parseLowcodeEditorDraftContent`、`formatLowcodeEditorDraftStatusText` 和 `getLowcodeEditorDraftStatusTone`；Vue3 editor playground 的本地自动保存 payload、旧草稿恢复兼容、恢复校验、状态文案和 tone 已改为复用这些 API，后续管理台接入时不要复制草稿 JSON 解析和自动保存展示口径。
- `@meumall/lowcode-editor` 已沉淀框架无关 preview links API：`createLowcodePreviewLinkItem`、`createLowcodePreviewLinkItems` 和 `summarizeLowcodePreviewLinks`；Vue3 editor playground 的 H5 预览入口列表、ready/disabled 状态、打开/复制能力和交付入口摘要已改为复用这些 API，后续管理台接入时不要复制预览入口展示模型。
- `@meumall/lowcode-editor` 已沉淀框架无关 workspace summary API：`createLowcodeWorkspaceStats`；Vue3 editor playground 的顶部节点数、当前选中、校验、发布和保存状态摘要已改为复用该 API，后续管理台接入时不要复制状态条文案和 tone 口径。
- Vue3 编辑器 playground 已支持 Page Schema 文件导入导出：工具栏、源码区和快捷命令均可导出当前 schema JSON；导入本地 JSON 时复用 editor schema file API 解析并校验，非法 JSON 或非法 schema 会展示错误且不覆盖当前画布，合法 schema 会替换画布并进入可继续编辑、预览和保存的草稿状态。
- Vue3 编辑器 playground 已支持物料收藏与最近使用：左侧物料区可以星标收藏物料，添加物料后会记录最近使用；两类偏好均按 `componentName` 写入 localStorage，组件名解析、去重、未知物料过滤、最近使用数量限制和收藏提示文案已复用 editor material preference API，后续迁管理台时可替换为用户偏好接口。
- Vue3 编辑器 playground 已支持模板卡片摘要：左侧模板卡片展示版本、标签、节点数、数据源数和动作数，摘要从模板 schema 计算，后续 Java 模板市场可改为服务端返回。
- Vue3 编辑器 playground 已支持模板视觉缩略预览：左侧模板卡片和新建页面向导模板起点会从模板 schema 常见图片与文案字段派生缩略图、首屏标题、副标题和节点数标签；后续 Java 模板市场提供独立缩略图字段时可优先使用服务端字段。
- Vue3 编辑器 playground 已支持模板 H5 预览入口：左侧模板卡片拆分为应用主区域和独立预览按钮，点击预览会通过 React H5 runtime schema URL handoff 打开模板渲染效果，不替换当前画布。
- Vue3 编辑器 playground 已支持新建页面向导：顶部“新建”和快捷命令可打开向导，运营可以从空白 H5 页面或已有模板开始搭建；空白页使用 `createLowcodePageSchema` 生成本地草稿，模板起点复用 Template Library Client 和 `applyTemplate`。
- Vue3 编辑器 playground 已支持本地自定义模板：模板面板和快捷命令可把当前 Page Schema 保存为 localStorage 本地模板，本地模板会合并进模板列表、搜索筛选、卡片摘要、视觉缩略预览、新建页面向导、H5 模板预览和应用模板流程；后续接 Java 模板市场时替换为服务端模板写入和查询。
- Vue3 编辑器 playground 已支持空白画布起步引导：空白 H5 页面在手机画布内展示活动头图、图片 Banner、商品列表和优惠券区块快捷入口，点击后复用物料添加链路生成首个节点，并隐藏空白态。
- Vue3 编辑器 playground 已支持页面设置面板增强：右侧页面面板可编辑标题、描述、页面类型、背景色、安全区、H5 最大宽度、状态和发布环境，全部写回现有 Page Schema 字段并在源码模式同步展示。
- Vue3 编辑器 playground 已支持物料详情预览：左侧物料卡片可打开详情弹窗，弹窗复用 `LowcodeVueRenderer` 渲染该物料默认 H5 预览，并展示 manifest 基础信息、propsSchema 字段、事件和数据源槽位。
- React/Vue H5 物料包已新增 `LiveEntry` 直播入口，支持封面图、状态、标题、说明、观看人数、按钮、链接和 `onEnter` 事件；Vue3 编辑器大促模板、mock 直播素材、React H5 runtime 示例和 browser smoke check 已接入。
- React/Vue H5 物料包已新增 `ProductRankList` 商品榜单，支持榜单标题、说明、角标、排名样式、展示数量、`items` 商品数据槽和 `onProductClick` 事件；Vue3 编辑器大促模板、商品选择器、React H5 runtime 示例和 browser smoke check 已接入。
- React/Vue H5 物料包已新增 `BrandFeatureSection` 品牌专题，支持品牌名、标题、说明、角标、封面图、Logo、行动按钮、卖点列表、`items` 商品数据槽、`onEnter` 和 `onProductClick` 事件；Vue3 编辑器大促模板、商品选择器、React H5 runtime 示例和 browser smoke check 已接入。
- React/Vue H5 物料包已新增 `StickyActionBar` 底部转化条，支持标题、说明、主/副按钮、安全区、sticky 开关、跳转链接、`onPrimaryClick` 和 `onSecondaryClick` 事件；Vue3 编辑器大促模板、React H5 runtime 示例和 browser smoke check 已接入。
- React/Vue H5 物料包已新增 `SectionTitle` 区块标题，支持角标、标题、说明、对齐、背景色、标题色、说明色、强调色和上下留白；Vue3 编辑器大促模板、React H5 runtime 示例和 browser smoke check 已接入。
- React/Vue H5 物料包已新增 `ImageCardGrid` 图片卡片宫格，支持标题、说明、列数、间距、圆角、卡片数组、图片、角标和 `onItemClick`；Vue3 编辑器大促模板、React H5 runtime 示例、数组属性表单、列表项图片素材选择和 browser smoke check 已接入，后续可扩展 data source slot 接真实会场/频道数据。
- React/Vue H5 物料包已新增 `TabsBlock` 标签内容切换通用物料，支持标题、说明、颜色、圆角、静态标签数组、本地 tab 切换和内容说明展示，并已复用内部 `MlcTabs`；Vue3 编辑器大促模板、React H5 runtime 示例、属性面板数组编辑和 browser smoke check 已接入，当前不支持 tab 面板内嵌低代码节点。
- React/Vue H5 materials 内部 primitives 已新增 `MlcOverlay` 和 `MlcModal`，`ActivityRuleModal` 已改造为复用 `MlcModal`；当前不新增公开 npm primitives 包，不改变 `ActivityRuleModal` manifest 和旧 schema 语义。
- React/Vue H5 materials 内部 primitives 已新增 `MlcCountdownText`，`CountdownTimer` 已改造为复用该 primitive；当前不实现真实 tick、服务端时间校准或活动结束状态，也不改变 `CountdownTimer` manifest 和旧 schema 语义。
- React/Vue H5 materials 内部 primitives 已新增 `MlcTabs`，`TabsBlock` 已改造为复用该 primitive；当前不实现 tab 面板内嵌低代码节点，也不改变 `TabsBlock` manifest 和旧 schema 语义。
- React/Vue H5 materials 内部 primitives 已新增 `MlcSpacer`，`SpacerBlock` 已改造为复用该 primitive；当前不扩展复杂布局容器、分割线或响应式规则，也不改变 `SpacerBlock` manifest 和旧 schema 语义。
- React/Vue H5 物料包已新增 `LeadFormBlock` 留资表单通用物料，复用内部 `MlcInput`、`MlcTextarea`、`MlcSwitch`、`MlcStepper`、`MlcButton` 和 `MlcText` primitives，支持姓名、手机号、人数、备注、协议开关、提交按钮和 `onSubmit` 安全 action；当前只做本地运行时交互，不接真实表单提交接口。
- 根目录已提供 `pnpm smoke:browser`，通过零依赖 Node 脚本启动 editor playground、H5 runtime playground 和本机 Chrome headless，检查 Vue3 编辑器 shell、编辑器内置 runtime 和 React H5 runtime 的关键 DOM、核心文案与物料节点渲染；同时会验证 H5 画布视口预设切换、区块标题物料、图片卡片宫格物料、留资表单物料、活动规则弹窗打开/关闭、交付分享清单、本地版本备注/筛选/差异对比、React H5 runtime 诊断面板、pageId published 命中、releaseId preview 命中、missing pageId fallback、empty demo 空态、broken demo 未知物料和渲染异常局部兜底、列表项图片素材选择、页面设置写入 schema、物料详情默认 H5 预览和一键添加，搜索 `商品专题页` 模板，检查模板视觉缩略预览、本地自定义模板保存、模板 H5 预览入口不会替换当前画布、应用模板、`通勤好物专题` 画布更新、源码 schema 包含 `product-topic-demo`、源码/预览/设计模式切换，以及新建页面向导中的空白 H5 页面、空白画布快捷起步、本地模板、模板缩略预览和模板起点。
- 根目录已提供 `pnpm smoke:visual`，通过零依赖 Node 脚本启动 editor playground、H5 runtime playground 和本机 Chrome headless，截取 Vue3 编辑器 playground、React H5 runtime `?pageId=summer-campaign-demo` published 入口、React H5 runtime `?releaseId=preview_demo` preview 入口，并写入 `.ai/test-reports/latest-visual/index.md` 本地报告。该命令是协作可见性护栏，不改变 Page Schema、包边界、materials 分层或 npm 公开 API；生成报告和截图不进入 Git 历史。
- 未来小程序复用 schema/core，新增小程序 renderer/materials。
- 新增业务物料前必须先按 `docs/material-layering-architecture.md` 判断：是否能通过通用物料和模板解决，是否需要新增业务无关 primitives，是否应该落在 Generic Materials 还是 Business Materials。

## 当前协作约定

- 中文为主要协作语言。
- 正式任务先建或读取 `.ai-workspace/tasks/`。
- 重要事实写入仓库，不依赖聊天记忆。
- schema、包边界、发布流程和外部系统对接变化必须更新文档。

## 外部参考

- 已阅读掘金小册并生成原创读书笔记：`/Users/mac/Documents/掘金小册/从零开发H5可视化搭建项目-原创读书笔记与MeuMall落地方案.md`
- 已分析 `buqiyuan/vite-vue3-lowcode`，结论是可借鉴编辑器交互和 schema 思路，但本项目采用可发布 npm 包的 monorepo 架构。
