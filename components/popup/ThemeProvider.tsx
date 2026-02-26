import type { ReactNode } from "react";
import type { PopupConfig } from "@/lib/schemas";
import { themeToVars } from "@/lib/theme";

export function ThemeProvider({
  theme,
  popupKey,
  children
}: {
  theme: PopupConfig["theme"];
  popupKey?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-theme={popupKey}
      style={themeToVars(theme)}
      className="bg-[var(--bg)] text-[var(--fg)]"
    >
      {children}
    </div>
  );
}
