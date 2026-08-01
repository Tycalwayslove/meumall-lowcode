# TASK-2026-0801-208-editor-delivery-checklist

## 状态

verified

## 目标

在 Vue3 编辑器发布面板中补充运营交付步骤清单，并将步骤派生逻辑沉淀到 `@meumall/lowcode-editor`，让运营在本地 playground 中能更清楚地按“检查、预览、交付、验收”完成一个 H5 页面闭环。

## 背景

当前发布面板已经有 H5 预览入口、交付指标、Schema 复制/导出和发布检查，但交付清单更像数据摘要，缺少明确下一步提示。为了让编辑器更接近可实操工具，需要在不改变 schema、renderer 和物料行为的前提下，补一个框架无关的交付步骤模型，并由 Vue3 playground 展示。

## 涉及包或系统

- `@meumall/lowcode-editor`
- `apps/editor-playground`
- 文档与 AI 工作流

## 范围

包含：

- 新增 editor 交付步骤清单类型和 `createLowcodeDeliveryChecklist`。
- 基于 Page Schema、发布检查结果和 H5 预览入口摘要派生交付步骤状态。
- Vue3 `EditorPublishPanel` 展示交付步骤。
- 补充 editor 单测、README、changeset、AI 记忆和任务验证记录。

不包含：

- 不修改 Page Schema v1 或 Material Manifest v1。
- 不修改 renderer、runtime、materials 行为。
- 不接真实 Java 配置平台、真实 previewToken 生成或生产发布审批。
- 不实现二维码、短信/飞书分享或远程交付工单。

## 责任边界

当前仓库：

- editor 包负责提供框架无关交付步骤模型。
- Vue3 editor playground 负责展示本地交付步骤和现有复制/导出动作入口。

外部系统：

- Java 配置平台负责正式 previewToken、releaseId、审批、服务端校验、发布记录和真实交付审计。
- H5 消费方负责生产路由接入和线上 smoke check。

## 契约影响

- 是否影响跨包或跨系统契约：影响 `@meumall/lowcode-editor` 公开 API；不影响 Page Schema v1、Material Manifest v1、renderer 或 H5 runtime 契约。
- 契约文档路径：`packages/editor/README.md`、`.ai/AI_CONTEXT.md`
- 是否向后兼容：是。新增 API 和 UI 展示，不改变已有函数行为。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要。
- 对接说明路径：`packages/editor/README.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 在 editor 包新增交付步骤清单类型和派生函数。
2. 在 Vue3 发布面板展示交付步骤。
3. 补充单测、README、changeset、AI 记忆和验证记录。

## 验收标准

- [x] editor API 能根据发布检查和 H5 预览入口派生交付步骤。
- [x] 发布检查有阻塞项时，交付步骤能明确提示先修复阻塞项。
- [x] H5 预览入口可用时，交付步骤能提示可进入 H5 验收。
- [x] Vue3 发布面板展示交付步骤，不影响现有复制 Schema、导出 Schema、预览、审批和发布操作。
- [x] 验证命令通过，并在任务文件记录结果。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
pnpm pack:dry-run
git diff --check
```

## 发布影响

- 是否需要发布：后续随 npm minor 或当前 linked group 发布。
- 发布对象：`@meumall/lowcode-editor`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不创建 tag/release。
- 回滚目标：回滚本任务提交即可。
- smoke check：`pnpm smoke:browser` 覆盖 Vue3 发布面板和 H5 runtime 关键链路。

## 风险和阻塞

- 风险：当前步骤清单只基于本地 playground 可见状态派生，不代表真实 Java 服务端已完成审批或线上发布。
- 阻塞：无。

## 验证结果

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `pnpm typecheck` | 通过 | TypeScript project references、Vue3 editor playground 和 React H5 runtime playground 类型检查通过。 |
| `pnpm build && node --test packages/editor/test/*.test.mjs` | 通过 | editor 包新增 1 个交付步骤清单单测，39 个 editor 测试通过。 |
| `pnpm test` | 通过 | 构建、架构边界检查和 158 个测试通过。 |
| `pnpm smoke:browser` | 通过 | Vue3 发布面板交付步骤清单、编辑器、内置 runtime、React H5 runtime、HTTP 配置平台 mock 和基础物料链路通过。 |
| `pnpm pack:dry-run` | 通过 | 12 个可发布包 npm pack dry-run 均通过。 |
| `git diff --check` | 通过 | 无空白错误。 |

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备新增 editor 交付步骤清单并接入 Vue3 发布面板。 |
| 2026-08-01 | implemented | 已新增 `createLowcodeDeliveryChecklist`、类型、单测、README、changeset、Vue3 发布面板展示和 browser smoke 断言。 |
| 2026-08-01 | verified | 验证通过：`pnpm typecheck`、`pnpm build && node --test packages/editor/test/*.test.mjs`、`pnpm test`、`pnpm smoke:browser`、`pnpm pack:dry-run` 和 `git diff --check` 均通过。 |
