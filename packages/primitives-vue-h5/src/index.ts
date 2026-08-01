import { defineComponent, h, ref, type CSSProperties, type PropType } from "vue";
import { createLowcodeH5TintColor, getLowcodeH5ToneColor, h5Tokens, type LowcodeH5Tone } from "@meumall/lowcode-design-tokens";

type Tone = LowcodeH5Tone;
type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type TextAs = "span" | "p" | "strong" | "h1" | "h2" | "h3";
type ImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";
type InputType = "text" | "tel" | "email" | "number";
type OverlayPlacement = "center" | "bottom";
type DividerLineStyle = "solid" | "dashed" | "dotted";

export interface MlcSelectOption {
  label?: string;
  value?: string;
  disabled?: boolean;
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
      const color = getLowcodeH5ToneColor(props.tone);
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
      const color = getLowcodeH5ToneColor(props.tone);
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
      const color = props.tone === "muted" ? h5Tokens.color.mutedText : getLowcodeH5ToneColor(props.tone);
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

export const MlcRichText = defineComponent({
  name: "MlcRichText",
  props: {
    html: { type: String, default: "<p>请输入富文本内容</p>" },
    backgroundColor: { type: String, default: "transparent" },
    textColor: { type: String, default: "#1f2937" },
    borderColor: { type: String, default: "transparent" },
    radius: { type: Number, default: 0 },
    padding: { type: Number, default: 16 },
    fontSize: { type: Number, default: h5Tokens.fontSize.body },
    lineHeight: { type: Number, default: 1.7 },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
  },
  setup(props) {
    return () =>
      h("section", {
        class: props.class,
        style: {
          overflow: "hidden",
          overflowWrap: "anywhere",
          padding: `${props.padding}px`,
          border: `1px solid ${props.borderColor}`,
          borderRadius: `${props.radius}px`,
          color: props.textColor,
          background: props.backgroundColor,
          fontSize: `${props.fontSize}px`,
          lineHeight: props.lineHeight,
          ...props.style,
        } satisfies CSSProperties,
        innerHTML: props.html,
      });
  },
});

export const MlcNoticeBar = defineComponent({
  name: "MlcNoticeBar",
  props: {
    label: { type: String, default: "" },
    content: { type: String, default: "" },
    iconText: { type: String, default: "!" },
    showIcon: { type: Boolean, default: true },
    backgroundColor: { type: String, default: "#fffbeb" },
    textColor: { type: String, default: "#92400e" },
    labelBackgroundColor: { type: String, default: "rgba(146, 64, 14, 0.1)" },
    labelColor: { type: String, default: "" },
    borderColor: { type: String, default: "transparent" },
    radius: { type: Number, default: h5Tokens.radius.md },
    paddingY: { type: Number, default: 10 },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
  },
  setup(props) {
    return () => {
      const labelColor = props.labelColor || props.textColor;
      return h(
        "section",
        {
          class: props.class,
          style: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            overflow: "hidden",
            padding: `${props.paddingY}px 14px`,
            border: `1px solid ${props.borderColor}`,
            borderRadius: `${props.radius}px`,
            color: props.textColor,
            background: props.backgroundColor,
            ...props.style,
          } satisfies CSSProperties,
        },
        [
          props.showIcon
            ? h(
                "span",
                {
                  "aria-hidden": "true",
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "0 0 auto",
                    width: "18px",
                    height: "18px",
                    borderRadius: `${h5Tokens.radius.pill}px`,
                    color: labelColor,
                    background: props.labelBackgroundColor,
                    fontSize: "12px",
                    fontWeight: 900,
                    lineHeight: 1,
                  } satisfies CSSProperties,
                },
                props.iconText,
              )
            : null,
          props.label
            ? h(
                MlcTag,
                {
                  radius: h5Tokens.radius.pill,
                  style: {
                    flex: "0 0 auto",
                    minHeight: "22px",
                    color: labelColor,
                    background: props.labelBackgroundColor,
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                  } satisfies CSSProperties,
                },
                () => props.label,
              )
            : null,
          h(
            MlcText,
            {
              size: 13,
              style: {
                minWidth: 0,
                flex: 1,
                color: "inherit",
              } satisfies CSSProperties,
            },
            () => props.content,
          ),
        ],
      );
    };
  },
});

