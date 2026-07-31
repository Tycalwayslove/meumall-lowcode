# TASK-2026-0731-009-editor-react-h5-schema-handoff 验证报告

## 日期

2026-07-31

## 验证命令

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm --filter @meumall/lowcode-adapters exec npm pack --dry-run
curl -I "http://localhost:5174/?schema=${SCHEMA_PARAM}&source=smoke"
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
let failed = false;
try {
  decodePageSchemaFromUrlParam('not-a-valid-schema');
} catch {
  failed = true;
}
if (!failed) throw new Error('invalid schema did not fail');
NODE
```

## 验证结果

- `pnpm install`：通过。
- `pnpm typecheck`：通过。
- `pnpm build`：通过。
- `pnpm --filter @meumall/lowcode-adapters exec npm pack --dry-run`：通过，tarball 包含 `dist/index.js` 和类型声明。
- React H5 runtime 带 `schema` URL 参数 smoke check：返回 `HTTP/1.1 200 OK`。
- adapters schema URL encode/decode round-trip：通过。
- adapters 非法 schema 参数解码：按预期抛错。

## 未验证项

- 未做浏览器截图自动化验证错误提示样式。
- 未验证超大 schema 的 URL 长度表现。
- 未接入真实 Java 配置平台 previewId/pageId。

## 剩余风险

- URL schema handoff 只适合本地 demo 和中小 schema，正式环境需要改为服务端 previewId/pageId。
- React H5 runtime 当前使用 mock runtime data，真实数据源 resolver 仍需后续补齐。
