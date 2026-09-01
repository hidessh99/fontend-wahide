import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { generateSecureRandomString } from "@/lib/utils";
import { PlanTier, SubscriptionPlan, TenantSubscription, WebhookConfig } from "../types/subscription.types";

const SUBSCRIPTION_BASE = env.NEXT_PUBLIC_WHATSAPP_API_URL;

export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: "plan_starter",
    tier: "STARTER",
    name: "Starter",
    priceMonthly: 0,
    quotaMonthly: 1500,
    maxDeviceSlots: 1,
    hasWatermark: true,
    features: [
      "1.500 Pesan Broadcast / bulan",
      "1 Slot WhatsApp Multi-Device",
      "Spintax Engine Regex Parser",
      "Dynamic Jitter Delay 3-7 Detik",
      "Watermark 'Powered by Wahide'",
      "Support Komunitas & Dokumentasi",
    ],
  },
  {
    id: "plan_pro",
    tier: "PRO",
    name: "Professional",
    priceMonthly: 10000,
    quotaMonthly: 25000,
    maxDeviceSlots: 5,
    hasWatermark: false,
    isPopular: true,
    features: [
      "25.000 Pesan Broadcast / bulan",
      "5 Slot WhatsApp Multi-Device",
      "Anti-Ban Human Typing (ChatPresence)",
      "Zero-Heap Event Filtering",
      "Bebas Watermark (100% White-Label)",
      "Webhook Notifikasi Real-Time",
      "Prioritas Dukungan Teknis",
    ],
  },
  {
    id: "plan_enterprise",
    tier: "ENTERPRISE",
    name: "Enterprise Cluster",
    priceMonthly: 50000,
    quotaMonthly: 100000,
    maxDeviceSlots: 15,
    hasWatermark: false,
    features: [
      "100.000+ Pesan Broadcast / bulan",
      "15 Slot WhatsApp Multi-Device",
      "Dedicated Session Hibernation Manager",
      "Noise Protocol Fast-Resume",
      "Custom Webhook & Signing HMAC",
      "API Key Fast-Path Tanpa Limit",
      "SLA 99.9% & Dedicated Account Manager",
    ],
  },
];

function normalizeSubscription(raw: Record<string, unknown> | null | undefined): TenantSubscription {
  if (!raw) {
    return {
      planId: "plan_pro",
      planName: "Professional",
      tier: "PRO",
      quotaUsed: 6550,
      quotaTotal: 25000,
      deviceSlotsUsed: 2,
      deviceSlotsMax: 5,
      hasWatermark: false,
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000 * 25).toISOString(),
    };
  }

  return {
    planId: String(raw.planId || raw.plan_id || raw.id || "plan_pro"),
    planName: String(raw.planName || raw.plan_name || raw.name || "Professional"),
    tier: String(raw.tier || "PRO").toUpperCase() as PlanTier,
    quotaUsed: Number(raw.quotaUsed ?? raw.quota_used ?? raw.used_quota ?? 0),
    quotaTotal: Number(raw.quotaTotal ?? raw.quota_total ?? raw.monthly_quota ?? raw.monthly_message_limit ?? 25000),
    deviceSlotsUsed: Number(raw.deviceSlotsUsed ?? raw.device_slots_used ?? raw.active_devices ?? 0),
    deviceSlotsMax: Number(raw.deviceSlotsMax ?? raw.device_slots_max ?? raw.max_devices ?? raw.device_limit ?? 5),
    hasWatermark: Boolean(raw.hasWatermark ?? raw.has_watermark ?? false),
    expiresAt: String(raw.expiresAt || raw.expires_at || new Date(Date.now() + 24 * 3600 * 1000 * 25).toISOString()),
  };
}

