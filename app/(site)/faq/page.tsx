import { getSiteConfig } from "@/lib/content";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FaqPage() {
  const site = getSiteConfig();
  const faq = site.faqPage;

  return (
    <div className="flex flex-col gap-10 px-6 py-12">
      <Section title={faq.headline} subtitle={faq.body} background="linen">
        <div className="grid gap-6 md:grid-cols-2">
          {faq.categories.map((category) => (
            <Card key={category.title} accent className="p-2">
              <CardHeader>
                <CardTitle className="text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {category.items.map((item) => (
                  <div key={item.question}>
                    <h3 className="text-sm font-semibold text-[var(--fg)]">{item.question}</h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{item.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
