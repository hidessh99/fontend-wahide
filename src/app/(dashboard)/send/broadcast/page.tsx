import type { Metadata } from "next";
import { CampaignSellerBroadcastView } from "@/modules/campaign/views/seller/CampaignSellerBroadcastView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Kampanye Broadcast & Spintax | Wahide",
  description:
    "Kirim pesan broadcast WhatsApp massal dengan simulasi human typing, Spintax dinamis, dan perlindungan anti-ban multi-perangkat.",
  alternates: {
    canonical: "/send/broadcast",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SendBroadcastPage() {
  return (
    <SellerRouteGuard>
      <CampaignSellerBroadcastView />
    </SellerRouteGuard>
  );
}
