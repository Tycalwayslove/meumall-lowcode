import type {
  JsonObject,
  JsonValue,
  LowcodeNode,
  LowcodeMaterialManifest,
  LowcodePageSchema,
  LowcodePlatform,
  LowcodePropSchema,
  LowcodeVisibilityRule,
} from "@meumall/lowcode-schema";
import { createLowcodeNode, createLowcodePageSchema, validateLowcodePageSchema } from "@meumall/lowcode-schema";

export type LowcodeEditorMode = "design" | "preview" | "outline";

export interface LowcodeEditorViewport {
  platform: LowcodePlatform;
  width: number;
  height?: number;
  scale?: number;
}

export interface LowcodeEditorViewportPreset {
  id: string;
  platform: LowcodePlatform;
  title: string;
  description?: string;
  width: number;
  height?: number;
  scale?: number;
}

export interface LowcodeEditorHistory {
  past: LowcodePageSchema[];
  future: LowcodePageSchema[];
  limit: number;
}

export interface LowcodeEditorClipboard {
  node: LowcodeNode;
  copiedAt: string;
}

export interface LowcodeEditorState {
  schema: LowcodePageSchema;
  selectedNodeId?: string;
  mode: LowcodeEditorMode;
  viewport: LowcodeEditorViewport;
  history: LowcodeEditorHistory;
  clipboard?: LowcodeEditorClipboard;
  dirty: boolean;
  lastAction?: string;
}

export interface CreateEditorStateOptions {
  selectedNodeId?: string;
  mode?: LowcodeEditorMode;
  viewport?: Partial<LowcodeEditorViewport>;
  historyLimit?: number;
}

export interface InsertNodeOptions {
  parentId?: string;
  index?: number;
  select?: boolean;
}

export interface MoveNodeOptions {
  nodeId: string;
  targetParentId?: string;
  index?: number;
}

export type LowcodeEditorPublishCheckStatus = "pass" | "warning" | "error";

export interface LowcodeEditorPublishCheck {
  id: string;
  title: string;
  status: LowcodeEditorPublishCheckStatus;
  description: string;
  nodeId?: string;
  nodeTitle?: string;
}

export interface LowcodeEditorPublishCheckSummary {
  pass: number;
  warning: number;
  error: number;
}

export type LowcodeEditorWorkspaceStatTone = "neutral" | "success" | "warning" | "danger";

export interface LowcodeEditorWorkspaceStat {
  id: string;
  label: string;
  value: string;
  tone: LowcodeEditorWorkspaceStatTone;
}

export interface CreateLowcodeWorkspaceStatsOptions {
  selectedTitle?: string;
  validationValid?: boolean;
  publishCheckSummary?: LowcodeEditorPublishCheckSummary;
  dirty?: boolean;
  nodeCount?: number;
}

export interface LowcodeEditorDataSourceResolutionRecord {
  id: string;
  status: "pending" | "resolved" | "skipped" | "error" | string;
  bindTo?: string;
  error?: string;
}

export type LowcodeEditorPreviewLinkStatus = "ready" | "disabled";

export interface LowcodeEditorPreviewLinkSource {
  id: string;
  title: string;
  description: string;
  url?: string;
  disabledReason?: string;
}

export interface LowcodeEditorPreviewLinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  status: LowcodeEditorPreviewLinkStatus;
  statusText: string;
  openable: boolean;
  copyable: boolean;
}

export interface CreateLowcodePreviewLinksOptions {
  includeDisabled?: boolean;
  readyStatusText?: string;
}

export interface LowcodeEditorPreviewLinkSummary {
  total: number;
  ready: number;
  disabled: number;
  statusText: string;
  readyTitles: string[];
}

export interface CreateLowcodePublishChecksOptions {
  materialManifests?: Iterable<LowcodeMaterialManifest>;
  dataSourceRecords?: LowcodeEditorDataSourceResolutionRecord[];
  productComponentNames?: string[];
  actionParamRules?: LowcodeEditorActionParamRule[];
}

export interface LowcodeEditorMaterialEntry {
  manifest: LowcodeMaterialManifest;
}

export interface LowcodeEditorMaterialCatalogItem {
  componentName: string;
  title: string;
  category: string;
  materialVersion: string;
  platforms: LowcodePlatform[];
  propCount: number;
  eventCount: number;
  dataSourceSlotCount: number;
  summary: string;
  searchText: string;
}

export interface FilterLowcodeMaterialCatalogOptions {
  keyword?: string;
  category?: string;
  allCategoryLabel?: string;
}

export interface LowcodeEditorCommandEntry {
  id: string;
  title: string;
  group: string;
  description?: string;
  keywords?: readonly string[];
  disabled?: boolean;
}

export interface LowcodeEditorCommandGroup<T extends LowcodeEditorCommandEntry = LowcodeEditorCommandEntry> {
  group: string;
  items: T[];
}

export interface FilterLowcodeEditorCommandsOptions {
  keyword?: string;
  limit?: number;
  includeDisabled?: boolean;
}

export interface LowcodeEditorOutlineMaterialInfo {
  componentName: string;
  title: string;
  category?: string;
}

export interface LowcodeEditorOutlineRow {
  node: LowcodeNode;
  index: number;
  depth: number;
  parentId?: string;
  ancestorIds: string[];
  hasChildren: boolean;
  title: string;
  subtitle: string;
  searchText: string;
}

export interface CreateLowcodeOutlineRowsOptions {
  materialManifests?: Iterable<LowcodeEditorOutlineMaterialInfo>;
}

export interface CreateLowcodeOutlineVisibilityOptions {
  keyword?: string;
  collapsedNodeIds?: readonly string[];
  selectedNodeId?: string;
}

export interface LowcodeEditorOutlineVisibility<T extends LowcodeEditorOutlineRow = LowcodeEditorOutlineRow> {
  rows: T[];
  matchedNodeIds: string[];
  visibleNodeIds: string[];
  selectedPathNodeIds: string[];
  summary: string;
}

export type LowcodeEditorPropGroupKey = "content" | "style" | "data" | "behavior" | "advanced";

export interface LowcodeEditorPropGroupMeta {
  label: string;
  description: string;
}

export interface LowcodeEditorPropEditorEntry {
  name: string;
  schema: LowcodePropSchema;
}

export interface LowcodeEditorPropGroup {
  key: LowcodeEditorPropGroupKey;
  label: string;
  description: string;
  entries: LowcodeEditorPropEditorEntry[];
}

export type LowcodeEditorPropGroupCollapsedState = Partial<Record<LowcodeEditorPropGroupKey, boolean>>;

export interface CreateLowcodePropGroupsOptions {
  groupOrder?: readonly LowcodeEditorPropGroupKey[];
  groupMeta?: Partial<Record<LowcodeEditorPropGroupKey, LowcodeEditorPropGroupMeta>>;
  contentPropNames?: readonly string[];
  dataPropNames?: readonly string[];
  behaviorPropNames?: readonly string[];
}

export interface LowcodeEditorActionParamRule {
  actionType: string;
  paramName: string;
  label: string;
}

export interface LowcodeEditorDeliveryMetric {
  label: string;
  value: string;
}

export interface LowcodeEditorDeliverySummary {
  schemaJson: string;
  schemaSizeBytes: number;
  schemaSizeText: string;
  statusText: string;
  metrics: LowcodeEditorDeliveryMetric[];
}

export interface CreateLowcodeDeliverySummaryOptions {
  checks?: LowcodeEditorPublishCheck[];
}

export type LowcodeEditorDraftPersistenceStatus = "idle" | "restored" | "pending" | "saved" | "error";
export type LowcodeEditorDraftStatusTone = "neutral" | "success" | "warning" | "danger";

export interface LowcodeEditorDraftPayload {
  version: 1;
  updatedAt: string;
  schema: LowcodePageSchema;
  schemaJson: string;
  schemaSizeBytes: number;
  schemaSizeText: string;
}

export interface CreateLowcodeEditorDraftPayloadOptions {
  now?: Date;
  pretty?: boolean;
  cloneSchema?: boolean;
}

export interface ParseLowcodeEditorDraftContentOptions {
  fallbackSchema?: LowcodePageSchema;
  cloneSchema?: boolean;
}

