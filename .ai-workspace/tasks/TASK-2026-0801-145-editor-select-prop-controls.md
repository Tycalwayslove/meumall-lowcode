# TASK-2026-0801-145-editor-select-prop-controls

## 标题

增强编辑器枚举属性选择控件

## 状态

verified

## 目标

把 Material Manifest v1 中已定义的 `select` setter 和 `options` 字段接入编辑器属性面板，让基础物料的枚举类属性通过下拉选择配置，降低运营手填字符串的错误率，并为后续 segmented、radio、图标化选项等编辑器控件演进保留统一入口。

## 背景

当前基础物料已经覆盖按钮、输入框、文本、分割线、图片、标签、图文卡片和容器，但很多枚举类配置仍使用普通文本输入，例如按钮样式、尺寸、图片填充模式、文本对齐和标签语义色。运营需要记住 `solid`、`cover`、`accent` 等内部值，体验差且容易写错。契约层已经允许物料 props 声明 `setter: "select"` 与 `options`，本任务负责补齐从 manifest 到 editor UI 的消费闭环。

## 涉及包或系统

- `packages/editor`
- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai-workspace/contracts/material-manifest-v1.md`
- `.ai/`

## 范围

包含：

- `@meumall/lowcode-editor` 属性控件模型识别 `select` setter。
- Vue3 编辑器属性分组组件根据 `select` setter 渲染下拉选择，并写回 manifest 中的选项值。
- React/Vue H5 基础物料 manifest 为常见枚举字段补充 `setter: "select"` 和 `options`。
- 单测覆盖 prop editor model 的 `select` 控件派生。
- browser smoke 覆盖基础按钮枚举属性在属性面板中可选择并写入 schema。
- 同步任务记录、项目事实和待办状态。

不包含：

- 不改变 Page Schema v1 结构。
- 不新增新的 Page Schema 字段或节点结构。
- 不实现 segmented/radio/icon picker 等高级控件。
- 不改变 H5 renderer 或物料运行时渲染语义。
- 不接入真实 Java 配置平台校验。

## 责任边界

当前仓库：

- `schema` 继续提供 Material Manifest 类型，当前字段已存在，本任务不新增字段。
- `materials-*` 负责声明可编辑选项。
- `editor` 负责把 manifest 派生为框架无关控件模型。
- `editor-playground` 负责 Vue3 管理端参考控件渲染和写回。

外部系统：

- Java 配置平台未来可复用 manifest `options` 生成管理端表单，并在服务端发布校验中检查枚举值。
- H5 runtime 继续消费 Page Schema，不依赖 editor 控件实现。

## 契约影响

- 是否影响跨包或跨系统契约：是，开始正式消费 Material Manifest v1 已存在的 `select` 和 `options` 字段。
- 契约文档路径：`.ai-workspace/contracts/material-manifest-v1.md`。
- 是否向后兼容：是，新增或修改 setter 不改变最终 props 值类型；旧 schema 仍可渲染。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否；真实 Java 管理台接入时需确认其表单生成器支持 `select`。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`.ai-workspace/contracts/material-manifest-v1.md`、`.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：前端低代码维护者、Java 配置平台。
- 当前确认状态：前端参考实现。

## 验收标准

- [x] `getLowcodePropEditorControl` 对 `setter: "select"` 返回 `select`。
- [x] Vue3 编辑器属性面板对 select 字段渲染下拉控件。
- [x] 基础物料的枚举字段不再要求运营手填内部枚举值。
- [x] React/Vue H5 同名基础物料 manifest 的 select 选项语义保持一致。
- [x] browser smoke 能修改基础按钮样式并在源码 schema 中看到新值。
- [x] 不改变 Page Schema v1 字段结构、H5 renderer 依赖方向或物料运行时渲染语义。
- [x] `pnpm --filter @meumall/lowcode-editor typecheck` 通过。
- [x] `pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- [x] `pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm --filter @meumall/lowcode-editor typecheck
pnpm --filter @meumall/lowcode-materials-h5 typecheck
pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck
pnpm test
pnpm smoke:browser
git diff --check
```

## 发布影响

- 是否需要发布：否，本任务不执行真实 npm 发布。
- 发布对象：后续真实发布时影响 `@meumall/lowcode-editor`、`@meumall/lowcode-materials-h5` 和 `@meumall/lowcode-materials-vue-h5`。
- 是否需要 changeset：当前不发布，暂不新增 changeset。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：不影响已发布页面渲染；只改善编辑器配置体验。
- 是否影响 npm 发布：向后兼容编辑器/manifest 能力，后续发布可按 minor 评估。
- 是否影响 Java 配置平台：未来 Java 表单生成器可消费 `options`，但本任务不要求 Java 同步实现。
- 回滚目标：回滚本任务提交即可恢复文本输入。
- smoke check：`pnpm smoke:browser` 验证 Vue3 editor 属性选择和 H5 runtime 关键路径。

## 风险和阻塞

- 当前仅提供通用 select 控件，未区分视觉型枚举和业务型枚举。
- 现有旧草稿如果写入非法枚举值，select 控件会显示为空；运行时仍按各物料已有 fallback 处理。
- Java 配置平台未来若独立生成表单，需要同步支持 `options`。

## 验证结果

- `pnpm --filter @meumall/lowcode-editor typecheck` 通过。
- `pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- `pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- `pnpm test` 通过，85 个测试全部通过，并包含架构边界检查和基础物料枚举选项对齐断言。
- `pnpm smoke:browser` 通过，已覆盖基础按钮 `样式` 下拉选择写回 `variant: "ghost"` 的 schema 链路。
- `git diff --check` 通过。
- 首次 browser smoke 因前置用例折叠属性分组导致新增 select 字段不在 DOM 中而失败；已调整 smoke 编排为检查前展开折叠属性分组，重新验证通过。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为接入 Material Manifest `select/options` 到编辑器属性面板和基础物料 manifest。 |
| 2026-08-01 | in_progress | 已完成 editor select 控件模型、Vue3 属性面板 select 渲染、基础物料 manifest 选项声明、单测和 browser smoke 用例补充，等待完整验证。 |
| 2026-08-01 | verified | 完成实现、契约/文档/AI 事实源同步和完整验证；不改变 Page Schema v1 或 renderer 运行时语义。 |
