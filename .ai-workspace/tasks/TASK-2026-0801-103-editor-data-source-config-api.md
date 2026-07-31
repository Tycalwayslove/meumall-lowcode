# TASK-2026-0801-103-editor-data-source-config-api

## 标题

沉淀编辑器数据源配置模型 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 中 `schema.dataSources` 的新增、更新、参数 JSON 展示、解析状态展示、upsert 和删除口径沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台或独立编辑器 shell 可以复用同一套数据源配置模型。

## 背景

当前动作配置和事件绑定已经进入 editor 包，但数据源面板仍在 `apps/editor-playground/src/App.vue` 中维护默认数据源、参数格式化、状态文案、upsert 和状态写回逻辑。数据源配置是运营页面连接商品、门店、达人、活动和自定义接口的关键入口，应继续向无框架 editor API 收敛；playground 只负责 Vue 表单、JSON 错误提示和触发预览解析。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增 data source type option、data source form item 和 helper。
- 在 `@meumall/lowcode-editor` 新增默认 data source config、参数 JSON 格式化、解析状态文案 helper。
- 在 `@meumall/lowcode-editor` 新增 add/update/remove data source 状态 helper。
- 在 `@meumall/lowcode-editor` 新增 data source config upsert helper。
- Vue3 编辑器 playground 改为消费 editor 包的数据源配置模型和状态 helper。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖数据源配置模型、默认参数、参数展示、解析状态展示、新增、更新、upsert 和删除。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或 DataSource 语义。
- 不新增真实 HTTP resolver，不接鉴权、缓存、Java 代理、服务端预览、权限或审计。
- 不改变数据源面板 DOM、样式、发布协议、renderer、materials 或 adapters。
- 不在 editor 包中引入 Vue、React、DOM、localStorage、HTTP 或管理台组件库。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的数据源配置展示模型和 Page Schema dataSources 变更 helper。
- `apps/editor-playground` 负责渲染数据源表单、展示 JSON 错误、触发预览解析和展示用户交互反馈。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并用自己的 Vue 组件库渲染数据源配置表单。
- 真实数据源查询、鉴权、缓存、服务端预览、权限、风控、审计和服务端保存仍由宿主业务系统负责。

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

1. 梳理 Vue3 编辑器当前数据源配置、状态文案和 upsert 逻辑。
2. 在 editor 包新增数据源配置模型和状态 helper。
3. 将 Vue3 playground 改为消费 editor API，并保持现有 UI 行为不变。
4. 更新 editor 单测和 README。
5. 更新 editor interaction model 契约。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出数据源类型选项和数据源表单模型 helper。
- [x] helper 可生成默认数据源配置和参数 JSON。
- [x] helper 可从解析记录派生数据源状态文案和描述。
- [x] `@meumall/lowcode-editor` 导出新增、更新和删除 data source 的状态 helper。
- [x] `@meumall/lowcode-editor` 导出 data source config upsert helper。
- [x] Vue3 编辑器 playground 数据源面板复用 editor API。
- [x] 不修改 Page Schema、Material Manifest、renderer、materials、runtime loader、adapters 或发布协议。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖数据源配置模型 API。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器数据源面板、预览解析、发布检查和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 当前 API 只抽象数据源配置模型和 Page Schema dataSources 变更，不负责真实数据源请求、鉴权、缓存、权限、风控、审计或服务端保存。
- 后续若 Java 管理台需要更复杂的数据源参数 schema、联动表单或权限态，应在现有 helper 上做向后兼容扩展。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，63 个测试全部通过，包含 editor data source config API 单测。
- `pnpm check:architecture`：通过，包结构、依赖方向、物料 manifest 对齐和 primitives 边界未破坏。
- `pnpm smoke:browser`：通过，Vue3 编辑器数据源面板、发布检查和 H5 runtime 关键路径仍可用。
- `pnpm pack:dry-run`：通过，8 个可发布包 dry-run 全部通过，包含 `@meumall/lowcode-editor`。

## 剩余风险

- 当前 data source config API 只抽象数据源配置表单模型、预览解析状态展示和 Page Schema dataSources 变更，不负责真实 HTTP 请求、鉴权、缓存、权限、风控、审计、服务端校验或服务端保存。
- 本任务新增 `@meumall/lowcode-editor` 公开 API，但未执行真实 npm 发布；真实发布仍需 registry、access、token 和 changeset 版本确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包数据源配置模型 API、Page Schema dataSources helper 和 Vue3 playground 复用。 |
| 2026-08-01 | in_progress | 开始实现 editor 包数据源配置公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包数据源配置模型 API、Vue3 playground 复用、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
