# 物料分层架构

## 目标

MeuMall Lowcode 的物料体系先解决架构分层，再持续增加组件。后续新增业务组件前，必须先判断能力应该落在哪一层，避免把 Button、Input、Image、Tag、价格展示、点击态、loading 和 fallback 重复写进每个业务物料。

核心目标：

- 基础 UI 能力可复用。
- 通用物料不绑定具体业务。
- 业务物料只组合业务语义和业务数据。
- React H5、Vue H5 和未来小程序保持同一 schema 语义，但实现按端拆分。
- renderer/editor 不被 UI 组件库反向绑死。

## 分层模型

```text
Page Schema
  -> Material Manifest
    -> Business Materials
      -> Generic Materials
        -> Runtime Primitives
          -> Design Tokens

Renderer 只消费 Material Registry
Editor 只消费 Schema + Manifest
Java 配置平台只存储 Schema + Manifest 白名单
```

## 层级职责

### Design Tokens

Design Tokens 是框架无关的视觉变量。

适合放入：

- 颜色语义：主色、强调色、危险色、弱文本色、边框色。
- 字号阶梯：标题、正文、辅助文本。
- 间距阶梯：4、8、12、16、24 等。
- 圆角阶梯：4、8、12、999。
- 阴影、透明度、禁用态、触控最小高度。

不适合放入：

- 商品、优惠券、直播、门店、达人等业务概念。
- React/Vue 组件。
- CSS reset 或具体页面布局。

当前公开包名：

```text
@meumall/lowcode-design-tokens
```

当前已实现 `packages/design-tokens`，提供 H5 runtime primitives 共用的框架无关 token、tone 取色、颜色 tint 和 CSS 变量派生 helper。该包不依赖 schema/core/editor/renderer/materials，也不承载业务字段、物料 manifest 或 Page Schema 语义。

### Runtime Primitives

Runtime Primitives 是运行时基础组件，不是低代码物料，不声明 `componentName`，不出现在编辑器物料面板。

适合放入：

- `Button`
- `Input`
- `Image`
- `Tag`
- `Text`
- `Price`
- `IconSlot`
- `LoadingBlock`
- `EmptyBlock`
- `ErrorBlock`
- `NoticeBar`
- `RichText`

基础组件允许处理：

- 尺寸、圆角、色彩、禁用态、loading 态。
- 图片 fallback、alt、比例裁剪。
- 文本截断、基础排版。
- H5 touch target。
- 可访问性属性。

基础组件不允许处理：

- 低代码 schema。
- material manifest。
- data source。
- action binding。
- Java 配置平台 API。
- 业务字段，例如 `couponId`、`skuId`、`liveId`。

当前公开包名：

```text
@meumall/lowcode-primitives-react-h5
@meumall/lowcode-primitives-vue-h5
```

未来小程序端对应：

```text
@meumall/lowcode-primitives-miniapp
```

### Generic Materials

Generic Materials 是可被运营直接拖拽的通用物料。它们声明 manifest，并写入 Page Schema，但不绑定具体 MeuMall 业务接口。

适合放入：

- `SectionContainer`
- `GridContainer`
- `ActivityHero`
- `SectionTitle`
- `ImageBanner`
- `BasicButton`
- `BasicLink`
- `BasicInput`
- `BasicTextarea`
- `BasicSelect`
- `BasicRadioGroup`
- `BasicStepper`
- `BasicSwitch`
- `BasicCheckbox`
- `BasicText`
- `BasicPrice`
- `DividerBlock`
- `BasicImage`
- `BasicTag`
- `BasicCard`
- `BasicCarousel`
- `BasicVideo`
- `BasicModal`
- `BasicForm`
- `BasicList`
- `BasicAccordion`
- `NoticeBar`
- `ActionButton`
- `RichTextBlock`
- `SpacerBlock`
- `NavGrid`
- `ImageCardGrid`
- `TabsBlock`
- 复杂表单字段应优先复用 `BasicInput` 等基础输入物料，再通过 `BasicForm` 或后续独立表单协议组合。

