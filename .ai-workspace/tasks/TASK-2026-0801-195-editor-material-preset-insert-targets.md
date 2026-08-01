# TASK-2026-0801-195-editor-material-preset-insert-targets

## 状态

verified

## 目标

让物料插入预设支持按插入目标写入 Page Schema，并在 Vue3 编辑器中支持把基础物料预设直接加入当前选中的容器或表单，减少运营搭建复杂页面时“先加默认物料、再拖进容器、再改属性”的重复操作。

## 背景

上一轮已完成物料插入预设 API，Vue3 物料面板可以一键追加主按钮、描边按钮、手机号输入、规则列表等基础物料变体。但当前预设只会追加到页面末尾；当运营选中 `SectionContainer`、`GridContainer` 或 `BasicForm` 后，普通物料已有“加入容器”快捷区，预设还不能直接加入容器。为了让编辑器更接近真实运营工作流，需要把 `manifest + preset + insert target` 的组合沉淀为 editor 纯 helper，并接入 Vue3 shell。

## 涉及包或系统

- `@meumall/lowcode-editor`
- `apps/editor-playground`
- 文档与 AI 工作流

## 范围

包含：

- 在 editor 包新增按 material insert target 插入预设的 helper。
- 保持已有 `createLowcodeMaterialNodeInputFromPreset`、`insertLowcodeMaterialByTarget` 和预设列表 API 兼容。
- Vue3 物料目录当前容器区域展示预设快捷按钮，并插入到选中容器内。
- 快捷插入后记录最近使用、审计和用户反馈。
- 补充单元测试、browser smoke、README、changeset、项目状态和任务验证记录。

不包含：

- 不修改 Page Schema v1 或 Material Manifest v1 字段结构。
- 不修改 React/Vue H5 renderer 行为。
- 不新增新的 H5 物料或 runtime primitive。
- 不做跨父级多选拖拽或复杂 slot 布局协议。
- 不接入 Java 物料中心远程预设配置。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 提供框架无关的预设按目标插入 helper。
- `apps/editor-playground` 负责展示容器预设快捷入口、调用 helper、反馈和 smoke。

外部系统：

- Java 配置平台未来可使用同一 npm API 或提供远程预设配置；本任务不实现服务端。

## 契约影响

- 是否影响跨包或跨系统契约：影响 `@meumall/lowcode-editor` npm 公开 API，不影响 schema、renderer 或 material manifest 契约。
- 契约文档路径：`packages/editor/README.md`
- 是否向后兼容：是，新增 helper 和 UI 入口。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要。
- 对接说明路径：`packages/editor/README.md`、`.ai/AI_CONTEXT.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 新增 editor 预设按目标插入 helper，并补单测。
2. 在 Vue3 物料目录容器快捷区展示预设并插入到选中容器。
3. 补 browser smoke、README、changeset 和 AI 状态记录。

## 验收标准

- [x] editor API 能用 material insert target 把预设插入根节点、目标前后或容器内部。
- [x] 预设插入保留 manifest 默认 props、预设 props、dataBinding 和 `meta.name`。
- [x] Vue3 编辑器选中容器后，可从容器快捷区一键把预设插入容器内部。
- [x] 不改变 schema、renderer、materials manifest 结构或包依赖方向。
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
- 发布对象：`@meumall/lowcode-editor`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不创建 tag/release。
- 回滚目标：回滚本任务提交即可，旧 schema 和 runtime 渲染不受影响。
- smoke check：`pnpm smoke:browser` 覆盖容器内预设插入。

## 风险和阻塞

- 风险：当前容器仍基于 `children` 顺序流，不处理复杂 slot 和单元格级投放。
- 阻塞：无。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备实现物料预设按目标插入能力。 |
| 2026-08-01 | verified | 已新增 `insertLowcodeMaterialPresetByTarget`，Vue3 容器快捷区支持常用预设插入；`pnpm typecheck`、`pnpm test`、`pnpm smoke:browser`、`pnpm pack:dry-run`、`git diff --check` 均通过。 |
