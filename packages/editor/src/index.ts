import type {
  JsonObject,
  LowcodeNode,
  LowcodePageSchema,
  LowcodePlatform,
  LowcodeVisibilityRule,
} from "@meumall/lowcode-schema";
import { createLowcodeNode } from "@meumall/lowcode-schema";

export type LowcodeEditorMode = "design" | "preview" | "outline";

export interface LowcodeEditorViewport {
  platform: LowcodePlatform;
  width: number;
  height?: number;
  scale?: number;
}

export interface LowcodeEditorHistory {
  past: LowcodePageSchema[];
  future: LowcodePageSchema[];
  limit: number;
}

export interface LowcodeEditorClipboard {
  node: LowcodeNode;
  copiedAt: string;
}

export interface LowcodeEditorState {
  schema: LowcodePageSchema;
  selectedNodeId?: string;
  mode: LowcodeEditorMode;
  viewport: LowcodeEditorViewport;
  history: LowcodeEditorHistory;
  clipboard?: LowcodeEditorClipboard;
  dirty: boolean;
  lastAction?: string;
}

export interface CreateEditorStateOptions {
  selectedNodeId?: string;
  mode?: LowcodeEditorMode;
  viewport?: Partial<LowcodeEditorViewport>;
  historyLimit?: number;
}

export interface InsertNodeOptions {
  parentId?: string;
  index?: number;
  select?: boolean;
}

export interface MoveNodeOptions {
  nodeId: string;
  targetParentId?: string;
  index?: number;
}

type NodeInput = Omit<LowcodeNode, "id"> & { id?: string };

const DEFAULT_VIEWPORT: LowcodeEditorViewport = {
  platform: "h5",
  width: 375,
  scale: 1,
};

export function createEditorState(schema: LowcodePageSchema, options: CreateEditorStateOptions = {}): LowcodeEditorState {
  return {
    schema,
    selectedNodeId: options.selectedNodeId,
    mode: options.mode ?? "design",
    viewport: {
      ...DEFAULT_VIEWPORT,
      ...options.viewport,
    },
    history: {
      past: [],
      future: [],
      limit: options.historyLimit ?? 50,
    },
    dirty: false,
  };
}

export function selectNode(state: LowcodeEditorState, nodeId: string | undefined): LowcodeEditorState {
  return {
    ...state,
    selectedNodeId: nodeId,
    lastAction: "selectNode",
  };
}

export function setEditorMode(state: LowcodeEditorState, mode: LowcodeEditorMode): LowcodeEditorState {
  return {
    ...state,
    mode,
    lastAction: "setEditorMode",
  };
}

export function setEditorViewport(
  state: LowcodeEditorState,
  viewport: Partial<LowcodeEditorViewport>,
): LowcodeEditorState {
  return {
    ...state,
    viewport: {
      ...state.viewport,
      ...viewport,
    },
    lastAction: "setEditorViewport",
  };
}

export function appendNode(state: LowcodeEditorState, node: NodeInput): LowcodeEditorState {
  return insertNode(state, node, { select: true });
}

export function insertNode(
  state: LowcodeEditorState,
  node: NodeInput,
  options: InsertNodeOptions = {},
): LowcodeEditorState {
  const nextNode = createLowcodeNode(node);
  const nextNodes = insertIntoNodes(state.schema.nodes, nextNode, options.parentId, options.index);
  if (!nextNodes) return state;

  return commitSchemaChange(
    state,
    {
      ...state.schema,
      nodes: nextNodes,
    },
    "insertNode",
    options.select === false ? state.selectedNodeId : nextNode.id,
  );
}

export function updateNodeProps(
  state: LowcodeEditorState,
  nodeId: string,
  propsPatch: JsonObject,
): LowcodeEditorState {
  return updateNode(state, nodeId, (node) => ({
    ...node,
    props: {
      ...node.props,
      ...propsPatch,
    },
  }), "updateNodeProps");
}

export function replaceNodeProps(
  state: LowcodeEditorState,
  nodeId: string,
  props: JsonObject,
): LowcodeEditorState {
  return updateNode(state, nodeId, (node) => ({ ...node, props }), "replaceNodeProps");
}

export function updateNodeStyle(
  state: LowcodeEditorState,
  nodeId: string,
  stylePatch: JsonObject,
): LowcodeEditorState {
  return updateNode(
    state,
    nodeId,
    (node) => ({
      ...node,
      style: {
        ...(node.style ?? {}),
        ...stylePatch,
      },
    }),
    "updateNodeStyle",
  );
}

