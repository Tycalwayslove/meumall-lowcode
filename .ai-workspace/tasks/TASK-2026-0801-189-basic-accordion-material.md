# TASK-2026-0801-189-basic-accordion-material

## 状态

verified

## 目标

新增业务无关的 `BasicAccordion` 基础折叠面板通用物料，让运营可以配置 FAQ、规则说明、注意事项、图文说明中的可展开文本内容；React H5 runtime 和 Vue H5 runtime 使用同一 `componentName` 与 manifest 语义渲染。

## 背景

当前基础物料已覆盖按钮、链接、输入、文本、价格、图片、标签、卡片、轮播、视频、弹窗、表单、列表和容器。活动页和推广页经常需要“点击展开查看详情”的信息组织方式，例如常见问题、使用说明、活动规则摘要或注意事项。如果把这些内容都塞进业务规则弹窗，会提高配置成本；如果直接把 FAQ、活动规则或业务接口字段放进基础列表，又会污染基础层。因此本任务新增 `BasicAccordion`，只处理静态折叠内容展示、本地展开收起和安全事件。

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

- 在 React H5 物料包新增 `BasicAccordion` 组件与 manifest。
- 在 Vue H5 物料包新增同名 `BasicAccordion` 组件与 manifest。
- 支持标题、说明、静态折叠项、单开/多开模式、图标样式、默认展开、圆角、边框、颜色、间距和阴影配置。
- 暴露 `onItemToggle` 安全事件，切换时把当前项、索引和展开状态交给宿主 action。
- 接入 Vue3 编辑器默认模板、快捷命令添加链路、React H5 runtime 示例和 browser smoke。
- 更新单测、README、架构文档、changeset 和任务/项目状态记录。

不包含：

- 不修改 Page Schema v1 字段结构。
- 不新增远程 FAQ 数据源、分页、搜索、排序、权限、审核或个性化推荐。
- 不承载商品、优惠券、门店、达人、直播、活动规则接口等业务字段。
- 不实现富文本编辑器、Markdown 渲染、嵌套低代码子节点或复杂布局 DSL。
- 不新增小程序物料。

## 责任边界

当前仓库：

- 提供通用基础折叠面板物料、manifest、示例和 npm 发布预检。

外部系统：

- Java 配置平台后续只消费 manifest 和 schema，不需要本任务新增接口。
- 真实 FAQ 数据、活动规则、权限审核、埋点和内容审核由 H5 宿主、Java/BFF、管理台或 action handler 承接。
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

1. 新增 React/Vue H5 `BasicAccordion` 组件和 manifest，确保组件名、默认 props、propsSchema、事件和样式语义对齐。
2. 接入编辑器默认模板、快捷命令添加链路、React H5 runtime 示例、browser smoke、单测、README、changeset 和项目记忆。

## 验收标准

- [x] React/Vue H5 物料清单都包含 `BasicAccordion`，且 componentName 和 manifest 语义对齐。
- [x] `BasicAccordion` 支持静态折叠项、单开/多开模式、默认展开、图标样式、边框、圆角、颜色、间距和阴影配置。
- [x] `BasicAccordion` 暴露 `onItemToggle` 事件，但不绑定远程 FAQ、活动规则接口、业务模型、审核、权限或富文本。
- [x] Vue3 编辑器默认模板和 React H5 runtime 示例可渲染基础折叠面板。
- [x] Vue3 编辑器可从快捷命令添加基础折叠面板并在源码中写入 `mode` 与 `items`。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
pnpm pack:dry-run
```

## 发布影响

- 是否需要发布：需要，后续统一 npm 发布。
- 发布对象：`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不单独创建 tag/release，后续发布窗口统一处理。
- 回滚目标：回滚本次物料新增 commit 或降级到上一版 materials 包。
- smoke check：通过 `pnpm smoke:browser` 验证编辑器和 React H5 runtime 渲染。

## 实现结果

- React/Vue H5 物料包新增 `BasicAccordion` 组件、manifest、默认 props、propsSchema、`mode/icon` 枚举和 `onItemToggle` 安全事件。
- Vue3 编辑器默认模板新增 `summer_basic_accordion`，快捷命令新增物料后可写入 `mode` 与 `items`，editor 列表项字段模型支持 `id/title/content/badgeText`。
- React H5 runtime 示例新增 `node_basic_accordion` 和 `track_basic_accordion_toggle` action。
- browser smoke 覆盖物料存在、默认模板、编辑器内置 runtime、React H5 runtime、pageId 入口和快捷命令添加链路。
- README、分层架构文档、changeset、项目记忆和任务状态已同步。

## 验证记录

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `pnpm typecheck` | 通过 | TypeScript / Vue typecheck 全部通过。 |
| `pnpm test` | 通过 | 139 个单测通过，包含架构检查、React/Vue manifest 对齐和 BasicAccordion 注册。 |
| `pnpm smoke:browser` | 通过 | 首次执行在本地 Node 25/undici socket `setTypeOfService EINVAL` 启动阶段失败；重跑后 Vue3 编辑器、编辑器 runtime、React H5 runtime、pageId 入口和快捷命令添加链路均验证通过。 |
| `pnpm pack:dry-run` | 通过 | 12 个可发布包 npm pack dry-run 通过。 |
| `git diff --check` | 通过 | 无空白或补丁格式问题。 |

## 风险和阻塞

- `items` 只表示静态折叠项，不代表生产环境已经具备远程 FAQ、内容审核或权限策略。
- `onItemToggle` 只触发安全 action，由宿主决定是否埋点、联动或持久化。
- 真实 npm 发布的 registry、token、access 仍由发布窗口统一确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建基础折叠面板通用物料任务，确认可进入实现。 |
| 2026-08-01 | verified | 完成 BasicAccordion 双端物料、编辑器模板、React H5 示例、测试、smoke、文档和 changeset。 |
