# TASK-2026-0801-079-architecture-boundary-check

## 标题

补充低代码包边界和物料分层架构检查

## 状态

verified

## 目标

把当前 monorepo 的包边界、依赖方向和物料分层规则沉淀为可执行的本地检查命令，避免后续继续完善 Vue3 编辑器、H5 runtime、基础组件和业务物料时出现依赖倒挂、物料 manifest 两端不一致、runtime primitives 被误注册为物料等架构偏移。

## 背景

项目已经具备可实操编辑器、React H5 runtime playground、基础物料和内部 runtime primitives 原型。接下来要持续拓展编辑器体验、物料库和 npm 发布能力，单靠文档提醒不足以长期约束多人协作，需要一个轻量、零新增依赖的架构门禁。

## 涉及包或系统

- `scripts/check-architecture.mjs`
- 根级 `package.json`
- `README.md`
- `docs/architecture.md`
- `.ai/`

## 范围

包含：

- 新增根级 `pnpm check:architecture` 命令。
- 检查可发布包的 `package.json`、`README.md`、`src/index.*`、`main`、`types`、`exports`、`files` 和 `publishConfig.access`。
- 检查 `package.json` 里的 `@meumall/*` workspace 依赖方向。
- 扫描 `packages/` 和 `apps/` 源码中的 `@meumall/*` import，校验实际代码依赖方向。
- 检查 React/Vue H5 物料 manifest `componentName` 顺序一致。
- 检查 `Mlc*` runtime primitives 没有被注册为低代码物料。
- 将架构检查接入根级 `pnpm test`，让常规测试覆盖架构边界。
- 更新项目事实源和任务记录。

不包含：

- 不调整现有包依赖。
- 不新增 npm 包。
- 不拆出 primitives 独立包。
- 不修改 Page Schema、Material Manifest 契约字段或 renderer 行为。
- 不引入 ESLint、dependency-cruiser、madge、Playwright 等新依赖。
- 不新增 changeset。

## 责任边界

当前仓库：

- 提供并维护本地架构检查脚本。
- 通过根级测试命令持续验证包边界。

外部系统：

- GitHub Actions 后续可直接复用 `pnpm test` 或单独执行 `pnpm check:architecture`。
- Java 配置平台、`hybird-meumall` 和 npm registry 不受本任务影响。

## 契约影响

- 是否影响跨包或跨系统契约：否，脚本只检查既有规则。
- 契约文档路径：规则来源为 `.ai-workspace/PROJECT_MAP.md` 和 `docs/material-layering-architecture.md`。
- 是否向后兼容：是。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 需要确认的角色：无。
- 当前确认状态：本任务无需外部确认。

## 实现计划

1. 新增架构检查脚本。
2. 在根级 `package.json` 增加 `check:architecture`，并接入 `pnpm test`。
3. 更新 README、架构文档和 `.ai` 项目事实源。
4. 运行验证命令并记录结果。

## 验收标准

- [x] `pnpm check:architecture` 通过。
- [x] 架构检查覆盖可发布包结构。
- [x] 架构检查覆盖 `package.json` workspace 依赖方向。
- [x] 架构检查覆盖源码 import 依赖方向。
- [x] 架构检查覆盖 React/Vue H5 物料 manifest 对齐。
- [x] 架构检查覆盖 runtime primitives 不进入 material registry。
- [x] `pnpm test` 会执行架构检查。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm pack:dry-run` 通过。

## 验证命令

```bash
pnpm check:architecture
pnpm typecheck
pnpm build
pnpm test
pnpm pack:dry-run
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否。
- 是否影响 npm 发布：否，只增强发布前本地门禁。
- 回滚目标：回滚本任务提交。
- smoke check：本任务不改变运行时 UI，可继续使用 `pnpm smoke:browser` 和 `pnpm smoke:visual` 做浏览器可见性验证。

## 风险和阻塞

- 当前脚本是轻量静态检查，不能替代完整代码规范工具或循环依赖分析。
- 后续新增包时需要同步维护允许依赖表，否则架构检查会阻止未登记的依赖方向。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为本地架构边界检查。 |
| 2026-08-01 | in_progress | 开始实现 `check:architecture`、测试接入和文档事实源更新。 |
| 2026-08-01 | verified | 完成架构检查脚本、根级命令、测试链路接入和文档事实源更新；`pnpm check:architecture`、`pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm pack:dry-run` 均通过。 |
