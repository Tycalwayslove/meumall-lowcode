# TASK-2026-0801-141-basic-text-divider-materials

## 标题

补齐基础文本和分割线通用物料

## 状态

verified

## 目标

在现有内部 `MlcText` runtime primitive 基础上新增业务无关通用物料 `BasicText`，并补齐内部 `MlcDivider` primitive 与可拖拽通用物料 `DividerBlock`，让运营在 Vue3 编辑器中可以完成更基础的文字说明、提示文案和页面分隔排版，同时保持 React/Vue H5 runtime manifest 语义一致。

## 背景

上一任务已补齐 `BasicButton` 和 `BasicInput`。当前物料库已有 `SectionTitle` 和 `RichTextBlock`，但前者偏区块标题，后者偏富文本 HTML，不适合作为运营日常配置短说明、提示文案、辅助文字的轻量基础物料。页面分隔线也是活动页、推广页搭建中的高频基础排版能力，当前只能通过间距块或容器样式间接实现，运营可用性不足。

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

- 新增 React H5 `BasicText` 物料，复用内部 `MlcText`。
- 新增 Vue H5 `BasicText` 物料，保持与 React 物料同名同义。
- 新增 React/Vue 内部 `MlcDivider` primitive，并新增 `DividerBlock` 通用物料。
- 新增两个物料的 manifest、默认 props、propsSchema。
- 将两个物料加入 editor playground 默认模板和 React H5 runtime 示例。
- 更新 materials README、分层架构文档、测试、browser smoke 和 AI 事实源。

不包含：

- 不新增公开 primitives npm 包。
- 不改变 Page Schema v1 结构。
- 不改变 Material Manifest v1 字段结构。
- 不替换 `SectionTitle`、`RichTextBlock` 或 `SpacerBlock`。
- 不实现富文本编辑器、Markdown 解析器、动态表情、图文混排或复杂响应式排版。

## 责任边界

当前仓库：

- `materials-*` 负责新增通用物料及内部 primitive。
- `editor-playground` 负责展示和验证物料可添加、可配置、可渲染。
- `h5-runtime-playground` 负责验证 React H5 runtime 能消费新增物料。

外部系统：

- Java 配置平台未来负责存储包含这些物料的 Page Schema，并做物料白名单校验。
- 真实 H5 业务仓库未来通过 npm 包消费这些物料。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增向后兼容物料。
- 契约文档路径：`.ai-workspace/contracts/material-manifest-v1.md`、`docs/material-layering-architecture.md`。
- 是否向后兼容：是，新增物料和内部 primitive 不影响旧页面。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：真实 H5 接入时需确认 runtime 版本包含新增物料后再下发对应 schema。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`。
- 需要确认的角色：前端低代码维护者、Java 配置平台、H5 接入方。
- 当前确认状态：前端参考实现。

## 验收标准

- [x] React/Vue materials 均注册 `BasicText` 和 `DividerBlock`，且 `componentName` 顺序和 manifest 语义一致。
- [x] `BasicText` 复用内部 `MlcText`，支持文本、标签类型、字号、字重、行高、对齐、颜色、背景、上下留白。
- [x] `DividerBlock` 复用内部 `MlcDivider`，支持线条颜色、粗细、样式、左右缩进、上下留白和背景。
- [x] 两个物料出现在 Vue3 editor playground 物料目录和快捷命令中，并可添加到画布。
- [x] React H5 runtime 示例能渲染两个物料。
- [x] 不改变 Page Schema v1、Material Manifest v1 字段结构或旧物料语义。
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
- 是否影响 H5 接入：新增物料需要 H5 runtime 包版本支持后才能下发到真实页面。
- 是否影响 npm 发布：新增向后兼容能力，后续发布应按 minor 评估。
- 是否影响 Java 配置平台：物料白名单需要补充 `BasicText` 和 `DividerBlock`。
- 回滚目标：回滚本任务提交即可移除新增物料。
- smoke check：`pnpm smoke:browser` 验证 editor 和 React H5 runtime 关键路径。

## 风险和阻塞

- 当前 propsSchema 没有枚举 setter，`as`、`align`、`style` 暂以 input 方式配置，并在 runtime 内做容错归一。
- `BasicText` 只处理纯文本，不负责富文本安全过滤。
- `DividerBlock` 只处理单条分割线，不承担复杂布局分隔或响应式规则。

## 验证结果

- 2026-08-01：`pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- 2026-08-01：`pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 首次发现 Vue primitive 推断类型引用 `csstype` 的可移植性问题，改为本地 `DividerLineStyle` 后通过。
- 2026-08-01：`pnpm test` 通过，包含 build、架构边界检查和 79 个单测。
- 2026-08-01：`pnpm smoke:browser` 通过，覆盖 Vue3 编辑器物料目录、快捷命令添加、Vue H5 画布、编辑器内置 runtime 和 React H5 runtime。
- 2026-08-01：`git diff --check` 通过。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 `BasicText`、`DividerBlock` 通用物料及验证链路。 |
| 2026-08-01 | verified | 完成 React/Vue H5 通用物料、内部 `MlcDivider` primitive、示例、README、测试、browser smoke 和 AI 事实源更新。 |
