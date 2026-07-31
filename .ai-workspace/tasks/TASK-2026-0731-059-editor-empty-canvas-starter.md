# TASK-2026-0731-059-editor-empty-canvas-starter

## 标题

增强 Vue3 编辑器空白画布起步引导

## 状态

verified

## 目标

在运营通过新建页面向导创建空白 H5 页面后，画布内直接展示可点击的常用起步物料入口，降低从空白页开始搭建的理解成本。

## 背景

当前编辑器已具备新建页面向导和模板起点，但空白 H5 页面创建后画布仅显示弱兜底状态，运营不知道下一步应该添加什么。需要在不改 schema 和 renderer 契约的前提下优化编辑器 shell 体验。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

- 在 Vue3 编辑器手机画布空节点状态下展示起步引导。
- 提供活动头图、图片 Banner、商品列表、优惠券区块等基础物料快捷添加。
- 提供回到新建页面向导的模板入口。
- 扩展 browser smoke check 覆盖空白画布快捷起步。
- 更新 AI 项目状态和任务记录。

## 不包含

- 不改变 Page Schema v1。
- 不改变 Material Manifest v1。
- 不接入真实 Java 配置平台或模板市场。
- 不发布 npm 版本。

## 责任边界

- 编辑器 shell 负责空白态引导和快捷添加交互。
- schema/core/renderer/materials 继续保持现有职责，不承载编辑器空白态 UI。

## 契约影响

无 schema、manifest、renderer API 或 npm 公开 API 变更。

## 对接说明

后续迁移到管理系统时，可将空白画布起步引导作为 Vue3 编辑器 shell 组件迁移；起步物料来源仍来自物料 registry，可替换为配置化推荐。

## 验收标准

- 创建空白 H5 页面后，手机画布展示“空白 H5 页面”和“选择一个基础物料开始搭建”。
- 点击起步物料后，画布新增对应 H5 节点，并关闭空白引导。
- 从空白页继续保存草稿、再从模板新建页面的流程正常。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过。
- `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm smoke:browser
```

## 发布影响

- 不需要 npm 发布。
- 不影响 schema 兼容性。
- 不影响 H5 runtime 接入。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可恢复原空白画布状态。

## 风险和阻塞

- 起步物料列表当前为编辑器内置推荐，后续如运营角色或页面类型更复杂，应抽象为可配置推荐策略。

## 变更记录

- 2026-07-31：创建任务，状态置为 `in_progress`。
- 2026-07-31：实现空白画布起步引导和快捷物料添加，扩展 browser smoke 覆盖空白页起步路径，状态置为 `verified`。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，32 个测试全部通过。
- `pnpm smoke:browser`：通过，已覆盖“新建空白 H5 页面 -> 空白画布起步物料 -> 应用模板起点”流程。

## 实现摘要

- Vue3 编辑器在空节点手机画布中展示空白 H5 页面起步引导。
- 起步引导提供活动头图、图片 Banner、商品列表和优惠券区块快捷添加。
- 点击起步物料后复用现有 `addMaterial`、最近使用记录和节点选中逻辑。
- 预览模式下空白画布只提示暂无物料，不展示编辑按钮。
