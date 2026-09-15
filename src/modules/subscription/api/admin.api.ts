import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  AdminPlanItem,
  CreatePlanInput,
  UpdatePlanInput,
  AdminSubscriptionItem,
  GetAdminSubscriptionsParams,
  AdminSubscriptionListResponse,
  SubscriptionStatus,
} from "../types/admin.types";

const ADMIN_BASE = env.NEXT_PUBLIC_IAM_API_URL;

function normalizeAdminPlan(raw: Record<string, unknown>): AdminPlanItem {
  return {
    id: String(raw.id || raw.plan_id || ""),
    name: String(raw.name || raw.plan_name || "Custom Plan"),
    price: Number(raw.price ?? raw.price_monthly ?? 0),
    monthly_message_limit: Number(
      raw.monthly_message_limit ??
        raw.quota_monthly ??
        raw.monthly_quota ??
        1000,
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

function normalizeAdminSubscription(
  raw: Record<string, unknown>,
): AdminSubscriptionItem {
  let planObj: AdminPlanItem | undefined = undefined;
  if (raw.plan && typeof raw.plan === "object") {
    planObj = normalizeAdminPlan(raw.plan as Record<string, unknown>);
  }

  let tenantObj: { id: string; name: string; status?: string } | undefined =
    undefined;
  if (raw.tenant && typeof raw.tenant === "object") {
    const t = raw.tenant as Record<string, unknown>;
    tenantObj = {
      id: String(t.id || raw.tenant_id || ""),
      name: String(t.name || `Tenant ${String(t.id || "").slice(-6)}`),
      status: t.status ? String(t.status) : undefined,
    };
  }

  return {
    id: String(raw.id || ""),
    tenantId: String(raw.tenant_id || raw.tenantId || ""),
    planId: String(raw.plan_id || raw.planId || ""),
    currentMonthUsage: Number(
      raw.current_month_usage ?? raw.currentMonthUsage ?? 0,
    ),
    startedAt: String(
      raw.started_at || raw.startedAt || new Date().toISOString(),
    ),
    expiredAt: String(
      raw.expired_at || raw.expiredAt || new Date().toISOString(),
    ),
    status:
      (String(raw.status || "ACTIVE").toUpperCase() as SubscriptionStatus) ||
      "ACTIVE",
    plan: planObj,
    tenant: tenantObj,
    createdAt: String(
      raw.created_at || raw.createdAt || new Date().toISOString(),
    ),
    updatedAt: String(
      raw.updated_at || raw.updatedAt || new Date().toISOString(),
    ),
  };
}

export const subscriptionAdminApi = {
  getAdminPlans: async (signal?: AbortSignal): Promise<AdminPlanItem[]> => {
    try {
      const res = await httpClient.get<Record<string, unknown>[]>(
        `${ADMIN_BASE}/admin/plans`,
        { signal },
      );
      const data = Array.isArray(res.payload)
        ? res.payload
        : Array.isArray(res)
          ? res
          : [];
      return data.map(normalizeAdminPlan);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return [];
    }
  },

  createAdminPlan: async (payload: CreatePlanInput): Promise<AdminPlanItem> => {
    const res = await httpClient.post<Record<string, unknown>>(
      `${ADMIN_BASE}/admin/plans`,
      payload,
    );
    const data = (res.payload || res) as Record<string, unknown>;
    return normalizeAdminPlan(data);
  },

  updateAdminPlan: async (
    id: string,
    payload: UpdatePlanInput,
  ): Promise<AdminPlanItem> => {
    const res = await httpClient.put<Record<string, unknown>>(
      `${ADMIN_BASE}/admin/plans/${id}`,
      payload,
    );
    const data = (res.payload || res) as Record<string, unknown>;
    return normalizeAdminPlan(data);
  },

  deleteAdminPlan: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete(`${ADMIN_BASE}/admin/plans/${id}`);
    return {
      success: res.success,
      message: res.message || "Paket langganan berhasil dihapus",
    };
  },

  getAdminSubscriptions: async (
    params?: GetAdminSubscriptionsParams,
    signal?: AbortSignal,
  ): Promise<AdminSubscriptionListResponse> => {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 15;
      const query = new URLSearchParams();
      query.set("page", String(page));
      query.set("page_size", String(pageSize));
      if (params?.search && params.search.trim()) {
        query.set("search", params.search.trim());
      }
      if (params?.status && params.status !== "ALL") {
        query.set("status", params.status);
      }
      if (params?.planId && params.planId !== "ALL") {
        query.set("plan_id", params.planId);
      }
      if (params?.tenantId) {
        query.set("tenant_id", params.tenantId);
      }

      const res = await httpClient.get<Record<string, unknown>[]>(
        `${ADMIN_BASE}/admin/subscriptions?${query.toString()}`,
        { signal },
      );

      const rawSubs = Array.isArray(res.payload) ? res.payload : [];
      const subscriptions = rawSubs.map(normalizeAdminSubscription);

      const addInfo = res.additional_info as
        { total?: number; page?: number; size?: number } | undefined;
      const total =
        typeof addInfo?.total === "number"
          ? addInfo.total
          : subscriptions.length;
      const resPage = typeof addInfo?.page === "number" ? addInfo.page : page;
      const resSize =
        typeof addInfo?.size === "number" ? addInfo.size : pageSize;

      return {
        subscriptions,
        total,
        page: resPage,
        pageSize: resSize,
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return {
        subscriptions: [],
        total: 0,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 15,
      };
    }
  },

  expireAdminSubscription: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.put(
      `${ADMIN_BASE}/admin/subscriptions/${id}/expire`,
      {
        status: "EXPIRED",
      },
    );
    return {
      success: res.success,
      message:
        res.message || "Langganan berhasil diubah statusnya menjadi EXPIRED",
    };
  },
};

export default subscriptionAdminApi;
