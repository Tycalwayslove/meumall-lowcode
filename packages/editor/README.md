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
- `createLowcodeMaterialCatalogItem`
- `createLowcodeMaterialCategories`
- `filterLowcodeMaterialCatalog`
- `pickLowcodeMaterialEntriesByComponentNames`
- `formatLowcodeMaterialCatalogSummary`
- `LOWCODE_EDITOR_COMMAND_DEFAULT_LIMIT`
- `createLowcodeEditorCommandSearchText`
- `filterLowcodeEditorCommands`
- `groupLowcodeEditorCommands`
- `createLowcodeOutlineRows`
- `createLowcodeOutlineRowSearchText`
- `createLowcodeOutlineVisibility`
- `pruneLowcodeOutlineCollapsedNodeIds`
- `revealLowcodeOutlineNode`
- `LOWCODE_EDITOR_PROP_GROUP_ORDER`
- `LOWCODE_EDITOR_PROP_GROUP_META`
- `getLowcodePropGroupKey`
- `createLowcodePropGroups`
- `isLowcodePropGroupCollapsed`
- `toggleLowcodePropGroupCollapsed`
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
- `createLowcodeWorkspaceStats`
- `createLowcodePreviewLinkItem`
- `createLowcodePreviewLinkItems`
- `summarizeLowcodePreviewLinks`
- `createLowcodeEditorDraftPayload`
- `parseLowcodeEditorDraftContent`
- `formatLowcodeEditorDraftStatusText`
- `getLowcodeEditorDraftStatusTone`
- `createLowcodeSchemaFileName`
- `createLowcodeSchemaFileExport`
- `parseLowcodeSchemaFileContent`
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
- `getLowcodePropEditorControl`
- `isLowcodeListPropEditor`
- `isLowcodeStructuredPropEditor`
- `createLowcodeListEditorFields`
- `isLowcodeListImageField`
- `createLowcodeDefaultListItem`
- `toLowcodePropInputText`
- `toLowcodePropInputBoolean`
- `normalizeLowcodePropInputValue`
- `createLowcodeActionOptions`
- `createLowcodeEventBindingItems`
- `bindLowcodeNodeEvent`
- `renameLowcodeActionRefsInNodes`
- `removeLowcodeActionRefsFromNodes`

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

## Workspace Summary API

The workspace summary helper keeps top-bar editor status chips reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`createLowcodeWorkspaceStats(schema, options)` returns a stable list of status stats for:

- Node count.
- Current selected material title.
- Page Schema validation status.
- Publish readiness status from a publish-check summary.
- Draft save status.

Each item includes `id`, `label`, `value`, and a tone of `neutral`, `success`, `warning`, or `danger`.

This helper does not render UI, inspect DOM, run server publish checks, enforce permissions, or mutate editor state. Host shells remain responsible for layout, icons, click handlers, live collaboration locks, permissions, and server-side review/approval state.

## Prop Editor Model API

The prop editor model helpers keep inspector field behavior reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`getLowcodePropEditorControl(propSchema)` returns the recommended control model: `text`, `number`, `color`, `switch`, `textarea`, `json`, or `list`. `isLowcodeListPropEditor` and `isLowcodeStructuredPropEditor` expose the common list and JSON editor predicates.

`createLowcodeListEditorFields(propName, options)` derives stable list-item field metadata from the prop name, component name, and current list items. `createLowcodeDefaultListItem(propName, options)` creates common starter rows for rule, coupon, navigation, image card, floor anchor, and store/expert list props.

`toLowcodePropInputText`, `toLowcodePropInputBoolean`, and `normalizeLowcodePropInputValue` provide the shared display and write-back conversion used by property panels.

These helpers do not render controls, open resource pickers, read DOM, save schema, or call Java APIs. Host shells remain responsible for Vue/React components, layout, validation feedback, resource libraries, permissions, audit, and persistence.

