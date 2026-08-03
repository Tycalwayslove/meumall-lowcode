<script setup lang="ts">
import { RotateCcw, Smartphone } from "@lucide/vue";
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
  "reset-canvas-pan": [];
}>();
</script>

<template>
  <div class="canvas-top">
    <div>
      <strong>{{ mode === "outline" ? "Schema" : "H5 画布" }}</strong>
      <span>{{ statusText }}</span>
    </div>
    <EditorWorkspaceStats :stats="stats" />
    <div class="viewport-switch" aria-label="H5 画布视口">
      <label class="viewport-select">
        <Smartphone :size="15" />
        <span>设备</span>
        <select
          :value="activeViewportPreset?.id"
          aria-label="选择设备尺寸"
          @change="
            emit(
              'select-viewport',
              viewportPresets.find((preset) => preset.id === ($event.target as HTMLSelectElement).value) ??
                viewportPresets[0],
            )
          "
        >
          <option v-for="preset in viewportPresets" :key="preset.id" :value="preset.id">
            {{ preset.title }} · {{ preset.width }}{{ preset.height ? `x${preset.height}` : "" }}
          </option>
        </select>
      </label>
      <button type="button" class="canvas-reset-button" title="复位画布位置" @click="emit('reset-canvas-pan')">
        <RotateCcw :size="14" />
        <span>复位</span>
      </button>
    </div>
  </div>
</template>
