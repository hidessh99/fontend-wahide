import type { Metadata } from "next";
import { SubscriptionAdminPlansView } from "@/modules/subscription/views/admin/SubscriptionAdminPlansView";

export const metadata: Metadata = {
  title: "Kelola Paket Langganan Platform",
  description:
    "Manajemen tier paket langganan dan batasan kuota pesan WhatsApp.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPlansPage() {
  return <SubscriptionAdminPlansView />;
}
