# TASK-2026-0731-043 商品榜单物料

## 状态

verified

## 目标

新增 H5 运营活动页常用的商品榜单物料，让运营人员可以在 Vue3 编辑器中配置热卖榜、新品榜、达人推荐榜等榜单模块，并在 React H5 runtime 中渲染和触发商品点击事件。

## 背景

当前物料库已有商品列表、秒杀商品组、组合券包、门店/达人推荐和直播入口，但缺少榜单类模块。电商活动页常通过榜单强化“热卖、趋势、口碑、达人推荐”等运营心智，是活动页和专题页的基础高频物料。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `.ai/PROJECT_STATE.md`
- `.ai/AI_CONTEXT.md`
- `.ai/TODO.md`

## 范围

- React H5 物料包新增 `ProductRankList` 组件和 manifest。
- Vue H5 物料包新增同名 `ProductRankList` 组件和 manifest。
- Vue3 编辑器商品选择器支持 `ProductRankList` 静态商品配置和恢复绑定 `products` 数据源。
- 大促活动模板接入榜单节点。
- React H5 runtime 示例接入榜单节点和商品点击 action。
- 补充物料 manifest 对齐测试和 browser smoke check。
- 更新物料包 README 和 AI 状态文档。

## 不包含

- 不新增真实榜单接口或榜单数据源类型。
- 不修改 Page Schema 或 Material Manifest v1 契约。
- 不实现小程序榜单物料。
- 不接入真实库存、价格或销量排行服务。

## 责任边界

- materials 包负责静态可配置 UI、`items` 数据槽和 `onProductClick` 事件定义。
- editor playground 负责展示和编辑 manifest 暴露的 props，并复用现有商品选择器。
- React H5 runtime playground 负责验证 H5 消费 schema、dataBinding 和事件执行链路。
- 真实榜单数据后续通过 data source resolver 或 Java 配置平台模板市场接入。

## 契约影响

- 新增 `ProductRankList` 物料 manifest，属于向后兼容的物料能力扩展。
- 不改变已有 schema 字段和 renderer API。
- 不需要迁移旧页面；未使用该物料的页面不受影响。

## 对接说明

当前 `ProductRankList.items` 复用商品数组结构，并接受 `product.byIds` / `product.byActivity` 数据源。后续接真实榜单中心时，可以新增或复用 Java 配置平台返回的商品列表数据。

## 验收标准

- React/Vue H5 物料包都注册 `ProductRankList`，componentName 和 manifest 对齐。
- `ProductRankList` manifest 包含榜单标题、说明、角标、颜色、商品数据和 `onProductClick` 事件。
- Vue3 编辑器商品选择器支持给 `ProductRankList` 写入静态商品或绑定 `products` 数据源。
- 大促活动模板包含榜单节点。
- React H5 runtime 示例包含榜单节点和动作配置。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过。
- `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm smoke:browser
```

## 实现记录

- 新增 React H5 `ProductRankList` 物料，支持榜单标题、说明、角标、排名样式、展示数量、商品数据和 `onProductClick`。
- 新增 Vue H5 同名物料，并保持 manifest componentName、dataSourceSlots、propsSchema 和事件名与 React 对齐。
- Vue3 编辑器商品选择器、商品空态发布检查和属性快捷操作已支持 `ProductRankList`。
- 大促活动模板与 React H5 runtime 示例已接入商品榜单节点，runtime 示例新增 `rank_product_click` 埋点 action。
- browser smoke 已覆盖编辑器物料列表、默认大促模板、编辑器内置 runtime 和 React H5 runtime 的商品榜单渲染。

## 验证记录

- 2026-07-31：`pnpm typecheck` 通过。
- 2026-07-31：`pnpm build` 通过。
- 2026-07-31：`pnpm test` 通过，30 个测试全部通过。
- 2026-07-31：`pnpm smoke:browser` 通过。

## 发布影响

- 暂不发布 npm。
- 后续发布时属于 `@meumall/lowcode-materials-h5` 和 `@meumall/lowcode-materials-vue-h5` 的 minor 能力扩展。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可。

## 风险和阻塞

- 当前榜单数据仍为静态商品或 mock products 数据源，不代表真实销量排行。
- 真实榜单口径、排序规则、库存价格和个性化推荐需要后续接入 Java 或数据中心。

## 变更记录

- 2026-07-31：创建 ready 工作项。
- 2026-07-31：进入实现，补充商品榜单物料。
- 2026-07-31：实现完成并通过验证，状态更新为 verified。
