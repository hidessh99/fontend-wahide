export type InvoiceStatus = "PAID" | "PENDING" | "EXPIRED";

export type PaymentMethod = "QRIS" | "VIRTUAL_ACCOUNT" | "CREDIT_CARD";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  paymentUrl?: string;
  invoiceUrl?: string;
  paidAt?: string;
  createdAt: string;
}

export interface TenantBalance {
  amount: number;
  currency: string;
  lastTopUpAt?: string;
}

export interface CreateTopUpInput {
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface GetInvoicesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  pageSize: number;
}
