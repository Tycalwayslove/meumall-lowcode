# TASK-2026-0801-147-editor-color-prop-swatches

## 标题

增强编辑器颜色属性色板控件

## 状态

verified

## 目标

为 Material Manifest v1 的颜色类属性补充可选 `swatches` 色板元数据，并让 Vue3 编辑器属性面板按统一 editor API 渲染颜色选择器、文本输入和快捷色板，提升运营配置背景色、文字色、边框色和强调色时的可用性。

## 背景

当前属性面板已经支持 `select/options` 和 number 范围步进，但颜色字段仍主要依赖原生 `type="color"`。原生颜色输入适合 `#rrggbb`，但无法友好处理 H5 物料常见的 `transparent`、`rgba(...)` 等字符串，也没有品牌/中性色快捷选择。颜色编辑能力应继续沿用 manifest -> editor model -> Vue shell 的方向，而不是在 Vue 组件里按字段名硬编码。

## 涉及包或系统

- `packages/schema`
- `packages/editor`
- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai-workspace/contracts/material-manifest-v1.md`
- `.ai/`

## 范围

包含：

- `LowcodePropSchema` 新增可选 `swatches?: string[]`。
- `@meumall/lowcode-editor` 提供颜色值归一化、色板派生和原生 color input 安全值 helper。
- Vue3 属性分组组件为 `setter: "color"` 字段渲染颜色选择器、文本输入和 manifest 色板。
- React/Vue H5 基础通用物料和当前高频通用物料的常见颜色字段补充共享色板。
- 单测覆盖颜色控件 helper 和 React/Vue manifest 色板对齐。
- browser smoke 覆盖基础按钮颜色色板写回 schema。
- 同步契约、任务记录、项目事实和待办状态。

不包含：

- 不改变 Page Schema v1 结构。
- 不改变 H5 renderer 或物料运行时渲染语义。
- 不实现品牌主题 token 后台、渐变编辑器、透明度滑杆或复杂 CSS 颜色解析器。
- 不对历史 schema 做批量迁移。
- 不接入 Java 配置平台服务端校验。

## 责任边界

当前仓库：

- `schema` 负责 Material Manifest 颜色编辑元数据类型。
- `editor` 负责颜色输入归一化、原生 color input 安全值和色板展示模型。
- `materials-*` 负责声明各物料颜色字段的推荐色板。
- `editor-playground` 负责 Vue3 参考控件渲染和写回。

外部系统：

- Java 配置平台未来可复用 `swatches` 生成表单快捷色板，并保留文本输入兜底。
- H5 runtime 继续消费 Page Schema，不依赖编辑器控件实现。

## 契约影响

- 是否影响跨包或跨系统契约：是，Material Manifest v1 新增向后兼容可选字段。
- 契约文档路径：`.ai-workspace/contracts/material-manifest-v1.md`。
- 是否向后兼容：是，新增可选编辑元数据，不改变已有 props 值类型。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否；旧 manifest 不声明 `swatches` 时，编辑器使用默认色板和文本兜底。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`.ai-workspace/contracts/material-manifest-v1.md`、`.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：前端低代码维护者、Java 配置平台。
- 当前确认状态：前端参考实现。

## 实现计划

1. 扩展 schema 和 editor 颜色 helper，并补单测。
2. 给 React/Vue H5 物料 manifest 常见颜色字段补共享色板。
3. 改造 Vue3 属性面板颜色字段 UI，并补 browser smoke。
4. 同步契约、README、项目事实和验证记录。

## 验收标准

- [x] `LowcodePropSchema` 支持可选 `swatches`。
- [x] editor API 能为颜色字段提供安全 `#rrggbb` 值、归一化值和去重色板。
- [x] Vue3 属性面板颜色字段同时支持原生颜色选择、文本输入和快捷色板。
- [x] React/Vue H5 同名物料颜色色板语义保持一致。
- [x] browser smoke 能通过基础按钮颜色色板写回 schema。
- [x] 不改变 Page Schema v1、renderer 依赖方向或物料运行时渲染语义。
- [x] `pnpm --filter @meumall/lowcode-schema typecheck` 通过。
- [x] `pnpm --filter @meumall/lowcode-editor typecheck` 通过。
- [x] `pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- [x] `pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm --filter @meumall/lowcode-schema typecheck
pnpm --filter @meumall/lowcode-editor typecheck
pnpm --filter @meumall/lowcode-materials-h5 typecheck
pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck
pnpm test
pnpm smoke:browser
git diff --check
```

## 发布影响

- 是否需要发布：否，本任务不执行真实 npm 发布。
- 发布对象：后续真实发布时影响 `@meumall/lowcode-schema`、`@meumall/lowcode-editor`、`@meumall/lowcode-materials-h5` 和 `@meumall/lowcode-materials-vue-h5`。
- 是否需要 changeset：当前不发布，暂不新增 changeset。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：不影响已发布页面渲染；只改善编辑器配置体验和 manifest 元数据。
- 是否影响 npm 发布：向后兼容 manifest 能力，后续发布可按 minor 评估。
- 是否影响 Java 配置平台：未来 Java 表单生成器可消费 `swatches`，服务端仍按字符串存储颜色值。
- 回滚目标：回滚本任务提交即可恢复普通颜色输入行为。
- smoke check：`pnpm smoke:browser` 验证 Vue3 editor 颜色色板和 H5 runtime 关键路径。

## 风险和阻塞

- `swatches` 只是推荐色板，不限制运营输入其他 CSS 颜色字符串。
- 原生 color input 只能处理 `#rrggbb`，因此必须保留文本输入兜底。
- 当前不处理渐变、透明度滑杆或主题 token 映射，后续可作为设计 token/主题任务单独推进。

## 验证结果

- `pnpm --filter @meumall/lowcode-schema typecheck` 通过。
- `pnpm --filter @meumall/lowcode-editor typecheck` 首次运行时因 schema `dist/index.d.ts` 尚未构建而无法识别新增 `swatches` 字段；执行 `pnpm --filter @meumall/lowcode-schema build` 后重跑通过。
- `pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- `pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- `pnpm test` 通过，87 个测试全部通过，并包含 schema `swatches` 字段、editor 颜色 helper 和 React/Vue manifest 色板对齐断言。
- `pnpm smoke:browser` 通过，已覆盖基础按钮 `按钮色` 色板写回 `backgroundColor: "#2563eb"` 的 schema 链路。
- `git diff --check` 通过。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 Material Manifest 色板元数据、editor 颜色 helper、Vue3 颜色控件和基础物料颜色色板。 |
| 2026-08-01 | in_progress | 已完成 schema/editor/Vue 颜色控件、React/Vue 物料色板元数据、单测和 browser smoke 用例补充，进入验证。 |
| 2026-08-01 | verified | 完成实现、契约/文档/AI 事实源同步和完整验证；不改变 Page Schema v1 或 renderer 运行时语义。 |
