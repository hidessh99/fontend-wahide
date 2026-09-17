import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  AdminDeviceItem,
  GetAdminDevicesParams,
  AdminDeviceListResponse,
} from "../types/admin.types";

const ADMIN_BASE = env.NEXT_PUBLIC_IAM_API_URL;

function normalizeAdminDevice(raw: Record<string, unknown>): AdminDeviceItem {
  return {
    id: String(raw.id || ""),
    tenantId: String(raw.tenant_id || raw.tenantId || ""),
    jid: String(raw.jid || raw.j_id || raw.phone || ""),
    pushName: String(
      raw.push_name || raw.pushName || raw.name || "WhatsApp Device",
    ),
    status: String(raw.status || "OFFLINE").toUpperCase(),
    trustScore: Number(raw.trust_score ?? raw.trustScore ?? 10),
    warmupDay: Number(raw.warmup_day ?? raw.warmupDay ?? 1),
    dailySentCount: Number(raw.daily_sent_count ?? raw.dailySentCount ?? 0),
    lastSeenAt:
      raw.last_seen_at || raw.lastSeenAt
        ? String(raw.last_seen_at || raw.lastSeenAt)
        : undefined,
    createdAt: String(
      raw.created_at || raw.createdAt || new Date().toISOString(),
    ),
    updatedAt: String(
      raw.updated_at || raw.updatedAt || new Date().toISOString(),
    ),
  };
}


export const whatsappAdminApi = {
  getAdminDevices: async (
    params?: GetAdminDevicesParams,
    signal?: AbortSignal,
  ): Promise<AdminDeviceListResponse> => {
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
      if (params?.tenantId) {
        query.set("tenant_id", params.tenantId);
      }

      const res = await httpClient.get<Record<string, unknown>[]>(
        `${ADMIN_BASE}/admin/devices?${query.toString()}`,
        { signal },
      );

      const rawDevices = Array.isArray(res.payload) ? res.payload : [];
      const devices = rawDevices.map(normalizeAdminDevice);

      const addInfo = res.additional_info as
        { total?: number; page?: number; size?: number } | undefined;
      const total =
        typeof addInfo?.total === "number" ? addInfo.total : devices.length;
      const resPage = typeof addInfo?.page === "number" ? addInfo.page : page;
      const resSize =
        typeof addInfo?.size === "number" ? addInfo.size : pageSize;

      return {
        devices,
        total,
        page: resPage,
        pageSize: resSize,
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return {
        devices: [],
        total: 0,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 15,
      };
    }
  },

  deleteAdminDevice: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete(`${ADMIN_BASE}/admin/devices/${id}`);
    return {
      success: res.success,
      message: res.message || "Perangkat WhatsApp berhasil dihapus",
    };
  },
};

export default whatsappAdminApi;
