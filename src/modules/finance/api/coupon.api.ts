import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  Voucher,
  CreateVoucherInput,
  UpdateVoucherInput,
  ValidateVoucherInput,
  ValidateVoucherResult,
  GetAdminVouchersParams,
  AdminVoucherListResponse,
  DiscountType,
} from "../types/coupon.types";

const API_BASE =
  env.NEXT_PUBLIC_FINANCE_API_URL || env.NEXT_PUBLIC_API_BASE_URL;

export function normalizeVoucher(raw: Record<string, unknown>): Voucher {
  return {
    id: String(raw.id || ""),
    userId: String(raw.user_id || raw.userId || ""),
    code: String(raw.code || "").toUpperCase(),
    name: String(raw.name || ""),
    discountType: (String(raw.discount_type || raw.discountType || "PERCENTAGE").toUpperCase()) as DiscountType,
    discountValue: Number(raw.discount_value ?? raw.discountValue ?? 0),
    maxDiscountAmount: Number(raw.max_discount_amount ?? raw.maxDiscountAmount ?? 0),
    minPurchaseAmount: Number(raw.min_purchase_amount ?? raw.minPurchaseAmount ?? 0),
    currentUsage: Number(raw.current_usage ?? raw.currentUsage ?? 0),
    maxUsage: Number(raw.max_usage ?? raw.maxUsage ?? 0),
    startDate: String(raw.start_date || raw.startDate || ""),
    endDate: String(raw.end_date || raw.endDate || ""),
    isActive: Boolean(raw.is_active ?? raw.isActive ?? true),
    applicableProduct: String(raw.applicable_product || raw.applicableProduct || "ALL"),
    createdAt: String(raw.created_at || raw.createdAt || new Date().toISOString()),
    updatedAt: String(raw.updated_at || raw.updatedAt || new Date().toISOString()),
  };
}

/**
 * Public & Seller Coupon API
 */
export const couponApi = {
  validate: async (
    input: ValidateVoucherInput,
    signal?: AbortSignal,
  ): Promise<ValidateVoucherResult> => {
    const res = await httpClient.post<{
      voucher: Record<string, unknown>;
      discount_amount: number;
    }>(
      `${API_BASE}/vouchers/validate`,
      {
        code: input.code.trim().toUpperCase(),
        purchase_amount: input.purchase_amount,
        applicable_product: input.applicable_product || "ALL",
      },
      { signal },
    );

    const payload = res.payload as
      | { voucher?: Record<string, unknown>; discount_amount?: number }
      | undefined;

    if (!payload || !payload.voucher) {
      throw new Error("Invalid voucher response from server");
    }

    return {
      voucher: normalizeVoucher(payload.voucher),
      discount_amount: Number(payload.discount_amount ?? 0),
    };
  },
};

/**
 * Admin Coupon Management API
 */
export const couponAdminApi = {
  getList: async (
    params?: GetAdminVouchersParams,
    signal?: AbortSignal,
  ): Promise<AdminVoucherListResponse> => {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const query = new URLSearchParams();
    query.set("page", String(page));
    query.set("page_size", String(pageSize));
    if (params?.search && params.search.trim()) {
      query.set("search", params.search.trim());
    }

    const res = await httpClient.get<Record<string, unknown>[]>(
      `${API_BASE}/admin/vouchers?${query.toString()}`,
      { signal },
    );

    const rawItems = Array.isArray(res.payload) ? res.payload : [];
    const data = rawItems.map(normalizeVoucher);

    const addInfo = res.additional_info as
      | { total?: number; page?: number; size?: number }
      | undefined;
    const pagination = res.pagination;

    const total =
      typeof pagination?.total_items === "number"
        ? pagination.total_items
        : typeof addInfo?.total === "number"
          ? addInfo.total
          : data.length;

    const totalPages =
      typeof pagination?.total_pages === "number"
        ? pagination.total_pages
        : Math.ceil(total / pageSize) || 1;

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
  },

  getById: async (id: string, signal?: AbortSignal): Promise<Voucher> => {
    const res = await httpClient.get<Record<string, unknown>>(
      `${API_BASE}/admin/vouchers/${id}`,
      { signal },
    );
    return normalizeVoucher(res.payload as Record<string, unknown>);
  },

  create: async (input: CreateVoucherInput): Promise<void> => {
    await httpClient.post(`${API_BASE}/admin/vouchers`, {
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      discount_type: input.discountType,
      discount_value: Number(input.discountValue),
      max_discount_amount: Number(input.maxDiscountAmount ?? 0),
      min_purchase_amount: Number(input.minPurchaseAmount ?? 0),
      max_usage: Number(input.maxUsage ?? 0),
      start_date: input.startDate,
      end_date: input.endDate,
      is_active: input.isActive ?? true,
      applicable_product: input.applicableProduct || "ALL",
    });
  },

  update: async (id: string, input: UpdateVoucherInput): Promise<void> => {
    await httpClient.put(`${API_BASE}/admin/vouchers/${id}`, {
      code: input.code ? input.code.trim().toUpperCase() : undefined,
      name: input.name ? input.name.trim() : undefined,
      discount_type: input.discountType,
      discount_value: input.discountValue !== undefined ? Number(input.discountValue) : undefined,
      max_discount_amount: input.maxDiscountAmount !== undefined ? Number(input.maxDiscountAmount) : undefined,
      min_purchase_amount: input.minPurchaseAmount !== undefined ? Number(input.minPurchaseAmount) : undefined,
      max_usage: input.maxUsage !== undefined ? Number(input.maxUsage) : undefined,
      start_date: input.startDate,
      end_date: input.endDate,
      is_active: input.isActive,
      applicable_product: input.applicableProduct,
    });
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`${API_BASE}/admin/vouchers/${id}`);
  },
};
