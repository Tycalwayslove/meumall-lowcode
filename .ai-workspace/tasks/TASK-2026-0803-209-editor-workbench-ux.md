# TASK-2026-0803-209-editor-workbench-ux

## 状态

verified

## 目标

优化 Vue3 编辑器 playground 的工作台信息架构，让运营能更快完成“选择模板或物料、在真实设备画布中拖拽搭建、选中物料后修改关键属性”的主流程。

## 背景

当前编辑器已具备模板、物料、结构树、画布、属性、发布、配置和状态等能力，但左侧、右侧信息堆叠较重，画布设备模拟范围较窄，右侧默认焦点不够集中。用户明确要求：模板和物料库通过 Tab 分类；结构放到中间画布右下方；画布支持更多手机/iPad 尺寸并支持拖动；右侧优先展示选中物料属性，减少混乱。

## 涉及包或系统

- `apps/editor-playground`
- 文档与 AI 工作流

## 范围

包含：

- 左侧面板改为模板/物料 Tab。
- 结构树从左侧移到画布右下角浮层。
- 扩展画布设备预设，覆盖常见 iPhone、Android 和 iPad 尺寸。
- 画布支持拖动画布位置和复位。
- 右侧面板改为属性优先的 Tab 信息架构，选中物料时默认聚焦属性编辑。
- 更新 smoke check、AI 记忆和任务验证记录。

不包含：

- 不修改 Page Schema v1 或 Material Manifest v1。
- 不修改 renderer、runtime、materials 行为。
- 不接真实 Java 配置平台。
- 不实现完整 Chrome DevTools 设备数据库、旋转模拟、DPR 模拟、网络模拟或浏览器 UA 模拟。

## 责任边界

当前仓库：

- Vue3 editor playground 负责体验演示和管理台迁移参考。
- `@meumall/lowcode-editor` 现有 viewport preset API 可继续作为基础协议；本任务不扩展公开 API。

外部系统：

- Java 管理台后续负责接入真实布局容器、权限、协作锁、审批和发布服务。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无新增契约。
- 是否向后兼容：是。仅调整 playground UI 和本地交互。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：需要。
- 对接说明路径：`.ai/AI_CONTEXT.md`、`.ai/PROJECT_STATE.md`
- 需要确认的角色：无。
- 当前确认状态：无需确认。

## 实现计划

1. 梳理 Vue3 editor playground 的左/中/右信息结构。
2. 新增本地 UI Tab 状态和画布拖拽状态。
3. 调整模板/物料/结构树/右侧属性面板布局。
4. 扩展设备预设并接入画布工具条。
5. 补充 smoke check、AI 记忆和验证记录。

## 验收标准

- [x] 左侧只展示模板/物料 Tab，二者互不堆叠。
- [x] 结构树显示在画布右下方，不再占用左侧主工作区。
- [x] 画布设备预设包含 360/390/430 以外的常见手机和 iPad 尺寸。
- [x] 画布可通过拖动调整位置，并可复位。
- [x] 右侧默认进入属性 Tab，选中物料后优先展示节点信息、资源选择和属性分组。
- [x] 页面设置、发布、数据配置和状态信息被收纳到右侧 Tab，不再打断属性编辑主路径。
- [x] 验证命令通过，并在任务文件记录结果。

## 验证命令

```bash
pnpm typecheck
pnpm build
pnpm smoke:browser
git diff --check
```

## 发布影响

- 是否需要发布：不需要单独发布。
- 发布对象：无。
- 是否需要 changeset：不需要。仅 playground UI 调整，不改变可发布包公开 API。
- 是否需要 GitHub tag/release：不需要。
- 回滚目标：回滚本任务提交即可。
- smoke check：`pnpm smoke:browser` 覆盖编辑器关键路径。

## 风险和阻塞

- 风险：设备模拟只模拟画布宽度/高度和可视区域，不模拟 UA、DPR、网络和浏览器内核差异。
- 阻塞：无。

## 验证结果

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `pnpm typecheck` | 通过 | TypeScript project references、Vue3 editor playground 和 React H5 runtime playground 类型检查通过。 |
| `pnpm build` | 通过 | Vue3 editor playground 和 React H5 runtime playground 生产构建通过；Vite 仍提示 playground chunk 超过 500 kB，这是既有提示。 |
| `pnpm smoke:browser` | 通过 | 覆盖左侧物料/模板 Tab、画布设备下拉、iPad 尺寸、结构浮层、右侧 Tab、发布/页面/模板/属性编辑和 H5 runtime 主链路。 |
| `git diff --check` | 通过 | 无空白错误。 |

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-03 | ready | 创建任务，准备优化 Vue3 编辑器工作台信息架构和画布体验。 |
| 2026-08-03 | implemented | 已完成左侧物料/模板 Tab、画布右下结构浮层、扩展设备预设、画布平移/复位和右侧属性优先 Tab。 |
| 2026-08-03 | verified | 验证通过：`pnpm typecheck`、`pnpm build`、`pnpm smoke:browser` 和 `git diff --check`。 |
