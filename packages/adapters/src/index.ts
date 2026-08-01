import {
  validateLowcodePageSchema,
  type JsonObject,
  type JsonValue,
  type LowcodeActionConfig,
  type LowcodeActionRef,
  type LowcodeDataSourceConfig,
  type LowcodePageSchema,
  type LowcodePageStatus,
} from "@meumall/lowcode-schema";

export type DataSourceHandler = (config: LowcodeDataSourceConfig) => Promise<JsonValue> | JsonValue;
export type ActionHandler = (config: LowcodeActionConfig, context?: SafeActionExecutionContext) => Promise<void> | void;
export type MaybePromise<T> = T | Promise<T>;

export interface DataSourceRegistry {
  register(type: string, handler: DataSourceHandler): void;
  resolve(config: LowcodeDataSourceConfig): Promise<JsonValue>;
  listTypes(): string[];
}

export interface DataSourceResolutionRecord {
  id: string;
  type: string;
  bindTo?: string;
  status: "resolved" | "skipped" | "error";
  error?: string;
}

export interface DataSourceResolutionResult {
  data: JsonObject;
  records: DataSourceResolutionRecord[];
}

export interface ResolveLowcodeDataSourcesOptions {
  initialData?: JsonObject;
  onError?: (error: Error, config: LowcodeDataSourceConfig) => void;
}

export interface SafeActionExecutionContext {
  ref?: LowcodeActionRef;
  data?: JsonObject;
  schema?: LowcodePageSchema;
}

export interface SafeActionRegistry {
  register(type: string, handler: ActionHandler): void;
  execute(config: LowcodeActionConfig, context?: SafeActionExecutionContext): Promise<void> | void;
  listTypes(): string[];
}

export interface RuntimeActionContextLike {
  schema: LowcodePageSchema;
  data: JsonObject;
  actions?: Record<string, LowcodeActionConfig>;
}

export interface SafeActionExecutor {
  execute(ref: LowcodeActionRef, context: RuntimeActionContextLike): Promise<void> | void;
}

export interface CreateSafeActionExecutorOptions {
  onError?: (error: Error, ref: LowcodeActionRef, context: RuntimeActionContextLike) => void;
}

export type ConfigPlatformReleaseKind = "draft" | "preview" | "published";

export interface ConfigPlatformPageRelease {
  id: string;
  kind: ConfigPlatformReleaseKind;
  pageId: string;
  pageVersion: string;
  title: string;
  note?: string;
  previewToken?: string;
  createdAt: string;
  schema: LowcodePageSchema;
}

export type ConfigPlatformEditorLockStatus = "unlocked" | "locked-by-me" | "locked-by-other" | "readonly" | "expired";
export type ConfigPlatformApprovalStatus = "none" | "draft" | "pending" | "approved" | "rejected" | "published";

export interface ConfigPlatformOperatorInfo {
  id?: string;
  name?: string;
  avatarUrl?: string;
}

export interface ConfigPlatformEditorLockState {
  status: ConfigPlatformEditorLockStatus;
  holder?: ConfigPlatformOperatorInfo;
  lockedAt?: string;
  expiresAt?: string;
  reason?: string;
}

export interface ConfigPlatformApprovalState {
  status: ConfigPlatformApprovalStatus;
  submitter?: ConfigPlatformOperatorInfo;
  reviewer?: ConfigPlatformOperatorInfo;
  submittedAt?: string;
  reviewedAt?: string;
  reason?: string;
  comment?: string;
}

export interface ConfigPlatformEditorWorkflowState {
  pageId: string;
  lock: ConfigPlatformEditorLockState;
  approval: ConfigPlatformApprovalState;
  updatedAt?: string;
}

export interface ConfigPlatformEditorDraftSnapshot {
  pageId: string;
  schema: LowcodePageSchema;
  updatedAt: string;
  operator?: ConfigPlatformOperatorInfo;
}

export interface ConfigPlatformLockInput {
  pageId: string;
  operator?: ConfigPlatformOperatorInfo;
  ttlSeconds?: number;
}

export interface ConfigPlatformApprovalInput {
  pageId: string;
  operator?: ConfigPlatformOperatorInfo;
  comment?: string;
}

export interface ConfigPlatformReviewApprovalInput extends ConfigPlatformApprovalInput {
  approved: boolean;
  reason?: string;
}

export interface ConfigPlatformEditorDraftSnapshotInput {
  pageId: string;
  schema: LowcodePageSchema;
  operator?: ConfigPlatformOperatorInfo;
}

export interface ConfigPlatformReleaseMetadata {
  note?: string;
  operator?: ConfigPlatformOperatorInfo;
}

