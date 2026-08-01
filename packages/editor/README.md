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
- `LOWCODE_EDITOR_MATERIAL_CATEGORY_META`
- `getLowcodeMaterialCategoryMeta`
- `createLowcodeMaterialCategorySummaries`
- `createLowcodeMaterialCatalogOverview`
- `LOWCODE_EDITOR_MATERIAL_LAYER_META`
- `LOWCODE_EDITOR_MATERIAL_FAMILY_META`
- `LOWCODE_EDITOR_MATERIAL_COMPONENT_PROFILES`
- `LOWCODE_EDITOR_MATERIAL_INSERT_PRESETS`
- `getLowcodeMaterialLayerMeta`
- `getLowcodeMaterialFamilyMeta`
- `createLowcodeMaterialArchitectureProfile`
- `createLowcodeMaterialArchitectureOverview`
- `createLowcodeMaterialInsertPresets`
- `findLowcodeMaterialInsertPreset`
- `createLowcodeMaterialNodeInputFromPreset`
- `createLowcodeMaterialCategories`
- `filterLowcodeMaterialCatalog`
- `pickLowcodeMaterialEntriesByComponentNames`
- `formatLowcodeMaterialCatalogSummary`
- `createLowcodeMaterialDetailSummary`
- `createLowcodeMaterialDetailPropEntries`
- `createLowcodeMaterialDetailEventItems`
- `createLowcodeMaterialDetailDataSourceSlotItems`
- `createLowcodeMaterialNodeInput`
- `createLowcodeMaterialPreviewSchema`
- `LOWCODE_EDITOR_AUDIT_TRAIL_DEFAULT_LIMIT`
- `createLowcodeEditorAuditEvent`
- `createLowcodeEditorAuditTrail`
- `createLowcodeEditorAuditListItems`
- `LOWCODE_EDITOR_COMMAND_DEFAULT_LIMIT`
- `createLowcodeEditorCommandSearchText`
- `filterLowcodeEditorCommands`
- `groupLowcodeEditorCommands`
- `LOWCODE_EDITOR_PERMISSION_ACTIONS`
- `LOWCODE_EDITOR_MUTATING_PERMISSION_ACTIONS`
- `createLowcodeEditorPermissionState`
- `mergeLowcodeEditorPermissionStates`
- `isLowcodeEditorActionAllowed`
- `getLowcodeEditorActionDisabledReason`
- `LOWCODE_EDITOR_DEFAULT_CAPABILITY_ACTIONS`
- `createLowcodeEditorCapabilityState`
- `createLowcodeEditorApprovalState`
- `createLowcodeEditorApprovalPermissionOptions`
- `createLowcodeEditorCollaborationState`
- `createLowcodeEditorCollaborationPermissionOptions`
- `createLowcodeOutlineRows`
- `createLowcodeOutlineRowSearchText`
- `createLowcodeOutlineVisibility`
- `pruneLowcodeOutlineCollapsedNodeIds`
- `revealLowcodeOutlineNode`
- `toggleLowcodeNodeSelection`
- `pruneLowcodeNodeSelection`
- `pickLowcodeSelectedOutlineRows`
- `hasLowcodeSameParentSelection`
- `createLowcodeNodeSelectionSummary`
- `createLowcodeNodeSelectionModel`
- `isLowcodeNodeSelected`
- `canLowcodeDragSelectedGroup`
- `getLowcodeSelectedGroupNodeIdsForDrag`
- `resolveLowcodeCanvasDropPlacement`
- `createLowcodeCanvasDropHintStyle`
- `createLowcodeCanvasSnapGuides`
- `createLowcodeCanvasAppendDropHint`
- `createLowcodeCanvasTargetDropHint`
- `isLowcodeInvalidNodeDropTarget`
- `getLowcodeCanvasAdjacentDropIndex`
- `createLowcodeCanvasDropTarget`
- `getLowcodeAdjustedCanvasMoveIndex`
- `createLowcodeCanvasNodeMoveTarget`
- `createLowcodeCanvasGroupMoveTarget`
- `insertLowcodeCanvasNodeByHint`
- `moveLowcodeCanvasNodeByHint`
- `moveLowcodeCanvasNodeGroupByHint`
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
- `createLowcodePublishRiskSummary`
- `createLowcodeDeliverySummary`
- `formatLowcodeSchemaSize`
- `createLowcodeWorkspaceStats`
- `createLowcodeMaterialInsertTargets`
- `createLowcodeMaterialInsertTarget`
- `insertLowcodeMaterialByTarget`
- `insertLowcodeMaterialPresetByTarget`
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
- `formatLowcodeReleaseKindLabel`
- `formatLowcodeReleaseTime`
- `createLowcodeReleaseListItem`
- `createLowcodeReleaseListItems`
- `summarizeLowcodeReleaseList`
- `formatLowcodeVersionDiffSummary`
- `createLowcodeReleaseMessage`
- `createLowcodePublishBlockedMessage`
- `createLowcodeRollbackNote`
- `createLowcodeRollbackConfirmText`
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
- `normalizeLowcodeColorInputValue`
- `isLowcodeHexColor`
- `createLowcodeColorSwatches`
- `getLowcodeNativeColorInputValue`
- `LOWCODE_EDITOR_DEFAULT_COLOR_SWATCHES`
- `normalizeLowcodePropInputValue`
- `LOWCODE_EDITOR_PAGE_TYPE_OPTIONS`
- `LOWCODE_EDITOR_PAGE_STATUS_OPTIONS`
- `LOWCODE_EDITOR_PUBLISH_ENVIRONMENT_OPTIONS`
- `LOWCODE_EDITOR_PAGE_BACKGROUND_SWATCHES`
- `createLowcodePageSettingsForm`
- `normalizeLowcodePageMaxWidth`
- `updateLowcodePageTitle`
- `updateLowcodePageDescription`
- `updateLowcodePageStatus`
- `updateLowcodePageType`
- `updateLowcodePublishEnvironment`
- `updateLowcodePageBackgroundColor`
- `updateLowcodePageSafeArea`
- `updateLowcodePageMaxWidth`
- `LOWCODE_EDITOR_DEFAULT_DATA_SOURCE_TYPE_OPTIONS`
- `createLowcodeDefaultDataSourceParams`
- `createLowcodeDataSourceConfig`
- `formatLowcodeDataSourceParamsText`
- `formatLowcodeDataSourceRecordLabel`
- `createLowcodeDataSourceFormItems`
- `upsertLowcodeDataSourceConfigs`
- `addLowcodeDataSource`
- `updateLowcodeDataSource`
- `removeLowcodeDataSource`
- `LOWCODE_EDITOR_DEFAULT_ACTION_TYPE_OPTIONS`
- `LOWCODE_EDITOR_DEFAULT_CANVAS_INSIDE_COMPONENT_NAMES`
- `isLowcodeEditorContainerComponentName`
- `createLowcodeDefaultActionParams`
- `createLowcodeActionConfig`
- `formatLowcodeActionParamsText`
- `createLowcodeActionFormItems`
- `addLowcodeAction`
- `updateLowcodeAction`
- `renameLowcodeAction`
- `setLowcodeActionType`
- `removeLowcodeAction`
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
- Empty video fields declared by material manifests.
- Product materials without static items or `items` data binding.
- Data source resolution errors passed in by the host.
- Node event references that point to missing actions.
- Common action parameter warnings for `navigate.url`, `coupon.receive.couponId`, and `tracking.click.eventName`.

