import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  createLowcodeRuntimeHealthSummary,
  loadLowcodeRuntimeSchema,
  resolveLowcodeDataSources,
  type CreateLowcodeRuntimeHealthSummaryInput,
  type DataSourceRegistry,
  type DataSourceResolutionRecord,
  type LoadRuntimeSchemaInput,
  type LowcodeRuntimeHealthSummary,
  type RuntimeSchemaSourceType,
} from "@meumall/lowcode-adapters";
import { createMaterialRegistry, type LowcodeActionExecutor, type LowcodeMaterial, type MaterialRegistry } from "@meumall/lowcode-core";
import { h5Materials } from "@meumall/lowcode-materials-h5";
import { LowcodeRenderer, type H5MaterialComponent } from "@meumall/lowcode-renderer-h5";
import { validateLowcodePageSchema, type JsonObject, type LowcodeNode, type LowcodePageSchema } from "@meumall/lowcode-schema";

export interface LowcodeReactH5RuntimeViewModelInput {
  schema?: LowcodePageSchema;
  source?: RuntimeSchemaSourceType;
  sourceError?: string;
  schemaLoading?: boolean;
  dataResolving?: boolean;
  dataSourceRecords?: readonly DataSourceResolutionRecord[];
  actionLogCount?: number;
  renderErrors?: readonly string[];
}

export interface LowcodeReactH5RuntimeViewModel {
  validation: ReturnType<typeof validateLowcodePageSchema>;
  nodeCount: number;
  healthSummary: LowcodeRuntimeHealthSummary;
}

export interface UseLowcodeReactH5RuntimeOptions {
  runtimeInput: LoadRuntimeSchemaInput;
  dataSourceRegistry?: DataSourceRegistry;
  initialData?: JsonObject;
  actionExecutor?: LowcodeActionExecutor;
  actionLogCount?: number;
  renderErrorLimit?: number;
}

export interface LowcodeReactH5RuntimeState extends LowcodeReactH5RuntimeViewModel {
  schema?: LowcodePageSchema;
  source: RuntimeSchemaSourceType;
  sourceError?: string;
  data: JsonObject;
  dataSourceRecords: DataSourceResolutionRecord[];
  schemaLoading: boolean;
  dataResolving: boolean;
  actionExecutor?: LowcodeActionExecutor;
  renderErrors: string[];
  recordRenderError: (error: Error, node?: LowcodeNode) => void;
  clearRenderErrors: () => void;
}

export interface LowcodeReactH5RuntimeProps {
  runtime: LowcodeReactH5RuntimeState;
  registry?: MaterialRegistry<H5MaterialComponent>;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  missingSchemaFallback?: React.ReactNode;
}

export function createDefaultReactH5MaterialRegistry(
  extraMaterials: LowcodeMaterial<H5MaterialComponent>[] = [],
): MaterialRegistry<H5MaterialComponent> {
  return createMaterialRegistry([...h5Materials, ...extraMaterials]);
}

export function countLowcodeReactH5RuntimeNodes(schema: LowcodePageSchema | undefined): number {
  const walk = (nodes: LowcodePageSchema["nodes"]): number => {
    return nodes.reduce((total, node) => total + 1 + walk(node.children ?? []), 0);
  };
  return schema ? walk(schema.nodes) : 0;
}

export function createLowcodeReactH5RuntimeViewModel(
  input: LowcodeReactH5RuntimeViewModelInput,
): LowcodeReactH5RuntimeViewModel {
  const validation = input.schema
    ? validateLowcodePageSchema(input.schema)
    : { valid: false, errors: ["Runtime schema is empty"] };
  const nodeCount = countLowcodeReactH5RuntimeNodes(input.schema);
  const healthInput: CreateLowcodeRuntimeHealthSummaryInput = {
    loading: input.schemaLoading,
    schema: input.schema,
    source: input.source,
    sourceError: input.sourceError,
    validationValid: validation.valid,
    validationErrors: validation.errors,
    nodeCount,
    dataResolving: input.dataResolving,
    dataSourceRecords: input.dataSourceRecords,
    actionLogCount: input.actionLogCount,
    renderErrors: input.renderErrors,
  };

  return {
    validation,
    nodeCount,
    healthSummary: createLowcodeRuntimeHealthSummary(healthInput),
  };
}

