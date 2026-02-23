import type { CSSProperties } from "react";
import type { PopupConfig } from "./schemas";

type CSSVarProperties = CSSProperties & Record<`--${string}`, string>;

export function themeToVars(theme: PopupConfig["theme"]): CSSVarProperties {
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
