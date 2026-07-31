# TASK-2026-0731-001-ai-workflow-migration

## 状态

verified

## 目标

将 `meu-mall` 当前 AI 工作流机制迁移到 `meumall-lowcode`，形成低代码项目自己的协作事实源，避免后续多人协作时不知道哪里改了什么。

## 背景

`meumall-lowcode` 已完成第一版 monorepo 架构骨架，但缺少与 `meu-mall` 类似的 AI 工作流、任务状态、项目记忆和验收记录机制。低代码平台后续会涉及 schema、renderer、materials、editor、npm 发布、GitHub 留存和 H5/Java 配置平台对接，需要从项目初期建立可追踪规则。

## 涉及包或系统

- 根级 AI 工作流
- `.ai-workspace`
- `.ai`
- GitHub/CI 规则
- npm 发布治理

## 范围

包含：

- 新建低代码版 `.ai-workspace`。
- 新建根级 `.ai` 项目记忆。
- 更新根级 `AGENTS.md`。
- 更新 `README.md` 的协作入口。
- 记录本次迁移任务和验证结果。

不包含：

- 迁移 `meu-mall` H5 历史任务、业务 API 契约和飞书同步历史。
- 实现 Java 配置平台。
- 发布 npm 或推送 GitHub 远端。

## 责任边界

当前仓库：

- 维护低代码平台协作规则、任务事实源、包边界和发布治理。

外部系统：

- Java 配置平台、H5 业务仓库、GitHub 远端和 npm registry 只记录对接规则，不在本任务中执行外部发布。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增契约治理入口。
- 契约文档路径：`.ai-workspace/CROSS_PROJECT_CONTRACTS.md`
- 是否向后兼容：是，新增文档机制，不改变代码 API。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 读取 `meu-mall` AI 工作流核心文件。
2. 提取任务状态、验收、记忆、契约和发布治理机制。
3. 改写为适合低代码 monorepo 的 `.ai-workspace`。
4. 新建 `.ai` 项目事实源。
5. 更新入口文档并验证。

## 验收标准

- [x] `.ai-workspace` 包含读取入口、操作模型、项目地图、任务结构、状态流、验收标准、记忆协议、契约治理和发布治理。
- [x] `.ai` 包含当前项目状态、上下文、TODO 和测试报告入口。
- [x] `AGENTS.md` 明确正式任务前必须读取 AI 工作流。
- [x] `README.md` 明确 AI 协作入口。
- [x] `pnpm typecheck` 通过。

## 验证命令

```bash
pnpm typecheck
```

## 验证结果

2026-07-31：`pnpm typecheck` 通过。

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本次文档变更。
- smoke check：新会话按 `AGENTS.md` 和 `.ai-workspace/README.md` 可恢复上下文。

## 风险和阻塞

- 未配置 GitHub 远端，暂不能 push。
- npm registry 和 package access 尚未最终确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确迁移 AI 工作流机制，不迁移 H5 历史业务任务。 |
| 2026-07-31 | in_progress | 新建低代码版 `.ai-workspace` 和 `.ai`。 |
| 2026-07-31 | verified | 验证通过并记录结果。 |