export interface LowcodeConfigPlatformClient {
  saveDraft(schema: LowcodePageSchema, metadata?: ConfigPlatformReleaseMetadata): MaybePromise<ConfigPlatformPageRelease>;
  createPreview(schema: LowcodePageSchema, metadata?: ConfigPlatformReleaseMetadata): MaybePromise<ConfigPlatformPageRelease>;
  publishPage(schema: LowcodePageSchema, metadata?: ConfigPlatformReleaseMetadata): MaybePromise<ConfigPlatformPageRelease>;
  listReleases(pageId?: string): MaybePromise<ConfigPlatformPageRelease[]>;
  getRelease(releaseId: string): MaybePromise<ConfigPlatformPageRelease | undefined>;
  getPreviewByToken?(previewToken: string): MaybePromise<ConfigPlatformPageRelease | undefined>;
  getDraft(pageId: string): MaybePromise<LowcodePageSchema | undefined>;
  getPublished(pageId: string): MaybePromise<LowcodePageSchema | undefined>;
  getEditorWorkflowState?(pageId: string): MaybePromise<ConfigPlatformEditorWorkflowState | undefined>;
  acquireEditorLock?(input: ConfigPlatformLockInput): MaybePromise<ConfigPlatformEditorWorkflowState>;
  refreshEditorLock?(input: ConfigPlatformLockInput): MaybePromise<ConfigPlatformEditorWorkflowState>;
  releaseEditorLock?(input: ConfigPlatformLockInput): MaybePromise<ConfigPlatformEditorWorkflowState>;
  submitApproval?(input: ConfigPlatformApprovalInput): MaybePromise<ConfigPlatformEditorWorkflowState>;
  cancelApproval?(input: ConfigPlatformApprovalInput): MaybePromise<ConfigPlatformEditorWorkflowState>;
  reviewApproval?(input: ConfigPlatformReviewApprovalInput): MaybePromise<ConfigPlatformEditorWorkflowState>;
  saveEditorDraftSnapshot?(input: ConfigPlatformEditorDraftSnapshotInput): MaybePromise<ConfigPlatformEditorDraftSnapshot>;
  getEditorDraftSnapshot?(pageId: string): MaybePromise<ConfigPlatformEditorDraftSnapshot | undefined>;
}

export interface ConfigPlatformRequestBody {
  schema?: LowcodePageSchema;
  pageStatus?: LowcodePageStatus;
  operator?: ConfigPlatformOperatorInfo;
  ttlSeconds?: number;
  comment?: string;
  note?: string;
  approved?: boolean;
  reason?: string;
}

export interface PlatformFetchResponse {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}

export type PlatformFetch = (
  input: string,
  init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  },
) => Promise<PlatformFetchResponse>;

export type HttpDataSourceMethod = "GET" | "POST";
export type HttpActionMethod = "GET" | "POST";

export interface CreateHttpDataSourceHandlerOptions {
  baseUrl: string;
  endpoint: string;
  method?: HttpDataSourceMethod;
  fetcher?: PlatformFetch;
  headers?: Record<string, string>;
  responseDataPath?: string;
  buildQuery?: (config: LowcodeDataSourceConfig) => JsonObject | undefined;
  buildBody?: (config: LowcodeDataSourceConfig) => JsonValue | undefined;
  transformResponse?: (payload: unknown, config: LowcodeDataSourceConfig) => MaybePromise<JsonValue>;
}

export interface CreateHttpActionHandlerOptions {
  baseUrl: string;
  endpoint: string;
  method?: HttpActionMethod;
  fetcher?: PlatformFetch;
  headers?: Record<string, string>;
  buildQuery?: (config: LowcodeActionConfig, context?: SafeActionExecutionContext) => JsonObject | undefined;
  buildBody?: (config: LowcodeActionConfig, context?: SafeActionExecutionContext) => JsonValue | undefined;
  transformResponse?: (
    payload: unknown,
    config: LowcodeActionConfig,
    context?: SafeActionExecutionContext,
  ) => MaybePromise<void>;
}

export interface CreateHttpConfigPlatformClientOptions {
  baseUrl: string;
  fetcher?: PlatformFetch;
  headers?: Record<string, string>;
}

export type RuntimeSchemaSourceType = "encoded" | "preview" | "release" | "published" | "fallback";

export interface LoadRuntimeSchemaInput {
  encodedSchema?: string;
  previewToken?: string;
  releaseId?: string;
  pageId?: string;
  configPlatformClient?: LowcodeConfigPlatformClient;
  fallbackSchema?: LowcodePageSchema;
}

export interface RuntimeSchemaLoadResult {
  schema?: LowcodePageSchema;
  source: RuntimeSchemaSourceType;
  error?: string;
}

export type LowcodeRuntimeHealthLevel = "loading" | "healthy" | "warning" | "error";
export type LowcodeRuntimeHealthItemStatus = "loading" | "pass" | "warning" | "error";

export interface LowcodeRuntimeHealthItem {
  id: string;
  title: string;
  status: LowcodeRuntimeHealthItemStatus;
  description: string;
}

export interface LowcodeRuntimeHealthSummary {
  level: LowcodeRuntimeHealthLevel;
  title: string;
  description: string;
  statusText: string;
  items: LowcodeRuntimeHealthItem[];
  priorityItems: LowcodeRuntimeHealthItem[];
}

export interface CreateLowcodeRuntimeHealthSummaryInput {
  loading?: boolean;
  schema?: LowcodePageSchema;
  source?: RuntimeSchemaSourceType;
  sourceError?: string;
  validationValid?: boolean;
  validationErrors?: readonly string[];
  nodeCount?: number;
  dataResolving?: boolean;
  dataSourceRecords?: readonly DataSourceResolutionRecord[];
  actionLogCount?: number;
  renderErrors?: readonly string[];
}

export interface LowcodeResourceQuery {
  keyword?: string;
  category?: string;
  tags?: string[];
  ids?: string[];
  limit?: number;
}

export interface LowcodeResourceSearchResult<T> {
  items: T[];
  total: number;
}

export interface LowcodeImageAssetResource {
  id: string;
  title: string;
  category: string;
  url: string;
  tags?: string[];
}

