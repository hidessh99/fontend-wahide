// ==============================================================================
// Wahide Omnichannel Live Chat Inbox & Business Hours Types
// ==============================================================================

export type ChannelType =
  | "WHATSMEOW_UNOFFICIAL"
  | "META_WABA_OFFICIAL"
  | "TELEGRAM_BOT";

export type ConversationStatus = "OPEN" | "RESOLVED" | "CLOSED";

export type MessageDirection = "INBOUND" | "OUTBOUND";

export type MessageType = "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";

export type MessageDeliveryStatus =
  | "PENDING"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "FAILED";

export interface ContactInfo {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar_url?: string;
  channel_origin?: string;
  telegram_chat_id?: number;
}

export interface Conversation {
  id: string;
  tenant_id: string;
  contact_id: string;
  channel_type: ChannelType;
  channel_identifier: string;
  assigned_agent_id?: string | null;
  status: ConversationStatus;
  last_message_at: string;
  last_message_text: string;
  unread_count: number;
  contact?: ContactInfo;
  created_at: string;
  updated_at: string;
}

export interface InboxMessage {
  id: string;
  tenant_id: string;
  conversation_id: string;
  channel_message_id: string;
  direction: MessageDirection;
  message_type: MessageType;
  message_body: string;
  media_url?: string | null;
  status: MessageDeliveryStatus;
  sender_id?: string | null;
  timestamp: string;
  created_at: string;
}

export interface DaySchedule {
  open: string;
  close: string;
  active: boolean;
}

export interface BusinessHoursConfig {
  id?: string;
  tenant_id?: string;
  timezone: string;
  is_enabled: boolean;
  schedule: Record<string, DaySchedule>;
  out_of_office_message: string;
  is_open_now?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ListConversationsParams {
  channel_type?: ChannelType;
  status?: ConversationStatus;
  assigned_to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SendReplyInput {
  message_text: string;
  media_url?: string;
  message_type?: MessageType;
}

export interface WebSocketEvent<T = unknown> {
  event:
    | "NEW_MESSAGE"
    | "CONVERSATION_UPDATED"
    | "BUSINESS_HOURS_TRIGGERED"
    | "PONG";
  data: T;
}
