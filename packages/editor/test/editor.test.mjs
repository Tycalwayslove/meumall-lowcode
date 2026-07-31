import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  countLowcodeNodes,
  createLowcodeDeliverySummary,
  createLowcodePublishChecks,
  flattenLowcodeNodes,
  getLowcodeNodeDisplayName,
  summarizeLowcodePublishChecks,
} from "../dist/index.js";
import {
  createLowcodeNode,
  createLowcodePageSchema,
  createMaterialManifest,
} from "../../schema/dist/index.js";

const manifests = [
  createMaterialManifest({
    componentName: "ImageBanner",
    materialVersion: "1.0.0",
    title: "图片 Banner",
    category: "marketing",
    platforms: ["h5"],
    propsSchema: {
      imageUrl: { label: "图片", type: "string", setter: "image", defaultValue: "" },
    },
    defaultProps: { imageUrl: "" },
  }),
  createMaterialManifest({
    componentName: "ProductList",
    materialVersion: "1.0.0",
    title: "商品列表",
    category: "commerce",
    platforms: ["h5"],
    propsSchema: {
      items: { label: "商品", type: "array", setter: "textarea", defaultValue: [] },
    },
    defaultProps: { items: [] },
  }),
  createMaterialManifest({
    componentName: "ProductRankList",
    materialVersion: "1.0.0",
    title: "商品榜单",
    category: "commerce",
    platforms: ["h5"],
    propsSchema: {
      items: { label: "榜单商品", type: "array", setter: "textarea", defaultValue: [] },
    },
    defaultProps: { items: [] },
  }),
  createMaterialManifest({
    componentName: "ActionButton",
    materialVersion: "1.0.0",
    title: "行动按钮",
    category: "basic",
    platforms: ["h5"],
    propsSchema: {
      text: { label: "文案", type: "string", setter: "input", defaultValue: "立即查看" },
    },
    defaultProps: { text: "立即查看" },
    events: [{ name: "click", label: "点击" }],
  }),
];

function createReadinessSchema() {
  return createLowcodePageSchema({
    pageId: "readiness_page",
    title: "发布检查页面",
    pageType: "activity",
    nodes: [
      createLowcodeNode({
        id: "container_1",
        componentName: "SectionContainer",
        materialVersion: "1.0.0",
        props: {},
        children: [
          createLowcodeNode({
            id: "banner_1",
            componentName: "ImageBanner",
            materialVersion: "1.0.0",
            props: { imageUrl: "" },
            meta: { name: "首屏主图" },
          }),
          createLowcodeNode({
            id: "products_1",
            componentName: "ProductList",
            materialVersion: "1.0.0",
            props: { items: [] },
          }),
          createLowcodeNode({
            id: "rank_1",
            componentName: "ProductRankList",
            materialVersion: "1.0.0",
            props: {},
            dataBinding: { items: "broken_products" },
          }),
          createLowcodeNode({
            id: "button_missing_action",
            componentName: "ActionButton",
            materialVersion: "1.0.0",
            props: { text: "缺失动作" },
            events: { click: { actionId: "missing_action" } },
          }),
          createLowcodeNode({
            id: "button_missing_param",
            componentName: "ActionButton",
            materialVersion: "1.0.0",
            props: { text: "缺少参数" },
            events: { click: { actionId: "nav_without_url" } },
          }),
        ],
      }),
    ],
    dataSources: [{ id: "broken_products", type: "mock.products", bindTo: "products" }],
    actions: [{ id: "nav_without_url", type: "navigate", params: {} }],
  });
}

describe("@meumall/lowcode-editor readiness", () => {
  it("flattens nodes, counts nodes and resolves display names", () => {
    const schema = createReadinessSchema();
    const nodes = flattenLowcodeNodes(schema.nodes);
    const banner = nodes.find((node) => node.id === "banner_1");
    const button = nodes.find((node) => node.id === "button_missing_param");

    assert.equal(nodes.length, 6);
    assert.equal(countLowcodeNodes(schema), 6);
    assert.ok(banner);
    assert.ok(button);
    assert.equal(getLowcodeNodeDisplayName(banner, manifests[0]), "首屏主图");
    assert.equal(getLowcodeNodeDisplayName(button, manifests[3]), "行动按钮");
  });

  it("creates publish checks for schema, assets, products, data sources and actions", () => {
    const schema = createReadinessSchema();
    const checks = createLowcodePublishChecks(schema, {
      materialManifests: manifests,
      dataSourceRecords: [{
        id: "broken_products",
        status: "error",
        bindTo: "products",
        error: "接口 500",
      }],
    });
    const summary = summarizeLowcodePublishChecks(checks);
    const descriptions = checks.map((check) => check.description).join("\n");

    assert.equal(checks.some((check) => check.id === "schema" && check.status === "error"), true);
    assert.match(descriptions, /首屏主图 的「图片」为空/);
    assert.match(descriptions, /商品列表 没有静态商品，也没有绑定商品数据源/);
    assert.match(descriptions, /broken_products 解析失败：接口 500/);
    assert.match(descriptions, /引用了不存在的动作 missing_action/);
    assert.match(descriptions, /nav_without_url 缺少 跳转 URL/);
    assert.equal(summary.error >= 3, true);
    assert.equal(summary.warning >= 3, true);
  });

  it("creates delivery summary from publish checks", () => {
    const schema = createLowcodePageSchema({
      pageId: "delivery_page",
      title: "交付页面",
      pageType: "activity",
      nodes: [
        createLowcodeNode({
          id: "banner_1",
          componentName: "ImageBanner",
          materialVersion: "1.0.0",
          props: { imageUrl: "https://example.com/banner.jpg" },
        }),
      ],
      actions: [{ id: "go_home", type: "navigate", params: { url: "/" } }],
    });
    const checks = createLowcodePublishChecks(schema, { materialManifests: manifests });
    const delivery = createLowcodeDeliverySummary(schema, { checks });

    assert.equal(delivery.statusText, "检查通过");
    assert.equal(delivery.metrics.find((item) => item.label === "页面标题")?.value, "交付页面");
    assert.equal(delivery.metrics.find((item) => item.label === "节点")?.value, "1 个");
    assert.equal(delivery.metrics.find((item) => item.label === "动作")?.value, "1 个");
    assert.equal(delivery.schemaJson.includes("delivery_page"), true);
    assert.equal(delivery.schemaSizeBytes > 0, true);
    assert.match(delivery.schemaSizeText, /B|KB/);
  });
});
