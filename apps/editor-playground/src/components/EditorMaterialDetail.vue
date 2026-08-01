<script setup lang="ts">
import { Plus, X } from "@lucide/vue";
import type { LowcodeActionExecutor, MaterialRegistry } from "@meumall/lowcode-core";
import {
  type LowcodeEditorMaterialDetailDataSourceSlotItem,
  type LowcodeEditorMaterialDetailEventItem,
  type LowcodeEditorMaterialDetailPropEntry,
  type LowcodeEditorMaterialDetailSummary,
} from "@meumall/lowcode-editor";
import {
  LowcodeVueRenderer,
  type VueH5MaterialComponent,
} from "@meumall/lowcode-renderer-vue-h5";
import type {
  JsonObject,
  LowcodeMaterialManifest,
  LowcodePageSchema,
} from "@meumall/lowcode-schema";

defineProps<{
  manifest: LowcodeMaterialManifest;
  summary?: LowcodeEditorMaterialDetailSummary;
  propEntries: readonly LowcodeEditorMaterialDetailPropEntry[];
  eventItems: readonly LowcodeEditorMaterialDetailEventItem[];
  dataSourceSlotItems: readonly LowcodeEditorMaterialDetailDataSourceSlotItem[];
  previewSchema?: LowcodePageSchema;
  registry: MaterialRegistry<VueH5MaterialComponent>;
  previewData: JsonObject;
  actionExecutor: LowcodeActionExecutor;
  insertDisabledReason?: string;
}>();

const emit = defineEmits<{
  close: [];
  add: [];
}>();
</script>

<template>
  <div
    class="material-detail-overlay"
    role="dialog"
    aria-modal="true"
    aria-label="物料详情"
    @click.self="emit('close')"
  >
    <section class="material-detail-dialog">
      <div class="material-detail-head">
        <div>
          <strong>{{ manifest.title }}</strong>
          <span>{{ manifest.category }} / {{ manifest.componentName }}</span>
        </div>
        <button type="button" title="关闭物料详情" @click="emit('close')">
          <X :size="18" />
        </button>
      </div>

      <div class="material-detail-body">
        <div class="material-detail-info">
          <dl class="material-detail-meta">
            <div>
              <dt>版本</dt>
              <dd>{{ summary?.materialVersion }}</dd>
            </div>
            <div>
              <dt>平台</dt>
              <dd>{{ summary?.platformText }}</dd>
            </div>
            <div>
              <dt>配置项</dt>
              <dd>{{ summary?.propCount ?? 0 }} 个</dd>
            </div>
          </dl>

          <div class="material-detail-section">
            <strong>配置字段</strong>
            <div class="material-prop-list">
              <div
                v-for="entry in propEntries"
                :key="entry.name"
                class="material-prop-item"
              >
                <span>
                  <b>{{ entry.label }}</b>
                  <small>{{ entry.name }} / {{ entry.setter }}</small>
                </span>
                <em>{{ entry.type }}{{ entry.required ? " / 必填" : "" }}</em>
              </div>
              <div v-if="!propEntries.length" class="mini-empty">无配置字段</div>
            </div>
          </div>

          <div class="material-detail-section">
            <strong>事件</strong>
            <div class="material-chip-list">
              <span
                v-for="event in eventItems"
                :key="event.name"
              >
                {{ event.title }} / {{ event.name }}
              </span>
              <span v-if="!eventItems.length">无事件</span>
            </div>
          </div>

          <div class="material-detail-section">
            <strong>数据槽</strong>
            <div class="material-chip-list">
              <span
                v-for="slot in dataSourceSlotItems"
                :key="slot.name"
              >
                {{ slot.name }} / {{ slot.acceptedTypesText }}
              </span>
              <span v-if="!dataSourceSlotItems.length">无数据槽</span>
            </div>
          </div>

          <div class="material-detail-actions">
            <p v-if="insertDisabledReason" class="material-insert-lock">{{ insertDisabledReason }}</p>
            <button
              type="button"
              :title="insertDisabledReason ?? '添加到画布'"
              :disabled="Boolean(insertDisabledReason)"
              @click="emit('add')"
            >
              <Plus :size="15" />
              <span>添加到画布</span>
            </button>
          </div>
        </div>

        <div class="material-detail-preview">
          <div class="material-preview-phone">
            <div class="material-preview-status">
              <span>默认 H5 预览</span>
              <span>{{ manifest.componentName }}</span>
            </div>
            <LowcodeVueRenderer
              v-if="previewSchema"
              :schema="previewSchema"
              :registry="registry"
              :data="previewData"
              :action-executor="actionExecutor"
              :fallback="'物料无法预览'"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
