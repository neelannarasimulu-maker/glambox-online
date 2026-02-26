"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";

type BookingLabels = {
  bookingHeadline: string;
  bookingBody: string;
  popupLabel: string;
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
  recommendedLabel: string;
  timeOptions: string[];
};

type BookingPopup = {
  popupKey: string;
  name: string;
  tagline: string;
  pages: {
    services: {
      services: Array<{
        id: string;
        title: string;
        duration: string;
        priceFrom: string;
        consultantIds: string[];
        details: {
          recommendedConsultants: string[];
        };
      }>;
    };
    consultants: {
      consultants: Array<{
        id: string;
        name: string;
        role: string;
      }>;
    };
  };
};

type StandaloneBookingProps = {
  labels: BookingLabels;
  popups: BookingPopup[];
};

export function StandaloneBooking({ labels, popups }: StandaloneBookingProps) {
  const router = useRouter();
  const { authReady, isAuthenticated, user } = useAuth();
  const defaultPopupKey = popups[0]?.popupKey ?? "";
  const [popupKey, setPopupKey] = useState(defaultPopupKey);
  const [serviceId, setServiceId] = useState("");
  const [consultantId, setConsultantId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(labels.timeOptions[0] ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  const selectedPopup = useMemo(
    () => popups.find((popup) => popup.popupKey === popupKey),
    [popups, popupKey]
  );

  const services = useMemo(
    () => selectedPopup?.pages.services.services ?? [],
    [selectedPopup]
  );
  const consultants = useMemo(
    () => selectedPopup?.pages.consultants.consultants ?? [],
    [selectedPopup]
  );

  useEffect(() => {
    if (!services.length) {
      setServiceId("");
      setConsultantId("");
      return;
    }
    if (!serviceId || !services.some((service) => service.id === serviceId)) {
      setServiceId(services[0].id);
    }
  }, [services, serviceId]);

  const selectedService = useMemo(
    () => services.find((service) => service.id === serviceId),
    [services, serviceId]
  );

  const recommendedConsultantIds = useMemo(() => {
    if (!selectedService) {
      return [];
    }
    const nameToId = new Map(
      consultants.map((consultant) => [consultant.name, consultant.id])
    );
    return selectedService.details.recommendedConsultants
      .map((name) => nameToId.get(name))
      .filter((value): value is string => Boolean(value));
  }, [consultants, selectedService]);

  const availableConsultants = useMemo(() => {
    if (!selectedService) {
      return [];
    }
    const matches = consultants.filter((consultant) =>
      selectedService.consultantIds.includes(consultant.id)
    );
    const recommended = matches.filter((consultant) =>
      recommendedConsultantIds.includes(consultant.id)
    );
    const remaining = matches.filter(
      (consultant) => !recommendedConsultantIds.includes(consultant.id)
    );
    return [...recommended, ...remaining];
  }, [consultants, recommendedConsultantIds, selectedService]);

  const recommendedConsultant = useMemo(
    () =>
      availableConsultants.find((consultant) =>
        recommendedConsultantIds.includes(consultant.id)
      ),
    [availableConsultants, recommendedConsultantIds]
  );

  useEffect(() => {
    if (!availableConsultants.length) {
      setConsultantId("");
      return;
    }
    if (!consultantId || !availableConsultants.some((c) => c.id === consultantId)) {
      setConsultantId(availableConsultants[0].id);
    }
  }, [availableConsultants, consultantId]);

  const selectedConsultant = useMemo(
    () => availableConsultants.find((consultant) => consultant.id === consultantId),
    [availableConsultants, consultantId]
  );

  useEffect(() => {
    setConfirmed(false);
    setError("");
  }, [popupKey, serviceId, consultantId, date, time]);

  const canConfirm = Boolean(popupKey && serviceId && consultantId && date && time);
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
    if (!canConfirm) {
      setError(labels.missingSelection);
      return;
    }

    if (!selectedPopup || !selectedService || !selectedConsultant) {
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
          popupKey: selectedPopup.popupKey,
          popupName: selectedPopup.name,
          serviceId: selectedService.id,
          serviceTitle: selectedService.title,
          consultantId: selectedConsultant.id,
          consultantName: selectedConsultant.name,
          bookingDate: date,
          bookingTime: time,
          source: "standalone"
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
    <section id="full-booking" className="py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-[var(--fg)]">
            {labels.bookingHeadline}
          </h2>
          <p className="max-w-2xl text-base text-[var(--muted-foreground)]">
            {labels.bookingBody}
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--fg)]">
                {labels.popupLabel}
              </label>
              <select
                value={popupKey}
                onChange={(event) => setPopupKey(event.target.value)}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              >
                {popups.map((popup) => (
                  <option key={popup.popupKey} value={popup.popupKey}>
                    {popup.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--fg)]">
                {labels.serviceLabel}
              </label>
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
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--fg)]">
                {labels.consultantLabel}
              </label>
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
                      {consultant.name} · {consultant.role}
                    </option>
                  ))
                )}
              </select>
              {recommendedConsultant ? (
                <div className="text-xs text-[var(--muted-foreground)]">
                  {labels.recommendedLabel}: {recommendedConsultant.name}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--fg)]">
                {labels.dateLabel}
              </label>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-[var(--fg)]">
                {labels.timeLabel}
              </label>
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
              <h3 className="text-lg font-semibold text-[var(--fg)]">
                {labels.confirmationTitle}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {labels.confirmationBody}
              </p>
              <div className="mt-4 grid gap-2 text-sm text-[var(--fg)] md:grid-cols-2">
                <div>
                  <span className="font-medium">{labels.popupLabel}:</span>{" "}
                  {selectedPopup?.name ?? "-"}
                </div>
                <div>
                  <span className="font-medium">{labels.serviceLabel}:</span>{" "}
                  {selectedService?.title ?? "-"}
                </div>
                <div>
                  <span className="font-medium">{labels.consultantLabel}:</span>{" "}
                  {selectedConsultant?.name ?? "-"}
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
      </div>
    </section>
  );
}
