import React from "react";
import {
  createRuntimeContext,
  evaluateVisibility,
  mergeBoundProps,
  type LowcodeActionExecutor,
  type MaterialRegistry,
} from "@meumall/lowcode-core";
import type { JsonObject, LowcodeNode, LowcodePageSchema } from "@meumall/lowcode-schema";

export type RuntimeMaterialProps = Record<string, unknown>;

export type H5MaterialComponent<Props extends RuntimeMaterialProps = RuntimeMaterialProps> = React.ComponentType<{
  props: Props;
  node: LowcodeNode;
  children?: React.ReactNode;
}>;

export interface LowcodeRendererProps {
  schema: LowcodePageSchema;
  registry: MaterialRegistry<H5MaterialComponent>;
  data?: JsonObject;
  actionExecutor?: LowcodeActionExecutor;
  fallback?: React.ReactNode;
  onRenderError?: (error: Error, node?: LowcodeNode) => void;
}

class MaterialErrorBoundary extends React.Component<
  {
    node: LowcodeNode;
    onRenderError?: (error: Error, node?: LowcodeNode) => void;
    children: React.ReactNode;
  },
  { error?: Error }
> {
  state: { error?: Error } = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    this.props.onRenderError?.(error, this.props.node);
  }

  render() {
    if (this.state.error) {
      return <div data-lowcode-error={this.props.node.id}>组件渲染失败</div>;
    }
    return this.props.children;
  }
}

function renderNode({
  node,
  registry,
  data,
  actionExecutor,
  context,
  onRenderError,
}: {
  node: LowcodeNode;
  registry: MaterialRegistry<H5MaterialComponent>;
  data: JsonObject;
  actionExecutor?: LowcodeActionExecutor;
  context: ReturnType<typeof createRuntimeContext>;
  onRenderError?: (error: Error, node?: LowcodeNode) => void;
}): React.ReactNode {
  if (!evaluateVisibility(node.visibility, data)) return null;

  const material = registry.get(node.componentName);
  if (!material) {
    return <div data-lowcode-missing={node.componentName}>缺少物料：{node.componentName}</div>;
  }

  const Component = material.component;
  const props: RuntimeMaterialProps = mergeBoundProps(node.props, data, node.dataBinding);
  const events = Object.fromEntries(
    Object.entries(node.events ?? {}).map(([eventName, actionRef]) => [
      eventName,
      () => actionExecutor?.execute(actionRef, context),
    ]),
  );
  const children = node.children?.map((child) => (
    <React.Fragment key={child.id}>
      {renderNode({ node: child, registry, data, actionExecutor, context, onRenderError })}
    </React.Fragment>
  ));

  return (
    <div key={node.id} className="mlc-runtime-node" data-lowcode-node-id={node.id}>
      <MaterialErrorBoundary node={node} onRenderError={onRenderError}>
        <Component props={{ ...props, ...events }} node={node}>
          {children}
        </Component>
      </MaterialErrorBoundary>
    </div>
  );
}

export function LowcodeRenderer({
  schema,
  registry,
  data = {},
  actionExecutor,
  fallback = null,
  onRenderError,
}: LowcodeRendererProps) {
  if (!schema.nodes?.length) return <>{fallback}</>;

  const context = createRuntimeContext(schema, data);

  return (
    <div data-lowcode-page={schema.pageId}>
      {schema.nodes.map((node) => (
        <React.Fragment key={node.id}>
          {renderNode({ node, registry, data, actionExecutor, context, onRenderError })}
        </React.Fragment>
      ))}
    </div>
  );
}
