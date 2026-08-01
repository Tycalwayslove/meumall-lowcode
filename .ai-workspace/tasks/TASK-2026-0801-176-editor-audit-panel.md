# TASK-2026-0801-176 Vue3 编辑器审计日志面板

## 状态

verified

## 目标

让 Vue3 编辑器 playground 顶部“审计日志”入口打开一个可操作的本地审计日志面板，展示完整近期操作记录，为后续迁入 Java 管理台和接入真实审计服务保留清晰 UI 边界。

## 背景

`@meumall/lowcode-editor` 已提供框架无关 audit trail API，Vue3 编辑器右侧状态面板也能展示最近操作。但顶部宿主扩展位中的“审计日志”按钮目前只写入一条提示文案，运营或管理台集成方无法通过这个入口查看完整日志。为了让编辑器 shell 更接近可实操管理台，本任务先把入口升级为独立 Vue3 shell 面板。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `EditorAuditPanel.vue`，接收审计展示项并提供关闭事件。
- Vue3 编辑器 playground 顶部“审计日志”按钮打开本地审计面板。
- 打开审计面板时记录一条本地审计事件，便于验证入口行为。
- browser smoke 覆盖审计入口打开、内容展示和关闭。
- 更新 Vue shell 组件边界文档、AI 状态、测试报告和任务记录。

不包含：

- 不改变 Page Schema v1、Material Manifest v1 或 H5 runtime 协议。
- 不新增 Java 审计日志查询接口。
- 不请求真实外部审计系统。
- 不实现审计日志分页、筛选、导出、清空、权限或合规策略。
- 不新增 `@meumall/lowcode-editor-vue` npm 包。

## 责任边界

当前仓库：

- 提供可迁移的 Vue3 编辑器 shell 审计面板。
- 继续消费 `@meumall/lowcode-editor` 的 audit trail 展示模型。
- 保持组件不持有审计事件创建、持久化、权限或 Java 请求逻辑。

外部系统：

- Java 管理台后续负责真实审计查询、存储、权限、分页、筛选和合规要求。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 是否影响 npm 公开 API：否，当前只新增 playground Vue shell 组件。
- 是否影响 Page Schema v1：否。
- 是否影响 Material Manifest v1：否。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 真实管理台后续可以复用 `EditorAuditPanel` 的组件职责边界，用 Java 审计 client 替换本地 `auditEvents` 来源。
- 面板只接收 `LowcodeEditorAuditListItem[]` 展示模型，不直接感知审计服务响应结构。

## 验收标准

- [x] 顶部“审计日志”按钮能打开审计日志面板。
- [x] 面板展示最近操作的标题、时间、操作者、目标、描述和结果状态。
- [x] 面板支持关闭，并且关闭后不影响编辑器画布和右侧状态面板。
- [x] 新增组件职责写入 `docs/editor-vue-shell-components.md`。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 覆盖审计日志入口打开和关闭。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
```

## 验证结果

- 2026-08-01：`pnpm typecheck` 通过。
- 2026-08-01：`pnpm test` 通过，构建、架构边界检查和 119 个 Node test 均通过。
- 2026-08-01：`pnpm smoke:browser` 通过，新增覆盖顶部审计日志入口打开、展示近期操作和关闭。

## 发布影响

- 是否需要发布：本任务不执行真实 npm 发布。
- 发布对象：无。
- 是否影响 schema 兼容性：否。
- 是否影响 H5 接入：否。
- 是否影响 Java 配置平台：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可恢复为顶部提示文案入口。
- smoke check：`pnpm smoke:browser`。

## 风险和阻塞

- 当前面板仍使用本地审计事件，不代表真实审计服务最终字段；因此组件必须只依赖 editor 包的展示模型，避免绑定 Java 响应。
- 后续如果要做分页、筛选、导出和权限，需要单独设计服务端审计查询契约。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 编辑器本地审计日志面板。 |
| 2026-08-01 | verified | 新增 `EditorAuditPanel` 并接入顶部审计日志入口；`pnpm typecheck`、`pnpm test`、`pnpm smoke:browser` 均通过。 |
