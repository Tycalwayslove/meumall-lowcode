# TASK-2026-0731-017-hybird-meumall-runtime-integration

## 状态

verified

## 目标

将 React H5 runtime playground 的接入方式沉淀为 `hybird-meumall` 可执行的 H5 runtime 集成清单，并在 adapters 中补充 runtime schema loader，统一 pageId、releaseId 和本地 encoded schema 的取数路径。

## 背景

当前低代码平台已经具备 React H5 renderer/materials、配置平台 client 草案、data source resolver 和 safe action executor。下一步真实接入 `hybird-meumall` 时，需要明确 H5 工程如何引入 npm 包、如何按 `pageId` 获取 published schema、如何按 `releaseId` 打开预览、如何处理本地 URL handoff、如何注册数据源和 action handler，以及失败时如何降级。

## 涉及包或系统

- `@meumall/lowcode-adapters`
- `apps/h5-runtime-playground`
- `docs/meumall-integration.md`
- `.ai-workspace/contracts`
- `.ai-workspace/tasks`
- `.ai/test-reports`
- `.ai/PROJECT_STATE.md`
- `.ai/TODO.md`
- `.ai/AI_CONTEXT.md`

## 范围

包含：

- adapters 新增 runtime schema loader。
- runtime schema loader 支持 `encodedSchema`、`releaseId`、`pageId` 和 `fallbackSchema`。
- adapters 单元测试覆盖 loader 的 encoded、release、published 和 fallback 分支。
- 新增或更新 H5 runtime 接入清单文档。
- 更新 h5 runtime playground README，指向真实接入清单。
- 更新项目状态、TODO 和验证报告。

不包含：

- 修改 `hybird-meumall` 真实业务仓库。
- 真实 Java API 联调。
- npm 发布。
- 真实数据源、action handler 和登录态接入。

## 责任边界

当前仓库：

- 提供 H5 runtime 接入清单、类型工具和 playground 参考。

外部系统：

- `hybird-meumall` 后续负责创建真实路由、接入 npm 包、注册 H5 宿主 handler 和上线 smoke check。
- Java 配置平台后续负责提供 published/preview schema API。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 H5 runtime 接入清单和 adapters runtime loader API。
- 契约文档路径：`.ai-workspace/contracts/h5-runtime-integration-v1.md`
- 是否向后兼容：是，仅新增 API 和文档。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`.ai-workspace/contracts/h5-runtime-integration-v1.md`
- 需要确认的角色：H5 接入负责人、Java 配置平台负责人。
- 当前确认状态：前端草案，待真实 H5 工程接入确认。

## 实现计划

1. 新增任务并置为 `ready` 后进入 `in_progress`。
2. adapters 新增 runtime schema loader 和测试。
3. 新增 H5 runtime 集成契约文档。
4. 更新 `docs/meumall-integration.md` 和 h5 runtime README。
5. 更新项目状态、TODO 和验证报告。
6. 运行 `pnpm test`、`pnpm typecheck`、`pnpm build` 和本地 smoke check。

## 验收标准

- [x] adapters 提供 runtime schema loader。
- [x] loader 支持 encoded schema、releaseId、pageId 和 fallback。
- [x] loader 对无效 schema 返回错误和 fallback，不直接导致白屏。
- [x] 存在 H5 runtime 集成清单契约文档。
- [x] 文档说明 `hybird-meumall` 需要新增的依赖、路由、数据源、action、降级和 smoke check。
- [x] adapters 单元测试覆盖 loader。
- [x] `pnpm test` 通过。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] 编辑器和 React H5 runtime smoke check 通过。
- [x] 项目状态、TODO 和验证报告已更新。

## 验证命令

```bash
pnpm test
pnpm typecheck
pnpm build
curl -I http://localhost:5173/
curl -I http://localhost:5174/
```

## 发布影响

- 是否需要发布：暂不发布。
- 发布对象：后续发布 `@meumall/lowcode-adapters` 时包含 runtime schema loader。
- 是否需要 changeset：当前不发布，暂不新增 changeset。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：基础测试、类型检查、构建和本地入口检查通过。

## 验证结果

2026-07-31 验证通过。

- `pnpm test`：通过，3 个 suite、19 个用例全部通过。
- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `curl -I http://localhost:5173/`：返回 `HTTP/1.1 200 OK`。
- `curl -I http://localhost:5174/`：返回 `HTTP/1.1 200 OK`。

验证报告：`.ai/test-reports/TASK-2026-0731-017-hybird-meumall-runtime-integration.md`。

## 风险和阻塞

- 真实 `hybird-meumall` 路由、鉴权和请求封装仍需要业务仓库确认。
- loader 当前只统一 schema 获取，不负责真实 data source/action handler。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确沉淀 H5 runtime 接入清单和 runtime schema loader。 |
| 2026-07-31 | in_progress | 开始实现 adapters loader 和 H5 接入契约文档。 |
| 2026-07-31 | verified | 完成 loader、接入契约、runtime playground 接入、文档状态和验证报告。 |
