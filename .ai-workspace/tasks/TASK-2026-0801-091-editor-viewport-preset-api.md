# TASK-2026-0801-091-editor-viewport-preset-api

## 标题

沉淀编辑器视口预设 API

## 状态

verified

## 目标

把 Vue3 编辑器 playground 中的 H5 画布视口预设沉淀为 `@meumall/lowcode-editor` 的框架无关 API，让后续 Java 管理台或独立编辑器通过 npm 引入时可以复用同一套 H5 设备预设、匹配逻辑和展示文案，而不是在 UI 壳里复制常量。

## 背景

上一任务已在 Vue3 编辑器 playground 增加 360 / 390 / 430 视口预览，但预设定义仍在 `apps/editor-playground/src/App.vue` 内部。为了保持架构演进稳定，应该把与框架无关的编辑器状态模型能力迁回 `packages/editor`，playground 只负责 UI 展示和事件编排。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增 H5 视口预设常量和类型。
- 提供按 id 获取预设、按当前 viewport 匹配预设、从预设生成 viewport、格式化 viewport 标题、应用预设到 editor state 的框架无关 helper。
- Vue3 编辑器 playground 改为消费 editor 包的视口预设 API。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖视口预设 API。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不新增 Page Schema 字段。
- 不修改 renderer 或 material manifest。
- 不新增 Vue 编辑器 UI 包。
- 不新增真实小程序或 WebView 预设。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的视口预设模型和 state helper。
- `apps/editor-playground` 负责 UI 展示和点击事件，不再维护私有 H5 视口预设常量。

外部系统：

- Java 管理台未来可通过 npm 直接消费 editor 包的视口预设 API。
- H5 runtime、Page Schema、Java 配置平台 API 均不受影响。

## 契约影响

- 是否影响跨包或跨系统契约：是，`@meumall/lowcode-editor` 新增向后兼容的公开 API。
- 契约文档路径：`.ai-workspace/contracts/editor-interaction-model-v1.md`、`packages/editor/README.md`。
- 是否向后兼容：是，新增导出，不修改旧字段和旧 command 语义。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/editor/README.md`。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 阅读 editor 包当前 viewport 状态、README、契约和 playground 使用点。
2. 在 editor 包新增视口预设类型、常量和 helper。
3. 更新 editor 单测和 README。
4. 更新 editor interaction model 契约。
5. 将 Vue3 playground 改为消费 editor API。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出 H5 视口预设和 helper。
- [x] helper 可按 id 获取预设、按 viewport 匹配预设、格式化预设标题，并可把预设应用到 editor state。
- [x] Vue3 编辑器 playground 不再维护私有 H5 视口预设常量。
- [x] 不修改 Page Schema、renderer 或 material manifest。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖视口预设 API。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm check:architecture` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `pnpm pack:dry-run` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm check:architecture
pnpm smoke:browser
pnpm pack:dry-run
```

## 发布影响

- 是否需要发布：否，本任务只提交源码和文档；未来真实 npm 发布时作为 `@meumall/lowcode-editor` 向后兼容 minor 能力评估。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否。
- 是否影响 npm 发布：新增 editor 包公开 API，`pnpm pack:dry-run` 需要通过。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器视口预设仍可切换。

## 风险和阻塞

- 当前只沉淀 H5 常见宽度预设，不代表真实 WebView 安全区、状态栏、小程序容器或横屏能力。
- 未来若新增多端预设，应在 editor 包扩展平台维度，并由各端 renderer 明确消费边界。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包视口预设 API 和 Vue3 playground 复用。 |
| 2026-08-01 | in_progress | 开始实现 editor 包视口预设公开 API、playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包 H5 视口预设 API、Vue3 playground 复用、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
