# Vue3 编辑器 Shell 组件化说明

## 目标

Vue3 editor playground 是后续迁入 Java 管理台的参考实现。组件化目标不是把 playground 变成业务后台，而是逐步拆出稳定、低耦合、可迁移的 Vue shell 组件，让管理台接入时复用交互结构和展示模型，而不是复制一个接近 5000 行的 `App.vue`。

## 分层原则

- `@meumall/lowcode-editor` 负责框架无关的状态、命令、展示模型和校验口径。
- `apps/editor-playground/src/components/` 负责 Vue3 shell 展示组件。
- Vue shell 组件优先消费 editor 包产出的模型，例如 `LowcodeEditorWorkspaceStat[]`。
- Vue shell 组件不直接依赖 Java API、localStorage、DOM 测量、权限、审批、审计或服务端保存。
- 真实资源查询、发布、保存、权限和审批仍由宿主 shell 或 Java 管理台注入。

## 样式 Token

`apps/editor-playground/src/editor-theme.css` 是 Vue3 编辑器 shell 的主题 token 原型，负责声明 `--mlc-editor-*` 变量，例如文字、面板、边框、状态色、控件高度、圆角、阴影和焦点环。`main.ts` 必须先引入 `editor-theme.css`，再引入 `styles.css`，让具体组件样式消费 token。

这些 token 只服务管理台编辑器 UI，不服务运营 H5 runtime 页面。它们与 `packages/materials-*` 内部 `h5Tokens`、`MlcButton`、`MlcInput` 等 runtime primitives 分开治理，避免编辑器控件和用户访问页面的触控、性能、主题边界互相污染。

当前不新增 `@meumall/lowcode-editor-vue` 或公开 design-tokens npm 包。只有当多个 Vue 管理台或独立编辑器复用 shell 组件，并且样式 token、权限插槽、资源选择器插槽和发布操作插槽稳定后，再评估抽包。

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

### `EditorCommandPalette`

路径：`apps/editor-playground/src/components/EditorCommandPalette.vue`

职责：

- 展示全局快捷命令弹窗、搜索输入、命令列表、禁用状态、分组标签和空状态。
- 接收弹窗打开状态、搜索关键词和 command palette API 过滤后的命令项。
- 通过 emits 抛出关闭、关键词更新、执行首个可用命令和执行指定命令。
- 复用 command palette API 产出的命令展示模型，以及现有 `.command-*` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不派生命令列表或搜索结果。
- 不执行命令函数。
- 不处理全局快捷键、焦点互斥、弹窗互斥、权限、协作锁定、审计或服务端保存。
- 不写入 Page Schema。
- 不读取或写入 localStorage。

### `EditorTopToolbar`

路径：`apps/editor-playground/src/components/EditorTopToolbar.vue`

职责：

- 展示顶部品牌、页面标题、保存状态、自动保存状态、通用 capability 状态、主工具栏和历史/保存/发布工具栏。
- 接收页面标题、dirty 状态、自动保存文案和 tone、当前模式、撤销/重做可用状态、宿主按 editor permission/capability API 派生的按钮禁用原因，以及 `LowcodeEditorCapabilityStatusItem[]`。
- 通过 emits 抛出打开快捷命令、新建页面、模式切换、撤销、重做、保存草稿、导出 schema、导入 schema、生成预览、发布、打开 H5 和打开 React H5。
- 提供 `status-extra`、`primary-actions` 和 `secondary-actions` 命名插槽，供管理台宿主插入状态提示、顶部业务操作或审计入口。
- 复用现有 `.topbar`、`.brand`、`.toolbar`、`.save-pill`、`.auto-save-pill` 和 `.capability-pill` 样式；状态项通过 `data-capability-status-id` 暴露稳定 smoke check DOM 语义。

不负责：

- 不写入 `LowcodeEditorState` 或 Page Schema。
- 不读取或写入 localStorage。
- 不持有隐藏文件 input、不解析导入文件、不构造 H5 URL。
- 不执行真实保存、预览、发布、回滚、权限决策、协作锁定决策、审批流转、审计或服务端保存。

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

### `EditorNodeContextMenu`

路径：`apps/editor-playground/src/components/EditorNodeContextMenu.vue`

职责：

- 展示节点右键菜单遮罩、菜单头、菜单项、快捷键文案、禁用状态、危险操作样式和操作图标。
- 接收打开状态、菜单位置 style、节点展示名、节点副标题和 node operation API 派生后的菜单项。
- 通过 emits 抛出关闭菜单和执行指定菜单项。
- 复用 node operation API 产出的菜单项展示模型，以及现有 `.node-context-*` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不派生菜单项、禁用状态、节点标题或菜单位置。
- 不执行真实节点操作、确认弹窗、快捷键识别、菜单定位、权限、协作锁定、审计或服务端保存。
- 不写入 Page Schema。
- 不读取或写入 localStorage。

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

