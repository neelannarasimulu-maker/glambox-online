import Link from "next/link";
import { notFound } from "next/navigation";
import { PopupShell } from "@/components/popup/PopupShell";
import { CatalogueBookingPanel } from "@/components/booking/CatalogueBookingPanel";
import { getPopupConfig, getPopupKeys } from "@/lib/content";

export default function PopupServiceCataloguePage({
  params,
  searchParams
}: {
  params: { popup: string };
  searchParams?: { service?: string };
}) {
  if (!getPopupKeys().includes(params.popup)) {
    notFound();
  }

  const popup = getPopupConfig(params.popup);

  return (
    <PopupShell popup={popup}>
      <section className="py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold tracking-[-0.015em] text-[var(--heading)] md:text-5xl">
              All Services
            </h1>
            <p className="max-w-3xl text-base text-[var(--muted-foreground)]">
              Browse the full service catalogue with detailed descriptions, durations, and pricing. Select a service below and book instantly with your preferred consultant.
            </p>
          </div>

          <div className="grid gap-4">
            {popup.pages.services.services.map((service) => (
              <article
                key={service.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 md:p-6"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex min-w-0 flex-col gap-1">
                    <h2 className="text-xl font-semibold text-[var(--fg)]">{service.title}</h2>
                    <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                      {service.details.longDescription}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--fg)]">
                    <span>{service.duration}</span>
                    <span className="text-[var(--muted-foreground)]">|</span>
                    <span>{service.priceFrom}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs font-medium text-[var(--fg)]"
                    >
                      {tag}
                    </span>
                  ))}
                  <Link
                    href={`/explore/${popup.popupKey}/services/catalogue?service=${service.id}#catalogue-booking`}
                    className="ml-auto text-sm font-semibold text-[var(--primary)] hover:text-[var(--fg)]"
                  >
                    Book this service
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <CatalogueBookingPanel
            popupKey={popup.popupKey}
            popupName={popup.name}
            labels={popup.pages.booking.widget}
            services={popup.pages.services.services}
            consultants={popup.pages.consultants.consultants}
            initialServiceId={searchParams?.service}
          />
        </div>
      </section>
    </PopupShell>
  );
}
