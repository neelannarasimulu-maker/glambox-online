import type { CSSProperties } from "react";
import type { PopupConfig } from "./schemas";

type CSSVarProperties = CSSProperties & Record<`--${string}`, string>;

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "").trim();
  const full = normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized;

  const int = Number.parseInt(full, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function mixColors(hexA: string, hexB: string, weight = 0.5) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const w = Math.max(0, Math.min(1, weight));

  return rgbToHex(
    Math.round(a.r * (1 - w) + b.r * w),
    Math.round(a.g * (1 - w) + b.g * w),
    Math.round(a.b * (1 - w) + b.b * w)
  );
}

function getPerceivedBrightness(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

function pickReadableText(bgHex: string) {
  return getPerceivedBrightness(bgHex) > 160 ? "#1a1321" : "#f9f7ff";
}

export function themeToVars(theme: PopupConfig["theme"]): CSSVarProperties {
  const onPrimary = pickReadableText(theme.primary);
  const onSecondary = pickReadableText(theme.secondary);
  const onAccent = pickReadableText(theme.accent);
  const mutedForeground = mixColors(theme.fg, theme.bg, 0.42);
  const stone = mixColors(theme.muted, theme.card, 0.35);
  const surface = mixColors(theme.bg, theme.card, 0.22);
  const surfaceStrong = mixColors(theme.bg, theme.muted, 0.45);
  const overlayStrong = mixColors(theme.fg, "#000000", 0.2);

  return {
    "--primary": theme.primary,
    "--secondary": theme.secondary,
    "--accent": theme.accent,
    "--bg": theme.bg,
    "--fg": theme.fg,
    "--muted": theme.muted,
    "--muted-foreground": mutedForeground,
    "--card": theme.card,
    "--border": theme.border,
    "--stone": stone,
    "--surface": surface,
    "--surface-strong": surfaceStrong,
    "--on-primary": onPrimary,
    "--on-secondary": onSecondary,
    "--on-accent": onAccent,
    "--hero-overlay": `linear-gradient(95deg, ${overlayStrong}d6 0%, ${overlayStrong}8c 45%, ${overlayStrong}33 100%)`
  };
}
