import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  Campaign,
  CampaignChannelType,
  ChannelStatsResponse,
  CreateCampaignInput,
  MessageLogResponse,
} from "../types/campaign.types";

const CAMPAIGN_BASE =
  env.NEXT_PUBLIC_CAMPAIGN_API_URL || env.NEXT_PUBLIC_API_BASE_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendCampaign = (c: any): Campaign => {
  if (!c || typeof c !== "object") {
    return {
      id: "",
      name: "Kampanye Siaran",
      channelType: "WHATSMEOW_UNOFFICIAL",
      deviceId: "",
      messageTemplate: "",
      jitterDelaySeconds: 3,
      enableHumanTyping: true,
      targetType: "ALL",
      targetTags: [],
      targetNumbers: [],
      totalRecipients: 0,
      sentCount: 0,
      failedCount: 0,
      status: "DRAFT",
      createdAt: new Date().toISOString(),
    };
  }

  const channelType: CampaignChannelType =
    c.channel_type === "META_WABA_OFFICIAL"
      ? "META_WABA_OFFICIAL"
      : c.channel_type === "TELEGRAM_BOT"
        ? "TELEGRAM_BOT"
        : "WHATSMEOW_UNOFFICIAL";

  const totalRecipients = Number(c.total_target ?? c.totalRecipients ?? 0);
  const sentCount = Number(c.total_sent ?? c.sentCount ?? 0);
  const failedCount = Number(c.total_failed ?? c.failedCount ?? 0);

  let deviceIds: string[] | undefined = undefined;
  if (Array.isArray(c.device_ids)) {
    deviceIds = c.device_ids;
  } else if (typeof c.device_ids === "string" && c.device_ids.trim() !== "") {
    try {
      const parsed = JSON.parse(c.device_ids);
      if (Array.isArray(parsed)) {
        deviceIds = parsed;
      }
    } catch {
      deviceIds = [c.device_ids];
    }
  } else if (Array.isArray(c.deviceIds)) {
    deviceIds = c.deviceIds;
  }

  const primaryDeviceId =
    c.device_id ||
    c.deviceId ||
    (deviceIds && deviceIds.length > 0 ? deviceIds[0] : "");
  if ((!deviceIds || deviceIds.length === 0) && primaryDeviceId) {
    deviceIds = [primaryDeviceId];
  }

  const autoScrubDeadNumbers = Boolean(
    c.auto_scrub_dead_numbers ?? c.autoScrubDeadNumbers ?? true,
  );
  const processedOffset = Number(c.processed_offset ?? c.processedOffset ?? 0);

  const rawTags: string[] = Array.isArray(c.tag_ids)
    ? c.tag_ids
    : c.targetTags || [];
  let derivedTargetType: "ALL" | "TAGS" | "CUSTOM" = "ALL";
  let targetTags: string[] = [];
  let targetNumbers: string[] = Array.isArray(c.target_numbers)
    ? c.target_numbers
    : c.targetNumbers || [];

  if (
    c.target_type === "CUSTOM" ||
    rawTags.some((t) => typeof t === "string" && t.startsWith("phone:"))
  ) {
    derivedTargetType = "CUSTOM";
    targetNumbers = rawTags
      .filter((t) => typeof t === "string" && t.startsWith("phone:"))
      .map((t) => t.replace("phone:", ""));
  } else if (
    c.target_type === "TAGS" ||
    (rawTags.length > 0 && !rawTags.includes("ALL"))
  ) {
    derivedTargetType = "TAGS";
    targetTags = rawTags.filter((t) => t !== "ALL");
  } else {
    derivedTargetType = "ALL";
  }

  return {
    id: String(c.id || ""),
    name: c.name || "Kampanye Siaran",
    channelType,
    deviceId: primaryDeviceId,
    deviceIds,
    deviceName: c.device_name || c.deviceName || undefined,
    wabaAccountId: c.waba_account_id || c.wabaAccountId || undefined,
    wabaAccountName: c.waba_account_name || c.wabaAccountName || undefined,
    telegramBotId: c.telegram_bot_id || c.telegramBotId || undefined,
    telegramBotUsername: c.telegram_bot_username || c.telegramBotUsername || undefined,
    messageTemplate: c.message_template || c.messageTemplate || "",
    mediaUrl: c.media_url || c.mediaUrl || undefined,
    jitterDelaySeconds: Number(
      c.jitter_delay_seconds ?? c.jitterDelaySeconds ?? 3,
    ),
    enableHumanTyping: Boolean(
      c.enable_human_typing ?? c.enableHumanTyping ?? true,
    ),
    autoScrubDeadNumbers,
    processedOffset: isNaN(processedOffset) ? 0 : processedOffset,
    targetType: derivedTargetType,
    targetTags,
    targetNumbers,
    totalRecipients: isNaN(totalRecipients) ? 0 : totalRecipients,
    sentCount: isNaN(sentCount) ? 0 : sentCount,
    failedCount: isNaN(failedCount) ? 0 : failedCount,
    status: c.status || "DRAFT",
    scheduledAt: c.scheduled_at || c.scheduledAt || undefined,
    createdAt: c.created_at || c.createdAt || new Date().toISOString(),
  };
};

