# TASK-2026-0731-036-template-library-adapter

## 状态

verified

## 目标

为 Vue3 编辑器 playground 的页面模板入口抽象 `Template Library Adapter`，把左侧模板列表从直接消费本地数组改为通过可替换 client 查询，为后续 Java 配置平台模板市场、模板上下架、分类、权限和版本管理打基础。

## 背景

当前编辑器左侧已经有本地页面模板库，运营可以一键载入大促活动页、新人券领取页和商品专题页。但模板列表、模板筛选和应用入口直接依赖 `apps/editor-playground/src/pageTemplates.ts` 的静态数组。后续迁到管理系统并接入 Java 配置平台模板市场时，UI 内部会被迫修改查询逻辑。

本任务先在 `@meumall/lowcode-adapters` 中沉淀编辑器侧模板库 client、模板资源类型、查询条件和静态实现，再让 Vue3 编辑器 playground 通过 client 获取模板列表。真实 HTTP client、权限、上下架审核、模板版本和缩略图生成后续另行接入。

## 涉及包或系统

- `@meumall/lowcode-adapters`
- `apps/editor-playground`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- 在 `packages/adapters` 定义 `LowcodeTemplateLibraryClient`。
- 定义页面模板资源、查询条件和查询结果类型。
- 提供 `createStaticTemplateLibraryClient`，支持本地数组搜索、分类过滤、状态过滤、标签/标题/ID 匹配和 limit。
- 为 adapters 增加模板查询单元测试。
- 将 Vue3 编辑器 playground 的模板列表改为通过 template client 获取数据。
- 增加模板搜索、分类过滤、加载/空状态和静态 template clone 工具。
- 更新 adapters README、任务、项目状态、上下文、TODO 和验证记录。

不包含：

- 不接真实 Java HTTP API。
- 不实现模板权限、上下架审核、版本 diff、模板缩略图生成和模板发布流程。
- 不新增 schema 字段。
- 不修改 renderer、materials 或 editor 包公开 API。
- 不改变现有模板 schema 内容。

## 责任边界

当前仓库：

- 维护模板查询前端 adapter、静态 mock 实现、编辑器接入和验证记录。

外部系统：

- Java 配置平台后续提供真实模板市场 HTTP API、鉴权、权限、上下架、版本管理和审计。
- H5 runtime 不消费编辑器模板库查询逻辑。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 `@meumall/lowcode-adapters` 模板库公开接口。
- 契约文档路径：本任务文件和 `packages/adapters/README.md`。
- 是否向后兼容：是，新增导出，不改变现有 API。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要，先写入 `packages/adapters/README.md`。
- 对接说明路径：`packages/adapters/README.md`。
- 需要确认的角色：Java 配置平台负责人、运营模板市场负责人。
- 当前确认状态：前端先行抽象，待外部系统确认真实 API。

## 实现计划

1. 在 `packages/adapters/src/index.ts` 增加模板库类型和 `createStaticTemplateLibraryClient`。
2. 增加 adapters 单元测试覆盖模板分类、关键词搜索、状态过滤和 limit。
3. 更新 `packages/adapters/README.md`。
4. 将 `apps/editor-playground/src/pageTemplates.ts` 的模板类型与 clone 工具对齐 adapter 类型。
5. 将 `apps/editor-playground/src/App.vue` 的模板列表改为通过 template client 查询，并补充搜索、分类、加载和空状态。
6. 运行类型检查、构建、测试和 dev server smoke check。
7. 更新 AI 状态和验证记录。

## 验收标准

- [x] `@meumall/lowcode-adapters` 导出模板库 client 类型和静态实现。
- [x] 静态模板 client 可按模板分类、标题、标签、ID 搜索模板。
- [x] 静态模板 client 支持状态过滤和 limit。
- [x] Vue3 编辑器 playground 的模板列表通过 template client 获取数据。
- [x] Vue3 编辑器 playground 支持模板搜索、分类过滤、加载态和空状态。
- [x] 点击模板仍能替换当前 schema 并选中首个节点。
- [x] `packages/adapters/README.md` 已说明 Template Library Client。
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
- 发布对象：后续发布 `@meumall/lowcode-adapters` 时包含新增模板库 API。
- 是否影响 schema 兼容性：否。
- 是否影响 H5 接入：否。
- 是否需要 changeset：正式 npm 发布前需要，本任务先不创建版本发布。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可恢复编辑器直接读取本地模板数组。
- smoke check：编辑器和 H5 runtime dev server 返回 HTTP 200，自动化命令通过。

## 风险和阻塞

- 当前只定义前端 adapter 形态，真实 Java 模板市场 API 仍待外部系统确认。
- 当前模板数据仍在本地静态文件中，尚未接入真实模板权限、上下架和版本治理。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，28 个测试全部通过。
- `curl -I http://127.0.0.1:5173/` 返回 HTTP 200。
- `curl -I http://127.0.0.1:5174/` 返回 HTTP 200。
- 本次临时启动的 editor dev server 因 5173/5174/5175 已被占用自动落到 5176，`curl -I http://127.0.0.1:5176/` 返回 HTTP 200。
- 本次临时启动的 H5 runtime dev server 因 5174 已被占用自动落到 5175，`curl -I http://127.0.0.1:5175/` 返回 HTTP 200。
- 未验证项：未接真实 Java 模板市场 HTTP API、鉴权、权限、上下架、版本 diff 和模板缩略图生成，原因是外部系统接口尚未确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建模板库 adapter 任务。 |
| 2026-07-31 | in_progress | 开始实现 adapters 模板库接口、静态实现和 editor playground 接入。 |
| 2026-07-31 | verified | 完成模板库 adapter、Vue3 编辑器模板筛选、文档和验证记录。 |
