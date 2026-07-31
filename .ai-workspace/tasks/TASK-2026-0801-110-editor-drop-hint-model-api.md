# TASK-2026-0801-110-editor-drop-hint-model-api

## 标题

沉淀编辑器画布投放提示模型 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 中画布拖拽投放位置、投放提示样式、吸附线和节点拖拽非法目标判断的纯模型逻辑沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台或独立编辑器 shell 可以复用同一套 drop hint 口径。

## 背景

当前结构树、节点操作和节点选择已经逐步收敛到 editor API，但画布拖拽投放提示仍散落在 `apps/editor-playground/src/App.vue`：包括根据指针位置判断 before/after/inside、生成投放线 style、生成吸附线、空白区域 append 提示，以及阻止节点投放到自身或后代。该逻辑是编辑器体验的核心口径，适合以 DOM 无关的几何输入和 Page Schema 输入抽到 editor 包；Vue3 playground 继续负责 DOM 查询、Pointer/DragEvent、真实插入、真实移动和用户反馈。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增画布 drop hint 模型类型和 helper。
- helper 覆盖投放 placement 计算、投放提示 style、吸附线、append hint、target hint 和节点拖拽非法目标判断。
- Vue3 编辑器 playground 改为消费 editor drop hint API，并保持现有 UI 行为不变。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖 drop hint 模型 API。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或默认语义。
- 不改变 Material Manifest v1 字段结构或默认语义。
- 不改变 renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不把 DOM 查询、Pointer Events、DragEvent、滚动定位、真实插入节点、真实移动节点、跨父级成组拖拽算法、权限、协作锁定、审计或服务端保存放进 editor 包。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的画布投放提示几何模型、吸附线模型和非法节点目标判断。
- `apps/editor-playground` 负责 Vue 展示、DOM 元素查找、坐标采集、DragEvent/Pointer Events、实际节点插入/移动和用户反馈。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并用自己的组件库和权限系统渲染投放提示。
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

1. 梳理 Vue3 编辑器当前画布 drop hint 几何逻辑和非法节点目标判断。
2. 在 editor 包新增 drop hint 模型类型和 helper。
3. 将 Vue3 playground 改为消费 editor API，并保持现有交互行为不变。
4. 更新 editor 单测和 README。
5. 更新 editor interaction model 契约。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出画布 drop hint 模型类型和 helper。
- [x] helper 可根据目标节点矩形、指针 Y 坐标和容器组件名判断 before/after/inside。
- [x] helper 可基于 frame metrics 和目标节点矩形生成投放提示 style。
- [x] helper 可生成 before/after/inside 三类吸附线模型。
- [x] helper 可生成 append hint 和 target hint。
- [x] helper 可判断节点拖拽是否投放到自身或后代。
- [x] Vue3 编辑器 playground 画布投放提示复用 editor API。
- [x] 不修改 Page Schema、Material Manifest、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖 drop hint 模型 API。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器画布投放提示、物料添加、节点移动和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 当前 drop hint API 只抽象几何提示和非法目标判断，不负责 DOM 事件、真实插入、真实移动、权限、审计、协作锁定或服务端保存。
- 后续若需要跨父级成组拖拽或更复杂容器投放规则，应单独设计节点移动算法和权限口径。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，包含 `creates reusable canvas drop hint models` 单测和架构边界检查。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，Vue3 编辑器、内置 H5 runtime 和 React H5 runtime 关键路径正常。
- `pnpm pack:dry-run` 通过，8 个可发布包均通过 npm pack dry-run。

## 剩余风险

- 当前 canvas drop hint API 只派生投放提示模型和非法节点目标判断，不执行 DOM 事件、真实插入、真实移动、权限、协作锁定、审计或服务端保存。
- 跨父级成组拖拽和复杂容器投放规则仍需后续单独设计节点移动算法、权限口径和回滚策略。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包画布 drop hint 模型 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | in_progress | 开始实现 editor 包 drop hint 公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 完成实现、文档、契约、事实源同步和全量验收命令。 |
