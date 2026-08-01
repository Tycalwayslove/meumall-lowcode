# TASK-2026-0801-177 基础弹窗通用物料

## 状态

verified

## 目标

新增业务无关的 `BasicModal` 通用物料，让运营可以在编辑器中拖拽配置基础弹窗入口、弹窗标题、说明、内容和按钮文案，并在 Vue3 编辑器画布与 React H5 runtime 中可实操预览。

## 背景

当前 runtime primitives 已有 `MlcOverlay` 和 `MlcModal`，但它们不是低代码物料，不会出现在编辑器物料库。物料库已有 `ActivityRuleModal` 业务弹窗，适合活动规则场景，但不适合作为通用说明、引导、提示、权益说明等基础弹窗。为了继续稳定基础物料库的 Overlay 方向，需要在 Generic Materials 层新增 `BasicModal`。

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

- React H5 materials 新增 `BasicModal` 组件和 manifest。
- Vue H5 materials 新增同名 `BasicModal` 组件和 manifest，保持 React/Vue `componentName`、默认 props 和 propsSchema 语义一致。
- `BasicModal` 复用 primitives 的 `MlcModal`、`MlcButton` 和 `MlcText`。
- 编辑器默认模板和 React H5 runtime 示例加入基础弹窗节点。
- browser smoke 覆盖物料存在、默认模板渲染、快捷命令添加、弹窗打开关闭和 React H5 runtime 渲染。
- 更新物料分层文档、AI 状态、测试报告和任务记录。

不包含：

- 不改变 Page Schema v1 或 Material Manifest v1 字段结构。
- 不实现嵌套子节点插槽协议。
- 不实现远程内容、表单提交、登录、领券、交易、权限、审核或个性化弹窗。
- 不新增 Java 配置平台接口。
- 不改变 `ActivityRuleModal` 业务物料。

## 责任边界

当前仓库：

- 提供业务无关基础弹窗物料和双端 H5 渲染实现。
- 保持 materials 只组合 primitives 和 manifest，不依赖业务项目。

外部系统：

- Java 配置平台后续只存储该物料节点对应的 Page Schema。
- 真实弹窗内容审核、投放规则、个性化和业务动作仍由外部服务或后续业务物料承担。

## 契约影响

- 是否影响跨包或跨系统契约：影响 Material Manifest 白名单和 `@meumall/lowcode-materials-*` 公开物料集合。
- 契约文档路径：`docs/material-layering-architecture.md`、本任务文件。
- 是否向后兼容：是，新增物料，不破坏已有页面。
- 是否需要迁移：不需要。
- 是否需要灰度或双版本兼容：不需要。

## 对接说明

- 后续 Java 配置平台需要将 `BasicModal` 加入物料白名单后才能在生产管理台开放。
- `BasicModal` 只适合静态内容提示；复杂弹窗能力应拆成独立业务物料或后续 layout/slot 协议任务。

## 验收标准

- [x] React/Vue H5 materials 均注册 `BasicModal`，且 manifest 对齐。
- [x] `BasicModal` manifest 具备按钮文案、标题、说明、内容、关闭文案、默认打开、位置、色彩、圆角和留白配置。
- [x] 编辑器物料库可搜索并添加“基础弹窗”。
- [x] Vue3 编辑器画布可打开并关闭基础弹窗。
- [x] React H5 runtime 可渲染并打开关闭基础弹窗。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
```

## 验证结果

- 2026-08-01：`pnpm typecheck` 通过。
- 2026-08-01：`pnpm test` 通过，构建、架构边界检查和 120 个 Node test 均通过。
- 2026-08-01：`pnpm smoke:browser` 通过，覆盖基础弹窗物料存在、默认模板渲染、快捷命令添加、Vue3 编辑器画布打开关闭和 React H5 runtime 打开关闭。

## 发布影响

- 是否需要发布：本任务不执行真实 npm 发布。
- 发布对象：后续发布时涉及 `@meumall/lowcode-materials-h5` 和 `@meumall/lowcode-materials-vue-h5` minor。
- 是否影响 schema 兼容性：否。
- 是否影响 H5 接入：新增可选物料，旧页面不受影响。
- 是否影响 Java 配置平台：需要后续白名单确认。
- 是否需要 GitHub tag/release：本任务不需要。
- 回滚目标：回滚本任务提交即可移除 `BasicModal` 物料。
- smoke check：`pnpm smoke:browser`。

## 风险和阻塞

- 如果把业务规则、表单提交或个性化投放混入 `BasicModal`，会破坏 Generic Material 边界；本任务仅做静态内容和基础交互。
- 当前不支持弹窗内部拖拽子节点，后续如需要复杂内容编排，应单独设计 slot/layout 协议。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为业务无关基础弹窗通用物料。 |
| 2026-08-01 | verified | 新增 React/Vue H5 `BasicModal` 通用物料、示例、changeset、smoke 覆盖和分层文档；`pnpm typecheck`、`pnpm test`、`pnpm smoke:browser` 均通过。 |
