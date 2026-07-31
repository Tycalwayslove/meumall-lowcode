# Project State

## 当前状态

MeuMall Lowcode 已完成第一版 monorepo 骨架、AI 协作体系、GitHub 远端推送、schema/editor 第一批基础代码、Vue3 编辑器 playground 初版、本地 mock 发布预览链路、React H5 与 Vue H5 基础物料对齐、独立 React H5 runtime playground、React H5 runtime 本地 pageId/releaseId 加载、React H5 runtime 诊断面板和空态演示、编辑器到 React H5 runtime 的 schema URL handoff、基础电商物料库扩展、编辑器页面模板库、schema/core/adapters 基础单元测试体系、浏览器级 smoke check、data source resolver、action 安全执行闭环、高阶活动物料、Java 配置平台 API 草案、配置平台客户端抽象、H5 runtime 集成契约、Page Schema v1 ready 契约、Material Manifest v1 契约、runtime schema loader、Resource Library Client、Template Library Client 和 npm pack dry-run 发布预检，并增强 Vue3 编辑器 mock 素材库、商品选择器、优惠券选择器、门店/达人选择器、新建页面向导、空白画布起步引导、页面设置面板、模板搜索筛选、模板卡片摘要、模板视觉缩略预览、模板 H5 预览入口、交付分享清单、本地自定义模板、Schema 文件导入导出、物料搜索过滤、物料详情预览、物料收藏与最近使用、快捷命令面板、节点右键菜单、节点键盘快捷键、节点命名、本地自动保存和恢复提示、结构树搜索折叠与画布定位、画布工作区状态摘要、当前节点信息卡、属性面板分组折叠、画布拖拽物料插入线、已有节点画布拖拽移动、触屏 Pointer Events 画布拖拽、画布吸附线、同父级多选拖拽、发布前检查清单和节点定位、H5 预览入口、本地版本备注/筛选/差异详情/回滚、活动规则弹窗物料、楼层锚点导航、布尔开关属性编辑、区块标题物料、图片卡片宫格物料、留资表单物料、组合券包物料、门店/达人推荐物料、直播入口物料、商品榜单物料、品牌专题物料、底部转化条物料、数组属性列表编辑器、列表项拖拽排序和列表项图片素材选择，并已沉淀基础组件、通用物料和业务物料分层架构，且在 React/Vue materials 包内部建立 runtime primitives 原型并推进到主要活动、导航、优惠券、表单和业务物料复用。

## 当前维护范围

