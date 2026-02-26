import Link from "next/link";
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
import { Section } from "@/components/ui/section";
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
  bodyClassName?: string;
  accentAll?: boolean;
};

export function SectionGrid({
  headline,
  body,
  items,
  cta,
  background,
  headingClassName,
  bodyClassName,
  accentAll = false
}: SectionGridProps) {
  return (
    <Section background={background}>
      <Container className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className={`text-3xl font-semibold tracking-[-0.015em] md:text-4xl ${headingClassName ?? "text-[var(--fg)]"}`}>
            {headline}
          </h2>
          <p
            className={`${bodyClassName ?? "max-w-2xl"} text-base leading-7 text-[var(--muted-foreground)]`}
          >
            {body}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Sparkles;
            return (
              <FeatureCard
                key={item.title}
                title={item.title}
                body={item.body}
                accent={accentAll || index % 2 === 0}
                icon={
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--border)_70%,white)] bg-[var(--muted)] text-[var(--primary)] shadow-[var(--shadow-soft)]">
                    <Icon size={20} />
                  </div>
                }
              />
            );
          })}
        </div>
        {cta ? (
          <div>
            <Button asChild>
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
