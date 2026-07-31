# Project State

## 当前状态

MeuMall Lowcode 已完成第一版 monorepo 骨架和 AI 协作体系。

## 当前维护范围

- `packages/schema`
- `packages/core`
- `packages/renderer-h5`
- `packages/materials-h5`
- `packages/editor`
- `packages/adapters`
- `docs/`
- `.ai-workspace/`
- `.ai/`

## 已完成

- pnpm workspace。
- TypeScript project references。
- 可发布 npm 包结构。
- Changesets 基础配置。
- GitHub Actions CI 基础配置。
- H5 renderer 初始实现。
- H5 materials 初始实现。
- 低代码版 AI 工作流迁移。

## 已知缺口

- 尚未实现完整编辑器 UI。
- 尚未定义正式 Page Schema v1 契约文档。
- 尚未定义 Java 配置平台 API 契约。
- 尚未接入 `hybird-meumall`。
- 尚未配置 GitHub 远端。
- 尚未配置 npm registry/token。
- 尚未建立单元测试体系。

## 最近变更

| 日期 | 提交 | 说明 |
| --- | --- | --- |
| 2026-07-31 | `a5a8a60` | 初始化低代码 monorepo。 |
| 2026-07-31 | 待提交 | 迁移低代码 AI 工作流。 |

## 默认验证命令

```bash
pnpm typecheck
pnpm build
```