`SectionContainer` 是当前编辑器默认识别的单列嵌套容器物料，负责运营分组、基础留白、子节点间距、边框和阴影等单列布局能力；其标题、说明和空态文案应复用 `MlcText` 这类文本 primitive。

`GridContainer` 是当前编辑器默认识别的网格嵌套容器物料，负责 2/3 列轻量网格布局，继续复用 Page Schema `children` 顺序流式排布子节点；它不引入命名 slot、单元格级投放、跨列合并、响应式断点或拖拽调列宽。后续更复杂布局仍应作为独立 layout/slot 协议任务设计，避免把复杂布局规则混入现有容器。

`ActivityHero` 是通用营销头图物料，负责首屏图片、标题、说明、背景、图片圆角、标题字号、留白和行高配置；它不承载活动库存、会场规则、倒计时、用户权益、CMS 审核或 Java 活动接口语义，这些能力应由后续业务物料、富文本、倒计时、数据源或宿主服务扩展。

`BasicCard` 是通用图文单卡片物料，负责组合图片、角标、标题、说明和行动按钮；它不承载商品、优惠券、直播或门店达人等业务模型，卡片列表能力应继续使用 `ImageCardGrid` 或后续单独设计。

`BasicCarousel` 是通用图片轮播物料，负责多张图片、标题、说明、角标、指示器和点击事件；它不承载商品、券、直播或个性化推荐语义，复杂手势、AB 实验和素材中心批量选图应由后续任务或宿主能力扩展。

`BasicVideo` 是通用视频展示物料，负责视频地址、封面、标题、说明、角标、播放控件和播放事件；它不承载上传、转码、审核、直播、广告贴片或素材中心业务语义，这些能力应由外部系统或后续宿主能力扩展。

`BasicModal` 是通用基础弹窗物料，负责入口按钮、静态标题、说明、内容、确认按钮、弹出位置、关闭行为、色彩、圆角和留白配置；它不承载远程内容、表单提交、登录、领券、交易、权限、审核、个性化投放或弹窗内低代码子节点编排，这些能力应由后续业务物料、宿主服务或单独 slot/layout 协议扩展。

`BasicForm` 是通用基础表单容器物料，负责标题、说明、子节点字段区、提交按钮、提交成功态和 `onSubmit` 安全事件；它复用 Page Schema `children` 组合现有基础输入物料，不自动采集子字段值，不承载校验规则、验证码、登录、风控、远程提交、服务端保存或表单布局 DSL。这些能力应由后续表单协议、action、业务物料或宿主服务扩展。

`BasicList` 是通用静态内容列表物料，负责标题、说明、列表项标题、说明、标记、右侧辅助信息、间距、边框、圆角、颜色和 `onItemClick` 安全事件；它不承载远程数据源、分页、搜索、排序、FAQ 展开折叠、时间线协议、商品/优惠券/门店达人等业务模型或个性化推荐语义。这些能力应由后续数据源协议、专项内容物料、业务物料或宿主服务扩展。

`BasicAccordion` 是通用静态折叠面板物料，负责标题、说明、折叠项标题、静态内容、标签、单开/多开、本地展开收起、间距、边框、圆角、颜色和 `onItemToggle` 安全事件；它不承载远程 FAQ、活动规则接口、分页、搜索、排序、内容审核、权限审批、富文本编辑、嵌套低代码子节点、商品/优惠券/门店达人等业务模型或个性化推荐语义。这些能力应由后续数据源协议、专项内容物料、业务物料、管理台能力或宿主服务扩展。

`BasicLink` 是通用轻量链接入口物料，负责链接文案、辅助说明、前置标签、右侧箭头、普通 H5 链接、禁用态、圆角、边框、颜色和 `onClick` 安全事件；它不承载业务路由白名单、App bridge、登录鉴权、埋点平台、风控、权限审批、短链生成或远程链接校验。这些能力应由宿主 action handler、Java/BFF、管理台权限或后续专项协议扩展。

