import type { Metadata } from "next";
import { FinanceAdminBillingView } from "@/modules/finance/views/admin/FinanceAdminBillingView";

export const metadata: Metadata = {
  title: "Kelola Billing & Topup Platform",
  description:
    "Manajemen transaksi billing, deposit saldo, dan riwayat pembayaran pengguna.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminBillingPage() {
  return <FinanceAdminBillingView />;
}
