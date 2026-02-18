import { notFound } from "next/navigation";
import { PopupShell } from "@/components/popup/PopupShell";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { getPopupConfig, getPopupKeys } from "@/lib/content";

export default function PopupServicesPage({ params }: { params: { popup: string } }) {
  if (!getPopupKeys().includes(params.popup as "hair" | "nails" | "wellness" | "food")) {
    notFound();
  }

  const popup = getPopupConfig(params.popup);

  return (
    <PopupShell popup={popup}>
      <ServiceCards
        {...popup.pages.services}
        basePath={`/explore/${popup.popupKey}/services`}
        background="terracottaGlow"
        headingClassName="text-[var(--heading)]"
      />
    </PopupShell>
  );
}
