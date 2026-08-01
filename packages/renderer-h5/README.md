# @meumall/lowcode-renderer-h5

React renderer for H5 low-code pages.

The renderer consumes a Page Schema and a material registry. It does not know Java config platform details.

## Events

Material event handlers are bridged to `actionExecutor.execute(actionRef, context)`. If a material calls an event handler with a JSON payload, the renderer forwards that payload as `context.event`.

This keeps Page Schema event refs stable while allowing materials such as `BasicForm` to submit runtime values to safe action handlers.

## Fallbacks

- Empty `schema.nodes` renders the caller-provided `fallback`.
- Unknown materials render a local fallback with `mlc-runtime-missing`, `data-lowcode-node-id`, and `data-lowcode-missing`.
- Material render errors are caught by a component boundary and render `mlc-runtime-error`, `data-lowcode-node-id`, and `data-lowcode-error`.
- Hosts can pass `onRenderError` to report material render errors to diagnostics or monitoring.
