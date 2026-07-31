import React from "react";

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
type InputType = "text" | "tel" | "email" | "number";

function toneColor(tone: Tone): string {
  if (tone === "accent") return h5Tokens.color.accent;
  if (tone === "danger") return h5Tokens.color.danger;
  if (tone === "inverse") return h5Tokens.color.inverseText;
  return h5Tokens.color.text;
}

export interface MlcButtonProps {
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  role?: React.AriaRole;
  "aria-label"?: string;
  "aria-selected"?: boolean;
  variant?: ButtonVariant;
  tone?: Tone;
  size?: ButtonSize;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function MlcButton({
  children,
  type = "button",
  role,
  "aria-label": ariaLabel,
  "aria-selected": ariaSelected,
  variant = "solid",
  tone = "neutral",
  size = "md",
  block = false,
  disabled = false,
  loading = false,
  radius = h5Tokens.radius.md,
  className,
  style,
  onClick,
}: MlcButtonProps): React.ReactElement {
  const height = size === "sm" ? 34 : size === "lg" ? 48 : h5Tokens.touch.minHeight;
  const color = toneColor(tone);
  const isSolid = variant === "solid";
  return (
    <button
      type={type}
      role={role}
      aria-label={ariaLabel}
      aria-selected={ariaSelected}
      className={className}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        width: block ? "100%" : undefined,
        minHeight: height,
        border: variant === "ghost" ? 0 : `1px solid ${isSolid ? color : h5Tokens.color.border}`,
        borderRadius: radius,
        padding: size === "sm" ? "0 12px" : "0 16px",
        color: isSolid ? h5Tokens.color.inverseText : color,
        background: isSolid ? color : "transparent",
        fontSize: h5Tokens.fontSize.button,
        fontWeight: 700,
        opacity: disabled ? 0.56 : 1,
        ...style,
      }}
    >
      {loading ? "加载中" : children}
    </button>
  );
}

export interface MlcImageProps {
  src?: string;
  alt?: string;
  ratio?: string;
  fit?: React.CSSProperties["objectFit"];
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
}

