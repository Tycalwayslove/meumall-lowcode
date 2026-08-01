# TASK-2026-0801-146-editor-number-prop-controls

## 标题

增强编辑器数值属性范围控件

## 状态

verified

## 目标

为 Material Manifest v1 的数值属性补充可选的 `min`、`max`、`step` 和 `unit` 元数据，并让 Vue3 编辑器属性面板按这些元数据提供范围、步长、单位提示和加减步进控件，降低运营配置圆角、留白、字号、边框宽度等数值属性时填错或填出异常值的概率。

## 背景

当前属性面板已经支持 `select/options` 解决枚举手填问题，但大量高频样式配置仍是普通 number input。运营可以输入负圆角、超大边距、非整数列数或不清楚单位的数值，虽然物料运行时有部分 fallback，但编辑器体验不够“可实操”。数值约束应属于 Material Manifest 的可选编辑元数据，由 editor 统一消费，而不是在 Vue 组件里按字段名硬编码。

## 涉及包或系统

- `packages/schema`
- `packages/editor`
- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai-workspace/contracts/material-manifest-v1.md`
- `.ai/`

## 范围

包含：

- `LowcodePropSchema` 新增可选 `min`、`max`、`step` 和 `unit` 字段。
- `normalizeLowcodePropInputValue` 对 number 类型按 manifest 范围做夹取，非法数字回落到默认值或 0。
- Vue3 属性分组组件为 number 字段渲染带单位提示、`+/-` 步进按钮和 `min/max/step` 的输入控件。
- React/Vue H5 基础通用物料和当前高频通用物料的常见数值字段补充范围、步长和单位。
- 单测覆盖 number 归一化夹取和 React/Vue manifest 数值约束对齐。
- browser smoke 覆盖基础按钮数值字段通过步进控件写回 schema。
- 同步契约、任务记录、项目事实和待办状态。

不包含：

- 不改变 Page Schema v1 结构。
- 不改变 H5 renderer 或物料运行时渲染语义。
- 不实现 slider、双向拖拽调节、响应式断点或复杂布局编辑器。
- 不对历史 schema 做批量迁移。
- 不接入 Java 配置平台服务端校验。

## 责任边界

当前仓库：

- `schema` 负责 Material Manifest 数值编辑元数据类型。
- `editor` 负责 number 输入归一化和范围夹取。
- `materials-*` 负责声明各物料可编辑数值字段的合理范围。
- `editor-playground` 负责 Vue3 参考控件渲染和写回。

外部系统：

- Java 配置平台未来可复用 `min/max/step/unit` 生成表单控件，并在发布校验中复用同一范围口径。
- H5 runtime 继续消费 Page Schema，不依赖编辑器控件实现。

## 契约影响

- 是否影响跨包或跨系统契约：是，Material Manifest v1 新增向后兼容可选字段。
- 契约文档路径： `.ai-workspace/contracts/material-manifest-v1.md`。
- 是否向后兼容：是，新增可选编辑元数据，不改变已有 props 值类型。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否；旧 manifest 不声明这些字段时，编辑器维持现有 number input 行为。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`.ai-workspace/contracts/material-manifest-v1.md`、`.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：前端低代码维护者、Java 配置平台。
- 当前确认状态：前端参考实现。

## 验收标准

- [x] `LowcodePropSchema` 支持可选 `min`、`max`、`step` 和 `unit`。
- [x] `normalizeLowcodePropInputValue` 对 number 字段按 `min/max` 夹取，并对非法数字使用 `defaultValue` 或 0。
- [x] Vue3 属性面板 number 字段显示步进按钮、单位提示，并透传 `min/max/step`。
- [x] React/Vue H5 同名物料的数值约束语义保持一致。
- [x] browser smoke 能通过基础按钮的数值步进控件写回 schema。
- [x] 不改变 Page Schema v1、renderer 依赖方向或物料运行时渲染语义。
- [x] `pnpm --filter @meumall/lowcode-schema typecheck` 通过。
- [x] `pnpm --filter @meumall/lowcode-editor typecheck` 通过。
- [x] `pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- [x] `pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm --filter @meumall/lowcode-schema typecheck
pnpm --filter @meumall/lowcode-editor typecheck
pnpm --filter @meumall/lowcode-materials-h5 typecheck
pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck
pnpm test
pnpm smoke:browser
git diff --check
```

## 发布影响

- 是否需要发布：否，本任务不执行真实 npm 发布。
- 发布对象：后续真实发布时影响 `@meumall/lowcode-schema`、`@meumall/lowcode-editor`、`@meumall/lowcode-materials-h5` 和 `@meumall/lowcode-materials-vue-h5`。
- 是否需要 changeset：当前不发布，暂不新增 changeset。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：不影响已发布页面渲染；只改善编辑器配置体验和 manifest 元数据。
- 是否影响 npm 发布：向后兼容 manifest 能力，后续发布可按 minor 评估。
- 是否影响 Java 配置平台：未来 Java 表单生成器和服务端校验可消费这些可选字段。
- 回滚目标：回滚本任务提交即可恢复普通 number input 行为。
- smoke check：`pnpm smoke:browser` 验证 Vue3 editor 数值步进和 H5 runtime 关键路径。

## 风险和阻塞

- 只做通用 number input + stepper，不解决拖拽调节和 slider 体验。
- 范围值先覆盖基础通用物料和高频通用字段，业务物料可以后续按收益继续补充。
- 旧 schema 中已有越界值会在编辑器写回时被夹取，runtime 仍按原有逻辑渲染。

## 验证结果

- `pnpm --filter @meumall/lowcode-schema typecheck` 通过。
- `pnpm --filter @meumall/lowcode-editor typecheck` 首次运行时因 schema `dist/index.d.ts` 尚未构建而无法识别新增字段；执行 `pnpm --filter @meumall/lowcode-schema build` 后重跑通过。
- `pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- `pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- `pnpm test` 通过，86 个测试全部通过，并包含架构边界检查、number 归一化夹取和 React/Vue manifest 数值约束对齐断言。
- `pnpm smoke:browser` 通过，已覆盖基础按钮 `圆角` 数值步进写回 `radius: 9` 的 schema 链路。
- `git diff --check` 通过。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Material Manifest 数值编辑元数据、editor 归一化、Vue3 number 控件和基础物料数值约束。 |
| 2026-08-01 | in_progress | 已完成 schema/editor/Vue number 控件、基础物料数值元数据、单测和 browser smoke 用例补充，等待完整验证。 |
| 2026-08-01 | verified | 完成实现、契约/文档/AI 事实源同步和完整验证；不改变 Page Schema v1 或 renderer 运行时语义。 |
