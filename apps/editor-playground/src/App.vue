<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef, watch, type CSSProperties } from "vue";
import {
  ArrowDown,
  ArrowUp,
  Code2,
  Copy,
  Database,
  Eye,
  GripVertical,
  Image,
  Layers,
  MonitorSmartphone,
  PanelRight,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  Search,
  Smartphone,
  Trash2,
  Undo2,
} from "@lucide/vue";
import {
  createDataSourceRegistry,
  createSafeActionExecutor,
  createSafeActionRegistry,
  createStaticResourceLibraryClient,
  encodePageSchemaToUrlParam,
  resolveLowcodeDataSources,
  type DataSourceResolutionRecord,
  type LowcodeImageAssetResource,
  type LowcodeProductResource,
  type LowcodeResourceSearchResult,
} from "@meumall/lowcode-adapters";
import { createMaterialRegistry } from "@meumall/lowcode-core";
import {
  appendNode,
  copyNode,
  createEditorState,
  duplicateNode,
  insertNode,
  markSaved,
  moveNodeById,
  pasteNode,
  redo,
  removeNode,
  replaceNodeProps,
  selectNode,
  setEditorMode,
  setEditorViewport,
  undo,
  type LowcodeEditorState,
} from "@meumall/lowcode-editor";
import { h5VueMaterials } from "@meumall/lowcode-materials-vue-h5";
import { LowcodeVueRenderer } from "@meumall/lowcode-renderer-vue-h5";
import {
  validateLowcodePageSchema,
  type JsonObject,
  type JsonValue,
  type LowcodeActionConfig,
  type LowcodeDataSourceConfig,
  type LowcodeMaterialManifest,
  type LowcodeNode,
  type LowcodePageSchema,
  type LowcodePageStatus,
  type LowcodePropSchema,
} from "@meumall/lowcode-schema";
import { cloneTemplateSchema, pageTemplates, type PageTemplate } from "./pageTemplates";
import {
  localConfigPlatformClient,
  type LocalPageRelease,
} from "./mockPlatform";

const STORAGE_KEY = "meumall-lowcode-editor-playground";
const REACT_H5_RUNTIME_URL = import.meta.env.VITE_REACT_H5_RUNTIME_URL ?? "http://localhost:5174/";
const runtimeQuery = new URLSearchParams(window.location.search);
const isRuntimeMode = runtimeQuery.get("runtime") === "1";

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

const actionTypeOptions = [
  { label: "页面跳转", value: "navigate" },
  { label: "领取优惠券", value: "coupon.receive" },
  { label: "点击埋点", value: "tracking.click" },
  { label: "无动作", value: "noop" },
];

const registry = createMaterialRegistry(h5VueMaterials);
const materials = registry.list();
const resourceLibraryClient = createStaticResourceLibraryClient({
  imageAssets: sampleAssets,
  products: sampleProducts,
});
const previewDataSourceRegistry = createDataSourceRegistry({
  "product.byActivity": resolveSampleProductDataSource,
  "product.byIds": resolveSampleProductDataSource,
  "custom.http": (dataSource) => dataSource.params ?? {},
});

const initialSchema = cloneTemplateSchema(pageTemplates[0] as PageTemplate);

function loadSchema(): LowcodePageSchema {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return initialSchema;
  try {
    const parsed = JSON.parse(raw) as LowcodePageSchema;
    return validateLowcodePageSchema(parsed).valid ? parsed : initialSchema;
  } catch {
    return initialSchema;
  }
}

const editorState = shallowRef<LowcodeEditorState>(createEditorState(loadSchema(), { selectedNodeId: "node_hero" }));
const schemaDraft = ref(JSON.stringify(editorState.value.schema, null, 2));
const jsonError = ref("");
const draggedNodeId = ref<string>();
const phoneFrameRef = ref<HTMLElement>();
const releaseMessage = ref("");
const configPlatformClient = localConfigPlatformClient;
const releases = shallowRef<LocalPageRelease[]>(configPlatformClient.listReleases(editorState.value.schema.pageId));
const selectedReleaseId = ref(releases.value[0]?.id ?? "");
const selectedInsertComponentName = ref(materials[0]?.manifest.componentName ?? "");
const assetKeyword = ref("");
const assetCategory = ref("全部");
const assetTargetPropName = ref("");
const productKeyword = ref("");
const selectedProductIds = ref<string[]>([]);
const filteredAssets = ref<LowcodeImageAssetResource[]>([]);
const filteredProducts = ref<LowcodeProductResource[]>([]);
const resourceProductCatalog = ref<LowcodeProductResource[]>([]);
const isAssetSearching = ref(false);
const isProductSearching = ref(false);
const previewData = ref<JsonObject>({});
const runtimePreviewData = ref<JsonObject>({});
const previewDataSourceRecords = ref<DataSourceResolutionRecord[]>([]);
const runtimeDataSourceRecords = ref<DataSourceResolutionRecord[]>([]);
const isPreviewDataResolving = ref(false);
const isRuntimeDataResolving = ref(false);
const actionMessage = ref("");
let previewResolutionSeq = 0;
let runtimeResolutionSeq = 0;
let assetSearchSeq = 0;
let productSearchSeq = 0;

type CanvasDropPlacement = "before" | "after" | "inside" | "append";
type CanvasDragSource = "material" | "node";
type CanvasSnapGuideAxis = "x" | "y";
type PublishCheckStatus = "pass" | "warning" | "error";

interface CanvasSnapGuide {
  axis: CanvasSnapGuideAxis;
  label: string;
  style: CSSProperties;
}

interface CanvasDropHint {
  source: CanvasDragSource;
  placement: CanvasDropPlacement;
  targetNodeId?: string;
  targetTitle: string;
  style: CSSProperties;
  guides: CanvasSnapGuide[];
}

