# TASK-2026-0731-025-editor-boolean-switch

## 状态

verified

## 目标

完善 Vue3 编辑器属性面板的布尔字段编辑能力，让 `switch` setter 和 `boolean` 类型字段以真实开关控件编辑，并写入稳定 boolean 值。

## 背景

`FloorAnchorNav` 等物料已开始使用 `sticky`、`smooth` 这类布尔字段。当前属性面板会把非颜色、非结构化字段降级为文本输入，运营输入 `false` 时会被 `Boolean("false")` 转成 `true`，导致 schema 与预期不一致。为了让编辑器更可实操，需要把布尔字段升级为明确的开关控件。

## 涉及包或系统

- `apps/editor-playground`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- 属性面板识别 `propSchema.setter === "switch"` 或 `propSchema.type === "boolean"`。
- 以 checkbox/toggle UI 编辑布尔字段。
- `normalizeInputValue` 对 boolean 输入做稳定解析。
- 更新任务、项目状态、上下文和验证记录。

不包含：

- 不新增 schema 字段。
- 不新增物料。
- 不改 renderer。
- 不实现完整表单设计器。

## 责任边界

当前仓库：

- 维护 Vue3 编辑器 playground 的属性编辑体验和验证记录。

外部系统：

- Java 管理系统后续迁移编辑器时可复用该交互思路，正式表单组件库由管理系统统一治理。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无。
- 是否向后兼容：是，只改善编辑器对已有 manifest setter/type 的处理。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 在属性面板中为 boolean/switch 字段渲染开关控件。
2. 修正 boolean 规范化逻辑，兼容 boolean、字符串和数字输入。
3. 增加样式，保持右侧属性面板紧凑可扫。
4. 运行类型检查、构建、测试和 smoke check。

## 验收标准

- [x] `switch` setter 字段渲染为开关控件。
- [x] `boolean` 类型字段渲染为开关控件。
- [x] 开关变更写入真实 boolean，而不是字符串。
- [x] 文本 `"false"`、`"0"`、`"off"` 经规范化后为 false。
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
- 发布对象：后续发布 `apps/editor-playground` 示例或迁移管理台时包含该交互。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可恢复原属性编辑逻辑。
- smoke check：编辑器和 H5 runtime dev server 返回 HTTP 200，自动化命令通过。

## 风险和阻塞

- 当前仍是 playground 表单，不是正式管理台设计系统组件。
- 布尔字段样式为轻量开关，后续迁入管理系统时可替换为正式组件库 Switch。

## 验证结果

验证日期：2026-07-31

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，4 个 suites、22 条 tests 全部通过。
- `curl -I http://127.0.0.1:5173/`：HTTP 200。
- `curl -I http://127.0.0.1:5174/`：HTTP 200。

验证报告：`.ai/test-reports/TASK-2026-0731-025-editor-boolean-switch.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建编辑器布尔开关任务。 |
| 2026-07-31 | verified | 完成属性面板布尔开关控件、布尔值解析和验证记录。 |
