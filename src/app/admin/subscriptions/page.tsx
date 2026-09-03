import type { Metadata } from "next";
import { AdminSubscriptionsView } from "@/modules/admin/views";

export const metadata: Metadata = {
  title: "Manajemen Langganan Pengguna Platform",
  description:
    "Audit paket langganan aktif, alokasi kuota pesan bulanan, dan kelola status kedaluwarsa pengguna.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSubscriptionsPage() {
  return <AdminSubscriptionsView />;
}
