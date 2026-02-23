import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/Section";
import { Container } from "@/components/ui/container";
import type { BackgroundKey } from "@/lib/theme/backgrounds";
import type { PopupConfig } from "@/lib/schemas";

type ProductGridProps = PopupConfig["pages"]["products"] & {
  basePath?: string;
  background?: BackgroundKey;
  headingClassName?: string;
};

export function ProductGrid({
  headline,
  body,
  products,
  basePath,
  background,
  headingClassName
}: ProductGridProps) {
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
          {products.map((product) => {
            const href = basePath ? `${basePath}/${product.id}` : undefined;
            const card = (
              <Card accent className="overflow-hidden">
                <img
                  src={product.image.src}
                  alt={product.image.alt}
                  className="h-44 w-full object-cover"
                />
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{product.name}</CardTitle>
                    {product.badge ? <Badge variant="pop">{product.badge}</Badge> : null}
                  </div>
                  <div className="text-sm font-medium text-[var(--primary)]">{product.price}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-[var(--muted-foreground)]">{product.description}</p>
                </CardContent>
              </Card>
            );

            return href ? (
              <Link key={product.id} href={href} className="block">
                {card}
              </Link>
            ) : (
              <div key={product.id}>{card}</div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
