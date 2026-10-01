import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  CRMPipeline,
  CRMDeal,
  CreateDealInput,
  UpdateDealInput,
} from "../types/crm.types";

const BASE_URL = env.NEXT_PUBLIC_WHATSAPP_API_URL;

export const crmApi = {
  getBoard: async (
    pipelineId?: string,
    signal?: AbortSignal,
  ): Promise<CRMPipeline> => {
    const qs = pipelineId ? `?pipeline_id=${pipelineId}` : "";
    const res = await httpClient.get<CRMPipeline>(`${BASE_URL}/crm/board${qs}`, {
      signal,
    });
    return res.payload as CRMPipeline;
  },

  createDeal: async (input: CreateDealInput): Promise<CRMDeal> => {
    const res = await httpClient.post<CRMDeal>(`${BASE_URL}/crm/deals`, input);
    return res.payload as CRMDeal;
  },

  updateDeal: async (
    id: string,
    input: UpdateDealInput,
  ): Promise<CRMDeal> => {
    const res = await httpClient.put<CRMDeal>(
      `${BASE_URL}/crm/deals/${id}`,
      input,
    );
    return res.payload as CRMDeal;
  },

  moveDealStage: async (
    id: string,
    targetStageId: string,
  ): Promise<CRMDeal> => {
    const res = await httpClient.put<CRMDeal>(
      `${BASE_URL}/crm/deals/${id}/move`,
      { target_stage_id: targetStageId },
    );
    return res.payload as CRMDeal;
  },

  deleteDeal: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete(`${BASE_URL}/crm/deals/${id}`);
    return {
      success: res.success,
      message: res.message || "Peluang berhasil dihapus",
    };
  },
};
