import Link from "next/link";
import type { SiteConfig } from "@/lib/schemas";
import { Container } from "@/components/ui/container";

type FooterProps = {
  config: SiteConfig;
};

export function Footer({ config }: FooterProps) {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img src={config.brand.logo.src} alt={config.brand.logo.alt} className="h-8 w-8" />
              <span className="text-lg font-semibold text-[var(--fg)]">
                {config.brand.name}
              </span>
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">{config.brand.tagline}</p>
          </div>
          {config.footer.columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-[var(--fg)]">{column.title}</span>
              <div className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-[var(--muted-foreground)] hover:text-[var(--fg)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted-foreground)] md:flex-row md:items-center md:justify-between">
          <span>{config.footer.legal.copyright}</span>
          <div className="flex gap-4">
            <Link href={config.footer.legal.termsHref}>Terms</Link>
            <Link href={config.footer.legal.privacyHref}>Privacy</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
