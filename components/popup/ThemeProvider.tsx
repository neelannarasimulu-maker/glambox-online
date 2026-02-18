import type { ReactNode } from "react";
import type { PopupConfig } from "@/lib/schemas";

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
    <div data-theme={popupKey} className="bg-[var(--bg)] text-[var(--fg)]">
      {children}
    </div>
  );
}
