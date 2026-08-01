# @meumall/lowcode-materials-h5

MeuMall React H5 business materials.

The first version is intentionally small and business-oriented. Avoid exposing too many atomic layout controls to operators.

## Runtime Primitives

This package composes React H5 runtime primitives from `@meumall/lowcode-primitives-react-h5`.
Primitives consume framework-agnostic H5 tokens from `@meumall/lowcode-design-tokens`; they are not low-code materials and must not appear in `h5Materials`.

Current primitives:

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

They are implementation details for material components, not low-code materials. They do not declare material manifests.

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
- `BasicPrice`
- `DividerBlock`
- `BasicImage`
- `BasicTag`
- `BasicCarousel`
- `BasicVideo`
- `BasicForm`
- `SectionContainer`
- `GridContainer`
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
- `GridContainer`
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
- `BasicPrice`
- `DividerBlock`
- `BasicImage`
- `BasicTag`
- `BasicCard`
- `BasicCarousel`
- `BasicVideo`
- `BasicForm`
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

`SectionContainer`, `GridContainer`, and `BasicForm` are the current nested entries for editor canvas operations. They keep the Page Schema `children` shape unchanged. `BasicForm` provides a generic submit container and `onSubmit` event, but it does not automatically collect child field values or implement validation/remote submit protocols.

These materials share the same `componentName` and core manifest fields with `@meumall/lowcode-materials-vue-h5` so the editor preview schema can be rendered by the H5 runtime package.
