# TASK-2026-0801-199-editor-form-field-prop-guidance

## 状态

verified

## 目标

优化 Vue3 编辑器中基础表单字段的属性配置体验：运营选中 `BasicInput`、`BasicTextarea`、`BasicSelect`、`BasicRadioGroup`、`BasicStepper`、`BasicSwitch`、`BasicCheckbox` 时，`required` 和 `requiredMessage` 不再混在普通内容属性里，而是进入稳定的“表单校验”分组，并在属性面板展示清晰的必填配置提示。

## 背景

`BasicForm` 已支持基础字段值采集、required 必填校验、字段级错误态和 H5 runtime action payload。但编辑器属性面板仍按通用字段名归类，运营配置表单字段时不容易理解“必填”和“必填提示”与运行态校验的关系。该能力应先沉淀到 `@meumall/lowcode-editor` 的框架无关属性分组模型，再由 Vue3 playground 展示，方便后续迁入管理台。

## 涉及包或系统

- `@meumall/lowcode-editor`
- `apps/editor-playground`
- 文档与 AI 工作流

## 范围

包含：

- 扩展 editor prop groups API，新增稳定分组 `validation`，用于承载表单校验类属性。
- 将 `required`、`requiredMessage` 等字段归入“表单校验”分组。
- Vue3 编辑器属性面板在 `validation` 分组展示简短配置提示，说明这些配置在 `BasicForm` 提交时生效。
- 单测覆盖新分组顺序、分组元信息和 required 字段归类。
- browser smoke 覆盖属性面板可看到“表单校验”分组和提示文案。
- 同步 `docs/editor-vue-shell-components.md`、`.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md` 和 `.ai/TODO.md`。

不包含：

- 不新增或修改 Page Schema v1 结构。
- 不新增或修改 Material Manifest v1 结构。
- 不修改 React/Vue H5 runtime 校验逻辑。
- 不实现复杂校验 DSL、正则、异步校验、远程提交或服务端错误回填。
- 不把表单校验配置写入 editor 私有状态；仍然只写入物料 props。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责框架无关属性分组模型。
- Vue3 playground 负责展示分组提示和 smoke 验证。

外部系统：

- 未来 Java 管理台可复用该分组模型并替换视觉组件。
- Java/BFF、H5 宿主 action handler 仍负责服务端校验、鉴权、风控和持久化。

## 契约影响

- 是否影响跨包或跨系统契约：影响 `@meumall/lowcode-editor` 的公开属性分组枚举和展示模型；不影响 schema、manifest、renderer 或 materials runtime 契约。
- 契约文档路径：`docs/editor-vue-shell-components.md`、`.ai/AI_CONTEXT.md`
- 是否向后兼容：是。新增分组 key 只影响编辑器展示归类；旧 schema 和旧物料仍可正常编辑。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要。
- 对接说明路径：`docs/editor-vue-shell-components.md`、`.ai/AI_CONTEXT.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 扩展 `LowcodeEditorPropGroupKey`、默认顺序、分组 meta 和归类逻辑。
2. 在 Vue3 `EditorPropGroupsPanel` 对 `validation` 分组展示配置提示。
3. 更新 editor 单测、browser smoke、文档和 AI 记忆。
4. 运行类型检查、单测、browser smoke、npm pack dry-run 和 diff 检查。

## 验收标准

- [x] `required` 和 `requiredMessage` 会进入 `validation` 分组。
- [x] `validation` 分组默认显示在行为配置前，且中文标题为“表单校验”。
- [x] Vue3 编辑器选中基础表单字段时可看到“表单校验”分组和提示文案。
- [x] 属性更新仍写入原有物料 props，不改变 schema 或 manifest 结构。
- [x] 不改变 renderer、materials runtime 或包依赖方向。
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

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `pnpm typecheck` | 通过 | TypeScript 类型检查通过。 |
| `pnpm test` | 通过 | build、architecture check 和 147 个 node tests 通过。 |
| `pnpm smoke:browser` | 通过 | Vue3 编辑器属性面板可展示“表单校验”分组和 BasicForm 提交前校验提示；编辑器与 H5 runtime smoke 通过。 |
| `pnpm pack:dry-run` | 通过 | 12 个可发布包 npm pack dry-run 通过。 |
| `git diff --check` | 通过 | 未发现空白或补丁格式问题。 |

## 发布影响

- 是否需要发布：后续需要随 npm minor 发布。
- 发布对象：`@meumall/lowcode-editor`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不创建 tag/release。
- 回滚目标：回滚本任务提交即可，旧 schema、manifest、renderer 和 materials runtime 不受影响。
- smoke check：`pnpm smoke:browser` 覆盖属性面板分组展示。

## 风险和阻塞

- 风险：`validation` 分组当前只做编辑器归类和提示，不代表复杂校验协议已经存在。
- 风险：未来引入复杂校验 DSL 时，需要继续扩展 editor model，而不是把校验规则散写在 Vue 组件里。
- 阻塞：无。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备增强编辑器表单字段属性配置体验。 |
| 2026-08-01 | in_progress | 开始实现 editor validation 属性分组和 Vue3 面板提示。 |
| 2026-08-01 | verified | 完成 editor validation 属性分组、Vue3 面板提示、smoke、changeset 与 AI 记忆同步。 |
