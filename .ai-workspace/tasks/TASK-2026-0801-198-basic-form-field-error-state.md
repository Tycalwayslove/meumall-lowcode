# TASK-2026-0801-198-basic-form-field-error-state

## 状态

verified

## 目标

让 React/Vue H5 `BasicForm` 的 required 校验失败能回显到具体基础字段：运营在编辑器预览或 H5 runtime 中提交空必填项时，除表单级错误列表外，对应 `BasicInput`、`BasicTextarea`、`BasicSelect`、`BasicRadioGroup`、`BasicStepper`、`BasicSwitch`、`BasicCheckbox` 也展示字段级错误态和错误文案。

## 背景

上一任务已经让 `BasicForm` 支持本地必填校验和 action 阻断，但错误只集中在表单级列表。真实运营搭建报名、留资或偏好收集表单时，需要快速知道哪个字段需要处理；字段级错误态可以显著提升实操体验，同时仍保持 schema、manifest 和远程提交协议不扩张。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- 文档与 AI 工作流

## 范围

包含：

- `BasicForm` submit 失败时按子级基础控件 node id 派发字段错误。
- React H5 基础字段控件展示错误 class、`aria-invalid` 和字段错误文案。
- Vue H5 基础字段控件展示错误 class、`aria-invalid` 和字段错误文案。
- 校验通过后清理上一轮字段错误态，并继续执行原有 `onSubmit` action。
- browser smoke 覆盖编辑器预览和 React H5 runtime 的字段级错误态。
- README、changeset、项目状态和任务验证记录同步。

不包含：

- 不新增或修改 Page Schema v1 结构。
- 不新增或修改 Material Manifest v1 结构。
- 不实现正则、长度、手机号、验证码、异步校验、联动校验、动态数组字段或复杂校验 DSL。
- 不实现远程提交、服务端保存、Java 接口、登录、风控或业务错误展示。
- 不修改 `LeadFormBlock` 的业务表单逻辑。
- 不把字段级错误态写入 editor 状态或 Page Schema。

## 责任边界

当前仓库：

- materials 包负责运行态字段错误映射、字段错误展示和无障碍标记。
- playground 和 smoke 负责演示和验证。

外部系统：

- 未来 Java/BFF 或 H5 宿主 action handler 负责服务端校验、鉴权、风控、持久化和业务错误展示。
- 未来管理台 shell 可基于同一运行态能力扩展字段定位、错误聚焦或发布前表单规则提示，但不属于本任务。

## 契约影响

- 是否影响跨包或跨系统契约：影响 React/Vue materials 的运行态展示语义，不改变 schema、manifest 或 renderer 公共协议。
- 契约文档路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`、`.ai/AI_CONTEXT.md`
- 是否向后兼容：是。旧 schema 不配置 `required` 时行为保持原样；字段错误态仅在 submit 校验失败后出现。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要。
- 对接说明路径：materials README、`.ai/AI_CONTEXT.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 为 React/Vue `BasicForm` 建立运行态字段错误上下文或等价机制。
2. 为 React/Vue 基础字段控件接入字段错误态、错误文案和 `aria-invalid`。
3. 更新 browser smoke、README、changeset、项目状态和任务记录。
4. 运行类型检查、单测、browser smoke、npm pack dry-run 和 diff 检查。

## 验收标准

- [x] required 校验失败时，表单级错误列表仍展示。
- [x] required 校验失败时，对应 React/Vue 基础字段控件展示字段级错误文案。
- [x] required 校验失败时，对应输入/选择/开关/复选控件带有 `aria-invalid="true"` 或等价无障碍错误标记。
- [x] 校验通过后字段级错误态清理，并正常触发 `onSubmit` action。
- [x] 不改变 Page Schema v1、Material Manifest v1 结构或包依赖方向。
- [x] 验证命令通过，并在任务文件记录结果。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
pnpm pack:dry-run
git diff --check
```

## 发布影响

- 是否需要发布：后续需要随 npm minor 发布。
- 发布对象：`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不创建 tag/release。
- 回滚目标：回滚本任务提交即可，旧 schema、旧 manifest 和旧 renderer 结构不受影响。
- smoke check：`pnpm smoke:browser` 覆盖基础表单字段级错误态失败与成功清理。

## 风险和阻塞

- 风险：当前字段级错误态只覆盖基础字段控件，不覆盖 `LeadFormBlock` 或未来复杂自定义字段。
- 风险：字段定位依赖基础字段物料 node id；如果未来引入动态数组字段或复合字段，需要单独设计字段 key。
- 阻塞：无。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备增强 `BasicForm` 字段级错误态。 |
| 2026-08-01 | in_progress | 开始实现 React/Vue H5 基础字段错误态。 |
| 2026-08-01 | verified | 完成 React/Vue H5 字段级错误态、smoke、README、changeset 与 AI 记忆同步。 |

## 验证结果

| 日期 | 命令 | 结果 | 说明 |
| --- | --- | --- | --- |
| 2026-08-01 | `pnpm typecheck` | 通过 | 根 TS project references、Vue3 editor playground、React H5 runtime playground 类型检查通过。 |
| 2026-08-01 | `pnpm test` | 通过 | build、架构边界检查和 147 条 node test 全部通过。 |
| 2026-08-01 | `pnpm smoke:browser` | 通过 | Vue3 编辑器和 React H5 runtime 覆盖字段级 invalid/error 展示、修正后清理和成功提交。 |
| 2026-08-01 | `pnpm pack:dry-run` | 通过 | 12 个可发布包 npm pack dry-run 通过。 |
| 2026-08-01 | `git diff --check` | 通过 | 无尾随空白或 diff 格式问题。 |
