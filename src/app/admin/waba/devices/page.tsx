import type { Metadata } from "next";
import { WABAAdminAccountsView } from "@/modules/whatsapp/views/admin/WABAAdminAccountsView";

export const metadata: Metadata = {
  title: "Manajemen Akun WABA Seluruh Pengguna | Wahide Admin",
  description:
    "Audit, pantau, dan kelola seluruh akun WhatsApp Business Platform (WABA) resmi Meta di platform.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminWABADevicesPage() {
  return <WABAAdminAccountsView />;
}
