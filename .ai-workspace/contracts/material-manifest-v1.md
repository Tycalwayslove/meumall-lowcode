# Material Manifest v1 契约

## 状态

ready

## 契约名称

MeuMall Lowcode Material Manifest v1

## 提供方

- `@meumall/lowcode-schema`
- `@meumall/lowcode-materials-h5`
- `@meumall/lowcode-materials-vue-h5`
- 后续小程序物料包

## 消费方

- `@meumall/lowcode-editor`
- Vue3 编辑器管理台或 Java 管理系统中的编辑器 shell
- `@meumall/lowcode-renderer-h5`
- `@meumall/lowcode-renderer-vue-h5`
- Java 配置平台
- H5 runtime 接入方
- 后续小程序 runtime

## 适用环境

- 本地编辑器 playground
- Java 配置平台物料白名单和发布前校验
- H5 预览和线上运行时
- 后续小程序预览和线上运行时

## 版本策略

- 当前契约版本：`1.0.0`。
- `materialVersion` 是单个物料的版本，建议使用语义化版本。
- 新增物料、增加可选 props、增加可选 events、增加可选 data source slots 为向后兼容变更。
- 删除物料、删除 props、修改 props 类型、修改 event 名称、修改默认语义为不兼容变更。
- `componentName` 是 schema 节点和物料实现的稳定连接键，一经发布不得随意重命名。

## 输入格式

核心结构由 `LowcodeMaterialManifest` 定义：

```ts
interface LowcodeMaterialManifest {
  componentName: string;
  materialVersion: string;
  title: string;
  category: string;
  platforms: Array<"h5" | "miniapp">;
  propsSchema: Record<string, LowcodePropSchema>;
  defaultProps: JsonObject;
  events?: LowcodeMaterialEventManifest[];
  dataSourceSlots?: LowcodeDataSourceSlotManifest[];
}
```

属性结构由 `LowcodePropSchema` 定义：

```ts
interface LowcodePropSchema {
  label: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  setter:
    | "input"
    | "number"
    | "textarea"
    | "switch"
    | "select"
    | "image"
    | "video"
    | "color"
    | "richText"
    | "productSelector"
    | "couponSelector"
    | "actionSelector"
    | "dataSourceSelector";
  required?: boolean;
  defaultValue?: JsonValue;
  options?: Array<{ label: string; value: JsonValue }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  swatches?: string[];
  description?: string;
}
```

事件结构由 `LowcodeMaterialEventManifest` 定义：

```ts
interface LowcodeMaterialEventManifest {
  name: string;
  title: string;
  description?: string;
}
```

数据源槽位由 `LowcodeDataSourceSlotManifest` 定义：

```ts
interface LowcodeDataSourceSlotManifest {
  name: string;
  acceptedTypes: string[];
  required?: boolean;
}
```

## 字段语义

### `componentName`

- 物料稳定标识。
- Page Schema 节点的 `componentName` 必须与 manifest 的 `componentName` 一致。
- React/Vue H5 同名物料必须保持同一 `componentName`。
- 不允许用标题、文件名或包名替代。

### `materialVersion`

- 物料自身版本。
- 当前编辑器和 renderer 先记录该字段，不做复杂版本协商。
- 后续 Java 配置平台可以按 `componentName + materialVersion` 做白名单、灰度和回滚。

### `title`

- 面向运营展示的物料名称。
- 编辑器物料面板、属性面板和结构树可使用该字段展示。

### `category`

- 物料分类。
- 当前常见值包括 `layout`、`basic`、`marketing`、`commerce`、`content`。
- 分类用于编辑器分组和管理台筛选，不参与 runtime 渲染决策。

### `platforms`

- 物料支持的平台列表。
- 当前可选值：`h5`、`miniapp`。
- H5 renderer 只能渲染包含 `h5` 的物料。
- 后续小程序 renderer 只能渲染包含 `miniapp` 的物料。

