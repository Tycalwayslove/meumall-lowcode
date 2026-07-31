# TASK-2026-0731-047 编辑器节点快捷操作

## 状态

verified

## 目标

增强 Vue3 编辑器节点操作体验，让运营或前端同学在画布和结构树里可以通过右键菜单与键盘快捷键完成复制、粘贴、创建副本、删除、上移、下移和前后插入等高频动作。

## 背景

当前编辑器已经具备画布上下文工具条和快捷命令面板，但真实搭页时用户仍需要频繁移动鼠标到顶部工具条或右侧属性区，节点级操作不够贴近画布和结构树。为了提升实操感，需要把已有 headless editor 命令以更自然的交互方式暴露出来。

## 涉及包或系统

- `apps/editor-playground`
- `scripts/browser-smoke.mjs`
- `.ai/PROJECT_STATE.md`
- `.ai/AI_CONTEXT.md`
- `.ai/TODO.md`

## 范围

- H5 画布节点支持右键打开节点操作菜单。
- 左侧结构树节点支持右键打开节点操作菜单。
- 画布上下文工具条补充更多操作入口。
- 节点菜单支持复制节点、粘贴节点、创建副本、删除节点、上移、下移、前方插入、后方插入和加入容器。
- 全局快捷键支持 Delete/Backspace 删除、Ctrl/Meta+C 复制、Ctrl/Meta+V 粘贴、Ctrl/Meta+D 创建副本、Ctrl/Meta+Z 撤销、Ctrl/Meta+Shift+Z 或 Ctrl+Y 重做。
- 快捷键在输入框、textarea、select、contenteditable 或命令面板输入中不触发节点操作。
- 补充 browser smoke 覆盖右键菜单和核心键盘快捷键路径。

## 不包含

- 不新增 schema 字段。
- 不新增 renderer 公共 API。
- 不引入第三方菜单组件库。
- 不实现跨父级多选批量菜单。
- 不接入正式管理台权限、审计或协作锁。

## 责任边界

- `apps/editor-playground` 负责 Vue3 编辑器交互壳层和节点菜单 UI。
- `packages/editor` 继续负责 headless 节点命令，本任务只复用现有命令。
- `packages/renderer-vue-h5` 只提供已有节点 DOM 标记和编辑态能力，本任务不改变其公共契约。

## 契约影响

- 不改变 Page Schema、Material Manifest、renderer API 或 npm 公开 API。
- 属于 Vue3 editor playground 的体验增强，旧页面 schema 不受影响。

## 对接说明

后续迁入 Java 管理系统时，可保留本任务形成的快捷键过滤规则和菜单动作编排；如正式管理台引入统一设计系统，可替换菜单样式但继续复用 action map。

## 验收标准

- H5 画布节点右键后出现节点操作菜单。
- 结构树节点右键后出现节点操作菜单并选中对应节点。
- 节点菜单可执行创建副本和删除节点。
- Ctrl/Meta+C 与 Ctrl/Meta+V 可复制并粘贴选中节点。
- Delete/Backspace 可删除选中节点。
- Ctrl/Meta+Z 与 Ctrl/Meta+Shift+Z 或 Ctrl+Y 可撤销和重做节点操作。
- 输入框、textarea、select 中不会误触发节点快捷键。
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

- Vue3 编辑器新增节点操作菜单状态、菜单动作映射和固定定位浮层。
- H5 画布节点可通过 `data-lowcode-node-id` 识别并右键打开节点菜单。
- 左侧结构树节点可右键打开同一节点菜单，并自动选中对应节点。
- 画布上下文工具条新增“更多”入口，复用节点菜单。
- 节点菜单支持前方插入、后方插入、加入容器、上移、下移、复制节点、粘贴节点、创建副本和删除节点。
- 全局快捷键新增 Delete/Backspace 删除、Ctrl/Meta+C 复制、Ctrl/Meta+V 粘贴、Ctrl/Meta+D 创建副本、Ctrl/Meta+Z 撤销、Ctrl/Meta+Shift+Z 和 Ctrl+Y 重做。
- 快捷键过滤输入框、textarea、select、contenteditable 和命令面板输入，避免属性编辑误触发。
- Browser smoke 新增结构树右键菜单、创建副本、删除、复制、粘贴、撤销和重做覆盖。

## 验证记录

- 2026-07-31：`pnpm typecheck` 通过。
- 2026-07-31：`pnpm build` 通过。
- 2026-07-31：`pnpm test` 通过，32 个测试全部通过。
- 2026-07-31：`pnpm smoke:browser` 通过，覆盖节点右键菜单、删除、复制、粘贴、撤销和重做快捷键。

## 发布影响

- 暂不发布 npm。
- 不影响 schema 兼容性。
- 不影响 H5 runtime 接入。
- 不需要 GitHub tag 或 release。
- 回滚方式：回滚本任务提交即可。

## 风险和阻塞

- 右键菜单定位需要兼顾不同屏幕尺寸，首版使用固定定位并限制在视口内。
- 快捷键需避免与浏览器默认复制粘贴和属性编辑输入冲突。

## 变更记录

- 2026-07-31：创建 ready 工作项。
- 2026-07-31：进入实现，补充节点菜单和快捷键。
- 2026-07-31：实现完成并通过验证，状态更新为 verified。
