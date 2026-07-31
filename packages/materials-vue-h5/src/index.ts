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

function list(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
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

export const ActionButton = defineComponent({
  name: "ActionButton",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const linkUrl = text(runtimeProps.linkUrl);
      const button = h(
        "button",
        {
          type: "button",
          class: "mlc-material mlc-action-button__button",
          style: {
            width: "100%",
            minHeight: "44px",
            border: 0,
            borderRadius: `${number(runtimeProps.radius, 8)}px`,
            color: text(runtimeProps.textColor, "#ffffff"),
            background: text(runtimeProps.backgroundColor, "#111827"),
            fontWeight: 700,
            fontSize: "15px",
          },
          onClick: () => {
            const handler = runtimeProps.onClick;
            if (typeof handler === "function") handler();
            if (linkUrl) window.location.href = linkUrl;
          },
        },
        text(runtimeProps.text, "立即参与"),
      );

      return h(
        "section",
        {
          class: "mlc-material mlc-action-button",
          style: {
            padding: `${number(runtimeProps.paddingY, 12)}px 16px`,
            background: text(runtimeProps.wrapperBackgroundColor, "transparent"),
          },
        },
        [button],
      );
    };
  },
});

export const NoticeBar = defineComponent({
  name: "NoticeBar",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      return h(
        "section",
        {
          class: "mlc-material mlc-notice-bar",
          style: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 14px",
            color: text(runtimeProps.textColor, "#92400e"),
            background: text(runtimeProps.backgroundColor, "#fffbeb"),
            fontSize: "13px",
            lineHeight: 1.5,
          },
        },
        [
          h("strong", { style: { flex: "0 0 auto", fontSize: "12px" } }, text(runtimeProps.label, "公告")),
          h("span", { style: { minWidth: 0, flex: 1 } }, text(runtimeProps.content, "活动期间下单即享限时优惠。")),
        ],
      );
    };
  },
});

export const SpacerBlock = defineComponent({
  name: "SpacerBlock",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      return h("div", {
        class: "mlc-material mlc-spacer-block",
        style: {
          height: `${number(runtimeProps.height, 12)}px`,
          background: text(runtimeProps.backgroundColor, "transparent"),
        },
      });
    };
  },
});

export const CountdownTimer = defineComponent({
  name: "CountdownTimer",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const boxes = [
        { label: "天", value: text(runtimeProps.days, "00") },
        { label: "时", value: text(runtimeProps.hours, "12") },
        { label: "分", value: text(runtimeProps.minutes, "30") },
        { label: "秒", value: text(runtimeProps.seconds, "00") },
      ];
      return h(
        "section",
        {
          class: "mlc-material mlc-countdown-timer",
          style: {
            padding: "12px 16px",
            color: text(runtimeProps.textColor, "#ffffff"),
            background: text(runtimeProps.backgroundColor, "#dc2626"),
          },
        },
        [
          h(
            "div",
            { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" } },
            [
              h("div", { style: { minWidth: 0 } }, [
                h("strong", { style: { display: "block", fontSize: "15px" } }, text(runtimeProps.title, "限时秒杀")),
                h("span", { style: { display: "block", marginTop: "3px", opacity: 0.86, fontSize: "12px" } }, text(runtimeProps.subtitle, "距离活动结束")),
              ]),
              h(
                "div",
                { style: { display: "flex", gap: "5px", flex: "0 0 auto" } },
                boxes.map((box) =>
                  h("span", { style: { display: "grid", gap: "2px", minWidth: "34px", textAlign: "center" } }, [
                    h(
                      "strong",
                      {
                        style: {
                          padding: "5px 6px",
                          borderRadius: "6px",
                          color: text(runtimeProps.numberColor, "#dc2626"),
                          background: "#ffffff",
                          fontSize: "14px",
                        },
                      },
                      box.value,
                    ),
                    h("small", { style: { color: "inherit", opacity: 0.78 } }, box.label),
                  ]),
                ),
              ),
            ],
          ),
        ],
      );
    };
  },
});