### `propsSchema`

- 描述物料可配置属性。
- 编辑器根据该字段生成属性面板。
- `type` 决定最终写入 Page Schema 的基础值类型。
- `setter` 决定编辑器推荐控件。
- `defaultValue` 应与 `type` 保持一致。
- 对 `number` 类型，`min`、`max`、`step` 和 `unit` 是可选编辑元数据，用于生成范围、步长和单位提示；这些字段不写入 Page Schema 节点 props。
- 对 `setter: "color"` 字段，`swatches` 是可选推荐色板，用于生成快捷颜色选择；该字段不限制最终写入值，编辑器必须保留文本输入兜底以支持 `transparent`、`rgba(...)` 等 CSS 颜色字符串。
- 对 `setter: "video"` 字段，编辑器可提供视频素材选择器并写回视频 URL；不支持该 setter 的旧编辑器必须退化为普通 URL 输入，不改变 Page Schema 节点 props 值类型。
- 对 `array` 或 `object` 类型，编辑器必须保留 JSON 兜底编辑能力。

### `defaultProps`

- 物料默认 props。
- 新增节点时，编辑器以 `defaultProps` 初始化节点 props。
- renderer 运行时可将节点 props 与 `defaultProps` 合并。
- `defaultProps` 不得包含函数、类实例、Date、Map 等非 JSON 值。

### `events`

- 描述物料可触发的事件。
- 编辑器根据该字段展示事件绑定 UI。
- Page Schema 节点通过 `events[eventName].actionId` 引用 schema 中的 action。
- renderer 将 event handler 注入物料 props。
- 物料不得执行任意 JavaScript，只能触发被 renderer 注入的 handler。

### `dataSourceSlots`

- 描述物料可由数据源填充的 props 槽位。
- `name` 必须对应物料 props 字段，例如 `items`。
- `acceptedTypes` 是数据源类型白名单，例如 `product.byIds`、`product.byActivity`。
- Java 配置平台和 H5 runtime 应按该字段限制可绑定的数据源。

## 输出格式

- 物料包输出 `LowcodeMaterial[]`，每项包含 `component` 和 `manifest`。
- 编辑器读取 manifest 生成物料面板、属性面板、数据源绑定和事件绑定。
- renderer 通过 `componentName` 从 registry 中找到物料组件。
- Java 配置平台可缓存 manifest 列表，用于配置 UI 和发布校验。

## 错误格式

`validateLowcodeMaterialManifest` 返回：

```ts
interface LowcodeValidationResult {
  valid: boolean;
  errors: string[];
}
```

`assertLowcodeMaterialManifest` 或 `createMaterialManifest` 校验失败时抛出 `Error`。

当前最低校验口径：

- manifest 必须是对象。
- `componentName`、`materialVersion`、`title`、`category` 必须是非空字符串。
- `platforms` 必须是非空数组，且只能包含 `h5` 或 `miniapp`。
- `propsSchema` 必须是对象。
- `defaultProps` 必须是 JSON object。

## 兼容性要求

- 已发布页面引用的 `componentName` 必须继续可渲染，或 renderer 必须提供未知物料 fallback。
- 新增 props 必须提供默认值或在物料内部处理缺省。
- 删除 props 前必须确认没有线上 schema 使用，或提供迁移策略。
- 修改 setter 但不改变输出值类型通常为兼容变更。
- 修改 props `type` 通常为不兼容变更。
- 修改 event name 会导致旧页面事件绑定失效，必须视为不兼容变更。
- 修改 data source slot 的 `acceptedTypes` 可能影响已有绑定，必须评估迁移。

## 编辑器消费规则

