# Java 配置平台 API v1 草案

## 契约名称

MeuMall Lowcode Java Config Platform API v1

## 提供方

Java 配置平台。

## 消费方

- Vue3 编辑器管理端。
- H5 runtime 接入方。
- 后续 Java 管理台页面模板市场。

## 适用环境

- `test`
- `pre`
- `prod`

## 版本策略

- API 路径使用 `/api/lowcode` 作为低代码配置平台前缀。
- 当前版本为 v1 草案，Page Schema 使用 `schemaVersion = 1.x`。
- 新增可选字段保持向后兼容。
- 删除字段、修改字段类型或改变发布语义必须走 major 版本。

## 通用格式

### 成功响应

接口可直接返回业务对象，也可以由 Java 网关包装。若使用统一包装，建议格式：

```json
{
  "code": "OK",
  "message": "success",
  "data": {}
}
```

前端 HTTP client 当前参考实现按“直接返回业务对象”处理；真实接入时若使用包装格式，需要在 host adapter 中解包。

### 错误响应

```json
{
  "code": "LOWCODE_SCHEMA_INVALID",
  "message": "Page Schema 校验失败",
  "traceId": "trace_20260731_0001",
  "details": [
    {
      "path": "nodes[0].componentName",
      "message": "物料不存在"
    }
  ]
}
```

### PageRelease

```json
{
  "id": "rel_20260731_0001",
  "kind": "draft",
  "pageId": "summer-campaign-demo",
  "pageVersion": "draft-20260731T083000Z",
  "title": "夏日好物节",
  "createdAt": "2026-07-31T08:30:00.000Z",
  "schema": {}
}
```

字段说明：

- `id`：配置平台 release id，预览和回滚都使用该 id。
- `kind`：`draft | preview | published`。
- `pageId`：页面稳定 id。
- `pageVersion`：页面版本号，建议由 Java 配置平台生成。
- `schema`：完整 `LowcodePageSchema`。

## API

### 保存草稿

```http
POST /api/lowcode/pages/drafts
Content-Type: application/json
```

请求：

```json
{
  "schema": {},
  "pageStatus": "draft"
}
```

响应：`PageRelease`

说明：

- Java 配置平台必须校验 Page Schema。
- 保存草稿不影响线上 active published release。
- 同一个 `pageId` 的最新草稿应能通过“查询草稿”接口拿到。

### 生成预览

```http
POST /api/lowcode/pages/previews
Content-Type: application/json
```

请求：

```json
{
  "schema": {},
  "pageStatus": "preview"
}
```

响应：`PageRelease`

说明：

- 预览 release 可被 H5 runtime 使用 `releaseId` 打开。
- 预览 release 不影响线上 active published release。
- 后续可增加 `expireAt` 和 `previewToken`。

### 发布页面

```http
POST /api/lowcode/pages/releases
Content-Type: application/json
```

请求：

```json
{
  "schema": {},
  "pageStatus": "published"
}
```

响应：`PageRelease`

说明：

- Java 配置平台创建 published release，并将该 release 设置为 pageId 的 active published release。
- 发布前必须校验 Page Schema、物料白名单、数据源白名单和 action 白名单。
- 后续如接审批，可以让该接口创建待审批发布单，而不是直接切 active。

### 查询 release 列表

```http
GET /api/lowcode/pages/releases?pageId=summer-campaign-demo
```

响应：

```json
[
  {
    "id": "rel_20260731_0001",
    "kind": "published",
    "pageId": "summer-campaign-demo",
    "pageVersion": "prod-20260731T083000Z",
    "title": "夏日好物节",
    "createdAt": "2026-07-31T08:30:00.000Z",
    "schema": {}
  }
]
```

说明：

- `pageId` 可选。
- 默认按 `createdAt desc` 排序。
- 后续需要分页时新增 `cursor` 和 `limit`，保持当前字段兼容。

### 查询单个 release

```http
GET /api/lowcode/pages/releases/{releaseId}
```

响应：`PageRelease | null`

说明：

- H5 预览可通过该接口按 `releaseId` 获取 schema。
- 如果 Java 网关不允许返回 `null`，可返回 `404 LOWCODE_RELEASE_NOT_FOUND`。

### 查询最新草稿

```http
GET /api/lowcode/pages/{pageId}/draft
```

响应：`LowcodePageSchema | null`

说明：

- 编辑器打开页面时可优先加载草稿。
- 若不存在草稿，可返回 `null` 或 `404 LOWCODE_DRAFT_NOT_FOUND`。

### 查询线上 active schema

```http
GET /api/lowcode/pages/{pageId}/published
```

响应：`LowcodePageSchema | null`

说明：

- H5 runtime 正式访问页面时使用该接口获取当前 active schema。
- 该接口应可被 CDN/BFF 缓存，缓存 key 至少包含 `pageId` 和环境。

### 查询编辑器工作流状态

```http
GET /api/lowcode/pages/{pageId}/workflow
```

响应：`EditorWorkflowState | null`

```json
{
  "pageId": "summer-campaign-demo",
  "lock": {
    "status": "locked-by-me",
    "holder": {
      "id": "op_001",
      "name": "运营 A",
      "avatarUrl": "https://example.com/avatar.png"
    },
    "lockedAt": "2026-08-01T09:20:00.000Z",
    "expiresAt": "2026-08-01T09:50:00.000Z",
    "reason": "当前页面由你编辑"
  },
  "approval": {
    "status": "pending",
    "submitter": {
      "id": "op_001",
      "name": "运营 A"
    },
    "reviewer": {
      "id": "op_002",
      "name": "审核 B"
    },
    "submittedAt": "2026-08-01T09:30:00.000Z",
    "reviewedAt": null,
    "reason": "",
    "comment": "大促活动页待审核"
  },
  "updatedAt": "2026-08-01T09:30:00.000Z"
}
```

