# TASK-2026-0801-101-editor-event-binding-api

## 标题

沉淀编辑器事件绑定模型 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 中物料事件与 Page Schema actions 的绑定展示、当前绑定读取、节点事件写回、action id 改名引用同步和 action 删除引用清理口径沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台或独立编辑器 shell 可以复用同一套事件绑定模型。

## 背景

当前 Vue3 编辑器已经支持在属性面板里把物料事件绑定到 `schema.actions`，并在动作改名或删除时同步节点事件引用。但事件下拉展示、当前绑定读取、写回节点 `events`、删除 action 引用和重命名 action 引用仍写在 `apps/editor-playground/src/App.vue`。事件绑定是编辑器把运营配置转成运行时安全 action 的关键闭环，应抽入 editor 包；playground 只负责 select 控件、动作表单和用户反馈。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增 action option、event binding item 类型和 helper。
- 在 `@meumall/lowcode-editor` 新增节点事件绑定、action 引用重命名和 action 引用移除 helper。
- Vue3 编辑器 playground 改为消费 editor 包的事件绑定模型和 action ref helper。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖事件绑定展示、缺失 action、未绑定事件、事件写回、解除绑定、action id 改名和 action 删除清理。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或 Material Manifest v1 语义。
- 不新增 action 类型、不改 action 执行器、不接真实跳转桥、领券接口、埋点平台、权限或风控。
- 不改变属性面板 DOM、样式、动作表单布局或发布检查规则。
- 不在 editor 包中引入 Vue、React、DOM、localStorage、HTTP 或管理台组件库。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的事件绑定展示模型和节点 action ref 变更 helper。
- `apps/editor-playground` 负责渲染 select 控件、动作表单、资源反馈和用户交互。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并用自己的 Vue 组件库渲染事件绑定控件。
- 真实 action handler、权限、风控和审计仍由宿主业务系统负责。

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

1. 梳理 Vue3 编辑器当前事件绑定、action 改名和 action 删除清理逻辑。
2. 在 editor 包新增事件绑定模型和 action ref helper。
3. 将 Vue3 playground 改为消费 editor API，并保持现有 UI 行为不变。
4. 更新 editor 单测和 README。
5. 更新 editor interaction model 契约。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出事件绑定模型 helper。
- [x] helper 可从物料事件、schema actions 和节点 events 派生事件绑定项。
- [x] helper 可表达未绑定、已绑定和绑定到缺失 action 的状态。
- [x] `@meumall/lowcode-editor` 导出节点事件绑定 helper。
- [x] `@meumall/lowcode-editor` 导出 action id 改名引用同步和 action 删除引用清理 helper。
- [x] Vue3 编辑器 playground 事件面板、action 改名和 action 删除复用 editor API。
- [x] 不修改 Page Schema、Material Manifest、renderer、materials、runtime loader 或发布协议。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖事件绑定模型 API。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器动作表单、事件绑定、发布检查和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 当前 API 只抽象事件绑定模型和 Page Schema action ref 变更，不负责真实 action 执行、权限、风控、审计或服务端保存。
- 后续若 Java 管理台需要更复杂的 action 模板、分组或权限态，应在现有 helper 上做向后兼容扩展。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，61 个测试全部通过，包含 editor event binding API 单测。
- `pnpm check:architecture`：通过，包结构、依赖方向、物料 manifest 对齐和 primitives 边界未破坏。
- `pnpm smoke:browser`：通过，Vue3 编辑器动作表单、事件绑定相关关键路径、发布检查和 H5 runtime 关键路径仍可用。
- `pnpm pack:dry-run`：通过，8 个可发布包 dry-run 全部通过，包含 `@meumall/lowcode-editor`。

## 剩余风险

- 当前 event binding API 只抽象事件绑定展示模型和 Page Schema action ref 变更，不负责真实 action 执行、权限、风控、审计、服务端校验或服务端保存。
- 本任务新增 `@meumall/lowcode-editor` 公开 API，但未执行真实 npm 发布；真实发布仍需 registry、access、token 和 changeset 版本确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包事件绑定模型 API、节点 action ref helper 和 Vue3 playground 复用。 |
| 2026-08-01 | in_progress | 开始实现 editor 包事件绑定公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包事件绑定模型 API、Vue3 playground 复用、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