interface CanvasDragPoint {
  clientX: number;
  clientY: number;
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

interface PublishCheck {
  id: string;
  title: string;
  status: PublishCheckStatus;
  description: string;
}

interface ReleaseDiffItem {
  label: string;
  current: string;
  selected: string;
  changed: boolean;
}

interface ListEditorField {
  name: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

interface ListItemDragState {
  propName: string;
  fromIndex: number;
  overIndex?: number;
}

const canvasDropHint = ref<CanvasDropHint>();
const listItemDragState = ref<ListItemDragState>();
const pointerCanvasDragState = ref<PointerCanvasDragState>();
const multiSelectedNodeIds = ref<string[]>([]);

const MATERIAL_DRAG_TYPE = "application/x-meumall-material";
const NODE_DRAG_TYPE = "application/x-meumall-node";
const LIST_ITEM_DRAG_TYPE = "application/x-meumall-list-item";
const POINTER_DRAG_START_DISTANCE = 8;
let suppressNextClick = false;

const commonListEditorFields: Record<string, ListEditorField> = {
  id: { name: "id", label: "ID", placeholder: "唯一标识" },
  typeText: { name: "typeText", label: "类型", placeholder: "门店 / 达人 / 推荐" },
  title: { name: "title", label: "标题", placeholder: "请输入标题" },
  subtitle: { name: "subtitle", label: "副标题", placeholder: "请输入副标题" },
  desc: { name: "desc", label: "说明", placeholder: "请输入说明" },
  content: { name: "content", label: "内容", placeholder: "请输入内容", multiline: true },
  imageUrl: { name: "imageUrl", label: "图片", placeholder: "图片 URL" },
  valueText: { name: "valueText", label: "面值", placeholder: "¥30 / 包邮" },
  thresholdText: { name: "thresholdText", label: "门槛", placeholder: "满 199 可用" },
  expireText: { name: "expireText", label: "有效期", placeholder: "领取后 7 天有效" },
  buttonText: { name: "buttonText", label: "按钮", placeholder: "查看 / 领取" },
  targetId: { name: "targetId", label: "目标节点", placeholder: "node_id" },
  metricText: { name: "metricText", label: "指标", placeholder: "4.9 分 / 12.8w 粉丝" },
  linkUrl: { name: "linkUrl", label: "链接", placeholder: "跳转 URL" },
  badgeText: { name: "badgeText", label: "角标", placeholder: "热卖 / 精选" },
  value: { name: "value", label: "值", placeholder: "请输入值", multiline: true },
};

const defaultListFields: Record<string, string[]> = {
  coupons: ["id", "title", "thresholdText", "valueText", "expireText", "buttonText"],
  rules: ["title", "content"],
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
const selectedNodeIsContainer = computed(() => selectedNode.value?.componentName === "SectionContainer");
const outlineRows = computed(() => flattenNodes(editorState.value.schema.nodes));
const selectedOutlineRow = computed(() => outlineRows.value.find((row) => row.node.id === editorState.value.selectedNodeId));
const multiSelectedNodeIdSet = computed(() => new Set(multiSelectedNodeIds.value));
const multiSelectedRows = computed(() => outlineRows.value.filter((row) => multiSelectedNodeIdSet.value.has(row.node.id)));
const multiSelectSameParent = computed(() => {
  if (multiSelectedRows.value.length < 2) return true;
  const parentId = multiSelectedRows.value[0]?.parentId;
  return multiSelectedRows.value.every((row) => row.parentId === parentId);
});
const multiSelectSummary = computed(() => {
  const count = multiSelectedRows.value.length;
  if (count <= 1) return "";
  return multiSelectSameParent.value ? `已多选 ${count} 个同层节点，可成组拖拽` : `已多选 ${count} 个节点，跨层级时拖动单节点`;
});
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
  Boolean(selectedNode.value && ["ProductList", "FlashSaleList"].includes(selectedNode.value.componentName)),
);
const selectedProducts = computed(() => {
  const selected = new Set(selectedProductIds.value);
  return resourceProductCatalog.value.filter((product) => selected.has(product.id));
});
const canMoveSelectedUp = computed(() => Boolean(selectedOutlineRow.value && selectedOutlineRow.value.index > 0));
const canMoveSelectedDown = computed(() => {
  const row = selectedOutlineRow.value;
  if (!row) return false;
  return row.index < getSiblingCount(row.parentId) - 1;
});
const publishChecks = computed(() => createPublishChecks());
const publishCheckSummary = computed(() => {
  return publishChecks.value.reduce(
    (summary, check) => ({
      ...summary,
      [check.status]: summary[check.status] + 1,
    }),
    { pass: 0, warning: 0, error: 0 } as Record<PublishCheckStatus, number>,
  );
});
const hasPublishBlockingErrors = computed(() => publishCheckSummary.value.error > 0);
const selectedRelease = computed<LocalPageRelease | undefined>(() =>
  releases.value.find((release) => release.id === selectedReleaseId.value),
);
const releaseDiffItems = computed<ReleaseDiffItem[]>(() =>
  selectedRelease.value ? createReleaseDiffItems(editorState.value.schema, selectedRelease.value.schema) : [],
);
const releaseDiffChangedCount = computed(() => releaseDiffItems.value.filter((item) => item.changed).length);
const runtimeSchema = computed(() => resolveRuntimeSchema() ?? editorState.value.schema);
const runtimeTitle = computed(() => runtimeSchema.value.title || "MeuMall Lowcode H5");

watch(
  () => editorState.value.schema,
  (schema) => {
    schemaDraft.value = JSON.stringify(schema, null, 2);
  },
);

watch(
  outlineRows,
  () => {
    pruneMultiSelection();
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
    selectedProductIds.value = getProductIdsFromNode(selectedNode.value);
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
});

onUnmounted(() => {
  window.removeEventListener("pointermove", onPointerCanvasDragMove);
  window.removeEventListener("pointerup", onPointerCanvasDragEnd);
  window.removeEventListener("pointercancel", onPointerCanvasDragCancel);
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

function nodeContains(node: LowcodeNode | undefined, nodeId: string): boolean {
  if (!node) return false;
  return Boolean(findNode(node.children ?? [], nodeId));
}

interface OutlineRow {
  node: LowcodeNode;
  index: number;
  depth: number;
  parentId?: string;
}

function flattenNodes(nodes: LowcodeNode[], depth = 0, parentId?: string): OutlineRow[] {
  return nodes.flatMap((node, index) => [
    { node, index, depth, parentId },
    ...flattenNodes(node.children ?? [], depth + 1, node.id),
  ]);
}

function flattenNodeList(nodes: LowcodeNode[]): LowcodeNode[] {
  return nodes.flatMap((node) => [node, ...flattenNodeList(node.children ?? [])]);
}

function getSiblingNodes(nodes: LowcodeNode[], parentId?: string): LowcodeNode[] | undefined {
  if (!parentId) return nodes;
  for (const node of nodes) {
    if (node.id === parentId) return node.children ?? [];
    const children = getSiblingNodes(node.children ?? [], parentId);
    if (children) return children;
  }
  return undefined;
}

function replaceSiblingNodes(nodes: LowcodeNode[], parentId: string | undefined, siblings: LowcodeNode[]): LowcodeNode[] | undefined {
  if (!parentId) return siblings;
  let replaced = false;
  const nextNodes = nodes.map((node) => {
    if (node.id === parentId) {
      replaced = true;
      return {
        ...node,
        children: siblings,
      };
    }
    if (!node.children?.length) return node;
    const nextChildren = replaceSiblingNodes(node.children, parentId, siblings);
    if (!nextChildren) return node;
    replaced = true;
    return {
      ...node,
      children: nextChildren,
    };
  });
  return replaced ? nextNodes : undefined;
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

function schemaNodeCount(schema: LowcodePageSchema): number {
  return flattenNodeList(schema.nodes).length;
}

function createReleaseDiffItems(current: LowcodePageSchema, selected: LowcodePageSchema): ReleaseDiffItem[] {
  const items = [
    { label: "标题", current: current.title, selected: selected.title },
    { label: "状态", current: current.status, selected: selected.status },
    { label: "环境", current: current.publishMeta.environment, selected: selected.publishMeta.environment },
    { label: "页面版本", current: current.pageVersion, selected: selected.pageVersion },
    { label: "节点数", current: String(schemaNodeCount(current)), selected: String(schemaNodeCount(selected)) },
    { label: "数据源数", current: String(current.dataSources?.length ?? 0), selected: String(selected.dataSources?.length ?? 0) },
    { label: "动作数", current: String(current.actions?.length ?? 0), selected: String(selected.actions?.length ?? 0) },
  ];
  return items.map((item) => ({
    ...item,
    changed: item.current !== item.selected,
  }));
}

function getSiblingCount(parentId?: string): number {
  if (!parentId) return editorState.value.schema.nodes.length;
  return findNode(editorState.value.schema.nodes, parentId)?.children?.length ?? 0;
}

async function toResourceSearchResult<T>(
  result: LowcodeResourceSearchResult<T> | Promise<LowcodeResourceSearchResult<T>>,
): Promise<LowcodeResourceSearchResult<T>> {
  return Promise.resolve(result);
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

function resolveSampleProductDataSource(dataSource: LowcodeDataSourceConfig): JsonValue {
  const catalog = resourceProductCatalog.value.length ? resourceProductCatalog.value : sampleProducts;
  const limit = typeof dataSource.params?.limit === "number" ? dataSource.params.limit : catalog.length;
  return catalog.slice(0, limit).map((product) => ({ ...product })) as unknown as JsonValue;
}

function getProductIdsFromNode(node: LowcodeNode | undefined): string[] {
  const items = node?.props.items;
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (!item || typeof item !== "object") return undefined;
      const id = (item as { id?: unknown }).id;
      return typeof id === "string" ? id : undefined;
    })
    .filter((id): id is string => Boolean(id));
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

function dataSourceRecordFor(dataSourceId: string): DataSourceResolutionRecord | undefined {
  return previewDataSourceRecords.value.find((record) => record.id === dataSourceId);
}

function dataSourceRecordLabel(record: DataSourceResolutionRecord | undefined): string {
  if (isPreviewDataResolving.value) return "解析中";
  if (!record) return "待解析";
  if (record.status === "resolved") return `已绑定到 ${record.bindTo}`;
  if (record.status === "skipped") return "已跳过";
  return "解析失败";
}

function runtimeDataStatusText(): string {
  if (isRuntimeDataResolving.value) return "数据解析中";
  const errors = runtimeDataSourceRecords.value.filter((record) => record.status === "error").length;
  if (errors > 0) return `数据源异常 ${errors} 个`;
  return `数据源已解析 ${runtimeDataSourceRecords.value.length} 个`;
}

function createPublishChecks(): PublishCheck[] {
  const schema = editorState.value.schema;
  const nodes = flattenNodeList(schema.nodes);
  const missingImages = nodes.flatMap((node) => {
    const manifest = registry.get(node.componentName)?.manifest;
    if (!manifest) return [];
    return Object.entries(manifest.propsSchema)
      .filter(([, propSchema]) => propSchema.setter === "image")
      .filter(([propName]) => {
        const value = node.props[propName];
        return typeof value !== "string" || value.trim().length === 0;
      })
      .map(([propName]) => `${manifest.title}.${propName}`);
  });
  const emptyProductNodes = nodes.filter((node) => {
    if (!["ProductList", "FlashSaleList"].includes(node.componentName)) return false;
    if (node.dataBinding?.items) return false;
    return !Array.isArray(node.props.items) || node.props.items.length === 0;
  });
  const dataSourceErrors = previewDataSourceRecords.value.filter((record) => record.status === "error");
  const actions = new Set((schema.actions ?? []).map((action) => action.id));
  const missingActionRefs = nodes.flatMap((node) =>
    Object.entries(node.events ?? [])
      .filter(([, ref]) => !actions.has(ref.actionId))
      .map(([eventName, ref]) => `${node.id}.${eventName} -> ${ref.actionId}`),
  );
  const actionWarnings = (schema.actions ?? []).flatMap((action) => {
    if (action.type === "navigate" && !getParamString(action.params, "url", "")) return [`${action.id} 缺少跳转 URL`];
    if (action.type === "coupon.receive" && !getParamString(action.params, "couponId", "")) return [`${action.id} 缺少 couponId`];
    if (action.type === "tracking.click" && !getParamString(action.params, "eventName", "")) return [`${action.id} 缺少 eventName`];
    return [];
  });

  return [
    {
      id: "schema",
      title: "Schema 校验",
      status: validation.value.valid ? "pass" : "error",
      description: validation.value.valid ? "Page Schema 结构有效" : validation.value.errors.join("；"),
    },
    {
      id: "nodes",
      title: "页面节点",
      status: nodes.length > 0 ? "pass" : "error",
      description: nodes.length > 0 ? `已配置 ${nodes.length} 个节点` : "页面没有任何节点",
    },
    {
      id: "images",
      title: "图片素材",
      status: missingImages.length ? "warning" : "pass",
      description: missingImages.length ? `${missingImages.length} 个图片字段为空：${missingImages.slice(0, 3).join("、")}` : "图片类字段已配置",
    },
    {
      id: "products",
      title: "商品内容",
      status: emptyProductNodes.length ? "warning" : "pass",
      description: emptyProductNodes.length
        ? `${emptyProductNodes.length} 个商品组件没有静态商品或数据源绑定`
        : "商品组件已有静态商品或数据源绑定",
    },
    {
      id: "dataSources",
      title: "数据源解析",
      status: dataSourceErrors.length ? "error" : "pass",
      description: dataSourceErrors.length
        ? `${dataSourceErrors.length} 个数据源解析失败：${dataSourceErrors.map((record) => record.id).join("、")}`
        : `数据源状态正常，共 ${previewDataSourceRecords.value.length} 个`,
    },
    {
      id: "actions",
      title: "动作配置",
      status: missingActionRefs.length ? "error" : actionWarnings.length ? "warning" : "pass",
      description: missingActionRefs.length
        ? `${missingActionRefs.length} 个事件引用了不存在的动作`
        : actionWarnings.length
          ? actionWarnings.slice(0, 3).join("；")
          : `动作配置正常，共 ${(schema.actions ?? []).length} 个`,
    },
  ];
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
  const node = {
    componentName: manifest.componentName,
    materialVersion: manifest.materialVersion,
    props: { ...manifest.defaultProps },
    meta: { name: manifest.title },
  };
  if (manifest.componentName === "ProductList") {
    return {
      ...node,
      dataBinding: {
        items: "products",
      },
    };
  }
  return node;
}

function addMaterial(manifest: LowcodeMaterialManifest): void {
  editorState.value = appendNode(editorState.value, createNodeInput(manifest));
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
  return multiSelectedNodeIdSet.value.has(nodeId);
}

function canDragSelectedGroup(nodeId: string): boolean {
  return isNodeMultiSelected(nodeId) && multiSelectedRows.value.length > 1 && multiSelectSameParent.value;
}

function toggleMultiSelected(nodeId: string): void {
  const selected = new Set(multiSelectedNodeIds.value);
  if (selected.has(nodeId)) {
    selected.delete(nodeId);
  } else {
    selected.add(nodeId);
  }
  if (!selected.size) selected.add(nodeId);
  multiSelectedNodeIds.value = [...selected];
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
  const available = new Set(outlineRows.value.map((row) => row.node.id));
  const nextSelected = multiSelectedNodeIds.value.filter((nodeId) => available.has(nodeId));
  if (!nextSelected.length && editorState.value.selectedNodeId && available.has(editorState.value.selectedNodeId)) {
    nextSelected.push(editorState.value.selectedNodeId);
  }
  if (nextSelected.join("|") !== multiSelectedNodeIds.value.join("|")) {
    multiSelectedNodeIds.value = nextSelected;
  }
}

function findOutlineRowByNodeId(nodeId: string): OutlineRow | undefined {
  return outlineRows.value.find((row) => row.node.id === nodeId);
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

function getDropPlacement(point: CanvasDragPoint, node: LowcodeNode, nodeElement: HTMLElement): CanvasDropPlacement {
  const rect = nodeElement.getBoundingClientRect();
  const ratio = rect.height > 0 ? (point.clientY - rect.top) / rect.height : 0.5;
  if (node.componentName === "SectionContainer" && ratio > 0.28 && ratio < 0.72) return "inside";
  return ratio < 0.5 ? "before" : "after";
}

function createDropHintStyle(nodeElement: HTMLElement, placement: CanvasDropPlacement): CSSProperties {
  const frame = phoneFrameRef.value;
  if (!frame) return {};
  const frameRect = frame.getBoundingClientRect();
  const nodeRect = nodeElement.getBoundingClientRect();
  const top = nodeRect.top - frameRect.top + frame.scrollTop;
  const left = nodeRect.left - frameRect.left + frame.scrollLeft;
  if (placement === "inside") {
    return {
      top: `${top}px`,
      left: `${left}px`,
      width: `${nodeRect.width}px`,
      height: `${nodeRect.height}px`,
    };
  }
  return {
    top: `${top + (placement === "after" ? nodeRect.height : 0)}px`,
    left: `${left}px`,
    width: `${nodeRect.width}px`,
  };
}

function createSnapGuides(nodeElement: HTMLElement, placement: CanvasDropPlacement): CanvasSnapGuide[] {
  const frame = phoneFrameRef.value;
  if (!frame) return [];
  const frameRect = frame.getBoundingClientRect();
  const nodeRect = nodeElement.getBoundingClientRect();
  const top = nodeRect.top - frameRect.top + frame.scrollTop;
  const left = nodeRect.left - frameRect.left + frame.scrollLeft;
  const width = nodeRect.width;
  const height = nodeRect.height;
  const frameWidth = frame.clientWidth;
  const frameHeight = Math.max(frame.scrollHeight, frame.clientHeight);
  const targetCenterX = left + width / 2;
  const targetCenterY = top + height / 2;

  if (placement === "inside") {
    return [
      {
        axis: "y",
        label: "容器中心",
        style: {
          top: `${targetCenterY}px`,
          left: "0px",
          width: `${frameWidth}px`,
        },
      },
      {
        axis: "x",
        label: "容器中心",
        style: {
          top: "0px",
          left: `${targetCenterX}px`,
          height: `${frameHeight}px`,
        },
      },
    ];
  }

  const edgeTop = top + (placement === "after" ? height : 0);
  return [
    {
      axis: "y",
      label: placement === "before" ? "吸附到上边缘" : "吸附到下边缘",
      style: {
        top: `${edgeTop}px`,
        left: "0px",
        width: `${frameWidth}px`,
      },
    },
    {
      axis: "x",
      label: "目标中心",
      style: {
        top: "0px",
        left: `${targetCenterX}px`,
        height: `${frameHeight}px`,
      },
    },
  ];
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
  const draggedNode = draggedNodeId ? findNode(editorState.value.schema.nodes, draggedNodeId) : undefined;
  if (source === "node" && node && draggedNodeId && (node.id === draggedNodeId || nodeContains(draggedNode, node.id))) {
    canvasDropHint.value = undefined;
    return undefined;
  }
  if (!node || !nodeElement) {
    canvasDropHint.value = {
      source,
      placement: "append",
      targetTitle: "页面末尾",
      style: {},
      guides: [],
    };
    return canvasDropHint.value;
  }
  const placement = getDropPlacement(point, node, nodeElement);
  const manifest = registry.get(node.componentName)?.manifest;
  canvasDropHint.value = {
    source,
    placement,
    targetNodeId: node.id,
    targetTitle: manifest?.title ?? node.componentName,
    style: createDropHintStyle(nodeElement, placement),
    guides: createSnapGuides(nodeElement, placement),
  };
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

function getAdjustedMoveIndex(sourceRow: OutlineRow, targetRow: OutlineRow, placement: Exclude<CanvasDropPlacement, "inside" | "append">): number {
  let index = placement === "before" ? targetRow.index : targetRow.index + 1;
  if (sourceRow.parentId === targetRow.parentId && sourceRow.index < index) {
    index -= 1;
  }
  return index;
}

function selectedGroupNodeIdsForDrag(seedNodeId: string): string[] {
  if (!isNodeMultiSelected(seedNodeId) || multiSelectedRows.value.length < 2 || !multiSelectSameParent.value) {
    return [seedNodeId];
  }
  return [...multiSelectedRows.value]
    .sort((a, b) => a.index - b.index)
    .map((row) => row.node.id);
}

function getGroupDropTarget(hint: CanvasDropHint): { parentId?: string; index: number; targetRow?: OutlineRow } | undefined {
  if (!hint.targetNodeId || hint.placement === "append") {
    return {
      parentId: undefined,
      index: editorState.value.schema.nodes.length,
    };
  }
  const targetRow = findOutlineRowByNodeId(hint.targetNodeId);
  if (!targetRow) return undefined;
  if (hint.placement === "inside") {
    return {
      parentId: targetRow.node.id,
      index: targetRow.node.children?.length ?? 0,
      targetRow,
    };
  }
  return {
    parentId: targetRow.parentId,
    index: hint.placement === "before" ? targetRow.index : targetRow.index + 1,
    targetRow,
  };
}

function isInvalidGroupParent(nodeIds: string[], parentId: string | undefined): boolean {
  if (!parentId) return false;
  if (nodeIds.includes(parentId)) return true;
  return nodeIds.some((nodeId) => nodeContains(findNode(editorState.value.schema.nodes, nodeId), parentId));
}

function moveCanvasNodeGroup(nodeIds: string[], hint: CanvasDropHint): boolean {
  if (nodeIds.length < 2) return false;
  const sourceRows = nodeIds.map((nodeId) => findOutlineRowByNodeId(nodeId));
  if (sourceRows.some((row): row is undefined => row === undefined)) return false;
  const rows = sourceRows as OutlineRow[];
  const sourceParentId = rows[0]?.parentId;
  if (!rows.every((row) => row.parentId === sourceParentId)) return false;

  const target = getGroupDropTarget(hint);
  if (!target) return false;
  if (target.targetRow && nodeIds.includes(target.targetRow.node.id)) return true;
  if (isInvalidGroupParent(nodeIds, target.parentId)) return true;

  const selected = new Set(nodeIds);
  const sourceSiblings = getSiblingNodes(editorState.value.schema.nodes, sourceParentId);
  if (!sourceSiblings) return false;
  const movingNodes = sourceSiblings.filter((node) => selected.has(node.id));
  if (movingNodes.length !== nodeIds.length) return false;

  const remainingSourceSiblings = sourceSiblings.filter((node) => !selected.has(node.id));
  let nextNodes = replaceSiblingNodes(editorState.value.schema.nodes, sourceParentId, remainingSourceSiblings);
  if (!nextNodes) return false;

  const removedBeforeTarget = sourceParentId === target.parentId ? rows.filter((row) => row.index < target.index).length : 0;
  const targetIndex = Math.max(0, target.index - removedBeforeTarget);
  const targetSiblings = getSiblingNodes(nextNodes, target.parentId);
  if (!targetSiblings) return false;

  const nextTargetSiblings = [...targetSiblings];
  nextTargetSiblings.splice(Math.min(targetIndex, nextTargetSiblings.length), 0, ...movingNodes);
  nextNodes = replaceSiblingNodes(nextNodes, target.parentId, nextTargetSiblings);
  if (!nextNodes) return false;

  commitPlaygroundSchemaChange(
    {
      ...editorState.value.schema,
      nodes: nextNodes,
    },
    "moveNodeGroup",
    nodeIds[0],
  );
  multiSelectedNodeIds.value = nodeIds;
  return true;
}

function moveCanvasNode(nodeId: string, hint: CanvasDropHint): void {
  const groupNodeIds = selectedGroupNodeIdsForDrag(nodeId);
  if (moveCanvasNodeGroup(groupNodeIds, hint)) return;

  const sourceRow = findOutlineRowByNodeId(nodeId);
  if (!sourceRow) return;
  if (!hint.targetNodeId || hint.placement === "append") {
    editorState.value = moveNodeById(editorState.value, {
      nodeId,
      index: editorState.value.schema.nodes.length,
    });
    return;
  }
  const targetRow = findOutlineRowByNodeId(hint.targetNodeId);
  if (!targetRow || targetRow.node.id === nodeId) return;
  if (hint.placement === "inside") {
    editorState.value = moveNodeById(editorState.value, {
      nodeId,
      targetParentId: targetRow.node.id,
      index: targetRow.node.children?.length ?? 0,
    });
    return;
  }
  editorState.value = moveNodeById(editorState.value, {
    nodeId,
    targetParentId: targetRow.parentId,
    index: getAdjustedMoveIndex(sourceRow, targetRow, hint.placement),
  });
}

function insertMaterialByDropHint(manifest: LowcodeMaterialManifest, hint: CanvasDropHint): void {
  if (!hint.targetNodeId || hint.placement === "append") {
    addMaterial(manifest);
    return;
  }
  const row = findOutlineRowByNodeId(hint.targetNodeId);
  if (!row) {
    addMaterial(manifest);
    return;
  }
  if (hint.placement === "inside") {
    editorState.value = insertNode(editorState.value, createNodeInput(manifest), {
      parentId: row.node.id,
      index: row.node.children?.length ?? 0,
      select: true,
    });
    return;
  }
  editorState.value = insertNode(editorState.value, createNodeInput(manifest), {
    parentId: row.parentId,
    index: hint.placement === "before" ? row.index : row.index + 1,
    select: true,
  });
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
  editorState.value = moveNodeById(editorState.value, {
    nodeId: row.node.id,
    targetParentId: row.parentId,
    index: nextIndex,
  });
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

function toggleProductSelection(productId: string): void {
  const selected = new Set(selectedProductIds.value);
  if (selected.has(productId)) {
    selected.delete(productId);
  } else {
    selected.add(productId);
  }
  selectedProductIds.value = [...selected];
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

function clearSelectedProducts(): void {
  selectedProductIds.value = [];
  applySelectedProductsToNode();
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

function getListItems(propName: string): Record<string, JsonValue>[] {
  return getPropArray(propName).map((item) => toEditableListItem(item));
}

function isListPropEditor(propSchema: LowcodePropSchema): boolean {
  return propSchema.type === "array" && propSchema.setter === "textarea";
}

function getDefaultFieldNames(propName: string): string[] {
  if (propName in defaultListFields) return defaultListFields[propName] ?? [];
  const componentName = selectedNode.value?.componentName;
  if (propName === "items" && componentName === "FloorAnchorNav") return ["id", "title", "targetId"];
  if (propName === "items" && componentName === "NavGrid") return ["id", "title", "subtitle"];
  if (propName === "items" && componentName === "StoreExpertSection") {
    return ["id", "typeText", "title", "subtitle", "metricText", "desc", "imageUrl", "buttonText"];
  }
  if (propName === "items") return ["id", "title", "subtitle", "desc", "imageUrl"];
  return ["id", "title", "subtitle"];
}

function listEditorFields(propName: string): ListEditorField[] {
  const fields = new Set(getDefaultFieldNames(propName));
  for (const item of getListItems(propName)) {
    Object.keys(item).forEach((key) => fields.add(key));
  }
  return [...fields].map((name) => commonListEditorFields[name] ?? { name, label: name, placeholder: name });
}

function createDefaultListItem(propName: string): JsonObject {
  const id = `${propName}_${Date.now().toString(36)}`;
  if (propName === "rules") {
    return { title: "新规则", content: "请输入规则内容" };
  }
  if (propName === "coupons") {
    return { id, title: "满 199 减 30", thresholdText: "全场可用", valueText: "¥30", expireText: "领取后 7 天有效" };
  }
  const componentName = selectedNode.value?.componentName;
  if (propName === "items" && componentName === "FloorAnchorNav") {
    return { id, title: "新楼层", targetId: selectedNode.value?.id ?? "" };
  }
  if (propName === "items" && componentName === "NavGrid") {
    return { id, title: "新导航", subtitle: "请输入说明" };
  }
  if (propName === "items" && componentName === "StoreExpertSection") {
    return { id, typeText: "推荐", title: "新推荐项", subtitle: "请输入推荐说明", metricText: "", desc: "", imageUrl: "", buttonText: "查看" };
  }
  return { id, title: "新项目", subtitle: "请输入说明" };
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

function listItemDragClass(propName: string, index: number): Record<string, boolean> {
  const state = listItemDragState.value;
  return {
    dragging: Boolean(state && state.propName === propName && state.fromIndex === index),
    "drag-over": Boolean(state && state.propName === propName && state.overIndex === index && state.fromIndex !== index),
  };
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

function updateProp(propName: string, propSchema: LowcodePropSchema, value: unknown): void {
  if (!selectedNode.value) return;
  editorState.value = replaceNodeProps(editorState.value, selectedNode.value.id, {
    ...selectedNode.value.props,
    [propName]: normalizeInputValue(propSchema, value),
  });
}

function normalizeInputValue(propSchema: LowcodePropSchema, value: unknown): JsonValue {
  if (propSchema.type === "number") {
    const nextValue = Number(value);
    return Number.isFinite(nextValue) ? nextValue : 0;
  }
  if (propSchema.type === "boolean") {
    return asBoolean(value);
  }
  if (propSchema.type === "array" || propSchema.type === "object") {
    if (typeof value !== "string") return value as JsonValue;
    try {
      return JSON.parse(value) as JsonValue;
    } catch {
      return value;
    }
  }
  return String(value);
}

function asBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return !["", "0", "false", "off", "no"].includes(normalized);
  }
  return Boolean(value);
}

function select(nodeId: string): void {
  editorState.value = selectNode(editorState.value, nodeId);
  multiSelectedNodeIds.value = [nodeId];
}

function removeSelected(): void {
  if (!selectedNode.value) return;
  editorState.value = removeNode(editorState.value, selectedNode.value.id);
}

function duplicateSelected(): void {
  if (!selectedNode.value) return;
  editorState.value = duplicateNode(editorState.value, selectedNode.value.id);
}

function copySelected(): void {
  if (!selectedNode.value) return;
  editorState.value = copyNode(editorState.value, selectedNode.value.id);
}

function pasteCopied(): void {
  editorState.value = pasteNode(editorState.value);
}

function insertMaterialAroundSelected(placement: "before" | "after"): void {
  const row = selectedOutlineRow.value;
  const manifest = selectedInsertManifest.value;
  if (!manifest) return;
  if (!row) {
    addMaterial(manifest);
    return;
  }
  editorState.value = insertNode(editorState.value, createNodeInput(manifest), {
    parentId: row.parentId,
    index: placement === "before" ? row.index : row.index + 1,
    select: true,
  });
}

function insertMaterialInsideSelectedContainer(): void {
  const manifest = selectedInsertManifest.value;
  if (!manifest) return;
  addMaterialToSelectedContainer(manifest);
}

function resetSchema(): void {
  window.localStorage.removeItem(STORAGE_KEY);
  const schema = cloneTemplateSchema(pageTemplates[0] as PageTemplate);
  editorState.value = createEditorState(schema, { selectedNodeId: schema.nodes[0]?.id });
  schemaDraft.value = JSON.stringify(schema, null, 2);
  releaseMessage.value = "已重置为示例页面";
  refreshReleases();
}

function applyTemplate(template: PageTemplate): void {
  if (editorState.value.dirty && !window.confirm("当前页面有未保存修改，确认应用模板并替换当前页面吗？")) {
    return;
  }
  const schema = cloneTemplateSchema(template);
  window.localStorage.removeItem(STORAGE_KEY);
  editorState.value = createEditorState(schema, {
    selectedNodeId: schema.nodes[0]?.id,
    mode: editorState.value.mode,
    viewport: editorState.value.viewport,
  });
  schemaDraft.value = JSON.stringify(schema, null, 2);
  jsonError.value = "";
  releaseMessage.value = `已应用模板：${template.title}`;
  refreshReleases();
}

function applyJson(): void {
  try {
    const parsed = JSON.parse(schemaDraft.value) as LowcodePageSchema;
    const result = validateLowcodePageSchema(parsed);
    if (!result.valid) {
      jsonError.value = result.errors.join("；");
      return;
    }
    editorState.value = createEditorState(parsed, {
      selectedNodeId: parsed.nodes[0]?.id,
      mode: editorState.value.mode,
      viewport: editorState.value.viewport,
    });
    jsonError.value = "";
  } catch (error) {
    jsonError.value = error instanceof Error ? error.message : "JSON 解析失败";
  }
}

function updatePageTitle(value: string): void {
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      title: value,
    },
    dirty: true,
    lastAction: "updatePageTitle",
  };
}

function updatePageStatus(status: LowcodePageStatus): void {
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      status,
    },
    dirty: true,
    lastAction: "updatePageStatus",
  };
}

function updatePublishEnvironment(environment: "test" | "pre" | "prod"): void {
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      publishMeta: {
        ...editorState.value.schema.publishMeta,
        environment,
      },
    },
    dirty: true,
    lastAction: "updatePublishEnvironment",
  };
}

function addDataSource(): void {
  const nextDataSource: LowcodeDataSourceConfig = {
    id: `ds_${Date.now().toString(36)}`,
    type: "custom.http",
    bindTo: "data",
    params: {},
    cache: {
      ttlSeconds: 60,
      scope: "public",
    },
  };
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      dataSources: [...(editorState.value.schema.dataSources ?? []), nextDataSource],
    },
    dirty: true,
    lastAction: "addDataSource",
  };
}

function updateDataSource(index: number, patch: Partial<LowcodeDataSourceConfig>): void {
  const dataSources = [...(editorState.value.schema.dataSources ?? [])];
  const current = dataSources[index];
  if (!current) return;
  dataSources[index] = {
    ...current,
    ...patch,
  };
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      dataSources,
    },
    dirty: true,
    lastAction: "updateDataSource",
  };
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
  const dataSources = [...(editorState.value.schema.dataSources ?? [])];
  dataSources.splice(index, 1);
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      dataSources,
    },
    dirty: true,
    lastAction: "removeDataSource",
  };
}