export interface MlcCountdownTextItem {
  label: string;
  value: string;
}

export const MlcCountdownText = defineComponent({
  name: "MlcCountdownText",
  props: {
    items: { type: Array as PropType<MlcCountdownTextItem[]>, default: () => [] },
    days: { type: String, default: "00" },
    hours: { type: String, default: "00" },
    minutes: { type: String, default: "00" },
    seconds: { type: String, default: "00" },
    numberColor: { type: String, default: h5Tokens.color.danger },
    numberBackgroundColor: { type: String, default: h5Tokens.color.surface },
    labelColor: { type: String, default: "inherit" },
    gap: { type: Number, default: 5 },
    minWidth: { type: Number, default: 34 },
    radius: { type: Number, default: h5Tokens.radius.sm },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
  },
  setup(props) {
    return () => {
      const visibleItems = props.items.length
        ? props.items
        : [
            { label: "天", value: props.days },
            { label: "时", value: props.hours },
            { label: "分", value: props.minutes },
            { label: "秒", value: props.seconds },
          ];

      return h(
        "div",
        {
          class: props.class,
          style: {
            display: "flex",
            gap: `${props.gap}px`,
            flex: "0 0 auto",
            ...props.style,
          } satisfies CSSProperties,
        },
        visibleItems.map((item) =>
          h(
            MlcTag,
            {
              radius: 0,
              style: {
                display: "grid",
                gap: "2px",
                minWidth: `${props.minWidth}px`,
                padding: 0,
                color: props.labelColor,
                background: "transparent",
                textAlign: "center",
              } satisfies CSSProperties,
            },
            () => [
              h(
                MlcText,
                {
                  as: "strong",
                  size: 14,
                  weight: 800,
                  style: {
                    padding: "5px 6px",
                    borderRadius: `${props.radius}px`,
                    color: props.numberColor,
                    background: props.numberBackgroundColor,
                  } satisfies CSSProperties,
                },
                () => item.value,
              ),
              h(MlcText, { size: 11, style: { color: props.labelColor, opacity: 0.78 } }, () => item.label),
            ],
          ),
        ),
      );
    };
  },
});

export interface MlcTabsItem {
  id?: string;
  title?: string;
  [key: string]: unknown;
}

export const MlcTabs = defineComponent({
  name: "MlcTabs",
  props: {
    items: { type: Array as PropType<MlcTabsItem[]>, default: () => [] },
    defaultActiveIndex: { type: Number, default: 0 },
    navBackgroundColor: { type: String, default: "#f8fafc" },
    tabBackgroundColor: { type: String, default: h5Tokens.color.surface },
    activeBackgroundColor: { type: String, default: h5Tokens.color.primary },
    textColor: { type: String, default: "#334155" },
    activeTextColor: { type: String, default: h5Tokens.color.inverseText },
    borderColor: { type: String, default: h5Tokens.color.border },
    panelPadding: { type: [String, Number] as PropType<string | number>, default: 14 },
    panelGap: { type: Number, default: 9 },
    class: { type: String, default: "" },
    navClass: { type: String, default: "" },
    panelClass: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    navStyle: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    panelStyle: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    onChange: { type: Function as PropType<(item: MlcTabsItem | undefined, index: number) => void>, default: undefined },
  },
  setup(props, { slots }) {
    const activeIndex = ref(props.defaultActiveIndex);
    const toSize = (value: string | number) => (typeof value === "number" ? `${value}px` : value);

    return () => {
      const normalizedActiveIndex = Math.min(Math.max(activeIndex.value, 0), Math.max(props.items.length - 1, 0));
      const activeItem = props.items[normalizedActiveIndex];

      return h("div", { class: props.class, style: props.style }, [
        h(
          "div",
          {
            role: "tablist",
            class: props.navClass,
            style: {
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              padding: "8px 10px",
              background: props.navBackgroundColor,
              ...props.navStyle,
            } satisfies CSSProperties,
          },
          props.items.map((item, index) => {
            const active = index === normalizedActiveIndex;
            return h(
              MlcButton,
              {
                role: "tab",
                "aria-selected": active,
                size: "sm",
                radius: h5Tokens.radius.pill,
                onClick: () => {
                  activeIndex.value = index;
                  props.onChange?.(item, index);
                },
                style: {
                  flex: "0 0 auto",
                  minHeight: "34px",
                  border: active ? 0 : `1px solid ${props.borderColor}`,
                  color: active ? props.activeTextColor : props.textColor,
                  background: active ? props.activeBackgroundColor : props.tabBackgroundColor,
                  fontSize: "13px",
                } satisfies CSSProperties,
              },
              () => String(item.title ?? `标签 ${index + 1}`),
            );
          }),
        ),
        h(
          "div",
          {
            class: props.panelClass,
            style: {
              display: "grid",
              gap: `${props.panelGap}px`,
              padding: toSize(props.panelPadding),
              ...props.panelStyle,
            } satisfies CSSProperties,
          },
          slots.default?.({ item: activeItem, index: normalizedActiveIndex }),
        ),
      ]);
    };
  },
});