export type LowcodeEditorDraftRestoreResult =
  | {
    restored: true;
    schema: LowcodePageSchema;
    payload?: LowcodeEditorDraftPayload;
    legacy: boolean;
  }
  | {
    restored: false;
    schema?: LowcodePageSchema;
    error?: string;
    validationErrors?: string[];
  };

export interface FormatLowcodeEditorDraftStatusTextOptions {
  lastSavedAt?: string;
  formatSavedAt?: (value: string) => string;
}

export interface CreateLowcodeSchemaFileNameOptions {
  filename?: string;
  filenamePrefix?: string;
  now?: Date;
}

export interface CreateLowcodeSchemaFileExportOptions extends CreateLowcodeSchemaFileNameOptions {
  pretty?: boolean;
}

export interface LowcodeEditorSchemaFileExport {
  filename: string;
  mimeType: string;
  content: string;
  sizeBytes: number;
  sizeText: string;
}

export interface ParseLowcodeSchemaFileContentOptions {
  cloneSchema?: boolean;
}

export type LowcodeEditorSchemaFileImportResult =
  | {
    ok: true;
    schema: LowcodePageSchema;
  }
  | {
    ok: false;
    error: string;
    validationErrors?: string[];
  };

export interface LowcodeEditorVersionDiffItem {
  label: string;
  current: string;
  selected: string;
  changed: boolean;
}

export interface LowcodeEditorSchemaPreviewNodeSummary {
  id: string;
  componentName: string;
  name: string | null;
  childCount: number;
}

export interface LowcodeEditorSchemaPreviewSnippet {
  pageId: string;
  title: string;
  status: LowcodePageSchema["status"];
  pageVersion: string;
  pageType: LowcodePageSchema["pageType"] | null;
  publishMeta: {
    environment: LowcodePageSchema["publishMeta"]["environment"];
    operator: string | null;
    publishedAt: string | null;
  };
  layout: JsonObject;
  nodeCount: number;
  nodes: LowcodeEditorSchemaPreviewNodeSummary[];
  dataSourceIds: string[];
  actionIds: string[];
}

export interface LowcodeEditorSchemaPreviewItem {
  id: string;
  title: string;
  description: string;
  json: string;
}

export interface CreateLowcodeSchemaPreviewSnippetOptions {
  maxNodes?: number;
}

export interface CreateLowcodeSchemaPreviewItemsOptions extends CreateLowcodeSchemaPreviewSnippetOptions {
  currentTitle?: string;
  selectedTitle?: string;
  currentDescription?: string;
  selectedDescription?: string;
}

export interface LowcodeEditorTemplateResource {
  id: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  version?: string;
  schema: LowcodePageSchema;
}

export interface LowcodeEditorTemplatePreviewMeta {
  imageUrl: string;
  title: string;
  subtitle: string;
  nodeCountText: string;
}

export interface LowcodeEditorTemplateListItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  version?: string;
  nodeCount: number;
  dataSourceCount: number;
  actionCount: number;
  preview: LowcodeEditorTemplatePreviewMeta;
}

export interface CreateLowcodeTemplatePreviewMetaOptions {
  fallbackImageUrl?: string;
}

export interface CreateLowcodeTemplateListItemOptions extends CreateLowcodeTemplatePreviewMetaOptions {}

export interface CreateLowcodeBlankPageSchemaOptions {
  pageId?: string;
  pageIdPrefix?: string;
  now?: Date;
  title?: string;
  pageType?: LowcodePageSchema["pageType"];
  operator?: string;
  environment?: LowcodePageSchema["publishMeta"]["environment"];
  backgroundColor?: string;
  maxWidth?: number;
  canvasWidth?: number;
  notes?: string;
  trackingPageName?: string;
  channelParamKeys?: string[];
}

export interface CreateLowcodePageStartStateOptions extends CreateEditorStateOptions {
  dirty?: boolean;
  lastAction?: string;
  cloneSchema?: boolean;
}

type NodeInput = Omit<LowcodeNode, "id"> & { id?: string };

const DEFAULT_VIEWPORT: LowcodeEditorViewport = {
  platform: "h5",
  width: 375,
  scale: 1,
};

export const LOWCODE_H5_VIEWPORT_PRESETS = [
  { id: "h5-compact", platform: "h5", title: "紧凑屏", description: "小屏 H5 宽度", width: 360, scale: 1 },
  { id: "h5-standard", platform: "h5", title: "标准屏", description: "主流 H5 宽度", width: 390, scale: 1 },
  { id: "h5-large", platform: "h5", title: "大屏", description: "大屏 H5 宽度", width: 430, scale: 1 },
] as const satisfies readonly LowcodeEditorViewportPreset[];

export type LowcodeH5ViewportPresetId = (typeof LOWCODE_H5_VIEWPORT_PRESETS)[number]["id"];
export const LOWCODE_EDITOR_COMMAND_DEFAULT_LIMIT = 28;
export const LOWCODE_EDITOR_PROP_GROUP_ORDER = ["content", "style", "data", "behavior", "advanced"] as const satisfies readonly LowcodeEditorPropGroupKey[];
export const LOWCODE_EDITOR_PROP_GROUP_META = {
  content: { label: "内容配置", description: "标题、文案、图片和按钮内容。" },
  style: { label: "样式配置", description: "颜色、圆角、间距和排版表现。" },
  data: { label: "数据配置", description: "商品、券、规则、导航项和数据源字段。" },
  behavior: { label: "行为配置", description: "跳转链接、吸顶、平滑滚动等交互行为。" },
  advanced: { label: "其他配置", description: "暂未归类的物料字段。" },
} as const satisfies Record<LowcodeEditorPropGroupKey, LowcodeEditorPropGroupMeta>;

const DEFAULT_PRODUCT_COMPONENT_NAMES = ["ProductList", "ProductRankList", "BrandFeatureSection", "FlashSaleList"];
const DEFAULT_ACTION_PARAM_RULES: LowcodeEditorActionParamRule[] = [
  { actionType: "navigate", paramName: "url", label: "跳转 URL" },
  { actionType: "coupon.receive", paramName: "couponId", label: "couponId" },
  { actionType: "tracking.click", paramName: "eventName", label: "eventName" },
];
const TEMPLATE_IMAGE_PROP_NAMES = ["imageUrl", "coverImageUrl", "logoImageUrl"];
const TEMPLATE_TITLE_PROP_NAMES = ["title", "brandName", "text"];
const TEMPLATE_SUBTITLE_PROP_NAMES = ["subtitle", "description", "summary"];
const DEFAULT_BLANK_PAGE_ID_PREFIX = "blank-h5";
const DEFAULT_SCHEMA_FILE_PREFIX = "meumall-lowcode";
const DEFAULT_CONTENT_PROP_NAMES = [
  "title",
  "subtitle",
  "summary",
  "content",
  "label",
  "text",
  "primaryText",
  "secondaryText",
  "html",
  "buttonText",
  "receiveText",
  "receiveAllText",
  "statusText",
  "viewerText",
  "badgeText",
  "modalTitle",
  "brandName",
  "description",
  "alt",
  "imageUrl",
  "coverImageUrl",
  "logoImageUrl",
];
const DEFAULT_DATA_PROP_NAMES = ["items", "coupons", "rules", "sellingPoints"];
const DEFAULT_BEHAVIOR_PROP_NAMES = [
  "linkUrl",
  "primaryLinkUrl",
  "secondaryLinkUrl",
  "sticky",
  "smooth",
  "offsetTop",
  "safeArea",
  "showSecondary",
];

export function createEditorState(schema: LowcodePageSchema, options: CreateEditorStateOptions = {}): LowcodeEditorState {
  return {
    schema,
    selectedNodeId: options.selectedNodeId,
    mode: options.mode ?? "design",
    viewport: {
      ...DEFAULT_VIEWPORT,
      ...options.viewport,
    },
    history: {
      past: [],
      future: [],
      limit: options.historyLimit ?? 50,
    },
    dirty: false,
  };
}

export function selectNode(state: LowcodeEditorState, nodeId: string | undefined): LowcodeEditorState {
  return {
    ...state,
    selectedNodeId: nodeId,
    lastAction: "selectNode",
  };
}

export function setEditorMode(state: LowcodeEditorState, mode: LowcodeEditorMode): LowcodeEditorState {
  return {
    ...state,
    mode,
    lastAction: "setEditorMode",
  };
}

