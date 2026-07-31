# @meumall/lowcode-editor

Editor foundation package.

This package starts as headless editor state and schema operations. A full UI shell can be added later or embedded into the Java config platform.

## Main Exports

- `createEditorState`
- `selectNode`
- `setEditorMode`
- `setEditorViewport`
- `insertNode`
- `appendNode`
- `updateNodeProps`
- `replaceNodeProps`
- `updateNodeStyle`
- `setNodeVisibility`
- `copyNode`
- `pasteNode`
- `duplicateNode`
- `moveNode`
- `moveNodeById`
- `removeNode`
- `undo`
- `redo`
- `markSaved`
- `flattenLowcodeNodes`
- `countLowcodeNodes`
- `getLowcodeNodeDisplayName`
- `createLowcodePublishChecks`
- `summarizeLowcodePublishChecks`
- `createLowcodeDeliverySummary`
- `formatLowcodeSchemaSize`

## Readiness API

The readiness helpers are framework-agnostic editor core APIs. They can be reused by the Vue3 playground, a future Java management console shell, or another editor UI without duplicating release checks.

`createLowcodePublishChecks(schema, options)` currently covers:

- Page Schema validation.
- Empty page nodes.
- Empty image fields declared by material manifests.
- Product materials without static items or `items` data binding.
- Data source resolution errors passed in by the host.
- Node event references that point to missing actions.
- Common action parameter warnings for `navigate.url`, `coupon.receive.couponId`, and `tracking.click.eventName`.

`createLowcodeDeliverySummary(schema, { checks })` returns the formatted schema JSON, schema byte size, publish status text, and common delivery metrics used by the editor handoff panel.

## Contract

See `.ai-workspace/contracts/editor-interaction-model-v1.md`.
