# @meumall/lowcode-renderer-vue-h5

Vue 3 H5 renderer for MeuMall low-code pages.

This package renders `LowcodePageSchema` with a Vue material registry. It is intended for the Vue editor preview and future Vue-based H5 runtime integrations.

## Editor Preview

`LowcodeVueRenderer` keeps production rendering unchanged by default. The editor can opt into node wrappers with:

- `editable`
- `selectedNodeId`
- `onNodeSelect`
- `nodeDraggable`
- `onNodeDragStart`
- `onNodeDragEnd`

These props are intended for editor preview selection, highlighting and canvas-level drag orchestration. The renderer only exposes generic node callbacks; editor packages or host apps decide how to move schema nodes.

## Events

Material event handlers are bridged to `actionExecutor.execute(actionRef, context)`. If a material calls an event handler with a JSON payload, the renderer forwards that payload as `context.event`.

This keeps Page Schema event refs stable while allowing materials such as `BasicForm` to submit runtime values to safe action handlers.

## Fallbacks

- Empty `schema.nodes` renders the caller-provided `fallback`.
- Unknown materials render a local fallback with `mlc-runtime-missing`, `data-lowcode-node-id`, and `data-lowcode-missing`.
- Material render errors are caught by a local boundary and render `mlc-runtime-error`, `data-lowcode-node-id`, and `data-lowcode-error`.
- Hosts can pass optional `onRenderError` to report material render errors to diagnostics or monitoring.
