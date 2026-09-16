import type { Metadata } from "next";
import { TelegramTemplatesView } from "@/modules/telegram/views/TelegramTemplatesView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Template Pesan Telegram | Wahide",
  description:
    "Format pesan bot kaya fitur dengan dukungan HTML / MarkdownV2 dan tombol interaktif inline keyboard.",
  alternates: {
    canonical: "/tele/templates",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TelegramTemplatesPage() {
  return (
    <SellerRouteGuard>
      <TelegramTemplatesView />
    </SellerRouteGuard>
  );
}
