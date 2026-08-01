<script setup lang="ts">
import { Clock3, X } from "@lucide/vue";
import type { LowcodeEditorAuditListItem } from "@meumall/lowcode-editor";

defineProps<{
  open: boolean;
  items: readonly LowcodeEditorAuditListItem[];
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="audit-panel-backdrop"
      @click.self="emit('close')"
    >
      <aside
        class="audit-panel-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-panel-title"
        data-testid="audit-log-panel"
      >
        <header class="audit-panel-head">
          <div>
            <p class="audit-panel-eyebrow">当前页面</p>
            <h2 id="audit-panel-title">
              <Clock3 :size="18" />
              <span>审计日志</span>
            </h2>
          </div>
          <button
            type="button"
            class="audit-panel-close"
            title="关闭审计日志"
            data-testid="audit-log-close"
            @click="emit('close')"
          >
            <X :size="18" />
          </button>
        </header>

        <p class="audit-panel-summary">
          共 {{ items.length }} 条近期记录，本地示例用于验证管理台审计入口。
        </p>

        <ol v-if="items.length" class="audit-panel-list">
          <li
            v-for="item in items"
            :key="item.id"
            class="audit-panel-item"
            :data-audit-result="item.result"
          >
            <span class="audit-panel-dot" aria-hidden="true"></span>
            <div class="audit-panel-content">
              <div class="audit-panel-item-head">
                <strong>{{ item.title }}</strong>
                <span>{{ item.timeLabel }}</span>
              </div>
              <p>{{ item.description }}</p>
              <small>{{ item.actorName }} / {{ item.targetText }}</small>
            </div>
          </li>
        </ol>
        <p v-else class="audit-panel-empty">暂无审计记录</p>
      </aside>
    </div>
  </Teleport>
</template>
