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

## Local Mock Flow

当前 Vue3 playground 先用 `apps/editor-playground/src/mockPlatform.ts` 模拟 Java 配置平台：

- `saveDraft(schema)`：保存草稿版本，并更新 pageId -> draft release 索引。
- `createPreview(schema)`：生成一次性预览版本，编辑器可打开 `?runtime=1&releaseId=...`。
- `publishPage(schema)`：生成 published 版本，并更新 pageId -> published release 索引。
- `getPublished(pageId)`：模拟 H5 运行态读取已发布页面。

独立 H5 runtime 入口：

```text
/?runtime=1&pageId=summer-campaign-demo
/?runtime=1&releaseId=preview_xxx
```

后续替换真实 Java API 时，优先保持编辑器侧调用语义不变，把 localStorage 实现替换为 HTTP adapter。

## Rendering Rules

- Published pages must not fall back to mock data.
- Preview pages may use preview schema, but real API environment must be explicit.
- Missing material renders component-level error state.
- Schema version mismatch renders page-level incompatible state.
