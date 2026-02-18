import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ConsultantCardProps = {
  name: string;
  role: string;
  bio: string;
  image: { src: string; alt: string };
  specialties?: string[];
  href?: string;
  badge?: string;
  statusLabel?: string;
};

export function ConsultantCard({
  name,
  role,
  bio,
  image,
  specialties = [],
  href,
  badge,
  statusLabel
}: ConsultantCardProps) {
  const card = (
    <Card accent className="overflow-hidden">
      <div className="relative">
        <img src={image.src} alt={image.alt} className="h-52 w-full object-cover" />
        {badge ? (
          <div className="absolute left-4 top-4">
            <Badge variant="pop">{badge}</Badge>
          </div>
        ) : null}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          <Badge variant="stone">{role}</Badge>
          {statusLabel ? <Badge variant="pop">{statusLabel}</Badge> : null}
        </div>
      </div>
      <CardHeader className="gap-2">
        <CardTitle className="text-xl text-[var(--fg)]">{name}</CardTitle>
        <div className="text-sm text-[var(--muted-foreground)]">{bio}</div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty) => (
            <Badge key={specialty}>{specialty}</Badge>
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
