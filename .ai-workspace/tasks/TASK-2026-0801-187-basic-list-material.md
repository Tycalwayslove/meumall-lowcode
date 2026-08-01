# TASK-2026-0801-187-basic-list-material

## 状态

verified

## 目标

新增业务无关的 `BasicList` 基础列表通用物料，让运营可以配置卖点、步骤、FAQ 摘要、注意事项等静态列表内容；React H5 runtime 和 Vue H5 runtime 使用同一 `componentName` 与 manifest 语义渲染。

## 背景

当前基础物料已覆盖按钮、输入、文本、价格、图片、标签、卡片、轮播、视频、弹窗、表单和容器。活动页和推广页仍经常需要一组纯内容列表，例如“活动步骤”“权益说明”“注意事项”“常见问题摘要”。如果每次都用多个 `BasicText` 拼接，编辑效率低且样式不统一；如果复用 `ProductList`、`CouponBundle` 等业务物料，又会把商品/优惠券语义误带入通用内容层。因此本任务新增 `BasicList`，只处理静态数组内容和通用点击事件，不接业务接口。

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

- 在 React H5 物料包新增 `BasicList` 组件与 manifest。
- 在 Vue H5 物料包新增同名 `BasicList` 组件与 manifest。
- 接入 Vue3 编辑器默认模板、React H5 runtime 示例和 browser smoke。
- 更新单测、README、架构文档、changeset 和任务/项目状态记录。

不包含：

- 不修改 Page Schema v1 字段结构。
- 不新增远程数据源、分页、筛选、搜索或排序协议。
- 不承载商品、优惠券、门店、达人、直播等业务字段。
- 不实现富文本、折叠面板、FAQ 展开收起或复杂时间线协议。
- 不新增小程序物料。

## 责任边界

当前仓库：

- 提供通用基础列表物料、manifest、示例和 npm 发布预检。

外部系统：

- Java 配置平台后续只消费 manifest 和 schema，不需要本任务新增接口。
- 真实远程内容、审核、CMS、FAQ 折叠和分页由后续宿主、业务物料或 Java 平台任务承接。
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

1. 新增 React/Vue H5 `BasicList` 组件和 manifest，确保组件名、默认 props、propsSchema、事件和列表项字段对齐。
2. 接入编辑器默认模板、React H5 runtime 示例、browser smoke、单测、README、changeset 和项目记忆。

## 验收标准

- [x] React/Vue H5 物料清单都包含 `BasicList`，且 componentName 和 manifest 语义对齐。
- [x] `BasicList` 支持标题、说明、静态 items、标记样式、间距、边框、圆角、背景和文本颜色配置。
- [x] `BasicList.items` 使用现有数组属性编辑模式，不修改 Page Schema v1 字段结构。
- [x] `BasicList` 暴露 `onItemClick` 事件，但不绑定业务跳转、商品、优惠券或远程数据源。
- [x] Vue3 编辑器默认模板和 React H5 runtime 示例可渲染基础列表。
- [x] Vue3 编辑器可从快捷命令添加基础列表并在源码中写入 items。

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

- React/Vue H5 物料包新增 `BasicList` 组件、manifest、默认 props、propsSchema 和 `onItemClick` 事件。
- Vue3 编辑器默认模板新增 `summer_basic_list`，React H5 runtime 示例新增 `node_basic_list` 和 `track_basic_list_item_click` action。
- Editor 数组属性字段模型新增 `BasicList.items` 的默认新增项和字段顺序，继续复用现有数组属性编辑模式。
- browser smoke 覆盖物料存在、默认模板、编辑器内置 runtime、React H5 runtime、pageId 入口和快捷命令添加链路。
- README、分层架构文档、changeset、项目记忆和任务状态已同步。

## 验证记录

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `pnpm typecheck` | 通过 | TypeScript / Vue typecheck 全部通过。 |
| `pnpm test` | 通过 | 136 个单测通过，包含架构检查、React/Vue manifest 对齐和 BasicList 注册/渲染。 |
| `pnpm smoke:browser` | 通过 | Vue3 编辑器、编辑器 runtime、React H5 runtime、pageId 入口和快捷命令添加链路均验证通过。 |
| `pnpm pack:dry-run` | 通过 | 12 个可发布包 npm pack dry-run 通过。 |

## 风险和阻塞

- 当前只支持静态列表，不支持远程内容、折叠 FAQ、时间线或分页。
- 列表项点击只触发安全 action，由宿主决定是否跳转或埋点。
- 真实 npm 发布的 registry、token、access 仍由发布窗口统一确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建基础列表通用物料任务，确认可进入实现。 |
| 2026-08-01 | verified | 完成 BasicList 双端物料、编辑器模板、React H5 示例、测试、smoke、文档和 changeset。 |
