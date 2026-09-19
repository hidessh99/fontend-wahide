// ==============================================================================
// Wahide Frontend - Telegram Omnichannel Module Types
// Synchronized strictly with Go Backend: internal/modules/telegram/domain/dto
// ==============================================================================

export type TelegramBotStatus = "ACTIVE" | "PAUSED" | "REVOKED";

export interface TelegramBot {
  id: string;
  channel_id?: string;
  bot_id: number;
  name: string;
  username: string;
  first_name: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  supports_inline_queries: boolean;
  status: TelegramBotStatus;
  webhook_url?: string;
  webhook_active: boolean;
  daily_sent_count: number;
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ConnectTelegramBotInput {
  name: string;
  bot_token: string;
}

export interface UpdateTelegramBotInput {
  name?: string;
  status?: TelegramBotStatus;
}

export type TelegramMessageDirection = "INBOUND" | "OUTBOUND";
export type TelegramMessageType = "TEXT" | "PHOTO" | "DOCUMENT" | "VIDEO" | "VOICE";
export type TelegramMessageStatus = "QUEUED" | "SENT" | "DELIVERED" | "FAILED";

export interface TelegramMessage {
  id: string;
  bot_id: string;
  chat_id: number;
  message_id?: number;
  direction: TelegramMessageDirection;
  message_type: TelegramMessageType;
  text?: string;
  media_url?: string;
  status: TelegramMessageStatus;
  error_reason?: string;
  idempotency_key?: string;
  sent_at?: string;
  created_at: string;
}

export interface TelegramMessageLogQuery {
  page?: number;
  page_size?: number;
  search?: string;
  bot_id?: string;
  direction?: "ALL" | TelegramMessageDirection;
  status?: "ALL" | TelegramMessageStatus;
  start_date?: string;
  end_date?: string;
}

export interface TelegramStats {
  total_bots: number;
  active_bots: number;
  daily_sent_count: number;
  daily_limit: number;
  webhook_success_rate: number;
  avg_latency_ms: number;
}

export interface SendTelegramMessageInput {
  bot_id: string;
  chat_id: number;
  text?: string;
  parse_mode?: "HTML" | "MarkdownV2" | "Markdown";
  media_url?: string;
  media_type?: "PHOTO" | "DOCUMENT" | "VIDEO" | "VOICE";
  caption?: string;
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  idempotency_key?: string;
}

export interface SendTelegramMessageResponse {
  id: string;
  bot_id: string;
  chat_id: number;
  message_id?: number;
  direction: string;
  message_type: string;
  text?: string;
  status: string;
  sent_at?: string;
  created_at: string;
}

