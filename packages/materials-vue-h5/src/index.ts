import { defineComponent, h, type CSSProperties, type PropType } from "vue";
import type { LowcodeMaterial } from "@meumall/lowcode-core";
import { createMaterialManifest, type LowcodeNode } from "@meumall/lowcode-schema";
import type { VueH5MaterialComponent } from "@meumall/lowcode-renderer-vue-h5";

type RuntimeProps = Record<string, unknown>;

const materialPropOptions = {
  props: {
    type: Object as PropType<RuntimeProps>,
    required: true,
  },
  node: {
    type: Object as PropType<LowcodeNode>,
    required: true,
  },
};

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function number(value: unknown, fallback: number): number {
  return typeof value === "number" ? value : fallback;
}

export const ActivityHero = defineComponent({
  name: "ActivityHero",
  props: materialPropOptions,
  setup(props, { slots }) {
    return () => {
      const runtimeProps = props.props ?? {};
      const imageUrl = text(runtimeProps.imageUrl);
      return h(
        "section",
        {
          class: "mlc-material mlc-activity-hero",
          style: {
            padding: "18px 16px",
            background: text(runtimeProps.backgroundColor, "#ffffff"),
          },
        },
        [
          imageUrl
            ? h("img", {
                src: imageUrl,
                alt: "",
                style: {
                  width: "100%",
                  display: "block",
                  borderRadius: "8px",
                },
              })
            : null,
          h(
            "h1",
            {
              style: {
                margin: "14px 0 6px",
                fontSize: `${number(runtimeProps.titleSize, 24)}px`,
                lineHeight: 1.2,
                color: text(runtimeProps.titleColor, "#111827"),
              },
            },
            text(runtimeProps.title, "活动标题"),
          ),
          h(
            "p",
            {
              style: {
                margin: 0,
                color: "#6b7280",
                fontSize: "14px",
                lineHeight: 1.6,
              },
            },
            text(runtimeProps.subtitle),
          ),
          slots.default?.(),
        ],
      );
    };
  },
});

export const ImageBanner = defineComponent({
  name: "ImageBanner",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const imageUrl = text(runtimeProps.imageUrl);
      if (!imageUrl) {
        return h("section", { class: "mlc-material mlc-empty-image" }, "请配置图片");
      }
      return h("img", {
        class: "mlc-material mlc-image-banner",
        src: imageUrl,
        alt: text(runtimeProps.alt),
        style: {
          width: "100%",
          display: "block",
          borderRadius: `${number(runtimeProps.radius, 0)}px`,
        },
      });
    };
  },
});

export const RichTextBlock = defineComponent({
  name: "RichTextBlock",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      return h("section", {
        class: "mlc-material mlc-rich-text",
        style: {
          padding: "16px",
          color: "#1f2937",
          lineHeight: 1.7,
          fontSize: "14px",
        },
        innerHTML: text(runtimeProps.html, "<p>请输入富文本内容</p>"),
      });
    };
  },
});

export const ProductList = defineComponent({
  name: "ProductList",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const items = Array.isArray(runtimeProps.items) ? runtimeProps.items : [];
      if (!items.length) {
        return h("section", { class: "mlc-material mlc-empty-products" }, "请配置商品数据");
      }
      return h(
        "section",
        {
          class: "mlc-material mlc-product-list",
          style: { padding: "10px 12px", background: "#ffffff" },
        },
        items.map((item, index) => {
          const product = item as Record<string, unknown>;
          return h(
            "button",
            {
              type: "button",
              onClick: () => {
                const handler = runtimeProps.onProductClick;
                if (typeof handler === "function") handler(product);
              },
              style: {
                width: "100%",
                border: 0,
                borderBottom: "1px solid #eef0f3",
                background: "transparent",
                padding: "12px 0",
                display: "flex",
                gap: "12px",
                textAlign: "left",
              } satisfies CSSProperties,
            },
            [
              typeof product.imageUrl === "string"
                ? h("img", {
                    src: product.imageUrl,
                    alt: "",
                    style: {
                      width: "84px",
                      height: "84px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      background: "#f3f4f6",
                    },
                  })
                : null,
              h("span", { style: { minWidth: 0, flex: 1 } }, [
                h(
                  "strong",
                  { style: { display: "block", color: "#111827", fontSize: "14px" } },
                  String(product.title ?? "商品名称"),
                ),
                h(
                  "span",
                  { style: { display: "block", color: "#dc2626", marginTop: "8px", fontWeight: 700 } },
                  String(product.priceText ?? ""),
                ),
                h(
                  "span",
                  { style: { display: "block", color: "#6b7280", marginTop: "6px", fontSize: "12px" } },
                  String(product.desc ?? `商品 ${index + 1}`),
                ),
              ]),
            ],
          );
        }),
      );
    };
  },
});

export const CouponSection = defineComponent({
  name: "CouponSection",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      return h(
        "section",
        {
          class: "mlc-material mlc-coupon-section",
          style: {
            padding: "16px",
            background: text(runtimeProps.backgroundColor, "#fff7ed"),
          },
        },
        [
          h("h2", { style: { margin: "0 0 12px", fontSize: "18px", color: "#111827" } }, text(runtimeProps.title, "优惠券")),
          h(
            "button",
            {
              type: "button",
              onClick: () => {
                const handler = runtimeProps.onReceive;
                if (typeof handler === "function") handler();
              },
              style: {
                width: "100%",
                height: "44px",
                border: 0,
                borderRadius: "8px",
                color: "#ffffff",
                background: text(runtimeProps.buttonColor, "#111827"),
                fontWeight: 700,
              },
            },
            text(runtimeProps.buttonText, "领取优惠券"),
          ),
        ],
      );
    };
  },
});