export interface LowcodeVideoAssetResource {
  id: string;
  title: string;
  category: string;
  url: string;
  posterUrl?: string;
  durationText?: string;
  tags?: string[];
}

export interface LowcodeProductResource {
  id: string;
  title: string;
  priceText: string;
  originPriceText?: string;
  desc?: string;
  imageUrl: string;
  tags?: string[];
}

export interface LowcodeCouponResource {
  id: string;
  title: string;
  thresholdText: string;
  valueText: string;
  expireText: string;
  buttonText?: string;
  tags?: string[];
}

export type LowcodeStoreExpertResourceKind = "store" | "expert";

export interface LowcodeStoreExpertResource {
  id: string;
  kind: LowcodeStoreExpertResourceKind;
  typeText: string;
  title: string;
  subtitle: string;
  metricText?: string;
  desc?: string;
  imageUrl: string;
  buttonText?: string;
  tags?: string[];
}

export interface LowcodeResourceLibraryClient {
  searchImageAssets(query?: LowcodeResourceQuery): MaybePromise<LowcodeResourceSearchResult<LowcodeImageAssetResource>>;
  searchVideoAssets?(query?: LowcodeResourceQuery): MaybePromise<LowcodeResourceSearchResult<LowcodeVideoAssetResource>>;
  searchProducts(query?: LowcodeResourceQuery): MaybePromise<LowcodeResourceSearchResult<LowcodeProductResource>>;
  searchCoupons?(query?: LowcodeResourceQuery): MaybePromise<LowcodeResourceSearchResult<LowcodeCouponResource>>;
  searchStoreExperts?(query?: LowcodeResourceQuery): MaybePromise<LowcodeResourceSearchResult<LowcodeStoreExpertResource>>;
}

export interface CreateStaticResourceLibraryClientInput {
  imageAssets?: LowcodeImageAssetResource[];
  videoAssets?: LowcodeVideoAssetResource[];
  products?: LowcodeProductResource[];
  coupons?: LowcodeCouponResource[];
  storeExperts?: LowcodeStoreExpertResource[];
}

export type LowcodeTemplateStatus = "draft" | "published" | "archived";

export interface LowcodeTemplateQuery {
  keyword?: string;
  category?: string;
  tags?: string[];
  ids?: string[];
  status?: LowcodeTemplateStatus;
  limit?: number;
}

export interface LowcodeTemplateResource {
  id: string;
  title: string;
  description: string;
  category: string;
  status: LowcodeTemplateStatus;
  schema: LowcodePageSchema;
  tags?: string[];
  thumbnailUrl?: string;
  version?: string;
  updatedAt?: string;
}

export interface LowcodeTemplateSearchResult {
  items: LowcodeTemplateResource[];
  total: number;
}

export interface LowcodeTemplateLibraryClient {
  searchTemplates(query?: LowcodeTemplateQuery): MaybePromise<LowcodeTemplateSearchResult>;
  getTemplate(id: string): MaybePromise<LowcodeTemplateResource | undefined>;
}

export interface CreateStaticTemplateLibraryClientInput {
  templates?: LowcodeTemplateResource[];
}

export function createDataSourceRegistry(initialHandlers: Record<string, DataSourceHandler> = {}): DataSourceRegistry {
  const handlers = new Map<string, DataSourceHandler>(Object.entries(initialHandlers));
  return {
    register(type: string, handler: DataSourceHandler) {
      handlers.set(type, handler);
    },
    async resolve(config: LowcodeDataSourceConfig) {
      const handler = handlers.get(config.type);
      if (!handler) {
        throw new Error(`Lowcode data source handler not found: ${config.type}`);
      }
      return handler(config);
    },
    listTypes() {
      return [...handlers.keys()];
    },
  };
}

function normalizeSearchText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function resourceMatchesKeyword(values: Array<string | undefined>, keyword: string): boolean {
  if (!keyword) return true;
  return values.some((value) => normalizeSearchText(value).includes(keyword));
}

function resourceMatchesTags(resourceTags: string[] | undefined, queryTags: string[] | undefined): boolean {
  if (!queryTags?.length) return true;
  const tagSet = new Set((resourceTags ?? []).map((tag) => normalizeSearchText(tag)));
  return queryTags.some((tag) => tagSet.has(normalizeSearchText(tag)));
}

function resourceMatchesIds(id: string, ids: string[] | undefined): boolean {
  if (!ids?.length) return true;
  return ids.includes(id);
}

function applyResourceLimit<T>(items: T[], limit: number | undefined): T[] {
  if (limit === undefined) return items;
  if (!Number.isFinite(limit) || limit < 0) return items;
  return items.slice(0, limit);
}

function clonePageSchema(schema: LowcodePageSchema): LowcodePageSchema {
  return JSON.parse(JSON.stringify(schema)) as LowcodePageSchema;
}

function cloneTemplateResource(template: LowcodeTemplateResource): LowcodeTemplateResource {
  return {
    ...template,
    schema: clonePageSchema(template.schema),
    tags: template.tags ? [...template.tags] : undefined,
  };
}

