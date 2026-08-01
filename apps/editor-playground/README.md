# @meumall/lowcode-editor-playground

Vue3 editor playground 是低代码编辑器的管理台迁移参考壳。

它负责演示如何组合：

- `@meumall/lowcode-schema`
- `@meumall/lowcode-core`
- `@meumall/lowcode-editor`
- `@meumall/lowcode-adapters`
- `@meumall/lowcode-renderer-vue-h5`
- `@meumall/lowcode-materials-vue-h5`

它不负责实现 Java 配置平台、真实素材中心、商品中心、审批中心或 H5 线上发布服务。

## 配置平台 client

默认情况下，playground 使用 `src/mockPlatform.ts` 内置的 localStorage mock，实现草稿、预览、发布、版本历史、审批状态和自动草稿快照。

配置以下环境变量后，playground 会改用 `createHttpConfigPlatformClient`：

```bash
VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL=http://127.0.0.1:5196
VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION="Bearer token"
```

说明：

- `VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL` 为空时使用 local mock。
- `VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL` 存在时使用 HTTP config platform client。
- `VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION` 可选；存在时会作为 `authorization` header 透传。
- 保存草稿、生成预览、发布、版本列表、版本载入、workflow 和 editor draft snapshot 都按异步 client 调用。

## 数据源 client

默认情况下，playground 预览使用本地 sample resolver 解析 `schema.dataSources`。

配置以下环境变量后，`product.byIds` 会改用 `createHttpDataSourceHandler` 注册到固定 HTTP endpoint：

```bash
VITE_LOWCODE_DATA_SOURCE_BASE_URL=http://127.0.0.1:5196
VITE_LOWCODE_DATA_SOURCE_AUTHORIZATION="Bearer token"
```

当前参考 endpoint：

```text
GET /api/lowcode/data/products/by-ids
```

说明：

- `VITE_LOWCODE_DATA_SOURCE_BASE_URL` 为空时使用本地 sample resolver。
- `VITE_LOWCODE_DATA_SOURCE_BASE_URL` 存在时，`product.byIds` 会请求宿主固定 endpoint。
- `VITE_LOWCODE_DATA_SOURCE_AUTHORIZATION` 可选；存在时会作为 `authorization` header 透传。
- Page Schema 只保存 `type`、`params` 和 `bindTo`，不保存任意 HTTP URL。

## HTTP API

HTTP client 参考契约见：

- `.ai-workspace/contracts/java-config-platform-api-v1.md`
- `packages/adapters/README.md`

当前 editor playground 使用的关键端点：

- `POST /api/lowcode/pages/drafts`
- `POST /api/lowcode/pages/previews`
- `POST /api/lowcode/pages/releases`
- `GET /api/lowcode/pages/releases?pageId={pageId}`
- `GET /api/lowcode/pages/releases/{releaseId}`
- `GET /api/lowcode/pages/{pageId}/workflow`
- `PUT /api/lowcode/pages/{pageId}/editor-draft-snapshot`
- `GET /api/lowcode/pages/{pageId}/editor-draft-snapshot`

`saveDraft`、`createPreview` 和 `publishPage` 会额外传递可选 metadata：

```json
{
  "schema": {},
  "pageStatus": "draft",
  "note": "版本备注",
  "operator": {
    "id": "operator-me",
    "name": "当前运营"
  }
}
```

## 验证

```bash
pnpm --filter @meumall/lowcode-editor-playground typecheck
pnpm smoke:browser
```

`pnpm smoke:browser` 会同时覆盖：

- 默认 local mock 编辑器。
- HTTP config platform 编辑器。
- HTTP data source handler。
- 默认 React H5 runtime。
- HTTP config platform React H5 runtime。