`NoticeBar` 是通用公告条展示物料，负责图标文案、标签、正文、背景、边框、圆角和留白配置；它不承载远程公告流、跑马灯、关闭记忆、曝光统计、权限审批或活动规则语义，这些能力应由后续数据源、业务物料、action 或宿主服务扩展。

`RichTextBlock` 是通用富文本展示物料，负责 HTML 片段展示、背景、文字色、边框、圆角、内边距、字号和行高配置；它不承载富文本编辑器、内容审核、敏感词、资源上传、远程规则系统或 CMS 语义，这些能力应由后续管理台 UI、Java 配置平台、内容审核服务或宿主系统扩展。

`BasicTextarea` 是通用多行输入物料，负责标签、占位、默认值、显示行数、禁用态、样式和输入变化事件；它不承载真实表单提交、校验规则、字数统计、富文本、敏感词审核或活动备注保存语义，这些能力应由后续表单协议、业务物料或宿主服务扩展。

`BasicSelect` 是通用静态单选物料，负责标签、占位、静态选项、默认值、禁用态、样式和选择变化事件；它不承载远程业务字典、商品类目、会员标签、级联选择、多选搜索或表单提交语义，这些能力应通过后续数据源契约、业务物料或编辑器专用控件扩展。

`BasicRadioGroup` 是通用静态单选组物料，负责标签、辅助说明、少量静态选项、默认值、禁用态、选中色、边框色、圆角和单选变化事件；它不承载远程业务字典、商品类目、会员标签、级联选择、多选搜索、表单提交或用户偏好持久化语义，这些能力应通过后续数据源契约、业务物料、action 或宿主服务扩展。

`BasicStepper` 是通用数字步进器物料，负责标签、辅助说明、默认值、最小值、最大值、步长、禁用态、强调色、边框色、圆角和数字变化事件；它不承载库存、购买数量、限购、价格联动、表单提交、校验规则、服务端保存或用户偏好持久化语义，这些能力应通过后续表单协议、业务物料、action 或宿主服务扩展。

`BasicSwitch` 是通用布尔开关物料，负责标签、状态文案、默认状态、禁用态、开关色、滑块色和开关变化事件；它不承载真实配置保存、权限审批、活动状态、规则联动或用户偏好持久化语义，这些能力应由后续业务物料、action 或宿主服务扩展。

`BasicCheckbox` 是通用复选物料，负责标签、辅助说明、默认勾选、禁用态、勾选色、边框色、标记色、圆角和勾选变化事件；它不承载真实协议确认、表单校验、多选数组、权限审批、活动状态或用户偏好持久化语义，这些能力应由后续表单协议、业务物料、action 或宿主服务扩展。

通用物料允许处理：

- 可配置文案、图片、链接、样式。
- 通用事件，如 `onClick`、`onSubmit`。
- 通用列表结构，如图片卡片、导航项、规则项。
- 通用 data source slot，但名称不能绑定具体业务中心。

通用物料不允许处理：

- 商品价格、库存、优惠券领取、直播状态等业务语义。
- 固定的 MeuMall API 字段。
- 业务风控、权限和交易规则。

### Business Materials

Business Materials 是面向 MeuMall 业务场景的组合物料。它们可以被运营拖拽，也声明 manifest，但必须尽量复用 Generic Materials 和 Primitives。

适合放入：

- `ProductList`
- `ProductRankList`
- `FlashSaleList`
- `CouponSection`
- `CouponBundle`
- `BrandFeatureSection`
- `StoreExpertSection`
- `LiveEntry`
- `ActivityRuleModal`
- `StickyActionBar`

业务物料允许处理：

- 业务字段展示，例如价格、券面额、门店指标、直播观看人数。
- 业务 data source slot，例如 `product.byIds`、`coupon.byActivity`。
- 业务事件，例如 `onProductClick`、`onReceive`、`onEnterLive`。

业务物料不允许处理：

