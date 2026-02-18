import {
  BadgeCheck,
  Brush,
  CalendarCheck,
  Clock,
  Heart,
  Leaf,
  MapPin,
  Paintbrush,
  Palette,
  Sparkles,
  Sun,
  Users,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";
import { Section } from "@/components/Section";
import { Container } from "@/components/ui/container";
import type { BackgroundKey } from "@/lib/theme/backgrounds";
import type { SiteConfig } from "@/lib/schemas";

const iconMap = {
  Sparkles,
  Palette,
  CalendarCheck,
  Users,
  MapPin,
  Clock,
  BadgeCheck,
  Paintbrush,
  Brush,
  Heart,
  Zap,
  Sun,
  Leaf
};

type SectionGridProps = SiteConfig["landing"]["sections"][number] & {
  background?: BackgroundKey;
  headingClassName?: string;
};

export function SectionGrid({
  headline,
  body,
  items,
  cta,
  background,
  headingClassName
}: SectionGridProps) {
  return (
    <Section background={background}>
      <Container className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className={`text-3xl font-semibold ${headingClassName ?? "text-[var(--fg)]"}`}>
            {headline}
          </h2>
          <p className="max-w-2xl text-base text-[var(--muted-foreground)]">{body}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Sparkles;
            return (
              <div key={item.title} className="relative">
                <FeatureCard
                  title={item.title}
                  body={item.body}
                  accent={index % 2 === 0}
                />
                <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--primary)]">
                  <Icon size={20} />
                </div>
              </div>
            );
          })}
        </div>
        {cta ? (
          <div>
            <Button asChild>
              <a href={cta.href}>{cta.label}</a>
            </Button>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
