import { notFound } from "next/navigation";
import { PopupShell } from "@/components/popup/PopupShell";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { Button } from "@/components/ui/button";
import { getPopupConfig, getPopupKeys } from "@/lib/content";
import { getChatStatus } from "@/lib/chatStatus";

export default function ConsultantDetailPage({
  params
}: {
  params: { popup: string; consultant: string };
}) {
  if (!getPopupKeys().includes(params.popup as "hair" | "nails" | "wellness" | "food")) {
    notFound();
  }

  const popup = getPopupConfig(params.popup);
  const consultant = popup.pages.consultants.consultants.find(
    (item) => item.id === params.consultant
  );

  if (!consultant) {
    notFound();
  }

  const relatedServices = popup.pages.services.services.filter((service) =>
    service.consultantIds.includes(consultant.id)
  );
  const chatStatus = getChatStatus(popup.popupKey, consultant.id);

  return (
    <PopupShell popup={popup}>
      <section className="py-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={consultant.image.src}
              alt={consultant.image.alt}
              className="h-72 w-full object-cover md:h-96"
            />
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-semibold text-[var(--fg)]">
              {consultant.name}
            </h1>
            <div className="text-base text-[var(--muted-foreground)]">{consultant.role}</div>
            <p className="max-w-3xl text-base text-[var(--muted-foreground)]">
              {consultant.extendedBio}
            </p>
            <div className="flex flex-wrap gap-2">
              {consultant.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-medium text-[var(--fg)]"
                >
                  {specialty}
                </span>
              ))}
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h2 className="text-lg font-semibold text-[var(--fg)]">Credentials</h2>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm text-[var(--muted-foreground)]">
                {consultant.credentials.map((credential) => (
                  <li key={credential}>{credential}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <a href={`/explore/${popup.popupKey}/consultants/${consultant.id}/chat`}>
                  Chat with {consultant.name}
                </a>
              </Button>
              <span className="text-sm text-[var(--muted-foreground)]">
                {chatStatus.status === "available" ? "Available now" : "Unavailable"} ·{" "}
                {chatStatus.responseTime}
              </span>
            </div>
          </div>
        </div>
      </section>
      {relatedServices.length ? (
        <ServiceCards
          headline={popup.pages.consultants.relatedServices.headline}
          body={popup.pages.consultants.relatedServices.body}
          services={relatedServices}
          basePath={`/explore/${popup.popupKey}/services`}
        />
      ) : (
        <section className="py-10">
          <div className="mx-auto w-full max-w-5xl px-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm text-[var(--muted-foreground)]">
              {popup.pages.consultants.relatedServices.emptyMessage}
            </div>
          </div>
        </section>
      )}
      <div className="mx-auto w-full max-w-5xl px-6">
        <BookingWidget
          popupKey={popup.popupKey}
          popupName={popup.name}
          labels={popup.pages.booking.widget}
          services={relatedServices.map((service) => ({
            id: service.id,
            title: service.title,
            duration: service.duration,
            priceFrom: service.priceFrom
          }))}
          consultants={[
            {
              id: consultant.id,
              name: consultant.name,
              role: consultant.role
            }
          ]}
          fixedConsultantId={consultant.id}
        />
      </div>
    </PopupShell>
  );
}

export function generateStaticParams() {
  return getPopupKeys().flatMap((popup) => {
    const config = getPopupConfig(popup);
    return config.pages.consultants.consultants.map((consultant) => ({
      popup,
      consultant: consultant.id
    }));
  });
}
