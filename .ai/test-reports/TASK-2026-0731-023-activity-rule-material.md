# TASK-2026-0731-023-activity-rule-material 验证报告

## 验证对象

- React H5 `ActivityRuleModal` 物料。
- Vue H5 `ActivityRuleModal` 物料。
- Vue3 编辑器物料库 manifest 自动注册。
- 页面模板和 React H5 runtime 示例。
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
- tests：21
- pass：21
- fail：0

新增覆盖：

- React/Vue H5 物料 manifest `componentName` 列表保持一致。
- `ActivityRuleModal` 已注册到 React H5 物料包。
- `ActivityRuleModal` manifest 默认按钮文案和 `onOpen` 事件存在。

### dev server smoke check

结果：通过。

- `http://127.0.0.1:5173/`：HTTP 200。
- `http://127.0.0.1:5174/`：HTTP 200。

## 人工检查

- `packages/materials-h5/src/index.tsx` 已导出 React H5 `ActivityRuleModal`。
- `packages/materials-vue-h5/src/index.ts` 已导出 Vue H5 `ActivityRuleModal`。
- `apps/editor-playground/src/pageTemplates.ts` 的大促活动页和新人券领取页已加入活动规则弹窗节点。
- `apps/h5-runtime-playground/src/App.tsx` 示例 schema 已加入活动规则弹窗节点，并绑定 mock tracking action。

## 风险

- 规则列表当前通过 JSON 文本维护，运营体验还不是最终形态。
- 弹窗样式为基础实现，后续接入正式管理系统和 H5 宿主时需要继续统一设计系统、埋点和风控。

## 结论

本任务已通过自动化验证和人工检查，活动规则弹窗物料已进入 React/Vue H5 物料库、编辑器模板和 H5 runtime 示例链路。
