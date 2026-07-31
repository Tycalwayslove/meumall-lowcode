# TASK-2026-0801-130-editor-permission-model

## 标题

沉淀 editor 权限能力模型

## 状态

verified

## 目标

在 `@meumall/lowcode-editor` 中沉淀框架无关的编辑器权限/能力决策模型，让 Java 管理台、Vue3 编辑器 playground 和未来协作锁定/审批流可以用统一 action key 描述“能不能做某个编辑器操作”和“为什么不可用”，避免权限判断散落在 Vue 组件或业务代码里。

## 背景

当前 Vue3 editor playground 已完成主要 shell 组件拆分，节点右键菜单和画布上下文工具条都通过 node operation API 派生可用态，但权限、协作锁定、审批状态和管理台扩展插槽尚未统一。后续接入 Java 管理台时，运营角色、页面锁定、审批中、只读查看、发布权限等能力都需要影响快捷命令、节点操作、保存发布和导入导出入口。本任务先沉淀最小可复用模型，不引入真实业务角色或后端接口。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 新增编辑器权限 action key、权限决策、权限状态和创建/读取 helper。
- 默认权限全部允许，保证现有 playground 和 npm 消费方不需要迁移。
- 支持 readonly 基线，用于宿主在页面锁定、审批中、协作占用等场景统一禁用写操作。
- 扩展 node operation API 的可用态入参，让重命名、复制、创建副本和删除也可被宿主权限模型禁用。
- Vue3 editor playground 接入权限状态，快捷命令和节点操作从统一 helper 派生禁用态。
- 补充 editor 单测，覆盖默认允许、显式拒绝、readonly 基线和 node operation 扩展禁用态。
- 更新 editor 交互契约、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不实现 Java 管理台真实用户角色、菜单权限、接口权限或审批接口。
- 不实现多人协作锁服务、锁续期、冲突合并或实时同步。
- 不改变 Page Schema v1、Material Manifest v1、renderer、materials、runtime loader 或 Java 配置平台草案。
- 不新增 `@meumall/lowcode-editor-vue` 或其他新 npm 包。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责定义稳定 action key、权限决策状态、readonly 基线和禁用原因读取 helper。
- `@meumall/lowcode-editor` 负责从宿主传入的能力状态派生 node operation 展示项，不执行真实节点命令。
- `apps/editor-playground` 负责演示如何把权限状态接入快捷命令和节点操作，但仍使用默认全允许状态。

外部系统：

- Java 管理台未来负责提供用户、页面、审批、协作锁和菜单权限结果，并映射为本任务定义的 action key。
- Java 配置平台、H5 runtime 和业务系统不受本任务影响。

## 契约影响

- 是否影响跨包或跨系统契约：是。
- 契约文档路径：`.ai-workspace/contracts/editor-interaction-model-v1.md`。
- 是否向后兼容：是，新增 API 和可选入参，默认全部允许。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`.ai-workspace/contracts/editor-interaction-model-v1.md`。
- 需要确认的角色：前端、Java 管理台。
- 当前确认状态：本任务先定义本地模型，真实管理台权限接入后续单独确认。

## 实现计划

1. 在 `packages/editor` 新增权限 action、权限决策、权限状态和 readonly helper。
2. 扩展 `createLowcodeNodeOperationItems` 可选能力入参，保持默认行为不变。
3. 在 Vue3 editor playground 中用权限 helper 派生快捷命令和节点操作禁用态。
4. 补充 editor 单测和交互契约说明。
5. 更新 AI 工作流事实源并运行验证命令。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出权限 action、权限状态创建 helper、可用性判断 helper 和禁用原因读取 helper。
- [x] 默认权限状态对所有 action 返回允许，保持现有行为兼容。
- [x] 显式拒绝 action 时，helper 能返回不可用和禁用原因。
- [x] readonly 基线能禁用写操作，并保留查看/导出类操作。
- [x] node operation API 支持重命名、复制、创建副本和删除的可选禁用态，默认行为不变。
- [x] Vue3 editor playground 的快捷命令和节点操作从统一权限状态派生禁用态。
- [x] `.ai-workspace/contracts/editor-interaction-model-v1.md` 记录权限模型边界和兼容性要求。
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
- 是否影响 Java 配置平台：无直接影响，后续管理台可按 action key 对接。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证编辑器 shell、节点操作、快捷命令、Schema 导入导出和 H5 runtime 关键路径。

## 风险和阻塞

- 本任务只提供本地权限模型，不保证 Java 管理台真实角色和审批策略已接入。
- readonly 基线只是通用决策输入，不处理锁续期、抢锁、审批流状态迁移或服务端审计。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，73 个 node test 全部通过，并内含架构检查。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，覆盖 Vue3 编辑器 shell、快捷命令、节点右键菜单、节点快捷键、Schema 导入导出、模板应用、编辑器内置 runtime、React H5 runtime 和 fallback 场景。
- `pnpm pack:dry-run` 通过，8 个可发布包均可完成 npm pack dry-run。
- `git diff --check` 通过。

## 剩余风险

- 本任务只沉淀本地权限/能力模型和 playground 接入；真实 Java 管理台用户角色、审批状态、协作锁定、菜单权限、审计和服务端保存仍需后续任务接入。
- readonly 基线仅表达只读决策，不处理锁续期、抢锁、审批流状态迁移或服务端冲突合并。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 权限能力模型、node operation 可用态扩展、playground 接入、契约和验证。 |
| 2026-08-01 | in_progress | 开始实现框架无关权限决策状态和 Vue3 playground 接入，默认保持全部允许以兼容现有行为。 |
| 2026-08-01 | verified | 完成权限能力模型、node operation 可用态扩展、Vue3 playground 接入、契约同步和验证。 |
