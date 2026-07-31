# TASK-2026-0801-089-renderer-fallback-hardening

## 标题

增强 H5 renderer 局部降级兜底

## 状态

verified

## 目标

增强 React H5 renderer 和 Vue H5 renderer 的未知物料、组件渲染异常和空页面兜底能力，让运营配置错误或物料实现异常不会导致整页白屏，并在 H5 runtime playground 中提供可验证的 broken demo。

## 背景

当前 React H5 renderer 已有基础组件异常边界，Vue H5 renderer 已有未知物料兜底和空页面 fallback，但两端能力不完全对齐：未知物料缺少统一节点标记，Vue 组件异常缺少局部捕获，browser smoke 也尚未覆盖真实 broken schema。为了让最终编辑器和 H5 runtime 更接近可实操，需要把 renderer 层的 error/empty/fallback 行为做成明确、可测试、可追踪的基础能力。

## 涉及包或系统

- `packages/renderer-h5`
- `packages/renderer-vue-h5`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

包含：

- 统一 React H5 renderer 未知物料兜底节点的 class、`data-lowcode-node-id` 和 `data-lowcode-missing` 标记。
- 统一 React H5 renderer 组件异常兜底节点的 class、`data-lowcode-node-id` 和 `data-lowcode-error` 标记。
- 为 Vue H5 renderer 增加局部组件异常捕获，并提供 `onRenderError` 回调。
- 统一 Vue H5 renderer 未知物料和组件异常兜底节点标记。
- 增加 renderer 单测，覆盖未知物料、空页面 fallback、Vue renderer props 和 React renderer fallback 结构。
- 在 React H5 runtime playground 增加 `?demo=broken`，同时演示未知物料和抛错物料。
- 扩展 browser smoke 覆盖 broken demo 不白屏、未知物料兜底和渲染错误诊断。
- 更新 renderer README、项目事实源、AI 上下文和 TODO。

不包含：

- 不新增 Page Schema 字段。
- 不新增 Material Manifest 字段。
- 不改 Java 配置平台 API。
- 不新增 npm 依赖。
- 不实现生产监控上报、Sentry 或远程日志。
- 不改变现有正常物料渲染语义。

## 责任边界

当前仓库：

- `packages/renderer-h5` 和 `packages/renderer-vue-h5` 负责 schema 节点渲染、未知物料兜底、组件异常兜底和空页面 fallback。
- `apps/h5-runtime-playground` 负责展示和验证 runtime 降级演示。
- `scripts/browser-smoke.mjs` 负责本地自动化验证关键兜底路径。

外部系统：

- Java 配置平台仍负责返回 Page Schema，本任务不修改服务端校验。
- `hybird-meumall` 未来通过 npm 包消费 renderer 降级能力，本任务不改真实 H5 业务仓库。

## 契约影响

- 是否影响跨包或跨系统契约：是，renderer 包公开 props 增加 Vue 端可选 `onRenderError` 回调，向后兼容。
- 契约文档路径：`packages/renderer-h5/README.md`、`packages/renderer-vue-h5/README.md`、`.ai-workspace/contracts/h5-runtime-integration-v1.md`。
- 是否向后兼容：是，新增可选能力和更明确 DOM 标记，不改变旧 schema。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是，更新 renderer README，说明 fallback DOM 标记和 Vue `onRenderError`。
- 对接说明路径：`packages/renderer-h5/README.md`、`packages/renderer-vue-h5/README.md`。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 阅读 React/Vue renderer 当前实现和 H5 runtime playground schema 入口。
2. 设计两端统一的局部降级 DOM 标记。
3. 实现 React/Vue renderer 未知物料和组件异常兜底。
4. 增加 H5 runtime broken demo 和本地入口。
5. 补充 renderer 单测和 browser smoke。
6. 更新 README、项目事实源、AI 上下文、TODO 和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] React H5 renderer 未知物料输出 `mlc-runtime-missing`、`data-lowcode-node-id` 和 `data-lowcode-missing`。
- [x] React H5 renderer 组件异常输出 `mlc-runtime-error`、`data-lowcode-node-id` 和 `data-lowcode-error`。
- [x] Vue H5 renderer 未知物料输出同语义兜底标记。
- [x] Vue H5 renderer 组件异常可局部兜底，并触发可选 `onRenderError`。
- [x] H5 runtime playground 提供 `?demo=broken` 本地入口。
- [x] browser smoke 覆盖 broken demo 的未知物料、组件异常和渲染错误诊断。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm check:architecture` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `pnpm pack:dry-run` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm check:architecture
pnpm smoke:browser
pnpm pack:dry-run
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：未来 npm 发布后 H5 runtime 可获得更明确的局部降级能力；本任务不改真实 H5 业务仓库。
- 是否影响 npm 发布：renderer 包实现和 Vue 可选 props 类型变更，向后兼容；未来真实发布可作为 patch 或 minor 评估。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 覆盖 `?demo=broken`。

## 风险和阻塞

- 当前只做本地 DOM 兜底和回调，不接生产监控上报；真实 H5 接入后应由宿主把 `onRenderError` 接到埋点或日志系统。
- Vue error boundary 只捕获子组件渲染链路错误；异步事件错误仍需 action executor 或宿主监控处理。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 H5 renderer 局部降级和 H5 runtime broken demo。 |
| 2026-08-01 | in_progress | 开始实现 React/Vue renderer 局部兜底、H5 runtime broken demo 和验证覆盖。 |
| 2026-08-01 | verified | 已完成 React/Vue renderer 局部降级、H5 runtime broken demo、renderer 单测、browser smoke、README、H5 集成契约和事实源更新；验证命令全部通过。 |