`createLowcodeDeliverySummary(schema, { checks })` returns the formatted schema JSON, schema byte size, publish status text, and common delivery metrics used by the editor handoff panel.

`createLowcodePublishRiskSummary(checks, options)` derives an operator-facing risk summary from existing publish checks. It returns `blocked`, `warning`, or `ready` status, copy for the publish panel, and prioritized error/warning items that host shells can display before the full check list. The helper does not add new validation rules or call server-side publish checks.

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

## Demo Checklist API

The demo checklist helpers keep the operator-facing editor and H5 runtime validation path reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`createLowcodeEditorDemoChecklist(options)` returns a stable list of checklist items for:

- Page content.
- Basic material availability.
- Page Schema validation.
- H5 preview entry readiness.
- Draft save or release history.
- React H5 runtime validation.

Each item includes `id`, `title`, `description`, `status`, and `statusText`. Status values are `done`, `active`, `pending`, and `blocked`.

`summarizeLowcodeEditorDemoChecklist(items)` returns total, done, active, pending, blocked, and a compact `statusText` such as `6/6 已就绪`.

These helpers do not render UI, build preview URLs, save drafts, publish pages, call Java APIs, inspect renderer internals, enforce permissions, or mutate Page Schema. Host shells remain responsible for deriving the input options from their own preview links, release records, save state, permission state, and runtime integration.

