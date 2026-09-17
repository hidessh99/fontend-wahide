export type DiscountType = "PERCENTAGE" | "FIXED";

export type ApplicableProduct = "ALL" | "SUBSCRIPTION" | "DEVICE";

export interface Voucher {
  id: string;
  userId: string;
  code: string;
  name: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount: number;
  minPurchaseAmount: number;
  currentUsage: number;
  maxUsage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableProduct: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVoucherInput {
  code: string;
  name: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minPurchaseAmount?: number;
  maxUsage?: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  applicableProduct?: string;
}

export interface UpdateVoucherInput extends Partial<CreateVoucherInput> {
  id?: string;
}

export interface ValidateVoucherInput {
  code: string;
  purchase_amount: number;
  applicable_product: string;
}

export interface ValidateVoucherResult {
  voucher: Voucher;
  discount_amount: number;
}

export interface GetAdminVouchersParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface AdminVoucherListResponse {
  data: Voucher[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