- 物料面板按 manifest 列出可添加物料。
- 新增节点时使用 `componentName`、`materialVersion` 和 `defaultProps`。
- 属性面板按 `propsSchema` 渲染控件。
- `switch` 或 `boolean` 字段必须写入真实 boolean。
- `select` 字段应按 `options` 渲染选择控件，写回 `options[].value`；历史 schema 中的未知值不得导致属性面板崩溃，运行时仍按物料 fallback 处理。
- `number` 字段应按 `min/max/step/unit` 渲染范围、步长和单位提示，并在写回时保持真实 number；超出范围的编辑值应夹取到 manifest 声明范围内。
- `color` 字段应按 `swatches` 渲染快捷色板，同时提供原生颜色选择和文本输入；原生颜色选择只能处理 `#rrggbb` 时，文本输入仍必须保留作为 CSS 颜色兜底。
- `array` 和 `object` 字段必须保留 JSON 兜底编辑。
- `events` 用于展示动作绑定。
- `dataSourceSlots` 用于限制数据源绑定入口。

## Renderer 消费规则

- renderer 不依赖 editor。
- renderer 只通过 material registry 使用 `componentName` 查找组件。
- 未找到物料时必须显示 fallback，不得导致整页白屏。
- 物料渲染异常必须隔离到组件级，不影响整页。
- renderer 注入 event handler，物料只负责触发 handler。

## Java 配置平台消费规则

- Java 配置平台应维护可用物料白名单。
- 发布前应校验 schema 节点引用的物料存在且支持目标平台。
- 发布前应校验 props 类型、数据源类型和 action 引用。
- Java 配置平台不得允许运营配置任意 JavaScript。
- Java 配置平台可以基于 manifest 生成管理端物料配置 UI。

## H5 Runtime 消费规则

- H5 runtime 应引入同一批次的 renderer 和 materials。
- H5 runtime 应注册数据源 handler 和 action handler 白名单。
- H5 runtime 不直接信任运营配置的任意 URL、JS 或接口类型。
- H5 runtime 数据源失败时应保留页面可渲染状态。

## 测试方式

最低验证：

```bash
pnpm typecheck
pnpm build
pnpm test
```

推荐覆盖：

- `validateLowcodeMaterialManifest` 校验 manifest。
- React/Vue H5 manifest `componentName` 列表保持一致。
- React/Vue H5 同名物料的枚举 props `setter` 和 `options` 语义保持一致。
- React/Vue H5 同名物料的数值 props `min`、`max`、`step` 和 `unit` 语义保持一致。
- 新增物料的核心 props、events、dataSourceSlots 有单元测试。
- 编辑器新增节点时 defaultProps 可正常落入 schema。
- renderer 遇到未知物料时显示 fallback。

## 变更流程

1. 创建或更新任务。
2. 评估是否影响 Page Schema、renderer、editor、Java 配置平台和 H5 runtime。
3. 更新本契约或相关契约。
4. 更新 `packages/schema` 类型和校验。
5. 更新物料包 manifest、README 和测试。
6. 运行验证命令。
7. 在任务文件记录验证结果、兼容性和回滚方式。

## 回滚方式

- npm 发布前：回滚提交。
- npm 发布后：
  - 兼容问题发布 patch 修复。
  - 新增物料异常可从 Java 配置平台白名单临时下架。
  - 不兼容 manifest 变更需要恢复旧字段或提供 schema migration。
  - H5 runtime smoke check 必须覆盖未知物料 fallback 和核心 action。

## 与其他契约关系

- Page Schema v1：`.ai-workspace/contracts/page-schema-v1.md`
- H5 Runtime 集成契约：`.ai-workspace/contracts/h5-runtime-integration-v1.md`
- Java 配置平台 API：`.ai-workspace/contracts/java-config-platform-api-v1.md`

## 待后续扩展

- props item schema，用于更精确地描述数组项结构。
- slot/children 约束，用于限制容器类物料可嵌套子物料类型。
- 平台差异字段，用于同一物料声明 H5 和小程序差异。
- 物料废弃标记，用于 Java 配置平台下架和旧页面兼容。
