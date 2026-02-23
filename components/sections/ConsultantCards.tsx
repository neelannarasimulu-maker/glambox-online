import { Section } from "@/components/Section";
import { Container } from "@/components/ui/container";
import type { BackgroundKey } from "@/lib/theme/backgrounds";
import { getChatStatus } from "@/lib/chatStatus";
import { ConsultantCard } from "@/components/ui/consultant-card";
import type { PopupConfig } from "@/lib/schemas";

type ConsultantCardsProps = {
  headline: string;
  body: string;
  consultants: PopupConfig["pages"]["consultants"]["consultants"];
  basePath?: string;
  background?: BackgroundKey;
  headingClassName?: string;
};

export function ConsultantCards({
  headline,
  body,
  consultants,
  basePath,
  background,
  headingClassName
}: ConsultantCardsProps) {
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
          {consultants.map((consultant) => (
            <ConsultantCard
              key={consultant.id}
              name={consultant.name}
              role={consultant.role}
              bio={consultant.bio}
              image={consultant.image}
              specialties={consultant.specialties}
              href={basePath ? `${basePath}/${consultant.id}` : undefined}
              statusLabel={
                basePath
                  ? getChatStatus(basePath.split("/")[2], consultant.id).status === "available"
                    ? "Available"
                    : "Unavailable"
                  : undefined
              }
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
