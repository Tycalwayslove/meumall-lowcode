# @meumall/lowcode-core

Framework-agnostic runtime helpers: material registry, traversal, prop binding, visibility, and action dispatch contracts.

## Runtime Context

`createRuntimeContext(schema, data, event?)` creates the action execution context shared by renderers and adapters.

- `schema`: the current `LowcodePageSchema`.
- `data`: resolved runtime data.
- `actions`: schema actions indexed by id.
- `event`: optional material event payload, for example a `BasicForm.onSubmit` payload.

The optional `event` field is runtime-only. It does not change Page Schema v1 or Material Manifest v1.
