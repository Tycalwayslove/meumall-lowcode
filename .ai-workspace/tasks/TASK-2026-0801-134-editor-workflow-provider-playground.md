# TASK-2026-0801-134-editor-workflow-provider-playground

## 标题

接入 Vue3 编辑器工作流 provider 边界

## 状态

verified

## 目标

在不接真实 Java 后端、不改变 Page Schema v1 的前提下，让 Vue3 editor playground 的协作锁定和审批状态不再直接由 URL demo helper 派生，而是通过 `LowcodeConfigPlatformClient` 的编辑器工作流方法获取、映射和展示，为后续管理台替换真实 Java HTTP client 预留清晰 provider 边界。

## 背景

当前 `@meumall/lowcode-adapters` 已提供编辑器工作流状态 client 协议，`@meumall/lowcode-editor` 已提供 collaboration state、approval state 和 permission/capability API。但 Vue3 editor playground 仍在 `App.vue` 内直接读取 `?collaboration=` 和 `?approval=` 参数创建本地状态，真实接入时容易把 Java workflow、URL demo、权限合并逻辑散在 UI 中。本任务把本地 mock 配置平台升级为 workflow provider，并让 `App.vue` 消费统一 client 返回值。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

包含：

- 扩展 `apps/editor-playground/src/mockPlatform.ts`，实现本地 workflow 状态读取、写入、抢锁、续期、释放、提交审批、撤回审批和审核审批。
- 在 `App.vue` 中通过 `configPlatformClient.getEditorWorkflowState` 读取当前页面 workflow state，并映射为 `createLowcodeEditorCollaborationState` 和 `createLowcodeEditorApprovalState`。
- 保留 `?collaboration=` 和 `?approval=` 作为本地 demo 种子入口，但入口只负责覆盖 mock workflow state，不直接驱动 UI 状态。
- 页面 pageId 变化、载入版本、新建页面或应用模板后刷新 workflow state。
- 补充 browser smoke 对 `?collaboration=locked-other` 和 `?approval=pending` 的状态展示验证。
- 更新 AI 状态文档、TODO 和项目事实源。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不实现真实 Java 锁服务、审批实例、审批历史、通知或审计。
- 不改变 `@meumall/lowcode-adapters` 公开 API。
- 不改变 `@meumall/lowcode-editor` 公开 API。
- 不改变 Page Schema v1、Material Manifest v1、renderer 或 H5 runtime。
- 不新增 npm 包、不新增 npm 依赖。
- 不执行真实 npm 发布。

## 责任边界

当前仓库：

- `mockPlatform.ts` 负责本地 config platform client 和 workflow provider mock。
- `App.vue` 负责从 client 获取 workflow state，映射成 editor collaboration/approval state，并合并 permission/capability。
- `scripts/browser-smoke.mjs` 负责验证默认状态和 demo workflow 状态可展示。

外部系统：

- Java 配置平台未来负责真实 workflow state、锁租约、审批流转、权限校验和审计。
- Java 管理台未来负责注入真实 `LowcodeConfigPlatformClient`、当前操作人、鉴权和异常提示。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：沿用 `.ai-workspace/contracts/java-config-platform-api-v1.md`，本任务不新增端点。
- 是否向后兼容：是，只调整 playground 对既有 client 协议的消费方式。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`.ai/AI_CONTEXT.md`。
- 需要确认的角色：无，本任务只做本地 provider 边界。
- 当前确认状态：无需确认。

## 实现计划

1. 扩展本地 config platform client 的 workflow 状态存储和操作方法。
2. 在 `App.vue` 中创建 workflow state ref、demo seed、状态映射和刷新逻辑。
3. 在页面切换和发布/载入关键路径后刷新 workflow state。
4. 补充 browser smoke workflow demo 状态断言。
5. 更新 AI 事实源和任务状态。
6. 运行验证命令并记录结果。

## 验收标准

- [x] `localConfigPlatformClient` 实现 `getEditorWorkflowState`、`acquireEditorLock`、`refreshEditorLock`、`releaseEditorLock`、`submitApproval`、`cancelApproval` 和 `reviewApproval`。
- [x] Vue3 editor playground 默认仍显示“可编辑”和“无需审批”。
- [x] `?collaboration=locked-other` 能通过 workflow provider 展示“他人正在编辑”。
- [x] `?approval=pending` 能通过 workflow provider 展示“审批中”。
- [x] `App.vue` 不再直接用 URL demo helper 作为最终 UI 状态来源。
- [x] 状态映射仍复用 editor collaboration/approval state API 和 permission/capability API。
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

- 是否需要发布：否，本任务只调整 playground 集成边界和本地 mock。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否。
- 是否影响 npm 发布：不影响公开包 API，但仍运行 `pnpm pack:dry-run`。
- 是否影响 Java 配置平台：否，沿用上一任务已记录的草案接口。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证默认 editor 状态、workflow demo 状态和 H5 runtime 关键路径。

## 风险和阻塞

- 本任务只让 playground 消费 client 协议，不代表真实 Java workflow 已接入。
- localStorage mock 不处理多浏览器并发、锁租约后台续期、页面关闭释放或审批权限。
- 真实管理台接入仍需处理鉴权、当前操作人、错误提示和审计。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，75 个测试通过，并包含架构边界检查。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，确认默认编辑器状态仍显示“可编辑”和“无需审批”，且 `?collaboration=locked-other&approval=pending` 通过 workflow provider 展示“他人正在编辑”和“审批中”。
- `pnpm pack:dry-run` 通过，8 个可发布包均完成 npm pack dry-run。
- `git diff --check` 通过。

## 剩余风险

- 当前只完成 playground 本地 provider 边界；真实 Java workflow、锁租约、审批权限、审批历史、通知和审计仍未接入。
- `?collaboration=` 和 `?approval=` 仍是本地演示种子入口，不是生产 URL 协议。
- localStorage mock 不处理多浏览器并发、后台续期、页面关闭释放锁或审批权限。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 editor playground 工作流 provider 边界接入和验证。 |
| 2026-08-01 | in_progress | 开始扩展本地 config platform workflow client，并让 `App.vue` 消费 client workflow state。 |
| 2026-08-01 | verified | 完成 playground 工作流 provider 边界接入，类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run 均通过。 |
