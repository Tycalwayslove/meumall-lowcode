# 低代码工作区地图

## 总览

```text
editor -> schema
design-tokens
primitives-react-h5 -> design-tokens
primitives-vue-h5 -> design-tokens
renderer-h5 -> core -> schema
materials-h5 -> core -> schema
materials-h5 -> primitives-react-h5
runtime-react-h5 -> adapters + renderer-h5 + materials-h5 + core + schema
renderer-vue-h5 -> core -> schema
materials-vue-h5 -> renderer-vue-h5 -> core -> schema
materials-vue-h5 -> primitives-vue-h5
adapters -> schema
editor-playground -> editor + renderer-vue-h5 + materials-vue-h5
h5-runtime-playground -> runtime-react-h5 + adapters + schema

Java config platform -> stores and publishes PageSchema
hybird-meumall -> consumes runtime-react-h5 or renderer-h5/materials-h5/schema
future mini-program runtime -> consumes schema/core
```

## 当前维护包

### `packages/schema`

npm 包：`@meumall/lowcode-schema`

负责 Page Schema、Node Schema、Material Manifest、DataSource、Action、Tracking、PublishMeta 等公共协议。

### `packages/core`

npm 包：`@meumall/lowcode-core`

负责框架无关的 runtime 能力：物料注册、节点遍历、默认 props 合并、可见性判断、数据绑定和 action 执行协议。

### `packages/renderer-h5`

npm 包：`@meumall/lowcode-renderer-h5`

负责 React H5 渲染：递归渲染节点、物料查找、事件绑定和组件级错误兜底。

### `packages/materials-h5`

npm 包：`@meumall/lowcode-materials-h5`

负责 MeuMall H5 运营页面物料。物料必须声明 manifest，不得依赖 `hybird-meumall` 内部模块。

物料内部需要按 `docs/material-layering-architecture.md` 区分通用物料和业务物料。基础 Button、Image、Tag、Text、Price、Input、Select 等能力已抽到 `@meumall/lowcode-primitives-react-h5`，materials 只负责低代码物料 manifest 和物料组合语义。

### `packages/runtime-react-h5`

npm 包：`@meumall/lowcode-runtime-react-h5`

负责 React H5 宿主组合层：默认物料 registry、schema loader hook、数据源解析、schema 校验、节点统计、运行态健康摘要和 `LowcodeRenderer` 挂载。该包面向真实 H5 消费方减少接入样板代码，不替代 `renderer-h5`、`materials-h5`、`adapters` 或 `schema` 的职责。

### `packages/renderer-vue-h5`

npm 包：`@meumall/lowcode-renderer-vue-h5`

负责 Vue 3 H5 渲染。当前主要服务 Vue3 编辑器预览和未来 Vue 管理台迁移，也可作为 Vue 技术栈 H5 runtime 的基础。

### `packages/materials-vue-h5`

npm 包：`@meumall/lowcode-materials-vue-h5`

负责 Vue 3 版本 H5 运营物料。物料 manifest 与 `schema/core` 共用，组件实现面向 Vue runtime。

Vue H5 物料与 React H5 物料必须保持同一 `componentName` 和 manifest 语义。Vue 基础 Button、Image、Tag、Text、Input 等能力已抽到 `@meumall/lowcode-primitives-vue-h5`；Vue runtime primitives 与编辑器后台 UI 控件分开治理。

### Runtime primitives 和 design tokens

已实现基础包：

- `@meumall/lowcode-design-tokens`
- `@meumall/lowcode-primitives-react-h5`
- `@meumall/lowcode-primitives-vue-h5`

`@meumall/lowcode-design-tokens` 已作为框架无关公开包实现，当前提供 H5 runtime primitives 共用的 token 和 helper，不依赖 schema/core/editor/renderer/materials。React/Vue runtime primitives 已分别抽为公开包。原则上 primitives 不声明低代码 manifest，不依赖 schema/core/editor/renderer/materials，只提供业务无关的运行时基础 UI。

### `packages/editor`

npm 包：`@meumall/lowcode-editor`

负责编辑器基础状态、画布协议、节点选择、增删移动、schema import/export。后续 UI shell 可以在此包或单独 app 中扩展。

### `apps/editor-playground`

Vue3 编辑器 playground。负责演示和验证：

- 物料添加。
- 画布 H5 预览。
- 节点选择。
- 属性编辑。
- JSON 查看和应用。
- 本地保存。

该 app 可以作为后续迁入 Java 管理系统的参考实现，但不作为业务管理后台本体。

### `apps/h5-runtime-playground`

React H5 runtime playground。负责演示和验证：

- `@meumall/lowcode-runtime-react-h5` 消费 Page Schema 并挂载 React H5 renderer/materials。
- mock runtime data 通过 dataBinding 注入商品列表。
- 未来 `hybird-meumall` H5 接入形态。

该 app 只作为 H5 runtime 集成参考，不作为真实 H5 业务工程。

### `packages/adapters`

npm 包：`@meumall/lowcode-adapters`

负责 action registry、data source registry 和宿主能力适配协议。

## 外部系统

### Java 配置平台

负责草稿保存、预览查询、发布审批、已发布 schema 查询、素材/商品/优惠券/活动选择、回滚和禁用。

本仓库只维护前端/运行时消费协议，不实现 Java 服务端。

### `hybird-meumall`

H5 消费方。通过 npm 引入 schema、renderer、materials 和 adapters，不把低代码平台源码复制进 H5 仓库。

### 未来小程序

复用 `schema` 和 `core`，新增 `renderer-miniapp` 和 `materials-miniapp`。H5 物料默认不自动跨端，必须显式声明平台支持。

## 依赖方向

- `schema` 不依赖任何业务包。
- `design-tokens` 不依赖 schema、core、editor、renderer、materials 或业务项目。
- `primitives-*` 只依赖 `design-tokens` 和对应端框架 peer dependency，不依赖 schema、core、editor、renderer、materials 或业务项目。
- `core` 只依赖 `schema`。
- `renderer-*` 可以依赖 `core` 和 `schema`，不得依赖 `editor`。
- `materials-*` 可以依赖 `core` 和 `schema`，不得依赖业务项目。
- `materials-*` 可以依赖对应端 `primitives-*`，但 `primitives-*` 不得反向依赖 `materials-*`、`renderer-*`、`editor`、`schema` 或 `core`。
- `runtime-react-h5` 可以依赖 `adapters`、`core`、`renderer-h5`、`materials-h5` 和 `schema`，不得依赖编辑器或业务项目。
- `editor` 可以依赖 `core` 和 `schema`，不得依赖 renderer 的私有实现。
- `editor` 不直接依赖 H5 runtime primitives；编辑器后台控件单独治理或接入管理台组件库。
- `adapters` 可以依赖 `schema`，宿主实现通过注册注入。
- `apps/*` 可以组合各包做集成验证，但不得让包反向依赖 app。

违反依赖方向必须先写决策记录。