export const SectionContainer = defineComponent({
  name: "SectionContainer",
  props: materialPropOptions,
  setup(props, { slots }) {
    return () => {
      const runtimeProps = props.props ?? {};
      const title = text(runtimeProps.title);
      const subtitle = text(runtimeProps.subtitle);
      const children = slots.default?.();

      return h(
        "section",
        {
          class: "mlc-material mlc-section-container",
          style: {
            margin: "10px 0",
            padding: `${number(runtimeProps.padding, 12)}px`,
            background: text(runtimeProps.backgroundColor, "#ffffff"),
            borderRadius: `${number(runtimeProps.radius, 10)}px`,
          },
        },
        [
          title
            ? h("h2", { style: { margin: "0 0 6px", color: "#111827", fontSize: "18px" } }, title)
            : null,
          subtitle
            ? h("p", { style: { margin: "0 0 12px", color: "#64748b", fontSize: "13px", lineHeight: 1.6 } }, subtitle)
            : null,
          children?.length
            ? h("div", { class: "mlc-section-container__body" }, children)
            : h("div", { class: "mlc-section-container__empty" }, "向容器中添加物料"),
        ],
      );
    };
  },
});

export const h5VueMaterials: LowcodeMaterial<VueH5MaterialComponent>[] = [
  {
    component: SectionContainer,
    manifest: createMaterialManifest({
      componentName: "SectionContainer",
      materialVersion: "0.1.0",
      title: "容器区块",
      category: "layout",
      platforms: ["h5"],
      defaultProps: {
        title: "精选专区",
        subtitle: "可在容器中继续添加 Banner、商品或优惠券。",
        backgroundColor: "#ffffff",
        padding: 12,
        radius: 10,
      },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "精选专区" },
        subtitle: { label: "说明", type: "string", setter: "textarea", defaultValue: "可在容器中继续添加 Banner、商品或优惠券。" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff" },
        padding: { label: "内边距", type: "number", setter: "number", defaultValue: 12 },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 10 },
      },
    }),
  },
  {
    component: ActivityHero,
    manifest: createMaterialManifest({
      componentName: "ActivityHero",
      materialVersion: "0.1.0",
      title: "活动头图",
      category: "marketing",
      platforms: ["h5"],
      defaultProps: {
        title: "夏日好物节",
        subtitle: "精选爆品限时补贴，支持一键搭建推广页。",
        imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
        backgroundColor: "#ffffff",
        titleColor: "#111827",
        titleSize: 24,
      },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", required: true, defaultValue: "夏日好物节" },
        subtitle: { label: "副标题", type: "string", setter: "textarea", defaultValue: "精选爆品限时补贴，支持一键搭建推广页。" },
        imageUrl: { label: "图片", type: "string", setter: "image", defaultValue: "" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff" },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#111827" },
        titleSize: { label: "标题字号", type: "number", setter: "number", defaultValue: 24 },
      },
    }),
  },
  {
    component: ImageBanner,
    manifest: createMaterialManifest({
      componentName: "ImageBanner",
      materialVersion: "0.1.0",
      title: "图片 Banner",
      category: "marketing",
      platforms: ["h5"],
      defaultProps: {
        imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
        alt: "",
        radius: 8,
      },
      propsSchema: {
        imageUrl: { label: "图片", type: "string", setter: "image", required: true, defaultValue: "" },
        alt: { label: "替代文本", type: "string", setter: "input", defaultValue: "" },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 8 },
      },
    }),
  },
  {
    component: ProductList,
    manifest: createMaterialManifest({
      componentName: "ProductList",
      materialVersion: "0.1.0",
      title: "商品列表",
      category: "commerce",
      platforms: ["h5"],
      defaultProps: {
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
      dataSourceSlots: [{ name: "items", acceptedTypes: ["product.byIds", "product.byActivity"] }],
      propsSchema: {
        items: { label: "商品数据", type: "array", setter: "dataSourceSelector", defaultValue: [] },
      },
      events: [{ name: "onProductClick", title: "点击商品" }],
    }),
  },
  {
    component: CouponSection,
    manifest: createMaterialManifest({
      componentName: "CouponSection",
      materialVersion: "0.1.0",
      title: "优惠券区块",
      category: "marketing",
      platforms: ["h5"],
      defaultProps: {
        title: "新人专享券",
        buttonText: "立即领取",
        backgroundColor: "#fff7ed",
        buttonColor: "#111827",
      },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "新人专享券" },
        buttonText: { label: "按钮文案", type: "string", setter: "input", defaultValue: "立即领取" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#fff7ed" },
        buttonColor: { label: "按钮色", type: "string", setter: "color", defaultValue: "#111827" },
      },
      events: [{ name: "onReceive", title: "点击领取" }],
    }),
  },
  {
    component: RichTextBlock,
    manifest: createMaterialManifest({
      componentName: "RichTextBlock",
      materialVersion: "0.1.0",
      title: "富文本",
      category: "content",
      platforms: ["h5"],
      defaultProps: { html: "<p><strong>活动说明：</strong>下单即享限时优惠，数量有限。</p>" },
      propsSchema: {
        html: { label: "内容", type: "string", setter: "richText", defaultValue: "<p>请输入富文本内容</p>" },
      },
    }),
  },
];
