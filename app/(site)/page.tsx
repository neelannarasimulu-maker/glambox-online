import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/sections/HeroSection";
import { SectionGrid } from "@/components/sections/SectionGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getSiteConfig } from "@/lib/content";

export default function LandingPage() {
  const site = getSiteConfig();
  const sectionBackgrounds = ["linen", "marilynPop", "sunsetGold"] as const;

  return (
    <div>
      <HeroSection hero={site.landing.hero} />
      {site.landing.sections.map((section, index) => (
        <SectionGrid
          key={section.id}
          {...section}
          background={sectionBackgrounds[index % sectionBackgrounds.length]}
          accentAll
        />
      ))}
      <Section>
        <Container className="flex flex-col gap-8">
          <Reveal className="flex flex-col gap-3" delayMs={60}>
            <h2 className="text-3xl font-semibold text-[var(--fg)]">{site.explore.headline}</h2>
            <p className="max-w-2xl text-base text-[var(--muted-foreground)]">
              {site.explore.body}
            </p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {site.explore.cards.map((card, index) => (
              <Reveal key={card.popupKey} delayMs={140 + index * 80}>
                <Card
                  data-theme={card.popupKey}
                  accent
                  className="vivid-surface overflow-hidden border-[color-mix(in_srgb,var(--primary)_68%,white)] text-[var(--fg)]"
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={card.image.src}
                      alt={card.image.alt}
                      fill
                      priority={index < 3}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl text-[var(--fg)]">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <p className="text-base leading-7 text-[var(--muted-foreground)]">{card.body}</p>
                    <Button
                      asChild
                      variant="outline"
                      className="border-[var(--primary)] bg-[color-mix(in_srgb,var(--card)_90%,white)] text-[var(--fg)] hover:bg-[var(--muted)]"
                    >
                      <Link href={card.href}>{card.title}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