export function useLowcodeReactH5Runtime(options: UseLowcodeReactH5RuntimeOptions): LowcodeReactH5RuntimeState {
  const [schema, setSchema] = useState<LowcodePageSchema | undefined>();
  const [source, setSource] = useState<RuntimeSchemaSourceType>("fallback");
  const [sourceError, setSourceError] = useState<string | undefined>();
  const [data, setData] = useState<JsonObject>(options.initialData ?? {});
  const [dataSourceRecords, setDataSourceRecords] = useState<DataSourceResolutionRecord[]>([]);
  const [schemaLoading, setSchemaLoading] = useState(true);
  const [dataResolving, setDataResolving] = useState(Boolean(options.dataSourceRegistry));
  const [renderErrors, setRenderErrors] = useState<string[]>([]);
  const renderErrorLimit = options.renderErrorLimit ?? 20;

  useEffect(() => {
    let cancelled = false;
    setSchemaLoading(true);
    setSchema(undefined);
    setRenderErrors([]);
    loadLowcodeRuntimeSchema(options.runtimeInput)
      .then((result) => {
        if (cancelled) return;
        setSchema(result.schema ?? options.runtimeInput.fallbackSchema);
        setSource(result.source);
        setSourceError(result.error);
      })
      .finally(() => {
        if (!cancelled) setSchemaLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [options.runtimeInput]);

  useEffect(() => {
    let cancelled = false;

    if (!schema || !options.dataSourceRegistry) {
      setData(options.initialData ?? {});
      setDataSourceRecords([]);
      setDataResolving(false);
      return () => {
        cancelled = true;
      };
    }

    setDataResolving(true);
    resolveLowcodeDataSources(schema.dataSources ?? [], options.dataSourceRegistry, {
      initialData: options.initialData,
    })
      .then((result) => {
        if (cancelled) return;
        setData(result.data);
        setDataSourceRecords(result.records);
      })
      .finally(() => {
        if (!cancelled) setDataResolving(false);
      });

    return () => {
      cancelled = true;
    };
  }, [options.dataSourceRegistry, options.initialData, schema]);

  const recordRenderError = useCallback(
    (error: Error, node?: LowcodeNode) => {
      setRenderErrors((current) => [`${node?.id ?? "unknown"}: ${error.message}`, ...current].slice(0, renderErrorLimit));
    },
    [renderErrorLimit],
  );
  const clearRenderErrors = useCallback(() => {
    setRenderErrors([]);
  }, []);
  const viewModel = useMemo(
    () =>
      createLowcodeReactH5RuntimeViewModel({
        schema,
        source,
        sourceError,
        schemaLoading,
        dataResolving,
        dataSourceRecords,
        actionLogCount: options.actionLogCount,
        renderErrors,
      }),
    [dataResolving, dataSourceRecords, options.actionLogCount, renderErrors, schema, schemaLoading, source, sourceError],
  );

  return {
    schema,
    source,
    sourceError,
    data,
    dataSourceRecords,
    schemaLoading,
    dataResolving,
    actionExecutor: options.actionExecutor,
    renderErrors,
    recordRenderError,
    clearRenderErrors,
    ...viewModel,
  };
}

export function LowcodeReactH5Runtime({
  runtime,
  registry = createDefaultReactH5MaterialRegistry(),
  fallback = <div className="runtime-empty">页面暂无内容，H5 runtime 已进入安全空态</div>,
  loadingFallback = null,
  missingSchemaFallback = <div className="runtime-empty">未获得可渲染 schema</div>,
}: LowcodeReactH5RuntimeProps) {
  if (runtime.schemaLoading && !runtime.schema) return <>{loadingFallback}</>;
  if (!runtime.schema) return <>{missingSchemaFallback}</>;

  return (
    <LowcodeRenderer
      schema={runtime.schema}
      registry={registry}
      data={runtime.data}
      actionExecutor={runtime.actionExecutor}
      fallback={fallback}
      onRenderError={runtime.recordRenderError}
    />
  );
}
