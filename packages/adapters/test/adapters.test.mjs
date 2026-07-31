import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createLowcodePageSchema } from "../../schema/dist/index.js";
import {
  createDataSourceRegistry,
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
      navigate(config) {
        calls.push(config.params);
      },
    });

    registry.register("noop", () => undefined);
    await registry.execute({ id: "go", type: "navigate", params: { url: "/topic" } });

    assert.deepEqual(calls, [{ url: "/topic" }]);
    assert.deepEqual(registry.listTypes(), ["navigate", "noop"]);
    assert.throws(() => registry.execute({ id: "bad", type: "unsafe" }), /action handler not found/);
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
});
