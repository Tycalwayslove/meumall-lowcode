# TASK-2026-0731-006-local-platform-publish-flow

## 状态

verified

## 目标

在 Vue3 编辑器 playground 中补齐本地 mock 配置平台链路，支持保存草稿、生成预览版本、发布页面，并提供独立 H5 运行态入口，为后续迁入管理系统和对接 Java 配置平台打基础。

## 背景

当前 playground 已具备物料编排、容器、属性编辑、mock 数据源预览和本地保存能力，但还缺少运营系统中最关键的配置平台流程：草稿留存、预览访问、发布版本和 H5 端按页面读取发布内容。本任务先用浏览器 localStorage 模拟 Java 配置平台，保证架构链路可跑通，后续再替换为真实 API。

## 涉及包或系统

- `apps/editor-playground`
- Java 配置平台 mock
- H5 runtime mock

## 范围

包含：

- 新增本地 mock 配置平台模块。
- 编辑器支持保存草稿、生成预览、发布当前页面。
- 编辑器可打开独立 H5 runtime 地址。
- runtime 支持按 `releaseId` 或 `pageId` 读取本地版本并渲染。
- 记录任务和验证结果。

不包含：

- 真实 Java 后端接口。
- 发布审批、权限、回滚 UI。
- npm 正式发版。
- `hybird-meumall` 真实接入。

## 责任边界

当前仓库：

- 提供可迁移到管理系统的 Vue3 编辑器流程和本地 mock 配置平台。
- 提供 H5 runtime 入口用于验证 renderer 消费发布 schema。

外部系统：

- Java 配置平台后续负责持久化、预览链接、发布审批、版本查询和回滚。
- H5 业务工程后续通过 npm 包和配置平台 API 消费发布页面。

## 契约影响

- 是否影响跨包或跨系统契约：是，本任务模拟 Java 配置平台与 H5 runtime 的对接路径。
- 契约文档路径：`apps/editor-playground/src/mockPlatform.ts`、`docs/meumall-integration.md`
- 是否向后兼容：是，不改变 Page Schema v1 字段类型。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`docs/meumall-integration.md`
- 需要确认的角色：Java 配置平台 / H5 接入方。
- 当前确认状态：暂用 mock。

## 实现计划

1. 新增本地 mock 配置平台模块，封装 draft、preview、published release。
2. 增强 Vue3 编辑器顶部操作和发布记录列表。
3. 增加独立 H5 runtime 查询参数入口。
4. 更新文档、项目状态和验证报告。
5. 运行类型检查、构建和本地 smoke check。

## 验收标准

- [x] 可以保存草稿并写入本地 mock 配置平台。
- [x] 可以生成预览版本并打开 runtime 预览页。
- [x] 可以发布当前页面并通过 `pageId` 打开已发布 runtime 页面。
- [x] 编辑器能查看本地版本记录并载入或打开某个版本。
- [x] 独立 runtime 不展示编辑器面板，只渲染 H5 页面。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] 本地 dev server smoke check 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
curl -I http://localhost:5173/
curl -I "http://localhost:5173/?runtime=1&pageId=summer-campaign-demo"
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：编辑器入口和 runtime 入口均可访问。

## 验证结果

2026-07-31：

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `curl -I http://localhost:5173/` 返回 `HTTP/1.1 200 OK`。
- `curl -I "http://localhost:5173/?runtime=1&pageId=summer-campaign-demo"` 返回 `HTTP/1.1 200 OK`。
- 验证报告：`.ai/test-reports/TASK-2026-0731-006-local-platform-publish-flow.md`

## 风险和阻塞

- 当前使用 localStorage mock，不代表正式 Java 配置平台的数据一致性、权限和审批能力。
- runtime 数据源仍使用 playground mock resolver，不代表正式 H5 数据源 resolver。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确本地配置平台发布链路任务。 |
| 2026-07-31 | in_progress | 开始实现本地 mock 配置平台、编辑器发布操作和 runtime 入口。 |
| 2026-07-31 | verified | 类型检查、构建和本地 smoke check 通过。 |
