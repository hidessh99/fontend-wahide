import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { generateSecureRandomString } from "@/lib/utils";
import { SubscriptionPlan, TenantSubscription, WebhookConfig } from "../types/subscription.types";

const SUBSCRIPTION_BASE = env.NEXT_PUBLIC_WHATSAPP_API_URL;

export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: "01JPLAN0000000000000000001",
    name: "Starter",
    priceMonthly: 0,
    quotaMonthly: 1500,
    maxDeviceSlots: 1,
    maxAgents: 0,
    hasWatermark: true,
    allowAttachment: false,
    allowCampaign: true,
    allowAutoreply: true,
    allowSchedule: false,
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
    id: "01JPLAN0000000000000000002",
    name: "Professional",
    priceMonthly: 10000,
    quotaMonthly: 25000,
    maxDeviceSlots: 5,
    maxAgents: 2,
    hasWatermark: false,
    allowAttachment: true,
    allowCampaign: true,
    allowAutoreply: true,
    allowSchedule: true,
    isPopular: true,
    features: [
      "25.000 Pesan Broadcast / bulan",
      "5 Slot WhatsApp Multi-Device",
      "2 Akun Operator CS / Multi-Agent",
      "Kirim Media Gambar, Dokumen & Audio",
      "Auto-Reply & AI Chatbot Response",
      "Penjadwalan Pesan Otomatis",
      "Bebas Watermark (100% White-Label)",
      "Webhook & Real-time Delivery Event",
      "Prioritas Dukungan Teknis",
    ],
  },
  {
    id: "01JPLAN0000000000000000003",
    name: "Enterprise Cluster",
    priceMonthly: 50000,
    quotaMonthly: 100000,
    maxDeviceSlots: 15,
    maxAgents: 10,
    hasWatermark: false,
    allowAttachment: true,
    allowCampaign: true,
    allowAutoreply: true,
    allowSchedule: true,
    features: [
      "100.000+ Pesan Broadcast / bulan",
      "15 Slot WhatsApp Multi-Device",
      "10 Akun Operator CS / Multi-Agent",
      "Dedicated Session Hibernation Manager",
      "Kirim Media Gambar, Dokumen & Audio",
      "Auto-Reply & AI Chatbot Response",
      "Penjadwalan Pesan Otomatis",
      "Custom Webhook & Signing HMAC",
      "Bebas Watermark (100% White-Label)",
      "SLA 99.9% & Dedicated Account Manager",
    ],
  },
];

function normalizeSubscription(
  raw: Record<string, unknown> | null | undefined
): TenantSubscription {
  if (!raw) {
    return {
      planId: "01JPLAN0000000000000000001",
      planName: "Starter",
      planPrice: 0,
      quotaUsed: 0,
      quotaTotal: 1500,
      deviceSlotsUsed: 0,
      deviceSlotsMax: 1,
      hasWatermark: true,
      expiresAt: "",
      status: "ACTIVE",
      isActive: true,
    };
  }

  const rawPlan = (raw.plan && typeof raw.plan === "object" ? raw.plan : {}) as Record<
    string,
    unknown
  >;

  const planId = String(
    raw.plan_id || raw.planId || rawPlan.id || raw.id || "01JPLAN0000000000000000001"
  );
  const planName = String(rawPlan.name || raw.plan_name || raw.planName || raw.name || "Starter");
  const planPrice = Number(rawPlan.price ?? raw.plan_price ?? 0);

  const quotaUsed = Number(
    raw.current_month_usage ??
      raw.currentMonthUsage ??
      raw.quota_used ??
      raw.quotaUsed ??
      raw.used_quota ??
      0
  );

  const quotaTotal = Number(
    rawPlan.monthly_message_limit ??
      rawPlan.monthlyMessageLimit ??
      raw.monthly_message_limit ??
      raw.quota_total ??
      raw.quotaTotal ??
      1500
  );

  const deviceSlotsUsed = Number(
    raw.device_slots_used ?? raw.deviceSlotsUsed ?? raw.active_devices ?? 0
  );

  const deviceSlotsMax = Number(
    rawPlan.max_devices ??
      rawPlan.maxDevices ??
      raw.max_devices ??
      raw.device_slots_max ??
      raw.deviceSlotsMax ??
      1
  );

  const hasWatermark = Boolean(
    rawPlan.has_watermark ?? rawPlan.hasWatermark ?? raw.has_watermark ?? raw.hasWatermark ?? false
  );

  const expiresAt = String(
    raw.expired_at || raw.expiredAt || raw.expires_at || raw.expiresAt || ""
  );

  const status = String(raw.status || "ACTIVE").toUpperCase();
  const isActive = status === "ACTIVE";

  return {
    planId,
    planName,
    planPrice,
    quotaUsed,
    quotaTotal,
    deviceSlotsUsed,
    deviceSlotsMax,
    hasWatermark,
    expiresAt,
    status,
    isActive,
  };
}

