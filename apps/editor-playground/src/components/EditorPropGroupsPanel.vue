<script setup lang="ts">
import { ChevronDown, GripVertical, Image, PanelRight, Search } from "@lucide/vue";
import type { LowcodeImageAssetResource } from "@meumall/lowcode-adapters";
import {
  createLowcodeListEditorFields,
  getLowcodePropEditorControl,
  isLowcodeListImageField,
  isLowcodeListPropEditor,
  toLowcodePropInputBoolean,
  toLowcodePropInputText,
  type LowcodeEditorEventBindingItem,
  type LowcodeEditorListField,
  type LowcodeEditorPropGroup,
  type LowcodeEditorPropGroupKey,
} from "@meumall/lowcode-editor";
import type { JsonValue, LowcodePropSchema } from "@meumall/lowcode-schema";

interface ListItemDragState {
  propName: string;
  fromIndex: number;
  overIndex?: number;
}

interface ListAssetTarget {
  propName: string;
  itemIndex: number;
  fieldName: string;
  fieldLabel: string;
}

const props = defineProps<{
  propGroups: readonly LowcodeEditorPropGroup[];
  selectedProps: Record<string, JsonValue>;
  selectedComponentName: string;
  collapsedGroups: Partial<Record<LowcodeEditorPropGroupKey, boolean>>;
  listItemDragState?: ListItemDragState;
  listAssetTarget?: ListAssetTarget;
  assetKeyword: string;
  assetCategory: string;
  assetCategories: readonly string[];
  filteredAssets: readonly LowcodeImageAssetResource[];
  isAssetSearching: boolean;
  eventBindings: readonly LowcodeEditorEventBindingItem[];
}>();

const emit = defineEmits<{
  "toggle-group": [key: LowcodeEditorPropGroupKey];
  "update-prop": [propName: string, propSchema: LowcodePropSchema, value: unknown];
  "add-list-item": [propName: string, propSchema: LowcodePropSchema];
  "duplicate-list-item": [propName: string, propSchema: LowcodePropSchema, index: number];
  "remove-list-item": [propName: string, propSchema: LowcodePropSchema, index: number];
  "move-list-item": [propName: string, propSchema: LowcodePropSchema, index: number, offset: -1 | 1];
  "list-item-drag-start": [event: DragEvent, propName: string, index: number];
  "list-item-drag-over": [event: DragEvent, propName: string, index: number];
  "list-item-drop": [event: DragEvent, propName: string, propSchema: LowcodePropSchema, index: number];
  "list-item-drag-end": [];
  "update-list-item-field": [propName: string, propSchema: LowcodePropSchema, index: number, fieldName: string, value: string];
  "open-list-asset-picker": [propName: string, propSchema: LowcodePropSchema, itemIndex: number, field: LowcodeEditorListField];
  "close-list-asset-picker": [];
  "update:assetKeyword": [value: string];
  "update:assetCategory": [value: string];
  "apply-list-asset": [asset: LowcodeImageAssetResource];
  "apply-sample-products": [];
  "bind-products-data-source": [];
  "bind-event": [eventName: string, actionId: string];
}>();

function isRecord(value: unknown): value is Record<string, JsonValue> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function getPropArray(propName: string): JsonValue[] {
  const value = props.selectedProps[propName];
  return Array.isArray(value) ? ([...value] as JsonValue[]) : [];
}

function toEditableListItem(value: JsonValue): Record<string, JsonValue> {
  return isRecord(value) ? { ...value } : { value };
}

function getListItems(propName: string): Record<string, JsonValue>[] {
  return getPropArray(propName).map((item) => toEditableListItem(item));
}

function listEditorFields(propName: string): LowcodeEditorListField[] {
  return createLowcodeListEditorFields(propName, {
    componentName: props.selectedComponentName,
    items: getPropArray(propName),
  });
}

function isGroupCollapsed(key: LowcodeEditorPropGroupKey): boolean {
  return Boolean(props.collapsedGroups[key]);
}

function isStructured(propSchema: LowcodePropSchema): boolean {
  return getLowcodePropEditorControl(propSchema) === "json";
}

function isSelect(propSchema: LowcodePropSchema): boolean {
  return getLowcodePropEditorControl(propSchema) === "select";
}

function asText(value: JsonValue | undefined): string {
  return toLowcodePropInputText(value);
}

