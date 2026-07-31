# TASK-2026-0801-108-editor-node-operation-api

## 标题

沉淀编辑器节点操作模型 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 中节点右键菜单、画布上下文工具条和节点快捷键的展示模型、禁用条件、危险操作标记、快捷键识别和操作反馈文案沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台或独立编辑器 shell 可以复用同一套节点操作模型。

## 背景

当前节点增删改、复制、粘贴、移动、撤销和重做已经由 `@meumall/lowcode-editor` 的 headless command 执行，但节点菜单项、工具条按钮状态、快捷键判断和反馈文案仍散落在 `apps/editor-playground/src/App.vue`。这些能力是运营实际搭建页面的高频入口，后续迁入 Vue3 管理台时应复用同一套模型，避免每个宿主重复判断“哪些操作可用”和“哪个快捷键对应哪个动作”。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增节点操作 action 枚举和菜单项模型。
- 在 `@meumall/lowcode-editor` 新增节点操作菜单项创建 helper，覆盖重命名、前方插入、后方插入、加入容器、上移、下移、复制、粘贴、创建副本和删除。
- 在 `@meumall/lowcode-editor` 新增节点快捷键识别 helper，覆盖删除、复制、粘贴、创建副本、撤销和重做。
- 在 `@meumall/lowcode-editor` 新增节点操作反馈文案 helper。
- Vue3 编辑器 playground 改为消费 editor node operation API，并保持现有 UI 行为不变。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖节点操作模型 API。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或默认语义。
- 不改变 Material Manifest v1 字段结构或默认语义。
- 不改变 renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- 不把实际执行动作、确认弹窗、DOM 菜单定位、滚动画布、Vue 事件监听或剪贴板持久化放进 editor 包。
- 不新增快捷键绑定库或 UI 组件库。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的节点操作菜单模型、快捷键识别和反馈文案。
- `apps/editor-playground` 负责 Vue 展示、DOM 定位、事件监听、确认交互和调用现有 headless command 执行节点操作。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并用自己的组件库渲染菜单、工具条和快捷键提示。
- 权限、协作锁定、审计、多端快捷键差异和服务端保存仍由宿主业务系统负责。

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

1. 梳理 Vue3 编辑器当前节点右键菜单、工具条按钮和快捷键逻辑。
2. 在 editor 包新增节点操作模型、菜单项、快捷键识别和反馈文案 helper。
3. 将 Vue3 playground 改为消费 editor API，并保持现有交互行为不变。
4. 更新 editor 单测和 README。
5. 更新 editor interaction model 契约。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [ ] `@meumall/lowcode-editor` 导出节点操作 action 类型和菜单项模型。
- [ ] helper 可根据是否可插入、是否容器、是否可移动、是否可粘贴生成稳定菜单项。
- [ ] helper 可识别 Delete/Backspace、Meta/Ctrl+C、Meta/Ctrl+V、Meta/Ctrl+D、Meta/Ctrl+Z、Meta/Ctrl+Shift+Z 和 Ctrl+Y 对应节点操作。
- [ ] helper 可生成节点操作反馈文案。
- [ ] Vue3 编辑器 playground 节点菜单、工具条和快捷键识别复用 editor API。
- [ ] 不修改 Page Schema、Material Manifest、renderer、materials、runtime loader、adapters 或 Java 配置平台协议。
- [ ] editor README 和 editor interaction model 契约说明新增 API。
- [ ] editor 单测覆盖节点操作模型 API。
- [ ] `pnpm typecheck` 通过。
- [ ] `pnpm build` 通过。
- [ ] `pnpm test` 通过。
- [ ] `pnpm check:architecture` 通过。
- [ ] `pnpm smoke:browser` 通过。
- [ ] `pnpm pack:dry-run` 通过。

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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器节点菜单、快捷键、复制/粘贴/副本/删除、物料添加和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 当前 node operation API 只抽象菜单展示模型、快捷键识别和文案，不负责实际执行、权限、审计、协作锁定或服务端保存。
- 后续若 Java 管理台提供权限和协作锁定状态，可在现有 helper options 上做向后兼容扩展。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，68 个测试全部通过。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，覆盖 Vue3 编辑器节点菜单、删除、复制、粘贴、撤销、重做快捷键、物料添加和 H5 runtime 关键路径。
- `pnpm pack:dry-run` 通过，8 个可发布包 dry-run 均通过。

## 剩余风险

- 当前 node operation API 只抽象菜单展示模型、快捷键识别和文案，不负责实际执行、权限、审计、协作锁定或服务端保存。
- 后续 Java 管理台接入权限、协作锁定和审计时，需要在宿主 shell 中继续组合这些状态，或在现有 helper options 上做向后兼容扩展。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包节点操作模型 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | in_progress | 开始实现 editor 包节点操作公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 完成实现、文档和事实源更新，`pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm check:architecture`、`pnpm smoke:browser` 和 `pnpm pack:dry-run` 均通过。 |
