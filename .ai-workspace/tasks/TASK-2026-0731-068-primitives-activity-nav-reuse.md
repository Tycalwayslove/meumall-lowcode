# TASK-2026-0731-068-primitives-activity-nav-reuse

## 标题

推进活动与导航物料基础组件复用

## 状态

verified

## 目标

在不改变 Page Schema、Material Manifest 和 npm 公开 API 的前提下，继续推进 React/Vue H5 物料内部 runtime primitives 复用，迁移活动、优惠券和导航类物料中的 Button、Image、Tag、Text、Price 重复实现。

## 背景

前序任务已完成 `ActionButton`、`ImageBanner`、`SectionTitle`、`StickyActionBar`、`CouponBundle`、`ProductRankList`、`BrandFeatureSection`、`LiveEntry`、`StoreExpertSection` 的 primitives 复用迁移。当前剩余物料主要是 `FlashSaleList`、`ActivityRuleModal`、`CouponSection`、`NavGrid`、`FloorAnchorNav` 和 `CountdownTimer`。本任务继续收口这些物料的基础 UI 复用，为后续判断是否抽独立 primitives npm 包提供更充分的稳定性样本。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `.ai/`

## 范围

包含：

- 迁移 `FlashSaleList` 使用 Button/Image/Tag/Text/Price primitive。
- 迁移 `ActivityRuleModal` 使用 Button/Text primitive。
- 迁移 `CouponSection` 使用 Button/Text primitive。
- 迁移 `NavGrid` 使用 Button/Text primitive。
- 迁移 `FloorAnchorNav` 使用 Button/Text primitive。
- 迁移 `CountdownTimer` 使用 Tag/Text primitive。
- 保持 React/Vue 物料 manifest `componentName` 对齐。
- 补充测试断言，证明迁移物料组合了内部 primitives，且 primitives 仍不进入 material registry。
- 更新 README、任务记录和 `.ai` 项目事实源。

不包含：

- 不抽独立 npm primitives 包。
- 不改变 Page Schema v1。
- 不改变 Material Manifest v1。
- 不新增公开 npm API。
- 不接入真实 Java 配置平台、活动中心、优惠券中心或商品中心。

## 责任边界

当前仓库：

- 仅改造对应端 `materials-*` 包内部实现。
- 物料 manifest、默认 props、事件和 dataSourceSlots 保持既有语义。
- renderer 仍只消费 material registry，不依赖 primitives。

外部系统：

- Java 配置平台、业务后端、`hybird-meumall` 和小程序端无需变更。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无新增；遵循 `docs/material-layering-architecture.md`。
- 是否向后兼容：是。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 将任务状态流转为 `in_progress`。
2. 梳理 React/Vue 目标物料中的重复 Button/Image/Tag/Text/Price 代码。
3. 迁移目标物料复用内部 primitives，保持 props 行为和渲染语义不变。
4. 补充测试、README 和 AI 状态记录。
5. 运行验证命令并记录结果。

## 验收标准

- [x] React/Vue `FlashSaleList` 使用 Button/Image/Text/Price primitive。
- [x] React/Vue `ActivityRuleModal` 使用 Button/Text primitive。
- [x] React/Vue `CouponSection` 使用 Button/Text primitive。
- [x] React/Vue `NavGrid` 使用 Button/Text primitive。
- [x] React/Vue `FloorAnchorNav` 使用 Button/Text primitive。
- [x] React/Vue `CountdownTimer` 使用 Tag/Text primitive。
- [x] React/Vue material manifest `componentName` 列表仍保持一致。
- [x] Primitives 不出现在 `h5Materials` 或 `h5VueMaterials` material registry 中。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm smoke:browser
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：使用 `pnpm smoke:browser` 验证编辑器、内置 runtime 和 React H5 runtime。

## 风险和阻塞

- primitives API 仍是内部原型，不应被外部包依赖。
- `ActivityRuleModal` 包含弹窗状态和按钮交互，迁移时必须保持打开/关闭行为不变。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建任务，范围限定为活动、优惠券和导航物料内部 primitives 复用。 |
| 2026-07-31 | in_progress | 开始迁移活动、优惠券和导航物料复用内部 primitives。 |
| 2026-07-31 | verified | React/Vue 目标物料已复用内部 primitives，并通过 `pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm smoke:browser` 验证。 |
