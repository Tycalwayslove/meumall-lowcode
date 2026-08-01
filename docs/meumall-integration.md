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

本地 handoff 使用 `@meumall/lowcode-adapters` 提供的 `encodePageSchemaToUrlParam` 编码，并在 H5 runtime 侧统一通过 `loadLowcodeRuntimeSchema` 读取 `schema`、`previewToken`、`releaseId`、`pageId` 或 fallback schema。该方式只适合本地 demo 和中小型 schema；正式环境建议由 Java 配置平台返回 `previewToken`、`releaseId` 或 `pageId`，H5 runtime 再通过 API 拉取 schema。

## Suggested Routes

```text
/activity/lowcode/[pageId]
/promotion/lowcode/[pageId]
/preview/lowcode/token/[previewToken]
/preview/lowcode/[releaseId]
```

## Java API Contracts Needed

```text
GET /api/lowcode/pages/{pageId}/published
GET /api/lowcode/pages/previews/{previewToken}
GET /api/lowcode/releases/{releaseId}
POST /api/lowcode/pages/{pageId}/track
```

## Local Mock Flow

当前 Vue3 playground 先用 `apps/editor-playground/src/mockPlatform.ts` 模拟 Java 配置平台：

- `saveDraft(schema)`：保存草稿版本，并更新 pageId -> draft release 索引。
- `saveEditorDraftSnapshot({ pageId, schema, operator })`：保存编辑器自动草稿恢复点，不生成 release，不进入版本历史。
- `getEditorDraftSnapshot(pageId)`：读取编辑器自动草稿恢复点；编辑器初始化后会优先通过 provider 异步恢复，旧 `STORAGE_KEY` localStorage 草稿仅作为迁移兜底。
- `createPreview(schema)`：生成一次性预览版本，编辑器可打开 `?runtime=1&previewToken=...`，缺少 token 时可回退 `?runtime=1&releaseId=...`。
- `publishPage(schema)`：生成 published 版本，并更新 pageId -> published release 索引。
- `getPublished(pageId)`：模拟 H5 运行态读取已发布页面。

独立 H5 runtime 入口：

```text
/?runtime=1&pageId=summer-campaign-demo
/?runtime=1&previewToken=preview_demo_token
/?runtime=1&releaseId=preview_xxx
http://localhost:5174/?schema=encoded_schema
http://localhost:5174/?previewToken=preview_demo_token
http://localhost:5174/?pageId=summer-campaign-demo
http://localhost:5174/?releaseId=preview_demo
http://localhost:5174/?pageId=missing-page
http://localhost:5174/?demo=empty
```

`apps/h5-runtime-playground` 内置一个本地 `LowcodeConfigPlatformClient` mock：`?pageId=summer-campaign-demo` 会加载本地 published schema，`?previewToken=preview_demo_token` 和 `?releaseId=preview_demo` 会加载本地 preview release schema；未知 `previewToken`、`pageId` 或 `releaseId` 会回落到 sample schema 并展示 fallback 原因。左侧运行诊断面板会展示请求入口、实际 schema 来源、pageId、pageVersion、schema 校验、节点数、数据源状态、action 日志和 fallback 原因。`?demo=empty` 只用于本地验证空页面降级，确保 nodes 为空时展示 H5 空态而不是白屏。

H5 runtime playground 可通过环境变量切换为 Java HTTP client：

```bash
VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL=http://localhost:8080 \
VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION="Bearer token" \
pnpm --filter @meumall/lowcode-h5-runtime-playground dev
```

不配置时仍使用本地 mock；配置后左侧诊断面板会展示 `配置平台: http <baseUrl>`，并通过 `createHttpConfigPlatformClient` 加载 `previewToken`、`pageId` 或 `releaseId`。

H5 runtime playground 也可通过环境变量切换 `product.byIds` 数据源为 HTTP BFF handler：

```bash
VITE_LOWCODE_DATA_SOURCE_BASE_URL=http://localhost:8080 \
VITE_LOWCODE_DATA_SOURCE_AUTHORIZATION="Bearer token" \
pnpm --filter @meumall/lowcode-h5-runtime-playground dev
```

不配置时仍使用本地 sample resolver；配置后左侧诊断面板会展示 `数据源模式: http <baseUrl>`，并通过 `createHttpDataSourceHandler` 请求宿主代码固定的 `GET /api/lowcode/data/products/by-ids`。Page Schema 只保存 `type`、`params` 和 `bindTo`，不要把任意 HTTP URL 写入 schema。

H5 runtime playground 也可通过环境变量切换 `tracking.click` 动作为 HTTP BFF handler：

```bash
VITE_LOWCODE_ACTION_BASE_URL=http://localhost:8080 \
VITE_LOWCODE_ACTION_AUTHORIZATION="Bearer token" \
pnpm --filter @meumall/lowcode-h5-runtime-playground dev
```

不配置时仍使用本地 mock action；配置后左侧诊断面板会展示 `动作模式: http <baseUrl>`，并通过 `createHttpActionHandler` 请求宿主代码固定的 `POST /api/lowcode/actions/tracking-click`。Page Schema 只保存 `actions[].type`、`actions[].params` 和节点 `events`，不要把任意 HTTP URL 写入 schema。

后续替换真实 Java API 时，优先保持编辑器侧调用语义不变，把 localStorage mock 实现替换为 HTTP adapter。注意 `saveDraft` 是手动版本草稿，`saveEditorDraftSnapshot` 是自动保存恢复点，两者不要共用同一条版本历史。

## Rendering Rules

- Published pages must not fall back to mock data.
- Preview pages may use preview schema, but real API environment must be explicit.
- Missing material renders component-level error state.
- Schema version mismatch renders page-level incompatible state.
