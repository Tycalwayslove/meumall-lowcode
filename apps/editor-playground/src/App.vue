<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import {
  ArrowDown,
  ArrowUp,
  Code2,
  Copy,
  Database,
  Eye,
  GripVertical,
  Layers,
  MonitorSmartphone,
  PanelRight,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  Smartphone,
  Trash2,
  Undo2,
} from "@lucide/vue";
import {
  createDataSourceRegistry,
  createSafeActionExecutor,
  createSafeActionRegistry,
  encodePageSchemaToUrlParam,
  resolveLowcodeDataSources,
  type DataSourceResolutionRecord,
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
  createPreview,
  getDraft,
  getPublished,
  getRelease,
  listReleases,
  publishPage,
  saveDraft,
  type LocalPageRelease,
} from "./mockPlatform";

const STORAGE_KEY = "meumall-lowcode-editor-playground";
const REACT_H5_RUNTIME_URL = import.meta.env.VITE_REACT_H5_RUNTIME_URL ?? "http://localhost:5174/";
const runtimeQuery = new URLSearchParams(window.location.search);
const isRuntimeMode = runtimeQuery.get("runtime") === "1";

const sampleAssets = [
  {
    title: "活动女装横幅",
    url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "夏季穿搭 Banner",
    url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "质感商品陈列",
    url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
  },
];

