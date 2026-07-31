# TASK-2026-0801-104-editor-page-settings-api

## 标题

沉淀编辑器页面设置模型 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 中 Page Schema 页面基础配置、布局配置和发布配置的展示选项、最大宽度输入约束和状态写回口径沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台或独立编辑器 shell 可以复用同一套页面设置模型。

## 背景

当前数据源、动作和事件相关配置已经逐步进入 editor 包，但页面设置面板仍在 `apps/editor-playground/src/App.vue` 中维护标题、描述、页面类型、状态、发布环境、背景色、安全区和 H5 最大宽度的写回逻辑。页面设置是运营搭建 H5 页面时必经入口，应继续向无框架 editor API 收敛；playground 只负责 Vue 表单、色板按钮和用户交互。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增页面类型、页面状态、发布环境和背景色板默认选项。
- 在 `@meumall/lowcode-editor` 新增 page settings form model helper。
- 在 `@meumall/lowcode-editor` 新增 H5 最大宽度 normalize helper。
- 在 `@meumall/lowcode-editor` 新增标题、描述、状态、类型、发布环境、背景色、安全区和最大宽度的状态 helper。
- Vue3 编辑器 playground 改为消费 editor 包的页面设置模型和状态 helper。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖页面设置模型、选项、最大宽度约束和状态写回。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或默认语义。
- 不新增页面设置 UI 组件库，不改变页面设置面板 DOM 或样式。
- 不处理服务端发布校验、审批、权限、协作锁定、审计或 Java API。
- 不改变 renderer、materials、runtime loader、adapters 或发布协议。
- 不在 editor 包中引入 Vue、React、DOM、localStorage、HTTP 或管理台组件库。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的页面设置展示模型、输入约束和 Page Schema 写回 helper。
- `apps/editor-playground` 负责渲染页面设置表单、色板、用户输入和反馈。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并用自己的 Vue 组件库渲染页面设置表单。
- 权限、审批、协作锁定、服务端发布校验和审计仍由宿主业务系统负责。

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

1. 梳理 Vue3 编辑器当前页面设置选项、写回和最大宽度约束逻辑。
2. 在 editor 包新增页面设置模型、选项、normalize 和状态 helper。
3. 将 Vue3 playground 改为消费 editor API，并保持现有 UI 行为不变。
4. 更新 editor 单测和 README。
5. 更新 editor interaction model 契约。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出页面类型、状态、环境和背景色板默认选项。
- [x] helper 可从 Page Schema 派生页面设置表单模型。
- [x] helper 可约束 H5 最大宽度，非法输入不写回。
- [x] `@meumall/lowcode-editor` 导出标题、描述、状态、类型、发布环境、背景色、安全区和最大宽度写回 helper。
- [x] Vue3 编辑器 playground 页面设置面板复用 editor API。
- [x] 不修改 Page Schema、Material Manifest、renderer、materials、runtime loader、adapters 或发布协议。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖页面设置模型 API。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器页面设置、发布检查和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 当前 API 只抽象页面设置表单模型和 Page Schema 写回，不负责服务端权限、协作锁定、审批、审计或 Java 保存。
- 后续若 Java 管理台需要页面设置字段权限、审批态或动态枚举，应在现有 helper 上做向后兼容扩展。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，64 个测试全部通过，包含 editor page settings API 单测。
- `pnpm check:architecture`：通过，包结构、依赖方向、物料 manifest 对齐和 primitives 边界未破坏。
- `pnpm smoke:browser`：通过，Vue3 编辑器页面设置、发布检查和 H5 runtime 关键路径仍可用。
- `pnpm pack:dry-run`：通过，8 个可发布包 dry-run 全部通过，包含 `@meumall/lowcode-editor`。

## 剩余风险

- 当前 page settings API 只抽象页面设置表单模型和 Page Schema 写回，不负责权限、协作锁定、审批、审计、服务端校验或服务端保存。
- 本任务新增 `@meumall/lowcode-editor` 公开 API，但未执行真实 npm 发布；真实发布仍需 registry、access、token 和 changeset 版本确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包页面设置模型 API、Page Schema 写回 helper 和 Vue3 playground 复用。 |
| 2026-08-01 | in_progress | 开始实现 editor 包页面设置公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包页面设置模型 API、Vue3 playground 复用、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
