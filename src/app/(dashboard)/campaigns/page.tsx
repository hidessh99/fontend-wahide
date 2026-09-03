import type { Metadata } from "next";
import { CampaignsView } from "@/modules/campaign/views/CampaignsView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Kampanye Broadcast & Spintax",
  description:
    "Kirim pesan broadcast WhatsApp massal dengan simulasi human typing, Spintax dinamis, dan perlindungan anti-ban multi-perangkat.",
  alternates: {
    canonical: "/campaigns",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CampaignsPage() {
  return (
    <SellerRouteGuard>
      <CampaignsView />
    </SellerRouteGuard>
  );
}
