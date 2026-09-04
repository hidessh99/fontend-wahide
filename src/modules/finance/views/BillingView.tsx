"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useBilling } from "@/modules/finance/hooks/useBilling";
import { addressApi } from "@/modules/iam/api/address.api";
import { BalanceCard } from "@/modules/finance/components/balance/BalanceCard";
import { InvoiceTable } from "@/modules/finance/components/invoices/InvoiceTable";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";
import { Invoice } from "@/modules/finance/types/finance.types";
import { Receipt, RefreshCw } from "lucide-react";

const TopUpModal = dynamic(
  () => import("@/modules/finance/components/balance/TopUpModal").then((m) => m.TopUpModal),
  { ssr: false }
);

const InvoiceReceiptModal = dynamic(
  () =>
    import("@/modules/finance/components/invoices/InvoiceReceiptModal").then(
      (m) => m.InvoiceReceiptModal
    ),
  { ssr: false }
);

export function BillingView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const {
    balance,
    filteredInvoices,
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
    isLoading,
    fetchBillingData,
    createTopUp,
  } = useBilling();

  const [searchInput, setSearchInput] = useState("");
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Invoice | null>(null);

  // Check and open TopUp if URL param action=topup is passed
  useEffect(() => {
    if (searchParams.get("action") === "topup") {
      addressApi.getUserAddress().then((addr) => {
        if (addr && addr.address?.trim()) {
          setIsTopUpOpen(true);
        }
      });
    }
  }, [searchParams]);

  // Just-in-Time Address Check when clicking Top-Up
  const handleOpenTopUp = async () => {
    try {
      const userAddress = await addressApi.getUserAddress();
      if (!userAddress || !userAddress.address?.trim() || !userAddress.city?.trim()) {
        toast.info(
          t("billing.addressRequiredForTopUp") ||
            "Silakan lengkapi alamat bisnis Anda terlebih dahulu untuk melanjutkan Top-Up saldo."
        );
        router.push("/settings/address?from=billing&action=topup");
        return;
      }
      setIsTopUpOpen(true);
    } catch {
      // Fallback: If address check fails, allow opening modal
      setIsTopUpOpen(true);
    }
  };

  const statusOptions = [
    { value: "ALL", label: "Semua" },
    { value: "PAID", label: "Lunas" },
    { value: "PENDING", label: "Menunggu" },
    { value: "EXPIRED", label: "Kadaluarsa" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full sm:size-9">
              <Receipt className="size-4 sm:size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              {t("billing.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("billing.subtitle")}
          </p>
        </div>
      </div>

      {/* Balance Card with Error Boundary & JIT Address Guard */}
      <ErrorBoundary fallbackTitle="Gagal Memuat Saldo Deposit">
        <BalanceCard balance={balance} onOpenTopUp={handleOpenTopUp} />
      </ErrorBoundary>

      {/* Invoice Section Header */}
      <div className="flex flex-col justify-between gap-2 pt-2 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <Receipt className="size-3.5" />
            </div>
            <h2 className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {t("billing.invoicesTitle")}
            </h2>
            <span className="bg-muted border-border text-foreground-muted rounded-full border px-2.5 py-0.5 text-[11px] font-bold">
              {total} {t("billing.invoicesCountLabel")}
            </span>
          </div>
          <p className="text-foreground-secondary text-xs font-semibold">
            {t("billing.invoicesSubtitle")}
          </p>
        </div>
      </div>

      {/* Filter Toolbar (Search Submit & Horizontal Scrollable Status Filters) */}
      <div className="border-border bg-surface space-y-3 rounded-xl border p-3.5 shadow-xs sm:space-y-4 sm:p-4">
        {/* Top Row: Search Form + Refresh Button */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="w-full flex-1 sm:max-w-lg">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              onSearch={(val) => executeSearch(val.trim())}
              onClear={() => {
                setSearchInput("");
                clearSearch();
              }}
              placeholder="Cari nomor faktur atau deskripsi..."
              buttonText="Cari"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchBillingData}
            disabled={isLoading}
            className="border-border hover:border-foreground-muted h-10 shrink-0 cursor-pointer gap-1.5 self-start rounded-full px-3.5 text-xs font-bold transition sm:self-auto"
            aria-label="Refresh Riwayat Faktur"
            title="Refresh Riwayat Faktur"
          >
            <RefreshCw
              className={`size-3.5 ${isLoading ? "dark:text-wise-green animate-spin text-emerald-700" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* Status Filter Chips (Horizontal Scrollable) */}
        <div className="no-scrollbar border-border/50 flex items-center gap-1.5 overflow-x-auto scroll-smooth border-t pt-2">
          {statusOptions.map((opt) => {
            const isActive = statusFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap transition ${
                  isActive
                    ? "bg-dark-green dark:bg-wise-green font-extrabold text-white shadow-xs dark:text-black"
                    : "bg-muted/70 hover:bg-muted text-foreground-secondary hover:text-foreground border-border/60 border font-semibold"
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
