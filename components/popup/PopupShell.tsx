import type { ReactNode } from "react";
import type { PopupConfig } from "@/lib/schemas";
import { ThemeProvider } from "@/components/popup/ThemeProvider";
import { PopupNav } from "@/components/popup/PopupNav";

export function PopupShell({ popup, children }: { popup: PopupConfig; children: ReactNode }) {
  return (
    <ThemeProvider theme={popup.theme} popupKey={popup.popupKey}>
      <section className="border-b border-[var(--border)] bg-[radial-gradient(120%_120%_at_0%_0%,var(--primary)_0%,transparent_40%),radial-gradient(120%_120%_at_100%_0%,var(--secondary)_0%,transparent_40%),var(--bg)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-12">
          <h1 className="text-3xl font-semibold tracking-[-0.015em] text-[var(--fg)] md:text-4xl">{popup.name}</h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted-foreground)]">
            {popup.tagline}
          </p>
        </div>
      </section>
      <PopupNav nav={popup.nav} />
      <div>{children}</div>
    </ThemeProvider>
  );
}
