export type BillingStatus =
  "PENDING" | "PROCESSING" | "PAID" | "EXPIRED" | "CANCELLED";

export interface AdminBillingUser {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

export interface AdminBillingItem {
  id: string;
  userId: string;
  amount: number;
  method: string;
  status: BillingStatus;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
  user?: AdminBillingUser;
}

export interface GetAdminBillingsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  userId?: string;
}

export interface AdminBillingListResponse {
  billings: AdminBillingItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UpdateBillingStatusInput {
  status: "EXPIRED" | "CANCELLED";
  amount?: number;
  method?: string;
}
