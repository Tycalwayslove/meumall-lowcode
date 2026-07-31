# TASK-2026-0731-008-react-h5-runtime-playground

## 状态

verified

## 目标

新增独立 React H5 runtime playground，用同一份 Page Schema 验证 `@meumall/lowcode-renderer-h5` 和 `@meumall/lowcode-materials-h5` 可以作为未来 `hybird-meumall` 的 H5 消费端运行。

## 背景

当前 Vue3 editor playground 已经具备编辑和 H5 预览能力，但该预览走的是 Vue H5 renderer/materials。由于 MeuMall H5 消费方后续更可能通过 React H5 renderer/materials 接入，需要一个独立可运行入口证明发布 schema 可以被 React H5 runtime 渲染，并将其纳入根级类型检查和构建流程。

## 涉及包或系统

- `apps/h5-runtime-playground`
- `@meumall/lowcode-renderer-h5`
- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-core`
- `@meumall/lowcode-schema`
- root workspace scripts

## 范围

包含：

- 新增 React H5 runtime playground app。
- 使用包含容器、头图、Banner、优惠券、商品列表和富文本的示例 schema。
- 使用 mock 数据验证 `dataBinding` 渲染商品列表。
- 增加运行时状态栏，展示 schema 校验、节点数、页面版本和环境。
- 根级 `typecheck` 和 `build` 覆盖 H5 runtime playground。
- React H5 materials 的运行时 props 类型与 renderer 事件注入保持兼容。
- 更新 README、集成文档、项目状态和验证报告。

不包含：

- 真实 Java 配置平台 API。
- 与 Vue editor playground 的跨 app localStorage 共享。
- 真实 `hybird-meumall` 工程改造。
- npm 正式发布。

## 责任边界

当前仓库：

- 提供 React H5 runtime 消费 schema 的可运行参考。
- 保证 H5 renderer/materials 的基础集成被构建验证覆盖。

外部系统：

- `hybird-meumall` 后续负责按业务路由和 Java 配置平台 API 接入。
- Java 配置平台后续负责提供 published/preview schema。

## 契约影响

- 是否影响跨包或跨系统契约：是，补充 H5 接入验证形态。
- 契约文档路径：`docs/meumall-integration.md`、`apps/h5-runtime-playground/src/App.tsx`
- 是否向后兼容：是，不改变 Page Schema v1。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`docs/meumall-integration.md`
- 需要确认的角色：H5 接入方。
- 当前确认状态：本地 playground 验证。

## 实现计划

1. 新增 H5 runtime playground app 和示例 schema。
2. 将 root typecheck/build 纳入该 app。
3. 更新 README 和集成文档。
4. 运行类型检查、构建和本地 smoke check。
5. 更新任务状态和验证报告。

## 验收标准

- [x] 存在独立 `apps/h5-runtime-playground`。
- [x] 该 app 使用 React H5 renderer/materials 渲染示例 schema。
- [x] 示例 schema 覆盖基础物料和容器嵌套。
- [x] 商品列表通过 `dataBinding` 使用 mock runtime data。
- [x] 根级 `pnpm typecheck` 覆盖 H5 runtime app。
- [x] 根级 `pnpm build` 覆盖 H5 runtime app。
- [x] `pnpm --filter @meumall/lowcode-h5-runtime-playground build` 通过。
- [x] 本地 H5 runtime dev server smoke check 通过。

## 验证命令

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm --filter @meumall/lowcode-h5-runtime-playground build
pnpm --filter @meumall/lowcode-h5-runtime-playground dev -- --host 0.0.0.0
curl -I http://localhost:5174/
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：H5 runtime app 本地访问返回 200，类型检查和构建通过。

## 验证结果

2026-07-31：

- `pnpm install` 通过，workspace 识别 11 个项目。
- `pnpm --filter @meumall/lowcode-h5-runtime-playground typecheck` 通过。
- `pnpm --filter @meumall/lowcode-h5-runtime-playground build` 通过。
- `pnpm typecheck` 通过，覆盖 Vue editor playground 和 React H5 runtime playground。
- `pnpm build` 通过，覆盖 Vue editor playground 和 React H5 runtime playground。
- `curl -I http://localhost:5174/` 返回 `HTTP/1.1 200 OK`。
- 验证报告：`.ai/test-reports/TASK-2026-0731-008-react-h5-runtime-playground.md`

## 风险和阻塞

- H5 runtime playground 使用静态示例 schema 和 mock 数据，不代表真实 Java 配置平台链路。
- 当前只是 H5 接入参考，不替代 `hybird-meumall` 真实路由集成。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确新增 React H5 runtime playground。 |
| 2026-07-31 | in_progress | 开始新增 React H5 runtime app 并接入根级验证。 |
| 2026-07-31 | verified | 类型检查、构建和本地 H5 runtime smoke check 通过。 |
