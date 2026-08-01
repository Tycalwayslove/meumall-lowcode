# @meumall/lowcode-materials-vue-h5

Vue 3 H5 business materials for MeuMall low-code pages.

## Runtime Primitives

This package composes Vue H5 runtime primitives from `@meumall/lowcode-primitives-vue-h5`.
Primitives consume framework-agnostic H5 tokens from `@meumall/lowcode-design-tokens`; they are not low-code materials and must not appear in `h5VueMaterials`.

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
- `MlcStateBlock`
- `MlcProgress`
- `MlcMetric`

They are implementation details for material components, not low-code materials. They do not declare material manifests.

Currently migrated materials:

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
- `BasicCarousel`
- `BasicVideo`
- `BasicForm`
- `BasicList`
- `BasicAccordion`
- `BasicTimeline`
- `BasicAlert`
- `BasicStateBlock`
- `BasicProgress`
- `BasicMetric`
- `BasicMetricGrid`
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
- `BasicTimeline`
- `BasicAlert`
- `BasicStateBlock`
- `BasicProgress`
- `BasicMetric`
- `BasicMetricGrid`
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

`SectionContainer`, `GridContainer`, and `BasicForm` are the current nested entries for editor canvas operations. They keep the Page Schema `children` shape unchanged. `BasicForm` provides a generic submit container and `onSubmit` event. On submit it collects child basic form controls into a runtime payload with `formId`, `childCount`, `fieldCount`, `valid`, `errorCount`, `errors`, `values`, `fieldLabels`, and `fieldTypes`; child controls can set `required` and `requiredMessage` for local required validation. Failed required fields render a field-level invalid state, `aria-invalid` marker, and field error text, while the form still keeps its form-level error summary. Regex rules, async validation, remote submit protocols, login, permission, and risk control remain host responsibilities. `BasicList` provides a business-neutral static content list and `onItemClick` event; remote data, pagination, search, sorting, FAQ expansion, and business-specific list models should be added through later dedicated protocols or business materials. `BasicAccordion` provides a business-neutral static accordion and `onItemToggle` event; remote FAQ, activity rule APIs, content approval, permissions, rich text editing, and nested low-code content remain dedicated protocol or business material concerns. `BasicTimeline` provides a business-neutral static timeline and `onItemClick` event; remote activity progress, order status, approval flow, task workflow, service fulfillment, and business status models remain host or business material concerns. `BasicAlert` provides a business-neutral static feedback card and `onActionClick` event; remote message feeds, system error codes, content approval, permission workflows, validation protocols, and business notification states remain host or business material concerns. `BasicStateBlock` provides a business-neutral static state block and `onActionClick` event for empty, loading, error, success, and info states; remote status flows, retry protocols, error-code translation, and global toast remain host or dedicated protocol concerns. `BasicProgress` provides a business-neutral static progress bar for progress, completion rate, and achievement display; remote progress, auto refresh, server-side calculation, order status, and approval workflow remain host or dedicated protocol concerns. `BasicMetric` provides a business-neutral static metric display for numeric summaries and lightweight data callouts; remote statistics, real-time refresh, inventory calculation, sales calculation, and analytics aggregation remain host or dedicated protocol concerns. `BasicMetricGrid` provides a business-neutral static metric group for multiple numeric summaries; remote statistics, real-time refresh, inventory calculation, sales calculation, people counting, and analytics aggregation remain host or dedicated protocol concerns. `BasicLink` provides a lightweight H5 link entry and `onClick` event; business routing, App bridge, login, permission checks, tracking, and risk control remain host responsibilities.

These materials share the same `componentName` and core manifest fields with `@meumall/lowcode-materials-h5` so Vue editor preview schemas can be rendered by the React H5 runtime package.
