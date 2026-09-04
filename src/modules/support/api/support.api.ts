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
  const initMessage = String(raw.message || raw.content || "");
  const messages: TicketMessage[] = Array.isArray(raw.messages)
    ? (raw.messages as Record<string, unknown>[]).map((m) => ({
        id: String(m.id || ""),
        senderName: String(
          m.senderName || m.sender_name || (m.isStaff || m.is_staff ? "Staff Support" : "Anda")
        ),
        isStaff: Boolean(m.isStaff || m.is_staff),
        content: String(m.content || m.message || ""),
        createdAt: String(m.createdAt || m.created_at || new Date().toISOString()),
      }))
    : initMessage
      ? [
          {
            id: String(raw.id || "msg_init"),
            senderName: "Anda",
            isStaff: false,
            content: initMessage,
            createdAt: String(raw.createdAt || raw.created_at || new Date().toISOString()),
          },
        ]
      : [];

  const rawStatus = String(raw.status || "OPEN").toUpperCase();
  let status: TicketStatus = "OPEN";
  if (rawStatus === "RESOLVED") {
    status = "RESOLVED";
  } else if (rawStatus === "CLOSED") {
    status = "CLOSED";
  } else if (
    rawStatus === "IN_PROGRESS" ||
    rawStatus === "PROCESSING" ||
    rawStatus === "WAITING_FOR_REPLY"
  ) {
    status = "IN_PROGRESS";
  } else {
    status = "OPEN";
  }

  const rawUser = raw.user as Record<string, unknown> | undefined;
  const user = rawUser
    ? {
        id: String(rawUser.id || ""),
        name: String(rawUser.name || ""),
        email: String(rawUser.email || ""),
      }
    : undefined;

  return {
    id: String(raw.id || ""),
    ticketNumber: String(raw.ticketNumber || raw.ref_number || raw.ticket_number || "TKT"),
    subject: String(raw.subject || ""),
    category: String(raw.category || "GENERAL").toUpperCase() as TicketCategory,
    priority: String(raw.priority || "MEDIUM").toUpperCase() as TicketPriority,
    status,
    message: initMessage,
    attachment: raw.attachment ? String(raw.attachment) : undefined,
    messages,
    createdAt: String(raw.createdAt || raw.created_at || new Date().toISOString()),
    updatedAt: String(raw.updatedAt || raw.updated_at || new Date().toISOString()),
    user,
  };
}

export const supportApi = {
  getTickets: async (params?: GetTicketsParams, signal?: AbortSignal): Promise<TicketListResponse> => {
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
      const res = await httpClient.get<unknown>(`${SUPPORT_BASE}/support/tickets${queryString}`, {
        signal,
      });
      const rawList = res.payload || (Array.isArray(res) ? res : []);
      const rawArray = Array.isArray(rawList) ? (rawList as Record<string, unknown>[]) : [];
      const tickets = rawArray.map(normalizeTicket);

      const addInfo = res.additional_info as
        { total?: number; page?: number; size?: number } | undefined;
      const total = typeof addInfo?.total === "number" ? addInfo.total : tickets.length;
      const resPage = typeof addInfo?.page === "number" ? addInfo.page : page;
      const resSize = typeof addInfo?.size === "number" ? addInfo.size : pageSize;

      return {
        tickets,
        total,
        page: resPage,
        pageSize: resSize,
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
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
    const res = await httpClient.post<Record<string, unknown>>(
      `${SUPPORT_BASE}/support/tickets/upload`,
      formData
    );
    const raw = res.payload || (res as unknown as Record<string, unknown>);
    return String(raw.url || raw.public_url || "");
  },

  createTicket: async (payload: CreateTicketInput): Promise<Ticket> => {
    const res = await httpClient.post<Record<string, unknown>>(
      `${SUPPORT_BASE}/support/tickets`,
      payload
    );
    const raw = res.payload || (res as unknown as Record<string, unknown>);
    return normalizeTicket(raw);
  },

  getReplies: async (ticketId: string, signal?: AbortSignal): Promise<TicketMessage[]> => {
    if (!ticketId) return [];
    try {
      const res = await httpClient.get<unknown>(
        `${SUPPORT_BASE}/support/tickets/${ticketId}/reply?page=1&page_size=100`,
        { signal }
      );
      const rawList = res.payload || (Array.isArray(res) ? res : []);
      const rawArray = Array.isArray(rawList) ? (rawList as Record<string, unknown>[]) : [];
      return rawArray.map((r) => {
        const user = r.user as Record<string, unknown> | undefined;
        const isAdmin = Boolean(r.is_admin || r.isAdmin);
        return {
          id: String(r.id || "reply_" + Math.random().toString(36).slice(2)),
          senderName: String(user?.name || (isAdmin ? "Staff Support" : "Anda")),
          isStaff: isAdmin,
          content: String(r.message || r.content || ""),
          attachment: r.attachment ? String(r.attachment) : undefined,
          createdAt: String(r.created_at || r.createdAt || new Date().toISOString()),
        };
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return [];
    }
  },

  replyTicket: async (id: string, content: string, attachment?: string): Promise<TicketMessage> => {
    const body: Record<string, unknown> = {
      content,
      message: content,
    };
    if (attachment) {
      body.attachment = attachment;
    }
    const res = await httpClient.post<Record<string, unknown>>(
      `${SUPPORT_BASE}/support/tickets/${id}/reply`,
      body
    );
    const raw = (res.payload || res) as Record<string, unknown>;
    return {
      id: String(raw?.id || "reply_" + Date.now()),
      senderName: String(raw?.senderName || raw?.sender_name || "Anda"),
      isStaff: Boolean(raw?.isStaff || raw?.is_staff),
      content: String(raw?.content || raw?.message || content),
      attachment: raw?.attachment ? String(raw.attachment) : attachment,
      createdAt: String(raw?.createdAt || raw?.created_at || new Date().toISOString()),
    };
  },

  getTicket: async (id: string): Promise<Ticket> => {
    const res = await httpClient.get<Record<string, unknown>>(
      `${SUPPORT_BASE}/support/tickets/${id}`
    );
    const raw = (res.payload || res) as Record<string, unknown>;
    return normalizeTicket(raw);
  },

  closeTicket: async (id: string): Promise<void> => {
    await httpClient.patch<Record<string, unknown>>(
      `${SUPPORT_BASE}/support/tickets/${id}/close`,
      {}
    );
  },

  updateTicketStatus: async (id: string, status: TicketStatus): Promise<void> => {
    await httpClient.patch<Record<string, unknown>>(
      `${SUPPORT_BASE}/admin/support/tickets/status`,
      {
        id,
        status,
      }
    );
  },
};
