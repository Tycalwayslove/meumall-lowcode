<script setup lang="ts">
import { computed } from "vue";
import { Eye, Plus, Search, Star } from "@lucide/vue";
import {
  createLowcodeMaterialCatalogItem,
  createLowcodeMaterialArchitectureProfile,
  createLowcodeMaterialInsertPresets,
  formatLowcodeMaterialCatalogSummary,
  type LowcodeEditorMaterialArchitectureOverview,
  type LowcodeEditorMaterialCatalogOverview,
  type LowcodeEditorMaterialEntry,
  type LowcodeEditorMaterialInsertPreset,
} from "@meumall/lowcode-editor";
import type { LowcodeMaterialManifest } from "@meumall/lowcode-schema";

const props = defineProps<{
  materials: readonly LowcodeEditorMaterialEntry[];
  visibleMaterials: readonly LowcodeEditorMaterialEntry[];
  favoriteMaterials: readonly LowcodeEditorMaterialEntry[];
  recentMaterials: readonly LowcodeEditorMaterialEntry[];
  favoriteComponentNames: readonly string[];
  categories: readonly string[];
  categoryOverview?: LowcodeEditorMaterialCatalogOverview;
  architectureOverview?: LowcodeEditorMaterialArchitectureOverview;
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
  "add-preset": [manifest: LowcodeMaterialManifest, preset: LowcodeEditorMaterialInsertPreset];
  "add-to-container": [manifest: LowcodeMaterialManifest];
  "add-preset-to-container": [manifest: LowcodeMaterialManifest, preset: LowcodeEditorMaterialInsertPreset];
  "toggle-favorite": [manifest: LowcodeMaterialManifest];
  "open-detail": [manifest: LowcodeMaterialManifest];
  "material-click": [event: MouseEvent, manifest: LowcodeMaterialManifest];
  "material-pointerdown": [event: PointerEvent, manifest: LowcodeMaterialManifest];
  "material-dragstart": [event: DragEvent, manifest: LowcodeMaterialManifest];
  "material-dragend": [];
}>();

const favoriteComponentNameSet = computed(() => new Set(props.favoriteComponentNames));
const categoryOptions = computed(() => props.categoryOverview?.categories ?? props.categories.map((category) => ({
  value: category,
  label: category,
  description: "",
  count: 0,
  visibleCount: 0,
  active: category === props.category,
  summaryText: "",
})));
const containerPresetItems = computed(() =>
  props.materials.flatMap((material) =>
    materialInsertPresets(material.manifest)
      .slice(0, 2)
      .map((preset) => ({ material, preset })),
  ).slice(0, 12),
);

function isFavoriteMaterial(componentName: string): boolean {
  return favoriteComponentNameSet.value.has(componentName);
}

function materialCatalogSearchTitle(manifest: LowcodeMaterialManifest): string {
  const item = createLowcodeMaterialCatalogItem(manifest);
  return `${item.title} / ${item.categoryLabel} / ${item.layerLabel} / ${item.familyLabel} / ${item.componentName} / ${item.summary}`;
}

function materialArchitectureTitle(manifest: LowcodeMaterialManifest): string {
  const profile = createLowcodeMaterialArchitectureProfile(manifest);
  return `${profile.layerLabel} / ${profile.familyLabel}：${profile.recommendedUse} ${profile.boundary}`;
}

function materialInsertPresets(manifest: LowcodeMaterialManifest): LowcodeEditorMaterialInsertPreset[] {
  return createLowcodeMaterialInsertPresets(manifest).slice(0, 3);
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
        <option v-for="item in categoryOptions" :key="item.value" :value="item.value">
          {{ item.label }}（{{ item.visibleCount }}/{{ item.count }}）
        </option>
      </select>
    </div>
    <div v-if="categoryOverview" class="material-category-summary" data-testid="material-category-summary">
      <div>
        <strong>{{ categoryOverview.activeLabel }}</strong>
        <small>{{ categoryOverview.summaryText }} · 全部 {{ categoryOverview.totalCount }} 个</small>
      </div>
      <span>{{ categoryOverview.activeDescription }}</span>
    </div>
    <div v-if="architectureOverview" class="material-architecture-summary" data-testid="material-architecture-summary">
      <div>
        <strong>物料分层</strong>
        <small>{{ architectureOverview.visibleCount }} / {{ architectureOverview.totalCount }}</small>
      </div>
      <p>{{ architectureOverview.layerSummaryText }}</p>
      <p>{{ architectureOverview.familySummaryText }}</p>
      <div class="material-architecture-chips">
        <span
          v-for="layer in architectureOverview.layers"
          :key="layer.value"
          :title="layer.description"
        >
          {{ layer.label }} {{ layer.visibleCount }}/{{ layer.count }}
        </span>
      </div>
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
            <em>{{ createLowcodeMaterialCatalogItem(material.manifest).categoryLabel }}</em>
            <em :title="materialArchitectureTitle(material.manifest)">
              {{ createLowcodeMaterialCatalogItem(material.manifest).layerLabel }}
            </em>
            <em :title="materialArchitectureTitle(material.manifest)">
              {{ createLowcodeMaterialCatalogItem(material.manifest).familyLabel }}
            </em>
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
      <div v-if="materialInsertPresets(material.manifest).length" class="material-preset-row">
        <button
          v-for="preset in materialInsertPresets(material.manifest)"
          :key="`${material.manifest.componentName}-${preset.id}`"
          type="button"
          :title="insertDisabledReason ?? `${material.manifest.title}：${preset.description}`"
          :disabled="Boolean(insertDisabledReason)"
          @pointerdown.stop
          @click.stop="emit('add-preset', material.manifest, preset)"
        >
          {{ preset.title }}
        </button>
      </div>
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
      <div v-if="containerPresetItems.length" class="container-target-presets">
        <small>常用预设</small>
        <button
          v-for="item in containerPresetItems"
          :key="`child-preset-${item.material.manifest.componentName}-${item.preset.id}`"
          type="button"
          class="container-target-preset"
          :title="insertDisabledReason ?? `加入容器：${item.material.manifest.title} / ${item.preset.description}`"
          :disabled="Boolean(insertDisabledReason)"
          @click="emit('add-preset-to-container', item.material.manifest, item.preset)"
        >
          <Plus :size="14" />
          <span>{{ item.material.manifest.title }} · {{ item.preset.title }}</span>
        </button>
      </div>
    </div>
  </section>
</template>
