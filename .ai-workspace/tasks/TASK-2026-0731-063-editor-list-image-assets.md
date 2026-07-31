# TASK-2026-0731-063-editor-list-image-assets

## 标题

增强列表项图片素材选择

## 状态

verified

## 目标

让 Vue3 编辑器的数组列表项图片字段可以直接从素材库选择图片，降低运营配置图片卡片、门店/达人、导航卡片等列表类物料时手填 URL 的成本。

## 背景

当前右侧属性面板已支持节点级图片字段使用素材库，但 `ImageCardGrid.items[].imageUrl` 这类列表项图片仍只能手动输入 URL。运营搭建活动会场入口时会频繁配置多张卡片图片，手填 URL 体验差且容易出错。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`

## 范围

- 数组列表编辑器识别图片字段并展示缩略预览。
- 图片字段保留 URL 输入能力。
- 图片字段提供素材库选择入口，选择后写回当前列表项字段。
- Browser smoke check 覆盖列表项图片素材选择。
- 更新 AI 项目状态。

## 不包含

- 不改变 Page Schema v1。
- 不改变 Material Manifest v1。
- 不接入真实素材中心。
- 不发布 npm 版本。

## 验收标准

- `ImageCardGrid.items[].imageUrl` 可通过素材库写入。
- 选择素材后当前列表项展示图片缩略图。
- 原手填 URL 能力保留。
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
- 不影响已有 schema 兼容性。
- 回滚方式：回滚本任务提交即可恢复原列表项 URL 输入体验。

## 风险和阻塞

- 当前素材库仍为静态 mock client；真实素材中心接入后需要补充分页、权限、审核和资源状态。

## 变更记录

- 2026-07-31：创建任务，状态置为 `in_progress`。
- 2026-07-31：实现列表项图片素材选择、缩略图预览和 browser smoke 覆盖，并完成验证，状态置为 `verified`。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，34 个测试全部通过。
- `pnpm smoke:browser`：通过，已覆盖图片卡片宫格列表项图片字段从素材库选择并写回缩略预览。

## 实现摘要

- Vue3 编辑器数组列表项识别 `imageUrl`、`coverImageUrl` 和 `logoImageUrl` 类图片字段。
- 图片字段在保留 URL 输入的同时展示缩略图或空状态。
- 当前列表项可展开内联素材库，选择素材后写回对应数组项字段。
- 切换选中节点时会清理列表项选图目标，避免写入错位。
