# TASK-2026-0801-159-basic-textarea-material

## 标题

新增 BasicTextarea 通用多行输入物料

## 状态

verified

## 目标

在已具备 `MlcTextarea` runtime primitive 的基础上，补齐运营可拖拽使用的 `BasicTextarea` 通用多行输入物料，为活动备注、说明收集、表单备注和规则输入等业务无关场景提供统一基础物料。

## 背景

当前基础物料已包含按钮、单行输入、选择框、文本、分割线、图片、标签、卡片、轮播和视频，但多行输入仍只能作为 `LeadFormBlock` 内部实现复用。为了继续稳固基础组件 -> 通用物料 -> 业务物料的分层，需要把多行输入沉淀为独立 `BasicTextarea`，并保持 React/Vue H5 manifest 语义一致。

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

- React H5 物料包新增 `BasicTextarea`。
- Vue H5 物料包新增 `BasicTextarea`。
- Material Manifest 注册 `BasicTextarea`，支持标签、占位、辅助说明、默认值、行数、禁用态、颜色、圆角和上下留白配置。
- 编辑器默认模板和 React H5 runtime 示例加入 `BasicTextarea`。
- browser smoke 覆盖基础多行输入从快捷命令添加、Vue H5 画布渲染和 schema 写回。
- 补充单测、README、架构文档、changeset 和 AI 状态。

不包含：

- 不实现真实表单提交、校验规则、字数统计、自动高度、富文本、Markdown 或敏感词审核。
- 不接 Java 表单服务、活动备注接口或业务风控。
- 不改变 Page Schema v1 节点结构。
- 不改变 `MlcTextarea` primitive 的公开边界；它仍是 materials 包内部实现细节。

## 责任边界

当前仓库：

- `materials-*` 提供 `BasicTextarea` 物料实现和 manifest。
- `editor-playground` 只消费 manifest 并通过现有属性面板编辑静态 props。
- `h5-runtime-playground` 负责演示 React H5 runtime 消费 `BasicTextarea`。

外部系统：

- Java 表单服务、活动备注保存、风控审核和真实提交链路不在本任务范围内。

## 契约影响

- 是否影响跨包或跨系统契约：否，仅新增 material manifest 条目和包内导出。
- 是否向后兼容：是，旧 Page Schema 不变。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：后续 npm 发布时按常规 minor 版本发布。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`packages/materials-h5/README.md`、`packages/materials-vue-h5/README.md`、`docs/material-layering-architecture.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：低代码前端维护者、未来管理台接入者。
- 当前确认状态：本地 React/Vue H5 materials 和 playground 演示。

## 实现计划

1. 新增 React/Vue `BasicTextarea` 物料实现和 manifest。
2. 更新编辑器默认模板、React H5 runtime 示例和 browser smoke。
3. 更新单测、README、架构/AI 状态文档和 changeset。
4. 运行验证并中文提交推送。

## 验收标准

- [x] React/Vue `BasicTextarea` manifests 名称、propsSchema、默认值和事件保持一致。
- [x] `BasicTextarea` 复用内部 `MlcTextarea` 和 `MlcText` primitives，不进入 primitives 公开 API。
- [x] `BasicTextarea.rows` 使用 number setter 并声明可编辑范围。
- [x] 编辑器默认模板能展示基础多行输入示例。
- [x] React H5 runtime 示例能渲染基础多行输入并绑定 `onChange` action。
- [x] browser smoke 覆盖快捷命令添加基础多行输入、画布渲染和源码 schema 写回。
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

- `pnpm test`：通过，包含 build、architecture check 和 99 个 Node test。
- `pnpm smoke:browser`：通过，已覆盖基础多行输入物料存在、默认模板渲染、快捷命令添加、Vue H5 画布 textarea 渲染、源码 schema 写回、编辑器 runtime 和 React H5 runtime 渲染。
- `pnpm demo:check`：通过，editor、H5 runtime、published pageId 和 preview releaseId 入口健康检查正常。
- `git diff --check`：通过。

## 发布影响

- 是否需要发布：后续真实 npm 发布时需要。
- 发布对象：`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`。
- 是否需要 changeset：是，minor。
- 是否需要 GitHub tag/release：本任务不单独创建 tag/release，后续统一发布时处理。
- 是否影响 H5 接入：不影响已发布页面；仅新增可选基础物料。
- 回滚目标：回滚本任务提交即可移除基础多行输入物料。

## 风险和阻塞

- 当前仅提供基础多行输入，不内置校验、提交和字数统计；这些能力应由后续表单协议或业务物料扩展。
- 行数配置只影响初始显示高度，移动端实际输入体验仍受宿主浏览器/容器影响。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为无业务绑定的通用多行输入物料。 |
| 2026-08-01 | verified | 完成 React/Vue `BasicTextarea` 物料、默认模板、React H5 runtime 示例、browser smoke、单测、changeset 和文档状态更新。 |
