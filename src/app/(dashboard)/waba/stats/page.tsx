import type { Metadata } from "next";
import { WABAStatsView } from "@/modules/whatsapp/views/seller/WABAStatsView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Statistik Meta WABA Official | Wahide",
  description:
    "Pantau batas kuota harian messaging tier, jendela layanan 24 jam, dan skor kesehatan akun resmi Meta.",
  alternates: {
    canonical: "/waba/stats",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function WABAStatsPage() {
  return (
    <SellerRouteGuard>
      <WABAStatsView />
    </SellerRouteGuard>
  );
}