- `packages/schema`
- `packages/core`
- `packages/renderer-h5`
- `packages/materials-h5`
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
- npm pack dry-run 发布预检：根级 `pnpm pack:dry-run` 会自动发现 8 个可发布包，逐包执行 `npm pack --dry-run --json`，并校验实际包内容包含 `package.json`、`README.md`、`dist/index.js` 和 `dist/index.d.ts`。
- Changesets 基础配置。
- GitHub Actions CI 基础配置。
- H5 renderer 初始实现。
- H5 materials 初始实现，已包含容器、公告条、区块标题、图片卡片宫格、留资表单、活动头图、图片 Banner、行动按钮、底部转化条、商品列表、商品榜单、品牌专题、门店/达人推荐、直播入口、优惠券区块、组合券包、活动规则弹窗、间距块、倒计时、导航宫格、楼层锚点、秒杀商品组和富文本。
- 低代码版 AI 工作流迁移。
- GitHub 远端 `git@github.com:Tycalwayslove/meumall-lowcode.git` 已配置并推送 `main`。
- Page Schema v1 ready 契约：`.ai-workspace/contracts/page-schema-v1.md` 已定义字段语义、生命周期、校验规则、兼容性、安全要求、变更流程和回滚方式。
- Page Schema v1 基础类型、标准化、递归校验、默认值校验、枚举边界校验和 manifest 校验。
- Editor headless command：模式、视口、选择、插入、更新、复制、移动、删除、undo/redo。
- Vue H5 renderer 初始实现。
- Vue H5 基础物料：容器、公告条、区块标题、图片卡片宫格、留资表单、活动头图、图片 Banner、行动按钮、底部转化条、商品列表、商品榜单、品牌专题、门店/达人推荐、直播入口、优惠券区块、组合券包、活动规则弹窗、间距块、倒计时、导航宫格、楼层锚点、秒杀商品组、富文本。
- Vue3 编辑器 playground：物料添加、拖到画布、节点选择、属性编辑、JSON 查看/应用、本地保存、撤销/重做和 H5 预览。
- Vue3 编辑器交互增强：画布节点点击选中、高亮、根节点拖拽排序、页面状态/环境配置和数据源面板。
- Vue3 编辑器实操增强：容器物料、嵌套结构展示、向容器添加子物料、素材/商品快捷选择和 mock 数据源预览绑定。
- Vue3 编辑器发布链路 mock：保存草稿、生成预览、发布页面、本地版本列表和独立 H5 runtime 入口。
- Vue3 编辑器画布上下文操作：选中节点后可前后插入物料、向容器加入物料、同级上移/下移、复制和删除。
- React H5 runtime playground：独立消费 React H5 renderer/materials/core/schema，验证基础物料、容器嵌套、dataBinding、运行诊断面板、本地 `LowcodeConfigPlatformClient` pageId published 加载、releaseId preview 加载、missing pageId fallback 和 `?demo=empty` 空页面安全空态。
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
- 基础单元测试：根目录提供 `pnpm test`，覆盖 schema、core 和 adapters 公开 API 基础回归。
- Browser smoke check：根目录提供 `pnpm smoke:browser`，脚本会启动 editor playground、H5 runtime playground 和本机 Chrome headless，检查 Vue3 编辑器 shell、编辑器内置 runtime 和 React H5 runtime 的关键 DOM、核心文案与物料节点渲染；同时覆盖区块标题物料、图片卡片宫格物料、页面设置、物料详情预览、模板搜索、模板视觉缩略预览、本地自定义模板、模板 H5 预览、本地版本备注/筛选/差异对比、React H5 runtime 诊断面板、pageId published 命中、releaseId preview 命中、missing pageId fallback、empty demo 空态、应用 `商品专题页`、新建页面向导、空白 H5 页面、空白画布快捷起步、源码/预览/设计模式切换和 schema 草稿同步。
- Data source resolver：`@meumall/lowcode-adapters` 提供通用数据源解析，编辑器预览和 React H5 runtime 可按 schema.dataSources 生成 renderer data，并展示逐数据源诊断状态。
- Safe action executor：`@meumall/lowcode-adapters` 提供安全 action registry/executor，编辑器可维护 actions 并绑定物料事件，Vue 预览和 React H5 runtime 可执行白名单动作。
- 高阶活动物料：React/Vue H5 物料包已新增 `CountdownTimer`、`NavGrid`、`FloorAnchorNav`、`FlashSaleList`、`ProductRankList`、`BrandFeatureSection`、`StickyActionBar`、`ActivityRuleModal`、`CouponBundle`、`StoreExpertSection`、`LiveEntry`，大促模板和 React H5 runtime 示例已使用新增物料。
- Java 配置平台 API 草案：`.ai-workspace/contracts/java-config-platform-api-v1.md` 已定义草稿、预览、发布、release 查询、draft 查询和 active published schema 查询接口。
- Material Manifest v1 契约：`.ai-workspace/contracts/material-manifest-v1.md` 已定义物料 manifest 的字段语义、兼容性、编辑器/renderer/Java/H5 消费规则、测试方式、变更流程和回滚方式。
- Config platform client：`@meumall/lowcode-adapters` 提供 `LowcodeConfigPlatformClient` 和 `createHttpConfigPlatformClient`，编辑器本地 mock 已实现同一 client 接口。
- H5 runtime 集成契约：`.ai-workspace/contracts/h5-runtime-integration-v1.md` 已定义 `hybird-meumall` npm 依赖、推荐路由、schema 获取优先级、数据源、action、降级、监控和 smoke check。
- Runtime schema loader：`@meumall/lowcode-adapters` 提供 `loadLowcodeRuntimeSchema`，统一支持 encoded schema、releaseId、pageId 和 fallback schema；React H5 runtime playground 已切换为同一 loader。
- Resource Library Client：`@meumall/lowcode-adapters` 提供 `LowcodeResourceLibraryClient` 和 `createStaticResourceLibraryClient`，覆盖图片素材、商品、优惠券、门店/达人资源查询，为后续替换真实资源中心 HTTP client 预留边界。
- Vue3 编辑器资源选择器：右侧属性区已提供 mock 素材库、商品选择器、优惠券选择器和门店/达人选择器，支持搜索、分类、多选、静态 props 写回，并支持商品恢复绑定 `products` 数据源、门店/达人恢复绑定 `stores` 数据源。
- Vue3 编辑器画布拖拽：从物料区拖到画布节点时可显示前/后插入线，拖到 `SectionContainer` 中间区域可显示容器投放高亮，拖到空白区域可追加到页面末尾。
- Vue3 编辑器已有节点拖拽：设计模式下画布节点可直接拖动，支持移动到目标节点前/后、移动进 `SectionContainer`、移动到根节点末尾，并规避拖到自己或自己后代。
- Vue3 编辑器触屏拖拽：物料面板、结构树节点和 H5 画布节点已支持触屏/手写笔 Pointer Events 拖拽，复用现有投放提示、容器投放、节点移动和点击抑制逻辑。
- Vue3 编辑器画布吸附线：拖到节点前/后时显示跨画布横向吸附线和目标中心纵向线，拖入容器时显示容器中心横向/纵向辅助线。
- Vue3 编辑器同父级多选拖拽：结构树支持勾选、Meta/Ctrl/Shift 点击多选；同父级选区可从结构树或 H5 画布成组拖到目标前/后、容器末尾或页面末尾。
- Vue H5 renderer 编辑态拖拽回调：`LowcodeVueRenderer` 新增可选 `nodeDraggable`、`onNodeDragStart` 和 `onNodeDragEnd`，生产渲染默认不受影响。
- Vue3 编辑器发布检查：右侧面板已展示 schema、节点、图片、商品、数据源和动作 readiness；生成预览和发布会拦截 error，保存草稿不拦截。
- Vue3 编辑器发布检查定位：图片字段缺失、商品组件无商品/无数据源、数据源解析失败、事件引用缺失和动作参数缺失等节点级检查项可一键定位到对应节点，并自动切回设计模式、选中节点、展开结构树路径和滚动画布。
- Vue3 编辑器 H5 预览入口：右侧发布区域已集中展示当前草稿 React H5、页面草稿/最新版本内置 H5、最近发布版本 H5 的打开和复制入口，运营可直接复制链接给验收方。
- Vue3 编辑器交付分享清单：右侧发布区域已集中展示页面标题、pageId、节点数、数据源数、动作数、Schema JSON 体积、发布检查状态、H5 交付入口状态，并可复制当前 Page Schema JSON 或导出 Schema 文件。
- Vue3 编辑器 Schema 文件导入导出：工具栏、源码区和快捷命令均可导出当前 Page Schema JSON；可从本地 JSON 文件导入合法 schema 并替换当前画布，非法 JSON 或非法 schema 会展示错误且不覆盖当前页面。
- Vue3 编辑器本地版本管理：保存草稿、生成预览和发布页面时可填写本地 release 备注，版本列表支持按标题、版本号、类型和备注关键词筛选；本地版本列表支持选择对比，展示标题、状态、环境、页面版本、节点数、数据源数和动作数的当前草稿/所选版本差异、变更状态，以及当前草稿和所选版本的 schema JSON 片段预览，并支持将所选版本作为新的 published release 回滚发布。
- 活动规则弹窗物料：React/Vue H5 物料包已新增 `ActivityRuleModal`，支持规则入口、弹窗展示、规则列表和 `onOpen` 事件；大促模板、新人券模板和 React H5 runtime 示例已接入。
- 楼层锚点导航：React/Vue H5 renderer 已为 schema 节点输出 `data-lowcode-node-id`，React/Vue H5 物料包新增 `FloorAnchorNav`，支持吸顶、横向滚动锚点、点击滚动到目标节点和 `onAnchorClick` 事件。
- 区块标题物料：React/Vue H5 物料包已新增 `SectionTitle`，支持角标、标题、说明、对齐、背景色、标题色、说明色、强调色和上下留白；默认大促模板、React H5 runtime 示例和 browser smoke check 已接入。
- 图片卡片宫格物料：React/Vue H5 物料包已新增 `ImageCardGrid`，支持标题、说明、列数、间距、圆角、卡片数组、图片、角标和 `onItemClick`；默认大促模板、React H5 runtime 示例、Vue3 编辑器数组属性表单和 browser smoke check 已接入。
- 留资表单物料：React/Vue H5 物料包已新增 `LeadFormBlock` 通用物料，支持姓名、手机号、人数步进、备注、协议开关、提交按钮和 `onSubmit` 安全 action；Vue3 编辑器可添加并在 Vue H5 画布渲染，React H5 runtime 示例和 browser smoke check 已接入。
- Vue3 编辑器布尔属性编辑：属性面板已将 `switch` setter 和 `boolean` 类型字段渲染为开关控件，写入真实 boolean，并兼容旧草稿中的 `"false"`、`"0"`、`"off"` 字符串。
- 组合券包物料：React/Vue H5 物料包已新增 `CouponBundle`，支持多券展示、一键领取、单券领取和 `onReceive/onReceiveAll` 事件；大促模板和 React H5 runtime 示例已接入。
- 门店/达人推荐物料：React/Vue H5 物料包已新增 `StoreExpertSection`，支持门店/达人混合推荐、多项展示、静态列表配置、预留 `items` data source slot 和 `onItemClick` 事件；大促模板和 React H5 runtime 示例已接入。
- 直播入口物料：React/Vue H5 物料包已新增 `LiveEntry`，支持直播封面、状态、标题、说明、观看人数、按钮、链接和 `onEnter` 事件；大促模板、Vue3 编辑器素材库、React H5 runtime 示例和 browser smoke check 已接入。
- 商品榜单物料：React/Vue H5 物料包已新增 `ProductRankList`，支持榜单标题、说明、角标、排名样式、展示数量、`items` 商品数据槽和 `onProductClick` 事件；Vue3 编辑器商品选择器、大促模板、React H5 runtime 示例和 browser smoke check 已接入。
- 品牌专题物料：React/Vue H5 物料包已新增 `BrandFeatureSection`，支持品牌名、标题、说明、角标、封面图、Logo、行动按钮、卖点列表、`items` 商品数据槽、`onEnter/onProductClick` 事件；Vue3 编辑器商品选择器、大促模板、React H5 runtime 示例和 browser smoke check 已接入。
- 底部转化条物料：React/Vue H5 物料包已新增 `StickyActionBar`，支持标题、说明、主/副按钮、安全区、sticky 开关、跳转链接和 `onPrimaryClick/onSecondaryClick` 事件；大促模板、React H5 runtime 示例和 browser smoke check 已接入。
- Vue3 编辑器数组属性编辑：属性面板已为 `array` + `textarea` 字段提供列表项编辑器，支持新增、删除、复制、上移、下移、常见字段表单输入和图片字段素材库选择，并保留 JSON 高级编辑兜底。
- Vue3 编辑器数组列表排序：属性面板列表项已支持同一数组属性内 HTML5 拖拽排序，拖拽后写回当前节点 props 数组，并提供拖拽中和目标项视觉状态。
- Vue3 编辑器列表项图片素材选择：数组列表项中的 `imageUrl`、`coverImageUrl` 和 `logoImageUrl` 类字段会展示缩略图、保留 URL 输入，并可展开内联素材库选择图片后写回当前列表项字段；browser smoke 已覆盖 `ImageCardGrid.items[].imageUrl` 选择素材和缩略图写回。
- 基础组件与物料分层架构：`docs/material-layering-architecture.md` 已定义 Design Tokens、Runtime Primitives、Generic Materials、Business Materials 的边界、依赖方向、首批组件清单、分阶段演进计划和新增物料检查清单；当前结论是先在 materials 包内部做 primitives 原型，API 稳定后再抽独立 npm 包。
- 内部 runtime primitives 原型：React/Vue H5 materials 包内已新增 `MlcButton`、`MlcImage`、`MlcTag`、`MlcText`、`MlcPrice`、`MlcInput`、`MlcTextarea`、`MlcSwitch`、`MlcStepper` 和 `h5Tokens`，并改造 `ActionButton`、`ImageBanner`、`SectionTitle`、`StickyActionBar`、`CouponBundle`、`ProductRankList`、`BrandFeatureSection`、`LiveEntry`、`StoreExpertSection`、`FlashSaleList`、`ActivityRuleModal`、`CouponSection`、`NavGrid`、`FloorAnchorNav`、`CountdownTimer`，新增 `LeadFormBlock` 复用 primitives；primitives 不进入 material registry，仍不作为公开 npm 包 API。
- Vue3 编辑器体验首轮优化：左侧物料区支持关键词搜索和分类过滤，画布顶部展示节点数、当前选中、校验/发布/保存状态，右侧当前节点卡片展示节点 id、父级和层级位置，并补充按钮、输入框、列表和画布工具栏的 hover/focus/active 反馈与响应式兜底。
- Vue3 编辑器物料偏好：左侧物料区已支持星标收藏和最近使用，均以 `componentName` 写入 localStorage；收藏和最近使用物料可在顶部快捷区一键添加。
- Vue3 编辑器属性面板分组：右侧 props 已按内容配置、样式配置、数据配置、行为配置和其他配置分组展示，支持折叠/展开，并修复新 profile 首次打开默认选中旧节点导致属性区为空的问题。
- Vue3 编辑器快捷命令面板：顶部命令入口和 `Meta/Ctrl + K` 可打开全局命令面板，支持搜索并执行模式切换、草稿保存、预览/发布、打开 H5/React H5、清空画布、添加物料和应用模板。
- Vue3 编辑器节点快捷操作：H5 画布节点和结构树节点支持右键打开操作菜单，画布上下文工具条提供更多操作入口，并支持 Delete/Backspace 删除、Ctrl/Meta+C 复制、Ctrl/Meta+V 粘贴、Ctrl/Meta+D 创建副本、Ctrl/Meta+Z 撤销和 Ctrl/Meta+Shift+Z 或 Ctrl+Y 重做。
- Vue3 编辑器结构树导航：左侧结构树支持搜索节点、折叠/展开容器、搜索命中路径展示和点击节点滚动定位到 H5 画布对应节点；当前选中节点会保持在结构树可见路径内。
- Vue3 编辑器节点命名：结构树、右键菜单和右侧当前节点信息卡支持给节点设置运营可读名称，写入已有 `node.meta.name`，搜索可命中新名称，清空名称时回退物料标题。
- Vue3 编辑器本地自动保存：schema 变更后会延迟写入 localStorage 草稿，顶栏展示自动保存和恢复状态；从 localStorage 成功读取草稿时显示“已恢复本地草稿”，browser smoke 已验证重命名后自动保存到 localStorage。

