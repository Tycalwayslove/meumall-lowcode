import type {
  JsonObject,
  JsonValue,
  LowcodeActionConfig,
  LowcodeDataBinding,
  LowcodeDataSourceConfig,
  LowcodeDataSourceSlotManifest,
  LowcodeEnvironment,
  LowcodeNode,
  LowcodeMaterialManifest,
  LowcodeMaterialEventManifest,
  LowcodePageSchema,
  LowcodePageStatus,
  LowcodePageType,
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

export interface LowcodeEditorPageTypeOption {
  label: string;
  value: LowcodePageType;
}

export interface LowcodeEditorPageStatusOption {
  label: string;
  value: LowcodePageStatus;
}

export interface LowcodeEditorPublishEnvironmentOption {
  label: string;
  value: LowcodeEnvironment;
}

export interface LowcodeEditorPageSettingsForm {
  pageId: string;
  title: string;
  description: string;
  pageType: LowcodePageType;
  status: LowcodePageStatus;
  publishEnvironment: LowcodeEnvironment;
  backgroundColor: string;
  safeArea: boolean;
  maxWidth: number;
  pageTypeOptions: readonly LowcodeEditorPageTypeOption[];
  statusOptions: readonly LowcodeEditorPageStatusOption[];
  publishEnvironmentOptions: readonly LowcodeEditorPublishEnvironmentOption[];
  backgroundSwatches: readonly string[];
}

export interface CreateLowcodePageSettingsFormOptions {
  defaultBackgroundColor?: string;
  defaultMaxWidth?: number;
  pageTypeOptions?: readonly LowcodeEditorPageTypeOption[];
  statusOptions?: readonly LowcodeEditorPageStatusOption[];
  publishEnvironmentOptions?: readonly LowcodeEditorPublishEnvironmentOption[];
  backgroundSwatches?: readonly string[];
}

export interface NormalizeLowcodePageMaxWidthOptions {
  min?: number;
  max?: number;
}

export interface LowcodeEditorDataSourceResolutionRecord {
  id: string;
  status: "pending" | "resolved" | "skipped" | "error" | string;
  bindTo?: string;
  error?: string;
}

export interface LowcodeEditorDataSourceTypeOption {
  type: string;
  label: string;
  description?: string;
  defaultBindTo?: string;
  defaultParams?: JsonObject;
  defaultCache?: LowcodeDataSourceConfig["cache"];
}

export interface LowcodeEditorDataSourceFormItem {
  id: string;
  type: string;
  typeLabel: string;
  bindTo: string;
  paramsText: string;
  status: string;
  statusText: string;
  statusDescription: string;
  dataSource: LowcodeDataSourceConfig;
  record?: LowcodeEditorDataSourceResolutionRecord;
}

export interface CreateLowcodeDataSourceConfigOptions {
  id?: string;
  now?: Date;
  bindTo?: string;
  params?: JsonObject;
  cache?: LowcodeDataSourceConfig["cache"];
  typeOptions?: readonly LowcodeEditorDataSourceTypeOption[];
}

export interface CreateLowcodeDataSourceFormItemsOptions {
  typeOptions?: readonly LowcodeEditorDataSourceTypeOption[];
  records?: readonly LowcodeEditorDataSourceResolutionRecord[];
  pendingLabel?: string;
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

export interface LowcodeEditorMaterialDetailPropEntry {
  name: string;
  label: string;
  type: LowcodePropSchema["type"];
  setter: LowcodePropSchema["setter"];
  required: boolean;
  description: string;
  schema: LowcodePropSchema;
}

export interface LowcodeEditorMaterialDetailEventItem {
  name: string;
  title: string;
  description: string;
  event: LowcodeMaterialEventManifest;
}

export interface LowcodeEditorMaterialDetailDataSourceSlotItem {
  name: string;
  acceptedTypes: string[];
  acceptedTypesText: string;
  required: boolean;
  slot: LowcodeDataSourceSlotManifest;
}

export interface LowcodeEditorMaterialDetailSummary {
  componentName: string;
  title: string;
  category: string;
  materialVersion: string;
  platforms: LowcodePlatform[];
  platformText: string;
  propCount: number;
  eventCount: number;
  dataSourceSlotCount: number;
  summary: string;
}

export interface CreateLowcodeMaterialNodeInputOptions {
  id?: string;
  metaName?: string;
  dataBinding?: LowcodeDataBinding;
  dataBindingByComponentName?: Record<string, LowcodeDataBinding | undefined>;
  dataBindingBySlotName?: Record<string, string | undefined>;
}

export interface CreateLowcodeMaterialPreviewSchemaOptions extends CreateLowcodeMaterialNodeInputOptions {
  pageId?: string;
  title?: string;
  backgroundColor?: string;
  maxWidth?: number;
  dataSources?: readonly LowcodeDataSourceConfig[];
  actions?: readonly LowcodeActionConfig[];
  environment?: LowcodeEnvironment;
  operator?: string;
}

export interface NormalizeLowcodeMaterialComponentNamesOptions {
  availableComponentNames?: Iterable<string>;
  limit?: number;
}

export interface ParseLowcodeMaterialPreferenceContentOptions extends NormalizeLowcodeMaterialComponentNamesOptions {}

export interface ToggleLowcodeFavoriteMaterialOptions extends NormalizeLowcodeMaterialComponentNamesOptions {}

export interface RecordLowcodeRecentMaterialOptions extends NormalizeLowcodeMaterialComponentNamesOptions {}

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

export type LowcodeEditorPermissionAction =
  | "approval.submit"
  | "approval.cancel"
  | "approval.review"
  | "page.create"
  | "draft.save"
  | "schema.import"
  | "schema.export"
  | "preview.create"
  | "publish.submit"
  | "runtime.open"
  | "template.save"
  | "template.apply"
  | "canvas.clear"
  | "material.insert"
  | "node.insert"
  | "node.move"
  | "node.copy"
  | "node.paste"
  | "node.duplicate"
  | "node.delete"
  | "node.rename";

export interface LowcodeEditorPermissionDecision {
  action: LowcodeEditorPermissionAction;
  allowed: boolean;
  reason?: string;
}

export type LowcodeEditorPermissionInput =
  | boolean
  | {
      allowed: boolean;
      reason?: string;
    };

export type LowcodeEditorPermissionState = Record<LowcodeEditorPermissionAction, LowcodeEditorPermissionDecision>;

export interface CreateLowcodeEditorPermissionStateOptions {
  decisions?: Partial<Record<LowcodeEditorPermissionAction, LowcodeEditorPermissionInput>>;
  readonly?: boolean;
  readonlyReason?: string;
}

export type LowcodeEditorCollaborationLockStatus =
  | "unlocked"
  | "locked-by-me"
  | "locked-by-other"
  | "readonly"
  | "expired";

export type LowcodeEditorCollaborationTone = "neutral" | "success" | "warning" | "danger";

export interface LowcodeEditorCollaborator {
  id?: string;
  name?: string;
  avatarUrl?: string;
}

export interface LowcodeEditorCollaborationState {
  status: LowcodeEditorCollaborationLockStatus;
  editable: boolean;
  readonly: boolean;
  tone: LowcodeEditorCollaborationTone;
  title: string;
  description: string;
  readonlyReason?: string;
  holder?: LowcodeEditorCollaborator;
  lockedAt?: string;
  expiresAt?: string;
  expiresInText?: string;
}

export interface CreateLowcodeEditorCollaborationStateOptions {
  status?: LowcodeEditorCollaborationLockStatus;
  currentUserId?: string;
  holder?: LowcodeEditorCollaborator;
  lockedAt?: string;
  expiresAt?: string;
  now?: Date | string;
  readonlyReason?: string;
  lockReason?: string;
}

export type LowcodeEditorApprovalStatus =
  | "none"
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "published";

export type LowcodeEditorApprovalTone = "neutral" | "success" | "warning" | "danger";

export interface LowcodeEditorApprovalParticipant {
  id?: string;
  name?: string;
  avatarUrl?: string;
}

export interface LowcodeEditorApprovalState {
  status: LowcodeEditorApprovalStatus;
  editable: boolean;
  readonly: boolean;
  submittable: boolean;
  publishable: boolean;
  tone: LowcodeEditorApprovalTone;
  title: string;
  description: string;
  readonlyReason?: string;
  submitDisabledReason?: string;
  publishDisabledReason?: string;
  submitter?: LowcodeEditorApprovalParticipant;
  reviewer?: LowcodeEditorApprovalParticipant;
  submittedAt?: string;
  reviewedAt?: string;
  comment?: string;
}

export interface CreateLowcodeEditorApprovalStateOptions {
  status?: LowcodeEditorApprovalStatus;
  submitter?: LowcodeEditorApprovalParticipant;
  reviewer?: LowcodeEditorApprovalParticipant;
  submittedAt?: string;
  reviewedAt?: string;
  comment?: string;
  reason?: string;
}

export type LowcodeEditorNodeOperationAction =
  | "rename"
  | "insertBefore"
  | "insertAfter"
  | "addInside"
  | "moveUp"
  | "moveDown"
  | "copy"
  | "paste"
  | "duplicate"
  | "delete";

export type LowcodeEditorNodeShortcutAction =
  | "delete"
  | "copy"
  | "paste"
  | "duplicate"
  | "undo"
  | "redo";

export interface LowcodeEditorNodeOperationItem {
  action: LowcodeEditorNodeOperationAction;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
}

export interface CreateLowcodeNodeOperationItemsOptions {
  canInsert?: boolean;
  canAddInside?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  canRename?: boolean;
  canCopy?: boolean;
  canPaste?: boolean;
  canDuplicate?: boolean;
  canDelete?: boolean;
}

export interface LowcodeEditorKeyboardShortcutLike {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
}

export interface ResolveLowcodeNodeShortcutActionOptions {
  hasSelectedNode?: boolean;
  canPaste?: boolean;
}

export interface CreateLowcodeNodeOperationMessageOptions {
  nodeTitle?: string;
  materialTitle?: string;
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

export interface LowcodeEditorNodeSelectionModel<
  T extends Pick<LowcodeEditorOutlineRow, "node" | "parentId"> = LowcodeEditorOutlineRow,
> {
  selectedNodeIds: string[];
  rows: T[];
  count: number;
  sameParent: boolean;
  summary: string;
}

export interface PruneLowcodeNodeSelectionOptions {
  activeNodeId?: string;
}

export type LowcodeEditorCanvasDropPlacement = "before" | "after" | "inside" | "append";
export type LowcodeEditorCanvasDragSource = "material" | "node";
export type LowcodeEditorCanvasSnapGuideAxis = "x" | "y";

export interface LowcodeEditorCanvasPoint {
  clientX: number;
  clientY: number;
}

export interface LowcodeEditorCanvasRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface LowcodeEditorCanvasFrameMetrics {
  top: number;
  left: number;
  scrollTop: number;
  scrollLeft: number;
  clientWidth: number;
  clientHeight: number;
  scrollHeight: number;
}

export interface LowcodeEditorCanvasDropHintStyle {
  top?: string;
  left?: string;
  width?: string;
  height?: string;
}

export interface LowcodeEditorCanvasSnapGuide {
  axis: LowcodeEditorCanvasSnapGuideAxis;
  label: string;
  style: LowcodeEditorCanvasDropHintStyle;
}

export interface LowcodeEditorCanvasDropHint {
  source: LowcodeEditorCanvasDragSource;
  placement: LowcodeEditorCanvasDropPlacement;
  targetNodeId?: string;
  targetTitle: string;
  style: LowcodeEditorCanvasDropHintStyle;
  guides: LowcodeEditorCanvasSnapGuide[];
}

export interface ResolveLowcodeCanvasDropPlacementOptions {
  insideComponentNames?: Iterable<string>;
  insideMinRatio?: number;
  insideMaxRatio?: number;
}

export interface CreateLowcodeCanvasTargetDropHintOptions {
  source: LowcodeEditorCanvasDragSource;
  placement: Exclude<LowcodeEditorCanvasDropPlacement, "append">;
  targetNodeId: string;
  targetTitle: string;
  frame: LowcodeEditorCanvasFrameMetrics;
  targetRect: LowcodeEditorCanvasRect;
}

export interface LowcodeEditorCanvasDropTarget<T extends Pick<LowcodeEditorOutlineRow, "node" | "parentId" | "index"> = LowcodeEditorOutlineRow> {
  parentId?: string;
  index: number;
  targetRow?: T;
}

export interface LowcodeEditorCanvasOperationResult {
  state: LowcodeEditorState;
  handled: boolean;
  changed: boolean;
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

export type LowcodeEditorPropControl = "text" | "number" | "color" | "switch" | "select" | "textarea" | "json" | "list";

export interface LowcodeEditorListField {
  name: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

export interface CreateLowcodeListEditorFieldsOptions {
  componentName?: string;
  items?: readonly JsonValue[];
  commonFields?: Record<string, LowcodeEditorListField>;
  defaultFieldNames?: Record<string, readonly string[]>;
}

export interface CreateLowcodeDefaultListItemOptions {
  componentName?: string;
  targetNodeId?: string;
  now?: Date;
  id?: string;
}

export interface LowcodeEditorActionOption {
  id: string;
  type: string;
  label: string;
  description: string;
}

export interface LowcodeEditorActionTypeOption {
  type: string;
  label: string;
  description?: string;
  defaultParams?: JsonObject;
}

export interface LowcodeEditorActionFormItem {
  id: string;
  type: string;
  typeLabel: string;
  paramsText: string;
  action: LowcodeActionConfig;
}

export interface CreateLowcodeActionConfigOptions {
  id?: string;
  now?: Date;
  defaultParams?: JsonObject;
  typeOptions?: readonly LowcodeEditorActionTypeOption[];
}

export interface CreateLowcodeActionFormItemsOptions {
  typeOptions?: readonly LowcodeEditorActionTypeOption[];
}

export interface LowcodeEditorEventBindingItem {
  name: string;
  title: string;
  description?: string;
  actionId: string;
  actionLabel: string;
  bound: boolean;
  missingAction: boolean;
  actionOptions: LowcodeEditorActionOption[];
}

export interface CreateLowcodeEventBindingItemsOptions {
  emptyActionLabel?: string;
  missingActionLabelPrefix?: string;
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

export type LowcodeEditorReleaseKind = "draft" | "preview" | "published" | string;

export interface LowcodeEditorReleaseRecord {
  id: string;
  kind: LowcodeEditorReleaseKind;
  pageId: string;
  pageVersion: string;
  title: string;
  note?: string;
  createdAt: string;
  schema: LowcodePageSchema;
}

export interface LowcodeEditorReleaseKindLabelOptions {
  labels?: Partial<Record<"draft" | "preview" | "published", string>> & Record<string, string | undefined>;
}

export interface FormatLowcodeReleaseTimeOptions {
  locale?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
  fallbackText?: string;
}

export interface LowcodeEditorReleaseListItem<TRelease extends LowcodeEditorReleaseRecord = LowcodeEditorReleaseRecord> {
  id: string;
  kind: LowcodeEditorReleaseKind;
  kindLabel: string;
  pageVersion: string;
  title: string;
  note: string;
  createdAt: string;
  createdAtText: string;
  selected: boolean;
  searchText: string;
  release: TRelease;
}

export interface CreateLowcodeReleaseListItemOptions extends LowcodeEditorReleaseKindLabelOptions, FormatLowcodeReleaseTimeOptions {
  selectedReleaseId?: string;
}

export interface CreateLowcodeReleaseListItemsOptions extends CreateLowcodeReleaseListItemOptions {
  keyword?: string;
}

export interface LowcodeEditorReleaseListSummary {
  total: number;
  visible: number;
  statusText: string;
  emptyText: string;
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

export type LowcodeEditorNodeInput = Omit<LowcodeNode, "id"> & { id?: string };
type NodeInput = LowcodeEditorNodeInput;

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

export const LOWCODE_EDITOR_PERMISSION_ACTIONS = [
  "approval.submit",
  "approval.cancel",
  "approval.review",
  "page.create",
  "draft.save",
  "schema.import",
  "schema.export",
  "preview.create",
  "publish.submit",
  "runtime.open",
  "template.save",
  "template.apply",
  "canvas.clear",
  "material.insert",
  "node.insert",
  "node.move",
  "node.copy",
  "node.paste",
  "node.duplicate",
  "node.delete",
  "node.rename",
] as const satisfies readonly LowcodeEditorPermissionAction[];

export const LOWCODE_EDITOR_MUTATING_PERMISSION_ACTIONS = [
  "page.create",
  "draft.save",
  "schema.import",
  "preview.create",
  "publish.submit",
  "template.save",
  "template.apply",
  "canvas.clear",
  "material.insert",
  "node.insert",
  "node.move",
  "node.paste",
  "node.duplicate",
  "node.delete",
  "node.rename",
] as const satisfies readonly LowcodeEditorPermissionAction[];

export const LOWCODE_EDITOR_COMMAND_DEFAULT_LIMIT = 28;
export const LOWCODE_EDITOR_RECENT_MATERIAL_DEFAULT_LIMIT = 6;
export const LOWCODE_EDITOR_PROP_GROUP_ORDER = ["content", "style", "data", "behavior", "advanced"] as const satisfies readonly LowcodeEditorPropGroupKey[];
export const LOWCODE_EDITOR_PROP_GROUP_META = {
  content: { label: "内容配置", description: "标题、文案、图片和按钮内容。" },
  style: { label: "样式配置", description: "颜色、圆角、间距和排版表现。" },
  data: { label: "数据配置", description: "商品、券、规则、导航项和数据源字段。" },
  behavior: { label: "行为配置", description: "跳转链接、吸顶、平滑滚动等交互行为。" },
  advanced: { label: "其他配置", description: "暂未归类的物料字段。" },
} as const satisfies Record<LowcodeEditorPropGroupKey, LowcodeEditorPropGroupMeta>;
export const LOWCODE_EDITOR_COMMON_LIST_FIELDS: Record<string, LowcodeEditorListField> = {
  id: { name: "id", label: "ID", placeholder: "唯一标识" },
  typeText: { name: "typeText", label: "类型", placeholder: "门店 / 达人 / 推荐" },
  title: { name: "title", label: "标题", placeholder: "请输入标题" },
  subtitle: { name: "subtitle", label: "副标题", placeholder: "请输入副标题" },
  desc: { name: "desc", label: "说明", placeholder: "请输入说明" },
  content: { name: "content", label: "内容", placeholder: "请输入内容", multiline: true },
  imageUrl: { name: "imageUrl", label: "图片", placeholder: "图片 URL" },
  coverImageUrl: { name: "coverImageUrl", label: "封面图", placeholder: "封面图 URL" },
  logoImageUrl: { name: "logoImageUrl", label: "Logo", placeholder: "Logo URL" },
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
export const LOWCODE_EDITOR_DEFAULT_LIST_FIELDS: Record<string, readonly string[]> = {
  coupons: ["id", "title", "thresholdText", "valueText", "expireText", "buttonText"],
  rules: ["title", "content"],
  sellingPoints: ["id", "title", "desc"],
};

const DEFAULT_PRODUCT_COMPONENT_NAMES = ["ProductList", "ProductRankList", "BrandFeatureSection", "FlashSaleList"];
const DEFAULT_CANVAS_INSIDE_COMPONENT_NAMES = ["SectionContainer"];
const DEFAULT_ACTION_PARAM_RULES: LowcodeEditorActionParamRule[] = [
  { actionType: "navigate", paramName: "url", label: "跳转 URL" },
  { actionType: "coupon.receive", paramName: "couponId", label: "couponId" },
  { actionType: "tracking.click", paramName: "eventName", label: "eventName" },
];
export const LOWCODE_EDITOR_PAGE_TYPE_OPTIONS: readonly LowcodeEditorPageTypeOption[] = [
  { label: "活动页", value: "activity" },
  { label: "推广页", value: "promotion" },
  { label: "商品专题", value: "topic" },
  { label: "落地页", value: "landing" },
  { label: "自定义", value: "custom" },
];
export const LOWCODE_EDITOR_PAGE_STATUS_OPTIONS: readonly LowcodeEditorPageStatusOption[] = [
  { label: "draft", value: "draft" },
  { label: "preview", value: "preview" },
  { label: "published", value: "published" },
  { label: "disabled", value: "disabled" },
];
export const LOWCODE_EDITOR_PUBLISH_ENVIRONMENT_OPTIONS: readonly LowcodeEditorPublishEnvironmentOption[] = [
  { label: "测试环境", value: "test" },
  { label: "预发环境", value: "pre" },
  { label: "生产环境", value: "prod" },
];
export const LOWCODE_EDITOR_PAGE_BACKGROUND_SWATCHES = [
  "#f8fafc",
  "#f3f4f6",
  "#fff7ed",
  "#fef2f2",
  "#f0fdfa",
  "#eff6ff",
  "#111827",
] as const;
export const LOWCODE_EDITOR_DEFAULT_COLOR_SWATCHES = [
  "#111827",
  "#ffffff",
  "#64748b",
  "#e5e7eb",
  "#f3f4f6",
  "#0f766e",
  "#2563eb",
  "#dc2626",
  "#ea580c",
  "#fef2f2",
  "#fff7ed",
  "#f0fdfa",
  "transparent",
] as const;
export const LOWCODE_EDITOR_DEFAULT_DATA_SOURCE_TYPE_OPTIONS: readonly LowcodeEditorDataSourceTypeOption[] = [
  {
    type: "product.byActivity",
    label: "活动商品",
    description: "按活动上下文拉取商品列表",
    defaultBindTo: "products",
    defaultParams: { activityId: "activity_demo", limit: 6 },
    defaultCache: { ttlSeconds: 60, scope: "public" },
  },
  {
    type: "product.byIds",
    label: "指定商品",
    description: "按商品 ID 列表拉取商品",
    defaultBindTo: "products",
    defaultParams: { ids: [], limit: 6 },
    defaultCache: { ttlSeconds: 60, scope: "public" },
  },
  {
    type: "store.byIds",
    label: "指定门店",
    description: "按门店 ID 列表拉取门店",
    defaultBindTo: "stores",
    defaultParams: { ids: [], limit: 4 },
    defaultCache: { ttlSeconds: 120, scope: "public" },
  },
  {
    type: "expert.byActivity",
    label: "活动达人",
    description: "按活动上下文拉取达人推荐",
    defaultBindTo: "stores",
    defaultParams: { activityId: "activity_demo", limit: 4 },
    defaultCache: { ttlSeconds: 120, scope: "public" },
  },
  {
    type: "custom.http",
    label: "自定义接口",
    description: "接入宿主提供的 HTTP 数据源",
    defaultBindTo: "data",
    defaultParams: {},
    defaultCache: { ttlSeconds: 60, scope: "public" },
  },
];
export const LOWCODE_EDITOR_DEFAULT_ACTION_TYPE_OPTIONS: readonly LowcodeEditorActionTypeOption[] = [
  {
    type: "navigate",
    label: "页面跳转",
    description: "打开 H5 链接或业务路由",
    defaultParams: { url: "/activity/demo", openInNewTab: false },
  },
  {
    type: "coupon.receive",
    label: "领取优惠券",
    description: "触发优惠券领取动作",
    defaultParams: { couponId: "coupon_demo" },
  },
  {
    type: "tracking.click",
    label: "点击埋点",
    description: "上报运营点击事件",
    defaultParams: { eventName: "lowcode_click" },
  },
  {
    type: "noop",
    label: "空动作",
    description: "仅用于占位或调试",
    defaultParams: {},
  },
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

export function createLowcodeMaterialDetailSummary(
  manifest: LowcodeMaterialManifest,
): LowcodeEditorMaterialDetailSummary {
  const platforms = manifest.platforms.slice();
  return {
    componentName: manifest.componentName,
    title: manifest.title,
    category: manifest.category,
    materialVersion: manifest.materialVersion,
    platforms,
    platformText: platforms.join(" / "),
    propCount: Object.keys(manifest.propsSchema).length,
    eventCount: manifest.events?.length ?? 0,
    dataSourceSlotCount: manifest.dataSourceSlots?.length ?? 0,
    summary: formatLowcodeMaterialCatalogSummary(manifest),
  };
}

export function createLowcodeMaterialDetailPropEntries(
  manifest: LowcodeMaterialManifest,
): LowcodeEditorMaterialDetailPropEntry[] {
  return Object.entries(manifest.propsSchema).map(([name, schema]) => ({
    name,
    label: schema.label,
    type: schema.type,
    setter: schema.setter,
    required: Boolean(schema.required),
    description: schema.description ?? "",
    schema,
  }));
}

export function createLowcodeMaterialDetailEventItems(
  manifest: LowcodeMaterialManifest,
): LowcodeEditorMaterialDetailEventItem[] {
  return (manifest.events ?? []).map((event) => ({
    name: event.name,
    title: event.title,
    description: event.description ?? "",
    event,
  }));
}

export function createLowcodeMaterialDetailDataSourceSlotItems(
  manifest: LowcodeMaterialManifest,
): LowcodeEditorMaterialDetailDataSourceSlotItem[] {
  return (manifest.dataSourceSlots ?? []).map((slot) => ({
    name: slot.name,
    acceptedTypes: slot.acceptedTypes.slice(),
    acceptedTypesText: slot.acceptedTypes.join(", "),
    required: Boolean(slot.required),
    slot,
  }));
}

export function createLowcodeMaterialNodeInput(
  manifest: LowcodeMaterialManifest,
  options: CreateLowcodeMaterialNodeInputOptions = {},
): LowcodeEditorNodeInput {
  const dataBinding = createLowcodeMaterialNodeDataBinding(manifest, options);
  return {
    ...(options.id ? { id: options.id } : {}),
    componentName: manifest.componentName,
    materialVersion: manifest.materialVersion,
    props: cloneJson(manifest.defaultProps),
    ...(dataBinding ? { dataBinding } : {}),
    meta: { name: options.metaName ?? manifest.title },
  };
}

export function createLowcodeMaterialPreviewSchema(
  manifest: LowcodeMaterialManifest,
  options: CreateLowcodeMaterialPreviewSchemaOptions = {},
): LowcodePageSchema {
  return createLowcodePageSchema({
    pageId: options.pageId ?? `material-preview-${manifest.componentName}`,
    title: options.title ?? `${manifest.title} 默认预览`,
    pageType: "custom",
    targetPlatforms: ["h5"],
    layout: {
      safeArea: true,
      backgroundColor: options.backgroundColor ?? "#f8fafc",
      maxWidth: options.maxWidth ?? 430,
    },
    nodes: [
      createLowcodeNode(createLowcodeMaterialNodeInput(manifest, {
        ...options,
        id: options.id ?? `preview_${manifest.componentName}`,
      })),
    ],
    dataSources: cloneJson<LowcodeDataSourceConfig[]>([...(options.dataSources ?? [])]),
    actions: cloneJson<LowcodeActionConfig[]>([...(options.actions ?? [])]),
    publishMeta: {
      environment: options.environment ?? "pre",
      operator: options.operator ?? "editor",
    },
  });
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

export function normalizeLowcodeMaterialComponentNames(
  componentNames: readonly string[],
  options: NormalizeLowcodeMaterialComponentNamesOptions = {},
): string[] {
  const availableComponentNames = options.availableComponentNames
    ? new Set(options.availableComponentNames)
    : undefined;
  const limit = Math.max(0, Math.floor(options.limit ?? Number.POSITIVE_INFINITY));
  if (limit === 0) return [];
  const normalized: string[] = [];

  for (const componentName of componentNames) {
    if (typeof componentName !== "string" || componentName.length === 0) continue;
    if (availableComponentNames && !availableComponentNames.has(componentName)) continue;
    if (normalized.includes(componentName)) continue;
    normalized.push(componentName);
    if (normalized.length >= limit) break;
  }

  return normalized;
}

export function parseLowcodeMaterialPreferenceContent(
  content: string | null | undefined,
  options: ParseLowcodeMaterialPreferenceContentOptions = {},
): string[] {
  if (!content) return [];
  try {
    const parsed = JSON.parse(content) as unknown;
    if (!Array.isArray(parsed)) return [];
    return normalizeLowcodeMaterialComponentNames(
      parsed.filter((item): item is string => typeof item === "string"),
      options,
    );
  } catch {
    return [];
  }
}

export function isLowcodeFavoriteMaterial(
  componentNames: readonly string[],
  componentName: string,
): boolean {
  return componentNames.includes(componentName);
}

export function toggleLowcodeFavoriteMaterial(
  componentNames: readonly string[],
  componentName: string,
  options: ToggleLowcodeFavoriteMaterialOptions = {},
): string[] {
  const exists = isLowcodeFavoriteMaterial(componentNames, componentName);
  const next = exists
    ? componentNames.filter((item) => item !== componentName)
    : [componentName, ...componentNames];
  return normalizeLowcodeMaterialComponentNames(next, options);
}

export function recordLowcodeRecentMaterial(
  componentNames: readonly string[],
  componentName: string,
  options: RecordLowcodeRecentMaterialOptions = {},
): string[] {
  return normalizeLowcodeMaterialComponentNames([
    componentName,
    ...componentNames.filter((item) => item !== componentName),
  ], {
    ...options,
    limit: options.limit ?? LOWCODE_EDITOR_RECENT_MATERIAL_DEFAULT_LIMIT,
  });
}

export function createLowcodeMaterialFavoriteMessage(
  material: Pick<LowcodeMaterialManifest, "title">,
  favorited: boolean,
): string {
  return favorited ? `已收藏物料：${material.title}` : `已取消收藏：${material.title}`;
}

export function normalizeLowcodePageMaxWidth(
  value: string | number,
  options: NormalizeLowcodePageMaxWidthOptions = {},
): number | undefined {
  const min = options.min ?? 320;
  const max = options.max ?? 960;
  const maxWidth = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(maxWidth) || maxWidth < min || maxWidth > max) return undefined;
  return Math.round(maxWidth);
}

export function createLowcodePageSettingsForm(
  schema: LowcodePageSchema,
  options: CreateLowcodePageSettingsFormOptions = {},
): LowcodeEditorPageSettingsForm {
  return {
    pageId: schema.pageId,
    title: schema.title,
    description: schema.description ?? "",
    pageType: schema.pageType ?? "custom",
    status: schema.status,
    publishEnvironment: schema.publishMeta.environment,
    backgroundColor: schema.layout.backgroundColor ?? options.defaultBackgroundColor ?? "#f8fafc",
    safeArea: schema.layout.safeArea !== false,
    maxWidth: schema.layout.maxWidth ?? options.defaultMaxWidth ?? 430,
    pageTypeOptions: options.pageTypeOptions ?? LOWCODE_EDITOR_PAGE_TYPE_OPTIONS,
    statusOptions: options.statusOptions ?? LOWCODE_EDITOR_PAGE_STATUS_OPTIONS,
    publishEnvironmentOptions: options.publishEnvironmentOptions ?? LOWCODE_EDITOR_PUBLISH_ENVIRONMENT_OPTIONS,
    backgroundSwatches: options.backgroundSwatches ?? LOWCODE_EDITOR_PAGE_BACKGROUND_SWATCHES,
  };
}

export function updateLowcodePageTitle(state: LowcodeEditorState, title: string): LowcodeEditorState {
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      title,
    },
    "updatePageTitle",
  );
}

export function updateLowcodePageDescription(state: LowcodeEditorState, description: string): LowcodeEditorState {
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      description,
    },
    "updatePageDescription",
  );
}

export function updateLowcodePageStatus(state: LowcodeEditorState, status: LowcodePageStatus): LowcodeEditorState {
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      status,
    },
    "updatePageStatus",
  );
}

export function updateLowcodePageType(state: LowcodeEditorState, pageType: LowcodePageType): LowcodeEditorState {
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      pageType,
    },
    "updatePageType",
  );
}

export function updateLowcodePublishEnvironment(
  state: LowcodeEditorState,
  environment: LowcodeEnvironment,
): LowcodeEditorState {
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      publishMeta: {
        ...state.schema.publishMeta,
        environment,
      },
    },
    "updatePublishEnvironment",
  );
}

