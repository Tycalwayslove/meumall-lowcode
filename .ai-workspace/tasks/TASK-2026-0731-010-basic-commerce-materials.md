# TASK-2026-0731-010-basic-commerce-materials

## 状态

verified

## 目标

扩展基础物料库，新增电商活动页常用的行动按钮、公告条和间距块，并保证 Vue3 编辑器预览与 React H5 runtime 使用同名物料和同基础 manifest。

## 背景

当前物料库已有容器、头图、Banner、商品列表、优惠券和富文本，已经能搭出基础活动页，但运营实操中还常需要明确 CTA、活动公告和版块间距控制。如果缺少这些基础物料，活动页仍然需要用富文本或容器绕过，不利于长期标准化。

## 涉及包或系统

- `@meumall/lowcode-materials-vue-h5`
- `@meumall/lowcode-materials-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- 文档和 AI 工作流事实源

## 范围

包含：

- 新增 `ActionButton` 物料。
- 新增 `NoticeBar` 物料。
- 新增 `SpacerBlock` 物料。
- Vue H5 与 React H5 物料使用同一 `componentName` 和基础 propsSchema。
- 编辑器初始示例展示新增物料。
- React H5 runtime 示例展示新增物料。
- 更新包 README、项目状态和验证报告。

不包含：

- 倒计时、秒杀、复杂导航宫格等更高阶物料。
- 真实链接跳转白名单。
- 真实埋点和 action 执行。
- schema 主结构变更。

## 责任边界

当前仓库：

- 提供基础电商活动页可复用物料。
- 保证 Vue 编辑器和 React H5 runtime 对同一 schema 的基础渲染一致。

外部系统：

- Java 配置平台后续负责素材、活动、链接和权限配置。
- `hybird-meumall` 后续负责真实 H5 路由与链接策略。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增向后兼容物料 manifest。
- 契约文档路径：`packages/materials-vue-h5/src/index.ts`、`packages/materials-h5/src/index.tsx`
- 是否向后兼容：是，新增物料，不改变已有 schema 字段。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：H5 接入方。
- 当前确认状态：本地 playground 验证。

## 实现计划

1. 新增任务并流转到 `in_progress`。
2. 在 Vue H5 materials 中新增三个物料和 manifest。
3. 在 React H5 materials 中新增三个同名物料和 manifest。
4. 更新编辑器和 React H5 runtime 示例 schema。
5. 更新 README、项目状态、TODO 和验证报告。
6. 运行类型检查、构建、npm dry-run 和 smoke check。

## 验收标准

- [x] Vue H5 物料包包含 `ActionButton`、`NoticeBar`、`SpacerBlock`。
- [x] React H5 物料包包含 `ActionButton`、`NoticeBar`、`SpacerBlock`。
- [x] 两套物料 manifest 的 `componentName` 和基础 propsSchema 对齐。
- [x] 编辑器物料面板能显示新增物料。
- [x] 编辑器初始示例包含至少一个新增物料。
- [x] React H5 runtime 示例包含至少一个新增物料。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] 两个 H5 materials 包 npm pack dry-run 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm --filter @meumall/lowcode-materials-vue-h5 exec npm pack --dry-run
pnpm --filter @meumall/lowcode-materials-h5 exec npm pack --dry-run
curl -I http://localhost:5173/
curl -I http://localhost:5174/
```

## 发布影响

- 是否需要发布：当前不发布；后续 npm 发布时两个 materials 包需要随包发布。
- 发布对象：无。
- 是否需要 changeset：当前不需要。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：编辑器和 React H5 runtime 本地访问返回 200。

## 验证结果

2026-07-31：

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm --filter @meumall/lowcode-materials-vue-h5 exec npm pack --dry-run` 通过。
- `pnpm --filter @meumall/lowcode-materials-h5 exec npm pack --dry-run` 通过。
- `curl -I http://localhost:5173/` 返回 `HTTP/1.1 200 OK`。
- `curl -I http://localhost:5174/` 返回 `HTTP/1.1 200 OK`。
- 验证报告：`.ai/test-reports/TASK-2026-0731-010-basic-commerce-materials.md`

## 风险和阻塞

- `ActionButton` 的 `linkUrl` 当前只是基础链接能力，正式环境需要结合 action 白名单和路由策略治理。
- 物料视觉仍是基础可用版本，后续需要跟品牌 UI 规范继续打磨。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确新增行动按钮、公告条和间距块。 |
| 2026-07-31 | in_progress | 开始实现 Vue/React H5 基础电商物料。 |
| 2026-07-31 | verified | 类型检查、构建、materials dry-run 和本地 smoke check 通过。 |
