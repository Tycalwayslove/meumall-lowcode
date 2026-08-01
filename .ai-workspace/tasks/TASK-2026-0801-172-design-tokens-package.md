# TASK-2026-0801-172-design-tokens-package

## 状态

verified

## 目标

新增公开 npm 包 `@meumall/lowcode-design-tokens`，先承载 H5 runtime primitives 已稳定复用的框架无关视觉 token 与基础 helper，并让 React/Vue H5 materials 内部 primitives 改为消费该包，为后续抽 `primitives-react-h5`、`primitives-vue-h5` 和多端物料演进打基础。

## 背景

当前 React/Vue H5 materials 包内部均已有 `h5Tokens`、`MlcButton`、`MlcInput`、`MlcImage`、`MlcTag`、`MlcText` 等 runtime primitives 原型，并且大量通用物料和业务物料已经复用这些 primitives。继续把 token 复制在两个 materials 包里，会让后续 npm 拆包、多端适配和基础组件抽离变得不精准。因此本任务先抽框架无关 design tokens，不大规模搬迁 Button/Input 组件实现。

## 涉及包或系统

- `@meumall/lowcode-design-tokens`
- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- 架构检查脚本
- npm dry-run 发布预检
- AI 工作区文档

## 范围

包含：

- 新增 `packages/design-tokens` 可发布包。
- 导出 H5 token、tone 类型、tone 取色 helper、颜色 tint helper 和 CSS 变量派生 helper。
- React/Vue H5 materials 内部 primitives 改为从 design tokens 包消费 `h5Tokens` 和 helper。
- 更新 TypeScript project references、workspace path、架构检查白名单、Changesets linked group 和包依赖。
- 更新材料分层文档、项目地图、README、AI 状态、TODO 和测试记录。

不包含：

- 不抽 `@meumall/lowcode-primitives-react-h5` 或 `@meumall/lowcode-primitives-vue-h5`。
- 不改变 Page Schema v1 或 Material Manifest v1。
- 不改变任何物料 `componentName`、props schema、默认值或渲染语义。
- 不接真实 Java 配置平台、真实素材中心或 H5 业务仓库。

## 责任边界

当前仓库：

- 维护 design tokens 包、materials 包依赖和架构检查。
- 保证 tokens 不依赖 schema/core/editor/renderer/materials。
- 保证 materials 仍只通过公开包入口依赖 design tokens。

外部系统：

- npm registry/token、GitHub release、Java 配置平台和 `hybird-meumall` 本任务不实际接入。

## 契约影响

- 是否影响跨包或跨系统契约：影响 npm 公开 API 和包边界；不影响 Page Schema v1、Material Manifest v1、Java 配置平台 API 或 H5 runtime 集成协议。
- 契约文档路径：`docs/material-layering-architecture.md`、`.ai-workspace/PROJECT_MAP.md`。
- 是否向后兼容：是。新增包并让 materials 内部实现消费共享 token，旧页面 schema 和物料 manifest 不变。
- 是否需要迁移：不需要页面数据迁移；真实 npm 发布前需要确认新增包版本与 linked group 策略。
- 是否需要灰度或双版本兼容：不需要。

## 对接说明

- 是否需要对接说明：需要，记录在 README 和架构文档。
- 对接说明路径：`packages/design-tokens/README.md`、`docs/material-layering-architecture.md`。
- 需要确认的角色：npm 管理员 / CI 或发布。
- 当前确认状态：待真实发布前确认。

## 实现计划

1. 新增 `packages/design-tokens` 包、源码、README 和单测。
2. 更新 React/Vue H5 materials 内部 primitives 的 token 来源和包依赖。
3. 更新 TypeScript、Changesets、架构检查、测试脚本和长期文档。
4. 运行类型检查、测试、架构检查、pack dry-run，记录验证结果。

## 验收标准

- [x] `@meumall/lowcode-design-tokens` 是可发布包，具备 `package.json`、`README.md`、`src/index.ts` 和构建产物。
- [x] design tokens 包不依赖 schema/core/editor/renderer/materials 或业务项目。
- [x] React/Vue H5 materials 内部 primitives 共同消费 design tokens 包，且不改变物料 manifest 语义。
- [x] 架构检查能识别新增包和新的依赖方向。
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
- 发布对象：后续真实发布时新增 `@meumall/lowcode-design-tokens`，并发布依赖它的 H5 materials 包。
- 是否需要 changeset：需要，新增 design tokens 包并记录 materials patch 依赖变更。
- 是否需要 GitHub tag/release：本任务不需要。
- 回滚目标：回滚本任务提交后，materials 继续使用内部 `h5Tokens`。
- smoke check：`pnpm test` 内含 build、架构检查和材料/renderer 单测；`pnpm pack:dry-run` 验证包内容。

## 风险和阻塞

- 新增公开包后，真实 npm 发布需要重新确认 Changesets linked group、registry、access 和 token。
- 本任务只抽 tokens，不代表 runtime primitives 组件 API 已稳定公开。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 design tokens 包和 materials token 消费改造。 |
| 2026-08-01 | in_progress | 新增 design tokens 包，并改造 React/Vue H5 materials 内部 primitives 消费共享 token。 |
| 2026-08-01 | verified | `pnpm typecheck`、`pnpm test`、`pnpm pack:dry-run` 通过，任务验收完成。 |
