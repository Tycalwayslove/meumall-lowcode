# TODO

## P0

- 细化 Page Schema v1 契约字段语义，推动 draft -> ready。
- 定义 Material Manifest v1 契约文档。
- 确认 npm registry、scope 和 access。

## P1

- 继续完善 Vue3 编辑器 UI：移动端 Pointer Events 拖拽、吸附线、多选拖拽、接入真实素材/商品中心、发布审批和回滚流程。
- 将本地页面模板库升级为 Java 配置平台模板市场，补充模板版本、上下架和权限。
- 继续补充电商活动页高阶物料：门店/达人推荐、楼层锚点、活动规则弹窗和组合券包。
- 推动 Java 配置平台 API 草案确认：响应包装、鉴权、审批、分页、previewToken 和错误码。
- 在 `hybird-meumall` 真实业务仓库创建低代码 H5 路由，并按 `.ai-workspace/contracts/h5-runtime-integration-v1.md` 接入 npm 包。
- 将本地 URL schema handoff 的生产入口替换为 Java 配置平台 releaseId/pageId 查询协议。
- 将编辑器 config platform client 从 localStorage mock 切换为真实 Java HTTP client。
- 将 mock data source resolver 升级为真实 HTTP 请求预览、鉴权和缓存策略。
- 将 mock action handler 升级为真实跳转桥、领券接口、埋点平台、权限和风控策略。
- 扩展组件级 DOM 测试、浏览器交互 smoke check 和 visual regression。

## P2

- 规划小程序 renderer/materials。
- 增加 schema migration 工具。
- 增加 visual regression 或 preview smoke check。
