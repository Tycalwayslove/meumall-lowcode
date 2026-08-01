# @meumall/lowcode-materials-vue-h5

Vue 3 H5 business materials for MeuMall low-code pages.

## Internal Primitives

This package contains an internal runtime primitives prototype under `src/primitives`.
These primitives consume framework-agnostic H5 tokens from `@meumall/lowcode-design-tokens`; the primitives themselves are still internal implementation details.

Current internal primitives:

- `MlcButton`
- `MlcImage`
- `MlcTag`
- `MlcText`
- `MlcPrice`
- `MlcInput`
- `MlcSelect`
- `MlcRadioGroup`
- `MlcTextarea`
- `MlcSwitch`
- `MlcCheckbox`
- `MlcStepper`
- `MlcOverlay`
- `MlcModal`
- `MlcCountdownText`
- `MlcTabs`
- `MlcSpacer`
- `MlcDivider`
- `MlcNoticeBar`
- `MlcRichText`

They are implementation details for material components, not low-code materials. They do not declare material manifests and must not appear in `h5VueMaterials`.

Currently migrated materials:

- `BasicButton`
- `BasicInput`
- `BasicTextarea`
- `BasicSelect`
- `BasicRadioGroup`
- `BasicStepper`
- `BasicSwitch`
- `BasicCheckbox`
- `BasicText`
- `DividerBlock`
- `BasicImage`
- `BasicTag`
- `BasicCarousel`
- `BasicVideo`
- `SectionContainer`
- `ActionButton`
- `ImageBanner`
- `SectionTitle`
- `StickyActionBar`
- `CouponBundle`
- `ProductRankList`
- `BrandFeatureSection`
- `LiveEntry`
- `StoreExpertSection`
- `FlashSaleList`
- `ActivityRuleModal`
- `CouponSection`
- `NavGrid`
- `FloorAnchorNav`
- `CountdownTimer`
- `TabsBlock`
- `SpacerBlock`
- `LeadFormBlock`
- `NoticeBar`
- `RichTextBlock`

See `docs/material-layering-architecture.md` for the layering plan.

Current materials:

- `SectionContainer`
- `NoticeBar`
- `BasicButton`
- `BasicInput`
- `BasicTextarea`
- `BasicSelect`
- `BasicRadioGroup`
- `BasicStepper`
- `BasicSwitch`
- `BasicCheckbox`
- `BasicText`
- `DividerBlock`
- `BasicImage`
- `BasicTag`
- `BasicCard`
- `BasicCarousel`
- `BasicVideo`
- `ActivityHero`
- `ImageBanner`
- `SectionTitle`
- `ImageCardGrid`
- `TabsBlock`
- `LeadFormBlock`
- `ActionButton`
- `StickyActionBar`
- `ProductList`
- `ProductRankList`
- `BrandFeatureSection`
- `StoreExpertSection`
- `LiveEntry`
- `CouponSection`
- `CouponBundle`
- `ActivityRuleModal`
- `SpacerBlock`
- `CountdownTimer`
- `NavGrid`
- `FloorAnchorNav`
- `FlashSaleList`
- `RichTextBlock`

`SectionContainer` is the current nested layout entry for editor canvas operations. It supports configurable spacing, border, shadow, title colors, and empty-state copy, and its title, subtitle, and empty state reuse the internal `MlcText` primitive while keeping the Page Schema node shape unchanged.

These materials share the same `componentName` and core manifest fields with `@meumall/lowcode-materials-h5` so Vue editor preview schemas can be rendered by the React H5 runtime package.
