<script setup lang="ts">
import { Clock3, Code2, ListChecks, RotateCcw } from "@lucide/vue";
import type {
  LowcodeEditorAuditListItem,
  LowcodeEditorDemoChecklistItem,
  LowcodeEditorDemoChecklistSummary,
} from "@meumall/lowcode-editor";

defineProps<{
  nodeCount: number;
  historyPastCount: number;
  historyFutureCount: number;
  validationValid: boolean;
  demoChecklistItems: readonly LowcodeEditorDemoChecklistItem[];
  demoChecklistSummary: LowcodeEditorDemoChecklistSummary;
  auditItems: readonly LowcodeEditorAuditListItem[];
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
    <div class="demo-checklist-panel" data-testid="demo-checklist-panel">
      <div class="demo-checklist-title">
        <ListChecks :size="15" />
        <span>实操清单</span>
        <em>{{ demoChecklistSummary.statusText }}</em>
      </div>
      <ol class="demo-checklist-list">
        <li
          v-for="item in demoChecklistItems"
          :key="item.id"
          class="demo-checklist-item"
          :data-check-status="item.status"
        >
          <span class="demo-check-dot" aria-hidden="true"></span>
          <div>
            <strong>{{ item.title }}</strong>
            <small>{{ item.description }}</small>
          </div>
          <em>{{ item.statusText }}</em>
        </li>
      </ol>
    </div>
    <div class="audit-trail-panel" data-testid="audit-trail-panel">
      <div class="audit-trail-title">
        <Clock3 :size="15" />
        <span>最近操作</span>
      </div>
      <ol v-if="auditItems.length" class="audit-trail-list">
        <li
          v-for="item in auditItems"
          :key="item.id"
          class="audit-trail-item"
          :data-audit-result="item.result"
        >
          <span class="audit-dot" aria-hidden="true"></span>
          <div>
            <strong>{{ item.title }}</strong>
            <small>{{ item.timeLabel }} / {{ item.actorName }} / {{ item.targetText }}</small>
            <p>{{ item.description }}</p>
          </div>
        </li>
      </ol>
      <p v-else class="audit-trail-empty">暂无操作记录</p>
    </div>
  </section>
</template>
