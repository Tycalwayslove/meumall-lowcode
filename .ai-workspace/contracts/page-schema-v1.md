# Page Schema v1 契约

## 状态

draft

## 提供方

- `@meumall/lowcode-schema`
- 后续 Java 配置平台

## 消费方

- `@meumall/lowcode-editor`
- `@meumall/lowcode-core`
- `@meumall/lowcode-renderer-h5`
- 后续 H5 接入方和小程序渲染器

## 适用环境

- 本地编辑器
- 预览环境
- H5 线上运行时
- 后续 Java 配置平台存储和发布

## 版本策略

- 当前版本：`1.0.0`
- `schemaVersion` 主版本一致时认为兼容。
- 新增可选字段为兼容变更。
- 删除字段、修改字段类型、改变运行时语义为不兼容变更，必须提供迁移策略。

## 输入格式

核心结构由 `LowcodePageSchema` 定义：

```ts
interface LowcodePageSchema {
  schemaVersion: string;
  pageId: string;
  pageVersion: string;
  title: string;
  status: "draft" | "preview" | "published" | "disabled";
  pageType?: "activity" | "promotion" | "topic" | "landing" | "custom";
  targetPlatforms: Array<"h5" | "miniapp">;
  layout: LowcodeLayoutConfig;
  nodes: LowcodeNode[];
  dataSources?: LowcodeDataSourceConfig[];
  actions?: LowcodeActionConfig[];
  publishMeta: LowcodePublishMeta;
}
```

## 输出格式

- 编辑器输出完整 `LowcodePageSchema`。
- 渲染器只消费 `published` 或预览链路明确允许的 schema。
- Java 配置平台存储时不得丢失未知的兼容可选字段。

## 错误格式

`validateLowcodePageSchema` 返回：

```ts
interface LowcodeValidationResult {
  valid: boolean;
  errors: string[];
}
```

`assertLowcodePageSchema` 校验失败时抛出 `Error`。

## 兼容性要求

- 节点 `id` 在整棵树内必须唯一。
- `events.*.actionId` 必须引用已声明 action。
- `actions.id` 和 `dataSources.id` 不能重复。
- `targetPlatforms` 只能声明当前 schema 支持的平台。
- 物料是否支持某平台以 `LowcodeMaterialManifest.platforms` 为准。

## 测试方式

- `pnpm typecheck`
- `pnpm build`
- 后续补充 schema 单元测试和 fixtures。

## 变更流程

1. 创建或更新任务。
2. 更新本契约。
3. 更新 `packages/schema` 类型和校验。
4. 更新受影响包 README。
5. 运行验证并记录结果。

## 回滚方式

- npm 发布前：回滚提交。
- npm 发布后：发布 patch/minor 修复版本；不兼容变更需要恢复兼容字段或提供 migration。

