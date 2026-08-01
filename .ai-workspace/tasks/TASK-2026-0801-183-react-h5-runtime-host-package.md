# TASK-2026-0801-183 React H5 runtime host 包

## 状态

verified

## 目标

新增 `@meumall/lowcode-runtime-react-h5` 可发布包，沉淀 React H5 消费方常用的 runtime 宿主组合能力，让后续 `hybird-meumall` 通过 npm 接入时不需要从 playground 复制 schema 加载、数据源解析、健康摘要、默认物料注册和 renderer 挂载代码。

## 背景

当前 React H5 runtime playground 已能完成 pageId/releaseId/previewToken/schema URL 加载、数据源解析、action 执行、健康摘要和 renderer 挂载。但这些组合逻辑仍主要存在于 app shell。真实 H5 接入时如果照搬 playground，会让运行态 glue code 在多个业务仓库分叉。需要把稳定、业务无关、面向 React H5 的宿主组合能力抽成可发布包，保持 playground 只作为集成演示。

## 涉及包或系统

- `packages/runtime-react-h5`
- `apps/h5-runtime-playground`
- `packages/adapters`
- `packages/renderer-h5`
- `packages/materials-h5`
- 根级构建、架构检查、changesets 和 AI 文档

## 范围

包含：

- 新增 `@meumall/lowcode-runtime-react-h5` 包、README、package.json、tsconfig 和测试。
- 提供默认 React H5 物料 registry helper。
- 提供 React H5 runtime view model helper，统一 schema 校验、节点统计和 `createLowcodeRuntimeHealthSummary` 口径。
- 提供 `useLowcodeReactH5Runtime` hook，组合 `loadLowcodeRuntimeSchema`、`resolveLowcodeDataSources`、运行态 data、数据源记录、健康摘要和渲染错误记录。
- 提供 `LowcodeReactH5Runtime` 组件，使用 `LowcodeRenderer` 挂载 schema。
- React H5 runtime playground 改为消费该包。
- 更新架构检查、根 tsconfig references、changesets、任务记录和项目状态。

不包含：

- 不改变 Page Schema v1、Material Manifest v1、renderer API 或 adapters 现有 API。
- 不新增真实 Java/BFF 接口。
- 不把 playground 变成业务 H5 项目。
- 不执行真实 npm 发布或 GitHub release。

## 责任边界

当前仓库：

- `@meumall/lowcode-runtime-react-h5` 负责 React H5 宿主组合层。
- `@meumall/lowcode-renderer-h5` 仍只负责渲染 schema 节点。
- `@meumall/lowcode-materials-h5` 仍只负责 React H5 物料实现和 manifest。
- `@meumall/lowcode-adapters` 仍负责 schema loader、data source/action adapters 和 runtime health summary。
- React H5 runtime playground 只消费 runtime host 包做演示。

外部系统：

- `hybird-meumall` 后续通过 npm 引入该包和必要配置，不复制 playground 源码。
- Java 配置平台仍负责 pageId/releaseId/previewToken 查询。
- Java/BFF 仍负责真实数据源和 action endpoint。

## 契约影响

- 是否影响跨包或跨系统契约：新增公开 npm 包，向后兼容新增。
- 是否向后兼容：是，不改变既有包的公开 API 语义。
- 是否需要迁移：不需要。
- 是否需要灰度或双版本兼容：不需要。

## 对接说明

- 后续真实 H5 接入优先使用 `useLowcodeReactH5Runtime` 和 `LowcodeReactH5Runtime`。
- 如 H5 需要自定义物料，可通过 `createDefaultReactH5MaterialRegistry(extraMaterials)` 注册扩展物料。
- 如 H5 需要自定义诊断 UI，可直接读取 hook 返回的 `healthSummary`、`dataSourceRecords`、`renderErrors` 和 `validation`。

## 验收标准

- [x] 新增 `@meumall/lowcode-runtime-react-h5` 可发布包，并通过架构检查。
- [x] 包导出默认物料 registry helper、view model helper、hook 和 runtime 组件。
- [x] view model helper 能复用 adapters runtime health summary 口径。
- [x] React H5 runtime playground 消费新包，不再本地重复节点统计和健康摘要组合。
- [x] 不改变 schema、renderer、materials 或 adapters 既有 API 语义。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `pnpm pack:dry-run` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
pnpm pack:dry-run
```

## 验证结果

- 2026-08-01：`pnpm typecheck` 通过，TypeScript project references、Vue3 editor playground 和 React H5 runtime playground 类型检查均通过。
- 2026-08-01：`pnpm test` 通过，构建、架构边界检查和 130 个 Node test 均通过，新增 `@meumall/lowcode-runtime-react-h5` suite 覆盖默认 registry、节点统计、health summary view model 和 runtime 组件。
- 2026-08-01：`pnpm smoke:browser` 通过，React H5 runtime playground 改为消费 runtime host 包后，default/pageId/previewToken/releaseId/HTTP/missing/empty/broken 入口和基础物料交互均通过。
- 2026-08-01：`pnpm pack:dry-run` 通过，发现并校验 12 个可发布包，包含新增 `@meumall/lowcode-runtime-react-h5`。

## 发布影响

- 是否需要发布：本任务不执行真实 npm 发布。
- 发布对象：后续发布时涉及新增 `@meumall/lowcode-runtime-react-h5`。
- 是否影响 schema 兼容性：否。
- 是否影响 H5 接入：是，新增更推荐的 React H5 npm 接入层。
- 是否影响 Java 配置平台：否。
- 是否需要 GitHub tag/release：不需要。
- 回滚目标：回滚本任务提交即可移除 runtime host 包和 playground 接入。
- smoke check：本任务以 `pnpm test` 覆盖包 API，以 `pnpm smoke:browser` 覆盖 React H5 runtime playground 实际渲染。

## 风险和阻塞

- 该包先服务 React H5；Vue H5 或小程序 runtime host 需要单独任务设计。
- 该包不替代真实 H5 业务鉴权、登录、缓存、路由、埋点和错误上报策略。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 React H5 runtime host 包和 playground 消费。 |
| 2026-08-01 | verified | 新增 `@meumall/lowcode-runtime-react-h5`、React H5 runtime playground 接入、架构/契约/README/changeset 更新；`pnpm typecheck`、`pnpm test`、`pnpm smoke:browser`、`pnpm pack:dry-run` 均通过。 |
