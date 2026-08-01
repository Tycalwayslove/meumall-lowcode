export const LOWCODE_SCHEMA_VERSION = "1.0.0" as const;
export const LOWCODE_SCHEMA_MAJOR_VERSION = 1 as const;

export const LOWCODE_PLATFORM_VALUES = ["h5", "miniapp"] as const;
export const LOWCODE_PAGE_STATUS_VALUES = ["draft", "preview", "published", "disabled"] as const;
export const LOWCODE_PAGE_TYPE_VALUES = ["activity", "promotion", "topic", "landing", "custom"] as const;

export type LowcodePlatform = (typeof LOWCODE_PLATFORM_VALUES)[number];
export type LowcodeEnvironment = "test" | "pre" | "prod";
export type LowcodePageStatus = (typeof LOWCODE_PAGE_STATUS_VALUES)[number];
export type LowcodePageType = (typeof LOWCODE_PAGE_TYPE_VALUES)[number];

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = Record<string, JsonValue>;

export interface LowcodeThemeConfig {
  tokens?: Record<string, string>;
  mode?: "light" | "dark" | string;
}

export interface LowcodeLayoutConfig {
  maxWidth?: number;
  backgroundColor?: string;
  backgroundImage?: string;
  safeArea?: boolean;
}

export interface LowcodeActionRef {
  actionId: string;
  params?: JsonObject;
}

export interface LowcodeVisibilityRule {
  source: "static" | "data";
  value?: boolean;
  path?: string;
  equals?: JsonValue;
}

export interface LowcodeDataBinding {
  [propName: string]: string;
}

export interface LowcodeResponsiveRule {
  platform: LowcodePlatform;
  minWidth?: number;
  maxWidth?: number;
  props?: JsonObject;
  style?: JsonObject;
}

export interface LowcodeNodeMeta {
  name?: string;
  locked?: boolean;
  hiddenInEditor?: boolean;
  createdBy?: string;
  updatedAt?: string;
}

export interface LowcodeNode {
  id: string;
  componentName: string;
  materialVersion: string;
  props: JsonObject;
  style?: JsonObject;
  slot?: string;
  children?: LowcodeNode[];
  dataBinding?: LowcodeDataBinding;
  events?: Record<string, LowcodeActionRef>;
  visibility?: LowcodeVisibilityRule;
  responsive?: LowcodeResponsiveRule[];
  meta?: LowcodeNodeMeta;
}

export interface LowcodeDataSourceConfig {
  id: string;
  type: string;
  params?: JsonObject;
  bindTo?: string;
  cache?: {
    ttlSeconds?: number;
    scope?: "public" | "private";
  };
}

export interface LowcodeActionConfig {
  id: string;
  type: string;
  params?: JsonObject;
}

export interface LowcodeTrackingConfig {
  pageName?: string;
  channelParamKeys?: string[];
  exposure?: boolean;
  click?: boolean;
}

export interface LowcodePublishMeta {
  environment: LowcodeEnvironment;
  publishedAt?: string;
  rollbackVersion?: string;
  operator?: string;
}

export interface LowcodeEditorMeta {
  canvasWidth?: number;
  lastSelectedNodeId?: string;
  notes?: string;
}

export interface LowcodePageSchema {
  schemaVersion: typeof LOWCODE_SCHEMA_VERSION | string;
  pageId: string;
  pageVersion: string;
  title: string;
  status: LowcodePageStatus;
  pageType?: LowcodePageType;
  description?: string;
  targetPlatforms: LowcodePlatform[];
  theme?: LowcodeThemeConfig;
  layout: LowcodeLayoutConfig;
  nodes: LowcodeNode[];
  dataSources?: LowcodeDataSourceConfig[];
  actions?: LowcodeActionConfig[];
  tracking?: LowcodeTrackingConfig;
  publishMeta: LowcodePublishMeta;
  editor?: LowcodeEditorMeta;
}