export const MlcSpacer = defineComponent({
  name: "MlcSpacer",
  props: {
    height: { type: [String, Number] as PropType<string | number>, default: 12 },
    backgroundColor: { type: String, default: "transparent" },
    radius: { type: [String, Number] as PropType<string | number>, default: 0 },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
  },
  setup(props) {
    const toSize = (value: string | number) => (typeof value === "number" ? `${value}px` : value);
    return () =>
      h("div", {
        class: props.class,
        style: {
          height: toSize(props.height),
          background: props.backgroundColor,
          borderRadius: toSize(props.radius),
          ...props.style,
        } satisfies CSSProperties,
      });
  },
});

export const MlcDivider = defineComponent({
  name: "MlcDivider",
  props: {
    color: { type: String, default: h5Tokens.color.border },
    thickness: { type: Number, default: 1 },
    lineStyle: { type: String as PropType<DividerLineStyle>, default: "solid" },
    inset: { type: Number, default: 0 },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
  },
  setup(props) {
    return () =>
      h("div", {
        class: props.class,
        "aria-hidden": "true",
        style: {
          height: 0,
          margin: `0 ${props.inset}px`,
          border: 0,
          borderTop: `${props.thickness}px ${props.lineStyle} ${props.color}`,
          ...props.style,
        } satisfies CSSProperties,
      });
  },
});

export const MlcOverlay = defineComponent({
  name: "MlcOverlay",
  props: {
    open: { type: Boolean, default: true },
    placement: { type: String as PropType<OverlayPlacement>, default: "center" },
    zIndex: { type: Number, default: 1000 },
    backgroundColor: { type: String, default: "rgba(15, 23, 42, 0.42)" },
    padding: { type: [String, Number] as PropType<string | number>, default: "20px 12px" },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    onBackdropClick: { type: Function as PropType<(event: MouseEvent) => void>, default: undefined },
  },
  setup(props, { slots }) {
    return () => {
      if (!props.open) return null;
      return h(
        "div",
        {
          class: props.class,
          style: {
            position: "fixed",
            inset: 0,
            zIndex: props.zIndex,
            display: "grid",
            placeItems: props.placement === "bottom" ? "end center" : "center",
            padding: typeof props.padding === "number" ? `${props.padding}px` : props.padding,
            background: props.backgroundColor,
            ...props.style,
          } satisfies CSSProperties,
          onClick: (event: MouseEvent) => {
            if (event.currentTarget === event.target) props.onBackdropClick?.(event);
          },
        },
        slots.default?.(),
      );
    };
  },
});

