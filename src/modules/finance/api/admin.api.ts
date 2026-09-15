import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  AdminBillingItem,
  GetAdminBillingsParams,
  AdminBillingListResponse,
  UpdateBillingStatusInput,
  BillingStatus,
  AdminBillingUser,
} from "../types/admin.types";

const ADMIN_BASE = env.NEXT_PUBLIC_IAM_API_URL;

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
    status:
      (String(raw.status || "PENDING").toUpperCase() as BillingStatus) ||
      "PENDING",
    invoiceUrl: raw.invoice_url ? String(raw.invoice_url) : undefined,
    createdAt: String(
      raw.created_at || raw.createdAt || new Date().toISOString(),
    ),
    updatedAt: String(
      raw.updated_at || raw.updatedAt || new Date().toISOString(),
    ),
    user: userObj,
  };
}

export const financeAdminApi = {
  getAdminBillings: async (
    params?: GetAdminBillingsParams,
    signal?: AbortSignal,
  ): Promise<AdminBillingListResponse> => {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 10;
      const query = new URLSearchParams();
      query.set("page", String(page));
      query.set("page_size", String(pageSize));
      if (params?.search && params.search.trim()) {
        query.set("search", params.search.trim());
      }
      if (params?.status && params.status !== "ALL") {
        query.set("status", params.status);
      }
      if (params?.userId) {
        query.set("user_id", params.userId);
      }

      const res = await httpClient.get<Record<string, unknown>[]>(
        `${ADMIN_BASE}/admin/billings?${query.toString()}`,
        { signal },
      );

      const rawBillings = Array.isArray(res.payload) ? res.payload : [];
      const billings = rawBillings.map(normalizeAdminBilling);

      const addInfo = res.additional_info as
        { total?: number; page?: number; size?: number } | undefined;
      const total =
        typeof addInfo?.total === "number" ? addInfo.total : billings.length;
      const resPage = typeof addInfo?.page === "number" ? addInfo.page : page;
      const resSize =
        typeof addInfo?.size === "number" ? addInfo.size : pageSize;

      return {
        billings,
        total,
        page: resPage,
        pageSize: resSize,
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return {
        billings: [],
        total: 0,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10,
      };
    }
  },

  updateAdminBillingStatus: async (
    id: string,
    payload: UpdateBillingStatusInput,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.put(
      `${ADMIN_BASE}/admin/billings/${id}/status`,
      payload,
    );
    return {
      success: res.success,
      message: res.message || "Status transaksi berhasil diperbarui",
    };
  },

  deleteAdminBilling: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete(`${ADMIN_BASE}/admin/billings/${id}`);
    return {
      success: res.success,
      message: res.message || "Riwayat transaksi berhasil dihapus",
    };
  },
};

export default financeAdminApi;
