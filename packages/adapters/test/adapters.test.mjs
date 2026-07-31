import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createLowcodePageSchema } from "../../schema/dist/index.js";
import {
  createDataSourceRegistry,
  createHttpConfigPlatformClient,
  createSafeActionExecutor,
  createSafeActionRegistry,
  decodePageSchemaFromUrlParam,
  encodePageSchemaToUrlParam,
  resolveLowcodeDataSources,
} from "../dist/index.js";

describe("@meumall/lowcode-adapters", () => {
  it("resolves data source handlers by type", async () => {
    const registry = createDataSourceRegistry({
      mock(config) {
        return { bindTo: config.bindTo ?? "default", items: [config.params] };
      },
    });

    registry.register("empty", () => ({ items: [] }));

    await assert.rejects(
      () => registry.resolve({ id: "missing", type: "unknown" }),
      /data source handler not found/,
    );
    assert.deepEqual(registry.listTypes(), ["mock", "empty"]);
    assert.deepEqual(await registry.resolve({ id: "products", type: "mock", bindTo: "products", params: { limit: 3 } }), {
      bindTo: "products",
      items: [{ limit: 3 }],
    });
  });

  it("resolves schema data sources into runtime data with records", async () => {
    const registry = createDataSourceRegistry({
      "product.byIds"(config) {
        const limit = Number(config.params?.limit ?? 2);
        return [
          { id: "sku_001", title: "商品 1" },
          { id: "sku_002", title: "商品 2" },
          { id: "sku_003", title: "商品 3" },
        ].slice(0, limit);
      },
      passthrough(config) {
        return config.params ?? {};
      },
    });

    const result = await resolveLowcodeDataSources(
      [
        { id: "ds_products", type: "product.byIds", bindTo: "products", params: { limit: 2 } },
        { id: "ds_context", type: "passthrough", bindTo: "context", params: { channel: "h5" } },
      ],
      registry,
      { initialData: { staticText: "保留" } },
    );

    assert.deepEqual(result.data, {
      staticText: "保留",
      products: [
        { id: "sku_001", title: "商品 1" },
        { id: "sku_002", title: "商品 2" },
      ],
      context: { channel: "h5" },
    });
    assert.deepEqual(result.records, [
      { id: "ds_products", type: "product.byIds", bindTo: "products", status: "resolved" },
      { id: "ds_context", type: "passthrough", bindTo: "context", status: "resolved" },
    ]);
  });

  it("keeps rendering data stable when data source resolution fails", async () => {
    const errors = [];
    const registry = createDataSourceRegistry({
      broken() {
        throw new Error("接口异常");
      },
    });

    const result = await resolveLowcodeDataSources(
      [
        { id: "ds_skip", type: "broken", params: { limit: 1 } },
        { id: "ds_error", type: "missing", bindTo: "missingData" },
        { id: "ds_broken", type: "broken", bindTo: "brokenData" },
      ],
      registry,
      {
        initialData: { products: [] },
        onError(error, config) {
          errors.push(`${config.id}:${error.message}`);
        },
      },
    );

    assert.deepEqual(result.data, { products: [] });
    assert.deepEqual(errors, [
      "ds_error:Lowcode data source handler not found: missing",
      "ds_broken:接口异常",
    ]);
    assert.deepEqual(result.records, [
      { id: "ds_skip", type: "broken", status: "skipped", error: "bindTo is empty" },
      {
        id: "ds_error",
        type: "missing",
        bindTo: "missingData",
        status: "error",
        error: "Lowcode data source handler not found: missing",
      },
      { id: "ds_broken", type: "broken", bindTo: "brokenData", status: "error", error: "接口异常" },
    ]);
  });

  it("executes safe action handlers by type", async () => {
    const calls = [];
    const registry = createSafeActionRegistry({
      navigate(config, context) {
        calls.push({ params: config.params, pageId: context?.schema?.pageId });
      },
    });

    registry.register("noop", () => undefined);
    await registry.execute(
      { id: "go", type: "navigate", params: { url: "/topic" } },
      { schema: createLowcodePageSchema({ pageId: "action_page", title: "动作页" }) },
    );

    assert.deepEqual(calls, [{ params: { url: "/topic" }, pageId: "action_page" }]);
    assert.deepEqual(registry.listTypes(), ["navigate", "noop"]);
    assert.throws(() => registry.execute({ id: "bad", type: "unsafe" }), /action handler not found/);
  });

  it("adapts safe action registry to renderer action executor", async () => {
    const calls = [];
    const schema = createLowcodePageSchema({
      pageId: "executor_page",
      title: "执行器页面",
      actions: [{ id: "go", type: "navigate", params: { url: "/activity" } }],
    });
    const registry = createSafeActionRegistry({
      navigate(config, context) {
        calls.push({
          actionId: config.id,
          url: config.params?.url,
          refActionId: context?.ref?.actionId,
          dataChannel: context?.data?.channel,
          pageId: context?.schema?.pageId,
        });
      },
    });
    const errors = [];
    const executor = createSafeActionExecutor(registry, {
      onError(error, ref) {
        errors.push(`${ref.actionId}:${error.message}`);
      },
    });

    await executor.execute({ actionId: "go" }, { schema, data: { channel: "h5" } });

    assert.deepEqual(calls, [
      {
        actionId: "go",
        url: "/activity",
        refActionId: "go",
        dataChannel: "h5",
        pageId: "executor_page",
      },
    ]);
    assert.throws(
      () => executor.execute({ actionId: "missing" }, { schema, data: {} }),
      /Lowcode action not found: missing/,
    );
    assert.deepEqual(errors, ["missing:Lowcode action not found: missing"]);
  });

  it("round-trips a valid schema through URL safe encoding", () => {
    const schema = createLowcodePageSchema({
      pageId: "url_schema_page",
      title: "URL Schema 页面",
      nodes: [],
    });

    const encoded = encodePageSchemaToUrlParam(schema);
    const decoded = decodePageSchemaFromUrlParam(encoded);

    assert.equal(encoded.includes("+"), false);
    assert.equal(encoded.includes("/"), false);
    assert.equal(decoded.pageId, "url_schema_page");
    assert.equal(decoded.title, "URL Schema 页面");
  });

  it("rejects invalid encoded schema payloads", () => {
    const invalid = encodePageSchemaToUrlParam({ schemaVersion: "1.0.0" });

    assert.throws(() => decodePageSchemaFromUrlParam(invalid), /Invalid lowcode page schema/);
  });

  it("calls config platform HTTP endpoints through a typed client", async () => {
    const calls = [];
    const schema = createLowcodePageSchema({
      pageId: "platform_page",
      title: "配置平台页面",
    });
    const release = {
      id: "rel_001",
      kind: "draft",
      pageId: schema.pageId,
      pageVersion: schema.pageVersion,
      title: schema.title,
      createdAt: "2026-07-31T00:00:00.000Z",
      schema,
    };
    const fetcher = async (input, init = {}) => {
      calls.push({ input, init });
      if (input.endsWith("/draft")) {
        return { ok: true, status: 200, json: async () => schema };
      }
      if (input.includes("/releases?")) {
        return { ok: true, status: 200, json: async () => [release] };
      }
      return { ok: true, status: 200, json: async () => release };
    };
    const client = createHttpConfigPlatformClient({
      baseUrl: "https://platform.example.com/",
      fetcher,
      headers: { authorization: "Bearer token" },
    });

    assert.deepEqual(await client.saveDraft(schema), release);
    assert.deepEqual(await client.listReleases("platform_page"), [release]);
    assert.deepEqual(await client.getDraft("platform_page"), schema);

    assert.equal(calls[0].input, "https://platform.example.com/api/lowcode/pages/drafts");
    assert.equal(calls[0].init.method, "POST");
    assert.equal(calls[0].init.headers.authorization, "Bearer token");
    assert.equal(JSON.parse(calls[0].init.body).pageStatus, "draft");
    assert.equal(calls[1].input, "https://platform.example.com/api/lowcode/pages/releases?pageId=platform_page");
    assert.equal(calls[2].input, "https://platform.example.com/api/lowcode/pages/platform_page/draft");
  });

  it("surfaces config platform HTTP errors", async () => {
    const client = createHttpConfigPlatformClient({
      baseUrl: "https://platform.example.com",
      fetcher: async () => ({ ok: false, status: 500, json: async () => ({ message: "failed" }) }),
    });

    await assert.rejects(
      () => client.publishPage(createLowcodePageSchema({ pageId: "bad", title: "错误页" })),
      /Config platform request failed: 500/,
    );
  });
});