export function createStaticResourceLibraryClient(input: CreateStaticResourceLibraryClientInput = {}): LowcodeResourceLibraryClient {
  const imageAssets = input.imageAssets ?? [];
  const videoAssets = input.videoAssets ?? [];
  const products = input.products ?? [];
  const coupons = input.coupons ?? [];
  const storeExperts = input.storeExperts ?? [];

  return {
    searchImageAssets(query = {}) {
      const keyword = normalizeSearchText(query.keyword);
      const category = query.category && query.category !== "全部" ? query.category : undefined;
      const items = imageAssets.filter((asset) => {
        if (category && asset.category !== category) return false;
        if (!resourceMatchesIds(asset.id, query.ids)) return false;
        if (!resourceMatchesTags(asset.tags, query.tags)) return false;
        return resourceMatchesKeyword([asset.id, asset.title, asset.category, ...(asset.tags ?? [])], keyword);
      });
      return {
        items: applyResourceLimit(items, query.limit),
        total: items.length,
      };
    },
    searchVideoAssets(query = {}) {
      const keyword = normalizeSearchText(query.keyword);
      const category = query.category && query.category !== "全部" ? query.category : undefined;
      const items = videoAssets.filter((asset) => {
        if (category && asset.category !== category) return false;
        if (!resourceMatchesIds(asset.id, query.ids)) return false;
        if (!resourceMatchesTags(asset.tags, query.tags)) return false;
        return resourceMatchesKeyword([asset.id, asset.title, asset.category, asset.durationText, ...(asset.tags ?? [])], keyword);
      });
      return {
        items: applyResourceLimit(items, query.limit),
        total: items.length,
      };
    },
    searchProducts(query = {}) {
      const keyword = normalizeSearchText(query.keyword);
      const items = products.filter((product) => {
        if (!resourceMatchesIds(product.id, query.ids)) return false;
        if (!resourceMatchesTags(product.tags, query.tags)) return false;
        return resourceMatchesKeyword(
          [product.id, product.title, product.desc, product.priceText, product.originPriceText, ...(product.tags ?? [])],
          keyword,
        );
      });
      return {
        items: applyResourceLimit(items, query.limit),
        total: items.length,
      };
    },
    searchCoupons(query = {}) {
      const keyword = normalizeSearchText(query.keyword);
      const items = coupons.filter((coupon) => {
        if (!resourceMatchesIds(coupon.id, query.ids)) return false;
        if (!resourceMatchesTags(coupon.tags, query.tags)) return false;
        return resourceMatchesKeyword(
          [coupon.id, coupon.title, coupon.thresholdText, coupon.valueText, coupon.expireText, coupon.buttonText, ...(coupon.tags ?? [])],
          keyword,
        );
      });
      return {
        items: applyResourceLimit(items, query.limit),
        total: items.length,
      };
    },
    searchStoreExperts(query = {}) {
      const keyword = normalizeSearchText(query.keyword);
      const category = query.category && query.category !== "全部" ? query.category : undefined;
      const items = storeExperts.filter((item) => {
        if (category && item.typeText !== category && item.kind !== category) return false;
        if (!resourceMatchesIds(item.id, query.ids)) return false;
        if (!resourceMatchesTags(item.tags, query.tags)) return false;
        return resourceMatchesKeyword(
          [item.id, item.kind, item.typeText, item.title, item.subtitle, item.metricText, item.desc, item.buttonText, ...(item.tags ?? [])],
          keyword,
        );
      });
      return {
        items: applyResourceLimit(items, query.limit),
        total: items.length,
      };
    },
  };
}

export function createStaticTemplateLibraryClient(input: CreateStaticTemplateLibraryClientInput = {}): LowcodeTemplateLibraryClient {
  const templates = input.templates ?? [];

  return {
    searchTemplates(query = {}) {
      const keyword = normalizeSearchText(query.keyword);
      const category = query.category && query.category !== "全部" ? query.category : undefined;
      const items = templates.filter((template) => {
        if (category && template.category !== category) return false;
        if (query.status && template.status !== query.status) return false;
        if (!resourceMatchesIds(template.id, query.ids)) return false;
        if (!resourceMatchesTags(template.tags, query.tags)) return false;
        return resourceMatchesKeyword(
          [template.id, template.title, template.description, template.category, template.version, ...(template.tags ?? [])],
          keyword,
        );
      });
      return {
        items: applyResourceLimit(items, query.limit).map(cloneTemplateResource),
        total: items.length,
      };
    },
    getTemplate(id: string) {
      const template = templates.find((item) => item.id === id);
      return template ? cloneTemplateResource(template) : undefined;
    },
  };
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}

export async function resolveLowcodeDataSources(
  dataSources: LowcodeDataSourceConfig[] = [],
  registry: DataSourceRegistry,
  options: ResolveLowcodeDataSourcesOptions = {},
): Promise<DataSourceResolutionResult> {
  const data: JsonObject = { ...(options.initialData ?? {}) };
  const records: DataSourceResolutionRecord[] = [];

  for (const dataSource of dataSources) {
    if (!dataSource.bindTo) {
      records.push({
        id: dataSource.id,
        type: dataSource.type,
        status: "skipped",
        error: "bindTo is empty",
      });
      continue;
    }

    try {
      data[dataSource.bindTo] = await registry.resolve(dataSource);
      records.push({
        id: dataSource.id,
        type: dataSource.type,
        bindTo: dataSource.bindTo,
        status: "resolved",
      });
    } catch (error) {
      const normalizedError = toError(error);
      options.onError?.(normalizedError, dataSource);
      records.push({
        id: dataSource.id,
        type: dataSource.type,
        bindTo: dataSource.bindTo,
        status: "error",
        error: normalizedError.message,
      });
    }
  }

  return { data, records };
}

