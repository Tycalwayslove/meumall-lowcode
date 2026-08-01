# TASK-2026-0801-162-basic-radio-group-material

## 标题

新增 BasicRadioGroup 通用单选组物料

## 状态

verified

## 目标

在已有 `BasicSelect` 静态下拉单选能力之后，补齐运营可拖拽使用的 `BasicRadioGroup` 通用单选组物料，为少量选项直接平铺展示、偏好选择、表单单选等业务无关场景提供统一基础物料。

## 背景

`BasicSelect` 适合收纳较多选项，但运营活动页中经常需要把 2-4 个选项直接展示出来，让用户或运营预览时能一眼看到选项内容。为了继续完善基础表单物料库，本任务新增内部 `MlcRadioGroup` primitive，并封装为 React/Vue 双端 `BasicRadioGroup` 物料；暂不抽独立 primitives npm 包。

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

- React/Vue H5 materials 内部新增 `MlcRadioGroup` primitive。
- React H5 物料包新增 `BasicRadioGroup`。
- Vue H5 物料包新增 `BasicRadioGroup`。
- Material Manifest 注册 `BasicRadioGroup`，支持标签、辅助说明、静态选项、默认值、禁用态、区块背景、文案色、辅助文案色、激活色、边框色、圆角和上下留白配置。
- 编辑器默认模板和 React H5 runtime 示例加入 `BasicRadioGroup`。
- browser smoke 覆盖基础单选组从快捷命令添加、Vue H5 画布渲染和 schema 写回。
- 补充单测、README、架构文档、changeset 和 AI 状态。

不包含：

- 不实现远程业务字典、级联选择、多选、搜索、表单提交、校验规则、个性化推荐或服务端保存。
- 不接 Java 配置项、会员标签、商品类目、营销规则或用户偏好接口。
- 不改变 Page Schema v1 节点结构。
- 不把 `MlcRadioGroup` 抽为公开 primitives npm 包。

## 责任边界

当前仓库：

- `materials-*` 提供 `BasicRadioGroup` 物料实现、manifest 和内部 primitive。
- `editor-playground` 只消费 manifest 并通过现有属性面板编辑静态 props。
- `h5-runtime-playground` 负责演示 React H5 runtime 消费 `BasicRadioGroup`。

外部系统：

- Java 配置服务、远程字典、用户偏好、权限审批、审计和持久化不在本任务范围内。

## 契约影响

- 是否影响跨包或跨系统契约：否，仅新增 material manifest 条目和 materials 包内部 primitive。
- 是否向后兼容：是，旧 Page Schema 不变。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：后续 npm 发布时按常规 minor 版本发布。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`、`docs/material-layering-architecture.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：低代码前端维护者、未来管理台接入者。
- 当前确认状态：本地 React/Vue H5 materials 和 playground 演示。

## 实现计划

1. 新增 React/Vue `MlcRadioGroup` primitive。
2. 新增 React/Vue `BasicRadioGroup` 物料实现和 manifest。
3. 更新编辑器默认模板、React H5 runtime 示例和 browser smoke。
4. 更新单测、README、架构/AI 状态文档和 changeset。
5. 运行验证并中文提交推送。

## 验收标准

- [x] React/Vue `BasicRadioGroup` manifests 名称、propsSchema、默认值和事件保持一致。
- [x] `BasicRadioGroup` 复用内部 `MlcRadioGroup` 和 `MlcText` primitives。
- [x] `MlcRadioGroup` 不进入 material registry，也不作为公开 npm API。
- [x] 编辑器默认模板能展示基础单选组示例。
- [x] React H5 runtime 示例能渲染基础单选组并绑定 `onChange` action。
- [x] browser smoke 覆盖快捷命令添加基础单选组、画布渲染和源码 schema 写回。
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

- `pnpm test`：通过，102 个测试全部通过。
- `pnpm smoke:browser`：通过，覆盖基础单选组物料存在、默认模板、快捷命令添加、Vue H5 画布渲染、schema 写回和 React H5 runtime 渲染。
- `pnpm demo:check`：通过，编辑器和 H5 runtime 本地联合健康检查通过。
- `git diff --check`：通过，无空白格式问题。

## 发布影响

- 是否需要发布：后续真实 npm 发布时需要。
- 发布对象：`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`。
- 是否需要 changeset：是，minor。
- 是否需要 GitHub tag/release：本任务不单独创建 tag/release，后续统一发布时处理。
- 是否影响 H5 接入：不影响已发布页面；仅新增可选基础物料和内部 primitive。
- 回滚目标：回滚本任务提交即可移除基础单选组物料和内部 `MlcRadioGroup` primitive。

## 风险和阻塞

- 当前仅提供静态本地单选交互，不代表服务端偏好或业务字典；远程选项、保存、校验和审计需要后续宿主能力或业务物料扩展。
- 未来抽 primitives 包时需要重新评估 `MlcRadioGroup` 公开 API 命名和多端一致性。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为业务无关的通用单选组物料。 |
| 2026-08-01 | verified | React/Vue 双端实现、默认模板、H5 runtime 示例、browser smoke、单测、demo check、文档和 changeset 均已完成并验证。 |
