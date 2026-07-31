<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import {
  Code2,
  Copy,
  Eye,
  Layers,
  MonitorSmartphone,
  PanelRight,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  Smartphone,
  Trash2,
  Undo2,
} from "@lucide/vue";
import { createMaterialRegistry } from "@meumall/lowcode-core";
import {
  appendNode,
  copyNode,
  createEditorState,
  duplicateNode,
  markSaved,
  pasteNode,
  redo,
  removeNode,
  replaceNodeProps,
  selectNode,
  setEditorMode,
  setEditorViewport,
  undo,
  type LowcodeEditorState,
} from "@meumall/lowcode-editor";
import { h5VueMaterials } from "@meumall/lowcode-materials-vue-h5";
import { LowcodeVueRenderer } from "@meumall/lowcode-renderer-vue-h5";
import {
  createLowcodePageSchema,
  validateLowcodePageSchema,
  type JsonObject,
  type JsonValue,
  type LowcodeMaterialManifest,
  type LowcodeNode,
  type LowcodePageSchema,
  type LowcodePropSchema,
} from "@meumall/lowcode-schema";

const STORAGE_KEY = "meumall-lowcode-editor-playground";

const registry = createMaterialRegistry(h5VueMaterials);
const materials = registry.list();

const initialSchema = createLowcodePageSchema({
  pageId: "summer-campaign-demo",
  title: "夏日好物节",
  pageType: "activity",
  targetPlatforms: ["h5"],
  layout: {
    safeArea: true,
    backgroundColor: "#f3f4f6",
    maxWidth: 430,
  },
  nodes: [
    {
      id: "node_hero",
      componentName: "ActivityHero",
      materialVersion: "0.1.0",
      props: {
        title: "夏日好物节",
        subtitle: "精选爆品限时补贴，运营可直接组合物料生成页面。",
        imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
        backgroundColor: "#ffffff",
        titleColor: "#111827",
        titleSize: 24,
      },
    },
    {
      id: "node_coupon",
      componentName: "CouponSection",
      materialVersion: "0.1.0",
      props: {
        title: "新人专享券",
        buttonText: "立即领取",
        backgroundColor: "#fff7ed",
        buttonColor: "#111827",
      },
    },
    {
      id: "node_products",
      componentName: "ProductList",
      materialVersion: "0.1.0",
      props: {
        items: [
          {
            id: "sku_001",
            title: "轻盈通勤手提包",
            priceText: "¥199",
            desc: "活动价",
            imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=300&q=80",
          },
          {
            id: "sku_002",
            title: "夏季舒适凉鞋",
            priceText: "¥129",
            desc: "限时补贴",
            imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80",
          },
        ],
      },
    },
  ],
  publishMeta: {
    environment: "test",
  },
});

function loadSchema(): LowcodePageSchema {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return initialSchema;
  try {
    const parsed = JSON.parse(raw) as LowcodePageSchema;
    return validateLowcodePageSchema(parsed).valid ? parsed : initialSchema;
  } catch {
    return initialSchema;
  }
}

const editorState = shallowRef<LowcodeEditorState>(createEditorState(loadSchema(), { selectedNodeId: "node_hero" }));
const schemaDraft = ref(JSON.stringify(editorState.value.schema, null, 2));
const jsonError = ref("");

const validation = computed(() => validateLowcodePageSchema(editorState.value.schema));
const selectedNode = computed(() => findNode(editorState.value.schema.nodes, editorState.value.selectedNodeId));
const selectedManifest = computed(() =>
  selectedNode.value ? registry.get(selectedNode.value.componentName)?.manifest : undefined,
);
const pageJson = computed(() => JSON.stringify(editorState.value.schema, null, 2));

watch(
  () => editorState.value.schema,
  (schema) => {
    schemaDraft.value = JSON.stringify(schema, null, 2);
  },
);

function findNode(nodes: LowcodeNode[], nodeId?: string): LowcodeNode | undefined {
  if (!nodeId) return undefined;
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    const child = findNode(node.children ?? [], nodeId);
    if (child) return child;
  }
  return undefined;
}

function addMaterial(manifest: LowcodeMaterialManifest): void {
  editorState.value = appendNode(editorState.value, {
    componentName: manifest.componentName,
    materialVersion: manifest.materialVersion,
    props: { ...manifest.defaultProps },
    meta: { name: manifest.title },
  });
}

function onDragStart(event: DragEvent, manifest: LowcodeMaterialManifest): void {
  event.dataTransfer?.setData("application/x-meumall-material", manifest.componentName);
  event.dataTransfer?.setData("text/plain", manifest.componentName);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
}

function onCanvasDrop(event: DragEvent): void {
  const componentName = event.dataTransfer?.getData("application/x-meumall-material");
  const material = materials.find((item) => item.manifest.componentName === componentName);
  if (material) addMaterial(material.manifest);
}

function updateProp(propName: string, propSchema: LowcodePropSchema, value: unknown): void {
  if (!selectedNode.value) return;
  editorState.value = replaceNodeProps(editorState.value, selectedNode.value.id, {
    ...selectedNode.value.props,
    [propName]: normalizeInputValue(propSchema, value),
  });
}

