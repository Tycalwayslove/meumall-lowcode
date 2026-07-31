# TASK-2026-0801-082-editor-template-summary-api

## 标题

沉淀编辑器模板摘要和预览 API

## 状态

verified

## 目标

将 Vue3 editor playground 中的模板卡片摘要、版本文案、标签截断和视觉预览元信息纯逻辑沉淀到 `@meumall/lowcode-editor`，为后续 Java 管理台、模板市场和 npm 包复用提供统一展示口径。

## 背景

当前 playground 已支持模板搜索、模板卡片摘要、视觉缩略预览、本地自定义模板和新建页面向导，但模板摘要与预览派生逻辑仍分散在 `apps/editor-playground/src/App.vue`。这类逻辑不依赖 Vue，也不属于 renderer，应作为 editor 包的框架无关 API 沉淀，避免后续管理台接入时复制 UI 内部实现。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 增加模板资源结构、模板预览元信息和模板列表项类型。
- 在 `@meumall/lowcode-editor` 增加模板预览、列表项、标签、版本和摘要格式化 API。
- Vue3 editor playground 改为复用 editor 包模板摘要 API。
- 补充 editor 单测覆盖模板预览派生、节点/数据源/动作统计、版本和摘要文案。
- 更新 editor README 和项目事实源。

不包含：

- 不修改 Page Schema v1 字段。
- 不修改 Template Library Client 协议。
- 不接入真实 Java 模板市场。
- 不新增服务端缩略图字段。
- 不新增 npm 版本和 changeset。

## 责任边界

当前仓库：

- `packages/editor` 提供框架无关模板摘要和预览派生 API。
- `apps/editor-playground` 只负责调用 API 并渲染模板 UI。

外部系统：

- Java 配置平台后续可返回独立缩略图或服务端摘要，但本任务不实现 Java 服务端。
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

1. 新增 editor 模板摘要、预览和格式化类型及纯函数。
2. Vue3 playground 删除本地重复逻辑，调用 editor API。
3. 为 editor API 添加单元测试。
4. 更新 README 和 `.ai` 项目事实源。
5. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出模板预览元信息 API。
- [x] `@meumall/lowcode-editor` 导出模板列表项和摘要格式化 API。
- [x] Vue3 editor playground 模板卡片和新建页面向导复用 editor API。
- [x] editor 单测覆盖图片、标题、副标题和节点数派生。
- [x] editor 单测覆盖标签截断、版本文案、节点/数据源/动作统计和摘要文案。
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
- smoke check：本任务只改 editor core 和 playground 复用，可用 `pnpm smoke:browser` 验证模板列表、模板预览和新建页面向导仍可用。

## 风险和阻塞

- 当前视觉预览仍从 schema 常见字段派生，未接服务端独立缩略图字段。
- 后续真实模板市场可能需要补充模板上下架、权限、审核、排序和服务端统计字段。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 模板摘要和预览 API。 |
| 2026-08-01 | in_progress | 开始沉淀 editor template summary API、改造 playground 复用并补充测试。 |
| 2026-08-01 | verified | 完成 editor template summary API、Vue3 playground 复用、editor 单测和文档事实源更新；`pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm check:architecture`、`pnpm smoke:browser`、`pnpm pack:dry-run` 均通过。 |
