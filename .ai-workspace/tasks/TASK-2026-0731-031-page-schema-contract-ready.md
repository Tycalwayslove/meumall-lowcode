# TASK-2026-0731-031-page-schema-contract-ready

## 状态

verified

## 目标

将 `Page Schema v1` 从 draft 推进到 ready 契约，明确页面 schema 在编辑器、renderer、Java 配置平台、H5 runtime 和未来小程序 runtime 之间的字段语义、校验口径、兼容规则和变更流程。

## 背景

当前 `packages/schema` 已经实现 `LowcodePageSchema`、默认值标准化、递归节点校验、action 引用校验和版本兼容判断，编辑器、Vue/React H5 renderer、配置平台 mock client 和 H5 runtime loader 也都围绕该 schema 工作。但 `.ai-workspace/contracts/page-schema-v1.md` 仍处于 draft，只描述了核心结构，缺少完整字段语义、生产/预览状态边界、跨系统责任划分和服务端校验建议。

后续如果要发布 npm、接入 Java 配置平台、迁移到真实管理后台或扩展小程序 renderer，Page Schema 必须先成为团队可执行的正式契约。

## 涉及包或系统

- `@meumall/lowcode-schema`
- `@meumall/lowcode-editor`
- `@meumall/lowcode-core`
- `@meumall/lowcode-renderer-h5`
- `@meumall/lowcode-renderer-vue-h5`
- `@meumall/lowcode-adapters`
- Java 配置平台
- H5 runtime 接入方
- 未来小程序 renderer/materials
- `.ai-workspace`
- `.ai`

## 范围

包含：

- 更新 `.ai-workspace/contracts/page-schema-v1.md`，状态从 draft 改为 ready。
- 补充 Page Schema v1 的字段语义、生命周期、校验规则、兼容性、跨系统责任和回滚策略。
- 更新 `packages/schema/README.md`，标注 Page Schema v1 和 Material Manifest v1 的契约状态。
- 补充 schema 单元测试，覆盖 Page Schema v1 默认值、版本兼容和错误边界。
- 更新任务、项目状态、上下文、TODO 和验证记录。

不包含：

- 不修改 `LowcodePageSchema` 的字段结构。
- 不修改编辑器、renderer 或 adapters 的运行时行为。
- 不接入真实 Java HTTP API。
- 不发布 npm 包或 GitHub release。

## 责任边界

当前仓库：

- 维护 Page Schema 类型、校验函数、默认值标准化、跨包消费实现、契约文档和验证记录。

外部系统：

- Java 配置平台后续按本契约存储、校验、预览、发布、回滚和审计页面 schema。
- H5 宿主后续按本契约加载 published schema，注册物料、数据源 handler、action handler 和埋点降级。
- 小程序 runtime 后续只消费声明支持 `miniapp` 的 schema 和物料。

## 契约影响

- 是否影响跨包或跨系统契约：是，Page Schema v1 从草案升级为 ready 契约。
- 契约文档路径：`.ai-workspace/contracts/page-schema-v1.md`。
- 是否向后兼容：是，本任务只文档化当前实现和校验口径，不改变字段结构。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：契约文档本身即为对接说明。
- 对接说明路径：`.ai-workspace/contracts/page-schema-v1.md`。
- 需要确认的角色：Java 配置平台负责人、H5 runtime 接入负责人、后续小程序 runtime 负责人。
- 当前确认状态：待外部系统确认。

## 实现计划

1. 根据 `packages/schema/src/index.ts` 和现有跨包用法重写 Page Schema v1 契约。
2. 更新 schema README 的契约状态说明。
3. 补充 schema 单元测试，覆盖默认值和错误边界。
4. 运行类型检查、构建、测试和 dev server smoke check。
5. 更新 AI 任务、项目状态、上下文、TODO 和测试报告。

## 验收标准

- [x] `.ai-workspace/contracts/page-schema-v1.md` 状态为 ready，并覆盖字段语义、生命周期、校验规则、兼容性、测试方式、变更流程和回滚方式。
- [x] `packages/schema/README.md` 已标注 Page Schema v1 ready。
- [x] schema 单元测试覆盖 Page Schema v1 默认值、兼容版本和非法枚举/引用错误。
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
- 发布对象：后续发布 `@meumall/lowcode-schema` 时应同步引用 Page Schema v1 ready 契约。
- 是否需要 changeset：正式 npm 发布前需要，本任务先不创建版本发布。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可恢复 Page Schema 契约文档状态和测试变更。
- smoke check：编辑器和 H5 runtime dev server 返回 HTTP 200，自动化命令通过。

## 风险和阻塞

- 当前 ready 契约按前端 monorepo 已实现能力沉淀；Java 配置平台确认后仍可能补充响应包装、鉴权、审批、服务端发布校验和审计字段。
- 当前 schema validator 只校验结构和引用关系，不校验所有业务字段值域；业务字段值域应由物料 manifest、编辑器 setter 和服务端发布校验共同约束。

## 验证结果

验证日期：2026-07-31

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，4 个 suites、26 条 tests 全部通过。
- `curl -I http://127.0.0.1:5173/`：HTTP 200。
- `curl -I http://127.0.0.1:5174/`：HTTP 200。

验证报告：`.ai/test-reports/TASK-2026-0731-031-page-schema-contract-ready.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建 Page Schema v1 ready 契约任务。 |
| 2026-07-31 | in_progress | 开始更新契约文档、README、schema 测试和 AI 状态记录。 |
| 2026-07-31 | verified | 完成 Page Schema v1 ready 契约、README、schema 测试和验证记录。 |
