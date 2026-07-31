# TASK-2026-0731-069-editor-schema-import-export

## 标题

增强 Vue3 编辑器 Schema 导入导出

## 状态

verified

## 目标

在不改变 Page Schema v1、Material Manifest v1 和 npm 公开 API 的前提下，为 Vue3 编辑器 playground 增加可实操的页面 schema 文件导出和导入能力，方便运营配置备份、验收流转、问题复现和开发排查。

## 背景

当前编辑器已具备本地自动保存、源码查看/应用、H5 预览、模板应用和本地版本管理，但缺少直接从文件导入/导出页面 schema 的操作入口。实际多人协作或验收时，经常需要把某个页面配置以 JSON 文件形式流转。该能力应优先落在 playground shell，复用现有 schema 校验和编辑器状态，不改变核心 schema 契约。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

包含：

- 在 Vue3 编辑器 playground 增加导出当前 schema 为 JSON 文件的入口。
- 在 Vue3 编辑器 playground 增加从本地 JSON 文件导入 schema 的入口。
- 导入时复用 Page Schema 校验，失败时展示可读错误，不覆盖当前画布。
- 导入成功后替换当前画布、选中首个节点、标记为草稿变更，并可继续预览/保存/发布。
- 快捷命令面板增加导入/导出命令。
- browser smoke 覆盖导入导出主路径和失败保护。
- 更新任务记录和 `.ai` 项目事实源。

不包含：

- 不新增 Page Schema 字段。
- 不改变 Material Manifest。
- 不接入真实 Java 配置平台文件存储。
- 不实现批量页面包导入导出。
- 不新增 npm 公开 API。

## 责任边界

当前仓库：

- 编辑器 playground 负责文件选择、下载、导入校验和状态提示。
- schema 包继续作为 Page Schema 校验事实源。
- browser smoke 负责验证主交互路径。

外部系统：

- Java 配置平台、真实素材中心、商品中心、H5 业务仓库无需变更。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无新增；仍遵循 `.ai-workspace/contracts/page-schema-v1.md`。
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
2. 梳理编辑器当前 schema 源码面板、命令面板、状态提示和 smoke 脚本。
3. 实现 schema 导出下载和 schema 文件导入校验。
4. 补充快捷命令入口和浏览器 smoke 覆盖。
5. 更新 `.ai` 状态记录。
6. 运行验证命令并记录结果。

## 验收标准

- [x] 编辑器可从明确入口导出当前 Page Schema JSON 文件。
- [x] 编辑器可从本地 JSON 文件导入合法 Page Schema，并替换当前画布。
- [x] 导入非法 JSON 或非法 Page Schema 时展示错误提示，不覆盖当前画布。
- [x] 快捷命令面板可触发导入和导出能力。
- [x] 导入后可继续使用源码模式、预览模式和 React H5 预览入口。
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

- 浏览器文件下载和文件选择在 headless smoke 中需要通过 DOM 可观测状态验证，不能只依赖人工点击。
- 导入失败必须保证当前 schema 不被覆盖。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建任务，范围限定为 Vue3 编辑器 playground 的 schema 导入导出能力。 |
| 2026-07-31 | in_progress | 开始梳理编辑器源码面板、快捷命令和 browser smoke，准备实现导入导出。 |
| 2026-07-31 | verified | 已完成工具栏、源码区和快捷命令的 schema 导入导出，并通过 `pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm smoke:browser` 验证。 |
