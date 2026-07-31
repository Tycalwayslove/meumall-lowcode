# TASK-2026-0801-096-editor-schema-file-api

## 标题

沉淀编辑器 Schema 文件 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 中 Page Schema JSON 文件导入导出的纯逻辑沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台、独立编辑器 shell 或服务端预检都可以复用同一套文件命名、导出内容、大小摘要和导入校验口径。

## 背景

当前 Vue3 编辑器已支持从工具栏、源码区和快捷命令导入导出 Page Schema JSON，但解析、校验和导出元信息仍写在 `apps/editor-playground/src/App.vue`。导入导出是运营交付、版本留存、问题排查和未来配置平台迁移的重要边界能力，应将与 DOM 无关的逻辑迁入 editor 包，playground 只负责文件选择、下载触发、确认弹窗和用户反馈。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增 Schema 文件名生成、导出描述和导入解析校验 API。
- Vue3 编辑器 playground 改为消费 editor 包的 Schema 文件 API。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖导出文件名、字节大小、合法导入、非法 JSON 和非法 schema。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或校验规则。
- 不改变 renderer、materials 或 runtime handoff 协议。
- 不在 editor 包中引入 `File`、`Blob`、`window`、`document` 等宿主对象。
- 不实现批量页面包导入导出。
- 不接入真实 Java 配置平台文件存储、审计或审批。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的 Schema 文件导入导出纯 helper。
- `apps/editor-playground` 负责浏览器文件读取、下载触发、覆盖确认和消息展示。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并在自己的文件上传、权限、审计和服务端预检流程中复用。

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

1. 梳理 Vue3 编辑器当前 Schema 导入导出逻辑和现有 smoke 覆盖。
2. 在 editor 包新增 Schema 文件 API 类型和 helper。
3. 更新 editor 单测和 README。
4. 更新 editor interaction model 契约。
5. 将 Vue3 playground 改为消费 editor API，并保持现有 UI 行为不变。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出 Schema 文件名生成、文件导出描述和文件内容解析 API。
- [x] 导出 API 返回 JSON 内容、文件名、mimeType、字节数和大小文案。
- [x] 导入 API 对非法 JSON 和非法 Page Schema 返回失败结果，不抛业务异常。
- [x] Vue3 编辑器 playground 文件选择和下载流程复用 editor API。
- [x] 不修改 Page Schema、renderer、materials 或 runtime handoff 协议。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖 Schema 文件 API。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器 Schema 导入导出关键路径仍可用。

## 风险和阻塞

- 当前只抽象本地 JSON 字符串层，不处理真实管理台上传、权限、审计、文件留存和服务端预检。
- 未来若引入 schema migration，应在导入 API 上新增可选 migration 流程，不应破坏现有返回结构。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，56 个测试全部通过，包含 editor schema file API 单测。
- `pnpm check:architecture`：通过，包结构、依赖方向、物料 manifest 对齐和 primitives 边界未破坏。
- `pnpm smoke:browser`：通过，Vue3 编辑器 Schema 导入导出关键路径仍可用，非法导入不覆盖、合法导入可替换画布并继续编辑。
- `pnpm pack:dry-run`：通过，8 个可发布包 dry-run 全部通过，包含 `@meumall/lowcode-editor`。

## 剩余风险

- 当前 Schema 文件 API 只抽象 JSON 文本层，真实管理台上传、权限、审计、文件留存和服务端预检仍需后续单独设计。
- 本任务新增 `@meumall/lowcode-editor` 公开 API，但未执行真实 npm 发布；真实发布仍需 registry、access、token 和 changeset 版本确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包 Schema 文件 API 和 Vue3 playground 复用。 |
| 2026-08-01 | in_progress | 开始实现 editor 包 Schema 文件公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包 Schema 文件 API、Vue3 playground 复用、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
