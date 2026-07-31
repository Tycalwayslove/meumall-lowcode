# TASK-2026-0731-032-editor-pointer-drag 验证报告

## 验证对象

- Vue3 编辑器 playground 触屏 Pointer Events 拖拽入口。
- HTML5 drag/drop 与 Pointer Events 共用的画布 drop hint 计算。
- 物料触屏投放、结构树节点触屏移动和画布节点触屏移动的代码路径。
- 触屏拖拽后的点击抑制逻辑。

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
- tests：26
- pass：26
- fail：0

### dev server smoke check

结果：通过。

- `http://127.0.0.1:5173/`：HTTP 200。
- `http://127.0.0.1:5174/`：HTTP 200。

## 人工代码路径检查

- 物料按钮新增 `pointerdown` 入口，触屏或手写笔移动超过 8px 后进入拖拽状态。
- 结构树节点新增 `pointerdown` 入口，触屏拖拽后复用 `moveCanvasNode`。
- H5 画布 `phone-frame` 新增 `pointerdown` 入口，可命中 `.mlc-runtime-node[data-lowcode-node-id]` 并移动节点。
- Pointer Events 和 HTML5 drag/drop 共用 `updateCanvasDropHintAtPoint`、`insertMaterialByDropHint` 和 `moveCanvasNode`，避免两套投放规则分叉。
- 桌面端 HTML5 drag/drop 入口仍保留 `dragstart`、`dragover`、`drop` 和 `dragend`。
- 触屏拖拽完成后会抑制紧随其后的 click，避免拖入物料后额外追加一次。

## 未覆盖项

- 当前未引入 Playwright 移动端触屏拖拽自动化；正式管理台迁入前建议补浏览器级交互测试。

## 风险

- 不同移动浏览器对 Pointer Events、pointer capture 和 long press 的细节可能存在差异，需要在真实设备上做补充验证。

## 结论

本任务已通过类型检查、构建、测试和 dev server smoke check。Vue3 编辑器 playground 已具备触屏 Pointer Events 物料投放和节点移动路径，桌面 HTML5 drag/drop 路径保持可用。
