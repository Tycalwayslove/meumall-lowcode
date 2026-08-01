# TASK-2026-0801-204-basic-metric-grid-material

## 状态

verified

## 目标

在 `BasicMetric` 单指标物料基础上，新增业务无关 `BasicMetricGrid` 通用指标组物料，让运营可以用一个物料配置 2-6 个静态指标摘要，适用于活动页、推广页、说明页中的多指标展示区。

## 背景

运营页面常见“一组数字摘要”场景，例如“参与人数 / 今日上新 / 优惠券 / 浏览量”。如果运营逐个拖拽多个 `BasicMetric`，布局一致性和移动成本都会变差。该能力应复用已有 `MlcMetric` primitive，在 materials 层组合为可拖拽物料，不把远程统计、实时刷新、库存计算或埋点聚合塞进通用物料。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `@meumall/lowcode-editor`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- 文档与 AI 工作流

## 范围

包含：

- React/Vue H5 materials 包新增 `BasicMetricGrid` 通用指标组物料，manifest 与 componentName 双端对齐。
- `BasicMetricGrid` 复用 `MlcMetric`，支持标题、说明、静态指标数组、列数、语气、卡片/简洁样式、对齐、间距、圆角、边框、颜色、留白和阴影配置。
- Vue3 编辑器物料库、插入预设、默认模板、React H5 runtime 示例和 browser smoke 覆盖该物料。
- 补充 materials/editor 测试、README、物料分层文档、changeset 和 AI 记忆。

不包含：

- 不新增 runtime primitive；继续复用已有 `MlcMetric`。
- 不新增或修改 Page Schema v1 结构。
- 不新增或修改 Material Manifest v1 结构。
- 不修改 renderer 依赖方向。
- 不接远程统计接口、实时刷新、埋点聚合、库存计算、销量计算、人数计算、权限、风控或服务端格式化。

## 责任边界

当前仓库：

- materials 包负责指标组物料 manifest、默认 props、静态数组渲染和展示语义。
- editor playground 和 H5 runtime playground 负责本地演示与 smoke 验证。

外部系统：

- Java/BFF、H5 宿主 data source/action handler 仍负责真实统计数据、实时刷新、库存/销量/人数计算、鉴权、缓存和持久化。

## 契约影响

- 是否影响跨包或跨系统契约：影响 materials 和 editor 公开物料能力；不影响 Page Schema v1、Material Manifest v1 结构或 H5 runtime 集成契约。
- 契约文档路径：`docs/material-layering-architecture.md`、`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`
- 是否向后兼容：是。新增物料，不影响旧 schema。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要。
- 对接说明路径：上述 README、`docs/material-layering-architecture.md`、`.ai/AI_CONTEXT.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 在 React/Vue materials 包新增 `BasicMetricGrid` 组件、manifest 和 registry。
2. 接入编辑器插入预设、默认示例、React H5 runtime 示例、测试和 browser smoke。
3. 更新 README、分层文档、changeset、AI 记忆和任务验证记录。

## 验收标准

- [x] React/Vue materials 均注册 `BasicMetricGrid`，manifest 双端对齐并通过校验。
- [x] `BasicMetricGrid` 复用 `MlcMetric`，不新增 primitive 或 manifest 结构。
- [x] Vue3 编辑器物料库可看到并添加 `BasicMetricGrid`，H5 画布可渲染。
- [x] React H5 runtime 示例可渲染 `BasicMetricGrid`。
- [x] 不改变 Page Schema v1、Material Manifest v1 或 renderer 依赖方向。
- [x] 验证命令通过，并在任务文件记录结果。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
pnpm pack:dry-run
git diff --check
```

## 发布影响

- 是否需要发布：后续需要随 npm minor 发布。
- 发布对象：`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`、`@meumall/lowcode-editor`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不创建 tag/release。
- 回滚目标：回滚本任务提交即可，旧 schema 和旧物料不受影响。
- smoke check：`pnpm smoke:browser` 覆盖编辑器物料库、Vue H5 画布和 React H5 runtime 展示。

## 风险和阻塞

- 风险：`BasicMetricGrid` 是静态指标组展示物料，不代表远程统计、实时刷新、库存计算或销量计算协议已经存在。
- 风险：未来真实指标组应作为 data source/action/业务物料协议设计，不应塞进该通用静态物料。
- 阻塞：无。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备新增通用静态指标组物料。 |
| 2026-08-01 | verified | 已完成 React/Vue materials、编辑器预设、数组项编辑模型、模板示例、React H5 runtime 示例、README、分层文档、changeset 和 AI 记忆；`pnpm typecheck`、`pnpm test`、`pnpm smoke:browser`、`pnpm pack:dry-run` 和 `git diff --check` 均已通过。 |
