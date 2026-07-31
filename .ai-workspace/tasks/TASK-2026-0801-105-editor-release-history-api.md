# TASK-2026-0801-105-editor-release-history-api

## 标题

沉淀编辑器发布历史模型 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 中本地版本列表、版本关键词筛选、版本类型文案、时间展示、差异数量摘要、操作反馈和回滚备注文案沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台发布历史、版本对比和回滚确认页面可以复用同一套无框架模型。

## 背景

当前版本差异和 Schema 片段预览已经复用 editor version summary API，但版本列表筛选、类型文案、时间格式、操作反馈和回滚备注仍散落在 `apps/editor-playground/src/App.vue`。这些逻辑不依赖 Vue、DOM、localStorage 或 Java API，属于编辑器通用展示模型，应继续向 `@meumall/lowcode-editor` 收敛。保存草稿、生成预览、发布、载入、打开 runtime 和回滚发布仍由 playground 或未来管理台 shell 通过配置平台 client 负责。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增发布历史 release 类型、列表 item、筛选和摘要模型。
- 在 `@meumall/lowcode-editor` 新增 release 类型中文文案、时间格式、操作反馈、发布检查拦截文案、差异数量摘要和回滚备注文案 helper。
- Vue3 编辑器 playground 改为消费 editor release history API，并保持现有 UI 行为不变。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖发布历史模型 API。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或默认语义。
- 不改变 Java 配置平台 API、Config Platform Client、runtime loader、previewToken、releaseId 或 pageId 协议。
- 不实现真实服务端发布历史、服务端 diff、审批、审计或回滚接口。
- 不改变发布历史面板 DOM 结构或样式。
- 不在 editor 包中引入 Vue、React、DOM、localStorage、HTTP 或管理台组件库。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的版本列表展示、筛选、摘要和反馈文案模型。
- `apps/editor-playground` 负责渲染 Vue 面板、调用本地 mock config platform client、打开 runtime、执行确认弹窗和用户反馈。

外部系统：

- Java 配置平台未来负责真实版本存储、发布审批、服务端版本 diff、回滚审计、权限和服务端校验。
- Java 管理台未来可通过 npm 消费 editor 包 API，并用自己的 Vue 组件库渲染发布历史面板。

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

1. 梳理 Vue3 编辑器当前发布历史列表、筛选、反馈和回滚备注逻辑。
2. 在 editor 包新增发布历史模型、筛选、摘要和文案 helper。
3. 将 Vue3 playground 改为消费 editor API，并保持现有交互行为不变。
4. 更新 editor 单测和 README。
5. 更新 editor interaction model 契约。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出 release history 类型、列表 item、筛选和摘要 helper。
- [x] helper 可派生版本类型中文文案、格式化时间、差异数量摘要、操作反馈、发布检查拦截文案和回滚备注文案。
- [x] Vue3 编辑器 playground 本地版本列表、筛选、差异摘要、操作反馈和回滚备注复用 editor API。
- [x] 不修改 Page Schema、Material Manifest、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖发布历史模型 API。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器发布历史、发布检查和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 当前 API 只抽象发布历史展示模型和文案，不负责真实发布、预览、回滚、审批、审计、权限或服务端校验。
- 后续若 Java 配置平台提供更多 release metadata，应在现有 helper 上做向后兼容扩展。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，65 个测试全部通过，包含 editor release history API 单测。
- `pnpm check:architecture`：通过，包结构、依赖方向、物料 manifest 对齐和 primitives 边界未破坏。
- `pnpm smoke:browser`：通过，Vue3 编辑器本地版本对比、版本筛选、发布检查、页面设置、模板、Schema 导入导出和 H5 runtime 关键路径仍可用。
- `pnpm pack:dry-run`：通过，8 个可发布包 dry-run 全部通过，包含 `@meumall/lowcode-editor`。

## 剩余风险

- 当前 release history API 只抽象发布历史展示模型和文案，不负责真实发布、预览、回滚、审批、审计、权限或服务端校验。
- 本任务新增 `@meumall/lowcode-editor` 公开 API，但未执行真实 npm 发布；真实发布仍需 registry、access、token 和 changeset 版本确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包发布历史模型 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | in_progress | 开始实现 editor 包发布历史公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包发布历史模型 API、Vue3 playground 复用、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