export function setEditorViewport(
  state: LowcodeEditorState,
  viewport: Partial<LowcodeEditorViewport>,
): LowcodeEditorState {
  return {
    ...state,
    viewport: {
      ...state.viewport,
      ...viewport,
    },
    lastAction: "setEditorViewport",
  };
}

export function getLowcodeEditorViewportPreset(
  presetId: string,
  presets: readonly LowcodeEditorViewportPreset[] = LOWCODE_H5_VIEWPORT_PRESETS,
): LowcodeEditorViewportPreset | undefined {
  return presets.find((preset) => preset.id === presetId);
}

export function findLowcodeEditorViewportPreset(
  viewport: Pick<LowcodeEditorViewport, "platform" | "width">,
  presets: readonly LowcodeEditorViewportPreset[] = LOWCODE_H5_VIEWPORT_PRESETS,
): LowcodeEditorViewportPreset | undefined {
  return presets.find((preset) => preset.platform === viewport.platform && preset.width === viewport.width);
}

export function createLowcodeEditorViewportFromPreset(
  preset: LowcodeEditorViewportPreset,
): LowcodeEditorViewport {
  return {
    platform: preset.platform,
    width: preset.width,
    height: preset.height,
    scale: preset.scale ?? 1,
  };
}

export function formatLowcodeEditorViewportTitle(
  viewport: Pick<LowcodeEditorViewport, "platform" | "width">,
  presets: readonly LowcodeEditorViewportPreset[] = LOWCODE_H5_VIEWPORT_PRESETS,
): string {
  const preset = findLowcodeEditorViewportPreset(viewport, presets);
  return preset ? `${preset.title} ${preset.width}` : `自定义 ${viewport.width}`;
}

export function setEditorViewportPreset(
  state: LowcodeEditorState,
  preset: LowcodeEditorViewportPreset,
): LowcodeEditorState {
  return setEditorViewport(state, createLowcodeEditorViewportFromPreset(preset));
}

export function createLowcodeWorkspaceStats(
  schema: LowcodePageSchema,
  options: CreateLowcodeWorkspaceStatsOptions = {},
): LowcodeEditorWorkspaceStat[] {
  const validationValid = options.validationValid ?? validateLowcodePageSchema(schema).valid;
  const publish = createWorkspacePublishStat(options.publishCheckSummary);
  const dirty = options.dirty ?? false;

  return [
    {
      id: "nodes",
      label: "节点",
      value: `${options.nodeCount ?? countLowcodeNodes(schema)} 个`,
      tone: "neutral",
    },
    {
      id: "selected",
      label: "选中",
      value: options.selectedTitle || "未选择",
      tone: options.selectedTitle ? "success" : "neutral",
    },
    {
      id: "validation",
      label: "校验",
      value: validationValid ? "通过" : "异常",
      tone: validationValid ? "success" : "danger",
    },
    publish,
    {
      id: "save",
      label: "保存",
      value: dirty ? "未保存" : "已保存",
      tone: dirty ? "warning" : "success",
    },
  ];
}

export function createLowcodePreviewLinkItem(
  source: LowcodeEditorPreviewLinkSource,
  options: CreateLowcodePreviewLinksOptions = {},
): LowcodeEditorPreviewLinkItem {
  const url = typeof source.url === "string" ? source.url.trim() : "";
  const openable = Boolean(url && !source.disabledReason);
  const status: LowcodeEditorPreviewLinkStatus = openable ? "ready" : "disabled";
  return {
    id: source.id,
    title: source.title,
    description: source.description,
    url,
    status,
    statusText: status === "ready" ? options.readyStatusText ?? "可打开" : source.disabledReason || "暂无可用链接",
    openable,
    copyable: openable,
  };
}

export function createLowcodePreviewLinkItems(
  sources: readonly LowcodeEditorPreviewLinkSource[],
  options: CreateLowcodePreviewLinksOptions = {},
): LowcodeEditorPreviewLinkItem[] {
  const items = sources.map((source) => createLowcodePreviewLinkItem(source, options));
  return options.includeDisabled === false ? items.filter((item) => item.status === "ready") : items;
}

export function summarizeLowcodePreviewLinks(
  items: readonly LowcodeEditorPreviewLinkItem[],
): LowcodeEditorPreviewLinkSummary {
  const readyItems = items.filter((item) => item.status === "ready");
  const disabled = items.length - readyItems.length;
  return {
    total: items.length,
    ready: readyItems.length,
    disabled,
    statusText: disabled ? `${readyItems.length} 个可用 / ${disabled} 个不可用` : `${readyItems.length} 个可用入口`,
    readyTitles: readyItems.map((item) => item.title),
  };
}

export function createLowcodeMaterialCatalogItem(
  manifest: LowcodeMaterialManifest,
): LowcodeEditorMaterialCatalogItem {
  const propCount = Object.keys(manifest.propsSchema).length;
  const eventCount = manifest.events?.length ?? 0;
  const dataSourceSlotCount = manifest.dataSourceSlots?.length ?? 0;
  const platforms = manifest.platforms.slice();
  const summary = formatLowcodeMaterialCatalogSummary(manifest);
  return {
    componentName: manifest.componentName,
    title: manifest.title,
    category: manifest.category,
    materialVersion: manifest.materialVersion,
    platforms,
    propCount,
    eventCount,
    dataSourceSlotCount,
    summary,
    searchText: [
      manifest.title,
      manifest.componentName,
      manifest.category,
      manifest.materialVersion,
      ...platforms,
    ].join(" ").toLowerCase(),
  };
}

export function formatLowcodeMaterialCatalogSummary(manifest: LowcodeMaterialManifest): string {
  const propCount = Object.keys(manifest.propsSchema).length;
  const eventCount = manifest.events?.length ?? 0;
  const dataSourceSlotCount = manifest.dataSourceSlots?.length ?? 0;
  return `${propCount} 个配置 / ${eventCount} 个事件 / ${dataSourceSlotCount} 个数据槽`;
}

export function createLowcodeMaterialCategories(
  manifests: Iterable<LowcodeMaterialManifest>,
  allCategoryLabel = "全部",
): string[] {
  return [allCategoryLabel, ...Array.from(new Set(Array.from(manifests, (manifest) => manifest.category)))];
}

export function filterLowcodeMaterialCatalog<T extends LowcodeEditorMaterialEntry>(
  materials: readonly T[],
  options: FilterLowcodeMaterialCatalogOptions = {},
): T[] {
  const allCategoryLabel = options.allCategoryLabel ?? "全部";
  const category = options.category ?? allCategoryLabel;
  const keyword = options.keyword?.trim().toLowerCase() ?? "";
  return materials.filter((item) => {
    const catalogItem = createLowcodeMaterialCatalogItem(item.manifest);
    const matchesCategory = category === allCategoryLabel || catalogItem.category === category;
    if (!matchesCategory) return false;
    if (!keyword) return true;
    return catalogItem.searchText.includes(keyword);
  });
}

export function pickLowcodeMaterialEntriesByComponentNames<T extends LowcodeEditorMaterialEntry>(
  materials: readonly T[],
  componentNames: readonly string[],
): T[] {
  const materialMap = new Map(materials.map((item) => [item.manifest.componentName, item]));
  return componentNames.flatMap((componentName) => {
    const material = materialMap.get(componentName);
    return material ? [material] : [];
  });
}

export function createLowcodeEditorCommandSearchText(command: LowcodeEditorCommandEntry): string {
  return [
    command.title,
    command.group,
    command.description ?? "",
    ...(command.keywords ?? []),
  ].join(" ").toLowerCase();
}

export function filterLowcodeEditorCommands<T extends LowcodeEditorCommandEntry>(
  commands: readonly T[],
  options: FilterLowcodeEditorCommandsOptions = {},
): T[] {
  const keyword = options.keyword?.trim().toLowerCase() ?? "";
  const limit = Math.max(0, options.limit ?? LOWCODE_EDITOR_COMMAND_DEFAULT_LIMIT);
  const includeDisabled = options.includeDisabled ?? true;
  return commands
    .filter((command) => includeDisabled || !command.disabled)
    .filter((command) => !keyword || createLowcodeEditorCommandSearchText(command).includes(keyword))
    .slice(0, limit);
}

