import { defineComponent, h, ref, watch, type CSSProperties, type PropType } from "vue";
import type { LowcodeMaterial } from "@meumall/lowcode-core";
import { createMaterialManifest, type LowcodeNode } from "@meumall/lowcode-schema";
import type { VueH5MaterialComponent } from "@meumall/lowcode-renderer-vue-h5";
import { MlcButton, MlcCountdownText, MlcDivider, MlcImage, MlcInput, MlcModal, MlcPrice, MlcSpacer, MlcStepper, MlcSwitch, MlcTabs, MlcTag, MlcText, MlcTextarea } from "./primitives/index.js";

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

function boolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function option<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? value as T : fallback;
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
      return h(MlcImage, {
        class: "mlc-material mlc-image-banner",
        src: imageUrl,
        alt: text(runtimeProps.alt),
        radius: number(runtimeProps.radius, 0),
        fallback: "请配置图片",
      });
    };
  },
});

type BasicButtonVariant = "solid" | "outline" | "ghost";
type BasicButtonSize = "sm" | "md" | "lg";
type BasicInputType = "text" | "tel" | "email" | "number";
type BasicTextAs = "span" | "p" | "strong" | "h1" | "h2" | "h3";
type BasicTextAlign = "left" | "center" | "right";
type DividerLineStyle = "solid" | "dashed" | "dotted";
type BasicImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";
type BasicTagTone = "neutral" | "accent" | "danger" | "inverse";
type BasicInlineAlign = "left" | "center" | "right";

const BASIC_BUTTON_VARIANT_OPTIONS = [
  { label: "实心", value: "solid" },
  { label: "描边", value: "outline" },
  { label: "幽灵", value: "ghost" },
];

const BASIC_BUTTON_SIZE_OPTIONS = [
  { label: "小", value: "sm" },
  { label: "中", value: "md" },
  { label: "大", value: "lg" },
];

const BASIC_INPUT_TYPE_OPTIONS = [
  { label: "文本", value: "text" },
  { label: "手机号", value: "tel" },
  { label: "邮箱", value: "email" },
  { label: "数字", value: "number" },
];

const BASIC_TEXT_AS_OPTIONS = [
  { label: "行内文本", value: "span" },
  { label: "段落", value: "p" },
  { label: "强调", value: "strong" },
  { label: "一级标题", value: "h1" },
  { label: "二级标题", value: "h2" },
  { label: "三级标题", value: "h3" },
];

const INLINE_ALIGN_OPTIONS = [
  { label: "左对齐", value: "left" },
  { label: "居中", value: "center" },
  { label: "右对齐", value: "right" },
];

const DIVIDER_LINE_STYLE_OPTIONS = [
  { label: "实线", value: "solid" },
  { label: "虚线", value: "dashed" },
  { label: "点线", value: "dotted" },
];

const BASIC_IMAGE_FIT_OPTIONS = [
  { label: "裁剪填充", value: "cover" },
  { label: "完整包含", value: "contain" },
  { label: "拉伸填满", value: "fill" },
  { label: "原始尺寸", value: "none" },
  { label: "等比缩小", value: "scale-down" },
];

const BASIC_TAG_TONE_OPTIONS = [
  { label: "默认", value: "neutral" },
  { label: "强调", value: "accent" },
  { label: "危险", value: "danger" },
  { label: "反白", value: "inverse" },
];

const NUMBER_PIXEL_SIZE_META = { min: 0, max: 80, step: 1, unit: "px" };
const NUMBER_RADIUS_META = { min: 0, max: 48, step: 1, unit: "px" };
const NUMBER_PILL_RADIUS_META = { min: 0, max: 999, step: 1, unit: "px" };
const NUMBER_BORDER_WIDTH_META = { min: 0, max: 8, step: 1, unit: "px" };
const NUMBER_FONT_SIZE_META = { min: 10, max: 48, step: 1, unit: "px" };
const NUMBER_FONT_WEIGHT_META = { min: 100, max: 900, step: 100 };
const NUMBER_LINE_HEIGHT_META = { min: 1, max: 2.5, step: 0.1, unit: "倍" };
const NUMBER_COLUMNS_1_TO_3_META = { min: 1, max: 3, step: 1 };
const COLOR_SWATCHES_META = {
  swatches: [
    "#111827",
    "#ffffff",
    "#64748b",
    "#e5e7eb",
    "#f3f4f6",
    "#0f766e",
    "#2563eb",
    "#dc2626",
    "#ea580c",
    "#fef2f2",
    "#fff7ed",
    "#f0fdfa",
    "transparent",
  ],
};

export const BasicButton = defineComponent({
  name: "BasicButton",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const variant = option<BasicButtonVariant>(runtimeProps.variant, ["solid", "outline", "ghost"], "solid");
      const size = option<BasicButtonSize>(runtimeProps.size, ["sm", "md", "lg"], "md");
      const backgroundColor = text(runtimeProps.backgroundColor, "#111827");
      const borderColor = text(runtimeProps.borderColor, backgroundColor);
      const textColor = text(runtimeProps.textColor, variant === "solid" ? "#ffffff" : backgroundColor);
      const handler = runtimeProps.onClick;

      return h(
        "section",
        {
          class: "mlc-material mlc-basic-button",
          style: {
            padding: `${number(runtimeProps.paddingY, 12)}px 16px`,
            background: text(runtimeProps.wrapperBackgroundColor, "transparent"),
          } satisfies CSSProperties,
        },
        [
          h(
            MlcButton,
            {
              block: boolean(runtimeProps.block, true),
              variant,
              size,
              radius: number(runtimeProps.radius, 8),
              disabled: boolean(runtimeProps.disabled),
              loading: boolean(runtimeProps.loading),
              style: {
                borderColor,
                color: textColor,
                background: variant === "solid" ? backgroundColor : "transparent",
              } satisfies CSSProperties,
              onClick: () => {
                if (typeof handler === "function") handler();
              },
            },
            () => text(runtimeProps.text, "基础按钮"),
          ),
        ],
      );
    };
  },
});

export const BasicInput = defineComponent({
  name: "BasicInput",
  props: materialPropOptions,
  setup(props) {
    const value = ref(text(props.props?.defaultValue));
    watch(
      () => props.props?.defaultValue,
      (nextValue) => {
        value.value = text(nextValue);
      },
    );

    return () => {
      const runtimeProps = props.props ?? {};
      const inputType = option<BasicInputType>(runtimeProps.type, ["text", "tel", "email", "number"], "text");
      const label = text(runtimeProps.label, "基础输入框");
      const helperText = text(runtimeProps.helperText);
      const handler = runtimeProps.onChange;

      return h(
        "section",
        {
          class: "mlc-material mlc-basic-input",
          style: {
            display: "grid",
            gap: "8px",
            padding: `${number(runtimeProps.paddingY, 12)}px 16px`,
            color: text(runtimeProps.textColor, "#111827"),
            background: text(runtimeProps.wrapperBackgroundColor, "transparent"),
          } satisfies CSSProperties,
        },
        [
          label
            ? h(
                MlcText,
                {
                  as: "strong",
                  size: 13,
                  weight: 800,
                  style: { color: text(runtimeProps.labelColor, "#111827") } satisfies CSSProperties,
                },
                () => label,
              )
            : null,
          h(MlcInput, {
            value: value.value,
            type: inputType,
            placeholder: text(runtimeProps.placeholder, "请输入内容"),
            disabled: boolean(runtimeProps.disabled),
            radius: number(runtimeProps.radius, 8),
            style: {
              borderColor: text(runtimeProps.borderColor, "#e5e7eb"),
              color: text(runtimeProps.textColor, "#111827"),
              background: text(runtimeProps.inputBackgroundColor, "#ffffff"),
            } satisfies CSSProperties,
            onChange: (nextValue: string) => {
              value.value = nextValue;
              if (typeof handler === "function") handler(nextValue);
            },
          }),
          helperText
            ? h(
                MlcText,
                {
                  as: "p",
                  size: 12,
                  tone: "muted",
                  style: { color: text(runtimeProps.helperColor, "#64748b") } satisfies CSSProperties,
                },
                () => helperText,
              )
            : null,
        ],
      );
    };
  },
});

export const BasicText = defineComponent({
  name: "BasicText",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const as = option<BasicTextAs>(runtimeProps.as, ["span", "p", "strong", "h1", "h2", "h3"], "p");
      const align = option<BasicTextAlign>(runtimeProps.align, ["left", "center", "right"], "left");
      const content = text(runtimeProps.text, "基础文本");
      const color = text(runtimeProps.color, "#111827");

      return h(
        "section",
        {
          class: "mlc-material mlc-basic-text",
          style: {
            padding: `${number(runtimeProps.paddingY, 10)}px 16px`,
            color,
            background: text(runtimeProps.backgroundColor, "transparent"),
            textAlign: align,
          } satisfies CSSProperties,
        },
        [
          h(
            MlcText,
            {
              as,
              size: number(runtimeProps.fontSize, 14),
              weight: number(runtimeProps.fontWeight, 400),
              lineHeight: number(runtimeProps.lineHeight, 1.6),
              style: {
                display: as === "span" || as === "strong" ? "inline" : "block",
                color,
                whiteSpace: "pre-line",
              } satisfies CSSProperties,
            },
            () => content,
          ),
        ],
      );
    };
  },
});

export const DividerBlock = defineComponent({
  name: "DividerBlock",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const lineStyle = option<DividerLineStyle>(runtimeProps.lineStyle, ["solid", "dashed", "dotted"], "solid");

      return h(
        "section",
        {
          class: "mlc-material mlc-divider-block",
          style: {
            padding: `${number(runtimeProps.paddingY, 12)}px 0`,
            background: text(runtimeProps.backgroundColor, "transparent"),
          } satisfies CSSProperties,
        },
        [
          h(MlcDivider, {
            color: text(runtimeProps.color, "#e5e7eb"),
            thickness: number(runtimeProps.thickness, 1),
            lineStyle,
            inset: number(runtimeProps.inset, 16),
          }),
        ],
      );
    };
  },
});

export const BasicImage = defineComponent({
  name: "BasicImage",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const imageUrl = text(runtimeProps.imageUrl);
      const fit = option<BasicImageFit>(runtimeProps.fit, ["cover", "contain", "fill", "none", "scale-down"], "cover");
      const radius = number(runtimeProps.radius, 8);

      return h(
        "section",
        {
          class: "mlc-material mlc-basic-image",
          style: {
            padding: `${number(runtimeProps.paddingY, 12)}px 16px`,
            background: text(runtimeProps.backgroundColor, "transparent"),
          } satisfies CSSProperties,
        },
        [
          h(MlcImage, {
            src: imageUrl,
            alt: text(runtimeProps.alt),
            ratio: text(runtimeProps.ratio, "16 / 9"),
            fit,
            radius,
            fallback: "请配置图片",
          }),
        ],
      );
    };
  },
});

export const BasicTag = defineComponent({
  name: "BasicTag",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const tone = option<BasicTagTone>(runtimeProps.tone, ["neutral", "accent", "danger", "inverse"], "accent");
      const align = option<BasicInlineAlign>(runtimeProps.align, ["left", "center", "right"], "left");

      return h(
        "section",
        {
          class: "mlc-material mlc-basic-tag",
          style: {
            padding: `${number(runtimeProps.paddingY, 10)}px 16px`,
            background: text(runtimeProps.wrapperBackgroundColor, "transparent"),
            textAlign: align,
          } satisfies CSSProperties,
        },
        [
          h(
            MlcTag,
            {
              tone,
              radius: number(runtimeProps.radius, 999),
              style: {
                color: text(runtimeProps.textColor, "#0f766e"),
                background: text(runtimeProps.backgroundColor, "rgba(15, 118, 110, 0.1)"),
                fontSize: `${number(runtimeProps.fontSize, 12)}px`,
                fontWeight: number(runtimeProps.fontWeight, 800),
              } satisfies CSSProperties,
            },
            () => text(runtimeProps.text, "基础标签"),
          ),
        ],
      );
    };
  },
});

