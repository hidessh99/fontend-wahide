import type { Metadata } from "next";
import { WABASellerAccountsView } from "@/modules/whatsapp/views/seller/WABASellerAccountsView";

export const metadata: Metadata = {
  title: "WhatsApp Official (Meta WABA) | Wahide",
  description:
    "Kelola nomor resmi WhatsApp Business Platform resmi Meta. Bebas risiko blokir hardware, template pesan terverifikasi, dan kuota broadcast enterprise.",
  alternates: {
    canonical: "/waba/devices",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function WABADevicesPage() {
  return <WABASellerAccountsView />;
}
