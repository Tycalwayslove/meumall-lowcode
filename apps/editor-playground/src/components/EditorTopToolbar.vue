<script setup lang="ts">
import {
  Code2,
  Download,
  Eye,
  MonitorSmartphone,
  PanelRight,
  Plus,
  Redo2,
  Save,
  Search,
  Undo2,
  Upload,
} from "@lucide/vue";
import type { LowcodeEditorMode, LowcodeEditorPermissionAction } from "@meumall/lowcode-editor";

const props = defineProps<{
  title: string;
  dirty: boolean;
  autoSaveStatusText: string;
  autoSaveStatusTone: string;
  mode: LowcodeEditorMode;
  canUndo: boolean;
  canRedo: boolean;
  disabledActions?: Partial<Record<LowcodeEditorPermissionAction, string>>;
}>();

const emit = defineEmits<{
  "open-command": [];
  "open-page-start": [];
  "set-mode": [mode: LowcodeEditorMode];
  undo: [];
  redo: [];
  save: [];
  "export-schema": [];
  "import-schema": [];
  "create-preview": [];
  publish: [];
  "open-runtime": [];
  "open-react-runtime": [];
}>();
</script>

<template>
  <header class="topbar">
    <div class="brand">
      <span class="brand-mark">M</span>
      <div>
        <strong>MeuMall Lowcode</strong>
        <span>{{ props.title }}</span>
      </div>
      <span class="save-pill" :class="{ dirty: props.dirty }">
        {{ props.dirty ? "未保存" : "已保存" }}
      </span>
      <span class="auto-save-pill" :class="`is-${props.autoSaveStatusTone}`">
        {{ props.autoSaveStatusText }}
      </span>
    </div>

    <div class="toolbar" aria-label="编辑器工具栏">
      <button type="button" title="打开快捷命令" class="command-trigger" @click="emit('open-command')">
        <Search :size="17" />
        <span>命令</span>
      </button>
      <button
        type="button"
        :title="props.disabledActions?.['page.create'] ?? '新建页面'"
        class="page-start-trigger"
        :disabled="Boolean(props.disabledActions?.['page.create'])"
        @click="emit('open-page-start')"
      >
        <Plus :size="17" />
        <span>新建</span>
      </button>
      <button type="button" title="设计" :class="{ active: props.mode === 'design' }" @click="emit('set-mode', 'design')">
        <MonitorSmartphone :size="17" />
        <span>设计</span>
      </button>
      <button type="button" title="预览" :class="{ active: props.mode === 'preview' }" @click="emit('set-mode', 'preview')">
        <Eye :size="17" />
        <span>预览</span>
      </button>
      <button type="button" title="源码" :class="{ active: props.mode === 'outline' }" @click="emit('set-mode', 'outline')">
        <Code2 :size="17" />
        <span>源码</span>
      </button>
    </div>

    <div class="toolbar compact" aria-label="历史与保存">
      <button type="button" title="撤销" :disabled="!props.canUndo" @click="emit('undo')">
        <Undo2 :size="17" />
      </button>
      <button type="button" title="重做" :disabled="!props.canRedo" @click="emit('redo')">
        <Redo2 :size="17" />
      </button>
      <button
        type="button"
        :title="props.disabledActions?.['draft.save'] ?? '保存草稿'"
        :disabled="Boolean(props.disabledActions?.['draft.save'])"
        @click="emit('save')"
      >
        <Save :size="17" />
        <span>{{ props.dirty ? "保存草稿" : "已保存" }}</span>
      </button>
      <button
        type="button"
        :title="props.disabledActions?.['schema.export'] ?? '导出当前页面 Schema'"
        :disabled="Boolean(props.disabledActions?.['schema.export'])"
        @click="emit('export-schema')"
      >
        <Download :size="17" />
        <span>导出</span>
      </button>
      <button
        type="button"
        :title="props.disabledActions?.['schema.import'] ?? '导入页面 Schema'"
        :disabled="Boolean(props.disabledActions?.['schema.import'])"
        @click="emit('import-schema')"
      >
        <Upload :size="17" />
        <span>导入</span>
      </button>
      <button
        type="button"
        :title="props.disabledActions?.['preview.create'] ?? '生成预览版本'"
        :disabled="Boolean(props.disabledActions?.['preview.create'])"
        @click="emit('create-preview')"
      >
        <Eye :size="17" />
        <span>预览链接</span>
      </button>
      <button
        type="button"
        :title="props.disabledActions?.['publish.submit'] ?? '发布当前页面'"
        :disabled="Boolean(props.disabledActions?.['publish.submit'])"
        @click="emit('publish')"
      >
        <PanelRight :size="17" />
        <span>发布</span>
      </button>
      <button
        type="button"
        :title="props.disabledActions?.['runtime.open'] ?? '打开已发布 H5'"
        :disabled="Boolean(props.disabledActions?.['runtime.open'])"
        @click="emit('open-runtime')"
      >
        <MonitorSmartphone :size="17" />
        <span>打开 H5</span>
      </button>
      <button
        type="button"
        :title="props.disabledActions?.['runtime.open'] ?? '用 React H5 runtime 打开当前页面'"
        :disabled="Boolean(props.disabledActions?.['runtime.open'])"
        @click="emit('open-react-runtime')"
      >
        <MonitorSmartphone :size="17" />
        <span>React H5</span>
      </button>
    </div>
  </header>
</template>
