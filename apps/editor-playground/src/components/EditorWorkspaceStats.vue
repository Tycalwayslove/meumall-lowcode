<script setup lang="ts">
import type { LowcodeEditorWorkspaceStat } from "@meumall/lowcode-editor";

defineProps<{
  stats: readonly LowcodeEditorWorkspaceStat[];
}>();
</script>

<template>
  <div class="workspace-stats" aria-label="编辑器状态摘要">
    <span
      v-for="stat in stats"
      :key="stat.id || stat.label"
      class="workspace-stat"
      :class="stat.tone ? `is-${stat.tone}` : ''"
    >
      <small>{{ stat.label }}</small>
      <strong>{{ stat.value }}</strong>
    </span>
  </div>
</template>
