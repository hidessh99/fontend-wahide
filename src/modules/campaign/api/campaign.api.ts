import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { Campaign, CreateCampaignInput, MessageLogResponse } from "../types/campaign.types";

const CAMPAIGN_BASE = env.NEXT_PUBLIC_CAMPAIGN_API_URL || env.NEXT_PUBLIC_API_BASE_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendCampaign = (c: any): Campaign => {
  if (!c || typeof c !== "object") {
    return {
      id: "",
      name: "Kampanye Siaran",
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

  const totalRecipients = Number(c.total_target ?? c.totalRecipients ?? 0);
  const sentCount = Number(c.total_sent ?? c.sentCount ?? 0);
  const failedCount = Number(c.total_failed ?? c.failedCount ?? 0);

  const rawTags: string[] = Array.isArray(c.tag_ids) ? c.tag_ids : c.targetTags || [];
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
  } else if (c.target_type === "TAGS" || (rawTags.length > 0 && !rawTags.includes("ALL"))) {
    derivedTargetType = "TAGS";
    targetTags = rawTags.filter((t) => t !== "ALL");
  } else {
    derivedTargetType = "ALL";
  }

  return {
    id: String(c.id || ""),
    name: c.name || "Kampanye Siaran",
    deviceId: c.device_id || c.deviceId || "",
    deviceName: c.device_name || c.deviceName || undefined,
    messageTemplate: c.message_template || c.messageTemplate || "",
    jitterDelaySeconds: Number(c.jitter_delay_seconds ?? c.jitterDelaySeconds ?? 3),
    enableHumanTyping: Boolean(c.enable_human_typing ?? c.enableHumanTyping ?? true),
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

export const campaignApi = {
  getCampaigns: async (page = 1, pageSize = 50): Promise<Campaign[]> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await httpClient.get<any>(
        `${CAMPAIGN_BASE}/campaigns?page=${page}&page_size=${pageSize}`
      );
      const items = res.payload || (Array.isArray(res) ? res : []);
      if (!Array.isArray(items)) return [];
      return items.map(mapBackendCampaign);
    } catch {
      return [];
    }
  },

  createCampaign: async (input: CreateCampaignInput): Promise<Campaign> => {
    let tagIDs: string[] = [];
    if (input.targetType === "ALL") {
      tagIDs = ["ALL"];
    } else if (input.targetType === "TAGS" && input.targetTags) {
      tagIDs = input.targetTags;
    } else if (input.targetType === "CUSTOM" && input.targetNumbers) {
      tagIDs = input.targetNumbers.map((num) => `phone:${num}`);
    }

    const payload = {
      device_id: input.deviceId,
      name: input.name,
      message_template: input.messageTemplate,
      target_type: input.targetType,
      tag_ids: tagIDs,
      target_numbers: input.targetNumbers,
      jitter_delay_seconds: input.jitterDelaySeconds,
      enable_human_typing: input.enableHumanTyping,
      scheduled_at: input.scheduledAt || null,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.post<any>(`${CAMPAIGN_BASE}/campaigns`, payload);
    const raw = res.payload || res;
    return mapBackendCampaign(raw);
  },

  startCampaign: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post(`${CAMPAIGN_BASE}/campaigns/${id}/start`);
    return { success: res.success, message: res.message || "Kampanye siaran dimulai" };
  },

  pauseCampaign: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post(`${CAMPAIGN_BASE}/campaigns/${id}/pause`);
    return { success: res.success, message: res.message || "Kampanye dijeda" };
  },

  resumeCampaign: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post(`${CAMPAIGN_BASE}/campaigns/${id}/resume`);
    return { success: res.success, message: res.message || "Kampanye dilanjutkan" };
  },

  cancelCampaign: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete(`${CAMPAIGN_BASE}/campaigns/${id}`);
    return { success: res.success, message: res.message || "Kampanye dibatalkan" };
  },

  getMessageLogs: async (
    page = 1,
    pageSize = 20
  ): Promise<{ logs: MessageLogResponse[]; total: number }> => {
    try {
      const res = await httpClient.get<MessageLogResponse[]>(
        `${CAMPAIGN_BASE}/campaigns/logs?page=${page}&page_size=${pageSize}`
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
    } catch {
      return { logs: [], total: 0 };
    }
  },
};
