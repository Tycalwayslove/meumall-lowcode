# TASK-2026-0801-201-basic-state-block-material

## 状态

verified

## 目标

补齐基础物料库中的业务无关状态展示能力：新增 React/Vue H5 runtime primitive `MlcStateBlock`，并基于它实现可被运营拖拽配置的 `BasicStateBlock` 通用物料，用于空态、加载态、错误态和成功态等活动页常见反馈展示。

## 背景

物料分层文档已将 `LoadingBlock`、`EmptyBlock`、`ErrorBlock` 规划为 Runtime Primitives 适合承载的基础能力。当前物料库已有 `BasicAlert` 静态提示，但缺少可独立落到页面中的“状态块”物料，运营在搭建活动页、表单提交结果、数据占位或异常提示时仍需要重复组合文本、按钮和提示样式。该能力应先落到 primitives，再由通用物料组合 manifest 和 action 语义。

## 涉及包或系统

- `@meumall/lowcode-primitives-react-h5`
- `@meumall/lowcode-primitives-vue-h5`
- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- 文档与 AI 工作流

## 范围

包含：

- React/Vue primitives 包新增 `MlcStateBlock`，支持状态类型、标题、说明、图标文案、按钮 slot/节点、背景、边框、圆角、留白、对齐和色彩。
- React/Vue materials 包新增 `BasicStateBlock` 通用物料，manifest 与 componentName 双端对齐。
- `BasicStateBlock` 支持 `state` 枚举、标题、说明、图标、按钮文案、按钮显隐、样式配置和 `onActionClick` 安全 action。
- Vue3 编辑器物料库、默认模板/示例 schema、React H5 runtime 示例和 browser smoke 覆盖该物料。
- 补充 materials/primitives 测试、README、物料分层文档、changeset 和 AI 记忆。

不包含：

- 不新增或修改 Page Schema v1 结构。
- 不新增或修改 Material Manifest v1 结构。
- 不修改 renderer 依赖方向。
- 不接远程数据状态、接口 loading、服务端错误码、重试协议或全局 toast。
- 不替代 `BasicAlert`，`BasicAlert` 继续用于轻量静态提示卡片。

## 责任边界

当前仓库：

- primitives 包负责业务无关状态块视觉基础能力。
- materials 包负责可拖拽物料 manifest、默认 props 和安全 action 事件。
- editor playground 和 H5 runtime playground 负责本地演示与 smoke 验证。

外部系统：

- Java/BFF、H5 宿主 action handler 仍负责远程状态、重试、错误码翻译、鉴权、风控和持久化。

## 契约影响

- 是否影响跨包或跨系统契约：影响 primitives 和 materials 公开能力；不影响 Page Schema v1、Material Manifest v1 结构或 H5 runtime 集成契约。
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

1. 在 React/Vue primitives 包新增并导出 `MlcStateBlock`。
2. 在 React/Vue materials 包新增 `BasicStateBlock` 组件、manifest 和 registry。
3. 接入编辑器默认示例、React H5 runtime 示例、测试和 browser smoke。
4. 更新 README、分层文档、changeset、AI 记忆和任务验证记录。

## 验收标准

- [x] React/Vue primitives 均导出 `MlcStateBlock`，且不包含低代码 manifest 语义。
- [x] React/Vue materials 均注册 `BasicStateBlock`，manifest 双端对齐并通过校验。
- [x] Vue3 编辑器物料库可看到并添加 `BasicStateBlock`，H5 画布可渲染。
- [x] React H5 runtime 示例可渲染 `BasicStateBlock`。
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
| 2026-08-01 | `pnpm typecheck` | 通过 | TypeScript project references、Vue editor playground 和 React H5 runtime playground 类型检查通过。 |
| 2026-08-01 | `pnpm test` | 先失败后通过 | 首次失败于 Vue registry 顺序与 React 不一致；已将 Vue `BasicStateBlock` manifest 移到 `BasicAlert` 后，与 React 对齐后通过 151 项测试和架构检查。 |
| 2026-08-01 | `pnpm smoke:browser` | 通过 | 覆盖编辑器物料库、快捷命令添加、Vue H5 画布、编辑器内置 runtime、React H5 runtime 和 pageId 入口的基础状态块渲染。 |
| 2026-08-01 | `pnpm pack:dry-run` | 通过 | 12 个可发布包 npm pack dry-run 均通过。 |
| 2026-08-01 | `git diff --check` | 通过 | 未发现空白或补丁格式问题。 |

## 发布影响

- 是否需要发布：后续需要随 npm minor 发布。
- 发布对象：`@meumall/lowcode-primitives-react-h5`、`@meumall/lowcode-primitives-vue-h5`、`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不创建 tag/release。
- 回滚目标：回滚本任务提交即可，旧 schema 和旧物料不受影响。
- smoke check：`pnpm smoke:browser` 覆盖编辑器物料库、Vue H5 画布和 React H5 runtime 展示。

## 风险和阻塞

- 风险：`BasicStateBlock` 是静态状态展示物料，不代表远程 loading/error/retry 协议已经存在。
- 风险：未来数据源 loading/error 自动绑定应作为独立 renderer/adapters 协议设计，不应塞进该通用静态物料。
- 阻塞：无。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备新增状态块 primitive 与通用物料。 |
| 2026-08-01 | in_progress | 开始实现 MlcStateBlock、BasicStateBlock、示例、测试和 smoke。 |
| 2026-08-01 | verified | 完成 React/Vue primitives、materials、编辑器预设、示例、文档、changeset、AI 记忆和验证记录。 |
