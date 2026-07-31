# Project State

## 当前状态

MeuMall Lowcode 已完成第一版 monorepo 骨架、AI 协作体系、GitHub 远端推送，以及 schema/editor 第一批基础代码。

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
- GitHub 远端 `git@github.com:Tycalwayslove/meumall-lowcode.git` 已配置并推送 `main`。
- Page Schema v1 基础类型、标准化、递归校验和 manifest 校验。
- Editor headless command：模式、视口、选择、插入、更新、复制、移动、删除、undo/redo。

## 已知缺口

- 尚未实现完整编辑器 UI。
- Page Schema v1 契约仍为 draft，需要在 Java 配置平台对接前继续细化。
- 尚未定义 Java 配置平台 API 契约。
- 尚未接入 `hybird-meumall`。
- 尚未配置 npm registry/token。
- 尚未建立单元测试体系。

## 最近变更

| 日期 | 提交 | 说明 |
| --- | --- | --- |
| 2026-07-31 | `a5a8a60` | 初始化低代码 monorepo。 |
| 2026-07-31 | `0ed06ff` | 迁移低代码 AI 工作流。 |
| 2026-07-31 | `e1655eb` | 要求 Git 提交信息使用中文。 |
| 2026-07-31 | 待提交 | 推送 GitHub 远端并实现 schema/editor 第一批基础代码。 |

## 默认验证命令

```bash
pnpm typecheck
pnpm build
```
