# TASK-2026-0801-080-editor-readiness-api

## 标题

沉淀编辑器发布检查和交付摘要 API

## 状态

verified

## 目标

将 Vue3 editor playground 中已经成型的发布检查、节点统计和交付摘要纯逻辑沉淀到 `@meumall/lowcode-editor`，让后续迁入管理系统或拆分正式编辑器 UI 时可以复用同一套 editor core 能力，而不是继续把关键判断锁在 playground 单文件组件里。

## 背景

当前 playground 已具备较完整的实操能力：节点编辑、发布检查、H5 预览入口、交付分享清单等。但 `packages/editor` 目前主要是状态和节点操作，发布 readiness 仍散落在 `apps/editor-playground/src/App.vue`。这会让后续迁管理台时复用成本升高，也容易导致多个 UI 壳重复实现不同口径的检查。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `package.json`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 增加节点扁平化、节点显示名、节点计数 API。
- 在 `@meumall/lowcode-editor` 增加发布检查 API，覆盖 schema 校验、空节点、图片字段、商品内容、数据源解析失败、事件引用缺失和常见 action 参数提醒。
- 在 `@meumall/lowcode-editor` 增加发布检查摘要和交付摘要 API。
- Vue3 editor playground 改为复用 editor 包 API。
- 为 editor 包新增 Node 单元测试，并接入根级 `pnpm test`。
- 更新 README 和 `.ai` 项目事实源。

不包含：

- 不修改 Page Schema v1 字段。
- 不修改 Material Manifest v1 字段。
- 不修改 renderer 或 materials 渲染行为。
- 不接入真实 Java 配置平台。
- 不拆分正式管理台 UI 组件。
- 不新增 npm 版本和 changeset。

## 责任边界

当前仓库：

- `packages/editor` 提供框架无关 editor readiness API。
- `apps/editor-playground` 只负责把 API 结果渲染成 Vue3 UI。
- 测试负责验证 API 口径。

外部系统：

- Java 配置平台后续可复用检查结果或自行做服务端更严格校验。
- `hybird-meumall` 不受本任务影响。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 `@meumall/lowcode-editor` 公开 API，但不改变既有 API。
- 契约文档路径：`packages/editor/README.md`。
- 是否向后兼容：是，新增导出。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是，更新 `packages/editor/README.md`。
- 需要确认的角色：无。
- 当前确认状态：本任务无需外部确认。

## 实现计划

1. 新增 editor readiness 类型和纯函数。
2. Vue3 playground 删除本地重复逻辑，调用 editor API。
3. 为 editor API 添加单元测试。
4. 更新根级测试命令、README 和项目事实源。
5. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出节点统计和显示名 API。
- [x] `@meumall/lowcode-editor` 导出发布检查和检查摘要 API。
- [x] `@meumall/lowcode-editor` 导出交付摘要 API。
- [x] Vue3 editor playground 发布检查和交付清单复用 editor API。
- [x] editor 包单测覆盖节点统计、检查摘要、图片缺失、商品缺失、数据源失败、action 引用缺失和 action 参数提醒。
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

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否。
- 是否影响 npm 发布：新增 editor 包 API，未来真实 npm 发布时应作为 patch/minor 变更评估；本任务不执行发布。
- 回滚目标：回滚本任务提交。
- smoke check：本任务不改变运行时渲染，可用 `pnpm smoke:browser` 验证 playground UI 行为。

## 风险和阻塞

- 当前发布检查仍是编辑器侧基础 readiness，不替代 Java 服务端发布校验、审批、审计和权限。
- 真实管理台接入时可能需要增加业务自定义检查扩展点。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包发布检查和交付摘要 API。 |
| 2026-08-01 | in_progress | 开始沉淀 editor readiness API、改造 playground 复用并补充测试。 |
| 2026-08-01 | verified | 完成 editor readiness API、Vue3 playground 复用、editor 单测和文档事实源更新；`pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm check:architecture`、`pnpm smoke:browser`、`pnpm pack:dry-run` 均通过。 |
