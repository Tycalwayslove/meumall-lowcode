# TASK-2026-0731-072-form-primitives-lead-form

## 标题

补齐表单类 runtime primitives 并新增通用留资表单物料

## 状态

verified

## 目标

在不改变 Page Schema v1、Material Manifest v1 和 npm 公开包边界的前提下，为 React/Vue H5 materials 包内部补齐第二批表单类 runtime primitives，并新增一个业务无关的 `LeadFormBlock` 通用物料，让运营可以在编辑器中拖拽配置基础留资/报名/预约表单，并在 React H5 runtime 中看到对应渲染效果。

## 背景

当前 materials 包内部已经建立 `MlcButton`、`MlcImage`、`MlcTag`、`MlcText`、`MlcPrice` 和 `h5Tokens` primitives，并已推动主要活动、导航、优惠券和业务物料复用。`.ai/TODO.md` 中仍记录第二批 `Input`、`Textarea`、`Switch`、`Stepper` 尚未建立。实际运营活动页经常需要报名、预约、留资、人数选择、是否同意规则等基础表单能力，因此本任务先在内部 primitives 原型阶段补齐最小可用表单能力，并通过一个 Generic Material 验证边界。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

包含：

- React H5 内部 primitives 增加 `MlcInput`、`MlcTextarea`、`MlcSwitch`、`MlcStepper`。
- Vue H5 内部 primitives 增加同名同语义组件。
- 新增 `LeadFormBlock` Generic Material，复用上述 primitives，不绑定 MeuMall 业务接口。
- `LeadFormBlock` 支持标题、说明、姓名/手机号/备注字段、人数步进、同意规则开关、提交按钮、背景和按钮色配置。
- React/Vue H5 materials 注册同名 manifest，并保持 propsSchema 运营可理解。
- React H5 runtime playground 和默认编辑器可见物料列表接入该物料。
- browser smoke 覆盖编辑器物料入口、默认渲染和 React H5 runtime 渲染。
- 更新任务记录和 `.ai` 项目事实源。

不包含：

- 不新增独立 `@meumall/lowcode-primitives-*` npm 包。
- 不改变 Page Schema v1 字段结构。
- 不改变 Material Manifest v1 契约字段。
- 不实现真实表单提交 API、验证码、隐私协议弹窗、风控或埋点。
- 不接入 Java 配置平台表单管理。
- 不实现表单数据持久化。

## 责任边界

当前仓库：

- materials 包负责内部 primitives 和 `LeadFormBlock` React/Vue H5 实现。
- editor playground 负责让运营能看到并配置该物料。
- h5-runtime playground 负责验证 React H5 runtime 渲染。
- browser smoke 负责覆盖关键路径。

外部系统：

- Java 配置平台、表单提交服务、风控、验证码和隐私协议中心无需变更。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无新增；仍遵循 `.ai-workspace/contracts/page-schema-v1.md` 和 `.ai-workspace/contracts/material-manifest-v1.md`。
- 是否向后兼容：是，新增物料和内部 primitives，不影响旧页面。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 将任务状态流转为 `in_progress`。
2. 梳理现有 React/Vue primitives、materials registry、runtime 示例和 smoke 覆盖点。
3. 实现 React/Vue 表单 primitives。
4. 新增 React/Vue `LeadFormBlock` 物料和 manifest。
5. 接入默认模板或 H5 runtime 示例，使编辑器和 React H5 runtime 都可验证。
6. 补充单测和 browser smoke。
7. 更新 `.ai` 状态记录并运行验证命令。

## 验收标准

- [x] React/Vue H5 内部 primitives 均包含 `MlcInput`、`MlcTextarea`、`MlcSwitch`、`MlcStepper`。
- [x] 新增 primitives 不进入 material registry。
- [x] `LeadFormBlock` 在 React/Vue materials 中 componentName 和 manifest 语义一致。
- [x] `LeadFormBlock` 是 Generic Material，不依赖 MeuMall 业务项目或业务接口。
- [x] Vue3 编辑器物料面板可看到并添加 `LeadFormBlock`。
- [x] 编辑器内置 Vue H5 画布可渲染 `LeadFormBlock`。
- [x] React H5 runtime playground 可渲染 `LeadFormBlock`。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm smoke:browser
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：使用 `pnpm smoke:browser` 验证编辑器、内置 runtime 和 React H5 runtime。

## 风险和阻塞

- 表单能力当前只做运行时展示和本地交互，不代表真实提交链路。
- `LeadFormBlock` 必须保持通用物料定位，避免提前绑定 MeuMall 业务表单接口。
- primitives 仍是内部原型，不应被记录为独立 npm 公开 API。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建任务，范围限定为内部表单 primitives 和通用留资表单物料。 |
| 2026-07-31 | in_progress | 开始实现 React/Vue 表单 primitives、通用留资表单物料和验证覆盖。 |
| 2026-07-31 | verified | 完成表单 primitives、`LeadFormBlock` React/Vue 物料、React H5 runtime 示例和 browser smoke 覆盖，验证命令通过。 |
