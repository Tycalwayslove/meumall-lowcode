<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, watch, type CSSProperties } from "vue";
import {
  ArrowDown,
  ArrowUp,
  Code2,
  Copy,
  Download,
  Eye,
  ExternalLink,
  Layers,
  MoreHorizontal,
  MonitorSmartphone,
  Pencil,
  PanelRight,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Undo2,
  Upload,
  X,
} from "@lucide/vue";
import {
  createDataSourceRegistry,
  createSafeActionExecutor,
  createSafeActionRegistry,
  createStaticResourceLibraryClient,
  createStaticTemplateLibraryClient,
  encodePageSchemaToUrlParam,
  resolveLowcodeDataSources,
  type DataSourceResolutionRecord,
  type LowcodeCouponResource,
  type LowcodeImageAssetResource,
  type LowcodeProductResource,
  type LowcodeResourceSearchResult,
  type LowcodeStoreExpertResource,
  type LowcodeTemplateResource,
} from "@meumall/lowcode-adapters";
import { createMaterialRegistry } from "@meumall/lowcode-core";
import {
  addLowcodeDataSource,
  addLowcodeAction,
  appendNode,
  cloneLowcodePageSchema,
  createLowcodeBlankPageSchema,
  copyNode,
  bindLowcodeNodeEvent,
  canLowcodeDragSelectedGroup,
  createLowcodeCanvasAppendDropHint,
  createLowcodeCanvasTargetDropHint,
  createLowcodeActionFormItems,
  createLowcodeDataSourceFormItems,
  createLowcodeDeliverySummary,
  createLowcodeEditorDraftPayload,
  createLowcodeEventBindingItems,
  createLowcodeMaterialDetailDataSourceSlotItems,
  createLowcodeMaterialDetailEventItems,
  createLowcodeMaterialDetailPropEntries,
  createLowcodeMaterialDetailSummary,
  createLowcodeMaterialFavoriteMessage,
  createLowcodeMaterialNodeInput,
  createLowcodeMaterialPreviewSchema,
  createLowcodeMaterialCategories,
  createLowcodeNodeOperationItems,
  createLowcodeNodeOperationMessage,
  createLowcodeNodeSelectionModel,
  createLowcodePublishBlockedMessage,
  createLowcodePageSettingsForm,
  createLowcodePageStartState,
  createLowcodePublishChecks,
  createLowcodeReleaseListItems,
  createLowcodeReleaseMessage,
  createLowcodeRollbackConfirmText,
  createLowcodeRollbackNote,
  createLowcodeSchemaPreviewItems,
  createLowcodeTemplateListItem,
  createLowcodeVersionDiffItems,
  createLowcodeWorkspaceStats,
  createEditorState,
  createLowcodeEditorViewportFromPreset,
  createLowcodeOutlineRows,
  createLowcodeOutlineVisibility,
  createLowcodePreviewLinkItems,
  createLowcodePropGroups,
  duplicateNode,
  createLowcodeDefaultListItem,
  createLowcodeSchemaFileExport,
  formatLowcodeTemplateSummary,
  findLowcodeEditorViewportPreset,
  filterLowcodeEditorCommands,
  filterLowcodeMaterialCatalog,
  formatLowcodeEditorViewportTitle,
  formatLowcodeReleaseTime,
  formatLowcodeVersionDiffSummary,
  getLowcodeEditorViewportPreset,
  formatLowcodeTemplateVersion,
  getLowcodeNodeDisplayName,
  getLowcodeSelectedGroupNodeIdsForDrag,
  insertNode,
  insertLowcodeCanvasNodeByHint,
  isLowcodeInvalidNodeDropTarget,
  isLowcodeFavoriteMaterial,
  isLowcodeNodeSelected,
  LOWCODE_H5_VIEWPORT_PRESETS,
  LOWCODE_EDITOR_DEFAULT_DATA_SOURCE_TYPE_OPTIONS,
  LOWCODE_EDITOR_DEFAULT_ACTION_TYPE_OPTIONS,
  LOWCODE_EDITOR_PAGE_BACKGROUND_SWATCHES,
  LOWCODE_EDITOR_PAGE_STATUS_OPTIONS,
  LOWCODE_EDITOR_PAGE_TYPE_OPTIONS,
  LOWCODE_EDITOR_PUBLISH_ENVIRONMENT_OPTIONS,
  LOWCODE_EDITOR_RECENT_MATERIAL_DEFAULT_LIMIT,
  markSaved,
  moveNodeById,
  moveLowcodeCanvasNodeByHint,
  moveLowcodeCanvasNodeGroupByHint,
  normalizeLowcodePropInputValue,
  pasteNode,
  formatLowcodeEditorDraftStatusText,
  getLowcodeEditorDraftStatusTone,
  parseLowcodeEditorDraftContent,
  parseLowcodeMaterialPreferenceContent,
  parseLowcodeSchemaFileContent,
  pickLowcodeMaterialEntriesByComponentNames,
  pruneLowcodeNodeSelection,
  pruneLowcodeOutlineCollapsedNodeIds,
  redo,
  revealLowcodeOutlineNode,
  removeLowcodeAction,
  removeLowcodeDataSource,
  removeNode,
  replaceNodeProps,
  renameLowcodeAction,
  resolveLowcodeCanvasDropPlacement,
  resolveLowcodeNodeShortcutAction,
  selectNode,
  setEditorMode,
  setLowcodeActionType,
  setEditorViewportPreset,
  sliceLowcodeTemplateTags,
  summarizeLowcodePublishChecks,
  summarizeLowcodeReleaseList,
  summarizeLowcodePreviewLinks,
  toggleLowcodeFavoriteMaterial,
  toggleLowcodeNodeSelection,
  toggleLowcodePropGroupCollapsed,
  undo,
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
  type LowcodeEditorCanvasDragSource as CanvasDragSource,
  type LowcodeEditorCanvasDropHint as CanvasDropHint,
  type LowcodeEditorCanvasFrameMetrics as CanvasFrameMetrics,
  type LowcodeEditorCanvasPoint as CanvasPoint,
  type LowcodeEditorCanvasRect as CanvasRect,
  type LowcodeEditorDraftPersistenceStatus,
  type LowcodeEditorOutlineRow as OutlineRow,
  type LowcodeEditorPreviewLinkItem as PreviewLinkItem,
  type LowcodeEditorPropGroup as PropEditorGroup,
  type LowcodeEditorPropGroupKey as PropGroupKey,
  type LowcodeEditorReleaseListItem as ReleaseListItem,
  type LowcodeEditorListField as ListEditorField,
  type LowcodeEditorState,
  type LowcodeEditorDeliveryMetric as DeliveryMetricItem,
  type LowcodeEditorPublishCheck as PublishCheck,
  type LowcodeEditorSchemaPreviewItem as ReleaseSchemaPreviewItem,
  type LowcodeEditorTemplateListItem as TemplateListItem,
  type LowcodeEditorViewportPreset,
  type LowcodeEditorVersionDiffItem as ReleaseDiffItem,
  type LowcodeEditorWorkspaceStat as WorkspaceStat,
  type LowcodeEditorMaterialDetailSummary as MaterialDetailSummary,
  type LowcodeEditorNodeOperationAction as NodeContextAction,
  type LowcodeEditorNodeOperationItem as NodeContextMenuItem,
} from "@meumall/lowcode-editor";
import { h5VueMaterials } from "@meumall/lowcode-materials-vue-h5";
import { LowcodeVueRenderer } from "@meumall/lowcode-renderer-vue-h5";
import {
  validateLowcodePageSchema,
  type JsonObject,
  type JsonValue,
  type LowcodeDataSourceConfig,
  type LowcodeEnvironment,
  type LowcodeMaterialManifest,
  type LowcodeNode,
  type LowcodePageSchema,
  type LowcodePageStatus,
  type LowcodePageType,
  type LowcodePropSchema,
} from "@meumall/lowcode-schema";
import EditorCanvasToolbar from "./components/EditorCanvasToolbar.vue";
import EditorCommandPalette, { type EditorCommandPaletteItem } from "./components/EditorCommandPalette.vue";
import EditorMaterialCatalog from "./components/EditorMaterialCatalog.vue";
import EditorMaterialDetail from "./components/EditorMaterialDetail.vue";
import EditorOutlineTree from "./components/EditorOutlineTree.vue";
import EditorPageSettingsPanel from "./components/EditorPageSettingsPanel.vue";
import EditorPropGroupsPanel from "./components/EditorPropGroupsPanel.vue";
import EditorPublishPanel from "./components/EditorPublishPanel.vue";
import EditorResourcePanels from "./components/EditorResourcePanels.vue";
import EditorSchemaConfigPanel from "./components/EditorSchemaConfigPanel.vue";
import EditorSelectedNodeCard from "./components/EditorSelectedNodeCard.vue";
import { pageTemplates, type PageTemplate } from "./pageTemplates";
import {
  localConfigPlatformClient,
  type LocalPageRelease,
} from "./mockPlatform";

const STORAGE_KEY = "meumall-lowcode-editor-playground";
const MATERIAL_FAVORITES_KEY = "meumall-lowcode-material-favorites";
const MATERIAL_RECENT_KEY = "meumall-lowcode-material-recent";
const CUSTOM_TEMPLATES_KEY = "meumall-lowcode-custom-templates";
const AUTO_SAVE_DELAY_MS = 700;
const REACT_H5_RUNTIME_URL = import.meta.env.VITE_REACT_H5_RUNTIME_URL ?? "http://localhost:5174/";
const runtimeQuery = new URLSearchParams(window.location.search);
const isRuntimeMode = runtimeQuery.get("runtime") === "1";
const h5ViewportPresets = LOWCODE_H5_VIEWPORT_PRESETS;
const defaultH5ViewportPreset = getLowcodeEditorViewportPreset("h5-standard") ?? h5ViewportPresets[1];
const pageTypeOptions = LOWCODE_EDITOR_PAGE_TYPE_OPTIONS;
const pageStatusOptions = LOWCODE_EDITOR_PAGE_STATUS_OPTIONS;
const publishEnvironmentOptions = LOWCODE_EDITOR_PUBLISH_ENVIRONMENT_OPTIONS;
const pageBackgroundSwatches = LOWCODE_EDITOR_PAGE_BACKGROUND_SWATCHES;

const sampleAssets: LowcodeImageAssetResource[] = [
  {
    id: "asset_hero_fashion",
    title: "活动女装横幅",
    category: "活动横幅",
    url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
    tags: ["女装", "大促", "首屏"],
  },
  {
    id: "asset_summer_banner",
    title: "夏季穿搭 Banner",
    category: "活动横幅",
    url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    tags: ["夏季", "专题", "穿搭"],
  },
  {
    id: "asset_product_display",
    title: "质感商品陈列",
    category: "商品氛围",
    url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
    tags: ["商品", "陈列", "精选"],
  },
  {
    id: "asset_coupon",
    title: "新人券视觉",
    category: "优惠券",
    url: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=900&q=80",
    tags: ["优惠券", "新人", "转化"],
  },
  {
    id: "asset_flash_sale",
    title: "限时秒杀氛围",
    category: "商品氛围",
    url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=900&q=80",
    tags: ["秒杀", "活动", "促销"],
  },
  {
    id: "asset_live_entry",
    title: "直播间氛围",
    category: "直播素材",
    url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80",
    tags: ["直播", "达人", "讲解"],
  },
];

const sampleProducts: LowcodeProductResource[] = [
  {
    id: "sku_001",
    title: "轻盈通勤手提包",
    priceText: "¥199",
    originPriceText: "¥299",
    desc: "活动价",
    imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sku_002",
    title: "夏季舒适凉鞋",
    priceText: "¥129",
    originPriceText: "¥199",
    desc: "限时补贴",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sku_003",
    title: "防晒轻薄衬衫",
    priceText: "¥159",
    originPriceText: "¥239",
    desc: "热卖单品",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sku_004",
    title: "清爽亚麻短裤",
    priceText: "¥89",
    originPriceText: "¥139",
    desc: "新品上架",
    imageUrl: "https://images.unsplash.com/photo-1506629905607-d405b7a30db9?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sku_005",
    title: "小香风单肩包",
    priceText: "¥169",
    originPriceText: "¥259",
    desc: "爆款返场",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80",
  },
];

const sampleCoupons: LowcodeCouponResource[] = [
  {
    id: "coupon_platform_30",
    title: "满 199 减 30",
    thresholdText: "平台通用券",
    valueText: "¥30",
    expireText: "领取后 7 天有效",
    buttonText: "领取",
    tags: ["大促", "平台", "新人"],
  },
  {
    id: "coupon_category_80",
    title: "满 399 减 80",
    thresholdText: "包袋鞋履可用",
    valueText: "¥80",
    expireText: "每日限量",
    buttonText: "领取",
    tags: ["品类", "包袋", "鞋履"],
  },
  {
    id: "coupon_shipping",
    title: "满 99 包邮",
    thresholdText: "指定区域可用",
    valueText: "包邮",
    expireText: "活动期内有效",
    buttonText: "领取",
    tags: ["物流", "转化"],
  },
];

const sampleStoreExperts: LowcodeStoreExpertResource[] = [
  {
    id: "store_jingan",
    kind: "store",
    typeText: "门店",
    title: "MeuMall 上海静安店",
    subtitle: "本周热卖搭配到店试穿",
    metricText: "4.9 分",
    desc: "距你 2.1km",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80",
    buttonText: "到店",
    tags: ["上海", "线下", "试穿"],
  },
  {
    id: "store_hangzhou",
    kind: "store",
    typeText: "门店",
    title: "MeuMall 杭州湖滨店",
    subtitle: "湖滨商圈新品试穿与自提",
    metricText: "4.8 分",
    desc: "距你 4.6km",
    imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=300&q=80",
    buttonText: "查看",
    tags: ["杭州", "门店", "自提"],
  },
  {
    id: "expert_summer",
    kind: "expert",
    typeText: "达人",
    title: "小夏的通勤穿搭",
    subtitle: "每日更新包袋和鞋履组合",
    metricText: "12.8w 粉丝",
    desc: "直播中",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    buttonText: "进直播",
    tags: ["达人", "通勤", "直播"],
  },
  {
    id: "expert_minimal",
    kind: "expert",
    typeText: "达人",
    title: "阿岚的极简衣橱",
    subtitle: "高频复购基础款搭配",
    metricText: "8.6w 粉丝",
    desc: "本周精选",
    imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80",
    buttonText: "查看",
    tags: ["达人", "基础款", "搭配"],
  },
];

const actionTypeOptions = LOWCODE_EDITOR_DEFAULT_ACTION_TYPE_OPTIONS;
const dataSourceTypeOptions = LOWCODE_EDITOR_DEFAULT_DATA_SOURCE_TYPE_OPTIONS;

const registry = createMaterialRegistry(h5VueMaterials);
const materials = registry.list();
const availableMaterialComponentNames = materials.map((item) => item.manifest.componentName);
const resourceLibraryClient = createStaticResourceLibraryClient({
  imageAssets: sampleAssets,
  products: sampleProducts,
  coupons: sampleCoupons,
  storeExperts: sampleStoreExperts,
});
const previewDataSourceRegistry = createDataSourceRegistry({
  "product.byActivity": resolveSampleProductDataSource,
  "product.byIds": resolveSampleProductDataSource,
  "store.byIds": resolveSampleStoreExpertDataSource,
  "expert.byActivity": resolveSampleStoreExpertDataSource,
  "custom.http": (dataSource) => dataSource.params ?? {},
});

const initialSchema = cloneLowcodePageSchema((pageTemplates[0] as PageTemplate).schema);

interface LoadedSchemaResult {
  schema: LowcodePageSchema;
  restored: boolean;
  updatedAt?: string;
}

function loadSchema(): LoadedSchemaResult {
  const result = parseLowcodeEditorDraftContent(window.localStorage.getItem(STORAGE_KEY), {
    fallbackSchema: initialSchema,
  });
  return {
    schema: result.schema ?? initialSchema,
    restored: result.restored,
    updatedAt: result.restored ? result.payload?.updatedAt : undefined,
  };
}

