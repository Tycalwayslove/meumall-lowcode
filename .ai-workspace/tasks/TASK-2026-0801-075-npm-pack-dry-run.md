# TASK-2026-0801-075-npm-pack-dry-run

## 标题

补充 npm 包发布 dry-run 预检

## 状态

verified

## 目标

为当前 monorepo 中的可发布低代码包补充统一 npm pack dry-run 预检脚本，逐包验证实际打包内容包含 `package.json`、`README.md`、`dist/index.js` 和 `dist/index.d.ts`，让后续通过 npm 引入 schema、editor、renderer、materials 和 adapters 前具备可重复执行的发布前检查入口。

## 背景

当前仓库已经具备可发布 npm 包结构、Changesets 配置、包级 `package.json` 和构建产物，但根级发布治理仍只有 `changeset publish`，缺少一个不依赖真实 npm token、可以在本地和 CI 中执行的 pack 内容预检。按照 `.ai-workspace/RELEASE_GOVERNANCE.md`，npm 发布前必须执行 `npm pack --dry-run` 或等价 dry-run 检查，因此本任务补齐该发布门禁。

## 涉及包或系统

- 根级 `package.json`
- `scripts/`
- `docs/release-and-publish.md`
- `.ai/`

## 范围

包含：

- 新增根级 `pnpm pack:dry-run` 脚本。
- 新增 Node 脚本自动发现 `packages/*/package.json` 中非 private 的可发布包。
- 对每个可发布包执行 `npm pack --dry-run --json`。
- 校验每个包实际 pack 文件至少包含 `package.json`、`README.md`、`dist/index.js` 和 `dist/index.d.ts`。
- 输出逐包检查结果和汇总结果。
- 更新发布文档、项目事实源和任务记录。

不包含：

- 不执行真实 npm publish。
- 不创建 changeset 版本变更。
- 不修改包版本号。
- 不修改 npm registry、token、scope 或 access。
- 不改变 Page Schema、Material Manifest、renderer/editor/adapters 公开 API。

## 责任边界

当前仓库：

- 提供可重复执行的 pack dry-run 预检脚本。
- 维护发布文档和验证记录。

外部系统：

- npm registry、npm token、公司私有源、GitHub release 仍需后续确认和配置。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：不新增契约；仍遵循 `.ai-workspace/RELEASE_GOVERNANCE.md` 和 `docs/release-and-publish.md`。
- 是否向后兼容：是。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：后续真实发布前仍需确认 npm registry、access 和 token。
- 当前确认状态：本任务无需确认。

## 实现计划

1. 将任务状态流转为 `in_progress`。
2. 编写 `scripts/npm-pack-dry-run.mjs`。
3. 在根级 `package.json` 增加 `pack:dry-run`。
4. 更新 `docs/release-and-publish.md`、`.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md` 和 `.ai/TODO.md`。
5. 运行验证命令并记录结果。

## 验收标准

- [x] 根级存在 `pnpm pack:dry-run` 命令。
- [x] 预检脚本可自动发现 8 个可发布包。
- [x] 每个包都执行 `npm pack --dry-run --json`。
- [x] 每个包都校验 `package.json`、`README.md`、`dist/index.js` 和 `dist/index.d.ts`。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm pack:dry-run` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm pack:dry-run
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- npm 影响：新增发布前 dry-run 预检入口，但不发布包。
- 回滚目标：回滚本任务提交。
- smoke check：本任务不改变 runtime 行为，不要求浏览器 smoke；仍通过 `pnpm build` 和 `pnpm test` 验证包构建与基础回归。

## 风险和阻塞

- `npm pack --dry-run` 依赖各包已完成构建；因此发布前仍需先运行 `pnpm build`。
- 真实发布仍阻塞于 npm registry、access 和 token 确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 npm 包 dry-run 预检，不执行真实发布。 |
| 2026-08-01 | in_progress | 开始实现 npm pack dry-run 脚本、根级命令和发布文档更新。 |
| 2026-08-01 | verified | 完成 `pnpm pack:dry-run`、发布文档和项目事实源更新；`pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm pack:dry-run` 均通过。 |
