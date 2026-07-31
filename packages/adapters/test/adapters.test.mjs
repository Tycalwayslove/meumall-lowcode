import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createLowcodePageSchema } from "../../schema/dist/index.js";
import {
  createDataSourceRegistry,
  createSafeActionRegistry,
  decodePageSchemaFromUrlParam,
  encodePageSchemaToUrlParam,
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
