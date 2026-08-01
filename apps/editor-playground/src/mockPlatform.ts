import type {
  ConfigPlatformApprovalInput,
  ConfigPlatformEditorDraftSnapshot,
  ConfigPlatformEditorDraftSnapshotInput,
  ConfigPlatformEditorWorkflowState,
  ConfigPlatformLockInput,
  ConfigPlatformOperatorInfo,
  ConfigPlatformReviewApprovalInput,
  LowcodeConfigPlatformClient,
} from "@meumall/lowcode-adapters";
import {
  validateLowcodePageSchema,
  type LowcodePageSchema,
  type LowcodePageStatus,
} from "@meumall/lowcode-schema";

const RELEASES_KEY = "meumall-lowcode-local-platform-releases";
const DRAFT_INDEX_KEY = "meumall-lowcode-local-platform-draft-index";
const PUBLISHED_INDEX_KEY = "meumall-lowcode-local-platform-published-index";
const WORKFLOW_KEY = "meumall-lowcode-local-platform-workflows";
const EDITOR_DRAFT_SNAPSHOT_KEY = "meumall-lowcode-local-platform-editor-draft-snapshots";
const DEFAULT_LOCK_TTL_SECONDS = 20 * 60;

export const localOperator: ConfigPlatformOperatorInfo = {
  id: "operator-me",
  name: "当前运营",
};

export type LocalReleaseKind = "draft" | "preview" | "published";

export interface LocalPageRelease {
  id: string;
  kind: LocalReleaseKind;
  pageId: string;
  pageVersion: string;
  title: string;
  note?: string;
  previewToken?: string;
  createdAt: string;
  schema: LowcodePageSchema;
}

interface LocalReleaseOptions {
  note?: string;
}

function cloneSchema(schema: LowcodePageSchema): LowcodePageSchema {
  return JSON.parse(JSON.stringify(schema)) as LowcodePageSchema;
}

function cloneWorkflowState(state: ConfigPlatformEditorWorkflowState): ConfigPlatformEditorWorkflowState {
  return JSON.parse(JSON.stringify(state)) as ConfigPlatformEditorWorkflowState;
}

function cloneDraftSnapshot(snapshot: ConfigPlatformEditorDraftSnapshot): ConfigPlatformEditorDraftSnapshot {
  return JSON.parse(JSON.stringify(snapshot)) as ConfigPlatformEditorDraftSnapshot;
}

