# TODO

## P0

- 细化 Page Schema v1 契约字段语义，推动 draft -> ready。
- 定义 Material Manifest v1 契约文档。
- 确认 npm registry、scope 和 access。

## P1

- 继续完善 Vue3 编辑器 UI：精确拖拽插入线、真实素材选择器、真实商品选择器、发布审批和回滚流程。
- 将本地页面模板库升级为 Java 配置平台模板市场，补充模板版本、上下架和权限。
- 继续补充电商活动页高阶物料：门店/达人推荐、楼层锚点、活动规则弹窗和组合券包。
- 设计 Java 配置平台 API 契约。
- 设计 `hybird-meumall` 接入方式。
- 将 React H5 runtime playground 的接入方式沉淀为 `hybird-meumall` 路由集成清单。
- 将本地 URL schema handoff 替换为 Java 配置平台 previewId/pageId 查询协议。
- 将 mock data source resolver 升级为真实 HTTP 请求预览、鉴权和缓存策略。
- 将 mock action handler 升级为真实跳转桥、领券接口、埋点平台、权限和风控策略。
- 扩展组件级 DOM 测试、浏览器交互 smoke check 和 visual regression。

## P2

- 规划小程序 renderer/materials。
- 增加 schema migration 工具。
- 增加 visual regression 或 preview smoke check。