function normalizePlan(raw: Record<string, unknown>): SubscriptionPlan {
  const id = String(raw.id || raw.plan_id || raw.planId || "plan_custom");
  const name = String(raw.name || raw.plan_name || raw.planName || "Paket Langganan");
  const priceMonthly = Number(raw.price ?? raw.price_monthly ?? raw.priceMonthly ?? 0);
  const quotaMonthly = Number(
    raw.monthly_message_limit ??
      raw.monthlyMessageLimit ??
      raw.quota_monthly ??
      raw.quotaMonthly ??
      1500
  );
  const maxDeviceSlots = Number(
    raw.max_devices ?? raw.maxDevices ?? raw.max_device_slots ?? raw.maxDeviceSlots ?? 1
  );
  const maxAgents = Number(raw.max_agents ?? raw.maxAgents ?? 0);
  const hasWatermark = Boolean(raw.has_watermark ?? raw.hasWatermark ?? false);
  const allowAttachment = Boolean(raw.allow_attachment ?? raw.allowAttachment ?? false);
  const allowCampaign = Boolean(raw.allow_campaign ?? raw.allowCampaign ?? true);
  const allowAutoreply = Boolean(raw.allow_autoreply ?? raw.allowAutoreply ?? false);
  const allowSchedule = Boolean(raw.allow_schedule ?? raw.allowSchedule ?? false);

  // Dynamic feature generation based directly on database columns
  let features: string[] = [];
  if (Array.isArray(raw.features) && raw.features.length > 0) {
    features = raw.features.map(String);
  } else {
    features.push(`${quotaMonthly.toLocaleString("id-ID")} Pesan Broadcast / bulan`);
    features.push(`${maxDeviceSlots} Slot WhatsApp Multi-Device`);
    if (maxAgents > 0) {
      features.push(`${maxAgents} Akun Operator CS / Multi-Agent`);
    }
    if (allowCampaign) {
      features.push("Spintax Engine & Jitter Anti-Ban 3-7s");
    }
    if (allowAttachment) {
      features.push("Kirim Media Gambar, Dokumen & Audio");
    }
    if (allowAutoreply) {
      features.push("Auto-Reply & AI Chatbot Response");
    }
    if (allowSchedule) {
      features.push("Penjadwalan Pesan Otomatis");
    }
    if (!hasWatermark) {
      features.push("Bebas Watermark (100% White-Label)");
    } else {
      features.push("Watermark 'Powered by Wahide'");
    }
    if (priceMonthly >= 10000) {
      features.push("Webhook & Real-time Delivery Event");
      features.push("Prioritas Dukungan Teknis");
    }
  }

  const isPopular = Boolean(raw.is_popular ?? raw.isPopular ?? false);

  return {
    id,
    name,
    priceMonthly,
    quotaMonthly,
    maxDeviceSlots,
    maxAgents,
    hasWatermark,
    allowAttachment,
    allowCampaign,
    allowAutoreply,
    allowSchedule,
    features,
    isPopular,
  };
}

export const subscriptionApi = {
  getSubscription: async (): Promise<TenantSubscription> => {
    try {
      const res = await httpClient.get<Record<string, unknown>>(
        `${SUBSCRIPTION_BASE}/subscription`
      );
      return normalizeSubscription(res.payload);
    } catch {
      return normalizeSubscription(null);
    }
  },

  getPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      const res = await httpClient.get<Record<string, unknown>[]>(
        `${SUBSCRIPTION_BASE}/subscription/plans`
      );
      if (Array.isArray(res.payload) && res.payload.length > 0) {
        return res.payload.map(normalizePlan);
      }
      return DEFAULT_PLANS;
    } catch {
      return DEFAULT_PLANS;
    }
  },

  upgradePlan: async (planId: string): Promise<{ success: boolean; invoiceUrl?: string }> => {
    const res = await httpClient.post<{ invoiceUrl?: string }>(
      `${SUBSCRIPTION_BASE}/subscription/upgrade`,
      { planId }
    );
    return { success: res.success, invoiceUrl: res.payload?.invoiceUrl };
  },

  getWebhookConfig: async (): Promise<WebhookConfig> => {
    try {
      const res = await httpClient.get<Record<string, unknown>>(
        `${SUBSCRIPTION_BASE}/subscription/webhook`
      );
      const payload = res.payload;
      return {
        url: String(
          payload?.url || payload?.webhook_url || "https://api.business.com/v1/whatsapp/webhook"
        ),
        secret: String(
          payload?.secret ||
            payload?.webhook_secret ||
            "whsec_live_9a7e60bd2c5a4fce87332185000bb181"
        ),
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

  updateWebhookConfig: async (payload: {
    url: string;
    isEnabled: boolean;
  }): Promise<WebhookConfig> => {
    const res = await httpClient.post<Record<string, unknown>>(
      `${SUBSCRIPTION_BASE}/subscription/webhook`,
      payload
    );
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
