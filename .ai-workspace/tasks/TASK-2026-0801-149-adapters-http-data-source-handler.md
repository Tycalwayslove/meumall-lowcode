# TASK-2026-0801-149-adapters-http-data-source-handler

## 标题

新增 adapters HTTP 数据源 handler

## 状态

verified

## 目标

在 `@meumall/lowcode-adapters` 中新增可复用的 HTTP data source handler factory，让宿主可以把白名单 `dataSources[].type` 安全映射到固定 HTTP endpoint，用于编辑器预览和 H5 runtime 解析真实数据源，同时保持数据源失败不导致整页白屏。

## 背景

当前 `resolveLowcodeDataSources` 已提供白名单 registry 和错误记录，但真实 HTTP 请求需要宿主自行手写 handler。随着商品、优惠券、活动、门店/达人等物料增多，后续每个接入方都重复写 fetch、query/body、响应解包和错误处理，容易出现任意 URL 暴露、错误抛穿或响应格式不一致。需要先在 adapters 包沉淀一个框架无关、可注入 fetcher、 endpoint 由代码配置的 HTTP handler 工厂。

## 涉及包或系统

- `packages/adapters`
- `.ai-workspace/contracts/page-schema-v1.md`
- `.ai/`

## 范围

包含：

- 新增 `createHttpDataSourceHandler`。
- 支持固定 endpoint、GET query、POST body、公共 headers 和可注入 fetcher。
- 支持通过 `responseDataPath` 从常见响应包装中取业务数据。
- 支持可选 `transformResponse` 做宿主级响应转换。
- 单测覆盖 GET、POST、响应解包、错误状态和 resolver 错误记录。
- 更新 adapters README 和 AI 状态。

不包含：

- 不在 Page Schema 中新增字段。
- 不允许运营在 schema 中配置任意 URL。
- 不实现真实 Java 商品/优惠券/活动接口。
- 不实现鉴权刷新、缓存、重试、并发取消或 SSR 适配。
- 不改 Vue3 editor playground 当前 mock 数据源默认行为。

## 责任边界

当前仓库：

- `@meumall/lowcode-adapters` 提供 HTTP data source handler 工厂。
- `resolveLowcodeDataSources` 继续负责串行解析、合并 runtime data 和记录失败。

外部系统：

- Java 配置平台或 H5 宿主负责注册允许的数据源 type。
- Java BFF/代理负责真实鉴权、权限、缓存、分页、字段裁剪和响应包装。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 npm public API，但不改变 Page Schema v1 字段结构。
- 契约文档路径：`.ai-workspace/contracts/page-schema-v1.md`、`packages/adapters/README.md`。
- 是否向后兼容：是。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/adapters/README.md`、`.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：低代码前端维护者、Java BFF/配置平台。
- 当前确认状态：前端参考实现。

## 实现计划

1. 在 adapters 包新增 HTTP data source handler 类型和实现。
2. 增加 adapters 单测，覆盖成功、解包、错误和 resolver 兜底。
3. 更新 README、项目事实和 TODO。
4. 运行验证并提交推送。

## 验收标准

- [x] `createHttpDataSourceHandler` 可注册进 `createDataSourceRegistry`。
- [x] GET 请求默认把 `config.params` 转成 query。
- [x] POST 请求默认把 `config.params` 作为 JSON body。
- [x] `responseDataPath` 能从 `{ data: ... }` 这类包装中取业务数据。
- [x] HTTP 非 2xx 能抛出带状态码的受控错误，并被 `resolveLowcodeDataSources` 记录。
- [x] 不允许把任意 URL 写入 Page Schema。
- [x] 不改变 Page Schema v1 字段结构。
- [x] `pnpm --filter @meumall/lowcode-adapters typecheck` 通过。
- [x] `pnpm build && node --test packages/adapters/test/adapters.test.mjs` 通过。
- [x] `pnpm test` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm --filter @meumall/lowcode-adapters typecheck
pnpm build && node --test packages/adapters/test/adapters.test.mjs
pnpm test
git diff --check
```

## 验证结果

- `pnpm --filter @meumall/lowcode-adapters typecheck` 通过。
- `pnpm build && node --test packages/adapters/test/adapters.test.mjs` 通过，adapters 17 项测试全部通过。
- `pnpm test` 通过，91 项测试全部通过，并包含架构边界检查。
- `git diff --check` 通过。

## 发布影响

- 是否需要发布：否，本任务不执行真实 npm 发布。
- 发布对象：后续真实发布时影响 `@meumall/lowcode-adapters`。
- 是否需要 changeset：当前不发布，暂不新增 changeset。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：向后兼容，H5 宿主可选择使用该 helper 注册真实 data source handler。
- 是否影响 npm 发布：新增 public API，后续发布可按 minor 评估。
- 是否影响 Java 配置平台：不要求 Java 改 schema；真实接口路径、鉴权和响应包装仍需 Java/BFF 对接确认。
- 回滚目标：回滚本任务提交即可恢复为宿主手写 data source handler。
- smoke check：通过 adapters 单测和全量测试验证 helper 行为；本任务不改浏览器默认 mock 链路。

## 风险和阻塞

- 当前 helper 不解决真实鉴权、缓存、重试和分页，仅提供安全 HTTP handler 基础形态。
- `responseDataPath` 只做路径读取，不校验业务字段结构，字段校验应由宿主 transform 或 Java BFF 负责。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 adapters HTTP data source handler、测试、README 和 AI 状态同步。 |
| 2026-08-01 | verified | 完成 HTTP data source handler、GET/POST/响应解包/错误兜底测试、契约说明、README 和 AI 状态同步，并通过验证。 |
