# TASK-2026-0801-150-playground-http-data-source

## 标题

接入 playground HTTP 数据源演示链路

## 状态

verified

## 目标

让 Vue3 编辑器 playground 和 React H5 runtime playground 都能通过 `VITE_LOWCODE_DATA_SOURCE_BASE_URL` 注册白名单 HTTP 数据源 handler，并在 browser smoke 中验证 React H5 runtime 从本地 HTTP mock 拉取商品数据后注入到 H5 渲染层。

## 背景

`@meumall/lowcode-adapters` 已提供 `createHttpDataSourceHandler`，但当前 editor/runtime playground 的 `product.byIds` 仍只走本地内存 sample resolver。为了让后续接 Java/BFF 数据源时有一条可验证的集成参考链路，需要把该 helper 接到 playground 的数据源 registry 中，并通过 smoke 证明 Page Schema 仍只保存 `type/params/bindTo`，真实 endpoint 由宿主 env 和代码配置。

## 涉及包或系统

- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `docs/`
- `.ai/`

## 范围

包含：

- 为 Vue3 编辑器 playground 新增 data source registry binding。
- 为 React H5 runtime playground 新增 data source registry binding。
- 新增 `VITE_LOWCODE_DATA_SOURCE_BASE_URL` 和可选 authorization 环境变量说明。
- browser smoke 的 HTTP mock 增加商品数据源 endpoint。
- browser smoke 验证 HTTP 配置平台页面可通过 HTTP 数据源渲染商品。
- 同步 README、AI 状态和任务记录。

不包含：

- 不改变 Page Schema v1 字段结构。
- 不新增真实 Java 商品/活动/优惠券接口。
- 不实现鉴权刷新、缓存、重试、分页和字段校验。
- 不把 HTTP endpoint 写入 Page Schema。
- 不改变默认 local playground 行为。

## 责任边界

当前仓库：

- `apps/*` 通过 env 决定使用 local sample resolver 还是 HTTP data source handler。
- `scripts/browser-smoke.mjs` 提供本地 HTTP mock 和端到端验证。

外部系统：

- Java/BFF 未来负责真实商品/活动/优惠券 endpoint、鉴权、缓存、分页和响应包装。
- Java 配置平台仍只存储 Page Schema，不负责在 schema 中保存任意 URL。

## 契约影响

- 是否影响跨包或跨系统契约：是，补充 playground 对 HTTP 数据源接入方式的使用说明；不改变 schema。
- 契约文档路径：`.ai-workspace/contracts/page-schema-v1.md`、`packages/adapters/README.md`、`apps/*/README.md`。
- 是否向后兼容：是。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`apps/editor-playground/README.md`、`apps/h5-runtime-playground/README.md`、`.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：低代码前端维护者、Java BFF/配置平台。
- 当前确认状态：本地 smoke mock 参考实现。

## 实现计划

1. 新增 editor/runtime playground data source binding。
2. 接入现有 `product.byIds` registry，默认 local，env 存在时走 HTTP。
3. 扩展 browser smoke HTTP mock 和 HTTP runtime 页面 schema。
4. 更新 README、AI 状态，运行验证并提交。

## 验收标准

- [x] Vue3 编辑器 playground 可通过 `VITE_LOWCODE_DATA_SOURCE_BASE_URL` 创建 HTTP data source registry。
- [x] React H5 runtime playground 可通过 `VITE_LOWCODE_DATA_SOURCE_BASE_URL` 创建 HTTP data source registry。
- [x] 默认 local playground 行为不变。
- [x] HTTP data source endpoint 不写入 Page Schema。
- [x] browser smoke 验证 React H5 runtime HTTP 页面渲染 HTTP mock 商品。
- [x] browser smoke 验证 HTTP data source 请求透传 authorization。
- [x] 不改变 Page Schema v1 字段结构。
- [x] `pnpm --filter @meumall/lowcode-editor-playground build` 通过。
- [x] `pnpm --filter @meumall/lowcode-h5-runtime-playground build` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `pnpm test` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm --filter @meumall/lowcode-editor-playground build
pnpm --filter @meumall/lowcode-h5-runtime-playground build
pnpm smoke:browser
pnpm test
git diff --check
```

## 验证结果

- `pnpm --filter @meumall/lowcode-editor-playground build` 通过。
- `pnpm --filter @meumall/lowcode-h5-runtime-playground build` 通过。
- `pnpm smoke:browser` 通过，覆盖 HTTP config platform 页面、HTTP data source 模式展示、`product.byIds` HTTP mock 请求 authorization 透传、HTTP mock 商品渲染和数据源状态记录。
- `pnpm test` 通过，91 项测试全部通过，并包含架构边界检查。
- `git diff --check` 通过。

## 发布影响

- 是否需要发布：否，本任务不执行真实 npm 发布。
- 发布对象：无；后续真实发布时可能影响 playground 文档和 adapters 使用示例。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：向后兼容，为真实 H5 宿主接 HTTP 数据源提供参考。
- 是否影响 npm 发布：不新增公开 npm API。
- 是否影响 Java 配置平台：不改变 Java 配置平台 schema；真实 Java/BFF endpoint 仍待对接。
- 回滚目标：回滚本任务提交即可恢复 playground 只用本地 sample resolver。
- smoke check：`pnpm smoke:browser` 覆盖 HTTP data source mock 请求、authorization 和 H5 商品渲染。

## 风险和阻塞

- 当前只验证本地 HTTP mock，不代表真实 Java/BFF 已可用。
- 真实鉴权、缓存、重试、分页和字段校验仍需后续单独任务。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 playground HTTP data source env 接入、browser smoke 和文档状态同步。 |
| 2026-08-01 | verified | 完成 editor/runtime playground HTTP data source binding、browser smoke HTTP mock 商品链路、README 和 AI 状态同步，并通过验证。 |
