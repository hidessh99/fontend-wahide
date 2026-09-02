import type { Metadata } from "next";
import { AdminBillingView } from "@/components/admin/AdminBillingView";

export const metadata: Metadata = {
  title: "Kelola Billing & Topup Platform",
  description: "Manajemen transaksi billing, deposit saldo, dan riwayat pembayaran pengguna.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminBillingPage() {
  return <AdminBillingView />;
}