## Permission, Approval And Collaboration API

The permission helpers keep editor operation availability reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`createLowcodeEditorPermissionState(options)` returns stable decisions for editor actions such as draft saving, schema import/export, preview, publish, template operations, canvas clearing, material insertion, and node operations. The default state allows every action. `readonly` disables mutating actions while keeping view/export style actions available.

`mergeLowcodeEditorPermissionStates(...states)` combines multiple permission sources, such as account permissions, collaboration locks, and approval workflow permissions. A denied decision wins and keeps the first disabled reason.

`createLowcodeEditorApprovalState(options)` turns host-provided approval workflow data into a display model for `none`, `draft`, `pending`, `approved`, `rejected`, and `published` states. `createLowcodeEditorApprovalPermissionOptions(state)` bridges approval state into publish and approval action decisions, while keeping the default `none` state compatible with direct publishing.

`createLowcodeEditorCollaborationState(options)` turns host-provided collaboration lock data into a display model for `unlocked`, `locked-by-me`, `locked-by-other`, `readonly`, and `expired` states. `createLowcodeEditorCollaborationPermissionOptions(state)` bridges that state into the permission helper's readonly baseline.

`createLowcodeEditorCapabilityState(options)` combines collaboration state, approval state, optional account permission state, and publish-check summary into one shell-facing model. It returns the merged `permissionState`, `editable`, `readonly`, `submittable`, `publishable`, `disabledActions`, status items, and blocking reasons. Publish-check errors automatically block preview creation, approval submission, and publishing.

These helpers do not read users, create approval instances, call Java approval or lock APIs, renew locks, release locks, render UI, or mutate Page Schema. Host shells remain responsible for real approval flows, lock services, audit logs, and persistence.

## Audit Trail API

The audit trail helpers keep editor operation logs reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`createLowcodeEditorAuditEvent(input, options)` creates a normalized event with type, title, optional description, result, ISO timestamp, actor, target, and metadata.

`createLowcodeEditorAuditTrail(events, input, options)` appends one event and keeps the trail within `LOWCODE_EDITOR_AUDIT_TRAIL_DEFAULT_LIMIT` or the host-provided limit.

`createLowcodeEditorAuditListItems(events, options)` derives display-friendly items with latest-first ordering, time labels, actor names, target text, and result tones.

These helpers do not persist audit records, call Java APIs, inspect users, enforce permissions, render timelines, or mutate Page Schema. Host shells remain responsible for deciding which operations are audited, uploading records, permission checks, pagination, retention, and compliance rules.

## Material Insert Target API

The material insert target helpers keep material insertion affordances reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`createLowcodeMaterialInsertTargets(options)` returns the standard `append`, `before`, `after`, and `inside` targets with labels, descriptions, parent/index placement data, disabled state, and disabled reasons.

`createLowcodeMaterialInsertTarget(options)` derives one target, while `insertLowcodeMaterialByTarget(state, node, target)` applies an enabled target through the same immutable command style as `insertNode`.

`insertLowcodeMaterialPresetByTarget(state, manifest, preset, target, options)` first derives node input from `manifest + preset`, then applies the same insert target command. Hosts can use it for one-click preset insertion into selected containers, before/after selected nodes, or the page end without duplicating preset prop merge logic.

These helpers do not render toolbars, inspect DOM, decide whether a material is a container, handle drag-and-drop, or persist schema. Except for the explicit `manifest + preset` node-input derivation in `insertLowcodeMaterialPresetByTarget`, host shells remain responsible for UI, material registry lookup, permission state, drag/drop hints, audit, and server-side saving.

