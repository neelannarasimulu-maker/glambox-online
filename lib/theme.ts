import type { CSSProperties } from "react";
import type { PopupConfig } from "./schemas";

export function themeToVars(theme: PopupConfig["theme"]): CSSProperties {
  return {
    "--primary": theme.primary,
    "--secondary": theme.secondary,
    "--accent": theme.accent,
    "--bg": theme.bg,
    "--fg": theme.fg,
    "--muted": theme.muted,
    "--card": theme.card,
    "--border": theme.border
  };
}
