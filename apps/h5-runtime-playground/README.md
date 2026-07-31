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
http://localhost:5174/?demo=empty
```

- `schema` simulates editor URL handoff and is only for local demos or debugging.
- `pageId` and `releaseId` demonstrate the production entry shape. In this playground there is no Java config platform client, so the page falls back to the local sample schema and shows the fallback reason.
- `demo=empty` renders an empty Page Schema to verify the H5 runtime empty state does not white-screen.

The left diagnostics panel shows the requested entry, effective schema source, page id, page version, schema validation, node count, data source status, action logs, and local entry shortcuts.