const loadedSchemaResult = loadSchema();
const loadedSchema = loadedSchemaResult.schema;
const editorState = shallowRef<LowcodeEditorState>(
  createEditorState(loadedSchema, {
    selectedNodeId: loadedSchema.nodes[0]?.id,
    viewport: createLowcodeEditorViewportFromPreset(defaultH5ViewportPreset),
  }),
);
const schemaDraft = ref(JSON.stringify(editorState.value.schema, null, 2));
const jsonError = ref("");
const draggedNodeId = ref<string>();
const phoneFrameRef = ref<HTMLElement>();
const commandPaletteRef = ref<InstanceType<typeof EditorCommandPalette>>();
const schemaFileInputRef = ref<HTMLInputElement>();
const releaseMessage = ref("");
const schemaTransferMessage = ref("");
const autoSaveStatus = ref<LowcodeEditorDraftPersistenceStatus>(loadedSchemaResult.restored ? "restored" : "idle");
const lastAutoSavedAt = ref<string | undefined>(loadedSchemaResult.updatedAt);
const configPlatformClient = localConfigPlatformClient;
const releases = shallowRef<LocalPageRelease[]>(configPlatformClient.listReleases(editorState.value.schema.pageId));
const selectedReleaseId = ref(releases.value[0]?.id ?? "");
const releaseNoteDraft = ref("");
const releaseKeyword = ref("");
const selectedInsertComponentName = ref(materials[0]?.manifest.componentName ?? "");
const templateKeyword = ref("");
const templateCategory = ref("全部");
const materialKeyword = ref("");
const materialCategory = ref("全部");
const favoriteMaterialComponentNames = ref<string[]>(loadStoredMaterialComponentNames(MATERIAL_FAVORITES_KEY));
const recentMaterialComponentNames = ref<string[]>(loadStoredMaterialComponentNames(MATERIAL_RECENT_KEY));
const localCustomTemplates = shallowRef<PageTemplate[]>(loadStoredCustomTemplates());
const materialPreferenceMessage = ref("");
const outlineKeyword = ref("");
const collapsedOutlineNodeIds = ref<string[]>([]);
const renamingOutlineNodeId = ref<string>();
const outlineRenameDraft = ref("");
const commandPaletteOpen = ref(false);
const commandKeyword = ref("");
const pageStartWizardOpen = ref(false);
const nodeContextMenu = ref<NodeContextMenuState | undefined>();
const selectedMaterialDetailManifest = ref<LowcodeMaterialManifest>();
const visiblePageTemplates = ref<TemplateListItem[]>([]);
const isTemplateSearching = ref(false);
const assetKeyword = ref("");
const assetCategory = ref("全部");
const assetTargetPropName = ref("");
const productKeyword = ref("");
const selectedProductIds = ref<string[]>([]);
const couponKeyword = ref("");
const selectedCouponIds = ref<string[]>([]);
const storeExpertKeyword = ref("");
const storeExpertCategory = ref("全部");
const selectedStoreExpertIds = ref<string[]>([]);
const filteredAssets = ref<LowcodeImageAssetResource[]>([]);
const filteredProducts = ref<LowcodeProductResource[]>([]);
const filteredCoupons = ref<LowcodeCouponResource[]>([]);
const filteredStoreExperts = ref<LowcodeStoreExpertResource[]>([]);
const resourceProductCatalog = ref<LowcodeProductResource[]>([]);
const resourceCouponCatalog = ref<LowcodeCouponResource[]>([]);
const resourceStoreExpertCatalog = ref<LowcodeStoreExpertResource[]>([]);
const isAssetSearching = ref(false);
const isProductSearching = ref(false);
const isCouponSearching = ref(false);
const isStoreExpertSearching = ref(false);
const previewData = ref<JsonObject>({});
const runtimePreviewData = ref<JsonObject>({});
const previewDataSourceRecords = ref<DataSourceResolutionRecord[]>([]);
const runtimeDataSourceRecords = ref<DataSourceResolutionRecord[]>([]);
const isPreviewDataResolving = ref(false);
const isRuntimeDataResolving = ref(false);
const actionMessage = ref("");
let previewResolutionSeq = 0;
let runtimeResolutionSeq = 0;
let templateSearchSeq = 0;
let assetSearchSeq = 0;
let productSearchSeq = 0;
let couponSearchSeq = 0;
let storeExpertSearchSeq = 0;
let autoSaveTimer: number | undefined;
let suppressNextAutoSave = false;

interface CanvasDragPoint extends CanvasPoint {
  target?: EventTarget | null;
}

interface PointerCanvasDragState {
  pointerId: number;
  source: CanvasDragSource;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  dragging: boolean;
  componentName?: string;
  nodeId?: string;
}

interface NodeContextMenuState {
  nodeId: string;
  x: number;
  y: number;
}

interface CommandPaletteItem extends EditorCommandPaletteItem {
  keywords: string[];
}

interface ListItemDragState {
  propName: string;
  fromIndex: number;
  overIndex?: number;
}

interface ListAssetTarget {
  propName: string;
  propSchema: LowcodePropSchema;
  itemIndex: number;
  fieldName: string;
  fieldLabel: string;
}

const canvasDropHint = ref<CanvasDropHint>();
const listItemDragState = ref<ListItemDragState>();
const listAssetTarget = ref<ListAssetTarget>();
const pointerCanvasDragState = ref<PointerCanvasDragState>();
const multiSelectedNodeIds = ref<string[]>([]);
const collapsedPropGroups = ref<Partial<Record<PropGroupKey, boolean>>>({
  advanced: true,
});

const MATERIAL_DRAG_TYPE = "application/x-meumall-material";
const NODE_DRAG_TYPE = "application/x-meumall-node";
const LIST_ITEM_DRAG_TYPE = "application/x-meumall-list-item";
const POINTER_DRAG_START_DISTANCE = 8;
let suppressNextClick = false;

const canvasStarterComponentNames = ["ActivityHero", "ImageBanner", "ProductList", "CouponSection"];
const materialPreviewDataBindings = {
  ProductList: { items: "products" },
  ProductRankList: { items: "products" },
  BrandFeatureSection: { items: "products" },
};

const safeActionRegistry = createSafeActionRegistry({
  navigate(action) {
    const url = getParamString(action.params, "url", "/");
    actionMessage.value = `模拟跳转：${url}`;
    if (getParamBoolean(action.params, "openInNewTab", false)) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  },
  "coupon.receive"(action) {
    actionMessage.value = `模拟领券：${getParamString(action.params, "couponId", "coupon_demo")}`;
  },
  "tracking.click"(action, context) {
    actionMessage.value = `模拟埋点：${getParamString(action.params, "eventName", "lowcode_click")} / ${context?.schema?.pageId ?? "-"}`;
  },
  noop(action) {
    actionMessage.value = `已执行空动作：${action.id}`;
  },
});
const actionExecutor = createSafeActionExecutor(safeActionRegistry, {
  onError(error) {
    actionMessage.value = `动作执行失败：${error.message}`;
  },
});

const validation = computed(() => validateLowcodePageSchema(editorState.value.schema));
const selectedNode = computed(() => findNode(editorState.value.schema.nodes, editorState.value.selectedNodeId));
const selectedManifest = computed(() =>
  selectedNode.value ? registry.get(selectedNode.value.componentName)?.manifest : undefined,
);
const selectedNodeDisplayName = computed(() => selectedNode.value ? getNodeDisplayName(selectedNode.value) : "");
const selectedPropGroups = computed<PropEditorGroup[]>(() => {
  const manifest = selectedManifest.value;
  if (!manifest) return [];
  return createLowcodePropGroups(manifest.propsSchema);
});
const selectedNodeIsContainer = computed(() => selectedNode.value?.componentName === "SectionContainer");
const outlineRows = computed(() =>
  createLowcodeOutlineRows(editorState.value.schema.nodes, {
    materialManifests: materials.map((material) => material.manifest),
  }),
);
const selectedOutlineRow = computed(() => outlineRows.value.find((row) => row.node.id === editorState.value.selectedNodeId));
const collapsedOutlineNodeIdSet = computed(() => new Set(collapsedOutlineNodeIds.value));
const outlineVisibility = computed(() =>
  createLowcodeOutlineVisibility(outlineRows.value, {
    keyword: outlineKeyword.value,
    collapsedNodeIds: collapsedOutlineNodeIds.value,
    selectedNodeId: editorState.value.selectedNodeId,
  }),
);
const outlineMatchedNodeIdSet = computed(() => new Set(outlineVisibility.value.matchedNodeIds));
const visibleOutlineRows = computed(() => outlineVisibility.value.rows);
const outlineVisibleSummary = computed(() => outlineVisibility.value.summary);
const multiSelection = computed(() => createLowcodeNodeSelectionModel(outlineRows.value, multiSelectedNodeIds.value));
const multiSelectSummary = computed(() => multiSelection.value.summary);
const groupDraggableOutlineNodeIds = computed(() =>
  visibleOutlineRows.value
    .filter((row) => canDragSelectedGroup(row.node.id))
    .map((row) => row.node.id),
);
const selectedInsertManifest = computed(() => {
  return materials.find((item) => item.manifest.componentName === selectedInsertComponentName.value)?.manifest;
});
const imagePropOptions = computed(() => {
  const manifest = selectedManifest.value;
  if (!manifest) return [];
  return Object.entries(manifest.propsSchema)
    .filter(([, propSchema]) => propSchema.setter === "image")
    .map(([name, propSchema]) => ({ name, label: propSchema.label }));
});
const canUseAssetLibrary = computed(() => Boolean(selectedNode.value && imagePropOptions.value.length));
const assetCategories = computed(() => ["全部", ...Array.from(new Set(sampleAssets.map((asset) => asset.category)))]);
const isProductMaterialSelected = computed(() =>
  Boolean(selectedNode.value && ["ProductList", "ProductRankList", "BrandFeatureSection", "FlashSaleList"].includes(selectedNode.value.componentName)),
);
const isCouponBundleSelected = computed(() => selectedNode.value?.componentName === "CouponBundle");
const isCouponSectionSelected = computed(() => selectedNode.value?.componentName === "CouponSection");
const canUseCouponLibrary = computed(() => Boolean(isCouponBundleSelected.value || isCouponSectionSelected.value));
const isStoreExpertMaterialSelected = computed(() => selectedNode.value?.componentName === "StoreExpertSection");
const storeExpertCategories = computed(() => ["全部", ...Array.from(new Set(sampleStoreExperts.map((item) => item.typeText)))]);
const selectedProducts = computed(() => {
  const selected = new Set(selectedProductIds.value);
  return resourceProductCatalog.value.filter((product) => selected.has(product.id));
});
const selectedCoupons = computed(() => {
  const selected = new Set(selectedCouponIds.value);
  return resourceCouponCatalog.value.filter((coupon) => selected.has(coupon.id));
});
const selectedStoreExperts = computed(() => {
  const selected = new Set(selectedStoreExpertIds.value);
  return resourceStoreExpertCatalog.value.filter((item) => selected.has(item.id));
});
const canMoveSelectedUp = computed(() => Boolean(selectedOutlineRow.value && selectedOutlineRow.value.index > 0));
const canMoveSelectedDown = computed(() => {
  const row = selectedOutlineRow.value;
  if (!row) return false;
  return row.index < getSiblingCount(row.parentId) - 1;
});
const nodeContextMenuStyle = computed<CSSProperties>(() => {
  const menu = nodeContextMenu.value;
  if (!menu) return {};
  return {
    left: `${menu.x}px`,
    top: `${menu.y}px`,
  };
});
const nodeContextMenuItems = computed<NodeContextMenuItem[]>(() => createLowcodeNodeOperationItems({
  canInsert: Boolean(selectedInsertManifest.value),
  canAddInside: Boolean(selectedNodeIsContainer.value && selectedInsertManifest.value),
  canMoveUp: canMoveSelectedUp.value,
  canMoveDown: canMoveSelectedDown.value,
  canPaste: Boolean(editorState.value.clipboard),
}));
const nodeOperationItemMap = computed(() => new Map(
  nodeContextMenuItems.value.map((item) => [item.action, item]),
));
const publishChecks = computed(() => createPublishChecks());
const publishCheckSummary = computed(() => summarizeLowcodePublishChecks(publishChecks.value));
const hasPublishBlockingErrors = computed(() => publishCheckSummary.value.error > 0);
const materialCategories = computed(() => createLowcodeMaterialCategories(materials.map((item) => item.manifest)));
const favoriteMaterials = computed(() => materialItemsFromComponentNames(favoriteMaterialComponentNames.value));
const recentMaterials = computed(() => materialItemsFromComponentNames(recentMaterialComponentNames.value));
const visibleMaterials = computed(() => filterLowcodeMaterialCatalog(materials, {
  keyword: materialKeyword.value,
  category: materialCategory.value,
}));
const canvasStarterMaterials = computed(() => {
  const order = new Map(canvasStarterComponentNames.map((componentName, index) => [componentName, index]));
  return materials
    .filter((item) => order.has(item.manifest.componentName))
    .sort((a, b) => (order.get(a.manifest.componentName) ?? 0) - (order.get(b.manifest.componentName) ?? 0));
});
const activeH5ViewportPreset = computed<LowcodeEditorViewportPreset | undefined>(() =>
  findLowcodeEditorViewportPreset(editorState.value.viewport, h5ViewportPresets),
);
const activeH5ViewportTitle = computed(() => formatLowcodeEditorViewportTitle(editorState.value.viewport, h5ViewportPresets));
const canvasToolbarStatusText = computed(() =>
  selectedNode.value
    ? `${selectedParentTitle.value} / ${selectedPositionText.value}`
    : validation.value.valid
      ? "校验通过"
      : validation.value.errors[0],
);
const phoneFrameStyle = computed<CSSProperties>(() => ({
  width: `${editorState.value.viewport.width}px`,
}));
const materialDetailSummary = computed<MaterialDetailSummary | undefined>(() =>
  selectedMaterialDetailManifest.value
    ? createLowcodeMaterialDetailSummary(selectedMaterialDetailManifest.value)
    : undefined,
);
const materialDetailPropEntries = computed(() =>
  selectedMaterialDetailManifest.value
    ? createLowcodeMaterialDetailPropEntries(selectedMaterialDetailManifest.value)
    : [],
);
const materialDetailEventItems = computed(() =>
  selectedMaterialDetailManifest.value
    ? createLowcodeMaterialDetailEventItems(selectedMaterialDetailManifest.value)
    : [],
);
const materialDetailDataSourceSlotItems = computed(() =>
  selectedMaterialDetailManifest.value
    ? createLowcodeMaterialDetailDataSourceSlotItems(selectedMaterialDetailManifest.value)
    : [],
);
const materialDetailPreviewSchema = computed<LowcodePageSchema | undefined>(() => {
  const manifest = selectedMaterialDetailManifest.value;
  if (!manifest) return undefined;
  return createLowcodeMaterialPreviewSchema(manifest, {
    dataSources: editorState.value.schema.dataSources,
    actions: editorState.value.schema.actions,
    environment: editorState.value.schema.publishMeta.environment,
    operator: "playground",
    dataBindingByComponentName: materialPreviewDataBindings,
  });
});
const pageSettingsForm = computed(() =>
  createLowcodePageSettingsForm(editorState.value.schema, {
    pageTypeOptions,
    statusOptions: pageStatusOptions,
    publishEnvironmentOptions,
    backgroundSwatches: pageBackgroundSwatches,
  }),
);
const selectedParentTitle = computed(() => {
  const parentId = selectedOutlineRow.value?.parentId;
  if (!parentId) return "页面根级";
  const parent = findNode(editorState.value.schema.nodes, parentId);
  return parent ? (registry.get(parent.componentName)?.manifest.title ?? parent.componentName) : "未知父级";
});
const selectedPositionText = computed(() => {
  const row = selectedOutlineRow.value;
  if (!row) return "未选择";
  return `第 ${row.index + 1} 个 / 第 ${row.depth + 1} 层`;
});
const selectedEventBindings = computed(() =>
  createLowcodeEventBindingItems(
    selectedManifest.value?.events ?? [],
    editorState.value.schema.actions ?? [],
    selectedNode.value?.events,
  ),
);
const actionFormItems = computed(() =>
  createLowcodeActionFormItems(editorState.value.schema.actions ?? [], {
    typeOptions: actionTypeOptions,
  }),
);
const dataSourceFormItems = computed(() =>
  createLowcodeDataSourceFormItems(editorState.value.schema.dataSources ?? [], {
    typeOptions: dataSourceTypeOptions,
    records: isPreviewDataResolving.value ? [] : previewDataSourceRecords.value,
    pendingLabel: isPreviewDataResolving.value ? "解析中" : "待解析",
  }),
);
const workspaceStats = computed<WorkspaceStat[]>(() =>
  createLowcodeWorkspaceStats(editorState.value.schema, {
    selectedTitle: selectedManifest.value?.title,
    validationValid: validation.value.valid,
    publishCheckSummary: publishCheckSummary.value,
    dirty: editorState.value.dirty,
  }),
);
const autoSaveStatusText = computed(() => {
  return formatLowcodeEditorDraftStatusText(autoSaveStatus.value, {
    lastSavedAt: lastAutoSavedAt.value,
  });
});
const autoSaveStatusTone = computed(() => {
  return getLowcodeEditorDraftStatusTone(autoSaveStatus.value);
});
const selectedRelease = computed<LocalPageRelease | undefined>(() =>
  releases.value.find((release) => release.id === selectedReleaseId.value),
);
const visibleReleaseItems = computed<ReleaseListItem<LocalPageRelease>[]>(() =>
  createLowcodeReleaseListItems(releases.value, {
    keyword: releaseKeyword.value,
    selectedReleaseId: selectedReleaseId.value,
  }),
);
const releaseListSummary = computed(() =>
  summarizeLowcodeReleaseList(releases.value.length, visibleReleaseItems.value.length, releaseKeyword.value),
);
const latestPublishedRelease = computed<LocalPageRelease | undefined>(() =>
  releases.value.find((release) => release.kind === "published"),
);
const releaseDiffItems = computed<ReleaseDiffItem[]>(() =>
  selectedRelease.value ? createLowcodeVersionDiffItems(editorState.value.schema, selectedRelease.value.schema) : [],
);
const releaseDiffChangedCount = computed(() => releaseDiffItems.value.filter((item) => item.changed).length);
const releaseDiffSummaryText = computed(() => formatLowcodeVersionDiffSummary(releaseDiffChangedCount.value));
const releaseSchemaPreviewItems = computed<ReleaseSchemaPreviewItem[]>(() =>
  selectedRelease.value
    ? createLowcodeSchemaPreviewItems(editorState.value.schema, selectedRelease.value.schema, {
      selectedDescription: `${selectedRelease.value.title} / ${selectedRelease.value.pageVersion}`,
    })
    : [],
);
const runtimeSchema = computed(() => resolveRuntimeSchema() ?? editorState.value.schema);
const runtimeTitle = computed(() => runtimeSchema.value.title || "MeuMall Lowcode H5");
const previewLinkItems = computed<PreviewLinkItem[]>(() =>
  createLowcodePreviewLinkItems([
    {
      id: "react-current",
      title: "当前草稿 React H5",
      description: "携带当前 schema，适合即时验收。",
      url: createReactH5RuntimeUrl(editorState.value.schema),
    },
    {
      id: "page-runtime",
      title: "页面草稿/最新版本 H5",
      description: "按 pageId 读取本地 mock 配置平台。",
      url: createRuntimeUrl({ pageId: editorState.value.schema.pageId }),
    },
    latestPublishedRelease.value ? {
      id: "published-runtime",
      title: "最近发布版本 H5",
      description: `${latestPublishedRelease.value.pageVersion} / ${formatLowcodeReleaseTime(latestPublishedRelease.value.createdAt)}`,
      url: createRuntimeUrl({ releaseId: latestPublishedRelease.value.id }),
    } : {
      id: "published-runtime",
      title: "最近发布版本 H5",
      description: "发布后可复制给验收方查看线上版本。",
      disabledReason: "暂无发布版本",
    },
  ], { includeDisabled: false }),
);
const previewLinkSummary = computed(() => summarizeLowcodePreviewLinks(previewLinkItems.value));
const deliverySummary = computed(() => createLowcodeDeliverySummary(editorState.value.schema, { checks: publishChecks.value }));
const deliverySchemaJson = computed(() => deliverySummary.value.schemaJson);
const deliveryStatusText = computed(() => deliverySummary.value.statusText);
const deliveryMetrics = computed<DeliveryMetricItem[]>(() => deliverySummary.value.metrics);
const templateCategories = computed(() => ["全部", ...Array.from(new Set(getAllPageTemplates().map((template) => template.category)))]);
const pageStartTemplates = computed<TemplateListItem[]>(() =>
  getAllPageTemplates().map((template) => createLowcodeTemplateListItem(template)),
);
const commandPaletteItems = computed<CommandPaletteItem[]>(() => [
  {
    id: "open-page-start-wizard",
    title: "新建页面",
    group: "常用操作",
    description: "从空白页或模板开始搭建新的运营 H5。",
    keywords: ["new", "create", "start", "blank", "template", "新建", "页面", "模板", "空白"],
    run: openPageStartWizard,
  },
  {
    id: "mode-design",
    title: "切换到设计模式",
    group: "视图",
    description: "回到可拖拽和可选中节点的画布。",
    keywords: ["design", "设计", "画布"],
    run: () => {
      editorState.value = setEditorMode(editorState.value, "design");
    },
  },
  {
    id: "mode-preview",
    title: "切换到预览模式",
    group: "视图",
    description: "查看接近用户侧的 H5 页面效果。",
    keywords: ["preview", "预览", "h5"],
    run: () => {
      editorState.value = setEditorMode(editorState.value, "preview");
    },
  },
  {
    id: "mode-outline",
    title: "切换到源码模式",
    group: "视图",
    description: "查看和编辑当前 Page Schema JSON。",
    keywords: ["schema", "json", "源码"],
    run: () => {
      editorState.value = setEditorMode(editorState.value, "outline");
    },
  },
  {
    id: "save-draft",
    title: "保存草稿",
    group: "常用操作",
    description: editorState.value.dirty ? "保存当前页面到本地 mock 配置平台。" : "当前页面已保存。",
    keywords: ["save", "草稿", "保存"],
    run: saveSchema,
  },
  {
    id: "save-template",
    title: "保存为本地模板",
    group: "常用操作",
    description: "把当前页面沉淀为可复用的本地模板。",
    keywords: ["template", "save", "模板", "保存为模板", "复用"],
    run: saveCurrentPageAsLocalTemplate,
  },
  {
    id: "export-schema",
    title: "导出页面 Schema",
    group: "常用操作",
    description: "将当前页面配置下载为 JSON 文件。",
    keywords: ["export", "download", "schema", "json", "导出", "下载"],
    run: exportCurrentSchema,
  },
  {
    id: "import-schema",
    title: "导入页面 Schema",
    group: "常用操作",
    description: "从本地 JSON 文件导入并校验页面配置。",
    keywords: ["import", "upload", "schema", "json", "导入", "上传"],
    run: triggerSchemaImport,
  },
  {
    id: "create-preview",
    title: "生成预览链接",
    group: "常用操作",
    description: "通过发布检查后生成 preview release。",
    keywords: ["preview", "release", "预览链接"],
    disabled: hasPublishBlockingErrors.value,
    run: createPreviewRelease,
  },
  {
    id: "publish-page",
    title: "发布当前页面",
    group: "常用操作",
    description: "通过发布检查后生成 published release。",
    keywords: ["publish", "发布", "上线"],
    disabled: hasPublishBlockingErrors.value,
    run: publishCurrentPage,
  },
  {
    id: "open-runtime",
    title: "打开已发布 H5",
    group: "常用操作",
    description: "用内置 runtime 打开当前 pageId 的页面。",
    keywords: ["runtime", "h5", "打开"],
    run: () => openRuntime(),
  },
  {
    id: "open-react-runtime",
    title: "打开 React H5 预览",
    group: "常用操作",
    description: "把当前 schema 交给 React H5 runtime 渲染。",
    keywords: ["react", "handoff", "h5"],
    run: () => openReactH5Runtime(),
  },
  {
    id: "clear-canvas",
    title: "清空画布",
    group: "常用操作",
    description: "保留页面配置，移除当前所有节点。",
    keywords: ["clear", "blank", "清空", "空白"],
    run: clearCanvas,
  },
  ...materials.map((material): CommandPaletteItem => ({
    id: `material-${material.manifest.componentName}`,
    title: `添加物料：${material.manifest.title}`,
    group: "物料",
    description: `${material.manifest.category} / ${material.manifest.componentName}`,
    keywords: [material.manifest.title, material.manifest.componentName, material.manifest.category],
    run: () => addMaterial(material.manifest),
  })),
  ...getAllPageTemplates().map((template): CommandPaletteItem => ({
    id: `template-${template.id}`,
    title: `应用模板：${template.title}`,
    group: "模板",
    description: `${template.category} / ${template.description}`,
    keywords: [template.title, template.description, template.category, ...(template.tags ?? [])],
    run: () => applyTemplate({ id: template.id }),
  })),
]);
const visibleCommandPaletteItems = computed(() =>
  filterLowcodeEditorCommands(commandPaletteItems.value, { keyword: commandKeyword.value }),
);

