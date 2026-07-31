# TASK-2026-0731-062-image-card-grid-material

## 标题

新增图片卡片宫格物料

## 状态

verified

## 目标

为运营活动页补充“图片卡片宫格”基础物料，用于搭建专题会场、品类入口、分会场入口和活动导流区，并同时支持 Vue3 编辑器预览和 React H5 runtime 渲染。

## 背景

当前物料库已有文字导航宫格和多个电商活动物料，但缺少运营活动中常见的图文卡片入口。实际 H5 活动页经常需要用图片卡片承载“女装会场”“鞋包会场”“会员专享”等入口。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

- React H5 物料包新增 `ImageCardGrid` 组件和 manifest。
- Vue H5 物料包新增 `ImageCardGrid` 组件和 manifest。
- 编辑器页面模板接入图片卡片宫格。
- React H5 runtime 示例接入图片卡片宫格。
- Browser smoke check 覆盖编辑器、内置 runtime 和 React runtime 的图片卡片宫格渲染。
- 更新任务记录和 AI 项目状态。

## 不包含

- 不改变 Page Schema v1。
- 不改变 renderer API。
- 不接入真实素材中心或 Java 配置平台。
- 不发布 npm 版本。

## 责任边界

- `materials-h5` 和 `materials-vue-h5` 负责物料组件与 manifest。
- 编辑器通过现有物料 registry 自动暴露该物料，并复用数组属性编辑器。
- H5 runtime 继续通过 schema 消费该物料。

## 契约影响

新增 `ImageCardGrid` 物料 manifest，属于向后兼容的物料库扩展；不影响已有页面渲染。

## 对接说明

后续 Java 配置平台物料市场需要同步展示 `ImageCardGrid` 的 manifest 字段；真实素材中心接入后可通过图片资源选择器写入卡片图片。

## 验收标准

- React H5 runtime 可以渲染 `ImageCardGrid`。
- Vue3 编辑器画布可以渲染并添加 `ImageCardGrid`。
- React/Vue 物料 manifest 名称保持对齐。
- 默认模板或示例中能看到“专题会场”和“女装会场”等图文入口文案。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过。
- `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm smoke:browser
```

## 发布影响

- 不需要 npm 发布。
- 不影响 schema 兼容性。
- 不影响 H5 runtime 接入方式。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可移除新增物料和示例接入。

## 风险和阻塞

- 当前卡片数据为静态数组配置；后续如接真实会场/频道数据源，需要补充 data source slot 或资源中心选择器。

## 变更记录

- 2026-07-31：创建任务，状态置为 `in_progress`。
- 2026-07-31：实现 React/Vue `ImageCardGrid` 物料、接入默认模板和 React H5 示例，并完成验证，状态置为 `verified`。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，34 个测试全部通过。
- `pnpm smoke:browser`：通过，已覆盖 Vue3 编辑器物料入口、默认模板、编辑器内置 runtime 和 React H5 runtime 的图片卡片宫格渲染。

## 实现摘要

- React H5 物料包新增 `ImageCardGrid`，支持标题、说明、列数、间距、圆角、颜色、卡片数组和 `onItemClick`。
- Vue H5 物料包新增同名同 manifest 的 `ImageCardGrid`。
- 默认大促模板和 React H5 runtime 示例新增“专题会场 / 女装会场 / 鞋包会场”图片卡片宫格。
- Vue3 编辑器数组属性编辑器为 `ImageCardGrid.items` 提供卡片字段表单。
- Browser smoke check 增加图片卡片宫格物料和 runtime 文案断言。
