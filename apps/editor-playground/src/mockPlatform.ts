import type { LowcodeConfigPlatformClient } from "@meumall/lowcode-adapters";
import {
  validateLowcodePageSchema,
  type LowcodePageSchema,
  type LowcodePageStatus,
} from "@meumall/lowcode-schema";

const RELEASES_KEY = "meumall-lowcode-local-platform-releases";
const DRAFT_INDEX_KEY = "meumall-lowcode-local-platform-draft-index";
const PUBLISHED_INDEX_KEY = "meumall-lowcode-local-platform-published-index";

export type LocalReleaseKind = "draft" | "preview" | "published";

export interface LocalPageRelease {
  id: string;
  kind: LocalReleaseKind;
  pageId: string;
  pageVersion: string;
  title: string;
  note?: string;
  createdAt: string;
  schema: LowcodePageSchema;
}

interface LocalReleaseOptions {
  note?: string;
}

function cloneSchema(schema: LowcodePageSchema): LowcodePageSchema {
  return JSON.parse(JSON.stringify(schema)) as LowcodePageSchema;
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
  const release: LocalPageRelease = {
    id: createReleaseId(kind),
    kind,
    pageId: releaseSchema.pageId,
    pageVersion: releaseSchema.pageVersion,
    title: releaseSchema.title,
    note: options.note?.trim() || undefined,
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
  return release;
}

export function listReleases(pageId?: string): LocalPageRelease[] {
  const releases = readReleases();
  const normalizedReleases = releases.map((release) => ({
    ...release,
    note: typeof release.note === "string" ? release.note : undefined,
  }));
  return pageId ? normalizedReleases.filter((release) => release.pageId === pageId) : normalizedReleases;
}

export function getRelease(releaseId: string): LocalPageRelease | undefined {
  return readReleases().find((release) => release.id === releaseId);
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
  getDraft(pageId: string) {
    return getDraft(pageId);
  },
  getPublished(pageId: string) {
    return getPublished(pageId);
  },
} satisfies LowcodeConfigPlatformClient;
