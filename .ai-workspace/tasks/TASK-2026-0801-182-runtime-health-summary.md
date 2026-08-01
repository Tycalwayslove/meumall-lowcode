# TASK-2026-0801-182 H5 运行态健康摘要

## 状态

verified

## 目标

在 `@meumall/lowcode-adapters` 中新增框架无关的 H5 runtime 健康摘要 API，并接入 React H5 runtime playground，让真实 H5 后续接入时可以复用同一套运行态排障口径。

## 背景

当前 H5 runtime playground 已具备 schema 来源加载、fallback、数据源解析、动作日志和渲染异常兜底能力，但健康状态判断散落在页面组件中。为了让运行态诊断可测试、可迁移、可复用，需要把“是否正常、是否启用 fallback、schema 是否有效、数据源是否异常、页面是否空态”等信号沉淀到 adapters 层。

## 涉及包或系统

- `packages/adapters`
- `apps/h5-runtime-playground`
- `.ai/`

## 范围

包含：

- 新增 `createLowcodeRuntimeHealthSummary` 及相关类型。
- 从 schema 加载结果、schema 校验、节点数、数据源解析记录和动作日志数量派生运行态健康等级、标题、描述和检查项。
- React H5 runtime playground 展示健康摘要和检查项。
- 补充 adapters 单元测试、H5 browser smoke 覆盖、README、changeset、任务记录和项目状态。

不包含：

- 不改变 Page Schema v1、Material Manifest v1 或 renderer 协议。
- 不改真实 Java 配置平台接口。
- 不新增真实远程监控上报。
- 不执行真实 npm 发布或 GitHub release。

## 责任边界

当前仓库：

- `@meumall/lowcode-adapters` 负责运行态健康摘要模型和判断口径。
- React H5 runtime playground 负责消费摘要并展示给开发、测试和运营验收人员。

外部系统：

- `hybird-meumall` 后续接入时只消费 adapters API，不复制 playground 内部判断。
- Java 配置平台后续仍负责真实 schema 发布、previewToken、releaseId 和 pageId 查询能力。
- 真实监控平台后续可把健康摘要转换为埋点或日志字段。

## 契约影响

- 是否影响跨包或跨系统契约：影响 `@meumall/lowcode-adapters` 公开 API，向后兼容新增。
- 是否向后兼容：是，新增导出类型和函数，不改变已有函数语义。
- 是否需要迁移：不需要。
- 是否需要灰度或双版本兼容：不需要。

## 对接说明

- 后续 H5 正式项目接入时，优先复用 `createLowcodeRuntimeHealthSummary` 生成运行态状态，不要在页面组件里重复判断 fallback、schema invalid 或数据源异常。
- 如果 Java 配置平台增加错误码，可先映射到 `RuntimeSchemaLoadResult.error` 或数据源解析记录，再由摘要 API 统一呈现。

## 验收标准

- [x] `@meumall/lowcode-adapters` 导出运行态健康摘要类型和 `createLowcodeRuntimeHealthSummary`。
- [x] 摘要能区分 loading、healthy、warning、error 四种等级。
- [x] fallback、空页面、数据源异常能输出 warning。
- [x] schema invalid 能输出 error。
- [x] React H5 runtime playground 展示健康摘要和检查项。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
```

## 验证结果

- 2026-08-01：`pnpm typecheck` 通过，TypeScript project references、Vue3 editor playground 和 React H5 runtime playground 类型检查均通过。
- 2026-08-01：`pnpm test` 通过，构建、架构边界检查和 126 个 Node test 均通过。
- 2026-08-01：`pnpm smoke:browser` 通过，覆盖 React H5 runtime 健康摘要在 default fallback、HTTP pageId、普通 pageId、missing pageId、empty demo 和 broken demo 下的状态展示。

## 发布影响

- 是否需要发布：本任务不执行真实 npm 发布。
- 发布对象：后续发布时涉及 `@meumall/lowcode-adapters` minor。
- 是否影响 schema 兼容性：否。
- 是否影响 H5 接入：是，新增可复用运行态诊断 API，但不要求立即改外部 H5 项目。
- 是否影响 Java 配置平台：否。
- 是否需要 GitHub tag/release：不需要。
- 回滚目标：回滚本任务提交即可移除运行态健康摘要 API 和 H5 playground 展示。
- smoke check：本任务以 `pnpm test` 覆盖 API，并以 `pnpm smoke:browser` 覆盖 H5 playground 展示。

## 风险和阻塞

- 当前摘要只服务本地运行态排障，不等价于真实线上监控。
- 当前数据源健康只基于 adapters 解析记录，真实 H5 接入远程数据源后仍需补充网络层错误上报。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 adapters 运行态健康摘要 API 和 React H5 runtime playground 展示。 |
| 2026-08-01 | verified | 新增 `createLowcodeRuntimeHealthSummary`、React H5 runtime 健康摘要展示、changeset、README 和 smoke 覆盖；`pnpm typecheck`、`pnpm test`、`pnpm smoke:browser` 均通过。 |
