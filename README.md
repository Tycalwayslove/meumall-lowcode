# MeuMall Lowcode

MeuMall low-code monorepo for H5 activity pages, promotion pages, product topic pages, and future mini-program rendering.

This repository is intentionally structured as a single source of truth first, with clean npm package boundaries so packages can later be published or split into independent GitHub repositories.

## AI Workflow

This repository keeps AI and human collaboration rules in [`.ai-workspace/README.md`](.ai-workspace/README.md).

Before formal architecture, schema, package, release, GitHub, npm, CI, or cross-system work, read root [AGENTS.md](AGENTS.md) and the `.ai-workspace` files in the documented order. Long-lived project facts are stored in [`.ai/PROJECT_STATE.md`](.ai/PROJECT_STATE.md), [`.ai/AI_CONTEXT.md`](.ai/AI_CONTEXT.md), and [`.ai/TODO.md`](.ai/TODO.md).

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
packages/renderer-vue-h5   @meumall/lowcode-renderer-vue-h5
packages/materials-vue-h5  @meumall/lowcode-materials-vue-h5
packages/editor        @meumall/lowcode-editor
packages/adapters      @meumall/lowcode-adapters
apps/editor-playground Vue3 editor playground
apps/h5-runtime-playground React H5 runtime playground
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
  -> React H5 business materials

@meumall/lowcode-renderer-vue-h5
  -> Vue 3 H5 renderer used by editor preview and Vue management integration

@meumall/lowcode-materials-vue-h5
  -> Vue 3 H5 business materials

@meumall/lowcode-editor
  -> editor state, canvas protocol, and future UI shell

apps/editor-playground
  -> runnable Vue3 editor playground
  -> includes local page templates for common activity pages

apps/h5-runtime-playground
  -> runnable React H5 runtime playground
  -> accepts editor handoff URL: http://localhost:5174/?schema=...
```

## Local Development

```bash
pnpm install
pnpm dev
pnpm dev:h5
pnpm dev:demo
pnpm demo:check
pnpm demo:acceptance
pnpm check:architecture
pnpm test
pnpm typecheck
pnpm build
pnpm smoke:browser
pnpm smoke:visual
```

`pnpm check:architecture` always checks package shape, dependency direction, source imports, and React/Vue material name parity. After `pnpm build`, it also imports the public dist entries and verifies editor material insert presets against React/Vue H5 material manifests. `pnpm test` runs build before the architecture check, so the full guardrail is covered there.

`pnpm smoke:visual` writes a local report under `.ai/test-reports/latest-visual/` and checks screenshot PNG size, sampled colors, and luma range to catch blank editor or H5 renders.

`pnpm dev:demo` starts the Vue3 editor playground and React H5 runtime playground together, then injects `VITE_REACT_H5_RUNTIME_URL` into the editor. The default URLs are:

```text
Editor: http://127.0.0.1:5173/
Editor runtime pageId: http://127.0.0.1:5173/?runtime=1&pageId=summer-campaign-demo
Editor runtime previewToken: http://127.0.0.1:5173/?runtime=1&previewToken=preview_demo_token
H5 runtime: http://127.0.0.1:5174/
Published pageId: http://127.0.0.1:5174/?pageId=summer-campaign-demo
Preview releaseId: http://127.0.0.1:5174/?releaseId=preview_demo
Preview token: http://127.0.0.1:5174/?previewToken=preview_demo_token
```

Use `LOWCODE_EDITOR_PORT`, `LOWCODE_H5_PORT`, or `LOWCODE_DEMO_HOST` to change local ports or host. `pnpm demo:check` starts both servers, checks the basic editor and H5 runtime entries over HTTP, and exits automatically. `pnpm demo:acceptance` checks the full local demo entry list, including editor runtime pageId/previewToken and React H5 runtime pageId/releaseId/previewToken, then prints an acceptance checklist and exits. Browser DOM, interaction, and material rendering checks remain covered by `pnpm smoke:browser`.

## Release

See [docs/release-and-publish.md](docs/release-and-publish.md).
