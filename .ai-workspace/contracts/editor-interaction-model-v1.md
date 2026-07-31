# Editor Interaction Model v1 契约

## 状态

draft

## 提供方

- `@meumall/lowcode-editor`

## 消费方

- 后续运营编辑器 UI
- 后续 Java 配置平台编辑页面

## 适用环境

- 本地 playground
- Java 管理台内嵌编辑器
- 独立低代码编辑器应用

## 版本策略

- 当前为 headless editor command v1。
- 新增 command 为兼容变更。
- 修改已有 command 参数语义或状态结构的关键字段为不兼容变更。

## 输入格式

编辑器状态由 `LowcodeEditorState` 表示：

```ts
interface LowcodeEditorState {
  schema: LowcodePageSchema;
  selectedNodeId?: string;
  mode: "design" | "preview" | "outline";
  viewport: LowcodeEditorViewport;
  history: LowcodeEditorHistory;
  dirty: boolean;
}
```

## 输出格式

所有 command 返回新的 `LowcodeEditorState`，不原地修改输入状态。

核心 command：

- `createEditorState`
- `selectNode`
- `setEditorMode`
- `setEditorViewport`
- `setEditorViewportPreset`
- `insertNode`
- `appendNode`
- `updateNodeProps`
- `replaceNodeProps`
- `updateNodeStyle`
- `setNodeVisibility`
- `copyNode`
- `pasteNode`
- `duplicateNode`
- `moveNode`
- `moveNodeById`
- `removeNode`
- `undo`
- `redo`
- `markSaved`

视口预设 API：

- `LOWCODE_H5_VIEWPORT_PRESETS`
- `getLowcodeEditorViewportPreset`
- `findLowcodeEditorViewportPreset`
- `createLowcodeEditorViewportFromPreset`
- `formatLowcodeEditorViewportTitle`

当前 H5 预设包含 360 紧凑屏、390 标准屏和 430 大屏。预设只服务编辑器 shell 的画布展示，不写入 Page Schema。

物料目录 API：

- `createLowcodeMaterialCatalogItem`
- `createLowcodeMaterialCategories`
- `filterLowcodeMaterialCatalog`
- `pickLowcodeMaterialEntriesByComponentNames`
- `formatLowcodeMaterialCatalogSummary`

物料目录 API 从 `LowcodeMaterialManifest` 派生列表展示、分类、搜索和摘要信息。关键词匹配覆盖标题、组件名、分类、版本和平台；这些 API 不修改 Material Manifest、Page Schema 或 renderer 行为。

物料偏好模型 API：

- `LOWCODE_EDITOR_RECENT_MATERIAL_DEFAULT_LIMIT`
- `normalizeLowcodeMaterialComponentNames`
- `parseLowcodeMaterialPreferenceContent`
- `isLowcodeFavoriteMaterial`
- `toggleLowcodeFavoriteMaterial`
- `recordLowcodeRecentMaterial`
- `createLowcodeMaterialFavoriteMessage`

物料偏好模型 API 从组件名列表和 `LowcodeMaterialManifest` 标题派生收藏、最近使用、组件名解析、去重、未知物料过滤、数量截断和操作提示文案。偏好列表只保存 `componentName`，方便宿主在 localStorage、用户偏好接口或多端同步服务之间切换存储实现。API 不读取或写入 localStorage、不调用 HTTP、不渲染 UI、不解析用户、不同步设备、不处理权限、审计或偏好迁移。

物料详情模型 API：

- `createLowcodeMaterialDetailSummary`
- `createLowcodeMaterialDetailPropEntries`
- `createLowcodeMaterialDetailEventItems`
- `createLowcodeMaterialDetailDataSourceSlotItems`
- `createLowcodeMaterialNodeInput`
- `createLowcodeMaterialPreviewSchema`

物料详情模型 API 从 `LowcodeMaterialManifest` 派生详情摘要、配置字段、事件、数据槽、可插入节点输入和单节点 H5 默认预览 Page Schema。预览 schema 可接收宿主提供的 dataSources、actions、environment、operator、布局尺寸和 dataBinding 默认值。API 不渲染弹窗、不挂载 React/Vue renderer、不打开资源选择器、不添加物料到当前画布、不持久化偏好、不调用 Java API，不处理权限、审计、物料上下架或真实预览数据。

快捷命令 API：

- `LOWCODE_EDITOR_COMMAND_DEFAULT_LIMIT`
- `createLowcodeEditorCommandSearchText`
- `filterLowcodeEditorCommands`
- `groupLowcodeEditorCommands`