## Prop Editor Model API

The prop editor model helpers keep inspector field behavior reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`getLowcodePropEditorControl(propSchema)` returns the recommended control model: `text`, `number`, `color`, `switch`, `select`, `textarea`, `json`, or `list`. `isLowcodeListPropEditor` and `isLowcodeStructuredPropEditor` expose the common list and JSON editor predicates.

`createLowcodeListEditorFields(propName, options)` derives stable list-item field metadata from the prop name, component name, and current list items. `createLowcodeDefaultListItem(propName, options)` creates common starter rows for rule, coupon, navigation, image card, floor anchor, and store/expert list props.

`toLowcodePropInputText`, `toLowcodePropInputBoolean`, and `normalizeLowcodePropInputValue` provide the shared display and write-back conversion used by property panels. Number values are normalized as real numbers and clamped to optional manifest `min`/`max` bounds when present.

`normalizeLowcodeColorInputValue`, `isLowcodeHexColor`, `createLowcodeColorSwatches`, `getLowcodeNativeColorInputValue`, and `LOWCODE_EDITOR_DEFAULT_COLOR_SWATCHES` provide the shared color field model. Shells can combine native color inputs with text fallback and manifest `swatches` without losing CSS values such as `transparent` or `rgba(...)`.

These helpers do not render controls, open resource pickers, read DOM, save schema, or call Java APIs. Host shells remain responsible for Vue/React components, layout, validation feedback, resource libraries, permissions, audit, and persistence.

## Page Settings API

The page settings helpers keep Page Schema page-level editing reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`LOWCODE_EDITOR_PAGE_TYPE_OPTIONS`, `LOWCODE_EDITOR_PAGE_STATUS_OPTIONS`, `LOWCODE_EDITOR_PUBLISH_ENVIRONMENT_OPTIONS`, and `LOWCODE_EDITOR_PAGE_BACKGROUND_SWATCHES` define the default options currently used by editor shells.

`createLowcodePageSettingsForm(schema, options)` derives the page settings form model from Page Schema, including title, description, type, status, publish environment, background color, safe-area flag, max width, option lists, and background swatches.

`normalizeLowcodePageMaxWidth(value, options)` applies the shared H5 max-width guard. By default it accepts integer-rounded values from 320 to 960 and returns `undefined` for invalid input.

`updateLowcodePageTitle`, `updateLowcodePageDescription`, `updateLowcodePageStatus`, `updateLowcodePageType`, `updateLowcodePublishEnvironment`, `updateLowcodePageBackgroundColor`, `updateLowcodePageSafeArea`, and `updateLowcodePageMaxWidth` update `LowcodeEditorState` through the same immutable command style as node editing.

These helpers do not render forms, open color pickers, validate permissions, run publish approval, call Java APIs, persist schema, or lock collaborative edits. Host shells remain responsible for UI, permission states, review flows, audit records, and server-side validation.

## Data Source Config API

The data source config helpers keep Page Schema `dataSources` editing reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`LOWCODE_EDITOR_DEFAULT_DATA_SOURCE_TYPE_OPTIONS` defines the default editor data source templates for product, store, expert, and custom HTTP sources, including labels, default `bindTo`, default params, and cache hints.

`createLowcodeDefaultDataSourceParams(dataSourceType)`, `createLowcodeDataSourceConfig(dataSourceType, options)`, `formatLowcodeDataSourceParamsText(dataSource)`, `formatLowcodeDataSourceRecordLabel(record, pendingLabel)`, and `createLowcodeDataSourceFormItems(dataSources, options)` provide the shared model used by data source forms and preview-status panels.

`upsertLowcodeDataSourceConfigs` updates or appends one data source config by id. `addLowcodeDataSource`, `updateLowcodeDataSource`, and `removeLowcodeDataSource` update `LowcodeEditorState` through the same immutable command style as node editing.

These helpers do not parse textarea input, render forms, execute HTTP requests, resolve data, validate permissions, persist schema, or perform server review. Host shells remain responsible for UI, JSON parse errors, preview resolver execution, auth, caching, permissions, audit, and server-side data source validation.

## Action Config API

