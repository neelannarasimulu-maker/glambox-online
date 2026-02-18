import { BookingSection } from "@/components/sections/BookingSection";
import { ConsultantCards } from "@/components/sections/ConsultantCards";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { SectionGrid } from "@/components/sections/SectionGrid";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { PopupShell } from "@/components/popup/PopupShell";
import { getPopupConfig, getSiteConfig } from "@/lib/content";

export default function UIKitPage() {
  const site = getSiteConfig();
  const popup = getPopupConfig("hair");

  return (
    <PopupShell popup={popup}>
      <section className="py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6">
          <h1 className="text-4xl font-semibold text-[var(--fg)]">{site.uiKit.headline}</h1>
          <p className="max-w-2xl text-base text-[var(--muted-foreground)]">{site.uiKit.body}</p>
        </div>
      </section>
      <HeroSection hero={popup.pages.info.hero} />
      <SectionGrid {...site.landing.sections[0]} />
      <ServiceCards {...popup.pages.services} />
      <ConsultantCards {...popup.pages.consultants} />
      <GalleryGrid {...popup.pages.gallery} />
      <ProductGrid {...popup.pages.products} />
      <BookingSection {...popup.pages.booking} />
    </PopupShell>
  );
}