function normalizeInputValue(propSchema: LowcodePropSchema, value: unknown): JsonValue {
  if (propSchema.type === "number") {
    const nextValue = Number(value);
    return Number.isFinite(nextValue) ? nextValue : 0;
  }
  if (propSchema.type === "boolean") {
    return Boolean(value);
  }
  if (propSchema.type === "array" || propSchema.type === "object") {
    if (typeof value !== "string") return value as JsonValue;
    try {
      return JSON.parse(value) as JsonValue;
    } catch {
      return value;
    }
  }
  return String(value);
}

function select(nodeId: string): void {
  editorState.value = selectNode(editorState.value, nodeId);
}

function removeSelected(): void {
  if (!selectedNode.value) return;
  editorState.value = removeNode(editorState.value, selectedNode.value.id);
}

function duplicateSelected(): void {
  if (!selectedNode.value) return;
  editorState.value = duplicateNode(editorState.value, selectedNode.value.id);
}

function copySelected(): void {
  if (!selectedNode.value) return;
  editorState.value = copyNode(editorState.value, selectedNode.value.id);
}

function pasteCopied(): void {
  editorState.value = pasteNode(editorState.value);
}

function saveSchema(): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(editorState.value.schema));
  editorState.value = markSaved(editorState.value);
}

function resetSchema(): void {
  window.localStorage.removeItem(STORAGE_KEY);
  editorState.value = createEditorState(initialSchema, { selectedNodeId: "node_hero" });
}

function applyJson(): void {
  try {
    const parsed = JSON.parse(schemaDraft.value) as LowcodePageSchema;
    const result = validateLowcodePageSchema(parsed);
    if (!result.valid) {
      jsonError.value = result.errors.join("；");
      return;
    }
    editorState.value = createEditorState(parsed, {
      selectedNodeId: parsed.nodes[0]?.id,
      mode: editorState.value.mode,
      viewport: editorState.value.viewport,
    });
    jsonError.value = "";
  } catch (error) {
    jsonError.value = error instanceof Error ? error.message : "JSON 解析失败";
  }
}

function updatePageTitle(value: string): void {
  editorState.value = {
    ...editorState.value,
    schema: {
      ...editorState.value.schema,
      title: value,
    },
    dirty: true,
    lastAction: "updatePageTitle",
  };
}

function asText(value: JsonValue | undefined): string {
  return typeof value === "string" ? value : value == null ? "" : JSON.stringify(value, null, 2);
}

function isStructured(propSchema: LowcodePropSchema): boolean {
  return propSchema.type === "array" || propSchema.type === "object" || propSchema.setter === "dataSourceSelector";
}
</script>

