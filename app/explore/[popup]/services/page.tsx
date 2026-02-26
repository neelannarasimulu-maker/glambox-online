import { notFound } from "next/navigation";
import { PopupShell } from "@/components/popup/PopupShell";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { getPopupConfig, getPopupKeys } from "@/lib/content";

export default function PopupServicesPage({ params }: { params: { popup: string } }) {
  if (!getPopupKeys().includes(params.popup)) {
    notFound();
  }

  const popup = getPopupConfig(params.popup);
  const previewServices = popup.pages.services.services.slice(0, 5);
  const hasMoreServices = popup.pages.services.services.length > previewServices.length;

  return (
    <PopupShell popup={popup}>
      <ServiceCards
        headline={popup.pages.services.headline}
        body={popup.pages.services.body}
        services={previewServices}
        basePath={`/explore/${popup.popupKey}/services`}
        showAllHref={
          hasMoreServices ? `/explore/${popup.popupKey}/services/catalogue` : undefined
        }
        background="terracottaGlow"
        headingClassName="text-[var(--heading)]"
      />
    </PopupShell>
  );
}
