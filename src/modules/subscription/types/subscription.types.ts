export type PlanTier = string;

export type SubscriptionChannel =
  | "WHATSMEOW_UNOFFICIAL"
  | "META_WABA_OFFICIAL"
  | "TELEGRAM_BOT";

export interface OrderCartItem {
  id: string;
  planId: string;
  planName: string;
  channelType: SubscriptionChannel;
  priceMonthly: number;
}

export interface OrderSummary {
  items: OrderCartItem[];
  billingPeriod: "MONTHLY"; // Fixed 1 bulan (30 hari)
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  channelType?: SubscriptionChannel;
  tier?: string;
  priceMonthly: number;
  quotaMonthly: number;
  maxDeviceSlots: number;
  maxAgents: number;
  hasWatermark: boolean;
  watermarkText?: string;
  allowAttachment: boolean;
  allowCampaign: boolean;
  allowAutoreply: boolean;
  allowSchedule: boolean;
  features: string[];
  isPopular?: boolean;
}

export interface TenantSubscription {
  planId: string;
  planName: string;
  planPrice: number;
  tier?: string;
  quotaUsed: number;
  quotaTotal: number;
  deviceSlotsUsed: number;
  deviceSlotsMax: number;
  hasWatermark: boolean;
  expiresAt: string;
  isLifetime?: boolean;
  status: string;
  isActive: boolean;
}

export interface WebhookConfig {
  url: string;
  secret: string;
  isEnabled: boolean;
  events?: string[];
}

export interface WebhookLogItem {
  id: string;
  tenant_id: string;
  device_id?: string;
  event_name: string;
  target_url: string;
  request_headers?: string;
  request_payload?: string;
  response_status: number;
  response_body?: string;
  latency_ms: number;
  attempt: number;
  error_message?: string;
  created_at: string;
}

export interface WebhookLogFilters {
  page?: number;
  page_size?: number;
  search?: string;
  event_name?: string;
  response_status?: number;
}
