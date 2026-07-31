export const LOWCODE_SCHEMA_VERSION = "1.0.0" as const;

export type LowcodePlatform = "h5" | "miniapp";
export type LowcodeEnvironment = "test" | "pre" | "prod";
export type LowcodePageStatus = "draft" | "preview" | "published" | "disabled";

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

export interface LowcodeNode {
  id: string;
  componentName: string;
  materialVersion: string;
  props: JsonObject;
  style?: JsonObject;
  children?: LowcodeNode[];
  dataBinding?: LowcodeDataBinding;
  events?: Record<string, LowcodeActionRef>;
  visibility?: LowcodeVisibilityRule;
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

export interface LowcodePageSchema {
  schemaVersion: typeof LOWCODE_SCHEMA_VERSION | string;
  pageId: string;
  pageVersion: string;
  title: string;
  status: LowcodePageStatus;
  targetPlatforms: LowcodePlatform[];
  theme?: LowcodeThemeConfig;
  layout: LowcodeLayoutConfig;
  nodes: LowcodeNode[];
  dataSources?: LowcodeDataSourceConfig[];
  actions?: LowcodeActionConfig[];
  tracking?: LowcodeTrackingConfig;
  publishMeta: LowcodePublishMeta;
}

export type LowcodePropSetter =
  | "input"
  | "number"
  | "textarea"
  | "switch"
  | "select"
  | "image"
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
  description?: string;
}

export interface LowcodeMaterialManifest {
  componentName: string;
  materialVersion: string;
  title: string;
  category: string;
  platforms: LowcodePlatform[];
  propsSchema: Record<string, LowcodePropSchema>;
  defaultProps: JsonObject;
  events?: Array<{ name: string; title: string }>;
  dataSourceSlots?: Array<{ name: string; acceptedTypes: string[] }>;
}

export interface LowcodeValidationResult {
  valid: boolean;
  errors: string[];
}

export function createLowcodeNode(input: Omit<LowcodeNode, "id"> & { id?: string }): LowcodeNode {
  return {
    id: input.id ?? `node_${Math.random().toString(36).slice(2, 10)}`,
    componentName: input.componentName,
    materialVersion: input.materialVersion,
    props: input.props ?? {},
    style: input.style,
    children: input.children,
    dataBinding: input.dataBinding,
    events: input.events,
    visibility: input.visibility,
  };
}

export function validateLowcodePageSchema(schema: unknown): LowcodeValidationResult {
  const errors: string[] = [];
  const page = schema as Partial<LowcodePageSchema>;

  if (!page || typeof page !== "object") errors.push("schema must be an object");
  if (!page.schemaVersion) errors.push("schemaVersion is required");
  if (!page.pageId) errors.push("pageId is required");
  if (!page.pageVersion) errors.push("pageVersion is required");
  if (!page.title) errors.push("title is required");
  if (!Array.isArray(page.targetPlatforms)) errors.push("targetPlatforms must be an array");
  if (!Array.isArray(page.nodes)) errors.push("nodes must be an array");
  if (!page.publishMeta) errors.push("publishMeta is required");

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

export function createMaterialManifest(
  manifest: LowcodeMaterialManifest,
): LowcodeMaterialManifest {
  return manifest;
}

