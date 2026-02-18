"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { getPopupConfig } from "@/lib/content";

export default function PurchasesPage() {
  const hair = getPopupConfig("hair");
  const nails = getPopupConfig("nails");
  const wellness = getPopupConfig("wellness");
  const food = getPopupConfig("food");

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
        wellness.pages.products.products.find((p) => p.id === "calm-balm")?.price ?? "R0"
    },
    {
      id: "order-4",
      popup: food.name,
      product: food.pages.products.products.find((p) => p.id === "citrus-dressing"),
      date: "2026-02-06",
      price: food.pages.products.products.find((p) => p.id === "citrus-dressing")?.price ?? "R0"
    },
    {
      id: "order-5",
      popup: hair.name,
      product: hair.pages.products.products.find((p) => p.id === "scalp-reset-serum"),
      date: "2026-01-30",
      price:
        hair.pages.products.products.find((p) => p.id === "scalp-reset-serum")?.price ?? "R0"
    },
    {
      id: "order-6",
      popup: nails.name,
      product: nails.pages.products.products.find((p) => p.id === "glass-file-set"),
      date: "2026-01-24",
      price:
        nails.pages.products.products.find((p) => p.id === "glass-file-set")?.price ?? "R0"
    },
    {
      id: "order-7",
      popup: wellness.name,
      product: wellness.pages.products.products.find((p) => p.id === "sleep-soak"),
      date: "2026-01-18",
      price:
        wellness.pages.products.products.find((p) => p.id === "sleep-soak")?.price ?? "R0"
    }
  ].filter((item) => item.product);

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
            My purchases
          </div>
          <h1 className="mt-2 text-4xl font-semibold text-[var(--fg)]">
            Purchase history
          </h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            A full record of your Glambox product purchases across all popups.
          </p>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="text-lg font-semibold text-[var(--fg)]">All purchases</div>
            <Link href="/dashboard" className="text-sm font-semibold text-[var(--fg)]">
              Back to dashboard
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {purchases.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="pop">{item.popup}</Badge>
                    <span className="text-[var(--fg)]">{item.product?.name}</span>
                  </div>
                  <div className="text-[var(--muted-foreground)]">{item.date}</div>
                </div>
                <div className="text-[var(--fg)]">{item.price}</div>
              </div>
            ))}
          </div>
        </Card>
      </Container>
    </Section>
  );
}
