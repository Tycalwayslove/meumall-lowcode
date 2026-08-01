# TASK-2026-0801-164-notice-bar-primitives

## 状态

verified

## 目标

将现有 `NoticeBar` 公告条物料迁移到 React/Vue H5 materials 包内部 runtime primitive，补齐可配置样式能力，并保持历史 Page Schema 中 `NoticeBar` 组件名和旧 props 向后兼容。

## 背景

`NoticeBar` 已被编辑器大促模板、新人券模板、商品专题模板和 React H5 runtime 示例使用，但当前实现仍是 React/Vue 两侧各自手写的简单 `section`。随着通用物料库继续扩展，公告条应复用内部 primitives，避免后续基础样式和多端实现继续分叉。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- Vue3 editor playground 示例模板
- React H5 runtime playground 示例
- AI 工作流事实源和物料分层文档

## 范围

- 新增 React/Vue 内部 `MlcNoticeBar` primitive。
- 保留物料层 `NoticeBar` 名称，迁移为复用 `MlcNoticeBar`。
- 增强 `NoticeBar` manifest，补齐图标文案、标签颜色、边框、圆角、上下留白等通用样式 props。
- 更新默认模板和 H5 runtime 示例，使 smoke check 覆盖新 DOM class 和新 props。
- 更新测试、README、分层文档、AI 上下文、TODO 和 changeset。

## 不包含

- 不新增 `BasicNoticeBar`，避免与现有 `NoticeBar` 形成重复物料。
- 不接远程公告、配置平台公告流、跑马灯、关闭记忆、曝光统计或权限审批。
- 不改变 Page Schema v1、Material Manifest v1 或 renderer 协议。
- 不将 primitives 抽成公开 npm 包 API。

## 责任边界

- materials 包负责通用公告条展示、样式 props 和 React/Vue H5 实现一致性。
- editor playground 只消费 manifest 和示例模板，不承担公告业务规则。
- H5 runtime 只渲染 schema，不提供公告拉取或持久化。
- 外部 Java 配置平台如需管理公告内容，后续通过 Page Schema 或数据源协议单独建任务。

## 契约影响

- 提供方：`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`。
- 消费方：Vue3 editor playground、React H5 runtime playground、未来业务管理台。
- 契约文档路径：`docs/material-layering-architecture.md`。
- 向后兼容：是，保留 `NoticeBar` 组件名、`label`、`content`、`backgroundColor`、`textColor`。
- 迁移要求：无历史 schema 迁移要求。
- 灰度要求：无，属于物料包 minor 增强。

## 对接说明

运营仍拖拽或使用 `NoticeBar` 物料。新增 props 只提供更细的视觉配置能力，业务系统不应依赖这些 props 表达真实公告状态、阅读状态或审核状态。

## 验收标准

- React/Vue H5 materials 均导出内部 `MlcNoticeBar` primitive。
- `NoticeBar` React/Vue 实现均复用 `MlcNoticeBar`。
- `NoticeBar` manifest 在 React/Vue 两侧保持一致，并保留旧字段。
- `NoticeBar` 不进入 primitives registry，也不作为公开 npm API。
- Vue3 editor playground 默认模板和 React H5 runtime 示例可渲染 `.mlc-notice-bar`。
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

- 如果将公告条过早拆成业务公告系统，会与后续配置平台公告、活动规则、曝光统计等能力耦合。本任务明确只做通用展示物料。
- 如果新增 `BasicNoticeBar`，会造成物料库概念重复。本任务选择增强现有 `NoticeBar`。

## 变更记录

- 2026-08-01：创建 ready 工作项。
- 2026-08-01：完成 React/Vue `MlcNoticeBar` primitive、`NoticeBar` 物料增强、示例模板、browser smoke、README、分层文档、AI 事实源和 changeset 更新。

## 验证结果

```bash
pnpm test
```

结果：通过。包含 build、架构检查和 104 个单测。

```bash
pnpm smoke:browser
```

结果：通过。覆盖 Vue3 编辑器画布、编辑器内置 runtime、React H5 runtime、HTTP 配置平台演示和新增 `.mlc-notice-bar` 断言。

```bash
pnpm demo:check
```

结果：通过。编辑器和 H5 runtime 本地演示入口健康检查正常。

```bash
git diff --check
```

结果：通过。
