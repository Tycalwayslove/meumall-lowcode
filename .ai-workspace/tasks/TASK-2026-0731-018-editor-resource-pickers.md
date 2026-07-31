# TASK-2026-0731-018-editor-resource-pickers

## 状态

verified

## 目标

增强 Vue3 编辑器 playground 的运营配置体验，新增素材库和商品选择器，让图片类物料和商品类物料可以通过可视化选择完成配置，而不是主要依赖手填 URL 或 JSON。

## 背景

当前 Vue3 编辑器已经具备物料添加、节点选择、属性编辑、模板、数据源、action 和发布 mock 能力。但素材和商品配置仍偏演示：图片只能通过少量快捷按钮填入，商品列表更多依赖 data source mock 或 JSON 编辑。为了让编辑器更接近运营实际搭建活动页，需要补齐可搜索、可选择、可写回节点 props/dataBinding 的资源选择交互。

## 涉及包或系统

- `apps/editor-playground`
- `.ai-workspace/tasks`
- `.ai/test-reports`
- `.ai/PROJECT_STATE.md`
- `.ai/AI_CONTEXT.md`
- `.ai/TODO.md`

## 范围

包含：

- 新增本地 mock 素材库，支持分类、搜索、缩略图和一键应用到选中图片类节点。
- 新增本地 mock 商品选择器，支持搜索、勾选、多选预览和一键写入选中商品类节点。
- 商品选择器对 `ProductList` 和 `FlashSaleList` 写入 `props.items`，并允许移除当前节点的 `dataBinding.items`，从而验证静态商品编排路径。
- 保留原有 data source 绑定路径，允许继续一键绑定 `products` 数据源。
- 更新编辑器样式，保证资源面板在当前三栏布局中可用。
- 更新项目状态、TODO 和验证报告。

不包含：

- 接入真实素材中心、商品中心或 Java API。
- 修改 Page Schema v1 字段结构。
- 修改 React/Vue H5 物料渲染语义。
- 新增 npm 发布或 changeset。

## 责任边界

当前仓库：

- 提供 Vue3 编辑器 playground 的 mock 资源选择交互和 schema 写回示例。

外部系统：

- Java 配置平台后续负责提供真实素材、商品、权限、审核和分页接口。
- 真实管理后台后续负责把 playground 交互迁移到正式页面。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无。
- 是否向后兼容：是，仅更新 playground 交互。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：暂用 mock。

## 实现计划

1. 扩展 `apps/editor-playground/src/App.vue` 的 mock 资源数据、搜索状态和节点写回方法。
2. 在右侧属性区增加素材库和商品选择器面板。
3. 补充样式，确保资源卡片、商品勾选和操作按钮可扫描、可点击。
4. 更新 AI 状态、TODO 和验证报告。
5. 运行 `pnpm typecheck`、`pnpm build`、`pnpm test` 和本地入口 smoke check。

## 验收标准

- [x] 选中 `ActivityHero` 或 `ImageBanner` 时，可以从素材库搜索并应用图片。
- [x] 选中 `ProductList` 或 `FlashSaleList` 时，可以从商品选择器搜索、勾选并写入商品。
- [x] 商品写入后会移除当前节点 `dataBinding.items`，静态商品配置可直接在预览中渲染。
- [x] 仍保留一键绑定 `products` 数据源的能力。
- [x] 编辑器 UI 样式无明显溢出或遮挡。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] 编辑器和 H5 runtime smoke check 通过。
- [x] 项目状态、TODO 和验证报告已更新。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
curl -I http://localhost:5173/
curl -I http://localhost:5174/
```

## 发布影响

- 是否需要发布：暂不发布。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：类型检查、构建、测试和本地入口检查通过。

## 风险和阻塞

- 当前资源仍是本地 mock，真实素材/商品中心需要 Java 配置平台后续提供接口。
- 商品静态写入适合小型活动页，正式大促长列表仍推荐使用 data source 绑定。

## 验证结果

2026-07-31 验证通过。

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，3 个 suite、19 个用例全部通过。
- `curl -I http://localhost:5173/`：返回 `HTTP/1.1 200 OK`。
- `curl -I http://localhost:5174/`：返回 `HTTP/1.1 200 OK`。

验证报告：`.ai/test-reports/TASK-2026-0731-018-editor-resource-pickers.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确资源选择器增强范围和验收标准。 |
| 2026-07-31 | in_progress | 开始实现 Vue3 编辑器素材库和商品选择器。 |
| 2026-07-31 | verified | 完成 mock 素材库、商品选择器、静态商品写回、样式和验证报告。 |
