import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import type { SiteConfig, PopupConfig } from "@/lib/schemas";

type HeroSectionProps = {
  hero: SiteConfig["landing"]["hero"] | PopupConfig["pages"]["info"]["hero"];
  accent?: string;
};

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <Section className="relative overflow-hidden p-0">
      <div
        className="relative min-h-[520px] bg-cover bg-center"
        style={{ backgroundImage: `var(--hero-overlay), url(${hero.image.src})` }}
      >
        <Container className="relative flex min-h-[520px] items-center py-16">
          <div className="max-w-xl text-[var(--on-primary)]">
            <Badge variant="pop" className="mb-5">
              {hero.badge}
            </Badge>
            <h1 className="text-5xl font-semibold tracking-[-0.02em] md:text-6xl">{hero.headline}</h1>
            <p className="mt-4 text-base leading-7 text-[var(--on-primary)] opacity-90 md:text-lg">
              {hero.subheadline}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href={hero.primaryCta.href}>{hero.primaryCta.label}</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/60 bg-white/10 text-white hover:bg-white/20"
              >
                <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--on-primary)] opacity-90">
              {hero.trustCues.map((cue) => (
                <span key={cue} className="rounded-full bg-black/25 px-3 py-1">
                  {cue}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}
