# TASK-2026-0731-064-primitives-material-foundation

## 标题

设计基础组件与物料分层架构

## 状态

verified

## 目标

先沉淀与具体业务无关的 H5 基础组件、通用物料和业务物料分层架构，明确包边界、依赖方向、演进节奏和落地检查清单，再进入后续具体组件实现，降低后续业务物料扩展和业务重构成本。

## 背景

当前 React/Vue H5 物料包已经能渲染多种活动物料，但很多按钮、图片、标签和输入类 UI 仍直接写在各个物料内部。继续堆业务组件会造成样式、交互、无障碍和 fallback 分散，后续迁管理系统、接真实业务和做多端适配时重构成本会变高。用户明确要求先把架构和演进方向设计清楚，再持续推进具体计划。

## 涉及包或系统

- `docs/`
- `.ai-workspace/`
- 后续涉及 `packages/primitives-*`
- 后续涉及 `packages/materials-*`
- `.ai/`

## 范围

- 设计基础组件 primitives、通用物料 generic materials、业务物料 business materials 的分层边界。
- 明确 schema、core、renderer、editor、materials、primitives 的依赖方向。
- 明确 Button、Input、Image、Tag、价格、倒计时等能力分别属于哪一层。
- 明确 React/Vue H5 与未来小程序的演进策略。
- 明确后续具体实现的分阶段计划和验收检查清单。
- 更新架构文档、项目状态和任务记录。

## 不包含

- 不新增 primitives 代码包。
- 不改造现有物料实现。
- 不一次性重写所有已有业务物料。
- 不新增正式管理台组件库。
- 不改变 Page Schema v1。
- 不改变 Material Manifest v1。
- 不接入真实业务接口。
- 不发布 npm 版本。

## 责任边界

- 本任务只做架构设计和演进规则沉淀。
- 后续 `primitives-*` 只提供框架对应的基础 UI 组件和 token，不声明低代码 material manifest。
- 后续 `materials-*` 继续负责低代码物料 manifest 和业务/运营区块组合。
- renderer 不依赖 primitives；renderer 仍只消费 material registry。
- editor 不直接依赖 H5 primitives；编辑器通过 material registry 预览物料，编辑器自身控件单独治理。

## 契约影响

本任务不新增公开 API；只新增架构文档。后续如新增 primitives npm 包，必须另开任务评估包边界和发布影响。

## 对接说明

后续新增物料时优先按“基础组件 -> 通用物料 -> 业务物料”的顺序设计，不在业务物料里重复实现基础 Button、Input、Image、Tag。后续如要做小程序端，应先补对应端 primitives 和 renderer/materials 适配。

## 验收标准

- 架构文档说明 primitives、generic materials、business materials 的职责边界。
- 架构文档说明包依赖方向，避免 renderer/editor 与 primitives/materials 反向耦合。
- 架构文档给出首批基础组件清单和不应进入 primitives 的内容。
- 架构文档给出后续分阶段落地计划。
- 架构文档给出新增物料前的检查清单。
- `git diff --check` 通过。

## 验证命令

```bash
git diff --check
```

## 发布影响

- 不需要 npm 发布。
- 不新增 npm 包。
- 不影响 schema 兼容性。
- 不影响 H5 接入方式。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可移除架构文档和项目状态更新。

## 风险和阻塞

- 当前只产出架构设计，不直接改善运行时 UI；需要后续按计划创建 primitives 包并渐进改造现有物料。

## 变更记录

- 2026-07-31：创建任务，状态置为 `ready`。
- 2026-07-31：开始实现，状态置为 `in_progress`。
- 2026-07-31：根据用户反馈调整为架构设计先行，沉淀 `docs/material-layering-architecture.md` 并同步项目地图和拆仓计划，状态置为 `verified`。

## 验证结果

- `git diff --check`：通过。

## 实现摘要

- 新增 `docs/material-layering-architecture.md`，明确 Design Tokens、Runtime Primitives、Generic Materials 和 Business Materials 的职责边界。
- 明确 primitives 不声明 lowcode material manifest，不依赖 schema/core/editor/renderer，也不承载业务字段。
- 明确 editor UI 与 H5 runtime primitives 分开治理，避免管理台控件和 H5 页面控件互相耦合。
- 明确后续采用 Phase 1 内部 primitives 原型、Phase 2 稳定后抽 npm 包、Phase 3 再考虑通用/业务物料包拆分的演进路线。
- 更新 `docs/architecture.md`、`docs/repo-split-plan.md` 和 `.ai-workspace/PROJECT_MAP.md`。

## 后续建议

- 下一任务优先按 Phase 1 建立内部 primitives 原型，不急于新增 npm 包。
- 首批建议只覆盖 `Button`、`Image`、`Tag`、`Text`、`Price`。
- 首批改造建议选择 `ActionButton`、`ImageBanner`、`SectionTitle`，验证边界后再迁移业务物料。
