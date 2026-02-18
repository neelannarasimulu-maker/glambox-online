import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { SectionGrid } from "@/components/sections/SectionGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
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
        />
      ))}
      <Section>
        <Container className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold text-[var(--fg)]">{site.explore.headline}</h2>
            <p className="max-w-2xl text-base text-[var(--muted-foreground)]">
              {site.explore.body}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {site.explore.cards.map((card) => (
              <Card
                key={card.popupKey}
                data-theme={card.popupKey}
                accent
                className="overflow-hidden border-[var(--primary)] bg-[var(--primary)] text-[var(--on-primary)]"
              >
                <img src={card.image.src} alt={card.image.alt} className="h-40 w-full object-cover" />
                <CardHeader>
                  <CardTitle className="text-xl text-[var(--on-primary)]">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-sm text-[var(--on-primary)] opacity-90">{card.body}</p>
                  <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                    <Link href={card.href}>{card.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
