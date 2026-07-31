# TASK-2026-0801-088-spacer-primitive

## 标题

补齐 Spacer 内部 runtime primitive

## 状态

verified

## 目标

在 React H5 和 Vue H5 materials 包内部新增业务无关的 `MlcSpacer` runtime primitive，并改造现有 `SpacerBlock` 复用它，沉淀 H5 页面间距控制基础能力。

## 背景

物料库已有 `SpacerBlock` 通用物料，运营可用它控制活动页不同版块之间的留白。当前间距渲染仍直接写在物料内部，属于可复用的基础布局能力。为了继续按 `docs/material-layering-architecture.md` 的 Phase 1 收口内部 primitives，应先把间距块的视觉基础沉淀为 primitive，再让 `SpacerBlock` 只保留低代码 manifest 和 props 语义。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `packages/materials-h5/test`
- `scripts/browser-smoke.mjs`
- `docs/material-layering-architecture.md`
- `.ai/`

## 范围

包含：

- 在 React H5 materials 内部 primitives 中新增 `MlcSpacer`。
- 在 Vue H5 materials 内部 primitives 中新增同名 `MlcSpacer`。
- 改造 React/Vue `SpacerBlock` 复用 `MlcSpacer`。
- 保持 `SpacerBlock` 的 `componentName`、manifest 和旧 props 语义兼容。
- 补充 materials 单测，确保 primitives 不进入物料 registry 且 `SpacerBlock` 复用 `MlcSpacer`。
- 补充 browser smoke 对编辑器和 React H5 runtime 中间距块渲染的覆盖。
- 更新 materials README、分层文档、项目事实源、AI 上下文和 TODO。

不包含：

- 不新增独立 primitives npm 包。
- 不新增 Page Schema 字段。
- 不新增 Material Manifest 字段。
- 不改变 `SpacerBlock` 的配置项。
- 不实现复杂布局容器、分割线、背景纹理或响应式规则。
- 不接入业务数据源、action 或埋点。

## 责任边界

当前仓库：

- `packages/materials-h5` 和 `packages/materials-vue-h5` 维护 H5 runtime 内部 primitives 与物料实现。
- `SpacerBlock` 作为 spacing primitive 消费方，保持 manifest 兼容。

外部系统：

- Java 配置平台继续按现有 `SpacerBlock` manifest 识别该物料，本任务不需要服务端改造。
- `hybird-meumall` 未来通过 npm 包消费变更，本任务不改真实 H5 业务仓库。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：`docs/material-layering-architecture.md`、`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`。
- 是否向后兼容：是，仅内部实现复用，不改变 schema 或 manifest 语义。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是，更新 materials README 和分层架构文档。
- 对接说明路径：`docs/material-layering-architecture.md`、`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 阅读 React/Vue primitives 与 `SpacerBlock` 当前实现。
2. 设计 `MlcSpacer` 的最小 props，保持业务无关。
3. 实现 React/Vue 内部 `MlcSpacer`。
4. 改造 React/Vue `SpacerBlock` 复用 `MlcSpacer`。
5. 补充 materials 单测和 browser smoke。
6. 更新 README、分层文档、项目事实源和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] React H5 materials 内部导出 `MlcSpacer`。
- [x] Vue H5 materials 内部导出 `MlcSpacer`。
- [x] React `SpacerBlock` 复用 `MlcSpacer`，旧 props 和 manifest 保持兼容。
- [x] Vue `SpacerBlock` 复用 `MlcSpacer`，旧 props 和 manifest 保持兼容。
- [x] materials 单测覆盖新增 primitive 复用和 registry 边界。
- [x] browser smoke 覆盖 Vue3 编辑器画布和 React H5 runtime 的间距块渲染。
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
- 是否影响 H5 接入：未来 npm 发布后 H5 可获得内部 spacer primitive 复用；本任务不改真实 H5 业务仓库。
- 是否影响 npm 发布：包实现变更，公开 schema/manifest 不变；未来真实发布可作为 patch 评估。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 覆盖 Vue3 编辑器画布和 React H5 runtime 中的间距块渲染。

## 风险和阻塞

- 当前 `MlcSpacer` 只沉淀基础高度、背景色和圆角，不扩展为布局容器；后续分割线、响应式留白或装饰背景需要另行设计。
- 当前只改造 `SpacerBlock` 一个消费方，更多布局类物料出现后再评估 API 是否稳定到可抽 npm 包。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为内部 `MlcSpacer` primitive 和 `SpacerBlock` 复用。 |
| 2026-08-01 | in_progress | 开始实现 React/Vue `MlcSpacer`，并改造 `SpacerBlock` 复用内部 spacer primitive。 |
| 2026-08-01 | verified | 已完成 React/Vue `MlcSpacer`、`SpacerBlock` 复用、单测、browser smoke、README、分层文档和事实源更新；验证命令全部通过。 |
