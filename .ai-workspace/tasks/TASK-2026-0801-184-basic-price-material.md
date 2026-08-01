# TASK-2026-0801-184-basic-price-material

## 状态

verified

## 目标

新增业务无关的基础价格展示物料 `BasicPrice`，让运营可以在 Vue3 编辑器中拖拽配置价格文案，并让 React H5 runtime 和 Vue H5 runtime 使用同一 `componentName` 与 manifest 语义渲染。

## 背景

当前 React/Vue H5 primitives 已提供 `MlcPrice`，业务物料中也复用了该 primitive，但通用基础物料库还没有可单独拖拽的价格展示物料。为了继续保持“基础组件 -> 通用物料 -> 业务物料”的分层，需要先把价格展示沉淀为通用基础物料，再让后续业务物料基于它或同层能力演进。

## 涉及包或系统

- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `.ai-workspace`
- `.ai`
- npm / GitHub

## 范围

包含：

- 在 React H5 物料包新增 `BasicPrice` 组件与 manifest。
- 在 Vue H5 物料包新增同名 `BasicPrice` 组件与 manifest。
- 复用已有 `MlcPrice` primitive，不新增新的 primitive API。
- 接入 Vue3 编辑器默认模板、快捷命令物料目录和 React H5 runtime 示例。
- 补充单测、browser smoke、README、changeset 和任务/项目状态记录。

不包含：

- 不修改 Page Schema v1 或 Material Manifest v1 字段结构。
- 不新增真实商品价格接口、优惠计算、货币换算、会员价、划线价联动或埋点。
- 不新增小程序物料。
- 不新增独立 Vue 编辑器 npm 包。

## 责任边界

当前仓库：

- 提供通用基础价格物料、manifest、React/Vue H5 runtime 示例和 npm 发布预检。

外部系统：

- Java 配置平台后续只消费 manifest 和 schema，不需要本任务新增接口。
- `hybird-meumall` 后续通过 npm 包升级获得该物料能力，不需要本任务改业务仓库。

## 契约影响

- 是否影响跨包或跨系统契约：影响 Material Manifest 注册清单和 npm 包公开导出。
- 契约文档路径：`.ai-workspace/contracts/material-manifest-v1.md`、`docs/material-layering-architecture.md`
- 是否向后兼容：是。新增物料和可选 props，不改变旧页面渲染语义。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要，写入物料包 README 和任务记录。
- 对接说明路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`
- 需要确认的角色：npm 管理员 / H5 接入方
- 当前确认状态：无需阻塞，等待真实 npm 发布窗口统一确认。

## 实现计划

1. 新增 React/Vue H5 `BasicPrice` 组件和 manifest，确保组件名、默认 props、propsSchema 对齐。
2. 接入编辑器默认模板、React H5 runtime 示例和 browser smoke 检查。
3. 更新单测、README、changeset、项目状态和任务验证记录。

## 实现结果

- React H5 materials 新增 `BasicPrice` 组件与 manifest，复用 `MlcPrice`。
- Vue H5 materials 新增同名 `BasicPrice` 组件与 manifest，并与 React 物料清单对齐。
- Vue3 编辑器默认模板和 React H5 runtime 示例已接入 `BasicPrice`。
- browser smoke 已覆盖基础价格物料存在、快捷命令添加、编辑器默认画布、编辑器内置 runtime 和 React H5 runtime 渲染。
- README、changeset、项目状态和长期上下文已同步。

## 验收标准

- [x] React/Vue H5 物料清单都包含 `BasicPrice`，且 componentName 和 manifest 语义对齐。
- [x] `BasicPrice` 复用 `MlcPrice` primitive，不依赖业务项目内部代码。
- [x] Vue3 编辑器可从物料目录/快捷命令发现基础价格物料，并能在默认 H5 画布渲染。
- [x] React H5 runtime 示例可渲染基础价格物料。
- [x] 不修改 Page Schema v1 字段结构，旧 schema 无需迁移。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm smoke:browser
pnpm pack:dry-run
```

## 验证结果

| 日期 | 命令 | 结果 |
| --- | --- | --- |
| 2026-08-01 | `pnpm typecheck` | 通过 |
| 2026-08-01 | `pnpm test` | 通过，131 个 Node 测试全部通过，包含新增基础价格物料注册测试 |
| 2026-08-01 | `pnpm smoke:browser` | 通过，覆盖基础价格物料目录、快捷命令、Vue H5 画布、编辑器 runtime 和 React H5 runtime |
| 2026-08-01 | `pnpm pack:dry-run` | 通过，12 个可发布包 dry-run 均包含预期产物 |

## 发布影响

- 是否需要发布：需要，后续统一 npm 发布。
- 发布对象：`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`
- 是否需要 changeset：需要，minor。
- 是否需要 GitHub tag/release：本任务不单独创建 tag/release，后续发布窗口统一处理。
- 回滚目标：回滚本次物料新增 commit 或降级到上一版 materials 包。
- smoke check：通过 `pnpm smoke:browser` 验证编辑器和 React H5 runtime 渲染。

## 风险和阻塞

- 真实 npm 发布的 registry、token、access 仍由发布窗口统一确认。
- 价格展示当前只做静态文案，不处理业务价格计算。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建基础价格物料任务，确认可进入实现。 |
| 2026-08-01 | verified | 完成 React/Vue H5 `BasicPrice` 物料、示例、文档、changeset 和验证记录。 |
