# TASK-2026-0731-035-resource-adapter

## 状态

verified

## 目标

为 Vue3 编辑器 playground 的素材库和商品选择器抽象 `Resource Library Adapter`，把当前写死在 `App.vue` 的 mock 素材/商品查询改成可替换 client，为后续接入真实素材中心、商品中心、优惠券中心、门店/达人中心打基础。

## 背景

当前编辑器右侧属性区已经提供 mock 素材库和商品选择器，运营可以搜索图片素材、选择商品并写入静态 props。但数据数组和过滤逻辑直接写在 `apps/editor-playground/src/App.vue` 中，后续接真实 Java 管理台或资源中心时会被迫改 UI 组件内部逻辑。

本任务先在 `@meumall/lowcode-adapters` 中沉淀通用资源查询接口和本地 mock 实现，再让 editor playground 通过 adapter 查询素材和商品。真实 HTTP client、鉴权、分页、审核等复杂能力后续另行接入。

## 涉及包或系统

- `@meumall/lowcode-adapters`
- `apps/editor-playground`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- 在 `packages/adapters` 定义 `LowcodeResourceLibraryClient`。
- 定义图片素材、商品资源、查询条件和查询结果类型。
- 提供 `createStaticResourceLibraryClient`，支持本地数组搜索、分类过滤、标签/标题/ID 匹配。
- 为 adapters 增加资源查询单元测试。
- 将 Vue3 编辑器 playground 的素材库和商品选择器改为使用 resource client。
- 更新 adapters README、任务、项目状态、上下文、TODO 和验证记录。

不包含：

- 不接真实 Java HTTP API。
- 不实现鉴权、分页、审核流、资源上下架和权限。
- 不新增 schema 字段。
- 不修改 renderer、materials 或 editor 包公开 API。
- 不实现优惠券、门店、达人资源中心 UI。

## 责任边界

当前仓库：

- 维护资源查询前端 adapter、静态 mock 实现、编辑器接入和验证记录。

外部系统：

- Java 配置平台或资源中心后续提供真实 HTTP API、鉴权、分页、审核和资源权限。
- H5 runtime 不消费编辑器资源库查询逻辑。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 `@meumall/lowcode-adapters` 资源库公开接口。
- 契约文档路径：本任务文件和 `packages/adapters/README.md`。
- 是否向后兼容：是，新增导出，不改变现有 API。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要，先写入 `packages/adapters/README.md`。
- 对接说明路径：`packages/adapters/README.md`。
- 需要确认的角色：Java 配置平台负责人、素材中心负责人、商品中心负责人。
- 当前确认状态：前端先行抽象，待外部系统确认真实 API。

## 实现计划

1. 在 `packages/adapters/src/index.ts` 增加资源库类型和 `createStaticResourceLibraryClient`。
2. 增加 adapters 单元测试覆盖素材分类、关键词搜索、商品搜索和 limit。
3. 更新 `packages/adapters/README.md`。
4. 将 `apps/editor-playground/src/App.vue` 的素材/商品搜索改为通过 resource client。
5. 运行类型检查、构建、测试和 dev server smoke check。
6. 更新 AI 状态和验证记录。

## 验收标准

- [x] `@meumall/lowcode-adapters` 导出资源库 client 类型和静态实现。
- [x] 静态资源 client 可按素材分类、标题、标签、ID 搜索素材。
- [x] 静态资源 client 可按商品标题、ID、说明搜索商品。
- [x] 静态资源 client 支持 limit。
- [x] Vue3 编辑器 playground 的素材库和商品选择器通过 resource client 获取数据。
- [x] `packages/adapters/README.md` 已说明 Resource Library Client。
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
- 发布对象：后续发布 `@meumall/lowcode-adapters` 时包含新增资源库 API。
- 是否需要 changeset：正式 npm 发布前需要，本任务先不创建版本发布。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可恢复编辑器内置 mock 查询。
- smoke check：编辑器和 H5 runtime dev server 返回 HTTP 200，自动化命令通过。

## 风险和阻塞

- 当前只定义前端 adapter 形态，真实 Java API 仍待外部系统确认。
- 当前只迁移图片素材和商品资源，优惠券、门店、达人资源中心 UI 后续继续扩展。

## 验证结果

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，27 个测试全部通过。
- `curl -I http://127.0.0.1:5173/` 返回 HTTP 200。
- `curl -I http://127.0.0.1:5174/` 返回 HTTP 200。
- 本次临时启动的 editor dev server 因 5173/5174 已被占用自动落到 5176，`curl -I http://127.0.0.1:5176/` 返回 HTTP 200。
- 本次临时启动的 H5 runtime dev server 因 5174 已被占用自动落到 5175，`curl -I http://127.0.0.1:5175/` 返回 HTTP 200。
- 未验证项：未接真实 Java HTTP API、鉴权、分页、审核和资源权限，原因是外部系统接口尚未确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建资源库 adapter 任务。 |
| 2026-07-31 | in_progress | 开始实现 adapters 资源库接口、静态实现和 editor playground 接入。 |
| 2026-07-31 | verified | 完成资源库 adapter、Vue3 编辑器接入、文档和验证记录。 |
