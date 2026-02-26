import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const roles = [
  {
    title: "Senior Hair Stylist",
    type: "Full-time",
    location: "Cape Town",
    summary: "Lead consultations, precision cuts, and color services in Hair Atelier."
  },
  {
    title: "Nail Artist",
    type: "Full-time",
    location: "Cape Town",
    summary: "Deliver modern nail artistry with health-first prep and aftercare."
  },
  {
    title: "Wellness Therapist",
    type: "Part-time",
    location: "Cape Town",
    summary: "Run skin and recovery rituals with a calm, client-centered approach."
  }
];

export default function CareersPage() {
  return (
    <div className="flex flex-col gap-10 px-6 py-12">
      <Section
        title="Careers at Glambox"
        subtitle="Join a team shaping the future of premium beauty, wellness, and hospitality."
        background="marilynPop"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.title} accent className="p-2">
              <CardHeader className="gap-3">
                <Badge variant="pop">{role.type}</Badge>
                <CardTitle>{role.title}</CardTitle>
                <p className="text-sm font-medium text-[var(--primary)]">{role.location}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--muted-foreground)]">{role.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-6">
          <h3 className="text-xl font-semibold text-[var(--fg)]">How to apply</h3>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            Send your CV, portfolio, and availability to{" "}
            <a href="mailto:careers@glambox.com" className="font-semibold text-[var(--primary)] hover:underline">
              careers@glambox.com
            </a>
            . Include the role title in your subject line.
          </p>
          <div className="mt-5">
            <Link href="/about" className="text-sm font-semibold text-[var(--primary)] hover:underline">
              Learn more about Glambox
            </Link>
          </div>
        </Card>
      </Section>
    </div>
  );
}
