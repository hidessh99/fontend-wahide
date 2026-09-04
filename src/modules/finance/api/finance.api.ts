import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  Invoice,
  TenantBalance,
  CreateTopUpInput,
  InvoiceStatus,
  PaymentMethod,
  GetInvoicesParams,
  InvoiceListResponse,
} from "../types/finance.types";
import { userApi } from "@/modules/iam/api/user.api";

const BILLING_BASE = env.NEXT_PUBLIC_FINANCE_API_URL || env.NEXT_PUBLIC_API_BASE_URL;

export const DEFAULT_INVOICES: Invoice[] = [];

export function normalizeInvoice(raw: Record<string, unknown>): Invoice {
  const statusStr = String(raw.status || "PENDING").toUpperCase();
  const status: InvoiceStatus =
    statusStr === "PAID" || statusStr === "SUCCESS" || statusStr === "COMPLETED"
      ? "PAID"
      : statusStr === "EXPIRED" || statusStr === "CANCELLED"
        ? "EXPIRED"
        : "PENDING";

  const amount = Number(raw.amount ?? raw.total_price ?? raw.gross_amount ?? raw.price ?? 0);
  const invoiceNumber = String(
    raw.invoiceNumber ||
      raw.invoice_number ||
      raw.ref ||
      raw.id ||
      `INV/2026/08/WAH-${Date.now().toString().slice(-4)}`
  );
  const description = String(
    raw.description || raw.title || `Top-Up Saldo Deposit Rp ${amount.toLocaleString("id-ID")}`
  );
  const paymentMethod = String(
    raw.paymentMethod || raw.payment_method || raw.method || "QRIS"
  ) as PaymentMethod;

  const rawUrl =
    raw.checkout_url ||
    raw.checkoutUrl ||
    raw.redirect_url ||
    raw.redirectUrl ||
    raw.payment_url ||
    raw.paymentUrl ||
    raw.invoice_url ||
    raw.invoiceUrl ||
    raw.gateway_url ||
    raw.gatewayUrl ||
    raw.qris_url ||
    raw.qrisUrl ||
    raw.pay_url ||
    raw.payUrl ||
    raw.url;

  const paymentUrl = rawUrl ? String(rawUrl) : undefined;
  const invoiceUrl =
    raw.invoiceUrl || raw.invoice_url ? String(raw.invoiceUrl || raw.invoice_url) : paymentUrl;
  const createdAt = String(raw.createdAt || raw.created_at || new Date().toISOString());
  const paidAt = raw.paidAt || raw.paid_at ? String(raw.paidAt || raw.paid_at) : undefined;

  return {
    id: String(raw.id || invoiceNumber),
    invoiceNumber,
    description,
    amount,
    status,
    paymentMethod,
    paymentUrl,
    invoiceUrl,
    paidAt,
    createdAt,
  };
}

export function normalizeBalance(raw: Record<string, unknown> | null | undefined): TenantBalance {
  if (!raw) {
    return {
      amount: 0,
      currency: "IDR",
      lastTopUpAt: undefined,
    };
  }
  return {
    amount: Number(raw.amount ?? raw.balance ?? raw.saldo ?? 0),
    currency: String(raw.currency || "IDR"),
    lastTopUpAt:
      raw.lastTopUpAt || raw.last_top_up_at
        ? String(raw.lastTopUpAt || raw.last_top_up_at)
        : undefined,
  };
}

export const financeApi = {
  getBalance: async (signal?: AbortSignal): Promise<TenantBalance> => {
    try {
      const userProfile = await userApi.getProfile(signal);
      return {
        amount: Number(userProfile.balance ?? 0),
        currency: "IDR",
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return normalizeBalance(null);
    }
  },

  getInvoices: async (params?: GetInvoicesParams, signal?: AbortSignal): Promise<InvoiceListResponse> => {
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
      const queryString = `?${query.toString()}`;
      const res = await httpClient.get<Record<string, unknown>[]>(
        `${BILLING_BASE}/billing/invoices${queryString}`,
        { signal }
      );

      const rawList = res.payload || (Array.isArray(res) ? res : []);
      const invoices =
        Array.isArray(rawList) && rawList.length > 0
          ? rawList.map((item) => normalizeInvoice(item as Record<string, unknown>))
          : [];

      const addInfo = res.additional_info as
        { total?: number; page?: number; size?: number } | undefined;
      const total = typeof addInfo?.total === "number" ? addInfo.total : invoices.length;
      const resPage = typeof addInfo?.page === "number" ? addInfo.page : page;
      const resSize = typeof addInfo?.size === "number" ? addInfo.size : pageSize;

      return {
        invoices,
        total,
        page: resPage,
        pageSize: resSize,
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return {
        invoices: [],
        total: 0,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10,
      };
    }
  },

  createTopUp: async (
    payload: CreateTopUpInput
  ): Promise<{ invoiceUrl?: string; invoice: Invoice }> => {
    const idempotencyKey =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? `topup_${crypto.randomUUID()}`
        : `topup_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const res = await httpClient.post<Record<string, unknown>>(
      `${BILLING_BASE}/billing/topup`,
      {
        amount: payload.amount,
        method: payload.paymentMethod || "QRIS",
      },
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      }
    );

    const data = res.payload || {};
    const rawUrl =
      data.checkout_url ||
      data.checkoutUrl ||
      data.redirect_url ||
      data.redirectUrl ||
      data.payment_url ||
      data.paymentUrl ||
      data.invoice_url ||
      data.invoiceUrl ||
      data.gateway_url ||
      data.gatewayUrl ||
      data.qris_url ||
      data.qrisUrl ||
      data.pay_url ||
      data.payUrl ||
      data.url;

    const invoiceUrl = rawUrl ? String(rawUrl) : undefined;
    const rawInvoice = (
      data.invoice && typeof data.invoice === "object" ? data.invoice : data
    ) as Record<string, unknown>;

    const invoice = normalizeInvoice({
      ...rawInvoice,
      amount: rawInvoice.amount ?? rawInvoice.total_price ?? payload.amount,
      status: rawInvoice.status || "PENDING",
      paymentMethod: payload.paymentMethod || "QRIS",
      checkout_url: invoiceUrl,
      paymentUrl: invoiceUrl,
      invoiceUrl,
    });

    return {
      invoiceUrl,
      invoice,
    };
  },
};