### `EditorCanvasContextToolbar`

路径：`apps/editor-playground/src/components/EditorCanvasContextToolbar.vue`

职责：

- 展示设计模式下选中节点的画布上下文工具条，包括选中物料标题、节点 id、插入物料下拉框和节点快捷操作按钮。
- 接收选中物料标题、节点 id、插入物料选项、当前插入物料组件名和 node operation API 派生后的操作项。
- 通过 emits 抛出插入物料更新、前方插入、后方插入、加入容器、上移、下移、创建副本、打开更多菜单和删除事件。
- 复用 node operation API 产出的禁用态，以及现有 `.canvas-context-toolbar`、`.context-title` 和 `.context-actions` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不派生物料选项、选中节点、选中物料或操作项。
- 不判断节点是否可移动、是否容器或是否可粘贴。
- 不写入 Page Schema。
- 不定位右键菜单。
- 不读取或写入 localStorage。
- 不执行真实插入、移动、复制、删除、权限、协作锁定、审计或服务端保存。

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

### `EditorPropGroupsPanel`

路径：`apps/editor-playground/src/components/EditorPropGroupsPanel.vue`

职责：

- 展示右侧属性区的属性分组、基础字段控件、manifest `select/options` 下拉选择、manifest `min/max/step/unit` 数值步进控件、manifest `swatches` 颜色色板控件、数组列表编辑器、列表项图片素材选择面板和事件绑定列表。
- 接收 `propGroups`、`selectedProps`、`selectedComponentName`、`collapsedGroups`、列表项拖拽状态、列表项素材目标、素材筛选状态、素材列表和事件绑定展示模型。
- 通过 emits 抛出分组折叠、属性更新、列表项增删改移、列表项拖拽、列表项素材选择、素材筛选、商品快捷操作和事件绑定操作。
- 复用 prop groups、prop editor model 和 event binding API 产出的展示模型，以及现有 `.property-*`、`.list-*`、`.resource-*` 和 `.event-binding-list` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不持有选中节点或 Page Schema。
- 不执行真实 `replaceNodeProps`、节点 events 写回或 dataBinding 写回。
- 不查询素材、商品、优惠券、门店/达人等资源。
- 不读取或写入 localStorage。
- 不处理权限、协作锁定、审计或服务端保存。

### `EditorResourcePanels`

路径：`apps/editor-playground/src/components/EditorResourcePanels.vue`

职责：

- 展示右侧属性区的图片素材库、商品选择器、优惠券库和门店/达人库。
- 接收图片属性选项、素材筛选状态、商品/优惠券/门店达人筛选状态、资源列表、选中资源 id、选中数量和当前节点 dataBinding 状态。
- 通过 emits 抛出筛选更新、图片素材应用、商品/优惠券/门店达人勾选、应用选中资源、绑定数据源、清空静态资源和示例商品操作。
- 复用现有 `.resource-*`、`.asset-*`、`.product-*` 和 `.coupon-*` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不持有 Resource Library Client、选中节点或 Page Schema。
- 不执行真实资源查询、静态 props 写回或 dataBinding 写回。
- 不读取或写入 localStorage。
- 不处理权限、协作锁定、审计或服务端保存。

### `EditorPageSettingsPanel`

路径：`apps/editor-playground/src/components/EditorPageSettingsPanel.vue`

职责：

- 展示右侧页面设置面板，包括基础配置、布局配置、发布配置、版本备注和发布操作反馈。
- 接收 `LowcodeEditorPageSettingsForm`、版本备注草稿和发布操作反馈文案。
- 通过 emits 抛出标题、描述、页面类型、背景色、安全区、H5 最大宽度、状态、发布环境和版本备注草稿更新。
- 复用 page settings API 产出的展示模型，以及现有 `.page-settings-*`、`.field`、`.switch-field` 和 `.publish-message` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不派生页面设置表单模型。
- 不写入 Page Schema。
- 不读取或写入 localStorage。
- 不执行发布、预览、保存、权限、协作锁定、审批、审计或服务端保存。

### `EditorPublishPanel`

路径：`apps/editor-playground/src/components/EditorPublishPanel.vue`

职责：

- 展示右侧发布相关区域，包括 H5 预览入口、交付清单、发布审批、发布检查、本地版本列表、版本对比和 Schema 片段预览。
- 接收 preview links、delivery summary、approval state、readiness、release history 和 version summary API 派生后的展示模型。
- 通过 emits 抛出预览入口打开/复制、Schema 复制/导出、提交审批、撤回审批、审核通过、审核驳回、发布检查定位、版本关键词更新、版本选择/载入/打开、载入所选版本和回滚发布。
- 提供 `delivery-extra`、`approval-extra`、`publish-check-extra` 和 `release-extra` 命名插槽，供管理台宿主插入交付策略、审批策略、服务端校验说明或版本治理入口。
- 复用现有 `.preview-link-*`、`.delivery-*`、`.approval-workflow-*`、`.publish-*`、`.release-*` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不派生 H5 预览入口、交付指标、审批状态、发布检查、版本列表、版本差异或 Schema 片段预览。
- 不写入 Page Schema。
- 不读取或写入 localStorage。
- 不构造 URL、不访问剪贴板、不导出文件、不定位画布节点。
- 不执行保存、预览、发布、载入版本、回滚、权限、协作锁定、审批、审计或服务端保存。

