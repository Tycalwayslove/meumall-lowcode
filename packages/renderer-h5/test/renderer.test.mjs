import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createMaterialRegistry } from "../../core/dist/index.js";
import { createLowcodePageSchema } from "../../schema/dist/index.js";
import {
  createLowcodeMissingMaterialFallback,
  createLowcodeRenderErrorFallback,
  LowcodeRenderer,
} from "../dist/index.js";

function collectElements(element, predicate, matches = []) {
  if (!element || typeof element !== "object") return matches;
  if (predicate(element)) matches.push(element);

  const children = element.props?.children;
  if (Array.isArray(children)) {
    for (const child of children) collectElements(child, predicate, matches);
  } else {
    collectElements(children, predicate, matches);
  }

  return matches;
}

describe("@meumall/lowcode-renderer-h5 fallback", () => {
  it("renders empty schemas through the provided fallback", () => {
    const schema = createLowcodePageSchema({
      pageId: "empty_test",
      pageVersion: "v1",
      title: "空页面",
      pageType: "activity",
      targetPlatforms: ["h5"],
      nodes: [],
      publishMeta: { environment: "test" },
    });

    const rendered = LowcodeRenderer({ schema, registry: createMaterialRegistry(), fallback: "页面暂无内容" });

    assert.equal(rendered.props.children, "页面暂无内容");
  });

  it("keeps unknown material fallback visible and traceable", () => {
    const schema = createLowcodePageSchema({
      pageId: "missing_test",
      pageVersion: "v1",
      title: "未知物料",
      pageType: "activity",
      targetPlatforms: ["h5"],
      nodes: [{ id: "node_missing", componentName: "MissingBlock", materialVersion: "0.1.0", props: {} }],
      publishMeta: { environment: "test" },
    });

    const rendered = LowcodeRenderer({ schema, registry: createMaterialRegistry() });
    const matches = collectElements(rendered, (element) => element.props?.["data-lowcode-missing"] === "MissingBlock");

    assert.equal(matches.length, 1);
    assert.equal(matches[0].props.className, "mlc-runtime-missing");
    assert.equal(matches[0].props["data-lowcode-node-id"], "node_missing");
  });

  it("passes material event payloads into action executor context", () => {
    function TestButton() {
      return null;
    }
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
      pageId: "event_payload_test",
      title: "事件 payload",
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
    const rendered = LowcodeRenderer({
      schema,
      registry,
      actionExecutor: {
        execute(ref, context) {
          calls.push({ ref, context });
        },
      },
    });
    const materialElements = collectElements(rendered, (element) => element.type === TestButton);

    assert.equal(materialElements.length, 1);
    materialElements[0].props.props.onTap({ values: { name: "MeuMall" } });
    assert.equal(calls[0].ref.actionId, "track_tap");
    assert.deepEqual(calls[0].context.event, { values: { name: "MeuMall" } });
  });

  it("creates traceable missing and render-error fallback nodes", () => {
    const node = { id: "node_broken", componentName: "BrokenBlock", materialVersion: "0.1.0", props: {} };

    const missing = createLowcodeMissingMaterialFallback(node);
    const error = createLowcodeRenderErrorFallback(node);

    assert.equal(missing.props.className, "mlc-runtime-missing");
    assert.equal(missing.props["data-lowcode-node-id"], "node_broken");
    assert.equal(missing.props["data-lowcode-missing"], "BrokenBlock");
    assert.equal(error.props.className, "mlc-runtime-error");
    assert.equal(error.props["data-lowcode-node-id"], "node_broken");
    assert.equal(error.props["data-lowcode-error"], "node_broken");
  });
});
