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

`hybird-meumall` 通过 npm 引入低代码 React H5 runtime host 包，在 H5 路由中按 `pageId`、`previewToken` 或 `releaseId` 拉取 Page Schema 并渲染，不复制低代码平台源码。需要更底层控制时，可以直接组合 renderer、materials、schema/core/adapters。

## 需要安装的包

```bash
pnpm add @meumall/lowcode-runtime-react-h5 @meumall/lowcode-adapters @meumall/lowcode-schema
```

版本要求：

- 首次接入应锁定同一批次版本。
- `@meumall/lowcode-runtime-react-h5` 不依赖 editor 或 `hybird-meumall` 内部模块。
- `@meumall/lowcode-renderer-h5`、`@meumall/lowcode-materials-h5`、`@meumall/lowcode-core` 可作为底层高级用法直接安装，但默认由 runtime host 包组合。

## 推荐路由

```text
/activity/lowcode/:pageId
/promotion/lowcode/:pageId
/preview/lowcode/token/:previewToken
/preview/lowcode/:releaseId
```

路由职责：

- `pageId`：读取 Java 配置平台 active published schema。
- `previewToken`：读取 Java 配置平台 preview release schema，仅用于预览验收。
- `releaseId`：读取 Java 配置平台 preview 或历史 release schema。
- `schema` URL 参数：仅用于本地 demo 或排障，不作为生产入口。

## Schema 获取优先级

H5 runtime host 内部统一通过 `loadLowcodeRuntimeSchema` 获取 schema：

```tsx
import { createHttpConfigPlatformClient } from "@meumall/lowcode-adapters";
import { LowcodeReactH5Runtime, useLowcodeReactH5Runtime } from "@meumall/lowcode-runtime-react-h5";

const configPlatformClient = createHttpConfigPlatformClient({
  baseUrl: "/api",
  headers: {
    authorization: "Bearer token",
  },
});

const runtime = useLowcodeReactH5Runtime({
  runtimeInput: {
    encodedSchema: query.schema,
    previewToken: route.params.previewToken,
    releaseId: route.params.releaseId,
    pageId: route.params.pageId,
    configPlatformClient,
    fallbackSchema,
  },
  dataSourceRegistry,
  actionExecutor,
});

<LowcodeReactH5Runtime runtime={runtime} />;
```

优先级：

1. `encodedSchema`
2. `previewToken`
3. `releaseId`
4. `pageId`
5. `fallbackSchema`

生产环境建议禁用或限制 `encodedSchema`，避免 URL 过长和绕过配置平台审计。

## H5 runtime playground 环境开关

`apps/h5-runtime-playground` 默认使用本地 mock `LowcodeConfigPlatformClient`，用于离线验证 `pageId=summer-campaign-demo`、`previewToken=preview_demo_token`、`releaseId=preview_demo`、empty demo 和 broken demo。需要联调 Java 配置平台时，可以通过环境变量切换为 HTTP client：

```bash
VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL=http://localhost:8080 \
VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION="Bearer token" \
pnpm --filter @meumall/lowcode-h5-runtime-playground dev
```

说明：

- `VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL` 存在时，playground 使用 `createHttpConfigPlatformClient`。
- `VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION` 可选，会作为 `authorization` header 透传。
- 不配置时仍使用本地 mock，确保本地 smoke check 不依赖外部 Java 服务。
- 左侧诊断面板会展示当前配置平台模式：`local mock` 或 `http <baseUrl>`。

## React 渲染示例

```tsx
import { createDataSourceRegistry, createSafeActionExecutor, createSafeActionRegistry } from "@meumall/lowcode-adapters";
import { LowcodeReactH5Runtime, useLowcodeReactH5Runtime } from "@meumall/lowcode-runtime-react-h5";

const dataSourceRegistry = createDataSourceRegistry({
  "product.byActivity": resolveProductsByActivity,
  "product.byIds": resolveProductsByIds,
});

const actionRegistry = createSafeActionRegistry({
  navigate: navigateByBridge,
  "coupon.receive": receiveCoupon,
  "tracking.click": reportClick,
});

const runtime = useLowcodeReactH5Runtime({
  runtimeInput: { pageId, configPlatformClient, fallbackSchema },
  dataSourceRegistry,
  actionExecutor: createSafeActionExecutor(actionRegistry),
});

reportRuntimeHealth(runtime.healthSummary);

<LowcodeReactH5Runtime runtime={runtime} fallback={<EmptyLowcodePage />} />;
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
- `tracking.click` 必须带 pageId、nodeId、actionId、previewToken、releaseId 或 pageVersion。
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
- `previewToken`
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