watch(
  () => editorState.value.schema,
  (schema) => {
    schemaDraft.value = JSON.stringify(schema, null, 2);
    if (suppressNextAutoSave) {
      suppressNextAutoSave = false;
      return;
    }
    scheduleAutoSave(schema);
  },
);

watch(
  outlineRows,
  () => {
    pruneMultiSelection();
    pruneCollapsedOutlineNodes();
  },
  { immediate: true },
);

watch(
  () => editorState.value.selectedNodeId,
  (nodeId) => {
    revealOutlineNode(nodeId);
  },
  { immediate: true },
);

watch(
  imagePropOptions,
  (options) => {
    if (!options.length) {
      assetTargetPropName.value = "";
      return;
    }
    if (!options.some((option) => option.name === assetTargetPropName.value)) {
      assetTargetPropName.value = options[0]?.name ?? "";
    }
  },
  { immediate: true },
);

watch(
  () => selectedNode.value?.id,
  () => {
    listAssetTarget.value = undefined;
    selectedProductIds.value = getProductIdsFromNode(selectedNode.value);
    selectedCouponIds.value = getIdsFromNodeArrayProp(selectedNode.value, "coupons");
    selectedStoreExpertIds.value = getIdsFromNodeArrayProp(selectedNode.value, "items");
  },
  { immediate: true },
);

watch(
  [templateKeyword, templateCategory, localCustomTemplates],
  () => {
    void refreshTemplates();
  },
  { immediate: true },
);

watch(
  [assetKeyword, assetCategory],
  () => {
    void refreshImageAssets();
  },
  { immediate: true },
);

watch(
  productKeyword,
  () => {
    void refreshProducts();
  },
  { immediate: true },
);

watch(
  couponKeyword,
  () => {
    void refreshCoupons();
  },
  { immediate: true },
);

watch(
  [storeExpertKeyword, storeExpertCategory],
  () => {
    void refreshStoreExperts();
  },
  { immediate: true },
);

watch(
  () => editorState.value.schema.dataSources,
  () => {
    void refreshPreviewData(editorState.value.schema);
  },
  { deep: true, immediate: true },
);

watch(
  runtimeSchema,
  (schema) => {
    void refreshRuntimePreviewData(schema);
  },
  { immediate: true },
);

onMounted(() => {
  window.addEventListener("pointermove", onPointerCanvasDragMove, { passive: false });
  window.addEventListener("pointerup", onPointerCanvasDragEnd);
  window.addEventListener("pointercancel", onPointerCanvasDragCancel);
  window.addEventListener("keydown", onGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener("pointermove", onPointerCanvasDragMove);
  window.removeEventListener("pointerup", onPointerCanvasDragEnd);
  window.removeEventListener("pointercancel", onPointerCanvasDragCancel);
  window.removeEventListener("keydown", onGlobalKeydown);
  if (autoSaveTimer) window.clearTimeout(autoSaveTimer);
});

function findNode(nodes: LowcodeNode[], nodeId?: string): LowcodeNode | undefined {
  if (!nodeId) return undefined;
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    const child = findNode(node.children ?? [], nodeId);
    if (child) return child;
  }
  return undefined;
}

function getNodeDisplayName(node: LowcodeNode): string {
  return getLowcodeNodeDisplayName(node, registry.get(node.componentName)?.manifest);
}

function commitPlaygroundSchemaChange(schema: LowcodePageSchema, action: string, selectedNodeId?: string): void {
  const state = editorState.value;
  editorState.value = {
    ...state,
    schema,
    selectedNodeId: selectedNodeId ?? state.selectedNodeId,
    history: {
      ...state.history,
      past: [...state.history.past, state.schema].slice(-state.history.limit),
      future: [],
    },
    dirty: true,
    lastAction: action,
  };
}

function scheduleAutoSave(schema: LowcodePageSchema): void {
  if (isRuntimeMode) return;
  if (autoSaveTimer) window.clearTimeout(autoSaveTimer);
  autoSaveStatus.value = "pending";
  autoSaveTimer = window.setTimeout(() => {
    persistLocalDraft(schema);
  }, AUTO_SAVE_DELAY_MS);
}

function persistLocalDraft(schema: LowcodePageSchema): void {
  try {
    const payload = createLowcodeEditorDraftPayload(schema);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    lastAutoSavedAt.value = payload.updatedAt;
    autoSaveStatus.value = "saved";
  } catch {
    autoSaveStatus.value = "error";
  }
}

function loadStoredMaterialComponentNames(key: string): string[] {
  return parseLowcodeMaterialPreferenceContent(window.localStorage.getItem(key), {
    availableComponentNames: availableMaterialComponentNames,
  });
}

function storeMaterialComponentNames(key: string, componentNames: string[]): void {
  window.localStorage.setItem(key, JSON.stringify(componentNames));
}

function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function clonePageSchema(schema: LowcodePageSchema): LowcodePageSchema {
  return JSON.parse(JSON.stringify(schema)) as LowcodePageSchema;
}

function isTemplateResource(value: unknown): value is PageTemplate {
  if (!isUnknownRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.category === "string" &&
    value.status === "published" &&
    validateLowcodePageSchema(value.schema).valid
  );
}

function loadStoredCustomTemplates(): PageTemplate[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CUSTOM_TEMPLATES_KEY) ?? "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter(isTemplateResource) : [];
  } catch {
    return [];
  }
}

function storeCustomTemplates(templates: PageTemplate[]): void {
  window.localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
}

function getAllPageTemplates(): PageTemplate[] {
  const staticTemplates = pageTemplates as unknown as PageTemplate[];
  const templates: PageTemplate[] = [];
  for (const template of localCustomTemplates.value) templates.push(template);
  for (const template of staticTemplates) templates.push(template);
  return templates;
}

function createCurrentTemplateLibraryClient() {
  return createStaticTemplateLibraryClient({
    templates: getAllPageTemplates(),
  });
}

function materialItemsFromComponentNames(componentNames: string[]): typeof materials {
  return pickLowcodeMaterialEntriesByComponentNames(materials, componentNames);
}

function markSchemaPersisted(schema: LowcodePageSchema): void {
  if (autoSaveTimer) {
    window.clearTimeout(autoSaveTimer);
    autoSaveTimer = undefined;
  }
  persistLocalDraft(schema);
  suppressNextAutoSave = true;
}

const templateTags = sliceLowcodeTemplateTags;
const templateVersionText = formatLowcodeTemplateVersion;
const templateSummaryText = formatLowcodeTemplateSummary;

function getSiblingCount(parentId?: string): number {
  if (!parentId) return editorState.value.schema.nodes.length;
  return findNode(editorState.value.schema.nodes, parentId)?.children?.length ?? 0;
}

async function toResourceSearchResult<T>(
  result: LowcodeResourceSearchResult<T> | Promise<LowcodeResourceSearchResult<T>>,
): Promise<LowcodeResourceSearchResult<T>> {
  return Promise.resolve(result);
}

async function refreshTemplates(): Promise<void> {
  const seq = ++templateSearchSeq;
  isTemplateSearching.value = true;
  try {
    const result = await Promise.resolve(createCurrentTemplateLibraryClient().searchTemplates({
      keyword: templateKeyword.value,
      category: templateCategory.value,
      status: "published",
    }));
    if (seq !== templateSearchSeq) return;
    visiblePageTemplates.value = result.items.map((template) => createLowcodeTemplateListItem(template));
  } catch {
    if (seq === templateSearchSeq) visiblePageTemplates.value = [];
  } finally {
    if (seq === templateSearchSeq) isTemplateSearching.value = false;
  }
}

async function refreshImageAssets(): Promise<void> {
  const seq = ++assetSearchSeq;
  isAssetSearching.value = true;
  try {
    const result = await toResourceSearchResult(resourceLibraryClient.searchImageAssets({
      keyword: assetKeyword.value,
      category: assetCategory.value,
    }));
    if (seq !== assetSearchSeq) return;
    filteredAssets.value = result.items;
  } catch {
    if (seq === assetSearchSeq) filteredAssets.value = [];
  } finally {
    if (seq === assetSearchSeq) isAssetSearching.value = false;
  }
}

async function refreshProducts(): Promise<void> {
  const seq = ++productSearchSeq;
  isProductSearching.value = true;
  try {
    const [catalogResult, searchResult] = await Promise.all([
      toResourceSearchResult(resourceLibraryClient.searchProducts()),
      toResourceSearchResult(resourceLibraryClient.searchProducts({ keyword: productKeyword.value })),
    ]);
    if (seq !== productSearchSeq) return;
    resourceProductCatalog.value = catalogResult.items;
    filteredProducts.value = searchResult.items;
  } catch {
    if (seq === productSearchSeq) {
      resourceProductCatalog.value = [];
      filteredProducts.value = [];
    }
  } finally {
    if (seq === productSearchSeq) isProductSearching.value = false;
  }
}

async function refreshCoupons(): Promise<void> {
  const seq = ++couponSearchSeq;
  isCouponSearching.value = true;
  try {
    const searchCoupons = resourceLibraryClient.searchCoupons;
    const [catalogResult, searchResult] = await Promise.all([
      toResourceSearchResult(searchCoupons?.() ?? { items: [], total: 0 }),
      toResourceSearchResult(searchCoupons?.({ keyword: couponKeyword.value }) ?? { items: [], total: 0 }),
    ]);
    if (seq !== couponSearchSeq) return;
    resourceCouponCatalog.value = catalogResult.items;
    filteredCoupons.value = searchResult.items;
  } catch {
    if (seq === couponSearchSeq) {
      resourceCouponCatalog.value = [];
      filteredCoupons.value = [];
    }
  } finally {
    if (seq === couponSearchSeq) isCouponSearching.value = false;
  }
}

async function refreshStoreExperts(): Promise<void> {
  const seq = ++storeExpertSearchSeq;
  isStoreExpertSearching.value = true;
  try {
    const searchStoreExperts = resourceLibraryClient.searchStoreExperts;
    const [catalogResult, searchResult] = await Promise.all([
      toResourceSearchResult(searchStoreExperts?.() ?? { items: [], total: 0 }),
      toResourceSearchResult(searchStoreExperts?.({
        keyword: storeExpertKeyword.value,
        category: storeExpertCategory.value,
      }) ?? { items: [], total: 0 }),
    ]);
    if (seq !== storeExpertSearchSeq) return;
    resourceStoreExpertCatalog.value = catalogResult.items;
    filteredStoreExperts.value = searchResult.items;
  } catch {
    if (seq === storeExpertSearchSeq) {
      resourceStoreExpertCatalog.value = [];
      filteredStoreExperts.value = [];
    }
  } finally {
    if (seq === storeExpertSearchSeq) isStoreExpertSearching.value = false;
  }
}

