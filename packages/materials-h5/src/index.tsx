import React from "react";
import type { LowcodeMaterial } from "@meumall/lowcode-core";
import { createMaterialManifest, type LowcodeNode } from "@meumall/lowcode-schema";

type MaterialProps = {
  props: Record<string, unknown>;
  node: LowcodeNode;
  children?: React.ReactNode;
};

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function number(value: unknown, fallback: number): number {
  return typeof value === "number" ? value : fallback;
}

export function ActivityHero({ props, children }: MaterialProps) {
  const imageUrl = text(props.imageUrl);
  return (
    <section style={{ padding: "18px 16px", background: text(props.backgroundColor, "#fff") }}>
      {imageUrl ? (
        <img src={imageUrl} alt="" style={{ width: "100%", display: "block", borderRadius: 8 }} />
      ) : null}
      <h1
        style={{
          margin: "14px 0 6px",
          fontSize: number(props.titleSize, 24),
          lineHeight: 1.2,
          color: text(props.titleColor, "#111827"),
        }}
      >
        {text(props.title, "活动标题")}
      </h1>
      <p style={{ margin: 0, color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>{text(props.subtitle)}</p>
      {children}
    </section>
  );
}

export function ImageBanner({ props }: MaterialProps) {
  const imageUrl = text(props.imageUrl);
  if (!imageUrl) return null;
  return (
    <img
      src={imageUrl}
      alt={text(props.alt)}
      style={{ width: "100%", display: "block", borderRadius: number(props.radius, 0) }}
    />
  );
}

export function RichTextBlock({ props }: MaterialProps) {
  return (
    <section
      style={{ padding: 16 }}
      dangerouslySetInnerHTML={{ __html: text(props.html, "<p>请输入富文本内容</p>") }}
    />
  );
}

export function ProductList({ props }: MaterialProps) {
  const items = Array.isArray(props.items) ? props.items : [];
  return (
    <section style={{ padding: 12 }}>
      {items.map((item, index) => {
        const product = item as Record<string, unknown>;
        return (
          <div
            key={String(product.id ?? index)}
            style={{
              display: "flex",
              gap: 12,
              padding: "12px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            {typeof product.imageUrl === "string" ? (
              <img src={product.imageUrl} alt="" style={{ width: 88, height: 88, objectFit: "cover" }} />
            ) : null}
            <div>
              <div style={{ fontWeight: 600 }}>{String(product.title ?? "商品名称")}</div>
              <div style={{ color: "#e5484d", marginTop: 8 }}>{String(product.priceText ?? "")}</div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export function CouponSection({ props }: MaterialProps) {
  const title = text(props.title, "优惠券");
  return (
    <section style={{ padding: 16, background: text(props.backgroundColor, "#fff7ed") }}>
      <h2 style={{ margin: "0 0 12px", fontSize: 18 }}>{title}</h2>
      <button
        type="button"
        style={{
          width: "100%",
          height: 44,
          border: 0,
          borderRadius: 8,
          color: "#ffffff",
          background: text(props.buttonColor, "#111827"),
          fontWeight: 700,
        }}
      >
        {text(props.buttonText, "领取优惠券")}
      </button>
    </section>
  );
}

export function SectionContainer({ props, children }: MaterialProps) {
  const title = text(props.title);
  const subtitle = text(props.subtitle);
  return (
    <section
      style={{
        margin: "10px 0",
        padding: number(props.padding, 12),
        background: text(props.backgroundColor, "#ffffff"),
        borderRadius: number(props.radius, 10),
      }}
    >
      {title ? <h2 style={{ margin: "0 0 6px", color: "#111827", fontSize: 18 }}>{title}</h2> : null}
      {subtitle ? (
        <p style={{ margin: "0 0 12px", color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>{subtitle}</p>
      ) : null}
      {children ? (
        <div>{children}</div>
      ) : (
        <div
          style={{
            padding: 14,
            border: "1px dashed #cbd5e1",
            borderRadius: 8,
            color: "#64748b",
            background: "#f8fafc",
            textAlign: "center",
          }}
        >
          向容器中添加物料
        </div>
      )}
    </section>
  );
}

export function ActionButton({ props }: MaterialProps) {
  const linkUrl = text(props.linkUrl);
  return (
    <section
      style={{
        padding: `${number(props.paddingY, 12)}px 16px`,
        background: text(props.wrapperBackgroundColor, "#f3f4f6"),
      }}
    >
      <button
        type="button"
        onClick={() => {
          const handler = props.onClick;
          if (typeof handler === "function") handler();
          if (linkUrl) window.location.href = linkUrl;
        }}
        style={{
          width: "100%",
          minHeight: 44,
          border: 0,
          borderRadius: number(props.radius, 8),
          color: text(props.textColor, "#ffffff"),
          background: text(props.backgroundColor, "#111827"),
          fontWeight: 700,
          fontSize: 15,
        }}
      >
        {text(props.text, "立即参与")}
      </button>
    </section>
  );
}

export function NoticeBar({ props }: MaterialProps) {
  return (
    <section
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        color: text(props.textColor, "#92400e"),
        background: text(props.backgroundColor, "#fffbeb"),
        fontSize: 13,
        lineHeight: 1.5,
      }}
    >
      <strong style={{ flex: "0 0 auto", fontSize: 12 }}>{text(props.label, "公告")}</strong>
      <span style={{ minWidth: 0, flex: 1 }}>{text(props.content, "活动期间下单即享限时优惠。")}</span>
    </section>
  );
}

export function SpacerBlock({ props }: MaterialProps) {
  return (
    <div
      style={{
        height: number(props.height, 12),
        background: text(props.backgroundColor, "#f3f4f6"),
      }}
    />
  );
}

export const h5Materials: LowcodeMaterial<React.ComponentType<MaterialProps>>[] = [
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
      defaultProps: { items: [] },
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
    component: RichTextBlock,
    manifest: createMaterialManifest({
      componentName: "RichTextBlock",
      materialVersion: "0.1.0",
      title: "富文本",
      category: "content",
      platforms: ["h5"],
      defaultProps: { html: "<p>请输入富文本内容</p>" },
      propsSchema: {
        html: { label: "内容", type: "string", setter: "richText", defaultValue: "<p>请输入富文本内容</p>" },
      },
    }),
  },
];
