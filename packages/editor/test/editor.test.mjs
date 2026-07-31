import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  countLowcodeNodes,
  cloneLowcodePageSchema,
  createLowcodeBlankPageSchema,
  createLowcodeDeliverySummary,
  createLowcodePageStartState,
  createLowcodePublishChecks,
  createLowcodeSchemaPreviewItems,
  createLowcodeSchemaPreviewSnippet,
  createLowcodeTemplateListItem,
  createLowcodeTemplatePreviewMeta,
  createLowcodeVersionDiffItems,
  flattenLowcodeNodes,
  formatLowcodeTemplateSummary,
  formatLowcodeTemplateVersion,
  getLowcodeNodeDisplayName,
  sliceLowcodeTemplateTags,
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

  it("creates version diff items and schema preview snippets", () => {
    const current = createLowcodePageSchema({
      pageId: "version_page",
      title: "当前草稿",
      status: "draft",
      pageVersion: "0.2.0",
      pageType: "activity",
      layout: { safeArea: true, backgroundColor: "#ffffff" },
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
              props: { imageUrl: "https://example.com/banner.jpg" },
              meta: { name: "首屏 Banner" },
            }),
          ],
        }),
      ],
      dataSources: [{ id: "products", type: "mock.products", bindTo: "products" }],
      actions: [{ id: "go_detail", type: "navigate", params: { url: "/detail" } }],
      publishMeta: { environment: "pre", operator: "tester" },
    });
    const selected = createLowcodePageSchema({
      pageId: "version_page",
      title: "已发布版本",
      status: "published",
      pageVersion: "0.1.0",
      pageType: "activity",
      nodes: [
        createLowcodeNode({
          id: "banner_old",
          componentName: "ImageBanner",
          materialVersion: "1.0.0",
          props: { imageUrl: "https://example.com/old.jpg" },
        }),
      ],
      publishMeta: { environment: "prod", operator: "publisher", publishedAt: "2026-08-01T00:00:00.000Z" },
    });

    const diffItems = createLowcodeVersionDiffItems(current, selected);
    const titleDiff = diffItems.find((item) => item.label === "标题");
    const nodeCountDiff = diffItems.find((item) => item.label === "节点数");
    const dataSourceDiff = diffItems.find((item) => item.label === "数据源数");
    const actionDiff = diffItems.find((item) => item.label === "动作数");
    const snippet = createLowcodeSchemaPreviewSnippet(current);
    const previewItems = createLowcodeSchemaPreviewItems(current, selected, {
      selectedDescription: "本地发布版本 / 0.1.0",
    });

    assert.deepEqual(titleDiff, { label: "标题", current: "当前草稿", selected: "已发布版本", changed: true });
    assert.deepEqual(nodeCountDiff, { label: "节点数", current: "2", selected: "1", changed: true });
    assert.deepEqual(dataSourceDiff, { label: "数据源数", current: "1", selected: "0", changed: true });
    assert.deepEqual(actionDiff, { label: "动作数", current: "1", selected: "0", changed: true });
    assert.equal(snippet.nodeCount, 2);
    assert.deepEqual(snippet.nodes[0], {
      id: "container_1",
      componentName: "SectionContainer",
      name: null,
      childCount: 1,
    });
    assert.deepEqual(snippet.dataSourceIds, ["products"]);
    assert.deepEqual(snippet.actionIds, ["go_detail"]);
    assert.equal(previewItems.length, 2);
    assert.equal(previewItems[0].title, "当前草稿 Schema 片段");
    assert.equal(previewItems[1].description, "本地发布版本 / 0.1.0");
    assert.equal(previewItems[1].json.includes("banner_old"), true);
  });

  it("creates template preview metadata and list summaries", () => {
    const template = {
      id: "template_topic",
      title: "商品专题页",
      description: "适合商品内容运营。",
      category: "商品",
      tags: ["商品", "专题", "内容", "转化", "长尾"],
      version: "1.2.0",
      schema: createLowcodePageSchema({
        pageId: "template_topic_page",
        title: "商品专题页",
        pageType: "topic",
        nodes: [
          createLowcodeNode({
            id: "container_1",
            componentName: "SectionContainer",
            materialVersion: "1.0.0",
            props: {},
            children: [
              createLowcodeNode({
                id: "brand_1",
                componentName: "BrandFeatureSection",
                materialVersion: "1.0.0",
                props: {
                  coverImageUrl: "https://example.com/topic.jpg",
                  brandName: "通勤好物",
                  summary: "精选日常高频商品",
                },
              }),
            ],
          }),
        ],
        dataSources: [{ id: "products", type: "mock.products", bindTo: "products" }],
        actions: [{ id: "go_topic", type: "navigate", params: { url: "/topic" } }],
      }),
    };

    const preview = createLowcodeTemplatePreviewMeta(template);
    const item = createLowcodeTemplateListItem(template);

    assert.deepEqual(preview, {
      imageUrl: "https://example.com/topic.jpg",
      title: "通勤好物",
      subtitle: "精选日常高频商品",
      nodeCountText: "2 节点",
    });
    assert.equal(item.nodeCount, 2);
    assert.equal(item.dataSourceCount, 1);
    assert.equal(item.actionCount, 1);
    assert.deepEqual(sliceLowcodeTemplateTags(item), ["商品", "专题", "内容", "转化"]);
    assert.deepEqual(sliceLowcodeTemplateTags(item, 2), ["商品", "专题"]);
    assert.equal(formatLowcodeTemplateVersion(item), "v1.2.0");
    assert.equal(formatLowcodeTemplateSummary(item), "2 个节点 / 1 个数据源 / 1 个动作");
    assert.equal(formatLowcodeTemplateVersion({ version: undefined }), "未标版本");
  });

  it("creates blank H5 page schemas and page start states", () => {
    const blank = createLowcodeBlankPageSchema({
      now: new Date("2026-08-01T00:00:00.000Z"),
      pageIdPrefix: "blank-test",
      operator: "tester",
    });
    const state = createLowcodePageStartState(blank, {
      viewport: { width: 390 },
      dirty: true,
      lastAction: "createBlankPage",
    });

    assert.equal(blank.pageId, "blank-test-ms9ludc0");
    assert.equal(blank.title, "未命名 H5 页面");
    assert.equal(blank.pageType, "custom");
    assert.deepEqual(blank.targetPlatforms, ["h5"]);
    assert.equal(blank.layout.safeArea, true);
    assert.equal(blank.layout.backgroundColor, "#f8fafc");
    assert.equal(blank.layout.maxWidth, 430);
    assert.equal(blank.nodes.length, 0);
    assert.equal(blank.tracking?.pageName, "lowcode_blank_h5");
    assert.deepEqual(blank.tracking?.channelParamKeys, ["utm_source", "channel"]);
    assert.equal(blank.publishMeta.environment, "test");
    assert.equal(blank.publishMeta.operator, "tester");
    assert.equal(blank.editor?.canvasWidth, 375);
    assert.equal(state.schema.pageId, blank.pageId);
    assert.equal(state.mode, "design");
    assert.equal(state.viewport.width, 390);
    assert.equal(state.dirty, true);
    assert.equal(state.lastAction, "createBlankPage");
  });

  it("clones template schemas before creating page start states", () => {
    const schema = createLowcodePageSchema({
      pageId: "template_clone_page",
      title: "模板克隆",
      nodes: [
        createLowcodeNode({
          id: "banner_1",
          componentName: "ImageBanner",
          materialVersion: "1.0.0",
          props: { imageUrl: "https://example.com/banner.jpg" },
        }),
      ],
    });

    const cloned = cloneLowcodePageSchema(schema);
    cloned.nodes[0].props.imageUrl = "https://example.com/changed.jpg";
    const state = createLowcodePageStartState(schema, {
      mode: "preview",
      dirty: false,
      lastAction: "applyTemplate",
    });
    state.schema.nodes[0].props.imageUrl = "https://example.com/state.jpg";

    assert.equal(schema.nodes[0].props.imageUrl, "https://example.com/banner.jpg");
    assert.equal(cloned.nodes[0].props.imageUrl, "https://example.com/changed.jpg");
    assert.equal(state.selectedNodeId, "banner_1");
    assert.equal(state.mode, "preview");
    assert.equal(state.dirty, false);
    assert.equal(state.lastAction, "applyTemplate");
  });
});
