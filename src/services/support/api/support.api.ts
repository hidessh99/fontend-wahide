import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  Ticket,
  CreateTicketInput,
  TicketMessage,
  GetTicketsParams,
  TicketListResponse,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../types/support.types";

const SUPPORT_BASE = env.NEXT_PUBLIC_WHATSAPP_API_URL;

export function normalizeTicket(raw: Record<string, unknown>): Ticket {
  return {
    id: String(raw.id || ""),
    ticketNumber: String(raw.ticketNumber || raw.ref_number || raw.ticket_number || raw.id || "TKT"),
    subject: String(raw.subject || ""),
    category: (String(raw.category || "GENERAL").toUpperCase() as TicketCategory),
    priority: (String(raw.priority || "MEDIUM").toUpperCase() as TicketPriority),
    status: (String(raw.status || "OPEN").toUpperCase() as TicketStatus),
    attachment: raw.attachment ? String(raw.attachment) : undefined,
    messages: Array.isArray(raw.messages)
      ? (raw.messages as Record<string, unknown>[]).map((m) => ({
          id: String(m.id || ""),
          senderName: String(m.senderName || m.sender_name || (m.isStaff || m.is_staff ? "Staff Support" : "Anda")),
          isStaff: Boolean(m.isStaff || m.is_staff),
          content: String(m.content || m.message || ""),
          createdAt: String(m.createdAt || m.created_at || new Date().toISOString()),
        }))
      : [
          {
            id: String(raw.id || "msg_init"),
            senderName: "Anda",
            isStaff: false,
            content: String(raw.message || ""),
            createdAt: String(raw.createdAt || raw.created_at || new Date().toISOString()),
          },
        ],
    createdAt: String(raw.createdAt || raw.created_at || new Date().toISOString()),
    updatedAt: String(raw.updatedAt || raw.updated_at || new Date().toISOString()),
  };
}

export const supportApi = {
  getTickets: async (params?: GetTicketsParams): Promise<TicketListResponse> => {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 10;
      const query = new URLSearchParams();
      query.set("page", String(page));
      query.set("page_size", String(pageSize));
      if (params?.search && params.search.trim()) {
        query.set("search", params.search.trim());
      }
      if (params?.status && params.status !== "ALL") {
        query.set("status", params.status);
      }
      const queryString = `?${query.toString()}`;
      const res = await httpClient.get<unknown>(`${SUPPORT_BASE}/support/tickets${queryString}`);
      const rawList = res.payload || (Array.isArray(res) ? res : []);
      const rawArray = Array.isArray(rawList) ? (rawList as Record<string, unknown>[]) : [];
      const tickets = rawArray.map(normalizeTicket);

      const addInfo = res.additional_info as { total?: number; page?: number; size?: number } | undefined;
      const total = typeof addInfo?.total === "number" ? addInfo.total : tickets.length;
      const resPage = typeof addInfo?.page === "number" ? addInfo.page : page;
      const resSize = typeof addInfo?.size === "number" ? addInfo.size : pageSize;

      return {
        tickets,
        total,
        page: resPage,
        pageSize: resSize,
      };
    } catch {
      return {
        tickets: [],
        total: 0,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10,
      };
    }
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await httpClient.post<Record<string, unknown>>(`${SUPPORT_BASE}/support/tickets/upload`, formData);
    const raw = res.payload || (res as unknown as Record<string, unknown>);
    return String(raw.url || raw.public_url || "");
  },

  createTicket: async (payload: CreateTicketInput): Promise<Ticket> => {
    const res = await httpClient.post<Record<string, unknown>>(`${SUPPORT_BASE}/support/tickets`, payload);
    const raw = res.payload || (res as unknown as Record<string, unknown>);
    return normalizeTicket(raw);
  },

  replyTicket: async (id: string, content: string): Promise<TicketMessage> => {
    const res = await httpClient.post<Record<string, unknown>>(`${SUPPORT_BASE}/support/tickets/${id}/reply`, {
      content,
      message: content,
    });
    const raw = res.payload || (res as unknown as Record<string, unknown>);
    return {
      id: String(raw.id || "msg_" + Date.now()),
      senderName: String(raw.senderName || raw.sender_name || "Anda"),
      isStaff: Boolean(raw.isStaff || raw.is_staff),
      content: String(raw.content || raw.message || content),
      createdAt: String(raw.createdAt || raw.created_at || new Date().toISOString()),
    };
  },
};
