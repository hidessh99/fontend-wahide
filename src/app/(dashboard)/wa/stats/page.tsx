import type { Metadata } from "next";
import { WhatsAppStatsView } from "@/modules/whatsapp/views/seller/WhatsAppStatsView";

export const metadata: Metadata = {
  title: "Statistik WhatsApp Web (Unofficial) | Wahide",
  description:
    "Pantau kesehatan slot fisik HP, rasio keberhasilan pengiriman socket whatsmeow, dan skor proteksi anti-ban.",
  alternates: {
    canonical: "/wa/stats",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function WhatsAppStatsPage() {
  return <WhatsAppStatsView />;
}
