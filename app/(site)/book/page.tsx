import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StandaloneBooking } from "@/components/booking/StandaloneBooking";
import { getPopupConfig, getPopupKeys, getSiteConfig } from "@/lib/content";

export default function BookPage() {
  const site = getSiteConfig();
  const bookingPage = site.bookingPage;
  const popups = getPopupKeys().map((popupKey) => getPopupConfig(popupKey));

  return (
    <section className="py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold text-[var(--fg)]">{bookingPage.headline}</h1>
          <p className="max-w-2xl text-base text-[var(--muted-foreground)]">
            {bookingPage.body}
          </p>
          <div>
            <Button asChild>
              <a href={bookingPage.fullBookingCta.href}>{bookingPage.fullBookingCta.label}</a>
            </Button>
          </div>
        </div>
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
            {site.explore.cards.map((card) => (
              <Card
                key={card.popupKey}
                data-theme={card.popupKey}
                accent
                className="overflow-hidden border-[var(--primary)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_88%,black)_0%,color-mix(in_srgb,var(--primary)_96%,black)_100%)] text-[var(--on-primary)]"
              >
                <img src={card.image.src} alt={card.image.alt} className="h-48 w-full object-cover" />
                <CardHeader>
                  <CardTitle className="text-2xl text-[var(--on-primary)]">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-base leading-7 text-[var(--on-primary)] opacity-95">{card.body}</p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-[var(--on-primary)] bg-[var(--on-primary)] text-[var(--primary)] hover:bg-white"
                  >
                    <Link href={card.href}>{bookingPage.popupLinksCtaLabel}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <StandaloneBooking labels={bookingPage} popups={popups} />
    </section>
  );
}
