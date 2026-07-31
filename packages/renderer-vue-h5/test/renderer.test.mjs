import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createLowcodeVueMissingMaterialFallback,
  createLowcodeVueRenderErrorFallback,
  LowcodeVueRenderer,
} from "../dist/index.js";

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
});
