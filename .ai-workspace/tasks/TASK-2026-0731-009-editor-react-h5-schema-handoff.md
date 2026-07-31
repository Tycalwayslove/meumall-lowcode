# TASK-2026-0731-009-editor-react-h5-schema-handoff

## 状态

verified

## 目标

打通 Vue3 编辑器到独立 React H5 runtime playground 的 schema handoff，让运营在编辑器中编辑当前页面后，可以一键打开对应 React H5 渲染结果。

## 背景

当前仓库已有 Vue3 editor playground 和独立 React H5 runtime playground，但两者之间还没有直接传递当前 schema。编辑器的本地发布预览主要在同一个 Vue app 内完成，而 React H5 runtime 使用静态示例 schema。为了更接近“编辑器产物 -> H5 消费端渲染”的实操链路，需要提供一个轻量的本地 handoff 方式，在不接入真实 Java 配置平台前，用 URL 参数传递当前 Page Schema。

## 涉及包或系统

- `@meumall/lowcode-adapters`
- `apps/editor-playground`
- `apps/h5-runtime-playground`
- `@meumall/lowcode-renderer-h5`
- `@meumall/lowcode-materials-h5`

## 范围

包含：

- 在 adapters 包中新增 Page Schema URL 编解码工具。
- Vue3 编辑器新增打开 React H5 runtime 的操作。
- React H5 runtime 支持从 URL `schema` 参数读取并校验 Page Schema。
- React H5 runtime 保留默认示例 schema fallback。
- 更新文档、任务状态、项目状态和验证报告。

不包含：

- 真实 Java 配置平台 API。
- 大 schema 的服务端短链或草稿 ID 查询。
- `hybird-meumall` 真实路由接入。
- schema 字段结构变更。

## 责任边界

当前仓库：

- 提供本地编辑器到 React H5 runtime 的可验证 handoff。
- 保证 URL schema 参数解码失败时 runtime 不白屏。

外部系统：

- Java 配置平台后续负责用 previewId/pageId 替代 URL schema 参数。
- `hybird-meumall` 后续负责接入真实路由和接口。

## 契约影响

- 是否影响跨包或跨系统契约：是，新增本地预览 handoff 约定。
- 契约文档路径：`packages/adapters/src/index.ts`、`docs/meumall-integration.md`
- 是否向后兼容：是，不改变 Page Schema v1。
- 是否需要迁移：否。
- 是否需要灰度或双版本兼容：否。

## 对接说明

- 是否需要对接说明：是。
- 对接说明路径：`docs/meumall-integration.md`
- 需要确认的角色：H5 接入方 / Java 配置平台。
- 当前确认状态：本地 playground 验证。

## 实现计划

1. 新增 task 并流转到 `in_progress`。
2. 在 adapters 包新增 schema URL 编解码工具。
3. 编辑器增加打开 React H5 runtime 按钮。
4. React H5 runtime 支持读取 URL schema 参数并显示来源状态。
5. 更新文档和验证记录。
6. 运行类型检查、构建和 smoke check。

## 验收标准

- [x] adapters 包提供 schema URL encode/decode 工具。
- [x] 编辑器可以基于当前 schema 生成 React H5 runtime URL。
- [x] React H5 runtime 可以读取 URL `schema` 参数并渲染。
- [x] React H5 runtime 在 schema 参数无效时显示错误并 fallback 到示例 schema。
- [x] 根级 `pnpm typecheck` 通过。
- [x] 根级 `pnpm build` 通过。
- [x] `@meumall/lowcode-adapters` npm pack dry-run 通过。
- [x] `curl -I http://localhost:5174/` 通过。

## 验证命令

```bash
pnpm install
pnpm typecheck
pnpm build
curl -I http://localhost:5174/
pnpm --filter @meumall/lowcode-adapters exec npm pack --dry-run
node --input-type=module - <<'NODE'
import { encodePageSchemaToUrlParam, decodePageSchemaFromUrlParam } from './packages/adapters/dist/index.js';
import { createLowcodePageSchema } from './packages/schema/dist/index.js';
const schema = createLowcodePageSchema({
  pageId: 'adapter-roundtrip',
  title: 'Adapter Roundtrip',
  nodes: [{ id: 'node_1', componentName: 'ActivityHero', materialVersion: '0.1.0', props: { title: 'ok' } }],
  publishMeta: { environment: 'test' }
});
const encoded = encodePageSchemaToUrlParam(schema);
const decoded = decodePageSchemaFromUrlParam(encoded);
if (decoded.pageId !== schema.pageId) throw new Error('roundtrip pageId mismatch');
NODE
```

## 发布影响

- 是否需要发布：当前不发布；后续 npm 发布时 `@meumall/lowcode-adapters` 需要随包发布。
- 发布对象：无。
- 是否需要 changeset：当前不需要。
- 是否需要 GitHub tag/release：否。
- 回滚目标：回滚本任务提交。
- smoke check：React H5 runtime 本地访问返回 200，类型检查和构建通过。

## 验证结果

2026-07-31：

- `pnpm install` 通过。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `pnpm --filter @meumall/lowcode-adapters exec npm pack --dry-run` 通过。
- adapters schema URL encode/decode round-trip 通过，非法参数会抛错。
- `curl -I http://localhost:5174/?schema=...&source=smoke` 返回 `HTTP/1.1 200 OK`。
- 验证报告：`.ai/test-reports/TASK-2026-0731-009-editor-react-h5-schema-handoff.md`

## 风险和阻塞

- URL 参数只适合本地 demo 和中小 schema；正式预览应使用 Java 配置平台 previewId。
- 浏览器 URL 长度限制可能影响超大页面。

## 变更记录

| 日期 | 状态 | 说明 |
| --- | --- | --- |
| 2026-07-31 | ready | 明确编辑器到 React H5 runtime 的 schema handoff 任务。 |
| 2026-07-31 | in_progress | 开始实现 adapters 编解码工具、编辑器入口和 React H5 runtime 解码渲染。 |
| 2026-07-31 | verified | 类型检查、构建、schema URL round-trip 和 React H5 runtime smoke check 通过。 |
