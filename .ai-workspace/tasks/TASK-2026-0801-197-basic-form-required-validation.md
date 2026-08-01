# TASK-2026-0801-197-basic-form-required-validation

## 状态

verified

## 目标

让 React/Vue H5 `BasicForm` 支持基础必填校验：运营用 `BasicInput`、`BasicTextarea`、`BasicSelect`、`BasicRadioGroup`、`BasicStepper`、`BasicSwitch`、`BasicCheckbox` 组合表单时，可以通过物料 props 标记必填字段；提交时若校验不通过，runtime 展示错误提示并阻断 action 执行。

## 背景

`BasicForm` 已能采集子级基础控件当前值，并通过 renderer/adapters 透传到 action context。但实操搭建报名、留资或偏好收集表单时，运营至少需要必填校验，避免空昵称、未勾选协议等明显错误直接进入 action handler 或未来 Java/BFF。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- 文档与 AI 工作流

## 范围

包含：

- 为 React/Vue H5 基础表单控件增加 `required`、`requiredMessage` 物料 props。
- `BasicForm` submit 时读取基础控件字段元数据并做必填校验。
- 校验失败时展示表单级错误提示，且不触发 `onSubmit` action。
- 校验通过时继续保留上一轮字段值 payload，并附带 `valid`、`errorCount`、`errors` 等向后兼容字段。
- 默认大促模板和 React H5 runtime 示例接入必填输入框、必填复选框。
- browser smoke 覆盖校验失败阻断和校验通过提交两条路径。
- README、changeset、项目状态和任务验证记录同步。

不包含：

- 不新增或修改 Page Schema v1 结构。
- 不新增或修改 Material Manifest v1 结构。
- 不实现正则、长度、手机号、验证码、异步校验、联动校验、动态数组字段或复杂校验 DSL。
- 不实现远程提交、服务端保存、Java 接口、登录、风控或业务错误展示。
- 不修改 `LeadFormBlock` 的业务表单逻辑。

## 责任边界

当前仓库：

- materials 包负责基础控件必填元数据、`BasicForm` 本地必填校验和错误提示。
- playground 和 smoke 负责演示和验证。

外部系统：

- 未来 Java/BFF 或 H5 宿主 action handler 负责服务端校验、鉴权、风控、持久化和业务错误展示。

## 契约影响

- 是否影响跨包或跨系统契约：影响 React/Vue materials 的公开物料 props 和 `BasicForm.onSubmit` runtime payload 的向后兼容扩展。
- 契约文档路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`、`.ai/AI_CONTEXT.md`
- 是否向后兼容：是。旧 schema 不配置 `required` 时行为保持原样；旧 action handler 可忽略新增 payload 字段。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要。
- 对接说明路径：materials README、`.ai/AI_CONTEXT.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 为 React/Vue 基础控件隐藏字段补充 required 元数据。
2. 为 React/Vue `BasicForm` submit 增加必填校验、错误提示和 action 阻断。
3. 更新 manifest、默认模板、React H5 示例和 browser smoke。
4. 更新 README、changeset、项目状态和任务记录。

## 验收标准

- [x] 未配置 `required` 的旧基础表单仍可正常提交。
- [x] 配置 `required` 的空字符串/未选/未勾选字段会阻断 `onSubmit` action。
- [x] 校验失败时 React/Vue H5 runtime 都展示表单级错误提示。
- [x] 校验通过时 `BasicForm.onSubmit` payload 保留字段值，并包含 `valid`、`errorCount`、`errors`。
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
- smoke check：`pnpm smoke:browser` 覆盖基础表单必填校验失败与成功提交。

## 风险和阻塞

- 风险：当前只做本地必填校验，不覆盖真实服务端规则。
- 风险：错误提示为表单级列表，不做字段级红框定位，后续可在基础控件 props 与编辑器交互中继续增强。
- 阻塞：无。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备增强 `BasicForm` 基础必填校验能力。 |
| 2026-08-01 | in_progress | 开始实现 React/Vue H5 基础表单 required 必填校验。 |
| 2026-08-01 | verified | 完成 React/Vue H5 必填校验实现、模板示例、smoke、README、changeset 与 AI 记忆同步。 |

## 验证结果

| 日期 | 命令 | 结果 | 说明 |
| --- | --- | --- | --- |
| 2026-08-01 | `pnpm typecheck` | 通过 | 根 TS project references、Vue3 editor playground、React H5 runtime playground 类型检查通过。 |
| 2026-08-01 | `pnpm test` | 通过 | build、架构边界检查和 147 条 node test 全部通过。 |
| 2026-08-01 | `pnpm smoke:browser` | 通过 | Vue3 编辑器与 React H5 runtime 覆盖基础表单必填失败阻断和成功提交。 |
| 2026-08-01 | `pnpm pack:dry-run` | 通过 | 12 个可发布包 npm pack dry-run 通过。 |
| 2026-08-01 | `git diff --check` | 通过 | 无尾随空白或 diff 格式问题。 |
