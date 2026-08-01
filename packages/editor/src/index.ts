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

export type LowcodeEditorPublishRiskLevel = "blocked" | "warning" | "ready";

export interface LowcodeEditorPublishRiskItem {
  id: string;
  title: string;
  description: string;
  status: Exclude<LowcodeEditorPublishCheckStatus, "pass">;
  nodeId?: string;
  nodeTitle?: string;
  actionText: string;
}

export interface LowcodeEditorPublishRiskSummary {
  level: LowcodeEditorPublishRiskLevel;
  title: string;
  description: string;
  statusText: string;
  primaryActionText: string;
  blockingCount: number;
  warningCount: number;
  passCount: number;
  priorityItems: LowcodeEditorPublishRiskItem[];
}

export interface CreateLowcodePublishRiskSummaryOptions {
  maxPriorityItems?: number;
}

export type LowcodeEditorWorkspaceStatTone = "neutral" | "success" | "warning" | "danger";

export interface LowcodeEditorWorkspaceStat {
  id: string;
  label: string;
  value: string;
  tone: LowcodeEditorWorkspaceStatTone;
}

export type LowcodeEditorAuditEventType =
  | "node.operation"
  | "material.insert"
  | "template.apply"
  | "resource.apply"
  | "schema.transfer"
  | "release.action"
  | "approval.action"
  | "runtime.open"
  | "action.execute"
  | "system.message"
  | (string & {});

export type LowcodeEditorAuditEventResult = "success" | "info" | "warning" | "error";

export interface LowcodeEditorAuditActor {
  id?: string;
  name: string;
  role?: string;
}

export interface LowcodeEditorAuditTarget {
  id?: string;
  type?: string;
  title?: string;
}

export interface LowcodeEditorAuditEvent {
  id: string;
  type: LowcodeEditorAuditEventType;
  title: string;
  description?: string;
  result: LowcodeEditorAuditEventResult;
  at: string;
  actor?: LowcodeEditorAuditActor;
  target?: LowcodeEditorAuditTarget;
  metadata?: JsonObject;
}

export interface CreateLowcodeEditorAuditEventInput {
  id?: string;
  type: LowcodeEditorAuditEventType;
  title: string;
  description?: string;
  result?: LowcodeEditorAuditEventResult;
  at?: string | Date;
  actor?: LowcodeEditorAuditActor;
  target?: LowcodeEditorAuditTarget;
  metadata?: JsonObject;
}

export interface CreateLowcodeEditorAuditEventOptions {
  now?: string | Date;
  sequence?: number;
}

export interface CreateLowcodeEditorAuditTrailOptions extends CreateLowcodeEditorAuditEventOptions {
  limit?: number;
}

export interface LowcodeEditorAuditListItem<TEvent extends LowcodeEditorAuditEvent = LowcodeEditorAuditEvent> {
  id: string;
  title: string;
  description: string;
  result: LowcodeEditorAuditEventResult;
  timeLabel: string;
  actorName: string;
  targetText: string;
  event: TEvent;
}

