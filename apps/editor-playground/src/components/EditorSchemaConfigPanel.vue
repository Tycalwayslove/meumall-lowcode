<script setup lang="ts">
import { Database, PanelRight, Plus } from "@lucide/vue";
import type {
  LowcodeEditorActionFormItem,
  LowcodeEditorActionTypeOption,
  LowcodeEditorDataSourceFormItem,
} from "@meumall/lowcode-editor";

defineProps<{
  dataSourceItems: readonly LowcodeEditorDataSourceFormItem[];
  actionItems: readonly LowcodeEditorActionFormItem[];
  actionTypeOptions: readonly LowcodeEditorActionTypeOption[];
  actionMessage: string;
}>();

const emit = defineEmits<{
  (event: "add-data-source"): void;
  (event: "update-data-source-id", index: number, value: string): void;
  (event: "update-data-source-type", index: number, value: string): void;
  (event: "update-data-source-bind-to", index: number, value: string): void;
  (event: "update-data-source-params", index: number, value: string): void;
  (event: "remove-data-source", index: number): void;
  (event: "add-action"): void;
  (event: "update-action-id", index: number, value: string): void;
  (event: "update-action-type", index: number, value: string): void;
  (event: "update-action-params", index: number, value: string): void;
  (event: "remove-action", index: number): void;
}>();

function getInputValue(event: Event): string {
  return (event.target as HTMLInputElement).value;
}

function getTextAreaValue(event: Event): string {
  return (event.target as HTMLTextAreaElement).value;
}

function getSelectValue(event: Event): string {
  return (event.target as HTMLSelectElement).value;
}
</script>

<template>
  <section class="panel-section">
    <div class="panel-title">
      <Database :size="16" />
      <span>数据源</span>
    </div>
    <div class="data-source-list">
      <div
        v-for="(dataSourceItem, index) in dataSourceItems"
        :key="dataSourceItem.id"
        class="data-source-card"
      >
        <label class="field">
          <span>ID</span>
          <input
            :value="dataSourceItem.id"
            @input="emit('update-data-source-id', index, getInputValue($event))"
          />
        </label>
        <label class="field">
          <span>类型</span>
          <input
            :value="dataSourceItem.type"
            @input="emit('update-data-source-type', index, getInputValue($event))"
          />
        </label>
        <label class="field">
          <span>绑定到</span>
          <input
            :value="dataSourceItem.bindTo"
            @input="emit('update-data-source-bind-to', index, getInputValue($event))"
          />
        </label>
        <label class="field">
          <span>参数 JSON</span>
          <textarea
            :value="dataSourceItem.paramsText"
            rows="4"
            @change="emit('update-data-source-params', index, getTextAreaValue($event))"
          />
        </label>
        <div
          class="data-source-status"
          :class="`is-${dataSourceItem.status}`"
        >
          <strong>{{ dataSourceItem.statusText }}</strong>
          <span>{{ dataSourceItem.statusDescription }}</span>
        </div>
        <button class="text-danger" @click="emit('remove-data-source', index)">删除数据源</button>
      </div>
    </div>
    <button class="reset-button" @click="emit('add-data-source')">
      <Plus :size="16" />
      <span>新增数据源</span>
    </button>
  </section>

  <section class="panel-section">
    <div class="panel-title">
      <PanelRight :size="16" />
      <span>动作</span>
    </div>
    <div class="data-source-list">
      <div
        v-for="(actionItem, index) in actionItems"
        :key="actionItem.id"
        class="action-card"
      >
        <label class="field">
          <span>ID</span>
          <input
            :value="actionItem.id"
            @input="emit('update-action-id', index, getInputValue($event))"
          />
        </label>
        <label class="field">
          <span>类型</span>
          <select
            :value="actionItem.type"
            @change="emit('update-action-type', index, getSelectValue($event))"
          >
            <option v-for="option in actionTypeOptions" :key="option.type" :value="option.type">
              {{ option.label }}
            </option>
          </select>
        </label>
        <label class="field">
          <span>参数 JSON</span>
          <textarea
            :value="actionItem.paramsText"
            rows="4"
            @change="emit('update-action-params', index, getTextAreaValue($event))"
          />
        </label>
        <button class="text-danger" @click="emit('remove-action', index)">删除动作</button>
      </div>
    </div>
    <button class="reset-button" @click="emit('add-action')">
      <Plus :size="16" />
      <span>新增动作</span>
    </button>
    <p v-if="actionMessage" class="action-message">{{ actionMessage }}</p>
  </section>
</template>
