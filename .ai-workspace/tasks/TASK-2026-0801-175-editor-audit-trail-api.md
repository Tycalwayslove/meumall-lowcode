# TASK-2026-0801-175-editor-audit-trail-api

## 状态

verified

## 目标

沉淀编辑器操作审计事件模型，让 Vue3 编辑器 playground 能展示最近操作，并为后续 Java 管理台接入真实审计日志、协作排查和服务端上报保留稳定边界。

## 背景

当前 Vue3 编辑器 playground 已具备节点操作、物料插入、保存草稿、生成预览、发布、审批、模板应用和资源写回等可实操能力，但“审计日志”入口仍只是本地提示文案，没有可复用的事件模型。后续多人协作和 Java 管理台接入需要知道谁在什么时间做了什么、目标是什么、结果如何。本任务先抽出框架无关的 editor audit trail API，并在 playground 中展示最近操作，避免把审计口径散写在 UI 文案中。

## 涉及包或系统

- `@meumall/lowcode-editor`
- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- AI 工作区状态文档

## 范围

包含：

- 在 `@meumall/lowcode-editor` 中新增审计事件类型、事件创建、事件追加限长和展示项派生 API。
- 给审计事件 API 增加单元测试和 README 说明。
- Vue3 编辑器 playground 记录关键本地操作：节点操作、物料插入、模板应用、保存草稿、生成预览、发布、审批状态变化、资源写回和 schema 导入导出。
- Vue3 编辑器右侧状态面板展示最近操作，供本地实操时快速回看。
- browser smoke 覆盖最近操作区域可见并记录至少一次物料添加。
- 同步 `.ai` 状态、TODO、测试报告和任务记录。

不包含：

- 不改变 Page Schema v1 或 Material Manifest v1。
- 不新增 Java 审计日志接口，不请求真实外部审计系统。
- 不改变现有 config platform client API。
- 不实现审计日志持久化、分页、筛选、导出或权限策略。
- 不改变 H5 runtime 渲染协议。

## 责任边界

当前仓库：

- 提供框架无关的编辑器审计事件模型。
- 在 Vue3 playground 中验证本地操作记录和展示。
- 保持 editor API 不依赖 renderer、materials、Java 或业务项目。

外部系统：

- Java 管理台后续负责真实审计存储、查询、权限、审计上报和合规策略。

## 契约影响

- 是否影响跨包或跨系统契约：影响 `@meumall/lowcode-editor` 公开 API；不影响 Page Schema v1、Material Manifest v1、Java 配置平台 API 或 H5 runtime 集成协议。
- 契约文档路径：`packages/editor/README.md`、本任务文件。
- 是否向后兼容：是，新增 API 和 UI 展示，不破坏旧 API。
- 是否需要迁移：不需要。
- 是否需要灰度或双版本兼容：不需要。

## 对接说明

- 是否需要对接说明：需要，记录在 `packages/editor/README.md`。
- 需要确认的角色：未来管理台前端和 Java 审计/配置平台负责人。
- 当前确认状态：本地 playground 先验证。

## 验收标准

- [x] `@meumall/lowcode-editor` 暴露可复用 audit trail API。
- [x] 审计事件能表达类型、标题、描述、时间、操作者、目标、结果和附加元数据。
- [x] 审计 trail 支持追加、限长和展示项派生。
- [x] Vue3 编辑器 playground 右侧状态面板展示最近操作。
- [x] 物料添加、节点操作、保存/预览/发布和审批操作至少有本地审计记录。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 覆盖最近操作展示。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
```

## 发布影响

- 是否需要发布：本任务不执行真实 npm 发布。
- 发布对象：后续发布时涉及 `@meumall/lowcode-editor` patch/minor，具体版本由 Changesets 发布流程统一决定。
- 是否影响 schema 兼容性：否。
- 是否影响 H5 接入：否。
- 是否影响 Java 配置平台：否。
- 是否需要 GitHub tag/release：本任务不需要。
- 回滚目标：回滚本任务提交后，最近操作展示和 audit trail API 消失，原编辑器功能不受影响。
- smoke check：`pnpm smoke:browser`。

## 风险和阻塞

- 如果审计事件模型过度绑定 playground 文案，会降低管理台复用价值；实现时必须保持纯数据模型。
- 真实审计持久化涉及权限、合规和服务端接口，本任务只做本地模型和展示。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor audit trail API 和 Vue3 playground 最近操作展示。 |
| 2026-08-01 | verified | 新增 editor audit trail API，Vue3 playground 最近操作面板已记录物料、节点、模板、资源、schema、发布和审批操作；`pnpm typecheck`、`pnpm test`、`pnpm smoke:browser` 均通过。 |
