import type { Metadata } from "next";
import { CampaignSellerBroadcastView } from "@/modules/campaign/views/seller/CampaignSellerBroadcastView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Broadcast Siaran (Mass Campaigns) | Wahide",
  description:
    "Kelola dan pantau pengiriman pesan massal multi-kanal via WhatsApp Web, Meta WABA Official, dan Telegram Bot.",
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
