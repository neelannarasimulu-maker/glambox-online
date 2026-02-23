import Link from "next/link";
import { Section } from "@/components/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-10 px-6 py-12">
      <Section
        title="About Glambox"
        subtitle="Glambox blends premium beauty artistry, wellness rituals, and effortless digital booking into one elevated experience."
        background="sunsetGold"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card accent className="p-2">
            <CardHeader className="gap-3">
              <Badge variant="pop">Our mission</Badge>
              <CardTitle>Confidence through care</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)]">
                We design services that help every client feel seen, supported, and radiant in their
                daily life.
              </p>
            </CardContent>
          </Card>

          <Card accent className="p-2">
            <CardHeader className="gap-3">
              <Badge variant="pop">Our spaces</Badge>
              <CardTitle>Beauty popups with intention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)]">
                From Hair Atelier to Wellness Lounge, each popup is curated to create comfort,
                expression, and measurable service quality.
              </p>
            </CardContent>
          </Card>

          <Card accent className="p-2">
            <CardHeader className="gap-3">
              <Badge variant="pop">Our standards</Badge>
              <CardTitle>Safety, artistry, hospitality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)]">
                Consultant matching, transparent pricing, and aftercare guidance are built into every
                booking flow.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 p-6">
          <h3 className="text-xl font-semibold text-[var(--fg)]">Visit or connect</h3>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            Explore our popup experiences, or contact Client Care for support with booking,
            consultations, and product guidance.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/explore" className="text-sm font-semibold text-[var(--primary)] hover:underline">
              Explore popups
            </Link>
            <Link href="/support" className="text-sm font-semibold text-[var(--primary)] hover:underline">
              Contact client care
            </Link>
          </div>
        </Card>
      </Section>
    </div>
  );
}
