import type { Metadata } from "next";
import { WhatsAppStatsView } from "@/modules/whatsapp/views/seller/WhatsAppStatsView";

export const metadata: Metadata = {
  title: "Statistik WhatsApp Web Multi-Device | Wahide",
  description:
    "Pantau kesehatan slot fisik HP, rasio keberhasilan pengiriman WhatsApp Web Engine, dan skor proteksi anti-ban.",
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
