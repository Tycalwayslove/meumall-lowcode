# TASK-2026-0801-095-editor-prop-groups-api

## 标题

沉淀编辑器属性分组 API

## 状态

verified

## 目标

把 Vue3 编辑器 playground 中属性面板的字段归类、分组展示元信息和折叠状态 helper 沉淀为 `@meumall/lowcode-editor` 的框架无关 API，让后续 Java 管理台或独立编辑器通过 npm 引入时可以复用同一套属性分组口径。

## 背景

当前 Vue3 编辑器 playground 已支持右侧属性面板按内容配置、样式配置、数据配置、行为配置和其他配置分组折叠展示，但字段归类规则仍写在 `apps/editor-playground/src/App.vue`。属性面板是运营配置物料的核心体验，应将与 Vue 和 DOM 无关的分组规则迁回 `packages/editor`，playground 只保留 UI 渲染、具体 setter 控件和用户折叠交互。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增属性分组 key、分组元信息、字段条目、分组列表和折叠状态 helper。
- Vue3 编辑器 playground 改为消费 editor 包的属性分组 API。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖内容、样式、数据、行为、其他分组和折叠状态 helper。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Material Manifest 字段结构或 propsSchema 语义。
- 不改变具体属性 setter UI 控件。
- 不改变数组属性列表编辑器、图片素材选择器或商品/优惠券/门店资源选择器。
- 不修改 Page Schema 或 renderer。
- 不接入真实管理台权限、字段锁定或审计。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的属性分组归类和折叠状态纯 helper。
- `apps/editor-playground` 负责 UI 展示、setter 控件、资源选择器、数组列表编辑和用户反馈。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包的属性分组 API。
- 字段权限、锁定、审计、远程表单配置和管理台组件库仍是外部系统或后续编辑器能力，本任务不实现。

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

1. 阅读 Vue3 编辑器属性面板当前字段归类、分组元信息和折叠状态逻辑。
2. 在 editor 包新增属性分组类型、常量和 helper。
3. 更新 editor 单测和 README。
4. 更新 editor interaction model 契约。
5. 将 Vue3 playground 改为消费 editor API，并保持现有属性面板 UI 行为不变。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出属性分组 key、默认顺序、元信息、字段归类、分组生成和折叠状态 helper。
- [x] helper 可按字段名、setter 和字段类型归类到内容、样式、数据、行为或其他分组。
- [x] Vue3 编辑器 playground 的 `selectedPropGroups` 和折叠状态逻辑复用 editor API。
- [x] 不修改 Material Manifest、Page Schema 或 renderer。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖属性分组 API。
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
- smoke check：`pnpm smoke:browser` 验证 Vue3 编辑器属性面板分组折叠和属性编辑关键路径仍可用。

## 风险和阻塞

- 当前只处理 propsSchema 本地归类，不处理真实管理台字段权限、锁定、审计和远程表单配置。
- 未来若 Java 管理台需要服务端控制字段分组或排序，应通过可选字段或新增 helper 扩展，不应破坏现有分组口径。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，55 个测试全部通过，包含 editor prop groups API 单测。
- `pnpm check:architecture`：通过，包结构、依赖方向、物料 manifest 对齐和 primitives 边界未破坏。
- `pnpm smoke:browser`：通过，Vue3 编辑器属性面板分组折叠、属性编辑和相关关键路径仍可用。
- `pnpm pack:dry-run`：通过，8 个可发布包 dry-run 全部通过，包含 `@meumall/lowcode-editor`。

## 剩余风险

- 当前属性分组 API 只抽象本地 `propsSchema` 展示模型，真实管理台的字段权限、锁定、审计、远程表单配置和组件库 setter 仍需后续单独设计。
- 本任务新增 `@meumall/lowcode-editor` 公开 API，但未执行真实 npm 发布；真实发布仍需 registry、access、token 和 changeset 版本确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包属性分组 API 和 Vue3 playground 复用。 |
| 2026-08-01 | in_progress | 开始实现 editor 包属性分组公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包属性分组 API、Vue3 playground 复用、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
