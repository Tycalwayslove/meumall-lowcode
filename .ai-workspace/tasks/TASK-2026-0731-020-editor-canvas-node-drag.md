# TASK-2026-0731-020-editor-canvas-node-drag

## 状态

verified

## 目标

增强 Vue3 编辑器 playground 的画布节点拖拽能力，让运营可以直接拖动画布中已有节点完成前后排序、拖入 `SectionContainer`，以及从容器中拖出到同级或根级位置。

## 背景

当前编辑器已经支持从左侧物料区拖拽物料到画布插入前方、后方、加入容器或追加末尾。但画布中已有节点仍主要依赖结构面板或上下文工具栏移动，运营在画布里看到哪个楼层就直接拖哪个楼层的体验还不完整。为了继续接近可实操低代码编辑器，需要让 editable Vue renderer 节点支持拖拽事件，并由 editor playground 复用已有投放指示线完成节点移动。

## 涉及包或系统

- `@meumall/lowcode-renderer-vue-h5`
- `apps/editor-playground`
- `.ai-workspace/tasks`
- `.ai/test-reports`
- `.ai/PROJECT_STATE.md`
- `.ai/AI_CONTEXT.md`
- `.ai/TODO.md`

## 范围

包含：

- Vue H5 renderer 在 editable 模式下为 runtime node wrapper 增加 `draggable` 和拖拽回调。
- editor playground 区分新物料拖拽和已有画布节点拖拽。
- 已有节点拖到目标节点上半区时移动到目标节点前。
- 已有节点拖到目标节点下半区时移动到目标节点后。
- 已有节点拖到 `SectionContainer` 中间区域时移动到容器内部末尾。
- 已有节点拖到画布空白区域时移动到根节点末尾。
- 防止节点拖到自己内部或对自己投放造成异常。
- 更新 renderer README、项目状态、TODO 和验证报告。

不包含：

- 自由绝对布局、网格布局、拖拽改变尺寸。
- React H5 renderer 的 editable 节点拖拽能力。
- 移动端 Pointer Events 拖拽适配。
- 新增 npm 发布或 changeset。

## 责任边界

当前仓库：

- `renderer-vue-h5` 只提供框架无关的 editable 节点拖拽回调，不依赖 editor。
- `apps/editor-playground` 负责把拖拽回调解释为低代码节点移动命令。

外部系统：

- 正式管理后台后续负责根据真实 UI shell 迁移该交互，并补充浏览器自动化测试。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 `LowcodeVueRenderer` 可选 props。
- 契约文档路径：`packages/renderer-vue-h5/README.md`
- 是否向后兼容：是，新增可选回调和可选 draggable 行为，不改变默认非 editable 渲染。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：`packages/renderer-vue-h5/README.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 扩展 Vue renderer editable wrapper 的拖拽 props 和事件。
2. 扩展 editor playground 画布拖拽状态，统一处理 material 和 node 两种来源。
3. 复用画布投放指示线，完成已有节点 before/after/inside/append 移动。
4. 更新 renderer README、AI 状态、TODO 和验证报告。
5. 运行 `pnpm typecheck`、`pnpm build`、`pnpm test` 和本地入口 smoke check。

## 验收标准

- [x] 画布中已有节点在设计模式下可拖拽。
- [x] 已有节点拖到目标节点上半区可移动到目标节点前。
- [x] 已有节点拖到目标节点下半区可移动到目标节点后。
- [x] 已有节点拖到 `SectionContainer` 中间区域可移动为容器子节点。
- [x] 已有节点拖到画布空白区域可移动到根节点末尾。
- [x] 自己拖到自己或自己后代时不会破坏 schema。
- [x] `LowcodeVueRenderer` 新增能力向后兼容并有 README 说明。
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
- 发布对象：后续发布 `@meumall/lowcode-renderer-vue-h5` 时包含可选拖拽回调能力。
- 是否需要 changeset：当前不发布，暂不新增 changeset。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：类型检查、构建、测试和本地入口检查通过。

## 风险和阻塞

- 当前仓库未安装 Playwright，无法执行自动化拖拽测试；本轮记录为未覆盖项。
- 浏览器原生 HTML5 drag 在移动端体验有限，正式管理台可补充 Pointer Events 或专用拖拽库。

## 验证结果

2026-07-31 验证通过。

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，3 个 suite、19 个用例全部通过。
- `curl -I http://localhost:5173/`：返回 `HTTP/1.1 200 OK`。
- `curl -I http://localhost:5174/`：返回 `HTTP/1.1 200 OK`。
- `node -e "import('playwright')..."`：未通过，当前仓库未安装 Playwright；已记录为未覆盖风险。

验证报告：`.ai/test-reports/TASK-2026-0731-020-editor-canvas-node-drag.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确已有节点画布拖拽范围、包边界和验收标准。 |
| 2026-07-31 | in_progress | 开始实现 Vue renderer 拖拽回调和 editor playground 节点移动。 |
| 2026-07-31 | verified | 完成已有节点画布拖拽排序、容器内移动、根级追加和验证记录。 |