export function groupLowcodeEditorCommands<T extends LowcodeEditorCommandEntry>(
  commands: readonly T[],
): LowcodeEditorCommandGroup<T>[] {
  const groups: LowcodeEditorCommandGroup<T>[] = [];
  const groupMap = new Map<string, LowcodeEditorCommandGroup<T>>();
  commands.forEach((command) => {
    let group = groupMap.get(command.group);
    if (!group) {
      group = { group: command.group, items: [] };
      groupMap.set(command.group, group);
      groups.push(group);
    }
    group.items.push(command);
  });
  return groups;
}

export function appendNode(state: LowcodeEditorState, node: NodeInput): LowcodeEditorState {
  return insertNode(state, node, { select: true });
}

export function insertNode(
  state: LowcodeEditorState,
  node: NodeInput,
  options: InsertNodeOptions = {},
): LowcodeEditorState {
  const nextNode = createLowcodeNode(node);
  const nextNodes = insertIntoNodes(state.schema.nodes, nextNode, options.parentId, options.index);
  if (!nextNodes) return state;

  return commitSchemaChange(
    state,
    {
      ...state.schema,
      nodes: nextNodes,
    },
    "insertNode",
    options.select === false ? state.selectedNodeId : nextNode.id,
  );
}

export function updateNodeProps(
  state: LowcodeEditorState,
  nodeId: string,
  propsPatch: JsonObject,
): LowcodeEditorState {
  return updateNode(state, nodeId, (node) => ({
    ...node,
    props: {
      ...node.props,
      ...propsPatch,
    },
  }), "updateNodeProps");
}

export function replaceNodeProps(
  state: LowcodeEditorState,
  nodeId: string,
  props: JsonObject,
): LowcodeEditorState {
  return updateNode(state, nodeId, (node) => ({ ...node, props }), "replaceNodeProps");
}

export function updateNodeStyle(
  state: LowcodeEditorState,
  nodeId: string,
  stylePatch: JsonObject,
): LowcodeEditorState {
  return updateNode(
    state,
    nodeId,
    (node) => ({
      ...node,
      style: {
        ...(node.style ?? {}),
        ...stylePatch,
      },
    }),
    "updateNodeStyle",
  );
}

export function setNodeVisibility(
  state: LowcodeEditorState,
  nodeId: string,
  visibility: LowcodeVisibilityRule | undefined,
): LowcodeEditorState {
  return updateNode(state, nodeId, (node) => ({ ...node, visibility }), "setNodeVisibility");
}

export function copyNode(state: LowcodeEditorState, nodeId: string): LowcodeEditorState {
  const node = findNode(state.schema.nodes, nodeId);
  if (!node) return state;
  return {
    ...state,
    clipboard: {
      node,
      copiedAt: new Date().toISOString(),
    },
    lastAction: "copyNode",
  };
}

export function pasteNode(
  state: LowcodeEditorState,
  options: InsertNodeOptions = {},
): LowcodeEditorState {
  if (!state.clipboard) return state;
  const cloned = cloneNodeWithNewIds(state.clipboard.node);
  const nextNodes = insertIntoNodes(state.schema.nodes, cloned, options.parentId, options.index);
  if (!nextNodes) return state;

  return commitSchemaChange(
    state,
    {
      ...state.schema,
      nodes: nextNodes,
    },
    "pasteNode",
    options.select === false ? state.selectedNodeId : cloned.id,
  );
}

export function duplicateNode(state: LowcodeEditorState, nodeId: string): LowcodeEditorState {
  const located = findNodeWithParent(state.schema.nodes, nodeId);
  if (!located) return state;

  const cloned = cloneNodeWithNewIds(located.node);
  const index = located.index + 1;
  const nextNodes = insertIntoNodes(state.schema.nodes, cloned, located.parentId, index);
  if (!nextNodes) return state;

  return commitSchemaChange(
    state,
    {
      ...state.schema,
      nodes: nextNodes,
    },
    "duplicateNode",
    cloned.id,
  );
}

export function moveNode(state: LowcodeEditorState, fromIndex: number, toIndex: number): LowcodeEditorState {
  const nodes = [...state.schema.nodes];
  const [node] = nodes.splice(fromIndex, 1);
  if (!node) return state;
  nodes.splice(clampIndex(toIndex, nodes.length), 0, node);
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      nodes,
    },
    "moveNode",
    node.id,
  );
}

export function moveNodeById(state: LowcodeEditorState, options: MoveNodeOptions): LowcodeEditorState {
  if (options.targetParentId === options.nodeId) return state;
  if (options.targetParentId && isDescendant(state.schema.nodes, options.nodeId, options.targetParentId)) {
    return state;
  }

  const removed = removeFromNodes(state.schema.nodes, options.nodeId);
  if (!removed.removedNode) return state;

  const nextNodes = insertIntoNodes(removed.nodes, removed.removedNode, options.targetParentId, options.index);
  if (!nextNodes) return state;

  return commitSchemaChange(
    state,
    {
      ...state.schema,
      nodes: nextNodes,
    },
    "moveNodeById",
    options.nodeId,
  );
}

export function removeNode(state: LowcodeEditorState, nodeId: string): LowcodeEditorState {
  const removed = removeFromNodes(state.schema.nodes, nodeId);
  if (!removed.removedNode) return state;

  return commitSchemaChange(
    state,
    {
      ...state.schema,
      nodes: removed.nodes,
    },
    "removeNode",
    state.selectedNodeId === nodeId ? undefined : state.selectedNodeId,
  );
}

export function undo(state: LowcodeEditorState): LowcodeEditorState {
  const previous = state.history.past[state.history.past.length - 1];
  if (!previous) return state;

  return {
    ...state,
    schema: previous,
    history: {
      ...state.history,
      past: state.history.past.slice(0, -1),
      future: [state.schema, ...state.history.future],
    },
    dirty: true,
    lastAction: "undo",
  };
}

export function redo(state: LowcodeEditorState): LowcodeEditorState {
  const [next, ...future] = state.history.future;
  if (!next) return state;

  return {
    ...state,
    schema: next,
    history: {
      ...state.history,
      past: pushHistory(state.history.past, state.schema, state.history.limit),
      future,
    },
    dirty: true,
    lastAction: "redo",
  };
}

export function markSaved(state: LowcodeEditorState): LowcodeEditorState {
  return {
    ...state,
    dirty: false,
    lastAction: "markSaved",
  };
}

export function flattenLowcodeNodes(nodes: LowcodeNode[]): LowcodeNode[] {
  return nodes.flatMap((node) => [node, ...flattenLowcodeNodes(node.children ?? [])]);
}

export function createLowcodeOutlineRows(
  nodes: LowcodeNode[],
  options: CreateLowcodeOutlineRowsOptions = {},
): LowcodeEditorOutlineRow[] {
  const manifests = createOutlineMaterialMap(options.materialManifests);
  return flattenLowcodeOutlineRows(nodes, manifests);
}

