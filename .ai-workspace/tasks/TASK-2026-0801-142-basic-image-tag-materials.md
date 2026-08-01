# TASK-2026-0801-142-basic-image-tag-materials

## 标题

补齐基础图片和标签通用物料

## 状态

verified

## 目标

在现有内部 `MlcImage`、`MlcTag` runtime primitives 基础上，新增可被运营拖拽使用的业务无关通用物料 `BasicImage` 和 `BasicTag`，让运营可以在 Vue3 编辑器中完成单图展示、活动角标、提示标签等基础搭建动作，同时保持 React/Vue H5 runtime manifest 语义一致。

## 背景

当前基础物料库已补齐 `BasicButton`、`BasicInput`、`BasicText` 和 `DividerBlock`。活动页/推广页搭建中，单图展示和标签角标同样是高频基础能力。已有 `ImageBanner` 偏横幅场景，`ImageCardGrid` 偏图片列表，业务物料中的 `MlcTag` 使用多但尚未有独立可拖拽的基础标签物料，因此需要补齐更原子的展示类通用物料。

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

- 新增 React H5 `BasicImage` 物料，复用内部 `MlcImage`。
- 新增 Vue H5 `BasicImage` 物料，保持与 React 物料同名同义。
- 新增 React H5 `BasicTag` 物料，复用内部 `MlcTag`。
- 新增 Vue H5 `BasicTag` 物料，保持与 React 物料同名同义。
- 新增两个物料的 manifest、默认 props、propsSchema。
- 将两个物料加入 editor playground 默认模板和 React H5 runtime 示例。
- 更新 materials README、分层架构文档、测试、browser smoke 和 AI 事实源。

不包含：

- 不新增公开 primitives npm 包。
- 不改变 Page Schema v1 结构。
- 不改变 Material Manifest v1 字段结构。
- 不替换 `ImageBanner`、`ImageCardGrid` 或业务物料中的标签实现。
- 不实现图片裁剪、上传、素材中心接入、热区、懒加载策略或复杂图文混排。

## 责任边界

当前仓库：

- `materials-*` 负责新增通用物料及 manifest。
- `editor-playground` 负责展示和验证物料可添加、可配置、可渲染。
- `h5-runtime-playground` 负责验证 React H5 runtime 能消费新增物料。

外部系统：

- Java 配置平台未来负责存储包含这些物料的 Page Schema，并做物料白名单校验。
- 真实 H5 业务仓库未来通过 npm 包消费这些物料。
- 真实素材中心未来负责图片上传、裁剪、审核和资源权限。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增向后兼容物料。
- 契约文档路径：`.ai-workspace/contracts/material-manifest-v1.md`、`docs/material-layering-architecture.md`。
- 是否向后兼容：是，新增物料不影响旧页面。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：真实 H5 接入时需确认 runtime 版本包含新增物料后再下发对应 schema。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`。
- 需要确认的角色：前端低代码维护者、Java 配置平台、H5 接入方、素材中心。
- 当前确认状态：前端参考实现。

## 验收标准

- [x] React/Vue materials 均注册 `BasicImage` 和 `BasicTag`，且 `componentName` 顺序和 manifest 语义一致。
- [x] `BasicImage` 复用内部 `MlcImage`，支持图片地址、替代文本、比例、填充模式、圆角、背景、上下留白和空图 fallback。
- [x] `BasicTag` 复用内部 `MlcTag`，支持标签文案、tone、颜色、背景、圆角、对齐、字号和上下留白。
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
- 是否影响 Java 配置平台：物料白名单需要补充 `BasicImage` 和 `BasicTag`。
- 回滚目标：回滚本任务提交即可移除新增物料。
- smoke check：`pnpm smoke:browser` 验证 editor 和 React H5 runtime 关键路径。

## 风险和阻塞

- 当前 propsSchema 没有枚举 setter，`ratio`、`fit`、`tone`、`align` 暂以 input 方式配置，并在 runtime 内做容错归一。
- `BasicImage` 只处理远程 URL 展示，不承担素材上传、图片裁剪或资源审核。
- `BasicTag` 只处理单标签展示，不承担多标签列表、筛选器或业务状态标签规则。

## 验证结果

- 2026-08-01：`pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- 2026-08-01：`pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- 2026-08-01：`pnpm test` 通过，包含 build、架构边界检查和 81 个单测。
- 2026-08-01：`pnpm smoke:browser` 通过，覆盖 Vue3 编辑器物料目录、快捷命令添加、Vue H5 画布、编辑器内置 runtime 和 React H5 runtime。
- 2026-08-01：`git diff --check` 通过。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 `BasicImage`、`BasicTag` 通用物料及验证链路。 |
| 2026-08-01 | verified | 完成 React/Vue H5 通用物料、示例、README、测试、browser smoke 和 AI 事实源更新。 |
