import type { Metadata } from "next";
import { SupportView } from "@/modules/support/views/SupportView";

export const metadata: Metadata = {
  title: "Tiket Bantuan & Dukungan Teknis",
  description:
    "Pusat bantuan pelanggan Wahide untuk konsultasi integrasi API WhatsApp, kendala broadcast pesan, dan penanganan tiket real-time.",
  alternates: {
    canonical: "/support",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SupportPage() {
  return <SupportView />;
}