export function createLowcodeOutlineRowSearchText(
  row: Pick<LowcodeEditorOutlineRow, "node" | "title" | "subtitle"> & Partial<Pick<LowcodeEditorOutlineRow, "searchText">>,
): string {
  if (row.searchText) return row.searchText;
  return [
    row.node.id,
    row.node.componentName,
    row.node.meta?.name,
    row.title,
    row.subtitle,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function createLowcodeOutlineVisibility<T extends LowcodeEditorOutlineRow>(
  rows: readonly T[],
  options: CreateLowcodeOutlineVisibilityOptions = {},
): LowcodeEditorOutlineVisibility<T> {
  const keyword = options.keyword?.trim().toLowerCase() ?? "";
  const collapsedNodeIds = new Set(options.collapsedNodeIds ?? []);
  const selectedRow = rows.find((row) => row.node.id === options.selectedNodeId);
  const selectedPathNodeIds = selectedRow ? [...selectedRow.ancestorIds, selectedRow.node.id] : [];
  const selectedPathNodeIdSet = new Set(selectedPathNodeIds);
  const matchedNodeIds = keyword
    ? rows.filter((row) => row.searchText.includes(keyword)).map((row) => row.node.id)
    : [];
  const visibleNodeIdSet = new Set<string>();

  if (keyword) {
    const matchedNodeIdSet = new Set(matchedNodeIds);
    rows.forEach((row) => {
      if (!matchedNodeIdSet.has(row.node.id)) return;
      visibleNodeIdSet.add(row.node.id);
      row.ancestorIds.forEach((nodeId) => visibleNodeIdSet.add(nodeId));
    });
  }

  const visibleRows = rows.filter((row) => {
    if (keyword) return visibleNodeIdSet.has(row.node.id);
    const hasCollapsedAncestor = row.ancestorIds.some((nodeId) => collapsedNodeIds.has(nodeId));
    return !hasCollapsedAncestor || selectedPathNodeIdSet.has(row.node.id);
  });

  if (!keyword) {
    visibleRows.forEach((row) => visibleNodeIdSet.add(row.node.id));
  }

  return {
    rows: visibleRows,
    matchedNodeIds,
    visibleNodeIds: [...visibleNodeIdSet],
    selectedPathNodeIds,
    summary: `${visibleRows.length} / ${rows.length}`,
  };
}

export function pruneLowcodeOutlineCollapsedNodeIds(
  collapsedNodeIds: readonly string[],
  rows: readonly LowcodeEditorOutlineRow[],
): string[] {
  const collapsibleNodeIds = new Set(rows.filter((row) => row.hasChildren).map((row) => row.node.id));
  return collapsedNodeIds.filter((nodeId) => collapsibleNodeIds.has(nodeId));
}

export function revealLowcodeOutlineNode(
  nodeId: string | undefined,
  collapsedNodeIds: readonly string[],
  rows: readonly LowcodeEditorOutlineRow[],
): string[] {
  if (!nodeId) return [...collapsedNodeIds];
  const row = rows.find((item) => item.node.id === nodeId);
  if (!row?.ancestorIds.length) return [...collapsedNodeIds];
  const collapsed = new Set(collapsedNodeIds);
  row.ancestorIds.forEach((ancestorId) => collapsed.delete(ancestorId));
  return [...collapsed];
}

export function getLowcodePropGroupKey(
  propName: string,
  propSchema: LowcodePropSchema,
  options: CreateLowcodePropGroupsOptions = {},
): LowcodeEditorPropGroupKey {
  const normalized = propName.toLowerCase();
  const contentPropNames = new Set(options.contentPropNames ?? DEFAULT_CONTENT_PROP_NAMES);
  const dataPropNames = new Set(options.dataPropNames ?? DEFAULT_DATA_PROP_NAMES);
  const behaviorPropNames = new Set(options.behaviorPropNames ?? DEFAULT_BEHAVIOR_PROP_NAMES);

  if (dataPropNames.has(propName) || propSchema.setter === "dataSourceSelector" || propSchema.type === "array") {
    return "data";
  }
  if (
    propSchema.setter === "color" ||
    /(color|radius|padding|height|width|size|columns|background|accent)/.test(normalized)
  ) {
    return "style";
  }
  if (behaviorPropNames.has(propName) || propSchema.type === "boolean" || propSchema.setter === "switch") {
    return "behavior";
  }
  if (contentPropNames.has(propName) || ["image", "richText", "textarea"].includes(propSchema.setter)) {
    return "content";
  }
  return "advanced";
}

export function createLowcodePropGroups(
  propsSchema: Record<string, LowcodePropSchema>,
  options: CreateLowcodePropGroupsOptions = {},
): LowcodeEditorPropGroup[] {
  const order = options.groupOrder ?? LOWCODE_EDITOR_PROP_GROUP_ORDER;
  const meta = {
    ...LOWCODE_EDITOR_PROP_GROUP_META,
    ...(options.groupMeta ?? {}),
  };
  const groups = new Map<LowcodeEditorPropGroupKey, LowcodeEditorPropEditorEntry[]>();

  Object.entries(propsSchema).forEach(([name, propSchema]) => {
    const groupKey = getLowcodePropGroupKey(name, propSchema, options);
    groups.set(groupKey, [...(groups.get(groupKey) ?? []), { name, schema: propSchema }]);
  });

  return order
    .map((key) => ({
      key,
      label: meta[key].label,
      description: meta[key].description,
      entries: groups.get(key) ?? [],
    }))
    .filter((group) => group.entries.length > 0);
}

export function isLowcodePropGroupCollapsed(
  collapsedState: LowcodeEditorPropGroupCollapsedState,
  key: LowcodeEditorPropGroupKey,
): boolean {
  return Boolean(collapsedState[key]);
}

export function toggleLowcodePropGroupCollapsed(
  collapsedState: LowcodeEditorPropGroupCollapsedState,
  key: LowcodeEditorPropGroupKey,
): LowcodeEditorPropGroupCollapsedState {
  return {
    ...collapsedState,
    [key]: !collapsedState[key],
  };
}

export function countLowcodeNodes(schema: LowcodePageSchema): number {
  return flattenLowcodeNodes(schema.nodes).length;
}

export function getLowcodeNodeDisplayName(
  node: LowcodeNode,
  materialManifest?: Pick<LowcodeMaterialManifest, "title">,
): string {
  const customName = node.meta?.name?.trim();
  return customName || materialManifest?.title || node.componentName;
}

export function createLowcodePublishChecks(
  schema: LowcodePageSchema,
  options: CreateLowcodePublishChecksOptions = {},
): LowcodeEditorPublishCheck[] {
  const nodes = flattenLowcodeNodes(schema.nodes);
  const manifests = createMaterialManifestMap(options.materialManifests);
  const productComponentNames = new Set(options.productComponentNames ?? DEFAULT_PRODUCT_COMPONENT_NAMES);
  const dataSourceRecords = options.dataSourceRecords ?? [];
  const actionParamRules = options.actionParamRules ?? DEFAULT_ACTION_PARAM_RULES;

  const missingImageChecks = nodes.flatMap((node) => {
    const manifest = manifests.get(node.componentName);
    if (!manifest) return [];

    return Object.entries(manifest.propsSchema)
      .filter(([, propSchema]) => propSchema.setter === "image")
      .filter(([propName]) => {
        const value = node.props[propName];
        return typeof value !== "string" || value.trim().length === 0;
      })
      .map(([propName, propSchema]) => ({
        id: `image-${node.id}-${propName}`,
        title: "图片素材",
        status: "warning" as const,
        description: `${getLowcodeNodeDisplayName(node, manifest)} 的「${propSchema.label ?? propName}」为空`,
        nodeId: node.id,
        nodeTitle: getLowcodeNodeDisplayName(node, manifest),
      }));
  });

  const emptyProductChecks = nodes.flatMap((node) => {
    if (!productComponentNames.has(node.componentName)) return [];
    if (node.dataBinding?.items) return [];
    if (Array.isArray(node.props.items) && node.props.items.length > 0) return [];
    const manifest = manifests.get(node.componentName);
    return [{
      id: `products-${node.id}`,
      title: "商品内容",
      status: "warning" as const,
      description: `${getLowcodeNodeDisplayName(node, manifest)} 没有静态商品，也没有绑定商品数据源`,
      nodeId: node.id,
      nodeTitle: getLowcodeNodeDisplayName(node, manifest),
    }];
  });

  const dataSourceErrorChecks = dataSourceRecords
    .filter((record) => record.status === "error")
    .map((record) => {
      const boundNode = nodes.find((node) => Object.values(node.dataBinding ?? {}).includes(record.id));
      const boundManifest = boundNode ? manifests.get(boundNode.componentName) : undefined;
      return {
        id: `data-source-${record.id}`,
        title: "数据源解析",
        status: "error" as const,
        description: `${record.id} 解析失败${record.error ? `：${record.error}` : ""}`,
        nodeId: boundNode?.id,
        nodeTitle: boundNode ? getLowcodeNodeDisplayName(boundNode, boundManifest) : undefined,
      };
    });

  const actions = new Set((schema.actions ?? []).map((action) => action.id));
  const actionNodeUsage = new Map<string, { nodeId: string; nodeTitle: string; eventName: string }>();
  nodes.forEach((node) => {
    const manifest = manifests.get(node.componentName);
    Object.entries(node.events ?? {}).forEach(([eventName, ref]) => {
      if (!actionNodeUsage.has(ref.actionId)) {
        actionNodeUsage.set(ref.actionId, {
          nodeId: node.id,
          nodeTitle: getLowcodeNodeDisplayName(node, manifest),
          eventName,
        });
      }
    });
  });

  const missingActionChecks = nodes.flatMap((node) => {
    const manifest = manifests.get(node.componentName);
    return Object.entries(node.events ?? {})
      .filter(([, ref]) => !actions.has(ref.actionId))
      .map(([eventName, ref]) => ({
        id: `action-ref-${node.id}-${eventName}`,
        title: "动作配置",
        status: "error" as const,
        description: `${getLowcodeNodeDisplayName(node, manifest)} 的 ${eventName} 引用了不存在的动作 ${ref.actionId}`,
        nodeId: node.id,
        nodeTitle: getLowcodeNodeDisplayName(node, manifest),
      }));
  });

  const actionWarningChecks = (schema.actions ?? []).flatMap((action) => {
    const rule = actionParamRules.find((item) => item.actionType === action.type);
    if (!rule || getJsonParamString(action.params, rule.paramName, "")) return [];

    const usage = actionNodeUsage.get(action.id);
    return [{
      id: `action-param-${action.id}-${rule.paramName}`,
      title: "动作配置",
      status: "warning" as const,
      description: `${action.id} 缺少 ${rule.label}${usage ? `，当前被 ${usage.nodeTitle} 的 ${usage.eventName} 使用` : ""}`,
      nodeId: usage?.nodeId,
      nodeTitle: usage?.nodeTitle,
    }];
  });

  const validation = validateLowcodePageSchema(schema);
  return [
    {
      id: "schema",
      title: "Schema 校验",
      status: validation.valid ? "pass" : "error",
      description: validation.valid ? "Page Schema 结构有效" : validation.errors.join("；"),
    },
    {
      id: "nodes",
      title: "页面节点",
      status: nodes.length > 0 ? "pass" : "error",
      description: nodes.length > 0 ? `已配置 ${nodes.length} 个节点` : "页面没有任何节点",
    },
    ...(missingImageChecks.length ? missingImageChecks : [{
      id: "images",
      title: "图片素材",
      status: "pass" as const,
      description: "图片类字段已配置",
    }]),
    ...(emptyProductChecks.length ? emptyProductChecks : [{
      id: "products",
      title: "商品内容",
      status: "pass" as const,
      description: "商品组件已有静态商品或数据源绑定",
    }]),
    ...(dataSourceErrorChecks.length ? dataSourceErrorChecks : [{
      id: "dataSources",
      title: "数据源解析",
      status: "pass" as const,
      description: `数据源状态正常，共 ${dataSourceRecords.length} 个`,
    }]),
    ...(missingActionChecks.length || actionWarningChecks.length ? [...missingActionChecks, ...actionWarningChecks] : [{
      id: "actions",
      title: "动作配置",
      status: "pass" as const,
      description: `动作配置正常，共 ${(schema.actions ?? []).length} 个`,
    }]),
  ];
}

export function summarizeLowcodePublishChecks(
  checks: LowcodeEditorPublishCheck[],
): LowcodeEditorPublishCheckSummary {
  return checks.reduce(
    (summary, check) => ({
      ...summary,
      [check.status]: summary[check.status] + 1,
    }),
    { pass: 0, warning: 0, error: 0 },
  );
}

export function createLowcodeDeliverySummary(
  schema: LowcodePageSchema,
  options: CreateLowcodeDeliverySummaryOptions = {},
): LowcodeEditorDeliverySummary {
  const schemaJson = JSON.stringify(schema, null, 2);
  const checks = options.checks ?? createLowcodePublishChecks(schema);
  const checkSummary = summarizeLowcodePublishChecks(checks);
  const statusText = createDeliveryStatusText(checkSummary);
  const schemaSizeBytes = encodedByteSize(schemaJson);

  return {
    schemaJson,
    schemaSizeBytes,
    schemaSizeText: formatLowcodeSchemaSize(schemaSizeBytes),
    statusText,
    metrics: [
      { label: "页面标题", value: schema.title || "未命名 H5 页面" },
      { label: "Page ID", value: schema.pageId },
      { label: "节点", value: `${countLowcodeNodes(schema)} 个` },
      { label: "数据源", value: `${schema.dataSources?.length ?? 0} 个` },
      { label: "动作", value: `${schema.actions?.length ?? 0} 个` },
      { label: "Schema", value: formatLowcodeSchemaSize(schemaSizeBytes) },
      { label: "检查", value: statusText },
    ],
  };
}

export function formatLowcodeSchemaSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function createLowcodeEditorDraftPayload(
  schema: LowcodePageSchema,
  options: CreateLowcodeEditorDraftPayloadOptions = {},
): LowcodeEditorDraftPayload {
  const schemaJson = options.pretty === false ? JSON.stringify(schema) : JSON.stringify(schema, null, 2);
  const schemaSizeBytes = encodedByteSize(schemaJson);
  return {
    version: 1,
    updatedAt: (options.now ?? new Date()).toISOString(),
    schema: options.cloneSchema === false ? schema : cloneLowcodePageSchema(schema),
    schemaJson,
    schemaSizeBytes,
    schemaSizeText: formatLowcodeSchemaSize(schemaSizeBytes),
  };
}

export function parseLowcodeEditorDraftContent(
  content: string | null | undefined,
  options: ParseLowcodeEditorDraftContentOptions = {},
): LowcodeEditorDraftRestoreResult {
  const fallbackSchema = options.fallbackSchema
    ? options.cloneSchema === false
      ? options.fallbackSchema
      : cloneLowcodePageSchema(options.fallbackSchema)
    : undefined;
  if (!content) {
    return { restored: false, schema: fallbackSchema };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    return {
      restored: false,
      schema: fallbackSchema,
      error: `草稿 JSON 格式不正确：${error instanceof Error ? error.message : "解析失败"}`,
    };
  }

  const payload = getLowcodeEditorDraftPayloadCandidate(parsed);
  const schemaCandidate = payload?.schema ?? parsed;
  const validation = validateLowcodePageSchema(schemaCandidate);
  if (!validation.valid) {
    return {
      restored: false,
      schema: fallbackSchema,
      error: `草稿 Page Schema 校验失败：${validation.errors.join("；")}`,
      validationErrors: validation.errors,
    };
  }

  const schema = schemaCandidate as LowcodePageSchema;
  return {
    restored: true,
    schema: options.cloneSchema === false ? schema : cloneLowcodePageSchema(schema),
    payload,
    legacy: !payload,
  };
}

export function formatLowcodeEditorDraftStatusText(
  status: LowcodeEditorDraftPersistenceStatus,
  options: FormatLowcodeEditorDraftStatusTextOptions = {},
): string {
  if (status === "restored") return "已恢复本地草稿";
  if (status === "pending") return "自动保存中";
  if (status === "saved") {
    return options.lastSavedAt
      ? `已自动保存 ${(options.formatSavedAt ?? formatDraftSavedAt)(options.lastSavedAt)}`
      : "已自动保存";
  }
  if (status === "error") return "自动保存失败";
  return "自动保存待命";
}

export function getLowcodeEditorDraftStatusTone(
  status: LowcodeEditorDraftPersistenceStatus,
): LowcodeEditorDraftStatusTone {
  if (status === "error") return "danger";
  if (status === "pending") return "warning";
  if (status === "saved" || status === "restored") return "success";
  return "neutral";
}

export function createLowcodeSchemaFileName(
  schema: LowcodePageSchema,
  options: CreateLowcodeSchemaFileNameOptions = {},
): string {
  if (options.filename) {
    return ensureJsonFileName(sanitizeFileName(options.filename));
  }

  const prefix = sanitizeFileName(options.filenamePrefix ?? DEFAULT_SCHEMA_FILE_PREFIX);
  const pageId = sanitizeFileName(schema.pageId) || "page";
  const timestamp = (options.now ?? new Date()).toISOString().replace(/[:.]/g, "-");
  return `${prefix}-${pageId}-${timestamp}.json`;
}

export function createLowcodeSchemaFileExport(
  schema: LowcodePageSchema,
  options: CreateLowcodeSchemaFileExportOptions = {},
): LowcodeEditorSchemaFileExport {
  const content = options.pretty === false ? JSON.stringify(schema) : JSON.stringify(schema, null, 2);
  const sizeBytes = encodedByteSize(content);
  return {
    filename: createLowcodeSchemaFileName(schema, options),
    mimeType: "application/json;charset=utf-8",
    content,
    sizeBytes,
    sizeText: formatLowcodeSchemaSize(sizeBytes),
  };
}

export function parseLowcodeSchemaFileContent(
  content: string,
  options: ParseLowcodeSchemaFileContentOptions = {},
): LowcodeEditorSchemaFileImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    return {
      ok: false,
      error: `JSON 格式不正确：${error instanceof Error ? error.message : "解析失败"}`,
    };
  }

  const validation = validateLowcodePageSchema(parsed);
  if (!validation.valid) {
    return {
      ok: false,
      error: `Page Schema 校验失败：${validation.errors.join("；")}`,
      validationErrors: validation.errors,
    };
  }

  const schema = parsed as LowcodePageSchema;
  return {
    ok: true,
    schema: options.cloneSchema === false ? schema : cloneLowcodePageSchema(schema),
  };
}

