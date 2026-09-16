import type { Metadata } from "next";
import { TelegramLogsView } from "@/modules/telegram/views/seller/TelegramLogsView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Log Pesan Telegram Bot | Wahide",
  description:
    "Audit riwayat pesan masuk dan keluar bot Telegram dengan status pengiriman real-time.",
  alternates: {
    canonical: "/tele/logs",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TelegramLogsPage() {
  return (
    <SellerRouteGuard>
      <TelegramLogsView />
    </SellerRouteGuard>
  );
}
