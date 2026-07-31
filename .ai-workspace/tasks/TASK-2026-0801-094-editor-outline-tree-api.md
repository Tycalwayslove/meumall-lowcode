# TASK-2026-0801-094-editor-outline-tree-api

## 标题

沉淀编辑器结构树 API

## 状态

verified

## 目标

把 Vue3 编辑器 playground 中结构树的节点扁平化、搜索命中、折叠可见性、选中路径和可见数量摘要沉淀为 `@meumall/lowcode-editor` 的框架无关 API，让后续 Java 管理台或独立编辑器通过 npm 引入时可以复用同一套结构树导航模型。

## 背景

当前 Vue3 编辑器 playground 已支持结构树搜索、折叠、选中路径保持可见和画布定位，但核心算法仍写在 `apps/editor-playground/src/App.vue`。结构树是运营编辑器的核心导航能力，应将与 Vue 和 DOM 无关的树行模型、搜索和可见性计算下沉到 `packages/editor`，playground 只保留 UI 展示、点击交互、滚动画布和重命名输入。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增结构树行模型、节点扁平化、搜索文本、可见性计算、折叠节点裁剪和展开选中节点 helper。
- Vue3 编辑器 playground 改为消费 editor 包的结构树 API。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖结构树层级、搜索、折叠、选中路径和摘要。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变节点选择、拖拽、多选或重命名的 UI 行为。
- 不改变 Page Schema、Material Manifest 或 renderer。
- 不新增真实管理台权限、节点锁定、协作编辑或审计。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的结构树数据模型和可见性计算。
- `apps/editor-playground` 负责 UI 展示、结构树点击、重命名输入、拖拽、多选和滚动画布。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包的结构树 API。
- 节点权限、锁定、多人协作、审计和远程排序仍是外部系统或后续编辑器能力，本任务不实现。

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

1. 阅读 Vue3 编辑器结构树当前扁平化、搜索、折叠和选中路径逻辑。
2. 在 editor 包新增结构树类型和 helper。
3. 更新 editor 单测和 README。
4. 更新 editor interaction model 契约。
5. 将 Vue3 playground 改为消费 editor API，并保持现有交互不变。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出结构树行模型、扁平化、搜索文本、可见性、折叠裁剪和展开选中节点 helper。
- [x] helper 可按节点 id、componentName、meta.name、物料标题和物料分类进行关键词匹配。
- [x] helper 支持折叠祖先隐藏子节点，同时保持当前选中路径可见。
- [x] Vue3 编辑器 playground 的结构树 rows、搜索、折叠可见性和可见数量摘要复用 editor API。
- [x] 不修改 Page Schema、Material Manifest 或 renderer。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖结构树 API。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器结构树搜索、折叠、定位和重命名关键路径仍可用。

## 风险和阻塞

- 当前只处理本地 schema 节点结构，不处理真实管理台权限、锁定、多人协作和远程排序。
- 未来若结构树需要服务端权限或锁定状态，应通过可选字段或新增 helper 扩展，不应破坏现有 row 模型。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，54 个测试全部通过，包含 editor outline tree API 单测。
- `pnpm check:architecture`：通过，包结构、依赖方向、物料 manifest 对齐和 primitives 边界未破坏。
- `pnpm smoke:browser`：通过，Vue3 编辑器结构树搜索、折叠、定位和重命名关键路径仍可用。
- `pnpm pack:dry-run`：通过，8 个可发布包 dry-run 全部通过，包含 `@meumall/lowcode-editor`。

## 剩余风险

- 当前结构树 API 只抽象本地 schema 节点导航模型，真实管理台的节点权限、锁定、多人协作、审计和远程排序仍需后续单独设计。
- 本任务新增 `@meumall/lowcode-editor` 公开 API，但未执行真实 npm 发布；真实发布仍需 registry、access、token 和 changeset 版本确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包结构树 API 和 Vue3 playground 复用。 |
| 2026-08-01 | in_progress | 开始实现 editor 包结构树公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包结构树 API、Vue3 playground 复用、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
