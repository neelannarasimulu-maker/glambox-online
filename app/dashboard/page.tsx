"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/lib/bookings";
import type { CSSProperties } from "react";

type BookingActionMode = "reschedule" | "cancel" | null;
type BookingActionState = {
  mode: BookingActionMode;
  bookingDate: string;
  bookingTime: string;
  reason: string;
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
};

const supportTelHref = "tel:+27835550142";
const supportWhatsappHref = "https://wa.me/27835550142";
const popupBadgeStyles: Record<string, CSSProperties> = {
  hair: {
    backgroundColor: "color-mix(in srgb, #7c3aed 28%, white)",
    color: "#1f2937",
    borderColor: "color-mix(in srgb, #7c3aed 55%, white)"
  },
  nails: {
    backgroundColor: "color-mix(in srgb, #db2777 28%, white)",
    color: "#111827",
    borderColor: "color-mix(in srgb, #db2777 55%, white)"
  },
  wellness: {
    backgroundColor: "color-mix(in srgb, #14b8a6 28%, white)",
    color: "#0f172a",
    borderColor: "color-mix(in srgb, #14b8a6 55%, white)"
  },
  food: {
    backgroundColor: "color-mix(in srgb, #f97316 28%, white)",
    color: "#3b1f0f",
    borderColor: "color-mix(in srgb, #f97316 55%, white)"
  }
};

const purchases = [
  { id: "order-1", popup: "Hair Atelier", productName: "Luxe Shine Oil", date: "2026-02-14", price: "R420" },
  { id: "order-2", popup: "Nail Studio", productName: "Nail Recovery Mask", date: "2026-02-12", price: "R260" },
  { id: "order-3", popup: "Wellness Lounge", productName: "Calm Balm", date: "2026-02-09", price: "R340" }
];

