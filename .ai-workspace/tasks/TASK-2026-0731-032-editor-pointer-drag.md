# TASK-2026-0731-032-editor-pointer-drag

## 状态

verified

## 目标

增强 Vue3 编辑器 playground 的画布拖拽交互，补充触屏/移动端可用的 Pointer Events 拖拽路径，让运营在移动端视口、触屏设备或触控板场景下也能把物料拖入 H5 画布、移动画布节点，并复用现有插入线和容器投放提示。

## 背景

当前编辑器已经支持基于 HTML5 Drag and Drop 的物料拖入、画布节点移动和插入线提示，但该能力主要面向桌面浏览器鼠标操作。移动端 Safari/Chrome 对 HTML5 drag/drop 支持弱，导致“可实操编辑器”在触屏场景下仍有明显短板。

本任务在不改变 schema、renderer 和物料协议的前提下，为 `apps/editor-playground` 增加 Pointer Events 拖拽编排，并复用现有 `insertNode`、`moveNodeById`、`canvasDropHint` 和 drop placement 逻辑。

## 涉及包或系统

- `apps/editor-playground`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- 物料面板支持触屏按住移动到 H5 画布后投放。
- 结构树节点支持触屏按住移动到 H5 画布后移动节点。
- H5 画布内节点支持触屏按住移动，复用前/后/容器内/页面末尾投放规则。
- Pointer 拖拽复用现有 `canvasDropHint` 视觉提示。
- 防止完成触屏拖拽后触发物料按钮的普通点击追加。
- 更新任务、项目状态、上下文、TODO 和验证记录。

不包含：

- 不新增 schema 字段。
- 不修改物料 manifest。
- 不实现多选拖拽、吸附线或复杂手势。
- 不接入真实素材、商品、优惠券、门店或达人中心。
- 不修改 Java 配置平台 API。

## 责任边界

当前仓库：

- 维护 Vue3 编辑器 playground 的触屏拖拽体验和验证记录。

外部系统：

- Java 管理台后续迁入时可参考该交互实现，但本任务不实现真实管理台。
- H5 runtime 不消费编辑器拖拽逻辑。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无。
- 是否向后兼容：是，仅新增编辑器交互路径。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：后续管理台接入负责人可评估是否复用该交互。
- 当前确认状态：无需外部确认。

## 实现计划

1. 抽象 HTML5 drag/drop 和 Pointer Events 共用的 drop hint 计算函数。
2. 在物料面板、结构树和 H5 画布补充 Pointer Events 起拖入口。
3. 增加全局 pointer move/up/cancel 监听，完成触屏投放或取消。
4. 更新样式，保证触屏拖拽区域不会被浏览器默认滚动手势干扰。
5. 运行类型检查、构建、测试和 dev server smoke check。
6. 更新 AI 状态和验证记录。

## 验收标准

- [x] 物料面板按钮在触屏 pointer 移动超过阈值后，可以显示画布投放提示并插入对应物料。
- [x] 结构树节点在触屏 pointer 移动超过阈值后，可以移动到画布目标位置。
- [x] H5 画布内节点在触屏 pointer 移动超过阈值后，可以移动到目标节点前方、后方、容器内或页面末尾。
- [x] 普通点击物料仍追加物料；完成触屏拖拽后不会额外触发一次点击追加。
- [x] 桌面端现有 HTML5 drag/drop 行为不删除。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] editor 和 H5 runtime dev server smoke check 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
curl -I http://127.0.0.1:5173/
curl -I http://127.0.0.1:5174/
```

## 发布影响

- 是否需要发布：本任务不实际发布 npm。
- 发布对象：后续发布 `apps/editor-playground` 对应示例或编辑器包文档时可包含该交互说明。
- 是否需要 changeset：否，当前只改 playground 集成实现，不改可发布包 API。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可恢复原 HTML5 drag/drop-only 交互。
- smoke check：编辑器和 H5 runtime dev server 返回 HTTP 200，自动化命令通过。

## 风险和阻塞

- 当前自动化环境不直接模拟移动端真实触屏拖拽；本任务通过类型检查、构建、测试和人工代码路径检查验证。
- Pointer Events 行为在不同移动浏览器上仍可能有细微差异，正式迁入管理台前建议补 Playwright 移动端交互用例。

## 验证结果

验证日期：2026-07-31

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，4 个 suites、26 条 tests 全部通过。
- `curl -I http://127.0.0.1:5173/`：HTTP 200。
- `curl -I http://127.0.0.1:5174/`：HTTP 200。

验证报告：`.ai/test-reports/TASK-2026-0731-032-editor-pointer-drag.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建 Vue3 编辑器 Pointer Events 拖拽任务。 |
| 2026-07-31 | in_progress | 开始实现触屏物料投放、节点移动和验证记录。 |
| 2026-07-31 | verified | 完成 Pointer Events 拖拽入口、共用 drop hint 逻辑和验证记录。 |
