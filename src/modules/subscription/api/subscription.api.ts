import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { generateSecureRandomString } from "@/lib/utils";
import {
  SubscriptionChannel,
  SubscriptionPlan,
  TenantSubscription,
  WebhookConfig,
  WebhookLogItem,
  WebhookLogFilters,
} from "../types/subscription.types";

const SUBSCRIPTION_BASE = env.NEXT_PUBLIC_WHATSAPP_API_URL;

export const CHANNEL_PLANS: Record<
  SubscriptionChannel,
  SubscriptionPlan[]
> = {
  WHATSMEOW_UNOFFICIAL: [
    {
      id: "01JPLAN0000000000000000001",
      name: "WhatsApp Starter",
      channelType: "WHATSMEOW_UNOFFICIAL",
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
        "1 Slot WhatsApp Multi-Device (QR)",
        "Proteksi Variasi Kata (Spintax)",
        "Jeda Waktu Kirim Santai & Alami",
        "Watermark 'Powered by Wahide'",
      ],
    },
    {
      id: "01JPLAN_WA_STANDARD",
      name: "WhatsApp Standard",
      channelType: "WHATSMEOW_UNOFFICIAL",
      priceMonthly: 49000,
      quotaMonthly: 15000,
      maxDeviceSlots: 2,
      maxAgents: 1,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: true,
      isPopular: true,
      features: [
        "15.000 Pesan Broadcast / bulan",
        "2 Slot WhatsApp Multi-Device",
        "1 Operator CS / Agent",
        "Kirim Media Gambar, Dokumen & Audio",
        "Bebas Watermark (100% White-Label)",
        "Penjadwalan & Auto-Reply Spintax",
      ],
    },
    {
      id: "01JPLAN0000000000000000002",
      name: "WhatsApp Pro Business",
      channelType: "WHATSMEOW_UNOFFICIAL",
      priceMonthly: 99000,
      quotaMonthly: 50000,
      maxDeviceSlots: 5,
      maxAgents: 3,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: true,
      features: [
        "50.000 Pesan Broadcast / bulan",
        "5 Slot WhatsApp Multi-Device",
        "3 Operator CS / Multi-Agent",
        "Real-time Webhook & Delivery Callback",
        "Prioritas Jalur Antrean Anti-Ban",
        "Dukungan Teknis Prioritas",
      ],
    },
  ],
  META_WABA_OFFICIAL: [
    {
      id: "01JPLAN_WABA_STARTER",
      name: "Meta WABA Starter",
      channelType: "META_WABA_OFFICIAL",
      priceMonthly: 99000,
      quotaMonthly: 5000,
      maxDeviceSlots: 1,
      maxAgents: 2,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: true,
      features: [
        "1 Nomor WhatsApp Resmi Meta (WABA)",
        "5.000 Kuota Percakapan / bulan",
        "Kirim Template HSM Resmi Centang Hijau",
        "Sinkronisasi Meta Graph API Otomatis",
        "Anti-Banned 100% Resmi",
      ],
    },
    {
      id: "01JPLAN_WABA_ENTERPRISE",
      name: "Meta WABA Enterprise",
      channelType: "META_WABA_OFFICIAL",
      priceMonthly: 249000,
      quotaMonthly: 25000,
      maxDeviceSlots: 3,
      maxAgents: 8,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: true,
      isPopular: true,
      features: [
        "3 Nomor WhatsApp Resmi Meta",
        "25.000 Kuota Percakapan / bulan",
        "Kirim Pesan Marketing & Utility HSM",
        "Integrasi Webhook Multi-Nomor",
        "Dedicated Tier & Meta Escalation SLA",
      ],
    },
  ],
  TELEGRAM_BOT: [
    {
      id: "01JPLAN_TELE_STARTER",
      name: "Telegram Bot Starter",
      channelType: "TELEGRAM_BOT",
      priceMonthly: 0,
      quotaMonthly: 2000,
      maxDeviceSlots: 1,
      maxAgents: 0,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: false,
      features: [
        "1 Bot Token Telegram (BotFather)",
        "2.000 Pesan Bot / bulan",
        "Format Pesan HTML & MarkdownV2",
        "Auto-Reply & Command Trigger Dasar",
      ],
    },
    {
      id: "01JPLAN_TELE_PRO",
      name: "Telegram Bot Pro",
      channelType: "TELEGRAM_BOT",
      priceMonthly: 35000,
      quotaMonthly: 25000,
      maxDeviceSlots: 3,
      maxAgents: 2,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: true,
      isPopular: true,
      features: [
        "3 Bot Token Telegram Aktif",
        "25.000 Pesan Bot / bulan",
        "Inline Keyboard Matrix (Callback / URL)",
        "Broadcast Grup & Saluran Telegram",
        "Webhook Event Streaming Real-time",
        "Bebas Preview Link Toggle",
      ],
    },
    {
      id: "01JPLAN_TELE_UNLIMITED",
      name: "Telegram High-Frequency",
      channelType: "TELEGRAM_BOT",
      priceMonthly: 79000,
      quotaMonthly: 100000,
      maxDeviceSlots: 10,
      maxAgents: 5,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: true,
      features: [
        "10 Bot Token Telegram Aktif",
        "100.000 Pesan Bot / bulan",
        "Kecepatan Tinggi (Up to 30 msg/sec)",
        "Inline Keyboard Matrix Lengkap",
        "Auto-Scalable Webhook Delivery",
      ],
    },
  ],
};

