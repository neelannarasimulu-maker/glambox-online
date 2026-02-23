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
import { getPopupConfig } from "@/lib/content";
import { getChatStatus } from "@/lib/chatStatus";
import type { Booking } from "@/lib/bookings";

export default function DashboardPage() {
  const router = useRouter();
  const { authReady, isAuthenticated, user, updateProfile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: ""
  });

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
    fetch(`/api/bookings?userId=${encodeURIComponent(user.id)}`)
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
  }, [authReady, isAuthenticated, user]);

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

  const hair = getPopupConfig("hair");
  const nails = getPopupConfig("nails");
  const wellness = getPopupConfig("wellness");

  const purchases = [
    {
      id: "order-1",
      popup: hair.name,
      product: hair.pages.products.products.find((p) => p.id === "shine-oil"),
      date: "2026-02-14",
      price: hair.pages.products.products.find((p) => p.id === "shine-oil")?.price ?? "R0"
    },
    {
      id: "order-2",
      popup: nails.name,
      product: nails.pages.products.products.find((p) => p.id === "nail-recovery-mask"),
      date: "2026-02-12",
      price:
        nails.pages.products.products.find((p) => p.id === "nail-recovery-mask")?.price ??
        "R0"
    },
    {
      id: "order-3",
      popup: wellness.name,
      product: wellness.pages.products.products.find((p) => p.id === "calm-balm"),
      date: "2026-02-09",
      price:
        wellness.pages.products.products.find((p) => p.id === "calm-balm")?.price ??
        "R0"
    }
  ].filter((item) => item.product);

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <div>
          <h1 className="text-4xl font-semibold text-[var(--fg)]">Your Dashboard</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Signed in as {user?.email ?? "member"}
          </p>
          {!user?.onboardingCompleted ? (
            <p className="mt-2 text-sm text-[var(--fg)]">
              Contextual profile setup is incomplete.{" "}
              <Link href="/onboarding" className="font-semibold underline">
                Continue setup
              </Link>
            </p>
          ) : null}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-[var(--fg)]">My appointments</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Your actual bookings across Glambox popups.
            </p>
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
              {!isLoadingBookings && !bookingsError && bookings.length === 0 ? (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted-foreground)]">
                  No bookings yet. Book a service to see it here.
                </div>
              ) : null}
              {!isLoadingBookings && !bookingsError
                ? bookings.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="pop">{item.popupName}</Badge>
                        <span className="text-[var(--fg)]">{item.serviceTitle}</span>
                      </div>
                      <div className="text-[var(--muted-foreground)]">
                        {item.consultantName} - {item.bookingDate} - {item.bookingTime}
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-[var(--fg)]">My purchases</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Recent product purchases and receipts.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {purchases.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm"
                >
                  <div>
                    <div className="text-[var(--fg)]">
                      {item.product?.name} - {item.popup}
                    </div>
                    <div className="text-[var(--muted-foreground)]">{item.date}</div>
                  </div>
                  <div className="text-[var(--fg)]">{item.price}</div>
                </div>
              ))}
              <Link href="/purchases" className="text-sm font-semibold text-[var(--fg)]">
                View all purchases
              </Link>
            </div>
          </Card>
        </div>
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-[var(--fg)]">My chats</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Conversations with your consultants across popups.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {[hair, nails, wellness]
              .flatMap((popup) =>
                popup.pages.consultants.consultants.map((consultant) => ({
                  popup,
                  consultant
                }))
              )
              .slice(0, 3)
              .map(({ popup, consultant }) => {
                const status = getChatStatus(popup.popupKey, consultant.id);
                return (
                  <div
                    key={`${popup.popupKey}-${consultant.id}`}
                    className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="pop">{consultant.name}</Badge>
                      <span className="text-[var(--muted-foreground)]">{popup.name}</span>
                    </div>
                    <div className="text-[var(--muted-foreground)]">
                      {status.status === "available" ? "Available now" : "Unavailable"} -{" "}
                      {status.responseTime}
                    </div>
                    <Link
                      href={`/explore/${popup.popupKey}/consultants/${consultant.id}/chat`}
                      className="text-sm font-semibold text-[var(--fg)]"
                    >
                      Open chat
                    </Link>
                  </div>
                );
              })}
            <Link href="/chats" className="text-sm font-semibold text-[var(--fg)]">
              View all chats
            </Link>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-[var(--fg)]">Profile actions in context</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
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
              <Link href="/onboarding" className="text-sm font-semibold text-[var(--fg)]">
                Open full contextual profile
              </Link>
            </div>
          </form>
          {profileMessage ? <p className="mt-3 text-sm text-green-600">{profileMessage}</p> : null}
          {profileError ? <p className="mt-3 text-sm text-red-500">{profileError}</p> : null}
        </Card>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[var(--fg)]">Recommended services</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              <span>Signature Cut - Hair Atelier</span>
              <span>Gel Artist Set - Nail Studio</span>
              <span>Hydra Facial - Wellness Lounge</span>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[var(--fg)]">Recommended consultants</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              <span>Noah Rivera - Cutting Specialist</span>
              <span>Mira Lopez - Nail Artist</span>
              <span>Leila Hart - Wellness Guide</span>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[var(--fg)]">Recommended products</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
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
