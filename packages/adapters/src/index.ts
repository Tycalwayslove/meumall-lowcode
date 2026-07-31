import {
  validateLowcodePageSchema,
  type JsonObject,
  type JsonValue,
  type LowcodeActionConfig,
  type LowcodeActionRef,
  type LowcodeDataSourceConfig,
  type LowcodePageSchema,
} from "@meumall/lowcode-schema";

export type DataSourceHandler = (config: LowcodeDataSourceConfig) => Promise<JsonValue> | JsonValue;
export type ActionHandler = (config: LowcodeActionConfig, context?: SafeActionExecutionContext) => Promise<void> | void;

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
