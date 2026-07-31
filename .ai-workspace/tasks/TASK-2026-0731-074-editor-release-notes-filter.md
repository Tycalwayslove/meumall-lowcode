# TASK-2026-0731-074-editor-release-notes-filter

## 标题

增强 Vue3 编辑器本地版本备注和筛选

## 状态

verified

## 目标

在不改变 Page Schema v1、Java 配置平台 API 草案和 npm 公开 API 的前提下，增强 Vue3 编辑器 playground 的本地版本治理能力，为本地 draft/preview/published release 增加运营备注和版本筛选，让运营在多次保存、预览和发布后可以更快找到目标版本，并配合已有对比、载入、打开和回滚流程使用。

## 背景

当前编辑器已有本地 mock 发布链路：保存草稿、生成预览、发布页面、本地版本列表、版本对比、Schema 片段详情和回滚发布。随着页面多次编辑，版本列表会快速增长，但当前只能按时间查看，不支持备注和筛选。实际运营验收时经常需要标记“产品验收版”“设计走查版”“活动上线版”等版本语义，因此本任务补齐本地版本备注和筛选闭环。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

包含：

- `LocalPageRelease` 增加 playground 内部可选备注字段。
- 新增本地版本备注输入，保存草稿、生成预览和发布时写入 release。
- 版本列表展示备注。
- 版本列表支持按标题、pageVersion、类型和备注关键词筛选。
- 筛选无结果时展示空状态。
- browser smoke 覆盖备注写入、筛选命中和版本对比仍可用。
- 更新任务记录和 `.ai` 项目事实源。

不包含：

- 不新增 Page Schema 字段。
- 不修改 `.ai-workspace/contracts/java-config-platform-api-v1.md`。
- 不修改 `@meumall/lowcode-adapters` 的 `LowcodeConfigPlatformClient` 公开接口。
- 不实现服务端版本备注、审批备注或审计流。
- 不实现版本删除、归档、权限或分页。

## 责任边界

当前仓库：

- editor playground 负责本地备注输入、保存、展示和筛选。
- mockPlatform 负责本地 release 元信息存储。
- browser smoke 负责验证关键交互。

外部系统：

- Java 配置平台、审批系统、真实版本审计和权限系统无需变更。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无新增；仍遵循 `.ai-workspace/contracts/page-schema-v1.md` 和 `.ai-workspace/contracts/java-config-platform-api-v1.md`。
- 是否向后兼容：是，旧 localStorage release 没有备注时按空字符串处理。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 将任务状态流转为 `in_progress`。
2. 梳理本地 mockPlatform release 存储、编辑器发布动作和版本列表 UI。
3. 增加本地 release 备注字段和保存入口。
4. 增加版本筛选计算与空状态。
5. 补充 browser smoke 覆盖。
6. 更新 `.ai` 状态记录并运行验证命令。

## 验收标准

- [x] 保存草稿、生成预览和发布时可带本地版本备注。
- [x] 本地版本列表展示备注。
- [x] 本地版本列表可按备注关键词筛选命中版本。
- [x] 本地版本列表可按版本号或类型关键词筛选命中版本。
- [x] 筛选无结果时展示空状态。
- [x] 版本筛选后仍可选择版本并展示对比详情。
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

- 备注只是 playground 本地元信息，不应被误认为 Java 配置平台正式审计字段。
- 旧 release 没有备注时必须保持可读和可筛选。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建任务，范围限定为 Vue3 编辑器 playground 本地版本备注和筛选。 |
| 2026-07-31 | in_progress | 开始实现本地版本备注、版本列表筛选和 browser smoke 覆盖。 |
| 2026-07-31 | verified | 完成备注写入、版本展示、关键词筛选、无结果空态和筛选后对比验证；`pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm smoke:browser` 均通过。 |
