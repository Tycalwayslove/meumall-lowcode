# Project State

## 当前状态

MeuMall Lowcode 已完成第一版 monorepo 骨架、AI 协作体系、GitHub 远端推送、schema/editor 第一批基础代码、Vue3 编辑器 playground 初版、本地 mock 发布预览链路、React H5 与 Vue H5 基础物料对齐、独立 React H5 runtime playground、编辑器到 React H5 runtime 的 schema URL handoff、基础电商物料库扩展、编辑器页面模板库、schema/core/adapters 基础单元测试体系、data source resolver、action 安全执行闭环、高阶活动物料、Java 配置平台 API 草案、配置平台客户端抽象、H5 runtime 集成契约和 runtime schema loader，并增强 Vue3 编辑器 mock 素材库、商品选择器、画布拖拽物料插入线、已有节点画布拖拽移动、发布前检查清单、本地版本对比/回滚、活动规则弹窗物料、楼层锚点导航、布尔开关属性编辑、组合券包物料、门店/达人推荐物料、数组属性列表编辑器和列表项拖拽排序。

## 当前维护范围

- `packages/schema`
- `packages/core`
- `packages/renderer-h5`
- `packages/materials-h5`
- `packages/renderer-vue-h5`
- `packages/materials-vue-h5`
- `packages/editor`
- `packages/adapters`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `docs/`
- `.ai-workspace/`
- `.ai/`

## 已完成

