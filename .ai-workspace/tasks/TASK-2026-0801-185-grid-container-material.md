# TASK-2026-0801-185-grid-container-material

## 状态

verified

## 目标

新增业务无关的 `GridContainer` 网格容器物料，让运营可以在 Vue3 编辑器中拖拽一个 2/3 列布局容器，并继续向容器内部添加物料；React H5 runtime 和 Vue H5 runtime 使用同一 `componentName` 与 manifest 语义渲染。

## 背景

当前 `SectionContainer` 是单列嵌套容器，已经支撑分组、留白、边框和子节点间距。真实活动页经常需要两列或三列模块组合，如果继续把多列能力塞进 `SectionContainer`，会让单列容器承担复杂布局语义。`docs/material-layering-architecture.md` 已要求多列、栅格或插槽协议作为独立 layout material/协议任务设计，因此本任务新增独立 `GridContainer`，但仍复用现有 Page Schema `children`，不引入 slot 协议。

## 涉及包或系统

- `@meumall/lowcode-editor`
- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `docs/material-layering-architecture.md`
- `.ai-workspace`
- `.ai`
- npm / GitHub

## 范围

包含：

- 在 React H5 物料包新增 `GridContainer` 组件与 manifest。
- 在 Vue H5 物料包新增同名 `GridContainer` 组件与 manifest。
- 扩展 editor 默认可投放容器名单，让 `GridContainer` 支持 inside 投放。
- 接入 Vue3 编辑器默认模板、React H5 runtime 示例和 browser smoke。
- 更新单测、README、架构文档、changeset 和任务/项目状态记录。

不包含：

- 不修改 Page Schema v1 字段结构。
- 不新增多 slot/命名 slot/响应式断点协议。
- 不实现栅格单元格级投放、跨列合并、拖拽调列宽或绝对定位。
- 不接业务数据、商品、优惠券或活动接口。
- 不新增小程序物料。

## 责任边界

当前仓库：

- 提供通用网格容器物料、manifest、编辑器容器识别、示例和 npm 发布预检。

外部系统：

- Java 配置平台后续只消费 manifest 和 schema，不需要本任务新增接口。
- `hybird-meumall` 后续通过 npm 包升级获得该物料能力，不需要本任务改业务仓库。

## 契约影响

- 是否影响跨包或跨系统契约：影响 Material Manifest 注册清单、editor 默认容器行为和 npm 包公开导出。
- 契约文档路径：`.ai-workspace/contracts/material-manifest-v1.md`、`docs/material-layering-architecture.md`
- 是否向后兼容：是。新增物料和默认容器名单，不改变旧页面 schema 或旧物料渲染语义。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要，写入物料包 README 和架构文档。
- 对接说明路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`、`docs/material-layering-architecture.md`
- 需要确认的角色：npm 管理员 / H5 接入方
- 当前确认状态：无需阻塞，等待真实 npm 发布窗口统一确认。

## 实现计划

1. 新增 React/Vue H5 `GridContainer` 组件和 manifest，确保组件名、默认 props、propsSchema 对齐。
2. 扩展 editor 默认可 inside 投放容器名单，并让 Vue3 editor playground 把 `GridContainer` 识别为当前容器。
3. 接入编辑器默认模板、React H5 runtime 示例、browser smoke、单测、README、changeset 和项目记忆。

## 验收标准

- [x] React/Vue H5 物料清单都包含 `GridContainer`，且 componentName 和 manifest 语义对齐。
- [x] `GridContainer` 支持 `columns`、`gap`、`padding`、边框、圆角、背景和空态文案配置。
- [x] `GridContainer` 复用现有 `children` 渲染，不修改 Page Schema v1 字段结构。
- [x] Vue3 编辑器可从快捷命令添加网格容器，并能把物料加入该容器。
- [x] React H5 runtime 示例可渲染网格容器。

## 实现结果

- React/Vue H5 materials 新增 `GridContainer` 组件与 manifest，默认 2 列，支持 2/3 列、间距、留白、边框、圆角、背景、阴影、标题、说明和空态。
- `@meumall/lowcode-editor` 新增 `LOWCODE_EDITOR_DEFAULT_CANVAS_INSIDE_COMPONENT_NAMES` 和 `isLowcodeEditorContainerComponentName`，统一默认容器判断，避免 playground 继续硬编码组件名。
- Vue3 editor playground 默认模板、快捷命令添加、当前容器识别和 inside 投放已接入 `GridContainer`。
- React H5 runtime 示例已接入 `GridContainer`，验证同一 Page Schema `children` 可在 H5 runtime 渲染网格。

## 验证记录

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `pnpm typecheck` | 通过 | TypeScript 类型检查通过。 |
| `pnpm test` | 通过 | 133 个测试通过，包含 architecture、editor、materials、renderer、schema 等测试。 |
| `pnpm smoke:browser` | 通过 | Vue3 编辑器、内置 runtime、React H5 runtime 均验证网格容器展示与快捷命令添加。 |
| `pnpm pack:dry-run` | 通过 | 12 个 workspace 包 dry-run 打包通过。 |

## 发布影响

- 是否需要发布：需要，后续统一 npm 发布。
- 发布对象：`@meumall/lowcode-editor`、`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不单独创建 tag/release，后续发布窗口统一处理。
- 回滚目标：回滚本次物料新增 commit 或降级到上一版 editor/materials 包。
- smoke check：通过 `pnpm smoke:browser` 验证编辑器和 React H5 runtime 渲染。

## 风险和阻塞

- 当前只支持整容器 inside 投放，不能精确选择网格单元格；子节点按 schema 顺序自动流式排布。
- 真实 npm 发布的 registry、token、access 仍由发布窗口统一确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建网格容器物料任务，确认可进入实现。 |
| 2026-08-01 | verified | 完成 React/Vue 物料、editor 容器识别、示例、文档、changeset 和验证。 |
