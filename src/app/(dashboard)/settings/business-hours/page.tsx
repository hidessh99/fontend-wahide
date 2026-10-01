import type { Metadata } from "next";
import { BusinessHoursCard } from "@/modules/inbox/components/BusinessHoursCard";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Jam Kerja & Out of Office | Wahide CRM",
  description:
    "Konfigurasi jadwal operasional bisnis, zona waktu, dan pesan otomatis di luar jam kerja.",
  alternates: {
    canonical: "/settings/business-hours",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function BusinessHoursPage() {
  return (
    <SellerRouteGuard>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Jam Kerja & Pesan Otomatis (OOO)
          </h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Atur jadwal operasional tenant dan pesan balas otomatis ketika pelanggan mengirim pesan di luar jam kerja.
          </p>
        </div>
        <BusinessHoursCard />
      </div>
    </SellerRouteGuard>
  );
}
