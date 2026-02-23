import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";

const privacySections = [
  {
    title: "Information we collect",
    body: "We collect account details, booking preferences, and order history to deliver services and personalize your Glambox experience."
  },
  {
    title: "How we use your information",
    body: "We use personal data to confirm bookings, process payments, provide support, improve services, and send relevant updates."
  },
  {
    title: "Health and preference data",
    body: "If you share sensitivities or care preferences, we use this data to improve service safety and consultant recommendations."
  },
  {
    title: "Data sharing",
    body: "We do not sell personal information. Data is shared only with trusted providers required for payments, communications, and service operations."
  },
  {
    title: "Retention and security",
    body: "We retain data only as long as necessary for legal and operational needs, and apply reasonable safeguards to protect your information."
  },
  {
    title: "Your rights",
    body: "You may request access, correction, or deletion of your personal data by contacting privacy@glambox.com."
  }
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-10 px-6 py-12">
      <Section
        title="Privacy Policy"
        subtitle="Last updated: February 23, 2026. This policy explains how Glambox collects, uses, and protects your information."
        background="linen"
      >
        <div className="grid gap-4">
          {privacySections.map((section) => (
            <Card key={section.title} className="p-6">
              <h2 className="text-lg font-semibold text-[var(--fg)]">{section.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{section.body}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
