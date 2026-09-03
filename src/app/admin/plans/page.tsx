import type { Metadata } from "next";
import { AdminPlansView } from "@/modules/admin/views";

export const metadata: Metadata = {
  title: "Kelola Paket Langganan Platform",
  description: "Manajemen tier paket langganan dan batasan kuota pesan WhatsApp.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPlansPage() {
  return <AdminPlansView />;
}
