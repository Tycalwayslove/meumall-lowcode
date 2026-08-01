# @meumall/lowcode-adapters

Registries for safe, whitelisted actions and data sources.

Do not expose arbitrary API URLs or arbitrary JavaScript to operators.

Utilities:

- `createDataSourceRegistry`
- `resolveLowcodeDataSources`
- `createHttpDataSourceHandler`
- `createSafeActionRegistry`
- `createSafeActionExecutor`
- `createHttpActionHandler`
- `createHttpConfigPlatformClient`
- `createStaticResourceLibraryClient`
- `createStaticTemplateLibraryClient`
- `encodePageSchemaToUrlParam`
- `decodePageSchemaFromUrlParam`
- `loadLowcodeRuntimeSchema`
- `createLowcodeRuntimeHealthSummary`

## Data Source Resolver

Hosts should register whitelisted handlers by `dataSource.type`, then call `resolveLowcodeDataSources` with `schema.dataSources`.

The resolver returns:

- `data`: a merged runtime data object for renderer `data`.
- `records`: per-data-source status for editor/runtime diagnostics.

Resolution errors are captured into `records` and do not throw to the page layer by default, so a broken data source should not cause the whole H5 page to white screen.

`createHttpDataSourceHandler(options)` creates a reusable handler for whitelisted HTTP-backed data source types.

```ts
const registry = createDataSourceRegistry({
  "product.byIds": createHttpDataSourceHandler({
    baseUrl: "https://bff.example.com",
    endpoint: "/api/lowcode/products/by-ids",
    responseDataPath: "data.items",
    headers: { authorization: "Bearer token" },
  }),
});
```

For `GET` handlers, `config.params` is converted to query parameters by default. For `POST` handlers, `config.params` is sent as the JSON body by default. Hosts can override this with `buildQuery`, `buildBody`, `responseDataPath`, or `transformResponse`.

The endpoint is provided by host code, not by Page Schema. This keeps operators from configuring arbitrary request URLs while still letting Java BFF/resource services expose real product, coupon, activity, store, or expert data behind approved `dataSources[].type` values.

## Safe Action Executor

Hosts should register whitelisted handlers by `action.type`, then pass `createSafeActionExecutor(registry)` to the renderer `actionExecutor` prop.

Recommended action types for the first integration stage:

- `navigate`: controlled H5 route or URL navigation.
- `coupon.receive`: controlled coupon receive flow.
- `tracking.click`: controlled click tracking.
- `noop`: explicit no-op for drafts and demos.

Handlers receive the action config plus safe context containing the action ref, runtime data, page schema, and optional material event payload as `event`. Unknown action ids or unknown action types throw controlled errors, which the host can capture through `onError`.

`createHttpActionHandler(options)` creates a reusable handler for whitelisted HTTP-backed action types.

```ts
const registry = createSafeActionRegistry({
  "tracking.click": createHttpActionHandler({
    baseUrl: "https://bff.example.com",
    endpoint: "/api/lowcode/actions/tracking-click",
    headers: { authorization: "Bearer token" },
  }),
});
```

For `POST` handlers, the default JSON body contains `actionId`, `type`, `params`, `refParams`, `pageId`, and `event` when the runtime event payload exists. For `GET` handlers, the same payload is converted to query parameters by default. Hosts can override request shape with `buildQuery` or `buildBody`, and can inspect successful responses with `transformResponse`.

The endpoint is provided by host code, not by Page Schema. This keeps operators from configuring arbitrary request URLs while still letting H5 hosts connect approved `action.type` values to route bridges, coupon APIs, tracking services, permission checks, or risk-control gateways. Async handler failures are reported through `createSafeActionExecutor(..., { onError })`.

## Config Platform Client

`LowcodeConfigPlatformClient` describes the editor-facing draft, preview, publish, release-list, preview-token-query, draft-query, and published-query API.

`saveDraft(schema, metadata)`, `createPreview(schema, metadata)`, and `publishPage(schema, metadata)` accept optional release metadata. The current metadata shape is intentionally small and backwards-compatible:

- `note`: operator-facing release note.
- `operator`: current operator info for audit and platform-side permission checks.

It also contains optional editor workflow methods for Java management-console integration:

- `getEditorWorkflowState(pageId)`
- `acquireEditorLock(input)`
- `refreshEditorLock(input)`
- `releaseEditorLock(input)`
- `submitApproval(input)`
- `cancelApproval(input)`
- `reviewApproval(input)`

It also contains optional editor draft snapshot methods for autosave recovery. These snapshots are editor recovery points, not release history entries:

- `saveEditorDraftSnapshot(input)`
- `getEditorDraftSnapshot(pageId)`

