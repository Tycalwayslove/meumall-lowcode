# TASK-2026-0731-039-browser-smoke-editor-workflow

## 状态

verified

## 目标

增强 `pnpm smoke:browser`，在已有浏览器级挂载检查基础上，补充 Vue3 编辑器核心操作流验证：搜索模板、应用模板、切换源码模式、检查 schema 草稿、切回预览和设计模式，进一步证明编辑器不是只会渲染壳，而是具备可操作的基础搭建路径。

## 背景

当前 browser smoke 已能启动 editor playground、H5 runtime playground 和本机 Chrome headless，并验证编辑器 shell、内置 runtime、React H5 runtime 的关键 DOM 与物料节点。但它还没有执行任何编辑器操作。为了逐步接近“可以实操的编辑器”，需要把 smoke 从静态挂载检查推进到轻量交互检查，先覆盖最稳定、最常用的运营路径：从模板开始建页，并确认 schema/预览视图能跟随模板切换。

本任务继续使用零 npm 依赖的 Chrome DevTools Protocol 脚本，不引入 Playwright/Puppeteer，不改编辑器业务代码。

## 涉及包或系统

- `scripts/browser-smoke.mjs`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- 扩展 `scripts/browser-smoke.mjs` 的 CDP 页面能力，支持填输入框、点击指定文本按钮。
- 在 editor playground smoke 中增加模板操作流：
  - 填写模板搜索关键词 `商品`。
  - 确认模板列表筛选出 `商品专题页`。
  - 点击应用 `商品专题页` 模板。
  - 确认画布/页面文案更新为 `通勤好物专题`。
- 增加编辑器模式切换验证：
  - 点击 `源码`，确认 schema textarea 包含 `product-topic-demo`。
  - 点击 `预览`，确认 H5 画布和节点仍渲染。
  - 点击 `设计`，确认回到设计模式且上下文仍正常。
- 更新任务、项目状态、上下文、TODO 和验证记录。

不包含：

- 不覆盖拖拽投放、节点移动、属性编辑、发布、版本回滚等完整 E2E。
- 不做截图或视觉 diff。
- 不引入新的 npm 依赖。
- 不修改 editor、renderer、materials 业务逻辑。

## 责任边界

当前仓库：

- 维护本地 browser smoke 脚本、交互验证和验证记录。

外部系统：

- Java 配置平台、真实资源中心、真实 H5 宿主不参与本任务。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：本任务文件。
- 是否向后兼容：是，只增强验证脚本。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：无。
- 当前确认状态：本地显式验证命令先行。

## 实现计划

1. 扩展 `scripts/browser-smoke.mjs` 的 CDP DOM 操作 helper。
2. 在 editor playground 检查后增加模板搜索、模板应用和模式切换检查。
3. 运行 `pnpm smoke:browser`、`pnpm typecheck`、`pnpm build`、`pnpm test`。
4. 更新 AI 状态和验证记录。

## 验收标准

- [x] `pnpm smoke:browser` 能搜索模板关键词 `商品`。
- [x] `pnpm smoke:browser` 能确认模板列表筛选出 `商品专题页`。
- [x] `pnpm smoke:browser` 能点击应用 `商品专题页` 模板。
- [x] `pnpm smoke:browser` 能确认页面更新为 `通勤好物专题`。
- [x] `pnpm smoke:browser` 能切到源码模式并确认 schema 包含 `product-topic-demo`。
- [x] `pnpm smoke:browser` 能切到预览模式并确认 H5 画布仍渲染节点。
- [x] `pnpm smoke:browser` 能切回设计模式。
- [x] `pnpm typecheck` 通过。
- [x] `pnpm build` 通过。
- [x] `pnpm test` 通过。

## 验证命令

```bash
pnpm smoke:browser
pnpm typecheck
pnpm build
pnpm test
```

## 发布影响

- 是否需要发布：本任务不实际发布 npm。
- 发布对象：无。
- 是否影响 schema 兼容性：否。
- 是否影响 H5 接入：否。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交即可恢复仅静态挂载 browser smoke。
- smoke check：`pnpm smoke:browser` 通过。

## 风险和阻塞

- 本地执行仍需要安装 Chrome，脚本支持 `CHROME_BIN` 指定浏览器路径。
- 当前交互 smoke 只覆盖模板应用和模式切换，尚未覆盖拖拽、属性编辑、发布和视觉回归。

## 验证结果

- `pnpm smoke:browser` 通过：
  - 自动启动 editor playground dev server：`http://127.0.0.1:5193/`。
  - 自动启动 H5 runtime playground dev server：`http://127.0.0.1:5194/`。
  - 自动启动本机 Chrome headless：`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`。
  - Vue3 编辑器 shell、品牌文案、模板入口、物料入口、发布检查和 Vue H5 画布节点检查通过。
  - 模板搜索 `商品` 后可筛选出 `商品专题页`。
  - 点击应用 `商品专题页` 后，画布文案更新为 `通勤好物专题`。
  - 点击 `源码` 后 schema textarea 包含 `product-topic-demo`。
  - 点击 `预览` 后 H5 画布和物料节点仍渲染。
  - 点击 `设计` 后可回到设计模式且画布节点仍渲染。
  - Vue3 编辑器内置 runtime 和 React H5 runtime 挂载检查仍通过。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，28 个测试全部通过。
- 未验证项：未覆盖拖拽、属性编辑、发布流程、截图 diff 和视觉回归，原因是本任务只扩展模板应用和模式切换交互 smoke。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建 browser smoke 编辑器核心操作流任务。 |
| 2026-07-31 | in_progress | 开始增强 browser smoke 的编辑器交互验证。 |
| 2026-07-31 | verified | 完成模板应用和模式切换 browser smoke 验证。 |
