import type { Metadata } from "next";
import { BillingView } from "@/components/dashboard/BillingView";

export const metadata: Metadata = {
  title: "Faktur & Tagihan Pembayaran",
  description:
    "Kelola saldo deposit broadcast, riwayat faktur pembayaran langganan, dan unduh bukti transaksi resmi bisnis Anda.",
  alternates: {
    canonical: "/billing",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function BillingPage() {
  return <BillingView />;
}
