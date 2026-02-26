import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { SectionGrid } from "@/components/sections/SectionGrid";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { ConsultantCards } from "@/components/sections/ConsultantCards";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { PopupShell } from "@/components/popup/PopupShell";
import { Button } from "@/components/ui/button";
import { getPopupConfig, getPopupKeys } from "@/lib/content";
import type { BackgroundKey } from "@/lib/theme/backgrounds";

export default function PopupInfoPage({ params }: { params: { popup: string } }) {
  if (!getPopupKeys().includes(params.popup)) {
    notFound();
  }

  const popup = getPopupConfig(params.popup);
  const info = popup.pages.info;
  const services = popup.pages.services;
  const consultants = popup.pages.consultants;
  const gallery = popup.pages.gallery;
  const products = popup.pages.products;
  const previewCount = 3;
  const seeMoreLabel = info.hero.secondaryCta.label;

  const navById = (id: string) => popup.nav.items.find((item) => item.id === id);
  const servicesNav = navById("services");
  const consultantsNav = navById("consultants");
  const galleryNav = navById("gallery");
  const productsNav = navById("products");

  const sectionBackgrounds: Record<
    "highlights" | "services" | "consultants" | "gallery" | "products",
    BackgroundKey
  > = {
    highlights: "linen",
    services: "terracottaGlow",
    consultants: "oliveAurora",
    gallery: "marilynPop",
    products: "sunsetGold"
  };

  return (
    <PopupShell popup={popup}>
      <HeroSection hero={info.hero} />
      <SectionGrid
        id="popup-highlights"
        type="grid"
        headline={info.about.headline}
        body={info.about.body}
        items={info.highlights}
        background={sectionBackgrounds.highlights}
        headingClassName="text-[var(--heading)]"
        bodyClassName="max-w-4xl"
        accentAll
      />
      <ServiceCards
        headline={services.headline}
        body={services.body}
        services={services.services.slice(0, previewCount)}
        basePath={`/explore/${popup.popupKey}/services`}
        background={sectionBackgrounds.services}
        headingClassName="text-[var(--heading)]"
      />
      {servicesNav ? (
        <div className="relative z-10 flex justify-center pb-10">
          <Button asChild variant="outline">
            <Link
              href={servicesNav.href}
              aria-label={`${seeMoreLabel} ${servicesNav.label}`}
            >
              {seeMoreLabel}
            </Link>
          </Button>
        </div>
      ) : null}
      <ConsultantCards
        headline={consultants.headline}
        body={consultants.body}
        consultants={consultants.consultants.slice(0, previewCount)}
        basePath={`/explore/${popup.popupKey}/consultants`}
        background={sectionBackgrounds.consultants}
        headingClassName="text-[var(--heading)]"
      />
      {consultantsNav ? (
        <div className="relative z-10 flex justify-center pb-10">
          <Button asChild variant="outline">
            <Link
              href={consultantsNav.href}
              aria-label={`${seeMoreLabel} ${consultantsNav.label}`}
            >
              {seeMoreLabel}
            </Link>
          </Button>
        </div>
      ) : null}
      <GalleryGrid
        headline={gallery.headline}
        body={gallery.body}
        items={gallery.items.slice(0, previewCount)}
        background={sectionBackgrounds.gallery}
        headingClassName="text-[var(--heading)]"
      />
      {galleryNav ? (
        <div className="relative z-10 flex justify-center pb-10">
          <Button asChild variant="outline">
            <Link
              href={galleryNav.href}
              aria-label={`${seeMoreLabel} ${galleryNav.label}`}
            >
              {seeMoreLabel}
            </Link>
          </Button>
        </div>
      ) : null}
      <ProductGrid
        headline={products.headline}
        body={products.body}
        products={products.products.slice(0, previewCount)}
        basePath={`/explore/${popup.popupKey}/products`}
        background={sectionBackgrounds.products}
        headingClassName="text-[var(--heading)]"
      />
      {productsNav ? (
        <div className="relative z-10 flex justify-center pb-16">
          <Button asChild variant="outline">
            <Link
              href={productsNav.href}
              aria-label={`${seeMoreLabel} ${productsNav.label}`}
            >
              {seeMoreLabel}
            </Link>
          </Button>
        </div>
      ) : null}
    </PopupShell>
  );
}

export function generateStaticParams() {
  return getPopupKeys().map((popup) => ({ popup }));
}
