# TASK-2026-0731-060-editor-template-visual-preview

## 标题

增强 Vue3 编辑器模板视觉预览

## 状态

verified

## 目标

让运营在左侧模板库和新建页面向导中，通过缩略图、首屏标题和节点数量快速判断模板视觉风格与适用场景，减少纯文字选择模板的成本。

## 背景

当前编辑器已经支持模板搜索、模板摘要和独立 H5 预览入口，但模板卡片本身仍偏文字化。运营在搭建活动页时通常先按视觉风格和首屏内容选模板，因此需要在不改模板契约的前提下，从现有 schema 中提取可用的视觉预览信息。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

- 从模板 schema 中提取缩略图、首屏标题和副标题。
- 左侧模板卡片展示视觉缩略预览。
- 新建页面向导模板起点展示视觉缩略预览。
- 扩展 browser smoke check 覆盖模板缩略预览。
- 更新 AI 项目状态和任务记录。

## 不包含

- 不改变 Template Library Client 契约。
- 不改变 Page Schema v1 或 Material Manifest v1。
- 不接入真实模板市场缩略图接口。
- 不发布 npm 版本。

## 责任边界

- 编辑器 shell 负责从现有 schema 中派生模板缩略信息并展示。
- Template Library Client 继续只提供模板数据源，不要求新增缩略图字段。
- renderer 和 materials 不承载编辑器模板列表 UI。

## 契约影响

无 schema、manifest、renderer API、Template Library Client 或 npm 公开 API 变更。

## 对接说明

后续 Java 模板市场如果提供独立缩略图 URL，可优先使用服务端字段；当前实现作为无后端字段时的本地派生兜底。

## 验收标准

- 左侧模板卡片展示 `.template-preview-card`，包含模板缩略图、首屏标题和节点数量。
- 新建页面向导模板卡片展示 `.page-start-template-preview`。
- 模板搜索、模板 H5 预览、应用模板和新建向导流程保持可用。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过。
- `pnpm smoke:browser` 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm smoke:browser
```

## 发布影响

- 不需要 npm 发布。
- 不影响 schema 兼容性。
- 不影响 H5 runtime 接入。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可恢复原模板卡片展示。

## 风险和阻塞

- 缩略信息当前从常见字段 `imageUrl`、`coverImageUrl`、`title`、`subtitle`、`description` 中派生，非标准模板字段可能只能显示兜底样式。

## 变更记录

- 2026-07-31：创建任务，状态置为 `in_progress`。
- 2026-07-31：实现模板视觉缩略预览并扩展 browser smoke 覆盖，状态置为 `verified`。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，32 个测试全部通过。
- `pnpm smoke:browser`：通过，已覆盖左侧模板卡片缩略预览和新建页面向导模板缩略预览。

## 实现摘要

- 从模板 schema 中派生缩略图、首屏标题、副标题和节点数标签。
- 左侧模板卡片展示缩略图、视觉文案、版本、标签和结构摘要。
- 新建页面向导模板起点展示横向缩略图和节点数标签。
- 没有独立缩略图字段时，继续使用 schema 内图片字段兜底，不改变模板库 client 契约。
