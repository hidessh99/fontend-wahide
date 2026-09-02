"use client";

import React from "react";
import { BillingManagementTable } from "@/modules/admin/components/billing/BillingManagementTable";
import { Receipt } from "lucide-react";

export function AdminBillingView() {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-8 sm:size-9 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-wise-green flex items-center justify-center shrink-0">
              <Receipt className="size-4 sm:size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              Manajemen Billing &amp; Topup
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary max-w-2xl">
            Kelola transaksi deposit saldo, monitor invoice tagihan, dan rekonsiliasi status pembayaran platform.
          </p>
        </div>
      </div>

      {/* Billing Data Table */}
      <BillingManagementTable />
    </div>
  );
}
