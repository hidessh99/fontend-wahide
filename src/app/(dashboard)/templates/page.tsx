import type { Metadata } from "next";
import { TemplateSellerLibraryView } from "@/modules/template/views/seller/TemplateSellerLibraryView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Template Pesan WhatsApp",
  description:
    "Kelola koleksi template pesan WhatsApp dengan variabel dinamis, format tombol interaktif, dan pratinjau live.",
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
      <TemplateSellerLibraryView />
    </SellerRouteGuard>
  );
}