字段说明：

- `lock.status`：`unlocked | locked-by-me | locked-by-other | readonly | expired`。
- `approval.status`：`none | draft | pending | approved | rejected | published`。
- `holder`、`submitter`、`reviewer` 使用统一操作人结构：`id`、`name`、`avatarUrl` 均可选。
- adapters 不直接依赖 editor 包；管理台 shell 需要把 `lock` 映射到 `createLowcodeEditorCollaborationState`，把 `approval` 映射到 `createLowcodeEditorApprovalState`。

### 抢占编辑锁

```http
POST /api/lowcode/pages/{pageId}/locks/acquire
Content-Type: application/json
```

请求：

```json
{
  "operator": {
    "id": "op_001",
    "name": "运营 A"
  },
  "ttlSeconds": 120
}
```

响应：`EditorWorkflowState`

说明：

- 如果页面未锁定或锁已过期，Java 配置平台可以授予当前操作人锁。
- 如果页面被其他人持有且未过期，建议返回 `409 LOWCODE_PAGE_LOCKED`，并在错误 details 中带当前 holder 和 expiresAt。
- `ttlSeconds` 可选；Java 配置平台可以设置服务端默认值和最大值。

### 续期编辑锁

```http
POST /api/lowcode/pages/{pageId}/locks/refresh
Content-Type: application/json
```

请求：

```json
{
  "operator": {
    "id": "op_001",
    "name": "运营 A"
  },
  "ttlSeconds": 120
}
```

响应：`EditorWorkflowState`

说明：

- 只有当前锁持有人可以续期。
- 若锁不存在、已过期或持有人不匹配，建议返回 `409 LOWCODE_LOCK_REFRESH_REJECTED`。

### 释放编辑锁

```http
POST /api/lowcode/pages/{pageId}/locks/release
Content-Type: application/json
```

请求：

```json
{
  "operator": {
    "id": "op_001",
    "name": "运营 A"
  }
}
```

响应：`EditorWorkflowState`

说明：

- 页面关闭、发布完成、主动退出编辑或锁冲突处理后可调用。
- Java 配置平台应记录释放原因、操作人和 traceId。

### 提交审批

```http
POST /api/lowcode/pages/{pageId}/approval/submit
Content-Type: application/json
```

请求：

```json
{
  "operator": {
    "id": "op_001",
    "name": "运营 A"
  },
  "comment": "大促活动页待审核"
}
```

响应：`EditorWorkflowState`

说明：

- 提交审批前 Java 配置平台必须校验 Page Schema、物料白名单、数据源白名单和 action 白名单。
- 审批中页面建议进入只读，直到撤回、驳回或审核通过。

### 撤回审批

```http
POST /api/lowcode/pages/{pageId}/approval/cancel
Content-Type: application/json
```

请求：

```json
{
  "operator": {
    "id": "op_001",
    "name": "运营 A"
  },
  "comment": "需要补充活动规则"
}
```

响应：`EditorWorkflowState`

说明：

- 只有提交人或具备权限的管理员可以撤回。
- 撤回后页面可回到 `draft` 或 `rejected`，具体状态由 Java 审批流确认。

### 审核审批

```http
POST /api/lowcode/pages/{pageId}/approval/review
Content-Type: application/json
```

请求：

```json
{
  "operator": {
    "id": "op_002",
    "name": "审核 B"
  },
  "approved": true,
  "comment": "确认上线",
  "reason": ""
}
```

响应：`EditorWorkflowState`

说明：

- `approved = true` 表示审核通过，`approved = false` 表示驳回。
- 审核通过后是否自动发布，或仅允许调用发布接口，需由 Java 配置平台和运营流程确认。
- 驳回时建议填写 `reason`，用于编辑器状态 pill、审批历史和通知。

## 白名单要求

Java 配置平台发布前至少校验：

- `schemaVersion` 主版本兼容。
- `targetPlatforms` 包含目标端。
- 所有 `componentName` 在当前环境物料白名单中。
- 所有 `dataSources[].type` 在数据源白名单中。
- 所有 `actions[].type` 在 action 白名单中。
- 所有 `node.events.*.actionId` 指向已存在 action。

## 回滚方式

第一阶段建议 Java 配置平台提供“重新发布历史 release”的能力：

1. 运营选择历史 published release。
2. Java 校验 schema 和当前物料白名单。
3. 创建新的 published release，schema 内容来自历史 release。
4. 切换 active published release。
5. H5 smoke check 通过后记录操作人和 traceId。

## Smoke Check

发布后至少检查：

- `GET /api/lowcode/pages/{pageId}/published` 返回 `200` 且 schema 校验通过。
- H5 runtime 可渲染 published schema。
- 未知物料、数据源失败或 action 失败不会导致整页白屏。

## 待确认

- 统一响应是否由 Java 网关包装。
- 鉴权方式：Cookie、Bearer token、CSRF、签名或内部网关。
- 发布是否需要审批流。
- 编辑锁 TTL、抢锁策略、续期频率和页面关闭释放策略。
- 审批状态是否和现有公司审批系统打通，以及审核通过后是否自动发布。
- release 列表是否需要分页。
- 预览链接是否需要 `previewToken` 和过期时间。
- 数据源真实请求是否由 Java 配置平台代理。
