import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { Campaign, CreateCampaignInput } from "../types/campaign.types";

const CAMPAIGN_BASE = env.NEXT_PUBLIC_WHATSAPP_API_URL;

export const campaignApi = {
  getCampaigns: async (): Promise<Campaign[]> => {
    try {
      const res = await httpClient.get<Campaign[]>(`${CAMPAIGN_BASE}/campaigns`);
      return res.payload || (Array.isArray(res) ? res : []);
    } catch {
      return [];
    }
  },

  createCampaign: async (payload: CreateCampaignInput): Promise<Campaign> => {
    const res = await httpClient.post<Campaign>(`${CAMPAIGN_BASE}/campaigns`, payload);
    return res.payload || (res as unknown as Campaign);
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
};
