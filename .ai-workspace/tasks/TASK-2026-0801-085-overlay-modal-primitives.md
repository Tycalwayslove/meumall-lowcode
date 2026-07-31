# TASK-2026-0801-085-overlay-modal-primitives

## 标题

补齐 Overlay/Modal 内部 runtime primitives

## 状态

verified

## 目标

在 React H5 和 Vue H5 materials 包内部新增业务无关的 `MlcOverlay`、`MlcModal` runtime primitives，并改造现有 `ActivityRuleModal` 复用它们，减少后续活动规则、优惠说明、确认弹窗等物料重复实现弹层结构。

## 背景

物料分层架构已将 `Overlay`、`Modal` 列为 Phase 1 后续 runtime primitives。当前 `ActivityRuleModal` 已具备弹窗能力，但弹层结构仍散落在业务物料内部。为了保持后续物料扩展精准，需要先沉淀可复用的弹层基础组件，再继续增加业务物料。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `packages/materials-h5/test`
- `docs/material-layering-architecture.md`
- `.ai/`

## 范围

包含：

- 在 React H5 materials 内部 primitives 中新增 `MlcOverlay` 和 `MlcModal`。
- 在 Vue H5 materials 内部 primitives 中新增同名 `MlcOverlay` 和 `MlcModal`。
- 改造 React/Vue `ActivityRuleModal` 复用 `MlcModal`。
- 补充 materials 单测，确保 `ActivityRuleModal` 复用新增 primitives，且 primitives 不进入物料 registry。
- 更新基础组件与物料分层文档、项目事实源和待办。

不包含：

- 不新增独立 primitives npm 包。
- 不新增 Page Schema 字段。
- 不新增 Material Manifest 字段。
- 不改变 `ActivityRuleModal` 的 `componentName`、props 语义或旧页面渲染方式。
- 不实现复杂弹窗队列、focus trap、滚动锁定或跨端小程序弹层。
- 不新增业务弹窗物料。

## 责任边界

当前仓库：

- `packages/materials-h5` 和 `packages/materials-vue-h5` 维护 H5 runtime 内部 primitives 与物料实现。
- `ActivityRuleModal` 作为第一个弹层 primitive 消费方，保持 manifest 兼容。

外部系统：

- Java 配置平台继续按现有 `ActivityRuleModal` manifest 识别该物料，本任务不需要服务端改造。
- `hybird-meumall` 未来通过 npm 包消费变更，本任务不改真实 H5 业务仓库。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：`docs/material-layering-architecture.md`。
- 是否向后兼容：是，仅内部实现复用，不改变 schema 或 manifest 语义。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是，更新分层架构文档和 materials README。
- 对接说明路径：`docs/material-layering-architecture.md`、`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 阅读 React/Vue primitives 与 `ActivityRuleModal` 当前实现。
2. 设计 `MlcOverlay`、`MlcModal` 的最小 props，保持业务无关。
3. 实现 React/Vue 内部 primitives。
4. 改造 React/Vue `ActivityRuleModal` 复用 `MlcModal`。
5. 补充单测、文档和事实源。
6. 运行验证命令并记录结果。

## 验收标准

- [x] React H5 materials 内部导出 `MlcOverlay`、`MlcModal`。
- [x] Vue H5 materials 内部导出 `MlcOverlay`、`MlcModal`。
- [x] React `ActivityRuleModal` 复用 `MlcModal`，旧 props 和 manifest 保持兼容。
- [x] Vue `ActivityRuleModal` 复用 `MlcModal`，旧 props 和 manifest 保持兼容。
- [x] materials 单测覆盖新增 primitives 复用。
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
- 是否影响 H5 接入：未来 npm 发布后 H5 可获得内部弹层实现复用；本任务不改真实 H5 业务仓库。
- 是否影响 npm 发布：包实现变更，公开 schema/manifest 不变；未来真实发布可作为 patch 或 minor 评估。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 覆盖 Vue3 编辑器画布和 React H5 runtime 中的活动规则弹窗打开/关闭。

## 风险和阻塞

- 当前 `MlcModal` 只沉淀基础 overlay、标题、关闭、内容容器和按钮区域，不提供完整 focus trap 与滚动锁定，后续进入生产前需要按管理台/H5 真实无障碍要求增强。
- 当前只改造 `ActivityRuleModal` 一个消费方，后续更多弹窗类物料出现后再评估 API 是否稳定到可抽 npm 包。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为内部 Overlay/Modal primitives 和 `ActivityRuleModal` 复用。 |
| 2026-08-01 | in_progress | 开始实现 React/Vue `MlcOverlay`、`MlcModal`，并改造 `ActivityRuleModal` 复用内部弹层 primitives。 |
| 2026-08-01 | verified | 完成 React/Vue 内部 `MlcOverlay`、`MlcModal`，`ActivityRuleModal` 已复用 `MlcModal`；`pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm check:architecture`、`pnpm smoke:browser`、`pnpm pack:dry-run` 均通过。 |
