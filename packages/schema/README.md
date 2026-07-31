# @meumall/lowcode-schema

Shared Page Schema contract for editor, renderer, Java config platform, and future mini-program runtime.

This package must stay framework-agnostic.

## Main Exports

- `LOWCODE_SCHEMA_VERSION`
- `createLowcodePageSchema`
- `normalizeLowcodePageSchema`
- `validateLowcodePageSchema`
- `assertLowcodePageSchema`
- `isSchemaVersionCompatible`
- `createLowcodeNode`
- `createMaterialManifest`
- `validateLowcodeMaterialManifest`
- `assertLowcodeMaterialManifest`

## Contract

Current ready contracts:

- `.ai-workspace/contracts/page-schema-v1.md`
- `.ai-workspace/contracts/material-manifest-v1.md`
