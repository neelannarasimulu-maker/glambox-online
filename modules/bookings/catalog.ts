import { getPopupConfig } from "@/lib/content";
import { BookingInputError } from "./errors";

export function resolveBookingSelection(popupKey: string, serviceId: string, consultantId: string) {
  let popup;
  try {
    popup = getPopupConfig(popupKey);
  } catch {
    throw new BookingInputError("Invalid popup.", 400);
  }

  const service = popup.pages.services.services.find((entry) => entry.id === serviceId);
  if (!service) {
    throw new BookingInputError("Invalid service for selected popup.", 400);
  }

  const consultant = popup.pages.consultants.consultants.find((entry) => entry.id === consultantId);
  if (!consultant) {
    throw new BookingInputError("Invalid consultant for selected popup.", 400);
  }

  if (!service.consultantIds.includes(consultant.id)) {
    throw new BookingInputError("Selected consultant does not offer this service.", 400);
  }

  return {
    popupKey: popup.popupKey,
    popupName: popup.name,
    serviceId: service.id,
    serviceTitle: service.title,
    consultantId: consultant.id,
    consultantName: consultant.name
  };
}
