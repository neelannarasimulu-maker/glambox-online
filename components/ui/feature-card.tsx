import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type FeatureCardProps = {
  title: string;
  body: string;
  badge?: string;
  accent?: boolean;
};

export function FeatureCard({ title, body, badge, accent }: FeatureCardProps) {
  return (
    <Card accent={accent}>
      <CardHeader className="gap-4">
        {badge ? <Badge variant="pop">{badge}</Badge> : null}
        <CardTitle className="text-xl text-[var(--fg)]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--muted-foreground)]">{body}</p>
      </CardContent>
    </Card>
  );
}