export function createLowcodeVersionDiffItems(
  current: LowcodePageSchema,
  selected: LowcodePageSchema,
): LowcodeEditorVersionDiffItem[] {
  const items = [
    { label: "标题", current: current.title, selected: selected.title },
    { label: "状态", current: current.status, selected: selected.status },
    { label: "环境", current: current.publishMeta.environment, selected: selected.publishMeta.environment },
    { label: "页面版本", current: current.pageVersion, selected: selected.pageVersion },
    { label: "节点数", current: String(countLowcodeNodes(current)), selected: String(countLowcodeNodes(selected)) },
    { label: "数据源数", current: String(current.dataSources?.length ?? 0), selected: String(selected.dataSources?.length ?? 0) },
    { label: "动作数", current: String(current.actions?.length ?? 0), selected: String(selected.actions?.length ?? 0) },
  ];

  return items.map((item) => ({
    ...item,
    changed: item.current !== item.selected,
  }));
}

export function createLowcodeSchemaPreviewSnippet(
  schema: LowcodePageSchema,
  options: CreateLowcodeSchemaPreviewSnippetOptions = {},
): LowcodeEditorSchemaPreviewSnippet {
  return {
    pageId: schema.pageId,
    title: schema.title,
    status: schema.status,
    pageVersion: schema.pageVersion,
    pageType: schema.pageType ?? null,
    publishMeta: {
      environment: schema.publishMeta.environment,
      operator: schema.publishMeta.operator ?? null,
      publishedAt: schema.publishMeta.publishedAt ?? null,
    },
    layout: cloneJsonObject(schema.layout ?? {}),
    nodeCount: countLowcodeNodes(schema),
    nodes: schema.nodes.slice(0, options.maxNodes ?? 8).map((node) => ({
      id: node.id,
      componentName: node.componentName,
      name: node.meta?.name ?? null,
      childCount: node.children?.length ?? 0,
    })),
    dataSourceIds: (schema.dataSources ?? []).map((item) => item.id),
    actionIds: (schema.actions ?? []).map((item) => item.id),
  };
}

