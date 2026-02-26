import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { StandaloneBooking } from "@/components/booking/StandaloneBooking";
import { getPopupConfig, getPopupKeys, getSiteConfig } from "@/lib/content";

export default function BookPage() {
  const site = getSiteConfig();
  const bookingPage = site.bookingPage;
  const popups = getPopupKeys().map((popupKey) => getPopupConfig(popupKey));

  return (
    <section className="py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        <Reveal className="flex flex-col gap-4" delayMs={60}>
          <h1 className="text-4xl font-semibold text-[var(--fg)]">{bookingPage.headline}</h1>
          <p className="max-w-2xl text-base text-[var(--muted-foreground)]">
            {bookingPage.body}
          </p>
          <div>
            <Button asChild>
              <Link href={bookingPage.fullBookingCta.href}>{bookingPage.fullBookingCta.label}</Link>
            </Button>
          </div>
        </Reveal>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-semibold text-[var(--fg)]">
              {bookingPage.popupLinksHeadline}
            </h2>
            <p className="max-w-2xl text-base text-[var(--muted-foreground)]">
              {bookingPage.popupLinksBody}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {site.explore.cards.map((card, index) => (
              <Reveal key={card.popupKey} delayMs={140 + index * 80}>
                <Card
                  data-theme={card.popupKey}
                  accent
                  className="vivid-surface overflow-hidden border-[color-mix(in_srgb,var(--primary)_68%,white)] text-[var(--fg)]"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={card.image.src}
                      alt={card.image.alt}
                      fill
                      priority={index < 3}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl text-[var(--fg)]">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <p className="text-base leading-7 text-[var(--muted-foreground)]">{card.body}</p>
                    <Button
                      asChild
                      variant="outline"
                      className="border-[var(--primary)] bg-[color-mix(in_srgb,var(--card)_90%,white)] text-[var(--fg)] hover:bg-[var(--muted)]"
                    >
                      <Link href={card.href}>{bookingPage.popupLinksCtaLabel}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <StandaloneBooking labels={bookingPage} popups={popups} />
    </section>
  );
}