## 已知缺口

- 尚未实现完整生产级编辑器 UI；当前已具备新建页面向导、空白画布起步引导、页面设置面板、模板搜索筛选、模板卡片摘要、模板视觉缩略预览、模板 H5 预览入口、交付分享清单、本地自定义模板、Schema 文件导入导出、本地版本备注/筛选/差异详情、物料搜索过滤、物料详情预览、物料收藏与最近使用、节点命名、本地自动保存和恢复提示、结构树搜索折叠与画布定位、发布检查节点定位、H5 预览入口、工作区状态摘要、属性分组折叠、节点右键菜单、节点键盘快捷键、mock 素材/商品/优惠券/门店/达人选择器、数组属性列表编辑器和列表项拖拽排序，但还不是正式管理台组件。
- 内部 runtime primitives 原型已覆盖现有主要 React/Vue H5 物料，并补齐 `Input`、`Textarea`、`Switch`、`Stepper` 表单 primitives；`ProductList`、`ActivityHero`、`SectionContainer`、`NoticeBar`、`RichTextBlock`、`SpacerBlock` 等历史或简单物料仍可按真实复用收益继续整理，`CountdownText`、`Overlay`、`Modal`、`Tabs` 等后续 primitives 尚未建立；primitives 仍不是公开 npm API。
- 数据源面板和 React H5 runtime 已执行 mock resolver，尚未接入真实 HTTP 请求、鉴权、缓存和 Java 代理。
- 画布拖拽已支持新物料投放、已有节点移动、触屏 Pointer Events 拖拽、吸附线、同父级多选成组拖拽和数组列表项排序；跨父级多选拖拽仍需后续单独设计。
- Page Schema v1 已沉淀为 ready 契约，但 Java 配置平台确认后可能需要补充更严格的服务端发布校验、审批和审计字段。
- Material Manifest v1 已沉淀为 ready 契约，但 Java 配置平台确认后可能需要补充更严格的服务端校验字段。
- Java 配置平台 API 仍为前端草案，待 Java 配置平台负责人确认响应包装、鉴权、审批、服务端发布校验、版本 diff、回滚审计和分页。
- 当前发布链路和自动保存已抽象出部分本地持久化状态，但仍使用 localStorage mock，尚未切换真实 Java HTTP client 或服务端草稿自动保存。
- 当前 React H5 handoff 使用 URL schema 参数，React H5 runtime playground 已通过本地 client 跑通 pageId/releaseId 加载并展示 fallback 诊断和 empty demo 空态；正式预览仍需 Java 配置平台 previewId/pageId 与真实 HTTP client。
- Action handler 仍是 playground mock，尚未对接真实跳转桥、领券接口、埋点平台、权限和风控。
- 高阶活动物料仍使用静态倒计时、静态规则、静态楼层配置、静态券包、静态门店/达人推荐、静态直播入口、静态商品榜单、静态品牌专题、静态底部转化条和 mock 商品数据，尚未对接真实活动、库存、价格、排行口径、品牌中心、规则中心、楼层配置中心、优惠券中心、门店中心、达人中心和直播中心。
- 素材库、商品选择器、优惠券选择器、门店/达人选择器和模板列表已通过对应 client 解耦，本地自定义模板仍是 localStorage 原型；列表项编辑器仍使用通用字段模板，尚未接入真实素材中心、商品中心、优惠券中心、门店/达人中心、模板市场、权限、分页、上下架和审核。
- 尚未在 `hybird-meumall` 真实业务仓库创建低代码路由并接入 npm 包。
- 尚未配置 npm registry/token；当前已具备本地 `pnpm pack:dry-run` 包内容预检，但真实发布仍需确认 registry、access、token 和 changeset 版本。
- 已建立浏览器级 smoke check，并覆盖基础挂载、模板应用和模式切换；但组件级 DOM 测试、拖拽/属性编辑/发布等更完整浏览器交互 E2E 和 visual regression 尚未建立。

## 最近变更

| 日期 | 提交 | 说明 |
| --- | --- | --- |
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

## 默认验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm pack:dry-run
pnpm smoke:browser
pnpm dev
```
