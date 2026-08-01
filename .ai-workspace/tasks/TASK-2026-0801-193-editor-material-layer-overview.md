# TASK-2026-0801-193-editor-material-layer-overview

## 状态

verified

## 目标

为 `@meumall/lowcode-editor` 增加框架无关的物料分层总览 API，并在 Vue3 编辑器物料面板展示当前物料属于基础组件族、通用物料或业务物料的架构信息，帮助后续新增基础物料和业务物料时保持分层清晰。

## 背景

当前仓库已经按 `docs/material-layering-architecture.md` 建立 Design Tokens、Runtime Primitives、Generic Materials、Business Materials 分层，也已把 React/Vue H5 runtime primitives 抽成公开包。上一轮已完成物料分类说明和数量摘要，但分类只表达运营视角的 `basic/layout/content/form/marketing/commerce`，还不能告诉协作者“这个物料落在哪一层、属于 Button/Input/Image/Form/List 等哪个基础能力族、后续业务物料应该复用什么”。本任务把这部分架构信息沉淀为 editor 纯 helper，避免写死在 Vue 组件里。

## 涉及包或系统

- `@meumall/lowcode-editor`
- `apps/editor-playground`
- 文档与 AI 工作流

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增物料分层、基础能力族和物料 profile 相关公开类型与 helper。
- 根据现有 manifest 的 `componentName` 和 `category` 派生通用物料、业务物料、自定义物料等架构信息。
- 在 Vue3 编辑器物料面板展示当前筛选结果的分层总览和单个物料的分层/能力族标签。
- 补充单元测试、browser smoke、README、changeset、项目状态和任务验证记录。

不包含：

- 不修改 Page Schema v1、Material Manifest v1 字段结构。
- 不调整 React/Vue H5 renderer 渲染行为。
- 不新增业务物料或基础 primitive。
- 不接入 Java 配置平台真实物料白名单接口。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 提供框架无关分析模型。
- `apps/editor-playground` 只消费分析模型做展示和 smoke 验证。

外部系统：

- Java 配置平台未来可消费同一 npm API 或在服务端复刻同一规则，但本任务不实现服务端校验。
- H5 runtime 不消费 editor API。

## 契约影响

- 是否影响跨包或跨系统契约：影响 npm 包公开 API，不影响 schema/renderer/material manifest 契约。
- 契约文档路径：`packages/editor/README.md`
- 是否向后兼容：是，新增 helper 和只读展示字段。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要。
- 对接说明路径：`packages/editor/README.md`、`.ai/AI_CONTEXT.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 在 editor 包新增物料层级、能力族、profile 和总览 helper。
2. 在 Vue3 物料目录组件展示分层总览和物料标签。
3. 补充测试、smoke、README、changeset 和 AI 状态记录。

## 验收标准

- [x] editor API 能稳定识别现有基础物料、布局容器、内容通用物料、表单通用物料、营销/交易业务物料和未知自定义物料。
- [x] Vue3 编辑器物料面板展示当前物料筛选结果的分层总览和每个物料的层级/能力族标签。
- [x] 不改变 schema、renderer、materials manifest 结构或包依赖方向。
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
- 发布对象：`@meumall/lowcode-editor`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不创建 tag/release。
- 回滚目标：回滚本任务提交即可，不影响旧 schema 渲染。
- smoke check：`pnpm smoke:browser` 覆盖 Vue3 物料面板分层总览展示。

## 风险和阻塞

- 风险：componentName 规则属于 editor 默认分析模型，未来 Java 物料中心若支持自定义物料，应通过配置覆盖或 manifest 扩展治理。
- 阻塞：无。

## 实现结果

- `@meumall/lowcode-editor` 新增物料层级、能力族、物料 profile 和架构总览 helper。
- `createLowcodeMaterialCatalogItem` 增加层级和能力族展示字段，搜索文本包含分类/层级/能力族标签。
- Vue3 编辑器物料目录展示当前筛选结果的物料分层摘要和每个物料的层级/基础能力族标签。
- `packages/editor/README.md`、`.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md`、`.ai/TODO.md` 和 changeset 已同步。

## 验证结果

| 命令 | 结果 |
| --- | --- |
| `pnpm typecheck` | 通过 |
| `pnpm test` | 通过，包含 build、architecture check 和 143 个测试 |
| `pnpm smoke:browser` | 通过，覆盖 Vue3 物料架构分层展示和分类切换 |
| `pnpm pack:dry-run` | 通过，12 个可发布包 dry-run 通过 |
| `git diff --check` | 通过 |

## 未验证项

- 未接入真实 Java 物料中心 profile 覆盖；本任务只提供 editor 默认模型和前端展示。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备实现 editor 物料分层总览 API。 |
| 2026-08-01 | in_progress | 已实现 editor 物料层级、基础能力族、profile 和架构总览 helper，并接入 Vue3 物料面板展示。 |
| 2026-08-01 | verified | 类型检查、单测、browser smoke、npm pack dry-run 和 diff check 均通过。 |