export function setNodeVisibility(
  state: LowcodeEditorState,
  nodeId: string,
  visibility: LowcodeVisibilityRule | undefined,
): LowcodeEditorState {
  return updateNode(state, nodeId, (node) => ({ ...node, visibility }), "setNodeVisibility");
}

export function copyNode(state: LowcodeEditorState, nodeId: string): LowcodeEditorState {
  const node = findNode(state.schema.nodes, nodeId);
  if (!node) return state;
  return {
    ...state,
    clipboard: {
      node,
      copiedAt: new Date().toISOString(),
    },
    lastAction: "copyNode",
  };
}

export function pasteNode(
  state: LowcodeEditorState,
  options: InsertNodeOptions = {},
): LowcodeEditorState {
  if (!state.clipboard) return state;
  const cloned = cloneNodeWithNewIds(state.clipboard.node);
  const nextNodes = insertIntoNodes(state.schema.nodes, cloned, options.parentId, options.index);
  if (!nextNodes) return state;

  return commitSchemaChange(
    state,
    {
      ...state.schema,
      nodes: nextNodes,
    },
    "pasteNode",
    options.select === false ? state.selectedNodeId : cloned.id,
  );
}

export function duplicateNode(state: LowcodeEditorState, nodeId: string): LowcodeEditorState {
  const located = findNodeWithParent(state.schema.nodes, nodeId);
  if (!located) return state;

  const cloned = cloneNodeWithNewIds(located.node);
  const index = located.index + 1;
  const nextNodes = insertIntoNodes(state.schema.nodes, cloned, located.parentId, index);
  if (!nextNodes) return state;

  return commitSchemaChange(
    state,
    {
      ...state.schema,
      nodes: nextNodes,
    },
    "duplicateNode",
    cloned.id,
  );
}

export function moveNode(state: LowcodeEditorState, fromIndex: number, toIndex: number): LowcodeEditorState {
  const nodes = [...state.schema.nodes];
  const [node] = nodes.splice(fromIndex, 1);
  if (!node) return state;
  nodes.splice(clampIndex(toIndex, nodes.length), 0, node);
  return commitSchemaChange(
    state,
    {
      ...state.schema,
      nodes,
    },
    "moveNode",
    node.id,
  );
}

export function moveNodeById(state: LowcodeEditorState, options: MoveNodeOptions): LowcodeEditorState {
  if (options.targetParentId === options.nodeId) return state;
  if (options.targetParentId && isDescendant(state.schema.nodes, options.nodeId, options.targetParentId)) {
    return state;
  }

  const removed = removeFromNodes(state.schema.nodes, options.nodeId);
  if (!removed.removedNode) return state;

  const nextNodes = insertIntoNodes(removed.nodes, removed.removedNode, options.targetParentId, options.index);
  if (!nextNodes) return state;

  return commitSchemaChange(
    state,
    {
      ...state.schema,
      nodes: nextNodes,
    },
    "moveNodeById",
    options.nodeId,
  );
}

export function removeNode(state: LowcodeEditorState, nodeId: string): LowcodeEditorState {
  const removed = removeFromNodes(state.schema.nodes, nodeId);
  if (!removed.removedNode) return state;

  return commitSchemaChange(
    state,
    {
      ...state.schema,
      nodes: removed.nodes,
    },
    "removeNode",
    state.selectedNodeId === nodeId ? undefined : state.selectedNodeId,
  );
}

export function undo(state: LowcodeEditorState): LowcodeEditorState {
  const previous = state.history.past[state.history.past.length - 1];
  if (!previous) return state;

  return {
    ...state,
    schema: previous,
    history: {
      ...state.history,
      past: state.history.past.slice(0, -1),
      future: [state.schema, ...state.history.future],
    },
    dirty: true,
    lastAction: "undo",
  };
}

export function redo(state: LowcodeEditorState): LowcodeEditorState {
  const [next, ...future] = state.history.future;
  if (!next) return state;

  return {
    ...state,
    schema: next,
    history: {
      ...state.history,
      past: pushHistory(state.history.past, state.schema, state.history.limit),
      future,
    },
    dirty: true,
    lastAction: "redo",
  };
}

export function markSaved(state: LowcodeEditorState): LowcodeEditorState {
  return {
    ...state,
    dirty: false,
    lastAction: "markSaved",
  };
}

function commitSchemaChange(
  state: LowcodeEditorState,
  schema: LowcodePageSchema,
  action: string,
  selectedNodeId = state.selectedNodeId,
): LowcodeEditorState {
  return {
    ...state,
    schema,
    selectedNodeId,
    history: {
      ...state.history,
      past: pushHistory(state.history.past, state.schema, state.history.limit),
      future: [],
    },
    dirty: true,
    lastAction: action,
  };
}

