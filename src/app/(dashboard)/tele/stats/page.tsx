import type { Metadata } from "next";
import { TelegramStatsView } from "@/modules/telegram/views/TelegramStatsView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Statistik Telegram Bot | Wahide",
  description:
    "Pantau performa transmisi bot Telegram, pemakaian kuota harian, dan kesehatan token-bucket rate limiter.",
  alternates: {
    canonical: "/tele/stats",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TelegramStatsPage() {
  return (
    <SellerRouteGuard>
      <TelegramStatsView />
    </SellerRouteGuard>
  );
}
