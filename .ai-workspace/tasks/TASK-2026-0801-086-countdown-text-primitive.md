# TASK-2026-0801-086-countdown-text-primitive

## 标题

补齐 CountdownText 内部 runtime primitive

## 状态

verified

## 目标

在 React H5 和 Vue H5 materials 包内部新增业务无关的 `MlcCountdownText` runtime primitive，并改造现有 `CountdownTimer` 复用它，沉淀活动页倒计时文本展示能力。

## 背景

物料分层架构已将 `CountdownText` 列为后续 runtime primitives。当前 `CountdownTimer` 物料已可渲染活动倒计时，但时间盒子、标签和分隔符仍由业务物料内联实现。倒计时是活动页、秒杀、直播、优惠券过期等高频 H5 场景的基础能力，适合先在 materials 包内部沉淀为 primitive，等 API 稳定后再评估抽独立 npm 包。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `packages/materials-h5/test`
- `scripts/browser-smoke.mjs`
- `docs/material-layering-architecture.md`
- `.ai/`

## 范围

包含：

- 在 React H5 materials 内部 primitives 中新增 `MlcCountdownText`。
- 在 Vue H5 materials 内部 primitives 中新增同名 `MlcCountdownText`。
- 改造 React/Vue `CountdownTimer` 复用 `MlcCountdownText`。
- 保持 `CountdownTimer` 的 `componentName`、manifest 和旧 props 语义兼容。
- 补充 materials 单测，确保 primitives 不进入物料 registry 且 `CountdownTimer` 复用 `MlcCountdownText`。
- 补充 browser smoke 对倒计时文案渲染的覆盖。
- 更新 materials README、分层文档、项目事实源、AI 上下文和 TODO。

不包含：

- 不新增独立 primitives npm 包。
- 不新增 Page Schema 字段。
- 不新增 Material Manifest 字段。
- 不实现真实时间 tick、服务端时间校准、时区处理或活动状态机。
- 不接入真实活动中心、库存、秒杀或优惠券数据。
- 不改 `FlashSaleList`、`LiveEntry`、`CouponBundle` 等其他物料的业务逻辑。

## 责任边界

当前仓库：

- `packages/materials-h5` 和 `packages/materials-vue-h5` 维护 H5 runtime 内部 primitives 与物料实现。
- `CountdownTimer` 作为第一个倒计时 primitive 消费方，保持 manifest 兼容。

外部系统：

- Java 配置平台继续按现有 `CountdownTimer` manifest 识别该物料，本任务不需要服务端改造。
- `hybird-meumall` 未来通过 npm 包消费变更，本任务不改真实 H5 业务仓库。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：`docs/material-layering-architecture.md`、`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`。
- 是否向后兼容：是，仅内部实现复用，不改变 schema 或 manifest 语义。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是，更新 materials README 和分层架构文档。
- 对接说明路径：`docs/material-layering-architecture.md`、`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 阅读 React/Vue primitives 与 `CountdownTimer` 当前实现。
2. 设计 `MlcCountdownText` 的最小 props，保持业务无关。
3. 实现 React/Vue 内部 `MlcCountdownText`。
4. 改造 React/Vue `CountdownTimer` 复用 `MlcCountdownText`。
5. 补充 materials 单测和 browser smoke。
6. 更新 README、分层文档、项目事实源和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] React H5 materials 内部导出 `MlcCountdownText`。
- [x] Vue H5 materials 内部导出 `MlcCountdownText`。
- [x] React `CountdownTimer` 复用 `MlcCountdownText`，旧 props 和 manifest 保持兼容。
- [x] Vue `CountdownTimer` 复用 `MlcCountdownText`，旧 props 和 manifest 保持兼容。
- [x] materials 单测覆盖新增 primitive 复用和 registry 边界。
- [x] browser smoke 覆盖 Vue3 编辑器画布和 React H5 runtime 的倒计时渲染。
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
- 是否影响 H5 接入：未来 npm 发布后 H5 可获得内部倒计时文本 primitive 复用；本任务不改真实 H5 业务仓库。
- 是否影响 npm 发布：包实现变更，公开 schema/manifest 不变；未来真实发布可作为 patch 或 minor 评估。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 覆盖 Vue3 编辑器画布和 React H5 runtime 中的倒计时渲染。

## 风险和阻塞

- 当前 `MlcCountdownText` 只沉淀静态时间片段展示，不实现真实 tick、服务端时间校准和活动结束态；后续接活动中心时需要在数据源或宿主运行时层补齐时间口径。
- 当前只改造 `CountdownTimer` 一个消费方，后续秒杀、直播、优惠券等物料是否复用该 primitive，需要结合真实业务数据形态继续评估。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为内部 `MlcCountdownText` primitive 和 `CountdownTimer` 复用。 |
| 2026-08-01 | in_progress | 开始实现 React/Vue `MlcCountdownText`，并改造 `CountdownTimer` 复用内部倒计时文本 primitive。 |
| 2026-08-01 | verified | 完成 React/Vue 内部 `MlcCountdownText`，`CountdownTimer` 已复用该 primitive；`pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm check:architecture`、`pnpm smoke:browser`、`pnpm pack:dry-run` 均通过。 |
