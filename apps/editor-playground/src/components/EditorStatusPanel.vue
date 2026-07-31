<script setup lang="ts">
import { Code2, RotateCcw } from "@lucide/vue";

defineProps<{
  nodeCount: number;
  historyPastCount: number;
  historyFutureCount: number;
  validationValid: boolean;
}>();

const emit = defineEmits<{
  (event: "reset-schema"): void;
}>();
</script>

<template>
  <section class="panel-section">
    <div class="panel-title">
      <Code2 :size="16" />
      <span>状态</span>
    </div>
    <dl class="state-list">
      <div>
        <dt>节点数</dt>
        <dd>{{ nodeCount }}</dd>
      </div>
      <div>
        <dt>历史</dt>
        <dd>{{ historyPastCount }} / {{ historyFutureCount }}</dd>
      </div>
      <div>
        <dt>校验</dt>
        <dd>{{ validationValid ? "通过" : "失败" }}</dd>
      </div>
    </dl>
    <button class="reset-button" type="button" @click="emit('reset-schema')">
      <RotateCcw :size="16" />
      <span>重置示例</span>
    </button>
  </section>
</template>