function resolveSampleProductDataSource(dataSource: LowcodeDataSourceConfig): JsonValue {
  const catalog = resourceProductCatalog.value.length ? resourceProductCatalog.value : sampleProducts;
  const limit = typeof dataSource.params?.limit === "number" ? dataSource.params.limit : catalog.length;
  return catalog.slice(0, limit).map((product) => ({ ...product })) as unknown as JsonValue;
}

function resolveSampleStoreExpertDataSource(dataSource: LowcodeDataSourceConfig): JsonValue {
  const catalog = resourceStoreExpertCatalog.value.length ? resourceStoreExpertCatalog.value : sampleStoreExperts;
  const limit = typeof dataSource.params?.limit === "number" ? dataSource.params.limit : catalog.length;
  return catalog.slice(0, limit).map((item) => ({ ...item })) as unknown as JsonValue;
}

function getIdsFromNodeArrayProp(node: LowcodeNode | undefined, propName: string): string[] {
  const items = node?.props[propName];
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (!item || typeof item !== "object") return undefined;
      const id = (item as { id?: unknown }).id;
      return typeof id === "string" ? id : undefined;
    })
    .filter((id): id is string => Boolean(id));
}

function getProductIdsFromNode(node: LowcodeNode | undefined): string[] {
  return getIdsFromNodeArrayProp(node, "items");
}

async function refreshPreviewData(schema: LowcodePageSchema): Promise<void> {
  const seq = ++previewResolutionSeq;
  isPreviewDataResolving.value = true;
  const result = await resolveLowcodeDataSources(schema.dataSources ?? [], previewDataSourceRegistry);
  if (seq !== previewResolutionSeq) return;
  previewData.value = result.data;
  previewDataSourceRecords.value = result.records;
  isPreviewDataResolving.value = false;
}

async function refreshRuntimePreviewData(schema: LowcodePageSchema): Promise<void> {
  const seq = ++runtimeResolutionSeq;
  isRuntimeDataResolving.value = true;
  const result = await resolveLowcodeDataSources(schema.dataSources ?? [], previewDataSourceRegistry);
  if (seq !== runtimeResolutionSeq) return;
  runtimePreviewData.value = result.data;
  runtimeDataSourceRecords.value = result.records;
  isRuntimeDataResolving.value = false;
}

function runtimeDataStatusText(): string {
  if (isRuntimeDataResolving.value) return "数据解析中";
  const errors = runtimeDataSourceRecords.value.filter((record) => record.status === "error").length;
  if (errors > 0) return `数据源异常 ${errors} 个`;
  return `数据源已解析 ${runtimeDataSourceRecords.value.length} 个`;
}

function createPublishChecks(): PublishCheck[] {
  return createLowcodePublishChecks(editorState.value.schema, {
    materialManifests: materials.map((material) => material.manifest),
    dataSourceRecords: previewDataSourceRecords.value,
  });
}

function getParamString(params: JsonObject | undefined, key: string, fallback: string): string {
  const value = params?.[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function getParamBoolean(params: JsonObject | undefined, key: string, fallback: boolean): boolean {
  const value = params?.[key];
  return typeof value === "boolean" ? value : fallback;
}

function createNodeInput(manifest: LowcodeMaterialManifest) {
  return createLowcodeMaterialNodeInput(manifest, {
    dataBindingByComponentName: materialPreviewDataBindings,
  });
}

function isFavoriteMaterial(componentName: string): boolean {
  return isLowcodeFavoriteMaterial(favoriteMaterialComponentNames.value, componentName);
}

function toggleFavoriteMaterial(manifest: LowcodeMaterialManifest): void {
  const componentName = manifest.componentName;
  const wasFavorited = isLowcodeFavoriteMaterial(favoriteMaterialComponentNames.value, componentName);
  favoriteMaterialComponentNames.value = toggleLowcodeFavoriteMaterial(
    favoriteMaterialComponentNames.value,
    componentName,
    { availableComponentNames: availableMaterialComponentNames },
  );
  storeMaterialComponentNames(MATERIAL_FAVORITES_KEY, favoriteMaterialComponentNames.value);
  materialPreferenceMessage.value = createLowcodeMaterialFavoriteMessage(manifest, !wasFavorited);
}

function recordRecentMaterial(manifest: LowcodeMaterialManifest): void {
  recentMaterialComponentNames.value = recordLowcodeRecentMaterial(
    recentMaterialComponentNames.value,
    manifest.componentName,
    {
      availableComponentNames: availableMaterialComponentNames,
      limit: LOWCODE_EDITOR_RECENT_MATERIAL_DEFAULT_LIMIT,
    },
  );
  storeMaterialComponentNames(MATERIAL_RECENT_KEY, recentMaterialComponentNames.value);
}

function addMaterial(manifest: LowcodeMaterialManifest): void {
  editorState.value = appendNode(editorState.value, createNodeInput(manifest));
  recordRecentMaterial(manifest);
}

function addStarterMaterial(manifest: LowcodeMaterialManifest): void {
  addMaterial(manifest);
  releaseMessage.value = `已添加起步物料：${manifest.title}`;
}

function openMaterialDetail(manifest: LowcodeMaterialManifest): void {
  selectedMaterialDetailManifest.value = manifest;
}

function closeMaterialDetail(): void {
  selectedMaterialDetailManifest.value = undefined;
}

function addMaterialFromDetail(): void {
  const manifest = selectedMaterialDetailManifest.value;
  if (!manifest) return;
  addMaterial(manifest);
  materialPreferenceMessage.value = `已添加物料：${manifest.title}`;
  closeMaterialDetail();
}

function addMaterialToSelectedContainer(manifest: LowcodeMaterialManifest): void {
  if (!selectedNode.value || !selectedNodeIsContainer.value) {
    addMaterial(manifest);
    return;
  }
  editorState.value = insertNode(editorState.value, createNodeInput(manifest), {
    parentId: selectedNode.value.id,
    select: true,
  });
  recordRecentMaterial(manifest);
  showNodeOperationMessage("addInside", { materialTitle: manifest.title });
}

function onMaterialClick(event: MouseEvent, manifest: LowcodeMaterialManifest): void {
  if (consumeSuppressedClick(event)) return;
  addMaterial(manifest);
}

function onOutlineNodeClick(event: MouseEvent, nodeId: string): void {
  if (consumeSuppressedClick(event)) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey) {
    toggleMultiSelected(nodeId);
    return;
  }
  select(nodeId);
  scrollCanvasNodeIntoView(nodeId);
}

function onDragStart(event: DragEvent, manifest: LowcodeMaterialManifest): void {
  event.dataTransfer?.setData(MATERIAL_DRAG_TYPE, manifest.componentName);
  event.dataTransfer?.setData("text/plain", manifest.componentName);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
}

function isMaterialDrag(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes(MATERIAL_DRAG_TYPE);
}

function isNodeDrag(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes(NODE_DRAG_TYPE);
}

function getCanvasDragSource(event: DragEvent): CanvasDragSource | undefined {
  if (isMaterialDrag(event)) return "material";
  if (isNodeDrag(event)) return "node";
  return undefined;
}

function isTouchLikePointer(event: PointerEvent): boolean {
  return event.pointerType === "touch" || event.pointerType === "pen";
}

function startPointerCanvasDrag(
  event: PointerEvent,
  source: CanvasDragSource,
  options: { componentName?: string; nodeId?: string } = {},
): void {
  if (!isTouchLikePointer(event) || editorState.value.mode !== "design") return;
  pointerCanvasDragState.value = {
    pointerId: event.pointerId,
    source,
    startX: event.clientX,
    startY: event.clientY,
    lastX: event.clientX,
    lastY: event.clientY,
    dragging: false,
    componentName: options.componentName,
    nodeId: options.nodeId,
  };
  if (options.nodeId) {
    draggedNodeId.value = options.nodeId;
  }
  const target = event.currentTarget;
  if (target instanceof HTMLElement && typeof target.setPointerCapture === "function") {
    target.setPointerCapture(event.pointerId);
  }
}

function onMaterialPointerDown(event: PointerEvent, manifest: LowcodeMaterialManifest): void {
  startPointerCanvasDrag(event, "material", { componentName: manifest.componentName });
}

function onOutlineNodePointerDown(event: PointerEvent, nodeId: string): void {
  if (isTouchLikePointer(event)) selectNodeForDrag(nodeId);
  startPointerCanvasDrag(event, "node", { nodeId });
}

function onPhoneFramePointerDown(event: PointerEvent): void {
  if (!isTouchLikePointer(event) || editorState.value.mode !== "design") return;
  const nodeElement = getRuntimeNodeElementFromTarget(event.target);
  const nodeId = nodeElement?.dataset.lowcodeNodeId;
  if (!nodeId) return;
  selectNodeForDrag(nodeId);
  startPointerCanvasDrag(event, "node", { nodeId });
}

function pointerDragDistance(state: PointerCanvasDragState, event: PointerEvent): number {
  return Math.hypot(event.clientX - state.startX, event.clientY - state.startY);
}

function onPointerCanvasDragMove(event: PointerEvent): void {
  const state = pointerCanvasDragState.value;
  if (!state || state.pointerId !== event.pointerId) return;
  const distance = pointerDragDistance(state, event);
  if (!state.dragging && distance < POINTER_DRAG_START_DISTANCE) return;

  event.preventDefault();
  pointerCanvasDragState.value = {
    ...state,
    dragging: true,
    lastX: event.clientX,
    lastY: event.clientY,
  };
  if (state.nodeId) draggedNodeId.value = state.nodeId;
  updateCanvasDropHintAtPoint(event, state.source, state.nodeId);
}

function onPointerCanvasDragEnd(event: PointerEvent): void {
  finishPointerCanvasDrag(event, false);
}

function onPointerCanvasDragCancel(event: PointerEvent): void {
  finishPointerCanvasDrag(event, true);
}

function finishPointerCanvasDrag(event: PointerEvent, cancelled: boolean): void {
  const state = pointerCanvasDragState.value;
  if (!state || state.pointerId !== event.pointerId) return;
  const didDrag = state.dragging;
  const point = {
    clientX: event.clientX,
    clientY: event.clientY,
    target: document.elementFromPoint(event.clientX, event.clientY),
  };
  if (didDrag && !cancelled) {
    const hint = canvasDropHint.value ?? updateCanvasDropHintAtPoint(point, state.source, state.nodeId);
    if (state.source === "material" && state.componentName) {
      const material = materials.find((item) => item.manifest.componentName === state.componentName);
      if (material && hint) insertMaterialByDropHint(material.manifest, hint);
    }
    if (state.source === "node" && state.nodeId && hint) {
      moveCanvasNode(state.nodeId, hint);
    }
    suppressFollowingClick();
  }
  pointerCanvasDragState.value = undefined;
  clearCanvasDragState();
}

function suppressFollowingClick(): void {
  suppressNextClick = true;
  window.setTimeout(() => {
    suppressNextClick = false;
  }, 0);
}

function consumeSuppressedClick(event: MouseEvent): boolean {
  if (!suppressNextClick) return false;
  event.preventDefault();
  event.stopPropagation();
  suppressNextClick = false;
  return true;
}

function isNodeMultiSelected(nodeId: string): boolean {
  return isLowcodeNodeSelected(multiSelection.value.selectedNodeIds, nodeId);
}

function canDragSelectedGroup(nodeId: string): boolean {
  return canLowcodeDragSelectedGroup(outlineRows.value, multiSelectedNodeIds.value, nodeId);
}

function toggleMultiSelected(nodeId: string): void {
  multiSelectedNodeIds.value = toggleLowcodeNodeSelection(multiSelectedNodeIds.value, nodeId);
  editorState.value = selectNode(editorState.value, nodeId);
}

function selectNodeForDrag(nodeId: string): void {
  if (isNodeMultiSelected(nodeId)) {
    editorState.value = selectNode(editorState.value, nodeId);
    return;
  }
  select(nodeId);
}

function pruneMultiSelection(): void {
  const nextSelected = pruneLowcodeNodeSelection(
    multiSelectedNodeIds.value,
    outlineRows.value.map((row) => row.node.id),
    { activeNodeId: editorState.value.selectedNodeId },
  );
  if (nextSelected.join("|") !== multiSelectedNodeIds.value.join("|")) {
    multiSelectedNodeIds.value = nextSelected;
  }
}

function findOutlineRowByNodeId(nodeId: string): OutlineRow | undefined {
  return outlineRows.value.find((row) => row.node.id === nodeId);
}

function isOutlineNodeCollapsed(nodeId: string): boolean {
  return collapsedOutlineNodeIdSet.value.has(nodeId);
}

function isOutlineNodeSearchMatched(nodeId: string): boolean {
  return outlineMatchedNodeIdSet.value.has(nodeId);
}

function toggleOutlineCollapse(nodeId: string): void {
  const collapsed = new Set(collapsedOutlineNodeIds.value);
  if (collapsed.has(nodeId)) {
    collapsed.delete(nodeId);
  } else {
    collapsed.add(nodeId);
  }
  collapsedOutlineNodeIds.value = [...collapsed];
}

function startOutlineRename(nodeId: string): void {
  const row = findOutlineRowByNodeId(nodeId);
  if (!row) return;
  select(nodeId);
  outlineRenameDraft.value = getNodeDisplayName(row.node);
  renamingOutlineNodeId.value = nodeId;
  closeNodeContextMenu();
}

function cancelOutlineRename(): void {
  renamingOutlineNodeId.value = undefined;
  outlineRenameDraft.value = "";
}

function commitOutlineRename(): void {
  const nodeId = renamingOutlineNodeId.value;
  if (!nodeId) return;
  renameNode(nodeId, outlineRenameDraft.value);
  cancelOutlineRename();
}

function pruneCollapsedOutlineNodes(): void {
  const nextCollapsed = pruneLowcodeOutlineCollapsedNodeIds(collapsedOutlineNodeIds.value, outlineRows.value);
  if (nextCollapsed.join("|") !== collapsedOutlineNodeIds.value.join("|")) {
    collapsedOutlineNodeIds.value = nextCollapsed;
  }
}

function revealOutlineNode(nodeId?: string): void {
  const nextCollapsed = revealLowcodeOutlineNode(nodeId, collapsedOutlineNodeIds.value, outlineRows.value);
  if (nextCollapsed.join("|") !== collapsedOutlineNodeIds.value.join("|")) {
    collapsedOutlineNodeIds.value = nextCollapsed;
  }
}

function scrollCanvasNodeIntoView(nodeId: string): void {
  void nextTick(() => {
    const nodeElement = phoneFrameRef.value?.querySelector<HTMLElement>(`.mlc-runtime-node[data-lowcode-node-id="${CSS.escape(nodeId)}"]`);
    nodeElement?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  });
}

function locatePublishCheck(check: PublishCheck): void {
  if (!check.nodeId) return;
  const target = findNode(editorState.value.schema.nodes, check.nodeId);
  if (!target) {
    releaseMessage.value = `定位失败：节点 ${check.nodeId} 不存在`;
    return;
  }
  closeNodeContextMenu();
  editorState.value = setEditorMode(selectNode(editorState.value, check.nodeId), "design");
  multiSelectedNodeIds.value = [check.nodeId];
  revealOutlineNode(check.nodeId);
  scrollCanvasNodeIntoView(check.nodeId);
  releaseMessage.value = `已定位：${check.nodeTitle ?? getNodeDisplayName(target)}`;
}

function getRuntimeNodeElementFromTarget(target: EventTarget | null | undefined): HTMLElement | undefined {
  if (!(target instanceof Element)) return undefined;
  return target.closest<HTMLElement>(".mlc-runtime-node[data-lowcode-node-id]") ?? undefined;
}

function getRuntimeNodeElement(point: CanvasDragPoint): HTMLElement | undefined {
  return getRuntimeNodeElementFromTarget(point.target) ?? getRuntimeNodeElementFromTarget(document.elementFromPoint(point.clientX, point.clientY));
}

function isPointInsidePhoneFrame(point: CanvasDragPoint): boolean {
  const frame = phoneFrameRef.value;
  if (!frame) return false;
  const rect = frame.getBoundingClientRect();
  return point.clientX >= rect.left && point.clientX <= rect.right && point.clientY >= rect.top && point.clientY <= rect.bottom;
}

function getCanvasFrameMetrics(): CanvasFrameMetrics | undefined {
  const frame = phoneFrameRef.value;
  if (!frame) return undefined;
  const frameRect = frame.getBoundingClientRect();
  return {
    top: frameRect.top,
    left: frameRect.left,
    scrollTop: frame.scrollTop,
    scrollLeft: frame.scrollLeft,
    clientWidth: frame.clientWidth,
    clientHeight: frame.clientHeight,
    scrollHeight: frame.scrollHeight,
  };
}

function getCanvasElementRect(element: HTMLElement): CanvasRect {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function toCanvasStyle(style: CanvasDropHint["style"]): CSSProperties {
  return style as CSSProperties;
}

function updateCanvasDropHintAtPoint(
  point: CanvasDragPoint,
  source: CanvasDragSource | undefined,
  draggedNodeId?: string,
  options: { allowAppendOutsideFrame?: boolean } = {},
): CanvasDropHint | undefined {
  if (!source) {
    canvasDropHint.value = undefined;
    return undefined;
  }
  const isInsideFrame = isPointInsidePhoneFrame(point);
  if (!isInsideFrame && !options.allowAppendOutsideFrame) {
    canvasDropHint.value = undefined;
    return undefined;
  }
  const nodeElement = isInsideFrame ? getRuntimeNodeElement(point) : undefined;
  const nodeId = nodeElement?.dataset.lowcodeNodeId;
  const node = nodeId ? findNode(editorState.value.schema.nodes, nodeId) : undefined;
  if (source === "node" && isLowcodeInvalidNodeDropTarget(editorState.value.schema.nodes, draggedNodeId, node?.id)) {
    canvasDropHint.value = undefined;
    return undefined;
  }
  if (!node || !nodeElement) {
    canvasDropHint.value = createLowcodeCanvasAppendDropHint(source);
    return canvasDropHint.value;
  }
  const frame = getCanvasFrameMetrics();
  if (!frame) {
    canvasDropHint.value = undefined;
    return undefined;
  }
  const targetRect = getCanvasElementRect(nodeElement);
  const placement = resolveLowcodeCanvasDropPlacement(point, node, targetRect);
  const manifest = registry.get(node.componentName)?.manifest;
  canvasDropHint.value = createLowcodeCanvasTargetDropHint({
    source,
    placement,
    targetNodeId: node.id,
    targetTitle: manifest?.title ?? node.componentName,
    frame,
    targetRect,
  });
  return canvasDropHint.value;
}

function updateCanvasDropHint(event: DragEvent): CanvasDropHint | undefined {
  const source = getCanvasDragSource(event);
  const sourceNodeId = source === "node" ? event.dataTransfer?.getData(NODE_DRAG_TYPE) : undefined;
  return updateCanvasDropHintAtPoint(event, source, sourceNodeId, { allowAppendOutsideFrame: true });
}

function onCanvasDragOver(event: DragEvent): void {
  const source = getCanvasDragSource(event);
  if (!source) return;
  if (event.dataTransfer) event.dataTransfer.dropEffect = source === "material" ? "copy" : "move";
  updateCanvasDropHint(event);
}

function onCanvasDragLeave(event: DragEvent): void {
  const current = event.currentTarget;
  const related = event.relatedTarget;
  if (current instanceof Node && related instanceof Node && current.contains(related)) return;
  canvasDropHint.value = undefined;
}

function clearCanvasDragState(): void {
  canvasDropHint.value = undefined;
  draggedNodeId.value = undefined;
}

function onMaterialDragEnd(): void {
  clearCanvasDragState();
}

function selectedGroupNodeIdsForDrag(seedNodeId: string): string[] {
  return getLowcodeSelectedGroupNodeIdsForDrag(outlineRows.value, multiSelectedNodeIds.value, seedNodeId);
}

function moveCanvasNodeGroup(nodeIds: string[], hint: CanvasDropHint): boolean {
  const result = moveLowcodeCanvasNodeGroupByHint(editorState.value, outlineRows.value, hint, nodeIds);
  if (!result.handled) return false;
  editorState.value = result.state;
  multiSelectedNodeIds.value = nodeIds;
  return true;
}

function moveCanvasNode(nodeId: string, hint: CanvasDropHint): void {
  const groupNodeIds = selectedGroupNodeIdsForDrag(nodeId);
  if (moveCanvasNodeGroup(groupNodeIds, hint)) return;

  const result = moveLowcodeCanvasNodeByHint(editorState.value, outlineRows.value, hint, nodeId);
  editorState.value = result.state;
}

function insertMaterialByDropHint(manifest: LowcodeMaterialManifest, hint: CanvasDropHint): void {
  const result = insertLowcodeCanvasNodeByHint(editorState.value, outlineRows.value, hint, createNodeInput(manifest));
  editorState.value = result.state;
  recordRecentMaterial(manifest);
}

function onCanvasDrop(event: DragEvent): void {
  const source = getCanvasDragSource(event);
  if (source === "node") {
    const nodeId = event.dataTransfer?.getData(NODE_DRAG_TYPE) || draggedNodeId.value;
    const hint = canvasDropHint.value ?? updateCanvasDropHint(event);
    if (nodeId && hint) moveCanvasNode(nodeId, hint);
    clearCanvasDragState();
    return;
  }
  const componentName = event.dataTransfer?.getData(MATERIAL_DRAG_TYPE);
  const material = materials.find((item) => item.manifest.componentName === componentName);
  if (!material) {
    clearCanvasDragState();
    return;
  }
  const hint = canvasDropHint.value ?? updateCanvasDropHint(event);
  if (hint) insertMaterialByDropHint(material.manifest, hint);
  clearCanvasDragState();
}

function onNodeDragStart(event: DragEvent, nodeId: string): void {
  draggedNodeId.value = nodeId;
  event.dataTransfer?.setData(NODE_DRAG_TYPE, nodeId);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
}

function onCanvasNodeDragStart(node: LowcodeNode, event: DragEvent): void {
  selectNodeForDrag(node.id);
  onNodeDragStart(event, node.id);
}

function onCanvasNodeDragEnd(): void {
  clearCanvasDragState();
}

function onNodeDrop(event: DragEvent, target: OutlineRow): void {
  const nodeId = event.dataTransfer?.getData(NODE_DRAG_TYPE) || draggedNodeId.value;
  if (!nodeId) return;
  if (target.node.id === nodeId) return;
  moveCanvasNode(nodeId, {
    source: "node",
    placement: "before",
    targetNodeId: target.node.id,
    targetTitle: registry.get(target.node.componentName)?.manifest.title ?? target.node.componentName,
    style: {},
    guides: [],
  });
  draggedNodeId.value = undefined;
}

function moveSelected(offset: number): void {
  const row = selectedOutlineRow.value;
  if (!row) return;
  const nextIndex = row.index + offset;
  if (nextIndex < 0 || nextIndex >= getSiblingCount(row.parentId)) return;
  const action = offset < 0 ? "moveUp" : "moveDown";
  editorState.value = moveNodeById(editorState.value, {
    nodeId: row.node.id,
    targetParentId: row.parentId,
    index: nextIndex,
  });
  showNodeOperationMessage(action, { nodeTitle: getNodeDisplayName(row.node) });
}

function bindSelectedProductMaterialToDataSource(): void {
  if (!selectedNode.value) return;
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      nodes: updateNodeById(editorState.value.schema.nodes, selectedNode.value.id, (node) => ({
        ...node,
        dataBinding: {
          ...(node.dataBinding ?? {}),
          items: "products",
        },
      })),
    },
    dirty: true,
    lastAction: "bindSelectedProductMaterialToDataSource",
  };
}

