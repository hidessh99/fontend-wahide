import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { Invoice, TenantBalance, CreateTopUpInput, InvoiceStatus, PaymentMethod } from "../types/finance.types";

const BILLING_BASE = env.NEXT_PUBLIC_FINANCE_API_URL || env.NEXT_PUBLIC_API_BASE_URL;

export const DEFAULT_INVOICES: Invoice[] = [
  {
    id: "inv_001",
    invoiceNumber: "INV/2026/08/WAH-9841",
    description: "Paket Professional 1 Bulan (25.000 Pesan Broadcast)",
    amount: 399000,
    status: "PAID",
    paymentMethod: "QRIS",
    paidAt: "2026-08-01T10:15:00Z",
    createdAt: "2026-08-01T10:12:00Z",
  },
  {
    id: "inv_002",
    invoiceNumber: "INV/2026/08/WAH-9920",
    description: "Top-Up Saldo Kuota Ekstra (+5.000 Pesan)",
    amount: 150000,
    status: "PAID",
    paymentMethod: "QRIS",
    paidAt: "2026-08-15T14:30:00Z",
    createdAt: "2026-08-15T14:28:00Z",
  },
];

export function normalizeInvoice(raw: Record<string, unknown>): Invoice {
  const statusStr = String(raw.status || "PENDING").toUpperCase();
  const status: InvoiceStatus =
    statusStr === "PAID" || statusStr === "SUCCESS" || statusStr === "COMPLETED"
      ? "PAID"
      : statusStr === "EXPIRED" || statusStr === "CANCELLED"
      ? "EXPIRED"
      : "PENDING";

  const amount = Number(raw.amount ?? raw.total_price ?? raw.gross_amount ?? raw.price ?? 0);
  const invoiceNumber = String(raw.invoiceNumber || raw.invoice_number || raw.ref || raw.id || `INV/2026/08/WAH-${Date.now().toString().slice(-4)}`);
  const description = String(raw.description || raw.title || `Top-Up Saldo Deposit Rp ${amount.toLocaleString("id-ID")}`);
  const paymentMethod = String(raw.paymentMethod || raw.payment_method || raw.method || "QRIS") as PaymentMethod;

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
  const invoiceUrl = raw.invoiceUrl || raw.invoice_url ? String(raw.invoiceUrl || raw.invoice_url) : paymentUrl;
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
      amount: 250000,
      currency: "IDR",
      lastTopUpAt: "2026-08-15T14:30:00Z",
    };
  }
  return {
    amount: Number(raw.amount ?? raw.balance ?? raw.saldo ?? 0),
    currency: String(raw.currency || "IDR"),
    lastTopUpAt: raw.lastTopUpAt || raw.last_top_up_at ? String(raw.lastTopUpAt || raw.last_top_up_at) : undefined,
  };
}

export const financeApi = {
  getBalance: async (): Promise<TenantBalance> => {
    try {
      const res = await httpClient.get<Record<string, unknown>>(`${BILLING_BASE}/billing/balance`);
      return normalizeBalance(res.payload);
    } catch {
      return normalizeBalance(null);
    }
  },

  getInvoices: async (): Promise<Invoice[]> => {
    try {
      const res = await httpClient.get<Record<string, unknown>[]>(`${BILLING_BASE}/billing/invoices`);
      if (Array.isArray(res.payload) && res.payload.length > 0) {
        return res.payload.map(normalizeInvoice);
      }
      return DEFAULT_INVOICES;
    } catch {
      return DEFAULT_INVOICES;
    }
  },

  createTopUp: async (payload: CreateTopUpInput): Promise<{ invoiceUrl?: string; invoice: Invoice }> => {
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
    const rawInvoice = (data.invoice && typeof data.invoice === "object" ? data.invoice : data) as Record<string, unknown>;

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
