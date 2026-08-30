import type { Metadata } from "next";
import { SubscriptionView } from "@/components/dashboard/SubscriptionView";

export const metadata: Metadata = {
  title: "Paket Langganan & Kuota Pesan",
  description:
    "Pantau sisa kuota broadcast pesan WhatsApp, upgrade paket langganan bisnis, dan konfigurasi webhook signature HMAC SHA256.",
  alternates: {
    canonical: "/subscription",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SubscriptionPage() {
  return <SubscriptionView />;
}