export interface CreateLowcodeEditorAuditListItemsOptions {
  limit?: number;
  latestFirst?: boolean;
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

export type LowcodeEditorDemoChecklistStatus = "done" | "active" | "pending" | "blocked";

export interface LowcodeEditorDemoChecklistItem {
  id: string;
  title: string;
  description: string;
  status: LowcodeEditorDemoChecklistStatus;
  statusText: string;
}

export interface CreateLowcodeEditorDemoChecklistOptions {
  nodeCount?: number;
  validationValid?: boolean;
  hasBasicMaterial?: boolean;
  hasPreviewLink?: boolean;
  hasReactH5RuntimeLink?: boolean;
  releaseCount?: number;
  dirty?: boolean;
}

export interface LowcodeEditorDemoChecklistSummary {
  total: number;
  done: number;
  active: number;
  pending: number;
  blocked: number;
  statusText: string;
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
  categoryLabel: string;
  categoryDescription: string;
  layer: string;
  layerLabel: string;
  family: string;
  familyLabel: string;
  materialVersion: string;
  platforms: LowcodePlatform[];
  propCount: number;
  eventCount: number;
  dataSourceSlotCount: number;
  summary: string;
  searchText: string;
}

export interface LowcodeEditorMaterialCategoryMeta {
  label: string;
  description: string;
}

export interface LowcodeEditorMaterialCategorySummary extends LowcodeEditorMaterialCategoryMeta {
  value: string;
  count: number;
  visibleCount: number;
  active: boolean;
  summaryText: string;
}

export interface LowcodeEditorMaterialCatalogOverview {
  totalCount: number;
  visibleCount: number;
  activeCategory: string;
  activeLabel: string;
  activeDescription: string;
  activeCount: number;
  summaryText: string;
  categories: LowcodeEditorMaterialCategorySummary[];
}

export interface LowcodeEditorMaterialInsertPresetInput {
  id: string;
  title: string;
  description?: string;
  props?: JsonObject;
  metaName?: string;
  keywords?: readonly string[];
}

export interface LowcodeEditorMaterialInsertPreset {
  id: string;
  title: string;
  description: string;
  props: JsonObject;
  metaName: string;
  keywords: string[];
}

export interface CreateLowcodeMaterialInsertPresetsOptions {
  includeDefaultPresets?: boolean;
  componentPresets?: Record<string, readonly LowcodeEditorMaterialInsertPresetInput[] | false | undefined>;
}

export interface LowcodeEditorMaterialInsertPresetValidationIssue {
  componentName: string;
  presetId: string;
  presetTitle: string;
  propName: string;
  message: string;
}

export interface LowcodeEditorMaterialInsertPresetValidationResult {
  componentName: string;
  title: string;
  presetCount: number;
  knownPropNames: string[];
  valid: boolean;
  issues: LowcodeEditorMaterialInsertPresetValidationIssue[];
}

export interface ValidateLowcodeMaterialInsertPresetsOptions extends CreateLowcodeMaterialInsertPresetsOptions {
  allowedPropNames?: readonly string[];
  componentAllowedPropNames?: Record<string, readonly string[] | undefined>;
}

export type CreateLowcodeMaterialNodeInputFromPresetOptions = CreateLowcodeMaterialNodeInputOptions;

export type LowcodeEditorMaterialLayer = "generic" | "business" | "custom";

export interface LowcodeEditorMaterialLayerMeta {
  label: string;
  description: string;
}

export interface LowcodeEditorMaterialFamilyMeta {
  label: string;
  description: string;
  primitiveHint: string;
}

export interface LowcodeEditorMaterialArchitectureProfile {
  componentName: string;
  layer: LowcodeEditorMaterialLayer | string;
  layerLabel: string;
  layerDescription: string;
  family: string;
  familyLabel: string;
  familyDescription: string;
  primitiveHint: string;
  recommendedUse: string;
  boundary: string;
}

export interface LowcodeEditorMaterialArchitectureLayerSummary extends LowcodeEditorMaterialLayerMeta {
  value: string;
  count: number;
  visibleCount: number;
  summaryText: string;
}

export interface LowcodeEditorMaterialArchitectureFamilySummary extends LowcodeEditorMaterialFamilyMeta {
  value: string;
  count: number;
  visibleCount: number;
  summaryText: string;
}

export interface LowcodeEditorMaterialArchitectureOverview {
  totalCount: number;
  visibleCount: number;
  layerSummaryText: string;
  familySummaryText: string;
  layers: LowcodeEditorMaterialArchitectureLayerSummary[];
  families: LowcodeEditorMaterialArchitectureFamilySummary[];
}

export interface LowcodeEditorMaterialArchitectureProfileInput {
  layer?: LowcodeEditorMaterialLayer | string;
  family?: string;
  primitiveHint?: string;
  recommendedUse?: string;
  boundary?: string;
}

export interface LowcodeMaterialArchitectureOptions extends FilterLowcodeMaterialCatalogOptions {
  layerMeta?: Record<string, Partial<LowcodeEditorMaterialLayerMeta>>;
  familyMeta?: Record<string, Partial<LowcodeEditorMaterialFamilyMeta>>;
  componentProfiles?: Record<string, Partial<LowcodeEditorMaterialArchitectureProfileInput>>;
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

export interface LowcodeMaterialCategorySummaryOptions extends FilterLowcodeMaterialCatalogOptions {
  categoryMeta?: Record<string, Partial<LowcodeEditorMaterialCategoryMeta>>;
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

export type LowcodeEditorCapabilityStatusId = "collaboration" | "approval" | "publish-check";

export interface LowcodeEditorCapabilityStatusItem {
  id: LowcodeEditorCapabilityStatusId;
  title: string;
  description: string;
  tone: LowcodeEditorWorkspaceStatTone;
}

export interface LowcodeEditorCapabilityState {
  collaboration: LowcodeEditorCollaborationState;
  approval: LowcodeEditorApprovalState;
  permissionState: LowcodeEditorPermissionState;
  editable: boolean;
  readonly: boolean;
  submittable: boolean;
  publishable: boolean;
  disabledActions: Partial<Record<LowcodeEditorPermissionAction, string>>;
  statusItems: readonly LowcodeEditorCapabilityStatusItem[];
  blockingReasons: readonly string[];
}

export interface CreateLowcodeEditorCapabilityStateOptions {
  collaboration?: LowcodeEditorCollaborationState;
  approval?: LowcodeEditorApprovalState;
  permissionState?: Partial<LowcodeEditorPermissionState>;
  publishCheckSummary?: LowcodeEditorPublishCheckSummary;
  actions?: readonly LowcodeEditorPermissionAction[];
  publishBlockedReason?: string;
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

export type LowcodeEditorMaterialInsertPlacement = "append" | "before" | "after" | "inside";

export interface LowcodeEditorMaterialInsertTarget {
  placement: LowcodeEditorMaterialInsertPlacement;
  label: string;
  description: string;
  disabled: boolean;
  disabledReason?: string;
  parentId?: string;
  index?: number;
  action?: LowcodeEditorNodeOperationAction;
}

export interface CreateLowcodeMaterialInsertTargetsOptions {
  selectedRow?: Pick<LowcodeEditorOutlineRow, "node" | "parentId" | "index" | "title">;
  selectedNodeIsContainer?: boolean;
  canInsert?: boolean;
  hasMaterial?: boolean;
  materialTitle?: string;
  disabledReason?: string;
  missingMaterialReason?: string;
  missingSelectedNodeReason?: string;
  missingContainerReason?: string;
}

export interface CreateLowcodeMaterialInsertTargetOptions extends CreateLowcodeMaterialInsertTargetsOptions {
  placement: LowcodeEditorMaterialInsertPlacement;
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

export type LowcodeEditorPropGroupKey = "content" | "style" | "data" | "validation" | "behavior" | "advanced";

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
  validationPropNames?: readonly string[];
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

export const LOWCODE_EDITOR_AUDIT_TRAIL_DEFAULT_LIMIT = 50;

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

export const LOWCODE_EDITOR_DEFAULT_CAPABILITY_ACTIONS = [
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
export const LOWCODE_EDITOR_PROP_GROUP_ORDER = ["content", "style", "data", "validation", "behavior", "advanced"] as const satisfies readonly LowcodeEditorPropGroupKey[];
export const LOWCODE_EDITOR_PROP_GROUP_META = {
  content: { label: "内容配置", description: "标题、文案、图片和按钮内容。" },
  style: { label: "样式配置", description: "颜色、圆角、间距和排版表现。" },
  data: { label: "数据配置", description: "商品、券、规则、导航项和数据源字段。" },
  validation: { label: "表单校验", description: "必填状态、提示文案和表单提交前的本地校验。" },
  behavior: { label: "行为配置", description: "跳转链接、吸顶、平滑滚动等交互行为。" },
  advanced: { label: "其他配置", description: "暂未归类的物料字段。" },
} as const satisfies Record<LowcodeEditorPropGroupKey, LowcodeEditorPropGroupMeta>;
export const LOWCODE_EDITOR_COMMON_LIST_FIELDS: Record<string, LowcodeEditorListField> = {
  id: { name: "id", label: "ID", placeholder: "唯一标识" },
  typeText: { name: "typeText", label: "类型", placeholder: "门店 / 达人 / 推荐" },
  title: { name: "title", label: "标题", placeholder: "请输入标题" },
  label: { name: "label", label: "标签", placeholder: "请输入标签" },
  subtitle: { name: "subtitle", label: "副标题", placeholder: "请输入副标题" },
  desc: { name: "desc", label: "说明", placeholder: "请输入说明" },
  helperText: { name: "helperText", label: "辅助说明", placeholder: "请输入辅助说明" },
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
  prefix: { name: "prefix", label: "前缀", placeholder: "¥ / 约" },
  suffix: { name: "suffix", label: "后缀", placeholder: "人 / 款 / 张" },
  value: { name: "value", label: "值", placeholder: "请输入值", multiline: true },
};
export const LOWCODE_EDITOR_DEFAULT_LIST_FIELDS: Record<string, readonly string[]> = {
  coupons: ["id", "title", "thresholdText", "valueText", "expireText", "buttonText"],
  rules: ["title", "content"],
  sellingPoints: ["id", "title", "desc"],
};

const DEFAULT_PRODUCT_COMPONENT_NAMES = ["ProductList", "ProductRankList", "BrandFeatureSection", "FlashSaleList"];
export const LOWCODE_EDITOR_DEFAULT_CANVAS_INSIDE_COMPONENT_NAMES = ["SectionContainer", "GridContainer", "BasicForm"] as const;
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
const DEFAULT_VALIDATION_PROP_NAMES = ["required", "requiredMessage", "validationErrorText", "errorText", "errorMessage"];
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

function toLowcodeAuditIsoTime(value: string | Date | undefined): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" && value.length > 0) return value;
  return new Date().toISOString();
}

function sanitizeLowcodeAuditIdPart(value: string): string {
  const sanitized = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return sanitized || "event";
}

function createLowcodeAuditEventId(type: LowcodeEditorAuditEventType, at: string, sequence = 0): string {
  return `audit-${sanitizeLowcodeAuditIdPart(type)}-${sanitizeLowcodeAuditIdPart(at)}-${sequence}`;
}

function isLowcodeEditorAuditEvent(input: CreateLowcodeEditorAuditEventInput | LowcodeEditorAuditEvent): input is LowcodeEditorAuditEvent {
  return typeof input.id === "string" && typeof input.at === "string" && typeof input.result === "string";
}

function formatLowcodeAuditTimeLabel(at: string): string {
  const date = new Date(at);
  if (Number.isNaN(date.getTime())) return at;
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  const seconds = `${date.getSeconds()}`.padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export function createLowcodeEditorAuditEvent(
  input: CreateLowcodeEditorAuditEventInput,
  options: CreateLowcodeEditorAuditEventOptions = {},
): LowcodeEditorAuditEvent {
  const at = toLowcodeAuditIsoTime(input.at ?? options.now);
  return {
    id: input.id ?? createLowcodeAuditEventId(input.type, at, options.sequence),
    type: input.type,
    title: input.title,
    description: input.description,
    result: input.result ?? "success",
    at,
    actor: input.actor,
    target: input.target,
    metadata: input.metadata,
  };
}

export function createLowcodeEditorAuditTrail(
  events: readonly LowcodeEditorAuditEvent[],
  input: CreateLowcodeEditorAuditEventInput | LowcodeEditorAuditEvent,
  options: CreateLowcodeEditorAuditTrailOptions = {},
): LowcodeEditorAuditEvent[] {
  const limit = Math.max(1, Math.floor(options.limit ?? LOWCODE_EDITOR_AUDIT_TRAIL_DEFAULT_LIMIT));
  const event = isLowcodeEditorAuditEvent(input)
    ? input
    : createLowcodeEditorAuditEvent(input, {
      now: options.now,
      sequence: options.sequence ?? events.length,
    });
  return [...events, event].slice(-limit);
}

export function createLowcodeEditorAuditListItems(
  events: readonly LowcodeEditorAuditEvent[],
  options: CreateLowcodeEditorAuditListItemsOptions = {},
): LowcodeEditorAuditListItem[] {
  const limit = Math.max(0, Math.floor(options.limit ?? events.length));
  const ordered = options.latestFirst === false ? [...events] : [...events].reverse();
  return ordered.slice(0, limit).map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description ?? event.type,
    result: event.result,
    timeLabel: formatLowcodeAuditTimeLabel(event.at),
    actorName: event.actor?.name ?? "本地操作",
    targetText: event.target?.title ?? event.target?.id ?? event.target?.type ?? "-",
    event,
  }));
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

export function createLowcodeEditorDemoChecklist(
  options: CreateLowcodeEditorDemoChecklistOptions = {},
): LowcodeEditorDemoChecklistItem[] {
  const nodeCount = Math.max(0, Math.floor(options.nodeCount ?? 0));
  const validationValid = options.validationValid ?? false;
  const hasBasicMaterial = options.hasBasicMaterial ?? false;
  const hasPreviewLink = options.hasPreviewLink ?? false;
  const hasReactH5RuntimeLink = options.hasReactH5RuntimeLink ?? false;
  const releaseCount = Math.max(0, Math.floor(options.releaseCount ?? 0));
  const dirty = options.dirty ?? false;
  const savedOrReleased = releaseCount > 0 || !dirty;

  return [
    {
      id: "page-content",
      title: "页面有内容",
      description: nodeCount > 0 ? `当前 ${nodeCount} 个节点` : "画布暂无节点",
      status: nodeCount > 0 ? "done" : "active",
      statusText: nodeCount > 0 ? "已就绪" : "待添加",
    },
    {
      id: "basic-material",
      title: "基础物料可用",
      description: hasBasicMaterial ? "已包含基础物料节点" : "尚未识别到基础物料节点",
      status: hasBasicMaterial ? "done" : nodeCount > 0 ? "active" : "pending",
      statusText: hasBasicMaterial ? "已加入" : "待验证",
    },
    {
      id: "schema-validation",
      title: "Schema 校验通过",
      description: validationValid ? "当前 Page Schema 可被 renderer 消费" : "需要先处理校验异常",
      status: validationValid ? "done" : "blocked",
      statusText: validationValid ? "通过" : "阻塞",
    },
    {
      id: "h5-preview",
      title: "H5 预览入口可用",
      description: hasPreviewLink ? "已有可打开的 H5 预览入口" : "暂无可打开的 H5 预览入口",
      status: hasPreviewLink ? "done" : validationValid ? "active" : "pending",
      statusText: hasPreviewLink ? "可预览" : "待生成",
    },
    {
      id: "draft-or-release",
      title: "草稿保存或发布记录",
      description: savedOrReleased ? "当前状态已有保存或版本记录" : "当前变更尚未保存为草稿或版本",
      status: savedOrReleased ? "done" : "active",
      statusText: savedOrReleased ? "已记录" : "未保存",
    },
    {
      id: "react-h5-runtime",
      title: "React H5 渲染可验证",
      description: hasReactH5RuntimeLink ? "React H5 runtime 链接已就绪" : "React H5 runtime 链接尚不可用",
      status: hasReactH5RuntimeLink && nodeCount > 0 ? "done" : hasPreviewLink ? "active" : "pending",
      statusText: hasReactH5RuntimeLink && nodeCount > 0 ? "可验证" : "待验证",
    },
  ];
}

export function summarizeLowcodeEditorDemoChecklist(
  items: readonly LowcodeEditorDemoChecklistItem[],
): LowcodeEditorDemoChecklistSummary {
  const done = items.filter((item) => item.status === "done").length;
  const active = items.filter((item) => item.status === "active").length;
  const pending = items.filter((item) => item.status === "pending").length;
  const blocked = items.filter((item) => item.status === "blocked").length;
  return {
    total: items.length,
    done,
    active,
    pending,
    blocked,
    statusText: blocked > 0 ? `${done}/${items.length} 已就绪 / ${blocked} 项阻塞` : `${done}/${items.length} 已就绪`,
  };
}

export const LOWCODE_EDITOR_MATERIAL_CATEGORY_META: Record<string, LowcodeEditorMaterialCategoryMeta> = {
  basic: {
    label: "基础物料",
    description: "业务无关的通用展示、输入、反馈和轻交互物料，适合优先组合页面基础内容。",
  },
  layout: {
    label: "布局容器",
    description: "承载页面结构、分组和子节点排布的容器类物料，适合先搭页面骨架。",
  },
  content: {
    label: "内容展示",
    description: "面向图文、公告、富文本、导航等内容表达的通用物料。",
  },
  form: {
    label: "表单留资",
    description: "面向留资、报名和轻量收集的表单物料，真实提交和校验由宿主 action 承接。",
  },
  marketing: {
    label: "营销活动",
    description: "面向活动、直播、品牌、规则和转化入口的场景物料，适合搭建推广页面。",
  },
  commerce: {
    label: "商品交易",
    description: "面向商品、榜单、优惠券等电商表达的物料，真实价格、库存和权益由业务系统承接。",
  },
};

export function getLowcodeMaterialCategoryMeta(
  category: string,
  options: Pick<LowcodeMaterialCategorySummaryOptions, "allCategoryLabel" | "categoryMeta"> = {},
): LowcodeEditorMaterialCategoryMeta {
  const allCategoryLabel = options.allCategoryLabel ?? "全部";
  const fallback = category === allCategoryLabel
    ? {
        label: "全部物料",
        description: "展示当前物料库里的全部可拖拽物料，可通过搜索和分类快速缩小范围。",
      }
    : {
        label: category,
        description: "自定义物料分类，具体业务边界以物料详情和 manifest 为准。",
      };
  const preset = LOWCODE_EDITOR_MATERIAL_CATEGORY_META[category] ?? {};
  const custom = options.categoryMeta?.[category] ?? {};
  return {
    label: custom.label ?? preset.label ?? fallback.label,
    description: custom.description ?? preset.description ?? fallback.description,
  };
}

export const LOWCODE_EDITOR_MATERIAL_INSERT_PRESETS: Record<string, readonly LowcodeEditorMaterialInsertPresetInput[]> = {
  SectionContainer: [
    {
      id: "clean-section",
      title: "清爽分组",
      description: "白底、轻留白的单列内容分组。",
      metaName: "清爽分组",
      props: { title: "活动分组", subtitle: "用于承载图文、按钮或商品模块", backgroundColor: "#ffffff", padding: 16, gap: 12 },
      keywords: ["section", "container", "分组", "容器"],
    },
    {
      id: "emphasis-section",
      title: "强调分组",
      description: "浅色背景和边框，适合突出重点内容。",
      metaName: "强调分组",
      props: { title: "重点区域", subtitle: "突出展示活动重点", backgroundColor: "#f8fafc", borderColor: "#dbeafe", radius: 12, padding: 18, gap: 12 },
      keywords: ["highlight", "emphasis", "重点"],
    },
  ],
  GridContainer: [
    {
      id: "two-column-grid",
      title: "双列宫格",
      description: "适合图片、卡片或入口的双列排布。",
      metaName: "双列宫格",
      props: { columns: 2, gap: 10, backgroundColor: "#ffffff", padding: 12 },
      keywords: ["grid", "2", "双列"],
    },
    {
      id: "three-column-grid",
      title: "三列宫格",
      description: "适合轻量频道入口的三列排布。",
      metaName: "三列宫格",
      props: { columns: 3, gap: 8, backgroundColor: "#ffffff", padding: 12 },
      keywords: ["grid", "3", "三列"],
    },
  ],
  BasicButton: [
    {
      id: "primary-action",
      title: "主按钮",
      description: "适合页面主行动入口。",
      metaName: "主按钮",
      props: { text: "立即参与", variant: "solid", size: "lg", block: true, backgroundColor: "#111827", textColor: "#ffffff", borderColor: "#111827", radius: 10 },
      keywords: ["primary", "button", "主按钮"],
    },
    {
      id: "outline-action",
      title: "描边按钮",
      description: "适合次级行动或辅助跳转。",
      metaName: "描边按钮",
      props: { text: "查看详情", variant: "outline", size: "md", block: true, backgroundColor: "#ffffff", textColor: "#111827", borderColor: "#111827", radius: 10 },
      keywords: ["outline", "secondary", "描边"],
    },
    {
      id: "ghost-action",
      title: "文字按钮",
      description: "适合轻量操作和说明链接。",
      metaName: "文字按钮",
      props: { text: "了解更多", variant: "ghost", size: "md", block: false, backgroundColor: "transparent", textColor: "#2563eb", borderColor: "transparent", radius: 8 },
      keywords: ["ghost", "link", "文字"],
    },
  ],
  BasicLink: [
    {
      id: "card-link",
      title: "卡片链接",
      description: "带说明的独立跳转入口。",
      metaName: "卡片链接",
      props: { text: "查看活动攻略", subtitle: "了解会场玩法和优惠说明", prefixText: "指南", variant: "card", showArrow: true },
      keywords: ["link", "card", "卡片"],
    },
    {
      id: "bar-link",
      title: "横条链接",
      description: "适合页面内轻量导流。",
      metaName: "横条链接",
      props: { text: "更多精选内容", subtitle: "点击查看完整清单", variant: "bar", showArrow: true },
      keywords: ["bar", "横条"],
    },
  ],
  BasicInput: [
    {
      id: "text-input",
      title: "文本输入",
      description: "普通单行文本输入。",
      metaName: "文本输入",
      props: { label: "姓名", placeholder: "请输入姓名", type: "text", helperText: "仅用于页面展示或本地交互" },
      keywords: ["input", "text", "姓名"],
    },
    {
      id: "phone-input",
      title: "手机号输入",
      description: "手机号输入框展示。",
      metaName: "手机号输入",
      props: { label: "手机号", placeholder: "请输入手机号", type: "tel", helperText: "真实校验和提交由宿主承接" },
      keywords: ["input", "phone", "tel", "手机号"],
    },
  ],
  BasicTextarea: [
    {
      id: "remark-textarea",
      title: "备注输入",
      description: "多行备注或补充说明。",
      metaName: "备注输入",
      props: { label: "备注", placeholder: "请输入补充说明", rows: 4, helperText: "可用于活动备注或需求收集" },
      keywords: ["textarea", "备注"],
    },
  ],
  BasicSelect: [
    {
      id: "category-select",
      title: "品类选择",
      description: "静态活动品类选择。",
      metaName: "品类选择",
      props: {
        label: "关注品类",
        placeholder: "请选择关注品类",
        options: [
          { label: "女装会场", value: "women" },
          { label: "鞋包配饰", value: "accessories" },
          { label: "直播专场", value: "live" },
        ],
      },
      keywords: ["select", "品类"],
    },
  ],
  BasicText: [
    {
      id: "section-heading",
      title: "区块标题",
      description: "适合作为内容区标题。",
      metaName: "区块标题文本",
      props: { text: "精选活动", as: "h2", align: "left", fontSize: 20, fontWeight: 800, color: "#111827", paddingY: 8 },
      keywords: ["title", "heading", "标题"],
    },
    {
      id: "body-copy",
      title: "正文说明",
      description: "适合普通说明文案。",
      metaName: "正文说明",
      props: { text: "这里填写活动说明或页面补充文案。", as: "p", align: "left", fontSize: 14, fontWeight: 400, color: "#475569", lineHeight: 1.6, paddingY: 6 },
      keywords: ["body", "copy", "正文"],
    },
  ],
  BasicImage: [
    {
      id: "rounded-image",
      title: "圆角图片",
      description: "适合运营单图展示。",
      metaName: "圆角图片",
      props: { imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80", alt: "运营图片", radius: 12, fit: "cover" },
      keywords: ["image", "图片", "圆角"],
    },
  ],
  BasicTag: [
    {
      id: "accent-tag",
      title: "强调标签",
      description: "适合角标、卖点和提示标签。",
      metaName: "强调标签",
      props: { text: "限时", tone: "accent", radius: 999 },
      keywords: ["tag", "标签", "角标"],
    },
  ],
  BasicAlert: [
    {
      id: "warning-alert",
      title: "提醒提示",
      description: "用于活动说明和注意事项。",
      metaName: "提醒提示",
      props: { title: "温馨提示", content: "活动规则以页面展示和平台说明为准。", tone: "warning", variant: "soft", actionText: "查看规则" },
      keywords: ["alert", "warning", "提示"],
    },
    {
      id: "success-alert",
      title: "成功提示",
      description: "用于正向反馈说明。",
      metaName: "成功提示",
      props: { title: "配置完成", content: "当前模块已完成基础配置。", tone: "success", variant: "soft" },
      keywords: ["alert", "success", "成功"],
    },
  ],
  BasicStateBlock: [
    {
      id: "empty-state",
      title: "空态提示",
      description: "用于暂无内容、列表为空等静态空态。",
      metaName: "空态状态块",
      props: { state: "empty", title: "暂无内容", description: "当前没有可展示内容。", actionText: "刷新重试", showAction: true },
      keywords: ["state", "empty", "空态", "暂无"],
    },
    {
      id: "error-state",
      title: "错误状态",
      description: "用于加载失败、配置异常等静态错误反馈。",
      metaName: "错误状态块",
      props: { state: "error", title: "加载失败", description: "请稍后重试或联系页面负责人。", actionText: "重试", showAction: true },
      keywords: ["state", "error", "错误", "失败"],
    },
  ],
  BasicProgress: [
    {
      id: "campaign-progress",
      title: "活动进度",
      description: "用于静态展示活动达成率或阶段完成度。",
      metaName: "活动进度条",
      props: { title: "活动达成进度", description: "展示当前静态达成率，真实进度由后续数据源协议承接。", value: 68, max: 100, valueSuffix: "%", tone: "success" },
      keywords: ["progress", "进度", "达成率", "完成度"],
    },
    {
      id: "neutral-progress",
      title: "说明进度",
      description: "用于配置说明类或中性进度展示。",
      metaName: "说明进度条",
      props: { title: "配置完成度", description: "用于展示本地静态进度说明。", value: 3, max: 5, valueSuffix: "/5", tone: "neutral" },
      keywords: ["progress", "neutral", "进度条"],
    },
  ],
  BasicMetric: [
    {
      id: "participant-metric",
      title: "参与人数",
      description: "用于静态展示参与人数、报名人数等指标。",
      metaName: "参与人数指标",
      props: { label: "参与人数", value: "1280", suffix: "人", helperText: "静态展示，真实人数由后续数据源协议承接。", tone: "brand", variant: "card" },
      keywords: ["metric", "指标", "人数", "参与"],
    },
    {
      id: "new-arrival-metric",
      title: "上新数量",
      description: "用于静态展示上新款数、库存件数等摘要。",
      metaName: "上新数量指标",
      props: { label: "今日上新", value: "24", suffix: "款", helperText: "用于运营静态指标说明。", tone: "success", variant: "plain", align: "center" },
      keywords: ["metric", "上新", "数量", "库存"],
    },
  ],
  BasicMetricGrid: [
    {
      id: "campaign-metric-grid",
      title: "活动指标组",
      description: "用于静态展示多个活动指标摘要。",
      metaName: "活动指标组",
      props: {
        title: "活动指标",
        description: "静态展示，真实统计由后续数据源协议承接。",
        columns: 3,
        tone: "brand",
        variant: "card",
        items: [
          { id: "metric_1", label: "参与人数", value: "1280", suffix: "人", helperText: "静态展示" },
          { id: "metric_2", label: "今日上新", value: "24", suffix: "款", helperText: "运营配置" },
          { id: "metric_3", label: "优惠券", value: "6", suffix: "张", helperText: "权益摘要" },
        ],
      },
      keywords: ["metric", "指标组", "数据", "摘要"],
    },
    {
      id: "plain-metric-grid",
      title: "简洁指标组",
      description: "用于轻量展示配置摘要。",
      metaName: "简洁指标组",
      props: {
        title: "配置摘要",
        description: "用于运营静态说明。",
        columns: 2,
        tone: "neutral",
        variant: "plain",
        items: [
          { id: "metric_1", label: "已配置", value: "3", suffix: "项", helperText: "本地展示" },
          { id: "metric_2", label: "待确认", value: "1", suffix: "项", helperText: "人工维护" },
        ],
      },
      keywords: ["metric", "summary", "摘要", "配置"],
    },
  ],
  BasicForm: [
    {
      id: "lead-form",
      title: "留资表单",
      description: "带标题和提交按钮的表单容器。",
      metaName: "留资表单容器",
      props: { title: "提交信息", description: "填写信息后提交，真实提交由宿主 action 承接。", submitText: "提交信息", successText: "已提交" },
      keywords: ["form", "lead", "表单"],
    },
  ],
  BasicList: [
    {
      id: "rule-list",
      title: "规则列表",
      description: "适合静态规则和步骤说明。",
      metaName: "规则列表",
      props: {
        title: "活动规则",
        subtitle: "请按页面说明参与活动",
        marker: "number",
        items: [
          { title: "选择心仪商品", description: "浏览页面中的精选商品和活动会场。" },
          { title: "按提示完成操作", description: "点击按钮或链接进入对应活动。" },
          { title: "关注活动时间", description: "具体权益以平台展示为准。" },
        ],
      },
      keywords: ["list", "rules", "规则"],
    },
  ],
  BasicAccordion: [
    {
      id: "faq-accordion",
      title: "FAQ 折叠",
      description: "适合常见问题和活动说明。",
      metaName: "FAQ 折叠面板",
      props: {
        title: "常见问题",
        subtitle: "运营可按需修改问题和答案",
        mode: "single",
        items: [
          { title: "活动什么时候开始？", content: "请以页面展示时间为准。", tag: "时间" },
          { title: "优惠如何使用？", content: "具体权益以结算页和平台规则为准。", tag: "权益" },
        ],
      },
      keywords: ["faq", "accordion", "折叠"],
    },
  ],
  BasicTimeline: [
    {
      id: "activity-timeline",
      title: "活动时间线",
      description: "适合活动节奏和流程说明。",
      metaName: "活动时间线",
      props: {
        title: "活动节奏",
        subtitle: "展示活动关键阶段",
        marker: "dot",
        items: [
          { title: "预热", description: "浏览活动内容并提前收藏。", time: "10:00", status: "done" },
          { title: "开抢", description: "按页面提示参与限时活动。", time: "20:00", status: "active" },
          { title: "返场", description: "关注后续补贴和返场信息。", time: "次日", status: "pending" },
        ],
      },
      keywords: ["timeline", "时间线"],
    },
  ],
  BasicModal: [
    {
      id: "rule-modal",
      title: "规则弹窗",
      description: "静态规则说明弹窗。",
      metaName: "规则弹窗",
      props: { triggerText: "查看规则", modalTitle: "活动规则", summary: "请阅读活动说明", content: "活动权益、参与门槛和时间以平台展示为准。", primaryText: "我知道了", placement: "center" },
      keywords: ["modal", "rules", "弹窗"],
    },
  ],
  BasicCarousel: [
    {
      id: "hero-carousel",
      title: "头图轮播",
      description: "适合首屏多图横幅展示。",
      metaName: "头图轮播",
      props: {
        ratio: "16 / 9",
        indicator: "dots",
        radius: 12,
        items: [
          { title: "夏日上新", description: "精选新品限时上新", imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80", tag: "NEW" },
          { title: "直播专场", description: "今晚 8 点开播", imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80", tag: "LIVE" },
        ],
      },
      keywords: ["carousel", "banner", "轮播"],
    },
  ],
  ActivityHero: [
    {
      id: "campaign-hero",
      title: "活动头图",
      description: "首屏活动标题和主视觉。",
      metaName: "活动头图",
      props: { title: "夏日好物节", subtitle: "精选好物限时补贴", imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80", backgroundColor: "#ffffff", titleSize: 26, imageRadius: 12 },
      keywords: ["hero", "activity", "头图"],
    },
  ],
};

function normalizeLowcodeMaterialInsertPreset(
  manifest: LowcodeMaterialManifest,
  input: LowcodeEditorMaterialInsertPresetInput,
): LowcodeEditorMaterialInsertPreset {
  return {
    id: input.id,
    title: input.title,
    description: input.description ?? `使用 ${manifest.title} 的常用配置。`,
    props: cloneJson(input.props ?? {}),
    metaName: input.metaName ?? input.title,
    keywords: [...(input.keywords ?? [])],
  };
}

export function createLowcodeMaterialInsertPresets(
  manifest: LowcodeMaterialManifest,
  options: CreateLowcodeMaterialInsertPresetsOptions = {},
): LowcodeEditorMaterialInsertPreset[] {
  const custom = options.componentPresets?.[manifest.componentName];
  if (custom === false) return [];
  const defaultPresets = options.includeDefaultPresets === false
    ? []
    : LOWCODE_EDITOR_MATERIAL_INSERT_PRESETS[manifest.componentName] ?? [];
  return [...defaultPresets, ...(custom ?? [])]
    .filter((preset) => preset.id.trim() && preset.title.trim())
    .map((preset) => normalizeLowcodeMaterialInsertPreset(manifest, preset));
}

export function findLowcodeMaterialInsertPreset(
  manifest: LowcodeMaterialManifest,
  presetId: string,
  options: CreateLowcodeMaterialInsertPresetsOptions = {},
): LowcodeEditorMaterialInsertPreset | undefined {
  return createLowcodeMaterialInsertPresets(manifest, options).find((preset) => preset.id === presetId);
}

export function validateLowcodeMaterialInsertPresets(
  manifest: LowcodeMaterialManifest,
  options: ValidateLowcodeMaterialInsertPresetsOptions = {},
): LowcodeEditorMaterialInsertPresetValidationResult {
  const knownPropNames = new Set([
    ...Object.keys(manifest.propsSchema),
    ...Object.keys(manifest.defaultProps),
    ...(options.allowedPropNames ?? []),
    ...(options.componentAllowedPropNames?.[manifest.componentName] ?? []),
  ]);
  const presets = createLowcodeMaterialInsertPresets(manifest, options);
  const issues: LowcodeEditorMaterialInsertPresetValidationIssue[] = [];

  presets.forEach((preset) => {
    Object.keys(preset.props).forEach((propName) => {
      if (knownPropNames.has(propName)) return;
      issues.push({
        componentName: manifest.componentName,
        presetId: preset.id,
        presetTitle: preset.title,
        propName,
        message: `物料 ${manifest.componentName} 的预设 ${preset.id} 写入了 manifest 未声明的 props.${propName}。`,
      });
    });
  });

  return {
    componentName: manifest.componentName,
    title: manifest.title,
    presetCount: presets.length,
    knownPropNames: [...knownPropNames].sort(),
    valid: issues.length === 0,
    issues,
  };
}

export const LOWCODE_EDITOR_MATERIAL_LAYER_META: Record<LowcodeEditorMaterialLayer, LowcodeEditorMaterialLayerMeta> = {
  generic: {
    label: "通用物料",
    description: "声明 manifest、可被运营拖拽，不绑定具体 MeuMall 业务接口，优先复用 runtime primitives。",
  },
  business: {
    label: "业务物料",
    description: "面向商品、优惠券、直播、门店达人等 MeuMall 业务场景，必须复用通用物料和基础组件能力。",
  },
  custom: {
    label: "自定义物料",
    description: "未命中默认分层规则的扩展物料，建议补充物料中心白名单和架构 profile。",
  },
};

export const LOWCODE_EDITOR_MATERIAL_FAMILY_META: Record<string, LowcodeEditorMaterialFamilyMeta> = {
  layout: {
    label: "布局容器",
    description: "负责页面结构、容器、分栏和留白骨架。",
    primitiveHint: "优先复用布局 token、文本 primitive 和容器 children 协议。",
  },
  action: {
    label: "按钮行动",
    description: "负责按钮、链接、底部转化条等点击入口。",
    primitiveHint: "优先复用 Button、Link、Text 和安全 action binding。",
  },
  input: {
    label: "输入控件",
    description: "负责单行输入、多行输入、选择、开关、复选、单选和数字步进。",
    primitiveHint: "优先复用 Input、Textarea、Select、Switch、Checkbox、Radio、Stepper。",
  },
  media: {
    label: "图片视频",
    description: "负责图片、轮播、视频、图文卡片和素材展示。",
    primitiveHint: "优先复用 Image、Tag、Text，并由宿主素材库负责真实资源选择。",
  },
  content: {
    label: "内容展示",
    description: "负责文本、标题、富文本、规则、标签切换和信息表达。",
    primitiveHint: "优先复用 Text、RichText、Tag、Tabs、Metric。",
  },
  feedback: {
    label: "反馈提示",
    description: "负责公告、提示、弹窗和轻量反馈。",
    primitiveHint: "优先复用 NoticeBar、Modal、StateBlock、Progress、Text、Button。",
  },
  list: {
    label: "列表结构",
    description: "负责静态列表、折叠面板、时间线和卡片组。",
    primitiveHint: "优先复用 Text、Tag、Image，并把远程分页交给数据源协议。",
  },
  form: {
    label: "表单组合",
    description: "负责表单容器、留资和提交入口。",
    primitiveHint: "优先复用 Form 容器、基础输入族和安全 onSubmit action。",
  },
  marketing: {
    label: "营销表达",
    description: "负责活动头图、导航、倒计时和会场转化氛围。",
    primitiveHint: "优先复用 Button、Image、Text、Tag、Countdown。",
  },
  commerce: {
    label: "商品交易",
    description: "负责商品、价格、优惠券、榜单和交易转化业务语义。",
    primitiveHint: "业务物料只组合 Price、Image、Tag、Button，不直接请求业务 API。",
  },
};

export const LOWCODE_EDITOR_MATERIAL_COMPONENT_PROFILES: Record<string, LowcodeEditorMaterialArchitectureProfileInput> = {
  SectionContainer: {
    layer: "generic",
    family: "layout",
    recommendedUse: "先用它搭建单列页面骨架和运营分组。",
    boundary: "不承载复杂 slot、断点、合并单元格或业务数据。",
  },
  GridContainer: {
    layer: "generic",
    family: "layout",
    recommendedUse: "用于 2/3 列轻量宫格布局。",
    boundary: "不承载单元格级投放、跨列合并或列宽拖拽。",
  },
  SpacerBlock: {
    layer: "generic",
    family: "layout",
    recommendedUse: "用于页面局部留白和节奏调整。",
    boundary: "不承载内容、事件或业务规则。",
  },
  BasicButton: { layer: "generic", family: "action", recommendedUse: "用于业务无关的主按钮、次按钮和行动入口。", boundary: "不承载登录、风控、领券或交易逻辑。" },
  ActionButton: { layer: "generic", family: "action", recommendedUse: "用于营销页面中的通用行动按钮。", boundary: "不直接执行任意脚本，点击结果由安全 action handler 承接。" },
  BasicLink: { layer: "generic", family: "action", recommendedUse: "用于轻量链接入口、说明跳转和运营导流。", boundary: "不承载 App bridge、短链生成、权限审批或远程链接校验。" },
  BasicInput: { layer: "generic", family: "input", recommendedUse: "用于业务无关的单行输入。", boundary: "不承载真实提交、验证码、登录或服务端校验。" },
  BasicTextarea: { layer: "generic", family: "input", recommendedUse: "用于业务无关的多行文本输入。", boundary: "不承载敏感词审核、富文本编辑或真实备注保存。" },
  BasicSelect: { layer: "generic", family: "input", recommendedUse: "用于少量静态选项的单选。", boundary: "不承载远程字典、级联、多选搜索或商品类目语义。" },
  BasicRadioGroup: { layer: "generic", family: "input", recommendedUse: "用于少量静态选项的单选组。", boundary: "不承载远程字典、会员标签或用户偏好持久化。" },
  BasicStepper: { layer: "generic", family: "input", recommendedUse: "用于业务无关的数字步进配置。", boundary: "不承载库存、限购、价格联动或购买数量规则。" },
  BasicSwitch: { layer: "generic", family: "input", recommendedUse: "用于业务无关的布尔开关。", boundary: "不承载活动状态、配置保存或审批规则。" },
  BasicCheckbox: { layer: "generic", family: "input", recommendedUse: "用于业务无关的复选确认。", boundary: "不承载协议确认、表单校验或多选数组协议。" },
  BasicForm: { layer: "generic", family: "form", recommendedUse: "用于组合基础输入物料和提交入口。", boundary: "只采集基础子字段值并做本地 required 校验，不承载复杂校验、验证码、风控或远程提交。" },
  LeadFormBlock: { layer: "generic", family: "form", recommendedUse: "用于轻量留资和报名展示。", boundary: "真实提交、校验和风控由宿主 action 或后端服务承接。" },
  BasicText: { layer: "generic", family: "content", recommendedUse: "用于普通文本、标题和强调文案。", boundary: "不承载 CMS、内容审核或富文本编辑。" },
  SectionTitle: { layer: "generic", family: "content", recommendedUse: "用于区块标题、角标和说明。", boundary: "不承载商品、活动或远程栏目语义。" },
  RichTextBlock: { layer: "generic", family: "content", recommendedUse: "用于静态富文本展示。", boundary: "不承载富文本编辑器、内容审核或资源上传。" },
  TabsBlock: { layer: "generic", family: "content", recommendedUse: "用于静态标签切换和分组说明。", boundary: "不支持 tab 内嵌低代码节点或远程分页内容。" },
  BasicTag: { layer: "generic", family: "content", recommendedUse: "用于基础标签、角标和状态文案。", boundary: "不承载优惠券、会员等级或审核状态等业务模型。" },
  DividerBlock: { layer: "generic", family: "content", recommendedUse: "用于页面内容分割。", boundary: "不承载数据、事件或业务规则。" },
  BasicImage: { layer: "generic", family: "media", recommendedUse: "用于单图展示和素材库选图。", boundary: "不承载上传、审核、个性化投放或商品图片规则。" },
  ImageBanner: { layer: "generic", family: "media", recommendedUse: "用于活动横幅、品牌图和运营焦点图。", boundary: "不承载活动库存、权益或投放规则。" },
  BasicCard: { layer: "generic", family: "media", recommendedUse: "用于单张图文卡片。", boundary: "不承载商品、优惠券、直播或门店达人业务模型。" },
  BasicCarousel: { layer: "generic", family: "media", recommendedUse: "用于静态图片轮播和素材分组。", boundary: "不承载 AB 实验、个性化推荐或远程素材编排。" },
  BasicVideo: { layer: "generic", family: "media", recommendedUse: "用于静态视频展示和视频素材选择。", boundary: "不承载上传、转码、直播、广告贴片或审核。" },
  ImageCardGrid: { layer: "generic", family: "list", recommendedUse: "用于静态图片卡片宫格。", boundary: "不承载会场接口、频道数据或个性化推荐。" },
  BasicList: { layer: "generic", family: "list", recommendedUse: "用于静态内容列表。", boundary: "不承载远程分页、搜索、排序或业务对象模型。" },
  BasicAccordion: { layer: "generic", family: "list", recommendedUse: "用于静态 FAQ、规则说明和折叠内容。", boundary: "不承载远程 FAQ、富文本编辑或嵌套低代码节点。" },
  BasicTimeline: { layer: "generic", family: "list", recommendedUse: "用于静态时间线和流程说明。", boundary: "不承载订单、审批、履约或活动状态接口。" },
  BasicAlert: { layer: "generic", family: "feedback", recommendedUse: "用于静态提示、警示和说明。", boundary: "不承载系统消息、错误码、已读状态或内容审核。" },
  BasicStateBlock: { layer: "generic", family: "feedback", recommendedUse: "用于静态空态、加载态、错误态和成功反馈。", boundary: "不承载远程状态流、接口重试、错误码翻译或全局 toast。" },
  BasicProgress: { layer: "generic", family: "feedback", recommendedUse: "用于静态进度、达成率和完成度展示。", boundary: "不承载远程进度、自动刷新、服务端计算、订单状态或审批流。" },
  BasicMetric: { layer: "generic", family: "content", recommendedUse: "用于静态数字指标、配置摘要和轻量数据展示。", boundary: "不承载远程统计、实时刷新、库存计算、销量计算或埋点聚合。" },
  BasicMetricGrid: { layer: "generic", family: "content", recommendedUse: "用于多项静态数字指标和配置摘要成组展示。", boundary: "不承载远程统计、实时刷新、库存计算、销量计算、人数计算或埋点聚合。" },
  NoticeBar: { layer: "generic", family: "feedback", recommendedUse: "用于公告条和运营提醒。", boundary: "不承载远程公告流、跑马灯、关闭记忆或曝光统计。" },
  BasicModal: { layer: "generic", family: "feedback", recommendedUse: "用于基础弹窗和静态说明。", boundary: "不承载远程内容、表单提交、登录、领券或弹窗内低代码编排。" },
  ActivityHero: { layer: "generic", family: "marketing", recommendedUse: "用于活动首屏、主题氛围和头图信息。", boundary: "不承载活动规则、库存、权益或服务端时间语义。" },
  CountdownTimer: { layer: "generic", family: "marketing", recommendedUse: "用于静态倒计时展示。", boundary: "不承载服务端时间校准、活动结束状态或库存联动。" },
  NavGrid: { layer: "generic", family: "marketing", recommendedUse: "用于会场导航和频道入口。", boundary: "不承载远程频道、权限或个性化推荐。" },
  FloorAnchorNav: { layer: "generic", family: "marketing", recommendedUse: "用于页面内楼层锚点导航。", boundary: "不承载服务端楼层配置或复杂滚动策略。" },
  ProductList: { layer: "business", family: "commerce", recommendedUse: "用于商品列表展示和商品数据源消费。", boundary: "不直接请求商品接口，价格、库存和权益由业务系统承接。" },
  ProductRankList: { layer: "business", family: "commerce", recommendedUse: "用于商品榜单和排行会场。", boundary: "排行口径、库存和价格由业务数据源提供。" },
  FlashSaleList: { layer: "business", family: "commerce", recommendedUse: "用于秒杀商品组和限时商品展示。", boundary: "不承载真实秒杀库存、限购、价格计算或风控。" },
  CouponSection: { layer: "business", family: "commerce", recommendedUse: "用于单券或券区展示。", boundary: "不直接领券，权益校验和风控由业务 action handler 承接。" },
  CouponBundle: { layer: "business", family: "commerce", recommendedUse: "用于组合券包展示和券数据配置。", boundary: "不承载真实领券、库存、资格和防刷逻辑。" },
  BrandFeatureSection: { layer: "business", family: "marketing", recommendedUse: "用于品牌专题和品牌商品组合展示。", boundary: "品牌中心、审核和商品数据由外部系统承接。" },
  StoreExpertSection: { layer: "business", family: "commerce", recommendedUse: "用于门店/达人推荐业务场景。", boundary: "门店指标、达人身份和推荐口径由业务系统承接。" },
  LiveEntry: { layer: "business", family: "marketing", recommendedUse: "用于直播入口和直播素材展示。", boundary: "直播状态、开播提醒、权限和观看链路由业务系统承接。" },
  ActivityRuleModal: { layer: "business", family: "marketing", recommendedUse: "用于活动规则弹窗和规则说明。", boundary: "规则中心、审核、远程规则和个性化投放由业务系统承接。" },
  StickyActionBar: { layer: "business", family: "marketing", recommendedUse: "用于底部转化条和活动操作入口。", boundary: "不承载交易、登录、风控、领券或桥接实现。" },
};

function inferLowcodeMaterialArchitectureProfileInput(
  manifest: LowcodeMaterialManifest,
): LowcodeEditorMaterialArchitectureProfileInput {
  if (manifest.category === "commerce") {
    return {
      layer: "business",
      family: "commerce",
      recommendedUse: "用于电商业务场景组合展示。",
      boundary: "业务数据、价格、库存、权益和风控由外部业务系统承接。",
    };
  }
  if (["basic", "layout", "content", "form", "marketing"].includes(manifest.category)) {
    return {
      layer: "generic",
      family: manifest.category === "basic" ? "content" : manifest.category,
      recommendedUse: "用于业务无关的运营页面搭建能力。",
      boundary: "不直接绑定 MeuMall 业务接口或业务项目内部代码。",
    };
  }
  return {
    layer: "custom",
    family: manifest.category || "custom",
    recommendedUse: "作为自定义物料使用前，建议先补充分层和能力族说明。",
    boundary: "默认不承诺业务边界，需由物料提供方补充白名单和治理规则。",
  };
}

export function getLowcodeMaterialLayerMeta(
  layer: LowcodeEditorMaterialLayer | string,
  options: Pick<LowcodeMaterialArchitectureOptions, "layerMeta"> = {},
): LowcodeEditorMaterialLayerMeta {
  const preset = LOWCODE_EDITOR_MATERIAL_LAYER_META[layer as LowcodeEditorMaterialLayer];
  const custom = options.layerMeta?.[layer] ?? {};
  return {
    label: custom.label ?? preset?.label ?? layer,
    description: custom.description ?? preset?.description ?? "自定义物料分层，具体治理规则由宿主物料中心补充。",
  };
}

export function getLowcodeMaterialFamilyMeta(
  family: string,
  options: Pick<LowcodeMaterialArchitectureOptions, "familyMeta"> = {},
): LowcodeEditorMaterialFamilyMeta {
  const preset = LOWCODE_EDITOR_MATERIAL_FAMILY_META[family];
  const custom = options.familyMeta?.[family] ?? {};
  return {
    label: custom.label ?? preset?.label ?? family,
    description: custom.description ?? preset?.description ?? "自定义能力族，建议补充用途和复用边界。",
    primitiveHint: custom.primitiveHint ?? preset?.primitiveHint ?? "按物料详情确认可复用的基础组件能力。",
  };
}

export function createLowcodeMaterialArchitectureProfile(
  manifest: LowcodeMaterialManifest,
  options: LowcodeMaterialArchitectureOptions = {},
): LowcodeEditorMaterialArchitectureProfile {
  const inferred = inferLowcodeMaterialArchitectureProfileInput(manifest);
  const preset = LOWCODE_EDITOR_MATERIAL_COMPONENT_PROFILES[manifest.componentName] ?? {};
  const custom = options.componentProfiles?.[manifest.componentName] ?? {};
  const layer = custom.layer ?? preset.layer ?? inferred.layer ?? "custom";
  const family = custom.family ?? preset.family ?? inferred.family ?? manifest.category;
  const layerMeta = getLowcodeMaterialLayerMeta(layer, options);
  const familyMeta = getLowcodeMaterialFamilyMeta(family, options);
  return {
    componentName: manifest.componentName,
    layer,
    layerLabel: layerMeta.label,
    layerDescription: layerMeta.description,
    family,
    familyLabel: familyMeta.label,
    familyDescription: familyMeta.description,
    primitiveHint: custom.primitiveHint ?? preset.primitiveHint ?? familyMeta.primitiveHint,
    recommendedUse: custom.recommendedUse ?? preset.recommendedUse ?? inferred.recommendedUse ?? "用于低代码页面搭建。",
    boundary: custom.boundary ?? preset.boundary ?? inferred.boundary ?? "具体边界以物料 manifest 和物料详情为准。",
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
  const categoryMeta = getLowcodeMaterialCategoryMeta(manifest.category);
  const architectureProfile = createLowcodeMaterialArchitectureProfile(manifest);
  return {
    componentName: manifest.componentName,
    title: manifest.title,
    category: manifest.category,
    categoryLabel: categoryMeta.label,
    categoryDescription: categoryMeta.description,
    layer: architectureProfile.layer,
    layerLabel: architectureProfile.layerLabel,
    family: architectureProfile.family,
    familyLabel: architectureProfile.familyLabel,
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
      categoryMeta.label,
      architectureProfile.layerLabel,
      architectureProfile.familyLabel,
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

export function createLowcodeMaterialNodeInputFromPreset(
  manifest: LowcodeMaterialManifest,
  preset: LowcodeEditorMaterialInsertPresetInput | LowcodeEditorMaterialInsertPreset,
  options: CreateLowcodeMaterialNodeInputFromPresetOptions = {},
): LowcodeEditorNodeInput {
  const normalizedPreset = normalizeLowcodeMaterialInsertPreset(manifest, preset);
  const baseInput = createLowcodeMaterialNodeInput(manifest, {
    ...options,
    metaName: options.metaName ?? normalizedPreset.metaName,
  });
  return {
    ...baseInput,
    props: {
      ...(baseInput.props ?? {}),
      ...cloneJson(normalizedPreset.props),
    },
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

export function createLowcodeMaterialCategorySummaries(
  manifests: Iterable<LowcodeMaterialManifest>,
  options: LowcodeMaterialCategorySummaryOptions = {},
): LowcodeEditorMaterialCategorySummary[] {
  const manifestList = Array.from(manifests);
  const allCategoryLabel = options.allCategoryLabel ?? "全部";
  const activeCategory = options.category ?? allCategoryLabel;
  const categoryValues = createLowcodeMaterialCategories(manifestList, allCategoryLabel);
  const values = categoryValues.includes(activeCategory) ? categoryValues : [...categoryValues, activeCategory];

  return values.map((value) => {
    const meta = getLowcodeMaterialCategoryMeta(value, options);
    const scopedManifests = value === allCategoryLabel ? manifestList : manifestList.filter((manifest) => manifest.category === value);
    const visibleCount = filterLowcodeMaterialCatalog(scopedManifests.map((manifest) => ({ manifest })), {
      keyword: options.keyword,
      category: allCategoryLabel,
      allCategoryLabel,
    }).length;
    const keyword = options.keyword?.trim();
    return {
      value,
      label: meta.label,
      description: meta.description,
      count: scopedManifests.length,
      visibleCount,
      active: value === activeCategory,
      summaryText: keyword ? `匹配 ${visibleCount}/${scopedManifests.length} 个物料` : `${scopedManifests.length} 个物料`,
    };
  });
}

export function createLowcodeMaterialCatalogOverview(
  manifests: Iterable<LowcodeMaterialManifest>,
  options: LowcodeMaterialCategorySummaryOptions = {},
): LowcodeEditorMaterialCatalogOverview {
  const allCategoryLabel = options.allCategoryLabel ?? "全部";
  const categories = createLowcodeMaterialCategorySummaries(manifests, options);
  const allCategory = categories.find((item) => item.value === allCategoryLabel) ?? categories[0];
  const activeCategory = categories.find((item) => item.active) ?? allCategory;
  return {
    totalCount: allCategory?.count ?? 0,
    visibleCount: activeCategory?.visibleCount ?? 0,
    activeCategory: activeCategory?.value ?? allCategoryLabel,
    activeLabel: activeCategory?.label ?? allCategoryLabel,
    activeDescription: activeCategory?.description ?? "",
    activeCount: activeCategory?.count ?? 0,
    summaryText: activeCategory?.summaryText ?? "0 个物料",
    categories,
  };
}

function createLowcodeMaterialArchitectureSummaryText(
  items: readonly { label: string; visibleCount: number }[],
  emptyText: string,
): string {
  const visibleItems = items.filter((item) => item.visibleCount > 0);
  if (!visibleItems.length) return emptyText;
  return visibleItems.slice(0, 3).map((item) => `${item.label} ${item.visibleCount} 个`).join(" / ");
}

export function createLowcodeMaterialArchitectureOverview(
  manifests: Iterable<LowcodeMaterialManifest>,
  options: LowcodeMaterialArchitectureOptions = {},
): LowcodeEditorMaterialArchitectureOverview {
  const manifestList = Array.from(manifests);
  const allCategoryLabel = options.allCategoryLabel ?? "全部";
  const category = options.category ?? allCategoryLabel;
  const scopedManifests = category === allCategoryLabel
    ? manifestList
    : manifestList.filter((manifest) => manifest.category === category);
  const visibleManifests = filterLowcodeMaterialCatalog(scopedManifests.map((manifest) => ({ manifest })), {
    keyword: options.keyword,
    category: allCategoryLabel,
    allCategoryLabel,
  }).map((item) => item.manifest);
  const scopedProfiles = scopedManifests.map((manifest) => createLowcodeMaterialArchitectureProfile(manifest, options));
  const visibleProfiles = visibleManifests.map((manifest) => createLowcodeMaterialArchitectureProfile(manifest, options));
  const visibleLayerCounts = new Map<string, number>();
  const visibleFamilyCounts = new Map<string, number>();
  visibleProfiles.forEach((profile) => {
    visibleLayerCounts.set(profile.layer, (visibleLayerCounts.get(profile.layer) ?? 0) + 1);
    visibleFamilyCounts.set(profile.family, (visibleFamilyCounts.get(profile.family) ?? 0) + 1);
  });
  const layerOrder = [
    ...Object.keys(LOWCODE_EDITOR_MATERIAL_LAYER_META),
    ...scopedProfiles.map((profile) => profile.layer).filter((value) => !Object.keys(LOWCODE_EDITOR_MATERIAL_LAYER_META).includes(value)),
  ];
  const familyOrder = [
    ...Object.keys(LOWCODE_EDITOR_MATERIAL_FAMILY_META),
    ...scopedProfiles.map((profile) => profile.family).filter((value) => !Object.keys(LOWCODE_EDITOR_MATERIAL_FAMILY_META).includes(value)),
  ];
  const layers = Array.from(new Set(layerOrder))
    .map((value) => {
      const count = scopedProfiles.filter((profile) => profile.layer === value).length;
      const visibleCount = visibleLayerCounts.get(value) ?? 0;
      const meta = getLowcodeMaterialLayerMeta(value, options);
      return {
        value,
        label: meta.label,
        description: meta.description,
        count,
        visibleCount,
        summaryText: `${visibleCount}/${count} 个可见物料`,
      };
    })
    .filter((item) => item.count > 0);
  const families = Array.from(new Set(familyOrder))
    .map((value) => {
      const count = scopedProfiles.filter((profile) => profile.family === value).length;
      const visibleCount = visibleFamilyCounts.get(value) ?? 0;
      const meta = getLowcodeMaterialFamilyMeta(value, options);
      return {
        value,
        label: meta.label,
        description: meta.description,
        primitiveHint: meta.primitiveHint,
        count,
        visibleCount,
        summaryText: `${visibleCount}/${count} 个可见物料`,
      };
    })
    .filter((item) => item.count > 0);
  return {
    totalCount: scopedManifests.length,
    visibleCount: visibleManifests.length,
    layerSummaryText: createLowcodeMaterialArchitectureSummaryText(layers, "暂无可见分层"),
    familySummaryText: createLowcodeMaterialArchitectureSummaryText(families, "暂无可见能力族"),
    layers,
    families,
  };
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

export function mergeLowcodeEditorPermissionStates(
  ...states: Array<Partial<LowcodeEditorPermissionState> | undefined>
): LowcodeEditorPermissionState {
  return LOWCODE_EDITOR_PERMISSION_ACTIONS.reduce((merged, action) => {
    const denied = states
      .map((state) => state?.[action])
      .find((decision) => decision && !decision.allowed);
    merged[action] = denied
      ? { action, allowed: false, reason: denied.reason }
      : { action, allowed: true };
    return merged;
  }, {} as LowcodeEditorPermissionState);
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

function createLowcodeEditorPublishCheckStatusItem(
  summary: LowcodeEditorPublishCheckSummary | undefined,
): LowcodeEditorCapabilityStatusItem | undefined {
  if (!summary) return undefined;
  const description = `通过 ${summary.pass} / 警告 ${summary.warning} / 错误 ${summary.error}`;
  if (summary.error > 0) {
    return {
      id: "publish-check",
      title: "发布检查阻塞",
      description,
      tone: "danger",
    };
  }
  if (summary.warning > 0) {
    return {
      id: "publish-check",
      title: "发布检查有提醒",
      description,
      tone: "warning",
    };
  }
  return {
    id: "publish-check",
    title: "发布检查通过",
    description,
    tone: "success",
  };
}

function getLowcodeEditorPublishBlockedReason(
  summary: LowcodeEditorPublishCheckSummary | undefined,
  fallbackReason: string | undefined,
): string | undefined {
  if (!summary || summary.error <= 0) return undefined;
  return fallbackReason ?? `存在 ${summary.error} 个发布检查错误，修复后再继续。`;
}

function uniqueLowcodeEditorReasons(reasons: readonly (string | undefined)[]): string[] {
  return [...new Set(reasons.filter((reason): reason is string => Boolean(reason)))];
}

export function createLowcodeEditorCapabilityState(
  options: CreateLowcodeEditorCapabilityStateOptions = {},
): LowcodeEditorCapabilityState {
  const collaboration = options.collaboration ?? createLowcodeEditorCollaborationState();
  const approval = options.approval ?? createLowcodeEditorApprovalState();
  const collaborationOptions = createLowcodeEditorCollaborationPermissionOptions(collaboration);
  const approvalOptions = createLowcodeEditorApprovalPermissionOptions(approval);
  const workflowPermissionState = createLowcodeEditorPermissionState({
    readonly: Boolean(collaborationOptions.readonly || approvalOptions.readonly),
    readonlyReason: collaborationOptions.readonlyReason ?? approvalOptions.readonlyReason,
    decisions: {
      ...(approvalOptions.decisions ?? {}),
    },
  });
  const permissionState = mergeLowcodeEditorPermissionStates(workflowPermissionState, options.permissionState);
  const publishBlockedReason = getLowcodeEditorPublishBlockedReason(options.publishCheckSummary, options.publishBlockedReason);
  const actions = options.actions ?? LOWCODE_EDITOR_DEFAULT_CAPABILITY_ACTIONS;
  const publishBlockedActions = new Set<LowcodeEditorPermissionAction>([
    "approval.submit",
    "preview.create",
    "publish.submit",
  ]);
  const disabledActions = actions.reduce<Partial<Record<LowcodeEditorPermissionAction, string>>>((result, action) => {
    const permissionReason = getLowcodeEditorActionDisabledReason(permissionState, action);
    const reason = permissionReason ?? (publishBlockedReason && publishBlockedActions.has(action) ? publishBlockedReason : undefined);
    if (reason) result[action] = reason;
    return result;
  }, {});
  const hasMutationPermission = LOWCODE_EDITOR_MUTATING_PERMISSION_ACTIONS.some((action) =>
    isLowcodeEditorActionAllowed(permissionState, action),
  );
  const statusItems: LowcodeEditorCapabilityStatusItem[] = [
    {
      id: "collaboration",
      title: collaboration.title,
      description: collaboration.description,
      tone: collaboration.tone,
    },
    {
      id: "approval",
      title: approval.title,
      description: approval.description,
      tone: approval.tone,
    },
  ];
  const publishCheckStatusItem = createLowcodeEditorPublishCheckStatusItem(options.publishCheckSummary);
  if (publishCheckStatusItem) statusItems.push(publishCheckStatusItem);
  const editable = collaboration.editable && approval.editable && hasMutationPermission;
  const submittable = approval.submittable
    && !publishBlockedReason
    && isLowcodeEditorActionAllowed(permissionState, "approval.submit");
  const publishable = approval.publishable
    && !publishBlockedReason
    && isLowcodeEditorActionAllowed(permissionState, "publish.submit");

  return {
    collaboration,
    approval,
    permissionState,
    editable,
    readonly: !editable,
    submittable,
    publishable,
    disabledActions,
    statusItems,
    blockingReasons: uniqueLowcodeEditorReasons([
      collaboration.readonlyReason,
      approval.readonlyReason,
      approval.submitDisabledReason,
      approval.publishDisabledReason,
      publishBlockedReason,
      ...Object.values(disabledActions),
    ]),
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

function getLowcodeMaterialInsertBaseDisabledReason(
  options: CreateLowcodeMaterialInsertTargetsOptions,
): string | undefined {
  if (options.hasMaterial === false) return options.missingMaterialReason ?? "请先选择要插入的物料。";
  if (options.canInsert === false) return options.disabledReason ?? "当前不可插入物料。";
  return undefined;
}

export function createLowcodeMaterialInsertTarget(
  options: CreateLowcodeMaterialInsertTargetOptions,
): LowcodeEditorMaterialInsertTarget {
  const materialTitle = options.materialTitle ?? "选中物料";
  const selectedTitle = options.selectedRow?.title ?? "当前节点";
  const baseDisabledReason = getLowcodeMaterialInsertBaseDisabledReason(options);
  const disabledBySelectionReason = options.missingSelectedNodeReason ?? "请先选中一个画布节点。";
  const disabledByContainerReason = options.missingContainerReason ?? "当前选中节点不是容器。";

  if (options.placement === "append") {
    return {
      placement: "append",
      label: "追加到页面",
      description: `把 ${materialTitle} 添加到页面末尾。`,
      disabled: Boolean(baseDisabledReason),
      disabledReason: baseDisabledReason,
    };
  }

  if (options.placement === "before") {
    const disabledReason = baseDisabledReason ?? (options.selectedRow ? undefined : disabledBySelectionReason);
    return {
      placement: "before",
      label: "前方插入",
      description: options.selectedRow ? `插入到 ${selectedTitle} 前方。` : "插入到当前选中节点前方。",
      disabled: Boolean(disabledReason),
      disabledReason,
      parentId: options.selectedRow?.parentId,
      index: options.selectedRow?.index,
      action: "insertBefore",
    };
  }

  if (options.placement === "after") {
    const disabledReason = baseDisabledReason ?? (options.selectedRow ? undefined : disabledBySelectionReason);
    return {
      placement: "after",
      label: "后方插入",
      description: options.selectedRow ? `插入到 ${selectedTitle} 后方。` : "插入到当前选中节点后方。",
      disabled: Boolean(disabledReason),
      disabledReason,
      parentId: options.selectedRow?.parentId,
      index: options.selectedRow ? options.selectedRow.index + 1 : undefined,
      action: "insertAfter",
    };
  }

  const disabledReason = baseDisabledReason
    ?? (options.selectedRow ? undefined : disabledBySelectionReason)
    ?? (options.selectedNodeIsContainer ? undefined : disabledByContainerReason);
  return {
    placement: "inside",
    label: "加入容器",
    description: options.selectedRow ? `加入 ${selectedTitle} 容器内部。` : "加入当前选中容器内部。",
    disabled: Boolean(disabledReason),
    disabledReason,
    parentId: disabledReason ? undefined : options.selectedRow?.node.id,
    action: "addInside",
  };
}

export function createLowcodeMaterialInsertTargets(
  options: CreateLowcodeMaterialInsertTargetsOptions = {},
): LowcodeEditorMaterialInsertTarget[] {
  return [
    createLowcodeMaterialInsertTarget({ ...options, placement: "append" }),
    createLowcodeMaterialInsertTarget({ ...options, placement: "before" }),
    createLowcodeMaterialInsertTarget({ ...options, placement: "after" }),
    createLowcodeMaterialInsertTarget({ ...options, placement: "inside" }),
  ];
}

export function insertLowcodeMaterialByTarget(
  state: LowcodeEditorState,
  node: LowcodeEditorNodeInput,
  target: LowcodeEditorMaterialInsertTarget,
): LowcodeEditorState {
  if (target.disabled) return state;
  if (target.placement === "append") return appendNode(state, node);
  return insertNode(state, node, {
    parentId: target.parentId,
    index: target.index,
    select: true,
  });
}

export function insertLowcodeMaterialPresetByTarget(
  state: LowcodeEditorState,
  manifest: LowcodeMaterialManifest,
  preset: LowcodeEditorMaterialInsertPresetInput | LowcodeEditorMaterialInsertPreset,
  target: LowcodeEditorMaterialInsertTarget,
  options: CreateLowcodeMaterialNodeInputFromPresetOptions = {},
): LowcodeEditorState {
  return insertLowcodeMaterialByTarget(
    state,
    createLowcodeMaterialNodeInputFromPreset(manifest, preset, options),
    target,
  );
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

export function isLowcodeEditorContainerComponentName(
  componentName: string,
  insideComponentNames: Iterable<string> = LOWCODE_EDITOR_DEFAULT_CANVAS_INSIDE_COMPONENT_NAMES,
): boolean {
  return new Set(insideComponentNames).has(componentName);
}

export function resolveLowcodeCanvasDropPlacement(
  point: Pick<LowcodeEditorCanvasPoint, "clientY">,
  targetNode: Pick<LowcodeNode, "componentName">,
  targetRect: Pick<LowcodeEditorCanvasRect, "top" | "height">,
  options: ResolveLowcodeCanvasDropPlacementOptions = {},
): Exclude<LowcodeEditorCanvasDropPlacement, "append"> {
  const ratio = targetRect.height > 0 ? (point.clientY - targetRect.top) / targetRect.height : 0.5;
  const insideComponentNames = options.insideComponentNames ?? LOWCODE_EDITOR_DEFAULT_CANVAS_INSIDE_COMPONENT_NAMES;
  const insideMinRatio = options.insideMinRatio ?? 0.28;
  const insideMaxRatio = options.insideMaxRatio ?? 0.72;

  if (
    isLowcodeEditorContainerComponentName(targetNode.componentName, insideComponentNames) &&
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
  const validationPropNames = new Set(options.validationPropNames ?? DEFAULT_VALIDATION_PROP_NAMES);
  const behaviorPropNames = new Set(options.behaviorPropNames ?? DEFAULT_BEHAVIOR_PROP_NAMES);

  if (validationPropNames.has(propName) || /^(required|validation|error)(message|text)?$/i.test(propName)) {
    return "validation";
  }
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
  if (contentPropNames.has(propName) || ["image", "video", "richText", "textarea"].includes(propSchema.setter)) {
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
  if (propName === "items" && options.componentName === "BasicCarousel") {
    return { id, title: "新轮播图", subtitle: "请输入说明", badgeText: "推荐", imageUrl: "", linkUrl: "" };
  }
  if (propName === "items" && options.componentName === "BasicList") {
    return { id, title: "新列表项", description: "请输入列表说明", badgeText: "1", metaText: "" };
  }
  if (propName === "items" && options.componentName === "BasicAccordion") {
    return { id, title: "新折叠项", content: "请输入折叠内容", badgeText: "说明" };
  }
  if (propName === "items" && options.componentName === "BasicTimeline") {
    return { id, title: "新时间线节点", description: "请输入节点说明", timeText: "新节点", badgeText: "节点", status: "pending" };
  }
  if (propName === "items" && options.componentName === "BasicMetricGrid") {
    return { id, label: "新指标", value: "0", suffix: "", helperText: "请输入说明" };
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

  const missingVideoChecks = nodes.flatMap((node) => {
    const manifest = manifests.get(node.componentName);
    if (!manifest) return [];

    return Object.entries(manifest.propsSchema)
      .filter(([, propSchema]) => propSchema.setter === "video")
      .filter(([propName]) => {
        const value = node.props[propName];
        return typeof value !== "string" || value.trim().length === 0;
      })
      .map(([propName, propSchema]) => ({
        id: `video-${node.id}-${propName}`,
        title: "视频素材",
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
    ...(missingVideoChecks.length ? missingVideoChecks : [{
      id: "videos",
      title: "视频素材",
      status: "pass" as const,
      description: "视频类字段已配置",
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

export function createLowcodePublishRiskSummary(
  checks: readonly LowcodeEditorPublishCheck[],
  options: CreateLowcodePublishRiskSummaryOptions = {},
): LowcodeEditorPublishRiskSummary {
  const maxPriorityItems = Math.max(0, Math.floor(options.maxPriorityItems ?? 3));
  const summary = summarizeLowcodePublishChecks([...checks]);
  const riskChecks = checks
    .filter((check): check is LowcodeEditorPublishCheck & { status: "error" | "warning" } => check.status !== "pass")
    .sort((a, b) => getPublishRiskStatusWeight(a.status) - getPublishRiskStatusWeight(b.status));
  const priorityItems = riskChecks.slice(0, maxPriorityItems).map((check) => ({
    id: check.id,
    title: check.title,
    description: check.description,
    status: check.status,
    nodeId: check.nodeId,
    nodeTitle: check.nodeTitle,
    actionText: check.nodeId ? "定位处理" : check.status === "error" ? "修复配置" : "检查配置",
  }));

  if (summary.error > 0) {
    return {
      level: "blocked",
      title: "发布前需要处理阻塞项",
      description: "存在会阻止生成预览或发布的配置问题，建议先按优先项逐个修复。",
      statusText: `${summary.error} 个阻塞项 / ${summary.warning} 个提醒`,
      primaryActionText: "先处理阻塞项",
      blockingCount: summary.error,
      warningCount: summary.warning,
      passCount: summary.pass,
      priorityItems,
    };
  }

  if (summary.warning > 0) {
    return {
      level: "warning",
      title: "可以生成预览，仍有提醒",
      description: "当前没有阻塞项，但素材、商品或动作等配置仍有优化空间。",
      statusText: `${summary.warning} 个提醒 / ${summary.pass} 项通过`,
      primaryActionText: "检查提醒项",
      blockingCount: summary.error,
      warningCount: summary.warning,
      passCount: summary.pass,
      priorityItems,
    };
  }

  return {
    level: "ready",
    title: "发布检查已通过",
    description: "页面结构、素材、数据源和动作配置当前没有发现阻塞或提醒。",
    statusText: `${summary.pass} 项通过`,
    primaryActionText: "可以生成预览",
    blockingCount: summary.error,
    warningCount: summary.warning,
    passCount: summary.pass,
    priorityItems,
  };
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

function getPublishRiskStatusWeight(status: LowcodeEditorPublishCheckStatus): number {
  if (status === "error") return 0;
  if (status === "warning") return 1;
  return 2;
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
  if (propName === "items" && componentName === "BasicCarousel") return ["id", "title", "subtitle", "badgeText", "imageUrl", "linkUrl"];
  if (propName === "items" && componentName === "BasicList") return ["id", "title", "description", "badgeText", "metaText"];
  if (propName === "items" && componentName === "BasicAccordion") return ["id", "title", "content", "badgeText"];
  if (propName === "items" && componentName === "BasicTimeline") return ["id", "title", "description", "timeText", "badgeText", "status"];
  if (propName === "items" && componentName === "BasicMetricGrid") return ["id", "label", "value", "prefix", "suffix", "helperText"];
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
