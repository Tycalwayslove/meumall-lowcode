# TASK-2026-0801-081-editor-version-summary-api

## 标题

沉淀编辑器版本差异和 Schema 摘要 API

## 状态

verified

## 目标

将 Vue3 editor playground 中的版本差异、版本 Schema 片段预览和版本摘要纯逻辑沉淀到 `@meumall/lowcode-editor`，为后续接 Java 配置平台版本 diff、回滚确认、审计展示和管理台迁移提供统一口径。

## 背景

当前 playground 已支持本地版本备注、筛选、差异详情和回滚，但 diff 逻辑仍在 `apps/editor-playground/src/App.vue`。上一任务已将发布检查和交付摘要沉到 editor 包，本任务继续把版本对比逻辑下沉，避免未来 Java 版本管理和不同 UI 壳重复实现不同 diff 口径。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 增加版本差异项 API。
- 在 `@meumall/lowcode-editor` 增加 Page Schema 摘要 API。
- 在 `@meumall/lowcode-editor` 增加版本 Schema 预览项 API。
- Vue3 editor playground 改为复用 editor 包 API。
- 补充 editor 单测覆盖版本差异、节点摘要、数据源和动作摘要。
- 更新 editor README 和项目事实源。

不包含：

- 不修改 Page Schema v1 字段。
- 不修改 localStorage release 存储结构。
- 不接入真实 Java 配置平台版本 diff。
- 不实现服务端审计、审批或回滚接口。
- 不新增 npm 版本和 changeset。

## 责任边界

当前仓库：

- `packages/editor` 提供框架无关版本摘要和 diff API。
- `apps/editor-playground` 只负责把 API 结果渲染为本地版本 UI。

外部系统：

- Java 配置平台后续可复用或对齐该 diff 口径，但本任务不实现 Java 服务端。
- `hybird-meumall` 不受本任务影响。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 `@meumall/lowcode-editor` 公开 API，但不改变既有 API。
- 契约文档路径：`packages/editor/README.md`。
- 是否向后兼容：是，新增导出。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是，更新 `packages/editor/README.md`。
- 需要确认的角色：无。
- 当前确认状态：本任务无需外部确认。

## 实现计划

1. 新增 editor 版本 diff、schema 摘要和 schema preview 类型及纯函数。
2. Vue3 playground 删除本地重复逻辑，调用 editor API。
3. 为 editor API 添加单元测试。
4. 更新 README 和 `.ai` 项目事实源。
5. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出版本差异 API。
- [x] `@meumall/lowcode-editor` 导出 Page Schema 摘要 API。
- [x] `@meumall/lowcode-editor` 导出版本 Schema 预览 API。
- [x] Vue3 editor playground 本地版本差异详情复用 editor API。
- [x] editor 单测覆盖标题、状态、环境、版本、节点数、数据源数、动作数差异。
- [x] editor 单测覆盖 Schema 摘要中的节点、数据源 id 和动作 id。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm check:architecture` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `pnpm pack:dry-run` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm check:architecture
pnpm smoke:browser
pnpm pack:dry-run
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否。
- 是否影响 npm 发布：新增 editor 包 API，未来真实 npm 发布时应作为 patch/minor 变更评估；本任务不执行发布。
- 回滚目标：回滚本任务提交。
- smoke check：本任务只改 editor core 和 playground 复用，可用 `pnpm smoke:browser` 验证本地版本差异详情仍可用。

## 风险和阻塞

- 当前 diff 是字段摘要级，不是完整 JSON Patch 或语义化节点树 diff。
- 后续真实 Java 版本管理可能还需要服务端审计字段、操作者、审批状态和更细节点级 diff。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 版本差异和 Schema 摘要 API。 |
| 2026-08-01 | in_progress | 开始沉淀 editor version summary API、改造 playground 复用并补充测试。 |
| 2026-08-01 | verified | 完成 editor version summary API、Vue3 playground 复用、editor 单测和文档事实源更新；`pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm check:architecture`、`pnpm smoke:browser`、`pnpm pack:dry-run` 均通过。 |
