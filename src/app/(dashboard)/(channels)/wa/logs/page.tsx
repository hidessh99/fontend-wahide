import type { Metadata } from "next";
import { WhatsAppLogsView } from "@/modules/whatsapp/views/seller/WhatsAppLogsView";

export const metadata: Metadata = {
  title: "Log Pesan WhatsApp Web Multi-Device | Wahide",
  description:
    "Pantau riwayat transmisi pesan WhatsApp Web Multi-Device, status ACK tanda centang, dan laporan kegagalan pengiriman.",
  alternates: {
    canonical: "/wa/logs",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function WhatsAppLogsPage() {
  return <WhatsAppLogsView />;
}
