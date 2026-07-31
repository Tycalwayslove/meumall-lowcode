# TASK-2026-0731-013-data-source-resolver-runtime

## 状态

verified

## 目标

为低代码平台补齐 data source resolver 生命周期，让编辑器预览和 React H5 runtime 都能从 Page Schema 的 `dataSources` 配置解析运行时数据，并通过现有 `dataBinding` 注入物料。

## 背景

当前 Page Schema 已包含 `dataSources`，编辑器也有数据源配置面板，但预览数据解析逻辑仍写在 `apps/editor-playground/src/App.vue` 内部，React H5 runtime 也使用硬编码 `runtimeData`。这会导致“运营配置数据源 -> H5 渲染消费数据”的链路不够真实，不利于后续替换为 Java 配置平台和真实业务 API。

## 涉及包或系统

- `@meumall/lowcode-adapters`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `packages/adapters/test`
- `.ai-workspace/tasks`
- `.ai/test-reports`
- `.ai/PROJECT_STATE.md`
- `.ai/TODO.md`

## 范围

包含：

- 在 `@meumall/lowcode-adapters` 新增通用数据源解析函数。
- 数据源解析结果包含运行时 `data` 和逐个数据源状态。
- 未注册 handler 或解析失败时返回错误状态，不导致整页白屏。
- 编辑器 Vue3 playground 使用 adapters resolver 生成预览数据。
- 编辑器数据源面板展示解析状态。
- React H5 runtime playground 使用 adapters resolver 生成 H5 渲染数据。
- 为 adapters resolver 增加单元测试。
- 更新项目状态、TODO、任务记录和测试报告。

不包含：

- 真实 HTTP 请求实现。
- Java 配置平台 API。
- 生产级数据缓存策略。
- 数据源鉴权、签名或风控。
- schema 字段结构调整。

## 责任边界

当前仓库：

- 提供框架无关的数据源解析协议和 playground 级 mock handler。

外部系统：

- Java 配置平台后续负责提供真实数据源配置、预览 token、接口代理和审计。
- H5 业务工程后续负责注册真实业务 data source handler。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 `@meumall/lowcode-adapters` 公开 API。
- 契约文档路径：`packages/adapters/README.md`
- 是否向后兼容：是，新增 API；`DataSourceHandler` 返回值从 `JsonObject` 扩展为 `JsonValue`，旧 handler 仍可用。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/adapters/README.md`
- 需要确认的角色：后续 Java 配置平台和 H5 接入负责人。
- 当前确认状态：本地 playground mock 验证。

## 实现计划

1. 新增任务并置为 `ready` 后进入 `in_progress`。
2. `@meumall/lowcode-adapters` 新增 resolver API、状态类型和测试。
3. 编辑器 Vue3 playground 接入 resolver，替换本地同步解析逻辑。
4. React H5 runtime playground 接入 resolver，替换硬编码 runtimeData。
5. 更新 README、项目状态、TODO 和验证报告。
6. 运行 `pnpm test`、`pnpm typecheck`、`pnpm build`。

## 验收标准

- [x] adapters 提供通用 data source resolver。
- [x] resolver 能合并多个已绑定数据源为 renderer data。
- [x] resolver 对缺少 handler 的数据源返回错误状态，不抛出到页面层。
- [x] 编辑器预览使用 resolver 返回的数据。
- [x] 编辑器面板能看到数据源解析状态。
- [x] React H5 runtime 使用 resolver 返回的数据。
- [x] adapters 单元测试覆盖 resolver 成功和失败分支。
- [x] `pnpm test` 通过。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] 项目状态、TODO 和验证报告已更新。

## 验证命令

```bash
pnpm test
pnpm typecheck
pnpm build
```

## 发布影响

- 是否需要发布：暂不发布。
- 发布对象：后续发布 `@meumall/lowcode-adapters` 时包含新增 API。
- 是否需要 changeset：当前不发布，暂不新增 changeset。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：基础测试、类型检查和构建通过。

## 验证结果

2026-07-31：

- `pnpm test` 通过，Node.js 内置测试共 3 个 suite、13 个用例全部通过。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `curl -I http://localhost:5173/` 返回 `HTTP/1.1 200 OK`。
- `curl -I http://localhost:5174/` 返回 `HTTP/1.1 200 OK`。
- 验证报告：`.ai/test-reports/TASK-2026-0731-013-data-source-resolver-runtime.md`

## 风险和阻塞

- 当前 handler 仍是 playground mock；真实请求、鉴权、缓存和错误策略需要 Java 配置平台 API 明确后继续设计。
- React H5 runtime 的数据源解析目前在浏览器端执行；真实接入时可替换为 H5 BFF 或 Java 代理。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确补齐 data source resolver 生命周期。 |
| 2026-07-31 | in_progress | 开始实现 adapters resolver 和 playground 接入。 |
| 2026-07-31 | verified | `pnpm test`、`pnpm typecheck` 和 `pnpm build` 通过。 |
