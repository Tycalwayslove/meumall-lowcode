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

function list(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function ruleList(value: unknown): Array<Record<string, unknown> | string> {
  return Array.isArray(value) ? (value as Array<Record<string, unknown> | string>) : [];
}

function findAnchorTarget(targetId: string): Element | null {
  if (!targetId || typeof document === "undefined") return null;
  const idTarget = document.getElementById(targetId);
  if (idTarget) return idTarget;
  return Array.from(document.querySelectorAll("[data-lowcode-node-id]")).find(
    (element) => element.getAttribute("data-lowcode-node-id") === targetId,
  ) ?? null;
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
  const onProductClick = props.onProductClick;
  return (
    <section style={{ padding: 12 }}>
      {items.map((item, index) => {
        const product = item as Record<string, unknown>;
        return (
          <button
            type="button"
            key={String(product.id ?? index)}
            onClick={() => {
              if (typeof onProductClick === "function") onProductClick(product);
            }}
            style={{
              display: "flex",
              gap: 12,
              width: "100%",
              border: 0,
              padding: "12px 0",
              borderBottom: "1px solid #eee",
              background: "transparent",
              textAlign: "left",
            }}
          >
            {typeof product.imageUrl === "string" ? (
              <img src={product.imageUrl} alt="" style={{ width: 88, height: 88, objectFit: "cover" }} />
            ) : null}
            <div>
              <div style={{ fontWeight: 600 }}>{String(product.title ?? "商品名称")}</div>
              <div style={{ color: "#e5484d", marginTop: 8 }}>{String(product.priceText ?? "")}</div>
            </div>
          </button>
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
        onClick={() => {
          const handler = props.onReceive;
          if (typeof handler === "function") handler();
        }}
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

export function ActivityRuleModal({ props }: MaterialProps) {
  const [open, setOpen] = React.useState(false);
  const rules = ruleList(props.rules);

  const openModal = () => {
    const handler = props.onOpen;
    if (typeof handler === "function") handler();
    setOpen(true);
  };

  return (
    <section
      style={{
        padding: "12px 16px",
        color: text(props.textColor, "#374151"),
        background: text(props.backgroundColor, "#ffffff"),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <strong style={{ display: "block", color: "#111827", fontSize: 15 }}>
            {text(props.title, "活动规则")}
          </strong>
          <span style={{ display: "block", marginTop: 4, color: "#6b7280", fontSize: 12, lineHeight: 1.5 }}>
            {text(props.summary, "查看活动参与条件、优惠说明和有效时间。")}
          </span>
        </div>
        <button
          type="button"
          onClick={openModal}
          style={{
            flex: "0 0 auto",
            minHeight: 34,
            border: 0,
            borderRadius: 999,
            padding: "0 14px",
            color: "#ffffff",
            background: text(props.primaryColor, "#111827"),
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {text(props.buttonText, "查看规则")}
        </button>
      </div>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={text(props.modalTitle, "活动规则")}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "grid",
            placeItems: "end center",
            padding: "20px 12px",
            background: "rgba(15, 23, 42, 0.42)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              maxHeight: "72vh",
              overflow: "auto",
              borderRadius: "16px 16px 12px 12px",
              background: "#ffffff",
              boxShadow: "0 18px 48px rgba(15, 23, 42, 0.24)",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                padding: "16px 16px 10px",
                background: "#ffffff",
              }}
            >
              <strong style={{ color: "#111827", fontSize: 17 }}>{text(props.modalTitle, "活动规则")}</strong>
              <button
                type="button"
                aria-label="关闭规则弹窗"
                onClick={() => setOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  border: 0,
                  borderRadius: 999,
                  color: "#475569",
                  background: "#f1f5f9",
                  fontSize: 18,
                }}
              >
                ×
              </button>
            </div>
            <ol style={{ display: "grid", gap: 10, margin: 0, padding: "0 18px 18px 36px" }}>
              {(rules.length ? rules : ["活动规则以页面展示和结算结果为准。"]).map((rule, index) => {
                const title = typeof rule === "string" ? rule : text(rule.title, `规则 ${index + 1}`);
                const content = typeof rule === "string" ? "" : text(rule.content);
                return (
                  <li key={`${title}-${index}`} style={{ color: "#374151", lineHeight: 1.65, fontSize: 14 }}>
                    <strong style={{ color: "#111827" }}>{title}</strong>
                    {content ? <span style={{ display: "block", marginTop: 2 }}>{content}</span> : null}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      ) : null}
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

export function CountdownTimer({ props }: MaterialProps) {
  const boxes = [
    { label: "天", value: text(props.days, "00") },
    { label: "时", value: text(props.hours, "12") },
    { label: "分", value: text(props.minutes, "30") },
    { label: "秒", value: text(props.seconds, "00") },
  ];
  return (
    <section
      style={{
        padding: "12px 16px",
        color: text(props.textColor, "#ffffff"),
        background: text(props.backgroundColor, "#dc2626"),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <strong style={{ display: "block", fontSize: 15 }}>{text(props.title, "限时秒杀")}</strong>
          <span style={{ display: "block", marginTop: 3, opacity: 0.86, fontSize: 12 }}>{text(props.subtitle, "距离活动结束")}</span>
        </div>
        <div style={{ display: "flex", gap: 5, flex: "0 0 auto" }}>
          {boxes.map((box) => (
            <span key={box.label} style={{ display: "grid", gap: 2, minWidth: 34, textAlign: "center" }}>
              <strong
                style={{
                  padding: "5px 6px",
                  borderRadius: 6,
                  color: text(props.numberColor, "#dc2626"),
                  background: "#ffffff",
                  fontSize: 14,
                }}
              >
                {box.value}
              </strong>
              <small style={{ color: "inherit", opacity: 0.78 }}>{box.label}</small>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NavGrid({ props }: MaterialProps) {
  const items = list(props.items);
  const columns = Math.max(2, Math.min(5, number(props.columns, 4)));
  const onNavigate = props.onNavigate;
  return (
    <section style={{ padding: "12px 14px", background: text(props.backgroundColor, "#ffffff") }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: 10 }}>
        {items.map((item, index) => {
          const linkUrl = text(item.linkUrl);
          return (
            <button
              key={String(item.id ?? index)}
              type="button"
              onClick={() => {
                if (typeof onNavigate === "function") onNavigate(item);
                if (linkUrl) window.location.href = linkUrl;
              }}
              style={{
                display: "grid",
                gap: 5,
                placeItems: "center",
                minHeight: 68,
                border: 0,
                borderRadius: number(props.radius, 8),
                color: text(props.textColor, "#111827"),
                background: text(item.backgroundColor, text(props.itemBackgroundColor, "#f8fafc")),
                textAlign: "center",
              }}
            >
              <strong style={{ fontSize: 14 }}>{String(item.title ?? `导航 ${index + 1}`)}</strong>
              {item.subtitle ? <span style={{ color: "#64748b", fontSize: 11 }}>{String(item.subtitle)}</span> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function FloorAnchorNav({ props }: MaterialProps) {
  const items = list(props.items);
  const sticky = props.sticky !== false;
  const offsetTop = number(props.offsetTop, 0);
  const onAnchorClick = props.onAnchorClick;

  const scrollToTarget = (item: Record<string, unknown>) => {
    const targetId = text(item.targetId, text(item.id));
    if (typeof onAnchorClick === "function") onAnchorClick(item);
    const target = findAnchorTarget(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: props.smooth === false ? "auto" : "smooth",
        block: "start",
      });
      return;
    }
    const linkUrl = text(item.linkUrl);
    if (linkUrl) window.location.href = linkUrl;
  };

  return (
    <section
      style={{
        position: sticky ? "sticky" : "relative",
        top: sticky ? offsetTop : "auto",
        zIndex: sticky ? 20 : "auto",
        padding: "10px 12px",
        background: text(props.backgroundColor, "#ffffff"),
        boxShadow: sticky ? "0 8px 18px rgba(15, 23, 42, 0.06)" : "none",
      }}
    >
      {text(props.title) ? (
        <strong style={{ display: "block", marginBottom: 8, color: text(props.textColor, "#111827"), fontSize: 14 }}>
          {text(props.title)}
        </strong>
      ) : null}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {(items.length ? items : [{ id: "anchor_1", title: "楼层", targetId: "" }]).map((item, index) => (
          <button
            key={String(item.id ?? index)}
            type="button"
            onClick={() => scrollToTarget(item)}
            style={{
              flex: "0 0 auto",
              minHeight: 34,
              border: 0,
              borderRadius: number(props.radius, 999),
              padding: "0 14px",
              color: text(props.textColor, "#111827"),
              background: text(item.backgroundColor, text(props.itemBackgroundColor, "#f3f4f6")),
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {String(item.title ?? `楼层 ${index + 1}`)}
          </button>
        ))}
      </div>
    </section>
  );
}

export function FlashSaleList({ props }: MaterialProps) {
  const items = list(props.items);
  const onProductClick = props.onProductClick;
  return (
    <section style={{ padding: "14px 12px", background: text(props.backgroundColor, "#ffffff") }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
        <div>
          <strong style={{ display: "block", color: "#111827", fontSize: 17 }}>{text(props.title, "限时秒杀")}</strong>
          <span style={{ display: "block", marginTop: 3, color: "#64748b", fontSize: 12 }}>{text(props.subtitle, "爆品限量抢购")}</span>
        </div>
        <span style={{ alignSelf: "start", color: "#dc2626", fontSize: 12, fontWeight: 700 }}>{text(props.badgeText, "秒杀中")}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
        {items.map((item, index) => (
          <button
            key={String(item.id ?? index)}
            type="button"
            onClick={() => {
              if (typeof onProductClick === "function") onProductClick(item);
            }}
            style={{
              overflow: "hidden",
              border: "1px solid #eef0f3",
              borderRadius: 10,
              padding: 0,
              background: "#ffffff",
              textAlign: "left",
            }}
          >
            {typeof item.imageUrl === "string" ? (
              <img src={item.imageUrl} alt="" style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }} />
            ) : null}
            <span style={{ display: "grid", gap: 5, padding: 9 }}>
              <strong style={{ color: "#111827", fontSize: 13, lineHeight: 1.35 }}>{String(item.title ?? "秒杀商品")}</strong>
              <span style={{ color: "#dc2626", fontWeight: 800 }}>{String(item.priceText ?? "")}</span>
              <span style={{ color: "#94a3b8", fontSize: 11, textDecoration: "line-through" }}>{String(item.originPriceText ?? "")}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
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
    component: ActivityRuleModal,
    manifest: createMaterialManifest({
      componentName: "ActivityRuleModal",
      materialVersion: "0.1.0",
      title: "活动规则弹窗",
      category: "content",
      platforms: ["h5"],
      defaultProps: {
        title: "活动规则",
        summary: "查看活动参与条件、优惠说明和有效时间。",
        buttonText: "查看规则",
        modalTitle: "活动规则",
        primaryColor: "#111827",
        backgroundColor: "#ffffff",
        textColor: "#374151",
        rules: [
          { title: "活动时间", content: "以页面展示时间为准，逾期自动失效。" },
          { title: "参与条件", content: "同一用户仅可享受一次指定活动优惠。" },
          { title: "优惠说明", content: "优惠不可叠加，最终以结算页展示为准。" },
        ],
      },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "活动规则" },
        summary: { label: "摘要", type: "string", setter: "textarea", defaultValue: "查看活动参与条件、优惠说明和有效时间。" },
        buttonText: { label: "按钮文案", type: "string", setter: "input", defaultValue: "查看规则" },
        modalTitle: { label: "弹窗标题", type: "string", setter: "input", defaultValue: "活动规则" },
        primaryColor: { label: "强调色", type: "string", setter: "color", defaultValue: "#111827" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff" },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#374151" },
        rules: { label: "规则列表", type: "array", setter: "textarea", defaultValue: [] },
      },
      events: [{ name: "onOpen", title: "打开规则" }],
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
    component: FloorAnchorNav,
    manifest: createMaterialManifest({
      componentName: "FloorAnchorNav",
      materialVersion: "0.1.0",
      title: "楼层锚点",
      category: "marketing",
      platforms: ["h5"],
      defaultProps: {
        title: "",
        sticky: true,
        smooth: true,
        offsetTop: 0,
        radius: 999,
        backgroundColor: "#ffffff",
        itemBackgroundColor: "#f3f4f6",
        textColor: "#111827",
        items: [
          { id: "anchor_coupon", title: "领券", targetId: "summer_coupon" },
          { id: "anchor_flash", title: "秒杀", targetId: "summer_flash_sale" },
          { id: "anchor_pick", title: "精选", targetId: "summer_container" },
        ],
      },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "" },
        sticky: { label: "吸顶", type: "boolean", setter: "switch", defaultValue: true },
        smooth: { label: "平滑滚动", type: "boolean", setter: "switch", defaultValue: true },
        offsetTop: { label: "顶部偏移", type: "number", setter: "number", defaultValue: 0 },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 999 },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff" },
        itemBackgroundColor: { label: "项背景色", type: "string", setter: "color", defaultValue: "#f3f4f6" },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#111827" },
        items: { label: "锚点项", type: "array", setter: "textarea", defaultValue: [] },
      },
      events: [{ name: "onAnchorClick", title: "点击锚点" }],
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
      defaultProps: { html: "<p>请输入富文本内容</p>" },
      propsSchema: {
        html: { label: "内容", type: "string", setter: "richText", defaultValue: "<p>请输入富文本内容</p>" },
      },
    }),
  },
];
