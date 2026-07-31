# TASK-2026-0731-016-config-platform-contract-client

## 状态

verified

## 目标

沉淀 Java 配置平台 API 契约草案，并在 `@meumall/lowcode-adapters` 中提供配置平台客户端接口与 HTTP client 参考实现，让 Vue3 编辑器 playground 的本地 mock 发布链路可以按同一接口替换为真实 Java 配置平台。

## 背景

当前编辑器已经支持保存草稿、生成预览、发布页面、本地版本列表和 runtime 打开，但这些能力仍直接依赖 `apps/editor-playground/src/mockPlatform.ts` 中的 localStorage 函数。后续迁移到 Java 管理台时，需要明确 Java 配置平台的 draft/preview/publish/release 查询协议，并让编辑器通过客户端接口调用，而不是散落调用 mock 函数。

## 涉及包或系统

- `@meumall/lowcode-adapters`
- `apps/editor-playground`
- `.ai-workspace/contracts`
- `.ai-workspace/tasks`
- `.ai/test-reports`
- `.ai/PROJECT_STATE.md`
- `.ai/TODO.md`
- `.ai/AI_CONTEXT.md`

## 范围

包含：

- 新增 Java 配置平台 API 契约草案。
- adapters 新增 `LowcodeConfigPlatformClient`、release 类型和 HTTP client。
- 本地 `mockPlatform` 实现同一客户端接口。
- Vue3 编辑器 playground 改为通过 `configPlatformClient` 调用保存、预览、发布和查询。
- adapters 单元测试覆盖 HTTP client 的请求路径、方法和响应解析。
- 更新 README、项目状态、TODO 和验证报告。

不包含：

- Java 服务端实现。
- 真实鉴权、审批、发布灰度和回滚接口实现。
- 替换 localStorage mock 为真实 HTTP 调用。
- 生产环境错误弹窗和重试策略。

## 责任边界

当前仓库：

- 定义前端消费契约、TypeScript client 接口和 HTTP client 参考实现。
- 保持 playground 继续使用 localStorage mock，但 mock 需符合接口。

外部系统：

- Java 配置平台后续负责实现 API、鉴权、审计、审批、持久化、active release 和数据源代理。
- H5 宿主后续负责按 pageId/releaseId 获取发布 schema 并执行 smoke check。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 Java 配置平台 API 草案和 adapters 公共 API。
- 契约文档路径：`.ai-workspace/contracts/java-config-platform-api-v1.md`
- 是否向后兼容：是，新增 API；不改变 Page Schema 字段。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`.ai-workspace/contracts/java-config-platform-api-v1.md`
- 需要确认的角色：Java 配置平台负责人、H5 接入负责人、运营后台负责人。
- 当前确认状态：前端草案，待外部系统确认。

## 实现计划

1. 新增任务并置为 `ready` 后进入 `in_progress`。
2. adapters 新增配置平台 client 类型和 HTTP client。
3. 本地 mockPlatform 实现 `LowcodeConfigPlatformClient`。
4. 编辑器 playground 通过 client 调用发布链路。
5. 新增 Java 配置平台 API 契约草案。
6. 更新 README、项目状态、TODO 和验证报告。
7. 运行 `pnpm test`、`pnpm typecheck`、`pnpm build` 和本地 smoke check。

## 验收标准

- [x] 存在 Java 配置平台 API 契约草案。
- [x] adapters 提供 `LowcodeConfigPlatformClient` 接口。
- [x] adapters 提供 HTTP client 参考实现。
- [x] 本地 mockPlatform 实现同一 client 接口。
- [x] Vue3 编辑器 playground 不再直接散落调用 mock 函数。
- [x] adapters 单元测试覆盖 HTTP client。
- [x] `pnpm test` 通过。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] 编辑器和 React H5 runtime smoke check 通过。
- [x] 项目状态、TODO 和验证报告已更新。

## 验证命令

```bash
pnpm test
pnpm typecheck
pnpm build
curl -I http://localhost:5173/
curl -I http://localhost:5174/
```

## 发布影响

- 是否需要发布：暂不发布。
- 发布对象：后续发布 `@meumall/lowcode-adapters` 时包含新增 client API。
- 是否需要 changeset：当前不发布，暂不新增 changeset。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：基础测试、类型检查、构建和本地入口检查通过。

## 验证结果

2026-07-31：

- `pnpm typecheck` 通过。
- `pnpm test` 通过，Node.js 内置测试共 3 个 suite、16 个用例全部通过。
- `pnpm build` 通过。
- `curl -I http://localhost:5173/` 返回 `HTTP/1.1 200 OK`。
- `curl -I http://localhost:5174/` 返回 `HTTP/1.1 200 OK`。
- 验证报告：`.ai/test-reports/TASK-2026-0731-016-config-platform-contract-client.md`

## 风险和阻塞

- Java API 仍是前端草案，字段、鉴权、审批和发布语义需要后续外部确认。
- HTTP client 只作为参考实现，真实接入时还需要接入登录态、CSRF/签名、错误码映射和监控。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确新增配置平台契约和客户端抽象。 |
| 2026-07-31 | in_progress | 开始实现 adapters client、mock 对齐和 Java API 草案。 |
| 2026-07-31 | verified | `pnpm typecheck`、`pnpm test`、`pnpm build` 和本地 smoke check 通过。 |
