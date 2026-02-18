import { notFound } from "next/navigation";
import { PopupShell } from "@/components/popup/PopupShell";
import { ConsultantCards } from "@/components/sections/ConsultantCards";
import { getPopupConfig, getPopupKeys } from "@/lib/content";

export default function PopupConsultantsPage({ params }: { params: { popup: string } }) {
  if (!getPopupKeys().includes(params.popup as "hair" | "nails" | "wellness" | "food")) {
    notFound();
  }

  const popup = getPopupConfig(params.popup);

  return (
    <PopupShell popup={popup}>
      <ConsultantCards
        {...popup.pages.consultants}
        basePath={`/explore/${popup.popupKey}/consultants`}
        background="oliveAurora"
        headingClassName="text-[var(--heading)]"
      />
    </PopupShell>
  );
}
