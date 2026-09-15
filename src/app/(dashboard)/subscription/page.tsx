import type { Metadata } from "next";
import { SubscriptionSellerPlansView } from "@/modules/subscription/views/seller/SubscriptionSellerPlansView";
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
      <SubscriptionSellerPlansView />
    </SellerRouteGuard>
  );
}
