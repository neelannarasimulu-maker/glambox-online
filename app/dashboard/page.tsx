"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { getPopupConfig } from "@/lib/content";
import { getChatStatus } from "@/lib/chatStatus";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const hair = getPopupConfig("hair");
  const nails = getPopupConfig("nails");
  const wellness = getPopupConfig("wellness");

  const appointments = [
    {
      id: "appt-hair-1",
      popup: hair.name,
      service: hair.pages.services.services[0],
      consultant: hair.pages.consultants.consultants.find((c) => c.id === "noah"),
      date: "2026-02-20",
      time: "14:00"
    },
    {
      id: "appt-wellness-1",
      popup: wellness.name,
      service: wellness.pages.services.services.find((s) => s.id === "led-glow"),
      consultant: wellness.pages.consultants.consultants.find((c) => c.id === "leila"),
      date: "2026-02-27",
      time: "10:30"
    }
  ].filter((item) => item.service && item.consultant);

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
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-[var(--fg)]">My appointments</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Upcoming and recent appointments across Glambox popups.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {appointments.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="pop">{item.popup}</Badge>
                    <span className="text-[var(--fg)]">{item.service?.title}</span>
                  </div>
                  <div className="text-[var(--muted-foreground)]">
                    {item.consultant?.name} · {item.date} · {item.time}
                  </div>
                </div>
              ))}
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
                      {item.product?.name} · {item.popup}
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
                      {status.status === "available" ? "Available now" : "Unavailable"} ·{" "}
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
          <h2 className="text-2xl font-semibold text-[var(--fg)]">My health profile</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Keep your preferences, sensitivities, and allergies up to date for safer, more
            personalised care.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              Age
              <input
                defaultValue="34"
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              Allergies (ingredients, materials, adhesives)
              <input
                defaultValue="Fragrance, latex"
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              Sensitivities (skin/scalp/nail)
              <input
                defaultValue="Scalp sensitivity"
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              Product preferences (scents, textures)
              <input
                defaultValue="Low fragrance, lightweight textures"
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              Hair preferences (colour, cut, styling)
              <input
                defaultValue="Warm tones, low-maintenance styling"
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              Nail preferences (shape, length, finish)
              <input
                defaultValue="Short almond, glossy finishes"
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              Wellness goals (skin, recovery, calm)
              <input
                defaultValue="Hydration, glow, stress relief"
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              Dislikes / avoid
              <input
                defaultValue="Heavy scents, overly hot tools"
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              />
            </label>
          </div>
          <div className="mt-4 text-xs text-[var(--muted-foreground)]">
            These are example values to illustrate the dashboard layout.
          </div>
        </Card>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[var(--fg)]">Recommended services</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              <span>Signature Cut · Hair Atelier</span>
              <span>Gel Artist Set · Nail Studio</span>
              <span>Hydra Facial · Wellness Lounge</span>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[var(--fg)]">Recommended consultants</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              <span>Noah Rivera · Cutting Specialist</span>
              <span>Mira Lopez · Nail Artist</span>
              <span>Leila Hart · Wellness Guide</span>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[var(--fg)]">Recommended products</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--muted-foreground)]">
              <span>Luxe Shine Oil · Hair Atelier</span>
              <span>Glass File Set · Nail Studio</span>
              <span>Calm Balm · Wellness Lounge</span>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
