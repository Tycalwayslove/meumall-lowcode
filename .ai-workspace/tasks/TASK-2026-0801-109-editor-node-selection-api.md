# TASK-2026-0801-109-editor-node-selection-api

## 标题

沉淀编辑器节点选择模型 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 中节点多选、选择裁剪、同父级判断、多选摘要、成组拖拽可用状态和拖拽节点组派生逻辑沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台或独立编辑器 shell 可以复用同一套节点选择模型。

## 背景

当前结构树搜索、折叠和节点操作菜单已经复用 editor API，但节点多选状态仍在 `apps/editor-playground/src/App.vue` 中维护：包括多选集合、空选兜底、无效节点裁剪、同父级判断、多选摘要和成组拖拽节点顺序。节点多选会影响运营搭建复杂活动页时的批量移动效率，应继续向无框架 editor API 收敛；playground 只负责 Vue 展示、DOM 事件和实际拖拽移动执行。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增节点选择模型 helper。
- helper 覆盖多选切换、无效节点裁剪、选中行派生、同父级判断、多选摘要、节点是否选中、是否可成组拖拽和拖拽节点组顺序。
- Vue3 编辑器 playground 改为消费 editor node selection API，并保持现有 UI 行为不变。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖节点选择模型 API。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或默认语义。
- 不改变 Material Manifest v1 字段结构或默认语义。
- 不改变 renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不把 DOM 拖拽、Pointer Events、吸附线、投放位置计算、节点移动执行、跨父级成组拖拽或权限审计放进 editor 包。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的节点选择状态派生、摘要和成组拖拽候选 helper。
- `apps/editor-playground` 负责 Vue 展示、DOM 事件、Pointer Events、拖拽投放、实际节点移动和用户反馈。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并用自己的组件库和权限系统渲染结构树多选状态。
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

1. 梳理 Vue3 编辑器当前节点多选和成组拖拽状态逻辑。
2. 在 editor 包新增节点选择模型 helper。
3. 将 Vue3 playground 改为消费 editor API，并保持现有交互行为不变。
4. 更新 editor 单测和 README。
5. 更新 editor interaction model 契约。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出节点选择模型 helper。
- [x] helper 可切换节点多选，并保证空选时回填当前节点。
- [x] helper 可按当前 outline rows 裁剪无效选中节点，并支持 active node 兜底。
- [x] helper 可派生选中行、同父级状态、多选摘要、节点选中状态和成组拖拽可用状态。
- [x] helper 可按结构树顺序返回成组拖拽节点 id。
- [x] Vue3 编辑器 playground 节点多选和成组拖拽状态复用 editor API。
- [x] 不修改 Page Schema、Material Manifest、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖节点选择模型 API。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器结构树多选、成组拖拽、节点操作、物料添加和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 当前 node selection API 只抽象选择状态派生，不负责 DOM 拖拽、节点移动执行、权限、审计、协作锁定或服务端保存。
- 后续若需要跨父级成组拖拽，应单独设计节点移动算法和回滚策略。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，包含 `creates reusable node selection models` 单测和架构边界检查。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，Vue3 编辑器、内置 H5 runtime 和 React H5 runtime 关键路径正常。
- `pnpm pack:dry-run` 通过，8 个可发布包均通过 npm pack dry-run。

## 剩余风险

- 当前 node selection API 只派生选择状态和成组拖拽候选，不执行 DOM 拖拽、投放位置计算、节点移动、权限、协作锁定、审计或服务端保存。
- 跨父级成组拖拽仍需后续单独设计节点移动算法、权限口径和回滚策略。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包节点选择模型 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | in_progress | 开始实现 editor 包节点选择公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 完成实现、文档、契约、事实源同步和全量验收命令。 |
