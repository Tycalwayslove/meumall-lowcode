# TASK-2026-0801-178 编辑器实操清单模型

## 状态

verified

## 目标

新增 `@meumall/lowcode-editor` 框架无关的编辑器实操清单模型，并让 Vue3 editor playground 的状态面板展示当前页面从“有内容、基础物料、校验、H5 预览、保存/发布、React H5 渲染”到可验收的状态，帮助后续多人协作按固定路径验证可实操编辑器和 H5 runtime。

## 背景

当前仓库已具备 Vue3 编辑器、React H5 runtime playground、H5 预览入口、发布检查、交付清单、审计日志和基础物料库，但缺少一个面向“实际操作路径”的稳定展示模型。若只在 playground 页面写提示文案，后续迁入 Java 管理台、拆包或替换 UI shell 时容易重复实现判断口径。因此需要先把实操清单沉淀到 editor 包，再由 Vue3 playground 消费。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- `@meumall/lowcode-editor` 新增实操清单展示模型、状态枚举、创建函数和摘要函数。
- Vue3 editor playground 根据当前 schema、校验、预览入口、发布记录和保存状态生成实操清单。
- `EditorStatusPanel` 展示实操清单，不自行派生业务判断。
- browser smoke 覆盖实操清单 DOM 和关键文案。
- 更新 editor README、Vue3 shell 组件边界、AI 状态、测试报告和任务记录。

不包含：

- 不改变 Page Schema v1、Material Manifest v1 或 renderer 协议。
- 不实现真实 Java 配置平台、真实审批、真实审计持久化或真实 H5 业务路由。
- 不改变发布检查、交付清单、预览入口和审计 API 的既有语义。
- 不执行真实 npm 发布或 GitHub release。

## 责任边界

当前仓库：

- editor 包负责提供可复用的清单状态模型。
- Vue3 editor playground 负责根据自身 shell 状态传入参数并渲染清单。
- browser smoke 负责验证默认演示路径可见。

外部系统：

- Java 配置平台后续负责真实草稿、预览、发布、审批、审计和权限状态。
- `hybird-meumall` 后续负责真实 H5 路由和 npm 包接入验证。

## 契约影响

- 是否影响跨包或跨系统契约：影响 `@meumall/lowcode-editor` 公开 API。
- 契约文档路径：`packages/editor/README.md`、本任务文件。
- 是否向后兼容：是，新增可选 API，不破坏已有调用。
- 是否需要迁移：不需要。
- 是否需要灰度或双版本兼容：不需要。

## 对接说明

- 后续 Java 管理台可复用 `createLowcodeEditorDemoChecklist`，用真实服务端保存、预览和发布状态替换 playground 的本地状态。
- 该 API 只描述演示验收状态，不作为生产发布门禁；生产发布仍以 publish checks、审批和服务端校验为准。

## 验收标准

- [x] editor 包提供实操清单创建函数和摘要函数。
- [x] 清单状态覆盖页面内容、基础物料、schema 校验、H5 预览、保存/发布和 React H5 runtime。
- [x] Vue3 状态面板展示实操清单，并由 App shell 传入展示模型。
- [x] browser smoke 覆盖实操清单可见和关键路径文案。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
```

## 验证结果

- 2026-08-01：`pnpm typecheck` 通过。
- 2026-08-01：`pnpm test` 通过，构建、架构边界检查和 121 个 Node test 均通过。
- 2026-08-01：`pnpm smoke:browser` 通过，覆盖 Vue3 编辑器实操清单、默认编辑器路径、基础物料、发布/预览、HTTP config、内置 runtime 和 React H5 runtime。

## 发布影响

- 是否需要发布：本任务不执行真实 npm 发布。
- 发布对象：后续发布时涉及 `@meumall/lowcode-editor` minor。
- 是否影响 schema 兼容性：否。
- 是否影响 H5 接入：否，默认演示路径更清晰，真实 H5 接入仍是后续任务。
- 是否影响 Java 配置平台：不要求立即改造，但未来管理台可复用该展示模型。
- 是否需要 GitHub tag/release：本任务不需要。
- 回滚目标：回滚本任务提交即可移除实操清单模型和展示。
- smoke check：`pnpm smoke:browser`。

## 风险和阻塞

- 如果把实操清单当成发布门禁，会与发布检查、审批和服务端校验职责重叠；本任务明确只做演示验收状态。
- playground 的本地保存/发布状态不等同于真实 Java 配置平台状态；后续接入时需要由宿主传入真实状态。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 实操清单模型和 Vue3 playground 展示。 |
| 2026-08-01 | verified | 新增 editor demo checklist API、Vue3 状态面板展示、changeset、README、组件文档和 browser smoke 断言；`pnpm typecheck`、`pnpm test`、`pnpm smoke:browser` 均通过。 |
