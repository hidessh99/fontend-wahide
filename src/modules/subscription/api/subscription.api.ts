import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { generateSecureRandomString } from "@/lib/utils";
import {
  SubscriptionChannel,
  SubscriptionPlan,
  TenantSubscription,
  PlanChannelItem,
  WebhookConfig,
  WebhookLogItem,
  WebhookLogFilters,
} from "../types/subscription.types";

const SUBSCRIPTION_BASE = env.NEXT_PUBLIC_WHATSAPP_API_URL;

export const CHANNEL_PLANS: Record<
  SubscriptionChannel,
  SubscriptionPlan[]
> = {
  OMNICHANNEL: [
    {
      id: "01JPLAN0000000000000000001",
      name: "FREE Starter",
      channelType: "OMNICHANNEL",
      priceMonthly: 0,
      quotaMonthly: 2500,
      maxDeviceSlots: 2,
      maxAgents: 1,
      hasWatermark: true,
      allowAttachment: false,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: false,
      features: [
        "2.500 Kuota Pesan / bulan (1.5k WA + 1k TG)",
        "2 Slot Device Aktif (1 WA Web + 1 Telegram Bot)",
        "1 Operator CS / Agent",
        "Proteksi Anti-Ban Jitter & Spintax",
        "Watermark 'Powered by Wahide'",
        "Gratis Selamanya (Free Forever)",
      ],
    },
    {
      id: "01JPLANHYBRID0000000000001",
      name: "Omnichannel UMKM Combo",
      channelType: "OMNICHANNEL",
      priceMonthly: 49000,
      quotaMonthly: 35000,
      maxDeviceSlots: 5,
      maxAgents: 3,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: true,
      isPopular: true,
      features: [
        "35.000 Pesan Total / bulan (15k WA + 15k TG + 5k WABA)",
        "5 Senders Terhubung (3 WA Web + 1 WABA + 1 TG)",
        "3 Operator CS / Multi-Agent",
        "Kirim Media Gambar, Dokumen & Audio",
        "Bebas Watermark (100% White-Label)",
        "Auto-Reply & AI Chatbot Response",
        "Multi-Channel Smart Routing",
      ],
    },
    {
      id: "01JPLANHYBRID0000000000002",
      name: "Omnichannel Juragan Super",
      channelType: "OMNICHANNEL",
      priceMonthly: 99000,
      quotaMonthly: 100000,
      maxDeviceSlots: 19,
      maxAgents: 8,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: true,
      features: [
        "100.000 Pesan Total / bulan (50k WA + 50k TG + Unlimited WABA)",
        "19 Senders Terhubung (8 WA + 3 WABA + 8 TG)",
        "8 Operator CS / Multi-Agent",
        "Kirim Media Gambar, Dokumen & Audio",
        "Prioritas Jalur Antrean Anti-Ban",
        "Webhook Event Streaming Real-time",
        "Dukungan Teknis Prioritas SLA",
      ],
    },
  ],
  WHATSMEOW_UNOFFICIAL: [
    {
      id: "01JPLAN0000000000000000002",
      name: "WA Olshop Pemula",
      channelType: "WHATSMEOW_UNOFFICIAL",
      priceMonthly: 10000,
      quotaMonthly: 5000,
      maxDeviceSlots: 1,
      maxAgents: 1,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: false,
      features: [
        "5.000 Pesan Broadcast / bulan",
        "1 Slot WhatsApp Multi-Device (QR)",
        "1 Operator CS / Agent",
        "Kirim Media Gambar, Dokumen & Audio",
        "Bebas Watermark (100% White-Label)",
        "Proteksi Spintax & Jeda Kirim Alami",
      ],
    },
    {
      id: "01JPLAN0000000000000000003",
      name: "WA UMKM Berkembang",
      channelType: "WHATSMEOW_UNOFFICIAL",
      priceMonthly: 25000,
      quotaMonthly: 15000,
      maxDeviceSlots: 2,
      maxAgents: 2,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: true,
      isPopular: true,
      features: [
        "15.000 Pesan Broadcast / bulan",
        "2 Slot WhatsApp Multi-Device",
        "2 Operator CS / Multi-Agent",
        "Auto-Reply & Penjadwalan Pesan",
        "Kirim Media Gambar & Dokumen",
        "Bebas Watermark (100% White-Label)",
      ],
    },
    {
      id: "01JPLAN0000000000000000004",
      name: "WA Juragan Grosir",
      channelType: "WHATSMEOW_UNOFFICIAL",
      priceMonthly: 50000,
      quotaMonthly: 50000,
      maxDeviceSlots: 5,
      maxAgents: 5,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: true,
      features: [
        "50.000 Pesan Broadcast / bulan",
        "5 Slot WhatsApp Multi-Device",
        "5 Operator CS / Multi-Agent",
        "Webhook & Real-time Delivery Event",
        "Prioritas Jalur Antrean Anti-Ban",
        "Dukungan Teknis Prioritas",
      ],
    },
  ],
  META_WABA_OFFICIAL: [
    {
      id: "01JPLANWABA000000000000001",
      name: "WABA Starter",
      channelType: "META_WABA_OFFICIAL",
      priceMonthly: 20000,
      quotaMonthly: 5000,
      maxDeviceSlots: 1,
      maxAgents: 1,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: true,
      features: [
        "1 Nomor WhatsApp Resmi Meta (WABA)",
        "5.000 Kuota Percakapan Gateway / bulan",
        "Kirim Template HSM Resmi Centang Hijau",
        "Gateway Only (Biaya pesan bayar langsung ke Meta)",
        "Anti-Banned 100% Resmi Meta",
      ],
    },
    {
      id: "01JPLANWABA000000000000002",
      name: "WABA Pro Bisnis",
      channelType: "META_WABA_OFFICIAL",
      priceMonthly: 45000,
      quotaMonthly: 20000,
      maxDeviceSlots: 2,
      maxAgents: 3,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: true,
      isPopular: true,
      features: [
        "2 Nomor WhatsApp Resmi Meta",
        "20.000 Kuota Percakapan Gateway / bulan",
        "3 Operator CS / Multi-Agent",
        "Integrasi Webhook Multi-Nomor",
        "Kirim Pesan Marketing & Utility HSM",
      ],
    },
    {
      id: "01JPLANWABA000000000000003",
      name: "WABA Juragan Scale",
      channelType: "META_WABA_OFFICIAL",
      priceMonthly: 85000,
      quotaMonthly: 0,
      maxDeviceSlots: 5,
      maxAgents: 5,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: true,
      features: [
        "5 Nomor WhatsApp Resmi Meta",
        "Unlimited Kuota Percakapan Gateway",
        "5 Operator CS / Multi-Agent",
        "Dedicated Tier & Meta Escalation SLA",
        "Throughput Kecepatan Tertinggi",
      ],
    },
  ],
  TELEGRAM_BOT: [
    {
      id: "01JPLANTG00000000000000001",
      name: "Telegram UMKM Lite",
      channelType: "TELEGRAM_BOT",
      priceMonthly: 10000,
      quotaMonthly: 10000,
      maxDeviceSlots: 2,
      maxAgents: 1,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: true,
      features: [
        "2 Bot Token Telegram (BotFather)",
        "10.000 Pesan Bot / bulan",
        "Format Pesan HTML & MarkdownV2",
        "Auto-Reply & Command Trigger",
        "Biaya Pesan Rp 0 (Free Upstream)",
      ],
    },
    {
      id: "01JPLANTG00000000000000002",
      name: "Telegram Juragan",
      channelType: "TELEGRAM_BOT",
      priceMonthly: 25000,
      quotaMonthly: 100000,
      maxDeviceSlots: 5,
      maxAgents: 3,
      hasWatermark: false,
      allowAttachment: true,
      allowCampaign: true,
      allowAutoreply: true,
      allowSchedule: true,
      isPopular: true,
      features: [
        "5 Bot Token Telegram Aktif",
        "100.000 Pesan Bot / bulan",
        "Inline Keyboard Matrix (Callback / URL)",
        "Broadcast Saluran & Grup Telegram",
        "Webhook Event Streaming Real-time",
      ],
    },
  ],
};

