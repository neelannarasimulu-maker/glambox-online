export type BookingRow = {
  id: string;
  userId: string;
  popupKey: string;
  popupName: string;
  serviceId: string;
  serviceTitle: string;
  consultantId: string;
  consultantName: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  notes: string | null;
  lastAction: string | null;
  actionReason: string | null;
  source: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Booking = {
  id: string;
  userId: string;
  popupKey: string;
  popupName: string;
  serviceId: string;
  serviceTitle: string;
  consultantId: string;
  consultantName: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  notes?: string | null;
  lastAction?: string | null;
  actionReason?: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
};

export function toBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    userId: row.userId,
    popupKey: row.popupKey,
    popupName: row.popupName,
    serviceId: row.serviceId,
    serviceTitle: row.serviceTitle,
    consultantId: row.consultantId,
    consultantName: row.consultantName,
    bookingDate: row.bookingDate,
    bookingTime: row.bookingTime,
    status: row.status,
    notes: row.notes,
    lastAction: row.lastAction,
    actionReason: row.actionReason,
    source: row.source,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  };
}
