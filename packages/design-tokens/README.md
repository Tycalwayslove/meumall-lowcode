# @meumall/lowcode-design-tokens

Framework-agnostic design tokens for MeuMall low-code H5 runtime primitives.

This package is the first public layer below React/Vue H5 primitives. It does not depend on schema, renderer, editor, materials, Vue, React, Java config platform, or any business project.

## Main Exports

- `LOWCODE_H5_TOKENS`
- `h5Tokens`
- `getLowcodeH5ToneColor`
- `createLowcodeH5TintColor`
- `createLowcodeH5CssVars`
- `LowcodeH5Tone`
- `LowcodeH5TokenCssVarMap`

## Boundary

- Use this package for framework-agnostic H5 runtime visual values.
- Do not put material manifests, Page Schema fields, data sources, actions, or business concepts here.
- React/Vue primitives may consume this package.
- Editor shell controls may define their own management UI tokens; they should not import H5 runtime primitives.