export function createSafeActionRegistry(initialHandlers: Record<string, ActionHandler> = {}): SafeActionRegistry {
  const handlers = new Map<string, ActionHandler>(Object.entries(initialHandlers));
  return {
    register(type: string, handler: ActionHandler) {
      handlers.set(type, handler);
    },
    execute(config: LowcodeActionConfig, context?: SafeActionExecutionContext) {
      const handler = handlers.get(config.type);
      if (!handler) {
        throw new Error(`Lowcode action handler not found: ${config.type}`);
      }
      return handler(config, context);
    },
    listTypes() {
      return [...handlers.keys()];
    },
  };
}

function getActionByRef(ref: LowcodeActionRef, context: RuntimeActionContextLike): LowcodeActionConfig | undefined {
  return context.actions?.[ref.actionId] ?? context.schema.actions?.find((action) => action.id === ref.actionId);
}

export function createSafeActionExecutor(
  registry: SafeActionRegistry,
  options: CreateSafeActionExecutorOptions = {},
): SafeActionExecutor {
  function handleError(error: unknown, ref: LowcodeActionRef, context: RuntimeActionContextLike): Error {
    const normalizedError = toError(error);
    options.onError?.(normalizedError, ref, context);
    return normalizedError;
  }

  return {
    execute(ref, context) {
      try {
        const action = getActionByRef(ref, context);
        if (!action) {
          throw new Error(`Lowcode action not found: ${ref.actionId}`);
        }
        const result = registry.execute(action, {
          ref,
          data: context.data,
          schema: context.schema,
        });
        if (result && typeof (result as Promise<void>).then === "function") {
          return Promise.resolve(result).catch((error) => {
            throw handleError(error, ref, context);
          });
        }
        return result;
      } catch (error) {
        throw handleError(error, ref, context);
      }
    },
  };
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function normalizeHttpEndpoint(value: string): string {
  const endpoint = value.trim();
  if (!endpoint) {
    throw new Error("HTTP endpoint is required");
  }
  if (/^https?:\/\//i.test(endpoint)) {
    throw new Error("HTTP endpoint must be a path, not an absolute URL");
  }
  return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
}

function encodePath(value: string): string {
  return encodeURIComponent(value);
}

function queryValueToString(value: JsonValue): string {
  if (value == null) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function appendQueryParams(url: string, query: JsonObject | undefined): string {
  if (!query || !Object.keys(query).length) return url;
  const search = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        search.append(key, queryValueToString(item));
      });
      return;
    }
    search.set(key, queryValueToString(value));
  });
  const queryText = search.toString();
  if (!queryText) return url;
  return `${url}${url.includes("?") ? "&" : "?"}${queryText}`;
}