function defaultActionParams(type: string): JsonObject {
  if (type === "navigate") return { url: "/activity/demo", openInNewTab: false };
  if (type === "coupon.receive") return { couponId: "coupon_demo" };
  if (type === "tracking.click") return { eventName: "lowcode_click" };
  return {};
}

function addAction(type = "navigate"): void {
  const nextAction: LowcodeActionConfig = {
    id: `act_${Date.now().toString(36)}`,
    type,
    params: defaultActionParams(type),
  };
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      actions: [...(editorState.value.schema.actions ?? []), nextAction],
    },
    dirty: true,
    lastAction: "addAction",
  };
}

function updateAction(index: number, patch: Partial<LowcodeActionConfig>): void {
  const actions = [...(editorState.value.schema.actions ?? [])];
  const current = actions[index];
  if (!current) return;
  actions[index] = {
    ...current,
    ...patch,
  };
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      actions,
    },
    dirty: true,
    lastAction: "updateAction",
  };
}

function updateActionId(index: number, nextId: string): void {
  const actions = [...(editorState.value.schema.actions ?? [])];
  const current = actions[index];
  if (!current) return;
  actions[index] = {
    ...current,
    id: nextId,
  };
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      actions,
      nodes: renameActionRefs(editorState.value.schema.nodes, current.id, nextId),
    },
    dirty: true,
    lastAction: "updateActionId",
  };
}

