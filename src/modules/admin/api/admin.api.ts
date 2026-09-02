import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { generateSecureRandomString } from "@/lib/utils";
import {
  AdminMetrics,
  UserItem,
  AdjustBalanceInput,
  UpdateUserInput,
  GetUsersParams,
  UserListResponse,
  UserActivityItem,
  GetUserActivitiesParams,
  UserActivityListResponse,
  AdminPlanItem,
  CreatePlanInput,
  UpdatePlanInput,
  AdminBillingItem,
  GetAdminBillingsParams,
  AdminBillingListResponse,
  UpdateBillingStatusInput,
  BillingStatus,
  AdminBillingUser,
  AdminQueueItem,
  GetAdminQueueParams,
  AdminQueueListResponse,
  BroadcastToAllInput,
  BroadcastToUsersInput,
  CreateEmailQueueInput,
  QueueStatus,
} from "../types/admin.types";
import { AdminDashboardStats } from "@/modules/iam/types/dashboard.types";

const ADMIN_BASE = env.NEXT_PUBLIC_IAM_API_URL;

export const DEFAULT_USERS: UserItem[] = [
  {
    id: "01M1BT8E9NFC1TQQS3G7ZSV8QQ",
    name: "Budi Santoso",
    email: "budi@tokoonline.com",
    phone: "081234567890",
    phoneNumber: "081234567890",
    role: "SELLER",
    roleName: "SELLER",
    planName: "Professional",
    quotaRemaining: 18450,
    depositBalance: 250000,
    balance: 250000,
    status: "ACTIVE",
    isActive: true,
    createdAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "01M1BT8E9NFC1TQQS3G7PDTRHA",
    name: "Siti Rahmawati",
    email: "siti@agenproperti.id",
    phone: "085712345678",
    phoneNumber: "085712345678",
    role: "SELLER",
    roleName: "SELLER",
    planName: "Enterprise Cluster",
    quotaRemaining: 89200,
    depositBalance: 1200000,
    balance: 1200000,
    status: "ACTIVE",
    isActive: true,
    createdAt: "2026-08-10T14:30:00Z",
  },
  {
    id: "01M1BT8E9NFC1TQQS3G7ADMIN0",
    name: "Admin Platform",
    email: "superadmin@wahide.com",
    phone: "081198765432",
    phoneNumber: "081198765432",
    role: "SUPER_ADMIN",
    roleName: "SUPER_ADMIN",
    planName: "Enterprise Cluster",
    quotaRemaining: 999999,
    depositBalance: 99999999,
    balance: 99999999,
    status: "ACTIVE",
    isActive: true,
    createdAt: "2026-07-01T00:00:00Z",
  },
];