The action config helpers keep Page Schema `actions` editing reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`LOWCODE_EDITOR_DEFAULT_ACTION_TYPE_OPTIONS` defines the default editor action templates for `navigate`, `coupon.receive`, `tracking.click`, and `noop`, including labels and default params.

`createLowcodeDefaultActionParams(actionType)`, `createLowcodeActionConfig(actionType, options)`, `formatLowcodeActionParamsText(action)`, and `createLowcodeActionFormItems(actions, options)` provide the shared model used by action forms.

`addLowcodeAction`, `updateLowcodeAction`, `renameLowcodeAction`, `setLowcodeActionType`, and `removeLowcodeAction` update `LowcodeEditorState` through the same immutable command style as node editing. Renaming an action updates node event refs, and removing an action clears refs that pointed to the removed action.

These helpers do not parse textarea input, render forms, execute actions, call bridges, call coupon APIs, emit tracking events, validate permissions, persist schema, or perform server review. Host shells remain responsible for UI, JSON parse errors, permissions, audit, risk control, and runtime action handlers.

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

The version helpers keep local draft comparison and future Java config platform version audit screens on one summary contract.

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

## Release History API

The release history helpers keep local release lists, search, status labels, diff summaries, action messages, and rollback copy reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`formatLowcodeReleaseKindLabel(kind)` returns the default Chinese labels for `draft`, `preview`, and `published`, while preserving unknown kinds as-is.

`formatLowcodeReleaseTime(createdAt, options)` formats release timestamps with a shared default `zh-CN` short date/time format and returns `时间未知` for invalid input.

`createLowcodeReleaseListItem(release, options)` derives one display item from host-provided release metadata, including kind label, formatted time, selected state, normalized note, and search text.

`createLowcodeReleaseListItems(releases, options)` creates and filters release list items by keyword. Keyword matching covers title, page id, page version, kind, kind label, note, and formatted time.

`summarizeLowcodeReleaseList(total, visible, keyword)` returns the list count text and empty-state copy used by release panels.

`formatLowcodeVersionDiffSummary(changedCount)`, `createLowcodeReleaseMessage(release, action)`, `createLowcodePublishBlockedMessage(action, checks)`, `createLowcodeRollbackNote(release)`, and `createLowcodeRollbackConfirmText(release)` provide the shared copy currently used by release diff, publish blocking, action feedback, and rollback confirmation surfaces.

These helpers do not save drafts, create previews, publish pages, load releases, open runtime URLs, show confirmation dialogs, call Java APIs, perform service-side diff, validate permissions, or write audit records. Host shells remain responsible for storage, config platform clients, runtime URL construction, review flows, permissions, audit, and user-facing handlers.

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

`createLowcodeMaterialCatalogItem(manifest)` returns display and search metadata derived from a `LowcodeMaterialManifest`, including component name, title, category label, architecture layer, capability family, version, platforms, prop count, event count, data-source slot count, summary text, and search text.

`LOWCODE_EDITOR_MATERIAL_CATEGORY_META`, `getLowcodeMaterialCategoryMeta`, `createLowcodeMaterialCategorySummaries`, and `createLowcodeMaterialCatalogOverview` provide category labels, descriptions, active-category summaries, and count metadata for material panels.

`LOWCODE_EDITOR_MATERIAL_LAYER_META`, `LOWCODE_EDITOR_MATERIAL_FAMILY_META`, `LOWCODE_EDITOR_MATERIAL_COMPONENT_PROFILES`, `getLowcodeMaterialLayerMeta`, `getLowcodeMaterialFamilyMeta`, `createLowcodeMaterialArchitectureProfile`, and `createLowcodeMaterialArchitectureOverview` provide the editor-side material architecture model. They classify existing manifests into generic, business, or custom material layers and into capability families such as action, input, media, form, list, feedback, marketing, and commerce. This is editor metadata only; runtime primitives still stay outside material registries.

