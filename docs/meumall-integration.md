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

本仓库提供独立 React H5 runtime 验证入口：

```bash
pnpm dev:h5
```

默认地址：

```text
http://localhost:5174/
```

该入口位于 `apps/h5-runtime-playground`，只消费 React H5 renderer/materials/core/schema，不依赖 Vue 编辑器。

Vue3 编辑器可以通过 URL handoff 打开 React H5 runtime：

```text
http://localhost:5174/?schema={base64url-page-schema}&source=editor
```

本地 handoff 使用 `@meumall/lowcode-adapters` 提供的 `encodePageSchemaToUrlParam` 编码，并在 H5 runtime 侧统一通过 `loadLowcodeRuntimeSchema` 读取 `schema`、`releaseId`、`pageId` 或 fallback schema。该方式只适合本地 demo 和中小型 schema；正式环境应由 Java 配置平台返回 `releaseId` 或 `pageId`，H5 runtime 再通过 API 拉取 schema。

## Suggested Routes

```text
/activity/lowcode/[pageId]
/promotion/lowcode/[pageId]
/preview/lowcode/[releaseId]
```

## Java API Contracts Needed

```text
GET /api/lowcode/pages/{pageId}/published
GET /api/lowcode/releases/{releaseId}
POST /api/lowcode/pages/{pageId}/track
```

## Local Mock Flow

当前 Vue3 playground 先用 `apps/editor-playground/src/mockPlatform.ts` 模拟 Java 配置平台：

- `saveDraft(schema)`：保存草稿版本，并更新 pageId -> draft release 索引。
- `saveEditorDraftSnapshot({ pageId, schema, operator })`：保存编辑器自动草稿恢复点，不生成 release，不进入版本历史。
- `getEditorDraftSnapshot(pageId)`：读取编辑器自动草稿恢复点；编辑器初始化后会优先通过 provider 异步恢复，旧 `STORAGE_KEY` localStorage 草稿仅作为迁移兜底。
- `createPreview(schema)`：生成一次性预览版本，编辑器可打开 `?runtime=1&releaseId=...`。
- `publishPage(schema)`：生成 published 版本，并更新 pageId -> published release 索引。
- `getPublished(pageId)`：模拟 H5 运行态读取已发布页面。

独立 H5 runtime 入口：

```text
/?runtime=1&pageId=summer-campaign-demo
/?runtime=1&releaseId=preview_xxx
http://localhost:5174/?schema=encoded_schema
http://localhost:5174/?pageId=summer-campaign-demo
http://localhost:5174/?releaseId=preview_demo
http://localhost:5174/?pageId=missing-page
http://localhost:5174/?demo=empty
```

`apps/h5-runtime-playground` 内置一个本地 `LowcodeConfigPlatformClient` mock：`?pageId=summer-campaign-demo` 会加载本地 published schema，`?releaseId=preview_demo` 会加载本地 preview release schema；未知 `pageId` 或 `releaseId` 会回落到 sample schema 并展示 fallback 原因。左侧运行诊断面板会展示请求入口、实际 schema 来源、pageId、pageVersion、schema 校验、节点数、数据源状态、action 日志和 fallback 原因。`?demo=empty` 只用于本地验证空页面降级，确保 nodes 为空时展示 H5 空态而不是白屏。

后续替换真实 Java API 时，优先保持编辑器侧调用语义不变，把 localStorage mock 实现替换为 HTTP adapter。注意 `saveDraft` 是手动版本草稿，`saveEditorDraftSnapshot` 是自动保存恢复点，两者不要共用同一条版本历史。

## Rendering Rules

- Published pages must not fall back to mock data.
- Preview pages may use preview schema, but real API environment must be explicit.
- Missing material renders component-level error state.
- Schema version mismatch renders page-level incompatible state.
