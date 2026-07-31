# TASK-2026-0731-067-primitives-content-commerce-reuse

## 标题

推进内容与门店物料基础组件复用

## 状态

verified

## 目标

在不改变 schema、manifest 和 npm 公开 API 的前提下，继续推进 React/Vue H5 物料内部 runtime primitives 复用，迁移内容展示、直播入口和门店/达人推荐物料中的 Button、Image、Tag、Text、Price 重复实现。

## 背景

`TASK-2026-0731-066-primitives-business-material-reuse` 已完成 `StickyActionBar`、`CouponBundle`、`ProductRankList` 的 React/Vue primitives 复用迁移。当前剩余缺口集中在 `BrandFeatureSection`、`LiveEntry`、`StoreExpertSection`、`FlashSaleList`、`ActivityRuleModal`、`CouponSection` 等物料。本任务继续选择编辑器模板和 smoke check 已覆盖的内容/门店类物料，扩大 primitives 复用面，同时继续验证内部 API 是否稳定。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `.ai/`

## 范围

包含：

- 迁移 `BrandFeatureSection` 使用 Button/Image/Tag/Text/Price primitive。
- 迁移 `LiveEntry` 使用 Button/Image/Tag/Text primitive。
- 迁移 `StoreExpertSection` 使用 Button/Image/Tag/Text primitive。
- 保持 React/Vue 物料 manifest `componentName` 对齐。
- 补充测试断言，证明迁移物料组合了内部 primitives，且 primitives 仍不进入 material registry。
- 更新 README、任务记录和 `.ai` 项目事实源。

不包含：

- 不抽独立 npm primitives 包。
- 不改变 Page Schema v1。
- 不改变 Material Manifest v1。
- 不新增公开 npm API。
- 不改造 `FlashSaleList`、`ActivityRuleModal`、`CouponSection`。
- 不接入真实 Java 配置平台、素材中心、商品中心、直播中心或门店中心。

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
2. 梳理 React/Vue `BrandFeatureSection`、`LiveEntry`、`StoreExpertSection` 中的重复基础 UI。
3. 迁移目标物料复用内部 primitives，保持 props 行为和渲染语义不变。
4. 补充测试、README 和 AI 状态记录。
5. 运行验证命令并记录结果。

## 验收标准

- [x] React `BrandFeatureSection` 使用 Button/Image/Tag/Text/Price primitive。
- [x] Vue `BrandFeatureSection` 使用 Button/Image/Tag/Text/Price primitive。
- [x] React `LiveEntry` 使用 Button/Image/Tag/Text primitive。
- [x] Vue `LiveEntry` 使用 Button/Image/Tag/Text primitive。
- [x] React `StoreExpertSection` 使用 Button/Image/Tag/Text primitive。
- [x] Vue `StoreExpertSection` 使用 Button/Image/Tag/Text primitive。
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
- 目标物料图片、按钮和列表元素较多，迁移时必须保持原有运营配置字段和 fallback 行为。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建任务，范围限定为内容/直播/门店物料内部 primitives 复用。 |
| 2026-07-31 | in_progress | 开始迁移 `BrandFeatureSection`、`LiveEntry`、`StoreExpertSection` 复用内部 primitives。 |
| 2026-07-31 | verified | 完成 React/Vue 内容、直播和门店物料 primitives 复用迁移和验证。 |

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，36 个测试全部通过。
- `pnpm smoke:browser`：通过，Vue3 编辑器、编辑器内置 runtime 和 React H5 runtime 均正常渲染。
- `git diff --check`：通过。

## 实现摘要

- React/Vue `BrandFeatureSection` 已复用 `MlcButton`、`MlcImage`、`MlcTag`、`MlcText` 和 `MlcPrice`。
- React/Vue `LiveEntry` 已复用 `MlcButton`、`MlcImage`、`MlcTag` 和 `MlcText`。
- React/Vue `StoreExpertSection` 已复用 `MlcButton`、`MlcImage`、`MlcTag` 和 `MlcText`。
- materials 测试扩展业务物料 primitive composition 断言，覆盖本轮迁移目标。
- 本任务不改变 Page Schema v1、Material Manifest v1、npm 包名或公开接入方式。

## 后续建议

- 继续迁移 `FlashSaleList`、`ActivityRuleModal`、`CouponSection`、`NavGrid`、`FloorAnchorNav`、`CountdownTimer` 等剩余物料中的重复基础 UI。
- 更多物料复用稳定后，再评估是否把内部 primitives 抽为独立 npm 包。
