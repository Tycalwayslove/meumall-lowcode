# TASK-2026-0801-202-basic-progress-material

## 状态

verified

## 目标

补齐基础物料库中的业务无关进度展示能力：新增 React/Vue H5 runtime primitive `MlcProgress`，并基于它实现可被运营拖拽配置的 `BasicProgress` 通用物料，用于活动页常见的达成率、配置完成度、任务进展或静态说明进度展示。

## 背景

当前基础物料库已具备按钮、链接、输入、价格、图片、标签、卡片、轮播、视频、弹窗、表单、列表、折叠、时间线、提示和状态块。活动页和推广页还常需要“进度/达成率/阶段完成度”这类业务无关展示能力。如果让运营反复组合文本、色块和说明，使用成本高且样式不稳定。该能力应先落到 primitives，再由通用物料组合 manifest 和编辑器配置语义。

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

- React/Vue primitives 包新增 `MlcProgress`，支持 value/max、标题/说明、数值展示、进度条高度、圆角、背景、填充色和文字颜色。
- React/Vue materials 包新增 `BasicProgress` 通用物料，manifest 与 componentName 双端对齐。
- `BasicProgress` 支持标题、说明、数值、最大值、后缀、数值显隐、语气、样式配置和编辑器 number/color/select 控件元数据。
- Vue3 编辑器物料库、默认模板/示例 schema、React H5 runtime 示例和 browser smoke 覆盖该物料。
- 补充 materials/primitives/editor 测试、README、物料分层文档、changeset 和 AI 记忆。

不包含：

- 不新增或修改 Page Schema v1 结构。
- 不新增或修改 Material Manifest v1 结构。
- 不修改 renderer 依赖方向。
- 不接远程任务进度、活动达成率接口、订单状态、审批流程、自动刷新、动效编排或服务端百分比计算。

## 责任边界

当前仓库：

- primitives 包负责业务无关进度条视觉基础能力。
- materials 包负责可拖拽物料 manifest、默认 props 和展示语义。
- editor playground 和 H5 runtime playground 负责本地演示与 smoke 验证。

外部系统：

- Java/BFF、H5 宿主 action/data source handler 仍负责真实活动进度、任务达成率、审批状态、订单状态、鉴权、缓存和持久化。

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

1. 在 React/Vue primitives 包新增并导出 `MlcProgress`。
2. 在 React/Vue materials 包新增 `BasicProgress` 组件、manifest 和 registry。
3. 接入编辑器默认示例、React H5 runtime 示例、测试和 browser smoke。
4. 更新 README、分层文档、changeset、AI 记忆和任务验证记录。

## 验收标准

- [x] React/Vue primitives 均导出 `MlcProgress`，且不包含低代码 manifest 语义。
- [x] React/Vue materials 均注册 `BasicProgress`，manifest 双端对齐并通过校验。
- [x] Vue3 编辑器物料库可看到并添加 `BasicProgress`，H5 画布可渲染。
- [x] React H5 runtime 示例可渲染 `BasicProgress`。
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

## 验证记录

| 日期 | 命令 | 结果 | 说明 |
| --- | --- | --- | --- |
| 2026-08-01 | `pnpm typecheck` | 通过 | React/Vue primitives、materials、editor playground 和 H5 runtime 类型检查通过。 |
| 2026-08-01 | `pnpm test` | 通过 | build、架构检查、React/Vue manifest 对齐、primitives 边界、editor preset/profile 和 material 单测通过。 |
| 2026-08-01 | `pnpm smoke:browser` | 通过 | Vue3 编辑器物料库、命令面板添加、默认模板、编辑器内置 runtime、React H5 runtime 和 pageId 入口均覆盖基础进度条。 |
| 2026-08-01 | `pnpm pack:dry-run` | 通过 | 12 个可发布包 dry-run 内容检查通过。 |
| 2026-08-01 | `git diff --check` | 通过 | 未发现空白或行尾格式问题。 |

## 发布影响

- 是否需要发布：后续需要随 npm minor 发布。
- 发布对象：`@meumall/lowcode-primitives-react-h5`、`@meumall/lowcode-primitives-vue-h5`、`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`、`@meumall/lowcode-editor`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不创建 tag/release。
- 回滚目标：回滚本任务提交即可，旧 schema 和旧物料不受影响。
- smoke check：`pnpm smoke:browser` 覆盖编辑器物料库、Vue H5 画布和 React H5 runtime 展示。

## 风险和阻塞

- 风险：`BasicProgress` 是静态进度展示物料，不代表远程活动进度、任务刷新或审批状态协议已经存在。
- 风险：未来远程进度、自动刷新或服务端百分比计算应作为 data source/action/业务物料协议设计，不应塞进该通用静态物料。
- 阻塞：无。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备新增进度条 primitive 与通用物料。 |
| 2026-08-01 | in_progress | 开始实现 MlcProgress、BasicProgress、示例、测试和 smoke。 |
| 2026-08-01 | verified | 完成基础进度条 primitive、通用物料、编辑器接入、runtime 示例、文档、changeset 和验证记录。 |
