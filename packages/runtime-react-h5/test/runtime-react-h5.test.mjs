import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createLowcodePageSchema } from "../../schema/dist/index.js";
import {
  LowcodeReactH5Runtime,
  countLowcodeReactH5RuntimeNodes,
  createDefaultReactH5MaterialRegistry,
  createLowcodeReactH5RuntimeViewModel,
} from "../dist/index.js";

describe("@meumall/lowcode-runtime-react-h5", () => {
  it("creates the default React H5 material registry", () => {
    const registry = createDefaultReactH5MaterialRegistry();

    assert.ok(registry.get("BasicButton"));
    assert.ok(registry.get("ProductList"));
    assert.equal(registry.list().some((material) => material.manifest.componentName === "MlcButton"), false);
  });

  it("counts nested runtime nodes", () => {
    const schema = createLowcodePageSchema({
      pageId: "runtime_count_page",
      title: "节点统计",
      nodes: [
        {
          id: "container",
          componentName: "SectionContainer",
          materialVersion: "0.1.0",
          props: {},
          children: [
            { id: "title", componentName: "BasicText", materialVersion: "0.1.0", props: { text: "标题" } },
            { id: "button", componentName: "BasicButton", materialVersion: "0.1.0", props: { text: "按钮" } },
          ],
        },
      ],
    });

    assert.equal(countLowcodeReactH5RuntimeNodes(schema), 3);
  });

  it("creates runtime view models with shared health summary", () => {
    const schema = createLowcodePageSchema({
      pageId: "runtime_view_model_page",
      title: "健康摘要",
      nodes: [{ id: "title", componentName: "BasicText", materialVersion: "0.1.0", props: { text: "标题" } }],
    });

    const healthy = createLowcodeReactH5RuntimeViewModel({
      schema,
      source: "published",
      dataSourceRecords: [{ id: "ds_products", type: "product.byIds", bindTo: "products", status: "resolved" }],
    });
    const missing = createLowcodeReactH5RuntimeViewModel({
      source: "encoded",
    });

    assert.equal(healthy.validation.valid, true);
    assert.equal(healthy.nodeCount, 1);
    assert.equal(healthy.healthSummary.level, "healthy");
    assert.equal(missing.validation.valid, false);
    assert.equal(missing.healthSummary.level, "error");
    assert.match(missing.healthSummary.priorityItems[0].description, /Runtime schema is empty/);
  });

  it("renders schemas through the React H5 runtime component", () => {
    const schema = createLowcodePageSchema({
      pageId: "runtime_component_page",
      title: "组件渲染",
      nodes: [{ id: "title", componentName: "BasicText", materialVersion: "0.1.0", props: { text: "组件标题" } }],
    });
    const runtime = {
      ...createLowcodeReactH5RuntimeViewModel({ schema, source: "published" }),
      schema,
      source: "published",
      data: {},
      dataSourceRecords: [],
      schemaLoading: false,
      dataResolving: false,
      renderErrors: [],
      recordRenderError() {},
      clearRenderErrors() {},
    };

    const rendered = LowcodeReactH5Runtime({ runtime });

    assert.equal(rendered.props.schema.pageId, "runtime_component_page");
    assert.equal(rendered.props["data-lowcode-page"], undefined);
  });
});