function updateActionType(index: number, type: string): void {
  updateAction(index, { type, params: defaultActionParams(type) });
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
  const actions = [...(editorState.value.schema.actions ?? [])];
  const [removed] = actions.splice(index, 1);
  if (!removed) return;
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      actions,
      nodes: removeActionRefs(editorState.value.schema.nodes, removed.id),
    },
    dirty: true,
    lastAction: "removeAction",
  };
}

function removeActionRefs(nodes: LowcodeNode[], actionId: string): LowcodeNode[] {
  return nodes.map((node) => {
    const events = Object.fromEntries(
      Object.entries(node.events ?? {}).filter(([, ref]) => ref.actionId !== actionId),
    );
    return {
      ...node,
      events: Object.keys(events).length ? events : undefined,
      children: node.children?.length ? removeActionRefs(node.children, actionId) : node.children,
    };
  });
}

function renameActionRefs(nodes: LowcodeNode[], previousActionId: string, nextActionId: string): LowcodeNode[] {
  return nodes.map((node) => {
    const events = Object.fromEntries(
      Object.entries(node.events ?? {}).map(([eventName, ref]) => [
        eventName,
        ref.actionId === previousActionId ? { ...ref, actionId: nextActionId } : ref,
      ]),
    );
    return {
      ...node,
      events: Object.keys(events).length ? events : undefined,
      children: node.children?.length ? renameActionRefs(node.children, previousActionId, nextActionId) : node.children,
    };
  });
}

