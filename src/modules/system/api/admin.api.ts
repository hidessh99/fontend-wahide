import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  AdminQueueItem,
  GetAdminQueueParams,
  AdminQueueListResponse,
  BroadcastToAllInput,
  BroadcastToUsersInput,
  CreateEmailQueueInput,
  QueueStatus,
} from "../types/admin.types";

const ADMIN_BASE = env.NEXT_PUBLIC_IAM_API_URL;

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
    status:
      (String(raw.status || "PENDING").toUpperCase() as QueueStatus) ||
      "PENDING",
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

export const systemAdminApi = {
  getAdminQueues: async (
    params?: GetAdminQueueParams,
    signal?: AbortSignal,
  ): Promise<AdminQueueListResponse> => {
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
        `${ADMIN_BASE}/admin/queue?${query.toString()}`,
        { signal },
      );

      const rawQueues = Array.isArray(res.payload) ? res.payload : [];
      let queues = rawQueues.map(normalizeAdminQueue);

      if (params?.status && params.status !== "ALL") {
        queues = queues.filter((q) => q.status === params.status);
      }

      const addInfo = res.additional_info as
        { total?: number; page?: number; size?: number } | undefined;
      const total =
        typeof addInfo?.total === "number" ? addInfo.total : queues.length;
      const resPage = typeof addInfo?.page === "number" ? addInfo.page : page;
      const resSize =
        typeof addInfo?.size === "number" ? addInfo.size : pageSize;

      return {
        queues,
        total,
        page: resPage,
        pageSize: resSize,
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return {
        queues: [],
        total: 0,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10,
      };
    }
  },

  deleteAdminQueue: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete(`${ADMIN_BASE}/admin/queue/${id}`);
    return {
      success: res.success,
      message: res.message || "Antrean berhasil dihapus",
    };
  },

  broadcastToAllUsers: async (
    input: BroadcastToAllInput,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post<Record<string, unknown>>(
      `${ADMIN_BASE}/admin/broadcast/all`,
      {
        subject: input.subject,
        message: input.message,
      },
    );
    return {
      success: res.success,
      message:
        res.message ||
        "Siaran email berhasil dijadwalkan ke seluruh pengguna aktif",
    };
  },

  broadcastToSpecificUsers: async (
    input: BroadcastToUsersInput,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post<Record<string, unknown>>(
      `${ADMIN_BASE}/admin/broadcast/users`,
      {
        user_ids: input.userIds,
        subject: input.subject,
        message: input.message,
      },
    );
    return {
      success: res.success,
      message:
        res.message || "Siaran email berhasil dijadwalkan ke target pengguna",
    };
  },

  createDirectEmailQueue: async (
    input: CreateEmailQueueInput,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post<Record<string, unknown>>(
      `${ADMIN_BASE}/admin/queue`,
      {
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
      },
    );
    return {
      success: res.success,
      message:
        res.message ||
        `Email berhasil dimasukkan ke antrean worker untuk ${input.email}`,
    };
  },
};
