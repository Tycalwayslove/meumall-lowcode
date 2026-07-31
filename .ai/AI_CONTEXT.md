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
- React/Vue H5 物料包已包含基础物料和高阶活动物料：`CountdownTimer`、`NavGrid`、`FloorAnchorNav`、`FlashSaleList`、`ActivityRuleModal`、`CouponBundle`、`StoreExpertSection`；大促模板、新人券模板和 React H5 runtime 示例已使用这些物料。
- React/Vue H5 renderer 已为 schema 节点输出 `data-lowcode-node-id`，楼层锚点物料可按目标节点 id 滚动定位。
- Java 配置平台 API 草案已写入 `.ai-workspace/contracts/java-config-platform-api-v1.md`，`@meumall/lowcode-adapters` 已提供 `LowcodeConfigPlatformClient` 与 `createHttpConfigPlatformClient`，编辑器本地 mock 发布链路已实现同一 client 接口。
- H5 runtime 集成清单已写入 `.ai-workspace/contracts/h5-runtime-integration-v1.md`，`docs/meumall-integration.md` 是面向 `hybird-meumall` 接入的简版说明。
- `@meumall/lowcode-adapters` 已提供 `loadLowcodeRuntimeSchema`，统一按 `encodedSchema -> releaseId -> pageId -> fallbackSchema` 获取运行时 schema；React H5 runtime playground 已改为使用该 loader。
- Vue3 编辑器 playground 右侧属性区已提供 mock 素材库和商品选择器：图片类节点可搜索/分类选择图片，`ProductList`/`FlashSaleList` 可搜索多选商品并写入静态 `props.items`，也可以重新绑定 `products` 数据源。
- Vue3 编辑器 playground 画布已支持物料拖拽插入线：拖到节点上半区插入前方，下半区插入后方，拖到 `SectionContainer` 中间区域加入容器，拖到空白区域追加页面末尾。
- Vue3 编辑器 playground 画布已支持已有节点拖拽移动：设计模式下节点 wrapper 可拖动，支持移动到目标前后、移入 `SectionContainer`、移动到根节点末尾，并规避拖到自己或自己后代。
- `@meumall/lowcode-renderer-vue-h5` 的 editable wrapper 已提供可选 `nodeDraggable`、`onNodeDragStart`、`onNodeDragEnd`，供编辑器 shell 编排拖拽，不影响默认生产渲染。
- Vue3 编辑器 playground 右侧面板已提供发布检查清单，覆盖 schema、节点、图片、商品、数据源和动作；生成预览和发布会拦截 error 检查项，保存草稿不拦截。
- Vue3 编辑器 playground 本地版本列表已支持选择版本对比，摘要展示标题、状态、环境、页面版本、节点数、数据源数和动作数差异，并可将选中版本作为新的 published release 回滚发布。
- Vue3 编辑器 playground 属性面板已支持 `switch` setter 和 `boolean` 类型字段的开关控件，写入真实 boolean，并兼容旧草稿中的 `"false"`、`"0"`、`"off"` 字符串。
- 未来小程序复用 schema/core，新增小程序 renderer/materials。

## 当前协作约定

- 中文为主要协作语言。
- 正式任务先建或读取 `.ai-workspace/tasks/`。
- 重要事实写入仓库，不依赖聊天记忆。
- schema、包边界、发布流程和外部系统对接变化必须更新文档。

## 外部参考

- 已阅读掘金小册并生成原创读书笔记：`/Users/mac/Documents/掘金小册/从零开发H5可视化搭建项目-原创读书笔记与MeuMall落地方案.md`
- 已分析 `buqiyuan/vite-vue3-lowcode`，结论是可借鉴编辑器交互和 schema 思路，但本项目采用可发布 npm 包的 monorepo 架构。
