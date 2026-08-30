"use client";

import React, { useState } from "react";
import { useBilling } from "@/services/finance/hooks/useBilling";
import { BalanceCard } from "@/services/finance/components/BalanceCard";
import { InvoiceTable } from "@/services/finance/components/InvoiceTable";
import { TopUpModal } from "@/services/finance/components/TopUpModal";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";

export function BillingView() {
  const { t } = useI18n();
  const { balance, invoices, createTopUp, downloadInvoice } = useBilling();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
              <Receipt className="size-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {t("billing.title")}
            </h1>
          </div>
          <p className="text-sm font-semibold text-foreground-secondary max-w-2xl">
            {t("billing.subtitle")}
          </p>
        </div>
      </div>

      {/* Balance Card */}
      <BalanceCard
        balance={balance}
        onOpenTopUp={() => setIsTopUpOpen(true)}
      />

      {/* Seller Affiliate Commission Card (GET /api/v1/income-pending) */}
      <div className="p-5 rounded-md border border-border bg-surface dark:bg-[#161715] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
            Komisi Afiliasi / Seller Pending
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-foreground">
              Rp 1.450.000
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              (3 Transaksi Referral Terverifikasi)
            </span>
          </div>
          <p className="text-[11px] font-semibold text-foreground-secondary">
            Komisi referral otomatis dicairkan ke saldo deposit setiap tanggal 1.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => alert("Komisi akan ditransfer otomatis pada siklus pembayaran berikutnya.")}
          className="rounded-full text-xs font-bold border-border self-start sm:self-auto"
        >
          Rincian Komisi
        </Button>
      </div>

      {/* Invoice Table */}
      <InvoiceTable
        invoices={invoices}
        onDownload={downloadInvoice}
      />

      {/* Top Up Modal */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSubmit={createTopUp}
      />
    </div>
  );
}