export const BasicCard = defineComponent({
  name: "BasicCard",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const imageUrl = text(runtimeProps.imageUrl);
      const fit = option<BasicImageFit>(runtimeProps.fit, ["cover", "contain", "fill", "none", "scale-down"], "cover");
      const badgeText = text(runtimeProps.badgeText);
      const description = text(runtimeProps.description);
      const buttonText = text(runtimeProps.buttonText);
      const accentColor = text(runtimeProps.accentColor, "#0f766e");
      const radius = number(runtimeProps.radius, 12);
      const borderWidth = number(runtimeProps.borderWidth, 1);
      const handler = runtimeProps.onClick;

      return h(
        "section",
        {
          class: "mlc-material mlc-basic-card",
          style: {
            padding: `${number(runtimeProps.paddingY, 12)}px 16px`,
            background: text(runtimeProps.wrapperBackgroundColor, "transparent"),
          } satisfies CSSProperties,
        },
        [
          h(
            "article",
            {
              class: "mlc-basic-card__inner",
              style: {
                overflow: "hidden",
                color: text(runtimeProps.textColor, "#64748b"),
                background: text(runtimeProps.cardBackgroundColor, "#ffffff"),
                border: borderWidth > 0 ? `${borderWidth}px solid ${text(runtimeProps.borderColor, "#e5e7eb")}` : undefined,
                borderRadius: `${radius}px`,
                boxShadow: boolean(runtimeProps.shadow) ? "0 10px 24px rgba(15, 23, 42, 0.08)" : undefined,
              } satisfies CSSProperties,
            },
            [
              imageUrl
                ? h(MlcImage, {
                    src: imageUrl,
                    alt: text(runtimeProps.alt),
                    ratio: text(runtimeProps.ratio, "16 / 9"),
                    fit,
                    radius: 0,
                  })
                : null,
              h(
                "div",
                {
                  style: {
                    display: "grid",
                    gap: "8px",
                    padding: `${number(runtimeProps.contentPadding, 12)}px`,
                  } satisfies CSSProperties,
                },
                [
                  badgeText
                    ? h(
                        MlcTag,
                        {
                          radius: 999,
                          style: {
                            width: "fit-content",
                            color: accentColor,
                            background: text(runtimeProps.badgeBackgroundColor, "rgba(15, 118, 110, 0.1)"),
                          } satisfies CSSProperties,
                        },
                        () => badgeText,
                      )
                    : null,
                  h(
                    MlcText,
                    {
                      as: "strong",
                      size: number(runtimeProps.titleSize, 16),
                      weight: 800,
                      lineHeight: 1.35,
                      style: { color: text(runtimeProps.titleColor, "#111827") } satisfies CSSProperties,
                    },
                    () => text(runtimeProps.title, "基础图文卡片"),
                  ),
                  description
                    ? h(
                        MlcText,
                        {
                          as: "p",
                          size: 13,
                          tone: "muted",
                          lineHeight: 1.55,
                          style: { color: text(runtimeProps.textColor, "#64748b") } satisfies CSSProperties,
                        },
                        () => description,
                      )
                    : null,
                  buttonText && boolean(runtimeProps.showButton, true)
                    ? h(
                        MlcButton,
                        {
                          size: "sm",
                          radius: number(runtimeProps.buttonRadius, 999),
                          style: {
                            width: "fit-content",
                            borderColor: accentColor,
                            color: text(runtimeProps.buttonTextColor, "#ffffff"),
                            background: accentColor,
                          } satisfies CSSProperties,
                          onClick: () => {
                            if (typeof handler === "function") handler();
                          },
                        },
                        () => buttonText,
                      )
                    : null,
                ],
              ),
            ],
          ),
        ],
      );
    };
  },
});

export const SectionTitle = defineComponent({
  name: "SectionTitle",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const alignValue = text(runtimeProps.align, "left");
      const align = alignValue === "center" || alignValue === "right" ? alignValue : "left";
      const markerText = text(runtimeProps.markerText);
      return h(
        "section",
        {
          class: "mlc-material mlc-section-title",
          style: {
            padding: `${number(runtimeProps.paddingY, 18)}px 16px 10px`,
            color: text(runtimeProps.titleColor, "#111827"),
            background: text(runtimeProps.backgroundColor, "#f3f4f6"),
            textAlign: align,
          } satisfies CSSProperties,
        },
        [
          markerText
            ? h(
                MlcTag,
                {
                  style: {
                    marginBottom: "8px",
                    color: text(runtimeProps.accentColor, "#0f766e"),
                  } satisfies CSSProperties,
                },
                () => markerText,
              )
            : null,
          h(
            MlcText,
            {
              as: "h2",
              size: number(runtimeProps.titleSize, 20),
              weight: 900,
              lineHeight: 1.25,
              style: {
                margin: 0,
                color: text(runtimeProps.titleColor, "#111827"),
              } satisfies CSSProperties,
            },
            () => text(runtimeProps.title, "区块标题"),
          ),
          text(runtimeProps.subtitle)
            ? h(
                MlcText,
                {
                  as: "p",
                  tone: "muted",
                  style: {
                    margin: "7px 0 0",
                    color: text(runtimeProps.textColor, "#64748b"),
                    lineHeight: 1.6,
                  },
                },
                () => text(runtimeProps.subtitle),
              )
            : null,
        ],
      );
    };
  },
});

export const ImageCardGrid = defineComponent({
  name: "ImageCardGrid",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const cards = list(runtimeProps.items);
      const columns = Math.max(1, Math.min(3, Math.round(number(runtimeProps.columns, 2))));
      const onItemClick = runtimeProps.onItemClick;
      const visibleCards = cards.length
        ? cards
        : [
            {
              id: "women",
              title: "女装会场",
              subtitle: "夏日通勤穿搭",
              badgeText: "热推",
              imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80",
            },
            {
              id: "shoes",
              title: "鞋包会场",
              subtitle: "轻盈出行装备",
              badgeText: "新品",
              imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80",
            },
          ];
      return h(
        "section",
        {
          class: "mlc-material mlc-image-card-grid",
          style: {
            padding: "14px 12px 16px",
            color: text(runtimeProps.titleColor, "#111827"),
            background: text(runtimeProps.backgroundColor, "#f3f4f6"),
          } satisfies CSSProperties,
        },
        [
          text(runtimeProps.title)
            ? h("div", { style: { marginBottom: "10px" } }, [
                h("strong", { style: { display: "block", fontSize: "18px", lineHeight: 1.25 } }, text(runtimeProps.title)),
                text(runtimeProps.subtitle)
                  ? h(
                      "span",
                      {
                        style: {
                          display: "block",
                          marginTop: "4px",
                          color: text(runtimeProps.textColor, "#64748b"),
                          fontSize: "12px",
                          lineHeight: 1.5,
                        },
                      },
                      text(runtimeProps.subtitle),
                    )
                  : null,
              ])
            : null,
          h(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap: `${number(runtimeProps.gap, 10)}px`,
              },
            },
            visibleCards.map((card, index) => {
              const imageUrl = text(card.imageUrl);
              const badgeText = text(card.badgeText);
              return h(
                "button",
                {
                  type: "button",
                  key: String(card.id ?? index),
                  onClick: () => {
                    if (typeof onItemClick === "function") onItemClick(card);
                  },
                  style: {
                    position: "relative",
                    overflow: "hidden",
                    minHeight: "132px",
                    border: 0,
                    borderRadius: `${number(runtimeProps.radius, 10)}px`,
                    padding: 0,
                    color: "#ffffff",
                    background: text(runtimeProps.cardBackgroundColor, "#111827"),
                    textAlign: "left",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.1)",
                  } satisfies CSSProperties,
                },
                [
                  imageUrl
                    ? h("img", {
                        src: imageUrl,
                        alt: "",
                        style: {
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        } satisfies CSSProperties,
                      })
                    : null,
                  h("span", {
                    style: {
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.72))",
                    } satisfies CSSProperties,
                  }),
                  badgeText
                    ? h(
                        "span",
                        {
                          style: {
                            position: "absolute",
                            top: "8px",
                            left: "8px",
                            borderRadius: "999px",
                            padding: "3px 7px",
                            color: "#ffffff",
                            background: text(runtimeProps.accentColor, "#ef4444"),
                            fontSize: "11px",
                            fontWeight: 800,
                            lineHeight: 1,
                          } satisfies CSSProperties,
                        },
                        badgeText,
                      )
                    : null,
                  h("span", { style: { position: "absolute", right: "10px", bottom: "10px", left: "10px" } }, [
                    h("strong", { style: { display: "block", fontSize: "15px", lineHeight: 1.25 } }, text(card.title, "卡片标题")),
                    text(card.subtitle)
                      ? h(
                          "small",
                          {
                            style: {
                              display: "block",
                              marginTop: "4px",
                              color: "rgba(255, 255, 255, 0.82)",
                              fontSize: "12px",
                              lineHeight: 1.35,
                            },
                          },
                          text(card.subtitle),
                        )
                      : null,
                  ]),
                ],
              );
            }),
          ),
        ],
      );
    };
  },
});

export const TabsBlock = defineComponent({
  name: "TabsBlock",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const items = list(runtimeProps.items);
      const visibleItems = items.length
        ? items
        : [
            {
              id: "tab_1",
              title: "活动亮点",
              subtitle: "本期主推",
              badgeText: "Hot",
              content: "用 Tab 把活动亮点、参与方式和常见问题放在同一区块，减少页面长度。",
            },
            {
              id: "tab_2",
              title: "参与方式",
              subtitle: "三步完成",
              badgeText: "",
              content: "选择会场、领取权益、下单完成转化。后续可替换为更完整的配置内容。",
            },
          ];
      return h(
        "section",
        {
          class: "mlc-material mlc-tabs-block",
          style: {
            padding: `${number(runtimeProps.paddingY, 14)}px 12px`,
            background: text(runtimeProps.backgroundColor, "#f3f4f6"),
          } satisfies CSSProperties,
        },
        [
          h(
            "div",
            {
              style: {
                overflow: "hidden",
                border: `1px solid ${text(runtimeProps.borderColor, "#e5e7eb")}`,
                borderRadius: `${number(runtimeProps.radius, 12)}px`,
                background: text(runtimeProps.cardBackgroundColor, "#ffffff"),
                boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
              } satisfies CSSProperties,
            },
            [
              text(runtimeProps.title) || text(runtimeProps.subtitle)
                ? h("div", { style: { padding: "13px 14px 8px" } }, [
                    text(runtimeProps.title)
                      ? h(
                          MlcText,
                          { as: "strong", size: 17, weight: 800, style: { display: "block", color: text(runtimeProps.titleColor, "#111827") } },
                          () => text(runtimeProps.title),
                        )
                      : null,
                    text(runtimeProps.subtitle)
                      ? h(
                          MlcText,
                          { size: 12, tone: "muted", style: { display: "block", marginTop: "4px", color: text(runtimeProps.textColor, "#64748b") } },
                          () => text(runtimeProps.subtitle),
                        )
                      : null,
                  ])
                : null,
              h(
                MlcTabs,
                {
                  items: visibleItems,
                  navBackgroundColor: text(runtimeProps.navBackgroundColor, "#f8fafc"),
                  tabBackgroundColor: text(runtimeProps.tabBackgroundColor, "#ffffff"),
                  activeBackgroundColor: text(runtimeProps.accentColor, "#111827"),
                  textColor: text(runtimeProps.textColor, "#334155"),
                  activeTextColor: text(runtimeProps.activeTextColor, "#ffffff"),
                  borderColor: text(runtimeProps.borderColor, "#e5e7eb"),
                },
                {
                  default: ({ item: activeItem }: { item: Record<string, unknown> | undefined; index: number }) => [
                    activeItem?.badgeText
                      ? h(MlcTag, { style: { width: "fit-content", color: text(runtimeProps.accentColor, "#0f766e") } }, () => String(activeItem.badgeText))
                      : null,
                    h(
                      MlcText,
                      { as: "strong", size: 16, weight: 800, style: { display: "block", color: text(runtimeProps.titleColor, "#111827") } },
                      () => String(activeItem?.title ?? "标签内容"),
                    ),
                    activeItem?.subtitle
                      ? h(
                          MlcText,
                          { size: 12, tone: "muted", style: { display: "block", marginTop: "-5px", color: text(runtimeProps.textColor, "#64748b") } },
                          () => String(activeItem.subtitle),
                        )
                      : null,
                    h(
                      MlcText,
                      { as: "p", size: 13, style: { color: text(runtimeProps.contentColor, "#374151"), lineHeight: 1.65 } },
                      () => String(activeItem?.content ?? "请配置标签内容。"),
                    ),
                  ],
                },
              ),
            ],
          ),
        ],
      );
    };
  },
});

