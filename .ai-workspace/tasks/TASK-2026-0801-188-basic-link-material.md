# TASK-2026-0801-188-basic-link-material

## 状态

verified

## 目标

新增业务无关的 `BasicLink` 基础链接/入口通用物料，让运营可以配置规则入口、专题入口、说明入口、外部链接或轻量跳转提示；React H5 runtime 和 Vue H5 runtime 使用同一 `componentName` 与 manifest 语义渲染。

## 背景

当前基础物料已覆盖按钮、输入、文本、价格、图片、标签、卡片、轮播、视频、弹窗、表单、列表和容器。活动页和推广页仍经常需要一个轻量入口，例如“查看活动规则”“跳转专题页”“了解更多”“查看使用说明”。如果全部复用 `BasicButton`，视觉过重；如果复用业务物料，又会把商品、优惠券或活动语义带入基础层。因此本任务新增 `BasicLink`，只处理通用链接展示和安全点击事件，不承载业务路由、App bridge 或鉴权逻辑。

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

- 在 React H5 物料包新增 `BasicLink` 组件与 manifest。
- 在 Vue H5 物料包新增同名 `BasicLink` 组件与 manifest。
- 支持基础文案、辅助说明、前置标签、右侧箭头、普通 H5 链接、禁用态和样式配置。
- 暴露 `onClick` 安全事件，点击时可把 `linkUrl` 作为 payload 交给宿主 action。
- 接入 Vue3 编辑器默认模板、React H5 runtime 示例和 browser smoke。
- 更新单测、README、架构文档、changeset 和任务/项目状态记录。

不包含：

- 不修改 Page Schema v1 字段结构。
- 不新增 App bridge、登录鉴权、路由守卫、埋点平台或业务跳转协议。
- 不承载商品、优惠券、门店、达人、直播等业务字段。
- 不实现链接有效性远程校验、短链生成、权限控制或审批逻辑。
- 不新增小程序物料。

## 责任边界

当前仓库：

- 提供通用基础链接/入口物料、manifest、示例和 npm 发布预检。

外部系统：

- Java 配置平台后续只消费 manifest 和 schema，不需要本任务新增接口。
- 真实业务路由、App bridge、登录鉴权、埋点和权限校验由 H5 宿主、Java/BFF 或 action handler 承接。
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

1. 新增 React/Vue H5 `BasicLink` 组件和 manifest，确保组件名、默认 props、propsSchema、事件和样式语义对齐。
2. 接入编辑器默认模板、React H5 runtime 示例、browser smoke、单测、README、changeset 和项目记忆。

## 验收标准

- [x] React/Vue H5 物料清单都包含 `BasicLink`，且 componentName 和 manifest 语义对齐。
- [x] `BasicLink` 支持文案、说明、前置标签、右侧箭头、H5 链接、禁用态、样式和颜色配置。
- [x] `BasicLink` 暴露 `onClick` 事件，但不绑定业务路由、App bridge、登录、商品、优惠券或远程接口。
- [x] Vue3 编辑器默认模板和 React H5 runtime 示例可渲染基础链接。
- [x] Vue3 编辑器可从快捷命令添加基础链接并在源码中写入 `linkUrl`。

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

- React/Vue H5 物料包新增 `BasicLink` 组件、manifest、默认 props、propsSchema 和 `onClick` 事件。
- Vue3 编辑器默认模板新增 `summer_basic_link`，React H5 runtime 示例新增 `node_basic_link` 和 `track_basic_link_click` action。
- browser smoke 覆盖物料存在、默认模板、编辑器内置 runtime、React H5 runtime、pageId 入口和快捷命令添加链路。
- README、分层架构文档、changeset、项目记忆和任务状态已同步。

## 验证记录

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `pnpm typecheck` | 通过 | TypeScript / Vue typecheck 全部通过。 |
| `pnpm test` | 通过 | 138 个单测通过，包含架构检查、React/Vue manifest 对齐和 BasicLink 注册/渲染。 |
| `pnpm smoke:browser` | 通过 | Vue3 编辑器、编辑器 runtime、React H5 runtime、pageId 入口和快捷命令添加链路均验证通过。 |
| `pnpm pack:dry-run` | 通过 | 12 个可发布包 npm pack dry-run 通过。 |

## 风险和阻塞

- `linkUrl` 只表示普通 H5 链接字段，不代表生产环境已经完成路由白名单、登录鉴权或 App bridge。
- 点击事件只触发安全 action，由宿主决定是否跳转、埋点或拦截。
- 真实 npm 发布的 registry、token、access 仍由发布窗口统一确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建基础链接/入口通用物料任务，确认可进入实现。 |
| 2026-08-01 | verified | 完成 BasicLink 双端物料、编辑器模板、React H5 示例、测试、smoke、文档和 changeset。 |
