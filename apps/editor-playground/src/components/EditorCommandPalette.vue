<script setup lang="ts">
import { nextTick, ref } from "vue";
import { Search } from "@lucide/vue";
import type { LowcodeEditorCommandEntry } from "@meumall/lowcode-editor";

export interface EditorCommandPaletteItem extends LowcodeEditorCommandEntry {
  description: string;
  disabled?: boolean;
  run: () => void | Promise<void>;
}

const props = defineProps<{
  open: boolean;
  keyword: string;
  items: readonly EditorCommandPaletteItem[];
}>();

const emit = defineEmits<{
  close: [];
  "update-keyword": [value: string];
  "execute-first": [];
  execute: [item: EditorCommandPaletteItem];
}>();

const searchInputRef = ref<HTMLInputElement>();

function focusSearchInput(): void {
  void nextTick(() => {
    searchInputRef.value?.focus();
  });
}

defineExpose({
  focusSearchInput,
});
</script>

<template>
  <div
    v-if="props.open"
    class="command-palette-overlay"
    role="dialog"
    aria-modal="true"
    aria-label="快捷命令"
    @click.self="emit('close')"
  >
    <section class="command-palette">
      <label class="command-search">
        <Search :size="17" />
        <input
          ref="searchInputRef"
          :value="props.keyword"
          placeholder="搜索命令、物料或模板"
          @input="emit('update-keyword', ($event.target as HTMLInputElement).value)"
          @keydown.enter.prevent="emit('execute-first')"
          @keydown.escape.prevent="emit('close')"
        />
      </label>
      <div class="command-list">
        <button
          v-for="item in props.items"
          :key="item.id"
          type="button"
          class="command-palette-item"
          :disabled="item.disabled"
          @click="emit('execute', item)"
        >
          <span class="command-item-main">
            <strong>{{ item.title }}</strong>
            <small>{{ item.description }}</small>
          </span>
          <span class="command-group">{{ item.disabled ? "不可用" : item.group }}</span>
        </button>
        <div v-if="!props.items.length" class="mini-empty">没有匹配命令</div>
      </div>
    </section>
  </div>
</template>
