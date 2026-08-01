export const LOWCODE_H5_TOKENS = {
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

export const h5Tokens = LOWCODE_H5_TOKENS;

export type LowcodeH5Tokens = typeof LOWCODE_H5_TOKENS;
export type LowcodeH5Tone = "neutral" | "accent" | "danger" | "inverse";
export type LowcodeH5TokenCssVarMap = Record<`--mlc-h5-${string}`, string>;

export function getLowcodeH5ToneColor(tone: LowcodeH5Tone): string {
  if (tone === "accent") return LOWCODE_H5_TOKENS.color.accent;
  if (tone === "danger") return LOWCODE_H5_TOKENS.color.danger;
  if (tone === "inverse") return LOWCODE_H5_TOKENS.color.inverseText;
  return LOWCODE_H5_TOKENS.color.text;
}

export function createLowcodeH5TintColor(color: string, opacity: number): string {
  const normalized = color.trim();
  const match = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return "rgba(15, 118, 110, 0.08)";

  const hex = match[1].length === 3 ? match[1].split("").map((char) => `${char}${char}`).join("") : match[1];
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

export function createLowcodeH5CssVars(tokens: LowcodeH5Tokens = LOWCODE_H5_TOKENS): LowcodeH5TokenCssVarMap {
  return {
    "--mlc-h5-color-text": tokens.color.text,
    "--mlc-h5-color-muted-text": tokens.color.mutedText,
    "--mlc-h5-color-inverse-text": tokens.color.inverseText,
    "--mlc-h5-color-surface": tokens.color.surface,
    "--mlc-h5-color-weak-surface": tokens.color.weakSurface,
    "--mlc-h5-color-primary": tokens.color.primary,
    "--mlc-h5-color-accent": tokens.color.accent,
    "--mlc-h5-color-danger": tokens.color.danger,
    "--mlc-h5-color-border": tokens.color.border,
    "--mlc-h5-radius-sm": `${tokens.radius.sm}px`,
    "--mlc-h5-radius-md": `${tokens.radius.md}px`,
    "--mlc-h5-radius-lg": `${tokens.radius.lg}px`,
    "--mlc-h5-radius-pill": `${tokens.radius.pill}px`,
    "--mlc-h5-font-size-caption": `${tokens.fontSize.caption}px`,
    "--mlc-h5-font-size-body": `${tokens.fontSize.body}px`,
    "--mlc-h5-font-size-button": `${tokens.fontSize.button}px`,
    "--mlc-h5-font-size-title": `${tokens.fontSize.title}px`,
    "--mlc-h5-touch-min-height": `${tokens.touch.minHeight}px`,
  };
}
