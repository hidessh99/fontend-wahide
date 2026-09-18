// ==============================================================================
// Wahide Frontend - Autoreply Rules Types
// Clean TypeScript domain contracts matching Go Backend DTOs
// ==============================================================================

export type ChannelType = "whatsapp" | "telegram" | "waba";

export type MatchLogic = "EXACT" | "CONTAINS" | "STARTS_WITH" | "REGEX";

export type ReplyType = "TEXT" | "MEDIA" | "FLOW_TRIGGER";

export interface AutoreplyRule {
  id: string;
  tenant_id: string;
  device_id: string;
  channel_type: ChannelType;
  name: string;
  match_logic: MatchLogic;
  reply_type: ReplyType;
  reply_text?: string;
  media_url?: string;
  flow_id?: string;
  keywords: string[];
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRuleInput {
  device_id: string;
  channel_type: ChannelType;
  name: string;
  match_logic: MatchLogic;
  reply_type: ReplyType;
  reply_text?: string;
  media_url?: string;
  flow_id?: string;
  keywords: string[];
  priority?: number;
  is_active?: boolean;
}

export interface UpdateRuleInput {
  name?: string;
  match_logic?: MatchLogic;
  reply_type?: ReplyType;
  reply_text?: string;
  media_url?: string;
  flow_id?: string;
  keywords?: string[];
  priority?: number;
  is_active?: boolean;
}

export interface ListRulesQuery {
  device_id?: string;
  channel_type?: string;
  page?: number;
  limit?: number;
}
