# TASK-2026-0801-140-basic-button-input-materials

## 标题

补齐基础按钮和基础输入框通用物料

## 状态

verified

## 目标

在现有内部 `MlcButton`、`MlcInput` runtime primitives 基础上，新增可被运营拖拽使用的业务无关通用物料 `BasicButton` 和 `BasicInput`，同时对齐 React H5 runtime、Vue3 编辑器预览、物料 manifest、README、测试和 browser smoke，为后续继续建设通用物料库打好更稳定的基础。

## 背景

项目已按 `docs/material-layering-architecture.md` 建立 Design Tokens、Runtime Primitives、Generic Materials、Business Materials 的分层思路，并在 React/Vue materials 包内部沉淀了 `MlcButton`、`MlcInput` 等 primitives。当前物料库已有 `ActionButton` 和 `LeadFormBlock`，但它们分别偏营销 CTA 和组合表单，不适合作为最基础的业务无关按钮/输入框物料。用户明确希望先把 `button/input` 这类基础组件设计好，再基于基础组件搭建通用物料库。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

包含：

- 新增 React H5 `BasicButton` 和 `BasicInput` 物料实现，复用内部 `MlcButton`、`MlcInput`。
- 新增 Vue H5 `BasicButton` 和 `BasicInput` 物料实现，保持与 React 物料同名同义。
- 新增两个物料的 manifest、默认 props、propsSchema 和必要事件。
- 将两个通用物料加入 editor playground 物料库，并通过现有物料目录、快捷命令、属性面板和画布渲染链路自然生效。
- 将两个通用物料加入 React H5 runtime 示例，用于证明独立 H5 renderer 可消费。
- 更新 materials README、测试、browser smoke、AI 事实源。

不包含：

- 不新增公开 primitives npm 包。
- 不改变 Page Schema v1 结构。
- 不改变 Material Manifest v1 字段结构。
- 不替换 `ActionButton` 或 `LeadFormBlock`。
- 不接真实表单提交、跳转桥、埋点或后端接口。
- 不实现复杂表单校验、表单编排器或容器内嵌表单布局。

## 责任边界

当前仓库：

- `materials-*` 负责新增通用物料及 manifest。
- `editor-playground` 负责展示和验证物料可拖拽/可添加/可配置。
- `h5-runtime-playground` 负责验证 React H5 runtime 能渲染新增物料。

外部系统：

- Java 配置平台未来负责存储包含这些物料的 Page Schema，并做物料白名单校验。
- 真实 H5 业务仓库未来通过 npm 包消费这些物料。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增向后兼容物料。
- 契约文档路径：`.ai-workspace/contracts/material-manifest-v1.md`、`docs/material-layering-architecture.md`。
- 是否向后兼容：是，新增物料不影响旧页面。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：真实 H5 接入时需确认 runtime 版本包含新增物料后再下发对应 schema。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`。
- 需要确认的角色：前端低代码维护者、Java 配置平台、H5 接入方。
- 当前确认状态：前端参考实现。

## 验收标准

- [x] React/Vue materials 均注册 `BasicButton` 和 `BasicInput`，且 `componentName` 顺序和 manifest 语义一致。
- [x] `BasicButton` 复用内部 `MlcButton`，支持文案、变体、block、disabled、loading、颜色、圆角、上下留白和 `onClick` 事件。
- [x] `BasicInput` 复用内部 `MlcInput`，支持标签、提示、默认值、类型、disabled、颜色、圆角、上下留白和 `onChange` 事件。
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
- 是否影响 Java 配置平台：物料白名单需要补充 `BasicButton` 和 `BasicInput`。
- 回滚目标：回滚本任务提交即可移除新增物料。
- smoke check：`pnpm smoke:browser` 验证 editor 和 React H5 runtime 关键路径。

## 风险和阻塞

- 当前 propsSchema 没有枚举 setter，`variant`、`size`、`type` 暂以 input 方式配置，并在 runtime 内做容错归一。
- `BasicInput` 只做本地输入交互，不持久化输入值，不承担真实表单提交。
- 后续如果抽独立 primitives 包，需要再评估公开 API、样式 token 和版本治理。

## 验证结果

- 2026-08-01：`pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- 2026-08-01：`pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- 2026-08-01：`pnpm test` 通过，包含 build、架构边界检查和 77 个单测。
- 2026-08-01：`pnpm smoke:browser` 通过，覆盖 Vue3 编辑器物料目录、快捷命令添加、Vue H5 画布、编辑器内置 runtime 和 React H5 runtime。
- 2026-08-01：`git diff --check` 通过。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 `BasicButton`、`BasicInput` 通用物料及验证链路。 |
| 2026-08-01 | verified | 完成 React/Vue H5 通用物料、示例、README、测试、browser smoke 和 AI 事实源更新。 |
