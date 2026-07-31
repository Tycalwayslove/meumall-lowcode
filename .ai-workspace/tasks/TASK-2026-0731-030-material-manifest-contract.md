# TASK-2026-0731-030-material-manifest-contract

## 状态

verified

## 目标

定义 `Material Manifest v1` 契约文档，明确物料如何向编辑器、renderer、Java 配置平台、H5 runtime 和未来小程序 runtime 描述自身能力，让物料库继续扩展时有稳定协议可依赖。

## 背景

当前物料库已经包含基础物料和多种活动页高阶物料，编辑器通过 manifest 自动生成物料区、属性面板、数据源绑定和事件绑定。但 `Material Manifest v1` 仍停留在 TypeScript 类型和现有实现中，没有独立契约文档。后续物料发布 npm、Java 配置平台接入、H5 消费和小程序扩展都需要明确字段语义、兼容性规则、校验口径和变更流程。

## 涉及包或系统

- `@meumall/lowcode-schema`
- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `.ai-workspace/contracts`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- 新增 `.ai-workspace/contracts/material-manifest-v1.md`。
- 更新 `.ai-workspace/contracts/README.md`，将 Material Manifest v1 纳入正式契约入口。
- 更新 `packages/schema/README.md`，引用 Material Manifest v1 契约。
- 扩展物料测试，校验 React/Vue H5 当前所有 manifest 均满足 schema 包的 manifest 校验。
- 更新任务、项目状态、上下文和验证记录。

不包含：

- 不新增或修改 Manifest 字段结构。
- 不修改 Page Schema v1。
- 不修改编辑器、renderer 或物料运行时行为。
- 不发布 npm 包或创建 GitHub release。

## 责任边界

当前仓库：

- 维护 Manifest 类型、校验函数、物料 manifest 实现、契约文档和验证记录。

外部系统：

- Java 配置平台后续需要按该契约维护物料白名单、属性配置 UI、数据源/动作白名单和发布前校验。
- H5 宿主后续需要按该契约注册物料、数据源 handler 和 action handler。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增正式 Material Manifest v1 契约文档。
- 契约文档路径：`.ai-workspace/contracts/material-manifest-v1.md`。
- 是否向后兼容：是，本任务只文档化当前实现，不改变现有字段语义。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：契约文档本身即为对接说明。
- 对接说明路径：`.ai-workspace/contracts/material-manifest-v1.md`。
- 需要确认的角色：Java 配置平台负责人、H5 runtime 接入负责人。
- 当前确认状态：待外部系统确认。

## 实现计划

1. 根据 `packages/schema/src/index.ts` 和现有物料实现编写 Material Manifest v1 契约。
2. 更新 contracts README 和 schema README。
3. 扩展物料 manifest 测试，覆盖 React/Vue H5 manifest 基础校验。
4. 运行类型检查、构建、测试和 dev server smoke check。
5. 更新 AI 任务、项目状态和测试报告。

## 验收标准

- [x] `.ai-workspace/contracts/material-manifest-v1.md` 存在并覆盖提供方、消费方、字段语义、兼容性、测试方式、变更流程和回滚方式。
- [x] `.ai-workspace/contracts/README.md` 已将 `material-manifest-v1.md` 纳入正式契约入口。
- [x] `packages/schema/README.md` 已引用 Material Manifest v1。
- [x] React/Vue H5 当前所有 manifest 均通过 `validateLowcodeMaterialManifest` 校验。
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
- 发布对象：后续发布 `@meumall/lowcode-schema` 和物料包时应随 npm 文档一起引用该契约。
- 是否需要 changeset：正式 npm 发布前需要，本任务先不创建版本发布。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可移除契约文档和测试增强。
- smoke check：编辑器和 H5 runtime dev server 返回 HTTP 200，自动化命令通过。

## 风险和阻塞

- 当前契约文档按已有 TypeScript 类型和实现沉淀，Java 配置平台确认后可能需要补充更严格的服务端校验字段。
- 当前 Manifest 暂未提供复杂数组 item schema，编辑器仍使用通用列表项字段模板。

## 验证结果

验证日期：2026-07-31

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，4 个 suites、25 条 tests 全部通过。
- `curl -I http://127.0.0.1:5173/`：HTTP 200。
- `curl -I http://127.0.0.1:5174/`：HTTP 200。

验证报告：`.ai/test-reports/TASK-2026-0731-030-material-manifest-contract.md`。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建 Material Manifest v1 契约任务。 |
| 2026-07-31 | in_progress | 开始编写契约文档、README 入口和 manifest 校验测试。 |
| 2026-07-31 | verified | 完成 Material Manifest v1 契约文档、入口引用、manifest 校验测试和验证记录。 |
