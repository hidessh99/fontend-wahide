"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useBilling } from "@/services/finance/hooks/useBilling";
import { BalanceCard } from "@/services/finance/components/BalanceCard";
import { InvoiceTable } from "@/services/finance/components/InvoiceTable";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";
import { Invoice } from "@/services/finance/types/finance.types";
import { Receipt, Search, X } from "lucide-react";

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
  const {
    balance,
    filteredInvoices,
    activeSearch,
    statusFilter,
    page,
    pageSize,
    total,
    totalPages,
    executeSearch,
    clearSearch,
    setStatusFilter,
    nextPage,
    prevPage,
    createTopUp,
  } = useBilling();

  const [searchInput, setSearchInput] = useState("");
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Invoice | null>(null);

  const statusOptions = [
    { value: "ALL", label: "Semua" },
    { value: "PAID", label: "Lunas" },
    { value: "PENDING", label: "Menunggu" },
    { value: "EXPIRED", label: "Kadaluarsa" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-8 sm:size-9 rounded-full bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center shrink-0">
              <Receipt className="size-4 sm:size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {t("billing.title")}
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary max-w-2xl">
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

      {/* Filter Toolbar (Search Submit & Horizontal Scrollable Status Filters) */}
      <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        {/* Search Form with Submit Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeSearch(searchInput);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari nomor faktur atau deskripsi..."
              className="w-full h-10 pl-10 pr-9 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
            />
            {(searchInput || activeSearch) && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  clearSearch();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
                title="Hapus Pencarian"
                aria-label="Hapus Pencarian"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            className="h-10 px-4 text-xs font-bold shadow-xs shrink-0 cursor-pointer"
          >
            <Search className="size-3.5 mr-1" />
            <span>Cari</span>
          </Button>
        </form>

        {/* Status Filter Chips (Horizontal Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          {statusOptions.map((opt) => {
            const isActive = statusFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-dark-green dark:bg-wise-green text-white dark:text-black font-extrabold shadow-xs"
                    : "bg-muted/70 hover:bg-muted text-foreground-secondary hover:text-foreground font-semibold border border-border/60"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Invoice Table with Error Boundary */}
      <ErrorBoundary fallbackTitle="Gagal Memuat Riwayat Faktur">
        <InvoiceTable
          invoices={filteredInvoices}
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onPrevPage={prevPage}
          onNextPage={nextPage}
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
