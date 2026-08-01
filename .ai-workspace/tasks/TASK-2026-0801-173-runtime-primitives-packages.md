# TASK-2026-0801-173-runtime-primitives-packages

## 状态

verified

## 目标

新增 `@meumall/lowcode-primitives-react-h5` 和 `@meumall/lowcode-primitives-vue-h5` 两个公开 npm 包，把已在 React/Vue H5 materials 内部稳定复用的 `Mlc*` runtime primitives 抽到独立包，让 materials 只保留低代码物料 manifest 与业务/通用物料组合逻辑。

## 背景

React/Vue H5 materials 包内部已经建立 `MlcButton`、`MlcImage`、`MlcTag`、`MlcText`、`MlcPrice`、`MlcInput`、`MlcSelect`、`MlcRadioGroup`、`MlcTextarea`、`MlcSwitch`、`MlcCheckbox`、`MlcStepper`、`MlcOverlay`、`MlcModal`、`MlcCountdownText`、`MlcTabs`、`MlcSpacer`、`MlcDivider`、`MlcNoticeBar` 和 `MlcRichText`，并由大量基础物料、通用物料和业务物料复用。`@meumall/lowcode-design-tokens` 已先行公开，primitives 抽包条件已经满足。为了后续 npm 引入、H5 接入和未来小程序/多端治理更清晰，本任务继续推进 Phase 2。

## 涉及包或系统

- `@meumall/lowcode-primitives-react-h5`
- `@meumall/lowcode-primitives-vue-h5`
- `@meumall/lowcode-design-tokens`
- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- 架构检查脚本
- npm dry-run 发布预检
- AI 工作区文档

## 范围

包含：

- 新增 React H5 primitives 包和 Vue H5 primitives 包。
- 将现有 React/Vue `Mlc*` runtime primitives 迁入对应 primitives 包。
- materials 包改为从 primitives 包公开入口导入 `Mlc*` 组件。
- 更新 TypeScript project references、workspace path、架构检查白名单、Changesets linked group、包依赖和测试入口。
- 更新物料分层文档、项目地图、README、AI 状态、TODO 和测试记录。

不包含：

- 不新增、删除或重命名任何低代码物料。
- 不改变 Page Schema v1 或 Material Manifest v1。
- 不改变任何物料 `componentName`、props schema、默认值、事件名或数据源槽位。
- 不把 primitives 注册到 material registry。
- 不接真实 Java 配置平台、真实素材中心或 H5 业务仓库。

## 责任边界

当前仓库：

- 维护 primitives 包、materials 包依赖和架构检查。
- 保证 primitives 只依赖 `@meumall/lowcode-design-tokens` 和对应端框架 peer dependency。
- 保证 materials 继续只声明低代码物料，不把 primitives 暴露为可拖拽物料。

外部系统：

- npm registry/token、GitHub release、Java 配置平台和 `hybird-meumall` 本任务不实际接入。

## 契约影响

- 是否影响跨包或跨系统契约：影响 npm 公开 API 和包边界；不影响 Page Schema v1、Material Manifest v1、Java 配置平台 API 或 H5 runtime 集成协议。
- 契约文档路径：`docs/material-layering-architecture.md`、`.ai-workspace/PROJECT_MAP.md`、`packages/primitives-react-h5/README.md`、`packages/primitives-vue-h5/README.md`。
- 是否向后兼容：是。新增 primitives 包并调整 materials 内部依赖，旧页面 schema 和物料 manifest 不变。
- 是否需要迁移：不需要页面数据迁移；真实 npm 发布前需要确认新增包版本与 linked group 策略。
- 是否需要灰度或双版本兼容：不需要。

## 对接说明

- 是否需要对接说明：需要，记录在 README 和架构文档。
- 对接说明路径：`packages/primitives-react-h5/README.md`、`packages/primitives-vue-h5/README.md`、`docs/material-layering-architecture.md`。
- 需要确认的角色：npm 管理员 / CI 或发布。
- 当前确认状态：待真实发布前确认。

## 实现计划

1. 新增 React/Vue primitives 可发布包，迁入现有 `Mlc*` 实现并补 README/测试。
2. 更新 materials 包 import、package.json 和 tsconfig references。
3. 更新根级 TypeScript、Changesets、架构检查、测试脚本和长期文档。
4. 运行类型检查、测试、pack dry-run，记录验证结果。

## 验收标准

- [x] 两个 primitives 包均具备可发布包结构、README、源码、构建产物和单测。
- [x] primitives 包不依赖 schema/core/editor/renderer/materials 或业务项目。
- [x] materials 包从 primitives 包公开入口消费 `Mlc*` 组件，物料 manifest 语义不变。
- [x] 架构检查能识别新增包和新的依赖方向，并继续禁止 primitives 进入 material registry。
- [x] npm dry-run 能覆盖新增后的所有可发布包。
- [x] AI 状态、TODO、任务记录和测试报告已同步。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm pack:dry-run
```

## 发布影响

- 是否需要发布：本任务不执行真实 npm 发布。
- 发布对象：后续真实发布时新增 `@meumall/lowcode-primitives-react-h5` 和 `@meumall/lowcode-primitives-vue-h5`，并发布依赖它们的 H5 materials 包。
- 是否需要 changeset：需要，新增 primitives 包并记录 materials patch 依赖变更。
- 是否需要 GitHub tag/release：本任务不需要。
- 回滚目标：回滚本任务提交后，materials 继续使用内部 `src/primitives`。
- smoke check：`pnpm test` 内含 build、架构检查和材料/renderer 单测；`pnpm pack:dry-run` 验证包内容。

## 风险和阻塞

- 新增公开包后，真实 npm 发布需要重新确认 Changesets linked group、registry、access 和 token。
- 本任务公开的是 runtime primitives 组件 API，后续破坏性调整需要走 major 或兼容层。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 React/Vue H5 runtime primitives 抽包和 materials 依赖改造。 |
| 2026-08-01 | in_progress | 新增 React/Vue primitives 包，并将 materials 改为从公开 primitives 包导入 `Mlc*` 组件。 |
| 2026-08-01 | verified | `pnpm typecheck`、`pnpm test`、`pnpm pack:dry-run` 通过，任务验收完成。 |
