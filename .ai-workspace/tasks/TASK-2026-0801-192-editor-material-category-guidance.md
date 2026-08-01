# TASK-2026-0801-192-editor-material-category-guidance

## 状态

verified

## 目标

增强 Vue3 编辑器物料目录的分类理解能力，让运营在选择物料时可以看到分类说明、分类数量和当前筛选摘要；同时把分类摘要逻辑沉淀到 `@meumall/lowcode-editor`，方便后续管理台迁移复用。

## 背景

当前编辑器物料目录已经支持搜索、分类筛选、收藏、最近使用和物料详情，但分类筛选只展示原始 `manifest.category` 字符串。随着基础物料、布局容器、内容物料和业务物料持续增加，运营很容易只看到一堆名称，难以判断应该优先使用基础通用物料、布局容器还是业务物料。本任务不新增业务物料，而是增强物料目录的信息架构，让“架构边界”在编辑器体验里可见。

## 涉及包或系统

- `@meumall/lowcode-editor`
- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai-workspace`
- `.ai`
- npm / GitHub

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增物料分类元信息和分类摘要 API。
- 统计全部物料、当前分类物料数量、当前可见物料数量，并输出适合 UI 展示的分类说明。
- Vue3 编辑器物料目录展示当前分类说明、数量摘要和各分类数量。
- browser smoke 覆盖物料目录分类说明和切换后的数量摘要。
- 更新单测、changeset、任务记录和项目记忆。

不包含：

- 不修改 Page Schema v1。
- 不修改 Material Manifest v1 字段结构。
- 不新增业务物料或运行时物料。
- 不接真实权限、模板市场、素材中心、商品中心或 Java 配置平台。
- 不重做物料目录整体视觉设计、拖拽协议、收藏持久化或物料详情弹窗。

## 责任边界

当前仓库：

- 提供框架无关分类摘要模型和 Vue3 编辑器 playground 展示。

外部系统：

- Java 管理台后续迁移时可消费 `@meumall/lowcode-editor` 的分类摘要 API，但真实权限、用户偏好、服务端物料上下架仍由 Java 管理台或配置平台承接。

## 契约影响

- 是否影响跨包或跨系统契约：影响 `@meumall/lowcode-editor` 公开 API。
- 契约文档路径：`packages/editor/README.md`、`.ai-workspace/contracts/material-manifest-v1.md`
- 是否向后兼容：是。新增 editor helper，不改变旧 schema、manifest 或 runtime。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要，写入 editor README 和项目记忆。
- 对接说明路径：`packages/editor/README.md`、`.ai/AI_CONTEXT.md`、`.ai/PROJECT_STATE.md`
- 需要确认的角色：未来 Java 管理台接入方。
- 当前确认状态：无需阻塞。

## 实现计划

1. 新增 `createLowcodeMaterialCategorySummaries`、`createLowcodeMaterialCatalogOverview` 等 editor helper。
2. Vue3 物料目录展示分类说明、数量摘要和分类计数。
3. 补充单测、browser smoke、changeset、README 和记忆。

## 验收标准

- [x] `@meumall/lowcode-editor` 可从物料 manifest 列表生成分类摘要和目录总览。
- [x] Vue3 编辑器物料目录展示当前分类说明、当前筛选数量、全部物料数量和分类数量。
- [x] 分类摘要不改变 Page Schema、Material Manifest 或 runtime 渲染协议。
- [x] browser smoke 覆盖默认“全部”分类说明和切换到 `basic` 分类后的摘要。
- [x] 文档和项目记忆记录该能力的边界与迁移用途。

## 实现结果

- `@meumall/lowcode-editor` 新增 `LOWCODE_EDITOR_MATERIAL_CATEGORY_META`、`getLowcodeMaterialCategoryMeta`、`createLowcodeMaterialCategorySummaries` 和 `createLowcodeMaterialCatalogOverview`。
- `createLowcodeMaterialCatalogItem` 增加分类中文标签和说明，并把分类中文标签纳入搜索索引；分类说明正文不进入物料搜索，避免关键词过宽。
- Vue3 编辑器物料目录展示当前分类说明、当前命中数量、全部物料数量和分类选项数量。
- browser smoke 覆盖默认“全部物料”说明、切换 `basic` 后的“基础物料”说明和分类过滤结果。
- editor README、changeset、项目记忆和任务状态已同步。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
pnpm pack:dry-run
git diff --check
```

## 验证记录

- 2026-08-01：`pnpm typecheck` 通过。
- 2026-08-01：`pnpm test` 通过，143 条测试全部通过，并包含 architecture check。
- 2026-08-01：`pnpm smoke:browser` 通过，覆盖物料分类说明和 `basic` 分类切换摘要。
- 2026-08-01：`pnpm pack:dry-run` 通过，12 个可发布包内容预检通过。
- 2026-08-01：`git diff --check` 通过。

## 发布影响

- 是否需要发布：需要，后续统一 npm 发布。
- 发布对象：`@meumall/lowcode-editor`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不单独创建 tag/release，后续发布窗口统一处理。
- 回滚目标：回滚本次 editor helper 和 Vue3 playground 展示变更。
- smoke check：通过 `pnpm smoke:browser` 验证物料目录摘要展示。

## 风险和阻塞

- 分类说明只基于 manifest category 和本地内置文案，不代表真实管理台权限、上架状态或业务归属。
- Java 管理台真实物料市场可能需要后续把分类文案改为服务端配置，本任务只提供本地 helper 和默认文案。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | verified | 完成 editor 物料分类摘要 API、Vue3 物料目录展示、测试、smoke、pack dry-run 和记忆更新。 |
| 2026-08-01 | ready | 创建物料目录分类说明任务，确认可进入实现。 |