export function createLowcodeSchemaPreviewItems(
  current: LowcodePageSchema,
  selected: LowcodePageSchema,
  options: CreateLowcodeSchemaPreviewItemsOptions = {},
): LowcodeEditorSchemaPreviewItem[] {
  return [
    {
      id: "current",
      title: options.currentTitle ?? "当前草稿 Schema 片段",
      description: options.currentDescription ?? `${current.title} / ${current.pageVersion}`,
      json: JSON.stringify(createLowcodeSchemaPreviewSnippet(current, options), null, 2),
    },
    {
      id: "selected",
      title: options.selectedTitle ?? "所选版本 Schema 片段",
      description: options.selectedDescription ?? `${selected.title} / ${selected.pageVersion}`,
      json: JSON.stringify(createLowcodeSchemaPreviewSnippet(selected, options), null, 2),
    },
  ];
}

export function createLowcodeTemplatePreviewMeta(
  template: LowcodeEditorTemplateResource,
  options: CreateLowcodeTemplatePreviewMetaOptions = {},
): LowcodeEditorTemplatePreviewMeta {
  const nodes = flattenLowcodeNodes(template.schema.nodes);
  const imageUrl = pickFirstTemplateNodeText(nodes, TEMPLATE_IMAGE_PROP_NAMES);
  const title = pickFirstTemplateNodeText(nodes, TEMPLATE_TITLE_PROP_NAMES) || template.title;
  const subtitle = pickFirstTemplateNodeText(nodes, TEMPLATE_SUBTITLE_PROP_NAMES) || template.description;

  return {
    imageUrl: imageUrl || options.fallbackImageUrl || "",
    title,
    subtitle,
    nodeCountText: `${countLowcodeNodes(template.schema)} 节点`,
  };
}

export function createLowcodeTemplateListItem(
  template: LowcodeEditorTemplateResource,
  options: CreateLowcodeTemplateListItemOptions = {},
): LowcodeEditorTemplateListItem {
  return {
    id: template.id,
    title: template.title,
    description: template.description,
    category: template.category,
    tags: template.tags ?? [],
    version: template.version,
    nodeCount: countLowcodeNodes(template.schema),
    dataSourceCount: template.schema.dataSources?.length ?? 0,
    actionCount: template.schema.actions?.length ?? 0,
    preview: createLowcodeTemplatePreviewMeta(template, options),
  };
}

export function sliceLowcodeTemplateTags(
  template: Pick<LowcodeEditorTemplateListItem, "tags">,
  limit = 4,
): string[] {
  return template.tags.slice(0, Math.max(0, limit));
}

export function formatLowcodeTemplateVersion(
  template: Pick<LowcodeEditorTemplateListItem, "version">,
): string {
  return template.version ? `v${template.version}` : "未标版本";
}

export function formatLowcodeTemplateSummary(
  template: Pick<LowcodeEditorTemplateListItem, "nodeCount" | "dataSourceCount" | "actionCount">,
): string {
  return `${template.nodeCount} 个节点 / ${template.dataSourceCount} 个数据源 / ${template.actionCount} 个动作`;
}

export function createLowcodeBlankPageSchema(
  options: CreateLowcodeBlankPageSchemaOptions = {},
): LowcodePageSchema {
  const now = options.now ?? new Date();
  const pageIdPrefix = options.pageIdPrefix ?? DEFAULT_BLANK_PAGE_ID_PREFIX;
  return createLowcodePageSchema({
    pageId: options.pageId ?? `${pageIdPrefix}-${now.getTime().toString(36)}`,
    title: options.title ?? "未命名 H5 页面",
    pageType: options.pageType ?? "custom",
    targetPlatforms: ["h5"],
    layout: {
      safeArea: true,
      backgroundColor: options.backgroundColor ?? "#f8fafc",
      maxWidth: options.maxWidth ?? 430,
    },
    nodes: [],
    tracking: {
      pageName: options.trackingPageName ?? "lowcode_blank_h5",
      channelParamKeys: options.channelParamKeys ?? ["utm_source", "channel"],
      exposure: true,
      click: true,
    },
    publishMeta: {
      environment: options.environment ?? "test",
      operator: options.operator ?? "playground",
    },
    editor: {
      canvasWidth: options.canvasWidth ?? 375,
      notes: options.notes ?? "从新建页面向导创建的空白 H5 页面。",
    },
  });
}

export function cloneLowcodePageSchema(schema: LowcodePageSchema): LowcodePageSchema {
  return cloneJsonObject(schema) as unknown as LowcodePageSchema;
}

export function createLowcodePageStartState(
  schema: LowcodePageSchema,
  options: CreateLowcodePageStartStateOptions = {},
): LowcodeEditorState {
  const nextSchema = options.cloneSchema === false ? schema : cloneLowcodePageSchema(schema);
  const nextState = createEditorState(nextSchema, {
    selectedNodeId: options.selectedNodeId ?? nextSchema.nodes[0]?.id,
    mode: options.mode ?? "design",
    viewport: options.viewport,
    historyLimit: options.historyLimit,
  });
  return {
    ...nextState,
    dirty: options.dirty ?? true,
    lastAction: options.lastAction ?? "startPage",
  };
}

function commitSchemaChange(
  state: LowcodeEditorState,
  schema: LowcodePageSchema,
  action: string,
  selectedNodeId = state.selectedNodeId,
): LowcodeEditorState {
  return {
    ...state,
    schema,
    selectedNodeId,
    history: {
      ...state.history,
      past: pushHistory(state.history.past, state.schema, state.history.limit),
      future: [],
    },
    dirty: true,
    lastAction: action,
  };
}

function pushHistory(history: LowcodePageSchema[], schema: LowcodePageSchema, limit: number): LowcodePageSchema[] {
  return [...history, schema].slice(-limit);
}

