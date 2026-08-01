<script setup lang="ts">
import { computed } from "vue";
import { Eye, Plus, Search, Star } from "@lucide/vue";
import {
  createLowcodeMaterialCatalogItem,
  formatLowcodeMaterialCatalogSummary,
  type LowcodeEditorMaterialEntry,
} from "@meumall/lowcode-editor";
import type { LowcodeMaterialManifest } from "@meumall/lowcode-schema";

const props = defineProps<{
  materials: readonly LowcodeEditorMaterialEntry[];
  visibleMaterials: readonly LowcodeEditorMaterialEntry[];
  favoriteMaterials: readonly LowcodeEditorMaterialEntry[];
  recentMaterials: readonly LowcodeEditorMaterialEntry[];
  favoriteComponentNames: readonly string[];
  categories: readonly string[];
  keyword: string;
  category: string;
  preferenceMessage?: string;
  insertDisabledReason?: string;
  selectedContainerTitle?: string;
}>();

const emit = defineEmits<{
  "update:keyword": [value: string];
  "update:category": [value: string];
  add: [manifest: LowcodeMaterialManifest];
  "add-to-container": [manifest: LowcodeMaterialManifest];
  "toggle-favorite": [manifest: LowcodeMaterialManifest];
  "open-detail": [manifest: LowcodeMaterialManifest];
  "material-click": [event: MouseEvent, manifest: LowcodeMaterialManifest];
  "material-pointerdown": [event: PointerEvent, manifest: LowcodeMaterialManifest];
  "material-dragstart": [event: DragEvent, manifest: LowcodeMaterialManifest];
  "material-dragend": [];
}>();

const favoriteComponentNameSet = computed(() => new Set(props.favoriteComponentNames));

function isFavoriteMaterial(componentName: string): boolean {
  return favoriteComponentNameSet.value.has(componentName);
}

function materialCatalogSearchTitle(manifest: LowcodeMaterialManifest): string {
  const item = createLowcodeMaterialCatalogItem(manifest);
  return `${item.title} / ${item.category} / ${item.componentName} / ${item.summary}`;
}
</script>

<template>
  <section class="panel-section">
    <div class="panel-title">
      <Plus :size="16" />
      <span>物料</span>
      <small>{{ visibleMaterials.length }} / {{ materials.length }}</small>
    </div>
    <div class="material-filters">
      <label class="search-field">
        <Search :size="14" />
        <input
          :value="keyword"
          placeholder="搜索物料"
          @input="emit('update:keyword', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <select
        :value="category"
        aria-label="物料分类"
        @change="emit('update:category', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="item in categories" :key="item" :value="item">
          {{ item }}
        </option>
      </select>
    </div>
    <p v-if="preferenceMessage" class="material-preference-message">{{ preferenceMessage }}</p>
    <p v-if="insertDisabledReason" class="material-insert-lock">{{ insertDisabledReason }}</p>
    <div v-if="favoriteMaterials.length" class="material-quick-section">
      <div class="material-quick-head">
        <strong>收藏物料</strong>
        <small>{{ favoriteMaterials.length }} 个</small>
      </div>
      <button
        v-for="material in favoriteMaterials"
        :key="`favorite-${material.manifest.componentName}`"
        type="button"
        class="material-quick-chip"
        :title="insertDisabledReason ?? `添加 ${material.manifest.title}`"
        :disabled="Boolean(insertDisabledReason)"
        @click="emit('add', material.manifest)"
      >
        <Star :size="13" />
        <span>{{ material.manifest.title }}</span>
      </button>
    </div>
    <div v-if="recentMaterials.length" class="material-quick-section">
      <div class="material-quick-head">
        <strong>最近使用</strong>
        <small>{{ recentMaterials.length }} 个</small>
      </div>
      <button
        v-for="material in recentMaterials"
        :key="`recent-${material.manifest.componentName}`"
        type="button"
        class="material-quick-chip"
        :title="insertDisabledReason ?? `添加 ${material.manifest.title}`"
        :disabled="Boolean(insertDisabledReason)"
        @click="emit('add', material.manifest)"
      >
        <Plus :size="13" />
        <span>{{ material.manifest.title }}</span>
      </button>
    </div>
    <article
      v-for="material in visibleMaterials"
      :key="material.manifest.componentName"
      class="material-item"
      :class="{ favorite: isFavoriteMaterial(material.manifest.componentName) }"
      :draggable="!insertDisabledReason"
      @pointerdown="!insertDisabledReason && emit('material-pointerdown', $event, material.manifest)"
      @dragstart="!insertDisabledReason && emit('material-dragstart', $event, material.manifest)"
      @dragend="emit('material-dragend')"
    >
      <button
        type="button"
        class="material-main-button"
        :title="insertDisabledReason ?? materialCatalogSearchTitle(material.manifest)"
        :disabled="Boolean(insertDisabledReason)"
        @click="emit('material-click', $event, material.manifest)"
      >
        <span>
          <strong>{{ material.manifest.title }}</strong>
          <small>
            <em>{{ material.manifest.category }}</em>
            {{ material.manifest.componentName }}
          </small>
          <small>{{ formatLowcodeMaterialCatalogSummary(material.manifest) }}</small>
        </span>
        <Plus :size="15" />
      </button>
      <button
        type="button"
        class="material-favorite-button"
        :class="{ active: isFavoriteMaterial(material.manifest.componentName) }"
        :title="isFavoriteMaterial(material.manifest.componentName) ? `取消收藏 ${material.manifest.title}` : `收藏 ${material.manifest.title}`"
        @pointerdown.stop
        @click.stop="emit('toggle-favorite', material.manifest)"
      >
        <Star :size="15" :fill="isFavoriteMaterial(material.manifest.componentName) ? 'currentColor' : 'none'" />
      </button>
      <button
        type="button"
        class="material-detail-button"
        :title="`查看 ${material.manifest.title} 详情`"
        @pointerdown.stop
        @click.stop="emit('open-detail', material.manifest)"
      >
        <Eye :size="15" />
        <span>详情</span>
      </button>
    </article>
    <div v-if="!visibleMaterials.length" class="mini-empty">没有匹配物料</div>
    <div v-if="selectedContainerTitle" class="container-target">
      <strong>当前容器：{{ selectedContainerTitle }}</strong>
      <span>点击下方按钮可把物料加入选中容器</span>
      <button
        v-for="material in materials"
        :key="`child-${material.manifest.componentName}`"
        type="button"
        :title="insertDisabledReason ?? `加入容器：${material.manifest.title}`"
        :disabled="Boolean(insertDisabledReason)"
        @click="emit('add-to-container', material.manifest)"
      >
        <Plus :size="14" />
        <span>{{ material.manifest.title }}</span>
      </button>
    </div>
  </section>
</template>