function optionValue(value: JsonValue): string {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : JSON.stringify(value);
}

function findOptionValue(propSchema: LowcodePropSchema, value: string): JsonValue {
  const option = propSchema.options?.find((item) => optionValue(item.value) === value);
  return option?.value ?? value;
}

function asBoolean(value: unknown): boolean {
  return toLowcodePropInputBoolean(value);
}

function numberStep(propSchema: LowcodePropSchema): number {
  return typeof propSchema.step === "number" && propSchema.step > 0 ? propSchema.step : 1;
}

function numberMin(propSchema: LowcodePropSchema): number | undefined {
  return typeof propSchema.min === "number" ? propSchema.min : undefined;
}

function numberMax(propSchema: LowcodePropSchema): number | undefined {
  return typeof propSchema.max === "number" ? propSchema.max : undefined;
}

function roundNumber(value: number, step: number): number {
  const decimals = String(step).split(".")[1]?.length ?? 0;
  return Number(value.toFixed(Math.min(6, decimals)));
}

function clampNumber(propSchema: LowcodePropSchema, value: number): number {
  let nextValue = value;
  if (typeof propSchema.min === "number") nextValue = Math.max(propSchema.min, nextValue);
  if (typeof propSchema.max === "number") nextValue = Math.min(propSchema.max, nextValue);
  return nextValue;
}

function adjustNumber(propName: string, propSchema: LowcodePropSchema, offset: -1 | 1): void {
  const currentValue = Number(props.selectedProps[propName] ?? propSchema.defaultValue ?? 0);
  const baseValue = Number.isFinite(currentValue) ? currentValue : typeof propSchema.defaultValue === "number" ? propSchema.defaultValue : 0;
  const step = numberStep(propSchema);
  const nextValue = clampNumber(propSchema, roundNumber(baseValue + step * offset, step));
  emit("update-prop", propName, propSchema, nextValue);
}

function isActiveListAssetTarget(propName: string, itemIndex: number, fieldName: string): boolean {
  const target = props.listAssetTarget;
  return Boolean(target && target.propName === propName && target.itemIndex === itemIndex && target.fieldName === fieldName);
}

function isListAssetPanelOpen(propName: string, itemIndex: number): boolean {
  const target = props.listAssetTarget;
  return Boolean(target && target.propName === propName && target.itemIndex === itemIndex);
}

function listItemDragClass(propName: string, index: number): Record<string, boolean> {
  const state = props.listItemDragState;
  return {
    dragging: Boolean(state && state.propName === propName && state.fromIndex === index),
    "drag-over": Boolean(state && state.propName === propName && state.overIndex === index && state.fromIndex !== index),
  };
}

function canUseProductQuickActions(propName: string): boolean {
  return (
    propName === "items" &&
    ["ProductList", "ProductRankList", "BrandFeatureSection", "FlashSaleList"].includes(props.selectedComponentName)
  );
}
</script>

