# TODO

## P0

- 确认 npm registry、scope、access 和 token；当前已具备 `pnpm pack:dry-run` 包内容预检，但尚未执行真实 npm 发布。

## P1

- 按 `docs/material-layering-architecture.md` 继续推进 Phase 1：现有主要 React/Vue H5 物料已基本复用内部 `MlcButton`、`MlcImage`、`MlcTag`、`MlcText`、`MlcPrice`、`MlcInput`、`MlcTextarea`、`MlcSwitch`、`MlcStepper`、`MlcOverlay`、`MlcModal`、`MlcCountdownText`、`MlcTabs`、`MlcSpacer` 和 `h5Tokens`；`SpacerBlock` 已复用 `MlcSpacer`，`TabsBlock` 已复用 `MlcTabs`，`ActivityRuleModal` 已复用 `MlcModal`，`CountdownTimer` 已复用 `MlcCountdownText`，后续新增或改造物料继续优先复用 primitives，观察 API 稳定性后再评估抽独立 npm 包。
- 继续完善 Vue3 编辑器 UI：在首轮新建页面向导、空白画布起步引导、页面设置面板、模板搜索筛选、模板卡片摘要、模板视觉缩略预览、模板 H5 预览入口和 editor preview links API、交付分享清单、本地自定义模板、Schema 文件导入导出和 editor schema file API、本地版本备注/筛选/差异详情、物料搜索和 editor material catalog API、物料详情预览、物料收藏与最近使用、列表项图片素材选择、节点命名、本地自动保存和恢复提示及 editor draft persistence API、结构树搜索折叠与画布定位和 editor outline tree API、发布检查节点定位、H5 画布视口预设和 editor viewport preset API、工作区状态摘要和 editor workspace summary API、属性面板分组和 editor prop groups API、属性字段模型和 editor prop editor model API、事件绑定模型和 editor event binding API、动作配置模型和 editor action config API、快捷命令面板和 editor command palette API、节点右键菜单、节点键盘快捷键、editor readiness API、version summary API、template summary API 和 page start API 基础上，继续拆分正式管理台组件、真实素材/商品/优惠券/门店/达人中心、发布审批、服务端发布校验、服务端 JSON 级版本 diff 和真实回滚流程。
- 基于 Template Library Client 将本地页面模板库和本地自定义模板升级为 Java 配置平台模板市场，补充模板版本、上下架、权限、审核和缩略图。
- 推动 Java 配置平台 API 草案确认：响应包装、鉴权、审批、分页、previewToken 和错误码。
- 在 `hybird-meumall` 真实业务仓库创建低代码 H5 路由，并按 `.ai-workspace/contracts/h5-runtime-integration-v1.md` 接入 npm 包。
- 将本地 URL schema handoff 的生产入口替换为 Java 配置平台 releaseId/pageId 查询协议。
- 将编辑器 config platform client 和自动保存草稿从 localStorage mock 切换为真实 Java HTTP client。
- 将 mock data source resolver 升级为真实 HTTP 请求预览、鉴权和缓存策略。
- 将 mock action handler 升级为真实跳转桥、领券接口、埋点平台、权限和风控策略。
- 在已有 renderer fallback 单测和 browser broken demo 基础上，继续扩展组件级 DOM 测试、物料搜索/拖拽/属性编辑/发布等更完整浏览器交互 E2E 场景和 visual regression。

## P2

- 规划小程序 renderer/materials。
- 增加 schema migration 工具。
- 增加 visual regression 或 preview smoke check。
