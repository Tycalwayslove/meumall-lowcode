# TASK-2026-0801-181 编辑器发布风险摘要

## 状态

verified

## 目标

在现有发布检查列表之上新增框架无关的发布风险摘要模型，并接入 Vue3 编辑器发布面板，让运营在生成预览或发布前能优先看到阻塞项、提醒项和建议处理顺序。

## 背景

当前 `createLowcodePublishChecks` 已能输出完整检查列表，Vue3 发布面板也会展示每一条检查。但运营在实操时更需要先知道“能不能继续”“先处理哪几项”“哪些只是提醒”。为了提高编辑器可实操性，同时避免把判断逻辑散写在 Vue 组件中，需要在 `@meumall/lowcode-editor` 中沉淀发布风险摘要 API。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai/`

## 范围

包含：

- 新增 `createLowcodePublishRiskSummary` 及相关类型。
- 从现有 `LowcodeEditorPublishCheck[]` 派生风险等级、标题、描述、优先处理项和状态文案。
- Vue3 编辑器发布面板展示风险摘要和优先处理项。
- 补充 editor 单元测试、任务记录、项目状态和测试报告。

不包含：

- 不改变 Page Schema v1、Material Manifest v1、renderer、materials 或 adapters 协议。
- 不新增发布检查项规则。
- 不接入真实 Java 服务端发布校验。
- 不执行真实 npm 发布或 GitHub release。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责从发布检查列表派生框架无关风险摘要。
- Vue3 editor playground 负责展示摘要和定位入口。

外部系统：

- Java 配置平台后续仍负责真实服务端发布校验、审批、审计和错误码。
- `hybird-meumall` H5 runtime 不消费该编辑器摘要模型。

## 契约影响

- 是否影响跨包或跨系统契约：影响 `@meumall/lowcode-editor` 公开 API，向后兼容新增。
- 是否向后兼容：是，新增导出类型和函数，不改变已有函数语义。
- 是否需要迁移：不需要。
- 是否需要灰度或双版本兼容：不需要。

## 对接说明

- 后续管理台迁移时可直接复用 `createLowcodePublishRiskSummary`，不要在 Vue 组件或 Java 管理台页面中重复实现阻塞/提醒摘要口径。
- 真实服务端发布校验接入后，可以继续把服务端校验结果映射为 `LowcodeEditorPublishCheck[]`，再复用同一摘要 API。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出发布风险摘要类型和 `createLowcodePublishRiskSummary`。
- [x] 风险摘要能区分 blocked、warning、ready 三种状态。
- [x] 风险摘要能按 error 优先、warning 次之的顺序输出优先处理项。
- [x] Vue3 发布面板展示风险摘要和优先处理项，并保留单条检查定位能力。
- [x] 不改变 schema、renderer、materials 或 adapters 协议。
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

- 2026-08-01：`pnpm typecheck` 通过，TypeScript project references、Vue3 editor playground 和 React H5 runtime playground 类型检查均通过。
- 2026-08-01：`pnpm test` 通过，构建、架构边界检查和 122 个 Node test 均通过。
- 2026-08-01：`pnpm smoke:browser` 通过，覆盖 Vue3 发布面板发布风险摘要存在、添加秒杀商品组后的提醒摘要和优先处理项可见，以及原有发布检查定位。

## 发布影响

- 是否需要发布：本任务不执行真实 npm 发布。
- 发布对象：后续发布时涉及 `@meumall/lowcode-editor` minor。
- 是否影响 schema 兼容性：否。
- 是否影响 H5 接入：否。
- 是否影响 Java 配置平台：否，后续可把服务端发布检查结果映射到同一摘要模型。
- 是否需要 GitHub tag/release：不需要。
- 回滚目标：回滚本任务提交即可移除风险摘要 API 和 Vue3 展示。
- smoke check：本任务以 `pnpm test` 覆盖 API，后续完整浏览器交互仍由 `pnpm smoke:browser` 覆盖。

## 风险和阻塞

- 当前摘要只基于前端本地发布检查，不能替代真实 Java 服务端发布校验。
- 摘要最多展示优先处理项，不改变发布检查列表的完整性。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 发布风险摘要 API 和 Vue3 发布面板展示。 |
| 2026-08-01 | verified | 新增 `createLowcodePublishRiskSummary`、Vue3 发布面板风险摘要展示、changeset、README 和 smoke 覆盖；`pnpm typecheck`、`pnpm test`、`pnpm smoke:browser` 均通过。 |
