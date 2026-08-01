# TASK-2026-0801-191-basic-timeline-material

## 状态

verified

## 目标

新增业务无关的 `BasicTimeline` 基础时间线通用物料，让运营可以配置活动节奏、上线流程、领取步骤、说明节点或服务流程；React H5 runtime 和 Vue H5 runtime 使用同一 `componentName` 与 manifest 语义渲染。

## 背景

当前基础物料已覆盖按钮、链接、提示、输入、文本、价格、图片、标签、卡片、轮播、视频、弹窗、表单、列表、折叠面板和容器。活动页和推广页常见“先做什么、再做什么、最后做什么”或“几个时间节点”的表达。普通 `BasicList` 可以承载静态列表，但缺少时间线连接、节点状态和顺序视觉；业务物料又容易把活动进度、订单状态或审批流带入基础层。因此本任务新增 `BasicTimeline`，只处理静态时间线展示和安全节点点击事件。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `docs/material-layering-architecture.md`
- `.ai-workspace`
- `.ai`
- npm / GitHub

## 范围

包含：

- 在 React H5 物料包新增 `BasicTimeline` 组件与 manifest。
- 在 Vue H5 物料包新增同名 `BasicTimeline` 组件与 manifest。
- 支持标题、说明、静态时间线节点、标记样式、节点状态、时间文案、角标、连接线、圆角、边框、颜色、间距和阴影配置。
- 暴露 `onItemClick` 安全事件，点击节点时把当前项和索引交给宿主 action。
- 接入 Vue3 编辑器默认模板、快捷命令添加链路、React H5 runtime 示例和 browser smoke。
- 更新单测、README、架构文档、changeset 和任务/项目状态记录。

不包含：

- 不修改 Page Schema v1 字段结构。
- 不新增远程活动进度、订单状态、审批流程、任务流、服务履约状态或个性化推荐。
- 不承载商品、优惠券、门店、达人、直播、订单、会员、审批等业务字段。
- 不实现横向复杂时间轴、拖拽排序协议、进度计算、富文本编辑器或嵌套低代码子节点。
- 不新增小程序物料。

## 责任边界

当前仓库：

- 提供通用基础时间线物料、manifest、示例和 npm 发布预检。

外部系统：

- Java 配置平台后续只消费 manifest 和 schema，不需要本任务新增接口。
- 真实活动进度、订单状态、审批流、埋点和权限由 H5 宿主、Java/BFF、管理台或 action handler 承接。
- `hybird-meumall` 后续通过 npm 包升级获得该物料能力，不需要本任务改业务仓库。

## 契约影响

- 是否影响跨包或跨系统契约：影响 Material Manifest 注册清单和 npm 包公开导出。
- 契约文档路径：`.ai-workspace/contracts/material-manifest-v1.md`、`docs/material-layering-architecture.md`
- 是否向后兼容：是。新增物料，不改变旧页面 schema 或旧物料渲染语义。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要，写入物料包 README 和架构文档。
- 对接说明路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`、`docs/material-layering-architecture.md`
- 需要确认的角色：npm 管理员 / H5 接入方
- 当前确认状态：无需阻塞，等待真实 npm 发布窗口统一确认。

## 实现计划

1. 新增 React/Vue H5 `BasicTimeline` 组件和 manifest，确保组件名、默认 props、propsSchema、事件和样式语义对齐。
2. 接入编辑器默认模板、快捷命令添加链路、React H5 runtime 示例、browser smoke、单测、README、changeset 和项目记忆。

## 验收标准

- [x] React/Vue H5 物料清单都包含 `BasicTimeline`，且 componentName 和 manifest 语义对齐。
- [x] `BasicTimeline` 支持静态节点、时间文案、节点状态、标记样式、连接线、边框、圆角、颜色、间距和阴影配置。
- [x] `BasicTimeline` 暴露 `onItemClick` 事件，但不绑定远程活动进度、订单状态、审批流程、任务流或业务模型。
- [x] Vue3 编辑器默认模板和 React H5 runtime 示例可渲染基础时间线。
- [x] Vue3 编辑器可从快捷命令添加基础时间线并在源码中写入 `marker` 与 `items`。

## 实现结果

- React H5 materials 新增 `BasicTimeline` 组件、manifest、默认静态节点、状态视觉、标记样式、连接线和 `onItemClick` 安全事件。
- Vue H5 materials 新增同名同语义 `BasicTimeline`，与 React H5 manifest 保持 componentName、propsSchema、defaultProps 和 events 对齐。
- Vue3 编辑器默认模板、快捷命令添加链路、editor array 字段模型、React H5 runtime 示例和 HTTP/browser smoke 均已接入。
- README、架构文档、changeset、项目记忆和任务状态已同步，继续明确基础时间线不承载远程活动进度、订单状态、审批流程、任务流或业务状态模型。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
pnpm pack:dry-run
git diff --check
```

## 验证记录

- 2026-08-01：`pnpm typecheck` 通过。
- 2026-08-01：`pnpm test` 通过，143 条测试全部通过，并包含 architecture check。
- 2026-08-01：`pnpm smoke:browser` 通过，覆盖物料库可见、默认模板、快捷命令、编辑器 runtime、React H5 runtime 和 pageId published 入口。
- 2026-08-01：`pnpm pack:dry-run` 通过，12 个可发布包内容预检通过。
- 2026-08-01：`git diff --check` 通过。

## 发布影响

- 是否需要发布：需要，后续统一 npm 发布。
- 发布对象：`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不单独创建 tag/release，后续发布窗口统一处理。
- 回滚目标：回滚本次物料新增 commit 或降级到上一版 materials 包。
- smoke check：通过 `pnpm smoke:browser` 验证编辑器和 React H5 runtime 渲染。

## 风险和阻塞

- `items` 只表示静态时间线节点，不代表生产环境已经接入活动进度、订单状态或审批流。
- `onItemClick` 只触发安全 action，由宿主决定是否埋点、跳转或执行其他业务逻辑。
- 真实 npm 发布的 registry、token、access 仍由发布窗口统一确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | verified | 完成 BasicTimeline 双端物料、编辑器/runtime 接入、测试、smoke、pack dry-run 和文档记忆更新。 |
| 2026-08-01 | ready | 创建基础时间线通用物料任务，确认可进入实现。 |