function readJson<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function createReleaseId(kind: LocalReleaseKind): string {
  return `${kind}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function createPreviewToken(releaseId: string): string {
  return `pt_${releaseId.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

function formatVersion(kind: LocalReleaseKind, schema: LowcodePageSchema): string {
  const now = new Date();
  const stamp = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  if (kind === "published") return `prod-${stamp}`;
  if (kind === "preview") return `preview-${stamp}`;
  return schema.pageVersion || `draft-${stamp}`;
}

function createSchemaForRelease(
  source: LowcodePageSchema,
  kind: LocalReleaseKind,
  pageStatus: LowcodePageStatus,
): LowcodePageSchema {
  const now = new Date().toISOString();
  const schema = cloneSchema(source);
  schema.status = pageStatus;
  schema.pageVersion = formatVersion(kind, schema);
  schema.publishMeta = {
    ...schema.publishMeta,
    publishedAt: kind === "published" ? now : schema.publishMeta.publishedAt,
    operator: "local-admin",
  };
  return schema;
}

function readReleases(): LocalPageRelease[] {
  return readJson<LocalPageRelease[]>(RELEASES_KEY, []).filter((release) => {
    return validateLowcodePageSchema(release.schema).valid;
  });
}

function writeReleases(releases: LocalPageRelease[]): void {
  writeJson(RELEASES_KEY, releases);
}

function saveRelease(schema: LowcodePageSchema, kind: LocalReleaseKind, pageStatus: LowcodePageStatus, options: LocalReleaseOptions = {}): LocalPageRelease {
  const releaseSchema = createSchemaForRelease(schema, kind, pageStatus);
  const releaseId = createReleaseId(kind);
  const release: LocalPageRelease = {
    id: releaseId,
    kind,
    pageId: releaseSchema.pageId,
    pageVersion: releaseSchema.pageVersion,
    title: releaseSchema.title,
    note: options.note?.trim() || undefined,
    previewToken: kind === "preview" ? createPreviewToken(releaseId) : undefined,
    createdAt: new Date().toISOString(),
    schema: releaseSchema,
  };
  const releases = [release, ...readReleases()].slice(0, 30);
  writeReleases(releases);
  return release;
}

function readIndex(key: string): Record<string, string> {
  return readJson<Record<string, string>>(key, {});
}

function writeIndex(key: string, pageId: string, releaseId: string): void {
  writeJson(key, {
    ...readIndex(key),
    [pageId]: releaseId,
  });
}

function readWorkflows(): Record<string, ConfigPlatformEditorWorkflowState> {
  return readJson<Record<string, ConfigPlatformEditorWorkflowState>>(WORKFLOW_KEY, {});
}

function writeWorkflows(workflows: Record<string, ConfigPlatformEditorWorkflowState>): void {
  writeJson(WORKFLOW_KEY, workflows);
}

function readDraftSnapshots(): Record<string, ConfigPlatformEditorDraftSnapshot> {
  const snapshots = readJson<Record<string, ConfigPlatformEditorDraftSnapshot>>(EDITOR_DRAFT_SNAPSHOT_KEY, {});
  return Object.fromEntries(
    Object.entries(snapshots).filter(([, snapshot]) => {
      return Boolean(snapshot?.pageId && snapshot.updatedAt && validateLowcodePageSchema(snapshot.schema).valid);
    }),
  );
}

function writeDraftSnapshots(snapshots: Record<string, ConfigPlatformEditorDraftSnapshot>): void {
  writeJson(EDITOR_DRAFT_SNAPSHOT_KEY, snapshots);
}

export function createDefaultEditorWorkflowState(pageId: string): ConfigPlatformEditorWorkflowState {
  return {
    pageId,
    lock: {
      status: "unlocked",
    },
    approval: {
      status: "none",
    },
    updatedAt: new Date().toISOString(),
  };
}

export function writeEditorWorkflowState(state: ConfigPlatformEditorWorkflowState): ConfigPlatformEditorWorkflowState {
  const nextState = cloneWorkflowState({
    ...state,
    updatedAt: new Date().toISOString(),
  });
  writeWorkflows({
    ...readWorkflows(),
    [nextState.pageId]: nextState,
  });
  return cloneWorkflowState(nextState);
}

export function getEditorWorkflowState(pageId: string): ConfigPlatformEditorWorkflowState {
  const stored = readWorkflows()[pageId];
  if (stored) return cloneWorkflowState(stored);
  return writeEditorWorkflowState(createDefaultEditorWorkflowState(pageId));
}

export function saveEditorDraftSnapshot(input: ConfigPlatformEditorDraftSnapshotInput): ConfigPlatformEditorDraftSnapshot {
  const validation = validateLowcodePageSchema(input.schema);
  if (!validation.valid) {
    throw new Error(`自动草稿快照 schema 不合法：${validation.errors.join("; ")}`);
  }
  const snapshot: ConfigPlatformEditorDraftSnapshot = {
    pageId: input.pageId,
    schema: cloneSchema(input.schema),
    updatedAt: new Date().toISOString(),
    operator: input.operator ?? localOperator,
  };
  writeDraftSnapshots({
    ...readDraftSnapshots(),
    [input.pageId]: snapshot,
  });
  return cloneDraftSnapshot(snapshot);
}

export function getEditorDraftSnapshot(pageId: string): ConfigPlatformEditorDraftSnapshot | undefined {
  const snapshot = readDraftSnapshots()[pageId];
  return snapshot ? cloneDraftSnapshot(snapshot) : undefined;
}

function getLockExpiresAt(ttlSeconds: number | undefined): string {
  const ttl = typeof ttlSeconds === "number" && ttlSeconds > 0 ? ttlSeconds : DEFAULT_LOCK_TTL_SECONDS;
  return new Date(Date.now() + ttl * 1000).toISOString();
}

function updateEditorWorkflowState(
  pageId: string,
  updater: (current: ConfigPlatformEditorWorkflowState) => ConfigPlatformEditorWorkflowState,
): ConfigPlatformEditorWorkflowState {
  return writeEditorWorkflowState(updater(getEditorWorkflowState(pageId)));
}

export function acquireEditorLock(input: ConfigPlatformLockInput): ConfigPlatformEditorWorkflowState {
  return updateEditorWorkflowState(input.pageId, (current) => ({
    ...current,
    lock: {
      status: "locked-by-me",
      holder: input.operator ?? localOperator,
      lockedAt: new Date().toISOString(),
      expiresAt: getLockExpiresAt(input.ttlSeconds),
    },
  }));
}

export function refreshEditorLock(input: ConfigPlatformLockInput): ConfigPlatformEditorWorkflowState {
  return updateEditorWorkflowState(input.pageId, (current) => ({
    ...current,
    lock: {
      ...current.lock,
      status: current.lock.status === "unlocked" ? "locked-by-me" : current.lock.status,
      holder: current.lock.holder ?? input.operator ?? localOperator,
      expiresAt: getLockExpiresAt(input.ttlSeconds),
    },
  }));
}

export function releaseEditorLock(input: ConfigPlatformLockInput): ConfigPlatformEditorWorkflowState {
  return updateEditorWorkflowState(input.pageId, (current) => ({
    ...current,
    lock: {
      status: "unlocked",
      reason: input.operator?.name ? `${input.operator.name} 已释放编辑锁` : undefined,
    },
  }));
}

export function submitApproval(input: ConfigPlatformApprovalInput): ConfigPlatformEditorWorkflowState {
  return updateEditorWorkflowState(input.pageId, (current) => ({
    ...current,
    approval: {
      status: "pending",
      submitter: input.operator ?? localOperator,
      submittedAt: new Date().toISOString(),
      comment: input.comment,
    },
  }));
}

export function cancelApproval(input: ConfigPlatformApprovalInput): ConfigPlatformEditorWorkflowState {
  return updateEditorWorkflowState(input.pageId, (current) => ({
    ...current,
    approval: {
      status: "draft",
      submitter: input.operator ?? current.approval.submitter,
      comment: input.comment,
      reason: input.comment || "审批已撤回，可继续编辑。",
    },
  }));
}

export function reviewApproval(input: ConfigPlatformReviewApprovalInput): ConfigPlatformEditorWorkflowState {
  return updateEditorWorkflowState(input.pageId, (current) => ({
    ...current,
    approval: {
      status: input.approved ? "approved" : "rejected",
      submitter: current.approval.submitter,
      reviewer: input.operator ?? localOperator,
      submittedAt: current.approval.submittedAt,
      reviewedAt: new Date().toISOString(),
      comment: input.comment,
      reason: input.reason,
    },
  }));
}

export function saveDraft(schema: LowcodePageSchema, options: LocalReleaseOptions = {}): LocalPageRelease {
  const release = saveRelease(schema, "draft", "draft", options);
  writeIndex(DRAFT_INDEX_KEY, release.pageId, release.id);
  return release;
}

export function createPreview(schema: LowcodePageSchema, options: LocalReleaseOptions = {}): LocalPageRelease {
  return saveRelease(schema, "preview", "preview", options);
}

export function publishPage(schema: LowcodePageSchema, options: LocalReleaseOptions = {}): LocalPageRelease {
  const release = saveRelease(schema, "published", "published", options);
  writeIndex(PUBLISHED_INDEX_KEY, release.pageId, release.id);
  updateEditorWorkflowState(release.pageId, (current) => ({
    ...current,
    approval: {
      ...current.approval,
      status: "published",
      reason: "当前版本已发布。",
    },
  }));
  return release;
}

export function listReleases(pageId?: string): LocalPageRelease[] {
  const releases = readReleases();
  const normalizedReleases = releases.map((release) => ({
    ...release,
    note: typeof release.note === "string" ? release.note : undefined,
    previewToken: typeof release.previewToken === "string" ? release.previewToken : undefined,
  }));
  return pageId ? normalizedReleases.filter((release) => release.pageId === pageId) : normalizedReleases;
}

export function getRelease(releaseId: string): LocalPageRelease | undefined {
  return readReleases().find((release) => release.id === releaseId);
}

export function getPreviewByToken(previewToken: string): LocalPageRelease | undefined {
  return readReleases().find((release) => release.kind === "preview" && release.previewToken === previewToken);
}

export function getDraft(pageId: string): LowcodePageSchema | undefined {
  const releaseId = readIndex(DRAFT_INDEX_KEY)[pageId];
  return releaseId ? getRelease(releaseId)?.schema : undefined;
}

export function getPublished(pageId: string): LowcodePageSchema | undefined {
  const releaseId = readIndex(PUBLISHED_INDEX_KEY)[pageId];
  return releaseId ? getRelease(releaseId)?.schema : undefined;
}

export const localConfigPlatformClient = {
  saveDraft(schema: LowcodePageSchema, options: LocalReleaseOptions = {}) {
    return saveDraft(schema, options);
  },
  createPreview(schema: LowcodePageSchema, options: LocalReleaseOptions = {}) {
    return createPreview(schema, options);
  },
  publishPage(schema: LowcodePageSchema, options: LocalReleaseOptions = {}) {
    return publishPage(schema, options);
  },
  listReleases(pageId?: string) {
    return listReleases(pageId);
  },
  getRelease(releaseId: string) {
    return getRelease(releaseId);
  },
  getPreviewByToken(previewToken: string) {
    return getPreviewByToken(previewToken);
  },
  getDraft(pageId: string) {
    return getDraft(pageId);
  },
  getPublished(pageId: string) {
    return getPublished(pageId);
  },
  getEditorWorkflowState(pageId: string) {
    return getEditorWorkflowState(pageId);
  },
  saveEditorDraftSnapshot(input: ConfigPlatformEditorDraftSnapshotInput) {
    return saveEditorDraftSnapshot(input);
  },
  getEditorDraftSnapshot(pageId: string) {
    return getEditorDraftSnapshot(pageId);
  },
  acquireEditorLock(input: ConfigPlatformLockInput) {
    return acquireEditorLock(input);
  },
  refreshEditorLock(input: ConfigPlatformLockInput) {
    return refreshEditorLock(input);
  },
  releaseEditorLock(input: ConfigPlatformLockInput) {
    return releaseEditorLock(input);
  },
  submitApproval(input: ConfigPlatformApprovalInput) {
    return submitApproval(input);
  },
  cancelApproval(input: ConfigPlatformApprovalInput) {
    return cancelApproval(input);
  },
  reviewApproval(input: ConfigPlatformReviewApprovalInput) {
    return reviewApproval(input);
  },
} satisfies LowcodeConfigPlatformClient;
