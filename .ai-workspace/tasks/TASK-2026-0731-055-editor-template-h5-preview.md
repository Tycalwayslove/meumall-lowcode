# TASK-2026-0731-055 编辑器模板 H5 预览入口

## 状态

verified

## 目标

增强 Vue3 编辑器模板库交互，让运营在应用模板并替换当前画布前，可以先打开该模板的 React H5 渲染预览。

## 背景

当前模板卡片支持搜索、分类过滤、版本、标签和结构摘要，但主要操作仍是点击卡片直接应用模板。对于已有草稿或活动页面编辑场景，运营希望先看模板在 H5 runtime 中的实际效果，再决定是否替换当前页面。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai-workspace/tasks`
- `.ai`

## 范围

- 左侧模板卡片新增独立 H5 预览入口。
- 模板预览通过现有 React H5 runtime schema URL handoff 打开，不替换当前画布。
- 模板主操作继续保留应用模板能力。
- Browser smoke 覆盖模板预览入口和不替换当前画布。
- 更新 AI 项目状态和任务记录。

## 不包含

- 不新增模板市场 API。
- 不修改 Template Library Client 公开契约。
- 不修改 Page Schema。
- 不新增模板缩略图。
- 不实现 Java 配置平台 previewId。

## 责任边界

- 编辑器 playground 负责为本地模板提供预览入口和操作反馈。
- React H5 runtime playground 继续消费 URL schema 参数进行预览渲染。
- Java 配置平台后续可替换为 previewId/pageId 方式，本任务不实现服务端能力。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无。
- 是否向后兼容：是。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 后续接 Java 模板市场时，可将模板预览入口切换到配置平台 previewId 或模板 releaseId。
- 当前实现继续复用 `createReactH5RuntimeUrl(schema)`，不引入新契约。

## 实现计划

1. 拆分模板卡片结构，区分应用主区域和 H5 预览按钮。
2. 新增模板预览方法，按模板 id 读取详情并打开 React H5 runtime。
3. 补充 browser smoke，确认预览不替换当前画布。
4. 更新 AI 状态、TODO 和任务验证记录。

## 验收标准

- [ ] 模板卡片提供独立 H5 预览按钮。
- [ ] 点击预览按钮会打开 React H5 runtime 链接。
- [ ] 点击预览按钮不会应用模板或替换当前画布。
- [ ] 点击模板主区域仍可应用模板。
- [ ] `pnpm typecheck` 通过。
- [ ] `pnpm build` 通过。
- [ ] `pnpm test` 通过。
- [ ] `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm smoke:browser
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可恢复旧模板卡片。
- smoke check：需要覆盖模板预览入口。

## 风险和阻塞

- 风险：当前模板预览使用 URL schema 参数，复杂模板变大后可能受 URL 长度影响。
- 缓解：本任务不新增契约；后续接 Java 配置平台后切换到 previewId/pageId。
- 当前无阻塞。

## 实现结果

- 模板卡片已拆分为应用主区域和独立 H5 预览按钮。
- 模板预览会按模板 id 读取详情，并通过现有 React H5 runtime schema URL handoff 打开模板渲染效果。
- 点击预览按钮只打开 H5 预览并展示反馈，不替换当前画布。
- 模板主区域继续保留应用模板能力。
- Browser smoke 已覆盖模板预览入口、不替换当前画布和后续应用模板流程。

## 验证结果

```bash
pnpm typecheck
# 通过

pnpm build
# 通过

pnpm test
# 通过，32 个测试全部通过

pnpm smoke:browser
# 通过，覆盖模板 H5 预览入口、不替换当前画布和模板应用流程
```

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建任务，准备实现模板 H5 预览入口。 |
| 2026-07-31 | in_progress | 开始实现模板 H5 预览入口。 |
| 2026-07-31 | verified | 完成实现并通过验证，状态流转为 verified。 |
