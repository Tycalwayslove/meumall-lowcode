# TASK-2026-0801-196-basic-form-field-values

## 状态

verified

## 目标

让 `BasicForm` 在 React/Vue H5 runtime 中提交时自动携带其子级基础表单控件的当前值，使运营用现有基础物料搭出的报名、留资、偏好收集表单具备可执行的数据提交基础。

## 背景

当前 `BasicForm` 已作为容器物料支持向内部加入 `BasicInput`、`BasicTextarea`、`BasicSelect`、`BasicRadioGroup`、`BasicStepper`、`BasicSwitch`、`BasicCheckbox` 等基础控件，并能触发 `onSubmit` 安全 action。但 `onSubmit` payload 只包含 `formId` 和 `childCount`，没有字段值。运营搭建活动表单后，宿主 action 或未来 Java/BFF 难以拿到提交数据，实操闭环仍不完整。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `@meumall/lowcode-core`
- `@meumall/lowcode-renderer-h5`
- `@meumall/lowcode-renderer-vue-h5`
- `@meumall/lowcode-adapters`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- 文档与 AI 工作流

## 范围

包含：

- React/Vue H5 `BasicForm` 在 submit 时收集子节点基础表单控件的当前值。
- React/Vue H5 基础表单控件向 DOM 暴露稳定的字段标识和值载体。
- payload 增加 `values`、`fieldLabels`、`fieldCount` 等向后兼容字段。
- renderer 事件桥把物料事件 payload 透传到 action context 的 `event` 字段。
- React/Vue H5 manifest 文案更新，说明 `BasicForm` 会采集基础控件值。
- 单元测试和 browser smoke 覆盖表单提交 payload。
- README、changeset、项目状态和任务验证记录同步。

不包含：

- 不新增或修改 Page Schema v1 字段。
- 不新增或修改 Material Manifest v1 字段结构。
- 不实现表单校验、验证码、登录、风控、远程提交、服务端保存或 Java 接口。
- 不实现复杂嵌套表单、动态数组字段、文件上传或业务字段类型 DSL。
- 不修改 `LeadFormBlock` 的业务表单逻辑。

## 责任边界

当前仓库：

- materials 包负责基础控件 DOM 字段标识、当前值维护和 `BasicForm` submit payload。
- runtime/editor playground 负责 smoke 中的 action 反馈和演示验证。

外部系统：

- 未来 Java/BFF 或 H5 宿主 action handler 负责接收 payload、校验、鉴权、风控、持久化和业务错误展示。

## 契约影响

- 是否影响跨包或跨系统契约：影响 `BasicForm.onSubmit` runtime payload 和 action context 的向后兼容扩展，不影响 schema/manifest 结构。
- 契约文档路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`、`.ai/AI_CONTEXT.md`
- 是否向后兼容：是，原有 `formId`、`childCount` 保留，仅新增 payload 字段。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要。
- 对接说明路径：materials README、`.ai/AI_CONTEXT.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 为 React/Vue 基础表单控件补充稳定 DOM 字段标识和值载体。
2. 为 React/Vue `BasicForm` submit 补充字段值采集 payload。
3. 补 React materials 单测和 browser smoke。
4. 更新 README、changeset、项目状态和任务记录。

## 验收标准

- [x] `BasicForm.onSubmit` payload 保留 `formId`、`childCount`。
- [x] `BasicForm.onSubmit` payload 包含当前基础控件值、字段标签和字段数量。
- [x] React/Vue H5 基础控件字段采集语义保持一致。
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

## 验证结果

| 日期 | 命令 | 结果 | 说明 |
| --- | --- | --- | --- |
| 2026-08-01 | `pnpm typecheck` | 通过 | TypeScript project references、Vue editor playground、React H5 runtime playground 类型检查均通过。 |
| 2026-08-01 | `pnpm test` | 通过 | build、architecture check 和 146 个 node test 均通过。 |
| 2026-08-01 | `pnpm smoke:browser` | 通过 | 覆盖 Vue3 编辑器预览、React H5 runtime、HTTP 配置平台/数据源/action，以及基础表单提交值透传。 |
| 2026-08-01 | `pnpm pack:dry-run` | 通过 | 12 个可发布包 npm pack dry-run 通过。 |
| 2026-08-01 | `git diff --check` | 通过 | 无 whitespace diff 问题。 |

## 发布影响

- 是否需要发布：后续需要随 npm minor 发布。
- 发布对象：`@meumall/lowcode-core`、`@meumall/lowcode-renderer-h5`、`@meumall/lowcode-renderer-vue-h5`、`@meumall/lowcode-adapters`、`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不创建 tag/release。
- 回滚目标：回滚本任务提交即可，旧 schema、旧 manifest 和旧 renderer 结构不受影响。
- smoke check：`pnpm smoke:browser` 覆盖基础表单提交 payload。

## 风险和阻塞

- 风险：当前只采集基础表单控件，不覆盖任意自定义业务物料字段。
- 风险：字段名优先用节点 id，不提供运营自定义字段名 DSL，后续真实业务接入时可单独设计可选 manifest/schema 能力。
- 阻塞：无。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备增强 `BasicForm` 基础字段值采集能力。 |
| 2026-08-01 | verified | 已实现基础控件字段采集、runtime `context.event` 透传、README/changeset/AI 记忆同步，并完成验证命令。 |