function pushHistory(history: LowcodePageSchema[], schema: LowcodePageSchema, limit: number): LowcodePageSchema[] {
  return [...history, schema].slice(-limit);
}

function updateNode(
  state: LowcodeEditorState,
  nodeId: string,
  updater: (node: LowcodeNode) => LowcodeNode,
  action: string,
): LowcodeEditorState {
  const result = updateNodes(state.schema.nodes, nodeId, updater);
  if (!result.updated) return state;

  return commitSchemaChange(
    state,
    {
      ...state.schema,
      nodes: result.nodes,
    },
    action,
    nodeId,
  );
}

function updateNodes(
  nodes: LowcodeNode[],
  nodeId: string,
  updater: (node: LowcodeNode) => LowcodeNode,
): { nodes: LowcodeNode[]; updated: boolean } {
  let updated = false;
  const nextNodes = nodes.map((node) => {
    if (node.id === nodeId) {
      updated = true;
      return updater(node);
    }

    if (!node.children?.length) return node;
    const childResult = updateNodes(node.children, nodeId, updater);
    if (!childResult.updated) return node;
    updated = true;
    return {
      ...node,
      children: childResult.nodes,
    };
  });

  return { nodes: nextNodes, updated };
}

function insertIntoNodes(
  nodes: LowcodeNode[],
  node: LowcodeNode,
  parentId: string | undefined,
  index: number | undefined,
): LowcodeNode[] | undefined {
  if (!parentId) {
    const nextNodes = [...nodes];
    nextNodes.splice(clampIndex(index ?? nextNodes.length, nextNodes.length), 0, node);
    return nextNodes;
  }

  const result = updateNodes(nodes, parentId, (parent) => {
    const children = [...(parent.children ?? [])];
    children.splice(clampIndex(index ?? children.length, children.length), 0, node);
    return {
      ...parent,
      children,
    };
  });

  return result.updated ? result.nodes : undefined;
}

function removeFromNodes(nodes: LowcodeNode[], nodeId: string): { nodes: LowcodeNode[]; removedNode?: LowcodeNode } {
  let removedNode: LowcodeNode | undefined;
  const nextNodes: LowcodeNode[] = [];

  for (const node of nodes) {
    if (node.id === nodeId) {
      removedNode = node;
      continue;
    }

    if (node.children?.length) {
      const childResult = removeFromNodes(node.children, nodeId);
      if (childResult.removedNode) {
        removedNode = childResult.removedNode;
        nextNodes.push({
          ...node,
          children: childResult.nodes,
        });
        continue;
      }
    }

    nextNodes.push(node);
  }

  return { nodes: nextNodes, removedNode };
}

function findNode(nodes: LowcodeNode[], nodeId: string): LowcodeNode | undefined {
  return findNodeWithParent(nodes, nodeId)?.node;
}

function findNodeWithParent(
  nodes: LowcodeNode[],
  nodeId: string,
  parentId?: string,
): { node: LowcodeNode; parentId?: string; index: number } | undefined {
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (!node) continue;
    if (node.id === nodeId) return { node, parentId, index };
    const childResult = findNodeWithParent(node.children ?? [], nodeId, node.id);
    if (childResult) return childResult;
  }
  return undefined;
}

function isDescendant(nodes: LowcodeNode[], ancestorId: string, targetId: string): boolean {
  const ancestor = findNode(nodes, ancestorId);
  if (!ancestor) return false;
  return Boolean(findNode(ancestor.children ?? [], targetId));
}

function cloneNodeWithNewIds(node: LowcodeNode): LowcodeNode {
  return createLowcodeNode({
    componentName: node.componentName,
    materialVersion: node.materialVersion,
    props: { ...node.props },
    style: node.style ? { ...node.style } : undefined,
    slot: node.slot,
    dataBinding: node.dataBinding ? { ...node.dataBinding } : undefined,
    events: node.events ? { ...node.events } : undefined,
    visibility: node.visibility ? { ...node.visibility } : undefined,
    responsive: node.responsive?.map((rule) => ({
      ...rule,
      props: rule.props ? { ...rule.props } : undefined,
      style: rule.style ? { ...rule.style } : undefined,
    })),
    meta: node.meta ? { ...node.meta } : undefined,
    children: node.children?.map(cloneNodeWithNewIds),
  });
}

function clampIndex(index: number, max: number): number {
  return Math.max(0, Math.min(index, max));
}
