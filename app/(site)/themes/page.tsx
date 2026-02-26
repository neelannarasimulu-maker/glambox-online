import { getPopupConfig } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { FeatureCard } from "@/components/ui/feature-card";
import { ServiceCard } from "@/components/ui/service-card";
import { ConsultantCard } from "@/components/ui/consultant-card";

function Hero({
  title,
  subtitle,
  image
}: {
  title: string;
  subtitle: string;
  image: { src: string; alt: string };
}) {
  return (
    <section
      className="relative min-h-[420px] bg-cover bg-center"
      style={{ backgroundImage: `var(--hero-overlay), url(${image.src})` }}
    >
      <div className="absolute inset-0" />
      <Container className="relative flex min-h-[420px] items-center py-16">
        <div className="max-w-xl text-[var(--on-primary)]">
          <Badge variant="pop" className="mb-4">
            Signature experience
          </Badge>
          <h1 className="text-5xl font-semibold">{title}</h1>
          <p className="mt-4 text-base text-[var(--on-primary)] opacity-90">{subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Book now</Button>
            <Button variant="outline">Explore services</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function PopupExample({ popupKey }: { popupKey: "hair" | "nails" | "wellness" }) {
  const popup = getPopupConfig(popupKey);
  const services = popup.pages.services.services.slice(0, 3);
  const consultants = popup.pages.consultants.consultants.slice(0, 3);

  return (
    <div data-theme={popupKey} className="bg-[var(--bg)] text-[var(--fg)]">
      <Hero
        title={popup.pages.info.hero.headline}
        subtitle={popup.pages.info.hero.subheadline}
        image={popup.pages.info.hero.image}
      />
      <Section>
        <Container className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold">{popup.pages.services.headline}</h2>
            <p className="max-w-2xl text-[var(--muted-foreground)]">
              {popup.pages.services.body}
            </p>
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
                badge="Popular"
              />
            ))}
          </div>
        </Container>
      </Section>
      <Section tone="stone">
        <Container className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold">{popup.pages.consultants.headline}</h2>
            <p className="max-w-2xl text-[var(--muted-foreground)]">
              {popup.pages.consultants.body}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {consultants.map((consultant) => (
              <ConsultantCard
                key={consultant.id}
                name={consultant.name}
                role={consultant.role}
                bio={consultant.bio}
                image={consultant.image}
                specialties={consultant.specialties}
                badge="Top rated"
              />
            ))}
          </div>
        </Container>
      </Section>
      <Section>
        <Container className="grid gap-6 md:grid-cols-3">
          {popup.pages.info.highlights.map((highlight) => (
            <FeatureCard
              key={highlight.title}
              title={highlight.title}
              body={highlight.body}
              badge="Atelier"
              accent
            />
          ))}
        </Container>
      </Section>
    </div>
  );
}

export default function ThemeExamplesPage() {
  return (
    <div className="bg-[var(--bg)] text-[var(--fg)]">
      <PopupExample popupKey="hair" />
      <PopupExample popupKey="nails" />
      <PopupExample popupKey="wellness" />
    </div>
  );
}
