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

## Compatibility Rules

- `schema` major bumps require migration notes.
- `renderer-h5` must support at least the latest published schema major.
- `materials-h5` can release faster than renderer, but each material must declare its own version.
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
