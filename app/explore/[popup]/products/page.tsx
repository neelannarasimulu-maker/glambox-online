import { notFound } from "next/navigation";
import { PopupShell } from "@/components/popup/PopupShell";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { getPopupConfig, getPopupKeys } from "@/lib/content";

export default function PopupProductsPage({ params }: { params: { popup: string } }) {
  if (!getPopupKeys().includes(params.popup as "hair" | "nails" | "wellness" | "food")) {
    notFound();
  }

  const popup = getPopupConfig(params.popup);

  return (
    <PopupShell popup={popup}>
      <ProductGrid
        {...popup.pages.products}
        basePath={`/explore/${popup.popupKey}/products`}
        background="sunsetGold"
        headingClassName="text-[var(--heading)]"
      />
    </PopupShell>
  );
}
