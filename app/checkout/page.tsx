"use client";

import Link from "next/link";
import { useCart, priceLabel } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

export default function CheckoutPage() {
  const { subtotal } = useCart();

  return (
    <Section>
      <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-semibold text-[var(--fg)]">Checkout</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Enter your delivery details to continue.
            </p>
          </div>
          <Card className="p-6">
            <form className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  placeholder="First name"
                  className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
                />
                <input
                  placeholder="Last name"
                  className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
                />
              </div>
              <input
                placeholder="Email address"
                type="email"
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              />
              <input
                placeholder="Delivery address"
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  placeholder="City"
                  className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
                />
                <input
                  placeholder="Postal code"
                  className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
                />
              </div>
            </form>
          </Card>
        </div>
        <Card className="h-fit p-6">
          <h3 className="text-lg font-semibold text-[var(--fg)]">Order summary</h3>
          <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted-foreground)]">
            <span>Subtotal</span>
            <span>{priceLabel(subtotal)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-[var(--muted-foreground)]">
            <span>Delivery</span>
            <span>Free</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-lg font-semibold text-[var(--fg)]">
            <span>Total</span>
            <span>{priceLabel(subtotal)}</span>
          </div>
          <Button asChild className="mt-6 w-full">
            <Link href="/payment">Continue to payment</Link>
          </Button>
        </Card>
      </Container>
    </Section>
  );
}
