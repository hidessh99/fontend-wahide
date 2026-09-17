import type { Metadata } from "next";
import { TemplateSellerLibraryView } from "@/modules/template/views/seller/TemplateSellerLibraryView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Pustaka Template Pesan (Omnichannel) | Wahide",
  description:
    "Kelola seluruh template pesan WhatsApp Web, Meta WABA resmi, dan Telegram Bot dalam satu pusat kendali terpadu.",
  alternates: {
    canonical: "/templates",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TemplatesPage() {
  return (
    <SellerRouteGuard>
      <TemplateSellerLibraryView
        initialChannel="ALL"
        title="Pustaka Template Pesan (Omnichannel)"
        description="Kelola seluruh template pesan WhatsApp Web, Meta WABA resmi, dan Telegram Bot dalam satu pusat kendali terpadu."
      />
    </SellerRouteGuard>
  );
}
