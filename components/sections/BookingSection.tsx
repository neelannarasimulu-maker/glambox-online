import { Button } from "@/components/ui/button";
import { Section } from "@/components/Section";
import { Container } from "@/components/ui/container";
import { FeatureCard } from "@/components/ui/feature-card";
import type { BackgroundKey } from "@/lib/theme/backgrounds";
import type { PopupConfig } from "@/lib/schemas";

type BookingSectionProps = PopupConfig["pages"]["booking"] & {
  background?: BackgroundKey;
  headingClassName?: string;
};

export function BookingSection({
  headline,
  body,
  steps,
  cta,
  background,
  headingClassName
}: BookingSectionProps) {
  return (
    <Section background={background}>
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className={`text-3xl font-semibold ${headingClassName ?? "text-[var(--fg)]"}`}>
            {headline}
          </h2>
          <p className="max-w-2xl text-base text-[var(--muted-foreground)]">{body}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <FeatureCard
              key={step.title}
              title={step.title}
              body={step.body}
              badge={`Step ${index + 1}`}
              accent={index === 0}
            />
          ))}
        </div>
        <div>
          <Button asChild>
            <a href={cta.href}>{cta.label}</a>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
