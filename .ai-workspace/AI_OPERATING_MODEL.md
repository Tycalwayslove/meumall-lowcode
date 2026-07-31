# AI 操作模型

## 目标

MeuMall Lowcode AI 协作体系让 AI 可以长期参与低代码平台建设，并让后来接手的人知道目标、边界、状态、变更文件和验证结果。

## 适用范围

当前仓库维护：

- `@meumall/lowcode-schema`
- `@meumall/lowcode-core`
- `@meumall/lowcode-renderer-h5`
- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-editor`
- `@meumall/lowcode-adapters`
- 低代码平台架构、发布、拆包和 MeuMall 接入文档

当前仓库不实现：

- Java 配置平台。
- Java 业务后端。
- `hybird-meumall` H5 业务页面源码。
- iOS/App 容器。
- 小程序后台或小程序原生工程。

## 标准启动流程

1. 读取根级 `AGENTS.md` 和 `.ai-workspace/README.md`。
2. 按读取顺序恢复 AI 工作区上下文。
3. 读取当前任务文件。
4. 读取 `.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md` 和 `.ai/TODO.md`。
5. 判断任务状态是否为 `ready`。
6. 判断是否影响 schema、包边界、跨系统契约或发布流程。
7. 制定实现计划。
8. 实现代码和文档。
9. 运行验证命令。
10. 更新任务状态、项目状态、变更摘要和测试记录。
11. 汇报结果、风险和下一步。

## 开发门禁

- `idea`、`draft` 状态只允许澄清、设计和补充任务，不允许实现。
- `ready` 状态才允许进入实现。
- schema 变更必须说明兼容性、迁移方式和受影响包。
- renderer 不允许依赖 editor。
- materials 不允许依赖业务项目内部代码。
- editor 不允许直接绑定 H5 业务页面实现。
- 发布相关变更必须说明 npm、GitHub、CI、回滚和 smoke check 影响。

## AI 行为要求

- 优先使用仓库内事实，不依赖聊天记忆。
- 优先小步变更，每次变更有清晰范围。
- 不覆盖用户或其他协作者已有修改。
- 不把临时判断写成长期事实。
- 发现文档和实现不一致时，必须指出并在任务范围内修正。
- 修改共享协议时，同步更新受影响包的 README 或 `docs/`。

## 完成定义

一个任务只有同时满足以下条件，才能标记为 `verified`：

- 实现符合任务范围。
- 契约、文档和项目状态已同步。
- 指定验证命令通过，或限制已记录。
- 验收标准逐项有结果。
- 发布影响已说明。

