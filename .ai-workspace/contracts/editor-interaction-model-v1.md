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

快捷命令 API：

- `LOWCODE_EDITOR_COMMAND_DEFAULT_LIMIT`
- `createLowcodeEditorCommandSearchText`
- `filterLowcodeEditorCommands`
- `groupLowcodeEditorCommands`

快捷命令 API 从命令条目的 title、group、description 和 keywords 派生搜索文本，默认最多展示 28 条，并默认保留 disabled 命令，方便 UI 壳展示不可用状态。API 只处理命令目录展示模型，不执行命令、不绑定快捷键、不做权限判断、不修改 Page Schema、Material Manifest 或 renderer 行为。

结构树 API：

- `createLowcodeOutlineRows`
- `createLowcodeOutlineRowSearchText`
- `createLowcodeOutlineVisibility`
- `pruneLowcodeOutlineCollapsedNodeIds`
- `revealLowcodeOutlineNode`

结构树 API 从 Page Schema nodes 和可选物料 manifest 派生结构树行模型、搜索文本、搜索命中、折叠可见性、选中路径和可见数量摘要。关键词匹配覆盖节点 id、componentName、`meta.name`、物料标题和物料分类；折叠祖先会隐藏子节点，但当前选中路径保持可见。API 不执行节点选择、不处理 DOM 滚动、不处理拖拽、多选、重命名或权限。

属性分组 API：

- `LOWCODE_EDITOR_PROP_GROUP_ORDER`
- `LOWCODE_EDITOR_PROP_GROUP_META`
- `getLowcodePropGroupKey`
- `createLowcodePropGroups`
- `isLowcodePropGroupCollapsed`
- `toggleLowcodePropGroupCollapsed`

属性分组 API 从物料 `propsSchema` 的字段名、setter 和字段类型派生内容配置、样式配置、数据配置、行为配置和其他配置分组，并提供默认中文分组文案、稳定排序和折叠状态纯 helper。API 不渲染具体 setter 控件、不打开资源选择器、不修改 Page Schema 值、不处理字段权限或审计。

Schema 文件 API：

- `createLowcodeSchemaFileName`
- `createLowcodeSchemaFileExport`
- `parseLowcodeSchemaFileContent`

Schema 文件 API 从 Page Schema 派生 JSON 文件名、导出内容、mimeType、字节大小和大小文案，并提供 JSON 文本解析与 Page Schema v1 校验结果。合法导入默认返回克隆后的 schema；非法 JSON 或非法 schema 返回失败结构和错误文案。API 不创建 `File`、`Blob`、下载链接或上传请求，不处理覆盖确认、权限、审计、存储、审批或 migration。

## 错误格式

当前 command 不抛业务错误。无法执行时返回原状态，例如目标节点不存在、移动到自身子节点、粘贴板为空。

## 兼容性要求

- command 不依赖 DOM。
- command 不依赖 React/Vue。
- command 不依赖 H5 业务项目内部代码。
- 历史记录只保存 schema 快照，不保存 UI 临时状态。
- 视口预设只改变 `LowcodeEditorState.viewport`，不改变 `schema.layout.maxWidth`、物料 manifest 或 renderer 协议。
- 物料目录 API 只派生编辑器展示模型，不新增或改写物料 manifest 字段。
- 快捷命令 API 只派生命令展示和搜索模型，不持有命令执行函数，不依赖宿主权限系统。
- 结构树 API 只派生节点导航展示模型，不修改节点，不依赖 DOM，不依赖宿主权限系统。
- 属性分组 API 只派生属性面板展示模型，不修改 propsSchema，不依赖 DOM，不依赖宿主权限系统。
- Schema 文件 API 只处理 JSON 字符串、文件名和 Page Schema 校验，不依赖 DOM，不依赖浏览器文件对象，不修改 Page Schema v1 契约。
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
