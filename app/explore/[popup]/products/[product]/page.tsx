import { notFound } from "next/navigation";
import { PopupShell } from "@/components/popup/PopupShell";
import { Button } from "@/components/ui/button";
import { getPopupConfig, getPopupKeys } from "@/lib/content";
import { CartAction } from "@/components/cart/CartAction";

export default function ProductDetailPage({
  params
}: {
  params: { popup: string; product: string };
}) {
  if (!getPopupKeys().includes(params.popup as "hair" | "nails" | "wellness" | "food")) {
    notFound();
  }

  const popup = getPopupConfig(params.popup);
  const product = popup.pages.products.products.find(
    (item) => item.id === params.product
  );

  if (!product) {
    notFound();
  }

  return (
    <PopupShell popup={popup}>
      <section className="py-16">
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]">
            <img
              src={product.image.src}
              alt={product.image.alt}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-6">
            <div>
              {product.badge ? (
                <span className="inline-flex rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-[var(--on-accent)]">
                  {product.badge}
                </span>
              ) : null}
              <h1 className="mt-3 text-4xl font-semibold text-[var(--fg)]">{product.name}</h1>
              <p className="mt-2 text-base text-[var(--muted-foreground)]">
                {product.description}
              </p>
            </div>
            <div className="text-2xl font-semibold text-[var(--fg)]">{product.price}</div>
            <div className="flex flex-wrap gap-3">
              <CartAction
                popupKey={popup.popupKey}
                productId={product.id}
                name={product.name}
                priceLabel={product.price}
                image={product.image}
              />
            </div>
          </div>
        </div>
      </section>
    </PopupShell>
  );
}

export function generateStaticParams() {
  return getPopupKeys().flatMap((popup) => {
    const config = getPopupConfig(popup);
    return config.pages.products.products.map((product) => ({
      popup,
      product: product.id
    }));
  });
}
