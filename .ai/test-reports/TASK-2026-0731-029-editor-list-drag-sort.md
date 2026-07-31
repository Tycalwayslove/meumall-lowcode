# TASK-2026-0731-029-editor-list-drag-sort 验证报告

## 验证对象

- Vue3 编辑器属性面板数组列表项拖拽排序。
- 拖拽中和目标项视觉状态。
- 原有列表项按钮排序、复制、删除和 JSON 高级编辑能力。

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
- tests：24
- pass：24
- fail：0

### dev server smoke check

结果：通过。

- `http://127.0.0.1:5173/`：HTTP 200。
- `http://127.0.0.1:5174/`：HTTP 200。

## 人工检查

- `apps/editor-playground/src/App.vue` 已为数组列表项接入 `draggable`、`dragstart`、`dragover`、`drop` 和 `dragend`。
- drop 后通过 `reorderListItem` 重排当前节点 props 数组。
- 列表项仍保留上移、下移、复制、删除和 JSON 高级编辑。
- `apps/editor-playground/src/styles.css` 已补充拖拽中、目标项和拖拽手柄样式。

## 风险

- 当前拖拽排序使用 HTML5 drag/drop，移动端触摸拖拽仍需后续 Pointer Events 专项处理。
- 当前只支持同一个数组属性内部排序，不支持跨列表拖动。

## 结论

本任务已通过自动化验证和 smoke check，Vue3 编辑器数组属性列表项支持更自然的拖拽排序。