export function updateLowcodePageBackgroundColor(
  state: LowcodeEditorState,
  backgroundColor: string,
): LowcodeEditorState {
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      layout: {
        ...state.schema.layout,
        backgroundColor,
      },
    },
    "updatePageBackgroundColor",
  );
}

export function updateLowcodePageSafeArea(state: LowcodeEditorState, safeArea: boolean): LowcodeEditorState {
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      layout: {
        ...state.schema.layout,
        safeArea,
      },
    },
    "updatePageSafeArea",
  );
}

export function updateLowcodePageMaxWidth(
  state: LowcodeEditorState,
  value: string | number,
  options: NormalizeLowcodePageMaxWidthOptions = {},
): LowcodeEditorState {
  const maxWidth = normalizeLowcodePageMaxWidth(value, options);
  if (maxWidth === undefined) return state;
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      layout: {
        ...state.schema.layout,
        maxWidth,
      },
    },
    "updatePageMaxWidth",
  );
}

export function createLowcodeDefaultDataSourceParams(
  dataSourceType: string,
  typeOptions: readonly LowcodeEditorDataSourceTypeOption[] = LOWCODE_EDITOR_DEFAULT_DATA_SOURCE_TYPE_OPTIONS,
): JsonObject {
  const option = typeOptions.find((item) => item.type === dataSourceType);
  return cloneJsonObject(option?.defaultParams ?? {});
}

