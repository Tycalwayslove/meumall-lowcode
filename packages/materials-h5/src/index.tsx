import React from "react";
import type { LowcodeMaterial } from "@meumall/lowcode-core";
import { createMaterialManifest, type JsonObject, type LowcodeNode } from "@meumall/lowcode-schema";
import { MlcButton, MlcCheckbox, MlcCountdownText, MlcDivider, MlcImage, MlcInput, MlcModal, MlcNoticeBar, MlcPrice, MlcRadioGroup, MlcRichText, MlcSelect, MlcSpacer, MlcStepper, MlcSwitch, MlcTabs, MlcTag, MlcText, MlcTextarea } from "./primitives/index.js";

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

function boolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function option<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? value as T : fallback;
}

function list(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function basicStepperRange(props: Record<string, unknown>) {
  const rawMin = number(props.min, 0);
  const rawMax = number(props.max, 99);
  const min = Math.min(rawMin, rawMax);
  const max = Math.max(rawMin, rawMax);
  const step = Math.max(1, number(props.step, 1));
  const defaultValue = Math.min(max, Math.max(min, number(props.defaultValue, min)));
  return { min, max, step, defaultValue };
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
  const titleColor = text(props.titleColor, "#111827");
  const textColor = text(props.textColor, "#64748b");
  const titleSize = number(props.titleSize, 24);
  const imageRadius = number(props.imageRadius, 8);
  const paddingY = number(props.paddingY, 18);
  const titleLineHeight = number(props.titleLineHeight, 1.2);
  const subtitleLineHeight = number(props.subtitleLineHeight, 1.6);
  return (
    <section className="mlc-material mlc-activity-hero" style={{ padding: `${paddingY}px 16px`, background: text(props.backgroundColor, "#ffffff") }}>
      {imageUrl ? (
        <MlcImage src={imageUrl} alt={text(props.title)} radius={imageRadius} />
      ) : null}
      <MlcText
        as="h1"
        size={titleSize}
        weight={900}
        lineHeight={titleLineHeight}
        style={{ margin: imageUrl ? "14px 0 6px" : "0 0 6px", color: titleColor }}
      >
        {text(props.title, "活动标题")}
      </MlcText>
      <MlcText as="p" size={14} lineHeight={subtitleLineHeight} style={{ color: textColor }}>
        {text(props.subtitle)}
      </MlcText>
      {children}
    </section>
  );
}

export function ImageBanner({ props }: MaterialProps) {
  const imageUrl = text(props.imageUrl);
  if (!imageUrl) return null;
  return (
    <MlcImage
      src={imageUrl}
      alt={text(props.alt)}
      radius={number(props.radius, 0)}
    />
  );
}

type BasicButtonVariant = "solid" | "outline" | "ghost";
type BasicButtonSize = "sm" | "md" | "lg";
type BasicInputType = "text" | "tel" | "email" | "number";
type BasicTextAs = "span" | "p" | "strong" | "h1" | "h2" | "h3";
type BasicTextAlign = "left" | "center" | "right";
type DividerLineStyle = "solid" | "dashed" | "dotted";
type BasicImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";
type BasicTagTone = "neutral" | "accent" | "danger" | "inverse";
type BasicInlineAlign = "left" | "center" | "right";
type BasicCarouselIndicator = "dots" | "counter" | "none";

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

const BASIC_SELECT_FALLBACK_OPTIONS: JsonObject[] = [
  { label: "女装会场", value: "women" },
  { label: "鞋包配饰", value: "accessories" },
  { label: "直播专场", value: "live" },
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

const BASIC_CAROUSEL_INDICATOR_OPTIONS = [
  { label: "圆点", value: "dots" },
  { label: "数字", value: "counter" },
  { label: "隐藏", value: "none" },
];

const NUMBER_PIXEL_SIZE_META = { min: 0, max: 80, step: 1, unit: "px" };
const NUMBER_RADIUS_META = { min: 0, max: 48, step: 1, unit: "px" };
const NUMBER_PILL_RADIUS_META = { min: 0, max: 999, step: 1, unit: "px" };
const NUMBER_BORDER_WIDTH_META = { min: 0, max: 8, step: 1, unit: "px" };
const NUMBER_FONT_SIZE_META = { min: 10, max: 48, step: 1, unit: "px" };
const NUMBER_FONT_WEIGHT_META = { min: 100, max: 900, step: 100 };
const NUMBER_LINE_HEIGHT_META = { min: 1, max: 2.5, step: 0.1, unit: "倍" };
const NUMBER_TEXTAREA_ROWS_META = { min: 2, max: 8, step: 1 };
const NUMBER_STEPPER_VALUE_META = { min: 0, max: 999, step: 1 };
const NUMBER_STEPPER_STEP_META = { min: 1, max: 20, step: 1 };
const NUMBER_COLUMNS_1_TO_3_META = { min: 1, max: 3, step: 1 };
const NUMBER_CAROUSEL_INTERVAL_META = { min: 1000, max: 10000, step: 500, unit: "ms" };
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

const PRODUCT_LIST_DEFAULT_ITEMS = [
  {
    id: "sku_001",
    title: "轻盈通勤手提包",
    priceText: "¥199",
    originPriceText: "¥269",
    desc: "活动价",
    imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sku_002",
    title: "夏季舒适凉鞋",
    priceText: "¥129",
    originPriceText: "¥189",
    desc: "限时补贴",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80",
  },
];

export function BasicButton({ props }: MaterialProps) {
  const variant = option<BasicButtonVariant>(props.variant, ["solid", "outline", "ghost"], "solid");
  const size = option<BasicButtonSize>(props.size, ["sm", "md", "lg"], "md");
  const backgroundColor = text(props.backgroundColor, "#111827");
  const borderColor = text(props.borderColor, backgroundColor);
  const textColor = text(props.textColor, variant === "solid" ? "#ffffff" : backgroundColor);
  const handler = props.onClick;

  return (
    <section
      className="mlc-material mlc-basic-button"
      style={{
        padding: `${number(props.paddingY, 12)}px 16px`,
        background: text(props.wrapperBackgroundColor, "transparent"),
      }}
    >
      <MlcButton
        block={boolean(props.block, true)}
        variant={variant}
        size={size}
        radius={number(props.radius, 8)}
        disabled={boolean(props.disabled)}
        loading={boolean(props.loading)}
        onClick={() => {
          if (typeof handler === "function") handler();
        }}
        style={{
          borderColor,
          color: textColor,
          background: variant === "solid" ? backgroundColor : "transparent",
        }}
      >
        {text(props.text, "基础按钮")}
      </MlcButton>
    </section>
  );
}

export function BasicInput({ props }: MaterialProps) {
  const [value, setValue] = React.useState(text(props.defaultValue));
  const inputType = option<BasicInputType>(props.type, ["text", "tel", "email", "number"], "text");
  const label = text(props.label, "基础输入框");
  const helperText = text(props.helperText);
  const handler = props.onChange;

  React.useEffect(() => {
    setValue(text(props.defaultValue));
  }, [props.defaultValue]);

  return (
    <section
      className="mlc-material mlc-basic-input"
      style={{
        display: "grid",
        gap: 8,
        padding: `${number(props.paddingY, 12)}px 16px`,
        color: text(props.textColor, "#111827"),
        background: text(props.wrapperBackgroundColor, "transparent"),
      }}
    >
      {label ? (
        <MlcText as="strong" size={13} weight={800} style={{ color: text(props.labelColor, "#111827") }}>
          {label}
        </MlcText>
      ) : null}
      <MlcInput
        value={value}
        type={inputType}
        placeholder={text(props.placeholder, "请输入内容")}
        disabled={boolean(props.disabled)}
        radius={number(props.radius, 8)}
        onChange={(nextValue) => {
          setValue(nextValue);
          if (typeof handler === "function") handler(nextValue);
        }}
        style={{
          borderColor: text(props.borderColor, "#e5e7eb"),
          color: text(props.textColor, "#111827"),
          background: text(props.inputBackgroundColor, "#ffffff"),
        }}
      />
      {helperText ? (
        <MlcText as="p" size={12} tone="muted" style={{ color: text(props.helperColor, "#64748b") }}>
          {helperText}
        </MlcText>
      ) : null}
    </section>
  );
}

export function BasicTextarea({ props }: MaterialProps) {
  const [value, setValue] = React.useState(text(props.defaultValue));
  const label = text(props.label, "基础多行输入");
  const helperText = text(props.helperText);
  const handler = props.onChange;

  React.useEffect(() => {
    setValue(text(props.defaultValue));
  }, [props.defaultValue]);

  return (
    <section
      className="mlc-material mlc-basic-textarea"
      style={{
        display: "grid",
        gap: 8,
        padding: `${number(props.paddingY, 12)}px 16px`,
        color: text(props.textColor, "#111827"),
        background: text(props.wrapperBackgroundColor, "transparent"),
      }}
    >
      {label ? (
        <MlcText as="strong" size={13} weight={800} style={{ color: text(props.labelColor, "#111827") }}>
          {label}
        </MlcText>
      ) : null}
      <MlcTextarea
        value={value}
        rows={number(props.rows, 3)}
        placeholder={text(props.placeholder, "请输入多行内容")}
        disabled={boolean(props.disabled)}
        radius={number(props.radius, 8)}
        onChange={(nextValue) => {
          setValue(nextValue);
          if (typeof handler === "function") handler(nextValue);
        }}
        style={{
          borderColor: text(props.borderColor, "#e5e7eb"),
          color: text(props.textColor, "#111827"),
          background: text(props.textareaBackgroundColor, "#ffffff"),
        }}
      />
      {helperText ? (
        <MlcText as="p" size={12} tone="muted" style={{ color: text(props.helperColor, "#64748b") }}>
          {helperText}
        </MlcText>
      ) : null}
    </section>
  );
}

export function BasicSelect({ props }: MaterialProps) {
  const [value, setValue] = React.useState(text(props.defaultValue));
  const label = text(props.label, "基础选择框");
  const helperText = text(props.helperText);
  const options = list(props.options).length ? list(props.options) : BASIC_SELECT_FALLBACK_OPTIONS;
  const handler = props.onChange;

  React.useEffect(() => {
    setValue(text(props.defaultValue));
  }, [props.defaultValue]);

  return (
    <section
      className="mlc-material mlc-basic-select"
      style={{
        display: "grid",
        gap: 8,
        padding: `${number(props.paddingY, 12)}px 16px`,
        color: text(props.textColor, "#111827"),
        background: text(props.wrapperBackgroundColor, "transparent"),
      }}
    >
      {label ? (
        <MlcText as="strong" size={13} weight={800} style={{ color: text(props.labelColor, "#111827") }}>
          {label}
        </MlcText>
      ) : null}
      <MlcSelect
        value={value}
        placeholder={text(props.placeholder, "请选择")}
        disabled={boolean(props.disabled)}
        radius={number(props.radius, 8)}
        options={options.map((item) => ({
          label: text(item.label, text(item.value)),
          value: text(item.value),
          disabled: boolean(item.disabled),
        }))}
        onChange={(nextValue) => {
          setValue(nextValue);
          if (typeof handler === "function") handler(nextValue);
        }}
        style={{
          borderColor: text(props.borderColor, "#e5e7eb"),
          color: text(props.textColor, "#111827"),
          background: text(props.selectBackgroundColor, "#ffffff"),
        }}
      />
      {helperText ? (
        <MlcText as="p" size={12} tone="muted" style={{ color: text(props.helperColor, "#64748b") }}>
          {helperText}
        </MlcText>
      ) : null}
    </section>
  );
}

export function BasicRadioGroup({ props }: MaterialProps) {
  const [value, setValue] = React.useState(text(props.defaultValue));
  const label = text(props.label, "基础单选组");
  const helperText = text(props.helperText);
  const options = list(props.options).length ? list(props.options) : BASIC_SELECT_FALLBACK_OPTIONS;
  const handler = props.onChange;

  React.useEffect(() => {
    setValue(text(props.defaultValue));
  }, [props.defaultValue]);

  return (
    <section
      className="mlc-material mlc-basic-radio-group"
      style={{
        display: "grid",
        gap: 8,
        padding: `${number(props.paddingY, 12)}px 16px`,
        color: text(props.textColor, "#111827"),
        background: text(props.wrapperBackgroundColor, "transparent"),
      }}
    >
      {label ? (
        <MlcText as="strong" size={13} weight={800} style={{ color: text(props.labelColor, "#111827") }}>
          {label}
        </MlcText>
      ) : null}
      <MlcRadioGroup
        value={value}
        disabled={boolean(props.disabled)}
        radius={number(props.radius, 8)}
        activeColor={text(props.activeColor, "#0f766e")}
        borderColor={text(props.borderColor, "#e5e7eb")}
        textColor={text(props.textColor, "#111827")}
        backgroundColor={text(props.optionBackgroundColor, "#ffffff")}
        options={options.map((item) => ({
          label: text(item.label, text(item.value)),
          value: text(item.value),
          disabled: boolean(item.disabled),
        }))}
        onChange={(nextValue) => {
          setValue(nextValue);
          if (typeof handler === "function") handler(nextValue);
        }}
      />
      {helperText ? (
        <MlcText as="p" size={12} tone="muted" style={{ color: text(props.helperColor, "#64748b") }}>
          {helperText}
        </MlcText>
      ) : null}
    </section>
  );
}

export function BasicStepper({ props }: MaterialProps) {
  const range = basicStepperRange(props);
  const [value, setValue] = React.useState(range.defaultValue);
  const label = text(props.label, "基础步进器");
  const helperText = text(props.helperText);
  const handler = props.onChange;

  React.useEffect(() => {
    setValue(basicStepperRange(props).defaultValue);
  }, [props.defaultValue, props.min, props.max]);

  return (
    <section
      className="mlc-material mlc-basic-stepper"
      style={{
        display: "grid",
        gap: 8,
        padding: `${number(props.paddingY, 12)}px 16px`,
        color: text(props.textColor, "#111827"),
        background: text(props.wrapperBackgroundColor, "transparent"),
      }}
    >
      {label ? (
        <MlcText as="strong" size={13} weight={800} style={{ color: text(props.labelColor, "#111827") }}>
          {label}
        </MlcText>
      ) : null}
      <MlcStepper
        value={value}
        min={range.min}
        max={range.max}
        step={range.step}
        disabled={boolean(props.disabled)}
        accentColor={text(props.accentColor, "#0f766e")}
        borderColor={text(props.borderColor, "#e5e7eb")}
        textColor={text(props.textColor, "#111827")}
        buttonBackgroundColor={text(props.buttonBackgroundColor, "#ffffff")}
        radius={number(props.radius, 8)}
        onChange={(nextValue) => {
          setValue(nextValue);
          if (typeof handler === "function") handler(nextValue);
        }}
      />
      {helperText ? (
        <MlcText as="p" size={12} tone="muted" style={{ color: text(props.helperColor, "#64748b") }}>
          {helperText}
        </MlcText>
      ) : null}
    </section>
  );
}

export function BasicSwitch({ props }: MaterialProps) {
  const [checked, setChecked] = React.useState(boolean(props.defaultChecked));
  const label = text(props.label, "基础开关");
  const checkedText = text(props.checkedText, "已开启");
  const uncheckedText = text(props.uncheckedText, "已关闭");
  const helperText = text(props.helperText);
  const handler = props.onChange;

  React.useEffect(() => {
    setChecked(boolean(props.defaultChecked));
  }, [props.defaultChecked]);

  return (
    <section
      className="mlc-material mlc-basic-switch"
      style={{
        padding: `${number(props.paddingY, 12)}px 16px`,
        color: text(props.labelColor, "#111827"),
        background: text(props.wrapperBackgroundColor, "transparent"),
      }}
    >
      <MlcSwitch
        checked={checked}
        disabled={boolean(props.disabled)}
        activeColor={text(props.activeColor, "#0f766e")}
        inactiveColor={text(props.inactiveColor, "#cbd5e1")}
        thumbColor={text(props.thumbColor, "#ffffff")}
        onChange={(nextChecked) => {
          setChecked(nextChecked);
          if (typeof handler === "function") handler(nextChecked);
        }}
        label={
          <span style={{ display: "grid", gap: 2 }}>
            <MlcText as="strong" size={13} weight={800} style={{ color: text(props.labelColor, "#111827") }}>
              {label}
            </MlcText>
            <MlcText size={12} tone="muted" style={{ color: text(props.stateTextColor, "#64748b") }}>
              {checked ? checkedText : uncheckedText}
            </MlcText>
          </span>
        }
      />
      {helperText ? (
        <MlcText as="p" size={12} tone="muted" style={{ display: "block", marginTop: 6, color: text(props.helperColor, "#64748b") }}>
          {helperText}
        </MlcText>
      ) : null}
    </section>
  );
}

export function BasicCheckbox({ props }: MaterialProps) {
  const [checked, setChecked] = React.useState(boolean(props.defaultChecked));
  const label = text(props.label, "基础复选框");
  const helperText = text(props.helperText);
  const handler = props.onChange;

  React.useEffect(() => {
    setChecked(boolean(props.defaultChecked));
  }, [props.defaultChecked]);

  return (
    <section
      className="mlc-material mlc-basic-checkbox"
      style={{
        padding: `${number(props.paddingY, 12)}px 16px`,
        color: text(props.labelColor, "#111827"),
        background: text(props.wrapperBackgroundColor, "transparent"),
      }}
    >
      <MlcCheckbox
        checked={checked}
        disabled={boolean(props.disabled)}
        checkedColor={text(props.checkedColor, "#0f766e")}
        borderColor={text(props.borderColor, "#cbd5e1")}
        markColor={text(props.markColor, "#ffffff")}
        radius={number(props.radius, 6)}
        onChange={(nextChecked) => {
          setChecked(nextChecked);
          if (typeof handler === "function") handler(nextChecked);
        }}
        label={
          <MlcText as="strong" size={13} weight={800} style={{ color: text(props.labelColor, "#111827") }}>
            {label}
          </MlcText>
        }
      />
      {helperText ? (
        <MlcText as="p" size={12} tone="muted" style={{ display: "block", margin: "6px 0 0 32px", color: text(props.helperColor, "#64748b") }}>
          {helperText}
        </MlcText>
      ) : null}
    </section>
  );
}

export function BasicText({ props }: MaterialProps) {
  const as = option<BasicTextAs>(props.as, ["span", "p", "strong", "h1", "h2", "h3"], "p");
  const align = option<BasicTextAlign>(props.align, ["left", "center", "right"], "left");
  const content = text(props.text, "基础文本");

  return (
    <section
      className="mlc-material mlc-basic-text"
      style={{
        padding: `${number(props.paddingY, 10)}px 16px`,
        color: text(props.color, "#111827"),
        background: text(props.backgroundColor, "transparent"),
        textAlign: align,
      }}
    >
      <MlcText
        as={as}
        size={number(props.fontSize, 14)}
        weight={number(props.fontWeight, 400)}
        lineHeight={number(props.lineHeight, 1.6)}
        style={{
          display: as === "span" || as === "strong" ? "inline" : "block",
          color: text(props.color, "#111827"),
          whiteSpace: "pre-line",
        }}
      >
        {content}
      </MlcText>
    </section>
  );
}

export function DividerBlock({ props }: MaterialProps) {
  const lineStyle = option<DividerLineStyle>(props.lineStyle, ["solid", "dashed", "dotted"], "solid");

  return (
    <section
      className="mlc-material mlc-divider-block"
      style={{
        padding: `${number(props.paddingY, 12)}px 0`,
        background: text(props.backgroundColor, "transparent"),
      }}
    >
      <MlcDivider
        color={text(props.color, "#e5e7eb")}
        thickness={number(props.thickness, 1)}
        lineStyle={lineStyle}
        inset={number(props.inset, 16)}
      />
    </section>
  );
}

export function BasicImage({ props }: MaterialProps) {
  const imageUrl = text(props.imageUrl);
  const fit = option<BasicImageFit>(props.fit, ["cover", "contain", "fill", "none", "scale-down"], "cover");

  return (
    <section
      className="mlc-material mlc-basic-image"
      style={{
        padding: `${number(props.paddingY, 12)}px 16px`,
        background: text(props.backgroundColor, "transparent"),
      }}
    >
      <MlcImage
        src={imageUrl}
        alt={text(props.alt)}
        ratio={text(props.ratio, "16 / 9")}
        fit={fit}
        radius={number(props.radius, 8)}
        fallback={
          <div
            className="mlc-basic-image__empty"
            style={{
              display: "grid",
              placeItems: "center",
              minHeight: 120,
              border: "1px dashed #cbd5e1",
              borderRadius: number(props.radius, 8),
              color: "#64748b",
              background: "#f8fafc",
              fontSize: 13,
            }}
          >
            请配置图片
          </div>
        }
      />
    </section>
  );
}

export function BasicTag({ props }: MaterialProps) {
  const tone = option<BasicTagTone>(props.tone, ["neutral", "accent", "danger", "inverse"], "accent");
  const align = option<BasicInlineAlign>(props.align, ["left", "center", "right"], "left");

  return (
    <section
      className="mlc-material mlc-basic-tag"
      style={{
        padding: `${number(props.paddingY, 10)}px 16px`,
        background: text(props.wrapperBackgroundColor, "transparent"),
        textAlign: align,
      }}
    >
      <MlcTag
        tone={tone}
        radius={number(props.radius, 999)}
        style={{
          color: text(props.textColor, "#0f766e"),
          background: text(props.backgroundColor, "rgba(15, 118, 110, 0.1)"),
          fontSize: number(props.fontSize, 12),
          fontWeight: number(props.fontWeight, 800),
        }}
      >
        {text(props.text, "基础标签")}
      </MlcTag>
    </section>
  );
}

export function BasicCard({ props }: MaterialProps) {
  const imageUrl = text(props.imageUrl);
  const fit = option<BasicImageFit>(props.fit, ["cover", "contain", "fill", "none", "scale-down"], "cover");
  const badgeText = text(props.badgeText);
  const description = text(props.description);
  const buttonText = text(props.buttonText);
  const accentColor = text(props.accentColor, "#0f766e");
  const radius = number(props.radius, 12);
  const borderWidth = number(props.borderWidth, 1);
  const handler = props.onClick;

  return (
    <section
      className="mlc-material mlc-basic-card"
      style={{
        padding: `${number(props.paddingY, 12)}px 16px`,
        background: text(props.wrapperBackgroundColor, "transparent"),
      }}
    >
      <article
        className="mlc-basic-card__inner"
        style={{
          overflow: "hidden",
          color: text(props.textColor, "#64748b"),
          background: text(props.cardBackgroundColor, "#ffffff"),
          border: borderWidth > 0 ? `${borderWidth}px solid ${text(props.borderColor, "#e5e7eb")}` : undefined,
          borderRadius: radius,
          boxShadow: boolean(props.shadow) ? "0 10px 24px rgba(15, 23, 42, 0.08)" : undefined,
        }}
      >
        {imageUrl ? (
          <MlcImage
            src={imageUrl}
            alt={text(props.alt)}
            ratio={text(props.ratio, "16 / 9")}
            fit={fit}
            radius={0}
          />
        ) : null}
        <div style={{ display: "grid", gap: 8, padding: number(props.contentPadding, 12) }}>
          {badgeText ? (
            <MlcTag
              radius={999}
              style={{
                width: "fit-content",
                color: accentColor,
                background: text(props.badgeBackgroundColor, "rgba(15, 118, 110, 0.1)"),
              }}
            >
              {badgeText}
            </MlcTag>
          ) : null}
          <MlcText
            as="strong"
            size={number(props.titleSize, 16)}
            weight={800}
            lineHeight={1.35}
            style={{ color: text(props.titleColor, "#111827") }}
          >
            {text(props.title, "基础图文卡片")}
          </MlcText>
          {description ? (
            <MlcText as="p" size={13} tone="muted" lineHeight={1.55} style={{ color: text(props.textColor, "#64748b") }}>
              {description}
            </MlcText>
          ) : null}
          {buttonText && boolean(props.showButton, true) ? (
            <MlcButton
              size="sm"
              radius={number(props.buttonRadius, 999)}
              onClick={() => {
                if (typeof handler === "function") handler();
              }}
              style={{
                width: "fit-content",
                borderColor: accentColor,
                color: text(props.buttonTextColor, "#ffffff"),
                background: accentColor,
              }}
            >
              {buttonText}
            </MlcButton>
          ) : null}
        </div>
      </article>
    </section>
  );
}

const BASIC_CAROUSEL_FALLBACK_ITEMS: JsonObject[] = [
  {
    id: "hero",
    title: "新品首发",
    subtitle: "多张图片承载活动主视觉和会场入口",
    badgeText: "NEW",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    linkUrl: "",
  },
  {
    id: "deal",
    title: "限时好价",
    subtitle: "支持标题、说明、角标和点击事件",
    badgeText: "HOT",
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
    linkUrl: "",
  },
];

export function BasicCarousel({ props }: MaterialProps) {
  const items = list(props.items);
  const visibleItems = items.length ? items : BASIC_CAROUSEL_FALLBACK_ITEMS;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const radius = number(props.radius, 12);
  const indicator = option<BasicCarouselIndicator>(props.indicator, ["dots", "counter", "none"], "dots");
  const imageFit = option<BasicImageFit>(props.fit, ["cover", "contain", "fill", "none", "scale-down"], "cover");
  const accentColor = text(props.accentColor, "#ffffff");
  const onItemClick = props.onItemClick;
  const safeIndex = Math.min(activeIndex, Math.max(visibleItems.length - 1, 0));
  const activeItem = visibleItems[safeIndex] ?? visibleItems[0];

  React.useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(visibleItems.length - 1, 0)));
  }, [visibleItems.length]);

  React.useEffect(() => {
    if (!boolean(props.autoPlay, true) || visibleItems.length <= 1) return undefined;
    const interval = Math.max(1000, number(props.interval, 3000));
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visibleItems.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [props.autoPlay, props.interval, visibleItems.length]);

  return (
    <section
      className="mlc-material mlc-basic-carousel"
      style={{
        padding: `${number(props.paddingY, 12)}px 16px`,
        background: text(props.wrapperBackgroundColor, "transparent"),
      }}
    >
      <button
        type="button"
        className="mlc-basic-carousel__frame"
        onClick={() => {
          if (typeof onItemClick === "function") onItemClick(activeItem);
        }}
        style={{
          position: "relative",
          display: "block",
          overflow: "hidden",
          width: "100%",
          border: 0,
          borderRadius: radius,
          padding: 0,
          color: text(props.textColor, "#ffffff"),
          background: text(props.backgroundColor, "#111827"),
          textAlign: "left",
          boxShadow: boolean(props.shadow, true) ? "0 12px 30px rgba(15, 23, 42, 0.14)" : undefined,
        }}
      >
        <MlcImage
          src={text(activeItem.imageUrl)}
          alt={text(activeItem.alt, text(activeItem.title, "轮播图片"))}
          ratio={text(props.ratio, "16 / 9")}
          fit={imageFit}
          radius={0}
          fallback={
            <div
              style={{
                display: "grid",
                placeItems: "center",
                minHeight: 156,
                color: "#64748b",
                background: "#f8fafc",
                fontSize: 13,
              }}
            >
              请配置轮播图片
            </div>
          }
        />
        <div
          className="mlc-basic-carousel__overlay"
          style={{
            position: "absolute",
            inset: "auto 0 0",
            display: "grid",
            gap: 6,
            padding: "40px 14px 14px",
            background: "linear-gradient(180deg, rgba(15, 23, 42, 0), rgba(15, 23, 42, 0.68))",
          }}
        >
          {text(activeItem.badgeText) ? (
            <MlcTag radius={999} style={{ width: "fit-content", color: accentColor, background: "rgba(255, 255, 255, 0.18)" }}>
              {text(activeItem.badgeText)}
            </MlcTag>
          ) : null}
          <MlcText as="strong" size={number(props.titleSize, 18)} weight={900} lineHeight={1.25} style={{ color: text(props.titleColor, "#ffffff") }}>
            {text(activeItem.title, "基础图片轮播")}
          </MlcText>
          {text(activeItem.subtitle) ? (
            <MlcText as="p" size={13} lineHeight={1.45} style={{ color: text(props.textColor, "rgba(255, 255, 255, 0.86)") }}>
              {text(activeItem.subtitle)}
            </MlcText>
          ) : null}
        </div>
      </button>
      {indicator !== "none" && visibleItems.length > 1 ? (
        <div
          className="mlc-basic-carousel__indicator"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 6,
            marginTop: 8,
            color: text(props.indicatorColor, "#64748b"),
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {indicator === "counter"
            ? `${safeIndex + 1}/${visibleItems.length}`
            : visibleItems.map((item, index) => (
                <button
                  key={String(item.id ?? index)}
                  type="button"
                  aria-label={`切换到第 ${index + 1} 张`}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    width: index === safeIndex ? 16 : 6,
                    height: 6,
                    border: 0,
                    borderRadius: 999,
                    padding: 0,
                    background: index === safeIndex ? text(props.indicatorColor, "#111827") : "rgba(100, 116, 139, 0.28)",
                  }}
                />
              ))}
        </div>
      ) : null}
    </section>
  );
}

