import {
  defineComponent,
  h,
  type Component,
  type PropType,
  type VNodeChild,
} from "vue";
import {
  createRuntimeContext,
  evaluateVisibility,
  mergeBoundProps,
  type LowcodeActionExecutor,
  type MaterialRegistry,
} from "@meumall/lowcode-core";
import type { JsonObject, LowcodeNode, LowcodePageSchema } from "@meumall/lowcode-schema";

export type VueH5MaterialComponent = Component;
export type RuntimeMaterialProps = Record<string, unknown>;

export const LowcodeVueRenderer = defineComponent({
  name: "LowcodeVueRenderer",
  props: {
    schema: {
      type: Object as PropType<LowcodePageSchema>,
      required: true,
    },
    registry: {
      type: Object as PropType<MaterialRegistry<VueH5MaterialComponent>>,
      required: true,
    },
    data: {
      type: Object as PropType<JsonObject>,
      default: () => ({}),
    },
    actionExecutor: {
      type: Object as PropType<LowcodeActionExecutor>,
      default: undefined,
    },
    fallback: {
      type: [String, Object, Function] as PropType<VNodeChild>,
      default: null,
    },
  },
  setup(props) {
    const renderNode = (node: LowcodeNode): VNodeChild => {
      if (!evaluateVisibility(node.visibility, props.data)) return null;

      const material = props.registry.get(node.componentName);
      if (!material) {
        return h("div", { class: "mlc-runtime-missing", "data-lowcode-missing": node.componentName }, [
          `缺少物料：${node.componentName}`,
        ]);
      }

      const runtimeContext = createRuntimeContext(props.schema, props.data);
      const materialProps: RuntimeMaterialProps = mergeBoundProps(node.props, props.data, node.dataBinding);
      const events = Object.fromEntries(
        Object.entries(node.events ?? {}).map(([eventName, actionRef]) => [
          eventName,
          () => props.actionExecutor?.execute(actionRef, runtimeContext),
        ]),
      );
      const children = node.children?.map((child) => renderNode(child)) ?? [];

      return h(
        material.component,
        {
          key: node.id,
          props: {
            ...materialProps,
            ...events,
          },
          node,
        },
        () => children,
      );
    };

    return () => {
      if (!props.schema.nodes?.length) return props.fallback;
      return h(
        "div",
        {
          class: "mlc-runtime-page",
          "data-lowcode-page": props.schema.pageId,
        },
        props.schema.nodes.map((node) => renderNode(node)),
      );
    };
  },
});

