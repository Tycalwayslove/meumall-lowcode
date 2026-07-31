# TASK-2026-0731-012-foundation-tests

## 状态

verified

## 目标

建立低代码 monorepo 的基础单元测试体系，优先覆盖 schema、core 和 adapters 的公开 API，降低后续编辑器、渲染器、npm 拆包和 Java 配置平台对接时的回归风险。

## 背景

当前编辑器、React H5 runtime、Vue H5 runtime 和基础物料已经具备第一版可用能力，但 `.ai/TODO.md` 中仍有 P0 缺口：尚未建立基础单元测试。低代码平台的长期稳定性依赖 schema/core/adapters 这些公共协议层，先为它们建立最小测试体系，可以让后续物料扩展、数据源真实请求和发布链路改造更可控。

## 涉及包或系统

- 根 `package.json`
- `@meumall/lowcode-schema`
- `@meumall/lowcode-core`
- `@meumall/lowcode-adapters`
- `.ai-workspace/tasks`
- `.ai/test-reports`
- `.ai/PROJECT_STATE.md`
- `.ai/TODO.md`

## 范围

包含：

- 新增根级 `pnpm test` 命令。
- 使用 Node.js 内置 `node --test`，不新增测试框架依赖。
- 为 schema 增加页面 schema、嵌套节点、重复 id、action 引用、manifest 和版本兼容测试。
- 为 core 增加物料注册、节点遍历、节点查找、数据绑定、可见性和 action executor 测试。
- 为 adapters 增加 data source registry、safe action registry 和 URL schema 编解码测试。
- 更新项目状态、TODO 和验证报告。

不包含：

- 组件级 DOM 测试。
- Playwright 视觉回归。
- Vitest/Jest 引入。
- CI workflow 调整。
- 新增或修改 schema 字段。

## 责任边界

当前仓库：

- 提供基础测试入口和公共包公开 API 的回归测试。

外部系统：

- Java 配置平台、H5 业务工程和 npm registry 不需要参与本任务。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无。
- 是否向后兼容：是，仅新增测试脚本和测试文件。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：本地验证。

## 实现计划

1. 新增任务并置为 `ready` 后进入 `in_progress`。
2. 新增 schema/core/adapters 测试文件。
3. 根 `package.json` 增加 `pnpm test`。
4. 运行 `pnpm test`、`pnpm typecheck`、`pnpm build`。
5. 更新任务状态、项目状态、TODO 和测试报告。

## 验收标准

- [x] 根目录存在 `pnpm test` 命令。
- [x] schema 公开 API 基础测试通过。
- [x] core 公开 API 基础测试通过。
- [x] adapters 公开 API 基础测试通过。
- [x] `pnpm test` 通过。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] 项目状态、TODO 和验证报告已更新。

## 验证命令

```bash
pnpm test
pnpm typecheck
pnpm build
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：基础测试、类型检查和构建通过。

## 验证结果

2026-07-31：

- `pnpm test` 通过，Node.js 内置测试共 3 个 suite、11 个用例全部通过。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- 验证报告：`.ai/test-reports/TASK-2026-0731-012-foundation-tests.md`

## 风险和阻塞

- 当前测试使用构建后的 `dist`，因此 `pnpm test` 会先执行 `pnpm build`；运行时间会比纯单测略长，但更接近 npm 包消费形态。
- 组件 UI 和浏览器交互仍未纳入自动化测试，后续可补 Playwright 或轻量 smoke check。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确建立基础单元测试体系。 |
| 2026-07-31 | in_progress | 开始新增根测试脚本和 schema/core/adapters 测试。 |
| 2026-07-31 | verified | `pnpm test`、`pnpm typecheck` 和 `pnpm build` 通过。 |