<template>
  <main class="editor-shell">
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark">M</span>
        <div>
          <strong>MeuMall Lowcode</strong>
          <span>{{ editorState.schema.title }}</span>
        </div>
      </div>

      <div class="toolbar" aria-label="编辑器工具栏">
        <button title="设计" :class="{ active: editorState.mode === 'design' }" @click="editorState = setEditorMode(editorState, 'design')">
          <MonitorSmartphone :size="17" />
          <span>设计</span>
        </button>
        <button title="预览" :class="{ active: editorState.mode === 'preview' }" @click="editorState = setEditorMode(editorState, 'preview')">
          <Eye :size="17" />
          <span>预览</span>
        </button>
        <button title="源码" :class="{ active: editorState.mode === 'outline' }" @click="editorState = setEditorMode(editorState, 'outline')">
          <Code2 :size="17" />
          <span>源码</span>
        </button>
      </div>

      <div class="toolbar compact" aria-label="历史与保存">
        <button title="撤销" :disabled="!editorState.history.past.length" @click="editorState = undo(editorState)">
          <Undo2 :size="17" />
        </button>
        <button title="重做" :disabled="!editorState.history.future.length" @click="editorState = redo(editorState)">
          <Redo2 :size="17" />
        </button>
        <button title="保存到本地" @click="saveSchema">
          <Save :size="17" />
          <span>{{ editorState.dirty ? "保存" : "已保存" }}</span>
        </button>
      </div>
    </header>

    <aside class="left-panel">
      <section class="panel-section">
        <div class="panel-title">
          <Plus :size="16" />
          <span>物料</span>
        </div>
        <button
          v-for="material in materials"
          :key="material.manifest.componentName"
          class="material-item"
          draggable="true"
          @dragstart="onDragStart($event, material.manifest)"
          @click="addMaterial(material.manifest)"
        >
          <span>
            <strong>{{ material.manifest.title }}</strong>
            <small>{{ material.manifest.category }} / {{ material.manifest.componentName }}</small>
          </span>
          <Plus :size="15" />
        </button>
      </section>

      <section class="panel-section">
        <div class="panel-title">
          <Layers :size="16" />
          <span>结构</span>
        </div>
        <button
          v-for="(node, index) in editorState.schema.nodes"
          :key="node.id"
          class="outline-item"
          :class="{ selected: editorState.selectedNodeId === node.id }"
          @click="select(node.id)"
        >
          <span>{{ index + 1 }}</span>
          <strong>{{ registry.get(node.componentName)?.manifest.title ?? node.componentName }}</strong>
        </button>
      </section>
    </aside>

    <section class="canvas-panel" @dragover.prevent @drop.prevent="onCanvasDrop">
      <div class="canvas-top">
        <div>
          <strong>{{ editorState.mode === "outline" ? "Schema" : "H5 画布" }}</strong>
          <span>{{ validation.valid ? "校验通过" : validation.errors[0] }}</span>
        </div>
        <div class="viewport-switch">
          <button
            title="iPhone 视口"
            :class="{ active: editorState.viewport.width === 375 }"
            @click="editorState = setEditorViewport(editorState, { width: 375 })"
          >
            <Smartphone :size="16" />
            <span>375</span>
          </button>
          <button
            title="大屏 H5 视口"
            :class="{ active: editorState.viewport.width === 430 }"
            @click="editorState = setEditorViewport(editorState, { width: 430 })"
          >
            <PanelRight :size="16" />
            <span>430</span>
          </button>
        </div>
      </div>

      <div v-if="editorState.mode !== 'outline'" class="phone-stage">
        <div class="phone-frame" :style="{ width: `${editorState.viewport.width}px` }">
          <div class="phone-status">
            <span>{{ editorState.schema.title }}</span>
            <span>H5</span>
          </div>
          <LowcodeVueRenderer
            :schema="editorState.schema"
            :registry="registry"
            :fallback="'暂无内容'"
          />
        </div>
      </div>

      <div v-else class="schema-editor">
        <textarea v-model="schemaDraft" spellcheck="false" />
        <div class="schema-actions">
          <button @click="applyJson">应用 JSON</button>
          <span v-if="jsonError">{{ jsonError }}</span>
        </div>
      </div>
    </section>

    <aside class="right-panel">
      <section class="panel-section">
        <div class="panel-title">
          <PanelRight :size="16" />
          <span>页面</span>
        </div>
        <label class="field">
          <span>标题</span>
          <input :value="editorState.schema.title" @input="updatePageTitle(($event.target as HTMLInputElement).value)" />
        </label>
        <label class="field">
          <span>Page ID</span>
          <input :value="editorState.schema.pageId" readonly />
        </label>
      </section>

      <section class="panel-section">
        <div class="panel-title">
          <Layers :size="16" />
          <span>属性</span>
        </div>

        <div v-if="selectedNode && selectedManifest" class="inspector">
          <div class="selected-card">
            <strong>{{ selectedManifest.title }}</strong>
            <span>{{ selectedNode.id }}</span>
          </div>

          <label
            v-for="(propSchema, propName) in selectedManifest.propsSchema"
            :key="String(propName)"
            class="field"
          >
            <span>{{ propSchema.label }}</span>
            <textarea
              v-if="isStructured(propSchema) || propSchema.setter === 'textarea' || propSchema.setter === 'richText'"
              :value="asText(selectedNode.props[String(propName)])"
              rows="5"
              @input="updateProp(String(propName), propSchema, ($event.target as HTMLTextAreaElement).value)"
            />
            <input
              v-else-if="propSchema.setter === 'color'"
              type="color"
              :value="asText(selectedNode.props[String(propName)]) || '#111827'"
              @input="updateProp(String(propName), propSchema, ($event.target as HTMLInputElement).value)"
            />
            <input
              v-else
              :type="propSchema.type === 'number' ? 'number' : 'text'"
              :value="asText(selectedNode.props[String(propName)])"
              @input="updateProp(String(propName), propSchema, ($event.target as HTMLInputElement).value)"
            />
          </label>

          <div class="toolbar inspector-actions">
            <button title="复制节点" @click="copySelected">
              <Copy :size="16" />
              <span>复制</span>
            </button>
            <button title="粘贴节点" :disabled="!editorState.clipboard" @click="pasteCopied">
              <Plus :size="16" />
              <span>粘贴</span>
            </button>
            <button title="创建副本" @click="duplicateSelected">
              <Copy :size="16" />
              <span>副本</span>
            </button>
            <button title="删除节点" class="danger" @click="removeSelected">
              <Trash2 :size="16" />
              <span>删除</span>
            </button>
          </div>
        </div>

        <div v-else class="empty-state">未选择节点</div>
      </section>

      <section class="panel-section">
        <div class="panel-title">
          <Code2 :size="16" />
          <span>状态</span>
        </div>
        <dl class="state-list">
          <div>
            <dt>节点数</dt>
            <dd>{{ editorState.schema.nodes.length }}</dd>
          </div>
          <div>
            <dt>历史</dt>
            <dd>{{ editorState.history.past.length }} / {{ editorState.history.future.length }}</dd>
          </div>
          <div>
            <dt>校验</dt>
            <dd>{{ validation.valid ? "通过" : "失败" }}</dd>
          </div>
        </dl>
        <button class="reset-button" @click="resetSchema">
          <RotateCcw :size="16" />
          <span>重置示例</span>
        </button>
      </section>
    </aside>
  </main>
</template>