export interface GetMessageLogsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  deviceId?: string;
  direction?: string;
  campaignId?: string;
  channelType?: string;
  messageType?: string;
  startDate?: string;
  endDate?: string;
  signal?: AbortSignal;
}

export const campaignApi = {
  getCampaigns: async (
    page = 1,
    pageSize = 50,
    signal?: AbortSignal,
  ): Promise<Campaign[]> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await httpClient.get<any>(
        `${CAMPAIGN_BASE}/campaigns?page=${page}&page_size=${pageSize}`,
        { signal },
      );
      const items = res.payload || (Array.isArray(res) ? res : []);
      if (!Array.isArray(items)) return [];
      return items.map(mapBackendCampaign);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return [];
    }
  },

  createCampaign: async (input: CreateCampaignInput): Promise<Campaign> => {
    let tagIDs: string[] = [];
    if (input.targetType === "ALL") {
      tagIDs = ["ALL"];
    } else if (input.targetType === "TAGS" && input.targetTags) {
      tagIDs = input.targetTags;
    } else if (input.targetType === "CUSTOM" && input.targetNumbers && input.targetNumbers.length > 0) {
      tagIDs = input.targetNumbers.map((num) => `phone:${num}`);
    } else if (input.targetType === "CUSTOM" && input.targetChatIds && input.targetChatIds.length > 0) {
      tagIDs = input.targetChatIds.map((cid) => `telegram:${cid}`);
    }

    const channelType = input.channelType || "WHATSMEOW_UNOFFICIAL";

    const primaryDeviceId =
      input.deviceId ||
      (input.deviceIds && input.deviceIds.length > 0 ? input.deviceIds[0] : "");
    const deviceIds =
      input.deviceIds && input.deviceIds.length > 0
        ? input.deviceIds
        : primaryDeviceId
          ? [primaryDeviceId]
          : [];

    const payload = {
      channel_type: channelType,
      device_id: channelType === "WHATSMEOW_UNOFFICIAL" ? primaryDeviceId : undefined,
      device_ids: channelType === "WHATSMEOW_UNOFFICIAL" ? deviceIds : undefined,
      waba_account_id: channelType === "META_WABA_OFFICIAL" ? input.wabaAccountId : undefined,
      telegram_bot_id: channelType === "TELEGRAM_BOT" ? input.telegramBotId : undefined,
      waba_config: input.wabaConfig,
      telegram_config: input.telegramConfig,
      auto_scrub_dead_numbers: input.autoScrubDeadNumbers ?? true,
      name: input.name,
      message_template: input.messageTemplate,
      media_url: input.mediaUrl,
      target_type: input.targetType,
      tag_ids: tagIDs,
      target_numbers: input.targetNumbers,
      target_chat_ids: input.targetChatIds,
      jitter_delay_seconds: channelType === "WHATSMEOW_UNOFFICIAL" ? input.jitterDelaySeconds : 0,
      enable_human_typing: channelType === "WHATSMEOW_UNOFFICIAL" ? input.enableHumanTyping : false,
      scheduled_at: input.scheduledAt || null,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.post<any>(
      `${CAMPAIGN_BASE}/campaigns`,
      payload,
    );
    const raw = res.payload || res;
    return mapBackendCampaign(raw);
  },

  startCampaign: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post(`${CAMPAIGN_BASE}/campaigns/${id}/start`);
    return {
      success: res.success,
      message: res.message || "Kampanye siaran dimulai",
    };
  },

  pauseCampaign: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post(`${CAMPAIGN_BASE}/campaigns/${id}/pause`);
    return { success: res.success, message: res.message || "Kampanye dijeda" };
  },

  resumeCampaign: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post(
      `${CAMPAIGN_BASE}/campaigns/${id}/resume`,
    );
    return {
      success: res.success,
      message: res.message || "Kampanye dilanjutkan",
    };
  },

  cancelCampaign: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete(`${CAMPAIGN_BASE}/campaigns/${id}`);
    return {
      success: res.success,
      message: res.message || "Kampanye dibatalkan",
    };
  },

  getMessageLogs: async (
    paramsOrPage: GetMessageLogsParams | number = 1,
    pageSize = 20,
    signal?: AbortSignal,
  ): Promise<{ logs: MessageLogResponse[]; total: number }> => {
    let p = 1;
    let size = 20;
    let s = "";
    let st = "";
    let devId = "";
    let dir = "";
    let campId = "";
    let chanType = "";
    let msgType = "";
    let startDate = "";
    let endDate = "";
    let sig = signal;

    if (typeof paramsOrPage === "object" && paramsOrPage !== null) {
      p = paramsOrPage.page ?? 1;
      size = paramsOrPage.pageSize ?? 20;
      s = paramsOrPage.search ?? "";
      st = paramsOrPage.status ?? "";
      devId = paramsOrPage.deviceId ?? "";
      dir = paramsOrPage.direction ?? "";
      campId = paramsOrPage.campaignId ?? "";
      chanType = paramsOrPage.channelType ?? "";
      msgType = paramsOrPage.messageType ?? "";
      startDate = paramsOrPage.startDate ?? "";
      endDate = paramsOrPage.endDate ?? "";
      sig = paramsOrPage.signal || signal;
    } else {
      p = paramsOrPage;
      size = pageSize;
    }

    try {
      const searchParams = new URLSearchParams();
      searchParams.set("page", String(p));
      searchParams.set("page_size", String(size));
      if (s.trim()) searchParams.set("search", s.trim());
      if (st.trim() && st !== "ALL") searchParams.set("status", st.trim());
      if (devId.trim()) searchParams.set("device_id", devId.trim());
      if (dir.trim() && dir !== "ALL")
        searchParams.set("direction", dir.trim());
      if (campId.trim()) searchParams.set("campaign_id", campId.trim());
      if (chanType.trim() && chanType !== "ALL")
        searchParams.set("channel_type", chanType.trim());
      if (msgType.trim() && msgType !== "ALL")
        searchParams.set("message_type", msgType.trim());
      if (startDate.trim()) searchParams.set("start_date", startDate.trim());
      if (endDate.trim()) searchParams.set("end_date", endDate.trim());

      const res = await httpClient.get<MessageLogResponse[]>(
        `${CAMPAIGN_BASE}/campaigns/logs?${searchParams.toString()}`,
        { signal: sig },
      );
      const logs = res.payload || (Array.isArray(res) ? res : []);
      const info = res.additional_info as { total?: number } | undefined;
      const total =
        typeof info?.total === "number"
          ? info.total
          : typeof res.pagination?.total_items === "number"
            ? res.pagination.total_items
            : logs.length;
      return { logs, total };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return { logs: [], total: 0 };
    }
  },

  getChannelStats: async (
    params: {
      channelType?: string;
      messageType?: string;
      startDate?: string;
      endDate?: string;
      deviceId?: string;
    },
    signal?: AbortSignal,
  ): Promise<ChannelStatsResponse> => {
    try {
      const searchParams = new URLSearchParams();
      if (params.channelType && params.channelType !== "ALL") {
        searchParams.set("channel_type", params.channelType);
      }
      if (params.messageType && params.messageType !== "ALL") {
        searchParams.set("message_type", params.messageType);
      }
      if (params.startDate) searchParams.set("start_date", params.startDate);
      if (params.endDate) searchParams.set("end_date", params.endDate);
      if (params.deviceId) searchParams.set("device_id", params.deviceId);

      const res = await httpClient.get<ChannelStatsResponse>(
        `${CAMPAIGN_BASE}/campaigns/stats?${searchParams.toString()}`,
        { signal },
      );
      return (
        res.payload || {
          total_sends: 0,
          delivered_count: 0,
          delivery_rate: 0,
          failed_count: 0,
          failure_rate: 0,
          read_count: 0,
          read_rate: 0,
          daily_activity: [],
        }
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return {
        total_sends: 0,
        delivered_count: 0,
        delivery_rate: 0,
        failed_count: 0,
        failure_rate: 0,
        read_count: 0,
        read_rate: 0,
        daily_activity: [],
      };
    }
  },
};
