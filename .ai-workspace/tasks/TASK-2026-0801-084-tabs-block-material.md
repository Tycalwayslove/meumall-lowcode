# TASK-2026-0801-084-tabs-block-material

## 标题

新增 TabsBlock 通用物料

## 状态

verified

## 目标

新增一个可配置的 `TabsBlock` 通用物料，覆盖 React H5、Vue H5、编辑器物料库、React H5 runtime 示例、测试和浏览器 smoke，提升运营搭建 H5 页面时的基础内容分组能力。

## 背景

物料分层文档已将 `Tabs` 列为第二批 runtime primitives，并将 `TabsBlock` 作为后续可增加的 Generic Material。当前物料库已有标题、图片、导航、表单、商品、优惠券和活动类物料，但缺少“同一页面内切换内容分组”的通用能力。`TabsBlock` 不绑定 MeuMall 业务接口，适合用于活动规则分组、会场分组、FAQ、商品专题内容分组等通用运营场景。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

包含：

- 在 React H5 materials 中新增 `TabsBlock` 组件、manifest 和导出。
- 在 Vue H5 materials 中新增同名 `TabsBlock` 组件、manifest 和导出。
- 保持 React/Vue material manifest `componentName` 对齐。
- 在编辑器物料库中可搜索、可添加、可通过属性面板编辑 tabs 数组。
- 在 React H5 runtime 示例中展示 `TabsBlock`。
- 补充 materials 单测验证注册、manifest 字段和 primitive 复用。
- 补充 browser smoke 覆盖编辑器物料入口、默认模板/示例渲染和 React H5 runtime 渲染。
- 更新项目事实源和任务记录。

不包含：

- 不新增独立 primitives npm 包。
- 不修改 Page Schema v1 字段。
- 不接入业务数据源。
- 不实现嵌套低代码节点插槽。
- 不实现复杂可拖拽 tab 内容容器。
- 不新增 changeset 或真实 npm 发布。

## 责任边界

当前仓库：

- `packages/materials-h5` 和 `packages/materials-vue-h5` 提供同名 H5 runtime 物料。
- `apps/editor-playground` 通过物料 manifest 自动展示和编辑该物料。
- `apps/h5-runtime-playground` 提供 React runtime 示例。

外部系统：

- Java 配置平台后续可按 manifest 白名单开放该物料，本任务不实现 Java 服务端。
- `hybird-meumall` 后续通过 npm 包消费该物料，本任务不改真实 H5 业务仓库。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 Material Manifest componentName `TabsBlock`。
- 契约文档路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`。
- 是否向后兼容：是，新增物料，不改变既有 schema 或既有物料语义。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是，更新 materials README。
- 对接说明路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 设计 `TabsBlock` props、默认 tabs 和 manifest。
2. 实现 React/Vue 同名物料并复用现有内部 primitives。
3. 接入 React H5 runtime 示例，确保编辑器物料库自动可用。
4. 补充 materials 测试和 browser smoke。
5. 更新 README、项目事实源和任务状态。
6. 运行验证命令并记录结果。

## 验收标准

- [x] React H5 materials 导出 `TabsBlock`。
- [x] Vue H5 materials 导出 `TabsBlock`。
- [x] React/Vue material manifest `componentName` 对齐。
- [x] `TabsBlock` manifest 字段可被编辑器属性面板编辑，`items` 使用 `textarea` setter。
- [x] 编辑器物料库可看到 `TabsBlock`。
- [x] React H5 runtime 示例可渲染 `TabsBlock`。
- [x] 单测覆盖 `TabsBlock` 注册和 primitive 复用。
- [x] browser smoke 覆盖编辑器和 React H5 runtime 中的 `TabsBlock`。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm check:architecture` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `pnpm pack:dry-run` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm check:architecture
pnpm smoke:browser
pnpm pack:dry-run
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：未来 npm 发布后 H5 可使用新增物料；本任务不改真实 H5 业务仓库。
- 是否影响 npm 发布：新增 materials 包 API，未来真实 npm 发布时应作为 minor 变更评估；本任务不执行发布。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证编辑器、内置 runtime 和 React H5 runtime 仍可渲染。

## 风险和阻塞

- 当前 `TabsBlock` 内容为静态数组配置，不支持 tab 面板内嵌低代码节点；后续如需复杂布局，应另行设计 slot/children 协议。
- 当前 tab 切换是 runtime 本地交互，不写回 schema，不参与埋点或业务 action。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 `TabsBlock` 通用物料。 |
| 2026-08-01 | in_progress | 开始实现 React/Vue `TabsBlock`、示例、测试、smoke 和文档事实源。 |
| 2026-08-01 | verified | 完成 React/Vue `TabsBlock`、默认大促模板、React H5 runtime 示例、materials 单测、browser smoke、README 和项目事实源更新；`pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm check:architecture`、`pnpm smoke:browser`、`pnpm pack:dry-run` 均通过。 |
