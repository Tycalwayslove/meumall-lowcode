# TASK-2026-0731-029-editor-list-drag-sort

## 状态

verified

## 目标

增强 Vue3 编辑器数组属性列表项编辑器，为优惠券、规则、导航项、楼层锚点、门店/达人推荐等列表配置增加拖拽排序能力，让运营可以直接拖动调整展示顺序。

## 背景

当前 Vue3 编辑器已经把 `array` + `textarea` 属性升级为可视化列表项编辑器，并支持新增、删除、复制、上移和下移。但运营在配置券包、导航宫格、楼层锚点和推荐列表时，排序是高频操作，仅靠按钮调整多项顺序仍不够顺手。因此需要补充列表项拖拽排序。

## 涉及包或系统

- `apps/editor-playground`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- 为数组属性列表项增加 HTML5 drag/drop 排序。
- 拖动列表项时提供拖拽中和投放目标的视觉状态。
- drop 后更新当前节点对应 props 数组顺序。
- 保留现有上移、下移、复制、删除和 JSON 高级编辑能力。
- 更新任务、项目状态、上下文和验证记录。

不包含：

- 不新增或修改 Page Schema 字段。
- 不修改 Material Manifest 契约。
- 不实现跨属性、跨节点、跨物料列表拖拽。
- 不实现移动端 Pointer Events 拖拽。

## 责任边界

当前仓库：

- 维护 Vue3 编辑器 playground 的数组属性列表项拖拽交互、样式和验证记录。

外部系统：

- Java 配置平台后续负责真实资源选择器、权限、审核、服务端校验和持久化。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无。
- 是否向后兼容：是，只改变编辑器 UI，不改变 schema 输出结构。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：暂不新增独立对接文档。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 增加列表项拖拽状态、drag start/over/drop/end 处理。
2. 在列表项编辑器模板中接入 draggable、拖拽状态 class 和 drop 事件。
3. 补充拖拽手柄、拖拽中和目标项样式。
4. 运行类型检查、构建、测试和 dev server smoke check。
5. 更新 AI 任务、项目状态和测试报告。

## 验收标准

- [x] 数组属性列表项可以拖拽排序。
- [x] 拖拽排序后当前节点 props 数组顺序被更新。
- [x] 拖拽时有拖拽中和目标项视觉状态。
- [x] 现有上移、下移、复制、删除和 JSON 高级编辑能力保留。
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
- 发布对象：后续发布 `@meumall/lowcode-editor` 或管理台迁移时可复用该交互思路。
- 是否需要 changeset：正式 npm 发布前需要，本任务先不创建版本发布。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可移除数组属性拖拽排序。
- smoke check：编辑器和 H5 runtime dev server 返回 HTTP 200，自动化命令通过。

## 风险和阻塞

- 当前拖拽排序使用 HTML5 drag/drop，移动端触摸拖拽仍需后续 Pointer Events 专项处理。
- 当前只支持同一个数组属性内部排序，不支持跨列表拖动。

## 验证结果

验证日期：2026-07-31

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，4 个 suites、24 条 tests 全部通过。
- `curl -I http://127.0.0.1:5173/`：HTTP 200。
- `curl -I http://127.0.0.1:5174/`：HTTP 200。

验证报告：`.ai/test-reports/TASK-2026-0731-029-editor-list-drag-sort.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建 Vue3 编辑器数组列表拖拽排序任务。 |
| 2026-07-31 | in_progress | 开始实现数组列表项拖拽排序。 |
| 2026-07-31 | verified | 完成数组列表项拖拽排序、视觉状态和验证记录。 |
