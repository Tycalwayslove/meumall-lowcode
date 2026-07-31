import type { LowcodeNode, LowcodePageSchema } from "@meumall/lowcode-schema";
import { createLowcodeNode } from "@meumall/lowcode-schema";

export interface LowcodeEditorState {
  schema: LowcodePageSchema;
  selectedNodeId?: string;
}

export function createEditorState(schema: LowcodePageSchema): LowcodeEditorState {
  return { schema };
}

export function selectNode(state: LowcodeEditorState, nodeId: string | undefined): LowcodeEditorState {
  return {
    ...state,
    selectedNodeId: nodeId,
  };
}

export function appendNode(
  state: LowcodeEditorState,
  node: Omit<LowcodeNode, "id"> & { id?: string },
): LowcodeEditorState {
  return {
    ...state,
    schema: {
      ...state.schema,
      nodes: [...state.schema.nodes, createLowcodeNode(node)],
    },
  };
}

export function moveNode(state: LowcodeEditorState, fromIndex: number, toIndex: number): LowcodeEditorState {
  const nodes = [...state.schema.nodes];
  const [node] = nodes.splice(fromIndex, 1);
  if (!node) return state;
  nodes.splice(toIndex, 0, node);
  return {
    ...state,
    schema: {
      ...state.schema,
      nodes,
    },
  };
}

export function removeNode(state: LowcodeEditorState, nodeId: string): LowcodeEditorState {
  const remove = (nodes: LowcodeNode[]): LowcodeNode[] =>
    nodes
      .filter((node) => node.id !== nodeId)
      .map((node) => ({
        ...node,
        children: node.children ? remove(node.children) : undefined,
      }));

  return {
    ...state,
    selectedNodeId: state.selectedNodeId === nodeId ? undefined : state.selectedNodeId,
    schema: {
      ...state.schema,
      nodes: remove(state.schema.nodes),
    },
  };
}

