import {
  createDataSourceRegistry,
  createHttpDataSourceHandler,
  type DataSourceHandler,
  type DataSourceRegistry,
} from "@meumall/lowcode-adapters";

export type EditorDataSourceMode = "local" | "http";

export interface EditorDataSourceRegistryBinding {
  registry: DataSourceRegistry;
  mode: EditorDataSourceMode;
  label: string;
}

function readOptionalEnv(
  name: "VITE_LOWCODE_DATA_SOURCE_BASE_URL" | "VITE_LOWCODE_DATA_SOURCE_AUTHORIZATION",
): string | undefined {
  const value = import.meta.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function createEditorDataSourceRegistryBinding(
  localHandlers: Record<string, DataSourceHandler>,
): EditorDataSourceRegistryBinding {
  const baseUrl = readOptionalEnv("VITE_LOWCODE_DATA_SOURCE_BASE_URL");
  if (!baseUrl) {
    return {
      registry: createDataSourceRegistry(localHandlers),
      mode: "local",
      label: "local sample",
    };
  }

  const authorization = readOptionalEnv("VITE_LOWCODE_DATA_SOURCE_AUTHORIZATION");
  return {
    registry: createDataSourceRegistry({
      ...localHandlers,
      "product.byIds": createHttpDataSourceHandler({
        baseUrl,
        endpoint: "/api/lowcode/data/products/by-ids",
        responseDataPath: "data.items",
        headers: authorization ? { authorization } : undefined,
      }),
    }),
    mode: "http",
    label: `http ${baseUrl}`,
  };
}
