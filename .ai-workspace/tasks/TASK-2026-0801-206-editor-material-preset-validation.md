# TASK-2026-0801-206-editor-material-preset-validation

## 状态

verified

## 目标

新增 `@meumall/lowcode-editor` 物料插入预设校验 API，用于检查默认或自定义物料预设写入的 props 是否能被目标物料 manifest 消费，避免运营一键插入后出现“预设有配置但 H5 不渲染”的体验问题。

## 背景

上一任务修正了 `BasicLink` 默认插入预设字段名不匹配的问题。该问题暴露出一个可复用的编辑器治理点：后续基础物料、业务物料和远程预设配置都会持续增加，如果只靠人工记住字段名，很容易再次出现 preset props 与 manifest `propsSchema/defaultProps` 脱节。应在 editor 包沉淀框架无关校验 API，供单测、管理台接入和未来远程物料预设审核复用。

## 涉及包或系统

- `@meumall/lowcode-editor`
- Vue3 编辑器 playground
- 文档与 AI 工作流

## 范围

包含：

- 新增 `validateLowcodeMaterialInsertPresets` 及校验结果类型。
- 校验默认预设和自定义预设 props 是否属于目标 manifest 的 `propsSchema` 或 `defaultProps` 字段。
- 支持按组件或全局补充允许字段，方便宿主兼容少量自定义扩展。
- 补充 editor 单测、README、changeset 和 AI 记忆。

不包含：

- 不修改 Page Schema v1 结构。
- 不修改 Material Manifest v1 结构。
- 不修改 renderer、materials 或 H5 runtime 行为。
- 不新增运行时物料或业务物料。
- 不接远程物料市场、Java 审核接口或真实发布门禁。

## 责任边界

当前仓库：

- editor 包提供预设校验 API、类型和单测。
- Vue3 editor playground 仍消费现有预设生成节点，本任务不改变 UI。

外部系统：

- Java 配置平台或未来管理台可在远程预设保存、审核或发布前调用该 API；真实服务端校验、权限、审批和上下架仍由外部系统负责。

## 契约影响

- 是否影响跨包或跨系统契约：影响 `@meumall/lowcode-editor` 公开 API；不影响 Page Schema v1、Material Manifest v1 或 H5 runtime 集成契约。
- 契约文档路径：`packages/editor/README.md`、`.ai/AI_CONTEXT.md`
- 是否向后兼容：是。新增 API，不改变已有函数行为。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要。
- 对接说明路径：`packages/editor/README.md`、`.ai/AI_CONTEXT.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 在 editor 包新增预设校验类型和 `validateLowcodeMaterialInsertPresets`。
2. 补充 editor 单测，覆盖默认预设通过和自定义未知字段告警。
3. 更新 README、changeset、AI 记忆和任务验证记录。

## 验收标准

- [x] `validateLowcodeMaterialInsertPresets` 可以返回 preset 数量、已知字段、是否有效和问题列表。
- [x] 默认 `BasicLink` 预设校验通过。
- [x] 自定义预设写入未知字段时能返回明确问题。
- [x] 不改变 Page Schema v1、Material Manifest v1、renderer、materials 或 runtime 行为。
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

- 是否需要发布：后续随 npm minor 或当前 linked group 发布。
- 发布对象：`@meumall/lowcode-editor`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不创建 tag/release。
- 回滚目标：回滚本任务提交即可。
- smoke check：`pnpm smoke:browser` 覆盖编辑器基础链路不受影响。

## 风险和阻塞

- 风险：该 API 只检查字段名，不检查字段值类型、业务含义、远程链接合法性或安全 action 配置。
- 风险：如果宿主有自定义运行时会消费 manifest 外字段，需要通过允许字段选项显式声明。
- 阻塞：无。

## 验证结果

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `pnpm typecheck` | 通过 | TypeScript project references、Vue3 editor playground 和 React H5 runtime playground 类型检查均通过。 |
| `pnpm test` | 通过 | 构建、架构边界检查和 157 个测试通过；首次运行因测试用 `BasicLink` manifest 未声明 `variant/showArrow` 而失败，已修正测试 manifest 后重跑通过。 |
| `pnpm smoke:browser` | 通过 | Vue3 编辑器、内置 runtime、React H5 runtime、HTTP 配置平台 mock 和基础物料链路均通过。 |
| `pnpm pack:dry-run` | 通过 | 12 个可发布包 npm pack dry-run 均通过。 |
| `git diff --check` | 通过 | 无空白错误。 |

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备新增 editor 物料插入预设校验 API。 |
| 2026-08-01 | implemented | 已新增 `validateLowcodeMaterialInsertPresets`、类型、单测、README、changeset 和 AI 记忆，等待验证。 |
| 2026-08-01 | verified | 验证通过：`pnpm typecheck`、`pnpm test`、`pnpm smoke:browser`、`pnpm pack:dry-run` 和 `git diff --check` 均通过。 |