## Event Binding API

The event binding helpers keep material-event to Page Schema action binding reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`createLowcodeActionOptions(actions)` creates stable select options from `schema.actions`.

`createLowcodeEventBindingItems(events, actions, nodeEvents)` derives one binding item per material event, including the current `actionId`, display label, available action options, and whether the current binding points to a missing action.

`bindLowcodeNodeEvent(state, nodeId, eventName, actionId)` writes or clears one node event binding. `renameLowcodeActionRefsInNodes(nodes, previousActionId, nextActionId)` and `removeLowcodeActionRefsFromNodes(nodes, actionId)` keep node event refs aligned when the host renames or deletes actions.

These helpers do not execute actions, render select controls, validate permissions, call bridges, call coupon APIs, emit tracking events, or persist schema. Host shells remain responsible for UI, action editing forms, permissions, audit, risk control, and runtime action handlers.

## Preview Link API

The preview link helpers keep H5 preview entry lists reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`createLowcodePreviewLinkItem(source, options)` normalizes one host-provided preview source into an item with `ready` or `disabled` status, status text, trimmed URL, and open/copy capability flags.

`createLowcodePreviewLinkItems(sources, options)` creates a list of preview link items and can optionally filter disabled entries with `includeDisabled: false`.

`summarizeLowcodePreviewLinks(items)` returns total, ready count, disabled count, display status text, and ready entry titles for delivery panels.

These helpers do not build URLs, encode Page Schema, open windows, copy to clipboard, or call runtime APIs. Host shells remain responsible for URL construction, previewToken/releaseId/pageId protocols, permissions, expiration, audit records, and user-facing click handlers.

## Draft Persistence API

The draft persistence helpers keep editor auto-save and draft recovery state reusable across the Vue3 playground, future Java management-console shells, and optional server-side draft preflight tooling.

`createLowcodeEditorDraftPayload(schema, options)` returns a JSON-safe payload with version, updated time, cloned schema, formatted schema JSON, byte size, and size text. It does not write to localStorage, IndexedDB, HTTP, or any other host storage.

`parseLowcodeEditorDraftContent(content, options)` parses stored draft text and validates it with Page Schema v1 rules. It supports both the current draft payload shape and the older legacy shape where localStorage contained Page Schema directly. Invalid JSON or invalid schema returns `{ restored: false, schema: fallbackSchema, error }`.

`formatLowcodeEditorDraftStatusText(status, options)` and `getLowcodeEditorDraftStatusTone(status)` provide the shared status copy and tone currently used by editor shells for `idle`, `restored`, `pending`, `saved`, and `error`.

Host shells remain responsible for timers, debounce strategy, actual storage reads/writes, conflict handling, overwrite confirmation, permissions, audit records, and user-facing placement.

## Schema File API

The schema file helpers keep Page Schema JSON import/export reusable across the Vue3 playground, future Java management-console shells, and optional server-side preflight tooling.

`createLowcodeSchemaFileName(schema, options)` returns a sanitized `.json` filename from page id, timestamp, optional prefix, or an explicit filename.

`createLowcodeSchemaFileExport(schema, options)` returns the JSON content, filename, `application/json;charset=utf-8` mime type, byte size, and formatted size text. It does not create `Blob`, anchors, or downloads.

`parseLowcodeSchemaFileContent(content, options)` parses JSON text and validates it with Page Schema v1 rules. It returns `{ ok: true, schema }` for valid content and `{ ok: false, error, validationErrors? }` for invalid JSON or invalid schema. Valid schemas are cloned by default before they are returned.

Host shells remain responsible for file pickers, upload/download UI, overwrite confirmation, permissions, audit records, storage, and user-facing messages.

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

## Material Catalog API

The material catalog helpers keep material-library search, category filters, quick sections, and card summaries reusable across editor shells.

