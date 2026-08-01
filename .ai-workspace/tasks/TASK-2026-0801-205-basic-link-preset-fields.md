# TASK-2026-0801-205-basic-link-preset-fields

## 状态

verified

## 目标

修正 `BasicLink` 编辑器插入预设的字段名，让运营通过“卡片链接”和“横条链接”预设添加物料时，说明文案和前置标签可以按 manifest 正确渲染。

## 背景

`BasicLink` 物料 manifest 使用 `subtitle` 和 `prefixText` 表达辅助说明和前置标签，但编辑器默认插入预设使用了 `description` 和 `tagText`。这会导致预设看起来提供了说明和标签，实际写入 schema 后 H5 渲染层无法消费这些字段，影响基础物料库的实操体验。

## 涉及包或系统

- `@meumall/lowcode-editor`
- Vue3 编辑器 playground
- 文档与 AI 工作流

## 范围

包含：

- 修正 `LOWCODE_EDITOR_MATERIAL_INSERT_PRESETS.BasicLink` 的默认 props 字段名。
- 补充 editor 单测，确保 `BasicLink` 预设输出与 manifest 字段一致。
- 更新任务记录、项目记忆和 changeset。

不包含：

- 不修改 Page Schema v1 结构。
- 不修改 Material Manifest v1 结构。
- 不修改 React/Vue H5 renderer 或 materials 渲染语义。
- 不接业务路由、App bridge、登录、权限、埋点、风控、短链或远程链接校验。

## 责任边界

当前仓库：

- editor 包负责默认插入预设和生成节点 props。
- Vue3 编辑器 playground 消费 editor 预设并写入 schema。

外部系统：

- H5 宿主、Java/BFF 和业务 action handler 仍负责真实跳转、鉴权、埋点和风控。

## 契约影响

- 是否影响跨包或跨系统契约：影响 editor 默认预设输出；不影响 Page Schema v1、Material Manifest v1 结构或 H5 runtime 集成契约。
- 契约文档路径：`packages/editor/README.md`、`.ai/AI_CONTEXT.md`
- 是否向后兼容：是。修正默认预设字段，不破坏旧 schema。
- 是否需要迁移：否。旧 schema 中多余的 `description/tagText` 会继续被运行时忽略。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要。
- 对接说明路径：任务文件、changeset、`.ai/AI_CONTEXT.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 修正 `BasicLink` 两个默认插入预设的 props 字段名。
2. 补充 editor 单测覆盖预设 props。
3. 更新 changeset、AI 记忆和任务验证记录。

## 验收标准

- [x] `BasicLink` 卡片链接预设输出 `subtitle` 和 `prefixText`。
- [x] `BasicLink` 横条链接预设输出 `subtitle`，且不再输出无效的 `description/tagText`。
- [x] 不改变 Page Schema v1、Material Manifest v1 或 renderer 依赖方向。
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

- 是否需要发布：后续随 npm patch 或当前 linked group 发布。
- 发布对象：`@meumall/lowcode-editor`
- 是否需要 changeset：需要，patch。
- 是否需要 GitHub tag/release：本任务不创建 tag/release。
- 回滚目标：回滚本任务提交即可。
- smoke check：`pnpm smoke:browser` 覆盖编辑器物料插入和 H5 渲染链路。

## 风险和阻塞

- 风险：旧草稿中如果已有 `description/tagText`，运行时本来就不会消费，本任务不做历史数据迁移。
- 阻塞：无。

## 验证结果

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `pnpm typecheck` | 通过 | TypeScript project references、Vue3 editor playground 和 React H5 runtime playground 类型检查均通过。 |
| `pnpm test` | 通过 | 构建、架构边界检查和 157 个测试通过，包含 BasicLink 预设字段断言。 |
| `pnpm smoke:browser` | 通过 | Vue3 编辑器、内置 runtime、React H5 runtime、HTTP 配置平台 mock 和基础物料链路均通过。 |
| `pnpm pack:dry-run` | 通过 | 12 个可发布包 npm pack dry-run 均通过。 |
| `git diff --check` | 通过 | 无空白错误。 |

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备修正 BasicLink 编辑器插入预设字段。 |
| 2026-08-01 | implemented | 已修正 BasicLink 默认预设字段，补充 editor 单测、README、changeset 和 AI 记忆，等待验证。 |
| 2026-08-01 | verified | 验证通过：`pnpm typecheck`、`pnpm test`、`pnpm smoke:browser`、`pnpm pack:dry-run` 和 `git diff --check` 均通过。 |