function actionParamsText(action: LowcodeActionConfig): string {
  return JSON.stringify(action.params ?? {}, null, 2);
}

function selectedEventActionId(eventName: string): string {
  return selectedNode.value?.events?.[eventName]?.actionId ?? "";
}

function bindSelectedEvent(eventName: string, actionId: string): void {
  if (!selectedNode.value) return;
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      nodes: updateNodeById(editorState.value.schema.nodes, selectedNode.value.id, (node) => {
        const events = { ...(node.events ?? {}) };
        if (!actionId) {
          delete events[eventName];
        } else {
          events[eventName] = { actionId };
        }
        return {
          ...node,
          events: Object.keys(events).length ? events : undefined,
        };
      }),
    },
    dirty: true,
    lastAction: "bindSelectedEvent",
  };
}

function asText(value: JsonValue | undefined): string {
  return typeof value === "string" ? value : value == null ? "" : JSON.stringify(value, null, 2);
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

function applySampleProducts(): void {
  const catalog = resourceProductCatalog.value.length ? resourceProductCatalog.value : sampleProducts;
  selectedProductIds.value = catalog.slice(0, 3).map((product) => product.id);
  applySelectedProductsToNode();
}

function isStructured(propSchema: LowcodePropSchema): boolean {
  return propSchema.type === "array" || propSchema.type === "object" || propSchema.setter === "dataSourceSelector";
}

function dataSourceParamsText(dataSource: LowcodeDataSourceConfig): string {
  return JSON.stringify(dataSource.params ?? {}, null, 2);
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

function setReleaseMessage(release: LocalPageRelease, action: string): void {
  releaseMessage.value = `${action}：${release.title} / ${release.pageVersion}`;
}

function ensurePublishReady(action: string): boolean {
  const blockingErrors = publishChecks.value.filter((check) => check.status === "error");
  if (!blockingErrors.length) return true;
  releaseMessage.value = `${action}失败：${blockingErrors.map((check) => check.title).join("、")} 未通过`;
  return false;
}

function saveSchema(): void {
  const release = configPlatformClient.saveDraft(editorState.value.schema);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(release.schema));
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
  const release = configPlatformClient.createPreview(editorState.value.schema);
  refreshReleases();
  setReleaseMessage(release, "已生成预览");
  openRuntime({ releaseId: release.id });
}

function publishCurrentPage(): void {
  if (!ensurePublishReady("发布")) return;
  const release = configPlatformClient.publishPage(editorState.value.schema);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(release.schema));
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
  if (!window.confirm(`确认将版本 ${release.pageVersion} 作为新的已发布版本吗？`)) return;
  const rollbackRelease = configPlatformClient.publishPage({
    ...release.schema,
    status: "published",
    publishMeta: {
      ...release.schema.publishMeta,
      environment: editorState.value.schema.publishMeta.environment,
    },
  });
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rollbackRelease.schema));
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

