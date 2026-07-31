# TASK-2026-0731-042 编辑器属性面板分组折叠

## 状态

verified

## 目标

优化 Vue3 编辑器 playground 的属性配置体验，将单个长表单改为按内容、样式、数据、行为和其他配置分组，并支持折叠，降低运营配置复杂物料时的查找成本。

## 背景

当前编辑器右侧属性区已经支持基础输入、颜色、开关、数组列表编辑、资源选择器和事件绑定，但 manifest props 仍以单列长表单展示。随着直播入口、券包、门店/达人推荐、楼层锚点等物料增加，运营人员需要在大量字段中查找目标配置，使用体验不够接近正式管理台。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/PROJECT_STATE.md`
- `.ai/AI_CONTEXT.md`
- `.ai/TODO.md`

## 范围

- 将当前节点 props 按字段语义和 setter 分为内容配置、样式配置、数据配置、行为配置和其他配置。
- 每个属性分组支持折叠/展开，并显示组内字段数量。
- 保留现有资源选择器、列表项编辑器、JSON 高级编辑、事件绑定和节点操作能力。
- Browser smoke check 增加属性分组存在性检查。
- 更新 AI 状态和任务记录。

## 不包含

- 不新增或修改 Page Schema 字段。
- 不修改 Material Manifest v1 契约。
- 不拆分 App.vue 为正式组件目录。
- 不实现完整快捷命令、真实后台接口或 visual regression。

## 责任边界

- editor playground 负责属性面板 UI 编排。
- `packages/editor` 继续负责 headless 状态，不承载 UI 分组逻辑。
- renderer/materials 不感知本次 UI 改造。

## 契约影响

- 无 schema 契约变更。
- 无 material manifest 契约变更。
- 无 npm 包公开 API 变更。
- 本次为编辑器 app 层体验优化，向后兼容。

## 对接说明

后续迁入正式管理系统时，可将本次分组规则抽象为独立 inspector 组件；如果 Java 配置平台需要更精确分组，可后续在 manifest 扩展可选 UI metadata。

## 验收标准

- 右侧属性区展示内容配置、样式配置等分组。
- 属性分组可折叠/展开。
- 现有属性输入、列表编辑、资源选择器和事件绑定能力不回退。
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
- 不需要 GitHub tag 或 release。
- 不影响 H5 runtime 接入。
- 回滚方式：回滚本任务提交即可。

## 风险和阻塞

- 当前分组规则基于字段名和 setter 推断，仍不是 manifest 显式声明的最终方案。
- 复杂物料的字段分组后续可能需要产品/运营反馈继续调整。

## 实现结果

- Vue3 编辑器属性区新增 `selectedPropGroups`，按内容、样式、数据、行为和其他配置组织当前物料 props。
- 属性分组支持折叠/展开，展示字段数量和说明。
- 保留原有资源选择器、列表项编辑器、JSON 高级编辑、事件绑定和节点操作能力。
- 修复新 profile 首次打开编辑器时默认选中旧 `node_hero` 导致右侧属性区为空的问题，改为选中当前 schema 的首个节点。
- Browser smoke check 增加属性分组存在和折叠/展开交互覆盖。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，29 个测试全部通过。
- `pnpm smoke:browser`：通过，覆盖属性分组存在、样式配置折叠/展开、模板应用、模式切换、编辑器内置 runtime 和 React H5 runtime。

## 未验证项

- 未做 visual regression 截图基线。
- 未收集真实运营使用反馈，字段分组规则后续可能继续调整。

## 变更记录

- 2026-07-31：创建 ready 工作项。
- 2026-07-31：进入实现，开始调整 Vue3 编辑器属性面板分组折叠。
- 2026-07-31：完成实现与验证，状态流转为 verified。
