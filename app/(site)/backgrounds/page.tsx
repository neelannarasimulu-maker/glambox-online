import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const variants = [
  {
    key: "linen",
    title: "Tuscan Linen",
    subtitle: "Warm plaster neutrals with stone undertones."
  },
  {
    key: "terracottaGlow",
    title: "Terracotta Glow",
    subtitle: "Sun-baked clay with luminous highlights."
  },
  {
    key: "oliveAurora",
    title: "Olive Aurora",
    subtitle: "Herbal greens lifted by creamy neutrals."
  },
  {
    key: "marilynPop",
    title: "Marilyn Pop",
    subtitle: "Playful glamour with controlled blush accents."
  },
  {
    key: "sunsetGold",
    title: "Sunset Gold",
    subtitle: "Golden hour warmth with apricot flare."
  }
] as const;

export default function BackgroundsPage() {
  return (
    <div className="flex flex-col gap-10 px-6 py-12">
      {variants.map((variant, index) => (
        <Section
          key={variant.key}
          background={variant.key}
          title={variant.title}
          subtitle={variant.subtitle}
          className="shadow-[var(--shadow)]"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {[0, 1].map((item) => (
              <Card key={item} accent={item % 2 === 0} className="overflow-hidden">
                <CardHeader className="gap-3">
                  <Badge variant={index % 2 === 0 ? "pop" : "stone"}>
                    Signature
                  </Badge>
                  <CardTitle className="text-2xl text-[var(--fg)]">
                    Ritual {index + 1}.{item + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Layered texture, warm light, and gentle curves to keep the section
                    feeling premium and alive.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}
