# TASK-2026-0731-028-editor-list-prop-editor 验证报告

## 验证对象

- Vue3 编辑器属性面板数组属性编辑器。
- `array` + `textarea` 物料属性的可视化列表项编辑。
- JSON 高级编辑兜底。

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

- `apps/editor-playground/src/App.vue` 已为 `array` + `textarea` 属性增加列表项编辑器。
- 列表项支持新增、删除、复制、上移和下移。
- 常见字段可直接输入并写回当前节点 props。
- 列表属性仍保留 JSON 高级编辑入口，复杂结构可以继续手动编辑。
- `apps/editor-playground/src/styles.css` 已补充列表编辑器样式，适配右侧属性栏。

## 风险

- 当前列表项编辑器只覆盖一层对象数组，复杂嵌套结构仍需使用 JSON 高级编辑。
- 字段模板基于常见运营物料字段，后续可在 Material Manifest 中扩展更精确的 item schema。

## 结论

本任务已通过自动化验证和 smoke check，Vue3 编辑器对优惠券、规则、导航项、门店/达人推荐等数组属性具备更可实操的表单化编辑能力。
