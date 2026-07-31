# TASK-2026-0801-083-editor-page-start-api

## 标题

沉淀编辑器页面起步 API

## 状态

verified

## 目标

将 Vue3 editor playground 中的新建空白 H5 页面、模板 schema 克隆和页面起步 editor state 组装逻辑沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台或其他编辑器壳可以复用同一页面生命周期命令。

## 背景

当前 Vue3 playground 已支持新建页面向导、空白画布起步引导和模板起点，但空白 schema 默认值、模板 schema 深拷贝和应用模板后的 editor state 组装仍写在 `apps/editor-playground/src/App.vue` 与 `pageTemplates.ts`。这些逻辑不依赖 Vue，也不属于 renderer，应下沉到 editor 包，减少未来管理台迁移时的重复实现。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `apps/editor-playground/src/pageTemplates.ts`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 增加空白 H5 Page Schema 创建 API。
- 在 `@meumall/lowcode-editor` 增加 Page Schema 深拷贝 API。
- 在 `@meumall/lowcode-editor` 增加页面起步 editor state 组装 API。
- Vue3 editor playground 的新建空白页、重置示例页和应用模板改为复用 editor API。
- 删除 playground 模板文件中的本地 schema clone 重复实现。
- 补充 editor 单测覆盖空白页默认值、模板克隆隔离和页面起步 state。
- 更新 editor README 和项目事实源。

不包含：

- 不修改 Page Schema v1 字段。
- 不修改 Template Library Client 协议。
- 不接入真实 Java 草稿创建接口。
- 不改变新建页面向导 UI。
- 不新增 npm 版本和 changeset。

## 责任边界

当前仓库：

- `packages/editor` 提供框架无关页面起步 API。
- `apps/editor-playground` 负责 confirm、localStorage、消息提示、弹窗关闭和本地版本刷新。

外部系统：

- Java 配置平台后续可替换页面保存和模板获取，但本任务不实现 Java 服务端。
- `hybird-meumall` 不受本任务影响。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增 `@meumall/lowcode-editor` 公开 API，但不改变既有 API。
- 契约文档路径：`packages/editor/README.md`。
- 是否向后兼容：是，新增导出。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是，更新 `packages/editor/README.md`。
- 对接说明路径：`packages/editor/README.md`。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 新增 editor 空白页、schema clone 和页面起步 state API。
2. Vue3 playground 删除本地重复逻辑，调用 editor API。
3. 为 editor API 添加单元测试。
4. 更新 README 和 `.ai` 项目事实源。
5. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出空白 H5 Page Schema 创建 API。
- [x] `@meumall/lowcode-editor` 导出 Page Schema 深拷贝 API。
- [x] `@meumall/lowcode-editor` 导出页面起步 editor state API。
- [x] Vue3 editor playground 新建空白页面复用 editor API。
- [x] Vue3 editor playground 应用模板和重置示例页复用 editor API。
- [x] editor 单测覆盖空白页默认值、模板克隆隔离和页面起步 state。
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
- 是否影响 H5 接入：否。
- 是否影响 npm 发布：新增 editor 包 API，未来真实 npm 发布时应作为 patch/minor 变更评估；本任务不执行发布。
- 回滚目标：回滚本任务提交。
- smoke check：本任务只改 editor core 和 playground 复用，可用 `pnpm smoke:browser` 验证新建页面向导、模板应用和重置链路仍可用。

## 风险和阻塞

- 当前空白页默认 operator 仍是 playground/local mock 口径，后续接 Java 管理台时应由登录用户或服务端填充。
- 当前页面起步 API 不处理 confirm、草稿持久化、权限和服务端审计，这些仍属于宿主 UI 或 Java 配置平台职责。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 页面起步 API。 |
| 2026-08-01 | in_progress | 开始沉淀空白页创建、schema clone 和页面起步 state API，并改造 playground 复用。 |
| 2026-08-01 | verified | 完成 editor page start API、Vue3 playground 复用、editor 单测和文档事实源更新；`pnpm typecheck`、`pnpm build`、`pnpm test`、`pnpm check:architecture`、`pnpm smoke:browser`、`pnpm pack:dry-run` 均通过。 |
