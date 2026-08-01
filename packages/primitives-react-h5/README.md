# @meumall/lowcode-primitives-react-h5

React H5 runtime primitives for MeuMall low-code materials.

This package contains business-agnostic UI building blocks used by `@meumall/lowcode-materials-h5`. Primitives do not declare low-code material manifests and must not appear in the editor material registry.

## Main Exports

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
- Form field helpers:
  - `MlcFormFieldType`
  - `createMlcFormFieldDataAttributes`
  - `formatMlcFormFieldValue`
  - `parseMlcFormFieldValue`
  - `isMlcFormFieldEmpty`
  - `createMlcFormRequiredMessage`

## Boundary

- Depends on `@meumall/lowcode-design-tokens` and React.
- Does not depend on schema, core, renderer, editor, materials, Java config platform, or business projects.
- Materials compose these primitives and provide low-code manifest semantics.
- Form field helpers only describe business-agnostic H5 field metadata and value normalization. Low-code schema, material manifests, submit actions, server validation, login, permission, and persistence remain outside this package.
