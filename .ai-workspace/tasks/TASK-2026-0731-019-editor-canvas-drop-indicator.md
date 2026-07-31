# TASK-2026-0731-019-editor-canvas-drop-indicator

## 状态

verified

## 目标

增强 Vue3 编辑器 playground 的画布拖拽体验，让运营从左侧物料区拖拽物料到 H5 画布时，可以根据鼠标位置明确插入到目标节点前、目标节点后，或加入容器内部，并显示可感知的插入指示状态。

## 背景

当前编辑器已支持点击物料添加、拖到画布添加到选中容器、结构面板拖拽排序和上下文工具栏插入。但画布拖拽仍不够直观：拖到画布时没有插入线，也不能直接根据落点决定前后位置。这会影响运营搭建活动页的实操效率。为了让编辑器更接近可用低代码工具，需要补齐画布层的拖拽命中和投放反馈。

## 涉及包或系统

- `apps/editor-playground`
- `.ai-workspace/tasks`
- `.ai/test-reports`
- `.ai/PROJECT_STATE.md`
- `.ai/AI_CONTEXT.md`
- `.ai/TODO.md`

## 范围

包含：

- 画布拖拽物料时识别最近的 runtime 节点。
- 根据鼠标在节点上的相对位置决定 `before`、`after` 或 `inside`。
- `SectionContainer` 支持中间区域投放为子节点。
- 显示插入指示线或容器高亮。
- drop 后按计算结果插入节点并选中新节点。
- 拖拽离开或结束时清理指示状态。
- 更新项目状态、TODO 和验证报告。

不包含：

- 自由绝对布局、网格布局或拖拽改变尺寸。
- 跨页面拖拽、跨窗口拖拽。
- 修改 renderer、schema 或物料包公开 API。
- 结构面板拖拽算法重构。
- 新增 npm 发布或 changeset。

## 责任边界

当前仓库：

- 提供 Vue3 编辑器 playground 的画布拖拽投放体验示例。

外部系统：

- 正式管理后台后续负责把该交互迁移到真实编辑器页面，并结合真实素材/商品中心。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无。
- 是否向后兼容：是，仅增强 playground UI 交互。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 阅读当前 Vue renderer 输出结构和 editor playground 画布事件。
2. 新增拖拽 hover 状态、命中计算和投放方法。
3. 在画布层显示前/后插入线和容器内部投放高亮。
4. 补充 CSS，保证指示线不遮挡页面内容。
5. 更新 AI 状态、TODO 和验证报告。
6. 运行 `pnpm typecheck`、`pnpm build`、`pnpm test` 和本地入口 smoke check。

## 验收标准

- [x] 从左侧物料区拖到画布节点上半区时，显示“插入到前方”指示并能插入到目标节点前。
- [x] 从左侧物料区拖到画布节点下半区时，显示“插入到后方”指示并能插入到目标节点后。
- [x] 从左侧物料区拖到 `SectionContainer` 中间区域时，显示容器投放指示并能加入容器内部。
- [x] 拖拽到画布空白区域时仍能追加到页面末尾。
- [x] 拖拽离开或投放完成后清理指示状态。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] 编辑器和 H5 runtime smoke check 通过。
- [x] 项目状态、TODO 和验证报告已更新。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
curl -I http://localhost:5173/
curl -I http://localhost:5174/
```

## 发布影响

- 是否需要发布：暂不发布。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：类型检查、构建、测试和本地入口检查通过。

## 风险和阻塞

- 当前命中依赖 Vue renderer 输出的 `.mlc-runtime-node[data-lowcode-node-id]`，后续正式编辑器如果更换画布实现，需要抽象为稳定画布协议。
- 浏览器原生 HTML5 drag 在移动端体验有限，正式管理台可补充 Pointer Events 或专用拖拽库。
- 当前环境未安装 Playwright，未执行浏览器自动拖拽点击测试；本轮以类型检查、构建、单元测试和入口 smoke check 验证基础回归。

## 验证结果

2026-07-31 验证通过。

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，3 个 suite、19 个用例全部通过。
- `curl -I http://localhost:5173/`：返回 `HTTP/1.1 200 OK`。
- `curl -I http://localhost:5174/`：返回 `HTTP/1.1 200 OK`。
- `node -e "import('playwright')..."`：未通过，当前仓库未安装 Playwright；已记录为未覆盖风险。

验证报告：`.ai/test-reports/TASK-2026-0731-019-editor-canvas-drop-indicator.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确画布拖拽插入线增强范围和验收标准。 |
| 2026-07-31 | in_progress | 开始实现画布拖拽命中、插入指示和 drop 插入。 |
| 2026-07-31 | verified | 完成画布前后插入线、容器投放高亮、空白追加提示和验证记录。 |
