# TASK-2026-0731-023-activity-rule-material

## 状态

verified

## 目标

新增运营活动常用的活动规则弹窗物料，让 Vue3 编辑器可添加和配置，并让 React H5 runtime 与 Vue H5 预览都能渲染同一 `componentName`。

## 背景

当前基础物料已覆盖活动头图、公告、优惠券、商品、倒计时、导航宫格和秒杀商品组，但活动页常见的“查看活动规则”还只能依赖富文本静态展示。运营实际搭活动页时通常需要一个简洁入口，点击后展示规则弹窗，避免规则说明占用页面主视觉空间。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- 新增 React H5 `ActivityRuleModal` 物料。
- 新增 Vue H5 `ActivityRuleModal` 物料，保持 manifest 与 React H5 对齐。
- 编辑器物料库自动出现该物料，并可通过通用属性面板配置规则文案。
- 页面模板和 React H5 runtime 示例加入活动规则弹窗节点。
- 新增物料 manifest 对齐测试。
- 更新任务、项目状态、上下文和验证记录。

不包含：

- 不新增 Page Schema 结构字段。
- 不接入真实法务/活动规则中心。
- 不实现专用规则编辑器 UI。
- 不处理服务端规则审批、版本审计或多语言。

## 责任边界

当前仓库：

- 维护物料 manifest、React/Vue H5 物料实现、编辑器示例、runtime 示例和验证记录。

外部系统：

- Java 配置平台后续负责真实规则内容存储、审核、发布和回滚审计。
- H5 宿主后续负责真实埋点、弹窗监控和样式治理。

## 契约影响

- 是否影响跨包或跨系统契约：影响 Material Manifest 物料清单，新增向后兼容物料。
- 契约文档路径：物料 manifest 由 `packages/materials-h5/src/index.tsx` 和 `packages/materials-vue-h5/src/index.ts` 暂作为事实源。
- 是否向后兼容：是，旧页面不引用该物料时不受影响。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否，正式发布 npm 时按 minor 能力发布。

## 对接说明

- 是否需要对接说明：暂不需要新增独立对接文档。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 在 React/Vue H5 物料包中新增 `ActivityRuleModal` 组件和 manifest。
2. 在编辑器模板和 H5 runtime 示例中加入活动规则节点。
3. 增加物料 manifest 对齐测试，并纳入根级 `pnpm test`。
4. 运行类型检查、构建和测试，记录验证结果。

## 验收标准

- [x] `ActivityRuleModal` 在 React H5 和 Vue H5 物料包中均已注册。
- [x] React/Vue 两套物料 manifest 的 `componentName` 保持一致。
- [x] Vue3 编辑器物料库可通过 manifest 自动出现该物料。
- [x] 页面模板或 H5 runtime 示例包含活动规则弹窗节点。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] editor 和 H5 runtime dev server smoke check 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
```

## 发布影响

- 是否需要发布：本任务不实际发布 npm。
- 发布对象：后续发布 `@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5` 时包含该物料。
- 是否需要 changeset：正式 npm 发布前需要，本任务先不创建版本发布。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可移除该物料。
- smoke check：编辑器添加物料、H5 runtime 示例渲染和自动化命令通过。

## 风险和阻塞

- 规则列表暂用 JSON 文本配置，后续需要专用规则编辑器改善运营体验。
- 弹窗样式为基础实现，正式接入管理台和 H5 宿主时需要设计系统统一治理。

## 验证结果

验证日期：2026-07-31

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，4 个 suites、21 条 tests 全部通过。
- `curl -I http://127.0.0.1:5173/`：HTTP 200。
- `curl -I http://127.0.0.1:5174/`：HTTP 200。

验证报告：`.ai/test-reports/TASK-2026-0731-023-activity-rule-material.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建活动规则弹窗物料任务。 |
| 2026-07-31 | verified | 完成活动规则弹窗物料、模板示例、runtime 示例和物料 manifest 对齐测试。 |
