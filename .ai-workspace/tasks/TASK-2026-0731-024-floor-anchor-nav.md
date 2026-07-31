# TASK-2026-0731-024-floor-anchor-nav

## 状态

verified

## 目标

新增运营活动页常用的楼层锚点导航能力，让 Vue3 编辑器可配置 `FloorAnchorNav` 物料，并让 React H5 runtime 与 Vue H5 预览可以根据 schema 节点 id 滚动到目标楼层。

## 背景

当前物料库已覆盖活动头图、公告、优惠券、活动规则弹窗、倒计时、导航宫格和秒杀商品组，但长活动页缺少楼层级快速导航。运营做大促页、专题页时通常需要“领券 / 秒杀 / 精选 / 规则”等楼层入口，用户点击后快速跳转到对应区块。为了让锚点真正可用，runtime 也需要给每个 schema 节点提供稳定 DOM 标记。

## 涉及包或系统

- `@meumall/lowcode-renderer-h5`
- `@meumall/lowcode-renderer-vue-h5`
- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- React/Vue H5 renderer 为每个可见节点输出稳定 `data-lowcode-node-id` 包装节点。
- 新增 React H5 `FloorAnchorNav` 物料。
- 新增 Vue H5 `FloorAnchorNav` 物料，保持 manifest 与 React H5 对齐。
- 页面模板和 React H5 runtime 示例接入楼层锚点导航。
- 扩展物料 manifest 对齐测试，覆盖 `FloorAnchorNav`。
- 更新任务、项目状态、上下文和验证记录。

不包含：

- 不新增 Page Schema 结构字段。
- 不实现滚动位置监听、吸顶高亮或 IntersectionObserver 自动激活态。
- 不接入真实楼层配置中心。
- 不处理 App WebView 原生导航栏遮挡。

## 责任边界

当前仓库：

- 维护 runtime DOM 节点标记、物料 manifest、React/Vue H5 物料实现、模板示例、runtime 示例和验证记录。

外部系统：

- Java 配置平台后续负责楼层配置存储、模板化和发布审计。
- H5 宿主后续负责 WebView 顶部安全区、原生导航栏遮挡和真实埋点上报。

## 契约影响

- 是否影响跨包或跨系统契约：影响 renderer DOM 约定和 Material Manifest 物料清单。
- 契约文档路径：本任务先在任务文件记录，后续 Material Manifest v1 和 H5 runtime 集成契约定稿时同步沉淀。
- 是否向后兼容：是，新增 DOM 标记和新增物料不破坏旧 schema；旧页面不引用 `FloorAnchorNav` 时不受影响。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否，正式 npm 发布时按 minor 能力发布。

## 对接说明

- 是否需要对接说明：暂不新增独立对接文档。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 在 React/Vue renderer 中为节点输出 `data-lowcode-node-id` 包装节点。
2. 在 React/Vue H5 物料包中新增 `FloorAnchorNav` 组件和 manifest。
3. 在大促模板和 React H5 runtime 示例中加入楼层锚点节点。
4. 扩展物料 manifest 对齐测试并运行验证。

## 验收标准

- [x] React/Vue renderer 渲染节点时提供 `data-lowcode-node-id`。
- [x] `FloorAnchorNav` 在 React H5 和 Vue H5 物料包中均已注册。
- [x] React/Vue 两套物料 manifest 的 `componentName` 保持一致。
- [x] Vue3 编辑器物料库可通过 manifest 自动出现该物料。
- [x] 大促模板或 H5 runtime 示例包含楼层锚点节点并指向已有节点 id。
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
- 发布对象：后续发布 `@meumall/lowcode-renderer-h5`、`@meumall/lowcode-renderer-vue-h5`、`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5` 时包含该能力。
- 是否需要 changeset：正式 npm 发布前需要，本任务先不创建版本发布。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可移除楼层锚点物料和 renderer DOM 标记。
- smoke check：编辑器和 H5 runtime dev server 返回 HTTP 200，自动化命令通过。

## 风险和阻塞

- renderer 新增节点包装层可能轻微影响极端自定义 CSS，当前基础物料均为块级 H5 物料，风险可控。
- 暂未实现当前楼层高亮，后续可基于 `data-lowcode-node-id` 和 IntersectionObserver 扩展。

## 验证结果

验证日期：2026-07-31

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，4 个 suites、22 条 tests 全部通过。
- `curl -I http://127.0.0.1:5173/`：HTTP 200。
- `curl -I http://127.0.0.1:5174/`：HTTP 200。

验证报告：`.ai/test-reports/TASK-2026-0731-024-floor-anchor-nav.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建楼层锚点导航任务。 |
| 2026-07-31 | verified | 完成 renderer 节点锚点标记、楼层锚点物料、模板示例、runtime 示例和验证记录。 |