function bindSelectedStoreExpertMaterialToDataSource(): void {
  if (!selectedNode.value || !isStoreExpertMaterialSelected.value) return;
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      nodes: updateNodeById(editorState.value.schema.nodes, selectedNode.value.id, (node) => ({
        ...node,
        dataBinding: {
          ...(node.dataBinding ?? {}),
          items: "stores",
        },
      })),
      dataSources: upsertLowcodeDataSourceConfigs(editorState.value.schema.dataSources ?? [], {
        id: "ds_stores",
        type: "store.byIds",
        bindTo: "stores",
        params: {
          limit: 4,
        },
        cache: {
          ttlSeconds: 120,
          scope: "public",
        },
      }),
    },
    dirty: true,
    lastAction: "bindSelectedStoreExpertMaterialToDataSource",
  };
}

function toggleProductSelection(productId: string): void {
  const selected = new Set(selectedProductIds.value);
  if (selected.has(productId)) {
    selected.delete(productId);
  } else {
    selected.add(productId);
  }
  selectedProductIds.value = [...selected];
}

function toggleCouponSelection(couponId: string): void {
  if (isCouponSectionSelected.value) {
    selectedCouponIds.value = selectedCouponIds.value.includes(couponId) ? [] : [couponId];
    return;
  }
  const selected = new Set(selectedCouponIds.value);
  if (selected.has(couponId)) {
    selected.delete(couponId);
  } else {
    selected.add(couponId);
  }
  selectedCouponIds.value = [...selected];
}

function toggleStoreExpertSelection(itemId: string): void {
  const selected = new Set(selectedStoreExpertIds.value);
  if (selected.has(itemId)) {
    selected.delete(itemId);
  } else {
    selected.add(itemId);
  }
  selectedStoreExpertIds.value = [...selected];
}

function applySelectedProductsToNode(): void {
  if (!selectedNode.value || !isProductMaterialSelected.value) return;
  const items = selectedProducts.value.map((product) => ({ ...product })) as unknown as JsonValue;
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      nodes: updateNodeById(editorState.value.schema.nodes, selectedNode.value.id, (node) => {
        const dataBinding = { ...(node.dataBinding ?? {}) };
        delete dataBinding.items;
        return {
          ...node,
          props: {
            ...node.props,
            items,
          },
          dataBinding: Object.keys(dataBinding).length ? dataBinding : undefined,
        };
      }),
    },
    dirty: true,
    lastAction: "applySelectedProductsToNode",
  };
}

function applySelectedCouponsToNode(): void {
  if (!selectedNode.value || !canUseCouponLibrary.value) return;
  const coupons = selectedCoupons.value.map((coupon) => ({ ...coupon })) as unknown as JsonValue[];
  const primaryCoupon = selectedCoupons.value[0];
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      nodes: updateNodeById(editorState.value.schema.nodes, selectedNode.value.id, (node) => {
        if (node.componentName === "CouponSection") {
          if (!primaryCoupon) return node;
          return {
            ...node,
            props: {
              ...node.props,
              title: primaryCoupon.title,
              buttonText: primaryCoupon.buttonText ?? node.props.buttonText ?? "立即领取",
            },
          };
        }
        return {
          ...node,
          props: {
            ...node.props,
            coupons,
          },
        };
      }),
    },
    dirty: true,
    lastAction: "applySelectedCouponsToNode",
  };
}

function applySelectedStoreExpertsToNode(): void {
  if (!selectedNode.value || !isStoreExpertMaterialSelected.value) return;
  const items = selectedStoreExperts.value.map((item) => ({ ...item })) as unknown as JsonValue;
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      nodes: updateNodeById(editorState.value.schema.nodes, selectedNode.value.id, (node) => {
        const dataBinding = { ...(node.dataBinding ?? {}) };
        delete dataBinding.items;
        return {
          ...node,
          props: {
            ...node.props,
            items,
          },
          dataBinding: Object.keys(dataBinding).length ? dataBinding : undefined,
        };
      }),
    },
    dirty: true,
    lastAction: "applySelectedStoreExpertsToNode",
  };
}

function clearSelectedProducts(): void {
  selectedProductIds.value = [];
  applySelectedProductsToNode();
}

function clearSelectedCoupons(): void {
  selectedCouponIds.value = [];
  applySelectedCouponsToNode();
}

function clearSelectedStoreExperts(): void {
  selectedStoreExpertIds.value = [];
  applySelectedStoreExpertsToNode();
}

function isRecord(value: unknown): value is Record<string, JsonValue> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function getPropArray(propName: string): JsonValue[] {
  const value = selectedNode.value?.props[propName];
  return Array.isArray(value) ? ([...value] as JsonValue[]) : [];
}

function toEditableListItem(value: JsonValue): Record<string, JsonValue> {
  return isRecord(value) ? { ...value } : { value };
}

function togglePropGroup(key: PropGroupKey): void {
  collapsedPropGroups.value = toggleLowcodePropGroupCollapsed(collapsedPropGroups.value, key);
}

function openListAssetPicker(propName: string, propSchema: LowcodePropSchema, itemIndex: number, field: ListEditorField): void {
  listAssetTarget.value = {
    propName,
    propSchema,
    itemIndex,
    fieldName: field.name,
    fieldLabel: field.label,
  };
  void refreshImageAssets();
}

function closeListAssetPicker(): void {
  listAssetTarget.value = undefined;
}

function createDefaultListItem(propName: string): JsonObject {
  return createLowcodeDefaultListItem(propName, {
    componentName: selectedNode.value?.componentName,
    targetNodeId: selectedNode.value?.id,
  });
}

function updateListProp(propName: string, propSchema: LowcodePropSchema, items: JsonValue[]): void {
  updateProp(propName, propSchema, items);
}

function addListItem(propName: string, propSchema: LowcodePropSchema): void {
  updateListProp(propName, propSchema, [...getPropArray(propName), createDefaultListItem(propName)]);
}

function duplicateListItem(propName: string, propSchema: LowcodePropSchema, index: number): void {
  const items = getPropArray(propName);
  const source = items[index];
  if (source === undefined) return;
  const copy = isRecord(source) ? { ...source, id: `${String(source.id ?? propName)}_copy_${Date.now().toString(36)}` } : source;
  items.splice(index + 1, 0, copy as JsonValue);
  updateListProp(propName, propSchema, items);
}

function removeListItem(propName: string, propSchema: LowcodePropSchema, index: number): void {
  const items = getPropArray(propName);
  items.splice(index, 1);
  updateListProp(propName, propSchema, items);
}

function moveListItem(propName: string, propSchema: LowcodePropSchema, index: number, offset: -1 | 1): void {
  const items = getPropArray(propName);
  const targetIndex = index + offset;
  if (targetIndex < 0 || targetIndex >= items.length) return;
  const [item] = items.splice(index, 1);
  if (item === undefined) return;
  items.splice(targetIndex, 0, item);
  updateListProp(propName, propSchema, items);
}

function reorderListItem(propName: string, propSchema: LowcodePropSchema, fromIndex: number, toIndex: number): void {
  const items = getPropArray(propName);
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) return;
  const [item] = items.splice(fromIndex, 1);
  if (item === undefined) return;
  items.splice(toIndex, 0, item);
  updateListProp(propName, propSchema, items);
}

function onListItemDragStart(event: DragEvent, propName: string, index: number): void {
  listItemDragState.value = { propName, fromIndex: index, overIndex: index };
  event.dataTransfer?.setData(LIST_ITEM_DRAG_TYPE, JSON.stringify({ propName, index }));
  event.dataTransfer?.setData("text/plain", `${propName}:${index}`);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
}

function onListItemDragOver(event: DragEvent, propName: string, index: number): void {
  const state = listItemDragState.value;
  if (!state || state.propName !== propName) return;
  event.preventDefault();
  listItemDragState.value = { ...state, overIndex: index };
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
}

function onListItemDrop(event: DragEvent, propName: string, propSchema: LowcodePropSchema, index: number): void {
  const state = listItemDragState.value;
  if (!state || state.propName !== propName) return;
  event.preventDefault();
  reorderListItem(propName, propSchema, state.fromIndex, index);
  listItemDragState.value = undefined;
}

function onListItemDragEnd(): void {
  listItemDragState.value = undefined;
}

function updateListItemField(propName: string, propSchema: LowcodePropSchema, index: number, fieldName: string, value: string): void {
  const items = getPropArray(propName);
  const current = toEditableListItem(items[index] ?? {});
  items[index] = {
    ...current,
    [fieldName]: value,
  };
  updateListProp(propName, propSchema, items);
}

function updateNodeById(nodes: LowcodeNode[], nodeId: string, updater: (node: LowcodeNode) => LowcodeNode): LowcodeNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) return updater(node);
    if (!node.children?.length) return node;
    return {
      ...node,
      children: updateNodeById(node.children, nodeId, updater),
    };
  });
}

function renameNode(nodeId: string, name: string): void {
  const trimmedName = name.trim();
  commitPlaygroundSchemaChange(
    {
      ...editorState.value.schema,
      nodes: updateNodeById(editorState.value.schema.nodes, nodeId, (node) => ({
        ...node,
        meta: {
          ...(node.meta ?? {}),
          name: trimmedName || undefined,
          updatedAt: new Date().toISOString(),
        },
      })),
    },
    "renameNode",
    nodeId,
  );
}

function renameSelectedNode(name: string): void {
  if (!selectedNode.value) return;
  renameNode(selectedNode.value.id, name);
}

function updateProp(propName: string, propSchema: LowcodePropSchema, value: unknown): void {
  if (!selectedNode.value) return;
  editorState.value = replaceNodeProps(editorState.value, selectedNode.value.id, {
    ...selectedNode.value.props,
    [propName]: normalizeInputValue(propSchema, value),
  });
}

function normalizeInputValue(propSchema: LowcodePropSchema, value: unknown): JsonValue {
  return normalizeLowcodePropInputValue(propSchema, value);
}

function select(nodeId: string): void {
  editorState.value = selectNode(editorState.value, nodeId);
  multiSelectedNodeIds.value = [nodeId];
}

function isNodeOperationDisabled(action: NodeContextAction): boolean {
  return Boolean(nodeOperationItemMap.value.get(action)?.disabled);
}

function showNodeOperationMessage(
  action: Parameters<typeof createLowcodeNodeOperationMessage>[0],
  options: Parameters<typeof createLowcodeNodeOperationMessage>[1] = {},
): void {
  releaseMessage.value = createLowcodeNodeOperationMessage(action, options);
}

function removeSelected(): void {
  if (!selectedNode.value) return;
  const nodeTitle = selectedNodeDisplayName.value;
  editorState.value = removeNode(editorState.value, selectedNode.value.id);
  showNodeOperationMessage("delete", { nodeTitle });
  closeNodeContextMenu();
}

