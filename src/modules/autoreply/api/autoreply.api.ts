// ==============================================================================
// Wahide Frontend - Autoreply Rules API Client
// Standard REST API communication for Single-Turn Autoreply Rules
// ==============================================================================

import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  AutoreplyRule,
  CreateRuleInput,
  UpdateRuleInput,
  ListRulesQuery,
} from "../types/autoreply.types";

const BASE_URL = env.NEXT_PUBLIC_API_BASE_URL;

export interface ListRulesResponse {
  items: AutoreplyRule[];
  total: number;
  page: number;
  limit: number;
}

export const autoreplyApi = {
  getRules: async (query?: ListRulesQuery): Promise<ListRulesResponse> => {
    try {
      const page = query?.page ?? 1;
      const limit = query?.limit ?? 10;
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (query?.device_id) params.set("device_id", query.device_id);
      if (query?.channel_type) params.set("channel_type", query.channel_type);

      const res = await httpClient.get<AutoreplyRule[]>(
        `${BASE_URL}/autoreply/rules?${params.toString()}`,
      );

      // Extract pagination total from envelope if available
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
      return {
        items: [],
        total: 0,
        page: query?.page ?? 1,
        limit: query?.limit ?? 10,
      };
    }
  },

  getRuleById: async (id: string): Promise<AutoreplyRule | null> => {
    try {
      const res = await httpClient.get<AutoreplyRule>(
        `${BASE_URL}/autoreply/rules/${id}`,
      );
      return res.payload || null;
    } catch {
      return null;
    }
  },

  createRule: async (input: CreateRuleInput): Promise<AutoreplyRule> => {
    const res = await httpClient.post<AutoreplyRule>(
      `${BASE_URL}/autoreply/rules`,
      input,
    );
    if (!res.payload) {
      throw new Error(res.message || "Failed to create autoreply rule");
    }
    return res.payload;
  },

  updateRule: async (
    id: string,
    input: UpdateRuleInput,
  ): Promise<AutoreplyRule> => {
    const res = await httpClient.put<AutoreplyRule>(
      `${BASE_URL}/autoreply/rules/${id}`,
      input,
    );
    if (!res.payload) {
      throw new Error(res.message || "Failed to update autoreply rule");
    }
    return res.payload;
  },

  deleteRule: async (id: string): Promise<boolean> => {
    const res = await httpClient.delete(`${BASE_URL}/autoreply/rules/${id}`);
    return res.success;
  },

  toggleRule: async (id: string, isActive: boolean): Promise<boolean> => {
    const res = await httpClient.patch(
      `${BASE_URL}/autoreply/rules/${id}/toggle`,
      { is_active: isActive },
    );
    return res.success;
  },
};
