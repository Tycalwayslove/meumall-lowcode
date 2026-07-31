# H5 Runtime 集成契约 v1

## 契约名称

MeuMall Lowcode H5 Runtime Integration v1

## 提供方

- MeuMall Lowcode npm packages。
- Java 配置平台。

## 消费方

- `hybird-meumall` H5 工程。

## 适用环境

- H5 C 端活动页、推广页、专题页。
- `test`、`pre`、`prod`。

## 集成目标

`hybird-meumall` 通过 npm 引入低代码 renderer、materials、schema/core/adapters，在 H5 路由中按 `pageId` 或 `releaseId` 拉取 Page Schema 并渲染，不复制低代码平台源码。

## 需要安装的包

```bash
pnpm add @meumall/lowcode-schema @meumall/lowcode-core @meumall/lowcode-renderer-h5 @meumall/lowcode-materials-h5 @meumall/lowcode-adapters
```

版本要求：

- 首次接入应锁定同一批次版本。
- `@meumall/lowcode-renderer-h5` 不依赖 editor。
- `@meumall/lowcode-materials-h5` 不依赖 `hybird-meumall` 内部模块。

## 推荐路由

```text
/activity/lowcode/:pageId
/promotion/lowcode/:pageId
/preview/lowcode/:releaseId
```

路由职责：

- `pageId`：读取 Java 配置平台 active published schema。
- `releaseId`：读取 Java 配置平台 preview 或历史 release schema。
- `schema` URL 参数：仅用于本地 demo 或排障，不作为生产入口。

## Schema 获取优先级

H5 runtime 推荐统一调用 `loadLowcodeRuntimeSchema`：

```ts
import {
  createHttpConfigPlatformClient,
  loadLowcodeRuntimeSchema,
} from "@meumall/lowcode-adapters";

const configPlatformClient = createHttpConfigPlatformClient({
  baseUrl: "/api",
  headers: {
    authorization: "Bearer token",
  },
});

const result = await loadLowcodeRuntimeSchema({
  encodedSchema: query.schema,
  releaseId: route.params.releaseId,
  pageId: route.params.pageId,
  configPlatformClient,
  fallbackSchema,
});
```

优先级：

1. `encodedSchema`
2. `releaseId`
3. `pageId`
4. `fallbackSchema`

生产环境建议禁用或限制 `encodedSchema`，避免 URL 过长和绕过配置平台审计。

## React 渲染示例

```tsx
import { createDataSourceRegistry, createSafeActionExecutor, createSafeActionRegistry, resolveLowcodeDataSources } from "@meumall/lowcode-adapters";
import { createMaterialRegistry } from "@meumall/lowcode-core";
import { h5Materials } from "@meumall/lowcode-materials-h5";
import { LowcodeRenderer } from "@meumall/lowcode-renderer-h5";

const materialRegistry = createMaterialRegistry(h5Materials);

const dataSourceRegistry = createDataSourceRegistry({
  "product.byActivity": resolveProductsByActivity,
  "product.byIds": resolveProductsByIds,
});

const actionRegistry = createSafeActionRegistry({
  navigate: navigateByBridge,
  "coupon.receive": receiveCoupon,
  "tracking.click": reportClick,
});

const { data, records } = await resolveLowcodeDataSources(schema.dataSources ?? [], dataSourceRegistry);

<LowcodeRenderer
  schema={schema}
  registry={materialRegistry}
  data={data}
  actionExecutor={createSafeActionExecutor(actionRegistry)}
  fallback={<EmptyLowcodePage />}
  onRenderError={reportRenderError}
/>;
```

## 数据源接入

首期建议白名单：

- `product.byActivity`
- `product.byIds`
- `coupon.byActivity`
- `activity.detail`

要求：

- 不允许运营配置任意 URL。
- Handler 由 H5 或 H5 BFF 注册。
- 数据源失败时记录 `records`，页面继续渲染已有数据或 empty 状态。
- 数据源真实请求建议走 Java 配置平台代理或 H5 BFF，避免前端暴露内部接口。

## Action 接入

首期建议白名单：

- `navigate`
- `coupon.receive`
- `tracking.click`
- `noop`

要求：

- 不允许运营配置任意 JavaScript。
- `navigate` 需要接 H5 路由或 App WebView bridge。
- `coupon.receive` 需要登录态校验和业务接口错误提示。
- `tracking.click` 必须带 pageId、nodeId、actionId、releaseId 或 pageVersion。
- 未注册 action type 不得导致整页白屏。

## 降级策略

页面级：

- schema 拉取失败：显示 fallback schema 或业务 empty/error 页。
- schemaVersion major 不兼容：显示“不支持的页面版本”并上报。
- nodes 为空：显示运营配置空状态。

组件级：

- 未知物料：renderer 显示缺失物料 fallback，并输出 `mlc-runtime-missing`、`data-lowcode-node-id` 和 `data-lowcode-missing` 便于诊断和 smoke check。
- 单组件渲染错误：React/Vue H5 renderer 局部 error boundary 捕获，并输出 `mlc-runtime-error`、`data-lowcode-node-id` 和 `data-lowcode-error`；宿主应通过 `onRenderError` 上报，不影响整页。
- 数据源失败：组件使用默认 props 或 empty 状态。
- action 失败：展示轻提示并上报。

## 埋点和监控

建议至少上报：

- schema_load_start / schema_load_success / schema_load_fail
- data_source_resolve_success / data_source_resolve_fail
- material_render_error
- action_execute_success / action_execute_fail
- lowcode_page_exposure

关键维度：

- `pageId`
- `pageVersion`
- `releaseId`
- `schemaVersion`
- `componentName`
- `nodeId`
- `actionId`
- `environment`

## 发布 Smoke Check

Java 配置平台发布后，H5 侧至少验证：

1. `GET /api/lowcode/pages/{pageId}/published` 返回 schema。
2. schema 校验通过。
3. H5 route `activity/lowcode/:pageId` 返回 200。
4. 页面首屏非空。
5. 数据源失败不会白屏。
6. 未知物料显示缺失物料 fallback。
7. 单组件渲染异常只展示局部 fallback，不导致整页白屏。
8. 核心 action 点击不会抛出未捕获异常。

## 回滚

推荐流程：

1. Java 配置平台选择历史 published release。
2. 创建新的 published release 并切 active。
3. H5 清理或等待 schema 缓存过期。
4. 执行 smoke check。
5. 记录回滚 releaseId、操作人和 traceId。

## 与 Java 配置平台契约关系

本契约依赖：

- `.ai-workspace/contracts/java-config-platform-api-v1.md`
- `.ai-workspace/contracts/page-schema-v1.md`

Java API 路径以配置平台契约为准。

## 待确认

- `hybird-meumall` 实际路由命名。
- H5 请求封装和鉴权方式。
- App WebView bridge 跳转协议。
- 数据源由 H5 直连、BFF 代理还是 Java 配置平台代理。
- 页面 schema 缓存时间和主动失效机制。