export const LeadFormBlock = defineComponent({
  name: "LeadFormBlock",
  props: materialPropOptions,
  setup(props) {
    const nameValue = ref("");
    const phoneValue = ref("");
    const noteValue = ref("");
    const submitted = ref(false);
    const runtimeProps = () => props.props ?? {};
    const minQuantity = () => Math.max(1, number(runtimeProps().quantityMin, 1));
    const maxQuantity = () => Math.max(minQuantity(), number(runtimeProps().quantityMax, 9));
    const quantityValue = ref(1);
    const agreed = ref(false);

    return () => {
      const currentProps = runtimeProps();
      const currentMinQuantity = minQuantity();
      const currentMaxQuantity = maxQuantity();
      if (quantityValue.value < currentMinQuantity || quantityValue.value > currentMaxQuantity) {
        quantityValue.value = Math.min(currentMaxQuantity, Math.max(currentMinQuantity, number(currentProps.quantityDefault, 1)));
      }
      if (currentProps.showAgreement === false && !agreed.value) agreed.value = true;
      const showName = currentProps.showName !== false;
      const showPhone = currentProps.showPhone !== false;
      const showNote = currentProps.showNote !== false;
      const showQuantity = currentProps.showQuantity !== false;
      const showAgreement = currentProps.showAgreement !== false;
      const submitDisabled = showAgreement && !agreed.value;
      const accentColor = text(currentProps.accentColor, "#0f766e");
      const onSubmit = currentProps.onSubmit;

      return h(
        "section",
        {
          class: "mlc-material mlc-lead-form-block",
          style: {
            padding: `${number(currentProps.paddingY, 16)}px 12px`,
            background: text(currentProps.backgroundColor, "#f3f4f6"),
          } satisfies CSSProperties,
        },
        h(
          "form",
          {
            style: {
              display: "grid",
              gap: "12px",
              borderRadius: `${number(currentProps.radius, 14)}px`,
              padding: "14px",
              color: text(currentProps.titleColor, "#111827"),
              background: text(currentProps.cardColor, "#ffffff"),
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
            } satisfies CSSProperties,
            onSubmit: (event: Event) => {
              event.preventDefault();
              if (submitDisabled) return;
              const payload = {
                name: nameValue.value,
                phone: phoneValue.value,
                note: noteValue.value,
                quantity: quantityValue.value,
                agreed: agreed.value,
              };
              submitted.value = true;
              if (typeof onSubmit === "function") onSubmit(payload);
            },
          },
          [
            h("div", { style: { display: "grid", gap: "5px" } }, [
              h(MlcText, { as: "strong", size: 18, weight: 900, style: { color: text(currentProps.titleColor, "#111827") } }, () => text(currentProps.title, "活动预约表单")),
              h(MlcText, { as: "p", tone: "muted", style: { color: text(currentProps.textColor, "#64748b") } }, () => text(currentProps.description, "留下联系方式，运营可在后续接入真实提交服务。")),
            ]),
            showName
              ? h("label", { style: { display: "grid", gap: "6px" } }, [
                  h(MlcText, { as: "span", size: 12, weight: 800, style: { color: text(currentProps.textColor, "#64748b") } }, () => text(currentProps.nameLabel, "姓名")),
                  h(MlcInput, { value: nameValue.value, placeholder: text(currentProps.namePlaceholder, "请输入姓名"), onChange: (value: string) => (nameValue.value = value) }),
                ])
              : null,
            showPhone
              ? h("label", { style: { display: "grid", gap: "6px" } }, [
                  h(MlcText, { as: "span", size: 12, weight: 800, style: { color: text(currentProps.textColor, "#64748b") } }, () => text(currentProps.phoneLabel, "手机号")),
                  h(MlcInput, { value: phoneValue.value, type: "tel", placeholder: text(currentProps.phonePlaceholder, "请输入手机号"), onChange: (value: string) => (phoneValue.value = value) }),
                ])
              : null,
            showQuantity
              ? h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" } }, [
                  h(MlcText, { as: "span", size: 13, weight: 800, style: { color: text(currentProps.textColor, "#64748b") } }, () => text(currentProps.quantityLabel, "预约人数")),
                  h(MlcStepper, { value: quantityValue.value, min: currentMinQuantity, max: currentMaxQuantity, onChange: (value: number) => (quantityValue.value = value) }),
                ])
              : null,
            showNote
              ? h("label", { style: { display: "grid", gap: "6px" } }, [
                  h(MlcText, { as: "span", size: 12, weight: 800, style: { color: text(currentProps.textColor, "#64748b") } }, () => text(currentProps.noteLabel, "备注")),
                  h(MlcTextarea, { value: noteValue.value, placeholder: text(currentProps.notePlaceholder, "可填写偏好、尺码或到店时间"), onChange: (value: string) => (noteValue.value = value) }),
                ])
              : null,
            showAgreement
              ? h(MlcSwitch, {
                  checked: agreed.value,
                  onChange: (value: boolean) => (agreed.value = value),
                }, () => text(currentProps.agreementText, "我已阅读并同意活动规则"))
              : null,
            h(
              MlcButton,
              {
                type: "submit",
                block: true,
                disabled: submitDisabled,
                style: {
                  background: accentColor,
                  borderColor: accentColor,
                  color: text(currentProps.buttonTextColor, "#ffffff"),
                } satisfies CSSProperties,
              },
              () => text(currentProps.submitText, "提交预约"),
            ),
            submitted.value
              ? h(MlcText, { as: "p", size: 12, tone: "accent", style: { color: accentColor, textAlign: "center" } }, () => text(currentProps.successText, "已提交，本地示例不会保存真实数据。"))
              : null,
          ],
        ),
      );
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

export const ProductRankList = defineComponent({
  name: "ProductRankList",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const items = list(runtimeProps.items);
      const visibleItems = items.length
        ? items
        : [
            {
              id: "rank_1",
              title: "轻盈通勤手提包",
              priceText: "¥199",
              desc: "活动热度 98",
              imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=300&q=80",
            },
            {
              id: "rank_2",
              title: "夏季舒适凉鞋",
              priceText: "¥129",
              desc: "近 24 小时热卖",
              imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80",
            },
            {
              id: "rank_3",
              title: "防晒轻薄外套",
              priceText: "¥259",
              desc: "达人推荐",
              imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=300&q=80",
            },
          ];

      return h(
        "section",
        {
          class: "mlc-material mlc-product-rank-list",
          style: {
            padding: "14px 12px",
            background: text(runtimeProps.backgroundColor, "#ffffff"),
          },
        },
        [
          h("div", { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px", marginBottom: "10px" } }, [
            h("div", { style: { minWidth: 0 } }, [
              h(
                MlcText,
                { as: "strong", size: 17, weight: 800, style: { display: "block", color: text(runtimeProps.titleColor, "#111827") } },
                () => text(runtimeProps.title, "商品榜单"),
              ),
              h(MlcText, { size: 12, tone: "muted", style: { display: "block", marginTop: "3px" } }, () =>
                text(runtimeProps.subtitle, "按活动热度整理，帮助用户快速选爆品。"),
              ),
            ]),
            h(
              MlcTag,
              { style: { flex: "0 0 auto", color: text(runtimeProps.accentColor, "#ef4444"), background: text(runtimeProps.rankBackgroundColor, "#fff1f2") } },
              () => text(runtimeProps.badgeText, "热卖榜"),
            ),
          ]),
          h(
            "div",
            { style: { display: "grid", gap: "8px" } },
            visibleItems.slice(0, number(runtimeProps.limit, 5)).map((item, index) =>
              h(
                MlcButton,
                {
                  onClick: () => {
                    const handler = runtimeProps.onProductClick;
                    if (typeof handler === "function") handler(item);
                  },
                  style: {
                    display: "grid",
                    gridTemplateColumns: "34px 64px minmax(0, 1fr) auto",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    minHeight: "84px",
                    border: "1px solid #eef0f3",
                    borderRadius: "10px",
                    padding: "9px",
                    color: "#111827",
                    background: "#ffffff",
                    textAlign: "left",
                  } satisfies CSSProperties,
                },
                () => [
                  h(
                    MlcTag,
                    {
                      radius: 9,
                      style: {
                        width: "30px",
                        height: "30px",
                        justifyContent: "center",
                        color: text(runtimeProps.accentColor, "#ef4444"),
                        background: text(runtimeProps.rankBackgroundColor, "#fff1f2"),
                        fontSize: "14px",
                        fontWeight: 900,
                      } satisfies CSSProperties,
                    },
                    () => String(index + 1),
                  ),
                  typeof item.imageUrl === "string"
                    ? h(MlcImage, {
                        src: item.imageUrl,
                        alt: "",
                        radius: 8,
                        style: {
                          width: "64px",
                          height: "64px",
                          background: "#f3f4f6",
                        },
                      })
                    : h("span", { style: { width: "64px", height: "64px", borderRadius: "8px", background: "#f3f4f6" } }),
                  h("span", { style: { minWidth: 0 } }, [
                    h(
                      MlcText,
                      {
                        as: "strong",
                        size: 14,
                        weight: 800,
                        style: {
                          display: "block",
                          overflow: "hidden",
                          color: "#111827",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        } satisfies CSSProperties,
                      },
                      () => String(item.title ?? `榜单商品 ${index + 1}`),
                    ),
                    h(
                      MlcPrice,
                      { amountText: String(item.priceText ?? ""), size: 14, style: { display: "block", marginTop: "6px", color: text(runtimeProps.accentColor, "#ef4444") } },
                    ),
                    h(
                      MlcText,
                      { size: 11, tone: "muted", style: { display: "block", marginTop: "4px", color: "#94a3b8" } },
                      () => String(item.rankText ?? item.desc ?? "活动热卖"),
                    ),
                  ]),
                  h(
                    MlcText,
                    { size: 12, weight: 700, tone: "muted", style: { color: "#9ca3af" } },
                    () => String(item.buttonText ?? text(runtimeProps.buttonText, "去看看")),
                  ),
                ],
              ),
            ),
          ),
        ],
      );
    };
  },
});

export const BrandFeatureSection = defineComponent({
  name: "BrandFeatureSection",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const coverImageUrl = text(runtimeProps.coverImageUrl);
      const logoImageUrl = text(runtimeProps.logoImageUrl);
      const linkUrl = text(runtimeProps.linkUrl);
      const items = list(runtimeProps.items);
      const sellingPoints = ruleList(runtimeProps.sellingPoints);
      const visibleItems = items.length
        ? items
        : [
            {
              id: "brand_sku_1",
              title: "轻盈通勤手提包",
              priceText: "¥199",
              imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=300&q=80",
            },
            {
              id: "brand_sku_2",
              title: "夏季舒适凉鞋",
              priceText: "¥129",
              imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80",
            },
          ];
      const visibleSellingPoints = sellingPoints.length
        ? sellingPoints
        : [
            { id: "point_1", title: "会员专享", desc: "品牌券叠加平台补贴" },
            { id: "point_2", title: "当季新品", desc: "通勤、度假和日常穿搭一次配齐" },
          ];
      const handleEnter = () => {
        const handler = runtimeProps.onEnter;
        if (typeof handler === "function") handler();
        if (linkUrl && typeof window !== "undefined") window.location.href = linkUrl;
      };

      return h(
        "section",
        {
          class: "mlc-material mlc-brand-feature-section",
          style: {
            padding: "14px 12px",
            background: text(runtimeProps.backgroundColor, "#f8fafc"),
          },
        },
        [
          h(
            "div",
            {
              style: {
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                background: text(runtimeProps.cardBackgroundColor, "#ffffff"),
              } satisfies CSSProperties,
            },
            [
              coverImageUrl
                ? h(MlcImage, {
                    src: coverImageUrl,
                    alt: "",
                    style: {
                      width: "100%",
                      height: "132px",
                    },
                  })
                : null,
              h("div", { style: { display: "grid", gap: "12px", padding: "12px" } }, [
                h("div", { style: { display: "grid", gridTemplateColumns: "52px minmax(0, 1fr) auto", alignItems: "center", gap: "10px" } }, [
                  logoImageUrl
                    ? h(MlcImage, {
                        src: logoImageUrl,
                        alt: "",
                        radius: 12,
                        style: {
                          width: "52px",
                          height: "52px",
                          background: "#f3f4f6",
                        },
                      })
                    : h(
                        MlcTag,
                        {
                          radius: 12,
                          style: {
                            display: "grid",
                            placeItems: "center",
                            width: "52px",
                            height: "52px",
                            color: "#ffffff",
                            background: text(runtimeProps.accentColor, "#111827"),
                            fontWeight: 900,
                          } satisfies CSSProperties,
                        },
                        () => text(runtimeProps.brandName, "M").slice(0, 1),
                      ),
                  h("span", { style: { minWidth: 0 } }, [
                    h(
                      MlcText,
                      { size: 11, weight: 800, style: { display: "block", color: text(runtimeProps.accentColor, "#111827") } },
                      () => text(runtimeProps.badgeText, "品牌专题"),
                    ),
                    h(
                      MlcText,
                      { as: "strong", size: 17, weight: 800, style: { display: "block", marginTop: "4px", color: text(runtimeProps.titleColor, "#111827") } },
                      () => text(runtimeProps.title, "夏日品牌馆"),
                    ),
                    h(
                      MlcText,
                      { size: 12, tone: "muted", style: { display: "block", marginTop: "4px" } },
                      () => text(runtimeProps.brandName, "MeuMall Select"),
                    ),
                  ]),
                  h(
                    MlcButton,
                    {
                      size: "sm",
                      radius: 8,
                      onClick: handleEnter,
                      style: {
                        alignSelf: "center",
                        minHeight: "32px",
                        border: 0,
                        padding: "0 10px",
                        color: "#ffffff",
                        background: text(runtimeProps.accentColor, "#111827"),
                        fontSize: "12px",
                        fontWeight: 800,
                      } satisfies CSSProperties,
                    },
                    () => text(runtimeProps.buttonText, "进入品牌"),
                  ),
                ]),
                h(
                  MlcText,
                  { as: "p", size: 13, style: { margin: 0, color: text(runtimeProps.textColor, "#374151"), lineHeight: 1.6 } },
                  () => text(runtimeProps.description, "精选品牌当季新品与平台补贴权益，帮助用户快速进入品牌导购场景。"),
                ),
                h(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" } },
                  visibleSellingPoints.slice(0, 4).map((point, index) => {
                    const item = (typeof point === "string" ? { title: point } : point) as Record<string, unknown>;
                    return h(
                      MlcTag,
                      {
                        radius: 8,
                        style: {
                          display: "grid",
                          gap: "2px",
                          minHeight: "48px",
                          padding: "8px 9px",
                          background: text(runtimeProps.pointBackgroundColor, "#f8fafc"),
                        } satisfies CSSProperties,
                      },
                      () => [
                        h(MlcText, { as: "strong", size: 12, weight: 800, style: { color: text(runtimeProps.accentColor, "#111827") } }, () =>
                          String(item.title ?? `卖点 ${index + 1}`),
                        ),
                        h(MlcText, { size: 11, tone: "muted" }, () => String(item.desc ?? item.content ?? "")),
                      ],
                    );
                  }),
                ),
                h(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" } },
                  visibleItems.slice(0, 2).map((item, index) =>
                    h(
                      MlcButton,
                      {
                        radius: 9,
                        onClick: () => {
                          const handler = runtimeProps.onProductClick;
                          if (typeof handler === "function") handler(item);
                        },
                        style: {
                          display: "block",
                          overflow: "hidden",
                          width: "100%",
                          border: "1px solid #eef0f3",
                          padding: 0,
                          background: "#ffffff",
                          textAlign: "left",
                        } satisfies CSSProperties,
                      },
                      () => [
                        typeof item.imageUrl === "string"
                          ? h(MlcImage, {
                              src: item.imageUrl,
                              alt: "",
                              ratio: "1 / 1",
                              style: {
                                width: "100%",
                              },
                            })
                          : null,
                        h("span", { style: { display: "grid", gap: "4px", padding: "8px" } }, [
                          h(
                            MlcText,
                            {
                              as: "strong",
                              size: 12,
                              weight: 800,
                              style: {
                                overflow: "hidden",
                                color: "#111827",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              } satisfies CSSProperties,
                            },
                            () => String(item.title ?? `品牌商品 ${index + 1}`),
                          ),
                          h(MlcPrice, { amountText: String(item.priceText ?? ""), size: 13, style: { color: text(runtimeProps.accentColor, "#111827") } }),
                        ]),
                      ],
                    ),
                  ),
                ),
              ]),
            ],
          ),
        ],
      );
    };
  },
});

