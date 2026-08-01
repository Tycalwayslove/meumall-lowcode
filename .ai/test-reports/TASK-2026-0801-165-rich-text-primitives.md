# TASK-2026-0801-165-rich-text-primitives

## 状态

verified

## 目标

将现有 `RichTextBlock` 富文本物料迁移到 React/Vue H5 materials 包内部 runtime primitive，补齐通用排版和容器样式配置，并保持历史 Page Schema 中 `RichTextBlock.html` 向后兼容。

## 背景

`RichTextBlock` 已用于运营规则、说明文案和容器嵌套示例，但当前实现仍是 React/Vue 两侧各自手写的简单 HTML 容器。随着基础物料库继续扩展，富文本展示应沉淀为内部 primitive，避免后续说明类物料在 padding、字体、颜色、圆角和边框上继续分叉。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- Vue3 editor playground 示例模板
- React H5 runtime playground 示例
- AI 工作流事实源和物料分层文档

## 范围

- 新增 React/Vue 内部 `MlcRichText` primitive。
- 保留物料层 `RichTextBlock` 名称，迁移为复用 `MlcRichText`。
- 增强 `RichTextBlock` manifest，补齐背景色、文字色、边框色、圆角、内边距、字号和行高 props。
- 更新默认模板和 H5 runtime 示例，使 browser smoke check 覆盖 `.mlc-rich-text`。
- 更新测试、README、分层文档、AI 上下文、TODO 和 changeset。

## 不包含

- 不实现富文本编辑器 UI。
- 不新增 HTML sanitizer、内容审核、敏感词审核或富文本上传能力。
- 不接真实规则系统、CMS、Java 配置平台富文本资源或远程内容数据源。
- 不改变 Page Schema v1、Material Manifest v1 或 renderer 协议。
- 不将 primitives 抽成公开 npm 包 API。

## 责任边界

- materials 包负责通用富文本展示、基础样式 props 和 React/Vue H5 实现一致性。
- editor playground 只消费 manifest 和示例模板，不承担富文本内容审核或编辑器实现。
- H5 runtime 只渲染 schema，不提供远程富文本加载、过滤或审核。
- 外部 Java 配置平台如需富文本审核、保存或资源托管，后续通过独立任务和契约扩展。

## 契约影响

- 提供方：`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`。
- 消费方：Vue3 editor playground、React H5 runtime playground、未来业务管理台。
- 契约文档路径：`docs/material-layering-architecture.md`。
- 向后兼容：是，保留 `RichTextBlock` 组件名和 `html` 字段。
- 迁移要求：无历史 schema 迁移要求。
- 灰度要求：无，属于物料包 minor 增强。

## 对接说明

运营仍拖拽或使用 `RichTextBlock` 物料。新增 props 只提供基础视觉配置能力，业务系统不应依赖这些 props 表达真实审核状态、规则版本或内容来源。

## 验收标准

- React/Vue H5 materials 均导出内部 `MlcRichText` primitive。
- `RichTextBlock` React/Vue 实现均复用 `MlcRichText`。
- `RichTextBlock` manifest 在 React/Vue 两侧保持一致，并保留旧字段。
- `MlcRichText` 不进入 material registry，也不作为公开 npm API。
- Vue3 editor playground 默认模板和 React H5 runtime 示例可渲染 `.mlc-rich-text`。
- 自动化测试和 browser smoke 通过。

## 验证命令

```bash
pnpm test
pnpm smoke:browser
pnpm demo:check
git diff --check
```

## 发布影响

- `@meumall/lowcode-materials-h5` minor changeset。
- `@meumall/lowcode-materials-vue-h5` minor changeset。
- 不发布 renderer、schema、core、editor 包的新契约。

## 风险和阻塞

- 富文本 HTML 的安全策略需要后续和 Java 配置平台、内容审核、管理台编辑器共同设计。本任务不新增安全策略，避免在物料层做半套平台能力。
- 如果后续引入真实富文本编辑器，应保持 `RichTextBlock` runtime 只负责展示，编辑器 UI 单独归入管理台或 editor shell。

## 变更记录

- 2026-08-01：创建 ready 工作项。
- 2026-08-01：完成 React/Vue `MlcRichText` primitive、`RichTextBlock` 物料增强、示例模板、browser smoke、README、分层文档、AI 事实源和 changeset 更新。

## 验证结果

```bash
pnpm test
```

结果：通过。包含 build、架构检查和 105 个单测。

```bash
pnpm smoke:browser
```

结果：通过。覆盖 Vue3 编辑器画布、编辑器内置 runtime、React H5 runtime、HTTP 配置平台演示和新增 `.mlc-rich-text` 断言。

```bash
pnpm demo:check
```

结果：通过。编辑器和 H5 runtime 本地演示入口健康检查正常。

```bash
git diff --check
```

结果：通过。
