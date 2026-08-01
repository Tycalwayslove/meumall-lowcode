# TASK-2026-0801-170 编辑器顶部能力状态通用展示

## 状态

- status: verified
- created_at: 2026-08-01 14:36 CST
- owner: AI Agent

## 验证记录

- 2026-08-01 14:38 CST：`pnpm --filter @meumall/lowcode-editor-playground typecheck` 通过。
- 2026-08-01 14:38 CST：`pnpm test` 通过，覆盖 build、architecture check 和 109 个单测。
- 2026-08-01 14:39 CST：`pnpm smoke:browser` 通过，新增覆盖顶部 `publish-check` capability 状态可见，并继续覆盖 workflow provider、审批流转、HTTP 配置平台、编辑器内置 runtime 和 React H5 runtime。

## 发布影响

- 不影响 npm 公开 API，不需要 changeset。
- 不改变 Page Schema v1、Material Manifest v1、renderer 或 materials。
- 已同步 `docs/editor-vue-shell-components.md` 的顶部工具栏组件边界说明。
- 不影响 Java 配置平台 API；后续管理台可继续使用 `createLowcodeEditorCapabilityState(...).statusItems` 接入顶部状态展示。
