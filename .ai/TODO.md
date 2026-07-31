# TODO

## P0

- 确认 npm registry、scope 和 access。

## P1

- 按 `docs/material-layering-architecture.md` 推进 Phase 1：先在 React/Vue materials 包内部建立 Button、Image、Tag、Text、Price primitives 原型，并改造 `ActionButton`、`ImageBanner`、`SectionTitle` 验证边界；API 稳定前不要急于抽独立 npm 包。
- 继续完善 Vue3 编辑器 UI：在首轮新建页面向导、空白画布起步引导、页面设置面板、模板搜索筛选、模板卡片摘要、模板视觉缩略预览、模板 H5 预览入口、物料搜索、物料详情预览、物料收藏与最近使用、列表项图片素材选择、节点命名、本地自动保存和恢复提示、结构树搜索折叠与画布定位、发布检查节点定位、H5 预览入口、工作区状态摘要、属性面板分组、快捷命令面板、节点右键菜单和键盘快捷键基础上，拆分正式管理台组件、真实素材/商品/优惠券/门店/达人中心、发布审批、服务端发布校验、JSON 级版本 diff 和真实回滚流程。
- 基于 Template Library Client 将本地页面模板库升级为 Java 配置平台模板市场，补充模板版本、上下架、权限和缩略图。
- 推动 Java 配置平台 API 草案确认：响应包装、鉴权、审批、分页、previewToken 和错误码。
- 在 `hybird-meumall` 真实业务仓库创建低代码 H5 路由，并按 `.ai-workspace/contracts/h5-runtime-integration-v1.md` 接入 npm 包。
- 将本地 URL schema handoff 的生产入口替换为 Java 配置平台 releaseId/pageId 查询协议。
- 将编辑器 config platform client 和自动保存草稿从 localStorage mock 切换为真实 Java HTTP client。
- 将 mock data source resolver 升级为真实 HTTP 请求预览、鉴权和缓存策略。
- 将 mock action handler 升级为真实跳转桥、领券接口、埋点平台、权限和风控策略。
- 扩展组件级 DOM 测试、物料搜索/拖拽/属性编辑/发布等更完整浏览器交互 E2E 场景和 visual regression。

## P2

- 规划小程序 renderer/materials。
- 增加 schema migration 工具。
- 增加 visual regression 或 preview smoke check。
