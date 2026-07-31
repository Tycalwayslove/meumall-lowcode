# AGENTS.md

本仓库是 MeuMall 低代码平台独立工作区。

## 必读规则

正式业务、架构、跨包协作、schema、契约、发布、npm、GitHub、CI 或长期维护任务开始前，必须先读取：

1. `.ai-workspace/README.md`
2. `.ai-workspace/AI_OPERATING_MODEL.md`
3. `.ai-workspace/PROJECT_MAP.md`
4. `.ai-workspace/TASK_SCHEMA.md`
5. `.ai-workspace/STATE_FLOW.md`
6. `.ai-workspace/ACCEPTANCE_STANDARD.md`
7. `.ai-workspace/MEMORY_PROTOCOL.md`
8. `.ai-workspace/CROSS_PROJECT_CONTRACTS.md`
9. `.ai-workspace/RELEASE_GOVERNANCE.md`
10. `.ai/PROJECT_STATE.md`
11. `.ai/AI_CONTEXT.md`
12. `.ai/TODO.md`

没有 `ready` 状态的正式工作项，不开始实现。没有验证记录，不声称完成。

## 工作语言

默认使用中文沟通；代码标识、npm 包名、接口字段和命令保留英文。

## 目标边界

- 当前仓库统一维护低代码 schema、core、H5 renderer、H5 物料、编辑器基础能力和发布文档。
- 当前仓库不实现 Java 配置平台、Java 后端接口、iOS/App 容器或小程序发布后台。
- Java 配置平台只作为外部系统，通过 schema/API 契约对接。
- `hybird-meumall` 只作为 H5 消费方，不把低代码平台源码散落回 H5 项目。

## 开发规则

- 先保持单仓 monorepo，包边界清晰，后续可以拆仓。
- 每个可发布包必须有独立 `package.json`、`README.md`、`src/index.ts`。
- schema 变更必须说明兼容性和迁移方式。
- renderer 不允许依赖 editor。
- materials 可以依赖 schema/core，但不得反向依赖业务项目。
- editor 可以依赖 schema/core，但不得依赖 MeuMall H5 项目内部代码。
- 发布前必须运行类型检查和构建。

## 版本规则

- 使用语义化版本。
- `patch`：bug 修复，不改变 schema 结构。
- `minor`：新增向后兼容字段或物料能力。
- `major`：删除字段、修改字段类型或破坏旧页面。

## Git 规则

- 所有 git 提交信息必须使用中文。
- 提交信息应简明说明本次变更目的，例如：`文档：补充 AI 工作流提交规则`。
- 不使用英文 conventional commit 作为默认提交格式，除非用户明确要求。

## 文档规则

- 架构决策写入 `docs/architecture.md` 或新增 ADR。
- npm/GitHub 发布规则写入 `docs/release-and-publish.md`。
- 拆仓策略写入 `docs/repo-split-plan.md`。
- 正式任务写入 `.ai-workspace/tasks/`。
- 长期项目事实写入 `.ai/PROJECT_STATE.md`。
- 测试和人工验证结果写入 `.ai/test-reports/` 或任务文件。