export const DEFAULT_PLANS: SubscriptionPlan[] = [
  ...CHANNEL_PLANS.WHATSMEOW_UNOFFICIAL,
];

function normalizeSubscription(
  raw: Record<string, unknown> | null | undefined,
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

  const rawPlan = (
    raw.plan && typeof raw.plan === "object" ? raw.plan : {}
  ) as Record<string, unknown>;

  const planId = String(
    raw.plan_id ||
      raw.planId ||
      rawPlan.id ||
      raw.id ||
      "01JPLAN0000000000000000001",
  );
  const planName = String(
    rawPlan.name || raw.plan_name || raw.planName || raw.name || "Starter",
  );
  const planPrice = Number(rawPlan.price ?? raw.plan_price ?? 0);

  const quotaUsed = Number(
    raw.current_month_usage ??
      raw.currentMonthUsage ??
      raw.quota_used ??
      raw.quotaUsed ??
      raw.used_quota ??
      0,
  );

  const quotaTotal = Number(
    rawPlan.monthly_message_limit ??
      rawPlan.monthlyMessageLimit ??
      raw.monthly_message_limit ??
      raw.quota_total ??
      raw.quotaTotal ??
      1500,
  );

  const deviceSlotsUsed = Number(
    raw.device_slots_used ?? raw.deviceSlotsUsed ?? raw.active_devices ?? 0,
  );

  const deviceSlotsMax = Number(
    rawPlan.max_devices ??
      rawPlan.maxDevices ??
      raw.max_devices ??
      raw.device_slots_max ??
      raw.deviceSlotsMax ??
      1,
  );

  const hasWatermark = Boolean(
    rawPlan.has_watermark ??
    rawPlan.hasWatermark ??
    raw.has_watermark ??
    raw.hasWatermark ??
    false,
  );

  const expiresAt = String(
    raw.expired_at || raw.expiredAt || raw.expires_at || raw.expiresAt || "",
  );

  const status = String(raw.status || "ACTIVE").toUpperCase();
  const isActive = status === "ACTIVE";

  const isLifetime = Boolean(
    raw.is_lifetime ||
    raw.isLifetime ||
    planPrice === 0 ||
    planName.toUpperCase() === "FREE" ||
    planName.toUpperCase() === "STARTER",
  );

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
    isLifetime,
    status,
    isActive,
  };
}

