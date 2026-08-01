import type {
  JsonObject,
  JsonValue,
  LowcodeActionConfig,
  LowcodeActionRef,
  LowcodeMaterialManifest,
  LowcodeNode,
  LowcodePageSchema,
  LowcodeVisibilityRule,
} from "@meumall/lowcode-schema";

export interface LowcodeMaterial<Component = unknown> {
  manifest: LowcodeMaterialManifest;
  component: Component;
}

export interface MaterialRegistry<Component = unknown> {
  register(material: LowcodeMaterial<Component>): void;
  get(componentName: string): LowcodeMaterial<Component> | undefined;
  has(componentName: string): boolean;
  list(): LowcodeMaterial<Component>[];
}

export function createMaterialRegistry<Component = unknown>(
  initialMaterials: LowcodeMaterial<Component>[] = [],
): MaterialRegistry<Component> {
  const map = new Map<string, LowcodeMaterial<Component>>();

  const registry: MaterialRegistry<Component> = {
    register(material) {
      map.set(material.manifest.componentName, material);
    },
    get(componentName) {
      return map.get(componentName);
    },
    has(componentName) {
      return map.has(componentName);
    },
    list() {
      return [...map.values()];
    },
  };

  initialMaterials.forEach((material) => registry.register(material));

  return registry;
}

export function walkLowcodeNodes(
  nodes: LowcodeNode[],
  visitor: (node: LowcodeNode, parent?: LowcodeNode) => void,
  parent?: LowcodeNode,
): void {
  nodes.forEach((node) => {
    visitor(node, parent);
    if (node.children?.length) {
      walkLowcodeNodes(node.children, visitor, node);
    }
  });
}

export function findLowcodeNode(nodes: LowcodeNode[], id: string): LowcodeNode | undefined {
  let result: LowcodeNode | undefined;
  walkLowcodeNodes(nodes, (node) => {
    if (node.id === id) result = node;
  });
  return result;
}

export function getByPath(source: unknown, path: string): unknown {
  if (!path) return source;
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

export function mergeBoundProps(props: JsonObject, data: JsonObject, binding?: Record<string, string>) {
  if (!binding) return props;
  return Object.entries(binding).reduce<JsonObject>(
    (nextProps, [propName, path]) => {
      const value = getByPath(data, path);
      if (value !== undefined) {
        nextProps[propName] = value as JsonValue;
      }
      return nextProps;
    },
    { ...props },
  );
}

export function evaluateVisibility(rule: LowcodeVisibilityRule | undefined, data: JsonObject): boolean {
  if (!rule) return true;
  if (rule.source === "static") return rule.value !== false;
  if (!rule.path) return true;
  return getByPath(data, rule.path) === rule.equals;
}

export interface LowcodeRuntimeContext {
  schema: LowcodePageSchema;
  data: JsonObject;
  actions: Record<string, LowcodeActionConfig>;
  event?: JsonValue;
}

export function createRuntimeContext(schema: LowcodePageSchema, data: JsonObject = {}, event?: JsonValue): LowcodeRuntimeContext {
  return {
    schema,
    data,
    actions: Object.fromEntries((schema.actions ?? []).map((action) => [action.id, action])),
    ...(event === undefined ? {} : { event }),
  };
}

export interface LowcodeActionExecutor {
  execute(ref: LowcodeActionRef, context: LowcodeRuntimeContext): Promise<void> | void;
}

export function createActionExecutor(
  handlers: Record<string, (action: LowcodeActionConfig, context: LowcodeRuntimeContext, ref: LowcodeActionRef) => Promise<void> | void>,
): LowcodeActionExecutor {
  return {
    execute(ref, context) {
      const action = context.actions[ref.actionId];
      if (!action) {
        throw new Error(`Lowcode action not found: ${ref.actionId}`);
      }
      const handler = handlers[action.type];
      if (!handler) {
        throw new Error(`Lowcode action handler not found: ${action.type}`);
      }
      return handler(action, context, ref);
    },
  };
}