function normalizeUser(raw: Record<string, unknown>): UserItem {
  const roleName = String(raw.role_name || raw.roleName || raw.role || "USER").toUpperCase();
  const isActive = raw.is_active !== undefined ? Boolean(raw.is_active) : raw.isActive !== undefined ? Boolean(raw.isActive) : true;
  const balance = Number(raw.balance ?? raw.depositBalance ?? raw.deposit_balance ?? 0);
  const quotaRemaining = Number(raw.quotaRemaining ?? raw.quota_remaining ?? 1000);
  const phone = String(raw.phone_number || raw.phoneNumber || raw.phone || "");

  return {
    id: String(raw.id || ""),
    name: String(raw.name || ""),
    email: String(raw.email || ""),
    phone: phone,
    phoneNumber: phone,
    role: roleName,
    roleName: roleName,
    planName: String(raw.planName || raw.plan_name || (roleName === "SUPER_ADMIN" ? "Enterprise Cluster" : "Professional")),
    quotaRemaining: quotaRemaining,
    depositBalance: balance,
    balance: balance,
    status: isActive ? "ACTIVE" : "SUSPENDED",
    isActive: isActive,
    createdAt: String(raw.created_at || raw.createdAt || new Date().toISOString()),
  };
}

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

  getUsers: async (params?: GetUsersParams): Promise<UserListResponse> => {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 10;
      const query = new URLSearchParams();
      query.set("page", String(page));
      query.set("page_size", String(pageSize));
      if (params?.search && params.search.trim()) {
        query.set("search", params.search.trim());
      }
      if (params?.role && params.role !== "ALL") {
        query.set("role", params.role);
      }
      if (params?.status && params.status !== "ALL") {
        query.set("status", params.status);
      }

      const res = await httpClient.get<Record<string, unknown>[]>(
        `${ADMIN_BASE}/admin/users?${query.toString()}`
      );

      const rawUsers = Array.isArray(res.payload) ? res.payload : [];
      const users = rawUsers.map(normalizeUser);
      const addInfo = res.additional_info as { total?: number; page?: number; size?: number } | undefined;
      const total = typeof addInfo?.total === "number" ? addInfo.total : users.length;
      const resPage = typeof addInfo?.page === "number" ? addInfo.page : page;
      const resSize = typeof addInfo?.size === "number" ? addInfo.size : pageSize;

      return {
        users: users.length > 0 ? users : (params?.search ? [] : DEFAULT_USERS),
        total: users.length > 0 ? total : (params?.search ? 0 : DEFAULT_USERS.length),
        page: resPage,
        pageSize: resSize,
      };
    } catch {
      return {
        users: DEFAULT_USERS,
        total: DEFAULT_USERS.length,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10,
      };
    }
  },

  updateUser: async (
    userId: string,
    payload: UpdateUserInput
  ): Promise<{ success: boolean; message: string }> => {
    const body: Record<string, unknown> = {};
    if (payload.name) body.name = payload.name;
    if (payload.email) body.email = payload.email;
    if (payload.phoneNumber || payload.phone) body.phone_number = payload.phoneNumber || payload.phone;
    if (payload.password) body.password = payload.password;
    if (payload.isActive !== undefined) body.is_active = payload.isActive;
    if (payload.role) body.role_id = payload.role;

    const res = await httpClient.put<{ success: boolean; message: string }>(
      `${ADMIN_BASE}/admin/users/${userId}`,
      body
    );
    return {
      success: res.success,
      message: res.message || "Data pengguna berhasil diperbarui",
    };
  },

  adjustUserBalance: async (
    payload: AdjustBalanceInput
  ): Promise<{ success: boolean; message: string }> => {
    const endpoint =
      payload.type === "REDUCE"
        ? `${ADMIN_BASE}/admin/users/reduce-balance`
        : `${ADMIN_BASE}/admin/users/add-balance`;

    const idempotencyKey =
      payload.idempotencyKey || generateSecureRandomString("adm-bal-", 16);

    const res = await httpClient.post<{ success: boolean; message: string }>(
      endpoint,
      {
        user_id: payload.userId,
        amount: payload.amount,
      },
      {
        idempotencyKey: idempotencyKey,
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      }
    );
    return {
      success: res.success,
      message:
        res.message ||
        (payload.type === "REDUCE"
          ? "Saldo berhasil dikurangi"
          : "Saldo berhasil ditambahkan"),
    };
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

  getAdminPlans: async (): Promise<AdminPlanItem[]> => {
    try {
      const res = await httpClient.get<Record<string, unknown>[]>(`${ADMIN_BASE}/plans`);
      const rawList = Array.isArray(res.payload) ? res.payload : [];
      if (rawList.length > 0) {
        return rawList.map(normalizeAdminPlan);
      }
      return [
        {
          id: "01M1PLAN01STARTER000000000",
          name: "Starter",
          price: 0,
          monthly_message_limit: 1500,
          max_devices: 1,
          max_agents: 0,
          has_watermark: true,
          watermark_text: "\n\n_Sent via Wahide WhatsApp Gateway_",
          allow_attachment: false,
          allow_campaign: true,
          allow_autoreply: true,
          allow_schedule: false,
        },
        {
          id: "01M1PLAN02PRO00000000000000",
          name: "Professional",
          price: 50000,
          monthly_message_limit: 25000,
          max_devices: 5,
          max_agents: 2,
          has_watermark: false,
          watermark_text: "",
          allow_attachment: true,
          allow_campaign: true,
          allow_autoreply: true,
          allow_schedule: true,
        },
        {
          id: "01M1PLAN03ENTERPRISE00000000",
          name: "Enterprise Cluster",
          price: 150000,
          monthly_message_limit: 100000,
          max_devices: 15,
          max_agents: 10,
          has_watermark: false,
          watermark_text: "",
          allow_attachment: true,
          allow_campaign: true,
          allow_autoreply: true,
          allow_schedule: true,
        },
      ];
    } catch {
      return [];
    }
  },

  createAdminPlan: async (payload: CreatePlanInput): Promise<AdminPlanItem> => {
    const res = await httpClient.post<Record<string, unknown>>(`${ADMIN_BASE}/admin/plans`, payload);
    if (!res.payload) {
      throw new Error(res.message || "Gagal membuat paket langganan");
    }
    return normalizeAdminPlan(res.payload);
  },

  updateAdminPlan: async (id: string, payload: UpdatePlanInput): Promise<AdminPlanItem> => {
    const res = await httpClient.put<Record<string, unknown>>(`${ADMIN_BASE}/admin/plans/${id}`, payload);
    if (!res.payload) {
      throw new Error(res.message || "Gagal memperbarui paket langganan");
    }
    return normalizeAdminPlan(res.payload);
  },

  deleteAdminPlan: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete(`${ADMIN_BASE}/admin/plans/${id}`);
    return { success: res.success, message: res.message || "Paket berhasil dihapus" };
  },

  getAdminBillings: async (params?: GetAdminBillingsParams): Promise<AdminBillingListResponse> => {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 10;
      const query = new URLSearchParams();
      query.set("page", String(page));
      query.set("page_size", String(pageSize));
      if (params?.search && params.search.trim()) {
        query.set("search", params.search.trim());
      }
      if (params?.userId) {
        query.set("user_id", params.userId);
      }

      const res = await httpClient.get<Record<string, unknown>[]>(
        `${ADMIN_BASE}/admin/billing?${query.toString()}`
      );

      const rawBillings = Array.isArray(res.payload) ? res.payload : [];
      let billings = rawBillings.map(normalizeAdminBilling);

      if (params?.status && params.status !== "ALL") {
        billings = billings.filter((b) => b.status === params.status);
      }

      const addInfo = res.additional_info as { total?: number; page?: number; size?: number } | undefined;
      const total = typeof addInfo?.total === "number" ? addInfo.total : billings.length;
      const resPage = typeof addInfo?.page === "number" ? addInfo.page : page;
      const resSize = typeof addInfo?.size === "number" ? addInfo.size : pageSize;

      return {
        billings,
        total,
        page: resPage,
        pageSize: resSize,
      };
    } catch {
      return {
        billings: [],
        total: 0,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10,
      };
    }
  },

  getAdminBillingById: async (id: string): Promise<AdminBillingItem> => {
    const res = await httpClient.get<Record<string, unknown>>(`${ADMIN_BASE}/admin/billing/${id}`);
    if (!res.payload) {
      throw new Error(res.message || "Data transaksi tidak ditemukan");
    }
    return normalizeAdminBilling(res.payload);
  },

  updateAdminBillingStatus: async (
    id: string,
    input: UpdateBillingStatusInput
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.put<Record<string, unknown>>(`${ADMIN_BASE}/admin/billing/${id}`, {
      status: input.status,
      amount: input.amount,
      method: input.method,
    });
    return {
      success: res.success,
      message: res.message || `Status transaksi berhasil diubah menjadi ${input.status}`,
    };
  },

  deleteAdminBilling: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete(`${ADMIN_BASE}/admin/billing/${id}`);
    return { success: res.success, message: res.message || "Data billing berhasil dihapus" };
  },

  getAdminQueues: async (params?: GetAdminQueueParams): Promise<AdminQueueListResponse> => {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 10;
      const query = new URLSearchParams();
      query.set("page", String(page));
      query.set("page_size", String(pageSize));
      if (params?.search && params.search.trim()) {
        query.set("search", params.search.trim());
      }

      const res = await httpClient.get<Record<string, unknown>[]>(
        `${ADMIN_BASE}/admin/queue?${query.toString()}`
      );

      const rawQueues = Array.isArray(res.payload) ? res.payload : [];
      let queues = rawQueues.map(normalizeAdminQueue);

      if (params?.status && params.status !== "ALL") {
        queues = queues.filter((q) => q.status === params.status);
      }

      const addInfo = res.additional_info as { total?: number; page?: number; size?: number } | undefined;
      const total = typeof addInfo?.total === "number" ? addInfo.total : queues.length;
      const resPage = typeof addInfo?.page === "number" ? addInfo.page : page;
      const resSize = typeof addInfo?.size === "number" ? addInfo.size : pageSize;

      return {
        queues,
        total,
        page: resPage,
        pageSize: resSize,
      };
    } catch {
      return {
        queues: [],
        total: 0,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10,
      };
    }
  },

  deleteAdminQueue: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete(`${ADMIN_BASE}/admin/queue/${id}`);
    return { success: res.success, message: res.message || "Antrean berhasil dihapus" };
  },

  broadcastToAllUsers: async (input: BroadcastToAllInput): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post<Record<string, unknown>>(`${ADMIN_BASE}/admin/broadcast/all`, {
      subject: input.subject,
      message: input.message,
    });
    return {
      success: res.success,
      message: res.message || "Siaran email berhasil dijadwalkan ke seluruh pengguna aktif",
    };
  },

  broadcastToSpecificUsers: async (
    input: BroadcastToUsersInput
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post<Record<string, unknown>>(`${ADMIN_BASE}/admin/broadcast/users`, {
      user_ids: input.userIds,
      subject: input.subject,
      message: input.message,
    });
    return {
      success: res.success,
      message: res.message || "Siaran email berhasil dijadwalkan ke target pengguna",
    };
  },

  createDirectEmailQueue: async (
    input: CreateEmailQueueInput
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post<Record<string, unknown>>(`${ADMIN_BASE}/admin/queue`, {
      user_id: "CUSTOM",
      task_type: input.taskType || "EMAIL_BROADCAST",
      priority: input.priority || 10,
      payload: {
        email: input.email,
        name: input.name || "Pengguna",
        subject: input.subject,
        body: input.message,
        message: input.message,
      },
    });
    return {
      success: res.success,
      message: res.message || `Email berhasil dimasukkan ke antrean worker untuk ${input.email}`,
    };
  },
};

