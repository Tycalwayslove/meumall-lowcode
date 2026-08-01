# TASK-2026-0801-200-primitives-form-field-api

## 状态

verified

## 目标

稳定 React/Vue H5 runtime primitives 的基础表单字段 API：把表单字段隐藏描述、字段值格式化、字段值解析、空值判断和必填提示推导沉淀到 primitives 包，供 `BasicForm` 与基础输入类通用物料复用，减少后续新增表单物料时重复约定字段语义。

## 背景

`BasicForm` 已经可以采集子级基础控件值，并支持 `required/requiredMessage` 本地必填校验。当前 React/Vue materials 包内部各自维护 `data-mlc-form-field-*` 属性、字段类型解析、空值判断和必填提示推导逻辑。该逻辑属于业务无关的 H5 runtime primitive 协议，而不是低代码 manifest 或业务物料语义，应前移到 primitives 包，作为后续基础组件稳定 API 的一部分。

## 涉及包或系统

- `@meumall/lowcode-primitives-react-h5`
- `@meumall/lowcode-primitives-vue-h5`
- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- 文档与 AI 工作流

## 范围

包含：

- 在 React/Vue primitives 包导出业务无关的表单字段类型、隐藏字段属性 helper、字段值格式化/解析、空值判断和必填提示 helper。
- React/Vue materials 的 `BasicForm` 与基础字段物料改为复用 primitives helper。
- 补充 primitives 单测，覆盖 string/number/boolean 字段格式化、解析、空值判断和必填提示。
- 更新 primitives README、物料分层文档、AI 记忆和 changeset。

不包含：

- 不新增或修改 Page Schema v1 结构。
- 不新增或修改 Material Manifest v1 结构。
- 不新增复杂表单校验 DSL、正则、长度、异步校验或远程提交协议。
- 不改变 `BasicForm` 当前提交 payload 字段名和运行时行为。
- 不新增业务表单物料或接入 Java/BFF 表单提交服务。

## 责任边界

当前仓库：

- primitives 包负责业务无关的 H5 字段描述 helper。
- materials 包负责把 Lowcode node/props 组合为基础输入物料和 `BasicForm`。

外部系统：

- Java/BFF、H5 宿主 action handler 仍负责远程提交、服务端校验、登录、权限、风控和持久化。

## 契约影响

- 是否影响跨包或跨系统契约：影响 `@meumall/lowcode-primitives-react-h5` 与 `@meumall/lowcode-primitives-vue-h5` 的公开 API；不影响 schema、manifest、renderer 或 H5 runtime 集成契约。
- 契约文档路径：`docs/material-layering-architecture.md`、`packages/primitives-react-h5/README.md`、`packages/primitives-vue-h5/README.md`
- 是否向后兼容：是。新增 helper，旧页面和旧物料 schema 继续可渲染。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要。
- 对接说明路径：`docs/material-layering-architecture.md`、primitives README、`.ai/AI_CONTEXT.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 在 React/Vue primitives 包新增并导出 `MlcFormFieldType`、`createMlcFormFieldDataAttributes`、`formatMlcFormFieldValue`、`parseMlcFormFieldValue`、`isMlcFormFieldEmpty` 和 `createMlcFormRequiredMessage`。
2. React/Vue materials 的 `BasicForm` 字段采集和基础字段隐藏 input 改为复用 primitives helper。
3. 补充 primitives 单测、README、物料分层文档、changeset 和 AI 记忆。
4. 运行类型检查、测试、npm pack dry-run 和 diff 检查。

## 验收标准

- [x] React/Vue primitives 均导出相同的表单字段 helper API。
- [x] React/Vue materials 的 `BasicForm` 字段格式化、解析、空值判断和必填提示复用 primitives helper。
- [x] `BasicForm` 提交 payload 与现有字段名保持兼容。
- [x] 不改变 Page Schema v1、Material Manifest v1 或 renderer 依赖方向。
- [x] 验证命令通过，并在任务文件记录结果。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm pack:dry-run
git diff --check
```

## 验证结果

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `pnpm typecheck` | 通过 | TypeScript project references、Vue3 editor playground 和 React H5 runtime playground 类型检查通过。 |
| `pnpm test` | 通过 | build、architecture check 和 149 个 node tests 通过；新增 React/Vue primitives 表单字段 helper 单测。 |
| `pnpm pack:dry-run` | 通过 | 12 个可发布包 npm pack dry-run 通过。 |
| `git diff --check` | 通过 | 未发现空白或补丁格式问题。 |

## 发布影响

- 是否需要发布：后续需要随 npm minor 发布。
- 发布对象：`@meumall/lowcode-primitives-react-h5`、`@meumall/lowcode-primitives-vue-h5`、`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不创建 tag/release。
- 回滚目标：回滚本任务提交即可，旧 schema、manifest 和 runtime 页面不受影响。
- smoke check：本任务不新增浏览器交互路径，`pnpm test` 覆盖 helper 与 materials payload 兼容；需要完整演示时可继续运行 `pnpm smoke:browser`。

## 风险和阻塞

- 风险：本任务只稳定基础字段描述 helper，不代表复杂表单协议已经存在。
- 风险：未来引入复杂校验 DSL 时，应继续作为独立协议设计，不应扩散到单个基础字段物料内部。
- 阻塞：无。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备稳定 primitives 表单字段 API。 |
| 2026-08-01 | in_progress | 开始实现 React/Vue primitives 表单字段 helper 并接入 materials。 |
| 2026-08-01 | verified | 完成 primitives 表单字段 helper、materials 复用、文档、changeset 和验证记录。 |
