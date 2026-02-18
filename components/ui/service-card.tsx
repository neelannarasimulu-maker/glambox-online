import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ServiceCardProps = {
  title: string;
  description: string;
  duration: string;
  priceFrom: string;
  image: { src: string; alt: string };
  tags?: string[];
  href?: string;
  badge?: string;
};

export function ServiceCard({
  title,
  description,
  duration,
  priceFrom,
  image,
  tags = [],
  href,
  badge
}: ServiceCardProps) {
  const card = (
    <Card accent className="overflow-hidden">
      <div className="relative">
        <img src={image.src} alt={image.alt} className="h-44 w-full object-cover" />
        {badge ? (
          <div className="absolute left-4 top-4">
            <Badge variant="pop">{badge}</Badge>
          </div>
        ) : null}
      </div>
      <CardHeader className="gap-2">
        <CardTitle className="text-xl text-[var(--fg)]">{title}</CardTitle>
        <div className="text-sm text-[var(--muted-foreground)]">
          {duration} · {priceFrom}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return href ? (
    <Link href={href} className="block transition hover:-translate-y-1">
      {card}
    </Link>
  ) : (
    card
  );
}