function duplicateSelected(): void {
  if (!selectedNode.value) return;
  const nodeTitle = selectedNodeDisplayName.value;
  editorState.value = duplicateNode(editorState.value, selectedNode.value.id);
  showNodeOperationMessage("duplicate", { nodeTitle });
}

function copySelected(): void {
  if (!selectedNode.value) return;
  editorState.value = copyNode(editorState.value, selectedNode.value.id);
  showNodeOperationMessage("copy", { nodeTitle: selectedNodeDisplayName.value });
}

function pasteCopied(): void {
  editorState.value = pasteNode(editorState.value);
  showNodeOperationMessage("paste");
}

function clampContextMenuPosition(event: MouseEvent): Pick<NodeContextMenuState, "x" | "y"> {
  const menuWidth = 224;
  const menuHeight = 360;
  const gap = 10;
  return {
    x: Math.max(gap, Math.min(event.clientX, window.innerWidth - menuWidth - gap)),
    y: Math.max(gap, Math.min(event.clientY, window.innerHeight - menuHeight - gap)),
  };
}

function openNodeContextMenu(event: MouseEvent, nodeId: string): void {
  if (!findOutlineRowByNodeId(nodeId)) return;
  event.preventDefault();
  event.stopPropagation();
  select(nodeId);
  nodeContextMenu.value = {
    nodeId,
    ...clampContextMenuPosition(event),
  };
}

function closeNodeContextMenu(): void {
  nodeContextMenu.value = undefined;
}

function applyH5ViewportPreset(preset: LowcodeEditorViewportPreset): void {
  editorState.value = setEditorViewportPreset(editorState.value, preset);
}

function onCanvasContextMenu(event: MouseEvent): void {
  if (editorState.value.mode !== "design") return;
  const nodeElement = getRuntimeNodeElementFromTarget(event.target);
  const nodeId = nodeElement?.dataset.lowcodeNodeId;
  if (!nodeId) return;
  openNodeContextMenu(event, nodeId);
}

function openSelectedNodeContextMenu(event: MouseEvent): void {
  if (!selectedNode.value) return;
  openNodeContextMenu(event, selectedNode.value.id);
}

function runNodeContextMenuAction(item: NodeContextMenuItem): void {
  if (item.disabled) return;
  switch (item.action) {
    case "rename":
      if (selectedNode.value) {
        startOutlineRename(selectedNode.value.id);
        showNodeOperationMessage("rename", { nodeTitle: selectedNodeDisplayName.value });
      }
      return;
    case "insertBefore":
      insertMaterialAroundSelected("before");
      break;
    case "insertAfter":
      insertMaterialAroundSelected("after");
      break;
    case "addInside":
      insertMaterialInsideSelectedContainer();
      break;
    case "moveUp":
      moveSelected(-1);
      break;
    case "moveDown":
      moveSelected(1);
      break;
    case "copy":
      copySelected();
      break;
    case "paste":
      pasteCopied();
      break;
    case "duplicate":
      duplicateSelected();
      break;
    case "delete":
      removeSelected();
      break;
  }
  closeNodeContextMenu();
}

function insertMaterialAroundSelected(placement: "before" | "after"): void {
  const row = selectedOutlineRow.value;
  const manifest = selectedInsertManifest.value;
  if (!manifest) return;
  if (!row) {
    addMaterial(manifest);
    showNodeOperationMessage(placement === "before" ? "insertBefore" : "insertAfter", {
      materialTitle: manifest.title,
    });
    return;
  }
  editorState.value = insertNode(editorState.value, createNodeInput(manifest), {
    parentId: row.parentId,
    index: placement === "before" ? row.index : row.index + 1,
    select: true,
  });
  recordRecentMaterial(manifest);
  showNodeOperationMessage(placement === "before" ? "insertBefore" : "insertAfter", {
    materialTitle: manifest.title,
  });
}

function insertMaterialInsideSelectedContainer(): void {
  const manifest = selectedInsertManifest.value;
  if (!manifest) return;
  addMaterialToSelectedContainer(manifest);
}

function resetSchema(): void {
  window.localStorage.removeItem(STORAGE_KEY);
  editorState.value = createLowcodePageStartState((pageTemplates[0] as PageTemplate).schema, {
    dirty: false,
    lastAction: "resetSchema",
  });
  schemaDraft.value = JSON.stringify(editorState.value.schema, null, 2);
  releaseMessage.value = "已重置为示例页面";
  refreshReleases();
}

function openPageStartWizard(): void {
  closeCommandPalette();
  closeMaterialDetail();
  pageStartWizardOpen.value = true;
}

function closePageStartWizard(): void {
  pageStartWizardOpen.value = false;
}

function createBlankPageFromWizard(): void {
  if (editorState.value.dirty && !window.confirm("当前页面有未保存修改，确认新建空白页面并替换当前页面吗？")) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
  editorState.value = createLowcodePageStartState(createLowcodeBlankPageSchema(), {
    mode: "design",
    viewport: editorState.value.viewport,
    dirty: true,
    lastAction: "createBlankPage",
  });
  schemaDraft.value = JSON.stringify(editorState.value.schema, null, 2);
  jsonError.value = "";
  multiSelectedNodeIds.value = [];
  collapsedOutlineNodeIds.value = [];
  releaseMessage.value = "已创建空白 H5 页面";
  closePageStartWizard();
  refreshReleases();
}

function clearCanvas(): void {
  if (editorState.value.schema.nodes.length && !window.confirm("确认清空当前画布吗？")) return;
  commitPlaygroundSchemaChange(
    {
      ...editorState.value.schema,
      nodes: [],
    },
    "clearCanvas",
    undefined,
  );
  editorState.value = {
    ...editorState.value,
    selectedNodeId: undefined,
  };
  multiSelectedNodeIds.value = [];
  releaseMessage.value = "已清空画布";
}

function openCommandPalette(): void {
  closePageStartWizard();
  closeMaterialDetail();
  commandKeyword.value = "";
  commandPaletteOpen.value = true;
  void nextTick(() => {
    commandPaletteRef.value?.focusSearchInput();
  });
}

function closeCommandPalette(): void {
  commandPaletteOpen.value = false;
}

async function executeCommandPaletteItem(item: EditorCommandPaletteItem): Promise<void> {
  if (item.disabled) return;
  await Promise.resolve(item.run());
  closeCommandPalette();
}

async function executeFirstCommandPaletteItem(): Promise<void> {
  const first = visibleCommandPaletteItems.value.find((item) => !item.disabled);
  if (first) await executeCommandPaletteItem(first);
}

function isEditableKeyboardTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select" || target.isContentEditable;
}

function onGlobalKeydown(event: KeyboardEvent): void {
  if (isRuntimeMode) return;
  if (event.key === "Escape" && nodeContextMenu.value) {
    event.preventDefault();
    closeNodeContextMenu();
    return;
  }
  if (event.key === "Escape" && commandPaletteOpen.value) {
    event.preventDefault();
    closeCommandPalette();
    return;
  }
  if (event.key === "Escape" && pageStartWizardOpen.value) {
    event.preventDefault();
    closePageStartWizard();
    return;
  }
  if (event.key === "Escape" && selectedMaterialDetailManifest.value) {
    event.preventDefault();
    closeMaterialDetail();
    return;
  }
  if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
    if (isEditableKeyboardTarget(event.target)) return;
    event.preventDefault();
    if (commandPaletteOpen.value) {
      closeCommandPalette();
    } else {
      openCommandPalette();
    }
    return;
  }
  handleEditorNodeShortcut(event);
}

function handleEditorNodeShortcut(event: KeyboardEvent): void {
  if (commandPaletteOpen.value || isEditableKeyboardTarget(event.target)) return;
  const shortcutAction = resolveLowcodeNodeShortcutAction(event, {
    hasSelectedNode: Boolean(selectedNode.value),
    canPaste: Boolean(editorState.value.clipboard),
  });
  if (!shortcutAction) return;

  event.preventDefault();
  switch (shortcutAction) {
    case "delete":
      removeSelected();
      return;
    case "copy":
      copySelected();
      return;
    case "paste":
      pasteCopied();
      return;
    case "duplicate":
      duplicateSelected();
      return;
    case "undo":
      editorState.value = undo(editorState.value);
      showNodeOperationMessage("undo");
      return;
    case "redo":
      editorState.value = redo(editorState.value);
      showNodeOperationMessage("redo");
  }
}

async function applyTemplate(template: Pick<LowcodeTemplateResource, "id">, onApplied?: () => void): Promise<void> {
  if (editorState.value.dirty && !window.confirm("当前页面有未保存修改，确认应用模板并替换当前页面吗？")) {
    return;
  }
  const templateDetail = await Promise.resolve(createCurrentTemplateLibraryClient().getTemplate(template.id));
  if (!templateDetail) {
    releaseMessage.value = "模板不存在或已下架";
    return;
  }
  editorState.value = createLowcodePageStartState(templateDetail.schema, {
    mode: editorState.value.mode,
    viewport: editorState.value.viewport,
    dirty: false,
    lastAction: "applyTemplate",
  });
  const schema = editorState.value.schema;
  window.localStorage.removeItem(STORAGE_KEY);
  schemaDraft.value = JSON.stringify(schema, null, 2);
  jsonError.value = "";
  releaseMessage.value = `已应用模板：${templateDetail.title}`;
  onApplied?.();
  refreshReleases();
}

async function applyTemplateFromStartWizard(template: Pick<LowcodeTemplateResource, "id">): Promise<void> {
  await applyTemplate(template, closePageStartWizard);
}

async function previewTemplate(template: Pick<LowcodeTemplateResource, "id">): Promise<void> {
  const templateDetail = await Promise.resolve(createCurrentTemplateLibraryClient().getTemplate(template.id));
  if (!templateDetail) {
    releaseMessage.value = "模板不存在或已下架";
    return;
  }
  openReactH5Runtime(templateDetail.schema);
  releaseMessage.value = `已打开模板 H5 预览：${templateDetail.title}`;
}

function saveCurrentPageAsLocalTemplate(): void {
  const schema = clonePageSchema(editorState.value.schema);
  const now = new Date().toISOString();
  const title = `${schema.title || "未命名 H5 页面"} 模板`;
  const template: PageTemplate = {
    id: `local-template-${Date.now().toString(36)}`,
    title,
    description: "从当前页面保存的本地自定义模板。",
    category: "本地模板",
    status: "published",
    tags: ["本地", "自定义"],
    version: "local",
    updatedAt: now,
    schema,
  };
  localCustomTemplates.value = [template, ...localCustomTemplates.value].slice(0, 20);
  storeCustomTemplates(localCustomTemplates.value);
  templateCategory.value = "全部";
  templateKeyword.value = title;
  releaseMessage.value = `已保存本地模板：${title}`;
  closeCommandPalette();
  void refreshTemplates();
}

function applyJson(): void {
  try {
    const parsed = JSON.parse(schemaDraft.value) as unknown;
    const result = validateLowcodePageSchema(parsed);
    if (!result.valid) {
      jsonError.value = result.errors.join("；");
      return;
    }
    replaceCurrentSchema(parsed as LowcodePageSchema, "applyJson", {
      mode: editorState.value.mode,
      message: "已应用源码 JSON",
    });
    jsonError.value = "";
  } catch (error) {
    jsonError.value = error instanceof Error ? error.message : "JSON 解析失败";
  }
}

function replaceCurrentSchema(
  schema: LowcodePageSchema,
  action: string,
  options: { mode?: LowcodeEditorState["mode"]; message?: string } = {},
): void {
  editorState.value = {
    ...createEditorState(schema, {
      selectedNodeId: schema.nodes[0]?.id,
      mode: options.mode ?? "design",
      viewport: editorState.value.viewport,
    }),
    dirty: true,
    lastAction: action,
  };
  schemaDraft.value = JSON.stringify(schema, null, 2);
  jsonError.value = "";
  multiSelectedNodeIds.value = [];
  collapsedOutlineNodeIds.value = [];
  if (options.message) releaseMessage.value = options.message;
  refreshReleases();
}

function updatePageTitle(value: string): void {
  editorState.value = updateLowcodePageTitle(editorState.value, value);
}

function updatePageDescription(value: string): void {
  editorState.value = updateLowcodePageDescription(editorState.value, value);
}

function updatePageStatus(status: LowcodePageStatus): void {
  editorState.value = updateLowcodePageStatus(editorState.value, status);
}

function updatePageType(pageType: LowcodePageType): void {
  editorState.value = updateLowcodePageType(editorState.value, pageType);
}

function updatePublishEnvironment(environment: LowcodeEnvironment): void {
  editorState.value = updateLowcodePublishEnvironment(editorState.value, environment);
}

function updatePageBackgroundColor(backgroundColor: string): void {
  editorState.value = updateLowcodePageBackgroundColor(editorState.value, backgroundColor);
}

function updatePageSafeArea(safeArea: boolean): void {
  editorState.value = updateLowcodePageSafeArea(editorState.value, safeArea);
}

function updatePageMaxWidth(value: string): void {
  editorState.value = updateLowcodePageMaxWidth(editorState.value, value);
}

function addDataSource(): void {
  editorState.value = addLowcodeDataSource(editorState.value, "custom.http", {
    typeOptions: dataSourceTypeOptions,
  });
}

function updateDataSource(index: number, patch: Parameters<typeof updateLowcodeDataSource>[2]): void {
  editorState.value = updateLowcodeDataSource(editorState.value, index, patch);
}

function updateDataSourceParams(index: number, value: string): void {
  try {
    updateDataSource(index, { params: JSON.parse(value) as JsonObject });
    jsonError.value = "";
  } catch {
    jsonError.value = "数据源参数不是合法 JSON";
  }
}

function removeDataSource(index: number): void {
  editorState.value = removeLowcodeDataSource(editorState.value, index);
}

function addAction(type = "navigate"): void {
  editorState.value = addLowcodeAction(editorState.value, type, {
    typeOptions: actionTypeOptions,
  });
}

function updateAction(index: number, patch: Parameters<typeof updateLowcodeAction>[2]): void {
  editorState.value = updateLowcodeAction(editorState.value, index, patch);
}

function updateActionId(index: number, nextId: string): void {
  editorState.value = renameLowcodeAction(editorState.value, index, nextId);
}

function updateActionType(index: number, type: string): void {
  editorState.value = setLowcodeActionType(editorState.value, index, type, {
    typeOptions: actionTypeOptions,
  });
}

function updateActionParams(index: number, value: string): void {
  try {
    updateAction(index, { params: JSON.parse(value) as JsonObject });
    jsonError.value = "";
  } catch {
    jsonError.value = "动作参数不是合法 JSON";
  }
}

function removeAction(index: number): void {
  editorState.value = removeLowcodeAction(editorState.value, index);
}

function bindSelectedEvent(eventName: string, actionId: string): void {
  if (!selectedNode.value) return;
  editorState.value = bindLowcodeNodeEvent(editorState.value, selectedNode.value.id, eventName, actionId || undefined);
}

function applyAsset(propName: string, url: string): void {
  const manifest = selectedManifest.value;
  const propSchema = manifest?.propsSchema[propName];
  if (!propSchema) return;
  updateProp(propName, propSchema, url);
}

function applyAssetToSelected(asset: LowcodeImageAssetResource): void {
  if (!assetTargetPropName.value) return;
  applyAsset(assetTargetPropName.value, asset.url);
}

function applyAssetToListTarget(asset: LowcodeImageAssetResource): void {
  const target = listAssetTarget.value;
  if (!target) return;
  if (target.itemIndex < 0 || target.itemIndex >= getPropArray(target.propName).length) {
    listAssetTarget.value = undefined;
    return;
  }
  updateListItemField(target.propName, target.propSchema, target.itemIndex, target.fieldName, asset.url);
  releaseMessage.value = `已应用图片素材：${asset.title}`;
  listAssetTarget.value = undefined;
}

function applySampleProducts(): void {
  const catalog = resourceProductCatalog.value.length ? resourceProductCatalog.value : sampleProducts;
  selectedProductIds.value = catalog.slice(0, 3).map((product) => product.id);
  applySelectedProductsToNode();
}

function refreshReleases(): void {
  releases.value = configPlatformClient.listReleases(editorState.value.schema.pageId);
  if (!releases.value.some((release) => release.id === selectedReleaseId.value)) {
    selectedReleaseId.value = releases.value[0]?.id ?? "";
  }
}

function resolveRuntimeSchema(): LowcodePageSchema | undefined {
  const releaseId = runtimeQuery.get("releaseId");
  if (releaseId) return configPlatformClient.getRelease(releaseId)?.schema;
  const pageId = runtimeQuery.get("pageId") || editorState.value.schema.pageId;
  return configPlatformClient.getPublished(pageId) ?? configPlatformClient.getDraft(pageId);
}

function createRuntimeUrl(params: { pageId?: string; releaseId?: string }): string {
  const url = new URL(window.location.href);
  url.hash = "";
  url.search = "";
  url.searchParams.set("runtime", "1");
  if (params.releaseId) url.searchParams.set("releaseId", params.releaseId);
  if (params.pageId) url.searchParams.set("pageId", params.pageId);
  return url.toString();
}

function openRuntime(params: { pageId?: string; releaseId?: string } = { pageId: editorState.value.schema.pageId }): void {
  window.open(createRuntimeUrl(params), "_blank", "noopener,noreferrer");
}

