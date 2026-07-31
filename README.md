# MeuMall Lowcode

MeuMall low-code monorepo for H5 activity pages, promotion pages, product topic pages, and future mini-program rendering.

This repository is intentionally structured as a single source of truth first, with clean npm package boundaries so packages can later be published or split into independent GitHub repositories.

## Goals

- Keep all low-code source code in one workspace during the early architecture phase.
- Define a stable Page Schema contract shared by editor, renderer, Java config platform, and future mini-program runtime.
- Package H5 runtime capabilities as reusable npm packages.
- Keep business materials versioned and publishable.
- Prepare GitHub retention, npm release, and future repo split paths from day one.

## Package Map

```text
packages/schema        @meumall/lowcode-schema
packages/core          @meumall/lowcode-core
packages/renderer-h5   @meumall/lowcode-renderer-h5
packages/materials-h5  @meumall/lowcode-materials-h5
packages/editor        @meumall/lowcode-editor
packages/adapters      @meumall/lowcode-adapters
```

## Architecture

Read [docs/architecture.md](docs/architecture.md) first.

```text
Java config platform
  -> draft / preview / published Page Schema
  -> H5 renderer consumes published schema

@meumall/lowcode-schema
  -> shared TypeScript contract and validation

@meumall/lowcode-core
  -> material registry, traversal, binding, runtime helpers

@meumall/lowcode-renderer-h5
  -> React H5 renderer used by hybird-meumall

@meumall/lowcode-materials-h5
  -> MeuMall H5 business materials

@meumall/lowcode-editor
  -> editor state, canvas protocol, and future UI shell
```

## Local Development

```bash
pnpm install
pnpm typecheck
pnpm build
```

## Release

See [docs/release-and-publish.md](docs/release-and-publish.md).

