import { TenantSubscription } from "@/modules/subscription/types/subscription.types";
import {
  UserDashboardStats,
  ChannelBreakdown,
} from "@/modules/iam/types/dashboard.types";

export interface NormalizedChannelUsage {
  channelType: "WHATSAPP" | "WABA" | "TELEGRAM";
  label: string;
  sendersUsed: number;
  sendersMax: number;
  sendersUnit: string;
  messagesUsed: number;
  messagesMax: number;
  percentage: number;
  status: "healthy" | "warning" | "critical";
  connectUrl: string;
  actionLabel: string;
}

export interface PlanUsageViewModel {
  planName: string;
  tierBadge: string;
  isActive: boolean;
  isFreeTrial: boolean;
  isLifetime: boolean;
  expiryInfo: {
    daysRemaining: number;
    isExpired: boolean;
    isExpiringSoon: boolean;
    formattedDate: string;
  };
  totalQuota: {
    used: number;
    max: number;
    percentage: number;
    status: "healthy" | "warning" | "critical";
  };
  channels: NormalizedChannelUsage[];
}

/**
 * Calculates remaining days from an ISO or RFC3339 date string.
 */
export function calculateDaysRemaining(expiresAt?: string | null): {
  daysRemaining: number;
  isExpired: boolean;
  isExpiringSoon: boolean;
  formattedDate: string;
} {
  if (!expiresAt) {
    return {
      daysRemaining: 0,
      isExpired: false,
      isExpiringSoon: false,
      formattedDate: "-",
    };
  }

  const expDate = new Date(expiresAt);
  if (isNaN(expDate.getTime())) {
    return {
      daysRemaining: 0,
      isExpired: false,
      isExpiringSoon: false,
      formattedDate: "-",
    };
  }

  const now = new Date();
  const diffMs = expDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const isExpired = diffMs <= 0;
  const isExpiringSoon = !isExpired && daysRemaining <= 3;

  const formattedDate = expDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return {
    daysRemaining,
    isExpired,
    isExpiringSoon,
    formattedDate,
  };
}

/**
 * Calculates percentage and health status token.
 */
export function calculateUsagePercentage(
  used: number,
  max: number
): {
  percentage: number;
  status: "healthy" | "warning" | "critical";
} {
  const safeMax = Math.max(1, max);
  const safeUsed = Math.max(0, used);
  const percentage = Math.round((safeUsed / safeMax) * 100);

  let status: "healthy" | "warning" | "critical" = "healthy";
  if (percentage >= 90) {
    status = "critical";
  } else if (percentage >= 75) {
    status = "warning";
  }

  return {
    percentage,
    status,
  };
}

/**
 * Derives a normalized plan and multi-channel usage view model.
 */
