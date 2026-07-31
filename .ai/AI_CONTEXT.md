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
- `@meumall/lowcode-adapters` 已提供 `createSafeActionRegistry` 和 `createSafeActionExecutor`，编辑器 playground 可维护 schema.actions 并把物料事件绑定到 action；Vue 预览和 React H5 runtime 通过白名单 handler 执行 mock navigate、coupon.receive、tracking.click 和 noop。
- React/Vue H5 物料包已包含基础物料和高阶活动物料：`CountdownTimer`、`NavGrid`、`FloorAnchorNav`、`FlashSaleList`、`ProductRankList`、`BrandFeatureSection`、`StickyActionBar`、`ActivityRuleModal`、`CouponBundle`、`StoreExpertSection`、`LiveEntry`；大促模板、新人券模板和 React H5 runtime 示例已使用这些物料。
- `Material Manifest v1` 契约已写入 `.ai-workspace/contracts/material-manifest-v1.md`，定义物料字段语义、兼容性、编辑器/renderer/Java/H5 消费规则和变更流程。
- React/Vue H5 renderer 已为 schema 节点输出 `data-lowcode-node-id`，楼层锚点物料可按目标节点 id 滚动定位。
- Java 配置平台 API 草案已写入 `.ai-workspace/contracts/java-config-platform-api-v1.md`，`@meumall/lowcode-adapters` 已提供 `LowcodeConfigPlatformClient` 与 `createHttpConfigPlatformClient`，编辑器本地 mock 发布链路已实现同一 client 接口。
- H5 runtime 集成清单已写入 `.ai-workspace/contracts/h5-runtime-integration-v1.md`，`docs/meumall-integration.md` 是面向 `hybird-meumall` 接入的简版说明。
- `@meumall/lowcode-adapters` 已提供 `loadLowcodeRuntimeSchema`，统一按 `encodedSchema -> releaseId -> pageId -> fallbackSchema` 获取运行时 schema；React H5 runtime playground 已改为使用该 loader。
- `@meumall/lowcode-adapters` 已提供 `LowcodeResourceLibraryClient` 和 `createStaticResourceLibraryClient`，Vue3 编辑器 playground 右侧素材库、商品选择器、优惠券选择器和门店/达人选择器已通过 resource client 查询数据；后续接真实素材中心、商品中心、优惠券中心、门店/达人中心时优先替换 client，不改 UI 内部查询逻辑。
- `@meumall/lowcode-adapters` 已提供 `LowcodeTemplateLibraryClient` 和 `createStaticTemplateLibraryClient`，Vue3 编辑器 playground 左侧模板列表已通过 template client 查询，支持搜索、分类过滤、加载态和空状态；后续接 Java 模板市场时优先替换 client，不改 UI 内部查询逻辑。
- Vue3 编辑器 playground 右侧属性区已提供资源选择器：图片类节点可搜索/分类选择图片，`ProductList`/`ProductRankList`/`BrandFeatureSection`/`FlashSaleList` 可搜索多选商品并写入静态 `props.items` 或重新绑定 `products` 数据源，`CouponBundle` 可多选优惠券写入 `props.coupons`，`CouponSection` 可选择单张优惠券写入主券文案，`StoreExpertSection` 可多选门店/达人写入 `props.items` 或重新绑定 `stores` 数据源。
- Vue3 编辑器 playground 画布已支持物料拖拽插入线：拖到节点上半区插入前方，下半区插入后方，拖到 `SectionContainer` 中间区域加入容器，拖到空白区域追加页面末尾。
- Vue3 编辑器 playground 画布已支持已有节点拖拽移动：设计模式下节点 wrapper 可拖动，支持移动到目标前后、移入 `SectionContainer`、移动到根节点末尾，并规避拖到自己或自己后代。
- Vue3 编辑器 playground 已补充触屏/手写笔 Pointer Events 拖拽：物料面板、结构树节点和 H5 画布节点都可通过 pointer 移动超过阈值后复用现有 drop hint 完成投放或移动；拖拽完成后会抑制紧随其后的 click，避免额外追加物料。
- Vue3 编辑器 playground 已补充画布吸附线：`canvasDropHint.guides` 会在节点前/后投放时显示跨画布横向吸附线和目标中心纵向线，在容器内投放时显示容器中心横向/纵向辅助线。
- Vue3 编辑器 playground 已补充同父级多选拖拽：结构树可通过勾选、Meta/Ctrl/Shift 点击多选；同父级选区拖动已选节点时会作为一组移动，跨父级选区回退为单节点移动。
- `@meumall/lowcode-renderer-vue-h5` 的 editable wrapper 已提供可选 `nodeDraggable`、`onNodeDragStart`、`onNodeDragEnd`，供编辑器 shell 编排拖拽，不影响默认生产渲染。
- Vue3 编辑器 playground 右侧面板已提供发布检查清单，覆盖 schema、节点、图片、商品、数据源和动作；生成预览和发布会拦截 error 检查项，保存草稿不拦截。
- Vue3 编辑器 playground 本地版本列表已支持选择版本对比，摘要展示标题、状态、环境、页面版本、节点数、数据源数和动作数差异，并可将选中版本作为新的 published release 回滚发布。
- Vue3 编辑器 playground 属性面板已支持 `switch` setter 和 `boolean` 类型字段的开关控件，写入真实 boolean，并兼容旧草稿中的 `"false"`、`"0"`、`"off"` 字符串。
- Vue3 编辑器 playground 属性面板已支持 `array` + `textarea` 字段的列表项编辑器，覆盖优惠券、规则、导航项、楼层锚点、门店/达人推荐等常见数组配置，并保留 JSON 高级编辑兜底。
- Vue3 编辑器 playground 数组属性列表项已支持同一属性内 HTML5 拖拽排序，并保留上移、下移、复制、删除和 JSON 高级编辑。
- Vue3 编辑器 playground 已完成体验首轮优化：左侧物料区支持关键词搜索和分类过滤，画布顶部展示节点数、当前选中、校验/发布/保存状态，右侧当前节点卡片展示节点 id、父级和层级位置，编辑器 shell 补充按钮、输入框、列表和画布工具栏的 hover/focus/active 反馈与窄屏兜底。
- Vue3 编辑器 playground 属性面板已支持分组折叠：当前物料 props 会按内容配置、样式配置、数据配置、行为配置和其他配置分组展示，组内显示字段数量并可折叠/展开；新 profile 首次打开会默认选中当前 schema 的首个节点，避免属性区为空。
- Vue3 编辑器 playground 已支持快捷命令面板：顶部“命令”入口和 `Meta/Ctrl + K` 可打开全局命令面板，支持搜索执行模式切换、保存草稿、生成预览、发布页面、打开 H5/React H5、清空画布、添加物料和应用模板。
- Vue3 编辑器 playground 已支持节点快捷操作：H5 画布节点和左侧结构树节点可右键打开操作菜单，画布上下文工具条有“更多”入口；全局快捷键支持 Delete/Backspace 删除、Ctrl/Meta+C 复制、Ctrl/Meta+V 粘贴、Ctrl/Meta+D 创建副本、Ctrl/Meta+Z 撤销、Ctrl/Meta+Shift+Z 或 Ctrl+Y 重做，并会避开输入框、textarea、select、contenteditable 和命令面板输入。
- Vue3 编辑器 playground 已支持结构树导航增强：左侧结构树可按物料标题、组件名、节点 id 和 meta name 搜索，容器节点可折叠/展开；搜索会展示命中节点及其祖先路径，点击结构树节点会选中并滚动 H5 画布到对应节点。
- Vue3 编辑器 playground 已支持节点命名：结构树主标题展示 `node.meta.name` 或物料标题，右侧当前节点信息卡可编辑节点名称，节点右键菜单可进入结构树内联重命名；重命名复用已有 `meta.name`，可被结构树搜索命中。
- Vue3 编辑器 playground 已支持本地自动保存和恢复提示：schema 变更后延迟 700ms 写入 localStorage 草稿，顶栏展示自动保存状态；从 localStorage 恢复草稿时显示“已恢复本地草稿”。这仍是本地 mock，后续接 Java 配置平台时应替换为服务端草稿自动保存。
- Vue3 编辑器 playground 已支持发布检查节点定位：节点级图片、商品、数据源和动作配置问题会在右侧发布检查中展示“定位”入口，点击后自动切回设计模式、选中节点、展开结构树路径并滚动画布到目标节点。
- React/Vue H5 物料包已新增 `LiveEntry` 直播入口，支持封面图、状态、标题、说明、观看人数、按钮、链接和 `onEnter` 事件；Vue3 编辑器大促模板、mock 直播素材、React H5 runtime 示例和 browser smoke check 已接入。
- React/Vue H5 物料包已新增 `ProductRankList` 商品榜单，支持榜单标题、说明、角标、排名样式、展示数量、`items` 商品数据槽和 `onProductClick` 事件；Vue3 编辑器大促模板、商品选择器、React H5 runtime 示例和 browser smoke check 已接入。
- React/Vue H5 物料包已新增 `BrandFeatureSection` 品牌专题，支持品牌名、标题、说明、角标、封面图、Logo、行动按钮、卖点列表、`items` 商品数据槽、`onEnter` 和 `onProductClick` 事件；Vue3 编辑器大促模板、商品选择器、React H5 runtime 示例和 browser smoke check 已接入。
- React/Vue H5 物料包已新增 `StickyActionBar` 底部转化条，支持标题、说明、主/副按钮、安全区、sticky 开关、跳转链接、`onPrimaryClick` 和 `onSecondaryClick` 事件；Vue3 编辑器大促模板、React H5 runtime 示例和 browser smoke check 已接入。
- 根目录已提供 `pnpm smoke:browser`，通过零依赖 Node 脚本启动 editor playground、H5 runtime playground 和本机 Chrome headless，检查 Vue3 编辑器 shell、编辑器内置 runtime 和 React H5 runtime 的关键 DOM、核心文案与物料节点渲染；同时会搜索并应用 `商品专题页` 模板，验证 `通勤好物专题` 画布更新、源码 schema 包含 `product-topic-demo`，以及源码/预览/设计模式切换。
- 未来小程序复用 schema/core，新增小程序 renderer/materials。

## 当前协作约定

- 中文为主要协作语言。
- 正式任务先建或读取 `.ai-workspace/tasks/`。
- 重要事实写入仓库，不依赖聊天记忆。
- schema、包边界、发布流程和外部系统对接变化必须更新文档。

## 外部参考

- 已阅读掘金小册并生成原创读书笔记：`/Users/mac/Documents/掘金小册/从零开发H5可视化搭建项目-原创读书笔记与MeuMall落地方案.md`
- 已分析 `buqiyuan/vite-vue3-lowcode`，结论是可借鉴编辑器交互和 schema 思路，但本项目采用可发布 npm 包的 monorepo 架构。
