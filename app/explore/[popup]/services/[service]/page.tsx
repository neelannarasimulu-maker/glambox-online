import { notFound } from "next/navigation";
import { PopupShell } from "@/components/popup/PopupShell";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { ConsultantCards } from "@/components/sections/ConsultantCards";
import { getPopupConfig, getPopupKeys } from "@/lib/content";

export default function ServiceDetailPage({
  params
}: {
  params: { popup: string; service: string };
}) {
  if (!getPopupKeys().includes(params.popup as "hair" | "nails" | "wellness" | "food")) {
    notFound();
  }

  const popup = getPopupConfig(params.popup);
  const service = popup.pages.services.services.find(
    (item) => item.id === params.service
  );

  if (!service) {
    notFound();
  }

  const relatedConsultants = popup.pages.consultants.consultants.filter(
    (consultant) => service.consultantIds.includes(consultant.id)
  );

  return (
    <PopupShell popup={popup}>
      <section className="py-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={service.image.src}
              alt={service.image.alt}
              className="h-72 w-full object-cover md:h-96"
            />
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-semibold text-[var(--fg)]">
              {service.title}
            </h1>
            <div className="text-base text-[var(--muted-foreground)]">
              {service.duration} - {service.priceFrom}
            </div>
            <p className="max-w-3xl text-base text-[var(--muted-foreground)]">
              {service.details.longDescription}
            </p>
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-medium text-[var(--fg)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <h2 className="text-lg font-semibold text-[var(--fg)]">Prep steps</h2>
                <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm text-[var(--muted-foreground)]">
                  {service.details.prepSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <h2 className="text-lg font-semibold text-[var(--fg)]">Aftercare</h2>
                <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm text-[var(--muted-foreground)]">
                  {service.details.aftercareSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {relatedConsultants.length ? (
        <ConsultantCards
          headline={popup.pages.services.relatedConsultants.headline}
          body={popup.pages.services.relatedConsultants.body}
          consultants={relatedConsultants}
          basePath={`/explore/${popup.popupKey}/consultants`}
        />
      ) : (
        <section className="py-10">
          <div className="mx-auto w-full max-w-5xl px-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm text-[var(--muted-foreground)]">
              {popup.pages.services.relatedConsultants.emptyMessage}
            </div>
          </div>
        </section>
      )}
      <div className="mx-auto w-full max-w-5xl px-6">
        <BookingWidget
          labels={popup.pages.booking.widget}
          services={[
            {
              id: service.id,
              title: service.title,
              duration: service.duration,
              priceFrom: service.priceFrom
            }
          ]}
          consultants={relatedConsultants.map((consultant) => ({
            id: consultant.id,
            name: consultant.name,
            role: consultant.role
          }))}
          fixedServiceId={service.id}
        />
      </div>
    </PopupShell>
  );
}

export function generateStaticParams() {
  return getPopupKeys().flatMap((popup) => {
    const config = getPopupConfig(popup);
    return config.pages.services.services.map((service) => ({
      popup,
      service: service.id
    }));
  });
}
