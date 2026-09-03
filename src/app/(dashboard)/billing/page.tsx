import React, { Suspense } from "react";
import type { Metadata } from "next";
import { BillingView } from "@/modules/finance/views/BillingView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";

export const metadata: Metadata = {
  title: "Faktur & Tagihan Pembayaran",
  description:
    "Kelola saldo deposit broadcast, riwayat faktur pembayaran langganan, dan unduh bukti transaksi resmi bisnis Anda.",
  alternates: {
    canonical: "/billing",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function BillingPage() {
  return (
    <SellerRouteGuard>
      <Suspense fallback={<div className="h-96 flex items-center justify-center animate-pulse" />}>
        <BillingView />
      </Suspense>
    </SellerRouteGuard>
  );
}
