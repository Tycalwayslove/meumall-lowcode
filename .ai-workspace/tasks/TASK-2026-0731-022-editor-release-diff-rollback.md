# TASK-2026-0731-022-editor-release-diff-rollback

## 状态

verified

## 目标

增强 Vue3 编辑器 playground 的本地版本管理能力，让运营可以选择历史版本查看与当前草稿的差异摘要，并可以将历史版本作为新的 published release 发布，从而完成本地 mock 回滚闭环。

## 背景

当前编辑器已有本地版本列表，支持载入版本和打开 runtime。但运营在回滚前无法快速判断历史版本与当前草稿差异，也没有明确“回滚发布”的动作。为了让编辑器更接近生产发布工具，需要补充版本对比和回滚入口。

## 涉及包或系统

- `apps/editor-playground`
- `.ai-workspace/tasks`
- `.ai/test-reports`
- `.ai/PROJECT_STATE.md`
- `.ai/AI_CONTEXT.md`
- `.ai/TODO.md`

## 范围

包含：

- 本地版本列表支持选择一个版本作为对比对象。
- 展示选中版本与当前草稿的差异摘要：标题、状态、环境、节点数、数据源数、动作数、页面版本。
- 支持载入选中版本继续编辑。
- 支持将选中版本作为新的 published release 发布，模拟回滚。
- 回滚发布后刷新版本列表、更新本地 active published release，并记录提示。
- 更新项目状态、TODO 和验证报告。

不包含：

- 真实 Java 配置平台回滚接口。
- JSON 级逐字段 diff 视图。
- 审批、权限、发布审计和线上缓存刷新。
- 新增 npm 发布或 changeset。

## 责任边界

当前仓库：

- 提供本地 mock 版本对比和回滚发布交互。

外部系统：

- Java 配置平台后续负责真实 release diff、审批、回滚发布、active 切换、缓存失效和审计。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无。
- 是否向后兼容：是，仅增强 playground UI。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：暂用 mock。

## 实现计划

1. 新增选中 release 状态和版本差异摘要计算。
2. 扩展本地版本卡片，支持选择、对比、载入、打开。
3. 新增“回滚发布”动作，通过当前 config platform client 生成新的 published release。
4. 更新 AI 状态、TODO 和验证报告。
5. 运行 `pnpm typecheck`、`pnpm build`、`pnpm test` 和本地入口 smoke check。

## 验收标准

- [x] 本地版本列表可以选择一个版本作为对比对象。
- [x] 对比面板展示标题、状态、环境、节点数、数据源数、动作数、页面版本差异。
- [x] 可以从对比面板载入选中版本继续编辑。
- [x] 可以将选中版本作为新的 published release 发布。
- [x] 回滚发布后版本列表刷新，active published mock 指向新的 published release。
- [x] 没有版本时显示空状态。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] 编辑器和 H5 runtime smoke check 通过。
- [x] 项目状态、TODO 和验证报告已更新。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
curl -I http://localhost:5173/
curl -I http://localhost:5174/
```

## 发布影响

- 是否需要发布：暂不发布。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：类型检查、构建、测试和本地入口检查通过。

## 风险和阻塞

- 当前只做摘要级差异，尚未提供 JSON 逐字段 diff。
- 当前回滚是 localStorage mock，真实回滚必须由 Java 配置平台执行并审计。

## 验证结果

2026-07-31 验证通过。

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，3 个 suite、19 个用例全部通过。
- `curl -I http://localhost:5173/`：返回 `HTTP/1.1 200 OK`。
- `curl -I http://localhost:5174/`：返回 `HTTP/1.1 200 OK`。

验证报告：`.ai/test-reports/TASK-2026-0731-022-editor-release-diff-rollback.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确本地版本对比和回滚发布范围。 |
| 2026-07-31 | in_progress | 开始实现版本差异摘要和回滚入口。 |
| 2026-07-31 | verified | 完成本地版本选择、摘要对比、载入所选、回滚发布和验证记录。 |
