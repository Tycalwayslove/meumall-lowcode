# TASK-2026-0731-065-internal-primitives-prototype

## 标题

建立内部基础组件原型

## 状态

verified

## 目标

按 `docs/material-layering-architecture.md` Phase 1，在 React/Vue H5 materials 包内部建立最小 runtime primitives 原型，并改造少量通用物料验证边界，为后续稳定后抽独立 npm 包打基础。

## 背景

当前物料库已有多个业务和通用物料，但 Button、Image、Tag、Text、Price 等基础 UI 能力仍分散在各物料内部。上一任务已明确不要急于抽包，应先在 materials 包内部验证 primitives API，再渐进迁移业务物料。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `.ai/`

## 范围

- 在 React H5 materials 包内部新增 `src/primitives`。
- 在 Vue H5 materials 包内部新增 `src/primitives`。
- 首批 primitives 包含 Button、Image、Tag、Text、Price 和基础 token。
- 改造 `ActionButton`、`ImageBanner`、`SectionTitle` 使用内部 primitives。
- 补充 materials 测试，确保 React/Vue 物料 manifest 仍对齐，且 primitives 不作为 material 暴露。
- 更新 README、项目状态和任务记录。

## 不包含

- 不抽独立 npm primitives 包。
- 不改造所有业务物料。
- 不改变 Page Schema v1。
- 不改变 Material Manifest v1。
- 不新增编辑器后台 UI 组件。
- 不发布 npm 版本。

## 责任边界

- 内部 primitives 只服务对应端 material 实现，不声明 lowcode material manifest。
- `materials-*` 继续负责 manifest、defaultProps、events 和 dataSourceSlots。
- renderer 仍只消费 material registry，不依赖 primitives。
- editor 不依赖 H5 runtime primitives。

## 契约影响

无 schema、manifest 或公开 npm API 变更；属于 materials 包内部实现重构。

## 对接说明

后续新增或改造物料时，优先复用本任务建立的 primitives。至少 5 个物料复用且 API 稳定后，再另开任务评估抽独立 npm 包。

## 验收标准

- React H5 materials 内部存在 Button、Image、Tag、Text、Price primitives。
- Vue H5 materials 内部存在同语义 Button、Image、Tag、Text、Price primitives。
- `ActionButton` 使用 Button primitive。
- `ImageBanner` 使用 Image primitive。
- `SectionTitle` 使用 Tag/Text primitives。
- React/Vue material manifest `componentName` 列表仍保持一致。
- Primitives 不出现在 `h5Materials` 或 `h5VueMaterials` material registry 中。
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
- 不新增 npm 包。
- 不影响 schema 兼容性。
- 不影响 H5 接入方式。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可恢复通用物料内部实现。

## 风险和阻塞

- 当前 primitives API 仍是内部原型，不应被外部包依赖。
- 只改造 3 个通用物料，业务物料中的重复基础 UI 仍需后续迁移。

## 变更记录

- 2026-07-31：创建任务，状态置为 `ready`。
- 2026-07-31：开始实现，状态置为 `in_progress`。
- 2026-07-31：实现 React/Vue 内部 primitives 原型，改造 `ActionButton`、`ImageBanner`、`SectionTitle`，完成验证，状态置为 `verified`。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，35 个测试全部通过。
- `pnpm smoke:browser`：通过，Vue3 编辑器、编辑器内置 runtime 和 React H5 runtime 均正常渲染。

## 实现摘要

- `packages/materials-h5/src/primitives` 新增 React H5 内部 primitives：`MlcButton`、`MlcImage`、`MlcTag`、`MlcText`、`MlcPrice` 和 `h5Tokens`。
- `packages/materials-vue-h5/src/primitives` 新增 Vue H5 同语义内部 primitives。
- React/Vue `ActionButton` 已使用 Button primitive。
- React/Vue `ImageBanner` 已使用 Image primitive。
- React/Vue `SectionTitle` 已使用 Tag/Text primitives。
- materials 测试新增 primitives 不进入 material registry 的断言。
- README 已注明 primitives 是内部原型，不作为低代码物料暴露。

## 后续建议

- 继续按 `docs/material-layering-architecture.md` 迁移 `StickyActionBar`、`CouponBundle` 和商品类业务物料中的 Button/Image/Tag/Price 重复实现。
- 至少 5 个物料复用并验证 API 稳定后，再评估抽独立 npm 包。
