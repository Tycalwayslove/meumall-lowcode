# TASK-2026-0801-144-basic-card-material

## 标题

新增基础图文卡片通用物料

## 状态

verified

## 目标

在现有基础按钮、输入、文本、图片、标签和基础容器能力之上，新增一个业务无关的 `BasicCard` 通用图文卡片物料，让运营可以用单个物料快速组合图片、标签、标题、说明和行动按钮，并保持 React/Vue H5 runtime manifest 语义一致。

## 背景

当前通用物料已经覆盖原子级能力，但运营真实搭建活动页时经常需要“图片 + 标签 + 标题 + 说明 + 按钮”的可点击卡片。若每次都依赖多个基础物料手动拼装，会增加搭建成本，也不利于模板复用。`BasicCard` 应作为 Generic Materials 层的组合物料，复用内部 runtime primitives，不承载具体业务数据或业务接口。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `docs/material-layering-architecture.md`
- `.ai/`

## 范围

包含：

- 新增 React/Vue H5 `BasicCard` 物料，实现同名同义 manifest。
- `BasicCard` 支持图片、比例、填充、角标、标题、说明、按钮文案、背景、文字色、强调色、圆角、边框、阴影和上下留白。
- `BasicCard` 复用已有内部 runtime primitives，不新增公开 primitives 包。
- 默认模板和 React H5 runtime 示例接入 `BasicCard`。
- README、分层架构文档、单测、browser smoke 和 AI 事实源同步更新。

不包含：

- 不改变 Page Schema v1 结构。
- 不改变 Material Manifest v1 字段结构。
- 不新增容器、插槽、多列或栅格协议。
- 不接入真实素材中心、会场中心、商品中心、跳转桥或埋点平台。
- 不实现卡片列表、轮播或瀑布流。

## 责任边界

当前仓库：

- `materials-*` 负责 `BasicCard` 双端渲染和 manifest。
- `editor-playground` 负责展示、配置和 smoke 验证。
- `h5-runtime-playground` 负责验证 React H5 runtime 可消费该物料。

外部系统：

- Java 配置平台未来负责存储包含 `BasicCard` 的 Page Schema，并按物料 manifest 白名单校验。
- 真实 H5 业务仓库未来通过 npm 包消费 `BasicCard`。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增向后兼容物料。
- 契约文档路径：`.ai-workspace/contracts/material-manifest-v1.md`、`docs/material-layering-architecture.md`。
- 是否向后兼容：是，新增物料不影响旧页面。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：真实页面下发 `BasicCard` 前需确认 H5 runtime 包版本已包含该物料。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`。
- 需要确认的角色：前端低代码维护者、Java 配置平台、H5 接入方。
- 当前确认状态：前端参考实现。

## 验收标准

- [x] React/Vue H5 均新增 `BasicCard`，且 `componentName`、category、defaultProps 和 propsSchema 语义一致。
- [x] `BasicCard` 复用内部 primitives，不进入 runtime primitives registry，也不新增公开 primitives 包。
- [x] Vue3 editor playground 默认模板能展示基础图文卡片。
- [x] React H5 runtime 示例能渲染基础图文卡片。
- [x] browser smoke 覆盖 Vue3 编辑器默认画布、编辑器内置 runtime 和 React H5 runtime 的 `BasicCard` 渲染。
- [x] 不改变 Page Schema v1、Material Manifest v1 字段结构或编辑器容器判断逻辑。
- [x] `pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- [x] `pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm --filter @meumall/lowcode-materials-h5 typecheck
pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck
pnpm test
pnpm smoke:browser
git diff --check
```

## 发布影响

- 是否需要发布：否，本任务不执行真实 npm 发布。
- 发布对象：后续真实发布时影响 `@meumall/lowcode-materials-h5` 和 `@meumall/lowcode-materials-vue-h5`。
- 是否需要 changeset：当前不发布，暂不新增 changeset。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：新增物料需要 H5 runtime 包版本支持后才能下发到真实页面。
- 是否影响 npm 发布：新增向后兼容物料，后续发布应按 minor 评估。
- 是否影响 Java 配置平台：物料白名单和属性表单需补充 `BasicCard`。
- 回滚目标：回滚本任务提交即可移除 `BasicCard`。
- smoke check：`pnpm smoke:browser` 验证 editor 和 React H5 runtime 关键路径。

## 风险和阻塞

- `BasicCard` 是单个图文卡片，不解决卡片列表或复杂会场布局。
- 当前按钮点击只走已有 action 绑定机制，不实现真实跳转桥。
- 图片素材仍使用 URL 或 mock 素材库，不接真实素材中心。

## 验证结果

- `pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- `pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- `pnpm test` 通过，84 个测试全部通过，并包含架构边界检查。
- `pnpm smoke:browser` 通过，已覆盖 Vue3 编辑器默认画布、快捷命令添加、编辑器内置 runtime 和 React H5 runtime 的 `BasicCard` 渲染。
- `git diff --check` 通过。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为新增 `BasicCard` 通用图文卡片物料及双端验证链路。 |
| 2026-08-01 | verified | 完成 React/Vue H5 `BasicCard`、默认模板、React H5 示例、文档、测试和 browser smoke 验证。 |
