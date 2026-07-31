import { defineComponent, h, type CSSProperties, type PropType } from "vue";

export const h5Tokens = {
  color: {
    text: "#111827",
    mutedText: "#64748b",
    inverseText: "#ffffff",
    surface: "#ffffff",
    weakSurface: "#f3f4f6",
    primary: "#111827",
    accent: "#0f766e",
    danger: "#dc2626",
    border: "#e5e7eb",
  },
  radius: {
    sm: 6,
    md: 8,
    lg: 12,
    pill: 999,
  },
  fontSize: {
    caption: 11,
    body: 13,
    button: 15,
    title: 20,
  },
  touch: {
    minHeight: 44,
  },
} as const;

type Tone = "neutral" | "accent" | "danger" | "inverse";
type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type TextAs = "span" | "p" | "strong" | "h1" | "h2" | "h3";
type ImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";

function toneColor(tone: Tone): string {
  if (tone === "accent") return h5Tokens.color.accent;
  if (tone === "danger") return h5Tokens.color.danger;
  if (tone === "inverse") return h5Tokens.color.inverseText;
  return h5Tokens.color.text;
}

export const MlcButton = defineComponent({
  name: "MlcButton",
  props: {
    type: { type: String as PropType<"button" | "submit" | "reset">, default: "button" },
    variant: { type: String as PropType<ButtonVariant>, default: "solid" },
    tone: { type: String as PropType<Tone>, default: "neutral" },
    size: { type: String as PropType<ButtonSize>, default: "md" },
    block: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    radius: { type: Number, default: h5Tokens.radius.md },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    onClick: { type: Function as PropType<(event: MouseEvent) => void>, default: undefined },
  },
  setup(props, { slots }) {
    return () => {
      const height = props.size === "sm" ? 34 : props.size === "lg" ? 48 : h5Tokens.touch.minHeight;
      const color = toneColor(props.tone);
      const isSolid = props.variant === "solid";
      return h(
        "button",
        {
          type: props.type,
          class: props.class,
          disabled: props.disabled || props.loading,
          style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            width: props.block ? "100%" : undefined,
            minHeight: `${height}px`,
            border: props.variant === "ghost" ? 0 : `1px solid ${isSolid ? color : h5Tokens.color.border}`,
            borderRadius: `${props.radius}px`,
            padding: props.size === "sm" ? "0 12px" : "0 16px",
            color: isSolid ? h5Tokens.color.inverseText : color,
            background: isSolid ? color : "transparent",
            fontSize: `${h5Tokens.fontSize.button}px`,
            fontWeight: 700,
            opacity: props.disabled ? 0.56 : 1,
            ...props.style,
          } satisfies CSSProperties,
          onClick: props.onClick,
        },
        props.loading ? "加载中" : slots.default?.(),
      );
    };
  },
});

export const MlcImage = defineComponent({
  name: "MlcImage",
  props: {
    src: { type: String, default: "" },
    alt: { type: String, default: "" },
    ratio: { type: String, default: "" },
    fit: { type: String as PropType<ImageFit>, default: "cover" },
    radius: { type: Number, default: 0 },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    fallback: { type: String, default: "" },
  },
  setup(props) {
    return () => {
      if (!props.src) return props.fallback ? h("section", { class: "mlc-material mlc-empty-image" }, props.fallback) : null;
      return h("img", {
        class: props.class,
        src: props.src,
        alt: props.alt,
        style: {
          width: "100%",
          display: "block",
          aspectRatio: props.ratio || undefined,
          objectFit: props.fit,
          borderRadius: `${props.radius}px`,
          ...props.style,
        } satisfies CSSProperties,
      });
    };
  },
});

export const MlcTag = defineComponent({
  name: "MlcTag",
  props: {
    tone: { type: String as PropType<Tone>, default: "accent" },
    radius: { type: Number, default: h5Tokens.radius.pill },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
  },
  setup(props, { slots }) {
    return () => {
      const color = toneColor(props.tone);
      return h(
        "span",
        {
          class: props.class,
          style: {
            display: "inline-flex",
            alignItems: "center",
            minHeight: "22px",
            borderRadius: `${props.radius}px`,
            padding: "0 9px",
            color,
            background: props.tone === "accent" ? "rgba(15, 118, 110, 0.1)" : "rgba(17, 24, 39, 0.08)",
            fontSize: "12px",
            fontWeight: 800,
            lineHeight: 1,
            ...props.style,
          } satisfies CSSProperties,
        },
        slots.default?.(),
      );
    };
  },
});

export const MlcText = defineComponent({
  name: "MlcText",
  props: {
    as: { type: String as PropType<TextAs>, default: "span" },
    tone: { type: String as PropType<Tone | "muted">, default: "neutral" },
    size: { type: Number, default: h5Tokens.fontSize.body },
    weight: { type: Number, default: undefined },
    lineHeight: { type: Number, default: 1.5 },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
  },
  setup(props, { slots }) {
    return () => {
      const color = props.tone === "muted" ? h5Tokens.color.mutedText : toneColor(props.tone);
      return h(
        props.as,
        {
          class: props.class,
          style: {
            margin: props.as === "p" ? 0 : undefined,
            color,
            fontSize: `${props.size}px`,
            fontWeight: props.weight,
            lineHeight: props.lineHeight,
            ...props.style,
          } satisfies CSSProperties,
        },
        slots.default?.(),
      );
    };
  },
});

export const MlcPrice = defineComponent({
  name: "MlcPrice",
  props: {
    amountText: { type: String, default: "" },
    prefix: { type: String, default: "" },
    suffix: { type: String, default: "" },
    tone: { type: String as PropType<Tone>, default: "danger" },
    size: { type: Number, default: 18 },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
  },
  setup(props) {
    return () => {
      if (!props.amountText) return null;
      return h(
        "strong",
        {
          class: props.class,
          style: {
            color: toneColor(props.tone),
            fontSize: `${props.size}px`,
            lineHeight: 1,
            ...props.style,
          } satisfies CSSProperties,
        },
        [
          props.prefix,
          props.amountText,
          props.suffix ? h("small", { style: { marginLeft: "2px", fontSize: `${Math.max(11, props.size - 6)}px` } }, props.suffix) : null,
        ],
      );
    };
  },
});
