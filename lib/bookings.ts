export type BookingRow = {
  id: string;
  user_id: string;
  popup_key: string;
  popup_name: string;
  service_id: string;
  service_title: string;
  consultant_id: string;
  consultant_name: string;
  booking_date: string;
  booking_time: string;
  status: string;
  notes: string | null;
  last_action: string | null;
  action_reason: string | null;
  source: string;
  created_at: string;
  updated_at: string;
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
    userId: row.user_id,
    popupKey: row.popup_key,
    popupName: row.popup_name,
    serviceId: row.service_id,
    serviceTitle: row.service_title,
    consultantId: row.consultant_id,
    consultantName: row.consultant_name,
    bookingDate: row.booking_date,
    bookingTime: row.booking_time,
    status: row.status,
    notes: row.notes,
    lastAction: row.last_action,
    actionReason: row.action_reason,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