export function MlcImage({ src, alt = "", ratio, fit = "cover", radius = 0, className, style, fallback = null }: MlcImageProps): React.ReactElement | null {
  if (!src) return <>{fallback}</>;
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      style={{
        width: "100%",
        display: "block",
        aspectRatio: ratio,
        objectFit: fit,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}

export interface MlcTagProps {
  children?: React.ReactNode;
  tone?: Tone;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function MlcTag({ children, tone = "accent", radius = h5Tokens.radius.pill, className, style }: MlcTagProps): React.ReactElement {
  const color = toneColor(tone);
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 22,
        borderRadius: radius,
        padding: "0 9px",
        color,
        background: tone === "accent" ? "rgba(15, 118, 110, 0.1)" : "rgba(17, 24, 39, 0.08)",
        fontSize: 12,
        fontWeight: 800,
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export interface MlcTextProps {
  children?: React.ReactNode;
  as?: TextAs;
  tone?: Tone | "muted";
  size?: number;
  weight?: number;
  lineHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function MlcText({
  children,
  as = "span",
  tone = "neutral",
  size = h5Tokens.fontSize.body,
  weight,
  lineHeight = 1.5,
  className,
  style,
}: MlcTextProps): React.ReactElement {
  const color = tone === "muted" ? h5Tokens.color.mutedText : toneColor(tone);
  return React.createElement(
    as,
    {
      className,
      style: {
        margin: as === "p" ? 0 : undefined,
        color,
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        ...style,
      },
    },
    children,
  );
}

export interface MlcPriceProps {
  amountText?: string;
  prefix?: string;
  suffix?: string;
  tone?: Tone;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function MlcPrice({ amountText = "", prefix = "", suffix = "", tone = "danger", size = 18, className, style }: MlcPriceProps): React.ReactElement | null {
  if (!amountText) return null;
  return (
    <strong className={className} style={{ color: toneColor(tone), fontSize: size, lineHeight: 1, ...style }}>
      {prefix}
      {amountText}
      {suffix ? <small style={{ marginLeft: 2, fontSize: Math.max(11, size - 6) }}>{suffix}</small> : null}
    </strong>
  );
}

export interface MlcInputProps {
  value?: string;
  placeholder?: string;
  type?: InputType;
  disabled?: boolean;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
}

export function MlcInput({
  value,
  placeholder = "",
  type = "text",
  disabled = false,
  radius = h5Tokens.radius.md,
  className,
  style,
  onChange,
}: MlcInputProps): React.ReactElement {
  return (
    <input
      className={className}
      value={value}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      style={{
        boxSizing: "border-box",
        width: "100%",
        minHeight: h5Tokens.touch.minHeight,
        border: `1px solid ${h5Tokens.color.border}`,
        borderRadius: radius,
        padding: "0 12px",
        color: h5Tokens.color.text,
        background: h5Tokens.color.surface,
        fontSize: h5Tokens.fontSize.body,
        outline: "none",
        opacity: disabled ? 0.56 : 1,
        ...style,
      }}
    />
  );
}

export interface MlcTextareaProps {
  value?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
}

export function MlcTextarea({
  value,
  placeholder = "",
  rows = 3,
  disabled = false,
  radius = h5Tokens.radius.md,
  className,
  style,
  onChange,
}: MlcTextareaProps): React.ReactElement {
  return (
    <textarea
      className={className}
      value={value}
      rows={rows}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      style={{
        boxSizing: "border-box",
        width: "100%",
        minHeight: 86,
        border: `1px solid ${h5Tokens.color.border}`,
        borderRadius: radius,
        padding: "11px 12px",
        color: h5Tokens.color.text,
        background: h5Tokens.color.surface,
        fontSize: h5Tokens.fontSize.body,
        lineHeight: 1.5,
        resize: "vertical",
        outline: "none",
        opacity: disabled ? 0.56 : 1,
        ...style,
      }}
    />
  );
}

export interface MlcSwitchProps {
  checked?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (checked: boolean) => void;
}

export function MlcSwitch({ checked = false, disabled = false, label, className, style, onChange }: MlcSwitchProps): React.ReactElement {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={className}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        minHeight: h5Tokens.touch.minHeight,
        border: 0,
        padding: 0,
        color: h5Tokens.color.text,
        background: "transparent",
        fontSize: h5Tokens.fontSize.body,
        textAlign: "left",
        opacity: disabled ? 0.56 : 1,
        ...style,
      }}
    >
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          flex: "0 0 auto",
          width: 42,
          height: 24,
          borderRadius: h5Tokens.radius.pill,
          background: checked ? h5Tokens.color.accent : "#cbd5e1",
          transition: "background 0.16s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 21 : 3,
            width: 18,
            height: 18,
            borderRadius: h5Tokens.radius.pill,
            background: h5Tokens.color.surface,
            boxShadow: "0 1px 4px rgba(15, 23, 42, 0.24)",
            transition: "left 0.16s ease",
          }}
        />
      </span>
      {label ? <span style={{ flex: "1 1 auto", lineHeight: 1.45 }}>{label}</span> : null}
    </button>
  );
}

export interface MlcStepperProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (value: number) => void;
}

export function MlcStepper({
  value = 0,
  min = 0,
  max = 99,
  step = 1,
  disabled = false,
  className,
  style,
  onChange,
}: MlcStepperProps): React.ReactElement {
  const normalizedValue = Math.min(max, Math.max(min, value));
  const update = (nextValue: number) => {
    onChange?.(Math.min(max, Math.max(min, nextValue)));
  };
  const buttonStyle: React.CSSProperties = {
    width: 34,
    height: 34,
    border: `1px solid ${h5Tokens.color.border}`,
    borderRadius: h5Tokens.radius.md,
    color: h5Tokens.color.text,
    background: h5Tokens.color.surface,
    fontSize: 18,
    fontWeight: 800,
  };
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        ...style,
      }}
    >
      <button type="button" disabled={disabled || normalizedValue <= min} onClick={() => update(normalizedValue - step)} style={buttonStyle}>
        -
      </button>
      <strong style={{ minWidth: 28, color: h5Tokens.color.text, fontSize: h5Tokens.fontSize.body, textAlign: "center" }}>{normalizedValue}</strong>
      <button type="button" disabled={disabled || normalizedValue >= max} onClick={() => update(normalizedValue + step)} style={buttonStyle}>
        +
      </button>
    </span>
  );
}
