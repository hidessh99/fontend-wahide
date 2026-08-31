"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useBilling } from "@/services/finance/hooks/useBilling";
import { BalanceCard } from "@/services/finance/components/BalanceCard";
import { InvoiceTable } from "@/services/finance/components/InvoiceTable";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";
import { Invoice } from "@/services/finance/types/finance.types";
import { Receipt } from "lucide-react";

const TopUpModal = dynamic(
  () => import("@/services/finance/components/TopUpModal").then((m) => m.TopUpModal),
  { ssr: false }
);

const InvoiceReceiptModal = dynamic(
  () => import("@/services/finance/components/InvoiceReceiptModal").then((m) => m.InvoiceReceiptModal),
  { ssr: false }
);

export function BillingView() {
  const { t } = useI18n();
  const { balance, invoices, createTopUp } = useBilling();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Invoice | null>(null);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center">
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

      {/* Balance Card with Error Boundary */}
      <ErrorBoundary fallbackTitle="Gagal Memuat Saldo Deposit">
        <BalanceCard
          balance={balance}
          onOpenTopUp={() => setIsTopUpOpen(true)}
        />
      </ErrorBoundary>

      {/* Invoice Table with Error Boundary */}
      <ErrorBoundary fallbackTitle="Gagal Memuat Riwayat Faktur">
        <InvoiceTable
          invoices={invoices}
          onViewReceipt={(inv) => setSelectedReceipt(inv)}
          onPay={(inv) => {
            const targetUrl = inv.paymentUrl || inv.invoiceUrl;
            if (targetUrl) {
              window.open(targetUrl, "_blank", "noopener,noreferrer");
            } else {
              toast.info(`Membuka instruksi pembayaran faktur ${inv.invoiceNumber}...`);
            }
          }}
        />
      </ErrorBoundary>

      {/* Top Up Modal */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSubmit={createTopUp}
      />

      {/* Official Invoice Receipt Modal (Print / Save as PDF) */}
      <InvoiceReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        invoice={selectedReceipt}
      />
    </div>
  );
}
