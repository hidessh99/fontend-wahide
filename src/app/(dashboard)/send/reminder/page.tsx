import type { Metadata } from "next";
import { ReminderSellerAutomationsView } from "@/modules/reminder/views/seller/ReminderSellerAutomationsView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Pengingat Otomatis | Wahide",
  description:
    "Jadwalkan pesan berkala, pengingat janji temu, dan aturan drip follow-up multi-kanal otomatis dengan sistem anti-duplikasi.",
  alternates: {
    canonical: "/send/reminder",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SendReminderPage() {
  return (
    <SellerRouteGuard>
      <ReminderSellerAutomationsView />
    </SellerRouteGuard>
  );
}
