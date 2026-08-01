# TASK-2026-0801-174-editor-material-insert-targets

## 状态

verified

## 目标

沉淀编辑器物料插入目标模型，让 Vue3 编辑器 playground 的物料面板和画布上下文工具条能够统一展示“可插入位置、禁用原因和目标文案”，并在只读、协作锁或审批阻塞状态下明确阻止物料插入。

## 背景

当前 Vue3 编辑器 playground 已支持点击物料追加、选中节点前后插入、容器内插入、拖拽投放和命令面板添加。但“插入目标”和“禁用原因”主要散落在 `App.vue` 内，物料面板仍容易给用户一种只读状态也可以继续添加物料的错觉。为了后续迁移到管理系统时体验更稳定，需要把插入状态模型沉淀到 `@meumall/lowcode-editor`，由宿主 UI 统一消费。

## 涉及包或系统

- `@meumall/lowcode-editor`
- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- AI 工作区状态文档

## 范围

包含：

- 在 `@meumall/lowcode-editor` 中新增物料插入目标/禁用模型。
- 给模型补充单元测试和 README 说明。
- Vue3 编辑器物料面板展示插入禁用原因，并禁用新增、收藏快捷添加和详情添加入口。
- Vue3 编辑器画布上下文工具条展示当前插入目标提示，并复用同一模型控制前方、后方、加入容器按钮禁用态。
- browser smoke 覆盖只读协作状态下物料插入被禁用。
- 同步 `.ai` 状态、TODO、测试报告和任务记录。

不包含：

- 不新增、删除或重命名任何物料。
- 不改变 Page Schema v1 或 Material Manifest v1。
- 不改变拖拽投放算法、schema 结构、数据源协议或 action 协议。
- 不接真实 Java 配置平台。

## 责任边界

当前仓库：

- 提供框架无关的物料插入目标模型。
- 在 Vue3 playground 中验证 UI 消费方式。
- 保持 editor API 不依赖 renderer、materials 或业务项目。

外部系统：

- Java 管理台后续可复用该模型，但本任务不实现真实管理台。

## 契约影响

- 是否影响跨包或跨系统契约：影响 `@meumall/lowcode-editor` 公开 API；不影响 Page Schema v1、Material Manifest v1、Java 配置平台 API 或 H5 runtime 集成协议。
- 契约文档路径：`packages/editor/README.md`、本任务文件。
- 是否向后兼容：是，新增 API 和 UI 状态，不破坏旧 API。
- 是否需要迁移：不需要。
- 是否需要灰度或双版本兼容：不需要。

## 对接说明

- 是否需要对接说明：需要，记录在 `packages/editor/README.md`。
- 需要确认的角色：未来管理台前端。
- 当前确认状态：本地 playground 先验证。

## 验收标准

- [x] `@meumall/lowcode-editor` 暴露可复用物料插入目标模型。
- [x] 模型能表达 append、before、after、inside 的 label、description、disabled 和 disabledReason。
- [x] 只读、协作锁或审批阻塞时，物料面板和详情添加入口展示禁用原因并阻止添加。
- [x] 画布上下文工具条复用模型展示插入目标文案，前方/后方/加入容器禁用态一致。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 覆盖只读状态下物料插入禁用。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
```

## 发布影响

- 是否需要发布：本任务不执行真实 npm 发布。
- 发布对象：后续发布时涉及 `@meumall/lowcode-editor` patch/minor，具体版本由 Changesets 发布流程统一决定。
- 是否影响 schema 兼容性：否。
- 是否影响 H5 接入：否。
- 是否影响 Java 配置平台：否。
- 是否需要 GitHub tag/release：本任务不需要。
- 回滚目标：回滚本任务提交后，物料插入禁用和目标提示恢复为旧 playground 私有逻辑。
- smoke check：`pnpm smoke:browser`。

## 风险和阻塞

- 如果模型过度绑定 Vue3 playground UI，会降低管理台复用价值；实现时必须保持纯数据模型。
- 拖拽投放仍由 canvas drop API 管理，本任务只覆盖点击/快捷插入入口，避免范围过大。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为物料插入目标模型和 Vue3 playground 禁用态接入。 |
| 2026-08-01 | verified | 新增 editor 物料插入目标 API，Vue3 playground 物料面板、详情、上下文工具条和拖拽插入统一消费插入权限与禁用原因；`pnpm typecheck`、`pnpm test`、`pnpm smoke:browser` 均通过。 |
