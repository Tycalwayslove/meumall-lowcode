<script setup lang="ts">
import { Check, GripVertical, Layers, Search, X } from "@lucide/vue";
import type { LowcodeEditorOutlineRow } from "@meumall/lowcode-editor";

const props = defineProps<{
  rows: readonly LowcodeEditorOutlineRow[];
  keyword: string;
  visibleSummary: string;
  multiSelectSummary?: string;
  selectedNodeId?: string;
  collapsedNodeIds: readonly string[];
  searchMatchedNodeIds: readonly string[];
  multiSelectedNodeIds: readonly string[];
  groupDraggableNodeIds: readonly string[];
  renamingNodeId?: string;
  renameDraft: string;
}>();

const emit = defineEmits<{
  "update:keyword": [value: string];
  "update:renameDraft": [value: string];
  "node-click": [event: MouseEvent, nodeId: string];
  "node-pointerdown": [event: PointerEvent, nodeId: string];
  "node-dragstart": [event: DragEvent, nodeId: string];
  "node-drop": [event: DragEvent, row: LowcodeEditorOutlineRow];
  "node-contextmenu": [event: MouseEvent, nodeId: string];
  "toggle-collapse": [nodeId: string];
  "toggle-multi-select": [nodeId: string];
  "commit-rename": [];
  "cancel-rename": [];
}>();

function hasNodeId(nodeIds: readonly string[], nodeId: string): boolean {
  return nodeIds.includes(nodeId);
}

function isNodeCollapsed(nodeId: string): boolean {
  return hasNodeId(props.collapsedNodeIds, nodeId);
}

function isSearchMatched(nodeId: string): boolean {
  return hasNodeId(props.searchMatchedNodeIds, nodeId);
}

function isMultiSelected(nodeId: string): boolean {
  return hasNodeId(props.multiSelectedNodeIds, nodeId);
}

function canDragGroup(nodeId: string): boolean {
  return hasNodeId(props.groupDraggableNodeIds, nodeId);
}
</script>

<template>
  <section class="panel-section">
    <div class="panel-title">
      <Layers :size="16" />
      <span>结构</span>
      <small>{{ visibleSummary }}</small>
    </div>
    <label class="search-field outline-search">
      <Search :size="14" />
      <input
        :value="keyword"
        placeholder="搜索节点"
        @input="emit('update:keyword', ($event.target as HTMLInputElement).value)"
      />
    </label>
    <div v-if="multiSelectSummary" class="outline-selection-summary">
      {{ multiSelectSummary }}
    </div>
    <div
      v-for="row in rows"
      :key="row.node.id"
      class="outline-item"
      role="button"
      tabindex="0"
      :class="{
        selected: selectedNodeId === row.node.id,
        'multi-selected': isMultiSelected(row.node.id),
        'group-draggable': canDragGroup(row.node.id),
        'search-matched': isSearchMatched(row.node.id),
        'is-collapsed': isNodeCollapsed(row.node.id),
      }"
      :style="{ paddingLeft: `${12 + row.depth * 18}px` }"
      draggable="true"
      @pointerdown="emit('node-pointerdown', $event, row.node.id)"
      @dragstart="emit('node-dragstart', $event, row.node.id)"
      @dragover.prevent
      @drop.prevent="emit('node-drop', $event, row)"
      @contextmenu.prevent="emit('node-contextmenu', $event, row.node.id)"
      @click="emit('node-click', $event, row.node.id)"
    >
      <GripVertical :size="15" class="drag-icon" />
      <span
        v-if="row.hasChildren"
        class="outline-collapse-toggle"
        role="button"
        tabindex="0"
        :title="isNodeCollapsed(row.node.id) ? '展开节点' : '折叠节点'"
        @click.stop="emit('toggle-collapse', row.node.id)"
        @keydown.enter.prevent.stop="emit('toggle-collapse', row.node.id)"
        @keydown.space.prevent.stop="emit('toggle-collapse', row.node.id)"
      >
        {{ isNodeCollapsed(row.node.id) ? "›" : "⌄" }}
      </span>
      <span v-else class="outline-collapse-placeholder"></span>
      <span
        class="outline-check"
        :class="{ checked: isMultiSelected(row.node.id) }"
        title="多选节点"
        @click.stop="emit('toggle-multi-select', row.node.id)"
      >
        {{ isMultiSelected(row.node.id) ? "✓" : "" }}
      </span>
      <span class="outline-index">{{ row.index + 1 }}</span>
      <span v-if="renamingNodeId === row.node.id" class="outline-rename" @click.stop>
        <input
          :value="renameDraft"
          autofocus
          placeholder="节点名称"
          @input="emit('update:renameDraft', ($event.target as HTMLInputElement).value)"
          @keydown.enter.prevent="emit('commit-rename')"
          @keydown.escape.prevent="emit('cancel-rename')"
        />
        <button type="button" title="确认重命名" @click="emit('commit-rename')">
          <Check :size="14" />
        </button>
        <button type="button" title="取消重命名" @click="emit('cancel-rename')">
          <X :size="14" />
        </button>
      </span>
      <span v-else class="outline-main">
        <strong>{{ row.title }}</strong>
        <small>{{ row.subtitle }}</small>
      </span>
    </div>
    <div v-if="!rows.length" class="mini-empty">没有匹配节点</div>
  </section>
</template>
