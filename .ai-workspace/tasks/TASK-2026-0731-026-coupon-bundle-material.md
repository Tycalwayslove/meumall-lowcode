# TASK-2026-0731-026-coupon-bundle-material

## 状态

verified

## 目标

新增电商活动页常用的组合券包物料 `CouponBundle`，让 Vue3 编辑器可添加和配置，并让 React H5 runtime 与 Vue H5 预览都能渲染同一 `componentName`。

## 背景

当前物料库已有单个优惠券区块 `CouponSection`，但运营活动页经常需要展示“满减券 / 品类券 / 包邮券 / 新人券”等组合券包。单券物料无法表达多张券同时领取和逐张领取的常见玩法。为了让基础物料库更贴近真实运营活动，需要补充组合券包物料。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- 新增 React H5 `CouponBundle` 物料。
- 新增 Vue H5 `CouponBundle` 物料，保持 manifest 与 React H5 对齐。
- 大促模板和 React H5 runtime 示例加入组合券包节点。
- 扩展物料 manifest 对齐测试，覆盖 `CouponBundle`。
- 更新任务、项目状态、上下文和验证记录。

不包含：

- 不新增 Page Schema 结构字段。
- 不接入真实优惠券中心、领券接口、风控或库存。
- 不实现专用券包编辑器 UI。
- 不处理券状态实时刷新。

## 责任边界

当前仓库：

- 维护物料 manifest、React/Vue H5 物料实现、编辑器示例、runtime 示例和验证记录。

外部系统：

- Java 配置平台后续负责真实券包配置、券状态、领取接口、库存和风控。
- H5 宿主后续负责真实领券 action、埋点和登录态处理。

## 契约影响

- 是否影响跨包或跨系统契约：影响 Material Manifest 物料清单，新增向后兼容物料。
- 契约文档路径：物料 manifest 由 `packages/materials-h5/src/index.tsx` 和 `packages/materials-vue-h5/src/index.ts` 暂作为事实源。
- 是否向后兼容：是，旧页面不引用该物料时不受影响。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否，正式 npm 发布时按 minor 能力发布。

## 对接说明

- 是否需要对接说明：暂不新增独立对接文档。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 在 React/Vue H5 物料包中新增 `CouponBundle` 组件和 manifest。
2. 在大促模板和 React H5 runtime 示例中加入组合券包节点。
3. 扩展物料 manifest 对齐测试并运行验证。
4. 更新 AI 任务、项目状态和测试报告。

## 验收标准

- [x] `CouponBundle` 在 React H5 和 Vue H5 物料包中均已注册。
- [x] React/Vue 两套物料 manifest 的 `componentName` 保持一致。
- [x] Vue3 编辑器物料库可通过 manifest 自动出现该物料。
- [x] 大促模板或 H5 runtime 示例包含组合券包节点。
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
- 发布对象：后续发布 `@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5` 时包含该物料。
- 是否需要 changeset：正式 npm 发布前需要，本任务先不创建版本发布。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可移除该物料。
- smoke check：编辑器和 H5 runtime dev server 返回 HTTP 200，自动化命令通过。

## 风险和阻塞

- 券包列表暂用 JSON 文本配置，后续需要接入真实优惠券中心和专用选择器。
- 领取行为仍是 mock action，正式 H5 接入时需要登录、风控、库存和错误态处理。

## 验证结果

验证日期：2026-07-31

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，4 个 suites、23 条 tests 全部通过。
- `curl -I http://127.0.0.1:5173/`：HTTP 200。
- `curl -I http://127.0.0.1:5174/`：HTTP 200。

验证报告：`.ai/test-reports/TASK-2026-0731-026-coupon-bundle-material.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建组合券包物料任务。 |
| 2026-07-31 | verified | 完成组合券包物料、模板示例、runtime 示例和验证记录。 |
