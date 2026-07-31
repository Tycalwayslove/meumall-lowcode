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
  createdAt: string;
  schema: LowcodePageSchema;
}

export interface LowcodeConfigPlatformClient {
  saveDraft(schema: LowcodePageSchema): MaybePromise<ConfigPlatformPageRelease>;
  createPreview(schema: LowcodePageSchema): MaybePromise<ConfigPlatformPageRelease>;
  publishPage(schema: LowcodePageSchema): MaybePromise<ConfigPlatformPageRelease>;
  listReleases(pageId?: string): MaybePromise<ConfigPlatformPageRelease[]>;
  getRelease(releaseId: string): MaybePromise<ConfigPlatformPageRelease | undefined>;
  getDraft(pageId: string): MaybePromise<LowcodePageSchema | undefined>;
  getPublished(pageId: string): MaybePromise<LowcodePageSchema | undefined>;
}

export interface ConfigPlatformRequestBody {
  schema?: LowcodePageSchema;
  pageStatus?: LowcodePageStatus;
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

export interface CreateHttpConfigPlatformClientOptions {
  baseUrl: string;
  fetcher?: PlatformFetch;
  headers?: Record<string, string>;
}

export type RuntimeSchemaSourceType = "encoded" | "release" | "published" | "fallback";

export interface LoadRuntimeSchemaInput {
  encodedSchema?: string;
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
  searchProducts(query?: LowcodeResourceQuery): MaybePromise<LowcodeResourceSearchResult<LowcodeProductResource>>;
  searchCoupons?(query?: LowcodeResourceQuery): MaybePromise<LowcodeResourceSearchResult<LowcodeCouponResource>>;
  searchStoreExperts?(query?: LowcodeResourceQuery): MaybePromise<LowcodeResourceSearchResult<LowcodeStoreExpertResource>>;
}

export interface CreateStaticResourceLibraryClientInput {
  imageAssets?: LowcodeImageAssetResource[];
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
  return {
    execute(ref, context) {
      try {
        const action = getActionByRef(ref, context);
        if (!action) {
          throw new Error(`Lowcode action not found: ${ref.actionId}`);
        }
        return registry.execute(action, {
          ref,
          data: context.data,
          schema: context.schema,
        });
      } catch (error) {
        const normalizedError = toError(error);
        options.onError?.(normalizedError, ref, context);
        throw normalizedError;
      }
    },
  };
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function encodePath(value: string): string {
  return encodeURIComponent(value);
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

function getDefaultFetch(): PlatformFetch {
  const candidate = globalThis as typeof globalThis & { fetch?: PlatformFetch };
  if (!candidate.fetch) {
    throw new Error("Config platform HTTP client requires a fetch implementation");
  }
  return candidate.fetch;
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
    async saveDraft(schema) {
      return assertPageRelease(await request("/api/lowcode/pages/drafts", { method: "POST", body: { schema, pageStatus: "draft" } }));
    },
    async createPreview(schema) {
      return assertPageRelease(await request("/api/lowcode/pages/previews", { method: "POST", body: { schema, pageStatus: "preview" } }));
    },
    async publishPage(schema) {
      return assertPageRelease(await request("/api/lowcode/pages/releases", { method: "POST", body: { schema, pageStatus: "published" } }));
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
    async getDraft(pageId) {
      return assertPageSchemaOrUndefined(await request(`/api/lowcode/pages/${encodePath(pageId)}/draft`));
    },
    async getPublished(pageId) {
      return assertPageSchemaOrUndefined(await request(`/api/lowcode/pages/${encodePath(pageId)}/published`));
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
