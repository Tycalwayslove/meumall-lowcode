# TASK-2026-0731-005-container-assets-data-preview

## 状态

verified

## 目标

继续增强 Vue3 低代码编辑器，使其支持容器物料、嵌套节点编辑、素材/商品快捷选择和数据源预览绑定。

## 背景

当前 playground 已支持基础物料、H5 预览、属性编辑、根节点排序和数据源配置，但页面结构仍偏平铺，图片/商品配置需要手写 URL/JSON，数据源配置也没有参与预览。为了更接近运营实操，需要补齐容器和选择器体验。

## 涉及包或系统

- `apps/editor-playground`
- `@meumall/lowcode-materials-vue-h5`
- `@meumall/lowcode-renderer-vue-h5`
- `@meumall/lowcode-editor`

## 范围

包含：

- 新增 Vue H5 容器物料。
- playground 支持向选中容器添加子物料。
- 结构面板支持递归展示和子节点选择。
- 素材字段提供快捷图片选择。
- 商品列表字段提供示例商品选择。
- 数据源配置参与预览数据绑定。

不包含：

- 真实 Java/API 数据源请求。
- 生产级素材库弹窗。
- 容器内自由拖拽布局。
- 发布审批流程。

## 责任边界

当前仓库：

- 继续完善编辑器 playground 和 Vue 基础物料。

外部系统：

- Java 管理台、素材库、商品库和发布系统仍为后续对接。

## 契约影响

- 是否影响跨包或跨系统契约：是。
- 契约文档路径：`packages/materials-vue-h5/src/index.ts`、`apps/editor-playground/src/App.vue`
- 是否向后兼容：是，新增物料和 playground 能力。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：本地 playground 验证。

## 实现计划

1. 新增容器物料。
2. 增强 playground 嵌套结构和添加子物料能力。
3. 增强素材/商品快捷选择。
4. 将 mock 数据源解析为预览数据。
5. 验证并记录结果。

## 验收标准

- [x] 物料面板包含容器物料。
- [x] 可以选择容器并向容器中添加子物料。
- [x] 结构面板可以递归展示子节点。
- [x] 图片字段可以从预置素材中选择。
- [x] 商品列表可以从预置商品集中选择。
- [x] 数据源配置能生成预览数据并通过 dataBinding 渲染。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] npm pack dry-run 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm -r --filter './packages/*' exec npm pack --dry-run
curl -I http://localhost:5173/
```

## 验证结果

2026-07-31：

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- npm pack dry-run 通过。
- `curl -I http://localhost:5173/` 返回 `HTTP/1.1 200 OK`。
- 验证报告：`.ai/test-reports/TASK-2026-0731-005-container-assets-data-preview.md`

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：本地 dev server 可访问，类型检查和构建通过。

## 风险和阻塞

- 选择器仍为本地示例，不是真实 Java 管理台素材/商品服务。
- 数据源预览使用 mock resolver，不代表正式后端契约。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确补齐容器、选择器和数据源预览。 |
| 2026-07-31 | in_progress | 开始实现。 |
| 2026-07-31 | verified | 验证通过，完成容器、示例选择器和数据源预览。 |
