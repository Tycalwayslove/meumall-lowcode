# TODO

## P0

- 确认 npm registry、scope、access、token、linked group 版本结果和 release/tag 策略；当前已具备 `pnpm pack:dry-run` 包内容预检，且 `createHttpActionHandler` 已有 pending minor changeset，但尚未执行真实 npm 发布。

## P1

- 按 `docs/material-layering-architecture.md` 继续推进 Phase 1：现有主要 React/Vue H5 物料已基本复用内部 `MlcButton`、`MlcImage`、`MlcTag`、`MlcText`、`MlcPrice`、`MlcInput`、`MlcSelect`、`MlcRadioGroup`、`MlcTextarea`、`MlcSwitch`、`MlcCheckbox`、`MlcStepper`、`MlcOverlay`、`MlcModal`、`MlcCountdownText`、`MlcTabs`、`MlcSpacer`、`MlcDivider`、`MlcNoticeBar`、`MlcRichText` 和 `h5Tokens`；`SectionContainer` 已复用 `MlcText` 渲染标题、说明和空态文案，且仍保持当前单列容器协议；`BasicButton` 已复用 `MlcButton`，`BasicInput` 已复用 `MlcInput` 和 `MlcText`，`BasicTextarea` 已复用 `MlcTextarea` 和 `MlcText`，`BasicSelect` 已复用 `MlcSelect` 和 `MlcText`，`BasicRadioGroup` 已复用 `MlcRadioGroup` 和 `MlcText`，`BasicStepper` 已复用 `MlcStepper` 和 `MlcText`，`BasicSwitch` 已复用 `MlcSwitch` 和 `MlcText`，`BasicCheckbox` 已复用 `MlcCheckbox` 和 `MlcText`，`BasicText` 已复用 `MlcText`，`DividerBlock` 已复用 `MlcDivider`，`BasicImage` 已复用 `MlcImage`，`BasicTag` 已复用 `MlcTag`，`BasicCard` 已复用 `MlcImage`、`MlcTag`、`MlcText` 和 `MlcButton`，`BasicCarousel` 已复用 `MlcImage`、`MlcTag` 和 `MlcText`，`BasicVideo` 已复用 `MlcImage`、`MlcTag` 和 `MlcText`，`ActivityHero` 已复用 `MlcImage` 和 `MlcText`，`NoticeBar` 已复用 `MlcNoticeBar`，`RichTextBlock` 已复用 `MlcRichText`，`ProductList` 已复用 `MlcButton`、`MlcImage`、`MlcText` 和 `MlcPrice`，`SpacerBlock` 已复用 `MlcSpacer`，`TabsBlock` 已复用 `MlcTabs`，`ActivityRuleModal` 已复用 `MlcModal`，`CountdownTimer` 已复用 `MlcCountdownText`；后续新增或改造物料继续优先复用 primitives 和已存在通用物料，观察 API 稳定性后再评估抽独立 npm 包。
- 继续完善 Vue3 编辑器 UI：在首轮新建页面向导、空白画布起步引导、页面设置面板和 editor page settings API、模板搜索筛选、模板卡片摘要、模板视觉缩略预览、模板 H5 预览入口和 editor preview links API、交付分享清单、本地自定义模板、Schema 文件导入导出和 editor schema file API、本地版本备注/筛选/差异详情和 editor release history API、物料目录组件和 editor material catalog API、物料详情组件和 editor material detail API、物料收藏与最近使用和 editor material preference API、列表项图片素材选择、节点命名、本地自动保存和恢复提示及 editor draft persistence API、编辑器自动草稿 snapshot provider 边界、结构树组件和 editor outline tree API、发布检查节点定位、H5 预览入口、H5 画布视口预设和 editor viewport preset API、画布工具条组件、画布上下文工具条组件、顶部工具栏组件、当前节点信息卡组件、属性字段分组组件、资源选择器主面板组件、页面设置面板组件、发布面板组件、发布面板审批操作闭环、Schema 配置面板组件、源码辅助面板组件、状态面板组件、快捷命令面板组件、节点右键菜单组件、工作区状态摘要组件和 editor workspace summary API、属性面板分组和 editor prop groups API、属性字段模型及 select 枚举控件、number 范围控件、color 色板控件和 editor prop editor model API、数据源配置模型和 editor data source config API、事件绑定模型和 editor event binding API、动作配置模型和 editor action config API、快捷命令面板和 editor command palette API、节点键盘快捷键和 editor node operation API、编辑器权限能力模型和 editor permission/capability API、协作锁定状态模型和 editor collaboration state API、审批状态模型和 editor approval state API、adapters 编辑器工作流状态 client、Vue3 editor playground 本地工作流 provider 边界、结构树多选/成组拖拽候选和 editor node selection API、画布投放提示和 editor canvas drop hint API、画布投放目标和 editor canvas drop target API、画布投放操作和 editor canvas operation API、editor readiness API、version summary API、template summary API、page start API、editor shell theme token 原型以及 `docs/editor-vue-shell-components.md` 的组件化边界基础上，继续治理剩余硬编码样式、真实 Java 协作锁服务接入、真实 Java 审批流接入和管理台扩展插槽，并推进真实图片/视频素材中心、商品中心、优惠券中心、门店/达人中心、真实发布审批、服务端发布校验、服务端 JSON 级版本 diff 和真实回滚流程。
- 基于 Template Library Client 将本地页面模板库和本地自定义模板升级为 Java 配置平台模板市场，补充模板版本、上下架、权限、审核和缩略图。
- 推动 Java 配置平台 API 草案确认：响应包装、鉴权、编辑锁 TTL、抢锁策略、审批、分页、previewToken、note/operator 审计字段和错误码。
- 在 `hybird-meumall` 真实业务仓库创建低代码 H5 路由，并按 `.ai-workspace/contracts/h5-runtime-integration-v1.md` 接入 npm 包。
- 将编辑器侧本地 URL schema handoff 的生产入口替换为 Java 配置平台 previewToken/releaseId/pageId 查询协议；React H5 runtime playground 已支持通过 env 切换 HTTP config platform client。
- 将 Vue3 编辑器 HTTP config platform client 从本地 smoke mock 切换为真实 Java 配置平台，并补齐统一响应解包、错误提示、权限、服务端发布校验、审批和审计。
- 基于 playground HTTP 数据源演示链路，将真实 H5 宿主的 data source resolver 切到 Java/BFF 白名单 HTTP 数据源，并补齐真实鉴权、缓存、重试、分页和字段校验策略。
- 基于 adapters HTTP action handler 和 H5 runtime playground 演示链路，将真实 H5 宿主 action handler 接入跳转桥、领券接口、埋点平台、权限和风控策略，并补齐登录态刷新、幂等、防重复点击和业务错误展示。
- 在已有 renderer fallback 单测、browser broken demo 和 visual smoke PNG 健康断言基础上，继续扩展组件级 DOM 测试、物料搜索/拖拽/属性编辑/发布等更完整浏览器交互 E2E 场景和带基线图 diff 的 visual regression。

## P2

- 规划小程序 renderer/materials。
- 增加 schema migration 工具。
- 增加带基线图 diff 的 visual regression，或继续扩展 preview smoke check 场景。
