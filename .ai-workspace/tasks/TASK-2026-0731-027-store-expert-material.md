# TASK-2026-0731-027-store-expert-material

## 状态

verified

## 目标

新增电商活动页常用的门店/达人推荐物料 `StoreExpertSection`，让 Vue3 编辑器可添加和配置，并让 React H5 runtime 与 Vue H5 预览都能渲染同一 `componentName`。

## 背景

当前物料库已经覆盖活动头图、商品、优惠券、倒计时、楼层导航、规则弹窗等活动页核心模块，但运营活动页还经常需要展示“推荐门店、推荐达人、导购号、直播间入口”等导流内容。缺少门店/达人推荐物料会让活动页搭建仍依赖前端补定制区块。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- 新增 React H5 `StoreExpertSection` 物料。
- 新增 Vue H5 `StoreExpertSection` 物料，保持 manifest 与 React H5 对齐。
- 大促模板和 React H5 runtime 示例加入门店/达人推荐节点。
- 扩展物料 manifest 对齐测试，覆盖 `StoreExpertSection`。
- 更新任务、项目状态、上下文和验证记录。

不包含：

- 不新增 Page Schema 结构字段。
- 不接入真实门店中心、达人中心、直播间接口或 IM/导购系统。
- 不实现专用门店/达人选择器 UI。
- 不处理关注状态、距离排序、库存、在线状态实时刷新。

## 责任边界

当前仓库：

- 维护物料 manifest、React/Vue H5 物料实现、编辑器示例、runtime 示例和验证记录。

外部系统：

- Java 配置平台后续负责真实门店/达人配置、素材、权限、上下架和审核。
- H5 宿主后续负责真实跳转、关注、埋点、登录态和 App/WebView bridge。

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

1. 在 React/Vue H5 物料包中新增 `StoreExpertSection` 组件和 manifest。
2. 在大促模板和 React H5 runtime 示例中加入门店/达人推荐节点。
3. 扩展物料 manifest 对齐测试并运行验证。
4. 更新 AI 任务、项目状态和测试报告。

## 验收标准

- [x] `StoreExpertSection` 在 React H5 和 Vue H5 物料包中均已注册。
- [x] React/Vue 两套物料 manifest 的 `componentName` 保持一致。
- [x] Vue3 编辑器物料库可通过 manifest 自动出现该物料。
- [x] 大促模板或 H5 runtime 示例包含门店/达人推荐节点。
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

- 门店/达人列表暂用 JSON 文本配置，后续需要接入真实门店/达人中心和专用选择器。
- 点击行为仍是 mock action，正式 H5 接入时需要跳转协议、登录、埋点和错误态处理。

## 验证结果

验证日期：2026-07-31

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，4 个 suites、24 条 tests 全部通过。
- `curl -I http://127.0.0.1:5173/`：HTTP 200。
- `curl -I http://127.0.0.1:5174/`：HTTP 200。

验证报告：`.ai/test-reports/TASK-2026-0731-027-store-expert-material.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建门店/达人推荐物料任务。 |
| 2026-07-31 | in_progress | 开始实现 React/Vue H5 物料、模板示例和验证覆盖。 |
| 2026-07-31 | verified | 完成门店/达人推荐物料、模板示例、runtime 示例和验证记录。 |