`LOWCODE_EDITOR_MATERIAL_INSERT_PRESETS`, `createLowcodeMaterialInsertPresets`, `findLowcodeMaterialInsertPreset`, and `createLowcodeMaterialNodeInputFromPreset` provide common insert variants for base materials. Presets merge `manifest.defaultProps` with preset props and can set a node `meta.name`; they do not change Page Schema or Material Manifest structure. Host shells can disable defaults per component with `componentPresets: { ComponentName: false }` or provide custom presets through the options object.

`createLowcodeMaterialCategories(manifests, allCategoryLabel)` returns a stable category list with `全部` by default.

`filterLowcodeMaterialCatalog(materials, options)` filters entries that contain a `manifest` field by category and keyword. Keyword matching covers title, component name, category, category label, architecture layer label, capability family label, version, and platforms.

`pickLowcodeMaterialEntriesByComponentNames(materials, componentNames)` resolves quick sections such as favorites or recent materials while preserving the provided component-name order and ignoring missing materials.

`formatLowcodeMaterialCatalogSummary(manifest)` returns card text such as `3 个配置 / 1 个事件 / 0 个数据槽`.

These helpers do not change Material Manifest, Page Schema, or renderer behavior.

## Material Preference API

The material preference helpers keep favorites and recent-material list rules reusable across editor shells.

`LOWCODE_EDITOR_RECENT_MATERIAL_DEFAULT_LIMIT` is `6`, matching the current recent-material quick section size.

`normalizeLowcodeMaterialComponentNames(componentNames, options)` removes empty names and duplicates, optionally filters unknown names through `availableComponentNames`, and applies an optional `limit`.

`parseLowcodeMaterialPreferenceContent(content, options)` parses JSON storage content into a normalized component-name list. Invalid JSON, non-array content, and non-string entries are ignored safely.

`isLowcodeFavoriteMaterial(componentNames, componentName)` checks whether a component name is currently favorited.

`toggleLowcodeFavoriteMaterial(componentNames, componentName, options)` adds a component name to the front of the favorites list or removes it when already present, then normalizes the result.

`recordLowcodeRecentMaterial(componentNames, componentName, options)` moves a component name to the front of the recent list, removes duplicates and unknown names, and defaults to `LOWCODE_EDITOR_RECENT_MATERIAL_DEFAULT_LIMIT`.

`createLowcodeMaterialFavoriteMessage(material, favorited)` returns the current Chinese favorite or unfavorite operation message.

These helpers do not read or write localStorage, call HTTP APIs, render UI, resolve users, sync devices, validate permissions, or write audit records. Host shells remain responsible for persistence, feedback display, user preference APIs, permissions, audit records, and preference migration.

## Material Detail API

The material detail helpers keep material detail dialogs, manifest inspection panels, and default H5 previews reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`createLowcodeMaterialDetailSummary(manifest)` returns the manifest metadata currently shown in detail surfaces: component name, title, category, version, platforms, platform text, prop count, event count, data-source slot count, and summary text.

`createLowcodeMaterialDetailPropEntries(manifest)` returns stable prop rows with name, label, type, setter, required state, description, and the original prop schema.

`createLowcodeMaterialDetailEventItems(manifest)` and `createLowcodeMaterialDetailDataSourceSlotItems(manifest)` normalize events and data-source slots for UI chips, including empty description defaults and joined accepted-type text.

`createLowcodeMaterialNodeInput(manifest, options)` creates a Page Schema node input from manifest defaults. It clones `defaultProps`, sets `meta.name` to the material title by default, and can attach host-provided data binding by component name or data-source slot name.

`createLowcodeMaterialPreviewSchema(manifest, options)` creates a valid single-node H5 Page Schema for material detail previews. The host can provide preview data sources, actions, environment, operator, layout sizing, and data-binding defaults.

These helpers do not render dialogs, mount React/Vue renderers, open resource pickers, add materials to the active canvas, persist preferences, validate permissions, call Java APIs, or handle material market publish states. Host shells remain responsible for UI, preview renderer selection, click handlers, permissions, audit records, and real preview data.

## Command Palette API

The command helpers keep editor-shell command palettes reusable across the Vue3 playground and future management-console shells.

`LOWCODE_EDITOR_COMMAND_DEFAULT_LIMIT` is `28`, matching the current command palette display size.

`createLowcodeEditorCommandSearchText(command)` derives searchable text from title, group, description, and keywords.

