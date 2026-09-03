import type { Metadata } from "next";
import { DevicesView } from "@/modules/whatsapp/views/DevicesView";

export const metadata: Metadata = {
  title: "Perangkat WhatsApp & Pairing QR",
  description:
    "Kelola slot multi-device WhatsApp, streaming QR pairing live SSE, dan pantau status koneksi real-time bisnis Anda.",
  alternates: {
    canonical: "/devices",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DevicesPage() {
  return <DevicesView />;
}
