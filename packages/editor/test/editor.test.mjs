import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  addLowcodeDataSource,
  addLowcodeAction,
  countLowcodeNodes,
  cloneLowcodePageSchema,
  createEditorState,
  createLowcodeEditorViewportFromPreset,
  createLowcodeBlankPageSchema,
  bindLowcodeNodeEvent,
  canLowcodeDragSelectedGroup,
  createLowcodeActionConfig,
  createLowcodeActionFormItems,
  createLowcodeCanvasAppendDropHint,
  createLowcodeCanvasDropHintStyle,
  createLowcodeCanvasDropTarget,
  createLowcodeCanvasGroupMoveTarget,
  createLowcodeCanvasNodeMoveTarget,
  createLowcodeCanvasSnapGuides,
  createLowcodeCanvasTargetDropHint,
  createLowcodeDataSourceConfig,
  createLowcodeDataSourceFormItems,
  createLowcodeDefaultListItem,
  createLowcodeDefaultDataSourceParams,
  createLowcodeDefaultActionParams,
  createLowcodeDeliverySummary,
  createLowcodeEditorDraftPayload,
  createLowcodeEditorCommandSearchText,
  createLowcodeEditorPermissionState,
  createLowcodeActionOptions,
  createLowcodeEventBindingItems,
  createLowcodeListEditorFields,
  createLowcodeMaterialCatalogItem,
  createLowcodeMaterialCategories,
  createLowcodeMaterialDetailDataSourceSlotItems,
  createLowcodeMaterialDetailEventItems,
  createLowcodeMaterialDetailPropEntries,
  createLowcodeMaterialDetailSummary,
  createLowcodeMaterialFavoriteMessage,
  createLowcodeMaterialNodeInput,
  createLowcodeMaterialPreviewSchema,
  createLowcodeNodeOperationItems,
  createLowcodeNodeOperationMessage,
  createLowcodeNodeSelectionModel,
  createLowcodeNodeSelectionSummary,
  createLowcodeOutlineRowSearchText,
  createLowcodeOutlineRows,
  createLowcodeOutlineVisibility,
  createLowcodePublishBlockedMessage,
  createLowcodePageSettingsForm,
  createLowcodePageStartState,
  createLowcodeReleaseListItem,
  createLowcodeReleaseListItems,
  createLowcodeReleaseMessage,
  createLowcodeRollbackConfirmText,
  createLowcodeRollbackNote,
  createLowcodePropGroups,
  createLowcodePreviewLinkItem,
  createLowcodePreviewLinkItems,
  createLowcodePublishChecks,
  createLowcodeSchemaFileExport,
  createLowcodeSchemaFileName,
  createLowcodeSchemaPreviewItems,
  createLowcodeSchemaPreviewSnippet,
  createLowcodeTemplateListItem,
  createLowcodeTemplatePreviewMeta,
  createLowcodeVersionDiffItems,
  createLowcodeWorkspaceStats,
  findLowcodeEditorViewportPreset,
  filterLowcodeEditorCommands,
  filterLowcodeMaterialCatalog,
  flattenLowcodeNodes,
  formatLowcodeActionParamsText,
  formatLowcodeDataSourceParamsText,
  formatLowcodeDataSourceRecordLabel,
  formatLowcodeEditorViewportTitle,
  formatLowcodeEditorDraftStatusText,
  formatLowcodeReleaseKindLabel,
  formatLowcodeReleaseTime,
  formatLowcodeVersionDiffSummary,
  formatLowcodeMaterialCatalogSummary,
  formatLowcodeTemplateSummary,
  formatLowcodeTemplateVersion,
  getLowcodeEditorViewportPreset,
  getLowcodeEditorDraftStatusTone,
  getLowcodeNodeDisplayName,
  getLowcodePropEditorControl,
  getLowcodeSelectedGroupNodeIdsForDrag,
  groupLowcodeEditorCommands,
  getLowcodeEditorActionDisabledReason,
  getLowcodePropGroupKey,
  hasLowcodeSameParentSelection,
  isLowcodeInvalidNodeDropTarget,
  isLowcodeListImageField,
  isLowcodeEditorActionAllowed,
  isLowcodeListPropEditor,
  isLowcodeFavoriteMaterial,
  isLowcodeNodeSelected,
  isLowcodeStructuredPropEditor,
  isLowcodePropGroupCollapsed,
  insertLowcodeCanvasNodeByHint,
  LOWCODE_H5_VIEWPORT_PRESETS,
  LOWCODE_EDITOR_DEFAULT_DATA_SOURCE_TYPE_OPTIONS,
  LOWCODE_EDITOR_DEFAULT_ACTION_TYPE_OPTIONS,
  LOWCODE_EDITOR_PAGE_BACKGROUND_SWATCHES,
  LOWCODE_EDITOR_PAGE_STATUS_OPTIONS,
  LOWCODE_EDITOR_PAGE_TYPE_OPTIONS,
  LOWCODE_EDITOR_PUBLISH_ENVIRONMENT_OPTIONS,
  LOWCODE_EDITOR_COMMAND_DEFAULT_LIMIT,
  LOWCODE_EDITOR_MUTATING_PERMISSION_ACTIONS,
  LOWCODE_EDITOR_PERMISSION_ACTIONS,
  LOWCODE_EDITOR_COMMON_LIST_FIELDS,
  LOWCODE_EDITOR_PROP_GROUP_META,
  LOWCODE_EDITOR_PROP_GROUP_ORDER,
  LOWCODE_EDITOR_RECENT_MATERIAL_DEFAULT_LIMIT,
  normalizeLowcodeMaterialComponentNames,
  normalizeLowcodePropInputValue,
  normalizeLowcodePageMaxWidth,
  parseLowcodeSchemaFileContent,
  parseLowcodeEditorDraftContent,
  parseLowcodeMaterialPreferenceContent,
  pickLowcodeMaterialEntriesByComponentNames,
  pickLowcodeSelectedOutlineRows,
  pruneLowcodeNodeSelection,
  pruneLowcodeOutlineCollapsedNodeIds,
  revealLowcodeOutlineNode,
  removeLowcodeAction,
  removeLowcodeDataSource,
  removeLowcodeActionRefsFromNodes,
  renameLowcodeActionRefsInNodes,
  renameLowcodeAction,
  resolveLowcodeNodeShortcutAction,
  setLowcodeActionType,
  setEditorViewportPreset,
  sliceLowcodeTemplateTags,
  summarizeLowcodePreviewLinks,
  summarizeLowcodeReleaseList,
  summarizeLowcodePublishChecks,
  toggleLowcodeFavoriteMaterial,
  toggleLowcodeNodeSelection,
  toggleLowcodePropGroupCollapsed,
  toLowcodePropInputBoolean,
  toLowcodePropInputText,
  updateLowcodeAction,
  updateLowcodeDataSource,
  updateLowcodePageBackgroundColor,
  updateLowcodePageDescription,
  updateLowcodePageMaxWidth,
  updateLowcodePageSafeArea,
  updateLowcodePageStatus,
  updateLowcodePageTitle,
  updateLowcodePageType,
  updateLowcodePublishEnvironment,
  upsertLowcodeDataSourceConfigs,
  recordLowcodeRecentMaterial,
  moveLowcodeCanvasNodeByHint,
  moveLowcodeCanvasNodeGroupByHint,
  resolveLowcodeCanvasDropPlacement,
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

  it("creates reusable schema file export and import results", () => {
    const schema = createLowcodePageSchema({
      pageId: "schema file/page",
      title: "Schema 文件页面",
      nodes: [
        createLowcodeNode({
          id: "banner_1",
          componentName: "ImageBanner",
          materialVersion: "1.0.0",
          props: { imageUrl: "https://example.com/banner.jpg" },
        }),
      ],
    });
    const exported = createLowcodeSchemaFileExport(schema, {
      now: new Date("2026-08-01T00:00:00.000Z"),
    });

    assert.equal(createLowcodeSchemaFileName(schema, { filename: "活动页备份" }), "活动页备份.json");
    assert.equal(exported.filename, "meumall-lowcode-schema-file-page-2026-08-01T00-00-00-000Z.json");
    assert.equal(exported.mimeType, "application/json;charset=utf-8");
    assert.equal(exported.content.includes("\n  "), true);
    assert.equal(exported.sizeBytes > 0, true);
    assert.match(exported.sizeText, /B|KB/);

    const compact = createLowcodeSchemaFileExport(schema, { pretty: false });
    assert.equal(compact.content.includes("\n"), false);

    const imported = parseLowcodeSchemaFileContent(exported.content);
    assert.equal(imported.ok, true);
    assert.equal(imported.schema.pageId, "schema file/page");
    imported.schema.title = "导入后修改";
    assert.equal(schema.title, "Schema 文件页面");

    const invalidJson = parseLowcodeSchemaFileContent("{");
    assert.equal(invalidJson.ok, false);
    assert.match(invalidJson.error, /JSON 格式不正确/);

    const invalidSchema = parseLowcodeSchemaFileContent(JSON.stringify({ pageId: "missing_fields" }));
    assert.equal(invalidSchema.ok, false);
    assert.match(invalidSchema.error, /Page Schema 校验失败/);
    assert.equal(Array.isArray(invalidSchema.validationErrors), true);
  });

  it("creates reusable draft persistence payloads and restore results", () => {
    const fallbackSchema = createLowcodePageSchema({
      pageId: "fallback_page",
      title: "兜底页面",
    });
    const schema = createLowcodePageSchema({
      pageId: "draft_page",
      title: "草稿页面",
      nodes: [
        createLowcodeNode({
          id: "banner_1",
          componentName: "ImageBanner",
          materialVersion: "1.0.0",
          props: { imageUrl: "https://example.com/banner.jpg" },
        }),
      ],
    });
    const payload = createLowcodeEditorDraftPayload(schema, {
      now: new Date("2026-08-01T01:02:03.000Z"),
    });

    assert.equal(payload.version, 1);
    assert.equal(payload.updatedAt, "2026-08-01T01:02:03.000Z");
    assert.equal(payload.schema.pageId, "draft_page");
    assert.equal(payload.schemaJson.includes("draft_page"), true);
    assert.equal(payload.schemaSizeBytes > 0, true);
    assert.match(payload.schemaSizeText, /B|KB/);
    payload.schema.title = "修改草稿副本";
    assert.equal(schema.title, "草稿页面");

    const restored = parseLowcodeEditorDraftContent(JSON.stringify(payload), { fallbackSchema });
    assert.equal(restored.restored, true);
    assert.equal(restored.schema.pageId, "draft_page");
    assert.equal(restored.legacy, false);
    assert.equal(restored.payload?.updatedAt, "2026-08-01T01:02:03.000Z");
    restored.schema.title = "恢复后修改";
    assert.equal(payload.schema.title, "修改草稿副本");

    const legacyRestored = parseLowcodeEditorDraftContent(JSON.stringify(schema), { fallbackSchema });
    assert.equal(legacyRestored.restored, true);
    assert.equal(legacyRestored.legacy, true);
    assert.equal(legacyRestored.schema.pageId, "draft_page");

    const empty = parseLowcodeEditorDraftContent(null, { fallbackSchema });
    assert.equal(empty.restored, false);
    assert.equal(empty.schema?.pageId, "fallback_page");

    const invalidJson = parseLowcodeEditorDraftContent("{", { fallbackSchema });
    assert.equal(invalidJson.restored, false);
    assert.equal(invalidJson.schema?.pageId, "fallback_page");
    assert.match(invalidJson.error ?? "", /草稿 JSON 格式不正确/);

    const invalidSchema = parseLowcodeEditorDraftContent(JSON.stringify({ schema: { pageId: "missing" }, version: 1, updatedAt: "now" }), {
      fallbackSchema,
    });
    assert.equal(invalidSchema.restored, false);
    assert.equal(invalidSchema.schema?.pageId, "fallback_page");
    assert.match(invalidSchema.error ?? "", /草稿 Page Schema 校验失败/);
    assert.equal(Array.isArray(invalidSchema.validationErrors), true);

    assert.equal(formatLowcodeEditorDraftStatusText("restored"), "已恢复本地草稿");
    assert.equal(formatLowcodeEditorDraftStatusText("pending"), "自动保存中");
    assert.equal(formatLowcodeEditorDraftStatusText("saved", {
      lastSavedAt: "2026-08-01T01:02:03.000Z",
      formatSavedAt: () => "01:02:03",
    }), "已自动保存 01:02:03");
    assert.equal(formatLowcodeEditorDraftStatusText("error"), "自动保存失败");
    assert.equal(formatLowcodeEditorDraftStatusText("idle"), "自动保存待命");
    assert.equal(getLowcodeEditorDraftStatusTone("idle"), "neutral");
    assert.equal(getLowcodeEditorDraftStatusTone("pending"), "warning");
    assert.equal(getLowcodeEditorDraftStatusTone("restored"), "success");
    assert.equal(getLowcodeEditorDraftStatusTone("saved"), "success");
    assert.equal(getLowcodeEditorDraftStatusTone("error"), "danger");
  });

  it("creates reusable H5 preview link items and summaries", () => {
    const sources = [
      {
        id: "react-current",
        title: "当前草稿 React H5",
        description: "携带当前 schema。",
        url: " https://example.com/runtime?schema=abc ",
      },
      {
        id: "published-runtime",
        title: "最近发布版本 H5",
        description: "发布后可用。",
        disabledReason: "暂无发布版本",
      },
      {
        id: "missing-url",
        title: "空链接",
        description: "缺少 URL。",
      },
    ];

    const ready = createLowcodePreviewLinkItem(sources[0], { readyStatusText: "可预览" });
    assert.deepEqual(ready, {
      id: "react-current",
      title: "当前草稿 React H5",
      description: "携带当前 schema。",
      url: "https://example.com/runtime?schema=abc",
      status: "ready",
      statusText: "可预览",
      openable: true,
      copyable: true,
    });

    const allItems = createLowcodePreviewLinkItems(sources);
    assert.equal(allItems.length, 3);
    assert.equal(allItems[1].status, "disabled");
    assert.equal(allItems[1].statusText, "暂无发布版本");
    assert.equal(allItems[2].statusText, "暂无可用链接");
    assert.deepEqual(createLowcodePreviewLinkItems(sources, { includeDisabled: false }).map((item) => item.id), [
      "react-current",
    ]);

    const summary = summarizeLowcodePreviewLinks(allItems);
    assert.deepEqual(summary, {
      total: 3,
      ready: 1,
      disabled: 2,
      statusText: "1 个可用 / 2 个不可用",
      readyTitles: ["当前草稿 React H5"],
    });
    assert.equal(summarizeLowcodePreviewLinks(createLowcodePreviewLinkItems(sources, { includeDisabled: false })).statusText, "1 个可用入口");
  });

  it("creates reusable workspace status summaries", () => {
    const schema = createLowcodePageSchema({
      pageId: "workspace_page",
      title: "工作区页面",
      nodes: [
        createLowcodeNode({
          id: "banner_1",
          componentName: "ImageBanner",
          materialVersion: "1.0.0",
          props: { imageUrl: "https://example.com/banner.jpg" },
        }),
      ],
    });

    assert.deepEqual(createLowcodeWorkspaceStats(schema, {
      selectedTitle: "图片 Banner",
      validationValid: true,
      publishCheckSummary: { pass: 5, warning: 0, error: 0 },
      dirty: false,
    }), [
      { id: "nodes", label: "节点", value: "1 个", tone: "neutral" },
      { id: "selected", label: "选中", value: "图片 Banner", tone: "success" },
      { id: "validation", label: "校验", value: "通过", tone: "success" },
      { id: "publish", label: "发布", value: "可预览", tone: "success" },
      { id: "save", label: "保存", value: "已保存", tone: "success" },
    ]);

    const warningStats = createLowcodeWorkspaceStats(schema, {
      validationValid: false,
      publishCheckSummary: { pass: 3, warning: 2, error: 0 },
      dirty: true,
      nodeCount: 9,
    });
    assert.deepEqual(warningStats, [
      { id: "nodes", label: "节点", value: "9 个", tone: "neutral" },
      { id: "selected", label: "选中", value: "未选择", tone: "neutral" },
      { id: "validation", label: "校验", value: "异常", tone: "danger" },
      { id: "publish", label: "发布", value: "2 个提醒", tone: "warning" },
      { id: "save", label: "保存", value: "未保存", tone: "warning" },
    ]);

    assert.deepEqual(createLowcodeWorkspaceStats(schema, {
      publishCheckSummary: { pass: 1, warning: 4, error: 3 },
    }).find((item) => item.id === "publish"), {
      id: "publish",
      label: "发布",
      value: "3 个错误",
      tone: "danger",
    });
    assert.deepEqual(createLowcodeWorkspaceStats(schema).find((item) => item.id === "publish"), {
      id: "publish",
      label: "发布",
      value: "未检查",
      tone: "neutral",
    });
  });

  it("creates reusable material catalog items, categories and filters", () => {
    const entries = manifests.map((manifest) => ({ manifest }));
    const actionButton = manifests.find((manifest) => manifest.componentName === "ActionButton");
    assert.ok(actionButton);

    const catalogItem = createLowcodeMaterialCatalogItem(actionButton);
    assert.equal(catalogItem.componentName, "ActionButton");
    assert.equal(catalogItem.title, "行动按钮");
    assert.equal(catalogItem.category, "basic");
    assert.equal(catalogItem.propCount, 1);
    assert.equal(catalogItem.eventCount, 1);
    assert.equal(catalogItem.dataSourceSlotCount, 0);
    assert.equal(catalogItem.summary, "1 个配置 / 1 个事件 / 0 个数据槽");
    assert.ok(catalogItem.searchText.includes("actionbutton"));
    assert.ok(catalogItem.searchText.includes("h5"));
    assert.equal(formatLowcodeMaterialCatalogSummary(actionButton), catalogItem.summary);

    assert.deepEqual(createLowcodeMaterialCategories(manifests), ["全部", "marketing", "commerce", "basic"]);
    assert.deepEqual(filterLowcodeMaterialCatalog(entries, { category: "commerce" }).map((item) => item.manifest.componentName), [
      "ProductList",
      "ProductRankList",
    ]);
    assert.deepEqual(filterLowcodeMaterialCatalog(entries, { keyword: "榜单" }).map((item) => item.manifest.componentName), [
      "ProductRankList",
    ]);
    assert.deepEqual(filterLowcodeMaterialCatalog(entries, { keyword: "1.0.0 h5", category: "basic" }).map((item) => item.manifest.componentName), [
      "ActionButton",
    ]);
    assert.deepEqual(pickLowcodeMaterialEntriesByComponentNames(entries, ["ActionButton", "Missing", "ImageBanner"]).map((item) => item.manifest.componentName), [
      "ActionButton",
      "ImageBanner",
    ]);
  });

  it("normalizes reusable material preference models", () => {
    const availableComponentNames = manifests.map((manifest) => manifest.componentName);
    const actionButton = manifests.find((manifest) => manifest.componentName === "ActionButton");
    assert.ok(actionButton);

    assert.equal(LOWCODE_EDITOR_RECENT_MATERIAL_DEFAULT_LIMIT, 6);
    assert.deepEqual(normalizeLowcodeMaterialComponentNames([
      "ActionButton",
      "Missing",
      "ImageBanner",
      "ActionButton",
      "",
      "ProductList",
    ], {
      availableComponentNames,
      limit: 2,
    }), ["ActionButton", "ImageBanner"]);
    assert.deepEqual(normalizeLowcodeMaterialComponentNames(["ActionButton"], { limit: 0 }), []);
    assert.deepEqual(parseLowcodeMaterialPreferenceContent(
      JSON.stringify(["ProductList", "Missing", "ProductList", 1, "ActionButton"]),
      { availableComponentNames },
    ), ["ProductList", "ActionButton"]);
    assert.deepEqual(parseLowcodeMaterialPreferenceContent("{bad json", { availableComponentNames }), []);
    assert.deepEqual(parseLowcodeMaterialPreferenceContent(JSON.stringify({ componentName: "ActionButton" })), []);
    assert.equal(isLowcodeFavoriteMaterial(["ActionButton"], "ActionButton"), true);
    assert.equal(isLowcodeFavoriteMaterial(["ActionButton"], "ImageBanner"), false);
    assert.deepEqual(toggleLowcodeFavoriteMaterial(["ImageBanner"], "ActionButton", {
      availableComponentNames,
    }), ["ActionButton", "ImageBanner"]);
    assert.deepEqual(toggleLowcodeFavoriteMaterial(["ActionButton", "ImageBanner"], "ActionButton", {
      availableComponentNames,
    }), ["ImageBanner"]);

    const fullRecent = recordLowcodeRecentMaterial([
      "ImageBanner",
      "ProductList",
      "ProductRankList",
      "ActionButton",
      "Missing",
      "ImageBanner",
    ], "ActionButton", {
      availableComponentNames,
      limit: 3,
    });
    assert.deepEqual(fullRecent, ["ActionButton", "ImageBanner", "ProductList"]);
    assert.deepEqual(recordLowcodeRecentMaterial(["ImageBanner"], "Missing", {
      availableComponentNames,
    }), ["ImageBanner"]);
    assert.equal(createLowcodeMaterialFavoriteMessage(actionButton, true), "已收藏物料：行动按钮");
    assert.equal(createLowcodeMaterialFavoriteMessage(actionButton, false), "已取消收藏：行动按钮");
  });

  it("creates reusable material detail models and preview schemas", () => {
    const material = createMaterialManifest({
      componentName: "ProductShowcase",
      materialVersion: "1.2.0",
      title: "商品橱窗",
      category: "commerce",
      platforms: ["h5"],
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", required: true, defaultValue: "精选商品" },
        items: { label: "商品", type: "array", setter: "textarea", defaultValue: [] },
      },
      defaultProps: { title: "精选商品", items: [] },
      events: [{ name: "productClick", title: "点击商品", description: "点击商品卡片时触发。" }],
      dataSourceSlots: [{ name: "items", acceptedTypes: ["mock.products", "http"], required: true }],
    });

    const summary = createLowcodeMaterialDetailSummary(material);
    const propEntries = createLowcodeMaterialDetailPropEntries(material);
    const eventItems = createLowcodeMaterialDetailEventItems(material);
    const slotItems = createLowcodeMaterialDetailDataSourceSlotItems(material);
    const nodeInput = createLowcodeMaterialNodeInput(material, {
      dataBindingBySlotName: { items: "products" },
    });
    const previewSchema = createLowcodeMaterialPreviewSchema(material, {
      dataSources: [{ id: "products", type: "mock.products", bindTo: "products" }],
      actions: [{ id: "track_product", type: "tracking.click", params: { eventName: "product_click" } }],
      environment: "test",
      operator: "tester",
      dataBindingByComponentName: { ProductShowcase: { items: "products" } },
    });

    assert.deepEqual(summary, {
      componentName: "ProductShowcase",
      title: "商品橱窗",
      category: "commerce",
      materialVersion: "1.2.0",
      platforms: ["h5"],
      platformText: "h5",
      propCount: 2,
      eventCount: 1,
      dataSourceSlotCount: 1,
      summary: "2 个配置 / 1 个事件 / 1 个数据槽",
    });
    assert.deepEqual(propEntries.map((entry) => ({
      name: entry.name,
      label: entry.label,
      type: entry.type,
      setter: entry.setter,
      required: entry.required,
    })), [
      { name: "title", label: "标题", type: "string", setter: "input", required: true },
      { name: "items", label: "商品", type: "array", setter: "textarea", required: false },
    ]);
    assert.deepEqual(eventItems[0], {
      name: "productClick",
      title: "点击商品",
      description: "点击商品卡片时触发。",
      event: material.events[0],
    });
    assert.deepEqual(slotItems[0], {
      name: "items",
      acceptedTypes: ["mock.products", "http"],
      acceptedTypesText: "mock.products, http",
      required: true,
      slot: material.dataSourceSlots[0],
    });
    assert.equal(nodeInput.componentName, "ProductShowcase");
    assert.deepEqual(nodeInput.props, { title: "精选商品", items: [] });
    assert.deepEqual(nodeInput.dataBinding, { items: "products" });
    assert.equal(previewSchema.pageId, "material-preview-ProductShowcase");
    assert.equal(previewSchema.title, "商品橱窗 默认预览");
    assert.equal(previewSchema.publishMeta.environment, "test");
    assert.equal(previewSchema.publishMeta.operator, "tester");
    assert.deepEqual(previewSchema.nodes[0].dataBinding, { items: "products" });
    assert.equal(previewSchema.nodes[0].id, "preview_ProductShowcase");
    assert.equal(previewSchema.dataSources?.[0].id, "products");
    assert.equal(previewSchema.actions?.[0].id, "track_product");
  });

  it("filters and groups reusable editor commands", () => {
    const commands = [
      {
        id: "save-draft",
        title: "保存草稿",
        group: "常用操作",
        description: "保存当前页面到本地 mock 配置平台。",
        keywords: ["save", "draft", "草稿"],
      },
      {
        id: "publish-page",
        title: "发布当前页面",
        group: "常用操作",
        description: "通过发布检查后生成 published release。",
        keywords: ["publish", "发布", "上线"],
        disabled: true,
      },
      {
        id: "mode-design",
        title: "切换到设计模式",
        group: "视图",
        description: "回到可拖拽和可选中节点的画布。",
        keywords: ["design", "设计", "画布"],
      },
      {
        id: "material-brand",
        title: "添加物料：品牌专题",
        group: "物料",
        description: "commerce / BrandFeatureSection",
        keywords: ["品牌专题", "BrandFeatureSection", "commerce"],
      },
    ];

    const manyCommands = Array.from({ length: LOWCODE_EDITOR_COMMAND_DEFAULT_LIMIT + 4 }, (_, index) => ({
      id: `command-${index}`,
      title: `命令 ${index}`,
      group: "批量",
      description: "用于测试默认展示数量。",
      keywords: [`cmd-${index}`],
    }));

    assert.ok(createLowcodeEditorCommandSearchText(commands[3]).includes("brandfeaturesection"));
    assert.deepEqual(filterLowcodeEditorCommands(commands, { keyword: "published release" }).map((item) => item.id), [
      "publish-page",
    ]);
    assert.deepEqual(filterLowcodeEditorCommands(commands, { keyword: "BrandFeatureSection" }).map((item) => item.id), [
      "material-brand",
    ]);
    assert.deepEqual(filterLowcodeEditorCommands(commands, { keyword: "发布" }).map((item) => item.id), [
      "publish-page",
    ]);
    assert.deepEqual(filterLowcodeEditorCommands(commands, { keyword: "发布", includeDisabled: false }).map((item) => item.id), []);
    assert.equal(filterLowcodeEditorCommands(manyCommands).length, LOWCODE_EDITOR_COMMAND_DEFAULT_LIMIT);
    assert.deepEqual(filterLowcodeEditorCommands(manyCommands, { limit: 2 }).map((item) => item.id), [
      "command-0",
      "command-1",
    ]);
    assert.deepEqual(groupLowcodeEditorCommands(commands), [
      { group: "常用操作", items: [commands[0], commands[1]] },
      { group: "视图", items: [commands[2]] },
      { group: "物料", items: [commands[3]] },
    ]);
  });

  it("creates reusable editor permission state", () => {
    const defaultState = createLowcodeEditorPermissionState();
    assert.deepEqual(Object.keys(defaultState), [...LOWCODE_EDITOR_PERMISSION_ACTIONS]);
    assert.equal(isLowcodeEditorActionAllowed(defaultState, "draft.save"), true);
    assert.equal(getLowcodeEditorActionDisabledReason(defaultState, "draft.save"), undefined);

    const deniedState = createLowcodeEditorPermissionState({
      decisions: {
        "publish.submit": {
          allowed: false,
          reason: "当前账号没有发布权限。",
        },
      },
    });
    assert.equal(isLowcodeEditorActionAllowed(deniedState, "publish.submit"), false);
    assert.equal(getLowcodeEditorActionDisabledReason(deniedState, "publish.submit"), "当前账号没有发布权限。");
    assert.equal(isLowcodeEditorActionAllowed(deniedState, "schema.export"), true);

    const readonlyState = createLowcodeEditorPermissionState({
      readonly: true,
      readonlyReason: "审批中页面暂不可编辑。",
      decisions: {
        "draft.save": {
          allowed: true,
          reason: "宿主误传允许保存也应被只读基线拦截。",
        },
      },
    });
    LOWCODE_EDITOR_MUTATING_PERMISSION_ACTIONS.forEach((action) => {
      assert.equal(isLowcodeEditorActionAllowed(readonlyState, action), false);
    });
    assert.equal(getLowcodeEditorActionDisabledReason(readonlyState, "draft.save"), "审批中页面暂不可编辑。");
    assert.equal(isLowcodeEditorActionAllowed(readonlyState, "schema.export"), true);
    assert.equal(isLowcodeEditorActionAllowed(readonlyState, "runtime.open"), true);
    assert.equal(isLowcodeEditorActionAllowed(readonlyState, "node.copy"), true);
  });

  it("creates reusable node operation models and shortcuts", () => {
    const items = createLowcodeNodeOperationItems({
      canInsert: false,
      canAddInside: true,
      canMoveUp: false,
      canMoveDown: true,
      canRename: false,
      canCopy: false,
      canPaste: false,
      canDuplicate: false,
      canDelete: false,
    });
    const itemByAction = new Map(items.map((item) => [item.action, item]));

    assert.deepEqual(items.map((item) => item.action), [
      "rename",
      "insertBefore",
      "insertAfter",
      "addInside",
      "moveUp",
      "moveDown",
      "copy",
      "paste",
      "duplicate",
      "delete",
    ]);
    assert.equal(itemByAction.get("rename")?.disabled, true);
    assert.equal(itemByAction.get("insertBefore")?.disabled, true);
    assert.equal(itemByAction.get("insertAfter")?.disabled, true);
    assert.equal(itemByAction.get("addInside")?.disabled, false);
    assert.equal(itemByAction.get("moveUp")?.disabled, true);
    assert.equal(itemByAction.get("moveDown")?.disabled, false);
    assert.equal(itemByAction.get("copy")?.disabled, true);
    assert.equal(itemByAction.get("paste")?.disabled, true);
    assert.equal(itemByAction.get("duplicate")?.disabled, true);
    assert.equal(itemByAction.get("delete")?.disabled, true);
    assert.equal(itemByAction.get("delete")?.danger, true);
    assert.equal(itemByAction.get("copy")?.shortcut, "⌘/Ctrl C");
    assert.equal(createLowcodeNodeOperationItems().find((item) => item.action === "delete")?.disabled, false);
    assert.equal(resolveLowcodeNodeShortcutAction({ key: "Delete" }, { hasSelectedNode: true }), "delete");
    assert.equal(resolveLowcodeNodeShortcutAction({ key: "Backspace" }, { hasSelectedNode: false }), undefined);
    assert.equal(resolveLowcodeNodeShortcutAction({ key: "c", metaKey: true }, { hasSelectedNode: true }), "copy");
    assert.equal(resolveLowcodeNodeShortcutAction({ key: "v", ctrlKey: true }, { canPaste: true }), "paste");
    assert.equal(resolveLowcodeNodeShortcutAction({ key: "d", metaKey: true }, { hasSelectedNode: true }), "duplicate");
    assert.equal(resolveLowcodeNodeShortcutAction({ key: "z", metaKey: true }), "undo");
    assert.equal(resolveLowcodeNodeShortcutAction({ key: "z", metaKey: true, shiftKey: true }), "redo");
    assert.equal(resolveLowcodeNodeShortcutAction({ key: "y", ctrlKey: true }), "redo");
    assert.equal(resolveLowcodeNodeShortcutAction({ key: "x", ctrlKey: true }, { hasSelectedNode: true }), undefined);
    assert.equal(createLowcodeNodeOperationMessage("delete", { nodeTitle: "首屏主图" }), "已删除节点：首屏主图");
    assert.equal(createLowcodeNodeOperationMessage("insertAfter", { materialTitle: "图片 Banner" }), "已在后方插入物料：图片 Banner");
    assert.equal(createLowcodeNodeOperationMessage("redo"), "已重做上一步操作");
  });

  it("creates reusable outline rows and visibility state", () => {
    const schema = createLowcodePageSchema({
      pageId: "outline_page",
      title: "结构树页面",
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
              meta: { name: "首屏主图" },
            }),
            createLowcodeNode({
              id: "products_1",
              componentName: "ProductList",
              materialVersion: "1.0.0",
              props: { items: [] },
            }),
          ],
        }),
        createLowcodeNode({
          id: "button_1",
          componentName: "ActionButton",
          materialVersion: "1.0.0",
          props: { text: "立即查看" },
        }),
      ],
    });
    const rows = createLowcodeOutlineRows(schema.nodes, {
      materialManifests: [
        ...manifests,
        createMaterialManifest({
          componentName: "SectionContainer",
          materialVersion: "1.0.0",
          title: "内容容器",
          category: "layout",
          platforms: ["h5"],
          propsSchema: {},
          defaultProps: {},
        }),
      ],
    });

    assert.equal(rows.length, 4);
    assert.equal(rows[0].node.id, "container_1");
    assert.equal(rows[0].depth, 0);
    assert.equal(rows[0].hasChildren, true);
    assert.equal(rows[1].node.id, "banner_1");
    assert.equal(rows[1].depth, 1);
    assert.equal(rows[1].parentId, "container_1");
    assert.deepEqual(rows[1].ancestorIds, ["container_1"]);
    assert.equal(rows[1].title, "首屏主图");
    assert.equal(rows[1].subtitle, "图片 Banner / banner_1");
    assert.ok(createLowcodeOutlineRowSearchText(rows[1]).includes("imagebanner"));

    const searchVisibility = createLowcodeOutlineVisibility(rows, { keyword: "marketing" });
    assert.deepEqual(searchVisibility.matchedNodeIds, ["banner_1"]);
    assert.deepEqual(searchVisibility.visibleNodeIds, ["banner_1", "container_1"]);
    assert.deepEqual(searchVisibility.rows.map((row) => row.node.id), ["container_1", "banner_1"]);
    assert.equal(searchVisibility.summary, "2 / 4");

    const collapsedVisibility = createLowcodeOutlineVisibility(rows, {
      collapsedNodeIds: ["container_1"],
      selectedNodeId: "products_1",
    });
    assert.deepEqual(collapsedVisibility.selectedPathNodeIds, ["container_1", "products_1"]);
    assert.deepEqual(collapsedVisibility.rows.map((row) => row.node.id), ["container_1", "products_1", "button_1"]);
    assert.equal(collapsedVisibility.summary, "3 / 4");

    assert.deepEqual(pruneLowcodeOutlineCollapsedNodeIds(["container_1", "banner_1", "missing"], rows), ["container_1"]);
    assert.deepEqual(revealLowcodeOutlineNode("products_1", ["container_1"], rows), []);
    assert.deepEqual(revealLowcodeOutlineNode("button_1", ["container_1"], rows), ["container_1"]);
  });

  it("creates reusable node selection models", () => {
    const rows = [
      { node: { id: "container_1" }, parentId: undefined, index: 0 },
      { node: { id: "banner_1" }, parentId: "container_1", index: 0 },
      { node: { id: "products_1" }, parentId: "container_1", index: 1 },
      { node: { id: "button_1" }, parentId: undefined, index: 1 },
    ];

    assert.deepEqual(toggleLowcodeNodeSelection(["banner_1"], "products_1"), ["banner_1", "products_1"]);
    assert.deepEqual(toggleLowcodeNodeSelection(["banner_1"], "banner_1"), ["banner_1"]);
    assert.deepEqual(pruneLowcodeNodeSelection(["missing", "products_1"], rows.map((row) => row.node.id)), ["products_1"]);
    assert.deepEqual(pruneLowcodeNodeSelection(["missing"], rows.map((row) => row.node.id), {
      activeNodeId: "button_1",
    }), ["button_1"]);
    assert.deepEqual(pickLowcodeSelectedOutlineRows(rows, ["products_1", "banner_1"]).map((row) => row.node.id), [
      "banner_1",
      "products_1",
    ]);
    assert.equal(hasLowcodeSameParentSelection(rows.slice(1, 3)), true);
    assert.equal(hasLowcodeSameParentSelection([rows[1], rows[3]]), false);
    assert.equal(createLowcodeNodeSelectionSummary(rows.slice(1, 3)), "已多选 2 个同层节点，可成组拖拽");
    assert.equal(createLowcodeNodeSelectionSummary([rows[1], rows[3]]), "已多选 2 个节点，跨层级时拖动单节点");

    const model = createLowcodeNodeSelectionModel(rows, ["products_1", "banner_1"]);
    assert.deepEqual(model.selectedNodeIds, ["banner_1", "products_1"]);
    assert.equal(model.count, 2);
    assert.equal(model.sameParent, true);
    assert.equal(model.summary, "已多选 2 个同层节点，可成组拖拽");
    assert.equal(isLowcodeNodeSelected(model.selectedNodeIds, "banner_1"), true);
    assert.equal(canLowcodeDragSelectedGroup(rows, model.selectedNodeIds, "banner_1"), true);
    assert.equal(canLowcodeDragSelectedGroup(rows, ["banner_1", "button_1"], "banner_1"), false);
    assert.deepEqual(getLowcodeSelectedGroupNodeIdsForDrag(rows, ["products_1", "banner_1"], "products_1"), [
      "banner_1",
      "products_1",
    ]);
    assert.deepEqual(getLowcodeSelectedGroupNodeIdsForDrag(rows, ["banner_1", "button_1"], "button_1"), ["button_1"]);
  });

  it("creates reusable canvas drop hint models", () => {
    const frame = {
      top: 100,
      left: 20,
      scrollTop: 40,
      scrollLeft: 5,
      clientWidth: 390,
      clientHeight: 600,
      scrollHeight: 820,
    };
    const targetRect = { top: 150, left: 30, width: 320, height: 100 };
    const containerNode = createLowcodeNode({
      id: "container_1",
      componentName: "SectionContainer",
      materialVersion: "1.0.0",
      props: {},
      children: [
        createLowcodeNode({
          id: "banner_1",
          componentName: "ImageBanner",
          materialVersion: "1.0.0",
          props: {},
        }),
      ],
    });
    const buttonNode = createLowcodeNode({
      id: "button_1",
      componentName: "ActionButton",
      materialVersion: "1.0.0",
      props: {},
    });

    assert.equal(resolveLowcodeCanvasDropPlacement({ clientY: 160 }, buttonNode, targetRect), "before");
    assert.equal(resolveLowcodeCanvasDropPlacement({ clientY: 230 }, buttonNode, targetRect), "after");
    assert.equal(resolveLowcodeCanvasDropPlacement({ clientY: 200 }, containerNode, targetRect), "inside");
    assert.equal(resolveLowcodeCanvasDropPlacement({ clientY: 200 }, containerNode, targetRect, {
      insideComponentNames: ["CustomContainer"],
    }), "after");

    assert.deepEqual(createLowcodeCanvasDropHintStyle(frame, targetRect, "inside"), {
      top: "90px",
      left: "15px",
      width: "320px",
      height: "100px",
    });
    assert.deepEqual(createLowcodeCanvasDropHintStyle(frame, targetRect, "after"), {
      top: "190px",
      left: "15px",
      width: "320px",
    });

    assert.deepEqual(createLowcodeCanvasSnapGuides(frame, targetRect, "before"), [
      { axis: "y", label: "吸附到上边缘", style: { top: "90px", left: "0px", width: "390px" } },
      { axis: "x", label: "目标中心", style: { top: "0px", left: "175px", height: "820px" } },
    ]);
    assert.deepEqual(createLowcodeCanvasSnapGuides(frame, targetRect, "inside"), [
      { axis: "y", label: "容器中心", style: { top: "140px", left: "0px", width: "390px" } },
      { axis: "x", label: "容器中心", style: { top: "0px", left: "175px", height: "820px" } },
    ]);

    assert.deepEqual(createLowcodeCanvasAppendDropHint("material"), {
      source: "material",
      placement: "append",
      targetTitle: "页面末尾",
      style: {},
      guides: [],
    });
    assert.deepEqual(createLowcodeCanvasTargetDropHint({
      source: "node",
      placement: "inside",
      targetNodeId: "container_1",
      targetTitle: "容器",
      frame,
      targetRect,
    }), {
      source: "node",
      placement: "inside",
      targetNodeId: "container_1",
      targetTitle: "容器",
      style: { top: "90px", left: "15px", width: "320px", height: "100px" },
      guides: [
        { axis: "y", label: "容器中心", style: { top: "140px", left: "0px", width: "390px" } },
        { axis: "x", label: "容器中心", style: { top: "0px", left: "175px", height: "820px" } },
      ],
    });

    assert.equal(isLowcodeInvalidNodeDropTarget([containerNode, buttonNode], "container_1", "container_1"), true);
    assert.equal(isLowcodeInvalidNodeDropTarget([containerNode, buttonNode], "container_1", "banner_1"), true);
    assert.equal(isLowcodeInvalidNodeDropTarget([containerNode, buttonNode], "banner_1", "button_1"), false);
    assert.equal(isLowcodeInvalidNodeDropTarget([containerNode, buttonNode], "banner_1", undefined), false);
  });

  it("creates reusable canvas drop target models", () => {
    const rows = [
      {
        node: createLowcodeNode({
          id: "container_1",
          componentName: "SectionContainer",
          materialVersion: "1.0.0",
          props: {},
          children: [
            createLowcodeNode({
              id: "banner_1",
              componentName: "ImageBanner",
              materialVersion: "1.0.0",
              props: {},
            }),
            createLowcodeNode({
              id: "products_1",
              componentName: "ProductList",
              materialVersion: "1.0.0",
              props: {},
            }),
          ],
        }),
        parentId: undefined,
        index: 0,
      },
      {
        node: createLowcodeNode({
          id: "banner_1",
          componentName: "ImageBanner",
          materialVersion: "1.0.0",
          props: {},
        }),
        parentId: "container_1",
        index: 0,
      },
      {
        node: createLowcodeNode({
          id: "products_1",
          componentName: "ProductList",
          materialVersion: "1.0.0",
          props: {},
        }),
        parentId: "container_1",
        index: 1,
      },
      {
        node: createLowcodeNode({
          id: "button_1",
          componentName: "ActionButton",
          materialVersion: "1.0.0",
          props: {},
        }),
        parentId: undefined,
        index: 1,
      },
    ];

    assert.deepEqual(createLowcodeCanvasDropTarget(rows, { placement: "append" }, 2), {
      parentId: undefined,
      index: 2,
    });

    const insideTarget = createLowcodeCanvasDropTarget(rows, {
      placement: "inside",
      targetNodeId: "container_1",
    }, 2);
    assert.equal(insideTarget?.parentId, "container_1");
    assert.equal(insideTarget?.index, 2);
    assert.equal(insideTarget?.targetRow?.node.id, "container_1");

    const afterTarget = createLowcodeCanvasDropTarget(rows, {
      placement: "after",
      targetNodeId: "banner_1",
    }, 2);
    assert.equal(afterTarget?.parentId, "container_1");
    assert.equal(afterTarget?.index, 1);
    assert.equal(afterTarget?.targetRow?.node.id, "banner_1");

    const sameParentMoveTarget = createLowcodeCanvasNodeMoveTarget(rows, {
      placement: "after",
      targetNodeId: "products_1",
    }, "banner_1", 2);
    assert.equal(sameParentMoveTarget?.parentId, "container_1");
    assert.equal(sameParentMoveTarget?.index, 1);

    const crossParentMoveTarget = createLowcodeCanvasNodeMoveTarget(rows, {
      placement: "before",
      targetNodeId: "button_1",
    }, "banner_1", 2);
    assert.equal(crossParentMoveTarget?.parentId, undefined);
    assert.equal(crossParentMoveTarget?.index, 1);

    const groupTarget = createLowcodeCanvasGroupMoveTarget(rows, {
      placement: "after",
      targetNodeId: "button_1",
    }, ["banner_1", "products_1"], 2);
    assert.equal(groupTarget?.parentId, undefined);
    assert.equal(groupTarget?.index, 2);

    const sameParentGroupTarget = createLowcodeCanvasGroupMoveTarget(rows, {
      placement: "after",
      targetNodeId: "products_1",
    }, ["banner_1", "products_1"], 2);
    assert.equal(sameParentGroupTarget?.parentId, "container_1");
    assert.equal(sameParentGroupTarget?.index, 2);

    assert.equal(createLowcodeCanvasDropTarget(rows, { placement: "before", targetNodeId: "missing" }, 2), undefined);
    assert.equal(createLowcodeCanvasNodeMoveTarget(rows, { placement: "before", targetNodeId: "button_1" }, "missing", 2), undefined);
    assert.equal(createLowcodeCanvasGroupMoveTarget(rows, { placement: "after", targetNodeId: "button_1" }, ["banner_1", "button_1"], 2), undefined);
  });

  it("applies reusable canvas operations to editor state", () => {
    function createState() {
      return createEditorState(createLowcodePageSchema({
        pageId: "canvas_operation_page",
        title: "画布操作页面",
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
                props: {},
              }),
              createLowcodeNode({
                id: "products_1",
                componentName: "ProductList",
                materialVersion: "1.0.0",
                props: {},
              }),
            ],
          }),
          createLowcodeNode({
            id: "button_1",
            componentName: "ActionButton",
            materialVersion: "1.0.0",
            props: {},
          }),
        ],
      }));
    }

    let state = createState();
    let result = insertLowcodeCanvasNodeByHint(
      state,
      createLowcodeOutlineRows(state.schema.nodes),
      { placement: "after", targetNodeId: "banner_1" },
      {
        id: "notice_1",
        componentName: "NoticeBar",
        materialVersion: "1.0.0",
        props: {},
      },
    );
    assert.equal(result.handled, true);
    assert.equal(result.changed, true);
    assert.equal(result.state.selectedNodeId, "notice_1");
    assert.equal(result.state.lastAction, "insertNode");
    assert.deepEqual(result.state.schema.nodes[0].children.map((node) => node.id), ["banner_1", "notice_1", "products_1"]);

    state = createState();
    result = moveLowcodeCanvasNodeByHint(
      state,
      createLowcodeOutlineRows(state.schema.nodes),
      { placement: "after", targetNodeId: "products_1" },
      "banner_1",
    );
    assert.equal(result.handled, true);
    assert.equal(result.changed, true);
    assert.equal(result.state.selectedNodeId, "banner_1");
    assert.deepEqual(result.state.schema.nodes[0].children.map((node) => node.id), ["products_1", "banner_1"]);

    state = createState();
    result = moveLowcodeCanvasNodeByHint(
      state,
      createLowcodeOutlineRows(state.schema.nodes),
      { placement: "inside", targetNodeId: "banner_1" },
      "container_1",
    );
    assert.equal(result.handled, true);
    assert.equal(result.changed, false);
    assert.equal(result.state, state);

    state = createState();
    result = moveLowcodeCanvasNodeGroupByHint(
      state,
      createLowcodeOutlineRows(state.schema.nodes),
      { placement: "after", targetNodeId: "button_1" },
      ["banner_1", "products_1"],
    );
    assert.equal(result.handled, true);
    assert.equal(result.changed, true);
    assert.equal(result.state.selectedNodeId, "banner_1");
    assert.deepEqual(result.state.schema.nodes.map((node) => node.id), ["container_1", "button_1", "banner_1", "products_1"]);
    assert.deepEqual(result.state.schema.nodes[0].children, []);

    state = createState();
    result = moveLowcodeCanvasNodeGroupByHint(
      state,
      createLowcodeOutlineRows(state.schema.nodes),
      { placement: "after", targetNodeId: "products_1" },
      ["banner_1", "products_1"],
    );
    assert.equal(result.handled, true);
    assert.equal(result.changed, false);
    assert.equal(result.state, state);

    state = createState();
    result = moveLowcodeCanvasNodeGroupByHint(
      state,
      createLowcodeOutlineRows(state.schema.nodes),
      { placement: "after", targetNodeId: "button_1" },
      ["banner_1", "button_1"],
    );
    assert.equal(result.handled, false);
    assert.equal(result.changed, false);
    assert.equal(result.state, state);
  });

  it("creates reusable property groups and collapsed state", () => {
    const propsSchema = {
      title: { label: "标题", type: "string", setter: "input", defaultValue: "" },
      backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff" },
      items: { label: "商品", type: "array", setter: "textarea", defaultValue: [] },
      sticky: { label: "吸顶", type: "boolean", setter: "switch", defaultValue: false },
      trackingCode: { label: "埋点扩展", type: "string", setter: "input", defaultValue: "" },
    };

    assert.deepEqual(LOWCODE_EDITOR_PROP_GROUP_ORDER, ["content", "style", "data", "behavior", "advanced"]);
    assert.equal(LOWCODE_EDITOR_PROP_GROUP_META.content.label, "内容配置");
    assert.equal(getLowcodePropGroupKey("title", propsSchema.title), "content");
    assert.equal(getLowcodePropGroupKey("coverImageUrl", { label: "图片", type: "string", setter: "image", defaultValue: "" }), "content");
    assert.equal(getLowcodePropGroupKey("backgroundColor", propsSchema.backgroundColor), "style");
    assert.equal(getLowcodePropGroupKey("items", propsSchema.items), "data");
    assert.equal(getLowcodePropGroupKey("products", { label: "数据源", type: "string", setter: "dataSourceSelector", defaultValue: "" }), "data");
    assert.equal(getLowcodePropGroupKey("sticky", propsSchema.sticky), "behavior");
    assert.equal(getLowcodePropGroupKey("trackingCode", propsSchema.trackingCode), "advanced");

    const groups = createLowcodePropGroups(propsSchema);
    assert.deepEqual(groups.map((group) => group.key), ["content", "style", "data", "behavior", "advanced"]);
    assert.deepEqual(groups.map((group) => group.entries.map((entry) => entry.name)), [
      ["title"],
      ["backgroundColor"],
      ["items"],
      ["sticky"],
      ["trackingCode"],
    ]);

    const customGroups = createLowcodePropGroups(propsSchema, {
      groupOrder: ["data", "content", "advanced"],
      groupMeta: { data: { label: "资源配置", description: "自定义资源说明。" } },
    });
    assert.deepEqual(customGroups.map((group) => group.key), ["data", "content", "advanced"]);
    assert.equal(customGroups[0].label, "资源配置");

    const collapsed = toggleLowcodePropGroupCollapsed({ advanced: true }, "content");
    assert.equal(isLowcodePropGroupCollapsed(collapsed, "content"), true);
    assert.equal(isLowcodePropGroupCollapsed(collapsed, "advanced"), true);
    assert.equal(isLowcodePropGroupCollapsed(toggleLowcodePropGroupCollapsed(collapsed, "content"), "content"), false);
  });

  it("creates reusable property editor field models and input values", () => {
    const textSchema = { label: "标题", type: "string", setter: "input", defaultValue: "" };
    const numberSchema = { label: "列数", type: "number", setter: "number", defaultValue: 2 };
    const colorSchema = { label: "颜色", type: "string", setter: "color", defaultValue: "#111827" };
    const switchSchema = { label: "开启", type: "boolean", setter: "switch", defaultValue: false };
    const textareaSchema = { label: "说明", type: "string", setter: "textarea", defaultValue: "" };
    const jsonSchema = { label: "样式", type: "object", setter: "textarea", defaultValue: {} };
    const listSchema = { label: "列表", type: "array", setter: "textarea", defaultValue: [] };

    assert.equal(getLowcodePropEditorControl(textSchema), "text");
    assert.equal(getLowcodePropEditorControl(numberSchema), "number");
    assert.equal(getLowcodePropEditorControl(colorSchema), "color");
    assert.equal(getLowcodePropEditorControl(switchSchema), "switch");
    assert.equal(getLowcodePropEditorControl(textareaSchema), "textarea");
    assert.equal(getLowcodePropEditorControl(jsonSchema), "json");
    assert.equal(getLowcodePropEditorControl(listSchema), "list");
    assert.equal(isLowcodeListPropEditor(listSchema), true);
    assert.equal(isLowcodeStructuredPropEditor(jsonSchema), true);

    assert.equal(LOWCODE_EDITOR_COMMON_LIST_FIELDS.imageUrl.label, "图片");
    const imageCardFields = createLowcodeListEditorFields("items", {
      componentName: "ImageCardGrid",
      items: [{ id: "card_1", title: "会场", coverImageUrl: "https://example.com/cover.jpg", customText: "扩展字段" }],
    });
    assert.deepEqual(imageCardFields.map((field) => field.name), [
      "id",
      "title",
      "subtitle",
      "badgeText",
      "imageUrl",
      "linkUrl",
      "coverImageUrl",
      "customText",
    ]);
    assert.equal(isLowcodeListImageField(imageCardFields.find((field) => field.name === "imageUrl")), true);
    assert.equal(isLowcodeListImageField("coverImageUrl"), true);
    assert.equal(isLowcodeListImageField("title"), false);

    assert.deepEqual(createLowcodeDefaultListItem("items", {
      componentName: "FloorAnchorNav",
      targetNodeId: "floor_1",
      id: "items_fixed",
    }), { id: "items_fixed", title: "新楼层", targetId: "floor_1" });
    assert.deepEqual(createLowcodeDefaultListItem("coupons", { id: "coupon_fixed" }), {
      id: "coupon_fixed",
      title: "满 199 减 30",
      thresholdText: "全场可用",
      valueText: "¥30",
      expireText: "领取后 7 天有效",
    });

    assert.equal(normalizeLowcodePropInputValue(numberSchema, "3"), 3);
    assert.equal(normalizeLowcodePropInputValue(numberSchema, "abc"), 0);
    assert.equal(normalizeLowcodePropInputValue(switchSchema, "false"), false);
    assert.deepEqual(normalizeLowcodePropInputValue(listSchema, "[{\"id\":\"item_1\"}]"), [{ id: "item_1" }]);
    assert.equal(normalizeLowcodePropInputValue(jsonSchema, "{bad json"), "{bad json");
    assert.equal(toLowcodePropInputBoolean("off"), false);
    assert.equal(toLowcodePropInputBoolean("yes"), true);
    assert.equal(toLowcodePropInputText({ title: "结构化" }).includes("\n  "), true);
    assert.equal(toLowcodePropInputText(undefined), "");
  });

  it("creates reusable event binding models and action ref helpers", () => {
    const actions = [
      { id: "go_home", type: "navigate", params: { url: "/" } },
      { id: "track_click", type: "tracking.click", params: { eventName: "tap_button" } },
    ];
    const events = [
      { name: "click", title: "点击", description: "点击按钮时触发" },
      { name: "exposure", title: "曝光" },
      { name: "submit", title: "提交" },
    ];
    const bindings = createLowcodeEventBindingItems(events, actions, {
      click: { actionId: "go_home" },
      submit: { actionId: "missing_action" },
    });

    assert.deepEqual(createLowcodeActionOptions(actions).map((action) => action.label), [
      "go_home / navigate",
      "track_click / tracking.click",
    ]);
    assert.equal(bindings[0].name, "click");
    assert.equal(bindings[0].actionId, "go_home");
    assert.equal(bindings[0].actionLabel, "go_home / navigate");
    assert.equal(bindings[0].bound, true);
    assert.equal(bindings[0].missingAction, false);
    assert.equal(bindings[1].actionId, "");
    assert.equal(bindings[1].actionLabel, "未绑定");
    assert.equal(bindings[1].bound, false);
    assert.equal(bindings[2].actionLabel, "缺失动作：missing_action");
    assert.equal(bindings[2].missingAction, true);

    const state = createEditorState(createLowcodePageSchema({
      pageId: "event_page",
      title: "事件页面",
      nodes: [
        createLowcodeNode({
          id: "container_1",
          componentName: "SectionContainer",
          materialVersion: "1.0.0",
          props: {},
          children: [
            createLowcodeNode({
              id: "button_1",
              componentName: "ActionButton",
              materialVersion: "1.0.0",
              props: { text: "去首页" },
            }),
          ],
        }),
      ],
      actions,
    }));

    const boundState = bindLowcodeNodeEvent(state, "button_1", "click", "go_home");
    assert.equal(boundState.lastAction, "bindNodeEvent");
    assert.equal(boundState.dirty, true);
    assert.equal(boundState.schema.nodes[0].children[0].events.click.actionId, "go_home");

    const unboundState = bindLowcodeNodeEvent(boundState, "button_1", "click", undefined);
    assert.equal(unboundState.schema.nodes[0].children[0].events, undefined);

    const renamedNodes = renameLowcodeActionRefsInNodes(boundState.schema.nodes, "go_home", "go_home_new");
    assert.equal(renamedNodes[0].children[0].events.click.actionId, "go_home_new");

    const cleanedNodes = removeLowcodeActionRefsFromNodes(boundState.schema.nodes, "go_home");
    assert.equal(cleanedNodes[0].children[0].events, undefined);
  });

  it("creates reusable page settings models and state helpers", () => {
    assert.deepEqual(LOWCODE_EDITOR_PAGE_TYPE_OPTIONS.map((option) => option.value), [
      "activity",
      "promotion",
      "topic",
      "landing",
      "custom",
    ]);
    assert.deepEqual(LOWCODE_EDITOR_PAGE_STATUS_OPTIONS.map((option) => option.value), [
      "draft",
      "preview",
      "published",
      "disabled",
    ]);
    assert.deepEqual(LOWCODE_EDITOR_PUBLISH_ENVIRONMENT_OPTIONS.map((option) => option.value), ["test", "pre", "prod"]);
    assert.equal(LOWCODE_EDITOR_PAGE_BACKGROUND_SWATCHES.includes("#f8fafc"), true);
    assert.equal(normalizeLowcodePageMaxWidth("430"), 430);
    assert.equal(normalizeLowcodePageMaxWidth("430.6"), 431);
    assert.equal(normalizeLowcodePageMaxWidth("319"), undefined);
    assert.equal(normalizeLowcodePageMaxWidth("961"), undefined);
    assert.equal(normalizeLowcodePageMaxWidth("abc"), undefined);

    const state = createEditorState(createLowcodePageSchema({
      pageId: "settings_page",
      title: "旧标题",
      description: "旧描述",
      status: "draft",
      pageType: "activity",
      layout: {
        backgroundColor: "#ffffff",
        safeArea: true,
        maxWidth: 390,
      },
      nodes: [],
      publishMeta: {
        environment: "test",
        operator: "tester",
      },
    }));

    const form = createLowcodePageSettingsForm(state.schema);
    assert.equal(form.pageId, "settings_page");
    assert.equal(form.title, "旧标题");
    assert.equal(form.description, "旧描述");
    assert.equal(form.pageType, "activity");
    assert.equal(form.status, "draft");
    assert.equal(form.publishEnvironment, "test");
    assert.equal(form.backgroundColor, "#ffffff");
    assert.equal(form.safeArea, true);
    assert.equal(form.maxWidth, 390);

    const titledState = updateLowcodePageTitle(state, "新标题");
    assert.equal(titledState.lastAction, "updatePageTitle");
    assert.equal(titledState.dirty, true);
    assert.equal(titledState.schema.title, "新标题");

    const describedState = updateLowcodePageDescription(titledState, "新描述");
    assert.equal(describedState.lastAction, "updatePageDescription");
    assert.equal(describedState.schema.description, "新描述");

    const typedState = updateLowcodePageType(describedState, "topic");
    assert.equal(typedState.lastAction, "updatePageType");
    assert.equal(typedState.schema.pageType, "topic");

    const statusState = updateLowcodePageStatus(typedState, "preview");
    assert.equal(statusState.lastAction, "updatePageStatus");
    assert.equal(statusState.schema.status, "preview");

    const environmentState = updateLowcodePublishEnvironment(statusState, "pre");
    assert.equal(environmentState.lastAction, "updatePublishEnvironment");
    assert.equal(environmentState.schema.publishMeta.environment, "pre");
    assert.equal(environmentState.schema.publishMeta.operator, "tester");

    const colorState = updateLowcodePageBackgroundColor(environmentState, "#f8fafc");
    assert.equal(colorState.lastAction, "updatePageBackgroundColor");
    assert.equal(colorState.schema.layout.backgroundColor, "#f8fafc");

    const safeAreaState = updateLowcodePageSafeArea(colorState, false);
    assert.equal(safeAreaState.lastAction, "updatePageSafeArea");
    assert.equal(safeAreaState.schema.layout.safeArea, false);

    const invalidWidthState = updateLowcodePageMaxWidth(safeAreaState, "1200");
    assert.equal(invalidWidthState, safeAreaState);

    const widthState = updateLowcodePageMaxWidth(safeAreaState, "430");
    assert.equal(widthState.lastAction, "updatePageMaxWidth");
    assert.equal(widthState.schema.layout.maxWidth, 430);
  });

  it("creates reusable data source config models and state helpers", () => {
    assert.deepEqual(LOWCODE_EDITOR_DEFAULT_DATA_SOURCE_TYPE_OPTIONS.map((option) => option.label), [
      "活动商品",
      "指定商品",
      "指定门店",
      "活动达人",
      "自定义接口",
    ]);
    assert.deepEqual(createLowcodeDefaultDataSourceParams("product.byActivity"), {
      activityId: "activity_demo",
      limit: 6,
    });
    assert.deepEqual(createLowcodeDefaultDataSourceParams("unknown.source"), {});

    const createdDataSource = createLowcodeDataSourceConfig("store.byIds", {
      id: "stores",
      now: new Date("2026-08-01T00:00:00.000Z"),
    });
    assert.deepEqual(createdDataSource, {
      id: "stores",
      type: "store.byIds",
      bindTo: "stores",
      params: { ids: [], limit: 4 },
      cache: { ttlSeconds: 120, scope: "public" },
    });
    assert.equal(formatLowcodeDataSourceParamsText(createdDataSource), "{\n  \"ids\": [],\n  \"limit\": 4\n}");
    assert.equal(formatLowcodeDataSourceRecordLabel(undefined, "解析中"), "解析中");
    assert.equal(formatLowcodeDataSourceRecordLabel({ id: "stores", status: "resolved", bindTo: "stores" }), "已绑定到 stores");
    assert.equal(formatLowcodeDataSourceRecordLabel({ id: "stores", status: "error" }), "解析失败");

    const formItems = createLowcodeDataSourceFormItems([createdDataSource], {
      records: [{ id: "stores", status: "resolved", bindTo: "stores" }],
    });
    assert.equal(formItems[0].id, "stores");
    assert.equal(formItems[0].typeLabel, "指定门店");
    assert.equal(formItems[0].bindTo, "stores");
    assert.equal(formItems[0].status, "resolved");
    assert.equal(formItems[0].statusText, "已绑定到 stores");
    assert.equal(formItems[0].statusDescription, "store.byIds / stores");
    assert.equal(formItems[0].paramsText.includes("\"limit\": 4"), true);

    const upsertedNew = upsertLowcodeDataSourceConfigs([], createdDataSource);
    assert.equal(upsertedNew.length, 1);
    const upsertedExisting = upsertLowcodeDataSourceConfigs(upsertedNew, {
      ...createdDataSource,
      params: { limit: 2 },
    });
    assert.equal(upsertedExisting.length, 1);
    assert.deepEqual(upsertedExisting[0].params, { limit: 2 });

    const state = createEditorState(createLowcodePageSchema({
      pageId: "data_source_page",
      title: "数据源页面",
      nodes: [],
      dataSources: [
        { id: "products", type: "product.byActivity", bindTo: "products", params: { limit: 6 } },
      ],
    }));

    const addedState = addLowcodeDataSource(state, "custom.http", { id: "custom_data" });
    assert.equal(addedState.lastAction, "addDataSource");
    assert.equal(addedState.dirty, true);
    assert.equal(addedState.schema.dataSources.length, 2);
    assert.equal(addedState.schema.dataSources[1].bindTo, "data");

    const patchedState = updateLowcodeDataSource(addedState, 1, {
      type: "product.byIds",
      bindTo: "products",
      params: { ids: ["sku_1"] },
    });
    assert.equal(patchedState.lastAction, "updateDataSource");
    assert.equal(patchedState.schema.dataSources[1].type, "product.byIds");
    assert.deepEqual(patchedState.schema.dataSources[1].params, { ids: ["sku_1"] });

    const removedState = removeLowcodeDataSource(patchedState, 0);
    assert.equal(removedState.lastAction, "removeDataSource");
    assert.equal(removedState.schema.dataSources.length, 1);
    assert.equal(removedState.schema.dataSources[0].id, "custom_data");
  });

  it("creates reusable action config models and state helpers", () => {
    const actionTypeLabels = LOWCODE_EDITOR_DEFAULT_ACTION_TYPE_OPTIONS.map((option) => option.label);
    assert.deepEqual(actionTypeLabels, ["页面跳转", "领取优惠券", "点击埋点", "空动作"]);
    assert.deepEqual(createLowcodeDefaultActionParams("navigate"), {
      url: "/activity/demo",
      openInNewTab: false,
    });
    assert.deepEqual(createLowcodeDefaultActionParams("unknown.action"), {});

    const createdAction = createLowcodeActionConfig("coupon.receive", {
      id: "receive_coupon",
      now: new Date("2026-08-01T00:00:00.000Z"),
    });
    assert.deepEqual(createdAction, {
      id: "receive_coupon",
      type: "coupon.receive",
      params: { couponId: "coupon_demo" },
    });
    assert.equal(formatLowcodeActionParamsText(createdAction), "{\n  \"couponId\": \"coupon_demo\"\n}");
    assert.deepEqual(createLowcodeActionFormItems([createdAction]), [
      {
        id: "receive_coupon",
        type: "coupon.receive",
        typeLabel: "领取优惠券",
        paramsText: "{\n  \"couponId\": \"coupon_demo\"\n}",
        action: createdAction,
      },
    ]);

    const state = createEditorState(createLowcodePageSchema({
      pageId: "action_page",
      title: "动作页面",
      nodes: [
        createLowcodeNode({
          id: "button_1",
          componentName: "ActionButton",
          materialVersion: "1.0.0",
          props: { text: "去首页" },
          events: { click: { actionId: "go_home" } },
        }),
      ],
      actions: [
        { id: "go_home", type: "navigate", params: { url: "/" } },
      ],
    }));

    const addedState = addLowcodeAction(state, "tracking.click", { id: "track_click" });
    assert.equal(addedState.lastAction, "addAction");
    assert.equal(addedState.dirty, true);
    assert.equal(addedState.schema.actions.length, 2);
    assert.deepEqual(addedState.schema.actions[1].params, { eventName: "lowcode_click" });

    const patchedState = updateLowcodeAction(addedState, 1, {
      params: { eventName: "hero_click" },
    });
    assert.equal(patchedState.lastAction, "updateAction");
    assert.equal(patchedState.schema.actions[1].params.eventName, "hero_click");

    const renamedState = renameLowcodeAction(patchedState, 0, "go_home_new");
    assert.equal(renamedState.lastAction, "updateActionId");
    assert.equal(renamedState.schema.actions[0].id, "go_home_new");
    assert.equal(renamedState.schema.nodes[0].events.click.actionId, "go_home_new");

    const typedState = setLowcodeActionType(renamedState, 0, "noop");
    assert.equal(typedState.lastAction, "updateActionType");
    assert.equal(typedState.schema.actions[0].type, "noop");
    assert.deepEqual(typedState.schema.actions[0].params, {});

    const removedState = removeLowcodeAction(typedState, 0);
    assert.equal(removedState.lastAction, "removeAction");
    assert.equal(removedState.schema.actions.length, 1);
    assert.equal(removedState.schema.nodes[0].events, undefined);
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

  it("creates release history list models and release messages", () => {
    const schema = createLowcodePageSchema({
      pageId: "release_page",
      title: "夏日活动",
      status: "draft",
      pageVersion: "0.2.0",
      nodes: [],
      publishMeta: { environment: "pre", operator: "tester" },
    });
    const releases = [
      {
        id: "release_published",
        kind: "published",
        pageId: schema.pageId,
        pageVersion: "prod-20260801T010000Z",
        title: "夏日活动",
        note: "正式发布",
        createdAt: "2026-08-01T01:00:00.000Z",
        schema: { ...schema, status: "published", pageVersion: "prod-20260801T010000Z" },
      },
      {
        id: "release_preview",
        kind: "preview",
        pageId: schema.pageId,
        pageVersion: "preview-20260801T000000Z",
        title: "夏日活动预览",
        createdAt: "2026-08-01T00:00:00.000Z",
        schema: { ...schema, status: "preview", pageVersion: "preview-20260801T000000Z" },
      },
    ];

    const item = createLowcodeReleaseListItem(releases[0], {
      selectedReleaseId: "release_published",
      locale: "en-US",
      formatOptions: { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "UTC" },
    });
    const visibleItems = createLowcodeReleaseListItems(releases, {
      keyword: "正式",
      locale: "en-US",
      formatOptions: { timeZone: "UTC" },
    });
    const summaryWithKeyword = summarizeLowcodeReleaseList(releases.length, visibleItems.length, "正式");
    const summaryWithoutKeyword = summarizeLowcodeReleaseList(releases.length, releases.length);

    assert.equal(formatLowcodeReleaseKindLabel("published"), "已发布");
    assert.equal(formatLowcodeReleaseKindLabel("custom"), "custom");
    assert.equal(formatLowcodeReleaseTime("bad-time"), "时间未知");
    assert.equal(item.kindLabel, "已发布");
    assert.equal(item.createdAtText.includes("08/01"), true);
    assert.equal(item.selected, true);
    assert.equal(item.note, "正式发布");
    assert.equal(visibleItems.length, 1);
    assert.equal(visibleItems[0].id, "release_published");
    assert.deepEqual(summaryWithKeyword, {
      total: 2,
      visible: 1,
      statusText: "1 / 2",
      emptyText: "没有匹配的本地版本",
    });
    assert.equal(summaryWithoutKeyword.statusText, "按时间倒序");
    assert.equal(formatLowcodeVersionDiffSummary(0), "无摘要差异");
    assert.equal(formatLowcodeVersionDiffSummary(3), "3 项差异");
    assert.equal(createLowcodeReleaseMessage(releases[0], "已发布"), "已发布：夏日活动 / prod-20260801T010000Z / 正式发布");
    assert.equal(createLowcodePublishBlockedMessage("发布", [{ title: "页面 Schema" }, { title: "动作配置" }]), "发布失败：页面 Schema、动作配置 未通过");
    assert.equal(createLowcodeRollbackNote(releases[0]), "回滚自 prod-20260801T010000Z：正式发布");
    assert.equal(createLowcodeRollbackConfirmText(releases[0]), "确认将版本 prod-20260801T010000Z 作为新的已发布版本吗？");
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

  it("provides reusable H5 viewport presets for editor shells", () => {
    const standard = getLowcodeEditorViewportPreset("h5-standard");
    assert.ok(standard);
    assert.equal(LOWCODE_H5_VIEWPORT_PRESETS.length, 3);
    assert.equal(standard.title, "标准屏");
    assert.equal(standard.width, 390);
    assert.equal(findLowcodeEditorViewportPreset({ platform: "h5", width: 360 })?.id, "h5-compact");
    assert.equal(formatLowcodeEditorViewportTitle({ platform: "h5", width: 390 }), "标准屏 390");
    assert.equal(formatLowcodeEditorViewportTitle({ platform: "h5", width: 414 }), "自定义 414");

    const viewport = createLowcodeEditorViewportFromPreset(standard);
    assert.equal(viewport.platform, "h5");
    assert.equal(viewport.width, 390);
    assert.equal(viewport.scale, 1);

    const state = createEditorState(createLowcodePageSchema({ pageId: "viewport_page", title: "视口页面" }));
    const nextState = setEditorViewportPreset(state, standard);
    assert.equal(nextState.viewport.platform, "h5");
    assert.equal(nextState.viewport.width, 390);
    assert.equal(nextState.lastAction, "setEditorViewport");
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
