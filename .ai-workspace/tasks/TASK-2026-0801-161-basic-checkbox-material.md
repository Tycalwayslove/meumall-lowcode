# TASK-2026-0801-161-basic-checkbox-material

## 标题

新增 BasicCheckbox 通用复选物料

## 状态

verified

## 目标

在当前 `BasicInput`、`BasicTextarea`、`BasicSelect`、`BasicSwitch` 基础表单物料之后，补齐运营可拖拽使用的 `BasicCheckbox` 通用复选物料，为协议确认、选项勾选、页面偏好展示等业务无关布尔勾选场景提供统一基础物料。

## 背景

当前物料库已有开关物料，但开关更适合“即时启停”语义，复选框更适合“阅读确认、协议勾选、列表项选择、可选偏好”等表单语义。为了继续保持基础组件 -> 通用物料 -> 业务物料的架构方向，本任务先在 React/Vue materials 包内部新增 `MlcCheckbox` runtime primitive，再封装为 `BasicCheckbox` 物料，暂不抽独立 primitives npm 包。

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

- React/Vue H5 materials 内部新增 `MlcCheckbox` primitive。
- React H5 物料包新增 `BasicCheckbox`。
- Vue H5 物料包新增 `BasicCheckbox`。
- Material Manifest 注册 `BasicCheckbox`，支持标签、辅助说明、默认勾选、禁用态、区块背景、文案色、辅助文案色、勾选色、边框色、勾选标记色、圆角和上下留白配置。
- 编辑器默认模板和 React H5 runtime 示例加入 `BasicCheckbox`。
- browser smoke 覆盖基础复选框从快捷命令添加、Vue H5 画布渲染和 schema 写回。
- 补充单测、README、架构文档、changeset 和 AI 状态。

不包含：

- 不实现复选框组、多选数组、表单提交、校验规则、真实协议确认、权限控制、审批流或服务端保存。
- 不接 Java 配置项、用户偏好、会员协议、活动状态或营销规则接口。
- 不改变 Page Schema v1 节点结构。
- 不把 `MlcCheckbox` 抽为公开 primitives npm 包。

## 责任边界

当前仓库：

- `materials-*` 提供 `BasicCheckbox` 物料实现、manifest 和内部 primitive。
- `editor-playground` 只消费 manifest 并通过现有属性面板编辑静态 props。
- `h5-runtime-playground` 负责演示 React H5 runtime 消费 `BasicCheckbox`。

外部系统：

- Java 配置服务、真实协议状态、用户偏好、权限审批、审计和持久化不在本任务范围内。

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

1. 新增 React/Vue `MlcCheckbox` primitive。
2. 新增 React/Vue `BasicCheckbox` 物料实现和 manifest。
3. 更新编辑器默认模板、React H5 runtime 示例和 browser smoke。
4. 更新单测、README、架构/AI 状态文档和 changeset。
5. 运行验证并中文提交推送。

## 验收标准

- [x] React/Vue `BasicCheckbox` manifests 名称、propsSchema、默认值和事件保持一致。
- [x] `BasicCheckbox` 复用内部 `MlcCheckbox` 和 `MlcText` primitives。
- [x] `MlcCheckbox` 不进入 material registry，也不作为公开 npm API。
- [x] 编辑器默认模板能展示基础复选框示例。
- [x] React H5 runtime 示例能渲染基础复选框并绑定 `onChange` action。
- [x] browser smoke 覆盖快捷命令添加基础复选框、画布渲染和源码 schema 写回。
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

- `pnpm test`：通过，完成构建、架构边界检查和 101 个 Node 测试。
- `pnpm smoke:browser`：通过，覆盖基础复选框物料存在、默认模板展示、快捷命令添加、Vue H5 画布渲染、源码 schema 写回、编辑器内置 runtime 和 React H5 runtime 渲染。
- `pnpm demo:check`：通过，本地 Vue3 编辑器和 React H5 runtime 联合启动健康检查通过。
- `git diff --check`：通过。

## 发布影响

- 是否需要发布：后续真实 npm 发布时需要。
- 发布对象：`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`。
- 是否需要 changeset：是，minor。
- 是否需要 GitHub tag/release：本任务不单独创建 tag/release，后续统一发布时处理。
- 是否影响 H5 接入：不影响已发布页面；仅新增可选基础物料和内部 primitive。
- 回滚目标：回滚本任务提交即可移除基础复选框物料和内部 `MlcCheckbox` primitive。

## 风险和阻塞

- 当前仅提供本地勾选交互，不代表服务端协议或偏好状态；真实保存、校验和审计需要后续宿主能力或业务物料扩展。
- 未来抽 primitives 包时需要重新评估 `MlcCheckbox` 公开 API 命名和多端一致性。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为业务无关的通用复选物料。 |
| 2026-08-01 | verified | 已新增 React/Vue `BasicCheckbox`、内部 `MlcCheckbox`、示例链路、smoke 覆盖、changeset 和文档记录，并完成验证。 |