- 重复实现基础 Button、Image、Tag、Price。
- 直接请求业务 API。
- 执行任意 JavaScript。
- 依赖 `hybird-meumall` 内部模块。

## 包依赖方向

推荐最终依赖图：

```text
schema
core -> schema

renderer-h5 -> core -> schema
renderer-vue-h5 -> core -> schema

design-tokens
primitives-react-h5 -> design-tokens
primitives-vue-h5 -> design-tokens

materials-h5 -> primitives-react-h5 -> design-tokens
materials-h5 -> core -> schema

materials-vue-h5 -> primitives-vue-h5 -> design-tokens
materials-vue-h5 -> core -> schema

editor -> schema + core
editor-playground -> editor + renderer-vue-h5 + materials-vue-h5
h5-runtime-playground -> renderer-h5 + materials-h5
```

禁止依赖：

- `schema` 依赖任何 UI 包。
- `core` 依赖任何 UI 包。
- `renderer-*` 依赖 `materials-*` 或 `primitives-*`。
- `design-tokens` 依赖 `schema`、`core`、`editor`、`renderer`、`materials` 或业务项目。
- `primitives-*` 依赖 `schema`、`core`、`editor`、`renderer` 或业务项目。
- `editor` 依赖 H5 runtime primitives。
- `materials-*` 依赖 `hybird-meumall` 内部代码。

## Editor UI 与 Runtime Primitives 的边界

编辑器里的 Button、Input、Select、Slider 属于管理台 UI 控件，不等同于 H5 runtime primitives。

原因：

- 编辑器 UI 服务运营后台，信息密度高。
- H5 runtime primitives 服务用户访问页面，触控、性能和视觉要求不同。
- 编辑器未来可能迁入 Java 管理系统，需要适配管理台组件库。
- H5 primitives 未来可能需要小程序等端能力对齐。

规则：

- 编辑器可以共享 Design Tokens。
- 编辑器不直接引用 H5 runtime primitives。
- 编辑器属性面板控件后续可独立沉淀为 `editor-ui` 或接入管理台组件库。

## 首批基础组件建议

### 第一批必须稳定

- `Button`：variant、size、block、disabled、loading、radius、onClick。
- `Image`：src、alt、ratio、fit、radius、fallback。
- `Tag`：variant、tone、size、radius。
- `Text`：as、weight、tone、lineClamp。
- `Price`：amountText、prefix、suffix、tone、size。

### 第二批按场景补齐

- `Input`
- `Textarea`
- `Switch`
- `Stepper`
- `Overlay`
- `Modal`
- `CountdownText`
- `Tabs`
- `Spacer`

### 后续按场景补齐

- 更多业务无关 primitives 根据真实复用收益补齐。

### 暂不进入 primitives

- `ProductCard`：业务字段太强，优先作为 business subcomponent。
- `CouponCard`：业务规则强。
- `LiveCard`：业务状态强。
- `StoreExpertCard`：业务模型强。
- 数据源选择器：属于 editor/resource client，不属于 runtime primitives。

## Generic Materials 首批规划

当前已有通用物料可逐步迁移为 primitives 组合：

- `SectionContainer`
- `GridContainer`
- `ActivityHero`
- `SectionTitle`
- `ImageBanner`
- `BasicButton`
- `BasicLink`
- `BasicInput`
- `BasicTextarea`
- `BasicSelect`
- `BasicRadioGroup`
- `BasicStepper`
- `BasicSwitch`
- `BasicCheckbox`
- `BasicText`
- `BasicPrice`
- `DividerBlock`
- `BasicImage`
- `BasicTag`
- `BasicCard`
- `BasicCarousel`
- `BasicVideo`
- `BasicForm`
- `BasicList`
- `BasicAccordion`
- `NoticeBar`
- `ActionButton`
- `ImageCardGrid`
- `TabsBlock`
- `SpacerBlock`
- `RichTextBlock`
- `NavGrid`

