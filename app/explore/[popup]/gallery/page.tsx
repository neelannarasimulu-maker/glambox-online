import { notFound } from "next/navigation";
import { PopupShell } from "@/components/popup/PopupShell";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { getPopupConfig, getPopupKeys } from "@/lib/content";

export default function PopupGalleryPage({ params }: { params: { popup: string } }) {
  if (!getPopupKeys().includes(params.popup)) {
    notFound();
  }

  const popup = getPopupConfig(params.popup);

  return (
    <PopupShell popup={popup}>
      <GalleryGrid
        {...popup.pages.gallery}
        background="marilynPop"
        headingClassName="text-[var(--heading)]"
      />
    </PopupShell>
  );
}
