import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  Conversation,
  InboxMessage,
  BusinessHoursConfig,
  ListConversationsParams,
  SendReplyInput,
  ConversationStatus,
} from "../types/inbox.types";

const BASE_URL = env.NEXT_PUBLIC_WHATSAPP_API_URL;

export const inboxApi = {
  // =========================================================================
  // Live Chat Conversation Management
  // =========================================================================
  listConversations: async (
    params?: ListConversationsParams,
    signal?: AbortSignal,
  ): Promise<{ data: Conversation[]; total: number }> => {
    const query = new URLSearchParams();
    if (params?.channel_type) query.set("channel_type", params.channel_type);
    if (params?.status) query.set("status", params.status);
    if (params?.assigned_to) query.set("assigned_to", params.assigned_to);
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await httpClient.get<Conversation[]>(
      `${BASE_URL}/inbox/conversations${qs}`,
      { signal },
    );

    const total =
      (res.additional_info as { total?: number })?.total ??
      res.pagination?.total_items ??
      (Array.isArray(res.payload) ? res.payload.length : 0);

    return {
      data: res.payload || [],
      total,
    };
  },

  getConversation: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<Conversation> => {
    const res = await httpClient.get<Conversation>(
      `${BASE_URL}/inbox/conversations/${id}`,
      { signal },
    );
    return res.payload as Conversation;
  },

  listMessages: async (
    conversationId: string,
    page = 1,
    limit = 50,
    signal?: AbortSignal,
  ): Promise<{ data: InboxMessage[]; total: number }> => {
    const res = await httpClient.get<InboxMessage[]>(
      `${BASE_URL}/inbox/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
      { signal },
    );

    const total =
      (res.additional_info as { total?: number })?.total ??
      res.pagination?.total_items ??
      (Array.isArray(res.payload) ? res.payload.length : 0);

    return {
      data: res.payload || [],
      total,
    };
  },

  assignConversation: async (
    id: string,
    assignedAgentId: string | null,
  ): Promise<Conversation> => {
    const res = await httpClient.put<Conversation>(
      `${BASE_URL}/inbox/conversations/${id}/assign`,
      { assigned_agent_id: assignedAgentId },
    );
    return res.payload as Conversation;
  },

  updateStatus: async (
    id: string,
    status: ConversationStatus,
  ): Promise<Conversation> => {
    const res = await httpClient.put<Conversation>(
      `${BASE_URL}/inbox/conversations/${id}/status`,
      { status },
    );
    return res.payload as Conversation;
  },

  sendReply: async (
    id: string,
    input: SendReplyInput,
  ): Promise<InboxMessage> => {
    const res = await httpClient.post<InboxMessage>(
      `${BASE_URL}/inbox/conversations/${id}/reply`,
      input,
    );
    return res.payload as InboxMessage;
  },

  // =========================================================================
  // Business Hours & OOO Engine
  // =========================================================================
  getBusinessHours: async (
    signal?: AbortSignal,
  ): Promise<BusinessHoursConfig> => {
    const res = await httpClient.get<BusinessHoursConfig>(
      `${BASE_URL}/settings/business-hours`,
      { signal },
    );
    return res.payload as BusinessHoursConfig;
  },

  updateBusinessHours: async (
    config: Partial<BusinessHoursConfig>,
  ): Promise<BusinessHoursConfig> => {
    const res = await httpClient.put<BusinessHoursConfig>(
      `${BASE_URL}/settings/business-hours`,
      config,
    );
    return res.payload as BusinessHoursConfig;
  },
};