export type LowcodePropSetter =
  | "input"
  | "number"
  | "textarea"
  | "switch"
  | "select"
  | "image"
  | "video"
  | "color"
  | "richText"
  | "productSelector"
  | "couponSelector"
  | "actionSelector"
  | "dataSourceSelector";

export interface LowcodePropSchema {
  label: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  setter: LowcodePropSetter;
  required?: boolean;
  defaultValue?: JsonValue;
  options?: Array<{ label: string; value: JsonValue }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  swatches?: string[];
  description?: string;
}

export interface LowcodeMaterialEventManifest {
  name: string;
  title: string;
  description?: string;
}

export interface LowcodeDataSourceSlotManifest {
  name: string;
  acceptedTypes: string[];
  required?: boolean;
}

export interface LowcodeMaterialManifest {
  componentName: string;
  materialVersion: string;
  title: string;
  category: string;
  platforms: LowcodePlatform[];
  propsSchema: Record<string, LowcodePropSchema>;
  defaultProps: JsonObject;
  events?: LowcodeMaterialEventManifest[];
  dataSourceSlots?: LowcodeDataSourceSlotManifest[];
}

export interface LowcodeValidationResult {
  valid: boolean;
  errors: string[];
}

export interface CreateLowcodePageSchemaInput {
  pageId: string;
  title: string;
  pageVersion?: string;
  status?: LowcodePageStatus;
  pageType?: LowcodePageType;
  description?: string;
  targetPlatforms?: LowcodePlatform[];
  theme?: LowcodeThemeConfig;
  layout?: LowcodeLayoutConfig;
  nodes?: LowcodeNode[];
  dataSources?: LowcodeDataSourceConfig[];
  actions?: LowcodeActionConfig[];
  tracking?: LowcodeTrackingConfig;
  publishMeta?: Partial<LowcodePublishMeta>;
  editor?: LowcodeEditorMeta;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isJsonObject(value: unknown): value is JsonObject {
  return isRecord(value);
}

function isOneOf<T extends readonly string[]>(value: unknown, candidates: T): value is T[number] {
  return typeof value === "string" && candidates.includes(value);
}

function pushRequiredString(errors: string[], value: unknown, path: string): void {
  if (typeof value !== "string" || value.length === 0) {
    errors.push(`${path} must be a non-empty string`);
  }
}

function validateDuplicateIds(errors: string[], items: Array<{ id: string }> | undefined, path: string): void {
  if (!items) return;
  const seen = new Set<string>();
  items.forEach((item, index) => {
    if (!item.id) return;
    if (seen.has(item.id)) {
      errors.push(`${path}[${index}].id is duplicated: ${item.id}`);
    }
    seen.add(item.id);
  });
}

function validateNode(
  node: unknown,
  path: string,
  errors: string[],
  nodeIds: Set<string>,
  actionIds: Set<string>,
): void {
  if (!isRecord(node)) {
    errors.push(`${path} must be an object`);
    return;
  }

  pushRequiredString(errors, node.id, `${path}.id`);
  pushRequiredString(errors, node.componentName, `${path}.componentName`);
  pushRequiredString(errors, node.materialVersion, `${path}.materialVersion`);

  if (typeof node.id === "string") {
    if (nodeIds.has(node.id)) {
      errors.push(`${path}.id is duplicated: ${node.id}`);
    }
    nodeIds.add(node.id);
  }

  if (!isJsonObject(node.props)) {
    errors.push(`${path}.props must be an object`);
  }
  if (node.style !== undefined && !isJsonObject(node.style)) {
    errors.push(`${path}.style must be an object when provided`);
  }
  if (node.dataBinding !== undefined && !isRecord(node.dataBinding)) {
    errors.push(`${path}.dataBinding must be an object when provided`);
  }
  if (node.events !== undefined) {
    if (!isRecord(node.events)) {
      errors.push(`${path}.events must be an object when provided`);
    } else {
      Object.entries(node.events).forEach(([eventName, ref]) => {
        if (!isRecord(ref) || typeof ref.actionId !== "string" || ref.actionId.length === 0) {
          errors.push(`${path}.events.${eventName}.actionId must be a non-empty string`);
          return;
        }
        if (actionIds.size > 0 && !actionIds.has(ref.actionId)) {
          errors.push(`${path}.events.${eventName}.actionId references missing action: ${ref.actionId}`);
        }
      });
    }
  }
  if (node.visibility !== undefined) {
    if (!isRecord(node.visibility)) {
      errors.push(`${path}.visibility must be an object when provided`);
    } else if (node.visibility.source !== "static" && node.visibility.source !== "data") {
      errors.push(`${path}.visibility.source must be static or data`);
    }
  }
  if (node.responsive !== undefined) {
    if (!Array.isArray(node.responsive)) {
      errors.push(`${path}.responsive must be an array when provided`);
    } else {
      node.responsive.forEach((rule, index) => {
        if (!isRecord(rule) || !isOneOf(rule.platform, LOWCODE_PLATFORM_VALUES)) {
          errors.push(`${path}.responsive[${index}].platform must be h5 or miniapp`);
        }
      });
    }
  }
  if (node.children !== undefined) {
    if (!Array.isArray(node.children)) {
      errors.push(`${path}.children must be an array when provided`);
    } else {
      node.children.forEach((child, index) => validateNode(child, `${path}.children[${index}]`, errors, nodeIds, actionIds));
    }
  }
}

export function createLowcodeNode(input: Omit<LowcodeNode, "id"> & { id?: string }): LowcodeNode {
  return {
    id: input.id ?? `node_${Math.random().toString(36).slice(2, 10)}`,
    componentName: input.componentName,
    materialVersion: input.materialVersion,
    props: input.props ?? {},
    style: input.style,
    slot: input.slot,
    children: input.children,
    dataBinding: input.dataBinding,
    events: input.events,
    visibility: input.visibility,
    responsive: input.responsive,
    meta: input.meta,
  };
}

export function createLowcodePageSchema(input: CreateLowcodePageSchemaInput): LowcodePageSchema {
  return {
    schemaVersion: LOWCODE_SCHEMA_VERSION,
    pageId: input.pageId,
    pageVersion: input.pageVersion ?? "0.1.0",
    title: input.title,
    status: input.status ?? "draft",
    pageType: input.pageType ?? "custom",
    description: input.description,
    targetPlatforms: input.targetPlatforms ?? ["h5"],
    theme: input.theme,
    layout: input.layout ?? { safeArea: true },
    nodes: input.nodes ?? [],
    dataSources: input.dataSources,
    actions: input.actions,
    tracking: input.tracking,
    publishMeta: {
      environment: input.publishMeta?.environment ?? "test",
      publishedAt: input.publishMeta?.publishedAt,
      rollbackVersion: input.publishMeta?.rollbackVersion,
      operator: input.publishMeta?.operator,
    },
    editor: input.editor,
  };
}

export function normalizeLowcodePageSchema(schema: LowcodePageSchema): LowcodePageSchema {
  return {
    ...schema,
    schemaVersion: schema.schemaVersion || LOWCODE_SCHEMA_VERSION,
    pageVersion: schema.pageVersion || "0.1.0",
    status: schema.status || "draft",
    targetPlatforms: schema.targetPlatforms?.length ? schema.targetPlatforms : ["h5"],
    layout: schema.layout ?? { safeArea: true },
    nodes: schema.nodes ?? [],
    publishMeta: {
      environment: schema.publishMeta?.environment ?? "test",
      publishedAt: schema.publishMeta?.publishedAt,
      rollbackVersion: schema.publishMeta?.rollbackVersion,
      operator: schema.publishMeta?.operator,
    },
  };
}

export function validateLowcodePageSchema(schema: unknown): LowcodeValidationResult {
  const errors: string[] = [];

  if (!isRecord(schema)) {
    return { valid: false, errors: ["schema must be an object"] };
  }

  pushRequiredString(errors, schema.schemaVersion, "schemaVersion");
  pushRequiredString(errors, schema.pageId, "pageId");
  pushRequiredString(errors, schema.pageVersion, "pageVersion");
  pushRequiredString(errors, schema.title, "title");

  if (!isOneOf(schema.status, LOWCODE_PAGE_STATUS_VALUES)) {
    errors.push("status must be draft, preview, published, or disabled");
  }
  if (schema.pageType !== undefined && !isOneOf(schema.pageType, LOWCODE_PAGE_TYPE_VALUES)) {
    errors.push("pageType must be activity, promotion, topic, landing, or custom");
  }
  if (!Array.isArray(schema.targetPlatforms) || schema.targetPlatforms.length === 0) {
    errors.push("targetPlatforms must be a non-empty array");
  } else {
    schema.targetPlatforms.forEach((platform, index) => {
      if (!isOneOf(platform, LOWCODE_PLATFORM_VALUES)) {
        errors.push(`targetPlatforms[${index}] must be h5 or miniapp`);
      }
    });
  }
  if (!isRecord(schema.layout)) {
    errors.push("layout must be an object");
  }
  if (!Array.isArray(schema.nodes)) {
    errors.push("nodes must be an array");
  }
  if (!isRecord(schema.publishMeta)) {
    errors.push("publishMeta is required");
  } else if (typeof schema.publishMeta.environment !== "string") {
    errors.push("publishMeta.environment is required");
  }

  const actions = Array.isArray(schema.actions) ? (schema.actions as LowcodeActionConfig[]) : undefined;
  const dataSources = Array.isArray(schema.dataSources) ? (schema.dataSources as LowcodeDataSourceConfig[]) : undefined;
  validateDuplicateIds(errors, actions, "actions");
  validateDuplicateIds(errors, dataSources, "dataSources");

  const actionIds = new Set(actions?.map((action) => action.id) ?? []);
  const nodeIds = new Set<string>();
  if (Array.isArray(schema.nodes)) {
    schema.nodes.forEach((node, index) => validateNode(node, `nodes[${index}]`, errors, nodeIds, actionIds));
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function assertLowcodePageSchema(schema: unknown): asserts schema is LowcodePageSchema {
  const result = validateLowcodePageSchema(schema);
  if (!result.valid) {
    throw new Error(`Invalid lowcode page schema: ${result.errors.join("; ")}`);
  }
}

export function isSchemaVersionCompatible(schemaVersion: string): boolean {
  return schemaVersion.split(".")[0] === LOWCODE_SCHEMA_VERSION.split(".")[0];
}

export function validateLowcodeMaterialManifest(manifest: unknown): LowcodeValidationResult {
  const errors: string[] = [];

  if (!isRecord(manifest)) {
    return { valid: false, errors: ["manifest must be an object"] };
  }

  pushRequiredString(errors, manifest.componentName, "componentName");
  pushRequiredString(errors, manifest.materialVersion, "materialVersion");
  pushRequiredString(errors, manifest.title, "title");
  pushRequiredString(errors, manifest.category, "category");

  if (!Array.isArray(manifest.platforms) || manifest.platforms.length === 0) {
    errors.push("platforms must be a non-empty array");
  } else {
    manifest.platforms.forEach((platform, index) => {
      if (!isOneOf(platform, LOWCODE_PLATFORM_VALUES)) {
        errors.push(`platforms[${index}] must be h5 or miniapp`);
      }
    });
  }
  if (!isRecord(manifest.propsSchema)) {
    errors.push("propsSchema must be an object");
  }
  if (!isJsonObject(manifest.defaultProps)) {
    errors.push("defaultProps must be an object");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function assertLowcodeMaterialManifest(manifest: unknown): asserts manifest is LowcodeMaterialManifest {
  const result = validateLowcodeMaterialManifest(manifest);
  if (!result.valid) {
    throw new Error(`Invalid lowcode material manifest: ${result.errors.join("; ")}`);
  }
}

export function createMaterialManifest(manifest: LowcodeMaterialManifest): LowcodeMaterialManifest {
  assertLowcodeMaterialManifest(manifest);
  return manifest;
}
