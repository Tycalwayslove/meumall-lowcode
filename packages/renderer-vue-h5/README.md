# @meumall/lowcode-renderer-vue-h5

Vue 3 H5 renderer for MeuMall low-code pages.

This package renders `LowcodePageSchema` with a Vue material registry. It is intended for the Vue editor preview and future Vue-based H5 runtime integrations.

## Editor Preview

`LowcodeVueRenderer` keeps production rendering unchanged by default. The editor can opt into node wrappers with:

- `editable`
- `selectedNodeId`
- `onNodeSelect`

These props are intended for editor preview selection and highlighting.
