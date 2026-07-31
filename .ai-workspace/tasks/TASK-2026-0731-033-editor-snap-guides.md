# TASK-2026-0731-033-editor-snap-guides

## 状态

verified

## 目标

增强 Vue3 编辑器 playground 的画布拖拽反馈，在物料投放和节点移动时显示吸附线/对齐辅助线，让运营更清楚当前会插入到哪个边缘、是否对齐目标节点中心或容器范围。

## 背景

当前编辑器已经支持桌面 HTML5 drag/drop、触屏 Pointer Events 拖拽、前/后插入线、容器投放高亮和页面末尾追加提示。但在复杂活动页中，运营拖动物料或已有节点时仍需要更强的位置感，尤其是多个区块高度接近、容器嵌套较深时，只靠局部插入线不够直观。

本任务在不改变 schema、renderer 和物料协议的前提下，为 `canvasDropHint` 增加吸附线数据，并在 H5 画布层渲染跨画布辅助线。

## 涉及包或系统

- `apps/editor-playground`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- 为画布 drop hint 增加吸附线数据结构。
- 拖到节点前/后时显示横向画布吸附线和目标节点中心纵向辅助线。
- 拖到容器内部时显示容器中心横向/纵向辅助线。
- 桌面 HTML5 drag/drop 和触屏 Pointer Events 拖拽共用吸附线。
- 更新任务、项目状态、上下文、TODO 和验证记录。

不包含：

- 不实现网格布局或自由绝对定位。
- 不实现多选拖拽。
- 不修改 schema、物料 manifest 或 renderer 包 API。
- 不接入真实素材、商品、优惠券、门店或达人中心。

## 责任边界

当前仓库：

- 维护 Vue3 编辑器 playground 的拖拽辅助线体验和验证记录。

外部系统：

- Java 管理台后续迁入时可复用该交互思路；本任务不实现真实管理台。
- H5 runtime 不消费编辑器吸附线逻辑。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无。
- 是否向后兼容：是，仅新增 playground 视觉反馈。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：后续管理台接入负责人可评估是否复用该交互。
- 当前确认状态：无需外部确认。

## 实现计划

1. 扩展 `CanvasDropHint`，增加吸附线样式数据。
2. 根据目标节点位置计算横向/纵向辅助线。
3. 在 `phone-frame` 内渲染吸附线，并补充样式。
4. 保持原有插入线、容器高亮、页面末尾提示和拖拽执行逻辑不变。
5. 运行类型检查、构建、测试和 dev server smoke check。
6. 更新 AI 状态和验证记录。

## 验收标准

- [x] 拖到节点前/后时，除原插入线外，还显示跨画布横向吸附线。
- [x] 拖到节点前/后时，显示目标节点中心纵向辅助线。
- [x] 拖到 `SectionContainer` 内部时，显示容器中心横向/纵向辅助线。
- [x] 页面末尾追加提示仍正常显示，不强行显示错误目标吸附线。
- [x] 桌面 HTML5 drag/drop 和触屏 Pointer Events 拖拽都复用同一吸附线数据。
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
- 发布对象：无。
- 是否需要 changeset：否，当前只改 playground 集成实现，不改可发布包 API。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可移除吸附线视觉反馈。
- smoke check：编辑器和 H5 runtime dev server 返回 HTTP 200，自动化命令通过。

## 风险和阻塞

- 当前未引入浏览器级 visual regression，吸附线视觉需以后用 Playwright 截图进一步固化。
- 吸附线是视觉辅助，不改变最终 schema 节点顺序或投放规则。

## 验证结果

验证日期：2026-07-31

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，4 个 suites、26 条 tests 全部通过。
- `curl -I http://127.0.0.1:5173/`：HTTP 200。
- `curl -I http://127.0.0.1:5174/`：HTTP 200。

验证报告：`.ai/test-reports/TASK-2026-0731-033-editor-snap-guides.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建 Vue3 编辑器画布吸附线任务。 |
| 2026-07-31 | in_progress | 开始实现 drop hint 吸附线和验证记录。 |
| 2026-07-31 | verified | 完成画布吸附线实现、自动化验证和状态记录。 |
