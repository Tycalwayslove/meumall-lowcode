# @meumall/lowcode-adapters

Registries for safe, whitelisted actions and data sources.

Do not expose arbitrary API URLs or arbitrary JavaScript to operators.

Utilities:

- `createDataSourceRegistry`
- `resolveLowcodeDataSources`
- `createSafeActionRegistry`
- `createSafeActionExecutor`
- `createHttpConfigPlatformClient`
- `createStaticResourceLibraryClient`
- `encodePageSchemaToUrlParam`
- `decodePageSchemaFromUrlParam`

## Data Source Resolver

Hosts should register whitelisted handlers by `dataSource.type`, then call `resolveLowcodeDataSources` with `schema.dataSources`.

The resolver returns:

- `data`: a merged runtime data object for renderer `data`.
- `records`: per-data-source status for editor/runtime diagnostics.

Resolution errors are captured into `records` and do not throw to the page layer by default, so a broken data source should not cause the whole H5 page to white screen.

## Safe Action Executor

Hosts should register whitelisted handlers by `action.type`, then pass `createSafeActionExecutor(registry)` to the renderer `actionExecutor` prop.

Recommended action types for the first integration stage:

- `navigate`: controlled H5 route or URL navigation.
- `coupon.receive`: controlled coupon receive flow.
- `tracking.click`: controlled click tracking.
- `noop`: explicit no-op for drafts and demos.

Handlers receive the action config plus safe context containing the action ref, runtime data, and page schema. Unknown action ids or unknown action types throw controlled errors, which the host can capture through `onError`.

## Config Platform Client

`LowcodeConfigPlatformClient` describes the editor-facing draft, preview, publish, release-list, draft-query, and published-query API.

`createHttpConfigPlatformClient` is a reference HTTP implementation for the Java config platform contract:

- `POST /api/lowcode/pages/drafts`
- `POST /api/lowcode/pages/previews`
- `POST /api/lowcode/pages/releases`
- `GET /api/lowcode/pages/releases`
- `GET /api/lowcode/pages/releases/{releaseId}`
- `GET /api/lowcode/pages/{pageId}/draft`
- `GET /api/lowcode/pages/{pageId}/published`

The Vue editor playground currently uses a localStorage implementation of the same client interface, so real Java integration should replace only the client instance rather than the editor workflow.

## Resource Library Client

`LowcodeResourceLibraryClient` describes editor-facing resource search for assets and products:

- `searchImageAssets(query)`
- `searchProducts(query)`

The first integration stage supports:

- keyword search by id/title/category/tags/description.
- image asset category filtering.
- tag and id filtering.
- result limiting.

`createStaticResourceLibraryClient` is the local mock implementation used by the Vue editor playground. Real Java/resource-center integration should provide the same client shape and keep UI logic unchanged.