export function derivePlanUsage(
  subscription: TenantSubscription | null,
  userStats: UserDashboardStats | null,
  devicesList: Array<{ status?: string; channel_type?: string }> = []
): PlanUsageViewModel {
  const rawPlanName =
    subscription?.planName || userStats?.plan_name || "Starter Free Trial";
  const planPrice = subscription?.planPrice ?? 0;
  const isFreeTrial =
    planPrice === 0 &&
    (rawPlanName.toLowerCase().includes("trial") ||
      rawPlanName.toLowerCase().includes("free") ||
      userStats?.plan_status?.toLowerCase().includes("trial") ||
      false);

  const isLifetime = subscription?.isLifetime ?? false;
  const isActive =
    subscription?.isActive ??
    (userStats?.plan_status ? userStats.plan_status === "ACTIVE" : true);

  let tierBadge = subscription?.tier?.toUpperCase();
  if (!tierBadge) {
    if (isFreeTrial) {
      tierBadge = "FREE TRIAL";
    } else if (rawPlanName.toLowerCase().includes("enterprise")) {
      tierBadge = "ENTERPRISE";
    } else {
      tierBadge = "PRO TIER";
    }
  }

  const expiryInfo = calculateDaysRemaining(
    subscription?.expiresAt || userStats?.subscription_expires_at
  );

  // Overall Message Quota
  const totalUsed =
    subscription?.quotaUsed ?? userStats?.total_messages_sent ?? 0;
  const totalMax =
    subscription?.quotaTotal ?? userStats?.monthly_message_limit ?? 10000;
  const overallUsage = calculateUsagePercentage(totalUsed, totalMax);

  // Devices counts per channel from devicesList
  const waConnected = devicesList.filter(
    (d) =>
      (!d.channel_type ||
        d.channel_type === "WHATSAPP" ||
        d.channel_type === "WHATSMEOW_UNOFFICIAL") &&
      d.status === "CONNECTED"
  ).length;

  const wabaConnected = devicesList.filter(
    (d) =>
      (d.channel_type === "WABA" || d.channel_type === "META_WABA_OFFICIAL") &&
      d.status === "CONNECTED"
  ).length;

  const teleConnected = devicesList.filter(
    (d) =>
      (d.channel_type === "TELEGRAM" || d.channel_type === "TELEGRAM_BOT") &&
      d.status === "CONNECTED"
  ).length;

  // Channel breakdown sent stats from userStats
  const channelsStats: ChannelBreakdown[] = userStats?.channels || [];
  const waChannelStat = channelsStats.find(
    (c) => c.channel_type === "WHATSAPP"
  );
  const wabaChannelStat = channelsStats.find((c) => c.channel_type === "WABA");
  const teleChannelStat = channelsStats.find(
    (c) => c.channel_type === "TELEGRAM"
  );

  // Per Channel items from subscription.channels if present
  const planChannels = subscription?.channels || [];
  const waPlanChannel = planChannels.find(
    (c) =>
      c.channelType === "WHATSMEOW_UNOFFICIAL" || c.channelType === "WHATSAPP"
  );
  const wabaPlanChannel = planChannels.find(
    (c) =>
      c.channelType === "META_WABA_OFFICIAL" || c.channelType === "WABA"
  );
  const telePlanChannel = planChannels.find(
    (c) => c.channelType === "TELEGRAM_BOT" || c.channelType === "TELEGRAM"
  );

  // WhatsApp Web Channel Metrics
  const waSendersUsed = Math.max(
    waConnected,
    waChannelStat?.connected_count || 0
  );
  const waSendersMax =
    waPlanChannel?.maxSenders ||
    subscription?.deviceSlotsMax ||
    userStats?.device_limit ||
    5;
  const waMessagesUsed = waChannelStat?.sent_count || totalUsed || 0;
  const waMessagesMax = waPlanChannel?.monthlyQuota || Math.round(totalMax * 0.65) || 15000;
  const waProgress = calculateUsagePercentage(waMessagesUsed, waMessagesMax);

  // Meta WABA Channel Metrics
  const wabaSendersUsed = Math.max(
    wabaConnected,
    wabaChannelStat?.connected_count || 0
  );
  const wabaSendersMax = wabaPlanChannel?.maxSenders || 2;
  const wabaMessagesUsed = wabaChannelStat?.sent_count || 0;
  const wabaMessagesMax = wabaPlanChannel?.monthlyQuota || Math.round(totalMax * 0.25) || 5000;
  const wabaProgress = calculateUsagePercentage(
    wabaMessagesUsed,
    wabaMessagesMax
  );

  // Telegram Channel Metrics
  const teleSendersUsed = Math.max(
    teleConnected,
    teleChannelStat?.connected_count || 0
  );
  const teleSendersMax = telePlanChannel?.maxSenders || 3;
  const teleMessagesUsed = teleChannelStat?.sent_count || 0;
  const teleMessagesMax = telePlanChannel?.monthlyQuota || Math.round(totalMax * 0.10) || 3000;
  const teleProgress = calculateUsagePercentage(
    teleMessagesUsed,
    teleMessagesMax
  );

  const channels: NormalizedChannelUsage[] = [
    {
      channelType: "WHATSAPP",
      label: "WhatsApp Web (Multi-Device)",
      sendersUsed: waSendersUsed,
      sendersMax: waSendersMax,
      sendersUnit: "Device Slot",
      messagesUsed: waMessagesUsed,
      messagesMax: waMessagesMax,
      percentage: waProgress.percentage,
      status: waProgress.status,
      connectUrl: "/wa/devices",
      actionLabel: "+ Scan QR",
    },
    {
      channelType: "WABA",
      label: "Meta WABA (Official API)",
      sendersUsed: wabaSendersUsed,
      sendersMax: wabaSendersMax,
      sendersUnit: "Akun Resmi",
      messagesUsed: wabaMessagesUsed,
      messagesMax: wabaMessagesMax,
      percentage: wabaProgress.percentage,
      status: wabaProgress.status,
      connectUrl: "/waba/devices",
      actionLabel: "+ Sambungkan WABA",
    },
    {
      channelType: "TELEGRAM",
      label: "Telegram (Bot Gateway)",
      sendersUsed: teleSendersUsed,
      sendersMax: teleSendersMax,
      sendersUnit: "Bot Terdaftar",
      messagesUsed: teleMessagesUsed,
      messagesMax: teleMessagesMax,
      percentage: teleProgress.percentage,
      status: teleProgress.status,
      connectUrl: "/tele/devices",
      actionLabel: "+ Tambah Bot",
    },
  ];

  return {
    planName: rawPlanName,
    tierBadge,
    isActive,
    isFreeTrial,
    isLifetime,
    expiryInfo,
    totalQuota: {
      used: totalUsed,
      max: totalMax,
      percentage: overallUsage.percentage,
      status: overallUsage.status,
    },
    channels,
  };
}
