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
type InputType = "text" | "tel" | "email" | "number";

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

export const MlcInput = defineComponent({
  name: "MlcInput",
  props: {
    value: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    type: { type: String as PropType<InputType>, default: "text" },
    disabled: { type: Boolean, default: false },
    radius: { type: Number, default: h5Tokens.radius.md },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    onChange: { type: Function as PropType<(value: string) => void>, default: undefined },
  },
  setup(props) {
    return () =>
      h("input", {
        class: props.class,
        value: props.value,
        type: props.type,
        placeholder: props.placeholder,
        disabled: props.disabled,
        style: {
          boxSizing: "border-box",
          width: "100%",
          minHeight: `${h5Tokens.touch.minHeight}px`,
          border: `1px solid ${h5Tokens.color.border}`,
          borderRadius: `${props.radius}px`,
          padding: "0 12px",
          color: h5Tokens.color.text,
          background: h5Tokens.color.surface,
          fontSize: `${h5Tokens.fontSize.body}px`,
          outline: "none",
          opacity: props.disabled ? 0.56 : 1,
          ...props.style,
        } satisfies CSSProperties,
        onInput: (event: Event) => props.onChange?.((event.target as HTMLInputElement).value),
      });
  },
});

export const MlcTextarea = defineComponent({
  name: "MlcTextarea",
  props: {
    value: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    rows: { type: Number, default: 3 },
    disabled: { type: Boolean, default: false },
    radius: { type: Number, default: h5Tokens.radius.md },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    onChange: { type: Function as PropType<(value: string) => void>, default: undefined },
  },
  setup(props) {
    return () =>
      h("textarea", {
        class: props.class,
        value: props.value,
        rows: props.rows,
        placeholder: props.placeholder,
        disabled: props.disabled,
        style: {
          boxSizing: "border-box",
          width: "100%",
          minHeight: "86px",
          border: `1px solid ${h5Tokens.color.border}`,
          borderRadius: `${props.radius}px`,
          padding: "11px 12px",
          color: h5Tokens.color.text,
          background: h5Tokens.color.surface,
          fontSize: `${h5Tokens.fontSize.body}px`,
          lineHeight: 1.5,
          resize: "vertical",
          outline: "none",
          opacity: props.disabled ? 0.56 : 1,
          ...props.style,
        } satisfies CSSProperties,
        onInput: (event: Event) => props.onChange?.((event.target as HTMLTextAreaElement).value),
      });
  },
});

export const MlcSwitch = defineComponent({
  name: "MlcSwitch",
  props: {
    checked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    label: { type: String, default: "" },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    onChange: { type: Function as PropType<(checked: boolean) => void>, default: undefined },
  },
  setup(props, { slots }) {
    return () =>
      h(
        "button",
        {
          type: "button",
          role: "switch",
          "aria-checked": props.checked,
          class: props.class,
          disabled: props.disabled,
          style: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            minHeight: `${h5Tokens.touch.minHeight}px`,
            border: 0,
            padding: 0,
            color: h5Tokens.color.text,
            background: "transparent",
            fontSize: `${h5Tokens.fontSize.body}px`,
            textAlign: "left",
            opacity: props.disabled ? 0.56 : 1,
            ...props.style,
          } satisfies CSSProperties,
          onClick: () => props.onChange?.(!props.checked),
        },
        [
          h(
            "span",
            {
              style: {
                position: "relative",
                display: "inline-flex",
                flex: "0 0 auto",
                width: "42px",
                height: "24px",
                borderRadius: `${h5Tokens.radius.pill}px`,
                background: props.checked ? h5Tokens.color.accent : "#cbd5e1",
                transition: "background 0.16s ease",
              } satisfies CSSProperties,
            },
            h("span", {
              style: {
                position: "absolute",
                top: "3px",
                left: props.checked ? "21px" : "3px",
                width: "18px",
                height: "18px",
                borderRadius: `${h5Tokens.radius.pill}px`,
                background: h5Tokens.color.surface,
                boxShadow: "0 1px 4px rgba(15, 23, 42, 0.24)",
                transition: "left 0.16s ease",
              } satisfies CSSProperties,
            }),
          ),
          props.label || slots.default
            ? h("span", { style: { flex: "1 1 auto", lineHeight: 1.45 } }, slots.default?.() ?? props.label)
            : null,
        ],
      );
  },
});

export const MlcStepper = defineComponent({
  name: "MlcStepper",
  props: {
    value: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 99 },
    step: { type: Number, default: 1 },
    disabled: { type: Boolean, default: false },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    onChange: { type: Function as PropType<(value: number) => void>, default: undefined },
  },
  setup(props) {
    return () => {
      const normalizedValue = Math.min(props.max, Math.max(props.min, props.value));
      const update = (nextValue: number) => props.onChange?.(Math.min(props.max, Math.max(props.min, nextValue)));
      const buttonStyle: CSSProperties = {
        width: "34px",
        height: "34px",
        border: `1px solid ${h5Tokens.color.border}`,
        borderRadius: `${h5Tokens.radius.md}px`,
        color: h5Tokens.color.text,
        background: h5Tokens.color.surface,
        fontSize: "18px",
        fontWeight: 800,
      };
      return h(
        "span",
        {
          class: props.class,
          style: {
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            ...props.style,
          } satisfies CSSProperties,
        },
        [
          h("button", { type: "button", disabled: props.disabled || normalizedValue <= props.min, style: buttonStyle, onClick: () => update(normalizedValue - props.step) }, "-"),
          h(
            "strong",
            {
              style: {
                minWidth: "28px",
                color: h5Tokens.color.text,
                fontSize: `${h5Tokens.fontSize.body}px`,
                textAlign: "center",
              } satisfies CSSProperties,
            },
            String(normalizedValue),
          ),
          h("button", { type: "button", disabled: props.disabled || normalizedValue >= props.max, style: buttonStyle, onClick: () => update(normalizedValue + props.step) }, "+"),
        ],
      );
    };
  },
});