快捷命令 API 从命令条目的 title、group、description 和 keywords 派生搜索文本，默认最多展示 28 条，并默认保留 disabled 命令，方便 UI 壳展示不可用状态。API 只处理命令目录展示模型，不执行命令、不绑定快捷键、不做权限判断、不修改 Page Schema、Material Manifest 或 renderer 行为。

节点操作模型 API：

- `createLowcodeNodeOperationItems`
- `resolveLowcodeNodeShortcutAction`
- `createLowcodeNodeOperationMessage`

节点操作模型 API 从宿主提供的可插入、可加入容器、可移动、可粘贴等状态派生节点右键菜单、画布工具条、节点卡片快捷操作、快捷键动作和反馈文案。快捷键覆盖 Delete/Backspace、`Meta/Ctrl + C`、`Meta/Ctrl + V`、`Meta/Ctrl + D`、`Meta/Ctrl + Z`、`Meta/Ctrl + Shift + Z` 和 `Ctrl + Y`。API 不执行节点命令、不绑定 DOM 事件、不定位菜单、不滚动画布、不弹确认框、不处理权限或审计、不修改 Page Schema、Material Manifest 或 renderer 行为。

结构树 API：

- `createLowcodeOutlineRows`
- `createLowcodeOutlineRowSearchText`
- `createLowcodeOutlineVisibility`
- `pruneLowcodeOutlineCollapsedNodeIds`
- `revealLowcodeOutlineNode`

结构树 API 从 Page Schema nodes 和可选物料 manifest 派生结构树行模型、搜索文本、搜索命中、折叠可见性、选中路径和可见数量摘要。关键词匹配覆盖节点 id、componentName、`meta.name`、物料标题和物料分类；折叠祖先会隐藏子节点，但当前选中路径保持可见。API 不执行节点选择、不处理 DOM 滚动、不处理拖拽、多选、重命名或权限。

节点选择模型 API：

- `toggleLowcodeNodeSelection`
- `pruneLowcodeNodeSelection`
- `pickLowcodeSelectedOutlineRows`
- `hasLowcodeSameParentSelection`
- `createLowcodeNodeSelectionSummary`
- `createLowcodeNodeSelectionModel`
- `isLowcodeNodeSelected`
- `canLowcodeDragSelectedGroup`
- `getLowcodeSelectedGroupNodeIdsForDrag`

节点选择模型 API 从结构树 rows 和宿主保存的 selected node ids 派生多选切换结果、无效选中裁剪结果、选中行、同父级状态、多选摘要、节点选中状态、同父级成组拖拽可用状态和按结构树顺序排列的拖拽节点组。API 不绑定 DOM 事件、不处理 Pointer Events、不计算投放位置、不执行节点移动、不渲染勾选控件、不修改 Page Schema、不处理权限、协作锁定、审计或服务端保存。宿主 shell 负责 Vue/React UI、拖拽执行、节点移动命令、权限判断和用户反馈。

画布投放提示模型 API：

- `resolveLowcodeCanvasDropPlacement`
- `createLowcodeCanvasDropHintStyle`
- `createLowcodeCanvasSnapGuides`
- `createLowcodeCanvasAppendDropHint`
- `createLowcodeCanvasTargetDropHint`
- `isLowcodeInvalidNodeDropTarget`

画布投放提示模型 API 从宿主提供的指针坐标、目标节点、目标节点矩形、画布 frame metrics 和 Page Schema nodes 派生 before/after/inside/append 投放位置、投放提示 style、吸附线、append hint、target hint 和节点拖拽非法目标判断。默认只有 `SectionContainer` 的中部区域可投放 inside。API 不查询 DOM、不绑定 DragEvent 或 Pointer Events、不滚动画布、不插入物料、不执行节点移动、不渲染吸附线、不修改 Page Schema、不处理权限、协作锁定、审计或服务端保存。宿主 shell 负责元素测量、事件处理、投放执行、节点命令、权限判断和用户反馈。

画布投放目标模型 API：

- `getLowcodeCanvasAdjacentDropIndex`
- `createLowcodeCanvasDropTarget`
- `getLowcodeAdjustedCanvasMoveIndex`
- `createLowcodeCanvasNodeMoveTarget`
- `createLowcodeCanvasGroupMoveTarget`

