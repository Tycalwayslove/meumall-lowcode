# TASK-2026-0731-041 直播入口物料

## 状态

verified

## 目标

新增 H5 运营活动页常用的直播入口物料，让运营人员可以在 Vue3 编辑器中拖拽配置，并在 React H5 runtime 中渲染和触发进入直播事件。

## 背景

电商活动页经常需要承接直播间、达人讲解、限时福利和门店导购入口。当前物料库已有活动头图、公告、券包、门店/达人推荐、秒杀和楼层锚点，但缺少独立直播入口模块。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `.ai/PROJECT_STATE.md`
- `.ai/AI_CONTEXT.md`
- `.ai/TODO.md`

## 范围

- React H5 物料包新增 `LiveEntry` 组件和 manifest。
- Vue H5 物料包新增同名 `LiveEntry` 组件和 manifest。
- 编辑器物料库自动展示直播入口物料，并可配置文案、图片、颜色和跳转链接。
- 大促活动模板接入直播入口节点。
- React H5 runtime 示例接入直播入口节点和 `onEnter` 动作绑定。
- 补充物料 manifest 对齐测试。
- 更新物料包 README 和 AI 状态文档。

## 不包含

- 不接入真实直播状态、开播时间、预约状态或直播间接口。
- 不新增新的 data source 类型。
- 不改变 Page Schema 或 Material Manifest v1 契约。
- 不实现小程序直播入口。

## 责任边界

- materials 包负责静态可配置 UI 和事件定义。
- editor playground 负责展示和编辑 manifest 暴露的 props。
- React H5 runtime playground 负责验证 H5 消费 schema 和事件执行链路。
- 真实直播间跳转、埋点、权限和风控后续由宿主 action handler 接入。

## 契约影响

- 新增 `LiveEntry` 物料 manifest，属于向后兼容的物料能力扩展。
- 不改变已有 schema 字段和 renderer API。
- 不需要迁移旧页面；未使用该物料的页面不受影响。

## 对接说明

后续接真实直播中心时，可以优先通过 `linkUrl` + action handler 完成跳转；如果需要动态直播状态，再通过既有 data source resolver 增加直播数据源专项。

## 验收标准

- React/Vue H5 物料包都注册 `LiveEntry`，componentName 和 manifest 对齐。
- `LiveEntry` manifest 包含图片、文案、颜色、链接配置和 `onEnter` 事件。
- 大促活动模板包含直播入口节点。
- React H5 runtime 示例包含直播入口节点和动作配置。
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

## 发布影响

- 暂不发布 npm。
- 后续发布时属于 `@meumall/lowcode-materials-h5` 和 `@meumall/lowcode-materials-vue-h5` 的 minor 能力扩展。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可。

## 风险和阻塞

- 当前直播入口是静态配置，不代表真实直播在线状态。
- 当前动作执行仍为 playground mock，生产跳转和埋点需宿主实现。

## 实现结果

- React H5 物料包新增 `LiveEntry`，支持封面图、直播状态、标题、说明、观看人数、按钮、链接和 `onEnter` 事件。
- Vue H5 物料包新增同名 `LiveEntry`，manifest 与 React H5 对齐。
- Vue3 编辑器 mock 素材库新增直播素材，默认大促模板接入直播入口节点和楼层锚点。
- React H5 runtime 示例接入直播入口节点，并将 `onEnter` 绑定到 `track_live_enter` tracking action。
- 物料 README、manifest 测试和 browser smoke check 已同步。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，29 个测试全部通过。
- `pnpm smoke:browser`：通过，覆盖编辑器默认大促模板、编辑器内置 runtime 和 React H5 runtime 中的直播入口渲染。

## 未验证项

- 未接入真实直播状态和直播间跳转服务；后续需要通过 data source 和宿主 action handler 接入。

## 变更记录

- 2026-07-31：创建 ready 工作项。
- 2026-07-31：进入实现，开始新增 React/Vue H5 直播入口物料。
- 2026-07-31：完成实现与验证，状态流转为 verified。
