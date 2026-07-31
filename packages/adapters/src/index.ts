import {
  validateLowcodePageSchema,
  type JsonObject,
  type LowcodeActionConfig,
  type LowcodeDataSourceConfig,
  type LowcodePageSchema,
} from "@meumall/lowcode-schema";

export type DataSourceHandler = (config: LowcodeDataSourceConfig) => Promise<JsonObject> | JsonObject;
export type ActionHandler = (config: LowcodeActionConfig) => Promise<void> | void;

export function createDataSourceRegistry(initialHandlers: Record<string, DataSourceHandler> = {}) {
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

export function createSafeActionRegistry(initialHandlers: Record<string, ActionHandler> = {}) {
  const handlers = new Map<string, ActionHandler>(Object.entries(initialHandlers));
  return {
    register(type: string, handler: ActionHandler) {
      handlers.set(type, handler);
    },
    execute(config: LowcodeActionConfig) {
      const handler = handlers.get(config.type);
      if (!handler) {
        throw new Error(`Lowcode action handler not found: ${config.type}`);
      }
      return handler(config);
    },
    listTypes() {
      return [...handlers.keys()];
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
