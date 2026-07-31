# TASK-2026-0731-045 品牌专题物料

## 状态

verified

## 目标

新增 H5 运营活动页常用的品牌专题物料，让运营人员可以在 Vue3 编辑器中配置品牌故事、主视觉、卖点标签、商品入口和跳转动作，并在 React H5 runtime 中渲染验证。

## 背景

当前物料库已覆盖商品列表、商品榜单、秒杀、券、规则、楼层导航、直播入口和门店/达人推荐，但缺少品牌/主题导购型模块。品牌专题常用于平台大促、品牌联合活动、品类上新和会员推广，是运营搭建页面的高频基础能力。

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

- React H5 物料包新增 `BrandFeatureSection` 组件和 manifest。
- Vue H5 物料包新增同名 `BrandFeatureSection` 组件和 manifest。
- 品牌专题物料支持品牌名、标题、说明、角标、封面图、Logo、行动按钮、卖点列表、商品数据和点击事件。
- 大促活动模板接入品牌专题节点，并加入楼层锚点。
- React H5 runtime 示例接入品牌专题节点和点击 action。
- 补充物料 manifest 对齐测试和 browser smoke check。
- 更新物料包 README 和 AI 状态文档。

## 不包含

- 不新增真实品牌中心、品牌活动接口或品牌数据源类型。
- 不修改 Page Schema 或 Material Manifest v1 契约。
- 不实现小程序品牌专题物料。
- 不接入真实会员权益、库存、价格或品牌馆服务。

## 责任边界

- materials 包负责静态可配置 UI、`items` 商品数据槽和事件定义。
- editor playground 负责通过现有属性编辑、素材选择器和商品选择器编辑该物料。
- React H5 runtime playground 负责验证 H5 消费 schema、dataBinding 和事件执行链路。
- 真实品牌中心后续通过 Resource Library Client、Template Library Client 或 Java 配置平台接入。

## 契约影响

- 新增 `BrandFeatureSection` 物料 manifest，属于向后兼容的物料能力扩展。
- 不改变已有 schema 字段和 renderer API。
- 不需要迁移旧页面；未使用该物料的页面不受影响。

## 对接说明

当前 `BrandFeatureSection.items` 复用商品数组结构，并接受 `product.byIds` / `product.byActivity` 数据源。品牌基础信息暂由 props 配置，后续可接品牌中心资源或模板市场配置。

## 验收标准

- React/Vue H5 物料包都注册 `BrandFeatureSection`，componentName 和 manifest 对齐。
- `BrandFeatureSection` manifest 包含品牌名、标题、说明、图片、Logo、卖点、商品数据、跳转链接和点击事件。
- Vue3 编辑器商品选择器支持给 `BrandFeatureSection` 写入静态商品或绑定 `products` 数据源。
- 大促活动模板包含品牌专题节点。
- React H5 runtime 示例包含品牌专题节点和动作配置。
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

- 新增 React H5 `BrandFeatureSection` 物料，支持品牌名、标题、说明、角标、封面图、Logo、行动按钮、卖点列表、商品数据和点击事件。
- 新增 Vue H5 同名物料，并保持 manifest componentName、dataSourceSlots、propsSchema 和事件名与 React 对齐。
- Vue3 编辑器商品选择器、商品空态发布检查、默认数据源绑定和属性快捷操作已支持 `BrandFeatureSection`。
- 大促活动模板与 React H5 runtime 示例已接入品牌专题节点，并新增品牌进入和品牌商品点击埋点 action。
- browser smoke 已覆盖编辑器物料列表、命令面板添加品牌专题、默认大促模板、编辑器内置 runtime 和 React H5 runtime 的品牌专题渲染。

## 验证记录

- 2026-07-31：`pnpm typecheck` 通过。
- 2026-07-31：`pnpm build` 通过。
- 2026-07-31：`pnpm test` 通过，31 个测试全部通过。
- 2026-07-31：`pnpm smoke:browser` 通过。

## 发布影响

- 暂不发布 npm。
- 后续发布时属于 `@meumall/lowcode-materials-h5` 和 `@meumall/lowcode-materials-vue-h5` 的 minor 能力扩展。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可。

## 风险和阻塞

- 当前品牌信息仍为静态 props，不代表真实品牌中心配置。
- 真实品牌馆、会员权益、商品推荐和跳转口径需要后续接入 Java 或资源中心。

## 变更记录

- 2026-07-31：创建 ready 工作项。
- 2026-07-31：进入实现，补充品牌专题物料。
- 2026-07-31：实现完成并通过验证，状态更新为 verified。
