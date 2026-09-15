import React, { Suspense } from "react";
import type { Metadata } from "next";
import { FinanceSellerBillingView } from "@/modules/finance/views/seller/FinanceSellerBillingView";
import { SellerRouteGuard } from "@/components/layout/shared/SellerRouteGuard";
import { RoleGuard } from "@/components/layout/shared/RoleGuard";

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
      <RoleGuard requireBilling>
        <Suspense
          fallback={
            <div className="flex h-96 animate-pulse items-center justify-center" />
          }
        >
          <FinanceSellerBillingView />
        </Suspense>
      </RoleGuard>
    </SellerRouteGuard>
  );
}
