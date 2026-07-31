# TASK-2026-0801-078-visual-smoke-screenshots

## 标题

补充编辑器和 H5 runtime 可视化 smoke 截图

## 状态

verified

## 目标

在不修改 Page Schema、renderer、materials、adapters 公开 API 的前提下，补充一条可重复执行的可视化验收命令，用 Chrome headless 截取 Vue3 编辑器 playground、React H5 runtime published 入口和 preview release 入口的截图，并生成本地 Markdown 报告，方便后续多人协作时快速确认“编辑器可见、H5 可见、运行入口没有白屏”。

## 背景

当前仓库已有 `pnpm smoke:browser` 进行 DOM 级浏览器 smoke check，但它主要验证关键交互和文案，不输出可视化结果。后续继续优化编辑器交互、物料分层和 H5 接入时，需要一条轻量截图链路作为架构护栏，避免每次改动只能靠口头描述判断效果。

## 涉及包或系统

- `scripts/visual-smoke.mjs`
- 根级 `package.json`
- `.gitignore`
- `.ai/`

## 范围

包含：

- 新增根级 `pnpm smoke:visual` 命令。
- 启动 Vue3 editor playground 和 React H5 runtime playground。
- 启动本机 Chrome headless 并通过 DevTools Protocol 截图。
- 截取编辑器首页、H5 published pageId、H5 preview releaseId 三个场景。
- 生成 `.ai/test-reports/latest-visual/index.md` 本地报告和截图文件。
- 更新 `.ai` 项目事实源和默认验证命令。

不包含：

- 不引入 Playwright、Puppeteer 或其他新依赖。
- 不新增 visual regression 基线比对。
- 不修改 Page Schema v1。
- 不修改 materials 分层或 renderer 行为。
- 不提交生成的截图报告产物。
- 不新增 npm 包版本或 changeset。

## 责任边界

当前仓库：

- smoke 脚本负责本地可视化截图验收。
- 项目事实源负责说明命令用途和报告位置。

外部系统：

- GitHub Actions 如需保留截图产物，后续单独设计 artifact 上传。
- 正式管理台视觉回归、设计走查和验收规范后续独立补充。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：不新增契约。
- 是否向后兼容：是。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 需要确认的角色：无。
- 当前确认状态：本任务无需外部确认。

## 实现计划

1. 新增视觉 smoke 脚本，复用现有 dev server + Chrome CDP 思路。
2. 增加根级 `pnpm smoke:visual` 命令。
3. 忽略本地生成的视觉验收报告目录。
4. 更新 `.ai` 项目事实源。
5. 运行验证命令并记录结果。

## 验收标准

- [x] `pnpm smoke:visual` 可启动 editor playground、H5 runtime playground 和 Chrome headless。
- [x] 可生成编辑器首页截图。
- [x] 可生成 `?pageId=summer-campaign-demo` published H5 截图。
- [x] 可生成 `?releaseId=preview_demo` preview H5 截图。
- [x] `.ai/test-reports/latest-visual/index.md` 记录场景、URL 和截图相对路径。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。

## 验证命令

```bash
pnpm smoke:visual
pnpm typecheck
pnpm build
pnpm test
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否，只增强本地验证和协作可见性。
- 回滚目标：回滚本任务提交。
- smoke check：使用 `pnpm smoke:visual` 生成可视化本地报告，使用 `pnpm smoke:browser` 继续做交互 DOM 级验证。

## 风险和阻塞

- 本地截图只证明当前开发机 Chrome 下页面可见，不等同于生产级多浏览器视觉回归。
- 报告目录是本地生成产物，不进入 Git 历史；需要在 CI 保留时应另行上传 artifact。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为本地可视化 smoke 截图和报告。 |
| 2026-08-01 | in_progress | 开始实现截图脚本、根级命令、本地报告忽略规则和项目事实源更新。 |
| 2026-08-01 | verified | 完成 `pnpm smoke:visual`、本地截图报告、文档和事实源更新；`pnpm smoke:visual`、`pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm smoke:browser` 均通过。 |
