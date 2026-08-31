import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { Ticket, CreateTicketInput, TicketMessage, GetTicketsParams, TicketListResponse } from "../types/support.types";

const SUPPORT_BASE = env.NEXT_PUBLIC_WHATSAPP_API_URL;

export const DEFAULT_TICKETS: Ticket[] = [
  {
    id: "tkt_001",
    ticketNumber: "TKT-8821",
    subject: "Integrasi Webhook Signature HMAC SHA256",
    category: "API",
    priority: "MEDIUM",
    status: "RESOLVED",
    messages: [
      {
        id: "msg_01",
        senderName: "Budi Santoso",
        isStaff: false,
        content: "Halo tim support, bagaimana cara memverifikasi signature header X-Wahide-Signature-256 di framework Express Node.js?",
        createdAt: "2026-08-20T10:00:00Z",
      },
      {
        id: "msg_02",
        senderName: "Wahide Engineer",
        isStaff: true,
        content: "Halo Pak Budi! Anda dapat menggunakan modul crypto bawaan Node.js dengan algoritma sha256 dan signing secret yang tertera di menu Settings > Webhook.",
        createdAt: "2026-08-20T10:15:00Z",
      },
    ],
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:15:00Z",
  },
];

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
      const res = await httpClient.get<Ticket[]>(`${SUPPORT_BASE}/support/tickets${queryString}`);
      const rawList = res.payload || (Array.isArray(res) ? res : []);
      const tickets = Array.isArray(rawList) && rawList.length > 0 ? (rawList as Ticket[]) : [];

      const addInfo = res.additional_info as { total?: number; page?: number; size?: number } | undefined;
      const total = typeof addInfo?.total === "number" ? addInfo.total : tickets.length;
      const resPage = typeof addInfo?.page === "number" ? addInfo.page : page;
      const resSize = typeof addInfo?.size === "number" ? addInfo.size : pageSize;

      return {
        tickets: tickets.length > 0 ? tickets : DEFAULT_TICKETS,
        total: total > 0 ? total : DEFAULT_TICKETS.length,
        page: resPage,
        pageSize: resSize,
      };
    } catch {
      return {
        tickets: DEFAULT_TICKETS,
        total: DEFAULT_TICKETS.length,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10,
      };
    }
  },

  createTicket: async (payload: CreateTicketInput): Promise<Ticket> => {
    const res = await httpClient.post<Ticket>(`${SUPPORT_BASE}/support/tickets`, payload);
    return (
      res.payload || {
        id: "tkt_" + Date.now(),
        ticketNumber: "TKT-" + Date.now().toString().slice(-4),
        subject: payload.subject,
        category: payload.category,
        priority: payload.priority,
        status: "OPEN",
        messages: [
          {
            id: "msg_" + Date.now(),
            senderName: "Anda",
            isStaff: false,
            content: payload.message,
            createdAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
  },

  replyTicket: async (id: string, content: string): Promise<TicketMessage> => {
    const res = await httpClient.post<TicketMessage>(`${SUPPORT_BASE}/support/tickets/${id}/reply`, { content });
    return (
      res.payload || {
        id: "msg_" + Date.now(),
        senderName: "Anda",
        isStaff: false,
        content,
        createdAt: new Date().toISOString(),
      }
    );
  },
};
