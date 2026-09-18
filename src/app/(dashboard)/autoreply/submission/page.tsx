import type { Metadata } from "next";
import { SubmissionsView } from "@/modules/autoreply/views/SubmissionsView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Hasil Formulir & Prospek (Leads) | Wahide",
  description:
    "Pantau hasil leads dan jawaban formulir pelanggan yang berhasil dikumpulkan oleh bot secara real-time.",
  alternates: {
    canonical: "/autoreply/submission",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubmissionsPage() {
  return (
    <SellerRouteGuard>
      <SubmissionsView />
    </SellerRouteGuard>
  );
}
