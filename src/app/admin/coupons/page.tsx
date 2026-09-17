import type { Metadata } from "next";
import { FinanceAdminCouponsView } from "@/modules/finance/views/admin/FinanceAdminCouponsView";

export const metadata: Metadata = {
  title: "Kelola Kupon Promo & Voucher Diskon",
  description:
    "Manajemen kode kupon diskon dan voucher promosi untuk pembelian paket langganan SaaS.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminCouponsPage() {
  return <FinanceAdminCouponsView />;
}
