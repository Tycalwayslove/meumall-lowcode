# TASK-2026-0731-002-schema-editor-foundation

## 状态

verified

## 目标

落地第一批具体代码：补强 Page Schema v1 基础协议和编辑器交互状态内核，为后续运营编辑器 UI、H5 渲染接入和 Java 配置平台对接打基础。

## 背景

当前仓库已有 monorepo、schema/core/renderer/materials/editor/adapters 初始骨架，但 schema 校验较轻，editor 只有根节点追加、移动、删除能力。下一步需要把低代码平台从“骨架”推进到“可持续实现”的阶段。

## 涉及包或系统

- `@meumall/lowcode-schema`
- `@meumall/lowcode-editor`
- `.ai-workspace/contracts`
- `.ai`
- GitHub 远端

## 范围

包含：

- 配置 GitHub 远端并推送当前 `main`。
- 增强 schema v1 类型、工厂、标准化和校验能力。
- 增强 editor 纯状态交互：模式、视口、选择、插入、更新、复制、移动、删除、undo/redo。
- 新增 Page Schema v1 和 Editor Interaction Model v1 契约文档。
- 更新项目状态和 TODO。

不包含：

- 实现可视化编辑器 UI。
- 实现 Java 配置平台 API。
- 接入 `hybird-meumall`。
- 发布 npm 包。

## 责任边界

当前仓库：

- 提供 schema/editor 可复用代码和契约文档。

外部系统：

- GitHub 只作为远端留存。
- Java 配置平台和 H5 消费方后续按契约接入。

## 契约影响

- 是否影响跨包或跨系统契约：是。
- 契约文档路径：`.ai-workspace/contracts/page-schema-v1.md`、`.ai-workspace/contracts/editor-interaction-model-v1.md`
- 是否向后兼容：是，新增字段均为可选或新增方法。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：GitHub 管理员 / 后续 Java 配置平台和 H5 接入方。
- 当前确认状态：GitHub 远端已确认；Java/H5 后续确认。

## 实现计划

1. 推送当前 `main` 到 GitHub 远端。
2. 增强 schema v1 类型与校验。
3. 增强 editor headless command。
4. 补充契约和 README。
5. 运行验证并更新任务状态。

## 验收标准

- [x] GitHub 远端 `origin` 指向 `git@github.com:Tycalwayslove/meumall-lowcode.git`，并已推送 `main`。
- [x] schema 支持递归节点校验、唯一 ID 校验、action/dataSource 重复 ID 校验和 manifest 校验。
- [x] editor 支持节点插入、更新、复制、移动、删除、选择、模式/视口切换和 undo/redo。
- [x] 新增契约文档说明 Page Schema v1 和编辑器交互模型。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm -r --filter './packages/*' exec npm pack --dry-run
```

## 验证结果

2026-07-31：

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- npm pack dry-run 通过。
- 验证报告：`.ai/test-reports/TASK-2026-0731-002-schema-editor-foundation.md`

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本次提交。
- smoke check：类型检查和构建通过，GitHub main 可推送。

## 风险和阻塞

- 尚未建立单元测试框架，当前先以类型检查和构建作为最低验证。
- npm registry/token 尚未确认，暂不发布 npm。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确先落地 schema/editor 第一批基础代码。 |
| 2026-07-31 | in_progress | 开始实现并推送远端。 |
| 2026-07-31 | verified | schema/editor 基础代码和契约完成，验证通过。 |
