import {
  createHttpConfigPlatformClient,
  type LowcodeConfigPlatformClient,
} from "@meumall/lowcode-adapters";

export type EditorConfigPlatformMode = "local" | "http";

export interface EditorConfigPlatformBinding {
  client: LowcodeConfigPlatformClient;
  mode: EditorConfigPlatformMode;
  label: string;
}

function readOptionalEnv(
  name: "VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL" | "VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION",
): string | undefined {
  const value = import.meta.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function createEditorConfigPlatformBinding(localClient: LowcodeConfigPlatformClient): EditorConfigPlatformBinding {
  const baseUrl = readOptionalEnv("VITE_LOWCODE_CONFIG_PLATFORM_BASE_URL");
  if (!baseUrl) {
    return {
      client: localClient,
      mode: "local",
      label: "local mock",
    };
  }

  const authorization = readOptionalEnv("VITE_LOWCODE_CONFIG_PLATFORM_AUTHORIZATION");
  return {
    client: createHttpConfigPlatformClient({
      baseUrl,
      headers: authorization ? { authorization } : undefined,
    }),
    mode: "http",
    label: `http ${baseUrl}`,
  };
}
