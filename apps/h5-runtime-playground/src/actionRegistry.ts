import {
  createHttpActionHandler,
  createSafeActionRegistry,
  type ActionHandler,
  type SafeActionRegistry,
} from "@meumall/lowcode-adapters";

export type RuntimeActionMode = "local" | "http";

export interface RuntimeActionRegistryBinding {
  registry: SafeActionRegistry;
  mode: RuntimeActionMode;
  label: string;
}

function readOptionalEnv(name: "VITE_LOWCODE_ACTION_BASE_URL" | "VITE_LOWCODE_ACTION_AUTHORIZATION"): string | undefined {
  const value = import.meta.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function createRuntimeActionRegistryBinding(
  localHandlers: Record<string, ActionHandler>,
): RuntimeActionRegistryBinding {
  const baseUrl = readOptionalEnv("VITE_LOWCODE_ACTION_BASE_URL");
  if (!baseUrl) {
    return {
      registry: createSafeActionRegistry(localHandlers),
      mode: "local",
      label: "local mock",
    };
  }

  const authorization = readOptionalEnv("VITE_LOWCODE_ACTION_AUTHORIZATION");
  const httpTrackingHandler = createHttpActionHandler({
    baseUrl,
    endpoint: "/api/lowcode/actions/tracking-click",
    headers: authorization ? { authorization } : undefined,
  });

  return {
    registry: createSafeActionRegistry({
      ...localHandlers,
      async "tracking.click"(action, context) {
        await httpTrackingHandler(action, context);
        await localHandlers["tracking.click"]?.(action, context);
      },
    }),
    mode: "http",
    label: `http ${baseUrl}`,
  };
}
