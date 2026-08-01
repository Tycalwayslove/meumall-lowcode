# TASK-2026-0801-163-basic-stepper-material

## 标题

新增 BasicStepper 通用数字步进器物料

## 状态

verified

## 目标

在已有内部 `MlcStepper` primitive 基础上，新增运营可拖拽使用的 `BasicStepper` 通用数字步进器物料，补齐基础表单物料库中“数字增减选择”的业务无关能力。

## 背景

当前 `MlcStepper` 只在 `LeadFormBlock` 内部用于人数步进，运营无法直接拖拽一个独立数字步进器。活动页、问卷、预约、偏好选择等场景经常需要设置人数、数量、天数、预算档位等数字值；这些语义不应直接绑定库存、购买数量、限购或提交接口，因此本任务只新增通用静态交互物料。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `docs/material-layering-architecture.md`
- `.ai/`
- `.changeset/`

## 范围

包含：

- React H5 物料包新增 `BasicStepper`。
- Vue H5 物料包新增 `BasicStepper`。
- Material Manifest 注册 `BasicStepper`，支持标签、辅助说明、默认值、最小值、最大值、步长、禁用态、区块背景、文案色、辅助文案色、强调色和上下留白配置。
- `BasicStepper` 复用已有内部 `MlcStepper` 和 `MlcText` primitives。
- 编辑器默认模板和 React H5 runtime 示例加入 `BasicStepper`。
- browser smoke 覆盖基础步进器从快捷命令添加、Vue H5 画布渲染和 schema 写回。
- 补充单测、README、架构文档、changeset 和 AI 状态。

不包含：

- 不实现库存、购买数量、限购、价格联动、表单提交、校验规则、服务端保存或用户偏好持久化。
- 不接 Java 配置项、商品 SKU、营销规则、会员等级或预约接口。
- 不改变 Page Schema v1 节点结构。
- 不把 `MlcStepper` 抽为公开 primitives npm 包。

## 责任边界

当前仓库：

- `materials-*` 提供 `BasicStepper` 物料实现、manifest 和内部 primitive 复用。
- `editor-playground` 只消费 manifest 并通过现有属性面板编辑静态 props。
- `h5-runtime-playground` 负责演示 React H5 runtime 消费 `BasicStepper`。

外部系统：

- Java 配置服务、库存、商品、预约、用户偏好、权限审批、审计和持久化不在本任务范围内。

## 契约影响

- 是否影响跨包或跨系统契约：否，仅新增 material manifest 条目。
- 是否向后兼容：是，旧 Page Schema 不变。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：后续 npm 发布时按常规 minor 版本发布。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`、`docs/material-layering-architecture.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：低代码前端维护者、未来管理台接入者。
- 当前确认状态：本地 React/Vue H5 materials 和 playground 演示。

## 实现计划

1. 新增 React/Vue `BasicStepper` 物料实现和 manifest。
2. 更新编辑器默认模板、React H5 runtime 示例和 browser smoke。
3. 更新单测、README、架构/AI 状态文档和 changeset。
4. 运行验证并中文提交推送。

## 验收标准

- [x] React/Vue `BasicStepper` manifests 名称、propsSchema、默认值和事件保持一致。
- [x] `BasicStepper` 复用内部 `MlcStepper` 和 `MlcText` primitives。
- [x] `MlcStepper` 不进入 material registry，也不作为公开 npm API。
- [x] 编辑器默认模板能展示基础步进器示例。
- [x] React H5 runtime 示例能渲染基础步进器并绑定 `onChange` action。
- [x] browser smoke 覆盖快捷命令添加基础步进器、画布渲染和源码 schema 写回。
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

- `pnpm test`：通过，103 个测试全部通过。
- `pnpm smoke:browser`：通过，覆盖基础步进器物料存在、默认模板、快捷命令添加、Vue H5 画布渲染、schema 写回、编辑器内置 runtime 和 React H5 runtime 渲染。
- `pnpm demo:check`：通过，编辑器和 H5 runtime 本地联合健康检查通过。
- `git diff --check`：通过，无空白格式问题。

## 发布影响

- 是否需要发布：后续真实 npm 发布时需要。
- 发布对象：`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`。
- 是否需要 changeset：是，minor。
- 是否需要 GitHub tag/release：本任务不单独创建 tag/release，后续统一发布时处理。
- 是否影响 H5 接入：不影响已发布页面；仅新增可选基础物料。
- 回滚目标：回滚本任务提交即可移除基础步进器物料。

## 风险和阻塞

- 当前仅提供本地数字增减交互，不代表库存、限购、价格计算或服务端保存；这些能力需要后续业务物料、action、表单协议或宿主服务扩展。
- 未来抽 primitives 包时需要重新评估 `MlcStepper` 公开 API 命名、禁用态、无障碍和多端一致性。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为业务无关的通用数字步进器物料。 |
| 2026-08-01 | verified | React/Vue 双端实现、默认模板、H5 runtime 示例、browser smoke、单测、demo check、文档和 changeset 均已完成并验证。 |
