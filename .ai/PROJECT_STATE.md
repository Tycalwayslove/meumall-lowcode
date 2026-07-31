# Project State

## 当前状态

MeuMall Lowcode 已完成第一版 monorepo 骨架、AI 协作体系、GitHub 远端推送、schema/editor 第一批基础代码、Vue3 编辑器 playground 初版、本地 mock 发布预览链路、React H5 与 Vue H5 基础物料对齐、独立 React H5 runtime playground、编辑器到 React H5 runtime 的 schema URL handoff，并扩展了基础电商物料库。

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
- H5 materials 初始实现，已包含容器、公告条、活动头图、图片 Banner、行动按钮、商品列表、优惠券区块、间距块和富文本。
- 低代码版 AI 工作流迁移。
- GitHub 远端 `git@github.com:Tycalwayslove/meumall-lowcode.git` 已配置并推送 `main`。
- Page Schema v1 基础类型、标准化、递归校验和 manifest 校验。
- Editor headless command：模式、视口、选择、插入、更新、复制、移动、删除、undo/redo。
- Vue H5 renderer 初始实现。
- Vue H5 基础物料：容器、公告条、活动头图、图片 Banner、行动按钮、商品列表、优惠券区块、间距块、富文本。
- Vue3 编辑器 playground：物料添加、拖到画布、节点选择、属性编辑、JSON 查看/应用、本地保存、撤销/重做和 H5 预览。
- Vue3 编辑器交互增强：画布节点点击选中、高亮、根节点拖拽排序、页面状态/环境配置和数据源面板。
- Vue3 编辑器实操增强：容器物料、嵌套结构展示、向容器添加子物料、素材/商品快捷选择和 mock 数据源预览绑定。
- Vue3 编辑器发布链路 mock：保存草稿、生成预览、发布页面、本地版本列表和独立 H5 runtime 入口。
- Vue3 编辑器画布上下文操作：选中节点后可前后插入物料、向容器加入物料、同级上移/下移、复制和删除。
- React H5 runtime playground：独立消费 React H5 renderer/materials/core/schema，验证基础物料、容器嵌套和 dataBinding。
- 编辑器到 React H5 runtime handoff：通过 URL schema 参数打开当前编辑 schema 的 React H5 渲染结果。
- 基础电商物料扩展：新增 `ActionButton`、`NoticeBar`、`SpacerBlock`，并同步 Vue/React H5 物料包。

## 已知缺口

- 尚未实现完整生产级编辑器 UI。
- 数据源面板尚未执行真实请求。
- 容器内自由拖拽布局尚未完成；当前支持结构面板拖拽和画布上下文插入/移动。
- Page Schema v1 契约仍为 draft，需要在 Java 配置平台对接前继续细化。
- 尚未定义 Java 配置平台 API 契约。
- 当前发布链路仍是 localStorage mock，尚未对接真实 Java 配置平台。
- 当前 React H5 handoff 使用 URL schema 参数，正式预览仍需 Java 配置平台 previewId/pageId。
- 尚未接入 `hybird-meumall`。
- 尚未配置 npm registry/token。
- 尚未建立单元测试体系。

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
| 2026-07-31 | 待提交 | 扩展行动按钮、公告条和间距块基础物料。 |

## 默认验证命令

```bash
pnpm typecheck
pnpm build
pnpm dev
```
