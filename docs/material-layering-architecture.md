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

建议后续包名：

```text
@meumall/lowcode-design-tokens
```

当前阶段也可以先以 `packages/materials-*/src/tokens` 内部模块落地，待 API 稳定后再抽包。

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

建议后续包名：

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
- `SectionTitle`
- `ImageBanner`
- `ActionButton`
- `RichTextBlock`
- `SpacerBlock`
- `NavGrid`
- `ImageCardGrid`
- `TabsBlock`
- 后续可增加 `FormInput`、`FormSubmitButton`、`VideoBlock`。

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
- `CountdownText`
- `Overlay`
- `Modal`
- `Tabs`

### 暂不进入 primitives

- `ProductCard`：业务字段太强，优先作为 business subcomponent。
- `CouponCard`：业务规则强。
- `LiveCard`：业务状态强。
- `StoreExpertCard`：业务模型强。
- 数据源选择器：属于 editor/resource client，不属于 runtime primitives。

## Generic Materials 首批规划

当前已有通用物料可逐步迁移为 primitives 组合：

- `SectionContainer`
- `SectionTitle`
- `ImageBanner`
- `ActionButton`
- `ImageCardGrid`
- `TabsBlock`
- `SpacerBlock`
- `RichTextBlock`
- `NavGrid`

新增业务物料前，优先检查是否能通过这些通用物料和模板组合满足运营需求。

## Business Materials 首批规划

业务物料保留，但后续改造时应分两步：

1. 抽出局部基础 UI，替换为 primitives。
2. 保留业务 manifest、data source slot、events 和默认 props。

优先迁移顺序：

1. `StickyActionBar`：按钮重复明显。
2. `CouponBundle`：Tag、Button、Price 可复用。
3. `ProductList` / `ProductRankList` / `FlashSaleList`：Image、Price、Tag 可复用。
4. `LiveEntry`：Image、Tag、Button 可复用。
5. `BrandFeatureSection` / `StoreExpertSection`：Image、Tag、Button 可复用。

## 演进计划

### Phase 0：架构确认

- 完成本文档。
- 更新项目地图和长期状态。
- 暂不新增 primitives 包。

### Phase 1：内部 primitives 原型

- 在 React/Vue H5 materials 包内建立 `src/primitives` 内部目录。
- 先实现 Button、Image、Tag、Text、Price。
- 改造 `ActionButton`、`ImageBanner`、`SectionTitle` 作为范式。
- 不扩大 npm API，降低早期包边界反复调整成本。

### Phase 2：抽出 primitives npm 包

触发条件：

- 至少 5 个物料复用同一批 primitives。
- React/Vue primitives API 已稳定。
- README、测试和 dry-run 能证明包内容明确。

抽包目标：

```text
@meumall/lowcode-primitives-react-h5
@meumall/lowcode-primitives-vue-h5
@meumall/lowcode-design-tokens
```

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

不要继续无限新增业务物料。下一步应先按 Phase 1 在现有材料包内部实现最小 primitives 原型，并只改造 2 到 3 个通用物料验证边界。等 API 稳定后再抽成独立 npm 包。