const BASIC_VIDEO_SAMPLE_VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const BASIC_VIDEO_SAMPLE_POSTER_URL = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

export function BasicVideo({ props }: MaterialProps) {
  const videoUrl = text(props.videoUrl);
  const posterUrl = text(props.posterUrl);
  const radius = number(props.radius, 12);
  const onPlay = props.onPlay;

  return (
    <section
      className="mlc-material mlc-basic-video"
      style={{
        padding: `${number(props.paddingY, 12)}px 16px`,
        background: text(props.wrapperBackgroundColor, "transparent"),
      }}
    >
      <article
        className="mlc-basic-video__card"
        style={{
          overflow: "hidden",
          borderRadius: radius,
          background: text(props.cardBackgroundColor, "#ffffff"),
          border: `1px solid ${text(props.borderColor, "#e5e7eb")}`,
          boxShadow: boolean(props.shadow, true) ? "0 12px 30px rgba(15, 23, 42, 0.12)" : undefined,
        }}
      >
        {videoUrl ? (
          <video
            className="mlc-basic-video__media"
            src={videoUrl}
            poster={posterUrl || undefined}
            controls={boolean(props.controls, true)}
            autoPlay={boolean(props.autoPlay)}
            muted={boolean(props.muted, true)}
            loop={boolean(props.loop)}
            playsInline={boolean(props.playsInline, true)}
            preload="metadata"
            onPlay={() => {
              if (typeof onPlay === "function") onPlay();
            }}
            style={{
              display: "block",
              width: "100%",
              aspectRatio: text(props.ratio, "16 / 9"),
              objectFit: "cover",
              background: text(props.mediaBackgroundColor, "#0f172a"),
            }}
          />
        ) : (
          <div style={{ background: text(props.mediaBackgroundColor, "#0f172a") }}>
            <MlcImage
              src={posterUrl}
              alt={text(props.title, "基础视频")}
              ratio={text(props.ratio, "16 / 9")}
              fit="cover"
              radius={0}
              fallback={
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    minHeight: 156,
                    color: "#94a3b8",
                    background: "#0f172a",
                    fontSize: 13,
                  }}
                >
                  请配置视频地址
                </div>
              }
            />
          </div>
        )}
        <div
          className="mlc-basic-video__body"
          style={{
            display: "grid",
            gap: 8,
            padding: `${number(props.contentPadding, 12)}px`,
          }}
        >
          {text(props.badgeText) ? (
            <MlcTag radius={999} style={{ width: "fit-content", color: text(props.accentColor, "#0f766e"), background: text(props.badgeBackgroundColor, "rgba(15, 118, 110, 0.1)") }}>
              {text(props.badgeText)}
            </MlcTag>
          ) : null}
          <MlcText as="strong" size={number(props.titleSize, 18)} weight={900} lineHeight={1.3} style={{ color: text(props.titleColor, "#111827") }}>
            {text(props.title, "基础视频")}
          </MlcText>
          {text(props.description) ? (
            <MlcText as="p" size={13} lineHeight={1.55} style={{ color: text(props.textColor, "#64748b") }}>
              {text(props.description)}
            </MlcText>
          ) : null}
        </div>
      </article>
    </section>
  );
}