function createReactH5RuntimeUrl(schema: LowcodePageSchema): string {
  const url = new URL(REACT_H5_RUNTIME_URL, window.location.href);
  url.searchParams.set("schema", encodePageSchemaToUrlParam(schema));
  url.searchParams.set("source", "editor");
  return url.toString();
}

function openReactH5Runtime(schema: LowcodePageSchema = editorState.value.schema): void {
  window.open(createReactH5RuntimeUrl(schema), "_blank", "noopener,noreferrer");
}

function exportCurrentSchema(): void {
  closeCommandPalette();
  const schema = editorState.value.schema;
  const exported = createLowcodeSchemaFileExport(schema);
  const blob = new Blob([exported.content], { type: exported.mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = exported.filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
  schemaTransferMessage.value = `已导出页面 Schema：${schema.title || schema.pageId}（${exported.sizeText}）`;
  releaseMessage.value = schemaTransferMessage.value;
}

async function copyCurrentSchema(): Promise<void> {
  try {
    await copyTextToClipboard(deliverySchemaJson.value);
    schemaTransferMessage.value = `已复制页面 Schema：${editorState.value.schema.title || editorState.value.schema.pageId}`;
    releaseMessage.value = schemaTransferMessage.value;
  } catch {
    releaseMessage.value = "复制失败：请从源码区手动复制 Schema";
  }
}

function triggerSchemaImport(): void {
  closeCommandPalette();
  schemaFileInputRef.value?.click();
}

async function onSchemaFileChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;

  try {
    const raw = await file.text();
    const result = parseLowcodeSchemaFileContent(raw);
    if (!result.ok) {
      const message = `导入失败：${result.error}`;
      schemaTransferMessage.value = "";
      jsonError.value = message;
      releaseMessage.value = message;
      return;
    }
    if (editorState.value.dirty && !window.confirm("当前页面有未保存修改，确认导入文件并替换当前页面吗？")) {
      schemaTransferMessage.value = "已取消导入 Schema";
      return;
    }
    const schema = result.schema;
    replaceCurrentSchema(schema, "importSchema", {
      mode: "design",
      message: `已导入页面 Schema：${schema.title || schema.pageId}`,
    });
    schemaTransferMessage.value = releaseMessage.value;
  } catch (error) {
    const message = `导入失败：${error instanceof Error ? error.message : "JSON 解析失败"}`;
    schemaTransferMessage.value = "";
    jsonError.value = message;
    releaseMessage.value = message;
  }
}

function openPreviewLink(item: PreviewLinkItem): void {
  if (!item.openable) return;
  window.open(item.url, "_blank", "noopener,noreferrer");
}

async function copyPreviewLink(item: PreviewLinkItem): Promise<void> {
  if (!item.copyable) return;
  try {
    await copyTextToClipboard(item.url);
    releaseMessage.value = `已复制预览链接：${item.title}`;
  } catch {
    releaseMessage.value = `复制失败：请手动复制 ${item.title}`;
  }
}

async function copyTextToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // 本地非安全上下文下退回 textarea 复制。
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!copied) {
    throw new Error("copy failed");
  }
}

function setReleaseMessage(release: LocalPageRelease, action: string): void {
  releaseMessage.value = createLowcodeReleaseMessage(release, action);
}

function ensurePublishReady(action: string): boolean {
  const blockingErrors = publishChecks.value.filter((check) => check.status === "error");
  if (!blockingErrors.length) return true;
  releaseMessage.value = createLowcodePublishBlockedMessage(action, blockingErrors);
  return false;
}

function saveSchema(): void {
  const release = configPlatformClient.saveDraft(editorState.value.schema, { note: releaseNoteDraft.value });
  releaseNoteDraft.value = "";
  markSchemaPersisted(release.schema);
  editorState.value = markSaved(createEditorState(release.schema, {
    selectedNodeId: editorState.value.selectedNodeId,
    mode: editorState.value.mode,
    viewport: editorState.value.viewport,
  }));
  schemaDraft.value = JSON.stringify(release.schema, null, 2);
  refreshReleases();
  setReleaseMessage(release, "已保存草稿");
}

function createPreviewRelease(): void {
  if (!ensurePublishReady("生成预览")) return;
  const release = configPlatformClient.createPreview(editorState.value.schema, { note: releaseNoteDraft.value });
  releaseNoteDraft.value = "";
  refreshReleases();
  setReleaseMessage(release, "已生成预览");
  openRuntime({ releaseId: release.id });
}

function publishCurrentPage(): void {
  if (!ensurePublishReady("发布")) return;
  const release = configPlatformClient.publishPage(editorState.value.schema, { note: releaseNoteDraft.value });
  releaseNoteDraft.value = "";
  markSchemaPersisted(release.schema);
  editorState.value = markSaved(createEditorState(release.schema, {
    selectedNodeId: editorState.value.selectedNodeId,
    mode: editorState.value.mode,
    viewport: editorState.value.viewport,
  }));
  schemaDraft.value = JSON.stringify(release.schema, null, 2);
  refreshReleases();
  setReleaseMessage(release, "已发布");
}

function loadRelease(release: LocalPageRelease): void {
  editorState.value = createEditorState(release.schema, {
    selectedNodeId: release.schema.nodes[0]?.id,
    mode: editorState.value.mode,
    viewport: editorState.value.viewport,
  });
  schemaDraft.value = JSON.stringify(release.schema, null, 2);
  refreshReleases();
  selectedReleaseId.value = release.id;
  setReleaseMessage(release, "已载入版本");
}

function loadReleaseById(releaseId: string): void {
  const release = configPlatformClient.getRelease(releaseId);
  if (release) loadRelease(release);
}

function openReleaseRuntime(releaseId: string): void {
  openRuntime({ releaseId });
}

function selectRelease(releaseId: string): void {
  selectedReleaseId.value = releaseId;
}

function loadSelectedRelease(): void {
  if (selectedRelease.value) loadRelease(selectedRelease.value);
}

function rollbackPublishSelectedRelease(): void {
  const release = selectedRelease.value;
  if (!release) return;
  if (!window.confirm(createLowcodeRollbackConfirmText(release))) return;
  const rollbackRelease = configPlatformClient.publishPage({
    ...release.schema,
    status: "published",
    publishMeta: {
      ...release.schema.publishMeta,
      environment: editorState.value.schema.publishMeta.environment,
    },
  }, { note: createLowcodeRollbackNote(release) });
  markSchemaPersisted(rollbackRelease.schema);
  editorState.value = markSaved(createEditorState(rollbackRelease.schema, {
    selectedNodeId: rollbackRelease.schema.nodes[0]?.id,
    mode: editorState.value.mode,
    viewport: editorState.value.viewport,
  }));
  schemaDraft.value = JSON.stringify(rollbackRelease.schema, null, 2);
  refreshReleases();
  selectedReleaseId.value = rollbackRelease.id;
  setReleaseMessage(rollbackRelease, `已回滚发布自 ${release.pageVersion}`);
}

</script>

