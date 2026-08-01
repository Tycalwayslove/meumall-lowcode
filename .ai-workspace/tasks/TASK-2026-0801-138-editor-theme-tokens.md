# TASK-2026-0801-138-editor-theme-tokens

## 标题

沉淀 Vue3 编辑器样式 token 边界

## 状态

verified

## 目标

在不新增 Vue editor npm 包、不改变 Page Schema v1、不影响 H5 runtime 的前提下，为 Vue3 editor playground 新增独立的编辑器主题 token 文件，并让顶栏、基础控件、状态胶囊、弹窗和高频面板优先消费这些 CSS variables，为后续迁入管理台、样式隔离和主题定制预留稳定边界。

## 背景

当前 Vue3 editor playground 已完成主要 shell 组件化、权限能力模型、协作锁和审批状态 provider、自动草稿 provider，但 `styles.css` 中颜色、边框、阴影、圆角、状态色和控件高度仍散落在大量选择器里。后续迁入 Java 管理台或抽 `@meumall/lowcode-editor-vue` 前，需要先把编辑器 UI 控件 token 与 H5 runtime primitives 分开治理，避免管理台样式和 H5 物料样式互相污染。

## 涉及包或系统

- `apps/editor-playground`
- `docs/editor-vue-shell-components.md`
- `.ai/`

## 范围

包含：

- 新增 `apps/editor-playground/src/editor-theme.css`，声明编辑器 shell 专用 CSS variables。
- 在 `main.ts` 中先引入 theme，再引入现有样式。
- 将 `styles.css` 中顶层根样式、基础按钮/输入、顶栏、状态胶囊、基础 toolbar、命令面板、新建页面弹窗、节点右键菜单、左右面板和高频卡片的关键颜色、边框、圆角、阴影切换为 token。
- 更新 Vue shell 组件化文档，说明 editor theme token 与 H5 runtime primitives 分离。
- 更新 AI 状态、TODO、任务验证记录。

不包含：

- 不新增 `@meumall/lowcode-editor-vue`。
- 不抽公开 `@meumall/lowcode-design-tokens` 包。
- 不改变 H5 runtime materials 的 `h5Tokens` 或内部 primitives。
- 不改变 Page Schema v1、Material Manifest v1、renderer、adapters 或发布接口。
- 不做大面积视觉重写、不引入新依赖。

## 责任边界

当前仓库：

- Vue3 editor playground 负责维护管理台编辑器 shell 的 theme token 原型。
- `styles.css` 继续持有具体布局和组件样式，但高频基础变量优先来自 `editor-theme.css`。
- H5 runtime materials 继续使用 materials 包内部 `h5Tokens`，不引用 editor theme。

外部系统：

- Java 管理台未来可覆盖 `.meumall-lowcode-editor-theme` 或 `:root` 下的编辑器 token。
- H5 业务仓库不消费 editor theme token。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无新增契约。
- 是否向后兼容：是，只调整 editor playground 样式组织。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`docs/editor-vue-shell-components.md`。
- 需要确认的角色：前端编辑器维护者、未来管理台接入方。
- 当前确认状态：本地架构约束，无需外部确认。

## 验收标准

- [x] 新增独立 editor theme token CSS 文件。
- [x] `main.ts` 明确先加载 theme，再加载组件样式。
- [x] 顶栏、基础按钮/输入、状态胶囊、弹窗、面板和高频卡片至少一批样式消费 token。
- [x] 文档说明 editor theme token 与 H5 runtime primitives/h5Tokens 的边界。
- [x] 不新增 npm 包、不新增依赖、不改变 schema 或 renderer。
- [x] `pnpm --filter @meumall/lowcode-editor-playground typecheck` 通过。
- [x] `pnpm --filter @meumall/lowcode-editor-playground build` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm --filter @meumall/lowcode-editor-playground typecheck
pnpm --filter @meumall/lowcode-editor-playground build
pnpm smoke:browser
git diff --check
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否。
- 是否影响 npm 发布：不影响公开包 API。
- 是否影响 Java 配置平台：否。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证编辑器和 H5 runtime 关键路径不受样式 token 改造影响。

## 风险和阻塞

- 本任务只做首批高频 token 替换，`styles.css` 中仍会保留部分硬编码颜色，后续可继续分批治理。
- 视觉变化需要通过浏览器 smoke 和人工查看继续迭代。

## 验证结果

2026-08-01：

- `pnpm --filter @meumall/lowcode-editor-playground typecheck` 通过。
- `pnpm --filter @meumall/lowcode-editor-playground build` 通过。
- `pnpm smoke:browser` 通过，覆盖 Vue3 编辑器主路径、workflow provider、发布审批、编辑器内置 runtime、React H5 runtime、HTTP config platform client、fallback、empty 和 broken demo。
- `git diff --check` 通过。
- 验证报告：`.ai/test-reports/TASK-2026-0801-138-editor-theme-tokens.md`

## 剩余风险

- 本任务只完成首批高频样式 token 接入，`styles.css` 中仍有部分组件级硬编码颜色、边框和状态样式，后续需要按组件继续分批收口。
- 当前 theme token 仍是 editor playground 内部原型，不作为公开 npm API。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Vue3 editor playground 样式 token 边界和首批样式接入。 |
| 2026-08-01 | in_progress | 新增 `editor-theme.css`，并让顶栏、基础控件、状态胶囊、弹窗、面板和高频卡片消费 theme token。 |
| 2026-08-01 | verified | 完成文档、AI 事实源和验证记录，编辑器 typecheck/build、browser smoke 与 diff check 均通过。 |
