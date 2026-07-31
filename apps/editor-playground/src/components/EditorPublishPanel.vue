<script setup lang="ts">
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Link2,
  LocateFixed,
  PanelRight,
  Save,
  Search,
} from "@lucide/vue";
import type {
  LowcodeEditorDeliveryMetric,
  LowcodeEditorPreviewLinkItem,
  LowcodeEditorPreviewLinkSummary,
  LowcodeEditorPublishCheck,
  LowcodeEditorPublishCheckSummary,
  LowcodeEditorReleaseListItem,
  LowcodeEditorReleaseListSummary,
  LowcodeEditorSchemaPreviewItem,
  LowcodeEditorVersionDiffItem,
} from "@meumall/lowcode-editor";

defineProps<{
  previewLinkItems: readonly LowcodeEditorPreviewLinkItem[];
  previewLinkSummary: LowcodeEditorPreviewLinkSummary;
  deliveryStatusText: string;
  deliveryMetrics: readonly LowcodeEditorDeliveryMetric[];
  publishChecks: readonly LowcodeEditorPublishCheck[];
  publishCheckSummary: LowcodeEditorPublishCheckSummary;
  hasPublishBlockingErrors: boolean;
  releaseCount: number;
  releaseKeyword: string;
  releaseListSummary: LowcodeEditorReleaseListSummary;
  visibleReleaseItems: readonly LowcodeEditorReleaseListItem[];
  hasSelectedRelease: boolean;
  releaseDiffSummaryText: string;
  releaseDiffItems: readonly LowcodeEditorVersionDiffItem[];
  releaseSchemaPreviewItems: readonly LowcodeEditorSchemaPreviewItem[];
}>();

const emit = defineEmits<{
  (event: "open-preview-link", item: LowcodeEditorPreviewLinkItem): void;
  (event: "copy-preview-link", item: LowcodeEditorPreviewLinkItem): void;
  (event: "copy-schema"): void;
  (event: "export-schema"): void;
  (event: "locate-publish-check", check: LowcodeEditorPublishCheck): void;
  (event: "update:releaseKeyword", value: string): void;
  (event: "select-release", releaseId: string): void;
  (event: "load-release", releaseId: string): void;
  (event: "open-release", releaseId: string): void;
  (event: "load-selected-release"): void;
  (event: "rollback-selected-release"): void;
}>();

function getInputValue(event: Event): string {
  return (event.target as HTMLInputElement).value;
}
</script>

