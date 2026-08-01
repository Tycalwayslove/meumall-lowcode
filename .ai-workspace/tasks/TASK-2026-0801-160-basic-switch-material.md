# TASK-2026-0801-160-basic-switch-material

## 标题

新增 BasicSwitch 通用开关物料

## 状态

verified

## 目标

在已有 `MlcSwitch` runtime primitive 的基础上，补齐运营可拖拽使用的 `BasicSwitch` 通用开关物料，为活动偏好、表单协议、是否启用、是否展示等业务无关二元配置场景提供统一基础物料。

## 背景

当前基础表单物料已具备单行输入、多行输入和静态选择框，但还缺少独立可拖拽的布尔开关。`MlcSwitch` 已在 `LeadFormBlock` 内部使用，说明 runtime primitive 已经具备基础交互能力；本任务将其封装成 `BasicSwitch`，同时轻量补齐开关色参数，继续强化基础组件 -> 通用物料 -> 业务物料的分层。

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

- React/Vue `MlcSwitch` primitive 增加向后兼容的开关色参数。
- React H5 物料包新增 `BasicSwitch`。
- Vue H5 物料包新增 `BasicSwitch`。
- Material Manifest 注册 `BasicSwitch`，支持标签、辅助说明、默认状态、禁用态、区块背景、文案色、辅助文案色、开启色、关闭色、滑块色和上下留白配置。
- 编辑器默认模板和 React H5 runtime 示例加入 `BasicSwitch`。
- browser smoke 覆盖基础开关从快捷命令添加、Vue H5 画布渲染和 schema 写回。
- 补充单测、README、架构文档、changeset 和 AI 状态。

不包含：

- 不实现真实表单提交、服务端开关保存、权限控制、审批流、开关组或复杂规则联动。
- 不接 Java 配置项、活动状态、营销规则或用户偏好接口。
- 不改变 Page Schema v1 节点结构。
- 不把 `MlcSwitch` 抽为公开 primitives npm 包。

## 责任边界

当前仓库：

- `materials-*` 提供 `BasicSwitch` 物料实现、manifest 和内部 primitive 样式参数。
- `editor-playground` 只消费 manifest 并通过现有属性面板编辑静态 props。
- `h5-runtime-playground` 负责演示 React H5 runtime 消费 `BasicSwitch`。

外部系统：

- Java 配置服务、真实活动开关、权限审批、审计和持久化不在本任务范围内。

## 契约影响

- 是否影响跨包或跨系统契约：否，仅新增 material manifest 条目和 materials 包内部 primitive 可选参数。
- 是否向后兼容：是，旧 Page Schema 不变，旧 `MlcSwitch` 调用不传新参数仍保持默认样式。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：后续 npm 发布时按常规 minor 版本发布。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`、`docs/material-layering-architecture.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：低代码前端维护者、未来管理台接入者。
- 当前确认状态：本地 React/Vue H5 materials 和 playground 演示。

## 实现计划

1. 扩展 React/Vue `MlcSwitch` 可选开关色参数，保持默认行为不变。
2. 新增 React/Vue `BasicSwitch` 物料实现和 manifest。
3. 更新编辑器默认模板、React H5 runtime 示例和 browser smoke。
4. 更新单测、README、架构/AI 状态文档和 changeset。
5. 运行验证并中文提交推送。

## 验收标准

- [x] React/Vue `BasicSwitch` manifests 名称、propsSchema、默认值和事件保持一致。
- [x] `BasicSwitch` 复用内部 `MlcSwitch` 和 `MlcText` primitives。
- [x] `MlcSwitch` 新增样式参数不改变旧调用默认效果。
- [x] 编辑器默认模板能展示基础开关示例。
- [x] React H5 runtime 示例能渲染基础开关并绑定 `onChange` action。
- [x] browser smoke 覆盖快捷命令添加基础开关、画布渲染和源码 schema 写回。
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

- `pnpm test`：通过，完成构建、架构边界检查和 100 个 Node 测试。
- `pnpm smoke:browser`：通过，覆盖基础开关物料存在、默认模板展示、快捷命令添加、Vue H5 画布渲染、源码 schema 写回、编辑器内置 runtime 和 React H5 runtime 渲染。
- `pnpm demo:check`：通过，本地 Vue3 编辑器和 React H5 runtime 联合启动健康检查通过。
- `git diff --check`：通过。

## 发布影响

- 是否需要发布：后续真实 npm 发布时需要。
- 发布对象：`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`。
- 是否需要 changeset：是，minor。
- 是否需要 GitHub tag/release：本任务不单独创建 tag/release，后续统一发布时处理。
- 是否影响 H5 接入：不影响已发布页面；仅新增可选基础物料和向后兼容 primitive 参数。
- 回滚目标：回滚本任务提交即可移除基础开关物料并恢复 `MlcSwitch` 参数。

## 风险和阻塞

- 当前仅提供本地开关交互，不代表服务端配置状态；真实开关保存、权限和审计需要后续宿主能力或业务物料扩展。
- 开关样式参数只影响 H5 runtime materials 内部 primitive，未来抽 primitives 包时需要重新评估公开 API 命名。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为无业务绑定的通用布尔开关物料。 |
| 2026-08-01 | verified | 已新增 React/Vue `BasicSwitch`、示例链路、smoke 覆盖、changeset 和文档记录，并完成验证。 |
