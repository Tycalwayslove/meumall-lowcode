# AGENTS.md

本仓库是 MeuMall 低代码平台独立工作区。

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

## 文档规则

- 架构决策写入 `docs/architecture.md` 或新增 ADR。
- npm/GitHub 发布规则写入 `docs/release-and-publish.md`。
- 拆仓策略写入 `docs/repo-split-plan.md`。

