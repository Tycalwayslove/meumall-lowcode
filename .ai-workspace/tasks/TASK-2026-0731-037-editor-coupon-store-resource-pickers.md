# TASK-2026-0731-037-editor-coupon-store-resource-pickers

## 状态

verified

## 目标

扩展 Vue3 编辑器 playground 的资源选择能力，在已有图片素材和商品选择器基础上，为优惠券、门店/达人推荐补充可搜索、可多选、可写回物料 props 的资源选择器，让运营配置 `CouponBundle`、`CouponSection` 和 `StoreExpertSection` 时不再只能依赖 JSON 或通用数组编辑器。

## 背景

当前编辑器已具备资源库 adapter、商品选择器、素材库和数组属性列表编辑器。`CouponBundle`、`CouponSection`、`StoreExpertSection` 也已经有 React/Vue H5 物料和模板示例，但在编辑器中配置优惠券、门店/达人仍主要依赖数组字段编辑或静态模板内容，操作路径偏工程化。

本任务在 `@meumall/lowcode-adapters` 中扩展资源库契约，增加优惠券和门店/达人资源类型及静态查询实现；再让 Vue3 编辑器 playground 通过同一个 Resource Library Client 查询并写回对应物料 props，为后续接入真实优惠券中心、门店中心和达人中心打基础。

## 涉及包或系统

- `@meumall/lowcode-adapters`
- `apps/editor-playground`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- 在 `packages/adapters` 定义优惠券资源和门店/达人资源类型。
- 扩展 `LowcodeResourceLibraryClient`，增加 `searchCoupons` 和 `searchStoreExperts`。
- 扩展 `createStaticResourceLibraryClient`，支持本地优惠券和门店/达人数组搜索、标签/标题/ID 匹配和 limit。
- 为 adapters 增加优惠券、门店/达人资源查询单元测试。
- 在 Vue3 编辑器 playground 增加优惠券资源选择器：
  - `CouponBundle` 可多选优惠券并写回 `props.coupons`。
  - `CouponSection` 可选择单张优惠券并写回主标题和按钮文案。
- 在 Vue3 编辑器 playground 增加门店/达人选择器：
  - `StoreExpertSection` 可多选推荐项并写回 `props.items`。
  - 支持重新绑定 `stores` 数据源用于预览 mock。
- 更新 adapters README、任务、项目状态、上下文、TODO 和验证记录。

不包含：

- 不接真实 Java HTTP API。
- 不实现优惠券领取接口、库存校验、适用范围校验、门店定位、达人直播状态和权限。
- 不新增 schema 字段。
- 不修改 renderer、materials 或 editor 包公开 API。
- 不实现优惠券、门店、达人中心的分页、审核、上下架和权限 UI。

## 责任边界

当前仓库：

- 维护资源查询前端 adapter、静态 mock 实现、编辑器接入和验证记录。

外部系统：

- Java 配置平台或资源中心后续提供真实优惠券、门店、达人 HTTP API、鉴权、分页、审核和资源权限。
- H5 runtime 不消费编辑器资源库查询逻辑，只消费发布后的 schema props/dataBinding。

## 契约影响

- 是否影响跨包或跨系统契约：是，扩展 `@meumall/lowcode-adapters` 资源库公开接口。
- 契约文档路径：本任务文件和 `packages/adapters/README.md`。
- 是否向后兼容：是，新增可选方法和类型，不改变现有 API 语义。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要，先写入 `packages/adapters/README.md`。
- 对接说明路径：`packages/adapters/README.md`。
- 需要确认的角色：Java 配置平台负责人、优惠券中心负责人、门店中心负责人、达人中心负责人。
- 当前确认状态：前端先行抽象，待外部系统确认真实 API。

## 实现计划

1. 在 `packages/adapters/src/index.ts` 扩展资源库类型和静态 client。
2. 增加 adapters 单元测试覆盖优惠券和门店/达人搜索。
3. 更新 `packages/adapters/README.md`。
4. 在 `apps/editor-playground/src/App.vue` 增加静态优惠券、门店/达人资源数据和查询状态。
5. 在编辑器属性面板接入优惠券、门店/达人资源选择器和写回逻辑。
6. 运行类型检查、构建、测试和 dev server smoke check。
7. 更新 AI 状态和验证记录。

## 验收标准

- [x] `@meumall/lowcode-adapters` 导出优惠券资源、门店/达人资源类型。
- [x] `LowcodeResourceLibraryClient` 支持 `searchCoupons` 和 `searchStoreExperts`。
- [x] 静态资源 client 可按优惠券标题、ID、标签搜索优惠券。
- [x] 静态资源 client 可按门店/达人标题、ID、类型、标签搜索推荐项。
- [x] Vue3 编辑器 `CouponBundle` 可通过资源选择器写回 `props.coupons`。
- [x] Vue3 编辑器 `CouponSection` 可通过资源选择器写回主券文案。
- [x] Vue3 编辑器 `StoreExpertSection` 可通过资源选择器写回 `props.items`。
- [x] `StoreExpertSection` 可恢复绑定 mock `stores` 数据源。
- [x] `packages/adapters/README.md` 已说明扩展后的 Resource Library Client。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] editor 和 H5 runtime dev server smoke check 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
curl -I http://127.0.0.1:5173/
curl -I http://127.0.0.1:5174/
```

## 发布影响

- 是否需要发布：本任务不实际发布 npm。
- 发布对象：后续发布 `@meumall/lowcode-adapters` 时包含新增资源库 API。
- 是否影响 schema 兼容性：否。
- 是否影响 H5 接入：否。
- 是否需要 changeset：正式 npm 发布前需要，本任务先不创建版本发布。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可恢复仅图片/商品资源选择。
- smoke check：编辑器和 H5 runtime dev server 返回 HTTP 200，自动化命令通过。

## 风险和阻塞

- 当前只定义前端 adapter 形态，真实优惠券、门店、达人 API 仍待外部系统确认。
- 当前只做静态资源写回和 mock 数据源预览，不包含真实领取、库存、定位、直播和权限状态。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，28 个测试全部通过。
- `curl -I http://127.0.0.1:5173/` 返回 HTTP 200。
- `curl -I http://127.0.0.1:5174/` 返回 HTTP 200。
- 本次临时启动的 editor dev server 因 5173/5174/5175 已被占用自动落到 5176，`curl -I http://127.0.0.1:5176/` 返回 HTTP 200。
- 本次临时启动的 H5 runtime dev server 因 5174 已被占用自动落到 5175，`curl -I http://127.0.0.1:5175/` 返回 HTTP 200。
- 未验证项：未接真实 Java 优惠券、门店、达人 HTTP API、鉴权、权限、分页、审核、库存、定位和直播状态，原因是外部系统接口尚未确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建优惠券、门店/达人资源选择器任务。 |
| 2026-07-31 | in_progress | 开始扩展资源库 adapter 和 Vue3 编辑器资源选择器。 |
| 2026-07-31 | verified | 完成优惠券、门店/达人资源选择器、文档和验证记录。 |
