# Vue3 编辑器 Shell 组件化说明

## 目标

Vue3 editor playground 是后续迁入 Java 管理台的参考实现。组件化目标不是把 playground 变成业务后台，而是逐步拆出稳定、低耦合、可迁移的 Vue shell 组件，让管理台接入时复用交互结构和展示模型，而不是复制一个接近 5000 行的 `App.vue`。

## 分层原则

- `@meumall/lowcode-editor` 负责框架无关的状态、命令、展示模型和校验口径。
- `apps/editor-playground/src/components/` 负责 Vue3 shell 展示组件。
- Vue shell 组件优先消费 editor 包产出的模型，例如 `LowcodeEditorWorkspaceStat[]`。
- Vue shell 组件不直接依赖 Java API、localStorage、DOM 测量、权限、审批、审计或服务端保存。
- 真实资源查询、发布、保存、权限和审批仍由宿主 shell 或 Java 管理台注入。

## 已拆组件

### `EditorWorkspaceStats`

路径：`apps/editor-playground/src/components/EditorWorkspaceStats.vue`

职责：

- 展示顶部工作区状态摘要。
- 只接收 `stats: readonly LowcodeEditorWorkspaceStat[]`。
- 复用现有 `.workspace-stats` 和 `.workspace-stat` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不计算节点数、选中状态、校验状态或发布状态。
- 不读取 `LowcodeEditorState` 或 Page Schema。
- 不处理点击、跳转、权限、协作锁定、审计或服务端保存。

### `EditorMaterialCatalog`

路径：`apps/editor-playground/src/components/EditorMaterialCatalog.vue`

职责：

- 展示左侧物料搜索、分类筛选、收藏物料、最近使用、物料卡片和当前容器快捷添加入口。
- 接收 `materials`、`visibleMaterials`、`favoriteMaterials`、`recentMaterials`、`favoriteComponentNames`、`categories`、`keyword`、`category`、`preferenceMessage` 和 `selectedContainerTitle`。
- 通过 emits 抛出关键词更新、分类更新、添加物料、向容器添加物料、收藏切换、打开详情、Pointer Events 拖拽、DragEvent 拖拽和拖拽结束。
- 复用 material catalog summary helper 和现有 `.material-*`、`.container-target` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不写入 Page Schema。
- 不读取或写入 localStorage。
- 不启动真实拖拽流程，不处理 Pointer Events 阈值判断。
- 不打开详情弹窗、不执行资源选择、不处理权限、协作锁定、审计或服务端保存。

### `EditorMaterialDetail`

路径：`apps/editor-playground/src/components/EditorMaterialDetail.vue`

职责：

- 展示物料详情弹窗、manifest 基础信息、配置字段、事件、数据槽和默认 H5 预览。
- 接收 `manifest`、`summary`、`propEntries`、`eventItems`、`dataSourceSlotItems`、`previewSchema`、`registry`、`previewData` 和 `actionExecutor`。
- 通过 emits 抛出关闭弹窗和添加到画布。
- 复用 material detail API 产出的展示模型、`LowcodeVueRenderer` 和现有 `.material-detail-*`、`.material-preview-*`、`.material-prop-*` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不派生默认预览 schema。
- 不写入 Page Schema。
- 不读取或写入 localStorage。
- 不打开资源选择器、不处理收藏偏好、不处理权限、协作锁定、审计或服务端保存。

## 后续拆分顺序

1. 结构树和节点操作：优先消费 outline tree、node selection、node operation API。
2. 画布顶部工具条和视口切换：优先消费 viewport preset、workspace summary API。
3. 右侧页面设置和属性面板：优先消费 page settings、prop groups、prop editor model API。
4. 发布检查、H5 预览入口、交付清单和版本历史：优先消费 readiness、preview links、delivery summary、release history API。

## 抽 npm 包判断

当前不新增 `@meumall/lowcode-editor-vue`。只有当多个 Vue 管理台或独立编辑器同时复用这些 shell 组件，且样式 token、权限插槽、资源选择器插槽和发布操作插槽稳定后，再评估抽成独立 Vue editor UI 包。
