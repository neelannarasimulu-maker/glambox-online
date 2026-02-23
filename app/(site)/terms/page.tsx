import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";

const clauses = [
  {
    title: "1. Bookings and attendance",
    body: "Bookings are confirmed after you receive an on-screen confirmation. Please arrive at least 10 minutes before your scheduled time."
  },
  {
    title: "2. Cancellations and rescheduling",
    body: "You may reschedule or cancel up to 24 hours before your appointment through your account dashboard or via Client Care."
  },
  {
    title: "3. Pricing and payments",
    body: "Displayed prices are quoted in the listed currency and may vary for advanced or custom services confirmed during consultation."
  },
  {
    title: "4. Product purchases",
    body: "Unopened retail products may be returned within 14 days when accompanied by proof of purchase, subject to hygiene and safety rules."
  },
  {
    title: "5. Account and conduct",
    body: "You are responsible for account accuracy and lawful use of the platform. Abusive behavior toward staff may result in service refusal."
  },
  {
    title: "6. Service adjustments",
    body: "Glambox may update services, consultant schedules, and operating hours to maintain quality, safety, and operational continuity."
  }
];

export default function TermsPage() {
  return (
    <div className="flex flex-col gap-10 px-6 py-12">
      <Section
        title="Terms of Service"
        subtitle="Last updated: February 23, 2026. These terms govern use of the Glambox website, bookings, and purchases."
        background="linen"
      >
        <div className="grid gap-4">
          {clauses.map((clause) => (
            <Card key={clause.title} className="p-6">
              <h2 className="text-lg font-semibold text-[var(--fg)]">{clause.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{clause.body}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
