import type { Metadata } from "next";
import { BlogListView } from "@/components/public/BlogListView";

export const metadata: Metadata = {
  title: "Blog & Panduan Rekayasa WhatsApp Gateway",
  description:
    "Panduan arsitektur WhatsApp Multi-Device, integrasi Webhook HMAC, dan strategi anti-ban Spintax Engine.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return <BlogListView />;
}
