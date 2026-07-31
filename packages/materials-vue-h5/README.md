# @meumall/lowcode-materials-vue-h5

Vue 3 H5 business materials for MeuMall low-code pages.

## Internal Primitives

This package contains an internal runtime primitives prototype under `src/primitives`.

Current internal primitives:

- `MlcButton`
- `MlcImage`
- `MlcTag`
- `MlcText`
- `MlcPrice`

They are implementation details for material components, not low-code materials. They do not declare material manifests and must not appear in `h5VueMaterials`.

Currently migrated materials:

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

See `docs/material-layering-architecture.md` for the layering plan.

Current materials:

- `SectionContainer`
- `NoticeBar`
- `ActivityHero`
- `ImageBanner`
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