`filterLowcodeEditorCommands(commands, options)` filters command entries by keyword and display limit. Disabled commands are included by default so UI shells can show unavailable actions with disabled styling; hosts can pass `includeDisabled: false` when they need executable-only lists.

`groupLowcodeEditorCommands(commands)` groups filtered commands by their `group` value while preserving first-seen group order and item order.

These helpers do not execute commands, bind keyboard shortcuts, check permissions, or mutate editor state. Host shells remain responsible for `run` handlers, shortcuts such as `Meta/Ctrl + K`, confirmation dialogs, and user-facing feedback.

## Node Operation API

The node operation helpers keep context menus, canvas toolbars, node-card quick actions, shortcuts, and operation feedback reusable across editor shells.

`createLowcodeNodeOperationItems(options)` returns stable node operation items for rename, insert before, insert after, add inside, move up, move down, copy, paste, duplicate, and delete. Each item contains an action, label, optional shortcut text, disabled state, and danger state.

`resolveLowcodeNodeShortcutAction(event, options)` maps keyboard-like input to node shortcut actions. It covers Delete/Backspace, `Meta/Ctrl + C`, `Meta/Ctrl + V`, `Meta/Ctrl + D`, `Meta/Ctrl + Z`, `Meta/Ctrl + Shift + Z`, and `Ctrl + Y`.

`createLowcodeNodeOperationMessage(action, options)` returns the current Chinese operation feedback text for node actions and undo/redo.

These helpers do not execute node commands, bind DOM listeners, position menus, scroll canvases, show confirmation dialogs, check permissions, or mutate editor state. Host shells remain responsible for input-target guards, UI rendering, actual calls to `insertNode`, `removeNode`, `copyNode`, `pasteNode`, `duplicateNode`, `moveNodeById`, `undo`, `redo`, permissions, audit records, and service persistence.

## Outline Tree API

The outline helpers keep editor structure trees reusable across the Vue3 playground and future management-console shells.

`createLowcodeOutlineRows(nodes, options)` flattens nested Page Schema nodes into rows with depth, parent id, ancestor ids, sibling index, child state, display title, subtitle, and search text. Optional material manifests enrich titles, subtitles, categories, and keyword matching.

`createLowcodeOutlineRowSearchText(row)` returns searchable text derived from the row or its node.

`createLowcodeOutlineVisibility(rows, options)` calculates visible rows, matched node ids, visible node ids, selected-path node ids, and summary text from keyword, collapsed node ids, and selected node id.

`pruneLowcodeOutlineCollapsedNodeIds(collapsedNodeIds, rows)` removes collapsed ids that no longer point to nodes with children.

`revealLowcodeOutlineNode(nodeId, collapsedNodeIds, rows)` returns collapsed ids with the selected node ancestors expanded.

These helpers do not select nodes, scroll canvases, rename nodes, handle drag-and-drop, or check permissions. Host shells remain responsible for UI state, DOM behavior, and user-facing interactions.

## Node Selection API

The node selection helpers keep outline multi-select and same-parent group-drag state reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`toggleLowcodeNodeSelection(selectedNodeIds, nodeId)` toggles one node while keeping at least the toggled node selected. `pruneLowcodeNodeSelection(selectedNodeIds, availableNodeIds, options)` removes stale selected ids and can fall back to the current active node.

`pickLowcodeSelectedOutlineRows(rows, selectedNodeIds)`, `hasLowcodeSameParentSelection(rows)`, `createLowcodeNodeSelectionSummary(rows)`, and `createLowcodeNodeSelectionModel(rows, selectedNodeIds)` derive the selected outline rows, same-parent state, count, normalized selected ids, and display summary from outline rows.

`isLowcodeNodeSelected(selectedNodeIds, nodeId)`, `canLowcodeDragSelectedGroup(rows, selectedNodeIds, nodeId)`, and `getLowcodeSelectedGroupNodeIdsForDrag(rows, selectedNodeIds, seedNodeId)` provide stable predicates and drag candidate ids for host shells.