- pnpm workspace。
- TypeScript project references。
- 可发布 npm 包结构。
- Changesets 基础配置。
- GitHub Actions CI 基础配置。
- H5 renderer 初始实现。
- H5 materials 初始实现，已包含容器、公告条、活动头图、图片 Banner、行动按钮、商品列表、门店/达人推荐、优惠券区块、组合券包、活动规则弹窗、间距块、倒计时、导航宫格、楼层锚点、秒杀商品组和富文本。
- 低代码版 AI 工作流迁移。
- GitHub 远端 `git@github.com:Tycalwayslove/meumall-lowcode.git` 已配置并推送 `main`。
- Page Schema v1 基础类型、标准化、递归校验和 manifest 校验。
- Editor headless command：模式、视口、选择、插入、更新、复制、移动、删除、undo/redo。
- Vue H5 renderer 初始实现。
- Vue H5 基础物料：容器、公告条、活动头图、图片 Banner、行动按钮、商品列表、门店/达人推荐、优惠券区块、组合券包、活动规则弹窗、间距块、倒计时、导航宫格、楼层锚点、秒杀商品组、富文本。
- Vue3 编辑器 playground：物料添加、拖到画布、节点选择、属性编辑、JSON 查看/应用、本地保存、撤销/重做和 H5 预览。
- Vue3 编辑器交互增强：画布节点点击选中、高亮、根节点拖拽排序、页面状态/环境配置和数据源面板。
- Vue3 编辑器实操增强：容器物料、嵌套结构展示、向容器添加子物料、素材/商品快捷选择和 mock 数据源预览绑定。
- Vue3 编辑器发布链路 mock：保存草稿、生成预览、发布页面、本地版本列表和独立 H5 runtime 入口。
- Vue3 编辑器画布上下文操作：选中节点后可前后插入物料、向容器加入物料、同级上移/下移、复制和删除。
- React H5 runtime playground：独立消费 React H5 renderer/materials/core/schema，验证基础物料、容器嵌套和 dataBinding。
- 编辑器到 React H5 runtime handoff：通过 URL schema 参数打开当前编辑 schema 的 React H5 渲染结果。
- 基础电商物料扩展：新增 `ActionButton`、`NoticeBar`、`SpacerBlock`，并同步 Vue/React H5 物料包。
- 页面模板库：编辑器左侧可一键应用大促活动页、新人券领取页和商品专题页模板。
- 基础单元测试：根目录提供 `pnpm test`，覆盖 schema、core 和 adapters 公开 API 基础回归。
- Data source resolver：`@meumall/lowcode-adapters` 提供通用数据源解析，编辑器预览和 React H5 runtime 可按 schema.dataSources 生成 renderer data，并展示逐数据源诊断状态。
- Safe action executor：`@meumall/lowcode-adapters` 提供安全 action registry/executor，编辑器可维护 actions 并绑定物料事件，Vue 预览和 React H5 runtime 可执行白名单动作。
- 高阶活动物料：React/Vue H5 物料包已新增 `CountdownTimer`、`NavGrid`、`FloorAnchorNav`、`FlashSaleList`、`ActivityRuleModal`、`CouponBundle`、`StoreExpertSection`，大促模板和 React H5 runtime 示例已使用新增物料。
- Java 配置平台 API 草案：`.ai-workspace/contracts/java-config-platform-api-v1.md` 已定义草稿、预览、发布、release 查询、draft 查询和 active published schema 查询接口。
- Config platform client：`@meumall/lowcode-adapters` 提供 `LowcodeConfigPlatformClient` 和 `createHttpConfigPlatformClient`，编辑器本地 mock 已实现同一 client 接口。
- H5 runtime 集成契约：`.ai-workspace/contracts/h5-runtime-integration-v1.md` 已定义 `hybird-meumall` npm 依赖、推荐路由、schema 获取优先级、数据源、action、降级、监控和 smoke check。
- Runtime schema loader：`@meumall/lowcode-adapters` 提供 `loadLowcodeRuntimeSchema`，统一支持 encoded schema、releaseId、pageId 和 fallback schema；React H5 runtime playground 已切换为同一 loader。
- Vue3 编辑器资源选择器：右侧属性区已提供 mock 素材库和商品选择器，支持搜索、分类、多选、静态商品写回和恢复绑定 `products` 数据源。
- Vue3 编辑器画布拖拽：从物料区拖到画布节点时可显示前/后插入线，拖到 `SectionContainer` 中间区域可显示容器投放高亮，拖到空白区域可追加到页面末尾。
- Vue3 编辑器已有节点拖拽：设计模式下画布节点可直接拖动，支持移动到目标节点前/后、移动进 `SectionContainer`、移动到根节点末尾，并规避拖到自己或自己后代。
- Vue H5 renderer 编辑态拖拽回调：`LowcodeVueRenderer` 新增可选 `nodeDraggable`、`onNodeDragStart` 和 `onNodeDragEnd`，生产渲染默认不受影响。
- Vue3 编辑器发布检查：右侧面板已展示 schema、节点、图片、商品、数据源和动作 readiness；生成预览和发布会拦截 error，保存草稿不拦截。
- Vue3 编辑器本地版本管理：本地版本列表支持选择对比，展示标题、状态、环境、页面版本、节点数、数据源数和动作数摘要差异，并支持将所选版本作为新的 published release 回滚发布。
- 活动规则弹窗物料：React/Vue H5 物料包已新增 `ActivityRuleModal`，支持规则入口、弹窗展示、规则列表和 `onOpen` 事件；大促模板、新人券模板和 React H5 runtime 示例已接入。
- 楼层锚点导航：React/Vue H5 renderer 已为 schema 节点输出 `data-lowcode-node-id`，React/Vue H5 物料包新增 `FloorAnchorNav`，支持吸顶、横向滚动锚点、点击滚动到目标节点和 `onAnchorClick` 事件。
- Vue3 编辑器布尔属性编辑：属性面板已将 `switch` setter 和 `boolean` 类型字段渲染为开关控件，写入真实 boolean，并兼容旧草稿中的 `"false"`、`"0"`、`"off"` 字符串。
- 组合券包物料：React/Vue H5 物料包已新增 `CouponBundle`，支持多券展示、一键领取、单券领取和 `onReceive/onReceiveAll` 事件；大促模板和 React H5 runtime 示例已接入。
- 门店/达人推荐物料：React/Vue H5 物料包已新增 `StoreExpertSection`，支持门店/达人混合推荐、多项展示、静态列表配置、预留 `items` data source slot 和 `onItemClick` 事件；大促模板和 React H5 runtime 示例已接入。
- Vue3 编辑器数组属性编辑：属性面板已为 `array` + `textarea` 字段提供列表项编辑器，支持新增、删除、复制、上移、下移和常见字段表单输入，并保留 JSON 高级编辑兜底。
- Vue3 编辑器数组列表排序：属性面板列表项已支持同一数组属性内 HTML5 拖拽排序，拖拽后写回当前节点 props 数组，并提供拖拽中和目标项视觉状态。

## 已知缺口

