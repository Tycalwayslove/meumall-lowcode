# TASK-2026-0801-112-editor-canvas-operation-api

## 标题

沉淀编辑器画布投放操作 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 中基于 canvas drop hint/drop target 执行物料插入、单节点移动和同父级成组移动的框架无关 schema 写入逻辑沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台或独立编辑器 shell 可以复用同一套画布投放操作口径。

## 背景

当前 editor 包已经沉淀 canvas drop hint API、canvas drop target API 和基础 `insertNode`、`moveNodeById` 等 headless command。Vue3 playground 仍在组件内编排物料插入、单节点移动和同父级成组移动的 schema 写入流程，后续如果直接迁管理台，容易复制一份相近逻辑。本任务把“由 hint/target 到新 editor state”的纯操作继续下沉到 editor 包；Vue3 playground 仍负责 DOM 事件、Pointer Events、DragEvent、权限、确认弹窗、用户反馈和服务端保存。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增画布物料插入操作 helper。
- 在 `@meumall/lowcode-editor` 新增画布单节点移动操作 helper。
- 在 `@meumall/lowcode-editor` 新增同父级成组移动操作 helper。
- 新 helper 复用现有 drop target API、`insertNode` 和 `moveNodeById` 等 editor command。
- Vue3 编辑器 playground 改为消费 editor canvas operation API，并保持现有交互行为不变。
- 增加 editor 单测覆盖画布操作 API。
- 更新 editor README 和 editor interaction model 契约。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或默认语义。
- 不改变 Material Manifest v1 字段结构或默认语义。
- 不改变 renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不把 DOM 查询、Pointer Events、DragEvent、真实权限、协作锁定、审计、确认弹窗、用户反馈或服务端保存放进 editor 包。
- 不实现跨父级成组拖拽。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的画布投放操作 helper，输入 editor state、outline rows、drop hint 和物料/节点源，输出新的 editor state 或 no-op。
- `apps/editor-playground` 负责 Vue 展示、DOM 事件、Pointer Events、DragEvent、资源选择、权限占位、实际用户反馈和本地 mock 保存。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并在调用前后叠加权限、协作锁定、审计和服务端保存。
- Java 配置平台、H5 runtime、真实素材/商品/优惠券/门店/达人中心不受本任务影响。

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

1. 梳理 Vue3 编辑器当前物料插入、单节点移动和同父级成组移动写入逻辑。
2. 在 editor 包新增 canvas operation 类型和 helper。
3. 将 Vue3 playground 改为消费 editor API，并保持现有交互行为不变。
4. 更新 editor 单测和 README。
5. 更新 editor interaction model 契约。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出画布物料插入操作 helper。
- [x] `@meumall/lowcode-editor` 导出画布单节点移动操作 helper。
- [x] `@meumall/lowcode-editor` 导出同父级成组移动操作 helper。
- [x] helper 能复用 canvas drop target API，并输出新的 `LowcodeEditorState`。
- [x] helper 能保持非法目标、缺失节点、拖向自身/后代时 no-op。
- [x] helper 能保持同父级成组移动的节点顺序。
- [x] Vue3 编辑器 playground 物料插入、单节点移动和同父级成组移动写入复用 editor API。
- [x] 不修改 Page Schema、Material Manifest、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖 canvas operation API。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器物料添加、节点移动、同父级成组拖拽和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 当前 canvas operation API 只执行纯 schema/editor state 变更，不处理 DOM 事件、权限、协作锁定、审计或服务端保存。
- 跨父级成组拖拽仍需后续单独设计节点移动算法、权限口径和回滚策略。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，包含 `applies reusable canvas operations to editor state` 单测和架构边界检查。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，Vue3 编辑器、内置 H5 runtime 和 React H5 runtime 关键路径正常。
- `pnpm pack:dry-run` 通过，8 个可发布包均通过 npm pack dry-run。

## 剩余风险

- 当前 canvas operation API 只处理框架无关 editor state/schema 写入，不处理 DOM 事件、Pointer Events、DragEvent、权限、协作锁定、审计、用户反馈或服务端保存。
- 跨父级选区成组拖拽仍需后续单独设计节点移动算法、权限口径和回滚策略。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包画布投放操作 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | in_progress | 开始实现 editor 包 canvas operation 公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 完成实现、文档、契约、事实源同步和全量验收命令。 |
