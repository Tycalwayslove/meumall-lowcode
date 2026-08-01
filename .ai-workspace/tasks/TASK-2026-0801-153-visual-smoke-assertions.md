# TASK-2026-0801-153-visual-smoke-assertions

## 标题

增强编辑器和 H5 runtime 可视化 smoke 断言

## 状态

verified

## 目标

让 `pnpm smoke:visual` 不只生成截图，还能自动校验编辑器和 H5 runtime 截图的尺寸、采样颜色和非空状态，降低“页面能打开但截图白屏/空白/尺寸异常”被误判为可用的风险。

## 背景

当前仓库已有 `pnpm smoke:visual`，会启动 Vue3 编辑器 playground、React H5 runtime playground 和 Chrome headless，并生成本地截图报告。但脚本目前只等待 DOM 条件并保存 PNG，没有读取截图内容做健康判断。用户的长期目标是看到可实操编辑器和对应 H5 渲染，因此可视化 smoke 需要具备最基本的截图质量断言，作为后续 UI 和物料迭代的护栏。

## 涉及包或系统

- `scripts/visual-smoke.mjs`
- `.ai-workspace/tasks/`
- `.ai/`

## 范围

包含：

- 为 visual smoke 增加 PNG 尺寸读取。
- 为 visual smoke 增加 PNG 像素采样和非空/非单色断言。
- 将截图宽高、采样颜色数量和亮度范围写入本地 Markdown 报告。
- 更新 AI 状态、TODO 和任务记录。
- 运行 `pnpm smoke:visual`、`pnpm test` 和 `git diff --check`。

不包含：

- 不引入 Playwright、Puppeteer 或图像处理依赖。
- 不提交生成的 `.ai/test-reports/latest-visual` 截图产物。
- 不建立基线图像 diff 或阈值化视觉回归平台。
- 不修改 Page Schema、renderer、materials、editor 或 adapters 公开 API。
- 不改变浏览器交互 smoke 的覆盖范围。

## 责任边界

当前仓库：

- `scripts/visual-smoke.mjs` 负责本地可视化 smoke 截图、基础 PNG 健康检查和报告生成。

外部系统：

- CI artifact 上传、多浏览器截图矩阵、设计基线比对和人工视觉验收仍需后续单独设计。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无；本任务只增强本地验证脚本。
- 是否向后兼容：是。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：低代码前端维护者。
- 当前确认状态：本地 Chrome visual smoke。

## 实现计划

1. 增加零依赖 PNG 解析、尺寸读取和像素采样 helper。
2. 截图后校验宽高、采样颜色数量和亮度范围。
3. 将视觉指标写入本地报告。
4. 更新 AI 状态和 TODO。
5. 运行验证并提交推送。

## 验收标准

- [x] `pnpm smoke:visual` 会校验每张截图的 PNG 宽高。
- [x] `pnpm smoke:visual` 会校验每张截图采样颜色数量达到阈值。
- [x] `pnpm smoke:visual` 会校验每张截图亮度范围达到阈值。
- [x] 视觉报告记录每张截图的宽高、采样颜色数量和亮度范围。
- [x] 脚本不新增第三方依赖。
- [x] 不提交生成的截图报告产物。
- [x] `pnpm smoke:visual` 通过。
- [x] `pnpm test` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm smoke:visual
pnpm test
git diff --check
```

## 验证结果

- `pnpm smoke:visual` 通过，生成 3 张截图并完成 PNG 健康断言：
  - Vue3 编辑器 playground：`1440x1100`，采样颜色 `849`，亮度范围 `245`。
  - React H5 runtime published pageId：`885x6426`，采样颜色 `919`，亮度范围 `255`。
  - React H5 runtime preview releaseId：`885x6426`，采样颜色 `913`，亮度范围 `255`。
- `pnpm test` 通过，94 项测试全部通过，并包含架构边界检查。
- `git diff --check` 通过。

## 发布影响

- 是否需要发布：否，本任务只改本地验证脚本。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：不改变 H5 接入代码；增强本地可见性验证。
- 是否影响 npm 发布：否。
- 是否影响 Java 配置平台：否。
- 回滚目标：回滚本任务提交即可恢复只生成截图、不解码校验的 visual smoke。
- smoke check：`pnpm smoke:visual` 必须通过。

## 风险和阻塞

- 当前只做基础截图健康检查，不等同于完整 visual regression。
- PNG 解码 helper 只服务 Chrome headless 当前截图输出格式；如果未来浏览器输出格式变化，需要同步扩展。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 visual smoke PNG 尺寸和非空断言、报告指标和状态同步。 |
| 2026-08-01 | verified | 完成 PNG 尺寸、采样颜色和亮度范围断言，报告新增视觉指标，并通过 visual smoke、test 和 diff check。 |
