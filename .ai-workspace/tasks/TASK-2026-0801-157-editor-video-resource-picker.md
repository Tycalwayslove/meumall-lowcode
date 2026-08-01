# TASK-2026-0801-157-editor-video-resource-picker

## 标题

新增编辑器视频素材选择器

## 状态

verified

## 目标

在 `BasicVideo` 已具备双端渲染能力的基础上，补齐 Vue3 编辑器的视频素材选择体验，让运营可以从资源库选择视频素材并写回当前节点的 `videoUrl` 和 `posterUrl`，减少手填 URL 的操作成本。

## 背景

上一轮已新增 `BasicVideo` 通用物料，但 `videoUrl` 仍主要通过输入框配置。对于运营搭建活动页来说，视频素材应与图片素材类似，通过资源库选择后写回 schema。该能力应通过 adapters 的 Resource Library Client 抽象，而不是在编辑器组件中硬编码真实素材中心。

## 涉及包或系统

- `packages/schema`
- `packages/adapters`
- `packages/editor`
- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `.ai-workspace/contracts/material-manifest-v1.md`
- `.changeset/`
- `.ai/`

## 范围

包含：

- Material Manifest setter 新增向后兼容的 `video` 编辑元数据。
- `BasicVideo.videoUrl` 在 React/Vue manifests 中使用 `video` setter。
- `LowcodeResourceLibraryClient` 新增可选 `searchVideoAssets` 能力和静态视频资源实现。
- Vue3 编辑器 playground 新增视频素材库面板，支持搜索、分类、选择视频并写回 `videoUrl` 与 `posterUrl`。
- 发布检查对 `video` setter 的空值给出 warning。
- browser smoke 覆盖基础视频素材选择和 schema 写回。
- 补充单测、文档、changeset、任务验证记录。

不包含：

- 不实现视频上传、转码、审核、水印、试看、清晰度或素材权限。
- 不接真实 Java 素材中心或视频中心接口。
- 不改变 Page Schema v1 节点结构。
- 不改变 React/Vue renderer 的职责边界。
- 不引入第三方播放器 SDK。

## 责任边界

当前仓库：

- `schema` 提供 `video` setter 类型。
- `adapters` 提供视频资源查询抽象和静态 mock 实现。
- `editor` 提供属性分组和发布检查的框架无关辅助逻辑。
- `apps/editor-playground` 负责演示视频素材选择和 schema 写回。
- `materials-*` 只声明 `video` setter 元数据并继续消费普通 props。

外部系统：

- Java 配置平台、真实素材中心、视频中心、CDN、审核和权限不在本任务范围内。

## 契约影响

- 是否影响跨包或跨系统契约：是，扩展 Material Manifest v1 setter 元数据和 Resource Library Client。
- 契约文档路径：`.ai-workspace/contracts/material-manifest-v1.md`、`.ai/PROJECT_STATE.md`。
- 是否向后兼容：是，新增可选 setter 类型和可选 client 方法，旧页面 schema 不变。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：真实管理台接入时需要识别不支持 `video` setter 的旧编辑器，本任务本地 playground 已支持。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/adapters/README.md`、`packages/editor/README.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：低代码前端维护者、未来 Java 素材中心/视频中心负责人。
- 当前确认状态：本地静态资源 client 和 Vue3 editor playground 演示。

## 实现计划

1. 扩展 schema setter、manifest 契约和 `BasicVideo` manifest。
2. 扩展 adapters Resource Library Client 的视频资源类型、查询方法和单测。
3. 扩展 editor 发布检查和属性分组辅助逻辑。
4. 在 Vue3 editor playground 接入视频素材面板、mock 视频素材和写回逻辑。
5. 更新 browser smoke、README、AI 状态、changeset 和任务验证记录。

## 验收标准

- [x] `LowcodePropSetter` 支持 `video`，Material Manifest v1 文档同步。
- [x] React/Vue `BasicVideo.videoUrl` manifest 使用 `video` setter 且双端保持一致。
- [x] `LowcodeResourceLibraryClient` 支持可选视频素材查询，静态 client 可按关键词、分类、标签和 ids 查询。
- [x] Vue3 编辑器选中 `BasicVideo` 时展示视频素材库。
- [x] 选择视频素材后写回 `videoUrl`，并在存在封面字段时同步写回 `posterUrl`。
- [x] 发布检查可对空视频地址给出 warning，不导致页面不可编辑。
- [x] browser smoke 覆盖视频素材选择和源码 schema 写回。
- [x] `pnpm test` 通过。
- [x] `pnpm smoke:browser` 通过。
- [x] `pnpm demo:check` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm test
pnpm smoke:browser
pnpm demo:check
git diff --check
```

## 验证结果

- `pnpm test`：通过，包含 build、architecture check 和 97 个 Node test。
- `pnpm smoke:browser`：通过，已覆盖 Vue3 编辑器通过快捷命令添加基础视频、展示视频素材库、选择“权益说明视频”、画布视频封面更新和源码 `posterUrl` 写回。
- `pnpm demo:check`：通过，editor、H5 runtime、published pageId 和 preview releaseId 入口健康检查正常。
- `git diff --check`：通过。

## 发布影响

- 是否需要发布：后续真实 npm 发布时需要。
- 发布对象：`@meumall/lowcode-schema`、`@meumall/lowcode-adapters`、`@meumall/lowcode-editor`、`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`。
- 是否需要 changeset：是，minor。
- 是否需要 GitHub tag/release：本任务不单独创建 tag/release，后续统一发布时处理。
- 是否影响 H5 接入：不影响已发布页面；仅新增编辑器 manifest 元数据和资源查询抽象。
- 是否影响 npm 发布：新增 pending changeset，真实发布仍需 registry/token 确认。
- 是否影响 Java 配置平台：未来读取 manifest 时可识别视频字段；真实素材中心对接需后续实现。
- 回滚目标：回滚本任务提交即可恢复为手填视频 URL。
- smoke check：`pnpm smoke:browser` 和 `pnpm demo:check`。

## 风险和阻塞

- 真实移动端自动播放策略仍由 H5 宿主和浏览器决定，本任务只处理素材选择。
- 真实视频中心的权限、审核、CDN 防盗链和转码状态需要后续独立契约。
- 若未来管理台暂不支持 `video` setter，应退化为 URL 输入框。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为编辑器视频素材选择、Resource Library Client 扩展和 manifest 元数据增强。 |
| 2026-08-01 | verified | 完成 `video` setter、视频 Resource Library Client、Vue3 编辑器视频素材库、发布检查 warning、browser smoke、单测、changeset 和文档状态更新。 |
