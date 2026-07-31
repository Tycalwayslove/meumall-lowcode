<script setup lang="ts">
import { ArrowDown, ArrowUp, Copy, MoreHorizontal, Plus, Trash2 } from "@lucide/vue";
import type {
  LowcodeEditorNodeOperationAction,
  LowcodeEditorNodeOperationItem,
} from "@meumall/lowcode-editor";

interface CanvasContextMaterialOption {
  componentName: string;
  title: string;
}

const props = defineProps<{
  materialTitle: string;
  nodeId: string;
  materialOptions: readonly CanvasContextMaterialOption[];
  selectedInsertComponentName: string;
  operationItems: readonly LowcodeEditorNodeOperationItem[];
}>();

const emit = defineEmits<{
  (event: "update:selectedInsertComponentName", value: string): void;
  (event: "insert-before"): void;
  (event: "insert-after"): void;
  (event: "add-inside"): void;
  (event: "move-up"): void;
  (event: "move-down"): void;
  (event: "duplicate"): void;
  (event: "open-more", value: MouseEvent): void;
  (event: "remove"): void;
}>();

function isOperationDisabled(action: LowcodeEditorNodeOperationAction): boolean {
  return Boolean(props.operationItems.find((item) => item.action === action)?.disabled);
}

function getSelectValue(event: Event): string {
  return (event.target as HTMLSelectElement).value;
}
</script>

<template>
  <div class="canvas-context-toolbar">
    <div class="context-title">
      <strong>{{ materialTitle }}</strong>
      <span>{{ nodeId }}</span>
    </div>
    <label>
      <span>插入物料</span>
      <select
        :value="selectedInsertComponentName"
        @change="emit('update:selectedInsertComponentName', getSelectValue($event))"
      >
        <option
          v-for="material in materialOptions"
          :key="`insert-${material.componentName}`"
          :value="material.componentName"
        >
          {{ material.title }}
        </option>
      </select>
    </label>
    <div class="context-actions">
      <button
        type="button"
        title="在当前节点前插入"
        :disabled="isOperationDisabled('insertBefore')"
        @click="emit('insert-before')"
      >
        <ArrowUp :size="15" />
        <span>前方插入</span>
      </button>
      <button
        type="button"
        title="在当前节点后插入"
        :disabled="isOperationDisabled('insertAfter')"
        @click="emit('insert-after')"
      >
        <ArrowDown :size="15" />
        <span>后方插入</span>
      </button>
      <button
        type="button"
        title="加入选中容器"
        :disabled="isOperationDisabled('addInside')"
        @click="emit('add-inside')"
      >
        <Plus :size="15" />
        <span>加入容器</span>
      </button>
      <button
        type="button"
        title="上移当前节点"
        :disabled="isOperationDisabled('moveUp')"
        @click="emit('move-up')"
      >
        <ArrowUp :size="15" />
        <span>上移</span>
      </button>
      <button
        type="button"
        title="下移当前节点"
        :disabled="isOperationDisabled('moveDown')"
        @click="emit('move-down')"
      >
        <ArrowDown :size="15" />
        <span>下移</span>
      </button>
      <button type="button" title="创建副本" @click="emit('duplicate')">
        <Copy :size="15" />
        <span>副本</span>
      </button>
      <button type="button" title="更多节点操作" @click="emit('open-more', $event)">
        <MoreHorizontal :size="15" />
        <span>更多</span>
      </button>
      <button type="button" title="删除节点" class="danger" @click="emit('remove')">
        <Trash2 :size="15" />
        <span>删除</span>
      </button>
    </div>
  </div>
</template>
