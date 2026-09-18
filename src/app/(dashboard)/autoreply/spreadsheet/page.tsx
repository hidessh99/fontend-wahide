import type { Metadata } from "next";
import { SpreadsheetConfigView } from "@/modules/autoreply/views/SpreadsheetConfigView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Integrasi Google Spreadsheet (Live CSV) | Wahide",
  description:
    "Hubungkan Google Sheets langsung sebagai basis data auto-reply cerdas tanpa input manual satu per satu.",
  alternates: {
    canonical: "/autoreply/spreadsheet",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SpreadsheetPage() {
  return (
    <SellerRouteGuard>
      <SpreadsheetConfigView />
    </SellerRouteGuard>
  );
}