export function SectionTitle({ props }: MaterialProps) {
  const alignValue = text(props.align, "left");
  const align = alignValue === "center" || alignValue === "right" ? alignValue : "left";
  const markerText = text(props.markerText);
  return (
    <section
      style={{
        padding: `${number(props.paddingY, 18)}px 16px 10px`,
        color: text(props.titleColor, "#111827"),
        background: text(props.backgroundColor, "#f3f4f6"),
        textAlign: align,
      }}
    >
      {markerText ? (
        <MlcTag style={{ marginBottom: 8, color: text(props.accentColor, "#0f766e") }}>
          {markerText}
        </MlcTag>
      ) : null}
      <MlcText as="h2" size={number(props.titleSize, 20)} weight={900} lineHeight={1.25} style={{ margin: 0, color: text(props.titleColor, "#111827") }}>
        {text(props.title, "区块标题")}
      </MlcText>
      {text(props.subtitle) ? (
        <MlcText
          as="p"
          tone="muted"
          style={{
            margin: "7px 0 0",
            color: text(props.textColor, "#64748b"),
            lineHeight: 1.6,
          }}
        >
          {text(props.subtitle)}
        </MlcText>
      ) : null}
    </section>
  );
}

export function ImageCardGrid({ props }: MaterialProps) {
  const cards = list(props.items);
  const columns = Math.max(1, Math.min(3, Math.round(number(props.columns, 2))));
  const onItemClick = props.onItemClick;
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
  return (
    <section
      style={{
        padding: "14px 12px 16px",
        color: text(props.titleColor, "#111827"),
        background: text(props.backgroundColor, "#f3f4f6"),
      }}
    >
      {text(props.title) ? (
        <div style={{ marginBottom: 10 }}>
          <strong style={{ display: "block", fontSize: 18, lineHeight: 1.25 }}>{text(props.title)}</strong>
          {text(props.subtitle) ? (
            <span style={{ display: "block", marginTop: 4, color: text(props.textColor, "#64748b"), fontSize: 12, lineHeight: 1.5 }}>
              {text(props.subtitle)}
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: number(props.gap, 10),
        }}
      >
        {visibleCards.map((card, index) => {
          const imageUrl = text(card.imageUrl);
          const badgeText = text(card.badgeText);
          return (
            <button
              type="button"
              key={String(card.id ?? index)}
              onClick={() => {
                if (typeof onItemClick === "function") onItemClick(card);
              }}
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: 132,
                border: 0,
                borderRadius: number(props.radius, 10),
                padding: 0,
                color: "#ffffff",
                background: text(props.cardBackgroundColor, "#111827"),
                textAlign: "left",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.1)",
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt=""
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : null}
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.72))",
                }}
              />
              {badgeText ? (
                <span
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    borderRadius: 999,
                    padding: "3px 7px",
                    color: "#ffffff",
                    background: text(props.accentColor, "#ef4444"),
                    fontSize: 11,
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {badgeText}
                </span>
              ) : null}
              <span style={{ position: "absolute", right: 10, bottom: 10, left: 10 }}>
                <strong style={{ display: "block", fontSize: 15, lineHeight: 1.25 }}>{text(card.title, "卡片标题")}</strong>
                {text(card.subtitle) ? (
                  <small style={{ display: "block", marginTop: 4, color: "rgba(255, 255, 255, 0.82)", fontSize: 12, lineHeight: 1.35 }}>
                    {text(card.subtitle)}
                  </small>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function TabsBlock({ props }: MaterialProps) {
  const items = list(props.items);
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
  return (
    <section
      style={{
        padding: `${number(props.paddingY, 14)}px 12px`,
        background: text(props.backgroundColor, "#f3f4f6"),
      }}
    >
      <div
        style={{
          overflow: "hidden",
          border: `1px solid ${text(props.borderColor, "#e5e7eb")}`,
          borderRadius: number(props.radius, 12),
          background: text(props.cardBackgroundColor, "#ffffff"),
          boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
        }}
      >
        {text(props.title) || text(props.subtitle) ? (
          <div style={{ padding: "13px 14px 8px" }}>
            {text(props.title) ? (
              <MlcText as="strong" size={17} weight={800} style={{ display: "block", color: text(props.titleColor, "#111827") }}>
                {text(props.title)}
              </MlcText>
            ) : null}
            {text(props.subtitle) ? (
              <MlcText size={12} tone="muted" style={{ display: "block", marginTop: 4, color: text(props.textColor, "#64748b") }}>
                {text(props.subtitle)}
              </MlcText>
            ) : null}
          </div>
        ) : null}
        <MlcTabs
          items={visibleItems}
          navBackgroundColor={text(props.navBackgroundColor, "#f8fafc")}
          tabBackgroundColor={text(props.tabBackgroundColor, "#ffffff")}
          activeBackgroundColor={text(props.accentColor, "#111827")}
          textColor={text(props.textColor, "#334155")}
          activeTextColor={text(props.activeTextColor, "#ffffff")}
          borderColor={text(props.borderColor, "#e5e7eb")}
          renderPanel={(activeItem) => (
            <>
              {activeItem?.badgeText ? (
                <MlcTag style={{ width: "fit-content", color: text(props.accentColor, "#0f766e") }}>
                  {String(activeItem.badgeText)}
                </MlcTag>
              ) : null}
              <MlcText as="strong" size={16} weight={800} style={{ display: "block", color: text(props.titleColor, "#111827") }}>
                {String(activeItem?.title ?? "标签内容")}
              </MlcText>
              {activeItem?.subtitle ? (
                <MlcText size={12} tone="muted" style={{ display: "block", marginTop: -5, color: text(props.textColor, "#64748b") }}>
                  {String(activeItem.subtitle)}
                </MlcText>
              ) : null}
              <MlcText as="p" size={13} style={{ color: text(props.contentColor, "#374151"), lineHeight: 1.65 }}>
                {String(activeItem?.content ?? "请配置标签内容。")}
              </MlcText>
            </>
          )}
        />
      </div>
    </section>
  );
}

export function LeadFormBlock({ props }: MaterialProps) {
  const [nameValue, setNameValue] = React.useState("");
  const [phoneValue, setPhoneValue] = React.useState("");
  const [noteValue, setNoteValue] = React.useState("");
  const minQuantity = Math.max(1, number(props.quantityMin, 1));
  const maxQuantity = Math.max(minQuantity, number(props.quantityMax, 9));
  const [quantityValue, setQuantityValue] = React.useState(Math.min(maxQuantity, Math.max(minQuantity, number(props.quantityDefault, 1))));
  const [agreed, setAgreed] = React.useState(!Boolean(props.showAgreement));
  const [submitted, setSubmitted] = React.useState(false);
  const showName = props.showName !== false;
  const showPhone = props.showPhone !== false;
  const showNote = props.showNote !== false;
  const showQuantity = props.showQuantity !== false;
  const showAgreement = props.showAgreement !== false;
  const accentColor = text(props.accentColor, "#0f766e");
  const onSubmit = props.onSubmit;
  const submitDisabled = showAgreement && !agreed;

  return (
    <section
      style={{
        padding: `${number(props.paddingY, 16)}px 12px`,
        background: text(props.backgroundColor, "#f3f4f6"),
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (submitDisabled) return;
          const payload = {
            name: nameValue,
            phone: phoneValue,
            note: noteValue,
            quantity: quantityValue,
            agreed,
          };
          setSubmitted(true);
          if (typeof onSubmit === "function") onSubmit(payload);
        }}
        style={{
          display: "grid",
          gap: 12,
          borderRadius: number(props.radius, 14),
          padding: 14,
          color: text(props.titleColor, "#111827"),
          background: text(props.cardColor, "#ffffff"),
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div style={{ display: "grid", gap: 5 }}>
          <MlcText as="strong" size={18} weight={900} style={{ color: text(props.titleColor, "#111827") }}>
            {text(props.title, "活动预约表单")}
          </MlcText>
          <MlcText as="p" tone="muted" style={{ color: text(props.textColor, "#64748b") }}>
            {text(props.description, "留下联系方式，运营可在后续接入真实提交服务。")}
          </MlcText>
        </div>
        {showName ? (
          <label style={{ display: "grid", gap: 6 }}>
            <MlcText as="span" size={12} weight={800} style={{ color: text(props.textColor, "#64748b") }}>{text(props.nameLabel, "姓名")}</MlcText>
            <MlcInput value={nameValue} placeholder={text(props.namePlaceholder, "请输入姓名")} onChange={setNameValue} />
          </label>
        ) : null}
        {showPhone ? (
          <label style={{ display: "grid", gap: 6 }}>
            <MlcText as="span" size={12} weight={800} style={{ color: text(props.textColor, "#64748b") }}>{text(props.phoneLabel, "手机号")}</MlcText>
            <MlcInput value={phoneValue} type="tel" placeholder={text(props.phonePlaceholder, "请输入手机号")} onChange={setPhoneValue} />
          </label>
        ) : null}
        {showQuantity ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <MlcText as="span" size={13} weight={800} style={{ color: text(props.textColor, "#64748b") }}>{text(props.quantityLabel, "预约人数")}</MlcText>
            <MlcStepper value={quantityValue} min={minQuantity} max={maxQuantity} onChange={setQuantityValue} />
          </div>
        ) : null}
        {showNote ? (
          <label style={{ display: "grid", gap: 6 }}>
            <MlcText as="span" size={12} weight={800} style={{ color: text(props.textColor, "#64748b") }}>{text(props.noteLabel, "备注")}</MlcText>
            <MlcTextarea value={noteValue} placeholder={text(props.notePlaceholder, "可填写偏好、尺码或到店时间")} onChange={setNoteValue} />
          </label>
        ) : null}
        {showAgreement ? (
          <MlcSwitch checked={agreed} onChange={setAgreed} label={text(props.agreementText, "我已阅读并同意活动规则")} />
        ) : null}
        <MlcButton type="submit" block disabled={submitDisabled} style={{ background: accentColor, borderColor: accentColor, color: text(props.buttonTextColor, "#ffffff") }}>
          {text(props.submitText, "提交预约")}
        </MlcButton>
        {submitted ? (
          <MlcText as="p" size={12} tone="accent" style={{ color: accentColor, textAlign: "center" }}>
            {text(props.successText, "已提交，本地示例不会保存真实数据。")}
          </MlcText>
        ) : null}
      </form>
    </section>
  );
}

export function RichTextBlock({ props }: MaterialProps) {
  return (
    <MlcRichText
      className="mlc-material mlc-rich-text"
      html={text(props.html, "<p>请输入富文本内容</p>")}
      backgroundColor={text(props.backgroundColor, "transparent")}
      textColor={text(props.textColor, "#1f2937")}
      borderColor={text(props.borderColor, "transparent")}
      radius={number(props.radius, 0)}
      padding={number(props.padding, 16)}
      fontSize={number(props.fontSize, 14)}
      lineHeight={number(props.lineHeight, 1.7)}
    />
  );
}

export function ProductList({ props }: MaterialProps) {
  const items = list(props.items);
  const onProductClick = props.onProductClick;
  const backgroundColor = text(props.backgroundColor, "#ffffff");
  const cardBackgroundColor = text(props.cardBackgroundColor, "#ffffff");
  const titleColor = text(props.titleColor, "#111827");
  const textColor = text(props.textColor, "#64748b");
  const priceColor = text(props.priceColor, "#dc2626");
  const borderColor = text(props.borderColor, "#eef0f3");
  const radius = number(props.radius, 10);
  const imageRadius = number(props.imageRadius, 8);
  const paddingY = number(props.paddingY, 12);

  if (!items.length) {
    return (
      <section
        className="mlc-material mlc-product-list mlc-product-list--empty"
        style={{ padding: `${paddingY}px 12px`, background: backgroundColor }}
      >
        <MlcText as="p" tone="muted" size={13} style={{ textAlign: "center", color: textColor }}>
          {text(props.emptyText, "请配置商品数据")}
        </MlcText>
      </section>
    );
  }

  return (
    <section className="mlc-material mlc-product-list" style={{ display: "grid", gap: 8, padding: `${paddingY}px 12px`, background: backgroundColor }}>
      {items.map((item, index) => {
        const product = item as Record<string, unknown>;
        const imageUrl = text(product.imageUrl);
        const originPriceText = text(product.originPriceText);
        return (
          <MlcButton
            key={String(product.id ?? index)}
            type="button"
            variant="ghost"
            block
            radius={radius}
            className="mlc-product-list__item"
            onClick={() => {
              if (typeof onProductClick === "function") onProductClick(product);
            }}
            style={{
              display: "flex",
              alignItems: "stretch",
              justifyContent: "flex-start",
              gap: 12,
              width: "100%",
              minHeight: 0,
              border: `1px solid ${borderColor}`,
              padding: 10,
              color: titleColor,
              background: cardBackgroundColor,
              textAlign: "left",
            }}
          >
            <span style={{ display: "block", flex: "0 0 88px", width: 88 }}>
              <MlcImage
                src={imageUrl}
                alt={text(product.title)}
                ratio="1 / 1"
                radius={imageRadius}
                style={{ height: 88, background: "#f3f4f6" }}
                fallback={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 88,
                      height: 88,
                      borderRadius: imageRadius,
                      color: "#94a3b8",
                      background: "#f3f4f6",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    商品图
                  </span>
                }
              />
            </span>
            <span style={{ display: "grid", flex: 1, minWidth: 0, gap: 6, alignContent: "start" }}>
              <MlcText
                as="strong"
                size={14}
                weight={800}
                lineHeight={1.35}
                style={{ overflow: "hidden", color: titleColor, textOverflow: "ellipsis", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", display: "-webkit-box" }}
              >
                {String(product.title ?? "商品名称")}
              </MlcText>
              <MlcText size={12} tone="muted" style={{ overflow: "hidden", color: textColor, textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {String(product.desc ?? `商品 ${index + 1}`)}
              </MlcText>
              <span style={{ display: "flex", alignItems: "baseline", gap: 6, minWidth: 0 }}>
                <MlcPrice amountText={String(product.priceText ?? "")} size={16} style={{ color: priceColor }} />
                {originPriceText ? (
                  <MlcText size={11} tone="muted" style={{ color: "#94a3b8", textDecoration: "line-through" }}>
                    {originPriceText}
                  </MlcText>
                ) : null}
              </span>
            </span>
          </MlcButton>
        );
      })}
    </section>
  );
}

export function ProductRankList({ props }: MaterialProps) {
  const items = list(props.items);
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
  const onProductClick = props.onProductClick;

  return (
    <section style={{ padding: "14px 12px", background: text(props.backgroundColor, "#ffffff") }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
        <div style={{ minWidth: 0 }}>
          <MlcText as="strong" size={17} weight={800} style={{ display: "block", color: text(props.titleColor, "#111827") }}>
            {text(props.title, "商品榜单")}
          </MlcText>
          <MlcText size={12} tone="muted" style={{ display: "block", marginTop: 3 }}>
            {text(props.subtitle, "按活动热度整理，帮助用户快速选爆品。")}
          </MlcText>
        </div>
        <MlcTag style={{ flex: "0 0 auto", color: text(props.accentColor, "#ef4444"), background: text(props.rankBackgroundColor, "#fff1f2") }}>
          {text(props.badgeText, "热卖榜")}
        </MlcTag>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {visibleItems.slice(0, number(props.limit, 5)).map((item, index) => (
          <MlcButton
            key={String(item.id ?? index)}
            onClick={() => {
              if (typeof onProductClick === "function") onProductClick(item);
            }}
            style={{
              display: "grid",
              gridTemplateColumns: "34px 64px minmax(0, 1fr) auto",
              alignItems: "center",
              gap: 10,
              width: "100%",
              minHeight: 84,
              border: "1px solid #eef0f3",
              borderRadius: 10,
              padding: 9,
              color: "#111827",
              background: "#ffffff",
              textAlign: "left",
            }}
          >
            <MlcTag
              radius={9}
              style={{
                width: 30,
                height: 30,
                justifyContent: "center",
                borderRadius: 9,
                color: text(props.accentColor, "#ef4444"),
                background: text(props.rankBackgroundColor, "#fff1f2"),
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              {index + 1}
            </MlcTag>
            {typeof item.imageUrl === "string" ? (
              <MlcImage
                src={item.imageUrl}
                alt=""
                radius={8}
                style={{ width: 64, height: 64, background: "#f3f4f6" }}
              />
            ) : (
              <span style={{ width: 64, height: 64, borderRadius: 8, background: "#f3f4f6" }} />
            )}
            <span style={{ minWidth: 0 }}>
              <MlcText as="strong" size={14} weight={800} style={{ display: "block", overflow: "hidden", color: "#111827", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {String(item.title ?? `榜单商品 ${index + 1}`)}
              </MlcText>
              <MlcPrice amountText={String(item.priceText ?? "")} size={14} style={{ display: "block", marginTop: 6, color: text(props.accentColor, "#ef4444") }} />
              <MlcText size={11} tone="muted" style={{ display: "block", marginTop: 4, color: "#94a3b8" }}>
                {String(item.rankText ?? item.desc ?? "活动热卖")}
              </MlcText>
            </span>
            <MlcText size={12} weight={700} tone="muted" style={{ color: "#9ca3af" }}>{String(item.buttonText ?? text(props.buttonText, "去看看"))}</MlcText>
          </MlcButton>
        ))}
      </div>
    </section>
  );
}

export function BrandFeatureSection({ props }: MaterialProps) {
  const coverImageUrl = text(props.coverImageUrl);
  const logoImageUrl = text(props.logoImageUrl);
  const linkUrl = text(props.linkUrl);
  const items = list(props.items);
  const sellingPoints = ruleList(props.sellingPoints);
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
  const onEnter = props.onEnter;
  const onProductClick = props.onProductClick;

  const handleEnter = () => {
    if (typeof onEnter === "function") onEnter();
    if (linkUrl && typeof window !== "undefined") window.location.href = linkUrl;
  };

  return (
    <section style={{ padding: "14px 12px", background: text(props.backgroundColor, "#f8fafc") }}>
      <div
        style={{
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          background: text(props.cardBackgroundColor, "#ffffff"),
        }}
      >
        {coverImageUrl ? (
          <MlcImage src={coverImageUrl} alt="" style={{ height: 132 }} />
        ) : null}
        <div style={{ display: "grid", gap: 12, padding: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "52px minmax(0, 1fr) auto", alignItems: "center", gap: 10 }}>
            {logoImageUrl ? (
              <MlcImage
                src={logoImageUrl}
                alt=""
                radius={12}
                style={{ width: 52, height: 52, background: "#f3f4f6" }}
              />
            ) : (
              <MlcTag
                radius={12}
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 52,
                  height: 52,
                  color: "#ffffff",
                  background: text(props.accentColor, "#111827"),
                  fontWeight: 900,
                }}
              >
                {text(props.brandName, "M").slice(0, 1)}
              </MlcTag>
            )}
            <span style={{ minWidth: 0 }}>
              <MlcText size={11} weight={800} style={{ display: "block", color: text(props.accentColor, "#111827") }}>
                {text(props.badgeText, "品牌专题")}
              </MlcText>
              <MlcText as="strong" size={17} weight={800} style={{ display: "block", marginTop: 4, color: text(props.titleColor, "#111827") }}>
                {text(props.title, "夏日品牌馆")}
              </MlcText>
              <MlcText size={12} tone="muted" style={{ display: "block", marginTop: 4 }}>
                {text(props.brandName, "MeuMall Select")}
              </MlcText>
            </span>
            <MlcButton
              size="sm"
              radius={8}
              onClick={handleEnter}
              style={{
                alignSelf: "center",
                minHeight: 32,
                border: 0,
                padding: "0 10px",
                color: "#ffffff",
                background: text(props.accentColor, "#111827"),
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {text(props.buttonText, "进入品牌")}
            </MlcButton>
          </div>
          <MlcText as="p" size={13} style={{ margin: 0, color: text(props.textColor, "#374151"), lineHeight: 1.6 }}>
            {text(props.description, "精选品牌当季新品与平台补贴权益，帮助用户快速进入品牌导购场景。")}
          </MlcText>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
            {visibleSellingPoints.slice(0, 4).map((point, index) => {
              const item = (typeof point === "string" ? { title: point } : point) as Record<string, unknown>;
              return (
                <MlcTag
                  key={String(item.id ?? index)}
                  radius={8}
                  style={{
                    display: "grid",
                    gap: 2,
                    minHeight: 48,
                    padding: "8px 9px",
                    background: text(props.pointBackgroundColor, "#f8fafc"),
                  }}
                >
                  <MlcText as="strong" size={12} weight={800} style={{ color: text(props.accentColor, "#111827") }}>{String(item.title ?? `卖点 ${index + 1}`)}</MlcText>
                  <MlcText size={11} tone="muted">{String(item.desc ?? item.content ?? "")}</MlcText>
                </MlcTag>
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
            {visibleItems.slice(0, 2).map((item, index) => (
              <MlcButton
                key={String(item.id ?? index)}
                radius={9}
                onClick={() => {
                  if (typeof onProductClick === "function") onProductClick(item);
                }}
                style={{
                  display: "block",
                  overflow: "hidden",
                  width: "100%",
                  border: "1px solid #eef0f3",
                  padding: 0,
                  background: "#ffffff",
                  textAlign: "left",
                }}
              >
                {typeof item.imageUrl === "string" ? (
                  <MlcImage src={item.imageUrl} alt="" ratio="1 / 1" />
                ) : null}
                <span style={{ display: "grid", gap: 4, padding: 8 }}>
                  <MlcText as="strong" size={12} weight={800} style={{ overflow: "hidden", color: "#111827", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {String(item.title ?? `品牌商品 ${index + 1}`)}
                  </MlcText>
                  <MlcPrice amountText={String(item.priceText ?? "")} size={13} style={{ color: text(props.accentColor, "#111827") }} />
                </span>
              </MlcButton>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function StoreExpertSection({ props }: MaterialProps) {
  const items = list(props.items);
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
  const onItemClick = props.onItemClick;

  return (
    <section style={{ padding: "14px 12px", background: text(props.backgroundColor, "#f8fafc") }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
        <div style={{ minWidth: 0 }}>
          <MlcText as="strong" size={17} weight={800} style={{ display: "block", color: text(props.titleColor, "#111827") }}>
            {text(props.title, "门店/达人推荐")}
          </MlcText>
          <MlcText size={12} tone="muted" style={{ display: "block", marginTop: 3 }}>
            {text(props.subtitle, "精选门店和达人内容，帮助用户快速进入转化场景。")}
          </MlcText>
        </div>
        <MlcTag style={{ flex: "0 0 auto", color: text(props.accentColor, "#0f766e"), background: "rgba(15, 118, 110, 0.1)" }}>
          {text(props.badgeText, "精选")}
        </MlcTag>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {visibleItems.map((item, index) => (
          <MlcButton
            key={String(item.id ?? index)}
            onClick={() => {
              if (typeof onItemClick === "function") onItemClick(item);
            }}
            style={{
              display: "grid",
              gridTemplateColumns: "64px minmax(0, 1fr) auto",
              alignItems: "center",
              gap: 10,
              width: "100%",
              minHeight: 82,
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              padding: 10,
              color: "#111827",
              background: text(props.cardBackgroundColor, "#ffffff"),
              textAlign: "left",
            }}
          >
            {typeof item.imageUrl === "string" ? (
              <MlcImage
                src={item.imageUrl}
                alt=""
                radius={8}
                style={{ width: 64, height: 64, background: "#e5e7eb" }}
              />
            ) : (
              <span style={{ width: 64, height: 64, borderRadius: 8, background: "#e5e7eb" }} />
            )}
            <span style={{ minWidth: 0 }}>
              <MlcTag radius={0} style={{ minHeight: "auto", padding: 0, color: text(props.accentColor, "#0f766e"), background: "transparent", fontSize: 11 }}>
                {String(item.typeText ?? "推荐")}
              </MlcTag>
              <MlcText as="strong" size={14} weight={800} style={{ display: "block", marginTop: 4, color: "#111827" }}>
                {String(item.title ?? `推荐 ${index + 1}`)}
              </MlcText>
              <MlcText size={12} tone="muted" style={{ display: "block", marginTop: 4 }}>
                {String(item.subtitle ?? item.desc ?? "精选内容")}
              </MlcText>
              {item.desc ? (
                <MlcText size={11} tone="muted" style={{ display: "block", marginTop: 4, color: "#94a3b8" }}>{String(item.desc)}</MlcText>
              ) : null}
            </span>
            <span style={{ display: "grid", gap: 8, justifyItems: "end", color: text(props.accentColor, "#0f766e"), fontSize: 12 }}>
              <MlcText as="strong" size={12} weight={800} style={{ color: text(props.accentColor, "#0f766e") }}>{String(item.metricText ?? "")}</MlcText>
              <MlcText size={12} weight={800} style={{ color: text(props.accentColor, "#0f766e") }}>{String(item.buttonText ?? text(props.buttonText, "查看"))}</MlcText>
            </span>
          </MlcButton>
        ))}
      </div>
    </section>
  );
}

export function LiveEntry({ props }: MaterialProps) {
  const coverImageUrl = text(props.coverImageUrl);
  const linkUrl = text(props.linkUrl);
  const onEnter = props.onEnter;

  const handleEnter = () => {
    if (typeof onEnter === "function") onEnter();
    if (linkUrl && typeof window !== "undefined") window.location.href = linkUrl;
  };

  return (
    <section style={{ padding: "14px 12px", background: text(props.backgroundColor, "#111827") }}>
      <MlcButton
        radius={12}
        onClick={handleEnter}
        style={{
          display: "grid",
          gridTemplateColumns: "96px minmax(0, 1fr)",
          gap: 12,
          width: "100%",
          minHeight: 116,
          border: "1px solid rgba(255, 255, 255, 0.16)",
          padding: 10,
          color: text(props.titleColor, "#ffffff"),
          background: "rgba(255, 255, 255, 0.08)",
          textAlign: "left",
          boxShadow: "0 10px 28px rgba(15, 23, 42, 0.18)",
        }}
      >
        {coverImageUrl ? (
          <MlcImage
            src={coverImageUrl}
            alt=""
            radius={10}
            style={{
              width: 96,
              height: 96,
              background: "rgba(255, 255, 255, 0.12)",
            }}
          />
        ) : (
          <span style={{ width: 96, height: 96, borderRadius: 10, background: "rgba(255, 255, 255, 0.12)" }} />
        )}
        <span style={{ display: "grid", alignContent: "space-between", minWidth: 0 }}>
          <span style={{ minWidth: 0 }}>
            <MlcTag
              radius={999}
              style={{
                gap: 5,
                padding: "0 8px",
                color: "#ffffff",
                background: text(props.accentColor, "#ef4444"),
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              <i
                style={{
                  display: "block",
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: "#ffffff",
                }}
              />
              {text(props.statusText, "直播中")}
            </MlcTag>
            <MlcText
              as="strong"
              size={17}
              weight={800}
              style={{
                display: "block",
                marginTop: 8,
                overflow: "hidden",
                color: text(props.titleColor, "#ffffff"),
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {text(props.title, "直播间正在热播")}
            </MlcText>
            <MlcText
              size={12}
              style={{
                display: "-webkit-box",
                marginTop: 4,
                overflow: "hidden",
                color: text(props.textColor, "#d1d5db"),
                lineHeight: 1.45,
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
            >
              {text(props.subtitle, "主播讲解爆品搭配，限时福利同步发放。")}
            </MlcText>
          </span>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 10 }}>
            <MlcText size={12} weight={700} style={{ color: text(props.textColor, "#d1d5db") }}>
              {text(props.viewerText, "12.8w 人正在看")}
            </MlcText>
            <MlcText as="strong" size={13} weight={800} style={{ color: text(props.accentColor, "#ef4444") }}>
              {text(props.buttonText, "进入直播")}
            </MlcText>
          </span>
        </span>
      </MlcButton>
    </section>
  );
}

export function CouponSection({ props }: MaterialProps) {
  const title = text(props.title, "优惠券");
  return (
    <section style={{ padding: 16, background: text(props.backgroundColor, "#fff7ed") }}>
      <MlcText as="h2" size={18} weight={800} style={{ margin: "0 0 12px", color: "#111827" }}>{title}</MlcText>
      <MlcButton
        block
        radius={8}
        onClick={() => {
          const handler = props.onReceive;
          if (typeof handler === "function") handler();
        }}
        style={{
          height: 44,
          border: 0,
          color: "#ffffff",
          background: text(props.buttonColor, "#111827"),
        }}
      >
        {text(props.buttonText, "领取优惠券")}
      </MlcButton>
    </section>
  );
}

export function CouponBundle({ props }: MaterialProps) {
  const coupons = list(props.coupons);
  const visibleCoupons = coupons.length
    ? coupons
    : [
        { id: "coupon_1", title: "满 199 减 30", thresholdText: "全场可用", valueText: "¥30" },
        { id: "coupon_2", title: "满 399 减 80", thresholdText: "精选商品", valueText: "¥80" },
      ];
  const onReceive = props.onReceive;
  const onReceiveAll = props.onReceiveAll;

  return (
    <section
      style={{
        padding: "14px 12px",
        background: text(props.backgroundColor, "#fff7ed"),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
        <div style={{ minWidth: 0 }}>
          <MlcText as="strong" size={17} weight={800} style={{ display: "block", color: text(props.titleColor, "#9a3412") }}>
            {text(props.title, "组合券包")}
          </MlcText>
          <MlcText size={12} style={{ display: "block", marginTop: 3, color: "#9a3412", opacity: 0.78 }}>
            {text(props.subtitle, "多张优惠券一次领取，下单更划算。")}
          </MlcText>
        </div>
        <MlcButton
          size="sm"
          radius={999}
          onClick={() => {
            if (typeof onReceiveAll === "function") onReceiveAll();
          }}
          style={{
            flex: "0 0 auto",
            border: 0,
            color: "#ffffff",
            background: text(props.buttonColor, "#ea580c"),
            fontSize: 13,
          }}
        >
          {text(props.receiveAllText, "一键领取")}
        </MlcButton>
      </div>
      <div style={{ display: "grid", gap: 9 }}>
        {visibleCoupons.map((coupon, index) => (
          <MlcButton
            key={String(coupon.id ?? index)}
            onClick={() => {
              if (typeof onReceive === "function") onReceive(coupon);
            }}
            style={{
              display: "grid",
              gridTemplateColumns: "76px minmax(0, 1fr) auto",
              alignItems: "center",
              gap: 10,
              minHeight: 72,
              border: "1px solid rgba(234, 88, 12, 0.22)",
              borderRadius: 10,
              padding: "10px 12px",
              color: "#7c2d12",
              background: "#ffffff",
              textAlign: "left",
            }}
          >
            <MlcPrice amountText={String(coupon.valueText ?? "¥10")} size={22} style={{ color: text(props.amountColor, "#dc2626") }} />
            <span style={{ minWidth: 0 }}>
              <MlcText as="strong" size={14} weight={800} style={{ display: "block", color: "#111827" }}>{String(coupon.title ?? `优惠券 ${index + 1}`)}</MlcText>
              <MlcText size={12} style={{ display: "block", marginTop: 4, color: "#9a3412" }}>
                {String(coupon.thresholdText ?? "指定商品可用")}
              </MlcText>
              {coupon.expireText ? (
                <MlcText size={11} tone="muted" style={{ display: "block", marginTop: 3, color: "#94a3b8" }}>
                  {String(coupon.expireText)}
                </MlcText>
              ) : null}
            </span>
            <MlcTag
              radius={0}
              style={{ minHeight: "auto", padding: 0, color: text(props.buttonColor, "#ea580c"), background: "transparent", fontSize: 12 }}
            >
              {String(coupon.buttonText ?? text(props.receiveText, "领取"))}
            </MlcTag>
          </MlcButton>
        ))}
      </div>
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
          <MlcText as="strong" size={15} weight={800} style={{ display: "block", color: "#111827" }}>
            {text(props.title, "活动规则")}
          </MlcText>
          <MlcText size={12} tone="muted" style={{ display: "block", marginTop: 4, color: "#6b7280", lineHeight: 1.5 }}>
            {text(props.summary, "查看活动参与条件、优惠说明和有效时间。")}
          </MlcText>
        </div>
        <MlcButton
          size="sm"
          radius={999}
          onClick={openModal}
          style={{
            flex: "0 0 auto",
            border: 0,
            color: "#ffffff",
            background: text(props.primaryColor, "#111827"),
            fontSize: 13,
          }}
        >
          {text(props.buttonText, "查看规则")}
        </MlcButton>
      </div>

      <MlcModal open={open} title={text(props.modalTitle, "活动规则")} closeLabel="关闭规则弹窗" onClose={() => setOpen(false)}>
        <ol style={{ display: "grid", gap: 10, margin: 0, padding: "0 18px 18px 36px" }}>
          {(rules.length ? rules : ["活动规则以页面展示和结算结果为准。"]).map((rule, index) => {
            const title = typeof rule === "string" ? rule : text(rule.title, `规则 ${index + 1}`);
            const content = typeof rule === "string" ? "" : text(rule.content);
            return (
              <li key={`${title}-${index}`} style={{ color: "#374151", lineHeight: 1.65, fontSize: 14 }}>
                <MlcText as="strong" size={14} weight={800} style={{ color: "#111827" }}>{title}</MlcText>
                {content ? <MlcText as="span" size={14} style={{ display: "block", marginTop: 2, color: "#374151" }}>{content}</MlcText> : null}
              </li>
            );
          })}
        </ol>
      </MlcModal>
    </section>
  );
}

export function SectionContainer({ props, children }: MaterialProps) {
  const title = text(props.title);
  const subtitle = text(props.subtitle);
  const marginY = number(props.marginY, 10);
  const gap = number(props.gap, 10);
  const borderWidth = number(props.borderWidth, 0);
  const radius = number(props.radius, 10);
  const emptyText = text(props.emptyText, "向容器中添加物料");
  return (
    <section
      className="mlc-material mlc-section-container"
      style={{
        margin: `${marginY}px 0`,
        padding: number(props.padding, 12),
        background: text(props.backgroundColor, "#ffffff"),
        border: borderWidth > 0 ? `${borderWidth}px solid ${text(props.borderColor, "#e5e7eb")}` : undefined,
        borderRadius: radius,
        boxShadow: boolean(props.shadow) ? "0 10px 28px rgba(15, 23, 42, 0.08)" : undefined,
      }}
    >
      {title ? <h2 style={{ margin: "0 0 6px", color: text(props.titleColor, "#111827"), fontSize: 18 }}>{title}</h2> : null}
      {subtitle ? (
        <p style={{ margin: "0 0 12px", color: text(props.subtitleColor, "#64748b"), fontSize: 13, lineHeight: 1.6 }}>{subtitle}</p>
      ) : null}
      {children ? (
        <div
          className="mlc-section-container__body"
          style={{
            display: "grid",
            gap,
          }}
        >
          {children}
        </div>
      ) : (
        <div
          className="mlc-section-container__empty"
          style={{
            padding: 14,
            border: "1px dashed #cbd5e1",
            borderRadius: 8,
            color: "#64748b",
            background: "#f8fafc",
            textAlign: "center",
          }}
        >
          {emptyText}
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
      <MlcButton
        block
        radius={number(props.radius, 8)}
        onClick={() => {
          const handler = props.onClick;
          if (typeof handler === "function") handler();
          if (linkUrl) window.location.href = linkUrl;
        }}
        style={{
          border: 0,
          color: text(props.textColor, "#ffffff"),
          background: text(props.backgroundColor, "#111827"),
        }}
      >
        {text(props.text, "立即参与")}
      </MlcButton>
    </section>
  );
}

export function StickyActionBar({ props }: MaterialProps) {
  const primaryLinkUrl = text(props.primaryLinkUrl);
  const secondaryLinkUrl = text(props.secondaryLinkUrl);
  const showSecondary = props.showSecondary !== false && Boolean(text(props.secondaryText, "领券"));

  const handlePrimaryClick = () => {
    const handler = props.onPrimaryClick;
    if (typeof handler === "function") handler();
    if (primaryLinkUrl && typeof window !== "undefined") window.location.href = primaryLinkUrl;
  };

  const handleSecondaryClick = () => {
    const handler = props.onSecondaryClick;
    if (typeof handler === "function") handler();
    if (secondaryLinkUrl && typeof window !== "undefined") window.location.href = secondaryLinkUrl;
  };

  return (
    <section
      style={{
        position: props.sticky === false ? "relative" : "sticky",
        bottom: 0,
        zIndex: 30,
        display: "grid",
        gridTemplateColumns: showSecondary ? "minmax(0, 1fr) auto auto" : "minmax(0, 1fr) auto",
        alignItems: "center",
        gap: 10,
        padding: props.safeArea === false ? "10px 12px" : "10px 12px calc(10px + env(safe-area-inset-bottom))",
        borderTop: "1px solid rgba(226, 232, 240, 0.92)",
        background: text(props.backgroundColor, "#ffffff"),
        boxShadow: "0 -10px 26px rgba(15, 23, 42, 0.12)",
      }}
    >
      <span style={{ minWidth: 0 }}>
        <MlcText as="strong" size={14} weight={800} style={{ display: "block", color: text(props.titleColor, "#111827") }}>
          {text(props.title, "限时福利")}
        </MlcText>
        <MlcText size={11} tone="muted" style={{ display: "block", marginTop: 3, color: text(props.textColor, "#64748b") }}>
          {text(props.subtitle, "领取优惠后立即逛活动精选")}
        </MlcText>
      </span>
      {showSecondary ? (
        <MlcButton
          size="sm"
          variant="outline"
          radius={number(props.radius, 999)}
          onClick={handleSecondaryClick}
          style={{
            minHeight: 38,
            border: `1px solid ${text(props.accentColor, "#111827")}`,
            padding: "0 12px",
            color: text(props.accentColor, "#111827"),
            background: text(props.secondaryBackgroundColor, "#ffffff"),
            fontSize: 13,
            fontWeight: 800,
            whiteSpace: "nowrap",
          }}
        >
          {text(props.secondaryText, "领券")}
        </MlcButton>
      ) : null}
      <MlcButton
        size="sm"
        radius={number(props.radius, 999)}
        onClick={handlePrimaryClick}
        style={{
          minHeight: 38,
          border: 0,
          padding: "0 15px",
          color: text(props.primaryTextColor, "#ffffff"),
          background: text(props.accentColor, "#111827"),
          fontSize: 13,
          fontWeight: 800,
          whiteSpace: "nowrap",
        }}
      >
        {text(props.primaryText, "立即抢购")}
      </MlcButton>
    </section>
  );
}

export function NoticeBar({ props }: MaterialProps) {
  return (
    <MlcNoticeBar
      className="mlc-material mlc-notice-bar"
      label={text(props.label, "公告")}
      content={text(props.content, "活动期间下单即享限时优惠。")}
      iconText={text(props.iconText, "!")}
      showIcon={boolean(props.showIcon, true)}
      backgroundColor={text(props.backgroundColor, "#fffbeb")}
      textColor={text(props.textColor, "#92400e")}
      labelBackgroundColor={text(props.labelBackgroundColor, "rgba(146, 64, 14, 0.1)")}
      labelColor={text(props.labelColor, text(props.textColor, "#92400e"))}
      borderColor={text(props.borderColor, "transparent")}
      radius={number(props.radius, 8)}
      paddingY={number(props.paddingY, 10)}
    />
  );
}

export function SpacerBlock({ props }: MaterialProps) {
  return (
    <MlcSpacer
      className="mlc-material mlc-spacer-block"
      height={number(props.height, 12)}
      backgroundColor={text(props.backgroundColor, "#f3f4f6")}
    />
  );
}

export function CountdownTimer({ props }: MaterialProps) {
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
          <MlcText as="strong" size={15} weight={800} style={{ display: "block", color: text(props.textColor, "#ffffff") }}>{text(props.title, "限时秒杀")}</MlcText>
          <MlcText size={12} style={{ display: "block", marginTop: 3, color: text(props.textColor, "#ffffff"), opacity: 0.86 }}>{text(props.subtitle, "距离活动结束")}</MlcText>
        </div>
        <MlcCountdownText
          days={text(props.days, "00")}
          hours={text(props.hours, "12")}
          minutes={text(props.minutes, "30")}
          seconds={text(props.seconds, "00")}
          numberColor={text(props.numberColor, "#dc2626")}
        />
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
            <MlcButton
              key={String(item.id ?? index)}
              radius={number(props.radius, 8)}
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
                color: text(props.textColor, "#111827"),
                background: text(item.backgroundColor, text(props.itemBackgroundColor, "#f8fafc")),
                textAlign: "center",
              }}
            >
              <MlcText as="strong" size={14} weight={800} style={{ color: "inherit" }}>{String(item.title ?? `导航 ${index + 1}`)}</MlcText>
              {item.subtitle ? <MlcText size={11} tone="muted">{String(item.subtitle)}</MlcText> : null}
            </MlcButton>
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
        <MlcText as="strong" size={14} weight={800} style={{ display: "block", marginBottom: 8, color: text(props.textColor, "#111827") }}>
          {text(props.title)}
        </MlcText>
      ) : null}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {(items.length ? items : [{ id: "anchor_1", title: "楼层", targetId: "" }]).map((item, index) => (
          <MlcButton
            key={String(item.id ?? index)}
            size="sm"
            radius={number(props.radius, 999)}
            onClick={() => scrollToTarget(item)}
            style={{
              flex: "0 0 auto",
              border: 0,
              color: text(props.textColor, "#111827"),
              background: text(item.backgroundColor, text(props.itemBackgroundColor, "#f3f4f6")),
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {String(item.title ?? `楼层 ${index + 1}`)}
          </MlcButton>
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
          <MlcText as="strong" size={17} weight={800} style={{ display: "block", color: "#111827" }}>{text(props.title, "限时秒杀")}</MlcText>
          <MlcText size={12} tone="muted" style={{ display: "block", marginTop: 3 }}>{text(props.subtitle, "爆品限量抢购")}</MlcText>
        </div>
        <MlcTag style={{ alignSelf: "start", color: "#dc2626", background: "#fee2e2" }}>{text(props.badgeText, "秒杀中")}</MlcTag>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
        {items.map((item, index) => (
          <MlcButton
            key={String(item.id ?? index)}
            radius={10}
            onClick={() => {
              if (typeof onProductClick === "function") onProductClick(item);
            }}
            style={{
              display: "block",
              overflow: "hidden",
              width: "100%",
              border: "1px solid #eef0f3",
              padding: 0,
              background: "#ffffff",
              textAlign: "left",
            }}
          >
            {typeof item.imageUrl === "string" ? (
              <MlcImage src={item.imageUrl} alt="" ratio="1 / 1" />
            ) : null}
            <span style={{ display: "grid", gap: 5, padding: 9 }}>
              <MlcText as="strong" size={13} weight={800} style={{ color: "#111827", lineHeight: 1.35 }}>{String(item.title ?? "秒杀商品")}</MlcText>
              <MlcPrice amountText={String(item.priceText ?? "")} size={14} style={{ color: "#dc2626" }} />
              <MlcText size={11} tone="muted" style={{ color: "#94a3b8", textDecoration: "line-through" }}>{String(item.originPriceText ?? "")}</MlcText>
            </span>
          </MlcButton>
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
        showIcon: true,
        iconText: "!",
        label: "公告",
        content: "活动期间下单即享限时优惠，库存有限先到先得。",
        backgroundColor: "#fffbeb",
        labelBackgroundColor: "rgba(146, 64, 14, 0.1)",
        labelColor: "#92400e",
        textColor: "#92400e",
        borderColor: "transparent",
        radius: 8,
        paddingY: 10,
      },
      propsSchema: {
        showIcon: { label: "显示图标", type: "boolean", setter: "switch", defaultValue: true },
        iconText: { label: "图标文案", type: "string", setter: "input", defaultValue: "!" },
        label: { label: "标签", type: "string", setter: "input", defaultValue: "公告" },
        content: { label: "内容", type: "string", setter: "textarea", defaultValue: "活动期间下单即享限时优惠，库存有限先到先得。" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#fffbeb", ...COLOR_SWATCHES_META },
        labelBackgroundColor: { label: "标签背景", type: "string", setter: "color", defaultValue: "rgba(146, 64, 14, 0.1)", ...COLOR_SWATCHES_META },
        labelColor: { label: "标签文字色", type: "string", setter: "color", defaultValue: "#92400e", ...COLOR_SWATCHES_META },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#92400e", ...COLOR_SWATCHES_META },
        borderColor: { label: "边框色", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 8, ...NUMBER_RADIUS_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 10, ...NUMBER_PIXEL_SIZE_META },
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
    component: BasicTextarea,
    manifest: createMaterialManifest({
      componentName: "BasicTextarea",
      materialVersion: "0.1.0",
      title: "基础多行输入",
      category: "basic",
      platforms: ["h5"],
      defaultProps: {
        label: "基础多行输入",
        placeholder: "请输入多行内容",
        helperText: "用于收集备注、说明或活动需求，本地示例不会提交数据。",
        defaultValue: "",
        rows: 3,
        disabled: false,
        wrapperBackgroundColor: "transparent",
        textareaBackgroundColor: "#ffffff",
        labelColor: "#111827",
        textColor: "#111827",
        helperColor: "#64748b",
        borderColor: "#e5e7eb",
        radius: 8,
        paddingY: 12,
      },
      propsSchema: {
        label: { label: "标签", type: "string", setter: "input", defaultValue: "基础多行输入" },
        placeholder: { label: "占位提示", type: "string", setter: "input", defaultValue: "请输入多行内容" },
        helperText: { label: "辅助说明", type: "string", setter: "textarea", defaultValue: "用于收集备注、说明或活动需求，本地示例不会提交数据。" },
        defaultValue: { label: "默认值", type: "string", setter: "textarea", defaultValue: "" },
        rows: { label: "显示行数", type: "number", setter: "number", defaultValue: 3, ...NUMBER_TEXTAREA_ROWS_META },
        disabled: { label: "禁用", type: "boolean", setter: "switch", defaultValue: false },
        wrapperBackgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        textareaBackgroundColor: { label: "输入背景", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
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
    component: BasicSelect,
    manifest: createMaterialManifest({
      componentName: "BasicSelect",
      materialVersion: "0.1.0",
      title: "基础选择框",
      category: "basic",
      platforms: ["h5"],
      defaultProps: {
        label: "基础选择框",
        placeholder: "请选择",
        helperText: "用于静态选项单选，远程业务字典请通过后续数据源能力接入。",
        defaultValue: "",
        options: BASIC_SELECT_FALLBACK_OPTIONS,
        disabled: false,
        wrapperBackgroundColor: "transparent",
        selectBackgroundColor: "#ffffff",
        labelColor: "#111827",
        textColor: "#111827",
        helperColor: "#64748b",
        borderColor: "#e5e7eb",
        radius: 8,
        paddingY: 12,
      },
      propsSchema: {
        label: { label: "标签", type: "string", setter: "input", defaultValue: "基础选择框" },
        placeholder: { label: "占位提示", type: "string", setter: "input", defaultValue: "请选择" },
        helperText: { label: "辅助说明", type: "string", setter: "textarea", defaultValue: "用于静态选项单选，远程业务字典请通过后续数据源能力接入。" },
        defaultValue: { label: "默认值", type: "string", setter: "input", defaultValue: "" },
        options: { label: "选项列表", type: "array", setter: "textarea", defaultValue: BASIC_SELECT_FALLBACK_OPTIONS },
        disabled: { label: "禁用", type: "boolean", setter: "switch", defaultValue: false },
        wrapperBackgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        selectBackgroundColor: { label: "选择框背景", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        labelColor: { label: "标签色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        helperColor: { label: "辅助文字色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        borderColor: { label: "边框色", type: "string", setter: "color", defaultValue: "#e5e7eb", ...COLOR_SWATCHES_META },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 8, ...NUMBER_RADIUS_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
      },
      events: [{ name: "onChange", title: "选择变化" }],
    }),
  },
  {
    component: BasicRadioGroup,
    manifest: createMaterialManifest({
      componentName: "BasicRadioGroup",
      materialVersion: "0.1.0",
      title: "基础单选组",
      category: "basic",
      platforms: ["h5"],
      defaultProps: {
        label: "基础单选组",
        helperText: "用于少量静态选项单选，远程业务字典请通过后续数据源能力接入。",
        defaultValue: "women",
        options: BASIC_SELECT_FALLBACK_OPTIONS,
        disabled: false,
        wrapperBackgroundColor: "transparent",
        optionBackgroundColor: "#ffffff",
        labelColor: "#111827",
        textColor: "#111827",
        helperColor: "#64748b",
        activeColor: "#0f766e",
        borderColor: "#e5e7eb",
        radius: 8,
        paddingY: 12,
      },
      propsSchema: {
        label: { label: "标签", type: "string", setter: "input", defaultValue: "基础单选组" },
        helperText: { label: "辅助说明", type: "string", setter: "textarea", defaultValue: "用于少量静态选项单选，远程业务字典请通过后续数据源能力接入。" },
        defaultValue: { label: "默认值", type: "string", setter: "input", defaultValue: "women" },
        options: { label: "选项列表", type: "array", setter: "textarea", defaultValue: BASIC_SELECT_FALLBACK_OPTIONS },
        disabled: { label: "禁用", type: "boolean", setter: "switch", defaultValue: false },
        wrapperBackgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        optionBackgroundColor: { label: "选项背景", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        labelColor: { label: "标签色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        helperColor: { label: "辅助文字色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        activeColor: { label: "选中色", type: "string", setter: "color", defaultValue: "#0f766e", ...COLOR_SWATCHES_META },
        borderColor: { label: "边框色", type: "string", setter: "color", defaultValue: "#e5e7eb", ...COLOR_SWATCHES_META },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 8, ...NUMBER_RADIUS_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
      },
      events: [{ name: "onChange", title: "单选变化" }],
    }),
  },
  {
    component: BasicStepper,
    manifest: createMaterialManifest({
      componentName: "BasicStepper",
      materialVersion: "0.1.0",
      title: "基础步进器",
      category: "basic",
      platforms: ["h5"],
      defaultProps: {
        label: "基础步进器",
        helperText: "用于业务无关的数字增减选择，库存、限购和保存请通过后续业务物料或 action 接入。",
        defaultValue: 2,
        min: 0,
        max: 10,
        step: 1,
        disabled: false,
        wrapperBackgroundColor: "transparent",
        buttonBackgroundColor: "#ffffff",
        labelColor: "#111827",
        textColor: "#111827",
        helperColor: "#64748b",
        accentColor: "#0f766e",
        borderColor: "#e5e7eb",
        radius: 8,
        paddingY: 12,
      },
      propsSchema: {
        label: { label: "标签", type: "string", setter: "input", defaultValue: "基础步进器" },
        helperText: { label: "辅助说明", type: "string", setter: "textarea", defaultValue: "用于业务无关的数字增减选择，库存、限购和保存请通过后续业务物料或 action 接入。" },
        defaultValue: { label: "默认值", type: "number", setter: "number", defaultValue: 2, ...NUMBER_STEPPER_VALUE_META },
        min: { label: "最小值", type: "number", setter: "number", defaultValue: 0, ...NUMBER_STEPPER_VALUE_META },
        max: { label: "最大值", type: "number", setter: "number", defaultValue: 10, ...NUMBER_STEPPER_VALUE_META },
        step: { label: "步长", type: "number", setter: "number", defaultValue: 1, ...NUMBER_STEPPER_STEP_META },
        disabled: { label: "禁用", type: "boolean", setter: "switch", defaultValue: false },
        wrapperBackgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        buttonBackgroundColor: { label: "按钮背景", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        labelColor: { label: "标签色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        helperColor: { label: "辅助文字色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        accentColor: { label: "强调色", type: "string", setter: "color", defaultValue: "#0f766e", ...COLOR_SWATCHES_META },
        borderColor: { label: "边框色", type: "string", setter: "color", defaultValue: "#e5e7eb", ...COLOR_SWATCHES_META },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 8, ...NUMBER_RADIUS_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
      },
      events: [{ name: "onChange", title: "数字变化" }],
    }),
  },
  {
    component: BasicSwitch,
    manifest: createMaterialManifest({
      componentName: "BasicSwitch",
      materialVersion: "0.1.0",
      title: "基础开关",
      category: "basic",
      platforms: ["h5"],
      defaultProps: {
        label: "基础开关",
        checkedText: "已开启",
        uncheckedText: "已关闭",
        helperText: "用于本地布尔状态切换，真实保存需通过后续业务动作接入。",
        defaultChecked: true,
        disabled: false,
        wrapperBackgroundColor: "transparent",
        labelColor: "#111827",
        stateTextColor: "#64748b",
        helperColor: "#64748b",
        activeColor: "#0f766e",
        inactiveColor: "#cbd5e1",
        thumbColor: "#ffffff",
        paddingY: 12,
      },
      propsSchema: {
        label: { label: "标签", type: "string", setter: "input", defaultValue: "基础开关" },
        checkedText: { label: "开启文案", type: "string", setter: "input", defaultValue: "已开启" },
        uncheckedText: { label: "关闭文案", type: "string", setter: "input", defaultValue: "已关闭" },
        helperText: { label: "辅助说明", type: "string", setter: "textarea", defaultValue: "用于本地布尔状态切换，真实保存需通过后续业务动作接入。" },
        defaultChecked: { label: "默认开启", type: "boolean", setter: "switch", defaultValue: true },
        disabled: { label: "禁用", type: "boolean", setter: "switch", defaultValue: false },
        wrapperBackgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        labelColor: { label: "标签色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        stateTextColor: { label: "状态文字色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        helperColor: { label: "辅助文字色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        activeColor: { label: "开启色", type: "string", setter: "color", defaultValue: "#0f766e", ...COLOR_SWATCHES_META },
        inactiveColor: { label: "关闭色", type: "string", setter: "color", defaultValue: "#cbd5e1", ...COLOR_SWATCHES_META },
        thumbColor: { label: "滑块色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
      },
      events: [{ name: "onChange", title: "开关变化" }],
    }),
  },
  {
    component: BasicCheckbox,
    manifest: createMaterialManifest({
      componentName: "BasicCheckbox",
      materialVersion: "0.1.0",
      title: "基础复选框",
      category: "basic",
      platforms: ["h5"],
      defaultProps: {
        label: "基础复选框",
        helperText: "用于本地勾选状态展示，真实保存、校验和协议确认需通过后续业务动作接入。",
        defaultChecked: false,
        disabled: false,
        wrapperBackgroundColor: "transparent",
        labelColor: "#111827",
        helperColor: "#64748b",
        checkedColor: "#0f766e",
        borderColor: "#cbd5e1",
        markColor: "#ffffff",
        radius: 6,
        paddingY: 12,
      },
      propsSchema: {
        label: { label: "标签", type: "string", setter: "input", defaultValue: "基础复选框" },
        helperText: { label: "辅助说明", type: "string", setter: "textarea", defaultValue: "用于本地勾选状态展示，真实保存、校验和协议确认需通过后续业务动作接入。" },
        defaultChecked: { label: "默认勾选", type: "boolean", setter: "switch", defaultValue: false },
        disabled: { label: "禁用", type: "boolean", setter: "switch", defaultValue: false },
        wrapperBackgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        labelColor: { label: "标签色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        helperColor: { label: "辅助文字色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        checkedColor: { label: "勾选色", type: "string", setter: "color", defaultValue: "#0f766e", ...COLOR_SWATCHES_META },
        borderColor: { label: "边框色", type: "string", setter: "color", defaultValue: "#cbd5e1", ...COLOR_SWATCHES_META },
        markColor: { label: "勾选标记色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 6, ...NUMBER_RADIUS_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
      },
      events: [{ name: "onChange", title: "勾选变化" }],
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
    component: BasicCarousel,
    manifest: createMaterialManifest({
      componentName: "BasicCarousel",
      materialVersion: "0.1.0",
      title: "基础图片轮播",
      category: "basic",
      platforms: ["h5"],
      defaultProps: {
        ratio: "16 / 9",
        fit: "cover",
        radius: 12,
        autoPlay: true,
        interval: 3000,
        indicator: "dots",
        wrapperBackgroundColor: "transparent",
        backgroundColor: "#111827",
        titleColor: "#ffffff",
        textColor: "rgba(255, 255, 255, 0.86)",
        accentColor: "#ffffff",
        indicatorColor: "#111827",
        titleSize: 18,
        paddingY: 12,
        shadow: true,
        items: BASIC_CAROUSEL_FALLBACK_ITEMS,
      },
      propsSchema: {
        items: { label: "轮播列表", type: "array", setter: "textarea", defaultValue: BASIC_CAROUSEL_FALLBACK_ITEMS },
        ratio: { label: "图片比例", type: "string", setter: "input", defaultValue: "16 / 9" },
        fit: { label: "填充模式", type: "string", setter: "select", defaultValue: "cover", options: BASIC_IMAGE_FIT_OPTIONS },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 12, ...NUMBER_RADIUS_META },
        autoPlay: { label: "自动播放", type: "boolean", setter: "switch", defaultValue: true },
        interval: { label: "切换间隔", type: "number", setter: "number", defaultValue: 3000, ...NUMBER_CAROUSEL_INTERVAL_META },
        indicator: { label: "指示器", type: "string", setter: "select", defaultValue: "dots", options: BASIC_CAROUSEL_INDICATOR_OPTIONS },
        wrapperBackgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        backgroundColor: { label: "图片底色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        textColor: { label: "说明色", type: "string", setter: "color", defaultValue: "rgba(255, 255, 255, 0.86)", ...COLOR_SWATCHES_META },
        accentColor: { label: "角标色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        indicatorColor: { label: "指示器色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        titleSize: { label: "标题字号", type: "number", setter: "number", defaultValue: 18, ...NUMBER_FONT_SIZE_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
        shadow: { label: "阴影", type: "boolean", setter: "switch", defaultValue: true },
      },
      events: [{ name: "onItemClick", title: "点击轮播图" }],
    }),
  },
  {
    component: BasicVideo,
    manifest: createMaterialManifest({
      componentName: "BasicVideo",
      materialVersion: "0.1.0",
      title: "基础视频",
      category: "basic",
      platforms: ["h5"],
      defaultProps: {
        videoUrl: BASIC_VIDEO_SAMPLE_VIDEO_URL,
        posterUrl: BASIC_VIDEO_SAMPLE_POSTER_URL,
        badgeText: "VIDEO",
        title: "基础视频",
        description: "用于展示短视频、品牌宣传片或导购内容，后续可由素材中心注入视频地址。",
        ratio: "16 / 9",
        radius: 12,
        controls: true,
        autoPlay: false,
        muted: true,
        loop: false,
        playsInline: true,
        wrapperBackgroundColor: "transparent",
        cardBackgroundColor: "#ffffff",
        mediaBackgroundColor: "#0f172a",
        badgeBackgroundColor: "rgba(15, 118, 110, 0.1)",
        titleColor: "#111827",
        textColor: "#64748b",
        accentColor: "#0f766e",
        borderColor: "#e5e7eb",
        titleSize: 18,
        paddingY: 12,
        contentPadding: 12,
        shadow: true,
      },
      propsSchema: {
        videoUrl: { label: "视频地址", type: "string", setter: "video", defaultValue: BASIC_VIDEO_SAMPLE_VIDEO_URL },
        posterUrl: { label: "封面图", type: "string", setter: "image", defaultValue: BASIC_VIDEO_SAMPLE_POSTER_URL },
        badgeText: { label: "角标", type: "string", setter: "input", defaultValue: "VIDEO" },
        title: { label: "标题", type: "string", setter: "input", required: true, defaultValue: "基础视频" },
        description: { label: "说明", type: "string", setter: "textarea", defaultValue: "用于展示短视频、品牌宣传片或导购内容，后续可由素材中心注入视频地址。" },
        ratio: { label: "视频比例", type: "string", setter: "input", defaultValue: "16 / 9" },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 12, ...NUMBER_RADIUS_META },
        controls: { label: "播放控件", type: "boolean", setter: "switch", defaultValue: true },
        autoPlay: { label: "自动播放", type: "boolean", setter: "switch", defaultValue: false },
        muted: { label: "静音", type: "boolean", setter: "switch", defaultValue: true },
        loop: { label: "循环播放", type: "boolean", setter: "switch", defaultValue: false },
        playsInline: { label: "行内播放", type: "boolean", setter: "switch", defaultValue: true },
        wrapperBackgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        cardBackgroundColor: { label: "卡片背景", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        mediaBackgroundColor: { label: "视频底色", type: "string", setter: "color", defaultValue: "#0f172a", ...COLOR_SWATCHES_META },
        badgeBackgroundColor: { label: "角标背景", type: "string", setter: "color", defaultValue: "rgba(15, 118, 110, 0.1)", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "说明色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        accentColor: { label: "强调色", type: "string", setter: "color", defaultValue: "#0f766e", ...COLOR_SWATCHES_META },
        borderColor: { label: "边框色", type: "string", setter: "color", defaultValue: "#e5e7eb", ...COLOR_SWATCHES_META },
        titleSize: { label: "标题字号", type: "number", setter: "number", defaultValue: 18, ...NUMBER_FONT_SIZE_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
        contentPadding: { label: "内容内边距", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
        shadow: { label: "阴影", type: "boolean", setter: "switch", defaultValue: true },
      },
      events: [{ name: "onPlay", title: "开始播放" }],
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
        textColor: "#64748b",
        titleSize: 24,
        imageRadius: 8,
        paddingY: 18,
        titleLineHeight: 1.2,
        subtitleLineHeight: 1.6,
      },
      propsSchema: {
        title: { label: "标题", type: "string", setter: "input", required: true, defaultValue: "夏日好物节" },
        subtitle: { label: "副标题", type: "string", setter: "textarea", defaultValue: "精选爆品限时补贴，支持一键搭建推广页。" },
        imageUrl: { label: "图片", type: "string", setter: "image", defaultValue: "" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "说明色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        titleSize: { label: "标题字号", type: "number", setter: "number", defaultValue: 24, ...NUMBER_FONT_SIZE_META },
        imageRadius: { label: "图片圆角", type: "number", setter: "number", defaultValue: 8, ...NUMBER_RADIUS_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 18, ...NUMBER_PIXEL_SIZE_META },
        titleLineHeight: { label: "标题行高", type: "number", setter: "number", defaultValue: 1.2, ...NUMBER_LINE_HEIGHT_META },
        subtitleLineHeight: { label: "说明行高", type: "number", setter: "number", defaultValue: 1.6, ...NUMBER_LINE_HEIGHT_META },
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
        items: PRODUCT_LIST_DEFAULT_ITEMS,
        backgroundColor: "#ffffff",
        cardBackgroundColor: "#ffffff",
        titleColor: "#111827",
        textColor: "#64748b",
        priceColor: "#dc2626",
        borderColor: "#eef0f3",
        radius: 10,
        imageRadius: 8,
        paddingY: 12,
        emptyText: "请配置商品数据",
      },
      dataSourceSlots: [{ name: "items", acceptedTypes: ["product.byIds", "product.byActivity"] }],
      propsSchema: {
        items: { label: "商品数据", type: "array", setter: "dataSourceSelector", defaultValue: [] },
        backgroundColor: { label: "区块背景", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        cardBackgroundColor: { label: "卡片背景", type: "string", setter: "color", defaultValue: "#ffffff", ...COLOR_SWATCHES_META },
        titleColor: { label: "标题色", type: "string", setter: "color", defaultValue: "#111827", ...COLOR_SWATCHES_META },
        textColor: { label: "说明色", type: "string", setter: "color", defaultValue: "#64748b", ...COLOR_SWATCHES_META },
        priceColor: { label: "价格色", type: "string", setter: "color", defaultValue: "#dc2626", ...COLOR_SWATCHES_META },
        borderColor: { label: "边框色", type: "string", setter: "color", defaultValue: "#eef0f3", ...COLOR_SWATCHES_META },
        radius: { label: "卡片圆角", type: "number", setter: "number", defaultValue: 10, ...NUMBER_RADIUS_META },
        imageRadius: { label: "图片圆角", type: "number", setter: "number", defaultValue: 8, ...NUMBER_RADIUS_META },
        paddingY: { label: "上下留白", type: "number", setter: "number", defaultValue: 12, ...NUMBER_PIXEL_SIZE_META },
        emptyText: { label: "空态文案", type: "string", setter: "input", defaultValue: "请配置商品数据" },
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
      defaultProps: {
        html: "<p>请输入富文本内容</p>",
        backgroundColor: "transparent",
        textColor: "#1f2937",
        borderColor: "transparent",
        radius: 0,
        padding: 16,
        fontSize: 14,
        lineHeight: 1.7,
      },
      propsSchema: {
        html: { label: "内容", type: "string", setter: "richText", defaultValue: "<p>请输入富文本内容</p>" },
        backgroundColor: { label: "背景色", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        textColor: { label: "文字色", type: "string", setter: "color", defaultValue: "#1f2937", ...COLOR_SWATCHES_META },
        borderColor: { label: "边框色", type: "string", setter: "color", defaultValue: "transparent", ...COLOR_SWATCHES_META },
        radius: { label: "圆角", type: "number", setter: "number", defaultValue: 0, ...NUMBER_RADIUS_META },
        padding: { label: "内边距", type: "number", setter: "number", defaultValue: 16, ...NUMBER_PIXEL_SIZE_META },
        fontSize: { label: "字号", type: "number", setter: "number", defaultValue: 14, ...NUMBER_FONT_SIZE_META },
        lineHeight: { label: "行高", type: "number", setter: "number", defaultValue: 1.7, ...NUMBER_LINE_HEIGHT_META },
      },
    }),
  },
];
