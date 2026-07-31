# TASK-2026-0731-040 编辑器体验首轮优化

## 状态

verified

## 目标

优化 Vue3 编辑器 playground 的基础使用体验，让运营人员更容易完成模板选择、物料查找、画布编辑、当前节点识别和发布状态判断。

## 背景

当前编辑器已经具备模板、物料、画布、属性、资源库、发布检查和版本管理能力，但页面信息密度过高，左侧物料列表过长，顶部动作入口拥挤，画布缺少清晰状态摘要，右侧当前节点信息不够直观，导致实操体验较差。

## 涉及包或系统

- `apps/editor-playground`
- `.ai/PROJECT_STATE.md`
- `.ai/AI_CONTEXT.md`
- `.ai/TODO.md`

## 范围

- 增加物料搜索和分类过滤。
- 增强顶部与画布状态摘要。
- 优化当前节点信息展示。
- 调整编辑器 shell、面板、按钮、列表、输入框和画布工具栏的视觉层级与交互状态。
- 保持现有拖拽、模板、属性、资源、发布和版本能力不变。

## 不包含

- 不新增真实后端接口。
- 不改变 Page Schema、Material Manifest 或 renderer 公开 API。
- 不重写编辑器为正式管理台。
- 不实现完整 E2E/visual regression 框架。

## 责任边界

- Vue3 editor playground 负责交互壳层和集成演示。
- `packages/editor` 继续负责 headless 编辑器状态，不承载 UI 体验样式。
- renderer/materials 不感知本次 UI 改造。

## 契约影响

- 无 schema 契约变更。
- 无 material manifest 契约变更。
- 无 npm 包公开 API 变更。
- 本次为编辑器 app 层体验优化，向后兼容。

## 对接说明

后续迁入管理系统时，可参考本次新增的物料过滤、状态摘要和节点信息结构，将真实素材/模板/发布接口替换到现有 client 边界中。

## 验收标准

- 左侧物料支持关键词搜索和分类过滤。
- 画布顶部可看到节点数、当前选中、校验/发布状态和未保存状态。
- 右侧属性区当前节点卡片展示组件名、节点 id、父级和层级位置。
- 现有模板应用、源码/预览/设计模式切换、H5 runtime smoke check 不回退。
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

- 当前仍是 playground 级编辑器，管理台级权限、审批、服务端保存和真实资源中心仍需后续接入。
- 样式优化只能缓解首轮使用负担，复杂属性表单和跨父级多选拖拽仍需后续专项设计。

## 实现结果

- 左侧物料区新增关键词搜索、分类过滤和匹配数量展示。
- 画布顶部新增工作区状态摘要，展示节点数、当前选中、校验、发布和保存状态。
- 右侧属性区当前节点卡片新增组件分类、节点 id、父级和层级位置。
- 编辑器 shell 补充按钮、输入框、列表、画布工具栏和窄屏场景的视觉反馈与响应式兜底。

## 验证结果

- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm test`：通过，28 个测试全部通过。
- `pnpm smoke:browser`：通过，覆盖 Vue3 编辑器 shell、模板搜索/应用、源码/预览/设计模式切换、编辑器内置 runtime 和 React H5 runtime。

## 未验证项

- 未做人工 visual regression 对比；后续需要补充截图基线或浏览器交互 E2E。

## 变更记录

- 2026-07-31：创建 ready 工作项。
- 2026-07-31：进入实现，优化编辑器物料查找、状态摘要和基础交互层级。
- 2026-07-31：完成实现与验证，状态流转为 verified。