function getByJsonPath(source: unknown, path: string | undefined): unknown {
  if (!path) return source;
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

function assertJsonValue(value: unknown, description: string): JsonValue {
  if (
    value == null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    Array.isArray(value) ||
    typeof value === "object"
  ) {
    return value as JsonValue;
  }
  throw new Error(`${description} must be JSON serializable`);
}

function assertPageRelease(value: unknown): ConfigPlatformPageRelease {
  if (!value || typeof value !== "object") {
    throw new Error("Config platform release response must be an object");
  }
  const release = value as ConfigPlatformPageRelease;
  if (!release.id || !release.pageId || !release.schema) {
    throw new Error("Config platform release response is missing required fields");
  }
  return release;
}

function assertPageSchemaOrUndefined(value: unknown): LowcodePageSchema | undefined {
  if (value == null) return undefined;
  const validation = validateLowcodePageSchema(value);
  if (!validation.valid) {
    throw new Error(`Config platform schema response is invalid: ${validation.errors.join("; ")}`);
  }
  return value as LowcodePageSchema;
}

function assertEditorWorkflowStateOrUndefined(value: unknown): ConfigPlatformEditorWorkflowState | undefined {
  if (value == null) return undefined;
  if (!value || typeof value !== "object") {
    throw new Error("Config platform editor workflow response must be an object");
  }
  const workflow = value as ConfigPlatformEditorWorkflowState;
  if (!workflow.pageId || !workflow.lock || !workflow.approval) {
    throw new Error("Config platform editor workflow response is missing required fields");
  }
  if (!workflow.lock.status || !workflow.approval.status) {
    throw new Error("Config platform editor workflow response is missing status fields");
  }
  return workflow;
}

function assertEditorWorkflowState(value: unknown): ConfigPlatformEditorWorkflowState {
  const workflow = assertEditorWorkflowStateOrUndefined(value);
  if (!workflow) {
    throw new Error("Config platform editor workflow response must not be empty");
  }
  return workflow;
}

function assertEditorDraftSnapshotOrUndefined(value: unknown): ConfigPlatformEditorDraftSnapshot | undefined {
  if (value == null) return undefined;
  if (!value || typeof value !== "object") {
    throw new Error("Config platform editor draft snapshot response must be an object");
  }
  const snapshot = value as ConfigPlatformEditorDraftSnapshot;
  if (!snapshot.pageId || !snapshot.updatedAt || !snapshot.schema) {
    throw new Error("Config platform editor draft snapshot response is missing required fields");
  }
  const schema = assertPageSchemaOrUndefined(snapshot.schema);
  if (!schema) {
    throw new Error("Config platform editor draft snapshot schema must not be empty");
  }
  return {
    ...snapshot,
    schema,
  };
}

function assertEditorDraftSnapshot(value: unknown): ConfigPlatformEditorDraftSnapshot {
  const snapshot = assertEditorDraftSnapshotOrUndefined(value);
  if (!snapshot) {
    throw new Error("Config platform editor draft snapshot response must not be empty");
  }
  return snapshot;
}

function getDefaultFetch(): PlatformFetch {
  const candidate = globalThis as typeof globalThis & { fetch?: PlatformFetch };
  if (!candidate.fetch) {
    throw new Error("HTTP client requires a fetch implementation");
  }
  return candidate.fetch;
}

export function createHttpDataSourceHandler(options: CreateHttpDataSourceHandlerOptions): DataSourceHandler {
  const baseUrl = trimTrailingSlash(options.baseUrl);
  const endpoint = normalizeHttpEndpoint(options.endpoint);
  const method = options.method ?? "GET";
  const fetcher = options.fetcher ?? getDefaultFetch();
  const headers = {
    "content-type": "application/json",
    ...(options.headers ?? {}),
  };

  return async (config) => {
    const query = options.buildQuery ? options.buildQuery(config) : method === "GET" ? config.params : undefined;
    const body = options.buildBody ? options.buildBody(config) : method === "POST" ? config.params ?? {} : undefined;
    const response = await fetcher(appendQueryParams(`${baseUrl}${endpoint}`, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP data source request failed: ${response.status}`);
    }
    if (options.transformResponse) {
      return assertJsonValue(await options.transformResponse(payload, config), "HTTP data source transformed response");
    }
    return assertJsonValue(getByJsonPath(payload, options.responseDataPath), "HTTP data source response");
  };
}

function createDefaultHttpActionPayload(
  config: LowcodeActionConfig,
  context?: SafeActionExecutionContext,
): JsonObject {
  return {
    actionId: config.id,
    type: config.type,
    params: config.params ?? {},
    refParams: context?.ref?.params ?? {},
    pageId: context?.schema?.pageId ?? null,
  };
}

export function createHttpActionHandler(options: CreateHttpActionHandlerOptions): ActionHandler {
  const baseUrl = trimTrailingSlash(options.baseUrl);
  const endpoint = normalizeHttpEndpoint(options.endpoint);
  const method = options.method ?? "POST";
  const fetcher = options.fetcher ?? getDefaultFetch();
  const headers = {
    "content-type": "application/json",
    ...(options.headers ?? {}),
  };

  return async (config, context) => {
    const defaultPayload = createDefaultHttpActionPayload(config, context);
    const query = options.buildQuery ? options.buildQuery(config, context) : method === "GET" ? defaultPayload : undefined;
    const body = options.buildBody ? options.buildBody(config, context) : method === "POST" ? defaultPayload : undefined;
    const response = await fetcher(appendQueryParams(`${baseUrl}${endpoint}`, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP action request failed: ${response.status}`);
    }
    await options.transformResponse?.(payload, config, context);
  };
}

export function createHttpConfigPlatformClient(options: CreateHttpConfigPlatformClientOptions): LowcodeConfigPlatformClient {
  const baseUrl = trimTrailingSlash(options.baseUrl);
  const fetcher = options.fetcher ?? getDefaultFetch();
  const headers = {
    "content-type": "application/json",
    ...(options.headers ?? {}),
  };

  async function request(path: string, init: { method?: string; body?: ConfigPlatformRequestBody } = {}): Promise<unknown> {
    const response = await fetcher(`${baseUrl}${path}`, {
      method: init.method ?? "GET",
      headers,
      body: init.body ? JSON.stringify(init.body) : undefined,
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(`Config platform request failed: ${response.status}`);
    }
    return payload;
  }

  return {
    async saveDraft(schema, metadata) {
      return assertPageRelease(
        await request("/api/lowcode/pages/drafts", {
          method: "POST",
          body: { schema, pageStatus: "draft", note: metadata?.note, operator: metadata?.operator },
        }),
      );
    },
    async createPreview(schema, metadata) {
      return assertPageRelease(
        await request("/api/lowcode/pages/previews", {
          method: "POST",
          body: { schema, pageStatus: "preview", note: metadata?.note, operator: metadata?.operator },
        }),
      );
    },
    async publishPage(schema, metadata) {
      return assertPageRelease(
        await request("/api/lowcode/pages/releases", {
          method: "POST",
          body: { schema, pageStatus: "published", note: metadata?.note, operator: metadata?.operator },
        }),
      );
    },
    async listReleases(pageId) {
      const suffix = pageId ? `?pageId=${encodePath(pageId)}` : "";
      const payload = await request(`/api/lowcode/pages/releases${suffix}`);
      if (!Array.isArray(payload)) {
        throw new Error("Config platform release list response must be an array");
      }
      return payload.map(assertPageRelease);
    },
    async getRelease(releaseId) {
      const payload = await request(`/api/lowcode/pages/releases/${encodePath(releaseId)}`);
      return payload == null ? undefined : assertPageRelease(payload);
    },
    async getPreviewByToken(previewToken) {
      const payload = await request(`/api/lowcode/pages/previews/${encodePath(previewToken)}`);
      return payload == null ? undefined : assertPageRelease(payload);
    },
    async getDraft(pageId) {
      return assertPageSchemaOrUndefined(await request(`/api/lowcode/pages/${encodePath(pageId)}/draft`));
    },
    async getPublished(pageId) {
      return assertPageSchemaOrUndefined(await request(`/api/lowcode/pages/${encodePath(pageId)}/published`));
    },
    async getEditorWorkflowState(pageId) {
      return assertEditorWorkflowStateOrUndefined(await request(`/api/lowcode/pages/${encodePath(pageId)}/workflow`));
    },
    async acquireEditorLock(input) {
      return assertEditorWorkflowState(
        await request(`/api/lowcode/pages/${encodePath(input.pageId)}/locks/acquire`, {
          method: "POST",
          body: { operator: input.operator, ttlSeconds: input.ttlSeconds },
        }),
      );
    },
    async refreshEditorLock(input) {
      return assertEditorWorkflowState(
        await request(`/api/lowcode/pages/${encodePath(input.pageId)}/locks/refresh`, {
          method: "POST",
          body: { operator: input.operator, ttlSeconds: input.ttlSeconds },
        }),
      );
    },
    async releaseEditorLock(input) {
      return assertEditorWorkflowState(
        await request(`/api/lowcode/pages/${encodePath(input.pageId)}/locks/release`, {
          method: "POST",
          body: { operator: input.operator },
        }),
      );
    },
    async submitApproval(input) {
      return assertEditorWorkflowState(
        await request(`/api/lowcode/pages/${encodePath(input.pageId)}/approval/submit`, {
          method: "POST",
          body: { operator: input.operator, comment: input.comment },
        }),
      );
    },
    async cancelApproval(input) {
      return assertEditorWorkflowState(
        await request(`/api/lowcode/pages/${encodePath(input.pageId)}/approval/cancel`, {
          method: "POST",
          body: { operator: input.operator, comment: input.comment },
        }),
      );
    },
    async reviewApproval(input) {
      return assertEditorWorkflowState(
        await request(`/api/lowcode/pages/${encodePath(input.pageId)}/approval/review`, {
          method: "POST",
          body: {
            operator: input.operator,
            comment: input.comment,
            approved: input.approved,
            reason: input.reason,
          },
        }),
      );
    },
    async saveEditorDraftSnapshot(input) {
      return assertEditorDraftSnapshot(
        await request(`/api/lowcode/pages/${encodePath(input.pageId)}/editor-draft-snapshot`, {
          method: "PUT",
          body: { schema: input.schema, operator: input.operator },
        }),
      );
    },
    async getEditorDraftSnapshot(pageId) {
      return assertEditorDraftSnapshotOrUndefined(
        await request(`/api/lowcode/pages/${encodePath(pageId)}/editor-draft-snapshot`),
      );
    },
  };
}

function fallbackRuntimeSchema(fallbackSchema: LowcodePageSchema | undefined, error: unknown): RuntimeSchemaLoadResult {
  return {
    schema: fallbackSchema,
    source: "fallback",
    error: toError(error).message,
  };
}

function formatRuntimeHealthSource(source: RuntimeSchemaSourceType | undefined): string {
  const label: Record<RuntimeSchemaSourceType, string> = {
    encoded: "schema URL",
    preview: "previewToken",
    release: "releaseId",
    published: "pageId",
    fallback: "fallback",
  };
  return source ? label[source] : "未识别";
}

function countRuntimeHealthItems(items: readonly LowcodeRuntimeHealthItem[], status: LowcodeRuntimeHealthItemStatus): number {
  return items.filter((item) => item.status === status).length;
}

export function createLowcodeRuntimeHealthSummary(input: CreateLowcodeRuntimeHealthSummaryInput): LowcodeRuntimeHealthSummary {
  const dataSourceRecords = input.dataSourceRecords ?? [];
  const dataSourceErrors = dataSourceRecords.filter((record) => record.status === "error");
  const dataSourceSkipped = dataSourceRecords.filter((record) => record.status === "skipped");
  const renderErrors = input.renderErrors ?? [];
  const validationErrors = input.validationErrors ?? [];
  const hasValidationError = input.validationValid === false || validationErrors.length > 0;

  const items: LowcodeRuntimeHealthItem[] = [
    {
      id: "source",
      title: "Schema 来源",
      status: input.loading ? "loading" : input.sourceError || input.source === "fallback" ? "warning" : "pass",
      description: input.loading
        ? "正在解析运行入口。"
        : input.sourceError
          ? `已启用 fallback：${input.sourceError}`
          : `当前来源为 ${formatRuntimeHealthSource(input.source)}。`,
    },
    {
      id: "schema",
      title: "Schema 有效性",
      status: input.loading ? "loading" : !input.schema || hasValidationError ? "error" : "pass",
      description: input.loading
        ? "等待 schema 加载完成。"
        : hasValidationError
          ? validationErrors[0] ?? "Schema 校验未通过。"
          : !input.schema
            ? "未获得可渲染 schema。"
            : `Schema valid，页面 ID：${input.schema.pageId}。`,
    },
    {
      id: "nodes",
      title: "页面节点",
      status: input.loading ? "loading" : input.nodeCount === 0 ? "warning" : "pass",
      description: input.loading
        ? "等待页面节点统计。"
        : input.nodeCount === 0
          ? "页面暂无节点，H5 runtime 会进入安全空态。"
          : `当前可渲染节点数：${input.nodeCount ?? 0}。`,
    },
    {
      id: "dataSources",
      title: "数据源",
      status: input.dataResolving ? "loading" : dataSourceErrors.length || dataSourceSkipped.length ? "warning" : "pass",
      description: input.dataResolving
        ? "正在解析运行态数据源。"
        : dataSourceErrors.length
          ? `${dataSourceErrors.length} 个数据源解析失败，页面会保留已解析数据和兜底内容。`
          : dataSourceSkipped.length
            ? `${dataSourceSkipped.length} 个数据源未绑定，已跳过解析。`
            : dataSourceRecords.length
              ? `${dataSourceRecords.length} 个数据源已完成解析。`
              : "当前页面未配置运行态数据源。",
    },
    {
      id: "actions",
      title: "动作执行",
      status: "pass",
      description: input.actionLogCount
        ? `已记录 ${input.actionLogCount} 条动作日志。`
        : "动作执行器已就绪，暂无动作日志。",
    },
    {
      id: "render",
      title: "渲染兜底",
      status: renderErrors.length ? "warning" : "pass",
      description: renderErrors.length
        ? `${renderErrors.length} 个节点触发渲染兜底，页面不会白屏。`
        : "暂未发现物料渲染异常。",
    },
  ];

  const errorCount = countRuntimeHealthItems(items, "error");
  const warningCount = countRuntimeHealthItems(items, "warning");
  const loadingCount = countRuntimeHealthItems(items, "loading");
  const level: LowcodeRuntimeHealthLevel = errorCount
    ? "error"
    : warningCount
      ? "warning"
      : loadingCount
        ? "loading"
        : "healthy";
  const priorityItems = items.filter((item) => item.status === "error" || item.status === "warning");

  if (level === "loading") {
    return {
      level,
      title: "H5 runtime 加载中",
      description: "正在解析 schema、数据源和运行态状态。",
      statusText: `${loadingCount} 项加载中`,
      items,
      priorityItems,
    };
  }

  if (level === "error") {
    return {
      level,
      title: "H5 runtime 需要处理",
      description: "存在阻塞渲染或 schema 校验的问题，需要先处理错误项。",
      statusText: `${errorCount} error · ${warningCount} warning`,
      items,
      priorityItems,
    };
  }

  if (level === "warning") {
    return {
      level,
      title: "H5 runtime 已进入提醒状态",
      description: "页面仍可渲染，但存在 fallback、空态、数据源或物料兜底提醒。",
      statusText: `${warningCount} warning`,
      items,
      priorityItems,
    };
  }

  return {
    level,
    title: "H5 runtime 正常",
    description: "Schema、页面节点、数据源、动作和渲染兜底链路均处于可运行状态。",
    statusText: "all passed",
    items,
    priorityItems,
  };
}

export async function loadLowcodeRuntimeSchema(input: LoadRuntimeSchemaInput): Promise<RuntimeSchemaLoadResult> {
  if (input.encodedSchema) {
    try {
      return {
        schema: decodePageSchemaFromUrlParam(input.encodedSchema),
        source: "encoded",
      };
    } catch (error) {
      return fallbackRuntimeSchema(input.fallbackSchema, error);
    }
  }

  if (input.previewToken) {
    if (!input.configPlatformClient?.getPreviewByToken) {
      return fallbackRuntimeSchema(input.fallbackSchema, new Error("Config platform client with getPreviewByToken is required for previewToken"));
    }
    try {
      const release = await input.configPlatformClient.getPreviewByToken(input.previewToken);
      if (!release?.schema) {
        throw new Error(`Lowcode preview not found: ${input.previewToken}`);
      }
      return {
        schema: release.schema,
        source: "preview",
      };
    } catch (error) {
      return fallbackRuntimeSchema(input.fallbackSchema, error);
    }
  }

  if (input.releaseId) {
    if (!input.configPlatformClient) {
      return fallbackRuntimeSchema(input.fallbackSchema, new Error("Config platform client is required for releaseId"));
    }
    try {
      const release = await input.configPlatformClient.getRelease(input.releaseId);
      if (!release?.schema) {
        throw new Error(`Lowcode release not found: ${input.releaseId}`);
      }
      return {
        schema: release.schema,
        source: "release",
      };
    } catch (error) {
      return fallbackRuntimeSchema(input.fallbackSchema, error);
    }
  }

  if (input.pageId) {
    if (!input.configPlatformClient) {
      return fallbackRuntimeSchema(input.fallbackSchema, new Error("Config platform client is required for pageId"));
    }
    try {
      const schema = await input.configPlatformClient.getPublished(input.pageId);
      if (!schema) {
        throw new Error(`Lowcode published schema not found: ${input.pageId}`);
      }
      return {
        schema,
        source: "published",
      };
    } catch (error) {
      return fallbackRuntimeSchema(input.fallbackSchema, error);
    }
  }

  return {
    schema: input.fallbackSchema,
    source: "fallback",
    error: input.fallbackSchema ? undefined : "Runtime schema source is empty",
  };
}

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodePageSchemaToUrlParam(schema: LowcodePageSchema): string {
  return toBase64Url(JSON.stringify(schema));
}

export function decodePageSchemaFromUrlParam(value: string): LowcodePageSchema {
  const parsed = JSON.parse(fromBase64Url(value)) as LowcodePageSchema;
  const validation = validateLowcodePageSchema(parsed);
  if (!validation.valid) {
    throw new Error(`Invalid lowcode page schema: ${validation.errors.join("; ")}`);
  }
  return parsed;
}
