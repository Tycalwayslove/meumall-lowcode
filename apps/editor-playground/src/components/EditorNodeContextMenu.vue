<script setup lang="ts">
import type { CSSProperties } from "vue";
import { ArrowDown, ArrowUp, Copy, Pencil, Plus, Trash2 } from "@lucide/vue";
import type {
  LowcodeEditorNodeOperationAction,
  LowcodeEditorNodeOperationItem,
} from "@meumall/lowcode-editor";

const props = defineProps<{
  open: boolean;
  menuStyle: CSSProperties;
  nodeTitle: string;
  nodeSubtitle: string;
  items: readonly LowcodeEditorNodeOperationItem[];
}>();

const emit = defineEmits<{
  close: [];
  execute: [item: LowcodeEditorNodeOperationItem];
}>();

function isArrowUpAction(action: LowcodeEditorNodeOperationAction): boolean {
  return action === "insertBefore" || action === "moveUp";
}

function isArrowDownAction(action: LowcodeEditorNodeOperationAction): boolean {
  return action === "insertAfter" || action === "moveDown";
}

function isPlusAction(action: LowcodeEditorNodeOperationAction): boolean {
  return action === "addInside" || action === "paste";
}

function isCopyAction(action: LowcodeEditorNodeOperationAction): boolean {
  return action === "copy" || action === "duplicate";
}
</script>

<template>
  <div
    v-if="props.open"
    class="node-context-backdrop"
    aria-hidden="true"
    @click="emit('close')"
    @contextmenu.prevent="emit('close')"
  ></div>
  <div
    v-if="props.open"
    class="node-context-menu"
    :style="props.menuStyle"
    role="menu"
    aria-label="节点操作"
    @click.stop
    @contextmenu.prevent.stop
  >
    <div class="node-context-head">
      <strong>{{ props.nodeTitle }}</strong>
      <span>{{ props.nodeSubtitle }}</span>
    </div>
    <button
      v-for="item in props.items"
      :key="item.action"
      type="button"
      role="menuitem"
      :disabled="item.disabled"
      :class="{ danger: item.danger }"
      @click="emit('execute', item)"
    >
      <Pencil v-if="item.action === 'rename'" :size="15" />
      <ArrowUp v-if="isArrowUpAction(item.action)" :size="15" />
      <ArrowDown v-else-if="isArrowDownAction(item.action)" :size="15" />
      <Plus v-else-if="isPlusAction(item.action)" :size="15" />
      <Copy v-else-if="isCopyAction(item.action)" :size="15" />
      <Trash2 v-else-if="item.action === 'delete'" :size="15" />
      <span>{{ item.label }}</span>
      <small v-if="item.shortcut">{{ item.shortcut }}</small>
    </button>
  </div>
</template>
