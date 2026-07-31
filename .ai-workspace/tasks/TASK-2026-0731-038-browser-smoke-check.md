# TASK-2026-0731-038-browser-smoke-check

## 状态

verified

## 目标

为 MeuMall Lowcode 增加浏览器级 smoke check，自动启动 Vue3 编辑器 playground 和 React H5 runtime playground，并通过真实 Chrome 检查关键页面、渲染容器和核心文案，提升“可实操编辑器 + 对应 H5 渲染”的验证可信度。

## 背景

当前仓库已经有 `pnpm typecheck`、`pnpm build`、`pnpm test` 和 `curl` 级 smoke check，但 `curl` 只能证明 dev server 返回 HTML，不能证明 Vue3 编辑器、内置 H5 runtime 和独立 React H5 runtime 真的在浏览器中完成渲染。随着编辑器交互、资源选择器和物料库持续增加，需要一个轻量浏览器验证入口，帮助后续多人协作时快速发现白屏、关键 DOM 缺失或 runtime 未挂载问题。

本任务先新增零 npm 依赖的 Node 脚本，通过本机 Chrome DevTools Protocol 完成 browser smoke。脚本作为显式命令 `pnpm smoke:browser` 提供，不默认塞进 `pnpm test` 或 CI，避免立即引入浏览器环境要求。

## 涉及包或系统

- 根级 `package.json`
- `scripts/`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `.ai-workspace`
- `.ai`

## 范围

包含：

- 新增 `scripts/browser-smoke.mjs`。
- 脚本自动启动 editor playground 和 H5 runtime playground dev server。
- 脚本自动启动本机 Chrome headless，并通过 Chrome DevTools Protocol 访问页面。
- 检查 Vue3 编辑器 shell：
  - `.editor-shell` 存在。
  - 页面包含 `MeuMall Lowcode`、`模板`、`物料`、`发布检查`。
- 检查 Vue3 编辑器内置 runtime 模式：
  - `.runtime-shell` 存在。
  - 页面包含运行时标题。
- 检查 React H5 runtime playground：
  - `.runtime-shell` 和 `.phone-frame` 存在。
  - `[data-lowcode-page]` 存在。
  - 页面包含 `React H5`。
- 新增根脚本 `pnpm smoke:browser`。
- 更新任务、项目状态、上下文、TODO 和验证记录。

不包含：

- 不引入 Playwright、Puppeteer 或其他浏览器测试框架。
- 不做视觉截图 diff。
- 不做拖拽、编辑、发布等完整 E2E 流程。
- 不把 browser smoke 纳入默认 `pnpm test` 或 CI required check。
- 不改变 editor、renderer、materials 的运行逻辑。

## 责任边界

当前仓库：

- 提供本地 browser smoke 脚本和验证记录。

外部系统：

- Java 配置平台、真实资源中心、真实 H5 宿主不参与本任务。
- CI 是否安装 Chrome、是否启用 browser smoke 作为必跑项后续再决策。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：本任务文件。
- 是否向后兼容：是，只新增验证脚本。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：否。
- 对接说明路径：无。
- 需要确认的角色：后续 CI 负责人可决定是否在流水线安装 Chrome 并执行 `pnpm smoke:browser`。
- 当前确认状态：本地显式验证命令先行。

## 实现计划

1. 新增 `scripts/browser-smoke.mjs`。
2. 在根 `package.json` 增加 `smoke:browser`。
3. 运行 `pnpm smoke:browser`、`pnpm typecheck`、`pnpm build`、`pnpm test`。
4. 更新 AI 状态和验证记录。

## 验收标准

- [x] `pnpm smoke:browser` 可自动启动 editor 和 H5 runtime dev server。
- [x] `pnpm smoke:browser` 可启动本机 Chrome headless。
- [x] browser smoke 能验证 Vue3 编辑器 shell 关键 DOM 和文案。
- [x] browser smoke 能验证 Vue3 编辑器内置 runtime 模式。
- [x] browser smoke 能验证 React H5 runtime playground 关键 DOM 和文案。
- [x] browser smoke 结束后会关闭临时 dev server 和 Chrome。
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
- 回滚目标：回滚本任务提交即可移除 browser smoke 脚本。
- smoke check：`pnpm smoke:browser` 通过。

## 风险和阻塞

- 本地执行需要安装 Chrome，脚本支持 `CHROME_BIN` 指定浏览器路径。
- 当前只做关键 DOM 和文案检查，尚未覆盖拖拽、属性编辑、发布流程和视觉截图 diff。

## 验证结果

- `pnpm smoke:browser` 通过：
  - 自动启动 editor playground dev server：`http://127.0.0.1:5193/`。
  - 自动启动 H5 runtime playground dev server：`http://127.0.0.1:5194/`。
  - 自动启动本机 Chrome headless：`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`。
  - Vue3 编辑器 shell、品牌文案、模板入口、物料入口、发布检查和 Vue H5 画布节点检查通过。
  - Vue3 编辑器内置 runtime shell、H5 页面容器和运行时标题检查通过。
  - React H5 runtime shell、phone frame、H5 页面容器、React H5 标识和物料节点检查通过。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm test` 通过，28 个测试全部通过。
- 未验证项：未覆盖拖拽、属性编辑、发布流程、截图 diff 和视觉回归，原因是本任务只建立基础 browser smoke。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 创建浏览器级 smoke check 任务。 |
| 2026-07-31 | in_progress | 开始实现 browser smoke 脚本和根命令。 |
| 2026-07-31 | verified | 完成 browser smoke 脚本、根命令和验证记录。 |
