import { Section } from "@/components/Section";
import { Container } from "@/components/ui/container";
import type { BackgroundKey } from "@/lib/theme/backgrounds";
import { ServiceCard } from "@/components/ui/service-card";
import type { PopupConfig } from "@/lib/schemas";

type ServiceCardsProps = {
  headline: string;
  body: string;
  services: PopupConfig["pages"]["services"]["services"];
  basePath?: string;
  background?: BackgroundKey;
  headingClassName?: string;
};

export function ServiceCards({
  headline,
  body,
  services,
  basePath,
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
        </div>
      </Container>
    </Section>
  );
}
