# MeuMall Lowcode AI 协作体系

本目录定义 MeuMall 低代码平台的统一 AI 协作机制。目标是让多人和多个 AI 会话可以长期协作，而不是依赖单次聊天上下文。

## 读取顺序

正式任务开始前，先按顺序读取：

1. `.ai-workspace/AI_OPERATING_MODEL.md`
2. `.ai-workspace/PROJECT_MAP.md`
3. `.ai-workspace/TASK_SCHEMA.md`
4. `.ai-workspace/STATE_FLOW.md`
5. `.ai-workspace/ACCEPTANCE_STANDARD.md`
6. `.ai-workspace/MEMORY_PROTOCOL.md`
7. `.ai-workspace/CROSS_PROJECT_CONTRACTS.md`
8. `.ai-workspace/RELEASE_GOVERNANCE.md`
9. 当前任务文件
10. `.ai/PROJECT_STATE.md`
11. `.ai/AI_CONTEXT.md`
12. `.ai/TODO.md`

涉及 schema、npm 发布、GitHub、CI、Java 配置平台、H5 接入或未来小程序渲染时，必须额外读取相关 `docs/`、`contracts/` 或 `templates/`。

## 目录职责

- `AI_OPERATING_MODEL.md`：AI 参与低代码平台建设的总规则。
- `PROJECT_MAP.md`：monorepo 包职责、依赖方向和外部系统边界。
- `TASK_SCHEMA.md`：统一工作项结构。
- `STATE_FLOW.md`：统一状态流转。
- `ACCEPTANCE_STANDARD.md`：统一验收标准。
- `MEMORY_PROTOCOL.md`：跨会话记忆协议。
- `CROSS_PROJECT_CONTRACTS.md`：schema、Java 配置平台、H5、小程序和 npm 包契约治理。
- `RELEASE_GOVERNANCE.md`：npm、GitHub、schema 和运行时发布治理。
- `templates/`：任务、契约、决策记录模板。
- `tasks/`：正式工作项事实源。
- `contracts/`：跨包、跨系统契约入口。
- `decisions/`：长期架构决策入口。

## 基本原则

- 没有工作项，不进入正式实现。
- 没有 `ready` 状态，不开始实现。
- 没有验收记录，不声称完成。
- 变更 schema、包边界、发布流程或外部契约时，必须更新对应文档。
- 所有长期有效事实必须写入仓库，不以聊天记录为准。
- 当前阶段先保持单仓 monorepo，包边界必须像可独立 npm 发布一样清晰。

