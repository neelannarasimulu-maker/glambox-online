import Link from "next/link";
import Image from "next/image";
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
      <div className="relative h-44 w-full">
        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        {badge ? (
          <div className="absolute left-4 top-4">
            <Badge variant="pop">{badge}</Badge>
          </div>
        ) : null}
      </div>
      <CardHeader className="gap-2">
        <CardTitle>{title}</CardTitle>
        <div className="text-sm font-medium text-[var(--primary)]">
          {duration} | {priceFrom}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return href ? (
    <Link href={href} className="block">
      {card}
    </Link>
  ) : (
    card
  );
}
