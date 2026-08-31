import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";

export const metadata: Metadata = {
  title: "Platform WhatsApp Multi-Device SaaS & Gateway Skala Industri",
  description:
    "Solusi Enterprise WhatsApp Multi-Device Gateway untuk bisnis dengan teknologi Session Hibernation hemat RAM 95%, 5 Lapis Anti-Ban, Spintax Engine acak kata, dan integrasi Go Microservices.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Wahide - Enterprise WhatsApp Multi-Tenant Gateway",
    description:
      "Scale hingga 10.000+ perangkat WhatsApp aktif dengan 5 Lapis Anti-Ban dan Session Hibernation berkinerja tinggi.",
    url: "/",
    siteName: "Wahide",
    locale: "id_ID",
    type: "website",
  },
};

export default function HomePage() {
  return <HomeView />;
}
