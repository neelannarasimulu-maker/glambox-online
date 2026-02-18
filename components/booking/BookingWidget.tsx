"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type BookingLabels = {
  headline: string;
  body: string;
  serviceLabel: string;
  consultantLabel: string;
  dateLabel: string;
  timeLabel: string;
  confirmLabel: string;
  confirmationTitle: string;
  confirmationBody: string;
  missingSelection: string;
  emptyService: string;
  emptyConsultant: string;
  timeOptions: string[];
};

type ServiceOption = {
  id: string;
  title: string;
  duration: string;
  priceFrom: string;
};

type ConsultantOption = {
  id: string;
  name: string;
  role: string;
};

type BookingWidgetProps = {
  labels: BookingLabels;
  services: ServiceOption[];
  consultants: ConsultantOption[];
  fixedServiceId?: string;
  fixedConsultantId?: string;
};

export function BookingWidget({
  labels,
  services,
  consultants,
  fixedServiceId,
  fixedConsultantId
}: BookingWidgetProps) {
  const defaultServiceId = fixedServiceId ?? services[0]?.id ?? "";
  const defaultConsultantId = fixedConsultantId ?? consultants[0]?.id ?? "";

  const [serviceId, setServiceId] = useState(defaultServiceId);
  const [consultantId, setConsultantId] = useState(defaultConsultantId);
  const [date, setDate] = useState("");
  const [time, setTime] = useState(labels.timeOptions[0] ?? "");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  const selectedService = useMemo(
    () => services.find((service) => service.id === serviceId),
    [services, serviceId]
  );
  const selectedConsultant = useMemo(
    () => consultants.find((consultant) => consultant.id === consultantId),
    [consultants, consultantId]
  );

  useEffect(() => {
    setConfirmed(false);
    setError("");
  }, [serviceId, consultantId, date, time]);

  const canConfirm = Boolean(serviceId && consultantId && date && time);
  const disableConfirm = services.length === 0 || consultants.length === 0;

  const handleConfirm = () => {
    if (!canConfirm) {
      setError(labels.missingSelection);
      return;
    }
    setConfirmed(true);
  };

  return (
    <section className="py-10">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-[var(--fg)]">{labels.headline}</h2>
          <p className="text-sm text-[var(--muted-foreground)]">{labels.body}</p>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--fg)]">{labels.serviceLabel}</label>
            {fixedServiceId ? (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--fg)]">
                {selectedService
                  ? `${selectedService.title} (${selectedService.duration} · ${selectedService.priceFrom})`
                  : labels.emptyService}
              </div>
            ) : (
              <select
                value={serviceId}
                onChange={(event) => setServiceId(event.target.value)}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              >
                {services.length === 0 ? (
                  <option value="">{labels.emptyService}</option>
                ) : (
                  services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title} ({service.duration} · {service.priceFrom})
                    </option>
                  ))
                )}
              </select>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--fg)]">
              {labels.consultantLabel}
            </label>
            {fixedConsultantId ? (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--fg)]">
                {selectedConsultant
                  ? `${selectedConsultant.name} · ${selectedConsultant.role}`
                  : labels.emptyConsultant}
              </div>
            ) : (
              <select
                value={consultantId}
                onChange={(event) => setConsultantId(event.target.value)}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              >
                {consultants.length === 0 ? (
                  <option value="">{labels.emptyConsultant}</option>
                ) : (
                  consultants.map((consultant) => (
                    <option key={consultant.id} value={consultant.id}>
                      {consultant.name} · {consultant.role}
                    </option>
                  ))
                )}
              </select>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--fg)]">{labels.dateLabel}</label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--fg)]">{labels.timeLabel}</label>
            <select
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
            >
              {labels.timeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-[var(--pop)]">{error}</div>
          <Button onClick={handleConfirm} disabled={disableConfirm}>
            {labels.confirmLabel}
          </Button>
        </div>
        {confirmed ? (
          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5">
            <h3 className="text-lg font-semibold text-[var(--fg)]">
              {labels.confirmationTitle}
            </h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {labels.confirmationBody}
            </p>
            <div className="mt-4 grid gap-2 text-sm text-[var(--fg)] md:grid-cols-2">
              <div>
                <span className="font-medium">{labels.serviceLabel}:</span>{" "}
                {selectedService ? selectedService.title : "-"}
              </div>
              <div>
                <span className="font-medium">{labels.consultantLabel}:</span>{" "}
                {selectedConsultant ? selectedConsultant.name : "-"}
              </div>
              <div>
                <span className="font-medium">{labels.dateLabel}:</span> {date || "-"}
              </div>
              <div>
                <span className="font-medium">{labels.timeLabel}:</span> {time || "-"}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
