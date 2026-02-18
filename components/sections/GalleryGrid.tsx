import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/Section";
import { Container } from "@/components/ui/container";
import type { BackgroundKey } from "@/lib/theme/backgrounds";
import type { PopupConfig } from "@/lib/schemas";

type GalleryGridProps = PopupConfig["pages"]["gallery"] & {
  background?: BackgroundKey;
  headingClassName?: string;
};

export function GalleryGrid({
  headline,
  body,
  items,
  background,
  headingClassName
}: GalleryGridProps) {
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
          {items.map((item) => (
            <Card key={item.id} accent className="overflow-hidden">
              <img
                src={item.image.src}
                alt={item.image.alt}
                className="h-52 w-full object-cover"
              />
              <CardHeader>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--muted-foreground)]">{item.caption}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