For H5 preview runtime integration, the client can expose `getPreviewByToken(previewToken)`. This returns a preview `PageRelease` for preview validation links and must not be treated as the active published page.

`createHttpConfigPlatformClient` is a reference HTTP implementation for the Java config platform contract:

- `POST /api/lowcode/pages/drafts`
- `POST /api/lowcode/pages/previews`
- `POST /api/lowcode/pages/releases`
- `GET /api/lowcode/pages/releases`
- `GET /api/lowcode/pages/releases/{releaseId}`
- `GET /api/lowcode/pages/previews/{previewToken}`
- `GET /api/lowcode/pages/{pageId}/draft`
- `GET /api/lowcode/pages/{pageId}/published`
- `GET /api/lowcode/pages/{pageId}/workflow`
- `POST /api/lowcode/pages/{pageId}/locks/acquire`
- `POST /api/lowcode/pages/{pageId}/locks/refresh`
- `POST /api/lowcode/pages/{pageId}/locks/release`
- `POST /api/lowcode/pages/{pageId}/approval/submit`
- `POST /api/lowcode/pages/{pageId}/approval/cancel`
- `POST /api/lowcode/pages/{pageId}/approval/review`
- `PUT /api/lowcode/pages/{pageId}/editor-draft-snapshot`
- `GET /api/lowcode/pages/{pageId}/editor-draft-snapshot`

The Vue editor playground currently uses a localStorage implementation of the same client interface, so real Java integration should replace only the client instance rather than the editor workflow.

The Vue editor playground can also switch to the HTTP implementation by setting:

- `VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL`
- `VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION` (optional)

Adapters intentionally do not import `@meumall/lowcode-editor`. Host shells should map `ConfigPlatformEditorWorkflowState.lock` into `createLowcodeEditorCollaborationState` and `ConfigPlatformEditorWorkflowState.approval` into `createLowcodeEditorApprovalState`, then merge those permission options with role/menu permissions.

## Runtime Schema Loader

`loadLowcodeRuntimeSchema(input)` keeps H5 schema loading in the adapter layer instead of the renderer. It currently resolves sources in this order:

1. `encodedSchema`
2. `previewToken`
3. `releaseId`
4. `pageId`
5. `fallbackSchema`

The result contains `schema`, `source`, and optional `error`. `source = "preview"` means the schema was loaded through `getPreviewByToken`. Production H5 routes should use `previewToken` only for preview validation; normal activity pages should still load the active published schema by `pageId`.

## Runtime Health Summary

`createLowcodeRuntimeHealthSummary(input)` converts H5 runtime signals into a framework-agnostic diagnostic model. Hosts can pass the output directly to React, Vue, mini-program, logs, or monitoring adapters.

Recommended inputs:

- `schema`, `source`, and `sourceError` from `loadLowcodeRuntimeSchema`.
- `validationValid` and `validationErrors` from `validateLowcodePageSchema`.
- `nodeCount` from the host runtime tree walker.
- `dataSourceRecords` from `resolveLowcodeDataSources`.
- `actionLogCount` and `renderErrors` from the host shell.

The summary returns:

- `level`: `loading`, `healthy`, `warning`, or `error`.
- `title`, `description`, and `statusText` for operator-facing diagnostics.
- `items`: source, schema, node, data-source, action, and render checks.
- `priorityItems`: checks that need attention, ordered by the fixed runtime checklist.

Fallback sources, empty pages, skipped/failed data sources, and material render fallbacks are treated as `warning`; invalid or missing schema is treated as `error`.

## Resource Library Client

`LowcodeResourceLibraryClient` describes editor-facing resource search for image assets, video assets, products, coupons, stores, and experts:

- `searchImageAssets(query)`
- `searchVideoAssets(query)`
- `searchProducts(query)`
- `searchCoupons(query)`
- `searchStoreExperts(query)`

The first integration stage supports:

- keyword search by id/title/category/tags/description.
- image and video asset category filtering.
- store/expert type filtering through `category`.
- tag and id filtering.
- result limiting.

`createStaticResourceLibraryClient` is the local mock implementation used by the Vue editor playground. Real Java/resource-center integration should provide the same client shape for image assets, video assets, products, coupons, stores, and experts while keeping UI logic unchanged.

## Template Library Client

`LowcodeTemplateLibraryClient` describes editor-facing page template search:

- `searchTemplates(query)`
- `getTemplate(id)`

The first integration stage supports:

- keyword search by id/title/description/category/tags/version.
- category filtering.
- status filtering for `draft`, `published`, and `archived`.
- tag and id filtering.
- result limiting.

`createStaticTemplateLibraryClient` is the local implementation used by the Vue editor playground. It clones template schemas before returning them, so applying a template to a page will not mutate the template source. Real Java template-market integration should provide the same client shape and keep editor UI logic unchanged.
