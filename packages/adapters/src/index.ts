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
