# Release And Publish

## Current Strategy

Keep one GitHub repository during early development:

```text
git@github.com:Tycalwayslove/meumall-lowcode.git
```

Publish multiple npm packages from the monorepo:

```text
@meumall/lowcode-schema
@meumall/lowcode-core
@meumall/lowcode-renderer-h5
@meumall/lowcode-materials-h5
@meumall/lowcode-renderer-vue-h5
@meumall/lowcode-materials-vue-h5
@meumall/lowcode-editor
@meumall/lowcode-adapters
```

## Package Access

Default to public npm packages. If the company requires private distribution, switch `.npmrc` and package publish config to the company registry.

## Versioning

Use Changesets.

```bash
pnpm changeset
pnpm version-packages
pnpm publish-packages
```

Current `.changeset/config.json` links all 8 publishable packages in one version group. A changeset may name a single package, but a later `pnpm version-packages` can still align versions across the linked group. Do not run `pnpm version-packages` until the release owner confirms the intended multi-package version result.

## Local Dry Run

Before publishing, build packages and verify the actual npm package contents:

```bash
pnpm build
pnpm pack:dry-run
```

`pnpm pack:dry-run` scans publishable packages under `packages/*`, runs `npm pack --dry-run --json` in each package, and checks that every package contains at least:

- `package.json`
- `README.md`
- `dist/index.js`
- `dist/index.d.ts`

This dry-run does not publish packages and does not require an npm token. Real publishing still requires confirming registry, access, npm token, and changeset versions.

## Compatibility Rules

- `schema` major bumps require migration notes.
- `renderer-h5` must support at least the latest published schema major.
- `materials-h5` can release faster than renderer, but each material must declare its own version.
- `renderer-vue-h5` and `materials-vue-h5` are the preferred stack for the Vue3 management editor preview.
- Published pages must store material versions used at publish time.

## GitHub Retention

Before first publish:

1. Initialize git.
2. Push to GitHub.
3. Protect `main`.
4. Require typecheck/build in PR.
5. Tag npm release commits.

Suggested tags:

```text
schema-v1.0.0
core-v1.0.0
renderer-h5-v1.0.0
materials-h5-v1.0.0
```

Changesets can also create package-level tags depending on release setup.

## CI Plan

Initial GitHub Actions should run:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
```

Publish workflow can be added after npm token and registry are confirmed.
