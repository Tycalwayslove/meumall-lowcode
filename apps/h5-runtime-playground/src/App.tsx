import { useEffect, useMemo, useState } from "react";
import {
  createDataSourceRegistry,
  decodePageSchemaFromUrlParam,
  resolveLowcodeDataSources,
  type DataSourceResolutionRecord,
} from "@meumall/lowcode-adapters";
import { createMaterialRegistry } from "@meumall/lowcode-core";
import { h5Materials } from "@meumall/lowcode-materials-h5";
import { LowcodeRenderer } from "@meumall/lowcode-renderer-h5";
import {
  createLowcodePageSchema,
  validateLowcodePageSchema,
  type JsonObject,
  type JsonValue,
  type LowcodeDataSourceConfig,
  type LowcodePageSchema,
} from "@meumall/lowcode-schema";

const sampleProducts = [
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
  {
    id: "sku_003",
    title: "防晒轻薄衬衫",
    priceText: "¥159",
    desc: "热卖单品",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80",
  },
];

function resolveSampleProductDataSource(dataSource: LowcodeDataSourceConfig): JsonValue {
  const limit = typeof dataSource.params?.limit === "number" ? dataSource.params.limit : sampleProducts.length;
  return sampleProducts.slice(0, limit) as JsonValue;
}

const sampleSchema = createLowcodePageSchema({
  pageId: "summer-campaign-demo",
  pageVersion: "prod-20260731-demo",
  status: "published",
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
        subtitle: "React H5 runtime 正在消费低代码 Page Schema。",
        imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
        backgroundColor: "#ffffff",
        titleColor: "#111827",
        titleSize: 24,
      },
    },
    {
      id: "node_notice",
      componentName: "NoticeBar",
      materialVersion: "0.1.0",
      props: {
        label: "公告",
        content: "活动期间下单即享限时补贴，库存有限先到先得。",
        backgroundColor: "#fffbeb",
        textColor: "#92400e",
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
      id: "node_container",
      componentName: "SectionContainer",
      materialVersion: "0.1.0",
      props: {
        title: "精选专区",
        subtitle: "容器内可以嵌套 Banner、商品列表和富文本。",
        backgroundColor: "#ffffff",
        padding: 12,
        radius: 10,
      },
      children: [
        {
          id: "node_action_nested",
          componentName: "ActionButton",
          materialVersion: "0.1.0",
          props: {
            text: "立即逛精选",
            linkUrl: "",
            backgroundColor: "#111827",
            textColor: "#ffffff",
            wrapperBackgroundColor: "#ffffff",
            radius: 8,
            paddingY: 8,
          },
        },
        {
          id: "node_banner_nested",
          componentName: "ImageBanner",
          materialVersion: "0.1.0",
          props: {
            imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
            alt: "",
            radius: 8,
          },
        },
        {
          id: "node_products_nested",
          componentName: "ProductList",
          materialVersion: "0.1.0",
          props: {
            items: [],
          },
          dataBinding: {
            items: "products",
          },
        },
      ],
    },
    {
      id: "node_spacer",
      componentName: "SpacerBlock",
      materialVersion: "0.1.0",
      props: {
        height: 16,
        backgroundColor: "#f3f4f6",
      },
    },
    {
      id: "node_rich_text",
      componentName: "RichTextBlock",
      materialVersion: "0.1.0",
      props: {
        html: "<p><strong>运营说明：</strong>这是一份发布后的 H5 schema 渲染示例，后续可替换为 Java 配置平台返回的数据。</p>",
      },
    },
  ],
  dataSources: [
    {
      id: "ds_products",
      type: "product.byActivity",
      bindTo: "products",
      params: {
        activityId: "summer-campaign-demo",
        limit: 20,
      },
      cache: {
        ttlSeconds: 60,
        scope: "public",
      },
    },
  ],
  publishMeta: {
    environment: "prod",
    publishedAt: "2026-07-31T00:00:00.000Z",
    operator: "local-admin",
  },
});

const registry = createMaterialRegistry(h5Materials);
const dataSourceRegistry = createDataSourceRegistry({
  "product.byActivity": resolveSampleProductDataSource,
  "product.byIds": resolveSampleProductDataSource,
  "custom.http": (dataSource) => dataSource.params ?? {},
});

interface RuntimeSchemaSource {
  schema: LowcodePageSchema;
  source: "sample" | "url";
  error?: string;
}

