import type { Metadata } from "next";
import { WhatsAppSellerDevicesView } from "@/modules/whatsapp/views/seller/WhatsAppSellerDevicesView";

export const metadata: Metadata = {
  title: "WhatsApp Web (HP) & Pairing QR | Wahide",
  description:
    "Kelola slot multi-device WhatsApp Web, streaming QR pairing live SSE, pairing code 8 karakter, dan pantau koneksi HP bisnis Anda.",
  alternates: {
    canonical: "/wa/devices",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function WhatsAppWebDevicesPage() {
  return <WhatsAppSellerDevicesView />;
}
