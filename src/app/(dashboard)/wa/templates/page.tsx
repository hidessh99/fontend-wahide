import type { Metadata } from "next";
import { WhatsAppTemplatesView } from "@/modules/whatsapp/views/seller/WhatsAppTemplatesView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Template Pesan WhatsApp Web (Unofficial) | Wahide",
  description:
    "Kelola pustaka template pesan WhatsApp dengan variabel dinamis dan spintax anti-ban.",
  alternates: {
    canonical: "/wa/templates",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function WhatsAppTemplatesPage() {
  return (
    <SellerRouteGuard>
      <WhatsAppTemplatesView />
    </SellerRouteGuard>
  );
}
