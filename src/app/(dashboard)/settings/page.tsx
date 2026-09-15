import { Suspense } from "react";
import type { Metadata } from "next";
import { IamSellerSettingsView } from "@/modules/iam/views/seller/IamSellerSettingsView";
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
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl animate-pulse space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="h-8 w-48 rounded bg-muted" />
            <div className="h-4 w-96 rounded bg-muted/60" />
            <div className="h-px w-full bg-border" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="h-48 rounded-lg bg-muted/40" />
              <div className="h-96 rounded-lg bg-muted/40 lg:col-span-3" />
            </div>
          </div>
        }
      >
        <IamSellerSettingsView />
      </Suspense>
    </SellerRouteGuard>
  );
}
