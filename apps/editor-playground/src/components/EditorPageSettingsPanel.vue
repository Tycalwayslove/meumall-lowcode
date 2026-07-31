<script setup lang="ts">
import { PanelRight } from "@lucide/vue";
import type { LowcodeEditorPageSettingsForm } from "@meumall/lowcode-editor";
import type {
  LowcodeEnvironment,
  LowcodePageStatus,
  LowcodePageType,
} from "@meumall/lowcode-schema";

defineProps<{
  form: LowcodeEditorPageSettingsForm;
  releaseNoteDraft: string;
  releaseMessage: string;
}>();

const emit = defineEmits<{
  (event: "update:title", value: string): void;
  (event: "update:description", value: string): void;
  (event: "update:pageType", value: LowcodePageType): void;
  (event: "update:backgroundColor", value: string): void;
  (event: "update:safeArea", value: boolean): void;
  (event: "update:maxWidth", value: string): void;
  (event: "update:status", value: LowcodePageStatus): void;
  (event: "update:publishEnvironment", value: LowcodeEnvironment): void;
  (event: "update:releaseNoteDraft", value: string): void;
}>();

function getInputValue(event: Event): string {
  return (event.target as HTMLInputElement).value;
}

function getTextAreaValue(event: Event): string {
  return (event.target as HTMLTextAreaElement).value;
}

function getSelectValue(event: Event): string {
  return (event.target as HTMLSelectElement).value;
}

function getCheckboxValue(event: Event): boolean {
  return (event.target as HTMLInputElement).checked;
}
</script>

<template>
  <section class="panel-section">
    <div class="panel-title">
      <PanelRight :size="16" />
      <span>页面</span>
    </div>
    <div class="page-settings-card">
      <strong>基础配置</strong>
      <label class="field">
        <span>标题</span>
        <input
          :value="form.title"
          placeholder="请输入页面标题"
          @input="emit('update:title', getInputValue($event))"
        />
      </label>
      <label class="field">
        <span>描述</span>
        <textarea
          :value="form.description"
          placeholder="请输入页面描述，方便运营和验收识别"
          @input="emit('update:description', getTextAreaValue($event))"
        ></textarea>
      </label>
      <div class="page-settings-grid">
        <label class="field">
          <span>页面类型</span>
          <select
            :value="form.pageType"
            @change="emit('update:pageType', getSelectValue($event) as LowcodePageType)"
          >
            <option
              v-for="option in form.pageTypeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>
        <label class="field">
          <span>Page ID</span>
          <input :value="form.pageId" readonly />
        </label>
      </div>
    </div>

    <div class="page-settings-card">
      <strong>布局配置</strong>
      <label class="field">
        <span>背景色</span>
        <input
          class="page-color-input"
          type="color"
          :value="form.backgroundColor"
          @input="emit('update:backgroundColor', getInputValue($event))"
        />
      </label>
      <div class="page-color-swatches" aria-label="页面背景快捷色板">
        <button
          v-for="color in form.backgroundSwatches"
          :key="color"
          type="button"
          :class="{ active: form.backgroundColor === color }"
          :style="{ backgroundColor: color }"
          :title="`设置背景色 ${color}`"
          @click="emit('update:backgroundColor', color)"
        ></button>
      </div>
      <label class="switch-field page-safe-switch">
        <input
          type="checkbox"
          :checked="form.safeArea"
          @change="emit('update:safeArea', getCheckboxValue($event))"
        />
        <span class="switch-track"><i></i></span>
        <em>启用安全区</em>
      </label>
      <label class="field">
        <span>H5 最大宽度</span>
        <input
          type="number"
          min="320"
          max="960"
          step="1"
          :value="form.maxWidth"
          @input="emit('update:maxWidth', getInputValue($event))"
        />
      </label>
    </div>

    <div class="page-settings-card">
      <strong>发布配置</strong>
      <div class="page-settings-grid">
        <label class="field">
          <span>状态</span>
          <select
            :value="form.status"
            @change="emit('update:status', getSelectValue($event) as LowcodePageStatus)"
          >
            <option
              v-for="option in form.statusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>
        <label class="field">
          <span>环境</span>
          <select
            :value="form.publishEnvironment"
            @change="emit('update:publishEnvironment', getSelectValue($event) as LowcodeEnvironment)"
          >
            <option
              v-for="option in form.publishEnvironmentOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>
      </div>
      <label class="field release-note-field">
        <span>版本备注</span>
        <textarea
          :value="releaseNoteDraft"
          rows="3"
          placeholder="例如：设计走查版、产品验收版、上线发布版"
          @input="emit('update:releaseNoteDraft', getTextAreaValue($event))"
        ></textarea>
      </label>
    </div>
    <p v-if="releaseMessage" class="publish-message">{{ releaseMessage }}</p>
  </section>
</template>
