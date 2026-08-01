# TASK-2026-0801-158-basic-select-material

## 标题

新增 BasicSelect 通用选择框物料

## 状态

verified

## 目标

在现有 `BasicButton`、`BasicInput` 等通用基础物料之上，补齐无业务绑定的单选选择框能力，为后续表单类物料和业务筛选组件提供更稳定的基础控件层。

## 背景

低代码编辑器需要先建立可复用、可跨端迁移的基础组件体系，再在其上组合业务物料。选择框是运营活动页、留资表单、条件配置和基础筛选中常见的输入控件，应先沉淀为 `MlcSelect` primitive，再封装成 `BasicSelect` 物料，避免业务组件直接重复实现选择交互。

## 涉及包或系统

- `packages/materials-h5`
- `packages/materials-vue-h5`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `scripts/browser-smoke.mjs`
- `.ai/`
- `.changeset/`

## 范围

包含：

- React H5 primitive 新增 `MlcSelect`。
- Vue H5 primitive 新增 `MlcSelect`。
- React/Vue H5 物料包新增 `BasicSelect`。
- Material Manifest 注册 `BasicSelect`，支持静态 options、默认值、禁用、颜色、圆角和上下留白配置。
- 编辑器默认模板和 React H5 runtime 示例加入 `BasicSelect`。
- browser smoke 覆盖基础选择框从快捷命令添加、Vue H5 画布渲染和 schema 写回。
- 补充单测、README、架构文档、changeset 和 AI 状态。

不包含：

- 不实现远程选项数据源、级联选择、多选、搜索选择、弹层 picker 或虚拟列表。
- 不接 Java 字典、商品类目、会员标签等真实业务数据。
- 不改变 Page Schema v1 节点结构。
- 不改变编辑器资源库、渲染器或发布平台边界。

## 责任边界

当前仓库：

- `materials-*` 提供通用选择框 primitive 和物料 manifest。
- `editor-playground` 只消费 manifest 并通过现有属性面板编辑静态 options。
- `h5-runtime-playground` 负责演示 React H5 runtime 消费 `BasicSelect`。

外部系统：

- Java 字典服务、真实类目配置、表单提交和业务联动不在本任务范围内。

## 契约影响

- 是否影响跨包或跨系统契约：否，仅新增 material manifest 条目和包内导出。
- 是否向后兼容：是，旧 Page Schema 不变。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：后续 npm 发布时按常规 minor 版本发布。

## 实现计划

1. 新增 React/Vue `MlcSelect` primitive。
2. 新增 React/Vue `BasicSelect` 物料实现和 manifest。
3. 更新编辑器模板、React H5 runtime 示例和 browser smoke。
4. 更新单测、README、架构/AI 状态文档和 changeset。
5. 运行验证并中文提交推送。

## 验收标准

- [x] `MlcSelect` 不进入 material registry，只作为 runtime primitive 被基础物料复用。
- [x] React/Vue `BasicSelect` manifests 名称、propsSchema、默认值和事件保持一致。
- [x] `BasicSelect.options` 使用静态数组配置，运行时无业务远程依赖。
- [x] 编辑器默认模板能展示基础选择框示例。
- [x] React H5 runtime 示例能渲染基础选择框并绑定 `onChange` action。
- [x] browser smoke 覆盖快捷命令添加基础选择框、画布渲染和源码 schema 写回。
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

- `pnpm test`：通过，包含 build、architecture check 和 98 个 Node test。
- `pnpm smoke:browser`：通过，已覆盖基础选择框物料存在、默认模板渲染、快捷命令添加、Vue H5 画布 select 渲染、源码 schema 写回、编辑器 runtime 和 React H5 runtime 渲染。
- `pnpm demo:check`：通过，editor、H5 runtime、published pageId 和 preview releaseId 入口健康检查正常。
- `git diff --check`：通过。

## 发布影响

- 是否需要发布：后续真实 npm 发布时需要。
- 发布对象：`@meumall/lowcode-materials-h5`、`@meumall/lowcode-materials-vue-h5`。
- 是否需要 changeset：是，minor。
- 是否需要 GitHub tag/release：本任务不单独创建 tag/release，后续统一发布时处理。
- 是否影响 H5 接入：不影响已发布页面；仅新增可选基础物料。
- 回滚目标：回滚本任务提交即可移除基础选择框物料。

## 风险和阻塞

- 静态 options 目前通过 textarea 配置，后续可在编辑器层独立升级为结构化数组编辑器。
- 真实业务字典和远程选项需要独立数据源契约，不能塞进本基础物料。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为无业务绑定的通用单选选择框物料。 |
| 2026-08-01 | verified | 完成 React/Vue `MlcSelect` primitive、`BasicSelect` 物料、默认模板、React H5 runtime 示例、browser smoke、单测、changeset 和文档状态更新。 |
