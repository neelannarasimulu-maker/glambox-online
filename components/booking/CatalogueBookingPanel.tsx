"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import type { PopupConfig } from "@/lib/schemas";

type BookingLabels = PopupConfig["pages"]["booking"]["widget"];
type ServiceOption = PopupConfig["pages"]["services"]["services"][number];
type ConsultantOption = PopupConfig["pages"]["consultants"]["consultants"][number];

type CatalogueBookingPanelProps = {
  popupKey: string;
  popupName: string;
  labels: BookingLabels;
  services: ServiceOption[];
  consultants: ConsultantOption[];
  initialServiceId?: string;
};

export function CatalogueBookingPanel({
  popupKey,
  popupName,
  labels,
  services,
  consultants,
  initialServiceId
}: CatalogueBookingPanelProps) {
  const router = useRouter();
  const { authReady, isAuthenticated, user } = useAuth();
  const defaultServiceId = initialServiceId && services.some((item) => item.id === initialServiceId)
    ? initialServiceId
    : services[0]?.id ?? "";

  const [serviceId, setServiceId] = useState(defaultServiceId);
  const [consultantId, setConsultantId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(labels.timeOptions[0] ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  const selectedService = useMemo(
    () => services.find((item) => item.id === serviceId),
    [serviceId, services]
  );

  const availableConsultants = useMemo(() => {
    if (!selectedService) {
      return [];
    }
    const matches = consultants.filter((consultant) =>
      selectedService.consultantIds.includes(consultant.id)
    );
    const nameToId = new Map(consultants.map((consultant) => [consultant.name, consultant.id]));
    const recommendedIds = selectedService.details.recommendedConsultants
      .map((name) => nameToId.get(name))
      .filter((value): value is string => Boolean(value));
    const recommended = matches.filter((consultant) => recommendedIds.includes(consultant.id));
    const remaining = matches.filter((consultant) => !recommendedIds.includes(consultant.id));
    return [...recommended, ...remaining];
  }, [consultants, selectedService]);

  const selectedConsultant = useMemo(
    () => availableConsultants.find((consultant) => consultant.id === consultantId),
    [availableConsultants, consultantId]
  );

  useEffect(() => {
    if (!initialServiceId) {
      return;
    }
    if (!services.some((service) => service.id === initialServiceId)) {
      return;
    }
    if (serviceId !== initialServiceId) {
      setServiceId(initialServiceId);
    }
  }, [initialServiceId, serviceId, services]);

  useEffect(() => {
    if (!services.length) {
      setServiceId("");
      return;
    }
    if (!serviceId || !services.some((service) => service.id === serviceId)) {
      setServiceId(services[0].id);
    }
  }, [serviceId, services]);

  useEffect(() => {
    if (!availableConsultants.length) {
      setConsultantId("");
      return;
    }
    if (!consultantId || !availableConsultants.some((consultant) => consultant.id === consultantId)) {
      setConsultantId(availableConsultants[0].id);
    }
  }, [availableConsultants, consultantId]);

  useEffect(() => {
    setConfirmed(false);
    setError("");
  }, [serviceId, consultantId, date, time]);

  const canConfirm = Boolean(selectedService && selectedConsultant && date && time);
  const disableConfirm = services.length === 0 || availableConsultants.length === 0;

  const handleConfirm = async () => {
    if (!authReady) {
      return;
    }
    if (!isAuthenticated || !user) {
      setError("Please sign in first to save your booking.");
      router.push("/auth/login");
      return;
    }
    if (!canConfirm || !selectedService || !selectedConsultant) {
      setError(labels.missingSelection);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          popupKey,
          popupName,
          serviceId: selectedService.id,
          serviceTitle: selectedService.title,
          consultantId: selectedConsultant.id,
          consultantName: selectedConsultant.name,
          bookingDate: date,
          bookingTime: time,
          source: "catalogue"
        })
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Could not create booking.");
      }
      setConfirmed(true);
      setError("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not create booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="catalogue-booking" className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-[var(--fg)]">{labels.headline}</h2>
        <p className="text-sm text-[var(--muted-foreground)]">{labels.body}</p>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium text-[var(--fg)]">{labels.serviceLabel}</label>
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
                  {service.title} ({service.duration} - {service.priceFrom})
                </option>
              ))
            )}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--fg)]">{labels.consultantLabel}</label>
          <select
            value={consultantId}
            onChange={(event) => setConsultantId(event.target.value)}
            className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
          >
            {availableConsultants.length === 0 ? (
              <option value="">{labels.emptyConsultant}</option>
            ) : (
              availableConsultants.map((consultant) => (
                <option key={consultant.id} value={consultant.id}>
                  {consultant.name} - {consultant.role}
                </option>
              ))
            )}
          </select>
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
        <div className="flex flex-col gap-2 md:col-span-2">
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
        <Button onClick={handleConfirm} disabled={disableConfirm || isSubmitting}>
          {isSubmitting ? "Saving..." : labels.confirmLabel}
        </Button>
      </div>
      {confirmed ? (
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5">
          <h3 className="text-lg font-semibold text-[var(--fg)]">{labels.confirmationTitle}</h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{labels.confirmationBody}</p>
          <div className="mt-4 grid gap-2 text-sm text-[var(--fg)] md:grid-cols-2">
            <div>
              <span className="font-medium">{labels.serviceLabel}:</span> {selectedService?.title ?? "-"}
            </div>
            <div>
              <span className="font-medium">{labels.consultantLabel}:</span> {selectedConsultant?.name ?? "-"}
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
    </section>
  );
}
