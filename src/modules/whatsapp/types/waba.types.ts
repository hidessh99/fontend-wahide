export type WABAQualityRating = "GREEN" | "YELLOW" | "RED" | "UNKNOWN";
export type WABAMessagingTier =
  | "TIER_250"
  | "TIER_1K"
  | "TIER_10K"
  | "TIER_100K"
  | "UNLIMITED";

export interface WABAAccount {
  id: string;
  channel_id: string;
  name: string;
  channel_type: string;
  is_active: boolean;
  waba_account_id: string;
  phone_number_id: string;
  phone_number?: string | null;
  verified_name?: string | null;
  app_id?: string | null;
  meta_quality_rating: WABAQualityRating;
  meta_messaging_tier: WABAMessagingTier;
  webhook_url?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ConnectWABAInput {
  name: string;
  waba_account_id: string;
  phone_number_id: string;
  system_access_token: string;
  app_id?: string;
}

export interface ConnectWABAResponse {
  channel_id: string;
  name: string;
  phone_number_id: string;
  verified_name?: string;
  meta_quality_rating: WABAQualityRating;
  meta_messaging_tier: WABAMessagingTier;
  webhook_callback_url: string;
  webhook_verify_token: string;
}

export interface MetaEmbeddedConfig {
  app_id: string;
  config_id: string;
  api_version: string;
}

export interface MetaOAuthExchangeInput {
  code: string;
  redirect_uri?: string;
  waba_account_id?: string;
  phone_number_id?: string;
  name?: string;
}

export interface SendWABAMessageInput {
  phone_number_id?: string;
  device_id?: string;
  phone: string;
  message?: string;
  media_url?: string;
  file_name?: string;
  template_name?: string;
  template_params?: Record<string, string>;
}

export interface SendWABAMessageResponse {
  message_id: string;
  status: string;
  sent_at: string;
}