export const StoreExpertSection = defineComponent({
  name: "StoreExpertSection",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const items = list(runtimeProps.items);
      const visibleItems = items.length
        ? items
        : [
            {
              id: "store_1",
              typeText: "门店",
              title: "MeuMall 上海静安店",
              subtitle: "本周热卖搭配到店试穿",
              metricText: "4.9 分",
              desc: "距你 2.1km",
              imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80",
            },
            {
              id: "expert_1",
              typeText: "达人",
              title: "小夏的通勤穿搭",
              subtitle: "每日更新包袋和鞋履组合",
              metricText: "12.8w 粉丝",
              desc: "直播中",
              imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
            },
          ];

      return h(
        "section",
        {
          class: "mlc-material mlc-store-expert-section",
          style: {
            padding: "14px 12px",
            background: text(runtimeProps.backgroundColor, "#f8fafc"),
          },
        },
        [
          h(
            "div",
            { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px", marginBottom: "10px" } },
            [
              h("div", { style: { minWidth: 0 } }, [
                h(
                  MlcText,
                  { as: "strong", size: 17, weight: 800, style: { display: "block", color: text(runtimeProps.titleColor, "#111827") } },
                  () => text(runtimeProps.title, "门店/达人推荐"),
                ),
                h(
                  MlcText,
                  { size: 12, tone: "muted", style: { display: "block", marginTop: "3px" } },
                  () => text(runtimeProps.subtitle, "精选门店和达人内容，帮助用户快速进入转化场景。"),
                ),
              ]),
              h(
                MlcTag,
                { style: { flex: "0 0 auto", color: text(runtimeProps.accentColor, "#0f766e"), background: "rgba(15, 118, 110, 0.1)" } },
                () => text(runtimeProps.badgeText, "精选"),
              ),
            ],
          ),
          h(
            "div",
            { style: { display: "grid", gap: "10px" } },
            visibleItems.map((item, index) =>
              h(
                MlcButton,
                {
                  onClick: () => {
                    const handler = runtimeProps.onItemClick;
                    if (typeof handler === "function") handler(item);
                  },
                  style: {
                    display: "grid",
                    gridTemplateColumns: "64px minmax(0, 1fr) auto",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    minHeight: "82px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "10px",
                    color: "#111827",
                    background: text(runtimeProps.cardBackgroundColor, "#ffffff"),
                    textAlign: "left",
                  } satisfies CSSProperties,
                },
                () => [
                  typeof item.imageUrl === "string"
                    ? h(MlcImage, {
                        src: item.imageUrl,
                        alt: "",
                        radius: 8,
                        style: {
                          width: "64px",
                          height: "64px",
                          background: "#e5e7eb",
                        },
                      })
                    : h("span", { style: { width: "64px", height: "64px", borderRadius: "8px", background: "#e5e7eb" } }),
                  h("span", { style: { minWidth: 0 } }, [
                    h(
                      MlcTag,
                      { radius: 0, style: { minHeight: "auto", padding: 0, color: text(runtimeProps.accentColor, "#0f766e"), background: "transparent", fontSize: "11px" } },
                      () => String(item.typeText ?? "推荐"),
                    ),
                    h(MlcText, { as: "strong", size: 14, weight: 800, style: { display: "block", marginTop: "4px", color: "#111827" } }, () =>
                      String(item.title ?? `推荐 ${index + 1}`),
                    ),
                    h(MlcText, { size: 12, tone: "muted", style: { display: "block", marginTop: "4px" } }, () => String(item.subtitle ?? item.desc ?? "精选内容")),
                    item.desc ? h(MlcText, { size: 11, tone: "muted", style: { display: "block", marginTop: "4px", color: "#94a3b8" } }, () => String(item.desc)) : null,
                  ]),
                  h(
                    "span",
                    { style: { display: "grid", gap: "8px", justifyItems: "end", color: text(runtimeProps.accentColor, "#0f766e"), fontSize: "12px" } },
                    [
                      h(MlcText, { as: "strong", size: 12, weight: 800, style: { color: text(runtimeProps.accentColor, "#0f766e") } }, () => String(item.metricText ?? "")),
                      h(MlcText, { size: 12, weight: 800, style: { color: text(runtimeProps.accentColor, "#0f766e") } }, () =>
                        String(item.buttonText ?? text(runtimeProps.buttonText, "查看")),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      );
    };
  },
});

export const LiveEntry = defineComponent({
  name: "LiveEntry",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const coverImageUrl = text(runtimeProps.coverImageUrl);
      const linkUrl = text(runtimeProps.linkUrl);
      const handleEnter = () => {
        const handler = runtimeProps.onEnter;
        if (typeof handler === "function") handler();
        if (linkUrl && typeof window !== "undefined") window.location.href = linkUrl;
      };

      return h(
        "section",
        {
          class: "mlc-material mlc-live-entry",
          style: {
            padding: "14px 12px",
            background: text(runtimeProps.backgroundColor, "#111827"),
          },
        },
        [
          h(
            MlcButton,
            {
              radius: 12,
              onClick: handleEnter,
              style: {
                display: "grid",
                gridTemplateColumns: "96px minmax(0, 1fr)",
                gap: "12px",
                width: "100%",
                minHeight: "116px",
                border: "1px solid rgba(255, 255, 255, 0.16)",
                padding: "10px",
                color: text(runtimeProps.titleColor, "#ffffff"),
                background: "rgba(255, 255, 255, 0.08)",
                textAlign: "left",
                boxShadow: "0 10px 28px rgba(15, 23, 42, 0.18)",
              } satisfies CSSProperties,
            },
            () => [
              coverImageUrl
                ? h(MlcImage, {
                    src: coverImageUrl,
                    alt: "",
                    radius: 10,
                    style: {
                      width: "96px",
                      height: "96px",
                      background: "rgba(255, 255, 255, 0.12)",
                    },
                  })
                : h("span", { style: { width: "96px", height: "96px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.12)" } }),
              h("span", { style: { display: "grid", alignContent: "space-between", minWidth: 0 } }, [
                h("span", { style: { minWidth: 0 } }, [
                  h(
                    MlcTag,
                    {
                      radius: 999,
                      style: {
                        gap: "5px",
                        padding: "0 8px",
                        color: "#ffffff",
                        background: text(runtimeProps.accentColor, "#ef4444"),
                        fontSize: "11px",
                        fontWeight: 800,
                      } satisfies CSSProperties,
                    },
                    () => [
                      h("i", {
                        style: {
                          display: "block",
                          width: "6px",
                          height: "6px",
                          borderRadius: "999px",
                          background: "#ffffff",
                        },
                      }),
                      text(runtimeProps.statusText, "直播中"),
                    ],
                  ),
                  h(
                    MlcText,
                    {
                      as: "strong",
                      size: 17,
                      weight: 800,
                      style: {
                        display: "block",
                        marginTop: "8px",
                        overflow: "hidden",
                        color: text(runtimeProps.titleColor, "#ffffff"),
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      },
                    },
                    () => text(runtimeProps.title, "直播间正在热播"),
                  ),
                  h(
                    MlcText,
                    {
                      size: 12,
                      style: {
                        display: "-webkit-box",
                        marginTop: "4px",
                        overflow: "hidden",
                        color: text(runtimeProps.textColor, "#d1d5db"),
                        lineHeight: 1.45,
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                      } satisfies CSSProperties,
                    },
                    () => text(runtimeProps.subtitle, "主播讲解爆品搭配，限时福利同步发放。"),
                  ),
                ]),
                h(
                  "span",
                  { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginTop: "10px" } },
                  [
                    h(
                      MlcText,
                      { size: 12, weight: 700, style: { color: text(runtimeProps.textColor, "#d1d5db") } },
                      () => text(runtimeProps.viewerText, "12.8w 人正在看"),
                    ),
                    h(
                      MlcText,
                      { as: "strong", size: 13, weight: 800, style: { color: text(runtimeProps.accentColor, "#ef4444") } },
                      () => text(runtimeProps.buttonText, "进入直播"),
                    ),
                  ],
                ),
              ]),
            ],
          ),
        ],
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
          h(MlcText, { as: "h2", size: 18, weight: 800, style: { margin: "0 0 12px", color: "#111827" } }, () => text(runtimeProps.title, "优惠券")),
          h(
            MlcButton,
            {
              block: true,
              radius: 8,
              onClick: () => {
                const handler = runtimeProps.onReceive;
                if (typeof handler === "function") handler();
              },
              style: {
                height: "44px",
                border: 0,
                color: "#ffffff",
                background: text(runtimeProps.buttonColor, "#111827"),
              },
            },
            () => text(runtimeProps.buttonText, "领取优惠券"),
          ),
        ],
      );
    };
  },
});

export const CouponBundle = defineComponent({
  name: "CouponBundle",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const coupons = list(runtimeProps.coupons);
      const visibleCoupons = coupons.length
        ? coupons
        : [
            { id: "coupon_1", title: "满 199 减 30", thresholdText: "全场可用", valueText: "¥30" },
            { id: "coupon_2", title: "满 399 减 80", thresholdText: "精选商品", valueText: "¥80" },
          ];

      return h(
        "section",
        {
          class: "mlc-material mlc-coupon-bundle",
          style: {
            padding: "14px 12px",
            background: text(runtimeProps.backgroundColor, "#fff7ed"),
          },
        },
        [
          h(
            "div",
            { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "10px" } },
            [
              h("div", { style: { minWidth: 0 } }, [
                h(
                  MlcText,
                  { as: "strong", size: 17, weight: 800, style: { display: "block", color: text(runtimeProps.titleColor, "#9a3412") } },
                  () => text(runtimeProps.title, "组合券包"),
                ),
                h(
                  MlcText,
                  { size: 12, style: { display: "block", marginTop: "3px", color: "#9a3412", opacity: 0.78 } },
                  () => text(runtimeProps.subtitle, "多张优惠券一次领取，下单更划算。"),
                ),
              ]),
              h(
                MlcButton,
                {
                  size: "sm",
                  radius: 999,
                  onClick: () => {
                    const handler = runtimeProps.onReceiveAll;
                    if (typeof handler === "function") handler();
                  },
                  style: {
                    flex: "0 0 auto",
                    border: 0,
                    color: "#ffffff",
                    background: text(runtimeProps.buttonColor, "#ea580c"),
                    fontSize: "13px",
                  } satisfies CSSProperties,
                },
                () => text(runtimeProps.receiveAllText, "一键领取"),
              ),
            ],
          ),
          h(
            "div",
            { style: { display: "grid", gap: "9px" } },
            visibleCoupons.map((coupon, index) =>
              h(
                MlcButton,
                {
                  onClick: () => {
                    const handler = runtimeProps.onReceive;
                    if (typeof handler === "function") handler(coupon);
                  },
                  style: {
                    display: "grid",
                    gridTemplateColumns: "76px minmax(0, 1fr) auto",
                    alignItems: "center",
                    gap: "10px",
                    minHeight: "72px",
                    border: "1px solid rgba(234, 88, 12, 0.22)",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    color: "#7c2d12",
                    background: "#ffffff",
                    textAlign: "left",
                  } satisfies CSSProperties,
                },
                () => [
                  h(MlcPrice, { amountText: String(coupon.valueText ?? "¥10"), size: 22, style: { color: text(runtimeProps.amountColor, "#dc2626") } }),
                  h("span", { style: { minWidth: 0 } }, [
                    h(MlcText, { as: "strong", size: 14, weight: 800, style: { display: "block", color: "#111827" } }, () =>
                      String(coupon.title ?? `优惠券 ${index + 1}`),
                    ),
                    h(MlcText, { size: 12, style: { display: "block", marginTop: "4px", color: "#9a3412" } }, () =>
                      String(coupon.thresholdText ?? "指定商品可用"),
                    ),
                    coupon.expireText
                      ? h(MlcText, { size: 11, tone: "muted", style: { display: "block", marginTop: "3px", color: "#94a3b8" } }, () => String(coupon.expireText))
                      : null,
                  ]),
                  h(
                    MlcTag,
                    {
                      radius: 0,
                      style: { minHeight: "auto", padding: 0, color: text(runtimeProps.buttonColor, "#ea580c"), background: "transparent", fontSize: "12px" },
                    },
                    () => String(coupon.buttonText ?? text(runtimeProps.receiveText, "领取")),
                  ),
                ],
              ),
            ),
          ),
        ],
      );
    };
  },
});

