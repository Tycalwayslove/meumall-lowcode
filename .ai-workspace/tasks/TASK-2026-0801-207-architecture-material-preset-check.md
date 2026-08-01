# TASK-2026-0801-207-architecture-material-preset-check

## 状态

verified

## 目标

把 `@meumall/lowcode-editor` 的物料插入预设校验能力接入项目级架构检查，确保内置预设写入的 props 能被 React/Vue H5 物料 manifest 消费，降低后续扩展基础物料或业务物料时字段漂移的风险。

## 背景

`validateLowcodeMaterialInsertPresets` 已在 editor 包提供字段名一致性校验，但目前只有 editor 单测直接覆盖。由于物料库会持续扩展，架构检查应在 build 后通过公开包入口验证 editor 内置预设与 React/Vue H5 manifest 的兼容性，让后续新增物料或修改 manifest 时能更早暴露问题。

## 涉及包或系统

- `@meumall/lowcode-editor`
- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- 根级架构检查脚本
- 文档与 AI 工作流

## 范围

包含：

- 在 `pnpm check:architecture` 中补充物料插入预设与 React/Vue H5 manifest 的兼容性检查。
- 检查 build 产物存在时通过公开 dist 入口读取 `validateLowcodeMaterialInsertPresets`、`h5Materials` 和 `h5VueMaterials`。
- build 产物缺失时保留原有静态架构检查，并输出需要先构建才能启用完整预设兼容检查的提示。
- 更新 README、任务记录和项目记忆。

不包含：

- 不修改 Page Schema v1 或 Material Manifest v1 结构。
- 不新增、删除或调整物料 manifest 字段。
- 不修改 renderer、runtime 或编辑器 UI 行为。
- 不接 Java 配置平台、远程物料市场或 CI 配置。

## 责任边界

当前仓库：

- 架构检查负责识别 editor 内置物料预设与当前 React/Vue H5 物料 manifest 的字段不兼容问题。
- `pnpm test` 负责在 build 后执行完整架构检查。

外部系统：

- Java 配置平台、未来远程物料市场和管理台仍需要各自处理远程预设审核、权限、审批和服务端校验。

## 契约影响

- 是否影响跨包或跨系统契约：不改变契约结构；增强跨包契约验证。
- 契约文档路径：`README.md`、`.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md`
- 是否向后兼容：是。只增加检查逻辑，不改变公开 API。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要。
- 对接说明路径：`README.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 在架构检查脚本中增加 build 产物导入 helper。
2. 通过 editor 公开 API 校验 React/Vue H5 物料 manifest 对应的内置预设字段。
3. 更新 README、项目记忆和验证记录。

## 验收标准

- [x] `pnpm check:architecture` 在未构建或已构建场景下都有清晰行为。
- [x] `pnpm test` 在 build 后会执行物料预设与 React/Vue H5 manifest 兼容性检查。
- [x] 检查失败信息能指出物料端、组件名、预设 id 和问题字段。
- [x] 不改变 schema、manifest、renderer、runtime 或 editor UI 行为。
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

- 是否需要发布：不单独发布。
- 发布对象：无。
- 是否需要 changeset：否，未改变 npm 包公开 API 或运行时行为。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可。
- smoke check：`pnpm smoke:browser` 确认编辑器和 H5 runtime 关键链路不受影响。

## 风险和阻塞

- 风险：build 产物缺失时直接运行 `pnpm check:architecture` 只执行静态边界检查，并提示先运行 `pnpm build` 以启用完整预设兼容检查；`pnpm test` 会先 build，所以 CI/完整验证仍覆盖该护栏。
- 阻塞：无。

## 验证结果

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `pnpm build` | 通过 | 重新生成 dist，确保架构检查读取到最新公开入口。 |
| `pnpm check:architecture` | 通过 | 新增的物料预设兼容性检查通过；首次运行发现旧预设字段漂移，已修正后重跑通过。 |
| `pnpm typecheck` | 通过 | TypeScript project references、Vue3 editor playground 和 React H5 runtime playground 类型检查通过。 |
| `pnpm test` | 通过 | 构建、架构边界检查和 157 个测试通过。 |
| `pnpm smoke:browser` | 通过 | Vue3 编辑器、内置 runtime、React H5 runtime、HTTP 配置平台 mock 和基础物料链路通过。 |
| `pnpm pack:dry-run` | 通过 | 12 个可发布包 npm pack dry-run 均通过。 |
| `git diff --check` | 通过 | 无空白错误。 |

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备将物料预设字段兼容性接入架构检查。 |
| 2026-08-01 | implemented | 已接入 build 后公开入口预设兼容性检查，修正默认物料插入预设旧字段，并补充单测、README、changeset 和项目记忆。 |
| 2026-08-01 | verified | 验证通过：`pnpm build`、`pnpm check:architecture`、`pnpm typecheck`、`pnpm test`、`pnpm smoke:browser`、`pnpm pack:dry-run` 和 `git diff --check` 均通过。 |