### `EditorSchemaConfigPanel`

路径：`apps/editor-playground/src/components/EditorSchemaConfigPanel.vue`

职责：

- 展示右侧 Schema 级配置区域，包括数据源配置和动作配置。
- 接收 data source config API 和 action config API 派生后的表单项、动作类型选项和动作执行反馈文案。
- 通过 emits 抛出数据源新增、字段更新、参数 JSON 更新、删除，以及动作新增、ID 更新、类型更新、参数 JSON 更新和删除。
- 复用现有 `.data-source-*`、`.action-*`、`.field`、`.reset-button` 和 `.action-message` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不派生数据源表单项、动作表单项或动作类型选项。
- 不解析 JSON。
- 不写入 Page Schema。
- 不读取或写入 localStorage。
- 不执行真实 data source resolver、action handler、事件绑定、权限、协作锁定、审计或服务端保存。

### `EditorSourcePanel`

路径：`apps/editor-playground/src/components/EditorSourcePanel.vue`

职责：

- 展示源码模式 JSON 文本域、应用 JSON、导出 JSON、导入 JSON、导入导出提示和 JSON 错误提示。
- 接收 schema JSON 草稿、导入导出提示和 JSON 错误提示。
- 通过 emits 抛出 schema 草稿更新、应用 JSON、导出 JSON 和导入 JSON。
- 复用现有 `.schema-editor`、`.schema-actions` 和 `.schema-transfer-message` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不解析 JSON。
- 不校验 Page Schema。
- 不写入 Page Schema。
- 不持有隐藏文件 input、不读取本地文件、不导出文件。
- 不读取或写入 localStorage。
- 不执行保存、预览、发布、权限、协作锁定、审批、审计或服务端保存。

### `EditorStatusPanel`

路径：`apps/editor-playground/src/components/EditorStatusPanel.vue`

职责：

- 展示右侧状态面板、节点数、历史 past/future 数、校验状态、最近操作和重置示例按钮。
- 展示 editor demo checklist API 派生后的实操清单，作为运营演示验收路径的状态入口。
- 接收节点数、历史 past 数、历史 future 数、校验是否通过、demo checklist API 派生后的实操清单和 audit trail API 派生后的最近操作展示项。
- 通过 emits 抛出重置示例事件。
- 复用现有 `.state-list`、`.panel-section`、`.panel-title`、`.reset-button`、`.demo-checklist-*` 和 `.audit-trail-*` 样式，保持当前视觉与 smoke check DOM 语义。

不负责：

- 不派生节点数、历史数、校验状态、实操清单状态或审计事件。
- 不执行真实 `resetSchema`。
- 不写入 Page Schema。
- 不读取或写入 localStorage。
- 不执行保存、预览、发布、权限、协作锁定、审批、审计或服务端保存。

### `EditorAuditPanel`

路径：`apps/editor-playground/src/components/EditorAuditPanel.vue`

职责：

- 展示顶部宿主审计入口打开后的审计日志抽屉。
- 接收 audit trail API 派生后的审计展示项。
- 展示审计标题、时间、操作者、目标、描述和结果状态。
- 通过 emits 抛出关闭事件。
- 复用 `.audit-panel-*` 样式，暴露 `data-testid="audit-log-panel"` 和 `data-testid="audit-log-close"` 供 smoke check 验证。

不负责：

- 不创建审计事件。
- 不查询、持久化、分页、筛选、导出或清空审计日志。
- 不读取或写入 localStorage。
- 不调用 Java 审计服务。
- 不处理权限、协作锁定、审批或服务端保存。

## 后续拆分顺序

当前首轮 Vue shell 面板和工具条拆分已覆盖主要内联区域，编辑器主题 token 已先在 playground 内部沉淀，顶部工具栏已改为消费 capability status items，顶部工具栏和发布面板已提供首批管理台宿主扩展插槽，审计日志入口已拆为独立 shell 面板。后续优先继续治理剩余硬编码样式、权限插槽、真实协作锁服务、真实审批流、真实审计服务和更多管理台扩展插槽，再评估是否抽 `@meumall/lowcode-editor-vue`。

## 抽 npm 包判断

当前不新增 `@meumall/lowcode-editor-vue`。只有当多个 Vue 管理台或独立编辑器同时复用这些 shell 组件，且样式 token、权限插槽、资源选择器插槽和发布操作插槽稳定后，再评估抽成独立 Vue editor UI 包。