export const ActivityRuleModal = defineComponent({
  name: "ActivityRuleModal",
  props: materialPropOptions,
  setup(props) {
    const open = ref(false);

    return () => {
      const runtimeProps = props.props ?? {};
      const rules = ruleList(runtimeProps.rules);
      const visibleRules = rules.length ? rules : ["活动规则以页面展示和结算结果为准。"];

      return h(
        "section",
        {
          class: "mlc-material mlc-activity-rule-modal",
          style: {
            padding: "12px 16px",
            color: text(runtimeProps.textColor, "#374151"),
            background: text(runtimeProps.backgroundColor, "#ffffff"),
          },
        },
        [
          h(
            "div",
            { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" } },
            [
              h("div", { style: { minWidth: 0 } }, [
                h(
                  MlcText,
                  { as: "strong", size: 15, weight: 800, style: { display: "block", color: "#111827" } },
                  () => text(runtimeProps.title, "活动规则"),
                ),
                h(
                  MlcText,
                  { size: 12, tone: "muted", style: { display: "block", marginTop: "4px", color: "#6b7280", lineHeight: 1.5 } },
                  () => text(runtimeProps.summary, "查看活动参与条件、优惠说明和有效时间。"),
                ),
              ]),
              h(
                MlcButton,
                {
                  size: "sm",
                  radius: 999,
                  onClick: () => {
                    const handler = runtimeProps.onOpen;
                    if (typeof handler === "function") handler();
                    open.value = true;
                  },
                  style: {
                    flex: "0 0 auto",
                    border: 0,
                    color: "#ffffff",
                    background: text(runtimeProps.primaryColor, "#111827"),
                    fontSize: "13px",
                  } satisfies CSSProperties,
                },
                () => text(runtimeProps.buttonText, "查看规则"),
              ),
            ],
          ),
          h(
            MlcModal,
            {
              open: open.value,
              title: text(runtimeProps.modalTitle, "活动规则"),
              closeLabel: "关闭规则弹窗",
              onClose: () => {
                open.value = false;
              },
            },
            () =>
              h(
                "ol",
                { style: { display: "grid", gap: "10px", margin: 0, padding: "0 18px 18px 36px" } },
                visibleRules.map((rule, index) => {
                  const title = typeof rule === "string" ? rule : text(rule.title, `规则 ${index + 1}`);
                  const content = typeof rule === "string" ? "" : text(rule.content);
                  return h("li", { style: { color: "#374151", lineHeight: 1.65, fontSize: "14px" } }, [
                    h(MlcText, { as: "strong", size: 14, weight: 800, style: { color: "#111827" } }, () => title),
                    content ? h(MlcText, { as: "span", size: 14, style: { display: "block", marginTop: "2px", color: "#374151" } }, () => content) : null,
                  ]);
                }),
              ),
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
      const marginY = number(runtimeProps.marginY, 10);
      const gap = number(runtimeProps.gap, 10);
      const borderWidth = number(runtimeProps.borderWidth, 0);
      const radius = number(runtimeProps.radius, 10);
      const emptyText = text(runtimeProps.emptyText, "向容器中添加物料");

      return h(
        "section",
        {
          class: "mlc-material mlc-section-container",
          style: {
            margin: `${marginY}px 0`,
            padding: `${number(runtimeProps.padding, 12)}px`,
            background: text(runtimeProps.backgroundColor, "#ffffff"),
            border: borderWidth > 0 ? `${borderWidth}px solid ${text(runtimeProps.borderColor, "#e5e7eb")}` : undefined,
            borderRadius: `${radius}px`,
            boxShadow: boolean(runtimeProps.shadow) ? "0 10px 28px rgba(15, 23, 42, 0.08)" : undefined,
          },
        },
        [
          title
            ? h("h2", { style: { margin: "0 0 6px", color: text(runtimeProps.titleColor, "#111827"), fontSize: "18px" } }, title)
            : null,
          subtitle
            ? h("p", { style: { margin: "0 0 12px", color: text(runtimeProps.subtitleColor, "#64748b"), fontSize: "13px", lineHeight: 1.6 } }, subtitle)
            : null,
          children?.length
            ? h("div", { class: "mlc-section-container__body", style: { display: "grid", gap: `${gap}px` } }, children)
            : h("div", { class: "mlc-section-container__empty" }, emptyText),
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
        MlcButton,
        {
          class: "mlc-material mlc-action-button__button",
          block: true,
          radius: number(runtimeProps.radius, 8),
          style: {
            border: 0,
            color: text(runtimeProps.textColor, "#ffffff"),
            background: text(runtimeProps.backgroundColor, "#111827"),
          },
          onClick: () => {
            const handler = runtimeProps.onClick;
            if (typeof handler === "function") handler();
            if (linkUrl) window.location.href = linkUrl;
          },
        },
        () => text(runtimeProps.text, "立即参与"),
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

export const StickyActionBar = defineComponent({
  name: "StickyActionBar",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const primaryLinkUrl = text(runtimeProps.primaryLinkUrl);
      const secondaryLinkUrl = text(runtimeProps.secondaryLinkUrl);
      const showSecondary = runtimeProps.showSecondary !== false && Boolean(text(runtimeProps.secondaryText, "领券"));
      const handlePrimaryClick = () => {
        const handler = runtimeProps.onPrimaryClick;
        if (typeof handler === "function") handler();
        if (primaryLinkUrl && typeof window !== "undefined") window.location.href = primaryLinkUrl;
      };
      const handleSecondaryClick = () => {
        const handler = runtimeProps.onSecondaryClick;
        if (typeof handler === "function") handler();
        if (secondaryLinkUrl && typeof window !== "undefined") window.location.href = secondaryLinkUrl;
      };

      return h(
        "section",
        {
          class: "mlc-material mlc-sticky-action-bar",
          style: {
            position: runtimeProps.sticky === false ? "relative" : "sticky",
            bottom: 0,
            zIndex: 30,
            display: "grid",
            gridTemplateColumns: showSecondary ? "minmax(0, 1fr) auto auto" : "minmax(0, 1fr) auto",
            alignItems: "center",
            gap: "10px",
            padding: runtimeProps.safeArea === false ? "10px 12px" : "10px 12px calc(10px + env(safe-area-inset-bottom))",
            borderTop: "1px solid rgba(226, 232, 240, 0.92)",
            background: text(runtimeProps.backgroundColor, "#ffffff"),
            boxShadow: "0 -10px 26px rgba(15, 23, 42, 0.12)",
          } satisfies CSSProperties,
        },
        [
          h("span", { style: { minWidth: 0 } }, [
            h(
              MlcText,
              { as: "strong", size: 14, weight: 800, style: { display: "block", color: text(runtimeProps.titleColor, "#111827") } },
              () => text(runtimeProps.title, "限时福利"),
            ),
            h(
              MlcText,
              { size: 11, tone: "muted", style: { display: "block", marginTop: "3px", color: text(runtimeProps.textColor, "#64748b") } },
              () => text(runtimeProps.subtitle, "领取优惠后立即逛活动精选"),
            ),
          ]),
          showSecondary
            ? h(
                MlcButton,
                {
                  size: "sm",
                  variant: "outline",
                  radius: number(runtimeProps.radius, 999),
                  onClick: handleSecondaryClick,
                  style: {
                    minHeight: "38px",
                    border: `1px solid ${text(runtimeProps.accentColor, "#111827")}`,
                    padding: "0 12px",
                    color: text(runtimeProps.accentColor, "#111827"),
                    background: text(runtimeProps.secondaryBackgroundColor, "#ffffff"),
                    fontSize: "13px",
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                  } satisfies CSSProperties,
                },
                () => text(runtimeProps.secondaryText, "领券"),
              )
            : null,
          h(
            MlcButton,
            {
              size: "sm",
              radius: number(runtimeProps.radius, 999),
              onClick: handlePrimaryClick,
              style: {
                minHeight: "38px",
                border: 0,
                padding: "0 15px",
                color: text(runtimeProps.primaryTextColor, "#ffffff"),
                background: text(runtimeProps.accentColor, "#111827"),
                fontSize: "13px",
                fontWeight: 800,
                whiteSpace: "nowrap",
              } satisfies CSSProperties,
            },
            () => text(runtimeProps.primaryText, "立即抢购"),
          ),
        ],
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
      return h(MlcSpacer, {
        class: "mlc-material mlc-spacer-block",
        height: number(runtimeProps.height, 12),
        backgroundColor: text(runtimeProps.backgroundColor, "transparent"),
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
                h(MlcText, { as: "strong", size: 15, weight: 800, style: { display: "block", color: text(runtimeProps.textColor, "#ffffff") } }, () =>
                  text(runtimeProps.title, "限时秒杀"),
                ),
                h(MlcText, { size: 12, style: { display: "block", marginTop: "3px", color: text(runtimeProps.textColor, "#ffffff"), opacity: 0.86 } }, () =>
                  text(runtimeProps.subtitle, "距离活动结束"),
                ),
              ]),
              h(
                MlcCountdownText,
                {
                  days: text(runtimeProps.days, "00"),
                  hours: text(runtimeProps.hours, "12"),
                  minutes: text(runtimeProps.minutes, "30"),
                  seconds: text(runtimeProps.seconds, "00"),
                  numberColor: text(runtimeProps.numberColor, "#dc2626"),
                },
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
                MlcButton,
                {
                  radius: number(runtimeProps.radius, 8),
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
                    color: text(runtimeProps.textColor, "#111827"),
                    background: text(item.backgroundColor, text(runtimeProps.itemBackgroundColor, "#f8fafc")),
                    textAlign: "center",
                  } satisfies CSSProperties,
                },
                () => [
                  h(MlcText, { as: "strong", size: 14, weight: 800, style: { color: "inherit" } }, () => String(item.title ?? `导航 ${index + 1}`)),
                  item.subtitle ? h(MlcText, { size: 11, tone: "muted" }, () => String(item.subtitle)) : null,
                ],
              );
            }),
          ),
        ],
      );
    };
  },
});

export const FloorAnchorNav = defineComponent({
  name: "FloorAnchorNav",
  props: materialPropOptions,
  setup(props) {
    return () => {
      const runtimeProps = props.props ?? {};
      const items = list(runtimeProps.items);
      const visibleItems = items.length ? items : [{ id: "anchor_1", title: "楼层", targetId: "" }];
      const sticky = runtimeProps.sticky !== false;
      const offsetTop = number(runtimeProps.offsetTop, 0);

      const scrollToTarget = (item: Record<string, unknown>) => {
        const targetId = text(item.targetId, text(item.id));
        const handler = runtimeProps.onAnchorClick;
        if (typeof handler === "function") handler(item);
        const target = findAnchorTarget(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: runtimeProps.smooth === false ? "auto" : "smooth",
            block: "start",
          });
          return;
        }
        const linkUrl = text(item.linkUrl);
        if (linkUrl) window.location.href = linkUrl;
      };

      return h(
        "section",
        {
          class: "mlc-material mlc-floor-anchor-nav",
          style: {
            position: sticky ? "sticky" : "relative",
            top: sticky ? `${offsetTop}px` : "auto",
            zIndex: sticky ? 20 : "auto",
            padding: "10px 12px",
            background: text(runtimeProps.backgroundColor, "#ffffff"),
            boxShadow: sticky ? "0 8px 18px rgba(15, 23, 42, 0.06)" : "none",
          },
        },
        [
          text(runtimeProps.title)
            ? h(
                MlcText,
                { as: "strong", size: 14, weight: 800, style: { display: "block", marginBottom: "8px", color: text(runtimeProps.textColor, "#111827") } },
                () => text(runtimeProps.title),
              )
            : null,
          h(
            "div",
            {
              style: {
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
              } satisfies CSSProperties,
            },
            visibleItems.map((item, index) =>
              h(
                MlcButton,
                {
                  size: "sm",
                  radius: number(runtimeProps.radius, 999),
                  onClick: () => scrollToTarget(item),
                  style: {
                    flex: "0 0 auto",
                    border: 0,
                    color: text(runtimeProps.textColor, "#111827"),
                    background: text(item.backgroundColor, text(runtimeProps.itemBackgroundColor, "#f3f4f6")),
                    fontSize: "13px",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  } satisfies CSSProperties,
                },
                () => String(item.title ?? `楼层 ${index + 1}`),
              ),
            ),
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
              h(MlcText, { as: "strong", size: 17, weight: 800, style: { display: "block", color: "#111827" } }, () => text(runtimeProps.title, "限时秒杀")),
              h(MlcText, { size: 12, tone: "muted", style: { display: "block", marginTop: "3px" } }, () => text(runtimeProps.subtitle, "爆品限量抢购")),
            ]),
            h(MlcTag, { style: { alignSelf: "start", color: "#dc2626", background: "#fee2e2" } }, () => text(runtimeProps.badgeText, "秒杀中")),
          ]),
          h(
            "div",
            { style: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" } },
            items.map((item, index) =>
              h(
                MlcButton,
                {
                  radius: 10,
                  onClick: () => {
                    const handler = runtimeProps.onProductClick;
                    if (typeof handler === "function") handler(item);
                  },
                  style: {
                    display: "block",
                    overflow: "hidden",
                    width: "100%",
                    border: "1px solid #eef0f3",
                    padding: 0,
                    background: "#ffffff",
                    textAlign: "left",
                  } satisfies CSSProperties,
                },
                () => [
                  typeof item.imageUrl === "string"
                    ? h(MlcImage, {
                        src: item.imageUrl,
                        alt: "",
                        ratio: "1 / 1",
                        style: {
                          width: "100%",
                        },
                      })
                    : null,
                  h("span", { style: { display: "grid", gap: "5px", padding: "9px" } }, [
                    h(MlcText, { as: "strong", size: 13, weight: 800, style: { color: "#111827", lineHeight: 1.35 } }, () => String(item.title ?? `秒杀商品 ${index + 1}`)),
                    h(MlcPrice, { amountText: String(item.priceText ?? ""), size: 14, style: { color: "#dc2626" } }),
                    h(MlcText, { size: 11, tone: "muted", style: { color: "#94a3b8", textDecoration: "line-through" } }, () => String(item.originPriceText ?? "")),
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
        marginY: 10,
        gap: 10,
        radius: 10,
        borderColor: "#e5e7eb",
        borderWidth: 0,
        shadow: false,
        titleColor: "#111827",
        subtitleColor: "#64748b",
        emptyText: "向容器中添加物料",
      },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "精选专区" },
        subtitle: { label: "说明", type: "string", setter: "textarea", defaultValue: "可在容器中继续添加 Banner、商品或优惠券。" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        padding: { label: "内边距", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
        marginY: { label: "上下外边距", type: "number", setter: "number", defaultValue: 10, ...NUMBER_PIXEL_SIZE_META },
        gap: { label: "子节点间距", type: "number", setter: "number", defaultValue: 10, ...NUMBER_PIXEL_SIZE_META },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 10, ...NUMBER_RADIUS_META },
        borderColor: { label: "边框色", type: "string", setter: "color", defaultValue: "#e5e7eb", ...COLOR_SWATCHES_META },
        borderWidth: { label: "边框宽度", type: "number", setter: "number", defaultValue: 0, ...NUMBER_BORDER_WIDTH_META },
        shadow: { label: "阴影", type: "boolean", setter: "switch", defaultValue: false },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        subtitleColor: { label: "说明色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        emptyText: { label: "空态文案", type: "string", setter: "input", defaultValue: "向容器中添加物料" },
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
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#fffbeb", ...COLOR_SWATCHES_META },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#92400e", ...COLOR_SWATCHES_META },
      },
    }),
  },
  {
    component: BasicButton,
    manifest: createMaterialManifest({
      componentName: "BasicButton",
      materialVersion: "0.1.0",
      title: "基础按钮",
      category: "basic",
      platforms: ["h5"],
      defaultProps: {
        text: "基础按钮",
        variant: "solid",
        size: "md",
        block: true,
        disabled: false,
        loading: false,
        backgroundColor: "#111827",
        textColor: "#ffffff",
        borderColor: "#111827",
        wrapperBackgroundColor: "transparent",
        radius: 8,
        paddingY: 12,
      },
      propsSchema: {
        text: { label: "按钮文案", type: "string", setter: "input", required: true, defaultValue: "基础按钮" },
        variant: { label: "样式", type: "string", setter: "select", defaultValue: "solid", options: BASIC_BUTTON_VARIANT_OPTIONS },
        size: { label: "尺寸", type: "string", setter: "select", defaultValue: "md", options: BASIC_BUTTON_SIZE_OPTIONS },
        block: { label: "撑满宽度", type: "boolean", setter: "switch", defaultValue: true },
        disabled: { label: "禁用", type: "boolean", setter: "switch", defaultValue: false },
        loading: { label: "加载中", type: "boolean", setter: "switch", defaultValue: false },
        backgroundColor: { label: "按钮色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        borderColor: { label: "边框色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        wrapperBackgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 8, ...NUMBER_RADIUS_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
      },
      events: [{ name: "onClick", title: "点击按钮" }],
    }),
  },
  {
    component: BasicInput,
    manifest: createMaterialManifest({
      componentName: "BasicInput",
      materialVersion: "0.1.0",
      title: "基础输入框",
      category: "basic",
      platforms: ["h5"],
      defaultProps: {
        label: "基础输入框",
        placeholder: "请输入内容",
        helperText: "用于收集单行文本，本地示例不会提交数据。",
        defaultValue: "",
        type: "text",
        disabled: false,
        wrapperBackgroundColor: "transparent",
        inputBackgroundColor: "#ffffff",
        labelColor: "#111827",
        textColor: "#111827",
        helperColor: "#64748b",
        borderColor: "#e5e7eb",
        radius: 8,
        paddingY: 12,
      },
      propsSchema: {
        label: { label: "标签", type: "string", setter: "input", defaultValue: "基础输入框" },
        placeholder: { label: "占位提示", type: "string", setter: "input", defaultValue: "请输入内容" },
        helperText: { label: "辅助说明", type: "string", setter: "textarea", defaultValue: "用于收集单行文本，本地示例不会提交数据。" },
        defaultValue: { label: "默认值", type: "string", setter: "input", defaultValue: "" },
        type: { label: "输入类型", type: "string", setter: "select", defaultValue: "text", options: BASIC_INPUT_TYPE_OPTIONS },
        disabled: { label: "禁用", type: "boolean", setter: "switch", defaultValue: false },
        wrapperBackgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        inputBackgroundColor: { label: "输入背景", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        labelColor: { label: "标签色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        helperColor: { label: "辅助文字色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        borderColor: { label: "边框色", type: "string", setter: "color", defaultValue: "#e5e7eb", ...COLOR_SWATCHES_META },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 8, ...NUMBER_RADIUS_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
      },
      events: [{ name: "onChange", title: "输入变化" }],
    }),
  },
  {
    component: BasicText,
    manifest: createMaterialManifest({
      componentName: "BasicText",
      materialVersion: "0.1.0",
      title: "基础文本",
      category: "basic",
      platforms: ["h5"],
      defaultProps: {
        text: "这是一段基础文本，可用于活动说明、提示文案或普通段落。",
        as: "p",
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 1.6,
        align: "left",
        color: "#111827",
        backgroundColor: "transparent",
        paddingY: 10,
      },
      propsSchema: {
        text: { label: "文本内容", type: "string", setter: "textarea", required: true, defaultValue: "这是一段基础文本，可用于活动说明、提示文案或普通段落。" },
        as: { label: "标签类型", type: "string", setter: "select", defaultValue: "p", options: BASIC_TEXT_AS_OPTIONS },
        fontSize: { label: "字号", type: "number", setter: "number", defaultValue: 14, ...NUMBER_FONT_SIZE_META },
        fontWeight: { label: "字重", type: "number", setter: "number", defaultValue: 400, ...NUMBER_FONT_WEIGHT_META },
        lineHeight: { label: "行高", type: "number", setter: "number", defaultValue: 1.6, ...NUMBER_LINE_HEIGHT_META },
        align: { label: "对齐", type: "string", setter: "select", defaultValue: "left", options: INLINE_ALIGN_OPTIONS },
        color: { label: "文字色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 10, ...NUMBER_PIXEL_SIZE_META },
      },
    }),
  },
  {
    component: DividerBlock,
    manifest: createMaterialManifest({
      componentName: "DividerBlock",
      materialVersion: "0.1.0",
      title: "分割线",
      category: "basic",
      platforms: ["h5"],
      defaultProps: {
        color: "#e5e7eb",
        thickness: 1,
        lineStyle: "solid",
        inset: 16,
        paddingY: 12,
        backgroundColor: "transparent",
      },
      propsSchema: {
        color: { label: "线条色", type: "string", setter: "color", defaultValue: "#e5e7eb", ...COLOR_SWATCHES_META },
        thickness: { label: "线条粗细", type: "number", setter: "number", defaultValue: 1, ...NUMBER_BORDER_WIDTH_META },
        lineStyle: { label: "线条样式", type: "string", setter: "select", defaultValue: "solid", options: DIVIDER_LINE_STYLE_OPTIONS },
        inset: { label: "左右缩进", type: "number", setter: "number", defaultValue: 16, ...NUMBER_PIXEL_SIZE_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
        backgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
      },
    }),
  },
  {
    component: BasicImage,
    manifest: createMaterialManifest({
      componentName: "BasicImage",
      materialVersion: "0.1.0",
      title: "基础图片",
      category: "basic",
      platforms: ["h5"],
      defaultProps: {
        imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
        alt: "活动图片",
        ratio: "16 / 9",
        fit: "cover",
        radius: 8,
        paddingY: 12,
        backgroundColor: "transparent",
      },
      propsSchema: {
        imageUrl: { label: "图片地址", type: "string", setter: "image", required: true, defaultValue: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80" },
        alt: { label: "替代文本", type: "string", setter: "input", defaultValue: "活动图片" },
        ratio: { label: "图片比例", type: "string", setter: "input", defaultValue: "16 / 9" },
        fit: { label: "填充模式", type: "string", setter: "select", defaultValue: "cover", options: BASIC_IMAGE_FIT_OPTIONS },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 8, ...NUMBER_RADIUS_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
        backgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
      },
    }),
  },
  {
    component: BasicTag,
    manifest: createMaterialManifest({
      componentName: "BasicTag",
      materialVersion: "0.1.0",
      title: "基础标签",
      category: "basic",
      platforms: ["h5"],
      defaultProps: {
        text: "基础标签",
        tone: "accent",
        align: "left",
        textColor: "#0f766e",
        backgroundColor: "rgba(15, 118, 110, 0.1)",
        wrapperBackgroundColor: "transparent",
        radius: 999,
        fontSize: 12,
        fontWeight: 800,
        paddingY: 10,
      },
      propsSchema: {
        text: { label: "标签文案", type: "string", setter: "input", required: true, defaultValue: "基础标签" },
        tone: { label: "语义色", type: "string", setter: "select", defaultValue: "accent", options: BASIC_TAG_TONE_OPTIONS },
        align: { label: "对齐", type: "string", setter: "select", defaultValue: "left", options: INLINE_ALIGN_OPTIONS },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#0f766e", ...COLOR_SWATCHES_META },
        backgroundColor: { label: "标签背景", type: "string", setter: "color", defaultValue: "rgba(15, 118, 110, 0.1)", ...COLOR_SWATCHES_META },
        wrapperBackgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 999, ...NUMBER_PILL_RADIUS_META },
        fontSize: { label: "字号", type: "number", setter: "number", defaultValue: 12, ...NUMBER_FONT_SIZE_META },
        fontWeight: { label: "字重", type: "number", setter: "number", defaultValue: 800, ...NUMBER_FONT_WEIGHT_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 10, ...NUMBER_PIXEL_SIZE_META },
      },
    }),
  },
  {
    component: BasicCard,
    manifest: createMaterialManifest({
      componentName: "BasicCard",
      materialVersion: "0.1.0",
      title: "基础图文卡片",
      category: "basic",
      platforms: ["h5"],
      defaultProps: {
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
        alt: "基础图文卡片",
        ratio: "16 / 9",
        fit: "cover",
        badgeText: "精选",
        title: "基础图文卡片",
        description: "用于组合图片、标题、说明和按钮，适合活动入口、内容推荐和轻量导购。",
        buttonText: "查看详情",
        showButton: true,
        wrapperBackgroundColor: "transparent",
        cardBackgroundColor: "#ffffff",
        badgeBackgroundColor: "rgba(15, 118, 110, 0.1)",
        titleColor: "#111827",
        textColor: "#64748b",
        accentColor: "#0f766e",
        buttonTextColor: "#ffffff",
        radius: 12,
        buttonRadius: 999,
        borderColor: "#e5e7eb",
        borderWidth: 1,
        shadow: false,
        paddingY: 12,
        contentPadding: 12,
      },
      propsSchema: {
        imageUrl: { label: "图片地址", type: "string", setter: "image", defaultValue: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80" },
        alt: { label: "替代文本", type: "string", setter: "input", defaultValue: "基础图文卡片" },
        ratio: { label: "图片比例", type: "string", setter: "input", defaultValue: "16 / 9" },
        fit: { label: "填充模式", type: "string", setter: "select", defaultValue: "cover", options: BASIC_IMAGE_FIT_OPTIONS },
        badgeText: { label: "角标", type: "string", setter: "input", defaultValue: "精选" },
        title: { label: "标题", type: "string", setter: "input", required: true, defaultValue: "基础图文卡片" },
        description: { label: "说明", type: "string", setter: "textarea", defaultValue: "用于组合图片、标题、说明和按钮，适合活动入口、内容推荐和轻量导购。" },
        buttonText: { label: "按钮文案", type: "string", setter: "input", defaultValue: "查看详情" },
        showButton: { label: "显示按钮", type: "boolean", setter: "switch", defaultValue: true },
        wrapperBackgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        cardBackgroundColor: { label: "卡片背景", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        badgeBackgroundColor: { label: "角标背景", type: "string", setter: "color", defaultValue: "rgba(15, 118, 110, 0.1)", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "说明色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        accentColor: { label: "强调色", type: "string", setter: "color", defaultValue: "#0f766e", ...COLOR_SWATCHES_META },
        buttonTextColor: { label: "按钮文字色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        radius: { label: "卡片圆角", type: "number", setter: "number", defaultValue: 12, ...NUMBER_RADIUS_META },
        buttonRadius: { label: "按钮圆角", type: "number", setter: "number", defaultValue: 999, ...NUMBER_PILL_RADIUS_META },
        borderColor: { label: "边框色", type: "string", setter: "color", defaultValue: "#e5e7eb", ...COLOR_SWATCHES_META },
        borderWidth: { label: "边框宽度", type: "number", setter: "number", defaultValue: 1, ...NUMBER_BORDER_WIDTH_META },
        shadow: { label: "阴影", type: "boolean", setter: "switch", defaultValue: false },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
        contentPadding: { label: "内容内边距", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
      },
      events: [{ name: "onClick", title: "点击按钮" }],
    }),
  },
  {
    component: SectionTitle,
    manifest: createMaterialManifest({
      componentName: "SectionTitle",
      materialVersion: "0.1.0",
      title: "区块标题",
      category: "content",
      platforms: ["h5"],
      defaultProps: {
        markerText: "精选",
        title: "今日主推",
        subtitle: "用标题和说明分隔不同运营楼层。",
        align: "left",
        backgroundColor: "#f3f4f6",
        titleColor: "#111827",
        textColor: "#64748b",
        accentColor: "#0f766e",
        titleSize: 20,
        paddingY: 18,
      },
      propsSchema: {
        markerText: { label: "角标", type: "string", setter: "input", defaultValue: "精选" },
        title: { label: "标题", type: "string", setter: "input", required: true, defaultValue: "今日主推" },
        subtitle: { label: "说明", type: "string", setter: "textarea", defaultValue: "用标题和说明分隔不同运营楼层。" },
        align: { label: "对齐", type: "string", setter: "select", defaultValue: "left", options: INLINE_ALIGN_OPTIONS },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#f3f4f6", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "说明色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        accentColor: { label: "强调色", type: "string", setter: "color", defaultValue: "#0f766e", ...COLOR_SWATCHES_META },
        titleSize: { label: "标题字号", type: "number", setter: "number", defaultValue: 20, ...NUMBER_FONT_SIZE_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 18, ...NUMBER_PIXEL_SIZE_META },
      },
    }),
  },
  {
    component: ImageCardGrid,
    manifest: createMaterialManifest({
      componentName: "ImageCardGrid",
      materialVersion: "0.1.0",
      title: "图片卡片宫格",
      category: "marketing",
      platforms: ["h5"],
      defaultProps: {
        title: "专题会场",
        subtitle: "用图片卡片承载品类入口和分会场导流。",
        columns: 2,
        gap: 10,
        radius: 10,
        backgroundColor: "#f3f4f6",
        cardBackgroundColor: "#111827",
        titleColor: "#111827",
        textColor: "#64748b",
        accentColor: "#ef4444",
        items: [
          {
            id: "women",
            title: "女装会场",
            subtitle: "夏日通勤穿搭",
            badgeText: "热推",
            imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80",
            linkUrl: "",
          },
          {
            id: "shoes",
            title: "鞋包会场",
            subtitle: "轻盈出行装备",
            badgeText: "新品",
            imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80",
            linkUrl: "",
          },
        ],
      },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "专题会场" },
        subtitle: { label: "说明", type: "string", setter: "textarea", defaultValue: "用图片卡片承载品类入口和分会场导流。" },
        columns: { label: "列数", type: "number", setter: "number", defaultValue: 2, ...NUMBER_COLUMNS_1_TO_3_META },
        gap: { label: "间距", type: "number", setter: "number", defaultValue: 10, ...NUMBER_PIXEL_SIZE_META },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 10, ...NUMBER_RADIUS_META },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#f3f4f6", ...COLOR_SWATCHES_META },
        cardBackgroundColor: { label: "卡片背景", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "说明色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        accentColor: { label: "强调色", type: "string", setter: "color", defaultValue: "#ef4444", ...COLOR_SWATCHES_META },
        items: { label: "卡片列表", type: "array", setter: "textarea", defaultValue: [] },
      },
      events: [{ name: "onItemClick", title: "点击卡片" }],
    }),
  },
  {
    component: TabsBlock,
    manifest: createMaterialManifest({
      componentName: "TabsBlock",
      materialVersion: "0.1.0",
      title: "标签内容切换",
      category: "content",
      platforms: ["h5"],
      defaultProps: {
        title: "活动信息",
        subtitle: "用标签页承载多组说明内容，减少页面长度。",
        backgroundColor: "#f3f4f6",
        cardBackgroundColor: "#ffffff",
        navBackgroundColor: "#f8fafc",
        tabBackgroundColor: "#ffffff",
        titleColor: "#111827",
        textColor: "#64748b",
        contentColor: "#374151",
        activeTextColor: "#ffffff",
        accentColor: "#111827",
        borderColor: "#e5e7eb",
        radius: 12,
        paddingY: 14,
        items: [
          {
            id: "highlight",
            title: "活动亮点",
            subtitle: "本期主推",
            badgeText: "Hot",
            content: "多会场、多权益和多内容说明可以收纳在同一个标签区块中。",
          },
          {
            id: "guide",
            title: "参与方式",
            subtitle: "三步完成",
            badgeText: "",
            content: "先选择会场，再领取权益，最后进入商品或表单完成转化。",
          },
          {
            id: "faq",
            title: "常见问题",
            subtitle: "运营说明",
            badgeText: "FAQ",
            content: "这里可以配置活动时间、使用门槛、售后规则或其他说明。",
          },
        ],
      },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "活动信息" },
        subtitle: { label: "说明", type: "string", setter: "textarea", defaultValue: "用标签页承载多组说明内容，减少页面长度。" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#f3f4f6", ...COLOR_SWATCHES_META },
        cardBackgroundColor: { label: "卡片背景", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        navBackgroundColor: { label: "导航背景", type: "string", setter: "color", defaultValue: "#f8fafc", ...COLOR_SWATCHES_META },
        tabBackgroundColor: { label: "标签背景", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "说明色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        contentColor: { label: "内容色", type: "string", setter: "color", defaultValue: "#374151", ...COLOR_SWATCHES_META },
        activeTextColor: { label: "选中文字色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        accentColor: { label: "强调色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        borderColor: { label: "边框色", type: "string", setter: "color", defaultValue: "#e5e7eb", ...COLOR_SWATCHES_META },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 12 },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 14 },
        items: { label: "标签列表", type: "array", setter: "textarea", defaultValue: [] },
      },
    }),
  },
  {
    component: LeadFormBlock,
    manifest: createMaterialManifest({
      componentName: "LeadFormBlock",
      materialVersion: "0.1.0",
      title: "留资表单",
      category: "form",
      platforms: ["h5"],
      defaultProps: {
        title: "活动预约表单",
        description: "留下联系方式，运营可在后续接入真实提交服务。",
        showName: true,
        showPhone: true,
        showQuantity: true,
        showNote: true,
        showAgreement: true,
        nameLabel: "姓名",
        phoneLabel: "手机号",
        quantityLabel: "预约人数",
        noteLabel: "备注",
        namePlaceholder: "请输入姓名",
        phonePlaceholder: "请输入手机号",
        notePlaceholder: "可填写偏好、尺码或到店时间",
        quantityMin: 1,
        quantityMax: 9,
        quantityDefault: 1,
        agreementText: "我已阅读并同意活动规则",
        submitText: "提交预约",
        successText: "已提交，本地示例不会保存真实数据。",
        backgroundColor: "#f3f4f6",
        cardColor: "#ffffff",
        titleColor: "#111827",
        textColor: "#64748b",
        accentColor: "#0f766e",
        buttonTextColor: "#ffffff",
        radius: 14,
        paddingY: 16,
      },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "活动预约表单" },
        description: { label: "说明", type: "string", setter: "textarea", defaultValue: "留下联系方式，运营可在后续接入真实提交服务。" },
        showName: { label: "显示姓名", type: "boolean", setter: "switch", defaultValue: true },
        showPhone: { label: "显示手机号", type: "boolean", setter: "switch", defaultValue: true },
        showQuantity: { label: "显示人数", type: "boolean", setter: "switch", defaultValue: true },
        showNote: { label: "显示备注", type: "boolean", setter: "switch", defaultValue: true },
        showAgreement: { label: "显示协议", type: "boolean", setter: "switch", defaultValue: true },
        nameLabel: { label: "姓名标签", type: "string", setter: "input", defaultValue: "姓名" },
        phoneLabel: { label: "手机号标签", type: "string", setter: "input", defaultValue: "手机号" },
        quantityLabel: { label: "人数标签", type: "string", setter: "input", defaultValue: "预约人数" },
        noteLabel: { label: "备注标签", type: "string", setter: "input", defaultValue: "备注" },
        namePlaceholder: { label: "姓名提示", type: "string", setter: "input", defaultValue: "请输入姓名" },
        phonePlaceholder: { label: "手机号提示", type: "string", setter: "input", defaultValue: "请输入手机号" },
        notePlaceholder: { label: "备注提示", type: "string", setter: "textarea", defaultValue: "可填写偏好、尺码或到店时间" },
        quantityMin: { label: "人数最小值", type: "number", setter: "number", defaultValue: 1 },
        quantityMax: { label: "人数最大值", type: "number", setter: "number", defaultValue: 9 },
        quantityDefault: { label: "人数默认值", type: "number", setter: "number", defaultValue: 1 },
        agreementText: { label: "协议文案", type: "string", setter: "textarea", defaultValue: "我已阅读并同意活动规则" },
        submitText: { label: "按钮文案", type: "string", setter: "input", defaultValue: "提交预约" },
        successText: { label: "提交提示", type: "string", setter: "input", defaultValue: "已提交，本地示例不会保存真实数据。" },
        backgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "#f3f4f6", ...COLOR_SWATCHES_META },
        cardColor: { label: "卡片背景", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        accentColor: { label: "强调色", type: "string", setter: "color", defaultValue: "#0f766e", ...COLOR_SWATCHES_META },
        buttonTextColor: { label: "按钮文字色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 14 },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 16 },
      },
      events: [{ name: "onSubmit", title: "提交表单" }],
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
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
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
        backgroundColor: { label: "按钮色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        wrapperBackgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "#f3f4f6", ...COLOR_SWATCHES_META },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 8 },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 12 },
      },
      events: [{ name: "onClick", title: "点击按钮" }],
    }),
  },
  {
    component: StickyActionBar,
    manifest: createMaterialManifest({
      componentName: "StickyActionBar",
      materialVersion: "0.1.0",
      title: "底部转化条",
      category: "marketing",
      platforms: ["h5"],
      defaultProps: {
        title: "限时福利",
        subtitle: "领取优惠后立即逛活动精选",
        primaryText: "立即抢购",
        secondaryText: "领券",
        showSecondary: true,
        sticky: true,
        safeArea: true,
        primaryLinkUrl: "",
        secondaryLinkUrl: "",
        backgroundColor: "#ffffff",
        titleColor: "#111827",
        textColor: "#64748b",
        accentColor: "#111827",
        primaryTextColor: "#ffffff",
        secondaryBackgroundColor: "#ffffff",
        radius: 999,
      },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "限时福利" },
        subtitle: { label: "说明", type: "string", setter: "input", defaultValue: "领取优惠后立即逛活动精选" },
        primaryText: { label: "主按钮", type: "string", setter: "input", defaultValue: "立即抢购" },
        secondaryText: { label: "副按钮", type: "string", setter: "input", defaultValue: "领券" },
        showSecondary: { label: "显示副按钮", type: "boolean", setter: "switch", defaultValue: true },
        sticky: { label: "固定底部", type: "boolean", setter: "switch", defaultValue: true },
        safeArea: { label: "安全区留白", type: "boolean", setter: "switch", defaultValue: true },
        primaryLinkUrl: { label: "主按钮链接", type: "string", setter: "input", defaultValue: "" },
        secondaryLinkUrl: { label: "副按钮链接", type: "string", setter: "input", defaultValue: "" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "说明色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        accentColor: { label: "强调色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        primaryTextColor: { label: "主按钮文字", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        secondaryBackgroundColor: { label: "副按钮背景", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        radius: { label: "按钮圆角", type: "number", setter: "number", defaultValue: 999 },
      },
      events: [
        { name: "onPrimaryClick", title: "点击主按钮" },
        { name: "onSecondaryClick", title: "点击副按钮" },
      ],
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
    component: ProductRankList,
    manifest: createMaterialManifest({
      componentName: "ProductRankList",
      materialVersion: "0.1.0",
      title: "商品榜单",
      category: "commerce",
      platforms: ["h5"],
      defaultProps: {
        title: "夏日热卖榜",
        subtitle: "按活动热度整理，帮助用户快速选爆品。",
        badgeText: "热卖榜",
        buttonText: "去看看",
        backgroundColor: "#ffffff",
        titleColor: "#111827",
        accentColor: "#ef4444",
        rankBackgroundColor: "#fff1f2",
        limit: 5,
        items: [
          {
            id: "rank_1",
            title: "轻盈通勤手提包",
            priceText: "¥199",
            desc: "活动热度 98",
            imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=300&q=80",
          },
          {
            id: "rank_2",
            title: "夏季舒适凉鞋",
            priceText: "¥129",
            desc: "近 24 小时热卖",
            imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80",
          },
          {
            id: "rank_3",
            title: "防晒轻薄外套",
            priceText: "¥259",
            desc: "达人推荐",
            imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=300&q=80",
          },
        ],
      },
      dataSourceSlots: [{ name: "items", acceptedTypes: ["product.byIds", "product.byActivity"] }],
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "夏日热卖榜" },
        subtitle: { label: "说明", type: "string", setter: "textarea", defaultValue: "按活动热度整理，帮助用户快速选爆品。" },
        badgeText: { label: "角标", type: "string", setter: "input", defaultValue: "热卖榜" },
        buttonText: { label: "按钮文案", type: "string", setter: "input", defaultValue: "去看看" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        accentColor: { label: "强调色", type: "string", setter: "color", defaultValue: "#ef4444", ...COLOR_SWATCHES_META },
        rankBackgroundColor: { label: "排名底色", type: "string", setter: "color", defaultValue: "#fff1f2", ...COLOR_SWATCHES_META },
        limit: { label: "展示数量", type: "number", setter: "number", defaultValue: 5 },
        items: { label: "商品数据", type: "array", setter: "dataSourceSelector", defaultValue: [] },
      },
      events: [{ name: "onProductClick", title: "点击榜单商品" }],
    }),
  },
  {
    component: BrandFeatureSection,
    manifest: createMaterialManifest({
      componentName: "BrandFeatureSection",
      materialVersion: "0.1.0",
      title: "品牌专题",
      category: "marketing",
      platforms: ["h5"],
      defaultProps: {
        brandName: "MeuMall Select",
        title: "夏日品牌馆",
        description: "精选品牌当季新品与平台补贴权益，帮助用户快速进入品牌导购场景。",
        badgeText: "品牌专题",
        buttonText: "进入品牌",
        coverImageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
        logoImageUrl: "",
        linkUrl: "",
        backgroundColor: "#f8fafc",
        cardBackgroundColor: "#ffffff",
        pointBackgroundColor: "#f8fafc",
        titleColor: "#111827",
        textColor: "#374151",
        accentColor: "#111827",
        sellingPoints: [
          { id: "point_1", title: "会员专享", desc: "品牌券叠加平台补贴" },
          { id: "point_2", title: "当季新品", desc: "通勤、度假和日常穿搭一次配齐" },
        ],
        items: [],
      },
      dataSourceSlots: [{ name: "items", acceptedTypes: ["product.byIds", "product.byActivity"] }],
      propsSchema: {
        brandName: { label: "品牌名", type: "string", setter: "input", defaultValue: "MeuMall Select" },
        title: { label: "标题", type: "string", setter: "input", defaultValue: "夏日品牌馆" },
        description: { label: "说明", type: "string", setter: "textarea", defaultValue: "精选品牌当季新品与平台补贴权益，帮助用户快速进入品牌导购场景。" },
        badgeText: { label: "角标", type: "string", setter: "input", defaultValue: "品牌专题" },
        buttonText: { label: "按钮文案", type: "string", setter: "input", defaultValue: "进入品牌" },
        coverImageUrl: { label: "封面图", type: "string", setter: "image", defaultValue: "" },
        logoImageUrl: { label: "Logo", type: "string", setter: "image", defaultValue: "" },
        linkUrl: { label: "跳转链接", type: "string", setter: "input", defaultValue: "" },
        backgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "#f8fafc", ...COLOR_SWATCHES_META },
        cardBackgroundColor: { label: "卡片背景", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        pointBackgroundColor: { label: "卖点底色", type: "string", setter: "color", defaultValue: "#f8fafc", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "正文色", type: "string", setter: "color", defaultValue: "#374151", ...COLOR_SWATCHES_META },
        accentColor: { label: "强调色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        sellingPoints: { label: "卖点列表", type: "array", setter: "textarea", defaultValue: [] },
        items: { label: "商品数据", type: "array", setter: "dataSourceSelector", defaultValue: [] },
      },
      events: [
        { name: "onEnter", title: "点击进入品牌" },
        { name: "onProductClick", title: "点击品牌商品" },
      ],
    }),
  },
  {
    component: StoreExpertSection,
    manifest: createMaterialManifest({
      componentName: "StoreExpertSection",
      materialVersion: "0.1.0",
      title: "门店/达人推荐",
      category: "commerce",
      platforms: ["h5"],
      defaultProps: {
        title: "门店/达人推荐",
        subtitle: "精选门店和达人内容，帮助用户快速进入转化场景。",
        badgeText: "精选",
        buttonText: "查看",
        backgroundColor: "#f8fafc",
        cardBackgroundColor: "#ffffff",
        titleColor: "#111827",
        accentColor: "#0f766e",
        items: [
          {
            id: "store_jingan",
            typeText: "门店",
            title: "MeuMall 上海静安店",
            subtitle: "本周热卖搭配到店试穿",
            metricText: "4.9 分",
            desc: "距你 2.1km",
            imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80",
          },
          {
            id: "expert_summer",
            typeText: "达人",
            title: "小夏的通勤穿搭",
            subtitle: "每日更新包袋和鞋履组合",
            metricText: "12.8w 粉丝",
            desc: "直播中",
            imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
          },
        ],
      },
      dataSourceSlots: [{ name: "items", acceptedTypes: ["store.byIds", "expert.byActivity"] }],
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "门店/达人推荐" },
        subtitle: { label: "说明", type: "string", setter: "textarea", defaultValue: "精选门店和达人内容，帮助用户快速进入转化场景。" },
        badgeText: { label: "角标", type: "string", setter: "input", defaultValue: "精选" },
        buttonText: { label: "按钮文案", type: "string", setter: "input", defaultValue: "查看" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#f8fafc", ...COLOR_SWATCHES_META },
        cardBackgroundColor: { label: "卡片背景", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        accentColor: { label: "强调色", type: "string", setter: "color", defaultValue: "#0f766e", ...COLOR_SWATCHES_META },
        items: { label: "推荐列表", type: "array", setter: "textarea", defaultValue: [] },
      },
      events: [{ name: "onItemClick", title: "点击推荐项" }],
    }),
  },
  {
    component: LiveEntry,
    manifest: createMaterialManifest({
      componentName: "LiveEntry",
      materialVersion: "0.1.0",
      title: "直播入口",
      category: "marketing",
      platforms: ["h5"],
      defaultProps: {
        title: "今晚 8 点直播专场",
        subtitle: "主播讲解爆品搭配，限时券和专属福利同步发放。",
        statusText: "直播中",
        viewerText: "12.8w 人正在看",
        buttonText: "进入直播",
        coverImageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=300&q=80",
        linkUrl: "",
        backgroundColor: "#111827",
        titleColor: "#ffffff",
        textColor: "#d1d5db",
        accentColor: "#ef4444",
      },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "今晚 8 点直播专场" },
        subtitle: { label: "说明", type: "string", setter: "textarea", defaultValue: "主播讲解爆品搭配，限时券和专属福利同步发放。" },
        statusText: { label: "状态文案", type: "string", setter: "input", defaultValue: "直播中" },
        viewerText: { label: "观看文案", type: "string", setter: "input", defaultValue: "12.8w 人正在看" },
        buttonText: { label: "按钮文案", type: "string", setter: "input", defaultValue: "进入直播" },
        coverImageUrl: { label: "封面图", type: "string", setter: "image", defaultValue: "" },
        linkUrl: { label: "直播链接", type: "string", setter: "input", defaultValue: "" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#d1d5db", ...COLOR_SWATCHES_META },
        accentColor: { label: "强调色", type: "string", setter: "color", defaultValue: "#ef4444", ...COLOR_SWATCHES_META },
      },
      events: [{ name: "onEnter", title: "进入直播" }],
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
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#fff7ed", ...COLOR_SWATCHES_META },
        buttonColor: { label: "按钮色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
      },
      events: [{ name: "onReceive", title: "点击领取" }],
    }),
  },
  {
    component: CouponBundle,
    manifest: createMaterialManifest({
      componentName: "CouponBundle",
      materialVersion: "0.1.0",
      title: "组合券包",
      category: "marketing",
      platforms: ["h5"],
      defaultProps: {
        title: "新人组合券",
        subtitle: "多张优惠券一次领取，下单更划算。",
        receiveAllText: "一键领取",
        receiveText: "领取",
        backgroundColor: "#fff7ed",
        titleColor: "#9a3412",
        amountColor: "#dc2626",
        buttonColor: "#ea580c",
        coupons: [
          { id: "coupon_30", title: "满 199 减 30", thresholdText: "全场可用", valueText: "¥30", expireText: "领取后 7 天有效" },
          { id: "coupon_80", title: "满 399 减 80", thresholdText: "精选商品", valueText: "¥80", expireText: "数量有限" },
        ],
      },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", defaultValue: "新人组合券" },
        subtitle: { label: "说明", type: "string", setter: "textarea", defaultValue: "多张优惠券一次领取，下单更划算。" },
        receiveAllText: { label: "批量按钮", type: "string", setter: "input", defaultValue: "一键领取" },
        receiveText: { label: "单券按钮", type: "string", setter: "input", defaultValue: "领取" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#fff7ed", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#9a3412", ...COLOR_SWATCHES_META },
        amountColor: { label: "金额色", type: "string", setter: "color", defaultValue: "#dc2626", ...COLOR_SWATCHES_META },
        buttonColor: { label: "按钮色", type: "string", setter: "color", defaultValue: "#ea580c", ...COLOR_SWATCHES_META },
        coupons: { label: "优惠券列表", type: "array", setter: "textarea", defaultValue: [] },
      },
      events: [
        { name: "onReceive", title: "点击单券" },
        { name: "onReceiveAll", title: "点击一键领取" },
      ],
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
        primaryColor: { label: "强调色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#374151", ...COLOR_SWATCHES_META },
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
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#f3f4f6", ...COLOR_SWATCHES_META },
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
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#dc2626", ...COLOR_SWATCHES_META },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        numberColor: { label: "数字色", type: "string", setter: "color", defaultValue: "#dc2626", ...COLOR_SWATCHES_META },
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
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        itemBackgroundColor: { label: "项背景色", type: "string", setter: "color", defaultValue: "#f8fafc", ...COLOR_SWATCHES_META },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
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
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        itemBackgroundColor: { label: "项背景色", type: "string", setter: "color", defaultValue: "#f3f4f6", ...COLOR_SWATCHES_META },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
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
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
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