<template>
  <section class="panel-section preview-link-panel">
    <div class="panel-title">
      <Link2 :size="16" />
      <span>H5 预览入口</span>
      <small>{{ previewLinkSummary.statusText }}</small>
    </div>
    <div class="preview-link-list">
      <article
        v-for="item in previewLinkItems"
        :key="item.id"
        class="preview-link-card"
      >
        <div class="preview-link-head">
          <strong>{{ item.title }}</strong>
          <span>{{ item.description }}</span>
        </div>
        <input :value="item.url" readonly />
        <div class="preview-link-actions">
          <button
            type="button"
            class="preview-open-button"
            :disabled="!item.openable"
            @click="emit('open-preview-link', item)"
          >
            <ExternalLink :size="13" />
            打开
          </button>
          <button
            type="button"
            class="preview-copy-button"
            :disabled="!item.copyable"
            @click="emit('copy-preview-link', item)"
          >
            <Copy :size="13" />
            复制
          </button>
        </div>
      </article>
    </div>
  </section>

  <section class="panel-section delivery-panel">
    <div class="panel-title">
      <Check :size="16" />
      <span>交付清单</span>
      <small>{{ deliveryStatusText }}</small>
    </div>
    <div class="delivery-summary-grid">
      <article v-for="metric in deliveryMetrics" :key="metric.label">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
      </article>
    </div>
    <div class="delivery-link-status">
      <strong>H5 交付入口</strong>
      <span
        v-for="title in previewLinkSummary.readyTitles"
        :key="title"
      >
        {{ title }}
      </span>
    </div>
    <div class="delivery-actions">
      <button type="button" class="delivery-copy-schema-button" @click="emit('copy-schema')">
        <Copy :size="13" />
        复制 Schema
      </button>
      <button type="button" class="delivery-export-schema-button" @click="emit('export-schema')">
        <Download :size="13" />
        导出 Schema
      </button>
    </div>
    <p class="delivery-note">
      当前链接用于本地 playground 验收；正式环境仍需切换到 Java 配置平台的 previewToken 或 releaseId 查询。
    </p>
  </section>

  <section class="panel-section">
    <div class="panel-title">
      <PanelRight :size="16" />
      <span>发布检查</span>
    </div>
    <div class="publish-summary" :class="{ blocked: hasPublishBlockingErrors }">
      <strong>{{ hasPublishBlockingErrors ? "存在阻塞项" : "可以生成预览" }}</strong>
      <span>
        通过 {{ publishCheckSummary.pass }} / 警告 {{ publishCheckSummary.warning }} / 错误 {{ publishCheckSummary.error }}
      </span>
    </div>
    <div class="publish-check-list">
      <article
        v-for="check in publishChecks"
        :key="check.id"
        class="publish-check"
        :class="`is-${check.status}`"
      >
        <strong>{{ check.title }}</strong>
        <span>{{ check.status }}</span>
        <button
          v-if="check.nodeId"
          type="button"
          class="publish-locate-button"
          :title="`定位到 ${check.nodeTitle ?? check.nodeId}`"
          @click="emit('locate-publish-check', check)"
        >
          <LocateFixed :size="13" />
          定位
        </button>
        <p>{{ check.description }}</p>
      </article>
    </div>
  </section>

  <section class="panel-section">
    <div class="panel-title">
      <Save :size="16" />
      <span>本地版本</span>
      <small>{{ releaseCount }} 个版本</small>
    </div>
    <div v-if="releaseCount" class="release-tools">
      <label class="release-search-field">
        <Search :size="14" />
        <input
          :value="releaseKeyword"
          placeholder="筛选版本、类型或备注"
          @input="emit('update:releaseKeyword', getInputValue($event))"
        />
      </label>
      <small>{{ releaseListSummary.statusText }}</small>
    </div>
    <div v-if="visibleReleaseItems.length" class="release-list">
      <article
        v-for="item in visibleReleaseItems"
        :key="item.id"
        class="release-card"
        :class="{ selected: item.selected }"
      >
        <div>
          <strong>{{ item.kindLabel }}</strong>
          <span>{{ item.pageVersion }}</span>
        </div>
        <small>{{ item.createdAtText }}</small>
        <p v-if="item.note" class="release-note">{{ item.note }}</p>
        <div class="release-actions">
          <button type="button" @click="emit('select-release', item.id)">对比</button>
          <button type="button" @click="emit('load-release', item.id)">载入</button>
          <button type="button" @click="emit('open-release', item.id)">打开</button>
        </div>
      </article>
    </div>
    <div v-else class="empty-state">{{ releaseListSummary.emptyText }}</div>
    <div v-if="hasSelectedRelease" class="release-diff-panel">
      <div class="release-diff-head">
        <strong>版本对比</strong>
        <span>{{ releaseDiffSummaryText }}</span>
      </div>
      <dl class="release-diff-list">
        <div
          v-for="item in releaseDiffItems"
          :key="item.label"
          :class="{ changed: item.changed }"
        >
          <dt>
            <span>{{ item.label }}</span>
            <em>{{ item.changed ? "已变更" : "一致" }}</em>
          </dt>
          <dd>
            <span>
              <small>当前草稿</small>
              <b>{{ item.current }}</b>
            </span>
            <strong>
              <small>所选版本</small>
              <b>{{ item.selected }}</b>
            </strong>
          </dd>
        </div>
      </dl>
      <div class="release-schema-preview-grid">
        <article
          v-for="item in releaseSchemaPreviewItems"
          :key="item.id"
          class="release-schema-preview"
        >
          <div>
            <strong>{{ item.title }}</strong>
            <span>{{ item.description }}</span>
          </div>
          <pre>{{ item.json }}</pre>
        </article>
      </div>
      <div class="release-diff-actions">
        <button type="button" @click="emit('load-selected-release')">载入所选</button>
        <button type="button" class="danger" @click="emit('rollback-selected-release')">回滚发布</button>
      </div>
    </div>
  </section>
</template>
