# TASK-2026-0801-155-basic-carousel-material

## 标题

新增基础图片轮播通用物料

## 状态

verified

## 目标

在现有基础物料库中新增业务无关的图片轮播物料，让运营可以通过 Vue3 编辑器拖拽配置多张图片，并在 React H5 runtime 与 Vue H5 预览中使用同一 `componentName` 和 manifest 语义渲染。

## 背景

当前基础物料已覆盖按钮、输入框、文本、分割线、图片、标签、图文卡片和基础容器，但常见 H5 活动页仍缺少业务无关的多图轮播能力。图片轮播是运营搭建首屏 Banner、会场入口和宣传位的高频基础能力，适合作为 Generic Material 补齐，而不是放到业务活动物料中。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `packages/materials-h5/test`
- `.changeset/`
- `.ai/`

## 范围

包含：

- 新增 React H5 `BasicCarousel` 通用物料。
- 新增 Vue H5 `BasicCarousel` 通用物料。
- React/Vue manifest 保持同一 `componentName`、props 语义、默认 props、分类和编辑元数据。
- 支持静态轮播项数组、图片、标题、说明、角标、圆角、比例、自动播放、指示器和点击 action。
- 接入 Vue3 编辑器物料列表、默认模板或 H5 示例，确保可实操入口可见。
- 接入 React H5 runtime 示例，确保对应 H5 渲染可见。
- 补充单测和 browser smoke 关键断言。
- 补充 materials 包 minor changeset。
- 更新 AI 状态、TODO 和任务记录。

不包含：

- 不引入第三方轮播库。
- 不实现复杂手势惯性、无限循环虚拟化或服务端 AB 实验。
- 不新增独立 primitives npm 包。
- 不改变 Page Schema v1 结构。
- 不接真实素材中心或活动配置接口。

## 责任边界

当前仓库：

- `materials-h5` 与 `materials-vue-h5` 提供同名轮播物料实现和 manifest。
- `apps/editor-playground` 负责把物料展示给运营并复用现有数组属性编辑器。
- `apps/h5-runtime-playground` 负责演示 React H5 runtime 消费该物料。

外部系统：

- Java 配置平台、真实素材中心、真实 H5 宿主和 npm registry 不在本任务范围内。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 Material Manifest 物料能力。
- 契约文档路径：`.ai-workspace/contracts/material-manifest-v1.md`、`docs/material-layering-architecture.md`。
- 是否向后兼容：是，新增物料和可选 props，不影响旧页面。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`README.md`、`.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：低代码前端维护者、后续接入 Java 配置平台模板市场的同学。
- 当前确认状态：前端本地物料和 runtime 演示。

## 实现计划

1. 设计 `BasicCarousel` props、默认值、manifest 和双端渲染结构。
2. 在 React/Vue materials 包中实现并注册物料。
3. 接入 Vue3 编辑器默认物料列表和 React H5 runtime 示例 schema。
4. 补充 materials manifest/渲染测试、browser smoke 断言和 changeset。
5. 更新 README、AI 状态、TODO 和任务验证记录。

## 验收标准

- [x] React H5 materials 暴露并注册 `BasicCarousel`。
- [x] Vue H5 materials 暴露并注册 `BasicCarousel`。
- [x] React/Vue `BasicCarousel` manifest 的 `componentName`、props 语义和编辑元数据一致。
- [x] `BasicCarousel` 支持至少两张图片、标题/说明、圆角、比例、指示器和点击 action 配置。
- [x] Vue3 编辑器物料库可搜索/添加 `BasicCarousel`。
- [x] React H5 runtime 示例页面可渲染 `BasicCarousel`。
- [x] browser smoke 覆盖编辑器或 runtime 中的 `BasicCarousel` 关键文案/节点。
- [x] 新增或更新单测通过。
- [x] materials 包 changeset 已记录 minor 变更。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `pnpm demo:check` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm test
pnpm smoke:browser
pnpm demo:check
git diff --check
```

## 验证结果

- `pnpm test`：通过，包含 build、architecture check 和 95 个 Node test。
- `pnpm smoke:browser`：通过，已覆盖 Vue3 编辑器通过快捷命令添加基础图片轮播、源码写回 `BasicCarousel`，以及 React H5 pageId 入口渲染 `.mlc-basic-carousel`。
- `pnpm demo:check`：通过，editor、H5 runtime、published pageId 和 preview releaseId 入口健康检查正常。
- `git diff --check`：通过。

## 发布影响

- 是否需要发布：后续真实 npm 发布时需要。
- 发布对象：`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`。
- 是否需要 changeset：是，minor。
- 是否需要 GitHub tag/release：本任务不单独创建 tag/release，后续统一发布时处理。
- 是否影响 H5 接入：新增可选物料能力，不影响旧 H5 页面。
- 是否影响 npm 发布：新增 pending changeset，真实发布仍需 registry/token 确认。
- 是否影响 Java 配置平台：后续如 Java 配置平台读取 material manifest，可展示新增物料；本任务不要求 Java 改造。
- 回滚目标：回滚本任务提交即可移除新增物料。
- smoke check：`pnpm smoke:browser` 和 `pnpm demo:check`。

## 风险和阻塞

- 当前不引入轮播库，因此交互保持轻量；复杂手势和无限循环如有需要应另起任务设计。
- 当前数组属性编辑器可配置轮播项，但真实素材中心批量选图仍待后续接入。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为业务无关基础轮播物料和本地演示验证。 |
| 2026-08-01 | verified | 完成 React/Vue `BasicCarousel`、editor 列表项字段模型、默认模板、React H5 runtime 示例、browser smoke、单测、changeset 和文档状态更新。 |
