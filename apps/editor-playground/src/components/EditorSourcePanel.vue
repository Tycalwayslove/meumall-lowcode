<script setup lang="ts">
defineProps<{
  schemaDraft: string;
  schemaTransferMessage: string;
  jsonError: string;
}>();

const emit = defineEmits<{
  (event: "update:schemaDraft", value: string): void;
  (event: "apply-json"): void;
  (event: "export-schema"): void;
  (event: "import-schema"): void;
}>();

function getTextAreaValue(event: Event): string {
  return (event.target as HTMLTextAreaElement).value;
}
</script>

<template>
  <div class="schema-editor">
    <textarea
      :value="schemaDraft"
      spellcheck="false"
      @input="emit('update:schemaDraft', getTextAreaValue($event))"
    />
    <div class="schema-actions">
      <button type="button" @click="emit('apply-json')">应用 JSON</button>
      <button type="button" @click="emit('export-schema')">导出 JSON</button>
      <button type="button" @click="emit('import-schema')">导入 JSON</button>
      <span v-if="schemaTransferMessage" class="schema-transfer-message">{{ schemaTransferMessage }}</span>
      <span v-if="jsonError">{{ jsonError }}</span>
    </div>
  </div>
</template>
