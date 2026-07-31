# TASK-2026-0731-070-editor-release-diff-detail

## 标题

增强 Vue3 编辑器本地版本差异详情

## 状态

verified

## 目标

在不改变 Page Schema v1、发布协议和 npm 公开 API 的前提下，增强 Vue3 编辑器 playground 的本地版本对比体验，让运营、验收和开发能在编辑器内直接看到当前草稿与所选本地版本的关键 schema 差异详情。

## 背景

当前编辑器已支持保存草稿、生成预览、发布、本地版本列表、摘要对比和回滚发布。摘要对比可以告诉用户“有几项差异”，但排查页面变更时还需要看到差异值，例如页面标题、状态、环境、节点数量、数据源数量、动作数量和 schema JSON 片段。该能力能提升版本验收和问题复现效率，并为后续接入 Java 配置平台版本 diff 预留交互形态。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

包含：

- 在本地版本对比面板展示当前草稿与所选版本的关键差异详情。
- 差异详情包含字段标签、当前值、所选版本值和变更状态。
- 提供当前草稿和所选版本的 schema JSON 片段预览，便于人工排查。
- browser smoke 覆盖保存版本、修改当前页面、选择版本对比和差异详情展示。
- 更新任务记录和 `.ai` 项目事实源。

不包含：

- 不新增 Page Schema 字段。
- 不改变 Java 配置平台 API 草案。
- 不实现服务端 JSON diff。
- 不新增外部 diff 依赖。
- 不改变本地版本存储结构。

## 责任边界

当前仓库：

- 编辑器 playground 负责本地版本差异展示和交互。
- 本地 mock 配置平台继续提供版本列表和版本 schema。
- browser smoke 负责验证核心交互路径。

外部系统：

- Java 配置平台、H5 业务仓库和真实发布系统无需变更。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无新增；仍遵循 `.ai-workspace/contracts/page-schema-v1.md` 和 `.ai-workspace/contracts/java-config-platform-api-v1.md`。
- 是否向后兼容：是。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 将任务状态流转为 `in_progress`。
2. 梳理现有本地版本列表、摘要 diff 和 smoke 操作流。
3. 增强差异详情数据结构和 Vue 模板展示。
4. 补充 browser smoke 覆盖版本差异详情。
5. 更新 `.ai` 状态记录。
6. 运行验证命令并记录结果。

## 验收标准

- [x] 选择本地版本后，版本对比面板展示当前草稿与所选版本的差异数量。
- [x] 版本对比面板展示关键字段的当前值、所选版本值和变更状态。
- [x] 版本对比面板展示当前草稿和所选版本的 schema JSON 片段预览。
- [x] 修改当前页面后，差异详情能反映页面标题等变更。
- [x] 版本载入和回滚发布能力不受影响。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm smoke:browser
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：使用 `pnpm smoke:browser` 验证编辑器、内置 runtime 和 React H5 runtime。

## 风险和阻塞

- JSON 片段预览不能让右侧面板出现横向撑破或文本覆盖。
- 差异详情只作为本地 mock 版本对比，不应被写成 Java 服务端 diff 契约。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建任务，范围限定为 Vue3 编辑器 playground 的本地版本差异详情。 |
| 2026-07-31 | in_progress | 开始梳理本地版本面板、差异摘要和 browser smoke 覆盖点。 |
| 2026-07-31 | verified | 已完成本地版本字段差异详情和 schema 片段预览，并通过 `pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm smoke:browser` 验证。 |
