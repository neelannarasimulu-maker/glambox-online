"use client";

import { useRouter } from "next/navigation";
import { useCart, priceLabel } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

export default function PaymentPage() {
  const router = useRouter();
  const { subtotal, completeOrder } = useCart();

  const handlePay = () => {
    completeOrder();
    router.push("/confirmation");
  };

  return (
    <Section>
      <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-semibold text-[var(--fg)]">Payment</h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Secure checkout for your Glambox products.
            </p>
          </div>
          <Card className="p-6">
            <form className="grid gap-4">
              <input
                placeholder="Cardholder name"
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              />
              <input
                placeholder="Card number"
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  placeholder="MM/YY"
                  className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
                />
                <input
                  placeholder="CVC"
                  className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
                />
              </div>
            </form>
          </Card>
        </div>
        <Card className="h-fit p-6">
          <h3 className="text-lg font-semibold text-[var(--fg)]">Order total</h3>
          <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted-foreground)]">
            <span>Total</span>
            <span>{priceLabel(subtotal)}</span>
          </div>
          <Button className="mt-6 w-full" onClick={handlePay}>
            Pay now
          </Button>
        </Card>
      </Container>
    </Section>
  );
}