export function createLowcodeDataSourceConfig(
  dataSourceType = "custom.http",
  options: CreateLowcodeDataSourceConfigOptions = {},
): LowcodeDataSourceConfig {
  const now = options.now ?? new Date();
  const typeOption = (options.typeOptions ?? LOWCODE_EDITOR_DEFAULT_DATA_SOURCE_TYPE_OPTIONS)
    .find((item) => item.type === dataSourceType);
  const params = options.params ?? createLowcodeDefaultDataSourceParams(dataSourceType, options.typeOptions);
  const cache = options.cache ?? typeOption?.defaultCache;
  return {
    id: options.id ?? `ds_${now.getTime().toString(36)}`,
    type: dataSourceType,
    bindTo: options.bindTo ?? typeOption?.defaultBindTo ?? "data",
    params: cloneJsonObject(params),
    ...(cache ? { cache: cloneJsonObject(cache) as LowcodeDataSourceConfig["cache"] } : {}),
  };
}

export function formatLowcodeDataSourceParamsText(dataSource: LowcodeDataSourceConfig): string {
  return JSON.stringify(dataSource.params ?? {}, null, 2);
}

export function formatLowcodeDataSourceRecordLabel(
  record: LowcodeEditorDataSourceResolutionRecord | undefined,
  pendingLabel = "等待解析",
): string {
  if (!record) return pendingLabel;
  if (record.status === "resolved") return record.bindTo ? `已绑定到 ${record.bindTo}` : "已解析";
  if (record.status === "skipped") return "已跳过";
  if (record.status === "error") return "解析失败";
  return String(record.status);
}

