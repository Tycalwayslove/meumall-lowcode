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
