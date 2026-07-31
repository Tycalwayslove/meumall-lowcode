# TASK-2026-0801-107-editor-material-preference-api

## 标题

沉淀编辑器物料偏好模型 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 中物料收藏、最近使用、组件名解析、去重、截断和提示文案沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台或独立编辑器 shell 可以复用同一套物料偏好模型。

## 背景

当前物料目录、物料详情和默认预览 schema 已经复用 editor API，但物料收藏和最近使用仍在 `apps/editor-playground/src/App.vue` 中维护数组解析、去重、已知物料过滤、最近使用数量限制和操作提示文案。物料偏好会直接影响运营搭建效率，应继续向无框架 editor API 收敛；playground 只负责 localStorage 读写、Vue 展示和用户交互。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增物料偏好默认最近使用数量。
- 在 `@meumall/lowcode-editor` 新增物料组件名列表解析、标准化、去重和已知物料过滤 helper。
- 在 `@meumall/lowcode-editor` 新增收藏判断、收藏切换、最近使用记录和收藏提示文案 helper。
- Vue3 编辑器 playground 改为消费 editor material preference API，并保持现有 UI 行为不变。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖物料偏好模型 API。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或默认语义。
- 不改变 Material Manifest v1 字段结构或默认语义。
- 不改变 renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不实现真实用户偏好接口、权限、审计或多端同步。
- 不改变物料区 DOM 或样式。
- 不在 editor 包中引入 Vue、React、DOM、localStorage、HTTP 或管理台组件库。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的物料偏好列表模型、收藏/最近使用 helper 和提示文案。
- `apps/editor-playground` 负责 localStorage 读写、Vue 展示、点击交互和用户反馈。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并用自己的用户偏好接口持久化收藏和最近使用。
- 用户体系、权限、审计、多端同步和偏好迁移仍由宿主业务系统负责。

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

1. 梳理 Vue3 编辑器当前物料收藏和最近使用逻辑。
2. 在 editor 包新增物料偏好模型、解析、标准化、收藏切换、最近使用和提示文案 helper。
3. 将 Vue3 playground 改为消费 editor API，并保持现有交互行为不变。
4. 更新 editor 单测和 README。
5. 更新 editor interaction model 契约。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [ ] `@meumall/lowcode-editor` 导出物料偏好默认最近使用数量。
- [ ] helper 可解析存储内容并返回合法组件名列表。
- [ ] helper 可标准化组件名列表，去重、过滤未知物料并截断。
- [ ] helper 可判断收藏、切换收藏、记录最近使用并生成收藏提示文案。
- [ ] Vue3 编辑器 playground 物料收藏和最近使用复用 editor API。
- [ ] 不修改 Page Schema、Material Manifest、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- [ ] editor README 和 editor interaction model 契约说明新增 API。
- [ ] editor 单测覆盖物料偏好模型 API。
- [ ] `pnpm typecheck` 通过。
- [ ] `pnpm build` 通过。
- [ ] `pnpm test` 通过。
- [ ] `pnpm check:architecture` 通过。
- [ ] `pnpm smoke:browser` 通过。
- [ ] `pnpm pack:dry-run` 通过。

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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器物料收藏、最近使用、物料详情、物料添加和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 当前 material preference API 只抽象偏好列表模型和提示文案，不负责 localStorage、真实用户偏好接口、权限、审计、多端同步或偏好迁移。
- 后续若 Java 管理台提供服务端偏好结构，应在现有 helper 上做向后兼容扩展。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，67 个测试全部通过。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，覆盖 Vue3 编辑器物料收藏、最近使用持久化、物料详情、物料添加和 H5 runtime 关键路径。
- `pnpm pack:dry-run` 通过，8 个可发布包 dry-run 均通过。

## 剩余风险

- 当前 material preference API 只抽象偏好列表模型和提示文案，不负责 localStorage、真实用户偏好接口、权限、审计、多端同步或偏好迁移。
- 后续 Java 管理台接入真实用户偏好接口时，需要在宿主 shell 中处理接口异常、权限、审计和多端同步策略。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包物料偏好模型 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | in_progress | 开始实现 editor 包物料偏好公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 完成实现、文档和事实源更新，`pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm check:architecture`、`pnpm smoke:browser` 和 `pnpm pack:dry-run` 均通过。 |
