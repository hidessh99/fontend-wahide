// ==============================================================================
// Wahide Frontend - Flow Submission API Client
// Standard REST API communication for Lead Submissions & Form Captures
// ==============================================================================

import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  FlowSubmission,
  ListSubmissionsQuery,
} from "../types/submission.types";

const BASE_URL = env.NEXT_PUBLIC_API_BASE_URL;

export interface ListSubmissionsResponse {
  items: FlowSubmission[];
  total: number;
  page: number;
  limit: number;
}

export const submissionApi = {
  getSubmissions: async (
    query?: ListSubmissionsQuery,
  ): Promise<ListSubmissionsResponse> => {
    try {
      const page = query?.page ?? 1;
      const limit = query?.limit ?? 15;
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (query?.flow_id) params.set("flow_id", query.flow_id);
      if (query?.device_id) params.set("device_id", query.device_id);
      if (query?.channel_type) params.set("channel_type", query.channel_type);
      if (query?.search) params.set("search", query.search);
      if (query?.status) params.set("status", query.status);

      const res = await httpClient.get<FlowSubmission[]>(
        `${BASE_URL}/autoreply/submissions?${params.toString()}`,
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
      return {
        items: [],
        total: 0,
        page: query?.page ?? 1,
        limit: query?.limit ?? 15,
      };
    }
  },

  getSubmissionById: async (id: string): Promise<FlowSubmission | null> => {
    try {
      const res = await httpClient.get<FlowSubmission>(
        `${BASE_URL}/autoreply/submissions/${id}`,
      );
      return res.payload || null;
    } catch {
      return null;
    }
  },

  deleteSubmission: async (id: string): Promise<boolean> => {
    const res = await httpClient.delete(
      `${BASE_URL}/autoreply/submissions/${id}`,
    );
    return res.success;
  },
};