新增业务物料前，优先检查是否能通过这些通用物料和模板组合满足运营需求。当前 `SectionContainer`、`GridContainer`、`BasicForm`、`ActivityHero`、`Basic*`、`NoticeBar`、`RichTextBlock` 等通用物料已复用公开 runtime primitives 包或已有 Page Schema `children` 能力；它们仍是可拖拽物料，不是 primitives API 本身。

## Business Materials 首批规划

业务物料保留，但后续改造时应分两步：

1. 抽出局部基础 UI，替换为 primitives。
2. 保留业务 manifest、data source slot、events 和默认 props。

优先迁移顺序：

1. `StickyActionBar`：按钮重复明显。
2. `CouponBundle`：Tag、Button、Price 可复用。
3. `ProductList` / `ProductRankList` / `FlashSaleList`：Image、Price、Tag 可复用，当前均已迁移到公开 runtime primitives 组合。
4. `LiveEntry`：Image、Tag、Button 可复用。
5. `BrandFeatureSection` / `StoreExpertSection`：Image、Tag、Button 可复用。

## 演进计划

### Phase 0：架构确认

- 完成本文档。
- 更新项目地图和长期状态。
- 暂不新增 primitives 包。

### Phase 1：内部 primitives 原型

- 在 React/Vue H5 materials 包内建立 `src/primitives` 内部目录。
- 先实现 Button、Image、Tag、Text、Price、Divider。
- 改造 `ActionButton`、`ImageBanner`、`SectionTitle` 作为范式。
- 不扩大 npm API，降低早期包边界反复调整成本。

### Phase 1.5：抽出 design tokens npm 包

- 新增 `@meumall/lowcode-design-tokens`。
- React/Vue H5 materials 内部 primitives 共同消费该包的 H5 token 和 helper。
- 已作为 Phase 2 前置步骤完成。

### Phase 2：抽出 primitives npm 包

当前已新增：

```text
@meumall/lowcode-primitives-react-h5
@meumall/lowcode-primitives-vue-h5
```

这两个包承载 React/Vue H5 runtime 的业务无关 `Mlc*` 基础组件。materials 包从对应 primitives 包导入组件，继续负责低代码 manifest、props schema、data source slot 和 action 语义。primitives 不进入物料注册表，不依赖 schema/core/editor/renderer/materials 或业务项目。

### Phase 3：通用物料包拆分

触发条件：

- 通用物料和业务物料 release 节奏明显不同。
- Java 配置平台需要按通用/业务分开物料白名单。

可选拆分：

```text
@meumall/lowcode-materials-basic-h5
@meumall/lowcode-materials-commerce-h5
@meumall/lowcode-materials-basic-vue-h5
@meumall/lowcode-materials-commerce-vue-h5
```

当前不建议立即拆，因为会增加编辑器物料注册和版本治理复杂度。

### Phase 4：多端 primitives

小程序支持启动前，先补：

```text
@meumall/lowcode-primitives-miniapp
@meumall/lowcode-renderer-miniapp
@meumall/lowcode-materials-miniapp
```

H5 物料不得默认宣称支持小程序，必须通过 manifest `platforms` 显式声明。

## 新增物料检查清单

新增物料前必须回答：

- 这是 Generic Material 还是 Business Material？
- 是否已经能通过模板 + 通用物料组合解决？
- 是否需要新增 primitives？如果需要，是否业务无关？
- React/Vue 是否需要同名同 manifest？
- propsSchema 是否只表达运营可理解的配置？
- dataSourceSlots 是否使用白名单业务类型？
- events 是否只触发安全 action？
- 缺图、空数据、数据源失败时是否可降级？
- 是否影响 Page Schema 或 Material Manifest 契约？
- browser smoke 是否需要覆盖该物料？

## 当前结论

不要继续无限新增业务物料。当前应继续按 Phase 1 在现有 materials 包内部收口 primitives 原型，并优先改造已有通用物料和重复 UI 明显的业务物料。等 API 稳定后再抽成独立 npm 包。
