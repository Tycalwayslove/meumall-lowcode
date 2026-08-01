# TASK-2026-0801-152-adapters-http-action-changeset

## 标题

补充 adapters HTTP action 公开 API changeset

## 状态

verified

## 目标

为 `@meumall/lowcode-adapters` 新增的 `createHttpActionHandler` 公开 API 补充 Changesets 版本记录，并验证现有 npm pack dry-run 仍能覆盖 8 个可发布包，为后续真实 npm 发布保留可追踪版本账本。

## 背景

`TASK-2026-0801-151-adapters-http-action-handler` 新增了 adapters 公开 API，并在发布影响里记录“后续发布应作为 minor”。根据 `.ai-workspace/RELEASE_GOVERNANCE.md`，真实发布前必须有 Changesets 记录版本变化。当前仓库尚未配置 npm registry/token，不执行真实发布；本任务只补充 changeset 和发布说明，避免后续发布时遗漏该公开 API 变化。

## 涉及包或系统

- `.changeset/`
- `docs/release-and-publish.md`
- `.ai-workspace/tasks/`
- `.ai/`

## 范围

包含：

- 新增一条 changeset，记录 `@meumall/lowcode-adapters` minor 级公开 API 变化。
- 在发布说明中补充当前 linked version group 对 `changeset version` 的影响。
- 同步 AI 状态、TODO 和任务记录。
- 运行 `pnpm pack:dry-run`、`pnpm test` 和 `git diff --check`。

不包含：

- 不执行 `pnpm version-packages`。
- 不修改 package version。
- 不执行 `pnpm publish-packages`。
- 不创建 GitHub release 或 tag。
- 不调整 `.changeset/config.json` 的 linked 配置。
- 不补历史所有公开 API 的 changeset。

## 责任边界

当前仓库：

- 负责维护 changeset 账本、发布文档和本地 dry-run 验证。

外部系统：

- npm registry、access、token、GitHub release/tag 和发布工作流仍需后续确认。

## 契约影响

- 是否影响跨包或跨系统契约：是，补充 npm 公开 API 发布账本；不改变代码接口。
- 契约文档路径：`docs/release-and-publish.md`、`.ai-workspace/RELEASE_GOVERNANCE.md`、`.changeset/*.md`。
- 是否向后兼容：是。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`docs/release-and-publish.md`、`.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：低代码前端维护者、npm 发布负责人。
- 当前确认状态：本地 changeset 和 pack dry-run。

## 实现计划

1. 新增 adapters HTTP action changeset。
2. 更新发布说明，记录 linked version group 和本次不执行 version/publish。
3. 更新 AI 状态和 TODO。
4. 运行 pack/test/diff 验证。
5. 标记任务 verified 并提交推送。

## 验收标准

- [x] `.changeset/` 下存在记录 `@meumall/lowcode-adapters` minor 的 changeset。
- [x] changeset 文案说明 `createHttpActionHandler`、HTTP action 请求和异步错误处理。
- [x] 发布说明记录 linked version group 对后续 `changeset version` 的影响。
- [x] 本任务不修改任何 package version。
- [x] 不执行真实 npm 发布。
- [x] `pnpm pack:dry-run` 通过。
- [x] `pnpm test` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm changeset status
pnpm pack:dry-run
pnpm test
git diff --check
```

## 验证结果

- `pnpm changeset status` 通过；识别 `@meumall/lowcode-adapters` 为 minor bump，同时提示 `@meumall/lowcode-editor-playground` 和 `@meumall/lowcode-h5-runtime-playground` patch bump。两个 playground app 不属于当前 `pnpm pack:dry-run` 扫描的 8 个 `packages/*` 可发布包，真实发布前需要由 release owner 决定是否保留 linked group 和 app 版本策略。
- `pnpm pack:dry-run` 通过，8 个可发布包均完成 npm pack dry-run。
- `pnpm test` 通过，94 项测试全部通过，并包含架构边界检查。
- `git diff --check` 通过。

## 发布影响

- 是否需要发布：否，本任务不执行真实 npm 发布。
- 发布对象：无；changeset 为后续发布 `@meumall/lowcode-adapters` 和 linked group 做准备。
- 是否需要 changeset：是。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：不改变运行时代码；为后续 H5 宿主升级 adapters 包提供版本记录。
- 是否影响 npm 发布：是，新增 changeset 会影响后续 `changeset version` 的版本计算。
- 是否影响 Java 配置平台：否。
- 回滚目标：删除本任务新增 changeset 和文档状态更新即可。
- smoke check：本任务不改 runtime；以 `pnpm pack:dry-run` 和 `pnpm test` 验证发布预检和现有功能不受影响。

## 风险和阻塞

- 当前 `.changeset/config.json` 使用 linked group，后续执行 `pnpm version-packages` 时可能带动 8 个包统一版本；本任务只记录该事实，不调整策略。
- 历史部分公开 API 仍没有逐条 changeset，本任务不补历史债，避免扩大版本发布范围。
- 真实 npm registry、access 和 token 未确认，仍不能执行真实发布。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 adapters HTTP action changeset、发布说明和验证记录。 |
| 2026-08-01 | verified | 完成 adapters HTTP action pending minor changeset、linked group 发布说明、AI 状态同步，并通过 changeset status、pack dry-run、test 和 diff check。 |