const sampleProducts = [
  {
    id: "sku_001",
    title: "轻盈通勤手提包",
    priceText: "¥199",
    desc: "活动价",
    imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sku_002",
    title: "夏季舒适凉鞋",
    priceText: "¥129",
    desc: "限时补贴",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sku_003",
    title: "防晒轻薄衬衫",
    priceText: "¥159",
    desc: "热卖单品",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80",
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
const releaseMessage = ref("");
const releases = ref<LocalPageRelease[]>(listReleases(editorState.value.schema.pageId));
const selectedInsertComponentName = ref(materials[0]?.manifest.componentName ?? "");
const previewData = ref<JsonObject>({});
const runtimePreviewData = ref<JsonObject>({});
const previewDataSourceRecords = ref<DataSourceResolutionRecord[]>([]);
const runtimeDataSourceRecords = ref<DataSourceResolutionRecord[]>([]);
const isPreviewDataResolving = ref(false);
const isRuntimeDataResolving = ref(false);
const actionMessage = ref("");
let previewResolutionSeq = 0;
let runtimeResolutionSeq = 0;

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
const selectedInsertManifest = computed(() => {
  return materials.find((item) => item.manifest.componentName === selectedInsertComponentName.value)?.manifest;
});
const canMoveSelectedUp = computed(() => Boolean(selectedOutlineRow.value && selectedOutlineRow.value.index > 0));
const canMoveSelectedDown = computed(() => {
  const row = selectedOutlineRow.value;
  if (!row) return false;
  return row.index < getSiblingCount(row.parentId) - 1;
});
const runtimeSchema = computed(() => resolveRuntimeSchema() ?? editorState.value.schema);
const runtimeTitle = computed(() => runtimeSchema.value.title || "MeuMall Lowcode H5");

watch(
  () => editorState.value.schema,
  (schema) => {
    schemaDraft.value = JSON.stringify(schema, null, 2);
  },
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

function findNode(nodes: LowcodeNode[], nodeId?: string): LowcodeNode | undefined {
  if (!nodeId) return undefined;
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    const child = findNode(node.children ?? [], nodeId);
    if (child) return child;
  }
  return undefined;
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

function getSiblingCount(parentId?: string): number {
  if (!parentId) return editorState.value.schema.nodes.length;
  return findNode(editorState.value.schema.nodes, parentId)?.children?.length ?? 0;
}

function resolveSampleProductDataSource(dataSource: LowcodeDataSourceConfig): JsonValue {
  const limit = typeof dataSource.params?.limit === "number" ? dataSource.params.limit : sampleProducts.length;
  return sampleProducts.slice(0, limit) as JsonValue;
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

function onDragStart(event: DragEvent, manifest: LowcodeMaterialManifest): void {
  event.dataTransfer?.setData("application/x-meumall-material", manifest.componentName);
  event.dataTransfer?.setData("text/plain", manifest.componentName);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
}

function onCanvasDrop(event: DragEvent): void {
  const componentName = event.dataTransfer?.getData("application/x-meumall-material");
  const material = materials.find((item) => item.manifest.componentName === componentName);
  if (material) addMaterialToSelectedContainer(material.manifest);
}

function onNodeDragStart(event: DragEvent, nodeId: string): void {
  draggedNodeId.value = nodeId;
  event.dataTransfer?.setData("application/x-meumall-node", nodeId);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
}

function onNodeDrop(event: DragEvent, target: OutlineRow): void {
  const nodeId = event.dataTransfer?.getData("application/x-meumall-node") || draggedNodeId.value;
  if (!nodeId) return;
  if (target.node.id === nodeId) return;
  editorState.value = moveNodeById(editorState.value, {
    nodeId,
    targetParentId: target.parentId,
    index: target.index,
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

function bindSelectedProductListToDataSource(): void {
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
    lastAction: "bindSelectedProductListToDataSource",
  };
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
    return Boolean(value);
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

function select(nodeId: string): void {
  editorState.value = selectNode(editorState.value, nodeId);
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

function applySampleProducts(): void {
  const manifest = selectedManifest.value;
  const propSchema = manifest?.propsSchema.items;
  if (!propSchema) return;
  updateProp("items", propSchema, JSON.stringify(sampleProducts, null, 2));
}

function isStructured(propSchema: LowcodePropSchema): boolean {
  return propSchema.type === "array" || propSchema.type === "object" || propSchema.setter === "dataSourceSelector";
}

function dataSourceParamsText(dataSource: LowcodeDataSourceConfig): string {
  return JSON.stringify(dataSource.params ?? {}, null, 2);
}

function refreshReleases(): void {
  releases.value = listReleases(editorState.value.schema.pageId);
}

function resolveRuntimeSchema(): LowcodePageSchema | undefined {
  const releaseId = runtimeQuery.get("releaseId");
  if (releaseId) return getRelease(releaseId)?.schema;
  const pageId = runtimeQuery.get("pageId") || editorState.value.schema.pageId;
  return getPublished(pageId) ?? getDraft(pageId);
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

function saveSchema(): void {
  const release = saveDraft(editorState.value.schema);
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
  const release = createPreview(editorState.value.schema);
  refreshReleases();
  setReleaseMessage(release, "已生成预览");
  openRuntime({ releaseId: release.id });
}

function publishCurrentPage(): void {
  const release = publishPage(editorState.value.schema);
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
  setReleaseMessage(release, "已载入版本");
}

function loadReleaseById(releaseId: string): void {
  const release = getRelease(releaseId);
  if (release) loadRelease(release);
}

function openReleaseRuntime(releaseId: string): void {
  openRuntime({ releaseId });
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
          @dragstart="onDragStart($event, material.manifest)"
          @click="addMaterial(material.manifest)"
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
        <button
          v-for="row in outlineRows"
          :key="row.node.id"
          class="outline-item"
          :class="{ selected: editorState.selectedNodeId === row.node.id }"
          :style="{ paddingLeft: `${12 + row.depth * 18}px` }"
          draggable="true"
          @dragstart="onNodeDragStart($event, row.node.id)"
          @dragover.prevent
          @drop.prevent="onNodeDrop($event, row)"
          @click="select(row.node.id)"
        >
          <GripVertical :size="15" class="drag-icon" />
          <span>{{ row.index + 1 }}</span>
          <strong>{{ registry.get(row.node.componentName)?.manifest.title ?? row.node.componentName }}</strong>
        </button>
      </section>
    </aside>

    <section class="canvas-panel" @dragover.prevent @drop.prevent="onCanvasDrop">
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
        <div class="phone-frame" :style="{ width: `${editorState.viewport.width}px` }">
          <div class="phone-status">
            <span>{{ editorState.schema.title }}</span>
            <span>H5</span>
          </div>
          <LowcodeVueRenderer
            :schema="editorState.schema"
            :registry="registry"
            :data="previewData"
            :action-executor="actionExecutor"
            :editable="editorState.mode === 'design'"
            :selected-node-id="editorState.selectedNodeId"
            :fallback="'暂无内容'"
            :on-node-select="(node) => select(node.id)"
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
          <Save :size="16" />
          <span>本地版本</span>
        </div>
        <div v-if="releases.length" class="release-list">
          <article v-for="release in releases" :key="release.id" class="release-card">
            <div>
              <strong>{{ releaseKindLabel(release.kind) }}</strong>
              <span>{{ release.pageVersion }}</span>
            </div>
            <small>{{ formatReleaseTime(release.createdAt) }}</small>
            <div class="release-actions">
              <button type="button" @click="loadReleaseById(release.id)">载入</button>
              <button type="button" @click="openReleaseRuntime(release.id)">打开</button>
            </div>
          </article>
        </div>
        <div v-else class="empty-state">暂无本地版本</div>
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

          <label
            v-for="(propSchema, propName) in selectedManifest.propsSchema"
            :key="String(propName)"
            class="field"
          >
            <span>{{ propSchema.label }}</span>
            <textarea
              v-if="isStructured(propSchema) || propSchema.setter === 'textarea' || propSchema.setter === 'richText'"
              :value="asText(selectedNode.props[String(propName)])"
              rows="5"
              @input="updateProp(String(propName), propSchema, ($event.target as HTMLTextAreaElement).value)"
            />
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
            <div v-if="propSchema.setter === 'image'" class="asset-picker">
              <button
                v-for="asset in sampleAssets"
                :key="asset.url"
                type="button"
                @click="applyAsset(String(propName), asset.url)"
              >
                <img :src="asset.url" alt="" />
                <span>{{ asset.title }}</span>
              </button>
            </div>
            <div v-if="selectedNode.componentName === 'ProductList' && String(propName) === 'items'" class="quick-actions">
              <button type="button" @click="applySampleProducts">使用示例商品</button>
              <button type="button" @click="bindSelectedProductListToDataSource">绑定数据源 products</button>
            </div>
          </label>

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