`createLowcodeMaterialCatalogItem(manifest)` returns display and search metadata derived from a `LowcodeMaterialManifest`, including component name, title, category, version, platforms, prop count, event count, data-source slot count, summary text, and search text.

`createLowcodeMaterialCategories(manifests, allCategoryLabel)` returns a stable category list with `全部` by default.

`filterLowcodeMaterialCatalog(materials, options)` filters entries that contain a `manifest` field by category and keyword. Keyword matching covers title, component name, category, version, and platforms.

`pickLowcodeMaterialEntriesByComponentNames(materials, componentNames)` resolves quick sections such as favorites or recent materials while preserving the provided component-name order and ignoring missing materials.

`formatLowcodeMaterialCatalogSummary(manifest)` returns card text such as `3 个配置 / 1 个事件 / 0 个数据槽`.

These helpers do not change Material Manifest, Page Schema, or renderer behavior.

## Command Palette API

The command helpers keep editor-shell command palettes reusable across the Vue3 playground and future management-console shells.

`LOWCODE_EDITOR_COMMAND_DEFAULT_LIMIT` is `28`, matching the current command palette display size.

`createLowcodeEditorCommandSearchText(command)` derives searchable text from title, group, description, and keywords.

`filterLowcodeEditorCommands(commands, options)` filters command entries by keyword and display limit. Disabled commands are included by default so UI shells can show unavailable actions with disabled styling; hosts can pass `includeDisabled: false` when they need executable-only lists.

`groupLowcodeEditorCommands(commands)` groups filtered commands by their `group` value while preserving first-seen group order and item order.

These helpers do not execute commands, bind keyboard shortcuts, check permissions, or mutate editor state. Host shells remain responsible for `run` handlers, shortcuts such as `Meta/Ctrl + K`, confirmation dialogs, and user-facing feedback.

## Outline Tree API

The outline helpers keep editor structure trees reusable across the Vue3 playground and future management-console shells.

`createLowcodeOutlineRows(nodes, options)` flattens nested Page Schema nodes into rows with depth, parent id, ancestor ids, sibling index, child state, display title, subtitle, and search text. Optional material manifests enrich titles, subtitles, categories, and keyword matching.

`createLowcodeOutlineRowSearchText(row)` returns searchable text derived from the row or its node.

`createLowcodeOutlineVisibility(rows, options)` calculates visible rows, matched node ids, visible node ids, selected-path node ids, and summary text from keyword, collapsed node ids, and selected node id.

`pruneLowcodeOutlineCollapsedNodeIds(collapsedNodeIds, rows)` removes collapsed ids that no longer point to nodes with children.

`revealLowcodeOutlineNode(nodeId, collapsedNodeIds, rows)` returns collapsed ids with the selected node ancestors expanded.

These helpers do not select nodes, scroll canvases, rename nodes, handle drag-and-drop, or check permissions. Host shells remain responsible for UI state, DOM behavior, and user-facing interactions.

## Property Group API

The property group helpers keep material property panels reusable across the Vue3 playground and future management-console shells.

`LOWCODE_EDITOR_PROP_GROUP_ORDER` defines the default display order: content, style, data, behavior, advanced.

`LOWCODE_EDITOR_PROP_GROUP_META` provides the default Chinese labels and descriptions currently used by the editor property panel.

`getLowcodePropGroupKey(propName, propSchema, options)` classifies one prop by name, setter, and schema type.

`createLowcodePropGroups(propsSchema, options)` turns a material `propsSchema` into grouped entries with labels, descriptions, and stable order.

`isLowcodePropGroupCollapsed(state, key)` and `toggleLowcodePropGroupCollapsed(state, key)` provide pure helpers for group collapsed state.

These helpers do not render setter controls, open resource pickers, edit Page Schema values, or check permissions. Host shells remain responsible for concrete form controls, validation messages, resource selection, and user-facing interactions.

## Contract

See `.ai-workspace/contracts/editor-interaction-model-v1.md`.
