import type { Metadata } from "next";
import { AdminLogsView } from "@/components/admin/AdminLogsView";

export const metadata: Metadata = {
  title: "Audit & Keamanan Sistem Platform",
  description: "Log audit autentikasi pengguna dan pemantauan aktivitas keamanan server.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLogsPage() {
  return <AdminLogsView />;
}
