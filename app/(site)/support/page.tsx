import { getSiteConfig } from "@/lib/content";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SupportPage() {
  const site = getSiteConfig();
  const support = site.supportPage;

  return (
    <div className="flex flex-col gap-10 px-6 py-12">
      <Section title={support.headline} subtitle={support.body} background="marilynPop">
        <div className="grid gap-6 md:grid-cols-3">
          {support.channels.map((channel) => (
            <Card key={channel.label} accent className="p-2">
              <CardHeader className="gap-2">
                <Badge variant="pop">{channel.label}</Badge>
                <CardTitle className="text-xl">{channel.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--muted-foreground)]">{channel.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[var(--fg)]">Client Care Hours</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              {support.hours.map((hour) => (
                <li key={hour}>{hour}</li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[var(--fg)]">What we can help with</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              <li>Booking changes, cancellations, and consultant requests.</li>
              <li>Product order support, returns, and delivery updates.</li>
              <li>Health profile updates for safer, more personalised care.</li>
            </ul>
          </Card>
        </div>
      </Section>
    </div>
  );
}
