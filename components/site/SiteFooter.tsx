import Link from "next/link";
import type { SiteConfig } from "@/lib/schemas";

export function SiteFooter({ config }: { config: SiteConfig }) {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
        <div className="grid gap-5 md:grid-cols-3">
          {config.footer.columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-[var(--fg)]">{column.title}</h3>
              <div className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-[var(--muted-foreground)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start justify-between gap-2 border-t border-[var(--border)] pt-3 text-xs text-[var(--muted-foreground)] md:flex-row md:items-center">
          <span>{config.footer.legal.copyright}</span>
          <div className="flex gap-4">
            <Link href={config.footer.legal.termsHref}>{config.footer.legal.termsHref}</Link>
            <Link href={config.footer.legal.privacyHref}>{config.footer.legal.privacyHref}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
