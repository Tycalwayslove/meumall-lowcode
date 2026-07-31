<script setup lang="ts">
defineProps<{
  displayName: string;
  materialTitle: string;
  materialCategory: string;
  nodeName: string;
  nodeId: string;
  positionText: string;
  parentTitle: string;
}>();

const emit = defineEmits<{
  rename: [name: string];
}>();
</script>

<template>
  <div class="selected-card">
    <div class="selected-card-head">
      <strong>{{ displayName }}</strong>
      <small>{{ materialTitle }} / {{ materialCategory }}</small>
    </div>
    <label class="node-name-field">
      <span>节点名称</span>
      <input
        :value="nodeName"
        placeholder="例如：首屏主会场"
        @change="emit('rename', ($event.target as HTMLInputElement).value)"
      />
    </label>
    <dl class="selected-meta">
      <div>
        <dt>节点</dt>
        <dd>{{ nodeId }}</dd>
      </div>
      <div>
        <dt>位置</dt>
        <dd>{{ positionText }}</dd>
      </div>
      <div>
        <dt>父级</dt>
        <dd>{{ parentTitle }}</dd>
      </div>
    </dl>
  </div>
</template>