export const DEFAULT_PLANS: SubscriptionPlan[] = [
  ...CHANNEL_PLANS.OMNICHANNEL,
  ...CHANNEL_PLANS.WHATSMEOW_UNOFFICIAL,
  ...CHANNEL_PLANS.META_WABA_OFFICIAL,
  ...CHANNEL_PLANS.TELEGRAM_BOT,
];

function normalizeSubscription(
  raw: Record<string, unknown> | null | undefined,
): TenantSubscription {
  if (!raw) {
    return {
      planId: "01JPLAN0000000000000000001",
      planName: "FREE Starter",
      planPrice: 0,
      quotaUsed: 0,
      quotaTotal: 2500,
      deviceSlotsUsed: 0,
      deviceSlotsMax: 2,
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
    rawPlan.name || raw.plan_name || raw.planName || raw.name || "FREE Starter",
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
      (planId === "01JPLAN0000000000000000001" ? 2500 : 1500),
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
      (planId === "01JPLAN0000000000000000001" ? 2 : 1),
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
    planName.toUpperCase().includes("FREE") ||
    planName.toUpperCase().includes("STARTER"),
  );

  let channels: PlanChannelItem[] | undefined = undefined;
  const rawChannels = rawPlan.channels || raw.channels;
  if (Array.isArray(rawChannels) && rawChannels.length > 0) {
    channels = rawChannels.map((ch: Record<string, unknown>) => ({
      id: String(ch.id || ""),
      channelType: String(ch.channel_type || ch.channelType || ""),
      isEnabled: Boolean(ch.is_enabled ?? ch.isEnabled ?? true),
      maxSenders: Number(ch.max_senders ?? ch.maxSenders ?? 1),
      monthlyQuota: Number(ch.monthly_quota ?? ch.monthlyQuota ?? 0),
      ratePerUnit: Number(ch.rate_per_unit ?? ch.ratePerUnit ?? 0),
    }));
  }

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
    channels,
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
      (id === "01JPLAN0000000000000000001" ? 2500 : 1500),
  );
  const maxDeviceSlots = Number(
    raw.max_devices ??
      raw.maxDevices ??
      raw.max_device_slots ??
      raw.maxDeviceSlots ??
      (id === "01JPLAN0000000000000000001" ? 2 : 1),
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

  // Map backend channel_type to frontend SubscriptionChannel enum
  let channelType: SubscriptionChannel = "WHATSMEOW_UNOFFICIAL";
  const rawCh = String(raw.channel_type || raw.channelType || "").toUpperCase();
  if (
    rawCh === "OMNICHANNEL" ||
    rawCh.includes("OMNI") ||
    rawCh.includes("HYBRID") ||
    id === "01JPLAN0000000000000000001"
  ) {
    channelType = "OMNICHANNEL";
  } else if (rawCh === "META_WABA" || rawCh.includes("WABA")) {
    channelType = "META_WABA_OFFICIAL";
  } else if (rawCh === "TELEGRAM" || rawCh.includes("TELE")) {
    channelType = "TELEGRAM_BOT";
  } else if (rawCh === "WHATSMEOW" || rawCh.includes("WA")) {
    channelType = "WHATSMEOW_UNOFFICIAL";
  }

  // Parse multi-channel quotas if provided
  let channels: PlanChannelItem[] | undefined = undefined;
  if (Array.isArray(raw.channels) && raw.channels.length > 0) {
    channels = raw.channels.map((ch: Record<string, unknown>) => ({
      id: String(ch.id || ""),
      channelType: String(ch.channel_type || ch.channelType || ""),
      isEnabled: Boolean(ch.is_enabled ?? ch.isEnabled ?? true),
      maxSenders: Number(ch.max_senders ?? ch.maxSenders ?? 1),
      monthlyQuota: Number(ch.monthly_quota ?? ch.monthlyQuota ?? 0),
      ratePerUnit: Number(ch.rate_per_unit ?? ch.ratePerUnit ?? 0),
    }));
  }

  // Dynamic feature generation based on channel and database columns
  let features: string[] = [];
  if (Array.isArray(raw.features) && raw.features.length > 0) {
    features = raw.features.map(String);
  } else if (channelType === "OMNICHANNEL") {
    features.push(
      `${quotaMonthly.toLocaleString("id-ID")} Pesan Total Multi-Channel / bulan`,
    );
    if (channels && channels.length > 0) {
      channels.forEach((ch) => {
        if (ch.isEnabled && ch.monthlyQuota > 0) {
          const chName =
            ch.channelType === "WHATSMEOW"
              ? "WhatsApp Web"
              : ch.channelType === "TELEGRAM"
                ? "Telegram Bot"
                : "Meta WABA";
          features.push(
            `• ${ch.monthlyQuota.toLocaleString("id-ID")} Pesan ${chName}`,
          );
        }
      });
    }
    features.push(`${maxDeviceSlots} Senders / Devices Terhubung`);
    if (maxAgents > 0) {
      features.push(`${maxAgents} Operator CS / Multi-Agent`);
    }
    if (allowAttachment) {
      features.push("Kirim Media Gambar, Dokumen & Audio");
    }
    if (allowAutoreply) {
      features.push("Auto-Reply & AI Chatbot Response");
    }
    if (!hasWatermark) {
      features.push("Bebas Watermark (100% White-Label)");
    } else {
      features.push("Watermark 'Powered by Wahide'");
    }
    features.push("Multi-Channel Smart Routing");
  } else {
    features.push(
      `${quotaMonthly.toLocaleString("id-ID")} Pesan Broadcast / bulan`,
    );
    features.push(`${maxDeviceSlots} Slot Perangkat / Token`);
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
    channelType,
    priceMonthly,
    quotaMonthly,
    maxDeviceSlots,
    maxAgents,
    hasWatermark,
    allowAttachment,
    allowCampaign,
    allowAutoreply,
    allowSchedule,
    channels,
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
