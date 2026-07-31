<script setup lang="ts">
import { Smartphone } from "@lucide/vue";
import type {
  LowcodeEditorMode,
  LowcodeEditorViewportPreset,
  LowcodeEditorWorkspaceStat,
} from "@meumall/lowcode-editor";
import EditorWorkspaceStats from "./EditorWorkspaceStats.vue";

defineProps<{
  mode: LowcodeEditorMode;
  statusText: string;
  stats: readonly LowcodeEditorWorkspaceStat[];
  viewportPresets: readonly LowcodeEditorViewportPreset[];
  activeViewportPreset?: LowcodeEditorViewportPreset;
}>();

const emit = defineEmits<{
  "select-viewport": [preset: LowcodeEditorViewportPreset];
}>();
</script>

<template>
  <div class="canvas-top">
    <div>
      <strong>{{ mode === "outline" ? "Schema" : "H5 画布" }}</strong>
      <span>{{ statusText }}</span>
    </div>
    <EditorWorkspaceStats :stats="stats" />
    <div class="viewport-switch" role="group" aria-label="H5 画布视口">
      <span class="viewport-switch-label">视口</span>
      <button
        v-for="preset in viewportPresets"
        :key="preset.id"
        type="button"
        :title="`${preset.title} ${preset.width}px`"
        :class="{ active: activeViewportPreset?.id === preset.id }"
        @click="emit('select-viewport', preset)"
      >
        <Smartphone :size="16" />
        <span>
          <b>{{ preset.width }}</b>
          <small>{{ preset.title }}</small>
        </span>
      </button>
    </div>
  </div>
</template>
