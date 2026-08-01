# TASK-2026-0801-151-adapters-http-action-handler

## 标题

新增 adapters HTTP action handler 并接入 H5 runtime 演示链路

## 状态

verified

## 目标

为 `@meumall/lowcode-adapters` 新增白名单 HTTP action handler，并让 React H5 runtime playground 可以通过环境变量把 `tracking.click` 动作切到固定 HTTP endpoint，形成真实跳转桥、领券接口、埋点平台、权限和风控接入前的可验证宿主适配边界。

## 背景

当前 Page Schema 已有 `actions` 和节点 `events`，运行时也通过 `createSafeActionRegistry` / `createSafeActionExecutor` 执行白名单 mock action。HTTP 数据源链路已经完成 adapters helper 和 playground smoke 验证，但 action 仍停留在本地 mock。为了后续真实 H5 宿主接埋点、领券、跳转桥和风控时不污染 schema、renderer 或物料，需要把 action 的 HTTP 宿主适配能力补到 adapters，并用 playground 证明 Page Schema 只保存 `type` 和 `params`，endpoint、鉴权和请求包装由宿主代码持有。

## 涉及包或系统

- `packages/adapters`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `docs/`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-adapters` 新增 `createHttpActionHandler`。
- 支持宿主固定 endpoint、GET query 或 POST body、authorization/header 注入、请求失败报错和可选响应处理。
- 为 adapters 增加单元测试，覆盖默认 POST、GET、错误响应和安全 registry 组合。
- 为 React H5 runtime playground 新增可选 HTTP action registry binding。
- browser smoke 验证 H5 runtime 点击动作会请求 HTTP mock endpoint，并透传 authorization。
- 同步 adapters/runtime README、AI 状态和任务记录。

不包含：

- 不改变 Page Schema v1 字段结构。
- 不把 HTTP endpoint 写入 Page Schema。
- 不接真实 Java/BFF、埋点平台、优惠券接口、跳转 bridge、权限或风控系统。
- 不改变默认 local playground 行为。
- 不新增公开 schema 字段或 material manifest 字段。

## 责任边界

当前仓库：

- `packages/adapters` 提供框架无关 HTTP action handler helper。
- `apps/h5-runtime-playground` 演示如何通过 env 在宿主层注册 HTTP action handler。
- `scripts/browser-smoke.mjs` 提供本地 HTTP mock 和端到端验证。

外部系统：

- 真实 H5 宿主未来负责 endpoint、鉴权、登录态、风控、bridge、埋点 SDK 和业务错误展示。
- Java 配置平台仍只存储 Page Schema，不负责在 schema 中保存任意 URL。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 adapters 公开 API；不改变 schema。
- 契约文档路径：`.ai-workspace/contracts/page-schema-v1.md`、`packages/adapters/README.md`、`apps/h5-runtime-playground/README.md`。
- 是否向后兼容：是，新增可选 helper。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/adapters/README.md`、`apps/h5-runtime-playground/README.md`、`.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：低代码前端维护者、真实 H5 宿主、Java/BFF/埋点/风控负责人。
- 当前确认状态：本地 smoke mock 参考实现。

## 实现计划

1. 梳理 adapters action registry 和 H5 runtime action 注入现状。
2. 新增 `createHttpActionHandler` 类型、实现和 README 示例。
3. 增加 adapters 单元测试。
4. 接入 React H5 runtime playground HTTP action env binding。
5. 扩展 browser smoke HTTP mock 与点击断言。
6. 更新 AI 状态、任务验证结果，运行验证并提交。

## 验收标准

- [x] `createHttpActionHandler` 可注册进 `createSafeActionRegistry`。
- [x] 默认 POST 请求包含 action id、type、params、ref params 和 pageId。
- [x] GET 请求可把 action/context 派生成 query。
- [x] HTTP 非 2xx 响应会抛出可识别错误。
- [x] React H5 runtime playground 可通过 `VITE_LOWCODE_ACTION_BASE_URL` 切换 `tracking.click` 到 HTTP handler。
- [x] 默认 local playground 行为不变。
- [x] HTTP action endpoint 不写入 Page Schema。
- [x] browser smoke 验证 H5 runtime 点击 action 请求 HTTP mock endpoint。
- [x] browser smoke 验证 HTTP action 请求透传 authorization。
- [x] 不改变 Page Schema v1 字段结构。
- [x] `pnpm --filter @meumall/lowcode-adapters build` 通过。
- [x] `node --test packages/adapters/test/*.test.mjs` 通过。
- [x] `pnpm --filter @meumall/lowcode-h5-runtime-playground build` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `pnpm test` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm --filter @meumall/lowcode-adapters build
node --test packages/adapters/test/*.test.mjs
pnpm --filter @meumall/lowcode-h5-runtime-playground build
pnpm smoke:browser
pnpm test
git diff --check
```

## 验证结果

- `pnpm --filter @meumall/lowcode-adapters build` 通过。
- `node --test packages/adapters/test/*.test.mjs` 通过，20 项 adapters 测试全部通过，覆盖 HTTP action POST、GET、失败响应和 safe action executor 异步错误回调。
- `pnpm --filter @meumall/lowcode-h5-runtime-playground build` 通过。
- `pnpm smoke:browser` 通过，覆盖 React H5 runtime HTTP 配置平台、HTTP 数据源、HTTP action 模式展示，点击 `HTTP 动作按钮` 后请求 `/api/lowcode/actions/tracking-click`，并验证 authorization、action id、type、params、refParams 和 pageId。
- `pnpm test` 通过，94 项测试全部通过，并包含架构边界检查。
- `git diff --check` 通过。

## 发布影响

- 是否需要发布：否，本任务不执行真实 npm 发布。
- 发布对象：无；后续真实发布时会影响 `@meumall/lowcode-adapters`。
- 是否需要 changeset：否，当前仍未执行真实 npm 发布。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：向后兼容，为真实 H5 宿主接 HTTP action 提供参考。
- 是否影响 npm 发布：新增 adapters 公开 API，后续发布应作为 minor 记录。
- 是否影响 Java 配置平台：不改变 Java 配置平台 schema；真实 action endpoint 和响应包装仍待对接。
- 回滚目标：回滚本任务提交即可恢复 action 只使用 playground local mock。
- smoke check：`pnpm smoke:browser` 覆盖 HTTP action mock 请求、authorization 和 H5 点击行为。

## 风险和阻塞

- 当前只验证本地 HTTP mock，不代表真实埋点、领券、跳转桥和风控系统已可用。
- 真实业务错误码、登录态刷新、幂等、防重复点击和风险拦截提示仍需后续单独任务。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 adapters HTTP action handler、React H5 runtime env 演示、browser smoke 和文档状态同步。 |
| 2026-08-01 | verified | 完成 adapters HTTP action handler、safe action executor 异步错误闭环、React H5 runtime action env binding、browser smoke HTTP action 点击链路、README 和 AI 状态同步，并通过验证。 |
