# AI Context

## 当前目标

建设 MeuMall 低代码平台基础架构，先统一放在 `/Users/mac/person_code/meumall-lowcode`，后续可拆包、发布 npm、上传 GitHub 留存。

## 设计基线

- schema 是核心契约。
- editor 生产 schema。
- renderer 消费 schema。
- materials 实现可配置节点。
- Java 配置平台负责存储和发布 schema。
- H5 通过 npm 引入 renderer/materials/schema。
- 管理端编辑器优先使用 Vue3，便于后续迁移到 Java 管理系统或管理后台中。
- 编辑器发布链路先在 `apps/editor-playground/src/mockPlatform.ts` 用 localStorage mock Java 配置平台，后续替换为 HTTP adapter。
- 独立 H5 runtime 入口先通过 `apps/editor-playground` 的 `?runtime=1&pageId=...` 或 `?runtime=1&releaseId=...` 验证 renderer 消费发布 schema。
- React H5 消费端验证入口是 `apps/h5-runtime-playground`，默认运行在 `http://localhost:5174/`，用于验证 `@meumall/lowcode-renderer-h5` 和 `@meumall/lowcode-materials-h5`。
- 编辑器可以通过 `@meumall/lowcode-adapters` 的 schema URL 编解码工具把当前 schema handoff 到 React H5 runtime：`http://localhost:5174/?schema=...&source=editor`。
- `@meumall/lowcode-adapters` 已提供 `resolveLowcodeDataSources`，编辑器预览和 React H5 runtime 均通过注册白名单 data source handler 解析 schema.dataSources，再把结果作为 renderer data 注入。
- `@meumall/lowcode-adapters` 已提供 `createSafeActionRegistry` 和 `createSafeActionExecutor`，编辑器 playground 可维护 schema.actions 并把物料事件绑定到 action；Vue 预览和 React H5 runtime 通过白名单 handler 执行 mock navigate、coupon.receive、tracking.click 和 noop。
- 未来小程序复用 schema/core，新增小程序 renderer/materials。

## 当前协作约定

- 中文为主要协作语言。
- 正式任务先建或读取 `.ai-workspace/tasks/`。
- 重要事实写入仓库，不依赖聊天记忆。
- schema、包边界、发布流程和外部系统对接变化必须更新文档。

## 外部参考

- 已阅读掘金小册并生成原创读书笔记：`/Users/mac/Documents/掘金小册/从零开发H5可视化搭建项目-原创读书笔记与MeuMall落地方案.md`
- 已分析 `buqiyuan/vite-vue3-lowcode`，结论是可借鉴编辑器交互和 schema 思路，但本项目采用可发布 npm 包的 monorepo 架构。
