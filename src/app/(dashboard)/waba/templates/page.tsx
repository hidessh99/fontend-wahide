import type { Metadata } from "next";
import { WABATemplatesView } from "@/modules/whatsapp/views/seller/WABATemplatesView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Template Resmi Meta WABA (HSM) | Wahide",
  description:
    "Kelola dan ajukan template pesan WhatsApp resmi ke Meta Graph API untuk kurasi review dan siaran resmi.",
  alternates: {
    canonical: "/waba/templates",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function WABATemplatesPage() {
  return (
    <SellerRouteGuard>
      <WABATemplatesView />
    </SellerRouteGuard>
  );
}