function releaseKindLabel(kind: LocalPageRelease["kind"]): string {
  if (kind === "published") return "已发布";
  if (kind === "preview") return "预览";
  return "草稿";
}

function formatReleaseTime(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
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
      </div>

      <div class="toolbar" aria-label="编辑器工具栏">
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
    </header>

    <aside class="left-panel">
      <section class="panel-section">
        <div class="panel-title">
          <Layers :size="16" />
          <span>模板</span>
        </div>
        <button
          v-for="template in pageTemplates"
          :key="template.id"
          class="template-item"
          type="button"
          @click="applyTemplate(template)"
        >
          <span>
            <strong>{{ template.title }}</strong>
            <small>{{ template.description }}</small>
          </span>
          <Plus :size="15" />
        </button>
      </section>

      <section class="panel-section">
        <div class="panel-title">
          <Plus :size="16" />
          <span>物料</span>
        </div>
        <button
          v-for="material in materials"
          :key="material.manifest.componentName"
          class="material-item"
          draggable="true"
          @pointerdown="onMaterialPointerDown($event, material.manifest)"
          @dragstart="onDragStart($event, material.manifest)"
          @dragend="onMaterialDragEnd"
          @click="onMaterialClick($event, material.manifest)"
        >
          <span>
            <strong>{{ material.manifest.title }}</strong>
            <small>{{ material.manifest.category }} / {{ material.manifest.componentName }}</small>
          </span>
          <Plus :size="15" />
        </button>
        <div v-if="selectedNodeIsContainer" class="container-target">
          <strong>当前容器：{{ selectedManifest?.title }}</strong>
          <span>点击下方按钮可把物料加入选中容器</span>
          <button
            v-for="material in materials"
            :key="`child-${material.manifest.componentName}`"
            @click="addMaterialToSelectedContainer(material.manifest)"
          >
            <Plus :size="14" />
            <span>{{ material.manifest.title }}</span>
          </button>
        </div>
      </section>

      <section class="panel-section">
        <div class="panel-title">
          <Layers :size="16" />
          <span>结构</span>
        </div>
        <div v-if="multiSelectSummary" class="outline-selection-summary">
          {{ multiSelectSummary }}
        </div>
        <button
          v-for="row in outlineRows"
          :key="row.node.id"
          class="outline-item"
          :class="{
            selected: editorState.selectedNodeId === row.node.id,
            'multi-selected': isNodeMultiSelected(row.node.id),
            'group-draggable': canDragSelectedGroup(row.node.id),
          }"
          :style="{ paddingLeft: `${12 + row.depth * 18}px` }"
          draggable="true"
          @pointerdown="onOutlineNodePointerDown($event, row.node.id)"
          @dragstart="onNodeDragStart($event, row.node.id)"
          @dragover.prevent
          @drop.prevent="onNodeDrop($event, row)"
          @click="onOutlineNodeClick($event, row.node.id)"
        >
          <GripVertical :size="15" class="drag-icon" />
          <span
            class="outline-check"
            :class="{ checked: isNodeMultiSelected(row.node.id) }"
            title="多选节点"
            @click.stop="toggleMultiSelected(row.node.id)"
          >
            {{ isNodeMultiSelected(row.node.id) ? "✓" : "" }}
          </span>
          <span class="outline-index">{{ row.index + 1 }}</span>
          <strong>{{ registry.get(row.node.componentName)?.manifest.title ?? row.node.componentName }}</strong>
        </button>
      </section>
    </aside>

    <section
      class="canvas-panel"
      @dragover.prevent="onCanvasDragOver"
      @dragleave="onCanvasDragLeave"
      @drop.prevent="onCanvasDrop"
    >
      <div class="canvas-top">
        <div>
          <strong>{{ editorState.mode === "outline" ? "Schema" : "H5 画布" }}</strong>
          <span>{{ validation.valid ? "校验通过" : validation.errors[0] }}</span>
        </div>
        <div class="viewport-switch">
          <button
            title="iPhone 视口"
            :class="{ active: editorState.viewport.width === 375 }"
            @click="editorState = setEditorViewport(editorState, { width: 375 })"
          >
            <Smartphone :size="16" />
            <span>375</span>
          </button>
          <button
            title="大屏 H5 视口"
            :class="{ active: editorState.viewport.width === 430 }"
            @click="editorState = setEditorViewport(editorState, { width: 430 })"
          >
            <PanelRight :size="16" />
            <span>430</span>
          </button>
        </div>
      </div>

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
            <button type="button" title="在当前节点前插入" @click="insertMaterialAroundSelected('before')">
              <ArrowUp :size="15" />
              <span>前方插入</span>
            </button>
            <button type="button" title="在当前节点后插入" @click="insertMaterialAroundSelected('after')">
              <ArrowDown :size="15" />
              <span>后方插入</span>
            </button>
            <button
              type="button"
              title="加入选中容器"
              :disabled="!selectedNodeIsContainer"
              @click="insertMaterialInsideSelectedContainer"
            >
              <Plus :size="15" />
              <span>加入容器</span>
            </button>
            <button type="button" title="上移当前节点" :disabled="!canMoveSelectedUp" @click="moveSelected(-1)">
              <ArrowUp :size="15" />
              <span>上移</span>
            </button>
            <button type="button" title="下移当前节点" :disabled="!canMoveSelectedDown" @click="moveSelected(1)">
              <ArrowDown :size="15" />
              <span>下移</span>
            </button>
            <button type="button" title="创建副本" @click="duplicateSelected">
              <Copy :size="15" />
              <span>副本</span>
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
          :style="{ width: `${editorState.viewport.width}px` }"
          @pointerdown="onPhoneFramePointerDown"
        >
          <div class="phone-status">
            <span>{{ editorState.schema.title }}</span>
            <span>H5</span>
          </div>
          <div
            v-for="guide in canvasDropHint?.guides ?? []"
            :key="`${guide.axis}-${guide.label}-${guide.style.top ?? guide.style.left}`"
            class="canvas-snap-guide"
            :class="`is-${guide.axis}`"
            :style="guide.style"
            aria-hidden="true"
          >
            <span>{{ guide.label }}</span>
          </div>
          <div
            v-if="canvasDropHint && canvasDropHint.placement !== 'append'"
            class="canvas-drop-indicator"
            :class="`is-${canvasDropHint.placement}`"
            :style="canvasDropHint.style"
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
        </div>
      </div>

      <div v-else class="schema-editor">
        <textarea v-model="schemaDraft" spellcheck="false" />
        <div class="schema-actions">
          <button @click="applyJson">应用 JSON</button>
          <span v-if="jsonError">{{ jsonError }}</span>
        </div>
      </div>
    </section>

    <aside class="right-panel">
      <section class="panel-section">
        <div class="panel-title">
          <PanelRight :size="16" />
          <span>页面</span>
        </div>
        <label class="field">
          <span>标题</span>
          <input :value="editorState.schema.title" @input="updatePageTitle(($event.target as HTMLInputElement).value)" />
        </label>
        <label class="field">
          <span>Page ID</span>
          <input :value="editorState.schema.pageId" readonly />
        </label>
        <label class="field">
          <span>状态</span>
          <select :value="editorState.schema.status" @change="updatePageStatus(($event.target as HTMLSelectElement).value as LowcodePageStatus)">
            <option value="draft">draft</option>
            <option value="preview">preview</option>
            <option value="published">published</option>
            <option value="disabled">disabled</option>
          </select>
        </label>
        <label class="field">
          <span>环境</span>
          <select :value="editorState.schema.publishMeta.environment" @change="updatePublishEnvironment(($event.target as HTMLSelectElement).value as 'test' | 'pre' | 'prod')">
            <option value="test">test</option>
            <option value="pre">pre</option>
            <option value="prod">prod</option>
          </select>
        </label>
        <p v-if="releaseMessage" class="publish-message">{{ releaseMessage }}</p>
      </section>

      <section class="panel-section">
        <div class="panel-title">
          <PanelRight :size="16" />
          <span>发布检查</span>
        </div>
        <div class="publish-summary" :class="{ blocked: hasPublishBlockingErrors }">
          <strong>{{ hasPublishBlockingErrors ? "存在阻塞项" : "可以生成预览" }}</strong>
          <span>
            通过 {{ publishCheckSummary.pass }} / 警告 {{ publishCheckSummary.warning }} / 错误 {{ publishCheckSummary.error }}
          </span>
        </div>
        <div class="publish-check-list">
          <article
            v-for="check in publishChecks"
            :key="check.id"
            class="publish-check"
            :class="`is-${check.status}`"
          >
            <strong>{{ check.title }}</strong>
            <span>{{ check.status }}</span>
            <p>{{ check.description }}</p>
          </article>
        </div>
      </section>

      <section class="panel-section">
        <div class="panel-title">
          <Save :size="16" />
          <span>本地版本</span>
        </div>
        <div v-if="releases.length" class="release-list">
          <article
            v-for="release in releases"
            :key="release.id"
            class="release-card"
            :class="{ selected: selectedReleaseId === release.id }"
          >
            <div>
              <strong>{{ releaseKindLabel(release.kind) }}</strong>
              <span>{{ release.pageVersion }}</span>
            </div>
            <small>{{ formatReleaseTime(release.createdAt) }}</small>
            <div class="release-actions">
              <button type="button" @click="selectRelease(release.id)">对比</button>
              <button type="button" @click="loadReleaseById(release.id)">载入</button>
              <button type="button" @click="openReleaseRuntime(release.id)">打开</button>
            </div>
          </article>
        </div>
        <div v-else class="empty-state">暂无本地版本</div>
        <div v-if="selectedRelease" class="release-diff-panel">
          <div class="release-diff-head">
            <strong>版本对比</strong>
            <span>{{ releaseDiffChangedCount ? `${releaseDiffChangedCount} 项差异` : "无摘要差异" }}</span>
          </div>
          <dl class="release-diff-list">
            <div
              v-for="item in releaseDiffItems"
              :key="item.label"
              :class="{ changed: item.changed }"
            >
              <dt>{{ item.label }}</dt>
              <dd>
                <span>{{ item.current }}</span>
                <strong>{{ item.selected }}</strong>
              </dd>
            </div>
          </dl>
          <div class="release-diff-actions">
            <button type="button" @click="loadSelectedRelease">载入所选</button>
            <button type="button" class="danger" @click="rollbackPublishSelectedRelease">回滚发布</button>
          </div>
        </div>
      </section>

      <section class="panel-section">
        <div class="panel-title">
          <Layers :size="16" />
          <span>属性</span>
        </div>

        <div v-if="selectedNode && selectedManifest" class="inspector">
          <div class="selected-card">
            <strong>{{ selectedManifest.title }}</strong>
            <span>{{ selectedNode.id }}</span>
          </div>

          <div v-if="canUseAssetLibrary" class="resource-panel">
            <div class="resource-panel-head">
              <div>
                <strong>
                  <Image :size="15" />
                  <span>素材库</span>
                </strong>
                <small>选择图片后写入当前节点</small>
              </div>
              <select v-model="assetTargetPropName" aria-label="素材写入字段">
                <option v-for="option in imagePropOptions" :key="option.name" :value="option.name">
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div class="resource-filters">
              <label class="search-field">
                <Search :size="14" />
                <input v-model="assetKeyword" placeholder="搜索素材" />
              </label>
              <select v-model="assetCategory" aria-label="素材分类">
                <option v-for="category in assetCategories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            <div class="asset-library">
              <button
                v-for="asset in filteredAssets"
                :key="asset.id"
                type="button"
                class="asset-card"
                @click="applyAssetToSelected(asset)"
              >
                <img :src="asset.url" alt="" />
                <span>
                  <strong>{{ asset.title }}</strong>
                  <small>{{ asset.category }}</small>
                </span>
              </button>
            </div>
            <div v-if="isAssetSearching" class="mini-empty">素材搜索中</div>
            <div v-else-if="!filteredAssets.length" class="mini-empty">没有匹配素材</div>
          </div>

          <div v-if="isProductMaterialSelected" class="resource-panel">
            <div class="resource-panel-head">
              <div>
                <strong>
                  <Database :size="15" />
                  <span>商品选择器</span>
                </strong>
                <small>已选 {{ selectedProducts.length }} 个商品</small>
              </div>
              <button type="button" class="mini-button" @click="applySampleProducts">示例商品</button>
            </div>
            <label class="search-field product-search">
              <Search :size="14" />
              <input v-model="productKeyword" placeholder="搜索商品名称、SKU 或标签" />
            </label>
            <div v-if="selectedNode.dataBinding?.items" class="resource-hint">
              当前节点正在绑定数据源 products，写入静态商品会取消本节点 items 绑定。
            </div>
            <div class="product-picker">
              <label
                v-for="product in filteredProducts"
                :key="product.id"
                class="product-option"
                :class="{ selected: selectedProductIds.includes(product.id) }"
              >
                <input
                  type="checkbox"
                  :checked="selectedProductIds.includes(product.id)"
                  @change="toggleProductSelection(product.id)"
                />
                <img :src="product.imageUrl" alt="" />
                <span>
                  <strong>{{ product.title }}</strong>
                  <small>{{ product.id }} / {{ product.desc }}</small>
                  <em>{{ product.priceText }}</em>
                </span>
              </label>
            </div>
            <div v-if="isProductSearching" class="mini-empty">商品搜索中</div>
            <div v-else-if="!filteredProducts.length" class="mini-empty">没有匹配商品</div>
            <div class="resource-actions">
              <button type="button" @click="applySelectedProductsToNode">应用选中商品</button>
              <button type="button" @click="bindSelectedProductMaterialToDataSource">绑定数据源 products</button>
              <button type="button" class="ghost-danger" @click="clearSelectedProducts">清空静态商品</button>
            </div>
          </div>

          <div
            v-for="(propSchema, propName) in selectedManifest.propsSchema"
            :key="String(propName)"
            class="field"
          >
            <span>{{ propSchema.label }}</span>
            <div v-if="isListPropEditor(propSchema)" class="list-prop-editor">
              <div class="list-prop-head">
                <small>已配置 {{ getListItems(String(propName)).length }} 项</small>
                <button type="button" @click="addListItem(String(propName), propSchema)">新增一项</button>
              </div>
              <div v-if="!getListItems(String(propName)).length" class="mini-empty">暂无列表项，点击新增开始配置</div>
              <article
                v-for="(item, itemIndex) in getListItems(String(propName))"
                :key="`${String(propName)}-${itemIndex}`"
                class="list-item-editor"
                :class="listItemDragClass(String(propName), itemIndex)"
                draggable="true"
                @dragstart="onListItemDragStart($event, String(propName), itemIndex)"
                @dragover="onListItemDragOver($event, String(propName), itemIndex)"
                @drop="onListItemDrop($event, String(propName), propSchema, itemIndex)"
                @dragend="onListItemDragEnd"
              >
                <div class="list-item-head">
                  <strong>
                    <GripVertical :size="14" />
                    <span>第 {{ itemIndex + 1 }} 项</span>
                  </strong>
                  <div>
                    <button type="button" :disabled="itemIndex === 0" @click="moveListItem(String(propName), propSchema, itemIndex, -1)">上移</button>
                    <button
                      type="button"
                      :disabled="itemIndex === getListItems(String(propName)).length - 1"
                      @click="moveListItem(String(propName), propSchema, itemIndex, 1)"
                    >
                      下移
                    </button>
                    <button type="button" @click="duplicateListItem(String(propName), propSchema, itemIndex)">复制</button>
                    <button type="button" class="danger" @click="removeListItem(String(propName), propSchema, itemIndex)">删除</button>
                  </div>
                </div>
                <div class="list-field-grid">
                  <label
                    v-for="field in listEditorFields(String(propName))"
                    :key="`${String(propName)}-${itemIndex}-${field.name}`"
                    class="mini-field"
                    :class="{ wide: field.multiline || field.name === 'imageUrl' || field.name === 'content' }"
                  >
                    <span>{{ field.label }}</span>
                    <textarea
                      v-if="field.multiline"
                      rows="2"
                      :placeholder="field.placeholder"
                      :value="asText(item[field.name])"
                      @input="updateListItemField(String(propName), propSchema, itemIndex, field.name, ($event.target as HTMLTextAreaElement).value)"
                    />
                    <input
                      v-else
                      type="text"
                      :placeholder="field.placeholder"
                      :value="asText(item[field.name])"
                      @input="updateListItemField(String(propName), propSchema, itemIndex, field.name, ($event.target as HTMLInputElement).value)"
                    />
                  </label>
                </div>
              </article>
              <details class="json-fallback">
                <summary>JSON 高级编辑</summary>
                <textarea
                  :value="asText(selectedNode.props[String(propName)])"
                  rows="5"
                  @input="updateProp(String(propName), propSchema, ($event.target as HTMLTextAreaElement).value)"
                />
              </details>
            </div>
            <textarea
              v-else-if="isStructured(propSchema) || propSchema.setter === 'textarea' || propSchema.setter === 'richText'"
              :value="asText(selectedNode.props[String(propName)])"
              rows="5"
              @input="updateProp(String(propName), propSchema, ($event.target as HTMLTextAreaElement).value)"
            />
            <div
              v-else-if="propSchema.setter === 'switch' || propSchema.type === 'boolean'"
              class="switch-field"
            >
              <input
                type="checkbox"
                :checked="asBoolean(selectedNode.props[String(propName)])"
                @change="updateProp(String(propName), propSchema, ($event.target as HTMLInputElement).checked)"
              />
              <span class="switch-track" aria-hidden="true">
                <i />
              </span>
              <em>{{ asBoolean(selectedNode.props[String(propName)]) ? "开启" : "关闭" }}</em>
            </div>
            <input
              v-else-if="propSchema.setter === 'color'"
              type="color"
              :value="asText(selectedNode.props[String(propName)]) || '#111827'"
              @input="updateProp(String(propName), propSchema, ($event.target as HTMLInputElement).value)"
            />
            <input
              v-else
              :type="propSchema.type === 'number' ? 'number' : 'text'"
              :value="asText(selectedNode.props[String(propName)])"
              @input="updateProp(String(propName), propSchema, ($event.target as HTMLInputElement).value)"
            />
            <div v-if="['ProductList', 'FlashSaleList'].includes(selectedNode.componentName) && String(propName) === 'items'" class="quick-actions">
              <button type="button" @click="applySampleProducts">使用示例商品</button>
              <button type="button" @click="bindSelectedProductMaterialToDataSource">绑定数据源 products</button>
            </div>
          </div>

          <div v-if="selectedManifest.events?.length" class="event-binding-list">
            <div class="panel-title compact-title">
              <PanelRight :size="15" />
              <span>事件</span>
            </div>
            <label
              v-for="event in selectedManifest.events"
              :key="event.name"
              class="field"
            >
              <span>{{ event.title }}</span>
              <select
                :value="selectedEventActionId(event.name)"
                @change="bindSelectedEvent(event.name, ($event.target as HTMLSelectElement).value)"
              >
                <option value="">未绑定</option>
                <option
                  v-for="action in editorState.schema.actions ?? []"
                  :key="`${event.name}-${action.id}`"
                  :value="action.id"
                >
                  {{ action.id }} / {{ action.type }}
                </option>
              </select>
            </label>
          </div>

          <div class="toolbar inspector-actions">
            <button title="上移节点" :disabled="!canMoveSelectedUp" @click="moveSelected(-1)">
              <ArrowUp :size="16" />
              <span>上移</span>
            </button>
            <button title="下移节点" :disabled="!canMoveSelectedDown" @click="moveSelected(1)">
              <ArrowDown :size="16" />
              <span>下移</span>
            </button>
            <button title="复制节点" @click="copySelected">
              <Copy :size="16" />
              <span>复制</span>
            </button>
            <button title="粘贴节点" :disabled="!editorState.clipboard" @click="pasteCopied">
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

      <section class="panel-section">
        <div class="panel-title">
          <Database :size="16" />
          <span>数据源</span>
        </div>
        <div class="data-source-list">
          <div
            v-for="(dataSource, index) in editorState.schema.dataSources ?? []"
            :key="dataSource.id"
            class="data-source-card"
          >
            <label class="field">
              <span>ID</span>
              <input :value="dataSource.id" @input="updateDataSource(index, { id: ($event.target as HTMLInputElement).value })" />
            </label>
            <label class="field">
              <span>类型</span>
              <input :value="dataSource.type" @input="updateDataSource(index, { type: ($event.target as HTMLInputElement).value })" />
            </label>
            <label class="field">
              <span>绑定到</span>
              <input :value="dataSource.bindTo" @input="updateDataSource(index, { bindTo: ($event.target as HTMLInputElement).value })" />
            </label>
            <label class="field">
              <span>参数 JSON</span>
              <textarea
                :value="dataSourceParamsText(dataSource)"
                rows="4"
                @change="updateDataSourceParams(index, ($event.target as HTMLTextAreaElement).value)"
              />
            </label>
            <div
              class="data-source-status"
              :class="`is-${dataSourceRecordFor(dataSource.id)?.status ?? 'pending'}`"
            >
              <strong>{{ dataSourceRecordLabel(dataSourceRecordFor(dataSource.id)) }}</strong>
              <span v-if="dataSourceRecordFor(dataSource.id)?.error">{{ dataSourceRecordFor(dataSource.id)?.error }}</span>
              <span v-else>{{ dataSource.type }} / {{ dataSource.bindTo || "未绑定" }}</span>
            </div>
            <button class="text-danger" @click="removeDataSource(index)">删除数据源</button>
          </div>
        </div>
        <button class="reset-button" @click="addDataSource">
          <Plus :size="16" />
          <span>新增数据源</span>
        </button>
      </section>

      <section class="panel-section">
        <div class="panel-title">
          <PanelRight :size="16" />
          <span>动作</span>
        </div>
        <div class="data-source-list">
          <div
            v-for="(action, index) in editorState.schema.actions ?? []"
            :key="action.id"
            class="action-card"
          >
            <label class="field">
              <span>ID</span>
              <input :value="action.id" @input="updateActionId(index, ($event.target as HTMLInputElement).value)" />
            </label>
            <label class="field">
              <span>类型</span>
              <select :value="action.type" @change="updateActionType(index, ($event.target as HTMLSelectElement).value)">
                <option v-for="option in actionTypeOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </label>
            <label class="field">
              <span>参数 JSON</span>
              <textarea
                :value="actionParamsText(action)"
                rows="4"
                @change="updateActionParams(index, ($event.target as HTMLTextAreaElement).value)"
              />
            </label>
            <button class="text-danger" @click="removeAction(index)">删除动作</button>
          </div>
        </div>
        <button class="reset-button" @click="addAction()">
          <Plus :size="16" />
          <span>新增动作</span>
        </button>
        <p v-if="actionMessage" class="action-message">{{ actionMessage }}</p>
      </section>

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
