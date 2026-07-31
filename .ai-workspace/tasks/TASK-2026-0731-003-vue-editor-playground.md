# TASK-2026-0731-003-vue-editor-playground

## 状态

verified

## 目标

交付第一版可实操的 Vue3 编辑器 playground，并补齐对应的 Vue H5 renderer 与基础 Vue H5 物料库，让低代码平台从包骨架推进到可打开、可编辑、可预览的工作台。

## 背景

用户明确要求最终看到一个可实操的编辑器、对应 H5 渲染和基础物料库，并补充说明编辑器需要使用 Vue3，便于后续迁移到管理系统中。当前仓库已有 schema、core、headless editor、React H5 renderer/materials，但还缺少 Vue3 编辑器 UI 和 Vue 技术栈预览渲染闭环。

## 涉及包或系统

- `apps/editor-playground`
- `@meumall/lowcode-renderer-vue-h5`
- `@meumall/lowcode-materials-vue-h5`
- `@meumall/lowcode-editor`
- `@meumall/lowcode-schema`
- `@meumall/lowcode-core`

## 范围

包含：

- 新增 Vue3 + Vite 编辑器 playground。
- 新增 Vue H5 renderer 包。
- 新增 Vue H5 基础物料包。
- playground 支持物料添加、拖到画布、节点选择、属性编辑、JSON 查看/应用、本地保存、撤销/重做和 H5 手机预览。
- 更新包地图、架构文档、README 和发布治理。

不包含：

- Java 管理台真实嵌入。
- 真实素材/商品/优惠券选择器 API。
- 页面发布审批和线上发布。
- 拖拽排序和多层容器布局。
- 自动化浏览器截图测试。

## 责任边界

当前仓库：

- 提供 Vue3 编辑器示例、Vue H5 renderer、Vue H5 物料和集成验证。

外部系统：

- Java 管理台后续按本 app 的交互和包边界迁移，不在本任务实现。
- H5 线上运行时后续按实际技术栈选择 React 或 Vue renderer，不在本任务发布。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 Vue renderer/material 包边界。
- 契约文档路径：`.ai-workspace/PROJECT_MAP.md`、`docs/architecture.md`
- 是否向后兼容：是，新增包和 app，不破坏已有 React H5 包。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：暂不需要。
- 对接说明路径：无。
- 需要确认的角色：后续 Java 管理台接入方。
- 当前确认状态：暂用本地 playground 验证。

## 实现计划

1. 调整依赖为 Vue3 编辑器方案。
2. 新增 Vue H5 renderer 和 Vue H5 materials。
3. 新增 Vue3 editor playground。
4. 更新文档和 AI 工作流事实源。
5. 运行类型检查、构建和本地访问验证。

## 验收标准

- [x] `pnpm dev` 可以启动 Vue3 编辑器 playground。
- [x] playground 可以添加基础物料并在 H5 预览中渲染。
- [x] playground 可以选择节点并编辑属性。
- [x] playground 可以查看和应用 Page Schema JSON。
- [x] playground 可以保存到 localStorage 和重置示例。
- [x] Vue H5 renderer 和 Vue H5 materials 是独立 workspace 包。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] npm pack dry-run 通过，新增 Vue 包打包内容正常。
- [x] `curl -I http://localhost:5173/` 返回 200。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm -r --filter './packages/*' exec npm pack --dry-run
pnpm dev
curl -I http://localhost:5173/
```

## 验证结果

2026-07-31：

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- npm pack dry-run 通过。
- `pnpm dev` 启动成功，地址 `http://localhost:5173/`。
- `curl -I http://localhost:5173/` 返回 `HTTP/1.1 200 OK`。
- 验证报告：`.ai/test-reports/TASK-2026-0731-003-vue-editor-playground.md`

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：本地 dev server 可访问，类型检查和构建通过。

## 风险和阻塞

- 尚未做自动化浏览器截图测试。
- playground 仍是本地验证工作台，不包含真实 Java 管理台权限、素材库、商品库和发布流程。
- 拖拽当前支持从物料面板添加到画布，尚未支持节点排序。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确编辑器使用 Vue3。 |
| 2026-07-31 | in_progress | 新增 Vue renderer/materials 和 playground。 |
| 2026-07-31 | verified | 验证通过，dev server 可访问。 |
