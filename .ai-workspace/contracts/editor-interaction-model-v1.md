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

## 错误格式

当前 command 不抛业务错误。无法执行时返回原状态，例如目标节点不存在、移动到自身子节点、粘贴板为空。

## 兼容性要求

- command 不依赖 DOM。
- command 不依赖 React/Vue。
- command 不依赖 H5 业务项目内部代码。
- 历史记录只保存 schema 快照，不保存 UI 临时状态。
- 视口预设只改变 `LowcodeEditorState.viewport`，不改变 `schema.layout.maxWidth`、物料 manifest 或 renderer 协议。
- 物料目录 API 只派生编辑器展示模型，不新增或改写物料 manifest 字段。
- 移动节点时禁止将节点移动到自身或自身后代。

## 测试方式

- `pnpm typecheck`
- `pnpm build`
- 后续补充 editor command 单元测试。

## 变更流程

1. 在任务中声明 command 或状态结构变化。
2. 更新本契约。
3. 更新 `packages/editor` 代码和 README。
4. 补充或更新测试。
5. 记录验证结果。

## 回滚方式

- npm 发布前：回滚提交。
- npm 发布后：保持旧 command 兼容，新增替代 command；必要时发布修复版本。
