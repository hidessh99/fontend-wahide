// ==============================================================================
// Wahide Frontend - Reservation Module API Client
// Standard REST API communication with Go Backend
// ==============================================================================

import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  Reservation,
  CreateReservationInput,
  UpdateReservationInput,
  ListReservationsQuery,
  CalendarSummary,
  ReservationStatus,
} from "../types/reservation.types";

const RESERVATION_BASE =
  env.NEXT_PUBLIC_RESERVATION_API_URL || env.NEXT_PUBLIC_API_BASE_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendReservation = (r: any): Reservation => {
  if (!r || typeof r !== "object") {
    return {
      id: "",
      customerName: "",
      phone: "",
      bookingDate: new Date().toISOString().slice(0, 10),
      bookingTime: "",
      serviceName: "",
      notes: "",
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  let bookingDate = r.booking_date || r.bookingDate || "";
  if (bookingDate.includes("T")) {
    bookingDate = bookingDate.split("T")[0];
  }

  return {
    id: r.id || "",
    tenantId: r.tenant_id || r.tenantId,
    customerName: r.customer_name || r.customerName || "",
    phone: r.phone || "",
    channelType: r.channel_type || r.channelType || "WHATSAPP_WEB",
    targetChatId: r.target_chat_id || r.targetChatId || undefined,
    deviceId: r.device_id || r.deviceId || undefined,
    bookingDate,
    bookingTime: r.booking_time || r.bookingTime || "",
    serviceName: r.service_name || r.serviceName || "",
    notes: r.notes || "",
    status: (r.status || "CONFIRMED").toUpperCase() as ReservationStatus,
    reminderId: r.reminder_id || r.reminderId || undefined,
    createdAt: r.created_at || r.createdAt || new Date().toISOString(),
    updatedAt: r.updated_at || r.updatedAt || new Date().toISOString(),
  };
};

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export const reservationApi = {
  getReservations: async (
    params?: ListReservationsQuery,
  ): Promise<PaginatedResult<Reservation>> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.pageSize) query.set("page_size", params.pageSize.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.status && params.status !== "ALL")
      query.set("status", params.status);
    if (params?.channelType && params.channelType !== "ALL")
      query.set("channel_type", params.channelType);
    if (params?.date) query.set("date", params.date);

    const qs = query.toString();
    const endpoint = `${RESERVATION_BASE}/reservations${qs ? `?${qs}` : ""}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(endpoint);
    const rawItems = res.payload || (Array.isArray(res) ? res : []);
    const items = Array.isArray(rawItems)
      ? rawItems.map(mapBackendReservation)
      : [];

    const additionalInfo = res.additional_info as
      { page?: number; size?: number; total?: number } | undefined;

    return {
      items,
      page: Number(additionalInfo?.page ?? params?.page ?? 1),
      pageSize: Number(additionalInfo?.size ?? params?.pageSize ?? 10),
      total: Number(additionalInfo?.total ?? items.length),
    };
  },

  getReservation: async (id: string): Promise<Reservation> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(
      `${RESERVATION_BASE}/reservations/${id}`,
    );
    return mapBackendReservation(res.payload || res);
  },

  getCalendarSummary: async (month: string): Promise<CalendarSummary> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(
      `${RESERVATION_BASE}/reservations/calendar?month=${encodeURIComponent(month)}`,
    );
    const p = res.payload || res;
    return {
      month: p.month || month,
      summary: p.summary && typeof p.summary === "object" ? p.summary : {},
      totalBookings: Number(p.total_bookings ?? p.totalBookings ?? 0),
    };
  },

  createReservation: async (
    input: CreateReservationInput,
  ): Promise<Reservation> => {
    const payload = {
      customer_name: input.customerName,
      phone: input.phone,
      channel_type: input.channelType || "WHATSAPP_WEB",
      target_chat_id: input.targetChatId,
      device_id: input.deviceId,
      waba_template_id: input.wabaTemplateId,
      waba_template_params: input.wabaTemplateParams,
      booking_date: input.bookingDate,
      booking_time: input.bookingTime || "",
      service_name: input.serviceName || "",
      notes: input.notes || "",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.post<any>(
      `${RESERVATION_BASE}/reservations`,
      payload,
    );
    return mapBackendReservation(res.payload || res);
  },

  updateReservation: async (
    id: string,
    input: UpdateReservationInput,
  ): Promise<Reservation> => {
    const payload: Record<string, unknown> = {};
    if (input.customerName !== undefined)
      payload.customer_name = input.customerName;
    if (input.phone !== undefined) payload.phone = input.phone;
    if (input.channelType !== undefined) payload.channel_type = input.channelType;
    if (input.targetChatId !== undefined)
      payload.target_chat_id = input.targetChatId;
    if (input.deviceId !== undefined) payload.device_id = input.deviceId;
    if (input.bookingDate !== undefined)
      payload.booking_date = input.bookingDate;
    if (input.bookingTime !== undefined)
      payload.booking_time = input.bookingTime;
    if (input.serviceName !== undefined)
      payload.service_name = input.serviceName;
    if (input.notes !== undefined) payload.notes = input.notes;
    if (input.status !== undefined) payload.status = input.status;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.put<any>(
      `${RESERVATION_BASE}/reservations/${id}`,
      payload,
    );
    return mapBackendReservation(res.payload || res);
  },

  updateReservationStatus: async (
    id: string,
    status: ReservationStatus,
  ): Promise<Reservation> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.patch<any>(
      `${RESERVATION_BASE}/reservations/${id}/status`,
      { status },
    );
    return mapBackendReservation(res.payload || res);
  },

  deleteReservation: async (id: string): Promise<void> => {
    await httpClient.delete(`${RESERVATION_BASE}/reservations/${id}`);
  },
};