export function createLowcodeDataSourceFormItems(
  dataSources: readonly LowcodeDataSourceConfig[] = [],
  options: CreateLowcodeDataSourceFormItemsOptions = {},
): LowcodeEditorDataSourceFormItem[] {
  const typeOptions = options.typeOptions ?? LOWCODE_EDITOR_DEFAULT_DATA_SOURCE_TYPE_OPTIONS;
  const typeLabelMap = new Map(typeOptions.map((item) => [item.type, item.label]));
  const recordMap = new Map((options.records ?? []).map((record) => [record.id, record]));
  return dataSources.map((dataSource) => {
    const record = recordMap.get(dataSource.id);
    return {
      id: dataSource.id,
      type: dataSource.type,
      typeLabel: typeLabelMap.get(dataSource.type) ?? dataSource.type,
      bindTo: dataSource.bindTo ?? "",
      paramsText: formatLowcodeDataSourceParamsText(dataSource),
      status: record?.status ?? "pending",
      statusText: formatLowcodeDataSourceRecordLabel(record, options.pendingLabel),
      statusDescription: record?.error ?? `${dataSource.type} / ${dataSource.bindTo || "未绑定"}`,
      dataSource,
      record,
    };
  });
}

export function upsertLowcodeDataSourceConfigs(
  dataSources: readonly LowcodeDataSourceConfig[],
  nextDataSource: LowcodeDataSourceConfig,
): LowcodeDataSourceConfig[] {
  const index = dataSources.findIndex((dataSource) => dataSource.id === nextDataSource.id);
  if (index < 0) return [...dataSources, nextDataSource];
  return dataSources.map((dataSource, currentIndex) => (currentIndex === index ? nextDataSource : dataSource));
}

export function createLowcodeActionOptions(
  actions: readonly LowcodeActionConfig[] = [],
): LowcodeEditorActionOption[] {
  return actions.map((action) => ({
    id: action.id,
    type: action.type,
    label: `${action.id} / ${action.type}`,
    description: action.params ? JSON.stringify(action.params) : "",
  }));
}

export function createLowcodeDefaultActionParams(
  actionType: string,
  typeOptions: readonly LowcodeEditorActionTypeOption[] = LOWCODE_EDITOR_DEFAULT_ACTION_TYPE_OPTIONS,
): JsonObject {
  const option = typeOptions.find((item) => item.type === actionType);
  return cloneJsonObject(option?.defaultParams ?? {});
}

export function createLowcodeActionConfig(
  actionType = "navigate",
  options: CreateLowcodeActionConfigOptions = {},
): LowcodeActionConfig {
  const now = options.now ?? new Date();
  return {
    id: options.id ?? `act_${now.getTime().toString(36)}`,
    type: actionType,
    params: cloneJsonObject(options.defaultParams ?? createLowcodeDefaultActionParams(actionType, options.typeOptions)),
  };
}

export function formatLowcodeActionParamsText(action: LowcodeActionConfig): string {
  return JSON.stringify(action.params ?? {}, null, 2);
}

export function createLowcodeActionFormItems(
  actions: readonly LowcodeActionConfig[] = [],
  options: CreateLowcodeActionFormItemsOptions = {},
): LowcodeEditorActionFormItem[] {
  const typeOptions = options.typeOptions ?? LOWCODE_EDITOR_DEFAULT_ACTION_TYPE_OPTIONS;
  const typeLabelMap = new Map(typeOptions.map((item) => [item.type, item.label]));
  return actions.map((action) => ({
    id: action.id,
    type: action.type,
    typeLabel: typeLabelMap.get(action.type) ?? action.type,
    paramsText: formatLowcodeActionParamsText(action),
    action,
  }));
}

