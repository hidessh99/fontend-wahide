import type { Metadata } from "next";
import { OverviewSellerDashboardView } from "@/modules/overview/views/seller/OverviewSellerDashboardView";

export const metadata: Metadata = {
  title: "Ringkasan Bisnis & Status Gateway",
  description:
    "Pantau kesehatan koneksi slot WhatsApp multi-device, kuota pesan bulanan, buku kontak, dan status broadcast secara real-time.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardOverviewPage() {
  return <OverviewSellerDashboardView />;
}
