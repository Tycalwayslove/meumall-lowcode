# TASK-2026-0801-168 SectionContainer 基础组件复用增强

## 状态

- status: verified
- created_at: 2026-08-01 14:16 CST
- owner: AI Agent

## 背景

`SectionContainer` 是当前编辑器默认识别的单列嵌套容器物料，承担运营页面分组、子节点组合和容器内投放入口。它已经具备留白、边框、阴影、标题色、说明色和空态文案配置，但 React/Vue 双端的标题、说明和空态仍有部分原生文本渲染逻辑。为了保持后续 primitives 抽包边界清晰，应先把容器文本展示收敛到已有 `MlcText` primitive。

## 目标

在不改变 Page Schema v1、Material Manifest v1、`componentName`、编辑器容器识别和单列布局语义的前提下，让 React/Vue `SectionContainer` 复用内部 `MlcText`，并补齐文档、测试和发布记录。

## 范围

- React H5 `SectionContainer` 标题、说明和空态文案使用 `MlcText` 渲染。
- Vue H5 `SectionContainer` 标题、说明和空态文案使用 `MlcText` 渲染。
- 保持 `mlc-section-container`、`mlc-section-container__body`、`mlc-section-container__empty` 等 DOM class 稳定。
- 补充测试，断言容器物料使用 primitives，并继续验证双端 manifest 对齐。
- 更新 README、架构文档、AI 状态、测试报告和 changeset。

## 非范围

- 不新增 `MlcContainer`、`MlcLayout` 或公开 primitives npm 包。
- 不新增多列、栅格、插槽、响应式布局协议或嵌套容器新规则。
- 不改变编辑器 `SectionContainer` 投放判断逻辑。
- 不改变 Java 配置平台 API、H5 runtime loader 或 Page Schema 节点结构。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `packages/materials-h5/test/materials.test.mjs`
- `packages/materials-h5/README.md`
- `packages/materials-vue-h5/README.md`
- `docs/material-layering-architecture.md`
- `.ai/`
- `.changeset/`

## 责任边界

当前仓库：

- `materials-*` 只负责容器物料内部 UI 复用和 manifest 对齐。
- `editor-playground` 继续通过现有 manifest 和容器 componentName 识别容器。
- `renderer-*` 继续只消费 material registry，不感知 primitives。

外部系统：

- Java 配置平台、真实 H5 宿主、小程序端和管理台 UI 不在本任务范围内。

## 契约影响

- 是否影响 Page Schema v1：否。
- 是否影响 Material Manifest v1 字段结构：否。
- 是否向后兼容：是，旧 schema 仍按原 props 渲染。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否，后续 npm 发布时按 materials 包 patch 记录。

## 对接说明

- `SectionContainer` 仍是 Generic Material，不是 runtime primitive。
- `MlcText` 仍是 materials 包内部实现细节，不进入物料面板，不作为公开 npm API。
- 多列、栅格或插槽能力后续需要单独 layout 协议任务设计。

## 验收标准

- [x] React/Vue `SectionContainer` 均复用内部 `MlcText`。
- [x] React/Vue material manifests 保持 componentName 和 propsSchema 对齐。
- [x] `SectionContainer` 的 DOM class 和编辑器容器识别入口不变。
- [x] 不新增公开 schema 字段、公开 primitives 包或外部依赖。
- [x] `pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- [x] `pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `pnpm pack:dry-run` 通过。

## 验证命令

```bash
pnpm --filter @meumall/lowcode-materials-h5 typecheck
pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck
pnpm test
pnpm smoke:browser
pnpm pack:dry-run
```

## 验证结果

- 2026-08-01 14:16 CST：`pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- 2026-08-01 14:16 CST：`pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- 2026-08-01 14:17 CST：`pnpm test` 通过，覆盖 build、architecture check 和 108 个单测。
- 2026-08-01 14:19 CST：`pnpm smoke:browser` 通过，覆盖 Vue3 编辑器画布、编辑器内置 runtime 和 React H5 runtime 的增强容器布局 DOM 渲染。
- 2026-08-01 14:20 CST：`pnpm pack:dry-run` 通过，8 个可发布包均通过 npm pack 内容预检。

## 发布影响

- 是否需要发布：后续真实 npm 发布时需要。
- 发布对象：`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`。
- 是否需要 changeset：是，patch。
- 是否影响 H5 接入：不影响旧页面；仅调整容器物料内部渲染实现。
- 是否影响 Java 配置平台：否。
- 回滚目标：回滚本任务提交即可恢复原容器文本渲染。

## 风险和阻塞

- 当前只收口单列容器内部文本渲染，不解决复杂布局能力。后续如需要多列或栅格，应新增独立 layout material 或协议任务。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 `SectionContainer` 内部 `MlcText` 复用。 |
| 2026-08-01 | in_progress | 开始实现 React/Vue 双端容器文本 primitive 收口。 |
| 2026-08-01 | verified | React/Vue 双端实现、测试、README、架构文档、AI 状态、changeset、browser smoke 和 pack dry-run 均已完成并验证。 |
