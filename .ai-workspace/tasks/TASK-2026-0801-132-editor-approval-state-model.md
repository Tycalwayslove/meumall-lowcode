# TASK-2026-0801-132-editor-approval-state-model

## 标题

沉淀 editor 审批状态模型

## 状态

verified

## 目标

在 `@meumall/lowcode-editor` 中沉淀框架无关的审批状态模型，用统一结构表达当前页面是否需要审批、是否审批中、是否通过、是否驳回、是否可编辑、是否可发布和对应原因，并让 Vue3 editor playground 通过该模型接入顶部审批状态展示和发布权限禁用态。

## 背景

运营活动页真实上线通常不是“编辑器直接发布”，而是经历提交审批、审批中只读、审批通过后发布、审批驳回后修改再提交等流程。当前仓库已沉淀 permission/capability API 和 collaboration state API，本任务继续补齐管理台必备的审批状态表达：审批状态负责说明“发布前处于什么流程阶段”，权限模型负责统一禁用发布等操作。当前任务只实现本地模型和 playground 演示，不实现 Java 审批接口。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `docs/editor-vue-shell-components.md`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 新增审批状态类型、审批参与人类型、审批状态创建 helper 和 permission/capability 桥接 helper。
- 默认状态为无需审批，保持现有 playground 直接预览和发布行为兼容。
- 支持 `none`、`draft`、`pending`、`approved`、`rejected` 和 `published` 状态。
- 支持提交人、审核人、提交时间、审核时间、原因/备注、是否可编辑、是否只读、是否可提交审批、是否可发布和禁用原因派生。
- Vue3 editor playground 接入审批状态，顶部工具栏展示审批状态 pill。
- Vue3 editor playground 的权限状态合并协作 readonly options 和审批 permission options。
- 补充 editor 单测，覆盖默认无需审批、草稿待提审、审批中、审批通过、审批驳回、已发布和权限桥接。
- 补充 browser smoke，确认默认审批状态实际展示。
- 更新 editor README、editor 交互契约、Vue shell 组件化说明、项目事实源、AI 上下文和 TODO。
- 运行类型检查、构建、测试、架构检查、浏览器 smoke 和 npm pack dry-run。

不包含：

- 不实现 Java 审批定义、审批实例、审批流转、驳回回填、审批通知或审批 API。
- 不实现发布审批按钮、审批弹窗、审批表单、审批历史列表或真实审批详情页。
- 不改变 Page Schema v1、Material Manifest v1、renderer、materials、runtime loader 或 Java 配置平台草案。
- 不新增 npm 包、不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责从宿主提供的审批状态和时间信息派生审批状态展示模型。
- `@meumall/lowcode-editor` 负责将审批状态转换为 permission/capability API 可消费的 readonly 和 action decision。
- `apps/editor-playground` 负责演示顶部审批状态展示和发布禁用态接入。

外部系统：

- Java 管理台未来负责提供真实审批状态、审批人、审批时间、审批备注、提交审批、撤销审批、审核和发布控制。
- Java 配置平台、H5 runtime 和业务系统不受本任务影响。

## 契约影响

- 是否影响跨包或跨系统契约：是。
- 契约文档路径：`.ai-workspace/contracts/editor-interaction-model-v1.md`。
- 是否向后兼容：是，新增 API、可选 action key 和可选 UI 入参，默认无需审批且保持现有行为。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`.ai-workspace/contracts/editor-interaction-model-v1.md`、`docs/editor-vue-shell-components.md`。
- 需要确认的角色：前端、Java 管理台。
- 当前确认状态：本任务先定义本地模型，真实审批接口后续单独确认。

## 实现计划

1. 在 `packages/editor` 新增审批状态类型和 helper。
2. 将审批状态桥接到 editor permission/capability options。
3. 在 Vue3 editor playground 顶部工具栏展示审批状态，并合并协作与审批权限基线。
4. 补充 editor 单测、browser smoke 和契约说明。
5. 更新 AI 工作流事实源并运行验证命令。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出审批状态类型、状态创建 helper 和 permission/capability 桥接 helper。
- [x] 默认审批状态为无需审批，现有 playground 预览和发布行为不变。
- [x] `draft` 展示待提交审批，并禁用直接发布。
- [x] `pending` 展示审批中，并通过 readonly options 禁用写操作。
- [x] `approved` 展示审批通过，并允许发布。
- [x] `rejected` 展示审批驳回，并禁用直接发布。
- [x] `published` 展示已发布，并禁用重复发布。
- [x] Vue3 editor playground 顶部工具栏展示审批状态。
- [x] Vue3 editor playground 的权限状态合并协作与审批 options。
- [x] `scripts/browser-smoke.mjs` 验证默认审批状态实际渲染。
- [x] `.ai-workspace/contracts/editor-interaction-model-v1.md` 记录审批状态模型边界和兼容性要求。
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
- 是否影响 Java 配置平台：无直接影响，后续管理台可按审批状态模型对接真实审批服务。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证编辑器 shell、顶部工具栏、审批状态、权限基线、节点操作、快捷命令、Schema 导入导出和 H5 runtime 关键路径。

## 风险和阻塞

- 本任务只提供本地审批状态模型和 playground 展示，不保证真实 Java 审批接口已接入。
- 审批状态只表达展示、readonly 基线和发布 action decision，不处理审批实例、审批流转、通知、审批历史或服务端审计。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，75 个 node test 全部通过，并内含架构检查。
- `pnpm check:architecture` 通过。
- `pnpm smoke:browser` 通过，新增覆盖“编辑器审批状态存在”，并继续覆盖 Vue3 编辑器 shell、快捷命令、节点右键菜单、节点快捷键、Schema 导入导出、模板应用、编辑器内置 runtime、React H5 runtime 和 fallback 场景。
- `pnpm pack:dry-run` 通过，8 个可发布包均可完成 npm pack dry-run。

## 剩余风险

- 本任务只沉淀本地审批状态模型和 playground 展示；真实 Java 审批定义、审批实例、提交审批、撤销审批、审核审批、审批历史、通知、审计和发布前强制审批仍需后续任务接入。
- `?approval=draft|pending|approved|rejected|published` 仅作为 playground 本地演示入口，不是正式生产 URL 协议。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 审批状态模型、permission/capability 桥接、playground 顶部展示、契约和验证。 |
| 2026-08-01 | in_progress | 开始实现框架无关审批状态模型，并桥接到现有 permission/capability action decision。 |
| 2026-08-01 | verified | 完成审批状态模型、permission/capability 桥接、Vue3 playground 顶部状态展示、契约同步和验证。 |