export const NavGrid = defineComponent({
  name: "NavGrid",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const items = list(runtimeProps.items);
      const columns = Math.max(2, Math.min(5, number(runtimeProps.columns, 4)));
      return h(
        "section",
        {
          class: "mlc-material mlc-nav-grid",
          style: {
            padding: "12px 14px",
            background: text(runtimeProps.backgroundColor, "#ffffff"),
          },
        },
        [
          h(
            "div",
            { style: { display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: "10px" } },
            items.map((item, index) => {
              const linkUrl = text(item.linkUrl);
              return h(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    const handler = runtimeProps.onNavigate;
                    if (typeof handler === "function") handler(item);
                    if (linkUrl) window.location.href = linkUrl;
                  },
                  style: {
                    display: "grid",
                    gap: "5px",
                    placeItems: "center",
                    minHeight: "68px",
                    border: 0,
                    borderRadius: `${number(runtimeProps.radius, 8)}px`,
                    color: text(runtimeProps.textColor, "#111827"),
                    background: text(item.backgroundColor, text(runtimeProps.itemBackgroundColor, "#f8fafc")),
                    textAlign: "center",
                  } satisfies CSSProperties,
                },
                [
                  h("strong", { style: { fontSize: "14px" } }, String(item.title ?? `导航 ${index + 1}`)),
                  item.subtitle ? h("span", { style: { color: "#64748b", fontSize: "11px" } }, String(item.subtitle)) : null,
                ],
              );
            }),
          ),
        ],
      );
    };
  },
});

