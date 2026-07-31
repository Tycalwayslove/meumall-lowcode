# TASK-2026-0801-102-editor-action-config-api

## 标题

沉淀编辑器动作配置模型 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 中 `schema.actions` 的新增、类型切换、参数默认值、参数 JSON 展示、action id 改名引用同步和 action 删除引用清理口径沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台或独立编辑器 shell 可以复用同一套动作配置模型。

## 背景

当前事件绑定模型已经进入 editor 包，但动作本身的配置表单仍在 `apps/editor-playground/src/App.vue` 中维护默认参数、动作创建和状态写回逻辑。动作配置是运营把点击、领券、埋点等行为写入 Page Schema 的入口，应继续向无框架 editor API 收敛；playground 只负责 Vue 表单、错误提示和用户交互。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增 action type option、action form item 和 helper。
- 在 `@meumall/lowcode-editor` 新增默认 action params、action config 创建、参数 JSON 格式化 helper。
- 在 `@meumall/lowcode-editor` 新增 add/update/rename/type-change/remove action 状态 helper。
- Vue3 编辑器 playground 改为消费 editor 包的动作配置模型和状态 helper。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖动作配置模型、默认参数、参数展示、action 新增、改名、类型切换和删除清理。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或 Material Manifest v1 语义。
- 不新增真实 action handler，不接跳转桥、领券接口、埋点平台、权限、风控或审计。
- 不改变动作表单 DOM、样式、发布协议、renderer 或 materials。
- 不在 editor 包中引入 Vue、React、DOM、localStorage、HTTP 或管理台组件库。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的动作配置展示模型和 Page Schema action 变更 helper。
- `apps/editor-playground` 负责渲染动作表单、展示 JSON 错误和触发用户交互。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并用自己的 Vue 组件库渲染动作配置表单。
- 真实 action handler、权限、风控、审计和服务端保存仍由宿主业务系统负责。

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

1. 梳理 Vue3 编辑器当前动作配置、默认参数和引用清理逻辑。
2. 在 editor 包新增动作配置模型和状态 helper。
3. 将 Vue3 playground 改为消费 editor API，并保持现有 UI 行为不变。
4. 更新 editor 单测和 README。
5. 更新 editor interaction model 契约。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出动作类型选项和动作表单模型 helper。
- [x] helper 可生成默认动作参数和新 action config。
- [x] helper 可格式化动作参数 JSON。
- [x] `@meumall/lowcode-editor` 导出新增、更新、改名、类型切换和删除 action 的状态 helper。
- [x] action id 改名时同步节点事件引用。
- [x] action 删除时清理节点事件引用。
- [x] Vue3 编辑器 playground 动作面板复用 editor API。
- [x] 不修改 Page Schema、Material Manifest、renderer、materials、runtime loader 或发布协议。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖动作配置模型 API。
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

- 当前 API 只抽象动作配置模型和 Page Schema action 变更，不负责真实 action 执行、权限、风控、审计或服务端保存。
- 后续若 Java 管理台需要更复杂的 action 模板、分组、权限态或动态参数 schema，应在现有 helper 上做向后兼容扩展。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，62 个测试全部通过，包含 editor action config API 单测。
- `pnpm check:architecture`：通过，包结构、依赖方向、物料 manifest 对齐和 primitives 边界未破坏。
- `pnpm smoke:browser`：通过，Vue3 编辑器动作表单、事件绑定、发布检查和 H5 runtime 关键路径仍可用。
- `pnpm pack:dry-run`：通过，8 个可发布包 dry-run 全部通过，包含 `@meumall/lowcode-editor`。

## 剩余风险

- 当前 action config API 只抽象动作配置表单模型和 Page Schema action 变更，不负责真实 action 执行、权限、风控、审计、服务端校验或服务端保存。
- 本任务新增 `@meumall/lowcode-editor` 公开 API，但未执行真实 npm 发布；真实发布仍需 registry、access、token 和 changeset 版本确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包动作配置模型 API、Page Schema action helper 和 Vue3 playground 复用。 |
| 2026-08-01 | in_progress | 开始实现 editor 包动作配置公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包动作配置模型 API、Vue3 playground 复用、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
