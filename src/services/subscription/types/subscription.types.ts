export type PlanTier = "STARTER" | "PRO" | "ENTERPRISE";

export interface SubscriptionPlan {
  id: string;
  tier: PlanTier;
  name: string;
  priceMonthly: number;
  quotaMonthly: number;
  maxDeviceSlots: number;
  hasWatermark: boolean;
  features: string[];
  isPopular?: boolean;
}

export interface TenantSubscription {
  planId: string;
  planName: string;
  tier: PlanTier;
  quotaUsed: number;
  quotaTotal: number;
  deviceSlotsUsed: number;
  deviceSlotsMax: number;
  hasWatermark: boolean;
  expiresAt: string;
}

export interface WebhookConfig {
  url: string;
  secret: string;
  isEnabled: boolean;
}
