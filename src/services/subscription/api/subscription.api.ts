import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { SubscriptionPlan, TenantSubscription, WebhookConfig } from "../types/subscription.types";

const SUBSCRIPTION_BASE = env.NEXT_PUBLIC_WHATSAPP_API_URL;

export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: "plan_starter",
    tier: "STARTER",
    name: "Starter",
    priceMonthly: 149000,
    quotaMonthly: 5000,
    maxDeviceSlots: 2,
    hasWatermark: true,
    features: [
      "5.000 Pesan Broadcast / bulan",
      "2 Slot WhatsApp Multi-Device",
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
    priceMonthly: 399000,
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
    priceMonthly: 999000,
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

export const subscriptionApi = {
  getSubscription: async (): Promise<TenantSubscription> => {
    try {
      const res = await httpClient.get<TenantSubscription>(`${SUBSCRIPTION_BASE}/subscription`);
      return res.payload || {
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
    } catch {
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
  },

  getPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      const res = await httpClient.get<SubscriptionPlan[]>(`${SUBSCRIPTION_BASE}/subscription/plans`);
      return res.payload || DEFAULT_PLANS;
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
      const res = await httpClient.get<WebhookConfig>(`${SUBSCRIPTION_BASE}/subscription/webhook`);
      return res.payload || {
        url: "https://api.business.com/v1/whatsapp/webhook",
        secret: "whsec_live_9a7e60bd2c5a4fce87332185000bb181",
        isEnabled: true,
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
    const res = await httpClient.post<WebhookConfig>(`${SUBSCRIPTION_BASE}/subscription/webhook`, payload);
    return res.payload || {
      url: payload.url,
      secret: "whsec_live_9a7e60bd2c5a4fce87332185000bb181",
      isEnabled: payload.isEnabled,
    };
  },

  regenerateWebhookSecret: async (): Promise<{ secret: string }> => {
    const res = await httpClient.post<{ secret: string }>(`${SUBSCRIPTION_BASE}/subscription/webhook/regenerate-secret`);
    return { secret: res.payload?.secret || "whsec_live_" + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) };
  },
};
