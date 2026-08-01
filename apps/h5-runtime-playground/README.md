# @meumall/lowcode-h5-runtime-playground

React H5 runtime playground for MeuMall low-code pages.

This app consumes:

- `@meumall/lowcode-renderer-h5`
- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-core`
- `@meumall/lowcode-schema`
- `@meumall/lowcode-adapters`

It exists to prove that a published Page Schema can be rendered by the H5 runtime package independently from the Vue3 editor playground.

For the real `hybird-meumall` integration checklist, read:

- `docs/meumall-integration.md`
- `.ai-workspace/contracts/h5-runtime-integration-v1.md`

## Commands

```bash
pnpm --filter @meumall/lowcode-h5-runtime-playground dev
pnpm --filter @meumall/lowcode-h5-runtime-playground typecheck
pnpm --filter @meumall/lowcode-h5-runtime-playground build
```

Default local URL:

```text
http://localhost:5174/
```

## Runtime Inputs

The playground supports the same loading priority used by `loadLowcodeRuntimeSchema`:

```text
http://localhost:5174/?schema={encoded_page_schema}
http://localhost:5174/?pageId=summer-campaign-demo
http://localhost:5174/?releaseId=preview_demo
http://localhost:5174/?pageId=missing-page
http://localhost:5174/?demo=empty
http://localhost:5174/?demo=broken
```

- `schema` simulates editor URL handoff and is only for local demos or debugging.
- `pageId=summer-campaign-demo` loads the local published schema through a `LowcodeConfigPlatformClient` mock.
- `releaseId=preview_demo` loads the local preview release schema through the same client mock.
- Unknown `pageId` or `releaseId` values fall back to the local sample schema and show the fallback reason.
- `demo=empty` renders an empty Page Schema to verify the H5 runtime empty state does not white-screen.
- `demo=broken` renders an unknown material and a throwing local material to verify renderer-level local fallback does not white-screen.

The left diagnostics panel shows the requested entry, effective schema source, config platform mode, data source mode, page id, page version, schema validation, node count, data source status, action logs, and local entry shortcuts.

## Config Platform Client

By default the playground uses the local mock config platform client. To point the H5 runtime at a Java config platform while keeping the renderer/materials unchanged:

```bash
VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL=http://localhost:8080 \
VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION="Bearer token" \
pnpm --filter @meumall/lowcode-h5-runtime-playground dev
```

- `VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL` enables `createHttpConfigPlatformClient`.
- `VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION` is optional and is forwarded as the `authorization` header.
- The diagnostics panel shows `配置平台: local mock` or `配置平台: http <baseUrl>`.

## Data Source Client

By default the playground resolves `schema.dataSources` with local sample handlers. To point `product.byIds` at an HTTP BFF endpoint while keeping Page Schema unchanged:

```bash
VITE_LOWCODE_DATA_SOURCE_BASE_URL=http://localhost:8080 \
VITE_LOWCODE_DATA_SOURCE_AUTHORIZATION="Bearer token" \
pnpm --filter @meumall/lowcode-h5-runtime-playground dev
```

- `VITE_LOWCODE_DATA_SOURCE_BASE_URL` enables `createHttpDataSourceHandler` for `product.byIds`.
- `VITE_LOWCODE_DATA_SOURCE_AUTHORIZATION` is optional and is forwarded as the `authorization` header.
- The diagnostics panel shows `数据源模式: local sample` or `数据源模式: http <baseUrl>`.
- The current reference endpoint is `GET /api/lowcode/data/products/by-ids`.
- Page Schema only stores `type`, `params`, and `bindTo`; real endpoint paths stay in host code/env.

## Visual Smoke

The repository root provides a local visual smoke command:

```bash
pnpm smoke:visual
```

It starts the Vue3 editor playground, starts this React H5 runtime playground, opens Chrome headless, captures editor / published pageId / preview releaseId screenshots, and writes a local report to:

```text
.ai/test-reports/latest-visual/index.md
```

The generated report and screenshots are local verification artifacts and are not committed.