const chatPreviews = [
  {
    key: "hair-noah",
    consultantName: "Noah Rivera",
    popupName: "Hair Atelier",
    statusLabel: "Unavailable",
    responseTime: "Replies within 1 hour",
    href: "/explore/hair/consultants/noah/chat"
  },
  {
    key: "nails-mira",
    consultantName: "Mira Lopez",
    popupName: "Nail Studio",
    statusLabel: "Available now",
    responseTime: "Usually replies in under 5 minutes",
    href: "/explore/nails/consultants/mira/chat"
  },
  {
    key: "wellness-leila",
    consultantName: "Leila Hart",
    popupName: "Wellness Lounge",
    statusLabel: "Available now",
    responseTime: "Usually replies in under 5 minutes",
    href: "/explore/wellness/consultants/leila/chat"
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const { authReady, isAuthenticated, user, updateProfile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [bookingActions, setBookingActions] = useState<Record<string, BookingActionState>>({});
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: ""
  });

  const setBookingAction = (bookingId: string, patch: Partial<BookingActionState>) => {
    setBookingActions((previous) => {
      const current = previous[bookingId] ?? {
        mode: null,
        bookingDate: "",
        bookingTime: "",
        reason: "",
        isSubmitting: false,
        error: null,
        success: null
      };
      return {
        ...previous,
        [bookingId]: {
          ...current,
          ...patch
        }
      };
    });
  };

  useEffect(() => {
    if (!authReady) {
      return;
    }
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [authReady, isAuthenticated, router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfileForm({
      fullName: user.fullName ?? "",
      phone: user.phone ?? ""
    });
  }, [user]);

  useEffect(() => {
    if (!authReady || !isAuthenticated || !user) {
      return;
    }

    setIsLoadingBookings(true);
    setBookingsError(null);
    const scope = showAllAppointments ? "all" : "active";
    fetch(`/api/bookings?scope=${scope}`)
      .then(async (response) => {
        const result = (await response.json()) as { bookings?: Booking[]; error?: string };
        if (!response.ok) {
          throw new Error(result.error || "Could not load bookings.");
        }
        setBookings(result.bookings ?? []);
      })
      .catch((error) => {
        setBookingsError(error instanceof Error ? error.message : "Could not load bookings.");
      })
      .finally(() => {
        setIsLoadingBookings(false);
      });
  }, [authReady, isAuthenticated, user, showAllAppointments]);

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      return;
    }

    setIsSavingProfile(true);
    setProfileMessage(null);
    setProfileError(null);

    try {
      await updateProfile({ id: user.id, ...profileForm });
      setProfileMessage("Identity details updated.");
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Could not update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (!authReady || !isAuthenticated) {
    return null;
  }

  const timeOptions = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
  const sectionTitleClass = "text-2xl font-semibold tracking-[-0.015em] text-[var(--fg)]";
  const sectionBodyClass = "mt-2 text-sm leading-6 text-[var(--muted-foreground)]";
  const itemTextClass = "text-sm leading-6 text-[var(--muted-foreground)]";
  const actionLinkClass = "text-sm font-semibold text-[var(--primary)] hover:underline";
  const visibleBookings = bookings;

  const openAction = (booking: Booking, mode: Exclude<BookingActionMode, null>) => {
    setBookingAction(booking.id, {
      mode,
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
      reason: "",
      isSubmitting: false,
      error: null,
      success: null
    });
  };

  const closeAction = (bookingId: string) => {
    setBookingAction(bookingId, {
      mode: null,
      error: null
    });
  };

  const submitBookingAction = async (booking: Booking) => {
    const action = bookingActions[booking.id];
    if (!action || !user) {
      return;
    }

    setBookingAction(booking.id, { isSubmitting: true, error: null, success: null });

    try {
      const payload =
        action.mode === "reschedule"
          ? {
              action: "reschedule",
              bookingDate: action.bookingDate,
              bookingTime: action.bookingTime,
              reason: action.reason
            }
          : {
              action: "cancel",
              reason: action.reason
            };

      const response = await fetch(`/api/bookings/${encodeURIComponent(booking.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as {
        booking?: Booking;
        message?: string;
        error?: string;
      };

      if (!response.ok || !result.booking) {
        throw new Error(result.error || "Could not update appointment.");
      }

      setBookings((previous) =>
        previous.map((entry) => (entry.id === result.booking?.id ? result.booking : entry))
      );
      setBookingAction(booking.id, {
        isSubmitting: false,
        success:
          result.message ||
          (action.mode === "cancel"
            ? "Your appointment has been cancelled."
            : "Your appointment has been changed."),
        mode: null,
        error: null
      });
    } catch (error) {
      setBookingAction(booking.id, {
        isSubmitting: false,
        error: error instanceof Error ? error.message : "Could not update appointment."
      });
    }
  };

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <Card className="overflow-hidden border-none bg-[linear-gradient(130deg,color-mix(in_srgb,var(--primary)_86%,black)_0%,color-mix(in_srgb,var(--secondary)_82%,black)_100%)] p-8 text-[var(--on-primary)]">
          <h1 className="text-4xl font-semibold tracking-[-0.02em] md:text-5xl">Your Dashboard</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--on-primary)]/90">
            Signed in as {user?.email ?? "member"}
          </p>
          {!user?.onboardingCompleted ? (
            <p className="mt-3 text-sm leading-6 text-[var(--on-primary)]/90">
              Contextual profile setup is incomplete.{" "}
              <Link href="/onboarding" className="font-semibold text-white underline">
                Continue setup
              </Link>
            </p>
          ) : null}
        </Card>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6">
            <h2 className={sectionTitleClass}>My appointments</h2>
            <p className={sectionBodyClass}>
              Your actual bookings across Glambox popups.
            </p>
            <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm leading-6 text-[var(--muted-foreground)]">
              Need help changing your appointment?{" "}
              <a href={supportTelHref} className={actionLinkClass}>
                Speak to someone
              </a>{" "}
              or{" "}
              <a href={supportWhatsappHref} className={actionLinkClass}>
                WhatsApp us on +27 83 555 0142
              </a>{" "}
              or{" "}
              <Link href="/support" className={actionLinkClass}>
                open Client Care
              </Link>
              .
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {isLoadingBookings ? (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted-foreground)]">
                  Loading bookings...
                </div>
              ) : null}
              {!isLoadingBookings && bookingsError ? (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-red-500">
                  {bookingsError}
                </div>
              ) : null}
              {!isLoadingBookings && !bookingsError && visibleBookings.length === 0 ? (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted-foreground)]">
                  {showAllAppointments
                    ? "No bookings yet. Book a service to see it here."
                    : "No active or upcoming appointments right now."}
                </div>
              ) : null}
              {!isLoadingBookings && !bookingsError && bookings.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setShowAllAppointments((previous) => !previous)}
                  className={actionLinkClass}
                >
                  {showAllAppointments ? "Show active/upcoming only" : "Show all appointments"}
                </button>
              ) : null}
              {!isLoadingBookings && !bookingsError
                ? visibleBookings.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="pop"
                          className="border shadow-none"
                          style={popupBadgeStyles[item.popupKey]}
                        >
                          {item.popupName}
                        </Badge>
                        <span className="text-sm font-medium text-[var(--fg)]">{item.serviceTitle}</span>
                        <Badge variant="stone" className="capitalize">
                          {item.status}
                        </Badge>
                      </div>
                      <div className={itemTextClass}>
                        {item.consultantName} - {item.bookingDate} - {item.bookingTime}
                      </div>
                      {item.actionReason ? (
                        <div className="text-sm leading-6 text-[var(--muted-foreground)]">
                          Reason: {item.actionReason}
                        </div>
                      ) : null}
                      {bookingActions[item.id]?.success ? (
                        <div className="text-sm font-medium text-green-700">
                          {bookingActions[item.id]?.success}
                        </div>
                      ) : null}
                      {item.status !== "cancelled" ? (
                        <div className="mt-1 flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="px-3 py-2 text-sm"
                            onClick={() => openAction(item, "reschedule")}
                          >
                            Change appointment
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="px-3 py-2 text-sm"
                            onClick={() => openAction(item, "cancel")}
                          >
                            Cancel appointment
                          </Button>
                        </div>
                      ) : null}

                      {bookingActions[item.id]?.mode ? (
                        <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                          {bookingActions[item.id]?.mode === "reschedule" ? (
                            <div className="grid gap-2 sm:grid-cols-2">
                              <input
                                type="date"
                                value={bookingActions[item.id]?.bookingDate ?? item.bookingDate}
                                onChange={(event) =>
                                  setBookingAction(item.id, { bookingDate: event.target.value })
                                }
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-sm"
                                required
                              />
                              <select
                                value={bookingActions[item.id]?.bookingTime ?? item.bookingTime}
                                onChange={(event) =>
                                  setBookingAction(item.id, { bookingTime: event.target.value })
                                }
                                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-sm"
                                required
                              >
                                {timeOptions.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : null}
                          <textarea
                            placeholder="Optional reason"
                            value={bookingActions[item.id]?.reason ?? ""}
                            onChange={(event) =>
                              setBookingAction(item.id, { reason: event.target.value })
                            }
                            className="mt-2 min-h-[72px] w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-sm"
                          />
                          {bookingActions[item.id]?.error ? (
                            <div className="mt-2 text-sm text-red-600">
                              {bookingActions[item.id]?.error}
                            </div>
                          ) : null}
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Button
                              type="button"
                              className="px-3 py-2 text-sm"
                              disabled={bookingActions[item.id]?.isSubmitting}
                              onClick={() => submitBookingAction(item)}
                            >
                              {bookingActions[item.id]?.isSubmitting
                                ? "Saving..."
                                : bookingActions[item.id]?.mode === "cancel"
                                  ? "Confirm cancellation"
                                  : "Confirm change"}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              className="px-3 py-2 text-sm"
                              onClick={() => closeAction(item.id)}
                            >
                              Close
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))
                : null}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className={sectionTitleClass}>My purchases</h2>
            <p className={sectionBodyClass}>
              Recent product purchases and receipts.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {purchases.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm"
                >
                  <div>
                    <div className="text-sm font-medium text-[var(--fg)]">
                      {item.productName} - {item.popup}
                    </div>
                    <div className={itemTextClass}>{item.date}</div>
                  </div>
                  <div className="text-sm font-semibold text-[var(--primary)]">{item.price}</div>
                </div>
              ))}
              <Link href="/purchases" className={actionLinkClass}>
                View all purchases
              </Link>
            </div>
          </Card>
        </div>
        <Card className="p-6">
          <h2 className={sectionTitleClass}>My chats</h2>
          <p className={sectionBodyClass}>
            Conversations with your consultants across popups.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {chatPreviews.map((chat) => (
              <div
                key={chat.key}
                className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="pop">{chat.consultantName}</Badge>
                  <span className="text-sm text-[var(--muted-foreground)]">{chat.popupName}</span>
                </div>
                <div className={itemTextClass}>
                  {chat.statusLabel} - {chat.responseTime}
                </div>
                <Link href={chat.href} className={actionLinkClass}>
                  Open chat
                </Link>
              </div>
            ))}
            <Link href="/chats" className={actionLinkClass}>
              View all chats
            </Link>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className={sectionTitleClass}>Profile actions in context</h2>
          <p className={sectionBodyClass}>
            Update details only when needed for a service. Medical, hair, nails, and food preferences each have their own action.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Link href="/onboarding?section=medical" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm font-semibold text-[var(--fg)]">
              Update medical information
            </Link>
            <Link href="/onboarding?section=hair" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm font-semibold text-[var(--fg)]">
              Update hair preferences
            </Link>
            <Link href="/onboarding?section=nails" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm font-semibold text-[var(--fg)]">
              Update nail preferences
            </Link>
            <Link href="/onboarding?section=food" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm font-semibold text-[var(--fg)]">
              Update food preferences
            </Link>
          </div>
          <form onSubmit={handleProfileSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Full name"
              value={profileForm.fullName}
              onChange={(event) =>
                setProfileForm((previous) => ({ ...previous, fullName: event.target.value }))
              }
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={profileForm.phone}
              onChange={(event) =>
                setProfileForm((previous) => ({ ...previous, phone: event.target.value }))
              }
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
            />
            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
              <Button type="submit" disabled={isSavingProfile}>
                {isSavingProfile ? "Saving..." : "Save identity"}
              </Button>
              <Link href="/onboarding" className={actionLinkClass}>
                Open full contextual profile
              </Link>
            </div>
          </form>
          {profileMessage ? <p className="mt-3 text-sm text-green-600">{profileMessage}</p> : null}
          {profileError ? <p className="mt-3 text-sm text-red-500">{profileError}</p> : null}
        </Card>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] text-[var(--fg)]">Recommended services</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm leading-6 text-[var(--muted-foreground)]">
              <span>Signature Cut - Hair Atelier</span>
              <span>Gel Artist Set - Nail Studio</span>
              <span>Hydra Facial - Wellness Lounge</span>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] text-[var(--fg)]">Recommended consultants</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm leading-6 text-[var(--muted-foreground)]">
              <span>Noah Rivera - Cutting Specialist</span>
              <span>Mira Lopez - Nail Artist</span>
              <span>Leila Hart - Wellness Guide</span>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-2xl font-semibold tracking-[-0.015em] text-[var(--fg)]">Recommended products</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm leading-6 text-[var(--muted-foreground)]">
              <span>Luxe Shine Oil - Hair Atelier</span>
              <span>Glass File Set - Nail Studio</span>
              <span>Calm Balm - Wellness Lounge</span>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
