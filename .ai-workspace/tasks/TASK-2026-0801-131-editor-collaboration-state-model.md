# TASK-2026-0801-131-editor-collaboration-state-model

## 标题

沉淀 editor 协作锁定状态模型

## 状态

verified

## 目标

在 `@meumall/lowcode-editor` 中沉淀框架无关的协作锁定状态模型，用统一结构表达当前页面是否可编辑、是否被自己或他人锁定、是否为只读查看、锁定说明和到期文案，并让 Vue3 editor playground 通过该模型接入顶部协作状态展示和权限 readonly 基线。

## 背景

低代码编辑器后续迁入 Java 管理台后，会遇到多人同时编辑、审批中只读、页面锁定、锁过期和查看态等场景。上一任务已沉淀 editor permission/capability API，本任务继续向真实多人协作编辑器靠近：协作状态负责说明“为什么当前能不能编辑”，权限模型负责统一禁用具体操作。当前任务只实现本地模型和 playground 演示，不实现服务端锁接口。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 新增协作锁定状态类型、协作者类型、状态创建 helper 和权限 readonly options 桥接 helper。
- 默认状态为可编辑，保持现有 playground 行为兼容。
- 支持 `unlocked`、`locked-by-me`、`locked-by-other`、`readonly` 和 `expired` 状态。
- 支持锁持有人、锁到期时间、当前时间、只读说明和锁定说明的展示模型派生。
- Vue3 editor playground 接入协作状态，顶部工具栏展示协作状态 pill。
- Vue3 editor playground 的权限状态通过协作状态 readonly options 创建，未来锁定/审批状态可统一禁用写操作。
- 补充 editor 单测，覆盖默认可编辑、自己锁定、他人锁定、只读、过期和权限桥接。
- 更新 editor 交互契约、Vue shell 组件化说明、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不实现 Java 管理台真实锁接口、抢锁、续期、释放锁或冲突合并。
- 不实现 WebSocket、SSE、实时协同编辑、版本合并或操作日志同步。
- 不改变 Page Schema v1、Material Manifest v1、renderer、materials、runtime loader 或 Java 配置平台草案。
- 不新增 npm 包、不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责从宿主提供的锁状态和时间信息派生协作状态展示模型。
- `@meumall/lowcode-editor` 负责将协作状态转换为 permission/capability API 可消费的 readonly options。
- `apps/editor-playground` 负责演示顶部协作状态展示和 readonly 基线接入。

外部系统：

- Java 管理台未来负责提供真实用户、锁持有人、锁状态、锁到期、审批只读和刷新/释放锁动作。
- Java 配置平台、H5 runtime 和业务系统不受本任务影响。

## 契约影响

- 是否影响跨包或跨系统契约：是。
- 契约文档路径：`.ai-workspace/contracts/editor-interaction-model-v1.md`。
- 是否向后兼容：是，新增 API 和可选 UI 入参，默认可编辑。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`.ai-workspace/contracts/editor-interaction-model-v1.md`、`docs/editor-vue-shell-components.md`。
- 需要确认的角色：前端、Java 管理台。
- 当前确认状态：本任务先定义本地模型，真实锁接口后续单独确认。

## 实现计划

1. 在 `packages/editor` 新增协作锁定状态类型和 helper。
2. 将协作状态桥接到 editor permission readonly options。
3. 在 Vue3 editor playground 顶部工具栏展示协作状态，并让权限状态消费协作 readonly 基线。
4. 补充 editor 单测和契约说明。
5. 更新 AI 工作流事实源并运行验证命令。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出协作锁定状态类型、状态创建 helper 和权限 readonly options 桥接 helper。
- [x] 默认协作状态为可编辑，不改变现有 playground 操作行为。
- [x] `locked-by-me` 展示自己持锁且仍可编辑。
- [x] `locked-by-other` 展示他人持锁并通过 readonly options 禁用写操作。
- [x] `readonly` 展示只读说明并通过 readonly options 禁用写操作。
- [x] `expired` 展示锁过期并通过 readonly options 禁用写操作。
- [x] Vue3 editor playground 顶部工具栏展示协作状态。
- [x] Vue3 editor playground 的权限状态从协作 readonly options 派生。
- [x] `.ai-workspace/contracts/editor-interaction-model-v1.md` 记录协作状态模型边界和兼容性要求。
- [x] 不新增 npm 包、不新增依赖、不改变 Page Schema v1 或 renderer 行为。
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

- 是否需要发布：暂不发布。
- 发布对象：后续发布 `@meumall/lowcode-editor` 时包含新增向后兼容 API。
- 是否需要 changeset：暂不需要，当前仍处架构搭建阶段。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否。
- 是否影响 npm 发布：新增公开 API，需通过 `pnpm pack:dry-run` 验证。
- 是否影响 Java 配置平台：无直接影响，后续管理台可按协作状态模型对接真实锁服务。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证编辑器 shell、顶部工具栏、权限基线、节点操作、快捷命令、Schema 导入导出和 H5 runtime 关键路径。

## 风险和阻塞

- 本任务只提供本地协作状态模型和 playground 展示，不保证真实 Java 锁接口已接入。
- 协作状态只表达展示和 readonly 基线，不处理锁续期、抢锁、释放锁、实时协同、冲突合并或服务端审计。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，74 个 node test 全部通过，并内含架构检查。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，新增覆盖“编辑器协作状态存在”，并继续覆盖 Vue3 编辑器 shell、快捷命令、节点右键菜单、节点快捷键、Schema 导入导出、模板应用、编辑器内置 runtime、React H5 runtime 和 fallback 场景。
- `pnpm pack:dry-run` 通过，8 个可发布包均可完成 npm pack dry-run。

## 剩余风险

- 本任务只沉淀本地协作锁定状态模型和 playground 展示；真实 Java 管理台锁接口、抢锁、续期、释放锁、审批态映射、审计和冲突合并仍需后续任务接入。
- `?collaboration=locked-me|locked-other|readonly|expired` 仅作为 playground 本地演示入口，不是正式生产 URL 协议。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 协作锁定状态模型、permission readonly 桥接、playground 顶部展示、契约和验证。 |
| 2026-08-01 | in_progress | 开始实现框架无关协作状态模型，并桥接到现有 permission/capability readonly 基线。 |
| 2026-08-01 | verified | 完成协作锁定状态模型、permission readonly 桥接、Vue3 playground 顶部状态展示、契约同步和验证。 |
