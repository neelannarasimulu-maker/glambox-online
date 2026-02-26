"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, priceLabel } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-semibold text-[var(--fg)]">Your cart</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Review products from your popups before checkout.
          </p>
        </div>
        {items.length === 0 ? (
          <Card className="p-6">
            <p className="text-[var(--muted-foreground)]">
              Your cart is empty. Explore products to get started.
            </p>
            <Button asChild className="mt-4">
              <Link href="/explore">Explore popups</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <Card key={item.itemKey} className="flex flex-col gap-4 p-5 md:flex-row">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-2xl object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-[var(--fg)]">{item.name}</h2>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {item.priceLabel}
                        </p>
                      </div>
                      <Button variant="ghost" onClick={() => removeItem(item.itemKey)}>
                        Remove
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-[var(--muted-foreground)]">Qty</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) =>
                          updateQuantity(item.itemKey, Number(event.target.value))
                        }
                        className="h-10 w-20 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)]"
                      />
                    </div>
                  </div>
                  <div className="text-right text-lg font-semibold text-[var(--fg)]">
                    {priceLabel(item.price * item.quantity)}
                  </div>
                </Card>
              ))}
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
                <Link href="/checkout">Checkout</Link>
              </Button>
            </Card>
          </div>
        )}
      </Container>
    </Section>
  );
}
