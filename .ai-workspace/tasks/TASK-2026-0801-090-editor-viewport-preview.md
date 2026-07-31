# TASK-2026-0801-090-editor-viewport-preview

## 标题

增强编辑器 H5 画布视口预览

## 状态

verified

## 目标

把 Vue3 编辑器内置画布的视口切换从简单宽度按钮升级为明确的 H5 设备预设预览，让运营和开发在编辑阶段能快速检查 360、390、430 常见手机宽度下的页面表现，同时保持 Page Schema 和渲染协议不变。

## 背景

当前编辑器已有基础 `viewport` 状态和 375/430 两个宽度按钮，但交互语义偏弱，运营很难判断当前预览对应什么设备尺寸，也容易和页面设置里的 `layout.maxWidth` 混淆。为了在不扰动架构边界的前提下继续提升可实操程度，本任务先把视口预设作为编辑器 shell 的本地能力补齐。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

包含：

- 在 Vue3 编辑器 playground 增加 H5 设备视口预设定义。
- 在画布顶部提供更清晰的 360 / 390 / 430 视口切换体验。
- 在手机框状态栏展示当前预设名称和宽度。
- 保持视口状态只作为编辑器 shell 状态，不写入 Page Schema。
- 扩展 browser smoke，验证视口按钮存在且切换后手机框宽度变化。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不新增 Page Schema 字段。
- 不修改 Material Manifest。
- 不修改 React/Vue renderer 协议。
- 不新增真实小程序预览。
- 不接入 Java 配置平台。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `apps/editor-playground` 负责编辑器 shell 的视口切换和画布展示。
- `@meumall/lowcode-editor` 继续提供通用 `setEditorViewport` 状态能力。
- `scripts/browser-smoke.mjs` 负责本地验证关键编辑体验。

外部系统：

- 管理系统未来可复用 `setEditorViewport`，也可以替换自己的设备预设。
- Java 配置平台只消费 Page Schema 和发布记录，本任务不产生接口变化。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无。
- 是否向后兼容：是。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 阅读编辑器画布结构、视口状态和现有冒烟脚本。
2. 设计编辑器本地 H5 视口预设，不污染 Page Schema。
3. 实现顶部视口切换、状态栏展示和样式优化。
4. 扩展 browser smoke 覆盖视口宽度切换。
5. 更新项目事实源、AI 上下文、TODO 和任务状态。
6. 运行验证命令并记录结果。

## 验收标准

- [x] 编辑器画布顶部能看到 360 / 390 / 430 三个 H5 视口预设。
- [x] 点击不同预设后 `.phone-frame` 宽度随之变化。
- [x] 手机框状态栏能展示当前预设名称和宽度。
- [x] 视口切换不修改 Page Schema、物料 manifest 或 renderer 协议。
- [x] browser smoke 覆盖视口预设切换。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm check:architecture` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `pnpm pack:dry-run` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm check:architecture
pnpm smoke:browser
pnpm pack:dry-run
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否，本任务只影响编辑器 playground 体验。
- 是否影响 npm 发布：否，包公开 API 不变。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 覆盖编辑器视口切换。

## 风险和阻塞

- 当前只覆盖 H5 常见宽度，不代表真实 WebView、状态栏、安全区和小程序容器差异。
- 视口预设属于编辑器 shell 能力，未来管理系统接入时应根据运营后台布局重新确认预设入口位置。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为编辑器 H5 画布视口预览体验增强。 |
| 2026-08-01 | in_progress | 开始实现编辑器 H5 设备视口预设、手机框状态展示和 browser smoke 覆盖。 |
| 2026-08-01 | verified | 已完成 Vue3 编辑器 H5 画布视口预设、默认 390 标准屏、手机框状态展示、browser smoke 覆盖和 AI 状态记录；验证命令全部通过。 |
