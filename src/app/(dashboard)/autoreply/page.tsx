import type { Metadata } from "next";
import { AutoreplyRulesView } from "@/modules/autoreply/views/AutoreplyRulesView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Aturan Balas Otomatis (Autoreply Rules) | Wahide",
  description:
    "Kelola aturan balas otomatis pesan masuk WhatsApp, Telegram, dan WABA dengan algoritma multi-pattern Aho-Corasick.",
  alternates: {
    canonical: "/autoreply",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AutoreplyPage() {
  return (
    <SellerRouteGuard>
      <AutoreplyRulesView />
    </SellerRouteGuard>
  );
}
