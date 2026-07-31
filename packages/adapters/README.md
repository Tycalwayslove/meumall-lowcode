# @meumall/lowcode-adapters

Registries for safe, whitelisted actions and data sources.

Do not expose arbitrary API URLs or arbitrary JavaScript to operators.

Utilities:

- `createDataSourceRegistry`
- `resolveLowcodeDataSources`
- `createSafeActionRegistry`
- `encodePageSchemaToUrlParam`
- `decodePageSchemaFromUrlParam`

## Data Source Resolver

Hosts should register whitelisted handlers by `dataSource.type`, then call `resolveLowcodeDataSources` with `schema.dataSources`.

The resolver returns:

- `data`: a merged runtime data object for renderer `data`.
- `records`: per-data-source status for editor/runtime diagnostics.

Resolution errors are captured into `records` and do not throw to the page layer by default, so a broken data source should not cause the whole H5 page to white screen.
