import type { Metadata } from "next";
import { AdminNotificationsView } from "@/modules/admin/views";

export const metadata: Metadata = {
  title: "Siaran Massal & Antrean Notifikasi",
  description: "Kirim siaran pengumuman massal dan monitoring antrean Redis worker.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminNotificationsPage() {
  return <AdminNotificationsView />;
}
