# TASK-2026-0731-048 编辑器结构树导航增强

## 状态

verified

## 目标

增强 Vue3 编辑器结构树导航能力，让活动页节点较多时仍能快速搜索、折叠容器、定位当前节点并回到画布对应位置。

## 背景

当前编辑器已经具备物料搜索、快捷命令面板、节点右键菜单和键盘快捷键，但结构树仍是完整平铺展示。活动页模板和高阶物料越来越多后，运营人员在左侧结构树中查找特定楼层、容器或商品模块会变慢，也不容易快速定位画布中的对应节点。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/PROJECT_STATE.md`
- `.ai/AI_CONTEXT.md`
- `.ai/TODO.md`

## 范围

- 左侧结构树增加关键词搜索。
- 搜索范围包含物料标题、组件名、节点 id 和节点 meta name。
- 结构树支持容器节点折叠和展开。
- 搜索命中时自动展示命中节点及其祖先，避免被折叠状态隐藏。
- 选中结构树节点后可滚动 H5 画布到对应节点。
- 当前选中节点变化时，结构树确保当前节点可见。
- Browser smoke 覆盖结构树搜索和快速定位路径。

## 不包含

- 不新增 schema 字段。
- 不新增 editor headless command API。
- 不引入第三方 tree 组件。
- 不实现跨页面节点搜索。
- 不实现节点重命名弹窗或复杂图层管理器。

## 责任边界

- `apps/editor-playground` 负责结构树 UI、搜索状态、折叠状态和画布定位。
- `packages/editor` 仍只负责 headless schema/editor state 命令。
- renderer 包不承担结构树导航状态。

## 契约影响

- 不改变 Page Schema、Material Manifest、renderer API、editor npm API 或 adapters API。
- 属于 Vue3 editor playground 的体验增强，旧页面 schema 不受影响。

## 对接说明

后续迁入正式管理台时，可保留本任务的搜索匹配逻辑和折叠状态策略；如果管理台有统一树组件，可把匹配、可见性和定位函数迁移到组件适配层。

## 验收标准

- 结构树显示搜索框和节点数量摘要。
- 输入关键词后只展示匹配节点及其祖先。
- 搜索命中容器子节点时，即使容器之前折叠也能显示命中路径。
- 可折叠/展开包含子节点的结构树节点。
- 点击结构树节点会选中节点并滚动 H5 画布到对应节点。
- 当前选中节点不会因为折叠状态从结构树中消失。
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

## 实现记录

- 左侧结构树新增 `outlineKeyword` 搜索输入和可见数量摘要。
- 结构树搜索覆盖物料标题、组件名、节点 id、节点 meta name 和物料分类。
- `OutlineRow` 增加祖先链和子节点标记，UI 层新增 `visibleOutlineRows`，不影响底层拖拽、移动和多选逻辑继续使用完整 `outlineRows`。
- 容器节点支持折叠和展开，折叠状态会在 schema 节点变化后清理失效项。
- 搜索时展示命中节点及其祖先路径，不受折叠状态影响。
- 当前选中节点变化时自动展开祖先路径，避免选中节点被结构树折叠隐藏。
- 点击结构树节点会选中节点，并滚动 H5 画布到对应 `data-lowcode-node-id` 节点。
- Browser smoke 新增结构树搜索、折叠和定位流程覆盖。

## 验证记录

- 2026-07-31：`pnpm typecheck` 通过。
- 2026-07-31：`pnpm build` 通过。
- 2026-07-31：`pnpm test` 通过，32 个测试全部通过。
- 2026-07-31：`pnpm smoke:browser` 通过，覆盖结构树搜索、折叠、命中路径展示和节点定位。

## 发布影响

- 暂不发布 npm。
- 不影响 schema 兼容性。
- 不影响 H5 runtime 接入。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可。

## 风险和阻塞

- 结构树搜索需要在折叠状态和命中路径之间保持一致，避免用户搜索时看不到结果。
- 画布滚动依赖节点 DOM 标记，若未来 renderer 标记规则调整，需要同步更新定位函数。

## 变更记录

- 2026-07-31：创建 ready 工作项。
- 2026-07-31：进入实现，补充结构树搜索、折叠和画布定位。
- 2026-07-31：实现完成并通过验证，状态更新为 verified。
