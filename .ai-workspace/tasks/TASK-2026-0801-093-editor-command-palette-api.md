# TASK-2026-0801-093-editor-command-palette-api

## 标题

沉淀编辑器快捷命令 API

## 状态

verified

## 目标

把 Vue3 编辑器 playground 中快捷命令面板的搜索、展示限制和分组口径沉淀为 `@meumall/lowcode-editor` 的框架无关 API，让后续 Java 管理台或独立编辑器通过 npm 引入时可以复用同一套命令目录模型，而不是在不同 UI 壳里复制搜索规则。

## 背景

当前 Vue3 编辑器 playground 已具备顶部命令入口和 `Meta/Ctrl + K` 快捷命令面板，可搜索执行模式切换、草稿保存、预览发布、打开 H5、添加物料和应用模板。但搜索逻辑仍写在 `apps/editor-playground/src/App.vue`，包含关键词拼接、最多展示 28 条等规则。命令面板属于编辑器壳层核心能力，应将与 Vue 无关的命令列表处理能力迁回 `packages/editor`，playground 只保留命令执行函数和 UI 展示。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增快捷命令条目类型、搜索文本、过滤和分组 helper。
- Vue3 编辑器 playground 改为消费 editor 包的命令过滤 API。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖命令过滤、展示限制、关键词和分组。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变快捷命令实际执行函数。
- 不新增命令快捷键系统。
- 不改 Page Schema、Material Manifest 或 renderer。
- 不接入真实用户权限、菜单配置或远程命令市场。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的命令条目搜索、过滤和分组模型。
- `apps/editor-playground` 负责 UI 展示、快捷键打开面板和具体命令执行。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包的命令目录 API。
- 用户权限、菜单配置、审计和远程命令配置仍是外部系统能力，本任务不实现。

## 契约影响

- 是否影响跨包或跨系统契约：是，`@meumall/lowcode-editor` 新增向后兼容的公开 API。
- 契约文档路径：`.ai-workspace/contracts/editor-interaction-model-v1.md`、`packages/editor/README.md`。
- 是否向后兼容：是，新增导出，不修改旧 API 语义。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/editor/README.md`。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 阅读 Vue3 编辑器快捷命令面板当前搜索和执行逻辑。
2. 在 editor 包新增快捷命令类型和 helper。
3. 更新 editor 单测和 README。
4. 更新 editor interaction model 契约。
5. 将 Vue3 playground 改为消费 editor API。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出快捷命令条目、搜索文本、过滤和分组 helper。
- [x] helper 可按 title、group、description 和 keywords 进行关键词匹配。
- [x] helper 支持展示数量限制，并默认保留现有 28 条展示口径。
- [x] Vue3 编辑器 playground 的命令面板搜索复用 editor API，命令执行行为不变。
- [x] 不修改 Page Schema、Material Manifest 或 renderer。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖快捷命令 API。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器快捷命令面板仍可搜索和执行核心命令。

## 风险和阻塞

- 当前只处理本地命令列表，不处理真实管理台权限、菜单排序、审计和远程命令配置。
- 未来若 Java 管理台需要服务端控制命令显隐或排序，应通过可选字段或 adapter 扩展，不应破坏现有 helper。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，53 个测试全部通过，包含 editor command palette API 单测。
- `pnpm check:architecture`：通过，包结构、依赖方向、物料 manifest 对齐和 primitives 边界未破坏。
- `pnpm smoke:browser`：通过，Vue3 编辑器快捷命令面板仍可搜索并执行添加物料、切换模式、保存草稿等关键路径。
- `pnpm pack:dry-run`：通过，8 个可发布包 dry-run 全部通过，包含 `@meumall/lowcode-editor`。

## 剩余风险

- 当前命令 API 只抽象本地命令列表展示模型，真实管理台的权限、菜单排序、审计、远程命令配置和用户偏好仍需后续单独设计。
- 本任务新增 `@meumall/lowcode-editor` 公开 API，但未执行真实 npm 发布；真实发布仍需 registry、access、token 和 changeset 版本确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包快捷命令 API 和 Vue3 playground 复用。 |
| 2026-08-01 | in_progress | 开始实现 editor 包快捷命令公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包快捷命令 API、Vue3 playground 复用、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