function normalizeAdminPlan(raw: Record<string, unknown>): AdminPlanItem {
  return {
    id: String(raw.id || raw.plan_id || ""),
    name: String(raw.name || raw.plan_name || "Custom Plan"),
    price: Number(raw.price ?? raw.price_monthly ?? 0),
    monthly_message_limit: Number(
      raw.monthly_message_limit ?? raw.quota_monthly ?? raw.monthly_quota ?? 1000
    ),
    max_devices: Number(raw.max_devices ?? raw.max_device_slots ?? 1),
    max_agents: Number(raw.max_agents ?? 0),
    has_watermark: Boolean(raw.has_watermark ?? false),
    watermark_text: String(raw.watermark_text ?? ""),
    allow_attachment: Boolean(raw.allow_attachment ?? false),
    allow_campaign: Boolean(raw.allow_campaign ?? true),
    allow_autoreply: Boolean(raw.allow_autoreply ?? true),
    allow_schedule: Boolean(raw.allow_schedule ?? false),
    created_at: raw.created_at ? String(raw.created_at) : undefined,
    updated_at: raw.updated_at ? String(raw.updated_at) : undefined,
  };
}

function normalizeAdminBilling(raw: Record<string, unknown>): AdminBillingItem {
  let userObj: AdminBillingUser | undefined = undefined;
  if (raw.user && typeof raw.user === "object") {
    const u = raw.user as Record<string, unknown>;
    userObj = {
      id: String(u.id || raw.user_id || ""),
      name: String(u.name || "Pengguna"),
      email: String(u.email || "-"),
      phoneNumber: u.phone_number ? String(u.phone_number) : undefined,
    };
  } else if (raw.user_id) {
    userObj = {
      id: String(raw.user_id),
      name: `User ${String(raw.user_id).slice(-6)}`,
      email: "-",
    };
  }

  return {
    id: String(raw.id || raw.billing_id || ""),
    userId: String(raw.user_id || raw.userId || ""),
    amount: Number(raw.amount ?? 0),
    method: String(raw.method || "MANUAL_TRANSFER"),
    status: (String(raw.status || "PENDING").toUpperCase() as BillingStatus) || "PENDING",
    invoiceUrl: raw.invoice_url ? String(raw.invoice_url) : undefined,
    createdAt: String(raw.created_at || raw.createdAt || new Date().toISOString()),
    updatedAt: String(raw.updated_at || raw.updatedAt || new Date().toISOString()),
    user: userObj,
  };
}