These helpers do not bind DOM events, handle Pointer Events, calculate drop positions, move nodes, render checkboxes, inspect permissions, write audit records, persist state, or modify Page Schema. Host shells remain responsible for Vue/React UI, actual drag/drop execution, node command execution, permission checks, collaboration locks, audit, and server saving.

## Canvas Drop Hint API

The canvas drop hint helpers keep drag placement, visual drop line, snap guide, append hint, and invalid node target rules reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`LOWCODE_EDITOR_DEFAULT_CANVAS_INSIDE_COMPONENT_NAMES` lists the built-in components that can accept inside drops. `isLowcodeEditorContainerComponentName(componentName, insideComponentNames)` lets host shells reuse the same container predicate for buttons, context menus, and drag/drop UI.

`resolveLowcodeCanvasDropPlacement(point, targetNode, targetRect, options)` derives `before`, `after`, or `inside` from the pointer Y position and target node rectangle. By default `SectionContainer`, `GridContainer`, and `BasicForm` can resolve to `inside`, using the middle 28%-72% vertical range.

`createLowcodeCanvasDropHintStyle(frame, targetRect, placement)` and `createLowcodeCanvasSnapGuides(frame, targetRect, placement)` derive DOM-free style maps from host-provided frame metrics and target rects. The host owns how those style maps are rendered.

`createLowcodeCanvasAppendDropHint(source)` and `createLowcodeCanvasTargetDropHint(options)` create stable hint models for append and target-node drops. `isLowcodeInvalidNodeDropTarget(nodes, draggedNodeId, targetNodeId)` prevents dragging a node onto itself or any of its descendants.

These helpers do not query DOM nodes, bind DragEvent or Pointer Events, scroll canvases, insert materials, move nodes, render guide elements, inspect permissions, write audit records, persist state, or modify Page Schema. Host shells remain responsible for event handling, element measurement, actual insert/move commands, group move execution, permission checks, collaboration locks, audit, and server saving.

## Canvas Drop Target API

The canvas drop target helpers keep `parentId + index` derivation reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`createLowcodeCanvasDropTarget(rows, hint, rootNodeCount)` derives the base target for append, inside, before, and after drops from outline rows and a canvas drop hint.

`getLowcodeCanvasAdjacentDropIndex(targetIndex, placement)` exposes the before/after index rule. `getLowcodeAdjustedCanvasMoveIndex(sourceRow, targetRow, placement)` adjusts single-node moves within the same parent so the target index remains correct after the source node is removed.

`createLowcodeCanvasNodeMoveTarget(rows, hint, sourceNodeId, rootNodeCount)` derives a single-node move target. `createLowcodeCanvasGroupMoveTarget(rows, hint, sourceNodeIds, rootNodeCount)` derives a same-parent group move target and adjusts the target index after removing selected source nodes.

These helpers do not insert materials, move nodes, replace siblings, mutate Page Schema, query DOM, bind events, check permissions, write audit records, persist state, or handle cross-parent group move semantics. Host shells remain responsible for actual schema commands, group move execution, permission checks, collaboration locks, audit, and server saving.

## Canvas Operation API

The canvas operation helpers keep schema writes for material drops and node drops reusable across the Vue3 playground, future Java management-console shells, and independent editor shells.

`insertLowcodeCanvasNodeByHint(state, rows, hint, node)` resolves a canvas drop target from outline rows and inserts a node through the existing editor command pipeline. It returns `{ state, handled, changed }`, so host shells can distinguish a successful state change from a handled no-op.

`moveLowcodeCanvasNodeByHint(state, rows, hint, nodeId)` resolves a single-node move target and delegates the actual write to `moveNodeById`, including self/descendant no-op protection.

`moveLowcodeCanvasNodeGroupByHint(state, rows, hint, nodeIds)` moves a same-parent selected node group while preserving sibling order. It treats dropping onto a selected target or invalid descendant parent as handled no-op, and returns `handled: false` when the provided selection is not a valid same-parent group.

These helpers do not query DOM, bind DragEvent or Pointer Events, render guide elements, inspect permissions, write audit records, persist state, confirm destructive actions, or save to the server. Host shells remain responsible for event handling, element measurement, user feedback, permission checks, collaboration locks, audit, and server saving.

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