function normalizePlan(raw: Record<string, unknown>): SubscriptionPlan {
  const id = String(raw.id || raw.plan_id || raw.planId || "plan_custom");
  const name = String(
    raw.name || raw.plan_name || raw.planName || "Paket Langganan",
  );
  const priceMonthly = Number(
    raw.price ?? raw.price_monthly ?? raw.priceMonthly ?? 0,
  );
  const quotaMonthly = Number(
    raw.monthly_message_limit ??
      raw.monthlyMessageLimit ??
      raw.quota_monthly ??
      raw.quotaMonthly ??
      1500,
  );
  const maxDeviceSlots = Number(
    raw.max_devices ??
      raw.maxDevices ??
      raw.max_device_slots ??
      raw.maxDeviceSlots ??
      1,
  );
  const maxAgents = Number(raw.max_agents ?? raw.maxAgents ?? 0);
  const hasWatermark = Boolean(raw.has_watermark ?? raw.hasWatermark ?? false);
  const allowAttachment = Boolean(
    raw.allow_attachment ?? raw.allowAttachment ?? false,
  );
  const allowCampaign = Boolean(
    raw.allow_campaign ?? raw.allowCampaign ?? true,
  );
  const allowAutoreply = Boolean(
    raw.allow_autoreply ?? raw.allowAutoreply ?? false,
  );
  const allowSchedule = Boolean(
    raw.allow_schedule ?? raw.allowSchedule ?? false,
  );

  // Dynamic feature generation based directly on database columns
  let features: string[] = [];
  if (Array.isArray(raw.features) && raw.features.length > 0) {
    features = raw.features.map(String);
  } else {
    features.push(
      `${quotaMonthly.toLocaleString("id-ID")} Pesan Broadcast / bulan`,
    );
    features.push(`${maxDeviceSlots} Slot WhatsApp Multi-Device`);
    if (maxAgents > 0) {
      features.push(`${maxAgents} Akun Operator CS / Multi-Agent`);
    }
    if (allowCampaign) {
      features.push("Variasi Kata Otomatis & Jeda Kirim Santai");
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
  getSubscription: async (
    signal?: AbortSignal,
  ): Promise<TenantSubscription> => {
    try {
      const res = await httpClient.get<Record<string, unknown>>(
        `${SUBSCRIPTION_BASE}/subscription`,
        { signal },
      );
      return normalizeSubscription(res.payload);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return normalizeSubscription(null);
    }
  },

  getPlans: async (signal?: AbortSignal): Promise<SubscriptionPlan[]> => {
    try {
      const res = await httpClient.get<Record<string, unknown>[]>(
        `${SUBSCRIPTION_BASE}/subscription/plans`,
        { signal },
      );
      if (Array.isArray(res.payload) && res.payload.length > 0) {
        return res.payload.map(normalizePlan);
      }
      return DEFAULT_PLANS;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return DEFAULT_PLANS;
    }
  },

  upgradePlan: async (
    planId: string,
  ): Promise<{ success: boolean; invoiceUrl?: string }> => {
    const res = await httpClient.post<{ invoiceUrl?: string }>(
      `${SUBSCRIPTION_BASE}/subscription/upgrade`,
      { planId },
    );
    return { success: res.success, invoiceUrl: res.payload?.invoiceUrl };
  },

  getWebhookConfig: async (signal?: AbortSignal): Promise<WebhookConfig> => {
    try {
      const res = await httpClient.get<Record<string, unknown>>(
        `${SUBSCRIPTION_BASE}/subscription/webhook`,
        { signal },
      );
      const payload = res.payload;
      return {
        url: String(payload?.url || payload?.webhook_url || ""),
        secret: String(payload?.secret || payload?.webhook_secret || ""),
        isEnabled: Boolean(payload?.isEnabled ?? payload?.is_enabled ?? true),
        events: Array.isArray(payload?.events)
          ? (payload.events as string[])
          : ["message.received", "device.status"],
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return {
        url: "",
        secret: "",
        isEnabled: true,
        events: ["message.received", "device.status"],
      };
    }
  },

  updateWebhookConfig: async (payload: {
    url: string;
    secret?: string;
    isEnabled: boolean;
    events?: string[];
  }): Promise<WebhookConfig> => {
    const res = await httpClient.post<Record<string, unknown>>(
      `${SUBSCRIPTION_BASE}/subscription/webhook`,
      {
        webhook_url: payload.url,
        url: payload.url,
        webhook_secret: payload.secret,
        secret: payload.secret,
        is_enabled: payload.isEnabled,
        events: payload.events,
      },
    );
    const data = res.payload;
    return {
      url: String(data?.url || data?.webhook_url || payload.url),
      secret: String(
        data?.secret || data?.webhook_secret || payload.secret || "",
      ),
      isEnabled: Boolean(
        data?.isEnabled ?? data?.is_enabled ?? payload.isEnabled,
      ),
      events: Array.isArray(data?.events)
        ? (data.events as string[])
        : payload.events,
    };
  },

  regenerateWebhookSecret: async (): Promise<{ secret: string }> => {
    const res = await httpClient.post<{
      secret?: string;
      webhook_secret?: string;
    }>(`${SUBSCRIPTION_BASE}/subscription/webhook/regenerate-secret`);
    return {
      secret:
        res.payload?.secret ||
        res.payload?.webhook_secret ||
        generateSecureRandomString("whsec_live_", 24),
    };
  },

  getWebhookLogs: async (
    params?: WebhookLogFilters,
    signal?: AbortSignal,
  ): Promise<{ data: WebhookLogItem[]; total: number }> => {
    try {
      const q = new URLSearchParams();
      if (params?.page) q.set("page", String(params.page));
      if (params?.page_size) q.set("page_size", String(params.page_size));
      if (params?.search) q.set("search", params.search);
      if (params?.event_name && params.event_name !== "ALL")
        q.set("event_name", params.event_name);
      if (params?.response_status)
        q.set("response_status", String(params.response_status));

      const queryStr = q.toString() ? `?${q.toString()}` : "";
      const res = await httpClient.get<WebhookLogItem[]>(
        `${SUBSCRIPTION_BASE}/subscription/webhook/logs${queryStr}`,
        { signal },
      );
      return {
        data: Array.isArray(res.payload) ? res.payload : [],
        total:
          res.pagination?.total_items ||
          (Array.isArray(res.payload) ? res.payload.length : 0),
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return { data: [], total: 0 };
    }
  },

  deleteWebhookLog: async (id: string): Promise<boolean> => {
    const res = await httpClient.delete(
      `${SUBSCRIPTION_BASE}/subscription/webhook/logs/${id}`,
    );
    return res.success;
  },

  retryWebhookLog: async (id: string): Promise<boolean> => {
    const res = await httpClient.post(
      `${SUBSCRIPTION_BASE}/subscription/webhook/logs/${id}/retry`,
    );
    return res.success;
  },
};