function updateNode(
  state: LowcodeEditorState,
  nodeId: string,
  updater: (node: LowcodeNode) => LowcodeNode,
  action: string,
): LowcodeEditorState {
  const result = updateNodes(state.schema.nodes, nodeId, updater);
  if (!result.updated) return state;

  return commitSchemaChange(
    state,
    {
      ...state.schema,
      nodes: result.nodes,
    },
    action,
    nodeId,
  );
}

function updateNodes(
  nodes: LowcodeNode[],
  nodeId: string,
  updater: (node: LowcodeNode) => LowcodeNode,
): { nodes: LowcodeNode[]; updated: boolean } {
  let updated = false;
  const nextNodes = nodes.map((node) => {
    if (node.id === nodeId) {
      updated = true;
      return updater(node);
    }

    if (!node.children?.length) return node;
    const childResult = updateNodes(node.children, nodeId, updater);
    if (!childResult.updated) return node;
    updated = true;
    return {
      ...node,
      children: childResult.nodes,
    };
  });

  return { nodes: nextNodes, updated };
}

function insertIntoNodes(
  nodes: LowcodeNode[],
  node: LowcodeNode,
  parentId: string | undefined,
  index: number | undefined,
): LowcodeNode[] | undefined {
  if (!parentId) {
    const nextNodes = [...nodes];
    nextNodes.splice(clampIndex(index ?? nextNodes.length, nextNodes.length), 0, node);
    return nextNodes;
  }

  const result = updateNodes(nodes, parentId, (parent) => {
    const children = [...(parent.children ?? [])];
    children.splice(clampIndex(index ?? children.length, children.length), 0, node);
    return {
      ...parent,
      children,
    };
  });

  return result.updated ? result.nodes : undefined;
}

function removeFromNodes(nodes: LowcodeNode[], nodeId: string): { nodes: LowcodeNode[]; removedNode?: LowcodeNode } {
  let removedNode: LowcodeNode | undefined;
  const nextNodes: LowcodeNode[] = [];

  for (const node of nodes) {
    if (node.id === nodeId) {
      removedNode = node;
      continue;
    }

    if (node.children?.length) {
      const childResult = removeFromNodes(node.children, nodeId);
      if (childResult.removedNode) {
        removedNode = childResult.removedNode;
        nextNodes.push({
          ...node,
          children: childResult.nodes,
        });
        continue;
      }
    }

    nextNodes.push(node);
  }

  return { nodes: nextNodes, removedNode };
}

function findNode(nodes: LowcodeNode[], nodeId: string): LowcodeNode | undefined {
  return findNodeWithParent(nodes, nodeId)?.node;
}

function findNodeWithParent(
  nodes: LowcodeNode[],
  nodeId: string,
  parentId?: string,
): { node: LowcodeNode; parentId?: string; index: number } | undefined {
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (!node) continue;
    if (node.id === nodeId) return { node, parentId, index };
    const childResult = findNodeWithParent(node.children ?? [], nodeId, node.id);
    if (childResult) return childResult;
  }
  return undefined;
}

function isDescendant(nodes: LowcodeNode[], ancestorId: string, targetId: string): boolean {
  const ancestor = findNode(nodes, ancestorId);
  if (!ancestor) return false;
  return Boolean(findNode(ancestor.children ?? [], targetId));
}

function cloneNodeWithNewIds(node: LowcodeNode): LowcodeNode {
  return createLowcodeNode({
    componentName: node.componentName,
    materialVersion: node.materialVersion,
    props: { ...node.props },
    style: node.style ? { ...node.style } : undefined,
    slot: node.slot,
    dataBinding: node.dataBinding ? { ...node.dataBinding } : undefined,
    events: node.events ? { ...node.events } : undefined,
    visibility: node.visibility ? { ...node.visibility } : undefined,
    responsive: node.responsive?.map((rule) => ({
      ...rule,
      props: rule.props ? { ...rule.props } : undefined,
      style: rule.style ? { ...rule.style } : undefined,
    })),
    meta: node.meta ? { ...node.meta } : undefined,
    children: node.children?.map(cloneNodeWithNewIds),
  });
}

function createMaterialManifestMap(
  manifests: Iterable<LowcodeMaterialManifest> | undefined,
): Map<string, LowcodeMaterialManifest> {
  const map = new Map<string, LowcodeMaterialManifest>();
  for (const manifest of manifests ?? []) {
    map.set(manifest.componentName, manifest);
  }
  return map;
}

function createOutlineMaterialMap(
  manifests: Iterable<LowcodeEditorOutlineMaterialInfo> | undefined,
): Map<string, LowcodeEditorOutlineMaterialInfo> {
  const map = new Map<string, LowcodeEditorOutlineMaterialInfo>();
  for (const manifest of manifests ?? []) {
    map.set(manifest.componentName, manifest);
  }
  return map;
}

function flattenLowcodeOutlineRows(
  nodes: LowcodeNode[],
  manifests: Map<string, LowcodeEditorOutlineMaterialInfo>,
  depth = 0,
  parentId?: string,
  ancestorIds: string[] = [],
): LowcodeEditorOutlineRow[] {
  return nodes.flatMap((node, index) => {
    const manifest = manifests.get(node.componentName);
    const manifestTitle = manifest?.title ?? node.componentName;
    const title = getLowcodeNodeDisplayName(node, manifest);
    const subtitle = `${manifestTitle} / ${node.id}`;
    const row: LowcodeEditorOutlineRow = {
      node,
      index,
      depth,
      parentId,
      ancestorIds,
      hasChildren: Boolean(node.children?.length),
      title,
      subtitle,
      searchText: [
        node.id,
        node.componentName,
        node.meta?.name,
        manifest?.title,
        manifest?.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    };
    return [
      row,
      ...flattenLowcodeOutlineRows(node.children ?? [], manifests, depth + 1, node.id, [...ancestorIds, node.id]),
    ];
  });
}

function getJsonParamString(params: JsonObject | undefined, key: string, fallback: string): string {
  const value = params?.[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function createDeliveryStatusText(summary: LowcodeEditorPublishCheckSummary): string {
  if (summary.error) return `${summary.error} 个阻塞项`;
  if (summary.warning) return `${summary.warning} 个提醒`;
  return "检查通过";
}

function createWorkspacePublishStat(
  summary: LowcodeEditorPublishCheckSummary | undefined,
): LowcodeEditorWorkspaceStat {
  if (!summary) {
    return {
      id: "publish",
      label: "发布",
      value: "未检查",
      tone: "neutral",
    };
  }
  if (summary.error) {
    return {
      id: "publish",
      label: "发布",
      value: `${summary.error} 个错误`,
      tone: "danger",
    };
  }
  if (summary.warning) {
    return {
      id: "publish",
      label: "发布",
      value: `${summary.warning} 个提醒`,
      tone: "warning",
    };
  }
  return {
    id: "publish",
    label: "发布",
    value: "可预览",
    tone: "success",
  };
}

function pickFirstTemplateNodeText(nodes: LowcodeNode[], propNames: string[]): string {
  for (const node of nodes) {
    const text = pickFirstTemplatePropText(node.props, propNames);
    if (text) return text;
  }
  return "";
}

function pickFirstTemplatePropText(props: JsonObject, propNames: string[]): string {
  for (const propName of propNames) {
    const text = pickTemplatePreviewText(props[propName]);
    if (text) return text;
  }
  return "";
}

function pickTemplatePreviewText(value: JsonValue | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function cloneJsonObject(value: unknown): JsonObject {
  return JSON.parse(JSON.stringify(value)) as JsonObject;
}

function encodedByteSize(value: string): number {
  return new TextEncoder().encode(value).length;
}

function getLowcodeEditorDraftPayloadCandidate(value: unknown): LowcodeEditorDraftPayload | undefined {
  if (!isPlainObject(value)) return undefined;
  if (value.version !== 1 || !("schema" in value) || typeof value.updatedAt !== "string") return undefined;
  return value as unknown as LowcodeEditorDraftPayload;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatDraftSavedAt(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

function sanitizeFileName(value: string): string {
  return value.replace(/[^\p{L}\p{N}._-]+/gu, "-").replace(/^-+|-+$/g, "") || "page";
}

function ensureJsonFileName(filename: string): string {
  return filename.toLowerCase().endsWith(".json") ? filename : `${filename}.json`;
}

function clampIndex(index: number, max: number): number {
  return Math.max(0, Math.min(index, max));
}
