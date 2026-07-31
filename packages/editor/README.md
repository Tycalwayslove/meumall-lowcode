# @meumall/lowcode-editor

Editor foundation package.

This package starts as headless editor state and schema operations. A full UI shell can be added later or embedded into the Java config platform.

## Main Exports

- `createEditorState`
- `selectNode`
- `setEditorMode`
- `setEditorViewport`
- `setEditorViewportPreset`
- `LOWCODE_H5_VIEWPORT_PRESETS`
- `getLowcodeEditorViewportPreset`
- `findLowcodeEditorViewportPreset`
- `createLowcodeEditorViewportFromPreset`
- `formatLowcodeEditorViewportTitle`
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
- `createLowcodeVersionDiffItems`
- `createLowcodeSchemaPreviewSnippet`
- `createLowcodeSchemaPreviewItems`
- `createLowcodeTemplatePreviewMeta`
- `createLowcodeTemplateListItem`
- `sliceLowcodeTemplateTags`
- `formatLowcodeTemplateVersion`
- `formatLowcodeTemplateSummary`
- `createLowcodeBlankPageSchema`
- `cloneLowcodePageSchema`
- `createLowcodePageStartState`

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

## Version Summary API

The version helpers keep local draft comparison, rollback confirmation, and future Java config platform version audit screens on one summary contract.

`createLowcodeVersionDiffItems(current, selected)` compares the fields currently shown in the editor release diff panel:

- Title.
- Page status.
- Publish environment.
- Page version.
- Node count.
- Data source count.
- Action count.

`createLowcodeSchemaPreviewSnippet(schema)` returns a compact JSON-safe summary with page metadata, layout, node summary, data source ids, and action ids.

`createLowcodeSchemaPreviewItems(current, selected, options)` formats current and selected schema snippets for side-by-side preview panels.

## Template Summary API

The template helpers keep template cards, page-start wizards, and future Java template market screens on one framework-agnostic display contract.

`createLowcodeTemplatePreviewMeta(template, options)` derives the visual preview metadata from common schema props:

- Preview image from `imageUrl`, `coverImageUrl`, or `logoImageUrl`.
- Preview title from `title`, `brandName`, or `text`.
- Preview subtitle from `subtitle`, `description`, or `summary`.
- Node count label from the full Page Schema node tree.

`createLowcodeTemplateListItem(template, options)` returns the template card data used by editor shells, including node count, data source count, action count, tags, version, and preview metadata.

`sliceLowcodeTemplateTags(template, limit)` keeps tag truncation consistent across template list surfaces.

`formatLowcodeTemplateVersion(template)` returns `v{version}` or `未标版本`.

`formatLowcodeTemplateSummary(template)` formats the current card summary text as `节点 / 数据源 / 动作`.

## Page Start API

The page start helpers keep blank-page creation, template application, and future management-console page starters on one editor command contract.

`createLowcodeBlankPageSchema(options)` creates a valid empty H5 Page Schema with stable defaults:

- `targetPlatforms: ["h5"]`.
- Safe-area layout with `maxWidth: 430`.
- Empty `nodes`.
- Default H5 tracking keys.
- Draft publish metadata for the selected environment and operator.

`cloneLowcodePageSchema(schema)` performs a JSON-safe deep copy before templates or releases are used as editable drafts.

`createLowcodePageStartState(schema, options)` creates a fresh editor state for a new blank page or selected template. It selects the first node by default, keeps host-provided viewport/mode options, and lets the shell decide whether the new state should be dirty.

Host shells remain responsible for confirmation dialogs, local or server draft persistence, permissions, and user-facing messages.

## Viewport Preset API

The viewport helpers keep H5 canvas device presets reusable across the Vue3 playground and future management-console shells.

`LOWCODE_H5_VIEWPORT_PRESETS` currently contains:

- `h5-compact`: 360px compact H5 preview.
- `h5-standard`: 390px standard H5 preview.
- `h5-large`: 430px large H5 preview.

`getLowcodeEditorViewportPreset(id)` resolves a preset by id.

`findLowcodeEditorViewportPreset(viewport)` matches the current editor viewport by platform and width.

`createLowcodeEditorViewportFromPreset(preset)` converts a preset into a `LowcodeEditorViewport`.

`formatLowcodeEditorViewportTitle(viewport)` returns labels such as `标准屏 390`, with `自定义 {width}` as the fallback.

`setEditorViewportPreset(state, preset)` applies a preset through the existing viewport state command. Viewport presets are editor-shell state only; they do not write to Page Schema or material manifests.

## Contract

See `.ai-workspace/contracts/editor-interaction-model-v1.md`.