export const FlashSaleList = defineComponent({
  name: "FlashSaleList",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const items = list(runtimeProps.items);
      return h(
        "section",
        {
          class: "mlc-material mlc-flash-sale-list",
          style: {
            padding: "14px 12px",
            background: text(runtimeProps.backgroundColor, "#ffffff"),
          },
        },
        [
          h("div", { style: { display: "flex", justifyContent: "space-between", gap: "10px", marginBottom: "10px" } }, [
            h("div", [
              h("strong", { style: { display: "block", color: "#111827", fontSize: "17px" } }, text(runtimeProps.title, "限时秒杀")),
              h("span", { style: { display: "block", marginTop: "3px", color: "#64748b", fontSize: "12px" } }, text(runtimeProps.subtitle, "爆品限量抢购")),
            ]),
            h("span", { style: { alignSelf: "start", color: "#dc2626", fontSize: "12px", fontWeight: 700 } }, text(runtimeProps.badgeText, "秒杀中")),
          ]),
          h(
            "div",
            { style: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" } },
            items.map((item, index) =>
              h(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    const handler = runtimeProps.onProductClick;
                    if (typeof handler === "function") handler(item);
                  },
                  style: {
                    overflow: "hidden",
                    border: "1px solid #eef0f3",
                    borderRadius: "10px",
                    padding: 0,
                    background: "#ffffff",
                    textAlign: "left",
                  } satisfies CSSProperties,
                },
                [
                  typeof item.imageUrl === "string"
                    ? h("img", {
                        src: item.imageUrl,
                        alt: "",
                        style: {
                          width: "100%",
                          aspectRatio: "1 / 1",
                          objectFit: "cover",
                        },
                      })
                    : null,
                  h("span", { style: { display: "grid", gap: "5px", padding: "9px" } }, [
                    h("strong", { style: { color: "#111827", fontSize: "13px", lineHeight: 1.35 } }, String(item.title ?? `秒杀商品 ${index + 1}`)),
                    h("span", { style: { color: "#dc2626", fontWeight: 800 } }, String(item.priceText ?? "")),
                    h("span", { style: { color: "#94a3b8", fontSize: "11px", textDecoration: "line-through" } }, String(item.originPriceText ?? "")),
                  ]),
                ],
              ),
            ),
          ),
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
    component: NoticeBar,
    manifest: createMaterialManifest({
      componentName: "NoticeBar",
      materialVersion: "0.1.0",
      title: "公告条",
      category: "marketing",
      platforms: ["h5"],
      defaultProps: {
        label: "公告",
        content: "活动期间下单即享限时优惠，库存有限先到先得。",
        backgroundColor: "#fffbeb",
        textColor: "#92400e",
      },
      propsSchema: {
        label: { label: "标签", type: "string", setter: "input", defaultValue: "公告" },
        content: { label: "内容", type: "string", setter: "textarea", defaultValue: "活动期间下单即享限时优惠，库存有限先到先得。" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#fffbeb" },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#92400e" },
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
    component: ActionButton,
    manifest: createMaterialManifest({
      componentName: "ActionButton",
      materialVersion: "0.1.0",
      title: "行动按钮",
      category: "marketing",
      platforms: ["h5"],
      defaultProps: {
        text: "立即参与",
        linkUrl: "",
        backgroundColor: "#111827",
        textColor: "#ffffff",
        wrapperBackgroundColor: "#f3f4f6",
        radius: 8,
        paddingY: 12,
      },
      propsSchema: {
        text: { label: "按钮文案", type: "string", setter: "input", defaultValue: "立即参与" },
        linkUrl: { label: "跳转链接", type: "string", setter: "input", defaultValue: "" },
        backgroundColor: { label: "按钮色", type: "string", setter: "color", defaultValue: "#111827" },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#ffffff" },
        wrapperBackgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "#f3f4f6" },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 8 },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 12 },
      },
      events: [{ name: "onClick", title: "点击按钮" }],
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
    component: SpacerBlock,
    manifest: createMaterialManifest({
      componentName: "SpacerBlock",
      materialVersion: "0.1.0",
      title: "间距块",
      category: "layout",
      platforms: ["h5"],
      defaultProps: {
        height: 12,
        backgroundColor: "#f3f4f6",
      },
      propsSchema: {
        height: { label: "高度", type: "number", setter: "number", defaultValue: 12 },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#f3f4f6" },
      },
    }),
  },
  {
    component: CountdownTimer,
    manifest: createMaterialManifest({
      componentName: "CountdownTimer",
      materialVersion: "0.1.0",
      title: "倒计时",
      category: "marketing",
      platforms: ["h5"],
      defaultProps: {
        title: "限时秒杀",
        subtitle: "距离活动结束",
        days: "00",
        hours: "12",
        minutes: "30",
        seconds: "00",
        backgroundColor: "#dc2626",
        textColor: "#ffffff",
        numberColor: "#dc2626",
      },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "限时秒杀" },
        subtitle: { label: "说明", type: "string", setter: "input", defaultValue: "距离活动结束" },
        days: { label: "天", type: "string", setter: "input", defaultValue: "00" },
        hours: { label: "时", type: "string", setter: "input", defaultValue: "12" },
        minutes: { label: "分", type: "string", setter: "input", defaultValue: "30" },
        seconds: { label: "秒", type: "string", setter: "input", defaultValue: "00" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#dc2626" },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#ffffff" },
        numberColor: { label: "数字色", type: "string", setter: "color", defaultValue: "#dc2626" },
      },
    }),
  },
  {
    component: NavGrid,
    manifest: createMaterialManifest({
      componentName: "NavGrid",
      materialVersion: "0.1.0",
      title: "导航宫格",
      category: "marketing",
      platforms: ["h5"],
      defaultProps: {
        columns: 4,
        backgroundColor: "#ffffff",
        itemBackgroundColor: "#f8fafc",
        textColor: "#111827",
        radius: 8,
        items: [
          { id: "nav_coupon", title: "领券", subtitle: "新人礼" },
          { id: "nav_flash", title: "秒杀", subtitle: "限时抢" },
          { id: "nav_new", title: "上新", subtitle: "新品" },
          { id: "nav_rank", title: "榜单", subtitle: "热卖" },
        ],
      },
      propsSchema: {
        columns: { label: "列数", type: "number", setter: "number", defaultValue: 4 },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff" },
        itemBackgroundColor: { label: "项背景色", type: "string", setter: "color", defaultValue: "#f8fafc" },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#111827" },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 8 },
        items: { label: "导航项", type: "array", setter: "textarea", defaultValue: [] },
      },
      events: [{ name: "onNavigate", title: "点击导航" }],
    }),
  },
  {
    component: FlashSaleList,
    manifest: createMaterialManifest({
      componentName: "FlashSaleList",
      materialVersion: "0.1.0",
      title: "秒杀商品组",
      category: "commerce",
      platforms: ["h5"],
      defaultProps: {
        title: "限时秒杀",
        subtitle: "爆品限量抢购",
        badgeText: "秒杀中",
        backgroundColor: "#ffffff",
        items: [],
      },
      dataSourceSlots: [{ name: "items", acceptedTypes: ["product.byIds", "product.byActivity"] }],
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "限时秒杀" },
        subtitle: { label: "说明", type: "string", setter: "input", defaultValue: "爆品限量抢购" },
        badgeText: { label: "角标", type: "string", setter: "input", defaultValue: "秒杀中" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff" },
        items: { label: "商品数据", type: "array", setter: "dataSourceSelector", defaultValue: [] },
      },
      events: [{ name: "onProductClick", title: "点击秒杀商品" }],
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
