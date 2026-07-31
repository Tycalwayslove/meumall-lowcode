# TASK-2026-0731-027-store-expert-material 验证报告

## 验证对象

- React H5 `StoreExpertSection` 物料。
- Vue H5 `StoreExpertSection` 物料。
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
- tests：24
- pass：24
- fail：0

新增覆盖：

- React/Vue H5 物料 manifest `componentName` 列表保持一致。
- `StoreExpertSection` 已注册到 React H5 物料包。
- `StoreExpertSection` manifest 标题、分类、默认角标、推荐列表 setter、data source slot 和 `onItemClick` 事件存在。

### dev server smoke check

结果：通过。

- `http://127.0.0.1:5173/`：HTTP 200。
- `http://127.0.0.1:5174/`：HTTP 200。

## 人工检查

- `packages/materials-h5/src/index.tsx` 已导出 React H5 `StoreExpertSection`。
- `packages/materials-vue-h5/src/index.ts` 已导出 Vue H5 `StoreExpertSection`。
- `apps/editor-playground/src/pageTemplates.ts` 的大促活动页已加入门店/达人推荐节点。
- `apps/h5-runtime-playground/src/App.tsx` 示例 schema 已加入门店/达人推荐节点，并绑定 mock 点击埋点 action。

## 风险

- 门店/达人列表当前通过 JSON 文本维护，后续需要接入真实门店/达人中心和专用选择器。
- 点击行为仍是 mock action，正式 H5 接入时需要跳转协议、登录、埋点和错误态处理。

## 结论

本任务已通过自动化验证和 smoke check，门店/达人推荐物料已进入 React/Vue H5 物料库、编辑器模板和 H5 runtime 示例链路。
