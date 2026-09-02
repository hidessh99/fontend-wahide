export type PlanTier = string;

export interface SubscriptionPlan {
  id: string;
  name: string;
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
  status: string;
  isActive: boolean;
}

export interface WebhookConfig {
  url: string;
  secret: string;
  isEnabled: boolean;
}