<template>
  <div class="property-groups">
    <section
      v-for="group in propGroups"
      :key="group.key"
      class="property-group"
      :class="{ collapsed: isGroupCollapsed(group.key) }"
    >
      <button type="button" class="property-group-head" @click="emit('toggle-group', group.key)">
        <span>
          <strong>{{ group.label }}</strong>
          <small>{{ group.description }}</small>
        </span>
        <em>{{ group.entries.length }} 项</em>
        <ChevronDown :size="15" />
      </button>
      <div v-if="!isGroupCollapsed(group.key)" class="property-group-body">
        <div
          v-for="entry in group.entries"
          :key="entry.name"
          class="field"
        >
          <span>{{ entry.schema.label }}</span>
          <div v-if="isLowcodeListPropEditor(entry.schema)" class="list-prop-editor">
            <div class="list-prop-head">
              <small>已配置 {{ getListItems(entry.name).length }} 项</small>
              <button type="button" @click="emit('add-list-item', entry.name, entry.schema)">新增一项</button>
            </div>
            <div v-if="!getListItems(entry.name).length" class="mini-empty">暂无列表项，点击新增开始配置</div>
            <article
              v-for="(item, itemIndex) in getListItems(entry.name)"
              :key="`${entry.name}-${itemIndex}`"
              class="list-item-editor"
              :class="listItemDragClass(entry.name, itemIndex)"
              draggable="true"
              @dragstart="emit('list-item-drag-start', $event, entry.name, itemIndex)"
              @dragover="emit('list-item-drag-over', $event, entry.name, itemIndex)"
              @drop="emit('list-item-drop', $event, entry.name, entry.schema, itemIndex)"
              @dragend="emit('list-item-drag-end')"
            >
              <div class="list-item-head">
                <strong>
                  <GripVertical :size="14" />
                  <span>第 {{ itemIndex + 1 }} 项</span>
                </strong>
                <div>
                  <button
                    type="button"
                    :disabled="itemIndex === 0"
                    @click="emit('move-list-item', entry.name, entry.schema, itemIndex, -1)"
                  >
                    上移
                  </button>
                  <button
                    type="button"
                    :disabled="itemIndex === getListItems(entry.name).length - 1"
                    @click="emit('move-list-item', entry.name, entry.schema, itemIndex, 1)"
                  >
                    下移
                  </button>
                  <button type="button" @click="emit('duplicate-list-item', entry.name, entry.schema, itemIndex)">复制</button>
                  <button type="button" class="danger" @click="emit('remove-list-item', entry.name, entry.schema, itemIndex)">删除</button>
                </div>
              </div>
              <div class="list-field-grid">
                <label
                  v-for="field in listEditorFields(entry.name)"
                  :key="`${entry.name}-${itemIndex}-${field.name}`"
                  class="mini-field"
                  :class="{ wide: field.multiline || field.name === 'imageUrl' || field.name === 'content' }"
                >
                  <span>{{ field.label }}</span>
                  <textarea
                    v-if="field.multiline"
                    rows="2"
                    :placeholder="field.placeholder"
                    :value="asText(item[field.name])"
                    @input="emit('update-list-item-field', entry.name, entry.schema, itemIndex, field.name, ($event.target as HTMLTextAreaElement).value)"
                  />
                  <input
                    v-else-if="!isLowcodeListImageField(field)"
                    type="text"
                    :placeholder="field.placeholder"
                    :value="asText(item[field.name])"
                    @input="emit('update-list-item-field', entry.name, entry.schema, itemIndex, field.name, ($event.target as HTMLInputElement).value)"
                  />
                  <div v-else class="list-image-field">
                    <img
                      v-if="asText(item[field.name])"
                      :src="asText(item[field.name])"
                      alt=""
                    />
                    <div v-else class="list-image-empty">
                      <Image :size="16" />
                      <small>未选择图片</small>
                    </div>
                    <div class="list-image-controls">
                      <input
                        type="text"
                        :placeholder="field.placeholder"
                        :value="asText(item[field.name])"
                        @input="emit('update-list-item-field', entry.name, entry.schema, itemIndex, field.name, ($event.target as HTMLInputElement).value)"
                      />
                      <button
                        type="button"
                        class="list-image-action"
                        :class="{ active: isActiveListAssetTarget(entry.name, itemIndex, field.name) }"
                        @click="emit('open-list-asset-picker', entry.name, entry.schema, itemIndex, field)"
                      >
                        选择图片
                      </button>
                    </div>
                  </div>
                </label>
              </div>
              <div
                v-if="isListAssetPanelOpen(entry.name, itemIndex)"
                class="resource-panel list-asset-panel"
              >
                <div class="resource-panel-head">
                  <div>
                    <strong>
                      <Image :size="15" />
                      <span>列表项素材库</span>
                    </strong>
                    <small>写入第 {{ itemIndex + 1 }} 项的 {{ listAssetTarget?.fieldLabel }}</small>
                  </div>
                  <button type="button" class="panel-close-button" @click="emit('close-list-asset-picker')">收起</button>
                </div>
                <div class="resource-filters">
                  <label class="search-field">
                    <Search :size="14" />
                    <input
                      :value="assetKeyword"
                      placeholder="搜索素材"
                      @input="emit('update:assetKeyword', ($event.target as HTMLInputElement).value)"
                    />
                  </label>
                  <select
                    :value="assetCategory"
                    aria-label="列表项素材分类"
                    @change="emit('update:assetCategory', ($event.target as HTMLSelectElement).value)"
                  >
                    <option v-for="category in assetCategories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
                <div class="asset-library list-asset-library">
                  <button
                    v-for="asset in filteredAssets"
                    :key="asset.id"
                    type="button"
                    class="asset-card list-asset-card"
                    @click="emit('apply-list-asset', asset)"
                  >
                    <img :src="asset.url" alt="" />
                    <span>
                      <strong>{{ asset.title }}</strong>
                      <small>{{ asset.category }}</small>
                    </span>
                  </button>
                </div>
                <div v-if="isAssetSearching" class="mini-empty">素材搜索中</div>
                <div v-else-if="!filteredAssets.length" class="mini-empty">没有匹配素材</div>
              </div>
            </article>
            <details class="json-fallback">
              <summary>JSON 高级编辑</summary>
              <textarea
                :value="asText(selectedProps[entry.name])"
                rows="5"
                @input="emit('update-prop', entry.name, entry.schema, ($event.target as HTMLTextAreaElement).value)"
              />
            </details>
          </div>
          <textarea
            v-else-if="isStructured(entry.schema) || entry.schema.setter === 'textarea' || entry.schema.setter === 'richText'"
            :value="asText(selectedProps[entry.name])"
            rows="5"
            @input="emit('update-prop', entry.name, entry.schema, ($event.target as HTMLTextAreaElement).value)"
          />
          <select
            v-else-if="isSelect(entry.schema)"
            :value="optionValue(selectedProps[entry.name] ?? entry.schema.defaultValue ?? '')"
            @change="emit('update-prop', entry.name, entry.schema, findOptionValue(entry.schema, ($event.target as HTMLSelectElement).value))"
          >
            <option
              v-for="option in entry.schema.options ?? []"
              :key="optionValue(option.value)"
              :value="optionValue(option.value)"
            >
              {{ option.label }}
            </option>
          </select>
          <div
            v-else-if="entry.schema.setter === 'switch' || entry.schema.type === 'boolean'"
            class="switch-field"
          >
            <input
              type="checkbox"
              :checked="asBoolean(selectedProps[entry.name])"
              @change="emit('update-prop', entry.name, entry.schema, ($event.target as HTMLInputElement).checked)"
            />
            <span class="switch-track" aria-hidden="true">
              <i />
            </span>
            <em>{{ asBoolean(selectedProps[entry.name]) ? "开启" : "关闭" }}</em>
          </div>
          <input
            v-else-if="entry.schema.setter === 'color'"
            type="color"
            :value="asText(selectedProps[entry.name]) || '#111827'"
            @input="emit('update-prop', entry.name, entry.schema, ($event.target as HTMLInputElement).value)"
          />
          <div
            v-else-if="entry.schema.type === 'number'"
            class="number-field"
          >
            <button
              type="button"
              :aria-label="`减少${entry.schema.label}`"
              @click="adjustNumber(entry.name, entry.schema, -1)"
            >
              -
            </button>
            <input
              type="number"
              :min="numberMin(entry.schema)"
              :max="numberMax(entry.schema)"
              :step="numberStep(entry.schema)"
              :value="asText(selectedProps[entry.name])"
              @input="emit('update-prop', entry.name, entry.schema, ($event.target as HTMLInputElement).value)"
            />
            <button
              type="button"
              :aria-label="`增加${entry.schema.label}`"
              @click="adjustNumber(entry.name, entry.schema, 1)"
            >
              +
            </button>
            <em v-if="entry.schema.unit">{{ entry.schema.unit }}</em>
          </div>
          <input
            v-else
            type="text"
            :value="asText(selectedProps[entry.name])"
            @input="emit('update-prop', entry.name, entry.schema, ($event.target as HTMLInputElement).value)"
          />
          <div v-if="canUseProductQuickActions(entry.name)" class="quick-actions">
            <button type="button" @click="emit('apply-sample-products')">使用示例商品</button>
            <button type="button" @click="emit('bind-products-data-source')">绑定数据源 products</button>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div v-if="eventBindings.length" class="event-binding-list">
    <div class="panel-title compact-title">
      <PanelRight :size="15" />
      <span>事件</span>
    </div>
    <label
      v-for="event in eventBindings"
      :key="event.name"
      class="field"
    >
      <span>{{ event.title }}</span>
      <select
        :value="event.actionId"
        @change="emit('bind-event', event.name, ($event.target as HTMLSelectElement).value)"
      >
        <option value="">未绑定</option>
        <option
          v-for="action in event.actionOptions"
          :key="`${event.name}-${action.id}`"
          :value="action.id"
        >
          {{ action.label }}
        </option>
      </select>
      <small v-if="event.missingAction">{{ event.actionLabel }}</small>
    </label>
  </div>
</template>
