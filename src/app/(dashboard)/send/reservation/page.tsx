import type { Metadata } from "next";
import { ReservationSellerCalendarView } from "@/modules/reservation/views/seller/ReservationSellerCalendarView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Jadwal Reservasi & Booking | Wahide",
  description:
    "Kelola booking, kalender reservasi, dan integrasi pengingat janji temu multi-kanal otomatis.",
  alternates: {
    canonical: "/send/reservation",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SendReservationPage() {
  return (
    <SellerRouteGuard>
      <ReservationSellerCalendarView />
    </SellerRouteGuard>
  );
}
