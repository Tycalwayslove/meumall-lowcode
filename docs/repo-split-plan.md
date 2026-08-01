# Repo Split Plan

## Keep Together Initially

During the first architecture and MVP phase, keep all packages in this monorepo. This avoids premature repository fragmentation while package boundaries are still changing.

## Split Triggers

Consider splitting only when one of these becomes true:

- `schema/core` needs independent lifecycle and strict governance.
- runtime primitives API becomes stable and is reused by multiple material groups.
- `materials-h5` changes much more frequently than core packages.
- editor becomes a full product with its own release cadence.
- mini-program renderer requires a separate team and CI.

## Future Split Targets

```text
meumall-lowcode-contracts
  -> schema
  -> core

meumall-lowcode-h5
  -> design-tokens
  -> primitives-react-h5
  -> primitives-vue-h5
  -> renderer-h5
  -> materials-h5
  -> adapters

meumall-lowcode-editor
  -> editor app/package

meumall-lowcode-miniapp
  -> renderer-miniapp
  -> materials-miniapp
```

## Split Rule

Only split after npm package boundaries are stable. Do not split by folder before package APIs are stable.

`@meumall/lowcode-design-tokens`, `@meumall/lowcode-primitives-react-h5`, and `@meumall/lowcode-primitives-vue-h5` have been introduced as public packages below materials. Keep them in this monorepo until npm publishing, ownership, CI, and version cadence are stable; split repositories only after the package APIs are proven. See `docs/material-layering-architecture.md`.
