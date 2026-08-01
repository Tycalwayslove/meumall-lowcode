# TASK-2026-0801-148-basic-image-asset-picker

## 标题

基础图片物料接入素材选择器

## 状态

verified

## 目标

将 `BasicImage.imageUrl` 从普通文本输入升级为 Material Manifest 的 `image` setter，让运营添加基础图片物料后可以直接使用现有素材库选择图片，而不是手动粘贴图片 URL。

## 背景

当前 Vue3 编辑器资源面板已经按 manifest `setter: "image"` 自动识别图片属性，并提供素材搜索、分类筛选和写回能力。`BasicCard`、活动图等物料已接入该能力，但基础物料库里的 `BasicImage.imageUrl` 仍声明为 `input`，导致“基础图片”这个最常用的通用物料无法直接打开素材库，影响编辑器的可实操性。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

包含：

- 将 React H5 `BasicImage.imageUrl` manifest setter 改为 `image`。
- 将 Vue H5 `BasicImage.imageUrl` manifest setter 改为 `image`。
- 单测覆盖 React/Vue BasicImage 图片属性 setter 对齐。
- browser smoke 覆盖添加基础图片后可以看到素材库并选择图片写回。
- 同步任务记录、项目事实和待办状态。

不包含：

- 不改变 Page Schema v1 结构。
- 不改变 Material Manifest v1 字段结构。
- 不改变 H5 renderer 或 BasicImage 运行时渲染语义。
- 不新增素材中心接口、不接真实 Java 素材服务。
- 不改其他业务物料图片字段。

## 责任边界

当前仓库：

- `materials-*` 负责声明 BasicImage 图片属性使用 `image` setter。
- `editor-playground` 继续通过现有 `imagePropOptions` 和 `EditorResourcePanels` 识别图片属性并写回当前节点 props。

外部系统：

- Java 配置平台未来可按同一 manifest setter 生成素材选择控件。
- 真实素材中心、权限、分页和审核仍由后续 Java 配置平台或资源服务接入。

## 契约影响

- 是否影响跨包或跨系统契约：是，改变 BasicImage manifest 的推荐 setter，但不改变字段类型或 Page Schema。
- 契约文档路径：`.ai-workspace/contracts/material-manifest-v1.md`。
- 是否向后兼容：是，`imageUrl` 仍为 string，旧页面和 runtime 渲染不受影响。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：前端低代码维护者、Java 配置平台。
- 当前确认状态：前端参考实现。

## 实现计划

1. 修改 React/Vue H5 BasicImage manifest 的 `imageUrl` setter。
2. 更新物料 manifest 对齐测试和 browser smoke。
3. 同步 AI 事实源，运行验证并提交。

## 验收标准

- [x] React H5 `BasicImage.imageUrl` 使用 `setter: "image"`。
- [x] Vue H5 `BasicImage.imageUrl` 使用 `setter: "image"`。
- [x] Vue3 编辑器添加基础图片后，右侧资源面板能展示素材库。
- [x] browser smoke 能选择素材并确认 BasicImage schema 写回素材 URL。
- [x] 不改变 Page Schema v1、Material Manifest v1 字段结构或 renderer 运行时语义。
- [x] `pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- [x] `pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm --filter @meumall/lowcode-materials-h5 typecheck
pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck
pnpm test
pnpm smoke:browser
git diff --check
```

## 验证结果

- `pnpm --filter @meumall/lowcode-materials-h5 typecheck` 通过。
- `pnpm --filter @meumall/lowcode-materials-vue-h5 typecheck` 通过。
- `pnpm build && node --test packages/materials-h5/test/materials.test.mjs` 通过，覆盖 React/Vue `BasicImage.imageUrl` 与其他通用图片物料 `image` setter 对齐。
- `pnpm test` 通过，88 项测试全部通过。
- `pnpm smoke:browser` 通过，覆盖 Vue3 editor 添加基础图片、打开素材库、选择 `新人券视觉`，并确认 schema 写回包含 `1607083206869` 的素材 URL。
- `git diff --check` 通过。

## 发布影响

- 是否需要发布：否，本任务不执行真实 npm 发布。
- 发布对象：后续真实发布时影响 `@meumall/lowcode-materials-h5` 和 `@meumall/lowcode-materials-vue-h5`。
- 是否需要 changeset：当前不发布，暂不新增 changeset。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：不影响已发布页面渲染；只改善编辑器素材选择体验。
- 是否影响 npm 发布：向后兼容 manifest setter 调整，后续发布可按 patch 或 minor 评估。
- 是否影响 Java 配置平台：未来 Java 表单生成器会把 BasicImage 的图片字段识别为素材选择控件。
- 回滚目标：回滚本任务提交即可恢复 BasicImage 图片 URL 文本输入。
- smoke check：`pnpm smoke:browser` 验证 Vue3 editor 基础图片素材选择和 H5 runtime 关键路径。

## 风险和阻塞

- 当前仍使用本地 mock 素材库，不代表真实素材中心已接入。
- URL 文本输入仍由资源面板和属性面板兜底路径保留，真实管理台可根据权限决定是否允许手填。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为 BasicImage manifest setter、现有素材选择器复用、测试和 smoke 覆盖。 |
| 2026-08-01 | in_progress | 已完成 React/Vue BasicImage manifest 调整、物料对齐测试和 browser smoke 用例补充，等待完整验证。 |
| 2026-08-01 | verified | 完成 typecheck、单测、全量测试、browser smoke 和 diff 空白检查，确认 BasicImage 可通过素材库选择图片并写回 schema。 |
