import type { Metadata } from "next";
import { SupportAdminTicketsView } from "@/modules/support/views/admin/SupportAdminTicketsView";

export const metadata: Metadata = {
  title: "Pusat Bantuan & Helpdesk Platform",
  description:
    "Helpdesk konsol manajemen tiket dukungan teknis dan layanan bantuan pengguna.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSupportPage() {
  return <SupportAdminTicketsView />;
}
