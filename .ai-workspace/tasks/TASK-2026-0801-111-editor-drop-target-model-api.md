# TASK-2026-0801-111-editor-drop-target-model-api

## 标题

沉淀编辑器画布投放目标模型 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 中由画布 drop hint 派生 `parentId + index`、单节点移动 index 修正和同父级成组移动 index 修正的纯模型逻辑沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台或独立编辑器 shell 可以复用同一套投放目标口径。

## 背景

当前 canvas drop hint API 已经沉淀了 before/after/inside/append 投放位置、投放提示样式、吸附线和非法节点目标判断。但 Vue3 playground 中仍保留了 `getGroupDropTarget`、`getAdjustedMoveIndex` 和同父级成组移动的目标 index 修正逻辑。它们不依赖 DOM，只依赖 outline rows、hint、root node 数量和源节点行，适合继续收敛到 editor 包；playground 继续负责真实插入、真实移动、schema commit、DOM 事件和用户反馈。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增画布 drop target 模型类型和 helper。
- helper 覆盖 append/inside/before/after 到 `parentId + index` 的派生。
- helper 覆盖单节点同父级 before/after 移动 index 修正。
- helper 覆盖同父级成组移动时，源节点移除后目标 index 的修正。
- Vue3 编辑器 playground 改为消费 editor drop target API，并保持现有 UI 行为不变。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖 drop target 模型 API。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或默认语义。
- 不改变 Material Manifest v1 字段结构或默认语义。
- 不改变 renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不把 DOM 查询、Pointer Events、DragEvent、真实插入节点、真实移动节点、siblings 替换、跨父级成组拖拽算法、权限、协作锁定、审计或服务端保存放进 editor 包。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的投放目标、单节点移动目标和同父级成组移动目标派生。
- `apps/editor-playground` 负责 Vue 展示、DOM 事件、Pointer Events、DragEvent、实际节点插入/移动、schema commit 和用户反馈。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并结合自己的权限、协作锁定和审计系统执行真实插入/移动。
- 权限、协作锁定、审计、多端交互差异和服务端保存仍由宿主业务系统负责。

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

1. 梳理 Vue3 编辑器当前 drop target、单节点移动 index 和成组移动 index 修正逻辑。
2. 在 editor 包新增 drop target 模型类型和 helper。
3. 将 Vue3 playground 改为消费 editor API，并保持现有交互行为不变。
4. 更新 editor 单测和 README。
5. 更新 editor interaction model 契约。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出画布 drop target 模型类型和 helper。
- [x] helper 可从 append hint 派生根节点末尾目标。
- [x] helper 可从 inside hint 派生目标节点子节点末尾目标。
- [x] helper 可从 before/after hint 派生同父级前后插入目标。
- [x] helper 可修正单节点同父级 before/after 移动 index。
- [x] helper 可修正同父级成组移动移除源节点后的目标 index。
- [x] Vue3 编辑器 playground 物料插入、单节点移动和同父级成组移动目标派生复用 editor API。
- [x] 不修改 Page Schema、Material Manifest、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖 drop target 模型 API。
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

- 当前 drop target API 只派生插入/移动目标，不执行 DOM 事件、真实插入、真实移动、权限、审计、协作锁定或服务端保存。
- 跨父级成组拖拽仍需后续单独设计节点移动算法、权限口径和回滚策略。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，包含 `creates reusable canvas drop target models` 单测和架构边界检查。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，Vue3 编辑器、内置 H5 runtime 和 React H5 runtime 关键路径正常。
- `pnpm pack:dry-run` 通过，8 个可发布包均通过 npm pack dry-run。

## 剩余风险

- 当前 drop target API 只派生插入/移动目标，不执行 DOM 事件、真实插入、真实移动、权限、协作锁定、审计或服务端保存。
- 跨父级成组拖拽仍需后续单独设计节点移动算法、权限口径和回滚策略。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包画布 drop target 模型 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | in_progress | 开始实现 editor 包 drop target 公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 完成实现、文档、契约、事实源同步和全量验收命令。 |
