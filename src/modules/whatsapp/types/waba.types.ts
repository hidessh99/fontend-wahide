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
