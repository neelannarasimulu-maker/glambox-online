"use client";

import Link from "next/link";
import { useCart, priceLabel } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

export default function ConfirmationPage() {
  const { lastOrder } = useCart();
  const total = lastOrder.reduce((sum, entry) => sum + entry.price * entry.quantity, 0);

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-semibold text-[var(--fg)]">Payment confirmed</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Your order is on its way. A receipt will be sent to your email.
          </p>
        </div>
        <Card className="p-6">
          {lastOrder.length === 0 ? (
            <p className="text-[var(--muted-foreground)]">
              No recent order found. Browse products to start a new order.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {lastOrder.map((item) => (
                <div key={item.itemKey} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image.src}
                      alt={item.image.alt}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div>
                      <div className="text-sm font-semibold text-[var(--fg)]">{item.name}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">
                        Qty {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-[var(--fg)]">
                    {priceLabel(item.price * item.quantity)}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 text-sm font-semibold text-[var(--fg)]">
                <span>Total paid</span>
                <span>{priceLabel(total)}</span>
              </div>
            </div>
          )}
        </Card>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/explore">Continue shopping</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/cart">View cart</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
