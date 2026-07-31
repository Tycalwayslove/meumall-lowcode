# TASK-2026-0731-007-h5-material-parity-canvas-actions

## 状态

verified

## 目标

补齐 React H5 物料与 Vue H5 物料的基础一致性，并增强 Vue3 编辑器画布选中节点后的直接操作能力，让运营搭页面时可以更自然地插入、移动、复制和删除模块。

## 背景

当前 Vue3 playground 已经可以使用 `SectionContainer` 容器物料并生成嵌套 schema，但 React H5 物料包尚未提供同名物料。未来 `hybird-meumall` 作为 H5 消费方引入 React H5 renderer/materials 时，包含容器的页面会出现缺失物料。另一方面，编辑器虽然有结构面板和属性面板，但运营在画布中选中节点后还缺少直接插入前后物料、移动同级位置和快速删除的上下文操作。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `apps/editor-playground`
- `@meumall/lowcode-editor`
- H5 runtime mock

## 范围

包含：

- React H5 物料包新增 `SectionContainer`，manifest 与 Vue 物料保持同名和同基础字段。
- Vue3 编辑器新增画布选中节点上下文工具条。
- 支持在选中节点前后插入指定物料。
- 支持选中容器时将指定物料加入容器。
- 修正选中节点上移/下移，使嵌套节点也能按同级移动。
- 更新任务、项目状态和验证记录。

不包含：

- 容器内自由网格布局。
- 鼠标拖拽到画布精确插入线。
- 新增 schema 字段或破坏性 schema 变更。
- 真实 Java 配置平台对接。

## 责任边界

当前仓库：

- 保持 React H5 和 Vue H5 基础物料可渲染同一份核心 schema。
- 提供 Vue3 编辑器 playground 的实操交互参考。

外部系统：

- `hybird-meumall` 后续负责在业务 H5 工程中引入 React H5 renderer/materials。
- Java 配置平台后续负责真实存储和发布。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增向后兼容物料能力。
- 契约文档路径：`packages/materials-h5/src/index.tsx`、`packages/materials-vue-h5/src/index.ts`
- 是否向后兼容：是，新增物料，不改变已有 schema 字段。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：H5 接入方。
- 当前确认状态：本地 mock 验证。

## 实现计划

1. 在任务记录中确认范围并流转到 `in_progress`。
2. 补齐 React H5 `SectionContainer` 物料。
3. 增强 Vue3 编辑器上下文工具条和嵌套节点移动。
4. 更新项目状态、TODO 和验证报告。
5. 运行类型检查、构建和本地 smoke check。

## 验收标准

- [x] React H5 物料包包含 `SectionContainer`。
- [x] `SectionContainer` manifest 与 Vue 同名，基础字段包括标题、说明、背景色、内边距和圆角。
- [x] 编辑器选中节点后可以在前方插入物料。
- [x] 编辑器选中节点后可以在后方插入物料。
- [x] 选中容器时可以通过画布工具条向容器内添加物料。
- [x] 嵌套节点可以按同级上移/下移。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] 本地 dev server smoke check 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
curl -I http://localhost:5173/
curl -I "http://localhost:5173/?runtime=1&pageId=summer-campaign-demo"
pnpm --filter @meumall/lowcode-materials-h5 exec npm pack --dry-run
```

## 发布影响

- 是否需要发布：当前不发布；后续 npm 发布时 `@meumall/lowcode-materials-h5` 需要随包发布。
- 发布对象：无。
- 是否需要 changeset：当前不需要。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：编辑器入口和 runtime 入口均可访问，类型检查和构建通过。

## 验证结果

2026-07-31：

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `curl -I http://localhost:5173/` 返回 `HTTP/1.1 200 OK`。
- `curl -I "http://localhost:5173/?runtime=1&pageId=summer-campaign-demo"` 返回 `HTTP/1.1 200 OK`。
- `pnpm --filter @meumall/lowcode-materials-h5 exec npm pack --dry-run` 通过，tarball 包含 `dist/index.js` 和类型声明。
- 验证报告：`.ai/test-reports/TASK-2026-0731-007-h5-material-parity-canvas-actions.md`

## 风险和阻塞

- React H5 和 Vue H5 物料仍未做到完整视觉一致，仅补齐基础渲染能力。
- 画布插入仍是上下文按钮方式，不是最终生产级精确拖拽插入线。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确 H5 物料对齐和画布上下文操作任务。 |
| 2026-07-31 | in_progress | 开始补齐 React H5 容器物料和 Vue3 编辑器画布上下文操作。 |
| 2026-07-31 | verified | 类型检查、构建、H5 物料 dry-run 和本地 smoke check 通过。 |
