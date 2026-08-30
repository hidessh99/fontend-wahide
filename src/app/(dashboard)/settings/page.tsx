import type { Metadata } from "next";
import { SettingsView } from "@/components/dashboard/SettingsView";

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
  return <SettingsView />;
}