export function createLowcodeEventBindingItems(
  events: readonly LowcodeMaterialEventManifest[] = [],
  actions: readonly LowcodeActionConfig[] = [],
  nodeEvents: LowcodeNode["events"] = {},
  options: CreateLowcodeEventBindingItemsOptions = {},
): LowcodeEditorEventBindingItem[] {
  const actionOptions = createLowcodeActionOptions(actions);
  const actionMap = new Map(actionOptions.map((action) => [action.id, action]));
  const emptyActionLabel = options.emptyActionLabel ?? "未绑定";
  const missingActionLabelPrefix = options.missingActionLabelPrefix ?? "缺失动作";

  return events.map((event) => {
    const actionId = nodeEvents?.[event.name]?.actionId ?? "";
    const action = actionId ? actionMap.get(actionId) : undefined;
    return {
      name: event.name,
      title: event.title,
      description: event.description,
      actionId,
      actionLabel: action?.label ?? (actionId ? `${missingActionLabelPrefix}：${actionId}` : emptyActionLabel),
      bound: Boolean(actionId),
      missingAction: Boolean(actionId && !action),
      actionOptions,
    };
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

function normalizeLowcodeEditorPermissionDecision(
  action: LowcodeEditorPermissionAction,
  input?: LowcodeEditorPermissionInput,
): LowcodeEditorPermissionDecision {
  if (typeof input === "boolean") return { action, allowed: input };
  if (input) return { action, allowed: input.allowed, reason: input.reason };
  return { action, allowed: true };
}

export function createLowcodeEditorPermissionState(
  options: CreateLowcodeEditorPermissionStateOptions = {},
): LowcodeEditorPermissionState {
  const readonlyReason = options.readonlyReason ?? "当前页面为只读状态，暂不可编辑。";
  const readonlyActions = new Set<LowcodeEditorPermissionAction>(
    options.readonly ? LOWCODE_EDITOR_MUTATING_PERMISSION_ACTIONS : [],
  );

  return LOWCODE_EDITOR_PERMISSION_ACTIONS.reduce((state, action) => {
    const decision = normalizeLowcodeEditorPermissionDecision(action, options.decisions?.[action]);
    state[action] = readonlyActions.has(action)
      ? { action, allowed: false, reason: decision.allowed ? readonlyReason : decision.reason ?? readonlyReason }
      : decision;
    return state;
  }, {} as LowcodeEditorPermissionState);
}

export function isLowcodeEditorActionAllowed(
  state: Partial<LowcodeEditorPermissionState> | undefined,
  action: LowcodeEditorPermissionAction,
): boolean {
  return state?.[action]?.allowed ?? true;
}

export function getLowcodeEditorActionDisabledReason(
  state: Partial<LowcodeEditorPermissionState> | undefined,
  action: LowcodeEditorPermissionAction,
): string | undefined {
  const decision = state?.[action];
  if (!decision || decision.allowed) return undefined;
  return decision.reason ?? "当前操作不可用。";
}

function parseLowcodeEditorDate(value: Date | string | undefined): Date | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatLowcodeEditorCollaborationExpiresIn(expiresAt: Date | undefined, now: Date): string | undefined {
  if (!expiresAt) return undefined;
  const remainingMs = expiresAt.getTime() - now.getTime();
  if (remainingMs <= 0) return "已过期";
  const remainingMinutes = Math.ceil(remainingMs / 60000);
  if (remainingMinutes <= 1) return "1 分钟内到期";
  if (remainingMinutes < 60) return `约 ${remainingMinutes} 分钟后到期`;
  const remainingHours = Math.ceil(remainingMinutes / 60);
  return `约 ${remainingHours} 小时后到期`;
}

function getLowcodeEditorCollaboratorName(holder: LowcodeEditorCollaborator | undefined): string {
  return holder?.name || holder?.id || "其他协作者";
}

export function createLowcodeEditorCollaborationState(
  options: CreateLowcodeEditorCollaborationStateOptions = {},
): LowcodeEditorCollaborationState {
  const now = parseLowcodeEditorDate(options.now) ?? new Date();
  const expiresAtDate = parseLowcodeEditorDate(options.expiresAt);
  const expiresInText = formatLowcodeEditorCollaborationExpiresIn(expiresAtDate, now);
  const lockedAt = options.lockedAt;
  const expiresAt = options.expiresAt;
  const holder = options.holder;
  const holderName = getLowcodeEditorCollaboratorName(holder);
  const status = options.status
    ?? (holder?.id && holder.id === options.currentUserId ? "locked-by-me" : holder ? "locked-by-other" : "unlocked");
  const resolvedStatus: LowcodeEditorCollaborationLockStatus =
    status !== "unlocked" && status !== "readonly" && expiresInText === "已过期" ? "expired" : status;

  if (resolvedStatus === "locked-by-me") {
    return {
      status: resolvedStatus,
      editable: true,
      readonly: false,
      tone: "success",
      title: "我正在编辑",
      description: options.lockReason ?? (expiresInText ? `编辑锁${expiresInText}。` : "当前页面已锁定给你编辑。"),
      holder,
      lockedAt,
      expiresAt,
      expiresInText,
    };
  }

  if (resolvedStatus === "locked-by-other") {
    const readonlyReason = options.readonlyReason ?? `${holderName} 正在编辑，当前仅可查看。`;
    return {
      status: resolvedStatus,
      editable: false,
      readonly: true,
      tone: "warning",
      title: "他人正在编辑",
      description: options.lockReason ?? (expiresInText ? `${readonlyReason}${expiresInText}。` : readonlyReason),
      readonlyReason,
      holder,
      lockedAt,
      expiresAt,
      expiresInText,
    };
  }

  if (resolvedStatus === "readonly") {
    const readonlyReason = options.readonlyReason ?? "当前页面为只读状态，暂不可编辑。";
    return {
      status: resolvedStatus,
      editable: false,
      readonly: true,
      tone: "neutral",
      title: "只读查看",
      description: readonlyReason,
      readonlyReason,
      holder,
      lockedAt,
      expiresAt,
      expiresInText,
    };
  }

  if (resolvedStatus === "expired") {
    const readonlyReason = options.readonlyReason ?? "编辑锁已过期，请刷新或重新获取编辑权限。";
    return {
      status: resolvedStatus,
      editable: false,
      readonly: true,
      tone: "danger",
      title: "锁已过期",
      description: readonlyReason,
      readonlyReason,
      holder,
      lockedAt,
      expiresAt,
      expiresInText,
    };
  }

  return {
    status: "unlocked",
    editable: true,
    readonly: false,
    tone: "success",
    title: "可编辑",
    description: "当前页面未被其他人锁定。",
    holder,
    lockedAt,
    expiresAt,
    expiresInText,
  };
}

export function createLowcodeEditorCollaborationPermissionOptions(
  state: LowcodeEditorCollaborationState,
): Pick<CreateLowcodeEditorPermissionStateOptions, "readonly" | "readonlyReason"> {
  return {
    readonly: state.readonly,
    readonlyReason: state.readonlyReason ?? state.description,
  };
}

export function createLowcodeEditorApprovalState(
  options: CreateLowcodeEditorApprovalStateOptions = {},
): LowcodeEditorApprovalState {
  const status = options.status ?? "none";
  const common = {
    status,
    submitter: options.submitter,
    reviewer: options.reviewer,
    submittedAt: options.submittedAt,
    reviewedAt: options.reviewedAt,
    comment: options.comment,
  };

  if (status === "draft") {
    const publishDisabledReason = options.reason ?? "页面需要先提交审批，通过后才能发布。";
    return {
      ...common,
      editable: true,
      readonly: false,
      submittable: true,
      publishable: false,
      tone: "warning",
      title: "待提交审批",
      description: publishDisabledReason,
      publishDisabledReason,
    };
  }

  if (status === "pending") {
    const readonlyReason = options.reason ?? "页面审批中，暂不可编辑或发布。";
    return {
      ...common,
      editable: false,
      readonly: true,
      submittable: false,
      publishable: false,
      tone: "warning",
      title: "审批中",
      description: readonlyReason,
      readonlyReason,
      submitDisabledReason: "审批中不可重复提交。",
      publishDisabledReason: readonlyReason,
    };
  }

  if (status === "approved") {
    return {
      ...common,
      editable: true,
      readonly: false,
      submittable: false,
      publishable: true,
      tone: "success",
      title: "审批通过",
      description: options.reason ?? "审批已通过，可以发布当前版本。",
      submitDisabledReason: "当前版本已审批通过。",
    };
  }

  if (status === "rejected") {
    const publishDisabledReason = options.reason ?? "审批已驳回，请修改后重新提交审批。";
    return {
      ...common,
      editable: true,
      readonly: false,
      submittable: true,
      publishable: false,
      tone: "danger",
      title: "审批驳回",
      description: publishDisabledReason,
      publishDisabledReason,
    };
  }

  if (status === "published") {
    const publishDisabledReason = options.reason ?? "当前版本已发布，无需重复发布。";
    return {
      ...common,
      editable: true,
      readonly: false,
      submittable: false,
      publishable: false,
      tone: "success",
      title: "已发布",
      description: publishDisabledReason,
      submitDisabledReason: "当前版本已发布。",
      publishDisabledReason,
    };
  }

  return {
    ...common,
    status: "none",
    editable: true,
    readonly: false,
    submittable: false,
    publishable: true,
    tone: "neutral",
    title: "无需审批",
    description: "当前页面未启用审批流程。",
    submitDisabledReason: "当前页面未启用审批流程。",
  };
}

export function createLowcodeEditorApprovalPermissionOptions(
  state: LowcodeEditorApprovalState,
): CreateLowcodeEditorPermissionStateOptions {
  const approvalFlowActionDisabledReason = state.status === "pending" ? undefined : "仅审批中页面可执行该操作。";
  const decisions: CreateLowcodeEditorPermissionStateOptions["decisions"] = {
    "approval.submit": state.submittable ? true : { allowed: false, reason: state.submitDisabledReason ?? state.description },
    "approval.cancel": state.status === "pending" ? true : { allowed: false, reason: approvalFlowActionDisabledReason ?? state.description },
    "approval.review": state.status === "pending" ? true : { allowed: false, reason: approvalFlowActionDisabledReason ?? state.description },
    "publish.submit": state.publishable ? true : { allowed: false, reason: state.publishDisabledReason ?? state.description },
  };

  return {
    readonly: state.readonly,
    readonlyReason: state.readonlyReason ?? state.description,
    decisions,
  };
}

export function createLowcodeNodeOperationItems(
  options: CreateLowcodeNodeOperationItemsOptions = {},
): LowcodeEditorNodeOperationItem[] {
  const canInsert = options.canInsert ?? true;
  return [
    {
      action: "rename",
      label: "重命名节点",
      disabled: !(options.canRename ?? true),
    },
    {
      action: "insertBefore",
      label: "前方插入",
      disabled: !canInsert,
    },
    {
      action: "insertAfter",
      label: "后方插入",
      disabled: !canInsert,
    },
    {
      action: "addInside",
      label: "加入容器",
      disabled: !(options.canAddInside ?? false),
    },
    {
      action: "moveUp",
      label: "上移节点",
      disabled: !(options.canMoveUp ?? false),
    },
    {
      action: "moveDown",
      label: "下移节点",
      disabled: !(options.canMoveDown ?? false),
    },
    {
      action: "copy",
      label: "复制节点",
      shortcut: "⌘/Ctrl C",
      disabled: !(options.canCopy ?? true),
    },
    {
      action: "paste",
      label: "粘贴节点",
      shortcut: "⌘/Ctrl V",
      disabled: !(options.canPaste ?? false),
    },
    {
      action: "duplicate",
      label: "创建副本",
      shortcut: "⌘/Ctrl D",
      disabled: !(options.canDuplicate ?? true),
    },
    {
      action: "delete",
      label: "删除节点",
      shortcut: "Delete",
      danger: true,
      disabled: !(options.canDelete ?? true),
    },
  ];
}

export function resolveLowcodeNodeShortcutAction(
  event: LowcodeEditorKeyboardShortcutLike,
  options: ResolveLowcodeNodeShortcutActionOptions = {},
): LowcodeEditorNodeShortcutAction | undefined {
  const key = event.key.toLowerCase();
  const hasSelectedNode = options.hasSelectedNode ?? false;
  const hasCommandModifier = Boolean(event.metaKey || event.ctrlKey);

  if ((event.key === "Delete" || event.key === "Backspace") && hasSelectedNode) return "delete";
  if (!hasCommandModifier) return undefined;
  if (key === "c" && hasSelectedNode) return "copy";
  if (key === "v" && (options.canPaste ?? false)) return "paste";
  if (key === "d" && hasSelectedNode) return "duplicate";
  if (key === "z") return event.shiftKey ? "redo" : "undo";
  if (key === "y" && event.ctrlKey) return "redo";
  return undefined;
}

export function createLowcodeNodeOperationMessage(
  action: LowcodeEditorNodeOperationAction | LowcodeEditorNodeShortcutAction,
  options: CreateLowcodeNodeOperationMessageOptions = {},
): string {
  const nodeTitle = options.nodeTitle ?? "当前节点";
  const materialTitle = options.materialTitle ?? "选中物料";
  switch (action) {
    case "rename":
      return `已进入重命名：${nodeTitle}`;
    case "insertBefore":
      return `已在前方插入物料：${materialTitle}`;
    case "insertAfter":
      return `已在后方插入物料：${materialTitle}`;
    case "addInside":
      return `已加入容器：${materialTitle}`;
    case "moveUp":
      return `已上移节点：${nodeTitle}`;
    case "moveDown":
      return `已下移节点：${nodeTitle}`;
    case "copy":
      return `已复制节点：${nodeTitle}`;
    case "paste":
      return "已粘贴节点";
    case "duplicate":
      return `已创建副本：${nodeTitle}`;
    case "delete":
      return `已删除节点：${nodeTitle}`;
    case "undo":
      return "已撤销上一步操作";
    case "redo":
      return "已重做上一步操作";
  }
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

export function bindLowcodeNodeEvent(
  state: LowcodeEditorState,
  nodeId: string,
  eventName: string,
  actionId: string | undefined,
): LowcodeEditorState {
  return updateNode(
    state,
    nodeId,
    (node) => {
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
    },
    "bindNodeEvent",
  );
}

export function addLowcodeDataSource(
  state: LowcodeEditorState,
  dataSourceType = "custom.http",
  options: CreateLowcodeDataSourceConfigOptions = {},
): LowcodeEditorState {
  const nextDataSource = createLowcodeDataSourceConfig(dataSourceType, options);
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      dataSources: [...(state.schema.dataSources ?? []), nextDataSource],
    },
    "addDataSource",
  );
}

export function updateLowcodeDataSource(
  state: LowcodeEditorState,
  index: number,
  patch: Partial<LowcodeDataSourceConfig>,
): LowcodeEditorState {
  const dataSources = [...(state.schema.dataSources ?? [])];
  const current = dataSources[index];
  if (!current) return state;
  dataSources[index] = {
    ...current,
    ...patch,
  };
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      dataSources,
    },
    "updateDataSource",
  );
}

