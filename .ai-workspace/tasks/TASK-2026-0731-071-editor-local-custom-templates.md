# TASK-2026-0731-071-editor-local-custom-templates

## 标题

增强 Vue3 编辑器本地自定义模板

## 状态

verified

## 目标

在不改变 Page Schema v1、Template Library Client 公开 API 和 npm 包公开 API 的前提下，为 Vue3 编辑器 playground 增加“保存当前页面为本地模板”的能力，让运营可以把已搭好的页面复用为新页面起点。

## 背景

当前编辑器已具备静态页面模板库、模板搜索筛选、模板摘要、模板视觉预览、模板 H5 预览和新建页面向导。实际运营搭建活动页时，经常会把某次活动页面沉淀为后续活动模板。后续真实形态会接 Java 模板市场，本任务先在 playground 通过 localStorage 实现本地自定义模板闭环，验证交互和数据形态。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

包含：

- 增加保存当前 Page Schema 为本地自定义模板的入口。
- 本地自定义模板持久化到 localStorage，并与静态模板一起参与模板搜索、分类筛选、模板卡片摘要、视觉缩略预览和新建页面向导。
- 自定义模板可使用现有模板 H5 预览入口，不替换当前画布。
- 自定义模板可应用到当前画布，并保持既有未保存草稿确认逻辑。
- 快捷命令面板增加保存为模板命令。
- browser smoke 覆盖保存自定义模板、模板列表可见、模板 H5 预览和应用到画布。
- 更新任务记录和 `.ai` 项目事实源。

不包含：

- 不改变 `@meumall/lowcode-adapters` 的 `LowcodeTemplateLibraryClient` 公开接口。
- 不接入真实 Java 模板市场。
- 不实现模板编辑、删除、上下架、权限或审核。
- 不新增 Page Schema 字段。
- 不新增 npm 公开 API。

## 责任边界

当前仓库：

- 编辑器 playground 负责本地模板保存、读取、列表合并和交互验证。
- 静态 Template Library Client 仍作为远期 Java 模板市场替换边界。
- browser smoke 负责验证核心流程。

外部系统：

- Java 配置平台、模板市场、H5 业务仓库无需变更。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无新增；仍遵循 `.ai-workspace/contracts/page-schema-v1.md`。
- 是否向后兼容：是。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 将任务状态流转为 `in_progress`。
2. 梳理当前模板列表、新建页面向导、命令面板和 smoke 流程。
3. 实现本地自定义模板持久化和模板列表合并。
4. 增加保存为模板入口和快捷命令。
5. 补充 browser smoke 和 `.ai` 状态记录。
6. 运行验证命令并记录结果。

## 验收标准

- [x] 编辑器可从明确入口将当前页面保存为本地自定义模板。
- [x] 本地自定义模板持久化到 localStorage，刷新前后可被模板列表读取。
- [x] 本地自定义模板参与模板搜索、模板卡片摘要和视觉缩略预览。
- [x] 新建页面向导中可选择本地自定义模板作为起点。
- [x] 本地自定义模板可打开 H5 预览且不替换当前画布。
- [x] 本地自定义模板可应用到画布。
- [x] 快捷命令面板可触发保存为模板。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。

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
- 回滚目标：回滚本任务提交。
- smoke check：使用 `pnpm smoke:browser` 验证编辑器、内置 runtime 和 React H5 runtime。

## 风险和阻塞

- 本地模板只是 playground 原型，不应被记录成 Java 模板市场正式契约。
- 保存当前 schema 为模板时需要深拷贝，避免后续编辑污染已保存模板。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建任务，范围限定为 Vue3 编辑器 playground 本地自定义模板。 |
| 2026-07-31 | in_progress | 开始梳理模板列表、新建页面向导、快捷命令和 browser smoke 流程。 |
| 2026-07-31 | verified | 完成本地自定义模板保存、列表合并、H5 预览、应用和新建页面向导接入，验证命令通过。 |
