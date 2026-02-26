import Link from "next/link";
import Image from "next/image";
import type { SiteConfig } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type NavProps = {
  config: SiteConfig;
};

export function Nav({ config }: NavProps) {
  const exploreItem = config.nav.items.find((item) => item.type === "dropdown");
  const linkItems = config.nav.items.filter((item) => item.type === "link");

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)] backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src={config.brand.logo.src} alt={config.brand.logo.alt} width={36} height={36} className="h-9 w-9" />
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-[var(--fg)]">
              {config.brand.name}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              {config.brand.tagline}
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {exploreItem && exploreItem.type === "dropdown" ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[var(--fg)]">{exploreItem.label}</span>
              <div className="flex items-center gap-4">
                {exploreItem.children.map((child) => (
                  <Link
                    key={child.id}
                    href={child.href}
                    className="text-sm text-[var(--muted-foreground)] hover:text-[var(--fg)]"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
          {linkItems.map((item) => (
            <Button key={item.id} asChild variant="outline">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
      </Container>
    </header>
  );
}
