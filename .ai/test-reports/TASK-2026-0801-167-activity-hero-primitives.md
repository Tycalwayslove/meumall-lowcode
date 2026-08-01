# TASK-2026-0801-167 ActivityHero 基础组件复用增强

## 状态

- status: verified
- created_at: 2026-08-01 14:04:25 CST
- owner: AI Agent

## 背景

`ActivityHero` 是活动页首屏常用营销物料，目前 React/Vue 两端仍直接使用原生 `img/h1/p` 和硬编码样式。随着内部 `MlcImage`、`MlcText` 等 runtime primitives 已稳定覆盖主要展示能力，`ActivityHero` 应收敛到基础组件组合，避免首屏头图继续保留一套独立图片、标题和说明样式逻辑。

## 目标

在不改变 Page Schema 节点形态、不新增公开 npm API、不影响已有活动页渲染的前提下，将 React/Vue `ActivityHero` 迁移为基础组件组合，并补齐常用样式配置能力。

## 范围

- React H5 `ActivityHero` 使用 `MlcImage` 和 `MlcText` 渲染图片、标题和说明。
- Vue H5 `ActivityHero` 使用同名 primitives 渲染图片、标题和说明。
- 两端 manifest 对齐新增 `textColor`、`imageRadius`、`paddingY`、`titleLineHeight` 和 `subtitleLineHeight` 等向后兼容配置。
- 编辑器默认模板、商品专题模板和 React H5 runtime 示例补充新样式 props。
- 测试覆盖 manifest 对齐、number/color setter、primitive 组合和注册契约。
- 文档与 AI 状态同步记录本次架构推进。

## 非范围

- 不新增 `MlcHero` 或 `HeroCard` primitive。
- 不新增按钮、倒计时、会场标签或多图轮播能力。
- 不接真实活动 API、CMS、素材审核或 Java 配置平台字段。
- 不改变 `ActivityHero` 的 `componentName`、category、platforms 或旧 schema 语义。

## 验收标准

- React/Vue material manifests 均通过 schema 校验且 componentName 顺序保持一致。
- `ActivityHero` 旧页面只配置 `title`、`subtitle`、`imageUrl`、`backgroundColor`、`titleColor`、`titleSize` 时仍可渲染。
- `ActivityHero` 新增样式 props 可在属性面板通过 color/number setter 编辑。
- React/Vue `ActivityHero` 均复用已有 runtime primitives。
- 浏览器 smoke 能在编辑器和 React H5 runtime 中识别 `.mlc-activity-hero`。
- `pnpm test` 通过。

## 验证记录

- 2026-08-01 14:06 CST：`pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- 2026-08-01 14:06 CST：`pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- 2026-08-01 14:08 CST：`pnpm test` 通过，覆盖 build、architecture check 和 107 个单测。
- 2026-08-01 14:10 CST：`pnpm smoke:browser` 通过，覆盖 Vue3 编辑器画布、编辑器内置 runtime 和 React H5 runtime 的 `.mlc-activity-hero` DOM 渲染。
- 2026-08-01 14:11 CST：`pnpm pack:dry-run` 通过，8 个可发布包均通过 npm pack 内容预检。

## 发布影响

- 影响 `@meumall/lowcode-materials-h5` 和 `@meumall/lowcode-materials-vue-h5`，已补 minor changeset。
- 不改变 Page Schema v1 字段结构，不需要 schema migration。
- 不影响 Java 配置平台 API，不需要新增外部接口。
- 不立即执行 npm 发布；真实发布仍等待 registry、access 和 token 确认。
