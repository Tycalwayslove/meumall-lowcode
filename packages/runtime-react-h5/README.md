# @meumall/lowcode-runtime-react-h5

React H5 host package for MeuMall low-code pages.

This package composes the public runtime packages that a real H5 consumer usually needs:

- `@meumall/lowcode-adapters`
- `@meumall/lowcode-core`
- `@meumall/lowcode-renderer-h5`
- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-schema`

It does not replace the renderer, materials, schema, or adapter contracts. It only keeps React H5 host glue code out of business projects.

## Utilities

- `createDefaultReactH5MaterialRegistry(extraMaterials?)`
- `countLowcodeReactH5RuntimeNodes(schema)`
- `createLowcodeReactH5RuntimeViewModel(input)`
- `useLowcodeReactH5Runtime(options)`
- `LowcodeReactH5Runtime`

## Example

```tsx
const runtime = useLowcodeReactH5Runtime({
  runtimeInput: {
    pageId: "summer-campaign",
    configPlatformClient,
    fallbackSchema,
  },
  dataSourceRegistry,
  actionExecutor,
});

return (
  <>
    <LowcodeReactH5Runtime runtime={runtime} />
    <RuntimeDiagnostics summary={runtime.healthSummary} />
  </>
);
```

`useLowcodeReactH5Runtime` loads schema with `loadLowcodeRuntimeSchema`, resolves `schema.dataSources` through the provided data source registry, validates the schema, counts nodes, records render errors, and returns the shared adapters runtime health summary.

For custom business materials, pass them to `createDefaultReactH5MaterialRegistry(extraMaterials)` or to `LowcodeReactH5Runtime` through the `registry` prop.
