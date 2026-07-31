# TASK-2026-0801-100-editor-prop-editor-model-api

## 标题

沉淀编辑器属性字段模型 API

## 状态

verified

## 目标

将 Vue3 编辑器 playground 属性面板中的字段控件类型判断、列表字段模型、列表默认新增项、图片字段识别、输入值格式化和 normalize 口径沉淀到 `@meumall/lowcode-editor`，让后续 Java 管理台或独立编辑器 shell 可以复用同一套属性编辑模型。

## 背景

当前属性面板已经支持基础输入、颜色、开关、结构化 JSON、数组列表编辑、列表项图片素材选择和 boolean 兼容。但部分规则仍写在 `apps/editor-playground/src/App.vue`，例如列表字段顺序、常见字段中文标签、图片字段识别、默认列表项和输入 normalize。属性字段模型属于编辑器基础能力，应抽入 editor 包；Vue3 playground 只负责控件布局、事件绑定、资源弹窗和用户反馈。

## 涉及包或系统

- `packages/editor`
- `apps/editor-playground`
- `.ai-workspace/contracts/editor-interaction-model-v1.md`
- `.ai/`

## 范围

包含：

- 在 `@meumall/lowcode-editor` 新增属性字段控件类型、列表字段、默认列表项和输入值转换 helper。
- Vue3 编辑器 playground 改为消费 editor 包的属性字段模型 API。
- 更新 editor README 和 editor interaction model 契约。
- 增加 editor 单测覆盖控件类型、列表字段、图片字段、默认新增项、输入 normalize 和 boolean 兼容。
- 更新项目事实源、AI 上下文和 TODO。

不包含：

- 不改变 Page Schema v1 字段结构或 Material Manifest v1 语义。
- 不改变属性面板 DOM、样式、资源选择器、拖拽排序或真实保存链路。
- 不在 editor 包中引入 Vue、React、DOM、localStorage、HTTP 或管理台组件库。
- 不接入真实素材中心、商品中心、优惠券中心、门店/达人中心。
- 不新增 npm 依赖。

## 责任边界

当前仓库：

- `@meumall/lowcode-editor` 负责提供框架无关的属性字段展示和输入转换模型。
- `apps/editor-playground` 负责渲染具体控件、调用资源选择器、处理事件和展示反馈。

外部系统：

- Java 管理台未来可通过 npm 消费 editor 包 API，并用自己的 Vue 组件库渲染属性控件。

## 契约影响

- 是否影响跨包或跨系统契约：是，`@meumall/lowcode-editor` 新增向后兼容的公开 API。
- 契约文档路径：`.ai-workspace/contracts/editor-interaction-model-v1.md`、`packages/editor/README.md`。
- 是否向后兼容：是，新增导出，不修改旧 API 语义。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/editor/README.md`。
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 梳理 Vue3 编辑器当前属性字段模型逻辑。
2. 在 editor 包新增属性字段模型类型和 helper。
3. 将 Vue3 playground 改为消费 editor API，并保持现有 UI 行为不变。
4. 更新 editor 单测和 README。
5. 更新 editor interaction model 契约。
6. 更新 AI 状态文档和任务状态。
7. 运行验证命令并记录结果。

## 验收标准

- [x] `@meumall/lowcode-editor` 导出属性字段模型 helper。
- [x] helper 可表达 text、number、color、switch、textarea、json 和 list 控件类型。
- [x] helper 可为常见数组字段派生列表项字段和图片字段标记。
- [x] helper 可创建常见列表属性默认新增项。
- [x] helper 可 normalize number、boolean、array、object 和 string 输入。
- [x] Vue3 编辑器 playground 属性面板复用 editor API。
- [x] 不修改 Page Schema、Material Manifest、renderer、materials、runtime loader 或发布协议。
- [x] editor README 和 editor interaction model 契约说明新增 API。
- [x] editor 单测覆盖属性字段模型 API。
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

- 是否需要发布：否，本任务只提交源码和文档；未来真实 npm 发布时作为 `@meumall/lowcode-editor` 向后兼容 minor 能力评估。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：否。
- 是否影响 npm 发布：新增 editor 包公开 API，`pnpm pack:dry-run` 需要通过。
- 回滚目标：回滚本任务提交。
- smoke check：`pnpm smoke:browser` 验证属性面板数组编辑、列表项图片素材选择、布尔开关和关键编辑路径仍可用。

## 风险和阻塞

- 当前 API 只抽象字段模型和输入转换，不负责具体 Vue/React 控件、资源弹窗、权限、审计或服务端保存。
- 后续若 Java 管理台组件库需要更细的控件能力，应在现有 helper 上做向后兼容扩展，避免把 DOM 细节写入 editor 包。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，60 个测试全部通过，包含 editor prop editor model API 单测。
- `pnpm check:architecture`：通过，包结构、依赖方向、物料 manifest 对齐和 primitives 边界未破坏。
- `pnpm smoke:browser`：通过，Vue3 编辑器属性面板分组、列表项图片素材选择、关键编辑路径和 H5 runtime 关键路径仍可用。
- `pnpm pack:dry-run`：通过，8 个可发布包 dry-run 全部通过，包含 `@meumall/lowcode-editor`。

## 剩余风险

- 当前 prop editor model API 只抽象字段模型和输入转换，不负责具体 Vue/React 控件、资源弹窗、权限、审计、服务端校验或服务端保存。
- 本任务新增 `@meumall/lowcode-editor` 公开 API，但未执行真实 npm 发布；真实发布仍需 registry、access、token 和 changeset 版本确认。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 editor 包属性字段模型 API 和 Vue3 playground 复用。 |
| 2026-08-01 | in_progress | 开始实现 editor 包属性字段模型公开 API、Vue3 playground 复用、README、契约和单测。 |
| 2026-08-01 | verified | 已完成 editor 包属性字段模型 API、Vue3 playground 复用、README、契约、单测和 AI 状态记录；验证命令全部通过。 |
