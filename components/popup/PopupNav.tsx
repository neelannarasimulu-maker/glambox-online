import Link from "next/link";
import type { PopupConfig } from "@/lib/schemas";
import { cn } from "@/lib/cn";

type PopupNavProps = {
  nav: PopupConfig["nav"];
};

export function PopupNav({ nav }: PopupNavProps) {
  return (
    <nav className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-4 px-6 py-4">
        {nav.items.map((item, index) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "text-sm font-semibold text-[var(--fg)]",
              index === 0 && "text-[var(--primary)]"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
