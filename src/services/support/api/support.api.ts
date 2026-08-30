import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { Ticket, CreateTicketInput, TicketMessage } from "../types/support.types";

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
  getTickets: async (): Promise<Ticket[]> => {
    try {
      const res = await httpClient.get<Ticket[]>(`${SUPPORT_BASE}/support/tickets`);
      return res.payload || DEFAULT_TICKETS;
    } catch {
      return DEFAULT_TICKETS;
    }
  },

  createTicket: async (payload: CreateTicketInput): Promise<Ticket> => {
    const res = await httpClient.post<Ticket>(`${SUPPORT_BASE}/support/tickets`, payload);
    return (
      res.payload || {
        id: "tkt_" + Date.now(),
        ticketNumber: "TKT-" + Math.floor(1000 + Math.random() * 9000),
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
