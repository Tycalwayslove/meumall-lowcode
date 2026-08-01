# TASK-2026-0801-194-editor-material-insert-presets

## 状态

verified

## 目标

为 `@meumall/lowcode-editor` 增加框架无关的物料插入预设 API，并在 Vue3 编辑器物料面板提供基础物料常用变体的一键插入能力，让运营从拖默认物料进一步升级到选择“主按钮、描边按钮、手机号输入、标题文本、轮播横幅”等可直接使用的基础物料配置。

## 背景

当前编辑器已具备物料搜索、分类、分层总览、详情预览、拖拽插入和属性编辑能力，但添加物料时默认只使用 manifest 的 `defaultProps`。运营实际搭页面时常需要同一个基础物料的常见变体，例如主按钮/描边按钮、手机号输入/邮箱输入、标题/正文、活动头图/普通横幅。如果每次都先添加默认节点再去属性面板手动改，实操效率仍然偏低。本任务把常用变体沉淀为 editor 纯 helper，并让 Vue3 playground 消费。

## 涉及包或系统

- `@meumall/lowcode-editor`
- `apps/editor-playground`
- 文档与 AI 工作流

## 范围

包含：

- 在 editor 包新增物料插入预设类型、默认预设表、预设列表 helper 和按预设生成节点 input 的 helper。
- 预设只覆盖节点 `props` 与 `meta.name`，保持原有 dataBinding 推导、materialVersion 和 componentName。
- Vue3 物料目录展示每个物料的常用预设快捷按钮，并通过现有添加链路插入。
- 补充单元测试、browser smoke、README、changeset、项目状态和任务验证记录。

不包含：

- 不修改 Page Schema v1 字段结构。
- 不修改 Material Manifest v1 字段结构。
- 不修改 React/Vue H5 renderer 行为。
- 不新增新的 H5 物料或 runtime primitives。
- 不接入 Java 物料中心远程预设配置。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 提供框架无关预设模型和节点 input 生成。
- `apps/editor-playground` 提供预设展示、点击插入、反馈和 smoke 验证。

外部系统：

- Java 配置平台未来可通过 editor API 或覆盖配置提供远程预设；本任务不实现服务端配置。

## 契约影响

- 是否影响跨包或跨系统契约：影响 `@meumall/lowcode-editor` npm 公开 API，不影响 schema、renderer 或 material manifest 契约。
- 契约文档路径：`packages/editor/README.md`
- 是否向后兼容：是，新增 API 和 UI 功能。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要。
- 对接说明路径：`packages/editor/README.md`、`.ai/AI_CONTEXT.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 新增 editor 物料预设类型、默认预设表、列表 helper 和节点 input helper。
2. 在 Vue3 `EditorMaterialCatalog` 展示预设快捷按钮并接入现有添加链路。
3. 补测试、browser smoke、README、changeset 和 AI 状态记录。

## 验收标准

- [x] editor API 能为现有基础物料返回常用预设，并允许宿主覆盖或禁用默认预设。
- [x] 使用预设生成节点 input 时保留 manifest 默认 props，再叠加预设 props 和 meta 名称。
- [x] Vue3 编辑器物料面板可一键插入基础物料预设，画布和源码能反映预设 props。
- [x] 不改变 schema、renderer、materials manifest 结构或包依赖方向。
- [x] 验证命令通过，并在任务文件记录结果。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
pnpm pack:dry-run
git diff --check
```

## 发布影响

- 是否需要发布：后续需要随 npm minor 发布。
- 发布对象：`@meumall/lowcode-editor`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不创建 tag/release。
- 回滚目标：回滚本任务提交即可，旧 schema 和 runtime 渲染不受影响。
- smoke check：`pnpm smoke:browser` 覆盖预设按钮展示和预设插入结果。

## 风险和阻塞

- 风险：默认预设是 editor 内置经验值，未来远程物料中心应支持按项目覆盖预设列表。
- 阻塞：无。

## 实现结果

- `@meumall/lowcode-editor` 新增 `LOWCODE_EDITOR_MATERIAL_INSERT_PRESETS`、`createLowcodeMaterialInsertPresets`、`findLowcodeMaterialInsertPreset` 和 `createLowcodeMaterialNodeInputFromPreset`。
- Vue3 物料目录卡片展示常用预设快捷按钮，并通过现有物料添加、最近使用和审计链路插入。
- Vue3 快捷命令面板新增“物料预设”命令，可搜索并添加常用变体。
- README、changeset、项目状态、AI 上下文和 TODO 已同步。

## 验证结果

| 命令 | 结果 |
| --- | --- |
| `pnpm typecheck` | 通过 |
| `pnpm test` | 通过，包含 build、architecture check 和 144 个测试 |
| `pnpm smoke:browser` | 通过，覆盖预设按钮展示、点击插入、源码 props 和 `meta.name` 写入 |
| `pnpm pack:dry-run` | 通过，12 个可发布包 dry-run 通过 |
| `git diff --check` | 通过 |

## 未验证项

- 未接入真实 Java 物料中心远程预设配置；本任务只提供 editor 默认预设和 options 覆盖能力。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，准备实现物料插入预设 API。 |
| 2026-08-01 | in_progress | 已实现 editor 物料预设 helper，并接入 Vue3 物料面板和快捷命令。 |
| 2026-08-01 | verified | 类型检查、单测、browser smoke、npm pack dry-run 和 diff check 均通过。 |
