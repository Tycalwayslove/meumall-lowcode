# TASK-2026-0731-021-editor-publish-checklist

## 状态

verified

## 目标

为 Vue3 编辑器 playground 增加发布前检查清单，在运营生成预览或发布页面前展示 schema、节点、素材、商品、数据源和动作的 readiness 状态，并阻止存在明显错误的发布。

## 背景

当前编辑器已经具备拖拽搭建、素材/商品选择、数据源、动作配置、本地预览和发布 mock。但发布动作仍是直接执行，运营无法在发布前快速确认页面是否存在空节点、缺图、空商品、未解析数据源或 schema 校验错误。为了让编辑器更接近可实操工具，需要补充发布检查入口和基础拦截。

## 涉及包或系统

- `apps/editor-playground`
- `.ai-workspace/tasks`
- `.ai/test-reports`
- `.ai/PROJECT_STATE.md`
- `.ai/AI_CONTEXT.md`
- `.ai/TODO.md`

## 范围

包含：

- 新增发布检查清单，覆盖 schema 校验、节点数量、图片字段、商品列表、数据源解析和 action 引用。
- 在右侧面板展示检查项状态、数量汇总和错误/警告说明。
- 发布前阻止存在 error 检查项的页面发布。
- 生成预览时允许 warning，但阻止 error。
- 保留保存草稿不拦截，便于保存半成品。
- 更新项目状态、TODO 和验证报告。

不包含：

- 接入真实审批流。
- 接入真实 Java 配置平台发布校验接口。
- 修改 Page Schema v1。
- 新增 npm 发布或 changeset。

## 责任边界

当前仓库：

- 提供 Vue3 编辑器 playground 的前端发布检查样例。

外部系统：

- Java 配置平台后续负责服务端强校验、审批、权限、发布审计和错误码。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无。
- 是否向后兼容：是，仅增强 playground UI。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：暂用 mock。

## 实现计划

1. 新增 publish checks 计算逻辑。
2. 在发布和预览函数中加入 error 拦截。
3. 在右侧面板增加发布检查清单和摘要。
4. 更新 AI 状态、TODO 和验证报告。
5. 运行 `pnpm typecheck`、`pnpm build`、`pnpm test` 和本地入口 smoke check。

## 验收标准

- [x] 发布检查清单展示 schema、节点、图片、商品、数据源和动作状态。
- [x] 检查项区分 pass、warning 和 error。
- [x] 预览和发布会拦截 error 检查项。
- [x] 保存草稿不受发布检查阻塞。
- [x] 数据源解析失败会显示为 error。
- [x] 空商品或缺图会显示为 warning。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] 编辑器和 H5 runtime smoke check 通过。
- [x] 项目状态、TODO 和验证报告已更新。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
curl -I http://localhost:5173/
curl -I http://localhost:5174/
```

## 发布影响

- 是否需要发布：暂不发布。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：类型检查、构建、测试和本地入口检查通过。

## 风险和阻塞

- 当前检查是前端 mock 级别，真实上线仍需要 Java 配置平台服务端强校验。
- 部分业务规则如库存、价格、优惠券状态仍无法在本地 mock 中验证。

## 验证结果

2026-07-31 验证通过。

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，3 个 suite、19 个用例全部通过。
- `curl -I http://localhost:5173/`：返回 `HTTP/1.1 200 OK`。
- `curl -I http://localhost:5174/`：返回 `HTTP/1.1 200 OK`。

验证报告：`.ai/test-reports/TASK-2026-0731-021-editor-publish-checklist.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确发布前检查清单范围和验收标准。 |
| 2026-07-31 | in_progress | 开始实现发布检查和预览/发布拦截。 |
| 2026-07-31 | verified | 完成发布检查清单、预览/发布错误拦截、状态文档和验证报告。 |
