// ==============================================================================
// Wahide Frontend - Conversational Flow API Client
// Standard REST API communication for Flow DAG Builder & Simulator
// ==============================================================================

import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  FlowDefinition,
  CreateFlowInput,
  UpdateFlowInput,
  TestFlowSimulationInput,
  TestFlowSimulationResult,
} from "../types/flow.types";

const BASE_URL = env.NEXT_PUBLIC_API_BASE_URL;

export interface ListFlowsResponse {
  items: FlowDefinition[];
  total: number;
  page: number;
  limit: number;
}

export const flowApi = {
  getFlows: async (page = 1, limit = 10): Promise<ListFlowsResponse> => {
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await httpClient.get<FlowDefinition[]>(
        `${BASE_URL}/autoreply/flows?${params.toString()}`,
      );

      const total =
        (res.additional_info as { total?: number })?.total ||
        (res.pagination as { total_items?: number })?.total_items ||
        (Array.isArray(res.payload) ? res.payload.length : 0);

      return {
        items: Array.isArray(res.payload) ? res.payload : [],
        total,
        page,
        limit,
      };
    } catch {
      return { items: [], total: 0, page, limit };
    }
  },

  getFlowById: async (id: string): Promise<FlowDefinition | null> => {
    try {
      const res = await httpClient.get<FlowDefinition>(
        `${BASE_URL}/autoreply/flows/${id}`,
      );
      return res.payload || null;
    } catch {
      return null;
    }
  },

  createFlow: async (input: CreateFlowInput): Promise<FlowDefinition> => {
    const res = await httpClient.post<FlowDefinition>(
      `${BASE_URL}/autoreply/flows`,
      input,
    );
    if (!res.payload) {
      throw new Error(res.message || "Failed to create flow");
    }
    return res.payload;
  },

  updateFlow: async (
    id: string,
    input: UpdateFlowInput,
  ): Promise<FlowDefinition> => {
    const res = await httpClient.put<FlowDefinition>(
      `${BASE_URL}/autoreply/flows/${id}`,
      input,
    );
    if (!res.payload) {
      throw new Error(res.message || "Failed to update flow");
    }
    return res.payload;
  },

  deleteFlow: async (id: string): Promise<boolean> => {
    const res = await httpClient.delete(`${BASE_URL}/autoreply/flows/${id}`);
    return res.success;
  },

  simulateStep: async (
    input: TestFlowSimulationInput,
  ): Promise<TestFlowSimulationResult> => {
    const res = await httpClient.post<TestFlowSimulationResult>(
      `${BASE_URL}/autoreply/flows/simulate`,
      input,
    );
    if (!res.payload) {
      throw new Error(res.message || "Simulation step evaluation failed");
    }
    return res.payload;
  },
};
