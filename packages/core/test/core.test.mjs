import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createActionExecutor,
  createMaterialRegistry,
  createRuntimeContext,
  evaluateVisibility,
  findLowcodeNode,
  getByPath,
  mergeBoundProps,
  walkLowcodeNodes,
} from "../dist/index.js";

const manifest = {
  componentName: "ImageBanner",
  materialVersion: "1.0.0",
  title: "图片 Banner",
  category: "基础",
  platforms: ["h5"],
  propsSchema: {},
  defaultProps: {},
};

describe("@meumall/lowcode-core", () => {
  it("registers, replaces, reads and lists materials", () => {
    const first = { manifest, component: "first" };
    const second = { manifest: { ...manifest, title: "替换 Banner" }, component: "second" };
    const registry = createMaterialRegistry([first]);

    assert.equal(registry.has("ImageBanner"), true);
    assert.equal(registry.get("ImageBanner")?.component, "first");

    registry.register(second);

    assert.equal(registry.get("ImageBanner")?.component, "second");
    assert.equal(registry.list().length, 1);
  });

  it("walks nested nodes and finds a node by id", () => {
    const nodes = [
      {
        id: "root",
        componentName: "SectionContainer",
        materialVersion: "1.0.0",
        props: {},
        children: [
          {
            id: "child",
            componentName: "ProductList",
            materialVersion: "1.0.0",
            props: {},
          },
        ],
      },
    ];
    const visited = [];

    walkLowcodeNodes(nodes, (node, parent) => {
      visited.push([node.id, parent?.id ?? "none"]);
    });

    assert.deepEqual(visited, [
      ["root", "none"],
      ["child", "root"],
    ]);
    assert.equal(findLowcodeNode(nodes, "child")?.componentName, "ProductList");
    assert.equal(findLowcodeNode(nodes, "missing"), undefined);
  });

  it("merges data binding props and evaluates visibility", () => {
    const data = {
      products: [{ id: "sku_1", title: "测试商品" }],
      user: { isVip: true },
    };

    assert.deepEqual(mergeBoundProps({ title: "默认" }, data, { items: "products" }), {
      title: "默认",
      items: [{ id: "sku_1", title: "测试商品" }],
    });
    assert.deepEqual(mergeBoundProps({ title: "默认" }, data, { missing: "not.exists" }), {
      title: "默认",
    });
    assert.equal(getByPath(data, "user.isVip"), true);
    assert.equal(evaluateVisibility({ source: "static", value: false }, data), false);
    assert.equal(evaluateVisibility({ source: "data", path: "user.isVip", equals: true }, data), true);
  });

  it("creates runtime action context and executes registered action handlers", async () => {
    const schema = {
      schemaVersion: "1.0.0",
      pageId: "action_page",
      pageVersion: "0.1.0",
      title: "动作页面",
      status: "draft",
      targetPlatforms: ["h5"],
      layout: {},
      nodes: [],
      actions: [{ id: "go", type: "navigate", params: { url: "/activity" } }],
      publishMeta: { environment: "test" },
    };
    const context = createRuntimeContext(schema, { channel: "test" });
    const calls = [];
    const executor = createActionExecutor({
      navigate(action, runtimeContext, ref) {
        calls.push({ action, runtimeContext, ref });
      },
    });

    await executor.execute({ actionId: "go", params: { source: "button" } }, context);

    assert.equal(calls.length, 1);
    assert.equal(calls[0].action.params.url, "/activity");
    assert.equal(calls[0].runtimeContext.data.channel, "test");
    assert.throws(() => executor.execute({ actionId: "missing" }, context), /action not found/);
  });
});
