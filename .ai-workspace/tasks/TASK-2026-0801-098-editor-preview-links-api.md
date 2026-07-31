# TASK-2026-0801-098-editor-preview-links-api

## 标题

沉淀编辑器 H5 预览链接 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 中 H5 预览入口的列表展示模型、可用状态和摘要口径沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台或独立编辑器 shell 可以复用同一套预览入口展示协议。

## 背景

当前 Vue3 编辑器右侧发布区域已集中展示当前草稿 React H5、页面草稿/最新版本 H5 和最近发布版本 H5 的打开/复制入口，但列表模型仍写在 `apps/editor-playground/src/App.vue`。预览入口是“编辑器产物 -> H5 渲染验收”的关键实操链路，应将与 DOM、URL 构造和运行时实现无关的展示模型抽到 editor 包。URL 仍由宿主提供，避免 editor 反向依赖 adapters、renderer 或具体 runtime 地址。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增 H5 预览链接 source、item、状态和摘要 helper。
- Vue3 编辑器 playground 改为消费 editor 包的预览链接 API。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖可用链接、不可用链接、过滤和摘要。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或校验规则。
- 不改变 renderer、materials、runtime schema loader 或 schema URL handoff 协议。
- 不在 editor 包中引入 `window`、`URL`、`location`、`navigator.clipboard`、`encodePageSchemaToUrlParam` 或具体 runtime 地址。
- 不接入真实 Java previewToken、releaseId 查询或权限。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的预览链接展示模型和摘要纯 helper。
- `apps/editor-playground` 负责构造具体 URL、打开新窗口、复制到剪贴板和用户反馈。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并将 URL 构造替换为真实 previewToken、pageId 或 releaseId 协议。

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

1. 梳理 Vue3 编辑器当前 H5 预览入口列表逻辑。
2. 在 editor 包新增预览链接类型和 helper。
3. 更新 editor 单测和 README。
4. 更新 editor interaction model 契约。
5. 将 Vue3 playground 改为消费 editor API，并保持现有入口行为不变。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出预览链接列表和摘要 helper。
- [x] helper 可表达 ready/disabled 状态、openable/copyable 状态和状态文案。
- [x] Vue3 编辑器 playground 的 H5 预览入口和交付清单复用 editor API。
- [x] 不修改 Page Schema、renderer、materials、runtime loader 或 URL handoff 协议。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖预览链接 API。
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

- 是否需要发布：否，本任务只提交源码和文档；未来真实 npm 发布时作为 `@meumall/lowcode-editor` 向后兼容 minor 能力评估。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否。
- 是否影响 npm 发布：新增 editor 包公开 API，`pnpm pack:dry-run` 需要通过。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器 H5 预览入口、交付清单和 H5 runtime 关键路径仍可用。

## 风险和阻塞

- 当前只抽象预览链接展示模型，真实 Java previewToken、鉴权、过期时间、灰度环境和审计仍需后续单独设计。
- 未来若生产入口从 URL schema handoff 切换为 Java releaseId/pageId 查询协议，应由宿主替换 URL 构造，不破坏 editor 预览链接展示 API。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，58 个测试全部通过，包含 editor preview links API 单测。
- `pnpm check:architecture`：通过，包结构、依赖方向、物料 manifest 对齐和 primitives 边界未破坏。
- `pnpm smoke:browser`：通过，Vue3 编辑器 H5 预览入口、交付清单和 H5 runtime 关键路径仍可用。
- `pnpm pack:dry-run`：通过，8 个可发布包 dry-run 全部通过，包含 `@meumall/lowcode-editor`。

## 剩余风险

- 当前 preview links API 只抽象预览入口展示模型，真实 Java previewToken、鉴权、过期时间、灰度环境和审计仍需后续单独设计。
- 本任务新增 `@meumall/lowcode-editor` 公开 API，但未执行真实 npm 发布；真实发布仍需 registry、access、token 和 changeset 版本确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包 H5 预览链接 API 和 Vue3 playground 复用。 |
| 2026-08-01 | in_progress | 开始实现 editor 包 H5 预览链接公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包 H5 预览链接 API、Vue3 playground 复用、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
