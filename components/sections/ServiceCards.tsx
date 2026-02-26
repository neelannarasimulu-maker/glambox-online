import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import type { BackgroundKey } from "@/lib/theme/backgrounds";
import { ServiceCard } from "@/components/ui/service-card";
import type { PopupConfig } from "@/lib/schemas";
import Link from "next/link";

type ServiceCardsProps = {
  headline: string;
  body: string;
  services: PopupConfig["pages"]["services"]["services"];
  basePath?: string;
  showAllHref?: string;
  showAllLabel?: string;
  background?: BackgroundKey;
  headingClassName?: string;
};

export function ServiceCards({
  headline,
  body,
  services,
  basePath,
  showAllHref,
  showAllLabel = "Show All Services",
  background,
  headingClassName
}: ServiceCardsProps) {
  return (
    <Section background={background}>
      <Container className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className={`text-3xl font-semibold tracking-[-0.015em] md:text-4xl ${headingClassName ?? "text-[var(--fg)]"}`}>
            {headline}
          </h2>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted-foreground)]">{body}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              duration={service.duration}
              priceFrom={service.priceFrom}
              image={service.image}
              tags={service.tags}
              href={basePath ? `${basePath}/${service.id}` : undefined}
            />
          ))}
          {showAllHref ? (
            <Link
              href={showAllHref}
              className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-0 shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <div className="relative flex h-44 w-full items-center justify-center bg-gradient-to-br from-[var(--primary)]/15 via-[var(--secondary)]/15 to-[var(--accent)]/15 px-6 text-center">
                <span className="text-xl font-semibold tracking-[-0.01em] text-[var(--fg)]">
                  {showAllLabel}
                </span>
              </div>
              <div className="p-6">
                <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                  Open the full catalogue with detailed descriptions, durations, pricing, and booking.
                </p>
                <p className="mt-4 text-sm font-semibold text-[var(--primary)] transition-colors group-hover:text-[var(--fg)]">
                  View catalogue
                </p>
              </div>
            </Link>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
