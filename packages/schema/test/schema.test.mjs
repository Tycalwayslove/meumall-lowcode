import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  LOWCODE_SCHEMA_VERSION,
  createLowcodeNode,
  createLowcodePageSchema,
  createMaterialManifest,
  isSchemaVersionCompatible,
  normalizeLowcodePageSchema,
  validateLowcodeMaterialManifest,
  validateLowcodePageSchema,
} from "../dist/index.js";

describe("@meumall/lowcode-schema", () => {
  it("creates and validates a nested H5 page schema", () => {
    const schema = createLowcodePageSchema({
      pageId: "test_page",
      title: "测试活动页",
      pageType: "activity",
      nodes: [
        createLowcodeNode({
          id: "container_1",
          componentName: "SectionContainer",
          materialVersion: "1.0.0",
          props: { title: "主会场" },
          children: [
            createLowcodeNode({
              id: "banner_1",
              componentName: "ImageBanner",
              materialVersion: "1.0.0",
              props: { imageUrl: "https://example.com/banner.png" },
            }),
          ],
        }),
      ],
      actions: [{ id: "go_coupon", type: "navigate", params: { url: "/coupon" } }],
      dataSources: [{ id: "products", type: "mock", bindTo: "products" }],
    });

    const result = validateLowcodePageSchema(schema);

    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
    assert.equal(schema.publishMeta.environment, "test");
    assert.equal(schema.targetPlatforms[0], "h5");
  });

  it("normalizes Page Schema v1 defaults and validates enum boundaries", () => {
    const normalized = normalizeLowcodePageSchema({
      schemaVersion: "",
      pageId: "minimal_page",
      pageVersion: "",
      title: "最小页面",
      status: "",
      targetPlatforms: [],
      layout: undefined,
      nodes: undefined,
      publishMeta: {},
    });

    assert.equal(normalized.schemaVersion, LOWCODE_SCHEMA_VERSION);
    assert.equal(normalized.pageVersion, "0.1.0");
    assert.equal(normalized.status, "draft");
    assert.deepEqual(normalized.targetPlatforms, ["h5"]);
    assert.deepEqual(normalized.layout, { safeArea: true });
    assert.deepEqual(normalized.nodes, []);
    assert.equal(normalized.publishMeta.environment, "test");
    assert.equal(validateLowcodePageSchema(normalized).valid, true);

    const invalid = createLowcodePageSchema({
      pageId: "invalid_page",
      title: "非法页面",
      status: "archived",
      targetPlatforms: ["native"],
      nodes: [
        createLowcodeNode({
          id: "bad_node",
          componentName: "ImageBanner",
          materialVersion: "1.0.0",
          props: {},
          visibility: { source: "expression" },
          responsive: [{ platform: "native" }],
        }),
      ],
    });

    const result = validateLowcodePageSchema(invalid);

    assert.equal(result.valid, false);
    assert.match(result.errors.join("\n"), /status must be draft/);
    assert.match(result.errors.join("\n"), /targetPlatforms\[0\] must be h5 or miniapp/);
    assert.match(result.errors.join("\n"), /visibility.source must be static or data/);
    assert.match(result.errors.join("\n"), /responsive\[0\].platform must be h5 or miniapp/);
  });

  it("reports duplicate node ids and missing action references", () => {
    const schema = createLowcodePageSchema({
      pageId: "broken_page",
      title: "错误页面",
      nodes: [
        createLowcodeNode({
          id: "duplicated",
          componentName: "ActionButton",
          materialVersion: "1.0.0",
          props: {},
          events: { click: { actionId: "missing_action" } },
        }),
        createLowcodeNode({
          id: "duplicated",
          componentName: "NoticeBar",
          materialVersion: "1.0.0",
          props: {},
        }),
      ],
      actions: [{ id: "existing_action", type: "navigate" }],
    });

    const result = validateLowcodePageSchema(schema);

    assert.equal(result.valid, false);
    assert.match(result.errors.join("\n"), /duplicated/);
    assert.match(result.errors.join("\n"), /missing_action/);
  });

  it("validates material manifests and schema major compatibility", () => {
    const manifest = createMaterialManifest({
      componentName: "CouponSection",
      materialVersion: "1.0.0",
      title: "优惠券区块",
      category: "营销",
      platforms: ["h5"],
      propsSchema: {
        title: {
          label: "标题",
          type: "string",
          setter: "input",
          defaultValue: "限时领券",
        },
      },
      defaultProps: { title: "限时领券" },
    });

    assert.equal(validateLowcodeMaterialManifest(manifest).valid, true);
    assert.equal(isSchemaVersionCompatible("1.9.0"), true);
    assert.equal(isSchemaVersionCompatible("2.0.0"), false);
  });
});
