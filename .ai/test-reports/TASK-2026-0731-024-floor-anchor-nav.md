# TASK-2026-0731-024-floor-anchor-nav 验证报告

## 验证对象

- React H5 renderer 节点 `data-lowcode-node-id` 标记。
- Vue H5 renderer 节点 `data-lowcode-node-id` 标记。
- React H5 `FloorAnchorNav` 物料。
- Vue H5 `FloorAnchorNav` 物料。
- Vue3 编辑器大促模板。
- React H5 runtime 示例。
- 物料 manifest 对齐测试。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
curl -I http://127.0.0.1:5173/
curl -I http://127.0.0.1:5174/
```

## 结果

### `pnpm typecheck`

结果：通过。

覆盖：

- monorepo TypeScript project references。
- Vue3 编辑器 playground 类型检查。
- React H5 runtime playground 类型检查。

### `pnpm build`

结果：通过。

覆盖：

- packages TypeScript 构建。
- Vue3 编辑器 playground 生产构建。
- React H5 runtime playground 生产构建。

### `pnpm test`

结果：通过。

统计：

- suites：4
- tests：22
- pass：22
- fail：0

新增覆盖：

- React/Vue H5 物料 manifest `componentName` 列表保持一致。
- `FloorAnchorNav` 已注册到 React H5 物料包。
- `FloorAnchorNav` manifest 默认吸顶配置、锚点项 setter 和 `onAnchorClick` 事件存在。

### dev server smoke check

结果：通过。

- `http://127.0.0.1:5173/`：HTTP 200。
- `http://127.0.0.1:5174/`：HTTP 200。

## 人工检查

- `packages/renderer-h5/src/index.tsx` 已为每个 React H5 schema 节点输出 `data-lowcode-node-id`。
- `packages/renderer-vue-h5/src/index.ts` 已为每个 Vue H5 schema 节点输出 `data-lowcode-node-id`，编辑态继续支持选中和拖拽。
- `packages/materials-h5/src/index.tsx` 已导出 React H5 `FloorAnchorNav`。
- `packages/materials-vue-h5/src/index.ts` 已导出 Vue H5 `FloorAnchorNav`。
- `apps/editor-playground/src/pageTemplates.ts` 的大促活动页已加入楼层锚点节点。
- `apps/h5-runtime-playground/src/App.tsx` 示例 schema 已加入楼层锚点节点，并绑定 mock tracking action。

## 风险

- renderer 新增包装层可能影响极端自定义 CSS；当前基础 H5 物料均为块级结构，风险可控。
- 当前楼层锚点仅负责点击滚动，暂未实现滚动高亮和吸附线。

## 结论

本任务已通过自动化验证和 smoke check，楼层锚点导航已进入 React/Vue H5 物料库、编辑器模板和 H5 runtime 示例链路。
