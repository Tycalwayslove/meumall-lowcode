# TASK-2026-0801-143-section-container-layout

## 标题

增强基础容器布局能力

## 状态

verified

## 目标

在不改变 Page Schema v1 结构、不新增容器协议的前提下，增强现有 `SectionContainer` 通用容器物料的基础布局配置能力，让运营可以更自然地把基础按钮、输入、文本、图片、标签等物料组合成一个可排版的分组区块，并保持 React/Vue H5 runtime manifest 语义一致。

## 背景

当前基础物料库已覆盖按钮、输入、文本、分割线、图片和标签。编辑器已经将 `SectionContainer` 作为可投放内部节点的容器，支持把物料加入容器、移动进容器和结构树展示。但 `SectionContainer` 现有样式配置较少，React 侧也缺少稳定的 container/body class，运营在真实搭页面时难以控制分组留白、子节点间距、边框、阴影和空态提示。增强现有容器比新增一个并行容器更符合当前架构边界。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `docs/material-layering-architecture.md`
- `.ai/`

## 范围

包含：

- 为 React/Vue H5 `SectionContainer` 增加向后兼容布局 props：`marginY`、`gap`、`borderColor`、`borderWidth`、`shadow`、`titleColor`、`subtitleColor`、`emptyText`。
- React/Vue H5 `SectionContainer` 保持同名同义 manifest，补齐 propsSchema。
- React H5 `SectionContainer` 增加稳定 `mlc-section-container`、`mlc-section-container__body`、`mlc-section-container__empty` class。
- 更新 editor playground 默认模板和 React H5 runtime 示例，展示增强后的容器能力。
- 更新 materials README、分层架构文档、测试、browser smoke 和 AI 事实源。

不包含：

- 不改变 Page Schema v1 结构。
- 不改变 Material Manifest v1 字段结构。
- 不新增 `BasicContainer`、`Columns` 或新的容器协议。
- 不改变编辑器可投放内部节点的判断逻辑，仍只把 `SectionContainer` 作为当前容器入口。
- 不实现响应式多列布局、栅格布局、组件插槽协议或跨父级多选拖拽。

## 责任边界

当前仓库：

- `materials-*` 负责增强 `SectionContainer` 物料渲染和 manifest。
- `editor-playground` 负责展示和验证容器内组合能力。
- `h5-runtime-playground` 负责验证 React H5 runtime 能消费增强后的容器 props。

外部系统：

- Java 配置平台未来负责存储包含这些新增 props 的 Page Schema，并按 manifest 白名单校验。
- 真实 H5 业务仓库未来通过 npm 包消费增强后的 `SectionContainer`。

## 契约影响

- 是否影响跨包或跨系统契约：是，向已有物料新增向后兼容 props。
- 契约文档路径：`.ai-workspace/contracts/material-manifest-v1.md`、`docs/material-layering-architecture.md`。
- 是否向后兼容：是，新增 props 均有 runtime fallback，不影响旧页面。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：真实 H5 接入时需确认 runtime 版本包含增强后的 `SectionContainer` 后再下发对应新 props。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`。
- 需要确认的角色：前端低代码维护者、Java 配置平台、H5 接入方。
- 当前确认状态：前端参考实现。

## 验收标准

- [x] React/Vue `SectionContainer` manifest 语义一致，新增 propsSchema 字段一致。
- [x] 旧 schema 不配置新增 props 时仍按原默认视觉渲染。
- [x] 配置 `marginY`、`gap`、`borderColor`、`borderWidth`、`shadow`、`titleColor`、`subtitleColor`、`emptyText` 后 React/Vue H5 均可消费。
- [x] Vue3 editor playground 默认模板展示增强后的容器分组能力。
- [x] React H5 runtime 示例能渲染增强后的容器分组。
- [x] 不改变 Page Schema v1、Material Manifest v1 字段结构或编辑器容器判断逻辑。
- [x] `pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- [x] `pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm --filter @meumall/lowcode-materials-h5 typecheck
pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck
pnpm test
pnpm smoke:browser
git diff --check
```

## 发布影响

- 是否需要发布：否，本任务不执行真实 npm 发布。
- 发布对象：后续真实发布时影响 `@meumall/lowcode-materials-h5` 和 `@meumall/lowcode-materials-vue-h5`。
- 是否需要 changeset：当前不发布，暂不新增 changeset。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：新增 props 需要 H5 runtime 包版本支持后才能下发到真实页面。
- 是否影响 npm 发布：新增向后兼容能力，后续发布应按 minor 评估。
- 是否影响 Java 配置平台：物料白名单和属性表单可补充 `SectionContainer` 新增 props。
- 回滚目标：回滚本任务提交即可移除新增容器 props 示例和渲染能力。
- smoke check：`pnpm smoke:browser` 验证 editor 和 React H5 runtime 关键路径。

## 风险和阻塞

- 当前容器仍是单列纵向布局，不解决复杂多列或栅格诉求。
- `shadow` 只提供布尔开关，不实现多档阴影 token。
- `borderColor` 和 `borderWidth` 只影响容器外框，不承担分割线或子节点边框。

## 验证结果

- `pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- `pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- `pnpm test` 通过，83 个测试全部通过，并包含架构边界检查。
- `pnpm smoke:browser` 通过，已覆盖 Vue3 编辑器默认画布、编辑器内置 runtime 和 React H5 runtime 的增强容器布局 DOM/style。
- `git diff --check` 通过。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为增强 `SectionContainer` 基础布局配置及验证链路。 |
| 2026-08-01 | verified | 完成 React/Vue H5 `SectionContainer` 兼容增强、示例接入、文档更新、测试和 browser smoke 验证。 |
