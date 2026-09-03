import type { Metadata } from "next";
import { SubscriptionView } from "@/modules/subscription/views/SubscriptionView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Paket Langganan | Wahide",
  description:
    "Pilih dan tingkatkan paket langganan WhatsApp gateway bisnis yang sesuai dengan kebutuhan volume pesan Anda.",
  alternates: {
    canonical: "/subscription",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubscriptionPage() {
  return (
    <SellerRouteGuard>
      <SubscriptionView />
    </SellerRouteGuard>
  );
}
