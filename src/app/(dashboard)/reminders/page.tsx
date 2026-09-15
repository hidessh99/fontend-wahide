import type { Metadata } from "next";
import { ReminderSellerAutomationsView } from "@/modules/reminder/views/seller/ReminderSellerAutomationsView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Pengingat Otomatis WhatsApp",
  description:
    "Jadwalkan pesan berkala, pengingat janji temu, dan aturan drip follow-up WhatsApp otomatis dengan sistem anti-duplikasi.",
  alternates: {
    canonical: "/reminders",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RemindersPage() {
  return (
    <SellerRouteGuard>
      <ReminderSellerAutomationsView />
    </SellerRouteGuard>
  );
}