function normalizeAdminQueue(raw: Record<string, unknown>): AdminQueueItem {
  const payload =
    raw.payload && typeof raw.payload === "object"
      ? (raw.payload as Record<string, unknown>)
      : {};
  let targetEmail = "";
  let targetName = "";

  if (raw.user && typeof raw.user === "object") {
    const u = raw.user as Record<string, unknown>;
    targetEmail = String(u.email || "");
    targetName = String(u.name || "");
  }
  if (!targetEmail && payload.email) {
    targetEmail = String(payload.email);
  }
  if (!targetName && payload.name) {
    targetName = String(payload.name);
  }

  return {
    id: String(raw.id || ""),
    userId: String(raw.user_id || raw.userId || ""),
    taskType: String(raw.task_type || raw.taskType || "EMAIL_GENERIC"),
    payload,
    priority: Number(raw.priority ?? 0),
    status: (String(raw.status || "PENDING").toUpperCase() as QueueStatus) || "PENDING",
    scheduledAt: raw.scheduled_at ? String(raw.scheduled_at) : undefined,
    startedAt: raw.started_at ? String(raw.started_at) : undefined,
    finishedAt: raw.finished_at ? String(raw.finished_at) : undefined,
    attempts: Number(raw.attempts ?? 0),
    maxAttempts: Number(raw.max_attempts ?? 3),
    lastError: raw.last_error ? String(raw.last_error) : undefined,
    createdAt: String(raw.created_at || new Date().toISOString()),
    updatedAt: String(raw.updated_at || new Date().toISOString()),
    targetEmail: targetEmail || "-",
    targetName: targetName || undefined,
  };
}

