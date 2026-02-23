import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type FeatureCardProps = {
  title: string;
  body: string;
  badge?: string;
  accent?: boolean;
  icon?: ReactNode;
};

export function FeatureCard({ title, body, badge, accent, icon }: FeatureCardProps) {
  return (
    <Card accent={accent}>
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-4">
            {badge ? <Badge variant="pop" className="w-fit">{badge}</Badge> : null}
            <CardTitle className="leading-tight">{title}</CardTitle>
          </div>
          {icon ? <div className="shrink-0">{icon}</div> : null}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-[var(--muted-foreground)]">{body}</p>
      </CardContent>
    </Card>
  );
}