export function removeLowcodeDataSource(
  state: LowcodeEditorState,
  index: number,
): LowcodeEditorState {
  const dataSources = [...(state.schema.dataSources ?? [])];
  const [removed] = dataSources.splice(index, 1);
  if (!removed) return state;
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      dataSources,
    },
    "removeDataSource",
  );
}

export function addLowcodeAction(
  state: LowcodeEditorState,
  actionType = "navigate",
  options: CreateLowcodeActionConfigOptions = {},
): LowcodeEditorState {
  const nextAction = createLowcodeActionConfig(actionType, options);
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      actions: [...(state.schema.actions ?? []), nextAction],
    },
    "addAction",
  );
}

export function updateLowcodeAction(
  state: LowcodeEditorState,
  index: number,
  patch: Partial<LowcodeActionConfig>,
): LowcodeEditorState {
  const actions = [...(state.schema.actions ?? [])];
  const current = actions[index];
  if (!current) return state;
  actions[index] = {
    ...current,
    ...patch,
  };
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      actions,
    },
    "updateAction",
  );
}

export function renameLowcodeAction(
  state: LowcodeEditorState,
  index: number,
  nextActionId: string,
): LowcodeEditorState {
  const actions = [...(state.schema.actions ?? [])];
  const current = actions[index];
  if (!current) return state;
  actions[index] = {
    ...current,
    id: nextActionId,
  };
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      actions,
      nodes: renameLowcodeActionRefsInNodes(state.schema.nodes, current.id, nextActionId),
    },
    "updateActionId",
  );
}

export function setLowcodeActionType(
  state: LowcodeEditorState,
  index: number,
  actionType: string,
  options: Pick<CreateLowcodeActionConfigOptions, "defaultParams" | "typeOptions"> = {},
): LowcodeEditorState {
  const actions = [...(state.schema.actions ?? [])];
  const current = actions[index];
  if (!current) return state;
  actions[index] = {
    ...current,
    type: actionType,
    params: cloneJsonObject(options.defaultParams ?? createLowcodeDefaultActionParams(actionType, options.typeOptions)),
  };
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      actions,
    },
    "updateActionType",
  );
}

export function removeLowcodeAction(
  state: LowcodeEditorState,
  index: number,
): LowcodeEditorState {
  const actions = [...(state.schema.actions ?? [])];
  const [removed] = actions.splice(index, 1);
  if (!removed) return state;
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      actions,
      nodes: removeLowcodeActionRefsFromNodes(state.schema.nodes, removed.id),
    },
    "removeAction",
  );
}

export function removeLowcodeActionRefsFromNodes(nodes: readonly LowcodeNode[], actionId: string): LowcodeNode[] {
  return nodes.map((node) => {
    const events = Object.fromEntries(
      Object.entries(node.events ?? {}).filter(([, ref]) => ref.actionId !== actionId),
    );
    return {
      ...node,
      events: Object.keys(events).length ? events : undefined,
      children: node.children?.length ? removeLowcodeActionRefsFromNodes(node.children, actionId) : node.children,
    };
  });
}

export function renameLowcodeActionRefsInNodes(
  nodes: readonly LowcodeNode[],
  previousActionId: string,
  nextActionId: string,
): LowcodeNode[] {
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
      children: node.children?.length ? renameLowcodeActionRefsInNodes(node.children, previousActionId, nextActionId) : node.children,
    };
  });
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

export function toggleLowcodeNodeSelection(
  selectedNodeIds: readonly string[],
  nodeId: string,
): string[] {
  const selected = new Set(selectedNodeIds);
  if (selected.has(nodeId)) {
    selected.delete(nodeId);
  } else {
    selected.add(nodeId);
  }
  if (!selected.size) selected.add(nodeId);
  return [...selected];
}

export function pruneLowcodeNodeSelection(
  selectedNodeIds: readonly string[],
  availableNodeIds: Iterable<string>,
  options: PruneLowcodeNodeSelectionOptions = {},
): string[] {
  const available = new Set(availableNodeIds);
  const nextSelected = selectedNodeIds.filter((nodeId) => available.has(nodeId));
  if (!nextSelected.length && options.activeNodeId && available.has(options.activeNodeId)) {
    nextSelected.push(options.activeNodeId);
  }
  return nextSelected;
}

export function pickLowcodeSelectedOutlineRows<T extends Pick<LowcodeEditorOutlineRow, "node">>(
  rows: readonly T[],
  selectedNodeIds: readonly string[],
): T[] {
  const selected = new Set(selectedNodeIds);
  return rows.filter((row) => selected.has(row.node.id));
}

export function hasLowcodeSameParentSelection<T extends Pick<LowcodeEditorOutlineRow, "parentId">>(
  rows: readonly T[],
): boolean {
  if (rows.length < 2) return true;
  const parentId = rows[0]?.parentId;
  return rows.every((row) => row.parentId === parentId);
}

export function createLowcodeNodeSelectionSummary<T extends Pick<LowcodeEditorOutlineRow, "parentId">>(
  rows: readonly T[],
): string {
  const count = rows.length;
  if (count <= 1) return "";
  return hasLowcodeSameParentSelection(rows)
    ? `已多选 ${count} 个同层节点，可成组拖拽`
    : `已多选 ${count} 个节点，跨层级时拖动单节点`;
}

export function createLowcodeNodeSelectionModel<T extends Pick<LowcodeEditorOutlineRow, "node" | "parentId">>(
  rows: readonly T[],
  selectedNodeIds: readonly string[],
): LowcodeEditorNodeSelectionModel<T> {
  const selectedRows = pickLowcodeSelectedOutlineRows(rows, selectedNodeIds);
  const sameParent = hasLowcodeSameParentSelection(selectedRows);
  return {
    selectedNodeIds: selectedRows.map((row) => row.node.id),
    rows: selectedRows,
    count: selectedRows.length,
    sameParent,
    summary: createLowcodeNodeSelectionSummary(selectedRows),
  };
}

export function isLowcodeNodeSelected(
  selectedNodeIds: readonly string[],
  nodeId: string,
): boolean {
  return selectedNodeIds.includes(nodeId);
}

export function canLowcodeDragSelectedGroup<T extends Pick<LowcodeEditorOutlineRow, "node" | "parentId">>(
  rows: readonly T[],
  selectedNodeIds: readonly string[],
  nodeId: string,
): boolean {
  const selection = createLowcodeNodeSelectionModel(rows, selectedNodeIds);
  return isLowcodeNodeSelected(selection.selectedNodeIds, nodeId) && selection.count > 1 && selection.sameParent;
}

export function getLowcodeSelectedGroupNodeIdsForDrag<
  T extends Pick<LowcodeEditorOutlineRow, "node" | "parentId" | "index">,
>(
  rows: readonly T[],
  selectedNodeIds: readonly string[],
  seedNodeId: string,
): string[] {
  const selection = createLowcodeNodeSelectionModel(rows, selectedNodeIds);
  if (!isLowcodeNodeSelected(selection.selectedNodeIds, seedNodeId) || selection.count < 2 || !selection.sameParent) {
    return [seedNodeId];
  }
  return [...selection.rows]
    .sort((a, b) => a.index - b.index)
    .map((row) => row.node.id);
}

export function resolveLowcodeCanvasDropPlacement(
  point: Pick<LowcodeEditorCanvasPoint, "clientY">,
  targetNode: Pick<LowcodeNode, "componentName">,
  targetRect: Pick<LowcodeEditorCanvasRect, "top" | "height">,
  options: ResolveLowcodeCanvasDropPlacementOptions = {},
): Exclude<LowcodeEditorCanvasDropPlacement, "append"> {
  const ratio = targetRect.height > 0 ? (point.clientY - targetRect.top) / targetRect.height : 0.5;
  const insideComponentNames = new Set(options.insideComponentNames ?? DEFAULT_CANVAS_INSIDE_COMPONENT_NAMES);
  const insideMinRatio = options.insideMinRatio ?? 0.28;
  const insideMaxRatio = options.insideMaxRatio ?? 0.72;

  if (
    insideComponentNames.has(targetNode.componentName) &&
    ratio > insideMinRatio &&
    ratio < insideMaxRatio
  ) {
    return "inside";
  }

  return ratio < 0.5 ? "before" : "after";
}

export function createLowcodeCanvasDropHintStyle(
  frame: LowcodeEditorCanvasFrameMetrics,
  targetRect: LowcodeEditorCanvasRect,
  placement: Exclude<LowcodeEditorCanvasDropPlacement, "append">,
): LowcodeEditorCanvasDropHintStyle {
  const top = targetRect.top - frame.top + frame.scrollTop;
  const left = targetRect.left - frame.left + frame.scrollLeft;
  if (placement === "inside") {
    return {
      top: `${top}px`,
      left: `${left}px`,
      width: `${targetRect.width}px`,
      height: `${targetRect.height}px`,
    };
  }

  return {
    top: `${top + (placement === "after" ? targetRect.height : 0)}px`,
    left: `${left}px`,
    width: `${targetRect.width}px`,
  };
}