<template>
  <main v-if="isRuntimeMode" class="runtime-shell">
    <div class="runtime-phone">
      <div class="phone-status">
        <span>{{ runtimeTitle }}</span>
        <span>{{ runtimeDataStatusText() }}</span>
      </div>
      <LowcodeVueRenderer
        :schema="runtimeSchema"
        :registry="registry"
        :data="runtimePreviewData"
        :action-executor="actionExecutor"
        :fallback="'页面未发布'"
      />
      <p v-if="actionMessage" class="runtime-action-message">{{ actionMessage }}</p>
    </div>
  </main>

  <main v-else class="editor-shell">
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark">M</span>
        <div>
          <strong>MeuMall Lowcode</strong>
          <span>{{ editorState.schema.title }}</span>
        </div>
        <span class="save-pill" :class="{ dirty: editorState.dirty }">
          {{ editorState.dirty ? "未保存" : "已保存" }}
        </span>
        <span class="auto-save-pill" :class="`is-${autoSaveStatusTone}`">
          {{ autoSaveStatusText }}
        </span>
      </div>

      <div class="toolbar" aria-label="编辑器工具栏">
        <button type="button" title="打开快捷命令" class="command-trigger" @click="openCommandPalette">
          <Search :size="17" />
          <span>命令</span>
        </button>
        <button type="button" title="新建页面" class="page-start-trigger" @click="openPageStartWizard">
          <Plus :size="17" />
          <span>新建</span>
        </button>
        <button title="设计" :class="{ active: editorState.mode === 'design' }" @click="editorState = setEditorMode(editorState, 'design')">
          <MonitorSmartphone :size="17" />
          <span>设计</span>
        </button>
        <button title="预览" :class="{ active: editorState.mode === 'preview' }" @click="editorState = setEditorMode(editorState, 'preview')">
          <Eye :size="17" />
          <span>预览</span>
        </button>
        <button title="源码" :class="{ active: editorState.mode === 'outline' }" @click="editorState = setEditorMode(editorState, 'outline')">
          <Code2 :size="17" />
          <span>源码</span>
        </button>
      </div>

      <div class="toolbar compact" aria-label="历史与保存">
        <button title="撤销" :disabled="!editorState.history.past.length" @click="editorState = undo(editorState)">
          <Undo2 :size="17" />
        </button>
        <button title="重做" :disabled="!editorState.history.future.length" @click="editorState = redo(editorState)">
          <Redo2 :size="17" />
        </button>
        <button title="保存草稿" @click="saveSchema">
          <Save :size="17" />
          <span>{{ editorState.dirty ? "保存草稿" : "已保存" }}</span>
        </button>
        <button title="导出当前页面 Schema" @click="exportCurrentSchema">
          <Download :size="17" />
          <span>导出</span>
        </button>
        <button title="导入页面 Schema" @click="triggerSchemaImport">
          <Upload :size="17" />
          <span>导入</span>
        </button>
        <button title="生成预览版本" @click="createPreviewRelease">
          <Eye :size="17" />
          <span>预览链接</span>
        </button>
        <button title="发布当前页面" @click="publishCurrentPage">
          <PanelRight :size="17" />
          <span>发布</span>
        </button>
        <button title="打开已发布 H5" @click="openRuntime()">
          <MonitorSmartphone :size="17" />
          <span>打开 H5</span>
        </button>
        <button title="用 React H5 runtime 打开当前页面" @click="openReactH5Runtime()">
          <MonitorSmartphone :size="17" />
          <span>React H5</span>
        </button>
      </div>
      <input
        ref="schemaFileInputRef"
        data-testid="schema-import-input"
        class="visually-hidden"
        type="file"
        accept="application/json,.json"
        @change="onSchemaFileChange"
      />
    </header>

    <EditorCommandPalette
      ref="commandPaletteRef"
      :open="commandPaletteOpen"
      :keyword="commandKeyword"
      :items="visibleCommandPaletteItems"
      @close="closeCommandPalette"
      @update-keyword="(value) => { commandKeyword = value; }"
      @execute-first="executeFirstCommandPaletteItem"
      @execute="executeCommandPaletteItem"
    />

    <div
      v-if="pageStartWizardOpen"
      class="page-start-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="新建页面向导"
      @click.self="closePageStartWizard"
    >
      <section class="page-start-dialog">
        <div class="page-start-head">
          <div>
            <strong>新建 H5 页面</strong>
            <span>选择一个起点开始搭建，当前草稿会在替换前确认。</span>
          </div>
          <button type="button" title="关闭新建页面向导" @click="closePageStartWizard">
            <X :size="18" />
          </button>
        </div>

        <button type="button" class="page-start-blank" @click="createBlankPageFromWizard">
          <span class="page-start-icon"><Plus :size="22" /></span>
          <span>
            <strong>空白 H5 页面</strong>
            <small>适合从零拖拽物料搭建活动页，创建后可立即添加基础物料。</small>
          </span>
          <em>开始搭建</em>
        </button>

        <div class="page-start-subtitle">
          <Layers :size="15" />
          <span>从模板开始</span>
        </div>
        <div class="page-start-template-grid">
          <button
            v-for="template in pageStartTemplates"
            :key="`start-${template.id}`"
            type="button"
            class="page-start-template"
            @click="applyTemplateFromStartWizard(template)"
          >
            <span class="page-start-template-preview">
              <img
                v-if="template.preview.imageUrl"
                :src="template.preview.imageUrl"
                :alt="template.preview.title"
              />
              <span v-else>{{ template.category }}</span>
              <em>{{ template.preview.nodeCountText }}</em>
            </span>
            <span class="page-start-template-head">
              <strong>{{ template.title }}</strong>
              <em>{{ templateVersionText(template) }}</em>
            </span>
            <small>{{ template.category }} / {{ template.description }}</small>
            <span v-if="templateTags(template).length" class="template-tags">
              <i
                v-for="tag in templateTags(template)"
                :key="`start-${template.id}-${tag}`"
              >
                {{ tag }}
              </i>
            </span>
            <span class="template-summary">{{ templateSummaryText(template) }}</span>
          </button>
        </div>
      </section>
    </div>

    <EditorMaterialDetail
      v-if="selectedMaterialDetailManifest"
      :manifest="selectedMaterialDetailManifest"
      :summary="materialDetailSummary"
      :prop-entries="materialDetailPropEntries"
      :event-items="materialDetailEventItems"
      :data-source-slot-items="materialDetailDataSourceSlotItems"
      :preview-schema="materialDetailPreviewSchema"
      :registry="registry"
      :preview-data="previewData"
      :action-executor="actionExecutor"
      @close="closeMaterialDetail"
      @add="addMaterialFromDetail"
    />

    <div
      v-if="nodeContextMenu"
      class="node-context-backdrop"
      aria-hidden="true"
      @click="closeNodeContextMenu"
      @contextmenu.prevent="closeNodeContextMenu"
    ></div>
    <div
      v-if="nodeContextMenu && selectedNode"
      class="node-context-menu"
      :style="nodeContextMenuStyle"
      role="menu"
      aria-label="节点操作"
      @click.stop
      @contextmenu.prevent.stop
    >
      <div class="node-context-head">
        <strong>{{ selectedNodeDisplayName }}</strong>
        <span>{{ selectedManifest?.title ?? selectedNode.componentName }} / {{ selectedNode.id }}</span>
      </div>
      <button
        v-for="item in nodeContextMenuItems"
        :key="item.action"
        type="button"
        role="menuitem"
        :disabled="item.disabled"
        :class="{ danger: item.danger }"
        @click="runNodeContextMenuAction(item)"
      >
        <Pencil v-if="item.action === 'rename'" :size="15" />
        <ArrowUp v-if="item.action === 'insertBefore' || item.action === 'moveUp'" :size="15" />
        <ArrowDown v-else-if="item.action === 'insertAfter' || item.action === 'moveDown'" :size="15" />
        <Plus v-else-if="item.action === 'addInside' || item.action === 'paste'" :size="15" />
        <Copy v-else-if="item.action === 'copy' || item.action === 'duplicate'" :size="15" />
        <Trash2 v-else-if="item.action === 'delete'" :size="15" />
        <span>{{ item.label }}</span>
        <small v-if="item.shortcut">{{ item.shortcut }}</small>
      </button>
    </div>

    <aside class="left-panel">
      <section class="panel-section">
        <div class="panel-title">
          <Layers :size="16" />
          <span>模板</span>
          <button type="button" class="template-save-current-button" title="保存当前页面为本地模板" @click="saveCurrentPageAsLocalTemplate">
            <Save :size="13" />
            <span>保存为模板</span>
          </button>
        </div>
        <div class="template-filters">
          <label class="search-field">
            <Search :size="14" />
            <input v-model="templateKeyword" placeholder="搜索模板" />
          </label>
          <select v-model="templateCategory" aria-label="模板分类">
            <option v-for="category in templateCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <article
          v-for="template in visiblePageTemplates"
          :key="template.id"
          class="template-item"
        >
          <button
            class="template-main-button"
            type="button"
            @click="applyTemplate(template)"
          >
            <span class="template-preview-card">
              <img
                v-if="template.preview.imageUrl"
                :src="template.preview.imageUrl"
                :alt="template.preview.title"
              />
              <span v-else>{{ template.category }}</span>
              <em>{{ template.preview.nodeCountText }}</em>
            </span>
            <span class="template-item-content">
              <span class="template-item-head">
                <strong>{{ template.title }}</strong>
                <em>{{ templateVersionText(template) }}</em>
              </span>
              <span class="template-preview-copy">
                <b>{{ template.preview.title }}</b>
                <small>{{ template.preview.subtitle }}</small>
              </span>
              <small>{{ template.category }} / {{ template.description }}</small>
              <span v-if="templateTags(template).length" class="template-tags">
                <i
                  v-for="tag in templateTags(template)"
                  :key="`${template.id}-${tag}`"
                >
                  {{ tag }}
                </i>
              </span>
              <span class="template-summary">{{ templateSummaryText(template) }}</span>
            </span>
            <Plus :size="15" />
          </button>
          <button
            class="template-preview-button"
            type="button"
            @click.stop="previewTemplate(template)"
          >
            <ExternalLink :size="14" />
            <span>预览</span>
          </button>
        </article>
        <div v-if="isTemplateSearching" class="mini-empty">模板搜索中</div>
        <div v-else-if="!visiblePageTemplates.length" class="mini-empty">没有匹配模板</div>
      </section>

      <EditorMaterialCatalog
        v-model:keyword="materialKeyword"
        v-model:category="materialCategory"
        :materials="materials"
        :visible-materials="visibleMaterials"
        :favorite-materials="favoriteMaterials"
        :recent-materials="recentMaterials"
        :favorite-component-names="favoriteMaterialComponentNames"
        :categories="materialCategories"
        :preference-message="materialPreferenceMessage"
        :selected-container-title="selectedNodeIsContainer ? selectedManifest?.title : undefined"
        @add="addMaterial"
        @add-to-container="addMaterialToSelectedContainer"
        @toggle-favorite="toggleFavoriteMaterial"
        @open-detail="openMaterialDetail"
        @material-click="onMaterialClick"
        @material-pointerdown="onMaterialPointerDown"
        @material-dragstart="onDragStart"
        @material-dragend="onMaterialDragEnd"
      />

      <EditorOutlineTree
        v-model:keyword="outlineKeyword"
        v-model:rename-draft="outlineRenameDraft"
        :rows="visibleOutlineRows"
        :visible-summary="outlineVisibleSummary"
        :multi-select-summary="multiSelectSummary"
        :selected-node-id="editorState.selectedNodeId"
        :collapsed-node-ids="collapsedOutlineNodeIds"
        :search-matched-node-ids="outlineVisibility.matchedNodeIds"
        :multi-selected-node-ids="multiSelection.selectedNodeIds"
        :group-draggable-node-ids="groupDraggableOutlineNodeIds"
        :renaming-node-id="renamingOutlineNodeId"
        @node-click="onOutlineNodeClick"
        @node-pointerdown="onOutlineNodePointerDown"
        @node-dragstart="onNodeDragStart"
        @node-drop="onNodeDrop"
        @node-contextmenu="openNodeContextMenu"
        @toggle-collapse="toggleOutlineCollapse"
        @toggle-multi-select="toggleMultiSelected"
        @commit-rename="commitOutlineRename"
        @cancel-rename="cancelOutlineRename"
      />
    </aside>

    <section
      class="canvas-panel"
      @dragover.prevent="onCanvasDragOver"
      @dragleave="onCanvasDragLeave"
      @drop.prevent="onCanvasDrop"
    >
      <EditorCanvasToolbar
        :mode="editorState.mode"
        :status-text="canvasToolbarStatusText"
        :stats="workspaceStats"
        :viewport-presets="h5ViewportPresets"
        :active-viewport-preset="activeH5ViewportPreset"
        @select-viewport="applyH5ViewportPreset"
      />

      <div v-if="editorState.mode !== 'outline'" class="phone-stage">
        <div v-if="selectedNode && selectedManifest && editorState.mode === 'design'" class="canvas-context-toolbar">
          <div class="context-title">
            <strong>{{ selectedManifest.title }}</strong>
            <span>{{ selectedNode.id }}</span>
          </div>
          <label>
            <span>插入物料</span>
            <select v-model="selectedInsertComponentName">
              <option
                v-for="material in materials"
                :key="`insert-${material.manifest.componentName}`"
                :value="material.manifest.componentName"
              >
                {{ material.manifest.title }}
              </option>
            </select>
          </label>
          <div class="context-actions">
            <button
              type="button"
              title="在当前节点前插入"
              :disabled="isNodeOperationDisabled('insertBefore')"
              @click="insertMaterialAroundSelected('before')"
            >
              <ArrowUp :size="15" />
              <span>前方插入</span>
            </button>
            <button
              type="button"
              title="在当前节点后插入"
              :disabled="isNodeOperationDisabled('insertAfter')"
              @click="insertMaterialAroundSelected('after')"
            >
              <ArrowDown :size="15" />
              <span>后方插入</span>
            </button>
            <button
              type="button"
              title="加入选中容器"
              :disabled="isNodeOperationDisabled('addInside')"
              @click="insertMaterialInsideSelectedContainer"
            >
              <Plus :size="15" />
              <span>加入容器</span>
            </button>
            <button type="button" title="上移当前节点" :disabled="isNodeOperationDisabled('moveUp')" @click="moveSelected(-1)">
              <ArrowUp :size="15" />
              <span>上移</span>
            </button>
            <button type="button" title="下移当前节点" :disabled="isNodeOperationDisabled('moveDown')" @click="moveSelected(1)">
              <ArrowDown :size="15" />
              <span>下移</span>
            </button>
            <button type="button" title="创建副本" @click="duplicateSelected">
              <Copy :size="15" />
              <span>副本</span>
            </button>
            <button type="button" title="更多节点操作" @click="openSelectedNodeContextMenu">
              <MoreHorizontal :size="15" />
              <span>更多</span>
            </button>
            <button type="button" title="删除节点" class="danger" @click="removeSelected">
              <Trash2 :size="15" />
              <span>删除</span>
            </button>
          </div>
        </div>
        <div
          ref="phoneFrameRef"
          class="phone-frame"
          :class="{ 'is-touch-drag-enabled': editorState.mode === 'design' }"
          :style="phoneFrameStyle"
          @pointerdown="onPhoneFramePointerDown"
          @contextmenu.prevent="onCanvasContextMenu"
        >
          <div class="phone-status">
            <span>{{ editorState.schema.title }}</span>
            <span>{{ activeH5ViewportTitle }}</span>
          </div>
          <div
            v-for="guide in canvasDropHint?.guides ?? []"
            :key="`${guide.axis}-${guide.label}-${guide.style.top ?? guide.style.left}`"
            class="canvas-snap-guide"
            :class="`is-${guide.axis}`"
            :style="toCanvasStyle(guide.style)"
            aria-hidden="true"
          >
            <span>{{ guide.label }}</span>
          </div>
          <div
            v-if="canvasDropHint && canvasDropHint.placement !== 'append'"
            class="canvas-drop-indicator"
            :class="`is-${canvasDropHint.placement}`"
            :style="toCanvasStyle(canvasDropHint.style)"
            aria-hidden="true"
          >
            <span>
              {{
                canvasDropHint.placement === "inside"
                  ? `${canvasDropHint.source === "node" ? "移动到容器" : "加入容器"}：${canvasDropHint.targetTitle}`
                  : canvasDropHint.placement === "before"
                    ? `${canvasDropHint.source === "node" ? "移动到" : "插入到"} ${canvasDropHint.targetTitle} 前方`
                    : `${canvasDropHint.source === "node" ? "移动到" : "插入到"} ${canvasDropHint.targetTitle} 后方`
              }}
            </span>
          </div>
          <div v-if="canvasDropHint?.placement === 'append'" class="canvas-drop-append" aria-hidden="true">
            <span>{{ canvasDropHint.source === "node" ? "移动到页面末尾" : "追加到页面末尾" }}</span>
          </div>
          <LowcodeVueRenderer
            v-if="editorState.schema.nodes.length"
            :schema="editorState.schema"
            :registry="registry"
            :data="previewData"
            :action-executor="actionExecutor"
            :editable="editorState.mode === 'design'"
            :node-draggable="editorState.mode === 'design'"
            :selected-node-id="editorState.selectedNodeId"
            :fallback="'暂无内容'"
            :on-node-select="(node) => select(node.id)"
            :on-node-drag-start="onCanvasNodeDragStart"
            :on-node-drag-end="onCanvasNodeDragEnd"
          />
          <div v-else class="canvas-starter" role="status">
            <span class="canvas-starter-kicker">从这里开始</span>
            <strong>空白 H5 页面</strong>
            <p>
              {{
                editorState.mode === "design"
                  ? "选择一个基础物料开始搭建，后续可以继续拖拽、排序和配置属性。"
                  : "当前页面暂无物料，请切回设计模式添加内容。"
              }}
            </p>
            <div v-if="editorState.mode === 'design'" class="canvas-starter-actions" aria-label="空白画布起步物料">
              <button
                v-for="material in canvasStarterMaterials"
                :key="`canvas-starter-${material.manifest.componentName}`"
                type="button"
                class="canvas-starter-button"
                @click="addStarterMaterial(material.manifest)"
              >
                <Plus :size="14" />
                <span>{{ material.manifest.title }}</span>
              </button>
            </div>
            <button
              v-if="editorState.mode === 'design'"
              type="button"
              class="canvas-starter-template"
              @click="openPageStartWizard"
            >
              从模板开始
            </button>
          </div>
        </div>
      </div>

      <div v-else class="schema-editor">
        <textarea v-model="schemaDraft" spellcheck="false" />
        <div class="schema-actions">
          <button @click="applyJson">应用 JSON</button>
          <button @click="exportCurrentSchema">导出 JSON</button>
          <button @click="triggerSchemaImport">导入 JSON</button>
          <span v-if="schemaTransferMessage" class="schema-transfer-message">{{ schemaTransferMessage }}</span>
          <span v-if="jsonError">{{ jsonError }}</span>
        </div>
      </div>
    </section>

    <aside class="right-panel">
      <EditorPageSettingsPanel
        v-model:release-note-draft="releaseNoteDraft"
        :form="pageSettingsForm"
        :release-message="releaseMessage"
        @update:title="updatePageTitle"
        @update:description="updatePageDescription"
        @update:page-type="updatePageType"
        @update:background-color="updatePageBackgroundColor"
        @update:safe-area="updatePageSafeArea"
        @update:max-width="updatePageMaxWidth"
        @update:status="updatePageStatus"
        @update:publish-environment="updatePublishEnvironment"
      />

      <EditorPublishPanel
        v-model:release-keyword="releaseKeyword"
        :preview-link-items="previewLinkItems"
        :preview-link-summary="previewLinkSummary"
        :delivery-status-text="deliveryStatusText"
        :delivery-metrics="deliveryMetrics"
        :publish-checks="publishChecks"
        :publish-check-summary="publishCheckSummary"
        :has-publish-blocking-errors="hasPublishBlockingErrors"
        :release-count="releases.length"
        :release-list-summary="releaseListSummary"
        :visible-release-items="visibleReleaseItems"
        :has-selected-release="Boolean(selectedRelease)"
        :release-diff-summary-text="releaseDiffSummaryText"
        :release-diff-items="releaseDiffItems"
        :release-schema-preview-items="releaseSchemaPreviewItems"
        @open-preview-link="openPreviewLink"
        @copy-preview-link="copyPreviewLink"
        @copy-schema="copyCurrentSchema"
        @export-schema="exportCurrentSchema"
        @locate-publish-check="locatePublishCheck"
        @select-release="selectRelease"
        @load-release="loadReleaseById"
        @open-release="openReleaseRuntime"
        @load-selected-release="loadSelectedRelease"
        @rollback-selected-release="rollbackPublishSelectedRelease"
      />

      <section class="panel-section">
        <div class="panel-title">
          <Layers :size="16" />
          <span>属性</span>
        </div>

        <div v-if="selectedNode && selectedManifest" class="inspector">
          <EditorSelectedNodeCard
            :display-name="selectedNodeDisplayName"
            :material-title="selectedManifest.title"
            :material-category="selectedManifest.category"
            :node-name="selectedNode.meta?.name ?? ''"
            :node-id="selectedNode.id"
            :position-text="selectedPositionText"
            :parent-title="selectedParentTitle"
            @rename="renameSelectedNode"
          />

          <EditorResourcePanels
            v-model:asset-target-prop-name="assetTargetPropName"
            v-model:asset-keyword="assetKeyword"
            v-model:asset-category="assetCategory"
            v-model:product-keyword="productKeyword"
            v-model:coupon-keyword="couponKeyword"
            v-model:store-expert-keyword="storeExpertKeyword"
            v-model:store-expert-category="storeExpertCategory"
            :can-use-asset-library="canUseAssetLibrary"
            :image-prop-options="imagePropOptions"
            :asset-categories="assetCategories"
            :filtered-assets="filteredAssets"
            :is-asset-searching="isAssetSearching"
            :is-product-material-selected="isProductMaterialSelected"
            :filtered-products="filteredProducts"
            :selected-product-ids="selectedProductIds"
            :selected-product-count="selectedProducts.length"
            :is-product-searching="isProductSearching"
            :has-product-data-binding="Boolean(selectedNode.dataBinding?.items)"
            :can-use-coupon-library="canUseCouponLibrary"
            :is-coupon-section-selected="isCouponSectionSelected"
            :filtered-coupons="filteredCoupons"
            :selected-coupon-ids="selectedCouponIds"
            :selected-coupon-count="selectedCoupons.length"
            :is-coupon-searching="isCouponSearching"
            :is-store-expert-material-selected="isStoreExpertMaterialSelected"
            :store-expert-categories="storeExpertCategories"
            :filtered-store-experts="filteredStoreExperts"
            :selected-store-expert-ids="selectedStoreExpertIds"
            :selected-store-expert-count="selectedStoreExperts.length"
            :is-store-expert-searching="isStoreExpertSearching"
            :has-store-expert-data-binding="Boolean(selectedNode.dataBinding?.items)"
            @apply-asset="applyAssetToSelected"
            @toggle-product="toggleProductSelection"
            @apply-sample-products="applySampleProducts"
            @apply-products="applySelectedProductsToNode"
            @bind-products-data-source="bindSelectedProductMaterialToDataSource"
            @clear-products="clearSelectedProducts"
            @toggle-coupon="toggleCouponSelection"
            @apply-coupons="applySelectedCouponsToNode"
            @clear-coupons="clearSelectedCoupons"
            @toggle-store-expert="toggleStoreExpertSelection"
            @apply-store-experts="applySelectedStoreExpertsToNode"
            @bind-store-experts-data-source="bindSelectedStoreExpertMaterialToDataSource"
            @clear-store-experts="clearSelectedStoreExperts"
          />

          <EditorPropGroupsPanel
            v-model:asset-keyword="assetKeyword"
            v-model:asset-category="assetCategory"
            :prop-groups="selectedPropGroups"
            :selected-props="selectedNode.props"
            :selected-component-name="selectedNode.componentName"
            :collapsed-groups="collapsedPropGroups"
            :list-item-drag-state="listItemDragState"
            :list-asset-target="listAssetTarget"
            :asset-categories="assetCategories"
            :filtered-assets="filteredAssets"
            :is-asset-searching="isAssetSearching"
            :event-bindings="selectedEventBindings"
            @toggle-group="togglePropGroup"
            @update-prop="updateProp"
            @add-list-item="addListItem"
            @duplicate-list-item="duplicateListItem"
            @remove-list-item="removeListItem"
            @move-list-item="moveListItem"
            @list-item-drag-start="onListItemDragStart"
            @list-item-drag-over="onListItemDragOver"
            @list-item-drop="onListItemDrop"
            @list-item-drag-end="onListItemDragEnd"
            @update-list-item-field="updateListItemField"
            @open-list-asset-picker="openListAssetPicker"
            @close-list-asset-picker="closeListAssetPicker"
            @apply-list-asset="applyAssetToListTarget"
            @apply-sample-products="applySampleProducts"
            @bind-products-data-source="bindSelectedProductMaterialToDataSource"
            @bind-event="bindSelectedEvent"
          />

          <div class="toolbar inspector-actions">
            <button title="上移节点" :disabled="isNodeOperationDisabled('moveUp')" @click="moveSelected(-1)">
              <ArrowUp :size="16" />
              <span>上移</span>
            </button>
            <button title="下移节点" :disabled="isNodeOperationDisabled('moveDown')" @click="moveSelected(1)">
              <ArrowDown :size="16" />
              <span>下移</span>
            </button>
            <button title="复制节点" @click="copySelected">
              <Copy :size="16" />
              <span>复制</span>
            </button>
            <button title="粘贴节点" :disabled="isNodeOperationDisabled('paste')" @click="pasteCopied">
              <Plus :size="16" />
              <span>粘贴</span>
            </button>
            <button title="创建副本" @click="duplicateSelected">
              <Copy :size="16" />
              <span>副本</span>
            </button>
            <button title="删除节点" class="danger" @click="removeSelected">
              <Trash2 :size="16" />
              <span>删除</span>
            </button>
          </div>
        </div>

        <div v-else class="empty-state">未选择节点</div>
      </section>

      <EditorSchemaConfigPanel
        :data-source-items="dataSourceFormItems"
        :action-items="actionFormItems"
        :action-type-options="actionTypeOptions"
        :action-message="actionMessage"
        @add-data-source="addDataSource"
        @update-data-source-id="(index, value) => updateDataSource(index, { id: value })"
        @update-data-source-type="(index, value) => updateDataSource(index, { type: value })"
        @update-data-source-bind-to="(index, value) => updateDataSource(index, { bindTo: value })"
        @update-data-source-params="updateDataSourceParams"
        @remove-data-source="removeDataSource"
        @add-action="addAction"
        @update-action-id="updateActionId"
        @update-action-type="updateActionType"
        @update-action-params="updateActionParams"
        @remove-action="removeAction"
      />

      <section class="panel-section">
        <div class="panel-title">
          <Code2 :size="16" />
          <span>状态</span>
        </div>
        <dl class="state-list">
          <div>
            <dt>节点数</dt>
            <dd>{{ editorState.schema.nodes.length }}</dd>
          </div>
          <div>
            <dt>历史</dt>
            <dd>{{ editorState.history.past.length }} / {{ editorState.history.future.length }}</dd>
          </div>
          <div>
            <dt>校验</dt>
            <dd>{{ validation.valid ? "通过" : "失败" }}</dd>
          </div>
        </dl>
        <button class="reset-button" @click="resetSchema">
          <RotateCcw :size="16" />
          <span>重置示例</span>
        </button>
      </section>
    </aside>
  </main>
</template>
