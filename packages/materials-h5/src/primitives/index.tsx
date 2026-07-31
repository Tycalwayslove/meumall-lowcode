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

function toneColor(tone: Tone): string {
  if (tone === "accent") return h5Tokens.color.accent;
  if (tone === "danger") return h5Tokens.color.danger;
  if (tone === "inverse") return h5Tokens.color.inverseText;
  return h5Tokens.color.text;
}

export interface MlcButtonProps {
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
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