function resolveRuntimeSchema(): RuntimeSchemaSource {
  const params = new URLSearchParams(window.location.search);
  const encodedSchema = params.get("schema");
  if (!encodedSchema) {
    return {
      schema: sampleSchema,
      source: "sample",
    };
  }

  try {
    return {
      schema: decodePageSchemaFromUrlParam(encodedSchema),
      source: "url",
    };
  } catch (error) {
    return {
      schema: sampleSchema,
      source: "sample",
      error: error instanceof Error ? error.message : "URL schema 解析失败",
    };
  }
}

function countNodes(schema: LowcodePageSchema): number {
  const walk = (nodes: LowcodePageSchema["nodes"]): number => {
    return nodes.reduce((total, node) => total + 1 + walk(node.children ?? []), 0);
  };
  return walk(schema.nodes);
}

export function App() {
  const [renderErrors, setRenderErrors] = useState<string[]>([]);
  const [runtimeData, setRuntimeData] = useState<JsonObject>({});
  const [dataSourceRecords, setDataSourceRecords] = useState<DataSourceResolutionRecord[]>([]);
  const [dataResolving, setDataResolving] = useState(true);
  const runtimeSchema = useMemo(() => resolveRuntimeSchema(), []);
  const validation = useMemo(() => validateLowcodePageSchema(runtimeSchema.schema), [runtimeSchema.schema]);
  const nodeCount = useMemo(() => countNodes(runtimeSchema.schema), [runtimeSchema.schema]);
  const dataSourceErrors = dataSourceRecords.filter((record) => record.status === "error");
  const dataSourceResolvedCount = dataSourceRecords.filter((record) => record.status === "resolved").length;

  useEffect(() => {
    let cancelled = false;
    setDataResolving(true);
    resolveLowcodeDataSources(runtimeSchema.schema.dataSources ?? [], dataSourceRegistry)
      .then((result) => {
        if (cancelled) return;
        setRuntimeData(result.data);
        setDataSourceRecords(result.records);
      })
      .finally(() => {
        if (!cancelled) setDataResolving(false);
      });
    return () => {
      cancelled = true;
    };
  }, [runtimeSchema.schema]);

  return (
    <main className="runtime-shell">
      <section className="runtime-status" aria-label="运行时状态">
        <strong>{runtimeSchema.schema.title}</strong>
        <dl>
          <div>
            <dt>Source</dt>
            <dd>{runtimeSchema.source === "url" ? "editor url" : "sample"}</dd>
          </div>
          <div>
            <dt>Schema</dt>
            <dd>{validation.valid ? "valid" : "invalid"}</dd>
          </div>
          <div>
            <dt>Version</dt>
            <dd>{runtimeSchema.schema.pageVersion}</dd>
          </div>
          <div>
            <dt>Env</dt>
            <dd>{runtimeSchema.schema.publishMeta.environment}</dd>
          </div>
          <div>
            <dt>Nodes</dt>
            <dd>{nodeCount}</dd>
          </div>
          <div>
            <dt>Data</dt>
            <dd>
              {dataResolving
                ? "resolving"
                : dataSourceErrors.length
                  ? `${dataSourceErrors.length} error`
                  : `${dataSourceResolvedCount} resolved`}
            </dd>
          </div>
        </dl>
        {runtimeSchema.error ? <p className="runtime-warning">{runtimeSchema.error}</p> : null}
        {dataSourceRecords.length ? (
          <div className="runtime-data-records" aria-label="数据源状态">
            {dataSourceRecords.map((record) => (
              <p key={record.id} className={`is-${record.status}`}>
                <strong>{record.id}</strong>
                <span>{record.status === "resolved" ? `绑定到 ${record.bindTo}` : record.error}</span>
              </p>
            ))}
          </div>
        ) : null}
      </section>

      <section className="phone-frame" aria-label="H5 页面">
        <div className="phone-status">
          <span>{runtimeSchema.schema.title}</span>
          <span>React H5</span>
        </div>
        <LowcodeRenderer
          schema={runtimeSchema.schema}
          registry={registry}
          data={runtimeData}
          fallback={<div className="runtime-empty">页面暂无内容</div>}
          onRenderError={(error, node) => {
            setRenderErrors((current) => [...current, `${node?.id ?? "unknown"}: ${error.message}`]);
          }}
        />
      </section>

      {renderErrors.length ? (
        <section className="runtime-errors" aria-label="渲染错误">
          {renderErrors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </section>
      ) : null}
    </main>
  );
}
