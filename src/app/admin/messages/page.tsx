import type { Metadata } from "next";
import { AdminMessagesView } from "@/components/admin/AdminMessagesView";

export const metadata: Metadata = {
  title: "Log Pesan WhatsApp Seluruh Pengguna",
  description: "Audit dan pemantauan riwayat pesan WhatsApp masuk dan keluar seluruh member & seller platform.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMessagesPage() {
  return <AdminMessagesView />;
}
