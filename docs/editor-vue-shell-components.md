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

### `EditorOutlineTree`

路径：`apps/editor-playground/src/components/EditorOutlineTree.vue`

职责：

- 展示左侧结构树搜索、可见摘要、多选摘要、节点行、折叠状态、搜索命中状态、多选状态、成组可拖拽状态和内联重命名输入。
- 接收 `rows`、`keyword`、`visibleSummary`、`multiSelectSummary`、`selectedNodeId`、`collapsedNodeIds`、`searchMatchedNodeIds`、`multiSelectedNodeIds`、`groupDraggableNodeIds`、`renamingNodeId` 和 `renameDraft`。
- 通过 emits 抛出搜索更新、重命名草稿更新、节点点击、节点 pointerdown、节点 dragstart、节点 drop、节点右键菜单、折叠切换、多选切换、重命名提交和重命名取消。
- 复用 outline tree、node selection 和 node operation API 产出的展示模型，以及现有 `.outline-*` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不计算结构树行、搜索结果、折叠可见性或成组拖拽可用状态。
- 不写入 Page Schema。
- 不读取或写入 localStorage。
- 不执行真实节点选择、节点移动、重命名、右键菜单定位、画布滚动、权限、协作锁定、审计或服务端保存。

### `EditorCanvasToolbar`

路径：`apps/editor-playground/src/components/EditorCanvasToolbar.vue`

职责：

- 展示画布顶部标题、状态文案、工作区状态摘要和 H5 视口预设切换按钮。
- 接收 `mode`、`statusText`、`stats`、`viewportPresets` 和 `activeViewportPreset`。
- 复用 `EditorWorkspaceStats` 展示工作区状态摘要。
- 通过 emits 抛出 H5 视口预设选择。
- 复用 viewport preset 和 workspace summary API 产出的展示模型，以及现有 `.canvas-top`、`.viewport-switch`、`.workspace-stats` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不计算当前模式、选中节点上下文、校验状态、workspace stats 或 active viewport preset。
- 不写入 Page Schema。
- 不读取或写入 localStorage。
- 不执行真实视口切换、权限、协作锁定、审计或服务端保存。

### `EditorSelectedNodeCard`

路径：`apps/editor-playground/src/components/EditorSelectedNodeCard.vue`

职责：

- 展示右侧属性区的当前节点信息卡，包括节点展示名、物料标题/分类、节点名称输入、节点 id、位置和父级。
- 接收 `displayName`、`materialTitle`、`materialCategory`、`nodeName`、`nodeId`、`positionText` 和 `parentTitle`。
- 通过 emits 抛出节点名称提交。
- 复用现有 `.selected-card`、`.node-name-field` 和 `.selected-meta` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不计算节点展示名、物料信息、节点位置或父级文案。
- 不写入 Page Schema。
- 不读取或写入 localStorage。
- 不处理权限、协作锁定、审计或服务端保存。

## 后续拆分顺序

1. 右侧属性字段编辑器和资源选择器：优先消费 prop groups、prop editor model、event binding、data source config、action config API。
2. 右侧页面设置：优先消费 page settings API。
3. 发布检查、H5 预览入口、交付清单和版本历史：优先消费 readiness、preview links、delivery summary、release history API。

## 抽 npm 包判断

当前不新增 `@meumall/lowcode-editor-vue`。只有当多个 Vue 管理台或独立编辑器同时复用这些 shell 组件，且样式 token、权限插槽、资源选择器插槽和发布操作插槽稳定后，再评估抽成独立 Vue editor UI 包。
