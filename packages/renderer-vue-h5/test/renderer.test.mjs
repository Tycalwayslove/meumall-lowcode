import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createMaterialRegistry } from "../../core/dist/index.js";
import { createLowcodePageSchema } from "../../schema/dist/index.js";
import {
  createLowcodeVueMissingMaterialFallback,
  createLowcodeVueRenderErrorFallback,
  LowcodeVueRenderer,
} from "../dist/index.js";

function collectVNodes(vnode, predicate, matches = []) {
  if (!vnode || typeof vnode !== "object") return matches;
  if (predicate(vnode)) matches.push(vnode);

  const children = typeof vnode.children === "function" ? vnode.children() : vnode.children;
  if (Array.isArray(children)) {
    for (const child of children) collectVNodes(child, predicate, matches);
  } else {
    collectVNodes(children, predicate, matches);
  }

  return matches;
}

describe("@meumall/lowcode-renderer-vue-h5 fallback", () => {
  it("exposes optional render error callback for host diagnostics", () => {
    assert.equal(Boolean(LowcodeVueRenderer.props.onRenderError), true);
  });

  it("creates traceable missing and render-error fallback nodes", () => {
    const node = { id: "node_broken", componentName: "BrokenBlock", materialVersion: "0.1.0", props: {} };

    const missing = createLowcodeVueMissingMaterialFallback(node);
    const error = createLowcodeVueRenderErrorFallback(node);

    assert.equal(missing.props.class, "mlc-runtime-missing");
    assert.equal(missing.props["data-lowcode-node-id"], "node_broken");
    assert.equal(missing.props["data-lowcode-missing"], "BrokenBlock");
    assert.equal(error.props.class, "mlc-runtime-error");
    assert.equal(error.props["data-lowcode-node-id"], "node_broken");
    assert.equal(error.props["data-lowcode-error"], "node_broken");
  });

  it("passes material event payloads into action executor context", () => {
    const TestButton = { name: "TestButton", setup: () => () => null };
    const registry = createMaterialRegistry([
      {
        manifest: {
          componentName: "TestButton",
          materialVersion: "1.0.0",
          title: "测试按钮",
          category: "test",
          platforms: ["h5"],
          propsSchema: {},
          defaultProps: {},
        },
        component: TestButton,
      },
    ]);
    const schema = createLowcodePageSchema({
      pageId: "vue_event_payload_test",
      title: "Vue 事件 payload",
      nodes: [
        {
          id: "button_1",
          componentName: "TestButton",
          materialVersion: "1.0.0",
          props: {},
          events: { onTap: { actionId: "track_tap" } },
        },
      ],
      actions: [{ id: "track_tap", type: "tracking.click", params: { eventName: "tap" } }],
    });
    const calls = [];
    const render = LowcodeVueRenderer.setup({
      schema,
      registry,
      data: {},
      actionExecutor: {
        execute(ref, context) {
          calls.push({ ref, context });
        },
      },
      fallback: null,
      editable: false,
      selectedNodeId: undefined,
      onNodeSelect: undefined,
      nodeDraggable: false,
      onNodeDragStart: undefined,
      onNodeDragEnd: undefined,
      onRenderError: undefined,
    });
    const rendered = render();
    const boundaryVNodes = collectVNodes(rendered, (vnode) => vnode.type?.name === "LowcodeVueMaterialBoundary");
    const materialVNodes = boundaryVNodes.flatMap((vnode) => collectVNodes(vnode.children?.default?.(), (child) => child.type === TestButton));

    assert.equal(materialVNodes.length, 1);
    materialVNodes[0].props.props.onTap({ values: { name: "MeuMall" } });
    assert.equal(calls[0].ref.actionId, "track_tap");
    assert.deepEqual(calls[0].context.event, { values: { name: "MeuMall" } });
  });
});
