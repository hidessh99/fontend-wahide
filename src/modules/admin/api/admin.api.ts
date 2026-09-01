import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  AdminMetrics,
  UserItem,
  AdjustBalanceInput,
  UserActivityItem,
  GetUserActivitiesParams,
  UserActivityListResponse,
} from "../types/admin.types";
import { AdminDashboardStats } from "@/modules/iam/types/dashboard.types";

const ADMIN_BASE = env.NEXT_PUBLIC_IAM_API_URL;


export const DEFAULT_USERS: UserItem[] = [
  {
    id: "usr_01",
    name: "Budi Santoso",
    email: "budi@tokoonline.com",
    role: "USER",
    planName: "Professional",
    quotaRemaining: 18450,
    depositBalance: 250000,
    status: "ACTIVE",
    createdAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "usr_02",
    name: "Siti Rahmawati",
    email: "siti@agenproperti.id",
    role: "USER",
    planName: "Enterprise Cluster",
    quotaRemaining: 89200,
    depositBalance: 1200000,
    status: "ACTIVE",
    createdAt: "2026-08-10T14:30:00Z",
  },
  {
    id: "usr_03",
    name: "Admin Platform",
    email: "superadmin@wahide.com",
    role: "SUPER_ADMIN",
    planName: "Enterprise Cluster",
    quotaRemaining: 999999,
    depositBalance: 99999999,
    status: "ACTIVE",
    createdAt: "2026-07-01T00:00:00Z",
  },
];

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

export const adminApi = {
  getMetrics: async (): Promise<AdminMetrics> => {
    try {
      const res = await httpClient.get<AdminMetrics>(`${ADMIN_BASE}/admin/overview`);
      return (
        res.payload || {
          mrr: 48750000,
          totalUsers: 142,
          activeDevices: 68,
          redisQueueMessages: 1240,
          clusterHealth: "HEALTHY",
        }
      );
    } catch {
      return {
        mrr: 48750000,
        totalUsers: 142,
        activeDevices: 68,
        redisQueueMessages: 1240,
        clusterHealth: "HEALTHY",
      };
    }
  },

  getUsers: async (): Promise<UserItem[]> => {
    try {
      const res = await httpClient.get<UserItem[]>(`${ADMIN_BASE}/admin/users`);
      return res.payload || DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  },

  adjustUserBalance: async (payload: AdjustBalanceInput): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post(`${ADMIN_BASE}/admin/users/${payload.userId}/adjust`, payload);
    return { success: res.success, message: res.message || "Saldo dan kuota berhasil diperbarui" };
  },

  getAdminDashboardStats: async (): Promise<AdminDashboardStats> => {
    const res = await httpClient.get<AdminDashboardStats>(`${ADMIN_BASE}/admin/dashboard/stats`);
    return (
      res.payload || {
        total_users: 0,
        total_tenants: 0,
        total_devices: 0,
        connected_devices: 0,
        total_campaigns: 0,
        total_messages_sent: 0,
        total_transactions: 0,
        pending_withdrawals: 0,
        active_tickets: 0,
        recent_users: [],
        recent_transactions: [],
        recent_withdrawals: [],
      }
    );
  },

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
      if (params?.userId) {
        query.set("user_id", params.userId);
      }
      if (params?.tenantId) {
        query.set("tenant_id", params.tenantId);
      }

      const res = await httpClient.get<Record<string, unknown>[]>(
        `${ADMIN_BASE}/admin/user-activity?${query.toString()}`
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

  deleteUserActivity: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete(`${ADMIN_BASE}/admin/user-activity/${id}`);
    return { success: res.success, message: res.message || "Aktivitas berhasil dihapus" };
  },
};

