import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { AdminMetrics, UserItem, AdjustBalanceInput } from "../types/admin.types";

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
};