画布投放目标模型 API 从结构树 rows、drop hint、根节点数量和源节点 id 派生 append/inside/before/after 的 `parentId + index`，并处理单节点同父级移动和同父级成组移动在源节点移除后的 index 修正。API 不插入物料、不执行节点移动、不替换 siblings、不修改 Page Schema、不查询 DOM、不绑定 DragEvent 或 Pointer Events、不处理跨父级成组拖拽、不处理权限、协作锁定、审计或服务端保存。宿主 shell 负责真实 schema 命令、移动执行、权限判断和用户反馈。

属性分组 API：

- `LOWCODE_EDITOR_PROP_GROUP_ORDER`
- `LOWCODE_EDITOR_PROP_GROUP_META`
- `getLowcodePropGroupKey`
- `createLowcodePropGroups`
- `isLowcodePropGroupCollapsed`
- `toggleLowcodePropGroupCollapsed`

属性分组 API 从物料 `propsSchema` 的字段名、setter 和字段类型派生内容配置、样式配置、数据配置、行为配置和其他配置分组，并提供默认中文分组文案、稳定排序和折叠状态纯 helper。API 不渲染具体 setter 控件、不打开资源选择器、不修改 Page Schema 值、不处理字段权限或审计。

属性字段模型 API：

- `getLowcodePropEditorControl`
- `isLowcodeListPropEditor`
- `isLowcodeStructuredPropEditor`
- `createLowcodeListEditorFields`
- `isLowcodeListImageField`
- `createLowcodeDefaultListItem`
- `toLowcodePropInputText`
- `toLowcodePropInputBoolean`
- `normalizeLowcodePropInputValue`

属性字段模型 API 从 `LowcodePropSchema`、字段名、组件名和当前列表项派生属性面板控件类型、列表项字段模型、图片字段标记、默认新增项和输入值转换结果。API 不渲染 Vue/React 控件、不处理 DOM、不打开资源选择器、不执行保存、不处理权限、审计或服务端校验。

页面设置模型 API：

- `LOWCODE_EDITOR_PAGE_TYPE_OPTIONS`
- `LOWCODE_EDITOR_PAGE_STATUS_OPTIONS`
- `LOWCODE_EDITOR_PUBLISH_ENVIRONMENT_OPTIONS`
- `LOWCODE_EDITOR_PAGE_BACKGROUND_SWATCHES`
- `createLowcodePageSettingsForm`
- `normalizeLowcodePageMaxWidth`
- `updateLowcodePageTitle`
- `updateLowcodePageDescription`
- `updateLowcodePageStatus`
- `updateLowcodePageType`
- `updateLowcodePublishEnvironment`
- `updateLowcodePageBackgroundColor`
- `updateLowcodePageSafeArea`
- `updateLowcodePageMaxWidth`

页面设置模型 API 从 Page Schema 派生页面基础配置、布局配置和发布配置的表单展示模型，并提供标题、描述、状态、类型、发布环境、背景色、安全区和 H5 最大宽度写回 helper。最大宽度默认只接受 320 到 960 的数值，非法输入返回原状态不写回。API 不渲染 Vue/React 控件、不处理 DOM、不执行服务端发布校验、不处理权限、审批、协作锁定、审计或服务端保存。

数据源配置模型 API：

- `LOWCODE_EDITOR_DEFAULT_DATA_SOURCE_TYPE_OPTIONS`
- `createLowcodeDefaultDataSourceParams`
- `createLowcodeDataSourceConfig`
- `formatLowcodeDataSourceParamsText`
- `formatLowcodeDataSourceRecordLabel`
- `createLowcodeDataSourceFormItems`
- `upsertLowcodeDataSourceConfigs`
- `addLowcodeDataSource`
- `updateLowcodeDataSource`
- `removeLowcodeDataSource`

数据源配置模型 API 提供 Page Schema `dataSources` 的默认类型、默认参数、默认绑定目标、参数 JSON 展示、解析状态展示模型和 data source 增删改 helper。新增、更新和删除数据源都返回新的 `LowcodeEditorState`；upsert helper 可按 data source id 更新或追加配置。API 不解析 textarea JSON、不渲染 Vue/React 控件、不执行 HTTP 请求、不解析数据、不调用 Java API，不处理鉴权、缓存、权限、风控、审计或服务端保存。

动作配置模型 API：

- `LOWCODE_EDITOR_DEFAULT_ACTION_TYPE_OPTIONS`
- `createLowcodeDefaultActionParams`
- `createLowcodeActionConfig`
- `formatLowcodeActionParamsText`
- `createLowcodeActionFormItems`
- `addLowcodeAction`
- `updateLowcodeAction`
- `renameLowcodeAction`
- `setLowcodeActionType`
- `removeLowcodeAction`

