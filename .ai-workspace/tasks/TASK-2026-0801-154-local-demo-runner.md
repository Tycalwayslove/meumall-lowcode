# TASK-2026-0801-154-local-demo-runner

## 标题

新增本地编辑器与 H5 runtime 联合启动器

## 状态

verified

## 目标

新增一条本地演示命令，同时启动 Vue3 编辑器 playground 和 React H5 runtime playground，并自动把 React H5 runtime URL 注入编辑器，方便运营体验、开发验收和后续协作时快速看到“可实操编辑器 + 对应 H5 渲染”。

## 背景

当前仓库已有 `pnpm dev` 启动编辑器、`pnpm dev:h5` 启动 H5 runtime，但使用者需要分别启动两个命令并记住端口。长期目标要求最终能看到可实操编辑器和对应 H5 渲染，因此需要一条根级命令把两个 playground 一起拉起，并提供本地健康检查模式，降低体验和演示门槛。

## 涉及包或系统

- `scripts/`
- `package.json`
- `README.md`
- `.ai-workspace/tasks/`
- `.ai/`

## 范围

包含：

- 新增零依赖本地 demo runner。
- 根级新增 `pnpm dev:demo` 持续启动 editor 和 H5 runtime。
- 根级新增 `pnpm demo:check` 启动两个服务、完成 HTTP 健康检查后自动退出。
- README 增加本地演示入口、默认 URL 和端口环境变量。
- 更新 AI 状态、TODO 和任务记录。

不包含：

- 不改变 editor、renderer、materials、schema 或 adapters 公开 API。
- 不接真实 Java 配置平台。
- 不接真实 `hybird-meumall` H5 工程。
- 不新增第三方进程管理依赖。
- 不替代 `pnpm smoke:browser` 或 `pnpm smoke:visual`。

## 责任边界

当前仓库：

- `scripts/dev-demo.mjs` 负责本地同时启动两个 Vite dev server、注入 H5 runtime URL、输出演示入口，并提供健康检查模式。

外部系统：

- Java 配置平台、真实 H5 宿主、npm registry 和线上发布流程不在本任务范围内。

## 契约影响

- 是否影响跨包或跨系统契约：否。
- 契约文档路径：无；本任务只增强本地开发体验。
- 是否向后兼容：是。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`README.md`、`.ai/PROJECT_STATE.md`、`.ai/AI_CONTEXT.md`。
- 需要确认的角色：低代码前端维护者、后续接手本地演示的同学。
- 当前确认状态：本地脚本与 demo check。

## 实现计划

1. 新增本地 demo runner 脚本。
2. 增加根级 npm scripts。
3. 更新 README 和 AI 状态。
4. 运行 `pnpm demo:check`、`pnpm test` 和 `git diff --check`。
5. 标记任务 verified 并提交推送。

## 验收标准

- [x] `pnpm dev:demo` 可同时启动 editor playground 和 H5 runtime playground。
- [x] 编辑器启动时自动注入 `VITE_REACT_H5_RUNTIME_URL`。
- [x] 命令行输出 editor、H5 sample、H5 pageId 和 H5 releaseId 入口。
- [x] `pnpm demo:check` 可启动两个服务、完成健康检查并自动退出。
- [x] 脚本不新增第三方依赖。
- [x] README 记录本地演示命令和端口环境变量。
- [x] `pnpm demo:check` 通过。
- [x] `pnpm test` 通过。
- [x] `git diff --check` 通过。

## 验证命令

```bash
pnpm demo:check
pnpm test
git diff --check
```

## 验证结果

- `pnpm demo:check`：通过，已启动 editor playground、H5 runtime playground、published pageId 和 preview releaseId 入口并自动停止。
- `pnpm test`：通过，包含 build、architecture check 和 94 个 Node test。
- `git diff --check`：通过。

## 发布影响

- 是否需要发布：否，本任务只改根级本地脚本和文档。
- 发布对象：无。
- 是否需要 changeset：否。
- 是否需要 GitHub tag/release：否。
- 是否影响 H5 接入：不改变 H5 runtime 包；改善本地演示和联调入口。
- 是否影响 npm 发布：否。
- 是否影响 Java 配置平台：否。
- 回滚目标：回滚本任务提交即可恢复原本单独启动 editor/H5 的方式。
- smoke check：`pnpm demo:check` 作为本地启动器健康检查，`pnpm smoke:browser` 和 `pnpm smoke:visual` 继续负责浏览器级验收。

## 风险和阻塞

- `pnpm dev:demo` 是长期运行命令，需要用户手动 `Ctrl+C` 停止；自动化验证使用 `pnpm demo:check`。
- 如果默认端口被占用，脚本会失败并提示通过环境变量调整端口。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-08-01 | ready | 创建任务，范围限定为本地 demo runner、README 和健康检查。 |
| 2026-08-01 | verified | 完成本地联合启动器、README、AI 状态记录，并通过 `pnpm demo:check`、`pnpm test`、`git diff --check`。 |
