import type { Metadata } from "next";
import { TelegramBotsView } from "@/modules/telegram/views/seller/TelegramBotsView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Telegram Bot Engine & Webhook | Wahide",
  description:
    "Kelola bot resmi Telegram, verifikasi token BotFather, dan pantau sinkronisasi webhook otomatis.",
  alternates: {
    canonical: "/tele/devices",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TelegramDevicesPage() {
  return (
    <SellerRouteGuard>
      <TelegramBotsView />
    </SellerRouteGuard>
  );
}
