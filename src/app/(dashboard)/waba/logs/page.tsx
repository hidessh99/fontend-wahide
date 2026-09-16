import type { Metadata } from "next";
import { WABALogsView } from "@/modules/whatsapp/views/seller/WABALogsView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Log Pesan Meta WABA Official | Wahide",
  description:
    "Audit rekam jejak pengiriman pesan Meta Cloud API resmi (WAMID) dan pelacak status percakapan.",
  alternates: {
    canonical: "/waba/logs",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function WABALogsPage() {
  return (
    <SellerRouteGuard>
      <WABALogsView />
    </SellerRouteGuard>
  );
}
