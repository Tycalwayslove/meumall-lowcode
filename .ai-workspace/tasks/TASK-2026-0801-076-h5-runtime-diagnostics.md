# TASK-2026-0801-076-h5-runtime-diagnostics

## 标题

增强 React H5 runtime 运行诊断与空态演示

## 状态

verified

## 目标

增强 `apps/h5-runtime-playground` 的 H5 消费端实操性，在不改变 Page Schema、renderer 包、materials 包和 adapters 公开 API 的前提下，让 runtime playground 清晰展示 schema 请求入口、实际加载来源、fallback 原因、数据源状态、action 日志和空页面降级效果，帮助后续 `hybird-meumall` 接入时复用同一运行时思路。

## 背景

当前 React H5 runtime playground 已能消费 `@meumall/lowcode-renderer-h5`、`@meumall/lowcode-materials-h5`、`@meumall/lowcode-core` 和 `@meumall/lowcode-adapters` 渲染示例 Page Schema，也已接入数据源 resolver 和安全 action executor。但对于接入方来说，仍需要更直观地看到 `schema`、`pageId`、`releaseId` 和 fallback 的运行区别，以及 nodes 为空时不会白屏的降级效果。

## 涉及包或系统

- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `docs/meumall-integration.md`
- `.ai/`

## 范围

包含：

- H5 runtime 状态面板展示请求入口、实际来源、pageId、pageVersion、schema 校验、节点数、数据源状态。
- 当通过 `pageId` 或 `releaseId` 但没有配置平台 client 时，清晰展示 fallback 原因。
- 新增 `?demo=empty` 空页面演示，验证 nodes 为空时展示 H5 空态而不是白屏。
- README 和 H5 接入文档补充 runtime playground 参数说明。
- browser smoke 覆盖运行诊断面板和空态演示。
- 更新任务记录和 `.ai` 项目事实源。

不包含：

- 不修改 Page Schema v1。
- 不修改 `loadLowcodeRuntimeSchema` 公开 API。
- 不修改 React H5 renderer 或 materials 包。
- 不接入真实 Java 配置平台 HTTP client。
- 不改 `hybird-meumall` 真实业务仓库。
- 不新增 npm 包版本或 changeset。

## 责任边界

当前仓库：

- runtime playground 负责展示 H5 运行时加载、诊断和降级形态。
- browser smoke 负责验证关键 DOM 和空态。
- 文档负责说明本地 playground 与真实 H5 接入的差异。

外部系统：

- Java 配置平台仍负责真实 release/pageId schema 存储和查询。
- `hybird-meumall` 仍是后续真实 H5 消费方，本任务不直接修改。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：不新增契约；仍遵循 `.ai-workspace/contracts/h5-runtime-integration-v1.md`。
- 是否向后兼容：是。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是，更新 `docs/meumall-integration.md` 和 `apps/h5-runtime-playground/README.md`。
- 需要确认的角色：后续真实接入时需 H5 和 Java 配置平台负责人确认路由、鉴权和接口。
- 当前确认状态：本任务无需外部确认。

## 实现计划

1. 将任务状态流转为 `in_progress`。
2. 梳理 H5 runtime playground 当前 schema 加载和诊断展示。
3. 增强状态面板和 URL 参数说明。
4. 增加 `?demo=empty` 空页面演示。
5. 补充 browser smoke 覆盖。
6. 更新文档、项目状态并运行验证命令。

## 验收标准

- [x] React H5 runtime 状态面板展示请求入口和实际来源。
- [x] 默认无参数时展示 sample fallback 来源。
- [x] `?pageId=summer-campaign-demo` 在无配置平台 client 时展示 fallback 原因。
- [x] `?demo=empty` 展示页面空态，不白屏。
- [x] browser smoke 覆盖运行诊断和空态演示。
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
- 是否影响 H5 接入：只增强本地接入参考和 smoke，不改变 H5 npm 包 API。
- 回滚目标：回滚本任务提交。
- smoke check：使用 `pnpm smoke:browser` 验证 editor playground、内置 runtime、React H5 runtime 和 empty demo。

## 风险和阻塞

- 当前 `pageId` / `releaseId` 在 playground 中没有真实 Java client，因此会展示 fallback 原因；这正是本地演示状态，不代表生产行为。
- `?demo=empty` 只用于本地降级演示，生产入口仍应由配置平台返回真实 schema。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 H5 runtime playground 诊断展示和空态演示。 |
| 2026-08-01 | in_progress | 开始实现 H5 runtime 诊断面板、empty demo、smoke 覆盖和文档更新。 |
| 2026-08-01 | verified | 完成运行诊断面板、pageId fallback 原因、`?demo=empty` 空态演示、文档和 smoke 覆盖；`pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm smoke:browser` 均通过。 |
