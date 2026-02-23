import Link from "next/link";
import type { PopupConfig } from "@/lib/schemas";
import { cn } from "@/lib/cn";

type PopupNavProps = {
  nav: PopupConfig["nav"];
};

export function PopupNav({ nav }: PopupNavProps) {
  return (
    <nav className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,white)]">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-2 px-6 py-3">
        {nav.items.map((item, index) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--fg)]",
              index === 0 && "bg-[var(--muted)] text-[var(--primary)]"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