export function createLowcodeCanvasSnapGuides(
  frame: LowcodeEditorCanvasFrameMetrics,
  targetRect: LowcodeEditorCanvasRect,
  placement: Exclude<LowcodeEditorCanvasDropPlacement, "append">,
): LowcodeEditorCanvasSnapGuide[] {
  const top = targetRect.top - frame.top + frame.scrollTop;
  const left = targetRect.left - frame.left + frame.scrollLeft;
  const frameHeight = Math.max(frame.scrollHeight, frame.clientHeight);
  const targetCenterX = left + targetRect.width / 2;
  const targetCenterY = top + targetRect.height / 2;

  if (placement === "inside") {
    return [
      {
        axis: "y",
        label: "容器中心",
        style: {
          top: `${targetCenterY}px`,
          left: "0px",
          width: `${frame.clientWidth}px`,
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

  const edgeTop = top + (placement === "after" ? targetRect.height : 0);
  return [
    {
      axis: "y",
      label: placement === "before" ? "吸附到上边缘" : "吸附到下边缘",
      style: {
        top: `${edgeTop}px`,
        left: "0px",
        width: `${frame.clientWidth}px`,
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

export function createLowcodeCanvasAppendDropHint(
  source: LowcodeEditorCanvasDragSource,
  targetTitle = "页面末尾",
): LowcodeEditorCanvasDropHint {
  return {
    source,
    placement: "append",
    targetTitle,
    style: {},
    guides: [],
  };
}

export function createLowcodeCanvasTargetDropHint(
  options: CreateLowcodeCanvasTargetDropHintOptions,
): LowcodeEditorCanvasDropHint {
  return {
    source: options.source,
    placement: options.placement,
    targetNodeId: options.targetNodeId,
    targetTitle: options.targetTitle,
    style: createLowcodeCanvasDropHintStyle(options.frame, options.targetRect, options.placement),
    guides: createLowcodeCanvasSnapGuides(options.frame, options.targetRect, options.placement),
  };
}

export function isLowcodeInvalidNodeDropTarget(
  nodes: readonly LowcodeNode[],
  draggedNodeId: string | undefined,
  targetNodeId: string | undefined,
): boolean {
  if (!draggedNodeId || !targetNodeId) return false;
  if (draggedNodeId === targetNodeId) return true;
  const draggedNode = findLowcodeNodeById(nodes, draggedNodeId);
  return lowcodeNodeContains(draggedNode, targetNodeId);
}

export function getLowcodeCanvasAdjacentDropIndex(
  targetIndex: number,
  placement: Extract<LowcodeEditorCanvasDropPlacement, "before" | "after">,
): number {
  return placement === "before" ? targetIndex : targetIndex + 1;
}

export function createLowcodeCanvasDropTarget<T extends Pick<LowcodeEditorOutlineRow, "node" | "parentId" | "index">>(
  rows: readonly T[],
  hint: Pick<LowcodeEditorCanvasDropHint, "placement" | "targetNodeId">,
  rootNodeCount: number,
): LowcodeEditorCanvasDropTarget<T> | undefined {
  if (!hint.targetNodeId || hint.placement === "append") {
    return {
      parentId: undefined,
      index: rootNodeCount,
    };
  }

  const targetRow = rows.find((row) => row.node.id === hint.targetNodeId);
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
    index: getLowcodeCanvasAdjacentDropIndex(targetRow.index, hint.placement),
    targetRow,
  };
}

export function getLowcodeAdjustedCanvasMoveIndex<
  T extends Pick<LowcodeEditorOutlineRow, "parentId" | "index">,
>(
  sourceRow: T,
  targetRow: T,
  placement: Extract<LowcodeEditorCanvasDropPlacement, "before" | "after">,
): number {
  let index = getLowcodeCanvasAdjacentDropIndex(targetRow.index, placement);
  if (sourceRow.parentId === targetRow.parentId && sourceRow.index < index) {
    index -= 1;
  }
  return index;
}

export function createLowcodeCanvasNodeMoveTarget<
  T extends Pick<LowcodeEditorOutlineRow, "node" | "parentId" | "index">,
>(
  rows: readonly T[],
  hint: Pick<LowcodeEditorCanvasDropHint, "placement" | "targetNodeId">,
  sourceNodeId: string,
  rootNodeCount: number,
): LowcodeEditorCanvasDropTarget<T> | undefined {
  const sourceRow = rows.find((row) => row.node.id === sourceNodeId);
  if (!sourceRow) return undefined;
  const target = createLowcodeCanvasDropTarget(rows, hint, rootNodeCount);
  if (!target) return undefined;
  if (!target.targetRow || hint.placement === "append" || hint.placement === "inside") return target;
  if (target.targetRow.node.id === sourceNodeId) return undefined;
  return {
    ...target,
    index: getLowcodeAdjustedCanvasMoveIndex(sourceRow, target.targetRow, hint.placement),
  };
}

export function createLowcodeCanvasGroupMoveTarget<
  T extends Pick<LowcodeEditorOutlineRow, "node" | "parentId" | "index">,
>(
  rows: readonly T[],
  hint: Pick<LowcodeEditorCanvasDropHint, "placement" | "targetNodeId">,
  sourceNodeIds: readonly string[],
  rootNodeCount: number,
): LowcodeEditorCanvasDropTarget<T> | undefined {
  if (sourceNodeIds.length < 2) return undefined;
  const selected = new Set(sourceNodeIds);
  const sourceRows = rows.filter((row) => selected.has(row.node.id));
  if (sourceRows.length !== sourceNodeIds.length) return undefined;
  const sourceParentId = sourceRows[0]?.parentId;
  if (!sourceRows.every((row) => row.parentId === sourceParentId)) return undefined;

  const target = createLowcodeCanvasDropTarget(rows, hint, rootNodeCount);
  if (!target) return undefined;
  if (target.targetRow && selected.has(target.targetRow.node.id)) return target;

  const removedBeforeTarget = sourceParentId === target.parentId
    ? sourceRows.filter((row) => row.index < target.index).length
    : 0;

  return {
    ...target,
    index: Math.max(0, target.index - removedBeforeTarget),
  };
}

export function insertLowcodeCanvasNodeByHint<
  T extends Pick<LowcodeEditorOutlineRow, "node" | "parentId" | "index">,
>(
  state: LowcodeEditorState,
  rows: readonly T[],
  hint: Pick<LowcodeEditorCanvasDropHint, "placement" | "targetNodeId">,
  node: NodeInput,
): LowcodeEditorCanvasOperationResult {
  const target = createLowcodeCanvasDropTarget(rows, hint, state.schema.nodes.length);
  const nextState = target
    ? insertNode(state, node, { parentId: target.parentId, index: target.index, select: true })
    : appendNode(state, node);

  return {
    state: nextState,
    handled: true,
    changed: nextState !== state,
  };
}

export function moveLowcodeCanvasNodeByHint<
  T extends Pick<LowcodeEditorOutlineRow, "node" | "parentId" | "index">,
>(
  state: LowcodeEditorState,
  rows: readonly T[],
  hint: Pick<LowcodeEditorCanvasDropHint, "placement" | "targetNodeId">,
  nodeId: string,
): LowcodeEditorCanvasOperationResult {
  const target = createLowcodeCanvasNodeMoveTarget(rows, hint, nodeId, state.schema.nodes.length);
  if (!target) return createNoopCanvasOperationResult(state, false);

  const nextState = moveNodeById(state, {
    nodeId,
    targetParentId: target.parentId,
    index: target.index,
  });

  return {
    state: nextState,
    handled: true,
    changed: nextState !== state,
  };
}

export function moveLowcodeCanvasNodeGroupByHint<
  T extends Pick<LowcodeEditorOutlineRow, "node" | "parentId" | "index">,
>(
  state: LowcodeEditorState,
  rows: readonly T[],
  hint: Pick<LowcodeEditorCanvasDropHint, "placement" | "targetNodeId">,
  nodeIds: readonly string[],
): LowcodeEditorCanvasOperationResult {
  if (nodeIds.length < 2) return createNoopCanvasOperationResult(state, false);

  const sourceRows = nodeIds.map((nodeId) => rows.find((row) => row.node.id === nodeId));
  if (sourceRows.some((row): row is undefined => row === undefined)) {
    return createNoopCanvasOperationResult(state, false);
  }

  const resolvedSourceRows = sourceRows as T[];
  const sourceParentId = resolvedSourceRows[0]?.parentId;
  if (!resolvedSourceRows.every((row) => row.parentId === sourceParentId)) {
    return createNoopCanvasOperationResult(state, false);
  }

  const target = createLowcodeCanvasGroupMoveTarget(rows, hint, nodeIds, state.schema.nodes.length);
  if (!target) return createNoopCanvasOperationResult(state, false);

  const selected = new Set(nodeIds);
  if (target.targetRow && selected.has(target.targetRow.node.id)) {
    return createNoopCanvasOperationResult(state, true);
  }
  const targetParentId = target.parentId;
  if (targetParentId) {
    const targetIsSelectedOrDescendant = selected.has(targetParentId) ||
      nodeIds.some((nodeId) => isDescendant(state.schema.nodes, nodeId, targetParentId));
    if (targetIsSelectedOrDescendant) {
      return createNoopCanvasOperationResult(state, true);
    }
  }

  const sourceSiblings = getSiblingNodesByParent(state.schema.nodes, sourceParentId);
  if (!sourceSiblings) return createNoopCanvasOperationResult(state, false);

  const movingNodes = sourceSiblings.filter((node) => selected.has(node.id));
  if (movingNodes.length !== nodeIds.length) return createNoopCanvasOperationResult(state, false);

  const remainingSourceSiblings = sourceSiblings.filter((node) => !selected.has(node.id));
  let nextNodes = replaceSiblingNodesByParent(state.schema.nodes, sourceParentId, remainingSourceSiblings);
  if (!nextNodes) return createNoopCanvasOperationResult(state, false);

  const targetSiblings = getSiblingNodesByParent(nextNodes, target.parentId);
  if (!targetSiblings) return createNoopCanvasOperationResult(state, false);

  const nextTargetSiblings = [...targetSiblings];
  nextTargetSiblings.splice(clampIndex(target.index, nextTargetSiblings.length), 0, ...movingNodes);
  nextNodes = replaceSiblingNodesByParent(nextNodes, target.parentId, nextTargetSiblings);
  if (!nextNodes) return createNoopCanvasOperationResult(state, false);

  const nextState = commitSchemaChange(
    state,
    {
      ...state.schema,
      nodes: nextNodes,
    },
    "moveCanvasNodeGroup",
    nodeIds[0],
  );

  return {
    state: nextState,
    handled: true,
    changed: true,
  };
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

export function getLowcodePropEditorControl(propSchema: LowcodePropSchema): LowcodeEditorPropControl {
  if (isLowcodeListPropEditor(propSchema)) return "list";
  if (propSchema.type === "array" || propSchema.type === "object" || propSchema.setter === "dataSourceSelector") return "json";
  if (propSchema.setter === "textarea" || propSchema.setter === "richText") return "textarea";
  if (propSchema.setter === "switch" || propSchema.type === "boolean") return "switch";
  if (propSchema.setter === "select") return "select";
  if (propSchema.setter === "color") return "color";
  if (propSchema.type === "number") return "number";
  return "text";
}

export function isLowcodeListPropEditor(propSchema: LowcodePropSchema): boolean {
  return propSchema.type === "array" && propSchema.setter === "textarea";
}

export function isLowcodeStructuredPropEditor(propSchema: LowcodePropSchema): boolean {
  return getLowcodePropEditorControl(propSchema) === "json";
}

export function createLowcodeListEditorFields(
  propName: string,
  options: CreateLowcodeListEditorFieldsOptions = {},
): LowcodeEditorListField[] {
  const fields = new Set(getLowcodeDefaultListFieldNames(propName, options.componentName, options.defaultFieldNames));
  for (const item of options.items ?? []) {
    if (!isPlainObject(item)) continue;
    Object.keys(item).forEach((key) => fields.add(key));
  }
  const commonFields = {
    ...LOWCODE_EDITOR_COMMON_LIST_FIELDS,
    ...(options.commonFields ?? {}),
  };
  return [...fields].map((name) => ({ ...(commonFields[name] ?? { name, label: name, placeholder: name }) }));
}

export function isLowcodeListImageField(field: string | Pick<LowcodeEditorListField, "name">): boolean {
  const fieldName = typeof field === "string" ? field : field.name;
  return /(^|[A-Z])imageUrl$/.test(fieldName) || fieldName === "coverImageUrl" || fieldName === "logoImageUrl";
}

export function createLowcodeDefaultListItem(
  propName: string,
  options: CreateLowcodeDefaultListItemOptions = {},
): JsonObject {
  const id = options.id ?? `${propName}_${(options.now ?? new Date()).getTime().toString(36)}`;
  if (propName === "rules") {
    return { title: "新规则", content: "请输入规则内容" };
  }
  if (propName === "coupons") {
    return { id, title: "满 199 减 30", thresholdText: "全场可用", valueText: "¥30", expireText: "领取后 7 天有效" };
  }
  if (propName === "items" && options.componentName === "FloorAnchorNav") {
    return { id, title: "新楼层", targetId: options.targetNodeId ?? "" };
  }
  if (propName === "items" && options.componentName === "NavGrid") {
    return { id, title: "新导航", subtitle: "请输入说明" };
  }
  if (propName === "items" && options.componentName === "ImageCardGrid") {
    return { id, title: "新会场", subtitle: "请输入说明", badgeText: "推荐", imageUrl: "", linkUrl: "" };
  }
  if (propName === "items" && options.componentName === "StoreExpertSection") {
    return { id, typeText: "推荐", title: "新推荐项", subtitle: "请输入推荐说明", metricText: "", desc: "", imageUrl: "", buttonText: "查看" };
  }
  return { id, title: "新项目", subtitle: "请输入说明" };
}

export function toLowcodePropInputText(value: JsonValue | undefined): string {
  return typeof value === "string" ? value : value == null ? "" : JSON.stringify(value, null, 2);
}

export function toLowcodePropInputBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return !["", "0", "false", "off", "no"].includes(normalized);
  }
  return Boolean(value);
}

function normalizeLowcodeColorText(value: unknown): string {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

export function isLowcodeHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value.trim());
}

export function normalizeLowcodeColorInputValue(propSchema: LowcodePropSchema, value: unknown): string {
  const nextValue = normalizeLowcodeColorText(value);
  if (nextValue) return nextValue;
  return typeof propSchema.defaultValue === "string" ? propSchema.defaultValue : "transparent";
}

export function createLowcodeColorSwatches(propSchema: LowcodePropSchema, fallbackSwatches = LOWCODE_EDITOR_DEFAULT_COLOR_SWATCHES): string[] {
  const swatches = [
    ...(propSchema.swatches ?? []),
    ...(typeof propSchema.defaultValue === "string" ? [propSchema.defaultValue] : []),
    ...fallbackSwatches,
  ];
  const normalized = new Map<string, string>();
  for (const swatch of swatches) {
    const color = normalizeLowcodeColorText(swatch);
    if (!color) continue;
    const key = color.toLowerCase();
    if (!normalized.has(key)) normalized.set(key, color);
  }
  return [...normalized.values()];
}

export function getLowcodeNativeColorInputValue(propSchema: LowcodePropSchema, value: unknown): string {
  const currentValue = normalizeLowcodeColorText(value);
  if (isLowcodeHexColor(currentValue)) return currentValue.toLowerCase();
  const defaultValue = typeof propSchema.defaultValue === "string" ? propSchema.defaultValue : "";
  if (isLowcodeHexColor(defaultValue)) return defaultValue.toLowerCase();
  const swatch = createLowcodeColorSwatches(propSchema).find((item) => isLowcodeHexColor(item));
  return swatch?.toLowerCase() ?? "#111827";
}

export function normalizeLowcodePropInputValue(propSchema: LowcodePropSchema, value: unknown): JsonValue {
  if (propSchema.type === "number") {
    const fallback = typeof propSchema.defaultValue === "number" ? propSchema.defaultValue : 0;
    const rawValue = Number(value);
    const min = typeof propSchema.min === "number" ? propSchema.min : Number.NEGATIVE_INFINITY;
    const max = typeof propSchema.max === "number" ? propSchema.max : Number.POSITIVE_INFINITY;
    const nextValue = Number.isFinite(rawValue) ? rawValue : fallback;
    return Math.min(max, Math.max(min, nextValue));
  }
  if (propSchema.type === "boolean") {
    return toLowcodePropInputBoolean(value);
  }
  if (propSchema.type === "array" || propSchema.type === "object") {
    if (typeof value !== "string") return value as JsonValue;
    try {
      return JSON.parse(value) as JsonValue;
    } catch {
      return value;
    }
  }
  if (propSchema.setter === "color") {
    return normalizeLowcodeColorInputValue(propSchema, value);
  }
  return String(value);
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

export function formatLowcodeReleaseKindLabel(
  kind: LowcodeEditorReleaseKind,
  options: LowcodeEditorReleaseKindLabelOptions = {},
): string {
  const labels: Record<string, string | undefined> = {
    draft: "草稿",
    preview: "预览",
    published: "已发布",
    ...options.labels,
  };
  return labels[kind] ?? kind;
}

export function formatLowcodeReleaseTime(
  value: string,
  options: FormatLowcodeReleaseTimeOptions = {},
): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return options.fallbackText ?? "时间未知";
  return new Intl.DateTimeFormat(options.locale ?? "zh-CN", options.formatOptions ?? {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function createLowcodeReleaseListItem<TRelease extends LowcodeEditorReleaseRecord>(
  release: TRelease,
  options: CreateLowcodeReleaseListItemOptions = {},
): LowcodeEditorReleaseListItem<TRelease> {
  const kindLabel = formatLowcodeReleaseKindLabel(release.kind, options);
  const createdAtText = formatLowcodeReleaseTime(release.createdAt, options);
  const note = release.note?.trim() ?? "";
  const searchText = [
    release.title,
    release.pageId,
    release.pageVersion,
    release.kind,
    kindLabel,
    note,
    createdAtText,
  ].join(" ").toLowerCase();

  return {
    id: release.id,
    kind: release.kind,
    kindLabel,
    pageVersion: release.pageVersion,
    title: release.title,
    note,
    createdAt: release.createdAt,
    createdAtText,
    selected: options.selectedReleaseId === release.id,
    searchText,
    release,
  };
}

export function createLowcodeReleaseListItems<TRelease extends LowcodeEditorReleaseRecord>(
  releases: readonly TRelease[],
  options: CreateLowcodeReleaseListItemsOptions = {},
): LowcodeEditorReleaseListItem<TRelease>[] {
  const keyword = options.keyword?.trim().toLowerCase() ?? "";
  return releases
    .map((release) => createLowcodeReleaseListItem(release, options))
    .filter((item) => !keyword || item.searchText.includes(keyword));
}

export function summarizeLowcodeReleaseList(
  total: number,
  visible: number,
  keyword?: string,
): LowcodeEditorReleaseListSummary {
  const hasKeyword = Boolean(keyword?.trim());
  return {
    total,
    visible,
    statusText: hasKeyword ? `${visible} / ${total}` : "按时间倒序",
    emptyText: total > 0 ? "没有匹配的本地版本" : "暂无本地版本",
  };
}

export function formatLowcodeVersionDiffSummary(changedCount: number): string {
  return changedCount > 0 ? `${changedCount} 项差异` : "无摘要差异";
}

export function createLowcodeReleaseMessage(
  release: Pick<LowcodeEditorReleaseRecord, "title" | "pageVersion" | "note">,
  action: string,
): string {
  const note = release.note?.trim();
  return `${action}：${release.title} / ${release.pageVersion}${note ? ` / ${note}` : ""}`;
}

export function createLowcodePublishBlockedMessage(
  action: string,
  checks: readonly Pick<LowcodeEditorPublishCheck, "title">[],
): string {
  return `${action}失败：${checks.map((check) => check.title).join("、")} 未通过`;
}

export function createLowcodeRollbackNote(
  release: Pick<LowcodeEditorReleaseRecord, "pageVersion" | "note">,
): string {
  const note = release.note?.trim();
  return `回滚自 ${release.pageVersion}${note ? `：${note}` : ""}`;
}

export function createLowcodeRollbackConfirmText(
  release: Pick<LowcodeEditorReleaseRecord, "pageVersion">,
): string {
  return `确认将版本 ${release.pageVersion} 作为新的已发布版本吗？`;
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

function createNoopCanvasOperationResult(
  state: LowcodeEditorState,
  handled: boolean,
): LowcodeEditorCanvasOperationResult {
  return {
    state,
    handled,
    changed: false,
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

function getSiblingNodesByParent(nodes: LowcodeNode[], parentId: string | undefined): LowcodeNode[] | undefined {
  if (!parentId) return nodes;
  return findNode(nodes, parentId)?.children ?? [];
}

function replaceSiblingNodesByParent(
  nodes: LowcodeNode[],
  parentId: string | undefined,
  siblings: LowcodeNode[],
): LowcodeNode[] | undefined {
  if (!parentId) return siblings;
  const result = updateNodes(nodes, parentId, (parent) => ({
    ...parent,
    children: siblings,
  }));
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

function findLowcodeNodeById(nodes: readonly LowcodeNode[], nodeId: string): LowcodeNode | undefined {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    const child = findLowcodeNodeById(node.children ?? [], nodeId);
    if (child) return child;
  }
  return undefined;
}

function lowcodeNodeContains(node: LowcodeNode | undefined, nodeId: string): boolean {
  if (!node) return false;
  return Boolean(findLowcodeNodeById(node.children ?? [], nodeId));
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

function getLowcodeDefaultListFieldNames(
  propName: string,
  componentName: string | undefined,
  customDefaultFieldNames: Record<string, readonly string[]> | undefined,
): readonly string[] {
  if (customDefaultFieldNames?.[propName]) return customDefaultFieldNames[propName] ?? [];
  if (LOWCODE_EDITOR_DEFAULT_LIST_FIELDS[propName]) return LOWCODE_EDITOR_DEFAULT_LIST_FIELDS[propName] ?? [];
  if (propName === "items" && componentName === "FloorAnchorNav") return ["id", "title", "targetId"];
  if (propName === "items" && componentName === "NavGrid") return ["id", "title", "subtitle"];
  if (propName === "items" && componentName === "ImageCardGrid") return ["id", "title", "subtitle", "badgeText", "imageUrl", "linkUrl"];
  if (propName === "items" && componentName === "StoreExpertSection") {
    return ["id", "typeText", "title", "subtitle", "metricText", "desc", "imageUrl", "buttonText"];
  }
  if (propName === "items") return ["id", "title", "subtitle", "desc", "imageUrl"];
  return ["id", "title", "subtitle"];
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

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createLowcodeMaterialNodeDataBinding(
  manifest: LowcodeMaterialManifest,
  options: CreateLowcodeMaterialNodeInputOptions,
): LowcodeDataBinding | undefined {
  const dataBinding = options.dataBinding ?? options.dataBindingByComponentName?.[manifest.componentName];
  if (dataBinding && Object.keys(dataBinding).length > 0) return cloneJson(dataBinding);

  const slotBinding = manifest.dataSourceSlots?.reduce<LowcodeDataBinding>((binding, slot) => {
    const sourceId = options.dataBindingBySlotName?.[slot.name];
    if (sourceId) binding[slot.name] = sourceId;
    return binding;
  }, {});

  return slotBinding && Object.keys(slotBinding).length > 0 ? slotBinding : undefined;
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
