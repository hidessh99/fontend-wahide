import type { Metadata } from "next";
import { AdminDevicesView } from "@/modules/admin/views";

export const metadata: Metadata = {
  title: "Manajemen Perangkat WhatsApp Seluruh Pengguna",
  description: "Audit, pantau, dan kelola seluruh slot instance nomor WhatsApp pengguna dan seller di platform.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDevicesPage() {
  return <AdminDevicesView />;
}
