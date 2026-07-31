# TASK-2026-0731-011-editor-page-templates

## 状态

verified

## 目标

为 Vue3 编辑器 playground 增加页面模板库，让运营可以一键载入常见电商页面骨架，再基于现有拖拽、属性编辑、发布和 React H5 预览能力继续调整。

## 背景

当前编辑器已经有基础物料、画布操作、发布预览和 React H5 handoff，但运营仍需要从当前示例或空白结构开始搭建。电商活动页往往有固定骨架，例如大促活动页、新人券页、商品专题页。模板库可以显著降低上手成本，也能让基础物料库的组合方式更清晰。

## 涉及包或系统

- `apps/editor-playground`
- `@meumall/lowcode-schema`
- Vue H5 materials
- React H5 runtime handoff

## 范围

包含：

- 新增页面模板数据源。
- 提供至少三个模板：大促活动页、新人券页、商品专题页。
- 编辑器左侧展示模板列表。
- 支持一键应用模板到当前编辑器状态。
- 当前页面有未保存修改时应用模板需要确认。
- 模板使用现有基础物料，能通过 Vue 预览和 React H5 handoff 渲染。
- 更新文档、项目状态和验证报告。

不包含：

- 服务端模板市场。
- 模板权限、版本管理和审核。
- 模板缩略图生成。
- 真实素材库和商品库接入。

## 责任边界

当前仓库：

- 提供本地模板库和编辑器应用模板的参考实现。

外部系统：

- Java 配置平台后续负责模板持久化、权限、上下架和审计。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无。
- 是否向后兼容：是，仅新增 playground 能力。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：本地 playground 验证。

## 实现计划

1. 新增任务并流转到 `in_progress`。
2. 新增 `pageTemplates.ts` 管理模板 schema。
3. 编辑器左侧新增模板面板和应用模板逻辑。
4. 更新 README、项目状态、TODO 和验证报告。
5. 运行类型检查、构建和本地 smoke check。

## 验收标准

- [x] 模板库至少包含三个模板。
- [x] 编辑器左侧能展示模板名称和说明。
- [x] 点击模板能替换当前 schema 并选中首个节点。
- [x] 当前 dirty 时应用模板会确认。
- [x] 模板 schema 校验通过。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] 编辑器和 React H5 runtime smoke check 通过。

## 验证命令

```bash
pnpm typecheck
pnpm build
curl -I http://localhost:5173/
curl -I http://localhost:5174/
node --input-type=module - <<'NODE'
import { pageTemplates } from './apps/editor-playground/src/pageTemplates.ts';
import { validateLowcodePageSchema } from './packages/schema/src/index.ts';
if (pageTemplates.length < 3) throw new Error('template count less than 3');
for (const template of pageTemplates) {
  const result = validateLowcodePageSchema(template.schema);
  if (!result.valid) throw new Error(`${template.id}: ${result.errors.join('; ')}`);
}
NODE
```

## 发布影响

- 是否需要发布：否。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：编辑器和 React H5 runtime 本地访问返回 200。

## 验证结果

2026-07-31：

- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- 页面模板 schema 校验通过，共 3 个模板。
- `curl -I http://localhost:5173/` 返回 `HTTP/1.1 200 OK`。
- `curl -I http://localhost:5174/` 返回 `HTTP/1.1 200 OK`。
- 验证报告：`.ai/test-reports/TASK-2026-0731-011-editor-page-templates.md`

## 风险和阻塞

- 当前模板为本地静态模板，后续需要 Java 配置平台管理模板版本和权限。
- 模板素材仍使用远程示例图片，不代表真实素材库。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确新增编辑器页面模板库。 |
| 2026-07-31 | in_progress | 开始实现本地页面模板库和编辑器应用模板能力。 |
| 2026-07-31 | verified | 类型检查、构建、模板 schema 校验和本地 smoke check 通过。 |
