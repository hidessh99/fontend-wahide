import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { Campaign, CreateCampaignInput, MessageLogResponse } from "../types/campaign.types";

const CAMPAIGN_BASE = env.NEXT_PUBLIC_CAMPAIGN_API_URL || env.NEXT_PUBLIC_API_BASE_URL;

export const campaignApi = {
  getCampaigns: async (page = 1, pageSize = 50): Promise<Campaign[]> => {
    try {
      const res = await httpClient.get<Campaign[]>(
        `${CAMPAIGN_BASE}/campaigns?page=${page}&page_size=${pageSize}`
      );
      return res.payload || (Array.isArray(res) ? res : []);
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

    const res = await httpClient.post<Campaign>(`${CAMPAIGN_BASE}/campaigns`, payload);
    return res.payload || (res as unknown as Campaign);
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
      const total = res.pagination?.total_items || logs.length;
      return { logs, total };
    } catch {
      return { logs: [], total: 0 };
    }
  },
};
