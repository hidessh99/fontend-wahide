import type { Metadata } from "next";
import { BlogListView } from "@/components/public/BlogListView";

export const metadata: Metadata = {
  title: "Blog & Panduan Rekayasa WhatsApp Gateway",
  description:
    "Panduan arsitektur WhatsApp Multi-Device, integrasi Webhook HMAC, dan strategi anti-ban Spintax Engine.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog & Panduan Rekayasa WhatsApp Gateway",
    description:
      "Panduan arsitektur WhatsApp Multi-Device, integrasi Webhook HMAC, dan strategi anti-ban Spintax Engine.",
    url: "/blog",
    siteName: "Wahide",
    locale: "id_ID",
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogListView />;
}
