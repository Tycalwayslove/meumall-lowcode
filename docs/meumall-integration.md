# MeuMall Integration

## H5 Integration Shape

`hybird-meumall` should consume packages, not copy source files.

```tsx
import { LowcodeRenderer } from "@meumall/lowcode-renderer-h5";
import { h5Materials } from "@meumall/lowcode-materials-h5";
import { createMaterialRegistry } from "@meumall/lowcode-core";

const registry = createMaterialRegistry(h5Materials);

<LowcodeRenderer schema={schema} registry={registry} />
```

## Suggested Routes

```text
/activity/[pageId]
/landing/[pageId]
/preview/lowcode/[draftId]
```

## Java API Contracts Needed

```text
GET /platform/lowcode/pages/{pageId}/published
GET /platform/lowcode/pages/{draftId}/preview
POST /platform/lowcode/pages/{pageId}/track
```

## Rendering Rules

- Published pages must not fall back to mock data.
- Preview pages may use preview schema, but real API environment must be explicit.
- Missing material renders component-level error state.
- Schema version mismatch renders page-level incompatible state.

