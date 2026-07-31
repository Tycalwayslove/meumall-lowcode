# @meumall/lowcode-materials-h5

MeuMall React H5 business materials.

The first version is intentionally small and business-oriented. Avoid exposing too many atomic layout controls to operators.

## Internal Primitives

This package contains an internal runtime primitives prototype under `src/primitives`.

Current internal primitives:

- `MlcButton`
- `MlcImage`
- `MlcTag`
- `MlcText`
- `MlcPrice`

They are implementation details for material components, not low-code materials. They do not declare material manifests and must not appear in `h5Materials`.

Currently migrated materials:

- `ActionButton`
- `ImageBanner`
- `SectionTitle`
- `StickyActionBar`
- `CouponBundle`
- `ProductRankList`

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

These materials share the same `componentName` and core manifest fields with `@meumall/lowcode-materials-vue-h5` so the editor preview schema can be rendered by the H5 runtime package.
