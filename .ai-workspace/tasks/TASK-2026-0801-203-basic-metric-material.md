# TASK-2026-0801-203-basic-metric-material

## 状态

verified

## 目标

补齐基础物料库中的业务无关指标展示能力：新增 React/Vue H5 runtime primitive `MlcMetric`，并基于它实现可被运营拖拽配置的 `BasicMetric` 通用物料，用于活动页、推广页、说明页中展示静态数字指标、标签指标、人数、销量、达成数或配置摘要。

## 背景

当前基础物料库已具备文本、价格、提示、状态块和进度条，但运营页经常还需要展示“今日上新 24 款”“已有 1280 人参与”“库存 36 件”这类静态指标卡。如果让运营用普通文本反复拼排，样式不稳定且使用成本高。该能力应先落到 primitives，再由通用物料组合低代码 manifest，避免把业务统计接口、实时刷新或远程数据协议塞进基础物料。

## 涉及包或系统

- `@meumall/lowcode-primitives-react-h5`
- `@meumall/lowcode-primitives-vue-h5`
- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `@meumall/lowcode-editor`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- 文档与 AI 工作流

## 范围

包含：

- React/Vue primitives 包新增 `MlcMetric`，支持标签、数值、前缀、后缀、说明、对齐、字体大小、颜色和间距。
- React/Vue materials 包新增 `BasicMetric` 通用物料，manifest 与 componentName 双端对齐。
- `BasicMetric` 支持标题/标签、数值、前后缀、说明、语气、对齐、卡片/简洁样式、颜色、圆角、边框、留白和阴影配置。
- Vue3 编辑器物料库、默认模板/示例 schema、React H5 runtime 示例和 browser smoke 覆盖该物料。
- 补充 primitives/materials/editor 测试、README、物料分层文档、changeset 和 AI 记忆。

不包含：

- 不新增或修改 Page Schema v1 结构。
- 不新增或修改 Material Manifest v1 结构。
- 不修改 renderer 依赖方向。
- 不接远程统计接口、实时刷新、埋点聚合、库存计算、销量计算、人数计算、权限、风控或服务端格式化。

## 责任边界

当前仓库：

- primitives 包负责业务无关指标展示基础能力。
- materials 包负责可拖拽物料 manifest、默认 props 和展示语义。
- editor playground 和 H5 runtime playground 负责本地演示与 smoke 验证。

外部系统：

- Java/BFF、H5 宿主 data source/action handler 仍负责真实统计数据、实时刷新、库存/销量/人数计算、鉴权、缓存和持久化。

## 契约影响

- 是否影响跨包或跨系统契约：影响 primitives、materials 和 editor 公开能力；不影响 Page Schema v1、Material Manifest v1 结构或 H5 runtime 集成契约。
- 契约文档路径：`docs/material-layering-architecture.md`、`packages/primitives-react-h5/README.md`、`packages/primitives-vue-h5/README.md`、`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`
- 是否向后兼容：是。新增物料和新增 primitive，不影响旧 schema。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要。
- 对接说明路径：上述 README、`docs/material-layering-architecture.md`、`.ai/AI_CONTEXT.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 在 React/Vue primitives 包新增并导出 `MlcMetric`。
2. 在 React/Vue materials 包新增 `BasicMetric` 组件、manifest 和 registry。
3. 接入编辑器插入预设、默认示例、React H5 runtime 示例、测试和 browser smoke。
4. 更新 README、分层文档、changeset、AI 记忆和任务验证记录。

## 验收标准

- [x] React/Vue primitives 均导出 `MlcMetric`，且不包含低代码 manifest 语义。
- [x] React/Vue materials 均注册 `BasicMetric`，manifest 双端对齐并通过校验。
- [x] Vue3 编辑器物料库可看到并添加 `BasicMetric`，H5 画布可渲染。
- [x] React H5 runtime 示例可渲染 `BasicMetric`。
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
- 发布对象：`@meumall/lowcode-primitives-react-h5`、`@meumall/lowcode-primitives-vue-h5`、`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`、`@meumall/lowcode-editor`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不创建 tag/release。
- 回滚目标：回滚本任务提交即可，旧 schema 和旧物料不受影响。
- smoke check：`pnpm smoke:browser` 覆盖编辑器物料库、Vue H5 画布和 React H5 runtime 展示。

## 风险和阻塞

- 风险：`BasicMetric` 是静态指标展示物料，不代表远程统计、实时刷新、库存计算或销量计算协议已经存在。
- 风险：未来真实指标应作为 data source/action/业务物料协议设计，不应塞进该通用静态物料。
- 阻塞：无。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备新增指标展示 primitive 与通用物料。 |
| 2026-08-01 | in_progress | 开始实现 MlcMetric、BasicMetric、示例、测试和 smoke。 |
| 2026-08-01 | verified | 已完成 React/Vue primitives、materials、编辑器预设、模板示例、React H5 runtime 示例、README、分层文档、changeset 和 AI 记忆；`pnpm typecheck`、`pnpm test`、`pnpm smoke:browser`、`pnpm pack:dry-run` 和 `git diff --check` 均已通过。 |
