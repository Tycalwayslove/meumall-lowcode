# TASK-2026-0801-092-editor-material-catalog-api

## 标题

沉淀编辑器物料目录 API

## 状态

verified

## 目标

把 Vue3 编辑器 playground 中物料库的分类、搜索、摘要和按 `componentName` 取物料逻辑沉淀为 `@meumall/lowcode-editor` 的框架无关 API，让后续 Java 管理台或独立编辑器通过 npm 引入时可以复用同一套物料目录展示口径，而不是在 UI 壳里复制过滤规则。

## 背景

当前 Vue3 编辑器 playground 已具备物料搜索、分类过滤、收藏和最近使用，但物料分类、关键词匹配、卡片摘要仍主要写在 `apps/editor-playground/src/App.vue`。物料库是运营编辑器的核心入口，应将与 UI 框架无关的 manifest 列表处理能力迁回 `packages/editor`，playground 只负责展示和交互。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增物料目录 list item、分类、搜索过滤、按 componentName 取物料和摘要格式化 helper。
- Vue3 编辑器 playground 改为消费 editor 包的物料目录 API。
- 物料卡片补充统一摘要文本，帮助运营判断配置项、事件和数据槽规模。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖物料目录 API。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不新增或修改 Material Manifest 字段。
- 不新增物料实现。
- 不修改 renderer。
- 不接入真实 Java 物料市场、权限、上下架或审核。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的物料目录筛选和摘要模型。
- `apps/editor-playground` 负责 UI 展示、收藏、最近使用和添加物料交互。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包的物料目录 API。
- Java 物料市场、权限、上下架和审核仍是外部系统，本任务不实现。

## 契约影响

- 是否影响跨包或跨系统契约：是，`@meumall/lowcode-editor` 新增向后兼容的公开 API。
- 契约文档路径：`.ai-workspace/contracts/editor-interaction-model-v1.md`、`packages/editor/README.md`。
- 是否向后兼容：是，新增导出，不修改旧 API 语义。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/editor/README.md`。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 阅读 Vue3 编辑器物料库当前搜索、分类、收藏和最近使用逻辑。
2. 在 editor 包新增物料目录类型和 helper。
3. 更新 editor 单测和 README。
4. 更新 editor interaction model 契约。
5. 将 Vue3 playground 改为消费 editor API，并在物料卡片展示统一摘要。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出物料目录 list item、分类、过滤、按 componentName 取物料和摘要 helper。
- [x] helper 可按 title、componentName、category、platform 和版本进行关键词匹配。
- [x] Vue3 编辑器 playground 的物料分类、搜索、收藏和最近使用取物料逻辑复用 editor API。
- [x] 物料卡片展示统一摘要文本。
- [x] 不修改 Material Manifest、Page Schema 或 renderer。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖物料目录 API。
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

- 是否需要发布：否，本任务只提交源码和文档；未来真实 npm 发布时作为 `@meumall/lowcode-editor` 向后兼容 minor 能力评估。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否。
- 是否影响 npm 发布：新增 editor 包公开 API，`pnpm pack:dry-run` 需要通过。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器物料搜索、详情和添加流程仍可用。

## 风险和阻塞

- 当前只处理本地 manifest 列表，不处理真实物料市场权限、上下架、审核、灰度和远程排序。
- 未来若 Java 物料市场返回服务端排序或标签字段，应通过 adapter 或新增可选参数扩展，不应破坏现有 helper。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包物料目录 API 和 Vue3 playground 复用。 |
| 2026-08-01 | in_progress | 开始实现 editor 包物料目录公开 API、Vue3 playground 复用、物料卡片摘要、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包物料目录 API、Vue3 playground 复用、物料卡片摘要、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