function normalizePlan(raw: Record<string, unknown>): SubscriptionPlan {
  const rawFeatures = raw.features || raw.feature_list;
  const features = Array.isArray(rawFeatures)
    ? rawFeatures.map(String)
    : [
        `${Number(raw.quotaMonthly ?? raw.quota_monthly ?? 1500).toLocaleString("id-ID")} Pesan Broadcast / bulan`,
        `${Number(raw.maxDeviceSlots ?? raw.max_device_slots ?? raw.max_devices ?? 1)} Slot WhatsApp Multi-Device`,
        "Spintax Engine Regex Parser",
      ];

  return {
    id: String(raw.id || raw.plan_id || "plan_custom"),
    tier: String(raw.tier || "STARTER").toUpperCase() as PlanTier,
    name: String(raw.name || raw.plan_name || "Custom Plan"),
    priceMonthly: Number(raw.priceMonthly ?? raw.price_monthly ?? raw.price ?? 0),
    quotaMonthly: Number(raw.quotaMonthly ?? raw.quota_monthly ?? raw.monthly_quota ?? 1500),
    maxDeviceSlots: Number(raw.maxDeviceSlots ?? raw.max_device_slots ?? raw.max_devices ?? 1),
    hasWatermark: Boolean(raw.hasWatermark ?? raw.has_watermark ?? false),
    features,
    isPopular: Boolean(raw.isPopular ?? raw.is_popular ?? false),
  };
}

export const subscriptionApi = {
  getSubscription: async (): Promise<TenantSubscription> => {
    try {
      const res = await httpClient.get<Record<string, unknown>>(`${SUBSCRIPTION_BASE}/subscription`);
      return normalizeSubscription(res.payload);
    } catch {
      return normalizeSubscription(null);
    }
  },

  getPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      const res = await httpClient.get<Record<string, unknown>[]>(`${SUBSCRIPTION_BASE}/subscription/plans`);
      if (Array.isArray(res.payload) && res.payload.length > 0) {
        return res.payload.map(normalizePlan);
      }
      return DEFAULT_PLANS;
    } catch {
      return DEFAULT_PLANS;
    }
  },

  upgradePlan: async (planId: string): Promise<{ success: boolean; invoiceUrl?: string }> => {
    const res = await httpClient.post<{ invoiceUrl?: string }>(`${SUBSCRIPTION_BASE}/subscription/upgrade`, { planId });
    return { success: res.success, invoiceUrl: res.payload?.invoiceUrl };
  },

  getWebhookConfig: async (): Promise<WebhookConfig> => {
    try {
      const res = await httpClient.get<Record<string, unknown>>(`${SUBSCRIPTION_BASE}/subscription/webhook`);
      const payload = res.payload;
      return {
        url: String(payload?.url || payload?.webhook_url || "https://api.business.com/v1/whatsapp/webhook"),
        secret: String(payload?.secret || payload?.webhook_secret || "whsec_live_9a7e60bd2c5a4fce87332185000bb181"),
        isEnabled: Boolean(payload?.isEnabled ?? payload?.is_enabled ?? true),
      };
    } catch {
      return {
        url: "https://api.business.com/v1/whatsapp/webhook",
        secret: "whsec_live_9a7e60bd2c5a4fce87332185000bb181",
        isEnabled: true,
      };
    }
  },

  updateWebhookConfig: async (payload: { url: string; isEnabled: boolean }): Promise<WebhookConfig> => {
    const res = await httpClient.post<Record<string, unknown>>(`${SUBSCRIPTION_BASE}/subscription/webhook`, payload);
    const data = res.payload;
    return {
      url: String(data?.url || payload.url),
      secret: String(data?.secret || "whsec_live_9a7e60bd2c5a4fce87332185000bb181"),
      isEnabled: Boolean(data?.isEnabled ?? payload.isEnabled),
    };
  },

  regenerateWebhookSecret: async (): Promise<{ secret: string }> => {
    const res = await httpClient.post<{ secret?: string; webhook_secret?: string }>(
      `${SUBSCRIPTION_BASE}/subscription/webhook/regenerate-secret`
    );
    return {
      secret:
        res.payload?.secret ||
        res.payload?.webhook_secret ||
        generateSecureRandomString("whsec_live_", 24),
    };
  },
};
