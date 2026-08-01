# TASK-2026-0801-186-basic-form-material

## 状态

verified

## 目标

新增业务无关的 `BasicForm` 基础表单容器物料，让运营可以在 Vue3 编辑器中拖拽一个表单区块，并继续向其中添加 `BasicInput`、`BasicTextarea`、`BasicSelect`、`BasicRadioGroup`、`BasicStepper`、`BasicSwitch`、`BasicCheckbox` 等基础输入物料；React H5 runtime 和 Vue H5 runtime 使用同一 `componentName` 与 manifest 语义渲染。

## 背景

当前基础输入类物料已经比较完整，但它们更多是单个控件展示，运营要组合“报名、预约、问卷、意向收集”这类轻量页面时，还缺少一个业务无关的表单容器。已有 `LeadFormBlock` 面向留资场景，字段固定，容易把通用表单能力和业务语义混在一起。本任务新增 `BasicForm`，复用现有 Page Schema `children` 和安全 action 事件，不引入字段值采集协议、校验协议或远程提交协议。

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

- 在 React H5 物料包新增 `BasicForm` 组件与 manifest。
- 在 Vue H5 物料包新增同名 `BasicForm` 组件与 manifest。
- 扩展 editor 默认可投放容器名单，让 `BasicForm` 支持 inside 投放。
- 接入 Vue3 编辑器默认模板、React H5 runtime 示例和 browser smoke。
- 更新单测、README、架构文档、changeset 和任务/项目状态记录。

不包含：

- 不修改 Page Schema v1 字段结构。
- 不新增字段值采集、校验、表单布局 DSL、远程提交或服务端保存协议。
- 不把子节点字段值自动汇总进提交 payload。
- 不接业务数据、手机号校验、验证码、登录、风控或活动接口。
- 不新增小程序物料。

## 责任边界

当前仓库：

- 提供通用基础表单容器、manifest、编辑器容器识别、示例和 npm 发布预检。

外部系统：

- Java 配置平台后续只消费 manifest 和 schema，不需要本任务新增接口。
- 真实提交、校验、鉴权、验证码、风控和数据落库由后续宿主或 Java 平台任务承接。
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

1. 新增 React/Vue H5 `BasicForm` 组件和 manifest，确保组件名、默认 props、propsSchema 与事件对齐。
2. 扩展 editor 默认可 inside 投放容器名单，并让 Vue3 editor playground 把 `BasicForm` 识别为当前容器。
3. 接入编辑器默认模板、React H5 runtime 示例、browser smoke、单测、README、changeset 和项目记忆。

## 验收标准

- [x] React/Vue H5 物料清单都包含 `BasicForm`，且 componentName 和 manifest 语义对齐。
- [x] `BasicForm` 支持标题、说明、提交按钮、成功文案、禁用/加载态、间距、边框、圆角、背景和空态文案配置。
- [x] `BasicForm` 复用现有 `children` 渲染，不修改 Page Schema v1 字段结构。
- [x] `BasicForm` 暴露 `onSubmit` 事件，但不承诺自动采集子字段值。
- [x] Vue3 编辑器可从快捷命令添加基础表单，并能把基础输入框加入该容器。
- [x] React H5 runtime 示例可渲染基础表单。

## 实现结果

- React/Vue H5 materials 新增 `BasicForm` 组件与 manifest，支持标题、说明、children 字段区、提交按钮、成功文案、禁用/加载态、样式配置和 `onSubmit` 事件。
- `@meumall/lowcode-editor` 默认可 inside 投放容器名单新增 `BasicForm`，Vue3 editor playground 的当前容器识别自动复用同一 helper。
- Vue3 editor playground 默认模板和 React H5 runtime 示例已接入带 `BasicInput`、`BasicCheckbox` 子节点的基础表单。
- browser smoke 已覆盖物料入口、默认模板、编辑器内置 runtime、React H5 runtime，以及快捷命令添加基础表单后继续加入基础输入框。

## 验证记录

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `pnpm typecheck` | 通过 | TypeScript、Vue editor playground、React H5 runtime playground 类型检查通过。 |
| `pnpm test` | 通过 | 134 个测试通过，包含 build、architecture、editor、materials、renderer、schema 等测试。 |
| `pnpm smoke:browser` | 通过 | Vue3 编辑器、内置 runtime、React H5 runtime 均验证基础表单展示与快捷命令添加。 |
| `pnpm pack:dry-run` | 通过 | 12 个 workspace 包 dry-run 打包通过。 |

## 发布影响

- 是否需要发布：需要，后续统一 npm 发布。
- 发布对象：`@meumall/lowcode-editor`、`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不单独创建 tag/release，后续发布窗口统一处理。
- 回滚目标：回滚本次物料新增 commit 或降级到上一版 editor/materials 包。
- smoke check：通过 `pnpm smoke:browser` 验证编辑器和 React H5 runtime 渲染。

## 风险和阻塞

- 当前只支持整表单 inside 投放，不能对字段进行表单协议级校验或自动聚合字段值。
- 子节点按 schema 顺序流式排布，复杂分栏可组合 `GridContainer`，但不在本任务新增表单布局 DSL。
- 真实 npm 发布的 registry、token、access 仍由发布窗口统一确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建基础表单容器物料任务，确认可进入实现。 |
| 2026-08-01 | verified | 完成 React/Vue 物料、editor 容器识别、示例、文档、changeset 和验证。 |
