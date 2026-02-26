import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import type { SiteConfig, PopupConfig } from "@/lib/schemas";

type HeroSectionProps = {
  hero: SiteConfig["landing"]["hero"] | PopupConfig["pages"]["info"]["hero"];
  accent?: string;
};

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <Section className="relative overflow-hidden p-0">
      <div className="relative min-h-[520px]">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ backgroundImage: "var(--hero-overlay)" }} />
        <Container className="relative flex min-h-[520px] items-center py-16">
          <Reveal className="max-w-xl text-[var(--on-primary)]" delayMs={80}>
            <Reveal as="div" delayMs={120}>
              <Badge variant="pop" className="mb-5">{hero.badge}</Badge>
            </Reveal>
            <Reveal as="h1" delayMs={180} className="text-5xl font-semibold tracking-[-0.02em] md:text-6xl">
              {hero.headline}
            </Reveal>
            <Reveal as="p" delayMs={240} className="mt-4 text-base leading-7 text-[var(--on-primary)] opacity-90 md:text-lg">
              {hero.subheadline}
            </Reveal>
            <Reveal as="div" delayMs={300} className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={hero.primaryCta.href}>{hero.primaryCta.label}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/60 bg-white/10 text-white hover:bg-white/20"
              >
                <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
              </Button>
            </Reveal>
            <Reveal as="div" delayMs={360} className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--on-primary)] opacity-90">
              {hero.trustCues.map((cue) => (
                <span key={cue} className="rounded-full bg-black/25 px-3 py-1">
                  {cue}
                </span>
              ))}
            </Reveal>
          </Reveal>
        </Container>
      </div>
    </Section>
  );
}
