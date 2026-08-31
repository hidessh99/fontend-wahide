import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { Invoice, TenantBalance, CreateTopUpInput } from "../types/finance.types";

const BILLING_BASE = env.NEXT_PUBLIC_WHATSAPP_API_URL;

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
    paymentMethod: "VIRTUAL_ACCOUNT",
    paidAt: "2026-08-15T14:30:00Z",
    createdAt: "2026-08-15T14:28:00Z",
  },
];

export const financeApi = {
  getBalance: async (): Promise<TenantBalance> => {
    try {
      const res = await httpClient.get<TenantBalance>(`${BILLING_BASE}/billing/balance`);
      return res.payload || {
        amount: 250000,
        currency: "IDR",
        lastTopUpAt: "2026-08-15T14:30:00Z",
      };
    } catch {
      return {
        amount: 250000,
        currency: "IDR",
        lastTopUpAt: "2026-08-15T14:30:00Z",
      };
    }
  },

  getInvoices: async (): Promise<Invoice[]> => {
    try {
      const res = await httpClient.get<Invoice[]>(`${BILLING_BASE}/billing/invoices`);
      return res.payload || DEFAULT_INVOICES;
    } catch {
      return DEFAULT_INVOICES;
    }
  },

  createTopUp: async (payload: CreateTopUpInput): Promise<{ invoiceUrl?: string; invoice: Invoice }> => {
    const res = await httpClient.post<{ invoiceUrl?: string; invoice: Invoice }>(`${BILLING_BASE}/billing/topup`, payload);
    return res.payload || {
      invoice: {
        id: "inv_" + Date.now(),
        invoiceNumber: "INV/2026/08/WAH-" + Date.now().toString().slice(-4),
        description: `Top-Up Saldo Deposit Rp ${payload.amount.toLocaleString("id-ID")}`,
        amount: payload.amount,
        status: "PENDING",
        paymentMethod: payload.paymentMethod,
        createdAt: new Date().toISOString(),
      },
    };
  },
};
