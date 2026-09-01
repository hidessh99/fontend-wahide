import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  UserActivityItem,
  GetUserActivitiesParams,
  UserActivityListResponse,
} from "../types/activity.types";

const IAM_BASE = env.NEXT_PUBLIC_IAM_API_URL;

function normalizeUserActivity(raw: Record<string, unknown>): UserActivityItem {
  const userRaw = (raw.user as Record<string, unknown>) || undefined;
  return {
    id: String(raw.id || ""),
    userId: String(raw.user_id || raw.userId || ""),
    tenantId: raw.tenant_id ? String(raw.tenant_id) : raw.tenantId ? String(raw.tenantId) : undefined,
    activityType: String(raw.activity_type || raw.type || raw.activityType || ""),
    type: String(raw.type || raw.activity_type || raw.activityType || ""),
    description: String(raw.description || ""),
    createdAt: String(raw.created_at || raw.createdAt || ""),
    updatedAt: raw.updated_at ? String(raw.updated_at) : raw.updatedAt ? String(raw.updatedAt) : undefined,
    user: userRaw
      ? {
          id: String(userRaw.id || ""),
          name: String(userRaw.name || ""),
          email: String(userRaw.email || ""),
          roleName: userRaw.role_name ? String(userRaw.role_name) : userRaw.roleName ? String(userRaw.roleName) : undefined,
          phoneNumber: userRaw.phone_number ? String(userRaw.phone_number) : userRaw.phoneNumber ? String(userRaw.phoneNumber) : undefined,
          isActive: Boolean(userRaw.is_active ?? userRaw.isActive ?? true),
        }
      : undefined,
  };
}

export const activityApi = {
  getUserActivities: async (params?: GetUserActivitiesParams): Promise<UserActivityListResponse> => {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 15;
      const query = new URLSearchParams();
      query.set("page", String(page));
      query.set("page_size", String(pageSize));
      if (params?.search && params.search.trim()) {
        query.set("search", params.search.trim());
      }

      const res = await httpClient.get<Record<string, unknown>[]>(
        `${IAM_BASE}/users/activities?${query.toString()}`
      );

      const rawActivities = Array.isArray(res.payload) ? res.payload : [];
      const activities = rawActivities.map(normalizeUserActivity);
      const addInfo = res.additional_info as { total?: number; page?: number; size?: number } | undefined;
      const total = typeof addInfo?.total === "number" ? addInfo.total : activities.length;
      const resPage = typeof addInfo?.page === "number" ? addInfo.page : page;
      const resSize = typeof addInfo?.size === "number" ? addInfo.size : pageSize;

      return {
        activities,
        total,
        page: resPage,
        pageSize: resSize,
      };
    } catch {
      return {
        activities: [],
        total: 0,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 15,
      };
    }
  },
};
