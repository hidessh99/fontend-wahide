import type { Metadata } from "next";
import { AdminActivitiesView } from "@/modules/admin/views";

export const metadata: Metadata = {
  title: "Log Aktivitas Pengguna | Wahide Superadmin",
  description: "Daftar rekaman aktivitas, jejak audit, dan autentikasi seluruh pengguna platform.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminActivitiesPage() {
  return <AdminActivitiesView />;
}
