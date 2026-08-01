# TASK-2026-0801-170 编辑器顶部能力状态通用展示

## 状态

- status: verified
- created_at: 2026-08-01 14:36 CST
- owner: AI Agent

## 背景

`@meumall/lowcode-editor` 已提供 `createLowcodeEditorCapabilityState`，可统一输出协作锁、审批态、发布检查和权限门禁。但 Vue3 editor playground 顶部工具栏仍分别接收 `collaborationStatusText` 和 `approvalStatusText`，状态展示结构仍与两个固定业务状态绑定。后续迁入管理台时，顶部还可能需要展示发布检查、账号权限、素材审核、风控或配置平台连接状态，应消费通用 capability status list，避免继续扩展硬编码 props。

## 目标

让 Vue3 编辑器顶部工具栏改为接收并渲染通用 `LowcodeEditorCapabilityStatusItem[]`，由 `editorCapabilityState.statusItems` 提供协作、审批和发布检查状态。

## 涉及包或系统

- `apps/editor-playground`
- `packages/editor` 类型消费
- `scripts/browser-smoke.mjs`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- `EditorTopToolbar.vue` 使用通用 capability status items 渲染状态 pill。
- `App.vue` 将 `editorCapabilityState.statusItems` 传入顶部工具栏，移除协作/审批专用 props 传递。
- 顶部状态样式合并为通用能力状态样式，并覆盖 success/warning/danger/neutral。
- 浏览器 smoke 增加顶部发布检查状态可见断言。
- 更新 Vue shell 组件边界文档。
- 更新 AI 状态、测试报告和任务记录。

不包含：

- 不改变 `createLowcodeEditorCapabilityState` API 结构。
- 不新增 Java 权限、审批、协作锁或发布检查接口。
- 不改变 Page Schema v1、Material Manifest v1、renderer 或 materials。
- 不重构整个顶部工具栏布局或引入管理台组件库。

## 责任边界

当前仓库：

- Vue3 editor playground 作为参考 shell 消费 capability status list。
- `@meumall/lowcode-editor` 继续提供状态模型，不绑定 Vue UI。

外部系统：

- Java 配置平台、权限中心、审批系统、协作锁和发布检查服务仍由宿主接入并映射为 capability state 输入。

## 契约影响

- 是否影响 npm 公开 API：否，本任务只消费已有 API。
- 是否影响 Page Schema v1：否。
- 是否影响 Material Manifest v1：否。
- 是否需要迁移：否。
- 是否向后兼容：是。

## 对接说明

- 后续管理台 shell 可直接把 `createLowcodeEditorCapabilityState(...).statusItems` 传给顶部工具栏或自有管理台组件。
- 新增状态类型时优先扩展 editor capability model，再由 toolbar 通用渲染，不继续增加协作/审批专用 props。

## 验收标准

- [x] 顶部工具栏不再接收协作/审批专用状态 props。
- [x] 顶部工具栏可渲染 `collaboration`、`approval` 和 `publish-check` 三类 capability status item。
- [x] 顶部能展示发布检查状态，并保留 title 描述提示。
- [x] 不新增 schema、renderer 或 materials 依赖。
- [x] `pnpm --filter @meumall/lowcode-editor-playground typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm --filter @meumall/lowcode-editor-playground typecheck
pnpm test
pnpm smoke:browser
```

## 验证结果

- 2026-08-01 14:38 CST：`pnpm --filter @meumall/lowcode-editor-playground typecheck` 通过。
- 2026-08-01 14:38 CST：`pnpm test` 通过，覆盖 build、architecture check 和 109 个单测。
- 2026-08-01 14:39 CST：`pnpm smoke:browser` 通过，新增覆盖顶部 `publish-check` capability 状态可见，并继续覆盖 workflow provider、审批流转、HTTP 配置平台、编辑器内置 runtime 和 React H5 runtime。

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否影响 H5 接入：否。
- 是否影响 Java 配置平台：否。
- 回滚目标：回滚本任务提交即可恢复顶部工具栏旧 props。

## 风险和阻塞

- 顶部状态项增多后窄屏可能换行；本任务仅做通用 pill 展示，整体响应式布局继续沿用当前 topbar 规则。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为顶部工具栏消费通用 capability status items。 |
| 2026-08-01 | in_progress | 实现顶部工具栏 capability status items 渲染、通用状态样式和 browser smoke 断言迁移。 |
| 2026-08-01 | verified | playground typecheck、完整测试和 browser smoke 均已完成并验证。 |
