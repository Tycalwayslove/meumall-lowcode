# TASK-2026-0801-135-editor-approval-actions-panel

## 标题

补齐 Vue3 编辑器发布面板审批操作

## 状态

verified

## 目标

在不接真实 Java 审批服务、不改变 Page Schema v1 的前提下，让 Vue3 editor playground 的发布面板可以基于现有 workflow provider 执行提交审批、撤回审批、审核通过和审核驳回，使“审批状态展示 + 权限禁用 + 本地 workflow client”形成可操作闭环。

## 背景

当前仓库已完成 editor approval state API、adapters workflow client 和 Vue3 editor playground 本地 workflow provider。编辑器顶部可以展示“无需审批 / 待提交审批 / 审批中 / 审批通过 / 审批驳回”等状态，但运营还不能在发布区域直接触发审批流转。本任务补齐发布面板中的审批操作入口，并继续复用 `approval.submit`、`approval.cancel`、`approval.review` 和 `publish.submit` 权限动作。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

包含：

- 扩展 `EditorPublishPanel.vue`，新增发布审批区域，展示审批状态、说明和操作按钮。
- `EditorPublishPanel.vue` 通过 emits 抛出提交审批、撤回审批、审核通过和审核驳回事件。
- `App.vue` 调用 `localConfigPlatformClient` 的 workflow 方法，更新 `editorWorkflowState` 和操作反馈。
- 审批操作按钮使用 editor permission/capability API 派生的禁用原因。
- 发布按钮继续受 `publish.submit` 和发布检查共同约束。
- browser smoke 覆盖待提交审批、提交后审批中、撤回、审核通过和发布入口恢复。
- 更新 AI 状态文档、TODO 和项目事实源。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不实现真实 Java 审批服务、审批历史、通知或审计。
- 不改变 `@meumall/lowcode-editor`、`@meumall/lowcode-adapters` 公开 API。
- 不改变 Page Schema v1、Material Manifest v1、renderer 或 H5 runtime。
- 不新增 npm 包、不新增 npm 依赖。
- 不执行真实 npm 发布。

## 责任边界

当前仓库：

- `EditorPublishPanel.vue` 负责审批状态和操作按钮展示。
- `App.vue` 负责调用 workflow provider、刷新状态、生成反馈文案和合并权限。
- `mockPlatform.ts` 继续负责本地 workflow 状态存储和流转。

外部系统：

- Java 配置平台未来负责真实审批实例、权限、审批历史、通知和审计。
- Java 管理台未来负责替换真实 client、操作人、鉴权和异常提示。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：沿用 `.ai-workspace/contracts/java-config-platform-api-v1.md`，本任务不新增端点。
- 是否向后兼容：是，只扩展 playground UI 和本地 mock 流程。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`.ai/AI_CONTEXT.md`。
- 需要确认的角色：无，本任务只做本地可操作演示。
- 当前确认状态：无需确认。

## 实现计划

1. 扩展 `EditorPublishPanel.vue` props、emits 和发布审批 UI。
2. 在 `App.vue` 中新增审批操作可用态、禁用原因和 workflow 方法调用。
3. 让发布操作继续受审批状态和发布检查共同约束。
4. 补充 browser smoke 覆盖审批流转。
5. 更新 AI 事实源和任务状态。
6. 运行验证命令并记录结果。

## 验收标准

- [x] 发布面板展示“发布审批”区域和当前审批状态。
- [x] `?approval=draft` 页面可以点击“提交审批”并变为“审批中”。
- [x] 审批中可以点击“撤回审批”并回到可提交状态。
- [x] 审批中可以点击“审核通过”并变为“审批通过”。
- [x] 审批通过后发布入口可用，并仍受发布检查阻塞项约束。
- [x] 审核驳回后发布入口不可用，且可重新提交审批。
- [x] 操作按钮禁用态使用 editor permission/capability API 派生结果。
- [x] 不新增 npm 包、不新增依赖、不改变 Page Schema v1。
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
git diff --check
```

## 发布影响

- 是否需要发布：否，本任务只调整 playground 集成演示。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否。
- 是否影响 npm 发布：不影响公开包 API，但仍运行 `pnpm pack:dry-run`。
- 是否影响 Java 配置平台：否，沿用既有 workflow 草案接口。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证审批操作闭环和 H5 runtime 关键路径。

## 风险和阻塞

- 当前只是本地 workflow mock，不代表真实 Java 审批流已接入。
- localStorage mock 不处理审批权限、审批历史、通知、审计和多人协作冲突。
- 真实管理台接入时仍需处理审批人权限、审批记录、错误提示和服务端校验。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，75 个测试通过，并覆盖 `approval.cancel` 和 `approval.review` 权限决策。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，确认 `?collaboration=locked-me&approval=draft` 下发布审批区域存在，审批可提交、撤回、驳回、重新提交并审核通过，审批通过后发布入口恢复可用。
- `pnpm pack:dry-run` 通过，8 个可发布包均完成 npm pack dry-run。
- `git diff --check` 通过。

## 剩余风险

- 当前只是本地 workflow mock 操作闭环，不代表真实 Java 审批服务已接入。
- 审批历史、通知、审批权限、审计、服务端发布校验和真实错误提示仍需后续 Java 配置平台与管理台接入。
- `?approval=` 和 `?collaboration=` 仍是 playground 本地演示种子入口，不是生产 URL 协议。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 editor playground 发布面板审批操作闭环和验证。 |
| 2026-08-01 | in_progress | 开始扩展发布面板审批 UI、App workflow handler 和 editor approval permission 决策。 |
| 2026-08-01 | verified | 完成发布面板审批操作闭环，类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run 均通过。 |
