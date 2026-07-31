# TASK-2026-0801-106-editor-material-detail-api

## 标题

沉淀编辑器物料详情模型 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 中物料详情弹窗的配置字段列表、事件列表、数据槽列表、详情摘要和默认 H5 预览 Page Schema 派生逻辑沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台或独立编辑器 shell 可以复用同一套物料详情展示模型。

## 背景

当前物料目录搜索、分类和卡片摘要已经复用 editor material catalog API，但物料详情弹窗仍在 `apps/editor-playground/src/App.vue` 中直接读取 `LowcodeMaterialManifest` 并自行拼装 props、events、dataSourceSlots 和默认预览 schema。物料详情是运营理解物料能力的重要入口，应继续向无框架 editor API 收敛；playground 只负责弹窗、Vue 渲染器、添加按钮和用户反馈。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增物料详情 prop/event/data source slot 展示模型。
- 在 `@meumall/lowcode-editor` 新增物料详情摘要 helper。
- 在 `@meumall/lowcode-editor` 新增从物料 manifest 派生默认预览节点和默认预览 Page Schema 的 helper。
- Vue3 编辑器 playground 改为消费 editor material detail API，并保持现有 UI 行为不变。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖物料详情模型 API。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或默认语义。
- 不改变 Material Manifest v1 字段结构或默认语义。
- 不改变 renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不新增物料详情 UI 组件库，不改变物料详情弹窗 DOM 或样式。
- 不在 editor 包中引入 Vue、React、DOM、localStorage、HTTP 或管理台组件库。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的物料详情展示模型和默认预览 schema 派生 helper。
- `apps/editor-playground` 负责渲染 Vue 弹窗、调用 Vue H5 renderer 预览、添加物料到画布、收藏和用户反馈。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并用自己的 Vue 组件库渲染物料详情。
- 权限、物料上下架、审计、真实素材和真实预览环境仍由宿主业务系统负责。

## 契约影响

- 是否影响跨包或跨系统契约：是，`@meumall/lowcode-editor` 新增向后兼容的公开 API。
- 契约文档路径：`.ai-workspace/contracts/editor-interaction-model-v1.md`、`packages/editor/README.md`。
- 是否向后兼容：是，新增导出，不修改旧 API 语义。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/editor/README.md`。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 梳理 Vue3 编辑器当前物料详情字段、事件、数据槽和默认预览 schema 逻辑。
2. 在 editor 包新增物料详情模型、摘要、预览节点和预览 Page Schema helper。
3. 将 Vue3 playground 改为消费 editor API，并保持现有交互行为不变。
4. 更新 editor 单测和 README。
5. 更新 editor interaction model 契约。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出物料详情 prop/event/data source slot 展示模型 helper。
- [x] helper 可从 `LowcodeMaterialManifest` 派生物料详情摘要。
- [x] helper 可从 `LowcodeMaterialManifest` 派生默认预览节点和默认预览 Page Schema。
- [x] Vue3 编辑器 playground 物料详情弹窗复用 editor API。
- [x] 不修改 Page Schema、Material Manifest、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖物料详情模型 API。
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

- 是否需要发布：否，本任务只提交源码和文档；未来真实 npm 发布时作为 `@meumall/lowcode-editor` 向后兼容 minor 能力评估。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否。
- 是否影响 npm 发布：新增 editor 包公开 API，`pnpm pack:dry-run` 需要通过。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器物料详情、物料添加、页面设置、发布检查和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 当前 API 只抽象物料详情展示模型和默认预览 schema，不负责弹窗 UI、renderer 预览、权限、上下架、审计或服务端保存。
- 预览节点默认只按物料 `defaultProps` 和少量 data source slot 约定生成，后续如果 Java 物料市场提供更丰富预览样例，应在现有 helper 上做向后兼容扩展。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，66 个测试全部通过，包含 editor material detail API 单测。
- `pnpm check:architecture`：通过，包结构、依赖方向、物料 manifest 对齐和 primitives 边界未破坏。
- `pnpm smoke:browser`：通过，Vue3 编辑器物料详情默认 H5 预览、配置字段展示、一键添加、物料收藏、页面设置、发布检查和 H5 runtime 关键路径仍可用。
- `pnpm pack:dry-run`：通过，8 个可发布包 dry-run 全部通过，包含 `@meumall/lowcode-editor`。

## 剩余风险

- 当前 material detail API 只抽象物料详情展示模型、默认插入节点和默认预览 schema，不负责弹窗 UI、renderer 预览、权限、上下架、审计或服务端保存。
- 本任务新增 `@meumall/lowcode-editor` 公开 API，但未执行真实 npm 发布；真实发布仍需 registry、access、token 和 changeset 版本确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包物料详情模型 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | in_progress | 开始实现 editor 包物料详情公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包物料详情模型 API、Vue3 playground 复用、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
