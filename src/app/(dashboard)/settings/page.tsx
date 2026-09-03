import type { Metadata } from "next";
import { SettingsView } from "@/modules/iam/views/SettingsView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Pengaturan Profil & API Key",
  description:
    "Kelola profil bisnis akun, kata sandi keamanan, dan otentikasi token API Key Fast-Path Wahide Gateway.",
  alternates: {
    canonical: "/settings",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsPage() {
  return (
    <SellerRouteGuard>
      <SettingsView />
    </SellerRouteGuard>
  );
}