export const MlcModal = defineComponent({
  name: "MlcModal",
  props: {
    open: { type: Boolean, default: true },
    title: { type: String, default: "" },
    ariaLabel: { type: String, default: "" },
    closeLabel: { type: String, default: "关闭弹窗" },
    placement: { type: String as PropType<OverlayPlacement>, default: "bottom" },
    closeOnBackdrop: { type: Boolean, default: false },
    maxWidth: { type: [String, Number] as PropType<string | number>, default: 420 },
    maxHeight: { type: [String, Number] as PropType<string | number>, default: "72vh" },
    radius: { type: [String, Number] as PropType<string | number>, default: "16px 16px 12px 12px" },
    zIndex: { type: Number, default: 1000 },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    bodyStyle: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    onClose: { type: Function as PropType<() => void>, default: undefined },
  },
  setup(props, { slots }) {
    const toSize = (value: string | number) => (typeof value === "number" ? `${value}px` : value);
    return () =>
      h(
        MlcOverlay,
        {
          open: props.open,
          placement: props.placement,
          zIndex: props.zIndex,
          onBackdropClick: props.closeOnBackdrop ? props.onClose : undefined,
        },
        () =>
          h(
            "div",
            {
              role: "dialog",
              "aria-modal": "true",
              "aria-label": props.ariaLabel || props.title || undefined,
              class: props.class,
              style: {
                width: "100%",
                maxWidth: toSize(props.maxWidth),
                maxHeight: toSize(props.maxHeight),
                overflow: "auto",
                borderRadius: toSize(props.radius),
                background: h5Tokens.color.surface,
                boxShadow: "0 18px 48px rgba(15, 23, 42, 0.24)",
                ...props.style,
              } satisfies CSSProperties,
            },
            [
              props.title || props.onClose
                ? h(
                    "div",
                    {
                      style: {
                        position: "sticky",
                        top: 0,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px 16px 10px",
                        background: h5Tokens.color.surface,
                      } satisfies CSSProperties,
                    },
                    [
                      props.title
                        ? h(MlcText, { as: "strong", size: 17, weight: 800, style: { color: h5Tokens.color.text } }, () => props.title)
                        : h("span"),
                      props.onClose
                        ? h(
                            MlcButton,
                            {
                              "aria-label": props.closeLabel,
                              size: "sm",
                              radius: h5Tokens.radius.pill,
                              onClick: props.onClose,
                              style: {
                                width: "32px",
                                height: "32px",
                                minHeight: "32px",
                                border: 0,
                                padding: 0,
                                color: "#475569",
                                background: "#f1f5f9",
                                fontSize: "18px",
                              } satisfies CSSProperties,
                            },
                            () => "×",
                          )
                        : null,
                    ],
                  )
                : null,
              h("div", { style: props.bodyStyle }, slots.default?.()),
              slots.footer ? h("div", slots.footer()) : null,
            ],
          ),
      );
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
            color: getLowcodeH5ToneColor(props.tone),
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

export const MlcSelect = defineComponent({
  name: "MlcSelect",
  props: {
    value: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    options: { type: Array as PropType<MlcSelectOption[]>, default: () => [] },
    radius: { type: Number, default: h5Tokens.radius.md },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    onChange: { type: Function as PropType<(value: string) => void>, default: undefined },
  },
  setup(props) {
    return () =>
      h(
        "select",
        {
          class: props.class,
          value: props.value,
          disabled: props.disabled,
          style: {
            boxSizing: "border-box",
            width: "100%",
            minHeight: `${h5Tokens.touch.minHeight}px`,
            border: `1px solid ${h5Tokens.color.border}`,
            borderRadius: `${props.radius}px`,
            padding: "0 34px 0 12px",
            color: h5Tokens.color.text,
            background: h5Tokens.color.surface,
            fontSize: `${h5Tokens.fontSize.body}px`,
            outline: "none",
            opacity: props.disabled ? 0.56 : 1,
            ...props.style,
          } satisfies CSSProperties,
          onChange: (event: Event) => props.onChange?.((event.target as HTMLSelectElement).value),
        },
        [
          props.placeholder ? h("option", { value: "", disabled: true }, props.placeholder) : null,
          ...props.options.map((item, index) => {
            const optionValue = item.value ?? "";
            return h("option", { key: `${optionValue}-${index}`, value: optionValue, disabled: Boolean(item.disabled) }, item.label ?? optionValue);
          }),
        ],
      );
  },
});

export const MlcRadioGroup = defineComponent({
  name: "MlcRadioGroup",
  props: {
    value: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    options: { type: Array as PropType<MlcSelectOption[]>, default: () => [] },
    activeColor: { type: String, default: h5Tokens.color.accent },
    borderColor: { type: String, default: h5Tokens.color.border },
    textColor: { type: String, default: h5Tokens.color.text },
    backgroundColor: { type: String, default: h5Tokens.color.surface },
    radius: { type: Number, default: h5Tokens.radius.md },
    class: { type: String, default: "" },
    style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    onChange: { type: Function as PropType<(value: string) => void>, default: undefined },
  },
  setup(props) {
    return () =>
      h(
        "div",
        {
          role: "radiogroup",
          class: props.class,
          style: {
            display: "grid",
            gap: "8px",
            opacity: props.disabled ? 0.56 : 1,
            ...props.style,
          } satisfies CSSProperties,
        },
        props.options.map((item, index) => {
          const optionValue = item.value ?? "";
          const selected = optionValue === props.value;
          const optionDisabled = props.disabled || Boolean(item.disabled);

          return h(
            "button",
            {
              key: `${optionValue}-${index}`,
              type: "button",
              role: "radio",
              "aria-checked": selected,
              disabled: optionDisabled,
              style: {
                display: "flex",
                alignItems: "center",
                gap: "9px",
                width: "100%",
                minHeight: `${h5Tokens.touch.minHeight}px`,
                border: `1px solid ${selected ? props.activeColor : props.borderColor}`,
                borderRadius: `${props.radius}px`,
                padding: "0 12px",
                color: selected ? props.activeColor : props.textColor,
                background: selected ? createLowcodeH5TintColor(props.activeColor, 0.08) : props.backgroundColor,
                fontSize: `${h5Tokens.fontSize.body}px`,
                fontWeight: selected ? 800 : 600,
                textAlign: "left",
                opacity: optionDisabled ? 0.56 : 1,
              } satisfies CSSProperties,
              onClick: () => {
                if (!optionDisabled) props.onChange?.(optionValue);
              },
            },
            [
              h(
                "span",
                {
                  "aria-hidden": "true",
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "0 0 auto",
                    width: "18px",
                    height: "18px",
                    border: `1px solid ${selected ? props.activeColor : props.borderColor}`,
                    borderRadius: `${h5Tokens.radius.pill}px`,
                    color: h5Tokens.color.inverseText,
                    background: selected ? props.activeColor : h5Tokens.color.surface,
                    fontSize: "10px",
                    lineHeight: 1,
                  } satisfies CSSProperties,
                },
                selected ? "●" : "",
              ),
              h("span", item.label ?? optionValue),
            ],
          );
        }),
      );
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
    activeColor: { type: String, default: h5Tokens.color.accent },
    inactiveColor: { type: String, default: "#cbd5e1" },
    thumbColor: { type: String, default: h5Tokens.color.surface },
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
                background: props.checked ? props.activeColor : props.inactiveColor,
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
                background: props.thumbColor,
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

export const MlcCheckbox = defineComponent({
  name: "MlcCheckbox",
  props: {
    checked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    checkedColor: { type: String, default: h5Tokens.color.accent },
    borderColor: { type: String, default: h5Tokens.color.border },
    markColor: { type: String, default: h5Tokens.color.inverseText },
    radius: { type: Number, default: h5Tokens.radius.sm },
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
          role: "checkbox",
          "aria-checked": props.checked,
          class: props.class,
          disabled: props.disabled,
          style: {
            display: "flex",
            alignItems: "flex-start",
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
              "aria-hidden": "true",
              style: {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
                width: "22px",
                height: "22px",
                marginTop: "1px",
                border: `1px solid ${props.checked ? props.checkedColor : props.borderColor}`,
                borderRadius: `${props.radius}px`,
                color: props.markColor,
                background: props.checked ? props.checkedColor : h5Tokens.color.surface,
                fontSize: "15px",
                fontWeight: 900,
                lineHeight: 1,
                transition: "background 0.16s ease, border-color 0.16s ease",
              } satisfies CSSProperties,
            },
            props.checked ? "✓" : "",
          ),
          slots.default ? h("span", { style: { flex: "1 1 auto", lineHeight: 1.45 } }, slots.default()) : null,
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
    accentColor: { type: String, default: h5Tokens.color.accent },
    borderColor: { type: String, default: h5Tokens.color.border },
    textColor: { type: String, default: h5Tokens.color.text },
    buttonBackgroundColor: { type: String, default: h5Tokens.color.surface },
    radius: { type: Number, default: h5Tokens.radius.md },
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
        border: `1px solid ${props.borderColor}`,
        borderRadius: `${props.radius}px`,
        color: props.textColor,
        background: props.buttonBackgroundColor,
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
                color: props.accentColor,
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
