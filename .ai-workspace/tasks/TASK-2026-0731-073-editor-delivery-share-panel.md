# TASK-2026-0731-073-editor-delivery-share-panel

## 标题

增强 Vue3 编辑器交付分享清单

## 状态

verified

## 目标

在不改变 Page Schema v1、Material Manifest v1、npm 包公开 API 和本地 mock 发布协议的前提下，为 Vue3 编辑器 playground 增加面向运营验收的“交付分享清单”，把当前页面的预览链接、Schema 摘要、复制 Schema、导出 Schema 和交付注意事项集中到发布区域，让运营搭完页面后可以更顺畅地交给测试、产品或 H5 消费方验收。

## 背景

当前编辑器已经支持 H5 预览入口、Schema 文件导入导出、本地自定义模板、发布检查和 React H5 runtime handoff。但这些入口分散在工具栏、源码区、快捷命令和右侧发布区域。对运营来说，页面搭完之后最常见的动作是“发链接验收、导出配置、确认页面规模和风险”。本任务补齐一个轻量的交付清单，不引入真实 Java 配置平台，也不改变 schema。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

包含：

- 右侧发布区域新增“交付清单”面板。
- 展示当前页面标题、pageId、节点数、数据源数、动作数、Schema JSON 体积和发布检查状态。
- 提供复制当前 Page Schema JSON 的入口。
- 复用现有导出 Schema 下载能力。
- 展示当前草稿 React H5 链接和页面草稿/最新版本 H5 链接的交付状态。
- browser smoke 覆盖交付清单可见、复制 Schema、导出 Schema 和状态摘要。
- 更新任务记录和 `.ai` 项目事实源。

不包含：

- 不新增 Page Schema 字段。
- 不改变 `@meumall/lowcode-adapters` 的 URL schema handoff 协议。
- 不接入真实 Java 配置平台预览 token。
- 不生成二维码或短链。
- 不改变 npm 公开 API。

## 责任边界

当前仓库：

- 编辑器 playground 负责交付清单 UI、复制 Schema 和复用导出能力。
- browser smoke 负责验证关键交互。

外部系统：

- Java 配置平台、短链服务、二维码服务、H5 业务仓库无需变更。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无新增；仍遵循 `.ai-workspace/contracts/page-schema-v1.md` 和 `.ai-workspace/contracts/h5-runtime-integration-v1.md`。
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
2. 梳理现有 H5 预览入口、Schema 导入导出和 smoke 流程。
3. 新增交付清单计算属性和复制 Schema 方法。
4. 在右侧发布区域新增交付清单面板并补充样式。
5. 补充 browser smoke 覆盖。
6. 更新 `.ai` 状态记录并运行验证命令。

## 验收标准

- [x] 右侧发布区域展示“交付清单”面板。
- [x] 交付清单展示页面标题、pageId、节点数、数据源数、动作数和 Schema 体积。
- [x] 交付清单展示当前发布检查状态。
- [x] 交付清单可复制当前 Page Schema JSON。
- [x] 交付清单可复用导出页面 Schema。
- [x] 交付清单展示至少两个 H5 交付链接状态。
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

- 当前交付链接仍是本地 playground / URL schema handoff，不代表生产 previewToken。
- Schema JSON 复制可能受浏览器剪贴板权限影响，需复用现有 textarea fallback。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建任务，范围限定为 Vue3 编辑器 playground 交付分享清单。 |
| 2026-07-31 | in_progress | 开始实现交付清单 UI、Schema 复制导出入口和 browser smoke 覆盖。 |
| 2026-07-31 | verified | 完成交付清单面板、复制/导出 Schema 入口和 browser smoke 覆盖，验证命令通过。 |
