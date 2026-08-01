# TASK-2026-0801-166 ProductList 基础组件复用增强

## 状态

- status: ready
- created_at: 2026-08-01 13:51:41 CST
- owner: AI Agent

## 背景

`ProductList` 是运营活动页和商品专题里最常见的商品承载物料之一，目前 React/Vue 两端实现仍包含原生 `button/img/div/strong/span` 组合与硬编码样式。随着基础组件层已经覆盖按钮、图片、文本、价格等能力，`ProductList` 应收敛到现有 primitives 组合，避免后续业务商品物料重复实现卡片结构、点击态、图片兜底与价格展示。

## 目标

在不改变 Page Schema 节点形态、不破坏 `items` 数据源槽和 `onProductClick` 事件的前提下，将 React/Vue `ProductList` 迁移为基础组件组合，并补齐常用样式配置能力。

## 范围

- React H5 `ProductList` 使用 `MlcButton`、`MlcImage`、`MlcText`、`MlcPrice` 组合渲染。
- Vue H5 `ProductList` 使用同名 primitives 组合渲染。
- 两端 manifest 对齐默认商品示例、数据源槽、事件与新增样式 props。
- 编辑器专题模板和 React H5 runtime 示例补充可配置样式 props。
- 测试覆盖 manifest 对齐、number/color setter、primitive 组合和注册契约。
- 文档与 AI 状态同步记录本次架构推进。

## 非范围

- 不新增新的 `MlcProductCard` primitive，避免过早公开商品卡片抽象。
- 不调整商品数据源协议，不改编辑器商品选择器交互。
- 不接入真实商品 Java API。
- 不改 npm 包发布策略和版本发布流水线。

## 验收标准

- React/Vue material manifests 均通过 schema 校验且 componentName 顺序保持一致。
- `ProductList.items` 数据源槽和 `onProductClick` 事件仍存在。
- `ProductList` 新增样式 props 可在属性面板通过 color/number setter 编辑。
- React/Vue `ProductList` 均复用已有 runtime primitives。
- 浏览器 smoke 能在编辑器或 H5 runtime 中识别 `.mlc-product-list`。
- `pnpm test` 通过。

## 验证记录

- 2026-08-01 13:58 CST：`pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- 2026-08-01 13:58 CST：`pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- 2026-08-01 13:59 CST：`pnpm test` 通过，覆盖 build、architecture check 和 106 个单测。
- 2026-08-01 14:01 CST：首次 `pnpm smoke:browser` 发现默认大促模板不包含普通 `ProductList`，已将断言收敛到 React H5 示例和 HTTP 数据源场景。
- 2026-08-01 14:02 CST：`pnpm smoke:browser` 通过，覆盖 React H5 示例商品列表和 HTTP 商品数据源注入后的 `.mlc-product-list__item`。
