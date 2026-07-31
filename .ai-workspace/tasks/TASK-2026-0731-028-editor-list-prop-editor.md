# TASK-2026-0731-028-editor-list-prop-editor

## 状态

verified

## 目标

增强 Vue3 编辑器属性面板，为常见数组属性提供可视化列表项编辑器，让运营可以直接编辑优惠券、规则、导航项、门店/达人推荐等列表内容，而不是只能手写 JSON。

## 背景

当前 Vue3 编辑器已经支持基础属性、颜色、布尔开关、素材库和商品选择器，但 `items`、`coupons`、`rules` 等数组字段仍主要通过 textarea 输入 JSON。运营人员实际配置活动页时，频繁手写 JSON 容易出错，也不符合可实操编辑器的目标。因此需要补充通用数组属性编辑能力。

## 涉及包或系统

- `apps/editor-playground`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- 为 `array` 类型且使用 `textarea` setter 的属性提供列表项编辑器。
- 支持列表项新增、删除、复制、上移、下移。
- 支持常见字段的文本输入，如 `id`、`title`、`subtitle`、`desc`、`imageUrl`、`valueText`、`thresholdText`、`expireText`、`buttonText`、`targetId`、`typeText`、`metricText`、`content` 等。
- 对不规则对象保留 JSON 高级编辑入口。
- 继续保留原有 textarea 兜底，不破坏已有 JSON 编辑路径。
- 更新任务、项目状态、上下文和验证记录。

不包含：

- 不新增或修改 Page Schema 字段。
- 不修改 Material Manifest 契约。
- 不接入真实素材、商品、优惠券、门店或达人中心。
- 不实现复杂嵌套数组、拖拽排序或批量导入。

## 责任边界

当前仓库：

- 维护 Vue3 编辑器 playground 的属性面板交互、样式和验证记录。

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

1. 在 Vue3 编辑器属性面板中识别可视化数组字段。
2. 增加数组项新增、复制、删除、上移、下移和字段更新逻辑。
3. 增加列表项编辑器 UI 和样式，并保留 JSON 高级编辑。
4. 运行类型检查、构建、测试和 dev server smoke check。
5. 更新 AI 任务、项目状态和测试报告。

## 验收标准

- [x] `array` + `textarea` 属性显示可视化列表项编辑器。
- [x] 列表项支持新增、删除、复制、上移、下移。
- [x] 列表项常见字段可直接输入并写回当前节点 props。
- [x] 不规则列表仍可通过 JSON textarea 编辑。
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
- 回滚目标：回滚本任务提交即可恢复 JSON-only 数组编辑。
- smoke check：编辑器和 H5 runtime dev server 返回 HTTP 200，自动化命令通过。

## 风险和阻塞

- 当前列表项编辑器只覆盖一层对象数组，复杂嵌套结构仍需使用 JSON 高级编辑。
- 字段模板基于常见运营物料字段，后续可在 Material Manifest 中扩展更精确的 item schema。

## 验证结果

验证日期：2026-07-31

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，4 个 suites、24 条 tests 全部通过。
- `curl -I http://127.0.0.1:5173/`：HTTP 200。
- `curl -I http://127.0.0.1:5174/`：HTTP 200。

验证报告：`.ai/test-reports/TASK-2026-0731-028-editor-list-prop-editor.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建 Vue3 编辑器列表属性编辑任务。 |
| 2026-07-31 | in_progress | 开始实现数组属性可视化列表编辑。 |
| 2026-07-31 | verified | 完成列表项编辑器、JSON 高级编辑兜底和验证记录。 |