动作配置模型 API 提供 Page Schema `actions` 的默认类型、默认参数、动作表单行模型和 action 增删改 helper。新增、更新、改名、切换类型和删除动作都返回新的 `LowcodeEditorState`；action id 改名会同步节点事件引用，action 删除会清理指向该 action 的节点事件引用。API 不解析 textarea JSON、不渲染 Vue/React 控件、不执行 action、不调用跳转桥、领券接口、埋点平台或 Java API，不处理权限、风控、审计或服务端保存。

事件绑定模型 API：

- `createLowcodeActionOptions`
- `createLowcodeEventBindingItems`
- `bindLowcodeNodeEvent`
- `renameLowcodeActionRefsInNodes`
- `removeLowcodeActionRefsFromNodes`

事件绑定模型 API 从物料 events、Page Schema actions 和节点 events 派生事件绑定展示模型，并提供节点事件写回、action id 改名引用同步和 action 删除引用清理 helper。API 不执行 action、不渲染 select 控件、不调用跳转桥、领券接口、埋点平台或 Java API，不处理权限、风控、审计或服务端保存。

草稿持久化 API：

- `createLowcodeEditorDraftPayload`
- `parseLowcodeEditorDraftContent`
- `formatLowcodeEditorDraftStatusText`
- `getLowcodeEditorDraftStatusTone`

草稿持久化 API 从 Page Schema 派生可存储的草稿 payload，包含版本、更新时间、schema、schema JSON、字节大小和大小文案，并提供草稿 JSON 文本解析、Page Schema v1 校验、旧版 Page Schema 直存格式兼容、自动保存状态文案和 tone。API 不执行定时器、不读写 `localStorage`、不发 HTTP 请求、不处理草稿冲突合并、权限、审计或审批。

工作区状态摘要 API：

- `createLowcodeWorkspaceStats`

工作区状态摘要 API 从 Page Schema、选中物料标题、校验结果、发布检查摘要和 dirty 状态派生顶部状态条展示模型，覆盖节点数、选中、校验、发布和保存状态。每个状态项包含稳定 id、label、value 和 tone。API 不渲染 UI、不处理 DOM、不执行服务端发布检查、不处理权限、协作锁定、审批或审计。

H5 预览链接 API：

- `createLowcodePreviewLinkItem`
- `createLowcodePreviewLinkItems`
- `summarizeLowcodePreviewLinks`

H5 预览链接 API 从宿主传入的预览入口 source 派生展示 item、ready/disabled 状态、状态文案、打开/复制能力和交付摘要。API 不构造 URL、不编码 Page Schema、不打开窗口、不复制剪贴板、不调用 runtime API、不处理 previewToken、releaseId/pageId 协议、权限、过期时间或审计。

Schema 文件 API：

- `createLowcodeSchemaFileName`
- `createLowcodeSchemaFileExport`
- `parseLowcodeSchemaFileContent`

Schema 文件 API 从 Page Schema 派生 JSON 文件名、导出内容、mimeType、字节大小和大小文案，并提供 JSON 文本解析与 Page Schema v1 校验结果。合法导入默认返回克隆后的 schema；非法 JSON 或非法 schema 返回失败结构和错误文案。API 不创建 `File`、`Blob`、下载链接或上传请求，不处理覆盖确认、权限、审计、存储、审批或 migration。

发布历史模型 API：

- `formatLowcodeReleaseKindLabel`
- `formatLowcodeReleaseTime`
- `createLowcodeReleaseListItem`
- `createLowcodeReleaseListItems`
- `summarizeLowcodeReleaseList`
- `formatLowcodeVersionDiffSummary`
- `createLowcodeReleaseMessage`
- `createLowcodePublishBlockedMessage`
- `createLowcodeRollbackNote`
- `createLowcodeRollbackConfirmText`

发布历史模型 API 从宿主提供的 release metadata 派生版本列表展示、类型文案、时间文案、关键词筛选、列表摘要、差异数量摘要、操作反馈、发布检查拦截和回滚确认文案。关键词匹配覆盖标题、pageId、页面版本、release 类型、类型文案、备注和格式化时间。API 不保存草稿、不生成预览、不发布页面、不载入版本、不打开 runtime URL、不执行确认弹窗、不调用 Java API、不处理服务端 diff、权限、审批、审计或真实回滚。

## 错误格式

当前 command 不抛业务错误。无法执行时返回原状态，例如目标节点不存在、移动到自身子节点、粘贴板为空。

## 兼容性要求

