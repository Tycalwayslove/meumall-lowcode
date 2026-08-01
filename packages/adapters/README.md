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

Handlers receive the action config plus safe context containing the action ref, runtime data, and page schema. Unknown action ids or unknown action types throw controlled errors, which the host can capture through `onError`.

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

For `POST` handlers, the default JSON body contains `actionId`, `type`, `params`, `refParams`, and `pageId`. For `GET` handlers, the same payload is converted to query parameters by default. Hosts can override request shape with `buildQuery` or `buildBody`, and can inspect successful responses with `transformResponse`.

The endpoint is provided by host code, not by Page Schema. This keeps operators from configuring arbitrary request URLs while still letting H5 hosts connect approved `action.type` values to route bridges, coupon APIs, tracking services, permission checks, or risk-control gateways. Async handler failures are reported through `createSafeActionExecutor(..., { onError })`.

## Config Platform Client

`LowcodeConfigPlatformClient` describes the editor-facing draft, preview, publish, release-list, draft-query, and published-query API.

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

`createHttpConfigPlatformClient` is a reference HTTP implementation for the Java config platform contract:

- `POST /api/lowcode/pages/drafts`
- `POST /api/lowcode/pages/previews`
- `POST /api/lowcode/pages/releases`
- `GET /api/lowcode/pages/releases`
- `GET /api/lowcode/pages/releases/{releaseId}`
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
