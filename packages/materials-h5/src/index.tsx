import React from "react";
import type { LowcodeMaterial } from "@meumall/lowcode-core";
import { createMaterialManifest, type JsonObject, type LowcodeNode } from "@meumall/lowcode-schema";

type MaterialProps = {
  props: JsonObject;
  node: LowcodeNode;
  children?: React.ReactNode;
};

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function ActivityHero({ props, children }: MaterialProps) {
  const imageUrl = text(props.imageUrl);
  return (
    <section style={{ padding: 16, background: text(props.backgroundColor, "#fff") }}>
      {imageUrl ? <img src={imageUrl} alt="" style={{ width: "100%", display: "block" }} /> : null}
      <h1 style={{ margin: "12px 0 4px", fontSize: 24 }}>{text(props.title, "活动标题")}</h1>
      <p style={{ margin: 0, color: "#666" }}>{text(props.subtitle)}</p>
      {children}
    </section>
  );
}

export function ImageBanner({ props }: MaterialProps) {
  const imageUrl = text(props.imageUrl);
  if (!imageUrl) return null;
  return <img src={imageUrl} alt={text(props.alt)} style={{ width: "100%", display: "block" }} />;
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
    <section style={{ padding: 16, background: "#fff7ed" }}>
      <h2 style={{ margin: "0 0 12px", fontSize: 18 }}>{title}</h2>
      <button type="button" style={{ width: "100%", height: 44 }}>
        {text(props.buttonText, "领取优惠券")}
      </button>
    </section>
  );
}

export const h5Materials: LowcodeMaterial<React.ComponentType<MaterialProps>>[] = [
  {
    component: ActivityHero,
    manifest: createMaterialManifest({
      componentName: "ActivityHero",
      materialVersion: "0.1.0",
      title: "活动头图",
      category: "marketing",
      platforms: ["h5"],
      defaultProps: {
        title: "活动标题",
        subtitle: "",
        imageUrl: "",
        backgroundColor: "#ffffff",
      },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", required: true, defaultValue: "活动标题" },
        subtitle: { label: "副标题", type: "string", setter: "input", defaultValue: "" },
        imageUrl: { label: "图片", type: "string", setter: "image", defaultValue: "" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff" },
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
      defaultProps: { imageUrl: "", alt: "" },
      propsSchema: {
        imageUrl: { label: "图片", type: "string", setter: "image", required: true, defaultValue: "" },
        alt: { label: "替代文本", type: "string", setter: "input", defaultValue: "" },
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
      defaultProps: { title: "优惠券", buttonText: "领取优惠券" },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "优惠券" },
        buttonText: { label: "按钮文案", type: "string", setter: "input", defaultValue: "领取优惠券" },
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
      defaultProps: { html: "<p>请输入富文本内容</p>" },
      propsSchema: {
        html: { label: "内容", type: "string", setter: "richText", defaultValue: "<p>请输入富文本内容</p>" },
      },
    }),
  },
];