- 尚未实现完整生产级编辑器 UI；当前已具备 mock 素材/商品选择器、数组属性列表编辑器和列表项拖拽排序，但还不是正式管理台组件。
- 数据源面板和 React H5 runtime 已执行 mock resolver，尚未接入真实 HTTP 请求、鉴权、缓存和 Java 代理。
- 画布拖拽已支持新物料投放、已有节点移动和数组列表项排序；尚未支持移动端 Pointer Events 拖拽、吸附线和多选拖拽。
- Page Schema v1 契约仍为 draft，需要在 Java 配置平台对接前继续细化。
- Java 配置平台 API 仍为前端草案，待 Java 配置平台负责人确认响应包装、鉴权、审批、服务端发布校验、版本 diff、回滚审计和分页。
- 当前发布链路已抽象为 config platform client，但仍使用 localStorage mock，尚未切换真实 Java HTTP client。
- 当前 React H5 handoff 使用 URL schema 参数，正式预览仍需 Java 配置平台 previewId/pageId。
- Action handler 仍是 playground mock，尚未对接真实跳转桥、领券接口、埋点平台、权限和风控。
- 高阶活动物料仍使用静态倒计时、静态规则、静态楼层配置、静态券包、静态门店/达人推荐和 mock 商品数据，尚未对接真实活动、库存、价格、规则中心、楼层配置中心、优惠券中心、门店中心和达人中心。
- 素材库、商品选择器和列表项编辑器仍使用本地 mock/通用字段模板，尚未接入真实素材中心、商品中心、优惠券中心、门店/达人中心、权限、分页和审核。
- 尚未在 `hybird-meumall` 真实业务仓库创建低代码路由并接入 npm 包。
- 尚未配置 npm registry/token。
- 组件级 DOM 测试、浏览器交互测试和 visual regression 尚未建立。

## 最近变更

| 日期 | 提交 | 说明 |
| --- | --- | --- |
| 2026-07-31 | `a5a8a60` | 初始化低代码 monorepo。 |
| 2026-07-31 | `0ed06ff` | 迁移低代码 AI 工作流。 |
| 2026-07-31 | `e1655eb` | 要求 Git 提交信息使用中文。 |
| 2026-07-31 | `c61c19f` | 推送 GitHub 远端并实现 schema/editor 第一批基础代码。 |
| 2026-07-31 | `4f1870d` | 新增 Vue3 编辑器 playground 和 Vue H5 renderer/materials。 |
| 2026-07-31 | `b1861d4` | 增强 Vue3 编辑器交互。 |
| 2026-07-31 | `edda161` | 增强容器、素材/商品选择和数据源预览。 |
| 2026-07-31 | `c3035f7` | 补充本地 mock 发布预览链路和独立 H5 runtime 入口。 |
| 2026-07-31 | `8d4cf89` | 对齐 React H5 容器物料并增强画布上下文操作。 |
| 2026-07-31 | `54b2ccf` | 新增独立 React H5 runtime playground。 |
| 2026-07-31 | `03cca93` | 打通编辑器到 React H5 runtime 的 schema handoff。 |
| 2026-07-31 | `915c9ef` | 扩展行动按钮、公告条和间距块基础物料。 |
| 2026-07-31 | `32cc2aa` | 新增编辑器页面模板库。 |
| 2026-07-31 | `bc68738` | 建立 schema/core/adapters 基础单元测试体系。 |
| 2026-07-31 | `4e5bf5b` | 打通 data source resolver 到编辑器预览和 React H5 runtime。 |
| 2026-07-31 | `843a6af` | 打通 action 安全白名单到编辑器配置和 React H5 runtime。 |
| 2026-07-31 | `31e7836` | 扩展倒计时、导航宫格和秒杀商品组高阶活动物料。 |
| 2026-07-31 | `760b5dc` | 沉淀 Java 配置平台 API 草案和配置平台客户端抽象。 |
| 2026-07-31 | `b6208c1` | 沉淀 H5 runtime 集成契约和 runtime schema loader。 |
| 2026-07-31 | `f88d21c` | 增强 Vue3 编辑器 mock 素材库和商品选择器。 |
| 2026-07-31 | `90509a4` | 增强 Vue3 编辑器画布拖拽插入线。 |
| 2026-07-31 | `6665e94` | 增强 Vue3 编辑器已有节点画布拖拽移动。 |
| 2026-07-31 | `b942ab3` | 增强 Vue3 编辑器发布前检查清单。 |
| 2026-07-31 | `ad7cb47` | 增强 Vue3 编辑器本地版本对比和回滚。 |
| 2026-07-31 | `26909c4` | 新增活动规则弹窗物料并对齐 React/Vue H5。 |
| 2026-07-31 | `2c8fd6d` | 新增楼层锚点导航并补充 renderer 节点标记。 |
| 2026-07-31 | `494bfac` | 增强 Vue3 编辑器布尔开关属性编辑。 |
| 2026-07-31 | `c587e3e` | 新增组合券包物料并接入 H5 示例。 |
| 2026-07-31 | `2b6d726` | 新增门店/达人推荐物料并接入 H5 示例。 |
| 2026-07-31 | `557697a` | 增强 Vue3 编辑器数组属性列表编辑。 |
| 2026-07-31 | 本提交 | 增强 Vue3 编辑器数组列表拖拽排序。 |

## 默认验证命令

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm dev
```
