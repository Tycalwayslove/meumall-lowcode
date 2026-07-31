# TASK-2026-0731-046 底部转化条物料

## 状态

verified

## 目标

新增 H5 电商活动页常用的底部转化条物料，让运营人员可以配置固定在页面底部的主按钮、副按钮、活动提示和跳转动作，并在 Vue3 编辑器与 React H5 runtime 中验证渲染。

## 背景

当前物料库已经覆盖活动内容、商品、券、榜单、品牌、直播和门店/达人推荐，但缺少 H5 转化页高频的底部操作条。真实电商活动页通常需要“领券”“立即抢购”“查看活动”等固定入口来提升转化效率。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `.ai/PROJECT_STATE.md`
- `.ai/AI_CONTEXT.md`

## 范围

- React H5 物料包新增 `StickyActionBar` 组件和 manifest。
- Vue H5 物料包新增同名 `StickyActionBar` 组件和 manifest。
- 物料支持标题、说明、主按钮、副按钮、颜色、安全区留白、跳转链接和点击事件。
- 大促活动模板接入底部转化条。
- React H5 runtime 示例接入底部转化条和点击 action。
- 补充物料 manifest 对齐测试和 browser smoke check。
- 更新物料包 README 和 AI 状态文档。

## 不包含

- 不接入真实领券、下单、购物车或 App Bridge。
- 不新增 Page Schema 或 Material Manifest v1 字段。
- 不实现小程序底部转化条。
- 不处理复杂多按钮编排或权限控制。

## 责任边界

- materials 包负责 UI、sticky 行为和事件定义。
- editor playground 通过现有属性面板编辑 props 和绑定事件。
- React H5 runtime playground 验证 H5 消费 schema 和 action 执行链路。
- 真实业务动作后续通过 action handler 接入跳转桥、领券接口或埋点平台。

## 契约影响

- 新增 `StickyActionBar` 物料 manifest，属于向后兼容的物料能力扩展。
- 不改变已有 schema 字段、renderer API 或 adapters API。
- 旧页面不受影响。

## 对接说明

当前按钮事件使用 `onPrimaryClick` 和 `onSecondaryClick`，并可通过 `primaryLinkUrl` / `secondaryLinkUrl` 做简单跳转。后续接真实 H5 时建议优先绑定 action，由宿主处理跳转、领券、下单和埋点。

## 验收标准

- React/Vue H5 物料包都注册 `StickyActionBar`，componentName 和 manifest 对齐。
- `StickyActionBar` manifest 包含标题、说明、主/副按钮、颜色、安全区、链接和点击事件。
- 大促活动模板包含底部转化条节点。
- React H5 runtime 示例包含底部转化条节点和动作配置。
- browser smoke 覆盖编辑器、编辑器内置 runtime 和 React H5 runtime 的底部转化条渲染。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过。
- `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm smoke:browser
```

## 实现记录

- 新增 React H5 `StickyActionBar` 物料，支持标题、说明、主/副按钮、安全区留白、sticky 开关、按钮链接和点击事件。
- 新增 Vue H5 同名物料，并保持 manifest componentName、propsSchema、events 与 React 对齐。
- Vue3 编辑器属性分组已识别 `primaryText`、`secondaryText`、`safeArea`、`showSecondary`、`primaryLinkUrl` 和 `secondaryLinkUrl`。
- 大促活动模板已接入底部转化条节点。
- React H5 runtime 示例已接入底部转化条节点，并配置主按钮埋点与副按钮领券 action。
- browser smoke 已覆盖编辑器物料列表、默认大促模板、编辑器内置 runtime 和 React H5 runtime 的底部转化条渲染。

## 验证记录

- 2026-07-31：`pnpm typecheck` 通过。
- 2026-07-31：`pnpm build` 通过。
- 2026-07-31：`pnpm test` 通过，32 个测试全部通过。
- 2026-07-31：`pnpm smoke:browser` 通过。

## 发布影响

- 暂不发布 npm。
- 后续发布时属于 `@meumall/lowcode-materials-h5` 和 `@meumall/lowcode-materials-vue-h5` 的 minor 能力扩展。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可。

## 风险和阻塞

- sticky 行为在编辑器手机预览中依赖滚动容器表现，真实 H5 接入时仍需结合业务容器验证。
- 当前按钮跳转为简单 URL 兜底，正式接入应通过 action handler 统一处理。

## 变更记录

- 2026-07-31：创建 ready 工作项。
- 2026-07-31：进入实现，补充底部转化条物料。
- 2026-07-31：实现完成并通过验证，状态更新为 verified。
