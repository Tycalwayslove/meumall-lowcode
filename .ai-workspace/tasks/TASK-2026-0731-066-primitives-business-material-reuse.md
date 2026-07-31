# TASK-2026-0731-066-primitives-business-material-reuse

## 标题

推进业务物料基础组件复用

## 状态

verified

## 目标

在不改变 schema、manifest 和 npm 包公开边界的前提下，继续按 `docs/material-layering-architecture.md` Phase 1 推进 React/Vue H5 物料内部 runtime primitives 复用，优先迁移按钮、图片、标签和价格重复实现明显的业务物料。

## 背景

`TASK-2026-0731-065-internal-primitives-prototype` 已在 `materials-h5` 和 `materials-vue-h5` 内部建立 `MlcButton`、`MlcImage`、`MlcTag`、`MlcText`、`MlcPrice` 和 `h5Tokens` 原型，并改造 `ActionButton`、`ImageBanner`、`SectionTitle`。当前已知缺口是业务物料仍存在重复实现，需要继续迁移以验证 primitives API 是否稳定，后续再评估是否抽独立 npm 包。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `.ai/`

## 范围

包含：

- 迁移 `StickyActionBar` 使用 Button/Text primitive。
- 迁移 `CouponBundle` 使用 Button/Tag/Text/Price primitive。
- 迁移至少一个商品或内容类业务物料中的 Image/Text/Tag/Price 重复实现。
- 保持 React/Vue 物料 manifest `componentName` 对齐。
- 补充测试或断言，确保 primitives 仍不进入 material registry。
- 更新任务记录、项目状态和待办。

不包含：

- 不抽独立 npm primitives 包。
- 不改变 Page Schema v1。
- 不改变 Material Manifest v1。
- 不新增公开 npm API。
- 不改造所有业务物料。
- 不接入真实 Java 配置平台或业务接口。

## 责任边界

当前仓库：

- 仅在对应端 `materials-*` 包内部复用 primitives。
- 物料仍负责 manifest、默认 props、事件和数据源槽位。
- renderer 仍只消费 material registry。

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
2. 梳理 React/Vue 目标业务物料中的重复 Button/Image/Tag/Text/Price 代码。
3. 迁移目标物料使用内部 primitives，保持渲染语义和 props 行为不变。
4. 补充测试、文档和 AI 状态记录。
5. 运行验证命令并记录结果。

## 验收标准

- [x] React `StickyActionBar` 使用 Button/Text primitive。
- [x] Vue `StickyActionBar` 使用 Button/Text primitive。
- [x] React `CouponBundle` 使用 Button/Tag/Text/Price primitive。
- [x] Vue `CouponBundle` 使用 Button/Tag/Text/Price primitive。
- [x] `ProductRankList` 在 React/Vue 两端复用 Image/Text/Tag/Price primitive。
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
- 业务物料视觉细节较多，迁移时必须保持原有 props 行为和 DOM 可用性。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建任务，范围限定为第二批内部 primitives 复用。 |
| 2026-07-31 | in_progress | 开始迁移第二批业务物料复用内部 primitives。 |
| 2026-07-31 | verified | 完成 `StickyActionBar`、`CouponBundle`、`ProductRankList` 的 React/Vue primitives 复用迁移和验证。 |

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，36 个测试全部通过。
- `pnpm smoke:browser`：通过，Vue3 编辑器、编辑器内置 runtime 和 React H5 runtime 均正常渲染。
- `git diff --check`：通过。

## 实现摘要

- React/Vue `StickyActionBar` 已复用 `MlcButton` 和 `MlcText`。
- React/Vue `CouponBundle` 已复用 `MlcButton`、`MlcTag`、`MlcText` 和 `MlcPrice`。
- React/Vue `ProductRankList` 已复用 `MlcButton`、`MlcImage`、`MlcTag`、`MlcText` 和 `MlcPrice`。
- materials 测试新增业务物料 primitive composition 断言，覆盖本轮迁移目标。
- 本任务不改变 Page Schema v1、Material Manifest v1、npm 包名或公开接入方式。

## 后续建议

- 继续迁移 `BrandFeatureSection`、`LiveEntry`、`StoreExpertSection`、`FlashSaleList`、`ActivityRuleModal`、`CouponSection` 等剩余物料中的图片、按钮、文本、标签和价格重复实现。
- 至少完成更多业务物料复用并观察 API 稳定性后，再评估独立 primitives npm 包。
