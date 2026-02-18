import { notFound } from "next/navigation";
import { PopupShell } from "@/components/popup/PopupShell";
import { BookingSection } from "@/components/sections/BookingSection";
import { FoodBuilder } from "@/components/food/FoodBuilder";
import { getPopupConfig, getPopupKeys } from "@/lib/content";

export default function PopupBookingPage({ params }: { params: { popup: string } }) {
  if (!getPopupKeys().includes(params.popup as "hair" | "nails" | "wellness" | "food")) {
    notFound();
  }

  const popup = getPopupConfig(params.popup);

  return (
    <PopupShell popup={popup}>
      <BookingSection {...popup.pages.booking} headingClassName="text-[var(--heading)]" />
      {popup.pages.booking.builder ? (
        <FoodBuilder builder={popup.pages.booking.builder} />
      ) : null}
    </PopupShell>
  );
}