- command 不依赖 DOM。
- command 不依赖 React/Vue。
- command 不依赖 H5 业务项目内部代码。
- 历史记录只保存 schema 快照，不保存 UI 临时状态。
- 视口预设只改变 `LowcodeEditorState.viewport`，不改变 `schema.layout.maxWidth`、物料 manifest 或 renderer 协议。
- 物料目录 API 只派生编辑器展示模型，不新增或改写物料 manifest 字段。
- 物料偏好模型 API 只派生收藏和最近使用列表模型、解析规则和提示文案，不依赖 DOM、localStorage、HTTP、用户体系、权限、审计或多端同步服务。
- 物料详情模型 API 只派生物料详情展示、可插入节点输入和默认预览 schema，不依赖 DOM、renderer、资源中心、Java API、权限、审计或物料市场上下架状态。
- 快捷命令 API 只派生命令展示和搜索模型，不持有命令执行函数，不依赖宿主权限系统。
- 节点操作模型 API 只派生菜单项、快捷键动作和反馈文案，不执行 `insertNode`、`removeNode`、`copyNode`、`pasteNode`、`duplicateNode`、`moveNodeById`、`undo` 或 `redo`。
- 结构树 API 只派生节点导航展示模型，不修改节点，不依赖 DOM，不依赖宿主权限系统。
- 节点选择模型 API 只派生多选状态、同父级判断、多选摘要和成组拖拽候选，不执行 DOM 拖拽或节点移动，不修改 Page Schema、Material Manifest 或 renderer 行为。
- 画布投放提示模型 API 只派生投放位置、提示样式、吸附线、hint 模型和非法节点目标判断，不执行 DOM 拖拽、物料插入或节点移动，不修改 Page Schema、Material Manifest 或 renderer 行为。
- 画布投放目标模型 API 只派生 `parentId + index` 和移动 index 修正，不执行物料插入、节点移动或 siblings 替换，不修改 Page Schema、Material Manifest 或 renderer 行为。
- 属性分组 API 只派生属性面板展示模型，不修改 propsSchema，不依赖 DOM，不依赖宿主权限系统。
- 属性字段模型 API 只派生属性面板字段控件模型和输入值转换，不修改 propsSchema，不依赖 DOM、资源中心、权限、审计或服务端保存。
- 页面设置模型 API 只派生 Page Schema 页面设置表单模型和页面字段写回 helper，不依赖 DOM、管理台组件库、Java API、权限、审批、协作锁定或服务端保存。
- 数据源配置模型 API 只派生 Page Schema dataSources 表单模型、预览解析状态展示模型和 data source 变更 helper，不执行 HTTP 请求，不依赖 DOM、Java API、鉴权、缓存、权限、风控或服务端保存。
- 动作配置模型 API 只派生 Page Schema actions 表单模型和 action 变更 helper，不执行 action，不依赖 DOM、桥能力、业务接口、权限、风控或服务端保存。
- 事件绑定模型 API 只派生物料事件到 Page Schema action 的绑定展示模型和节点 action ref 变更，不执行 action，不依赖 DOM、桥能力、业务接口、权限、风控或服务端保存。
- 草稿持久化 API 只处理 Page Schema 草稿 payload、JSON 文本恢复和自动保存状态展示口径，不依赖 DOM、浏览器存储或 HTTP，不修改 Page Schema v1 契约。
- 工作区状态摘要 API 只派生编辑器顶部状态展示模型，不依赖 DOM，不执行服务端发布校验，不处理权限、协作锁定或审批。
- H5 预览链接 API 只处理宿主提供的 URL 展示模型，不依赖 DOM、adapters、renderer、runtime 地址或 Java 配置平台协议。
- Schema 文件 API 只处理 JSON 字符串、文件名和 Page Schema 校验，不依赖 DOM，不依赖浏览器文件对象，不修改 Page Schema v1 契约。
- 发布历史模型 API 只处理宿主提供的 release metadata 展示模型和文案，不依赖 DOM、浏览器存储、config platform client、runtime URL、Java API、权限、审批、审计或真实回滚。
- 移动节点时禁止将节点移动到自身或自身后代。

## 测试方式

- `pnpm typecheck`
- `pnpm build`
- `pnpm test`

## 变更流程

1. 在任务中声明 command 或状态结构变化。
2. 更新本契约。
3. 更新 `packages/editor` 代码和 README。
4. 补充或更新测试。
5. 记录验证结果。

## 回滚方式

- npm 发布前：回滚提交。
- npm 发布后：保持旧 command 兼容，新增替代 command；必要时发布修复版本。
