"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useCart, normalizeProductPrice } from "@/components/cart/CartProvider";

type CartActionProps = {
  popupKey: string;
  productId: string;
  name: string;
  priceLabel: string;
  image: { src: string; alt: string };
};

export function CartAction({
  popupKey,
  productId,
  name,
  priceLabel,
  image
}: CartActionProps) {
  const { addItem } = useCart();
  const price = normalizeProductPrice(priceLabel);
  const [added, setAdded] = React.useState(false);

  const handleAdd = () => {
    addItem({
      itemKey: `${popupKey}:${productId}`,
      popupKey,
      productId,
      name,
      price,
      priceLabel,
      image
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex items-center gap-3">
      <Button onClick={handleAdd}>{added ? "Added to cart" : "Add to cart"}</Button>
      {added ? (
        <span className="text-sm text-[var(--muted-foreground)]">
          Item added. View cart to checkout.
        </span>
      ) : null}
    </div>
  );
}
